// llm-pool.mjs
//
// Single driver for all LLM calls. Owns key rotation, model fallback,
// cool-down state, error normalization. Consumers call:
//
//   pool.invoke({ purpose, messages, opts })
//
// purpose ∈ { 'classifier', 'synthesis' }
//
// 'classifier'  → pinned model (CLASSIFIER_MODEL), temp 0, JSON mode,
//                 800ms timeout, Groq pool only (no Mistral failover).
//                 Returns: { text, providerKeyId, modelUsed }.
//
// 'synthesis'   → Groq pool with 4-model fallback chain per key, then
//                 Mistral pool with pinned mistral-small. Streams text
//                 through ReadableStream (UTF-8 encoded SSE-compatible
//                 token chunks). First BUFFER_FIRST_CHARS chars buffered
//                 before flushing for invisible mid-stream provider
//                 failover.
//                 Returns: { stream: ReadableStream<Uint8Array>,
//                            getMeta: () => { providerKeyId, modelUsed } }
//
// Cool-down state lives in Upstash key `cooldown:{provider}:{keyId}`
// with TTL = retry-after seconds. On Upstash unreachable, falls back
// to module-memory Map (logs `upstash_cooldown_fallback`).
//
// Per phase-d-decisions-2026-04-27.md Decisions 1, 4, 6, 9, 11.
//
// FLOW
// ┌─────────────┐   purpose=classifier   ┌──────────────────────────────┐
// │ pool.invoke │──────────────────────▶│ Groq[idx0..2] · pinned model │
// │             │                       │ temp 0 · JSON mode · 800ms   │
// │             │  on all 3 cooled  ──▶ │ return null path             │
// │             │                       └──────────────────────────────┘
// │             │   purpose=synthesis    ┌──────────────────────────────┐
// │             │──────────────────────▶│ for k in Groq[idx0..2]:      │
// │             │                       │   for m in [llama,qwen,gpt,L70]:│
// │             │                       │     try → stream             │
// │             │                       │ if all cooled → Mistral pool │
// │             │                       └──────────────────────────────┘
// └─────────────┘

import Groq from 'groq-sdk';
import {
  GROQ_KEY_ENV, MISTRAL_KEY_ENV,
  GROQ_SYNTH_MODELS, MISTRAL_SYNTH_MODEL,
  CLASSIFIER_MODEL, CLASSIFIER_TIMEOUT_MS,
  COOLDOWN_DEFAULT_MS, COOLDOWN_MIN_MS,
  BUFFER_FIRST_CHARS,
} from './constants.mjs';
import { get as redisGet, setEx as redisSetEx } from './upstash-client.mjs';

// ---- Key resolution -------------------------------------------------------

function resolveKeys(envNames) {
  return envNames
    .map((name, idx) => ({ id: idx, env: name, key: process.env[name] }))
    .filter(k => !!k.key);
}

const GROQ_KEYS = resolveKeys(GROQ_KEY_ENV);
const MISTRAL_KEYS = resolveKeys(MISTRAL_KEY_ENV);

// Round-robin cursor seeded by container start time so warm containers
// don't all hammer the same key first.
let groqCursor = Math.floor(Date.now() / 1000) % Math.max(1, GROQ_KEYS.length);
let mistralCursor = Math.floor(Date.now() / 1000) % Math.max(1, MISTRAL_KEYS.length);

function rotated(arr, cursor) {
  if (arr.length === 0) return [];
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(arr[(cursor + i) % arr.length]);
  }
  return out;
}

// ---- Cool-down state ------------------------------------------------------

const memCooldown = new Map(); // provider:keyId -> expiresAt(ms)
let upstashDegraded = false;

function cooldownKey(provider, keyId) {
  return `cooldown:${provider}:${keyId}`;
}

async function isCooled(provider, keyId) {
  const k = cooldownKey(provider, keyId);
  let upstashErr = false;
  const v = await redisGet(k).catch(err => {
    upstashErr = true;
    if (!upstashDegraded) {
      upstashDegraded = true;
      console.warn('[llm-pool] upstash_read_failure — using module memory', { err: err?.message });
    }
    return null;
  });
  // Always fall through to memCooldown if Upstash errored or is already degraded
  if (v == null) {
    const mem = memCooldown.get(k);
    if (mem && mem > Date.now()) return true;
    return false;
  }
  const expiresAt = Number(v);
  if (Number.isFinite(expiresAt) && expiresAt > Date.now()) return true;
  return false;
}

