// defense.mjs
//
// Abuse defense middleware for /enter agent endpoint.
// Tier 0 + Tier 1 per docs/plans/phase-d-decisions-2026-04-27.md Decision 10
// and the Lane B spec in ~/.claude/plans/sequential-hugging-mango.md.
//
// TIER 0 — UA gate + input validation + injection filter
//   - BOT_UA: recognized AI crawler UAs → return static kg.json excerpt (JSON)
//   - Input length cap (MAX_INPUT_LENGTH from constants.mjs)
//   - Null / type guard (prompt must be a non-empty string)
//   - Injection filter (hardened set of patterns)
//
// TIER 1 — Duplicate-query cache + per-IP rate limit
//   - Dup cache: LRU in-memory, ~5min TTL, 256-entry cap
//     Key = sha256-lite hash (djb2) of normalized query string.
//     Returns cached response body with X-Cache: HIT header.
//   - Per-IP rate limit: 60 q/h sliding window (Upstash) + burst 5/10s (in-process Map)
//     Upstash failure → fail open (log + allow; defense decision §10).
//
// NOTE: per-IP state stored in module-scope Map for burst window.
// Netlify Functions are ephemeral but warm-instance reuse provides
// adequate burst protection within a single container lifecycle.
// Across containers (cold starts), burst state resets — acceptable at
// this scale (free-tier providers, personal site traffic).
//
// Upstash keys consumed:
//   ratelimit:{ip}:hour      INCR + EXPIRE 3600
//   (burst is in-process only — no Upstash write per burst check)
//
// Usage in groqHandler.mjs:
//   import { defend } from './lib/defense.mjs';
//   ...
//   const early = await defend(request, rawBody);
//   if (early) return early;

import { call as upstashCall } from './upstash-client.mjs';
import {
  MAX_INPUT_LENGTH,
  BOT_UA_PATTERNS,
  RATE_LIMIT_PER_HOUR,
  BURST_LIMIT,
  BURST_WINDOW_MS,
  ALLOWED_ORIGINS,
} from './constants.mjs';

// ---- Tier 0: Bot UA gate ---------------------------------------------------

// Static kg.json excerpt returned to recognized AI crawlers.
// Contains the 5 most informative theme one-liners from kg.json so
// crawlers get structured ground truth instead of triggering synthesis.
const BOT_STATIC_RESPONSE = {
  source: 'agamarora.com knowledge graph excerpt',
  description: 'Agam Arora — AI Product Manager, 12 years. Structured knowledge graph excerpt.',
  themes: [
    { slug: 'agent-first', label: 'Agent-first thesis', one_line: 'Platforms that cannot talk to autonomous agents are already behind; the prompting skill layer migrated, the verdict held', url: 'https://agamarora.com/wiki/agent-first/' },
    { slug: 'voice-ai-craft', label: 'Voice AI craft — cost, latency, scale', one_line: 'Voice AI is a distinct engineering discipline with its own constraints; the under-share is deliberate', url: 'https://agamarora.com/wiki/voice-ai-craft/' },
    { slug: 'spec-first-practice', label: 'Spec-first practice', one_line: 'Every system worth building starts with a locked spec; the discipline forces clarity upstream', url: 'https://agamarora.com/wiki/spec-first-practice/' },
    { slug: 'breadth-as-differentiation', label: 'Breadth as differentiation', one_line: 'Breadth differentiates; depth is what makes it matter', url: 'https://agamarora.com/wiki/breadth-as-differentiation/' },
    { slug: 'shipping-vs-perfection', label: 'Shipping vs perfection', one_line: 'A product that reaches users beats the perfect one stuck in review', url: 'https://agamarora.com/wiki/shipping-vs-perfection/' },
  ],
  resume: 'https://agamarora.com/resume',
  wiki: 'https://agamarora.com/wiki',
  llms_txt: 'https://agamarora.com/llms.txt',
};

function isBotUA(ua) {
  if (!ua) return false;
  for (const pat of BOT_UA_PATTERNS) {
    if (pat.test(ua)) return { bot: true, name: pat.source };
  }
  return false;
}