async function markCooled(provider, keyId, retryAfterMs) {
  const ttlMs = Math.max(COOLDOWN_MIN_MS, retryAfterMs || COOLDOWN_DEFAULT_MS);
  const expiresAt = Date.now() + ttlMs;
  const k = cooldownKey(provider, keyId);
  memCooldown.set(k, expiresAt);
  const ok = await redisSetEx(k, expiresAt, Math.ceil(ttlMs / 1000)).catch(() => false);
  if (!ok && !upstashDegraded) {
    upstashDegraded = true;
    console.warn('[llm-pool] upstash_cooldown_fallback — using module memory');
  }
}

// ---- Error normalization --------------------------------------------------

function normalizeError(err) {
  if (!err) return { kind: 'unknown' };
  // Groq SDK errors
  if (err instanceof Groq.RateLimitError) {
    const retry = err?.headers?.['retry-after'];
    const retryAfterMs = retry ? Number(retry) * 1000 : COOLDOWN_DEFAULT_MS;
    return { kind: 'rate_limit', retryAfterMs, status: 429 };
  }
  if (err instanceof Groq.APIConnectionTimeoutError) {
    return { kind: 'timeout' };
  }
  if (err.status === 429) {
    let retryAfterMs = COOLDOWN_DEFAULT_MS;
    const retry = err?.headers?.get?.('retry-after') || err?.headers?.['retry-after'];
    if (retry) retryAfterMs = Number(retry) * 1000;
    return { kind: 'rate_limit', retryAfterMs, status: 429 };
  }
  if (err.status >= 500) return { kind: 'server_error', status: err.status };
  return { kind: 'unknown', message: err?.message };
}

// ---- Provider drivers -----------------------------------------------------

// Groq via SDK (already a project dep). Returns either the parsed text
// (non-stream) or an async iterator of text deltas (stream).
async function callGroq({ key, model, messages, stream, jsonMode, temperature, maxTokens, timeoutMs }) {
  const groq = new Groq({ apiKey: key, maxRetries: 0, timeout: timeoutMs ?? 5000 });
  const req = {
    model,
    messages,
    temperature: temperature ?? 0.7,
    max_completion_tokens: maxTokens ?? 320,
    stream: !!stream,
  };
  if (jsonMode) req.response_format = { type: 'json_object' };
  const resp = await groq.chat.completions.create(req);
  if (stream) return groqStreamToTextIter(resp);
  const text = resp.choices?.[0]?.message?.content ?? '';
  return text;
}

async function* groqStreamToTextIter(stream) {
  let inThink = false;
  for await (const chunk of stream) {
    let content = chunk.choices?.[0]?.delta?.content || '';
    if (!content) continue;
    if (content.includes('<think>')) inThink = true;
    if (inThink) {
      if (content.includes('</think>')) {
        content = content.split('</think>').pop();
        inThink = false;
      } else {
        continue;
      }
    }
    if (content) yield content;
  }
}

// Mistral via fetch (no SDK dep). OpenAI-compatible chat/completions.
async function callMistral({ key, model, messages, stream, jsonMode, temperature, maxTokens, timeoutMs }) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs ?? 5000);
  const body = {
    model,
    messages,
    temperature: temperature ?? 0.7,
    max_tokens: maxTokens ?? 320,
    stream: !!stream,
  };
  if (jsonMode) body.response_format = { type: 'json_object' };
  let res;
  try {
    res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(t);
  }
  if (!res.ok) {
    const err = new Error(`mistral_${res.status}`);
    err.status = res.status;
    err.headers = res.headers;
    throw err;
  }
  if (!stream) {
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? '';
  }
  return mistralStreamToTextIter(res);
}

// CRITICAL FIX: track consecutive malformed lines. After 3 in a row,
// abort + throw so the caller can fail over to the next provider.
// Previously swallowed malformed lines silently — this caused silent
// mid-stream provider errors with no fallback.
// Per sequential-hugging-mango.md critical gap (lib/llm-pool.mjs:142-167).
const MISTRAL_MALFORMED_ABORT_THRESHOLD = 3;

async function* mistralStreamToTextIter(res) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let consecutiveMalformed = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        const obj = JSON.parse(payload);
        const delta = obj?.choices?.[0]?.delta?.content || '';
        consecutiveMalformed = 0; // reset on successful parse
        if (delta) yield delta;
      } catch {
        consecutiveMalformed++;
        if (consecutiveMalformed >= MISTRAL_MALFORMED_ABORT_THRESHOLD) {
          const err = new Error(`mistral_malformed_sse: ${consecutiveMalformed} consecutive malformed lines`);
          err.kind = 'mistral_malformed_sse';
          console.warn('[llm-pool] mistral_malformed_sse abort after', consecutiveMalformed, 'lines');
          throw err;
        }
      }
    }
  }
}

// ---- Public: classifier path ---------------------------------------------

// Run pinned classifier on Groq pool. Returns text JSON string from model
// or null on full pool exhaustion / all-cooled. Caller parses + validates.
export async function invokeClassifier({ messages, signal }) {
  const order = rotated(GROQ_KEYS, groqCursor);
  groqCursor = (groqCursor + 1) % Math.max(1, GROQ_KEYS.length);

  for (const k of order) {
    if (await isCooled('groq', k.id)) continue;
    try {
      const text = await callGroq({
        key: k.key,
        model: CLASSIFIER_MODEL,
        messages,
        stream: false,
        jsonMode: true,
        temperature: 0,
        maxTokens: 200,
        timeoutMs: CLASSIFIER_TIMEOUT_MS,
      });
      return { text, providerKeyId: `groq:${k.env}`, modelUsed: CLASSIFIER_MODEL };
    } catch (err) {
      const norm = normalizeError(err);
      if (norm.kind === 'rate_limit') {
        await markCooled('groq', k.id, norm.retryAfterMs);
        continue;
      }
      if (norm.kind === 'timeout' || norm.kind === 'server_error') {
        // try next key, don't cool
        continue;
      }
      console.warn('[classifier] unknown error', err?.message || err);
      continue;
    }
  }
  return null; // caller defaults to lookup path
}

// ---- Public: synthesis path -----------------------------------------------

// Returns { stream: ReadableStream<Uint8Array> of UTF-8 text chunks,
//          getMeta: () => { providerKeyId, modelUsed } }.
// Caller wraps text chunks in whatever SSE shape it likes.
//
// First BUFFER_FIRST_CHARS chars buffered before flush — if first
// generation fails inside that window, we transparently retry on the
// next provider/model.
export async function invokeSynthesis({ messages, temperature = 0.7, maxTokens = 320 }) {
  let meta = { providerKeyId: null, modelUsed: null };

  const groqOrder = rotated(GROQ_KEYS, groqCursor);
  groqCursor = (groqCursor + 1) % Math.max(1, GROQ_KEYS.length);
  const mistralOrder = rotated(MISTRAL_KEYS, mistralCursor);
  mistralCursor = (mistralCursor + 1) % Math.max(1, MISTRAL_KEYS.length);

  // Build attempt plan: Groq×keys × Groq-models, then Mistral×keys × pinned model
  const attempts = [];
  for (const k of groqOrder) {
    for (const m of GROQ_SYNTH_MODELS) {
      attempts.push({ provider: 'groq', key: k, model: m });
    }
  }
  for (const k of mistralOrder) {
    attempts.push({ provider: 'mistral', key: k, model: MISTRAL_SYNTH_MODEL });
  }

  // Try attempts until one yields a usable iter (first chunk of text within buffer)
  let chosenIter = null;
  let chosen = null;
  for (const a of attempts) {
    if (await isCooled(a.provider, a.key.id)) continue;
    try {
      let iter;
      if (a.provider === 'groq') {
        iter = await callGroq({
          key: a.key.key, model: a.model, messages,
          stream: true, temperature, maxTokens, timeoutMs: 5000,
        });
      } else {
        iter = await callMistral({
          key: a.key.key, model: a.model, messages,
          stream: true, temperature, maxTokens, timeoutMs: 5000,
        });
      }
      chosenIter = iter;
      chosen = a;
      break;
    } catch (err) {
      const norm = normalizeError(err);
      if (norm.kind === 'rate_limit') {
        await markCooled(a.provider, a.key.id, norm.retryAfterMs);
        // jump past remaining models on this key for synthesis (key is cooled)
        continue;
      }
      // server_error/timeout/unknown → next model on same key (or next key)
      continue;
    }
  }

  if (!chosenIter) {
    // Full pool exhausted. Return a stream that emits one static fallback line.
    return {
      stream: staticFallbackStream(),
      getMeta: () => ({ providerKeyId: 'static', modelUsed: 'static' }),
    };
  }

  meta = { providerKeyId: `${chosen.provider}:${chosen.key.env}`, modelUsed: chosen.model };

  const stream = bufferAndStream(chosenIter, BUFFER_FIRST_CHARS);
  return { stream, getMeta: () => meta };
}

// Wrap async iterator of text chunks → ReadableStream<Uint8Array>.
// Buffers first `bufferChars` chars before flushing. On iter throw inside
// buffer window, we still emit whatever was buffered (graceful partial).
//
// Uses start-mode (eager) — kicks off the for-await loop immediately when
// the stream is consumed, mirrors the original handler's pattern that
// worked under Netlify dev. Pull-mode has been observed to hang here.
function bufferAndStream(iter, bufferChars) {
  const enc = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      let flushed = false;
      let buf = '';
      try {
        for await (const value of iter) {
          if (flushed) {
            controller.enqueue(enc.encode(value));
            continue;
          }
          buf += value;
          if (buf.length >= bufferChars) {
            controller.enqueue(enc.encode(buf));
            buf = '';
            flushed = true;
          }
        }
        if (!flushed && buf) controller.enqueue(enc.encode(buf));
        controller.close();
      } catch (err) {
        if (!flushed && buf) {
          try { controller.enqueue(enc.encode(buf)); } catch {}
        }
        try { controller.close(); } catch {}
      }
    },
    cancel() {
      iter.return?.();
    },
  });
}