// ---- Tier 0: Injection filter (hardened) -----------------------------------
//
// Original patterns in groqHandler.mjs are preserved there (for history
// sanitization). This set covers additional vectors: role-based newline
// injection, bidi overrides, base64-encoded instructions, and unicode
// lookalike sequences.

const INJECTION_PATTERNS = [
  // Original patterns (must stay in sync with groqHandler clampHistory)
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts)/i,
  /what\s+(is|are)\s+your\s+(system|initial)\s+(prompt|instructions)/i,
  /reveal\s+your\s+(prompt|instructions|system)/i,
  /repeat\s+(the|your)\s+(above|system|initial)/i,
  /pretend\s+(you\s+are|to\s+be|you're)/i,
  /act\s+as\s+(a|an|if)/i,
  /you\s+are\s+now\s+(a|an)/i,
  /roleplay\s+as/i,
  // Extended: role-based newline injection (multiline + line-start without newline)
  /\n\s*(system|user|assistant)\s*:/i,
  /\\n\s*(system|user|assistant)\s*:/i,
  /^(system|user|assistant)\s*:/im,
  // Extended: bidi override characters
  /[‪-‮⁦-⁩‏‎]/,
  // Extended: base64-encoded injection attempt (heuristic: long base64 string)
  /[A-Za-z0-9+/]{60,}={0,2}/,
  // Extended: DAN / jailbreak openers
  /\b(DAN|jailbreak|developer\s+mode|god\s+mode|unlock\s+mode)\b/i,
  // Extended: system-level override phrases
  /disregard\s+(all\s+)?(previous|prior|above|your)\s+(instructions|rules|constraints)/i,
  /override\s+(safety|content|system)\s+(filter|policy|rules)/i,
  /new\s+(instructions?|directives?|rules?)\s*:/i,
  // Extended: "forget" variant
  /forget\s+(all|previous|your|prior)\s+(instructions?|rules?|prompts?)/i,
];

// Normalize input before pattern matching to defeat homoglyph + ZWSP injection.
// NFKC collapses some lookalike characters. We also apply a manual homoglyph
// substitution map for characters NFKC does not unify (e.g. dotless-i U+0131).
// Zero-width / invisible chars are replaced with a space (not stripped) so
// word-boundary patterns like \s+ still match after ZWSP removal.

// Homoglyph map: common lookalikes → ASCII equivalent
// Keep minimal — only characters that directly bypass injection patterns.
const HOMOGLYPH_MAP = {
  'ı': 'i', // dotless i (Turkish) — bypasses "ignore"
  'ẚ': 'a', // latin small letter a with right half ring
  'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
  'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
  'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
  'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
  'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
};
const HOMOGLYPH_RE = new RegExp(`[${Object.keys(HOMOGLYPH_MAP).join('')}]`, 'g');

// Zero-width + invisible Unicode characters that attackers insert to split keywords.
// Replace with space so \s+ patterns still match after removal.
// Using RegExp constructor with explicit unicode escapes to avoid embedding raw control chars.
// U+200B ZWSP, U+200C ZWNJ, U+200D ZWJ, U+FEFF BOM, U+00AD soft-hyphen, U+2060 word-joiner
const INVISIBLE_RE = new RegExp('[\u200b\u200c\u200d\ufeff\u00ad\u2060\u180e\u2062\u2063\u2064]', 'g'); // ZWSP/ZWNJ/ZWJ/BOM/soft-hyphen/word-joiner and invisible math ops

function normalizeInput(input) {
  return input
    .normalize('NFKC')
    .replace(HOMOGLYPH_RE, ch => HOMOGLYPH_MAP[ch] || ch)
    .replace(INVISIBLE_RE, ' ');
}

export function isInjectionAttempt(input) {
  const normalized = normalizeInput(input);
  return INJECTION_PATTERNS.some(p => p.test(normalized));
}

// ---- Tier 1: Duplicate-query LRU cache -------------------------------------
//
// Dependency-free ~30 LOC LRU. Keys are djb2 hashes of normalized queries.
// Cache entries stored as { body: string, ts: number }.
// TTL = 5 minutes. Max = 256 entries (evict LRU on overflow).

const DUP_CACHE_MAX = 256;
const DUP_CACHE_TTL_MS = 5 * 60 * 1000; // 5 min

// Map preserves insertion order; we use that for LRU (delete + re-insert on hit)
const dupCache = new Map();

function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0; // force uint32
  }
  return hash.toString(36);
}

function cacheKey(ip, query) {
  // Scope cache per IP so different users don't poison each other.
  // Normalize: lowercase, collapse whitespace.
  const norm = query.toLowerCase().replace(/\s+/g, ' ').trim();
  return `${ip}:${djb2(norm)}`;
}

function cacheGet(key) {
  if (!dupCache.has(key)) return null;
  const entry = dupCache.get(key);
  if (Date.now() - entry.ts > DUP_CACHE_TTL_MS) {
    dupCache.delete(key);
    return null;
  }
  // LRU: move to end on hit
  dupCache.delete(key);
  dupCache.set(key, entry);
  return entry;
}

function cacheSet(key, body) {
  // Evict oldest if at cap
  if (dupCache.size >= DUP_CACHE_MAX) {
    const oldest = dupCache.keys().next().value;
    dupCache.delete(oldest);
  }
  dupCache.set(key, { body, ts: Date.now() });
}

// Exported for test access
export const __dupCache = { get: cacheGet, set: cacheSet, map: dupCache };

// ---- Tier 1: Per-IP rate limit ---------------------------------------------
//
// Hourly: Upstash INCR key `ratelimit:{ip}:hour`, 3600s TTL.
// On Upstash fail → fail open (log warning, allow request).
//
// Burst: in-process Map { ip → [timestamps] }. Evict old timestamps on each
// check. 5 requests within 10s = 429.

const BURST_MAP_MAX = 10_000; // cap in-process map to prevent unbounded growth
const burstMap = new Map(); // ip -> number[] (timestamps)

function checkBurst(ip) {
  const now = Date.now();
  const windowStart = now - BURST_WINDOW_MS;
  let timestamps = burstMap.get(ip) || [];
  timestamps = timestamps.filter(t => t > windowStart);
  if (timestamps.length >= BURST_LIMIT) {
    // Don't push — already over limit
    burstMap.set(ip, timestamps);
    const retryAfterMs = BURST_WINDOW_MS - (now - timestamps[0]);
    return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs) };
  }
  timestamps.push(now);
  // Evict oldest entry if map is at cap (Map preserves insertion order)
  if (!burstMap.has(ip) && burstMap.size >= BURST_MAP_MAX) {
    burstMap.delete(burstMap.keys().next().value);
  }
  burstMap.set(ip, timestamps);
  return { allowed: true };
}

async function checkHourly(ip) {
  // ratelimit:{ip}:hour stores count. Atomic Lua: INCR + EXPIRE only on first touch.
  // Using Lua EVAL ensures no window where key has no TTL (permanent lockout prevented).
  const key = `ratelimit:${ip}:hour`;
  try {
    const count = await upstashCall(['EVAL', `
local v = redis.call('INCR', KEYS[1])
if v == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
return v
`, '1', key, '3600']);
    if (typeof count === 'number' && count > RATE_LIMIT_PER_HOUR) {
      return { allowed: false, retryAfterMs: 60_000 };
    }
    return { allowed: true };
  } catch (err) {
    console.warn('[defense] upstash rate limit failed open:', err?.message || err);
    return { allowed: true }; // fail open per Decision 10
  }
}

// Exported for tests
export async function checkRateBucket(ip) {
  const burst = checkBurst(ip);
  if (!burst.allowed) return burst;
  return checkHourly(ip);
}

// ---- Helpers ---------------------------------------------------------------

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ||
    (() => { try { return new URL(origin).hostname === 'localhost'; } catch { return false; } })();
  return {
    'Access-Control-Allow-Origin': allowed ? origin : '',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST',
  };
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