function staticFallbackStream() {
  const enc = new TextEncoder();
  const text = "Service is busy right now. The wiki at /wiki/ has the answer to most questions.";
  return new ReadableStream({
    start(controller) {
      controller.enqueue(enc.encode(text));
      controller.close();
    },
  });
}

// ---- Public: synthesis JSON path (non-streaming) --------------------------
//
// New method per CQ-2. Returns full structured JSON object non-streaming.
// Used by groqHandler.mjs for D-arch-3: handler inspects answer.length
// BEFORE opening SSE stream (synthesis confidence retry, Decision 18).
//
// Returns:
//   { json: { trace, answer, cards }, providerKeyId, modelUsed, wallClockMs }
//
// On full pool exhaustion, returns staticFallbackJson().
export async function invokeSynthesisJson({ messages, temperature = 0.7, maxTokens = 800 }) {
  const start = typeof performance !== 'undefined' ? Math.round(performance.now()) : Date.now();

  const groqOrder = rotated(GROQ_KEYS, groqCursor);
  groqCursor = (groqCursor + 1) % Math.max(1, GROQ_KEYS.length);
  const mistralOrder = rotated(MISTRAL_KEYS, mistralCursor);
  mistralCursor = (mistralCursor + 1) % Math.max(1, MISTRAL_KEYS.length);

  const attempts = [];
  for (const k of groqOrder) {
    for (const m of GROQ_SYNTH_MODELS) {
      attempts.push({ provider: 'groq', key: k, model: m });
    }
  }
  for (const k of mistralOrder) {
    attempts.push({ provider: 'mistral', key: k, model: MISTRAL_SYNTH_MODEL });
  }

  for (const a of attempts) {
    if (await isCooled(a.provider, a.key.id)) continue;
    try {
      let text;
      if (a.provider === 'groq') {
        text = await callGroq({
          key: a.key.key, model: a.model, messages,
          stream: false, jsonMode: true, temperature, maxTokens, timeoutMs: 8000,
        });
      } else {
        text = await callMistral({
          key: a.key.key, model: a.model, messages,
          stream: false, jsonMode: true, temperature, maxTokens, timeoutMs: 8000,
        });
      }

      const wallClockMs = (typeof performance !== 'undefined' ? Math.round(performance.now()) : Date.now()) - start;

      // Parse JSON from model response
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        // Model returned non-JSON — log and try next provider
        console.warn('[llm-pool] invokeSynthesisJson: non-JSON response from', a.provider, a.model, 'len=', text?.length);
        continue;
      }

      // Validate basic shape
      if (typeof json?.answer !== 'string') {
        console.warn('[llm-pool] invokeSynthesisJson: missing answer field from', a.provider, a.model);
        continue;
      }

      return {
        json,
        providerKeyId: `${a.provider}:${a.key.env}`,
        modelUsed: a.model,
        wallClockMs,
      };
    } catch (err) {
      const norm = normalizeError(err);
      if (norm.kind === 'rate_limit') {
        await markCooled(a.provider, a.key.id, norm.retryAfterMs);
        continue;
      }
      console.warn('[llm-pool] invokeSynthesisJson error', a.provider, a.model, err?.message);
      continue;
    }
  }

  // Full pool exhausted
  const wallClockMs = (typeof performance !== 'undefined' ? Math.round(performance.now()) : Date.now()) - start;
  return staticFallbackJson(wallClockMs);
}

function staticFallbackJson(wallClockMs = 0) {
  return {
    json: {
      trace: [
        { verb: 'parsed', args: 'intent(lookup)' },
        { verb: 'composed', args: 'response()' },
      ],
      answer: "Service is busy right now. The wiki at /wiki/ has the answer to most questions.",
      cards: [
        { slug: 'lab', type: 'page', priority: true },
      ],
    },
    providerKeyId: 'static',
    modelUsed: 'static',
    wallClockMs,
  };
}

// ---- Diagnostics ----------------------------------------------------------

export function diagnostics() {
  return {
    groq_keys: GROQ_KEYS.length,
    mistral_keys: MISTRAL_KEYS.length,
    upstash_degraded: upstashDegraded,
    cooldown_mem_size: memCooldown.size,
  };
}

export const __test = { resolveKeys, normalizeError, rotated };