function getClientIP(request) {
  // Netlify sets x-nf-client-connection-ip for real IP.
  // Fallback: x-forwarded-for first entry, then 'unknown'.
  const nfIP = request.headers.get('x-nf-client-connection-ip');
  if (nfIP) return nfIP.trim();
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return 'unknown';
}

// ---- Public: defend(request) -----------------------------------------------
//
// Call at the top of groqHandler. Returns a Response (early exit) or null
// (proceed with normal handler logic).
//
// The rawBodyOrParsed param accepts either a pre-parsed body object (if the
// handler has already called request.json()) or null. If null, defend() does
// NOT re-read the body — it only checks UA and IP. In that case, the handler
// should call defendBody(prompt, ip, origin) after parsing.
//
// Simpler contract: groqHandler calls defend(request, body) after parsing.

export async function defend(request, parsedBody) {
  const origin = request.headers.get('origin') || '';
  const ua = request.headers.get('user-agent') || '';
  const ip = getClientIP(request);

  // --- Tier 0a: Bot UA gate ---
  const botCheck = isBotUA(ua);
  if (botCheck) {
    console.log('[defense] bot_ua_gate', { ua: ua.slice(0, 60), bot: botCheck.name });
    return jsonResponse(BOT_STATIC_RESPONSE, 200, origin);
  }

  // --- Tier 0b: Input validation ---
  if (parsedBody !== null && parsedBody !== undefined) {
    const prompt = parsedBody.prompt;
    if (prompt === null || prompt === undefined || typeof prompt !== 'string') {
      return jsonResponse({ error: 'prompt must be a string' }, 400, origin);
    }
    if (typeof prompt === 'string' && prompt.trim().length === 0) {
      return jsonResponse({ error: 'Empty input' }, 400, origin);
    }
    if (typeof prompt === 'string' && prompt.length > MAX_INPUT_LENGTH) {
      // Don't error — clamp is handled in groqHandler. But do reject obviously
      // oversized inputs that exceed 10x the cap (likely automated probe).
      if (prompt.length > MAX_INPUT_LENGTH * 10) {
        return jsonResponse({ error: 'Input too large' }, 400, origin);
      }
    }

    // --- Tier 0c: Injection filter ---
    const rawPrompt = typeof prompt === 'string' ? prompt : '';
    if (isInjectionAttempt(rawPrompt)) {
      console.log('[defense] injection_blocked', { len: rawPrompt.length });
      return jsonResponse({ result: "Nice try. This terminal doesn't break that way." }, 200, origin);
    }
  }

  // --- Tier 1a: Burst check (fast, in-process) ---
  const burst = checkBurst(ip);
  if (!burst.allowed) {
    console.log('[defense] burst_limited', { ip, retryAfterMs: burst.retryAfterMs });
    return new Response(JSON.stringify({ error: 'Too many requests. Wait a moment.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil(burst.retryAfterMs / 1000)),
        ...corsHeaders(origin),
      },
    });
  }

  // --- Tier 1b: Hourly rate limit (Upstash) ---
  const hourly = await checkHourly(ip);
  if (!hourly.allowed) {
    console.log('[defense] hourly_limited', { ip });
    return new Response(JSON.stringify({ error: 'Rate limit reached. Come back in a bit.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
        ...corsHeaders(origin),
      },
    });
  }

  return null; // proceed
}

// ---- Public: dupCacheLookup + dupCacheStore --------------------------------
//
// Called by groqHandler AFTER defend() returns null.
// Separating from defend() keeps groqHandler's SSE stream construction clean.

export function dupCacheLookup(ip, prompt) {
  const key = cacheKey(ip, prompt);
  const entry = cacheGet(key);
  if (entry) {
    console.log('[defense] dup_cache_hit', { ip, key });
    return { hit: true, body: entry.body, key };
  }
  return { hit: false, key };
}

export function dupCacheStore(key, body) {
  cacheSet(key, body);
}

// Re-export for groqHandler convenience
export { getClientIP };

// ---- Exports for unit tests ------------------------------------------------
export const __test = { isBotUA, isInjectionAttempt, checkBurst, djb2, cacheKey };
