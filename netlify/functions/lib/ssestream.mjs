// ssestream.mjs
//
// SSE encoder for /enter v3 structured event shape.
//
// Event types (per enter-v3.md §3 + v3.1-spec §1):
//   trace  — { verb, args, ms, pill_ms }                    one per trace line
//   token  — { text }                                       one per word-chunk
//   card   — { slug, kind, priority, title, desc, url,
//              arrow_label }                                one per card
//   done   — {}                                             stream sentinel
//   error  — { message }                                    error event
//
// IMPORTANT (v3.1 wire fix): the inner card key is `kind`, NOT `type`. The
// outer SSE wrapper uses `type` for the event type ('trace', 'token', 'card').
// In the v3 path the inner key was also `type`, which collided in the spread:
// `JSON.stringify({type: 'card', ...{type: 'page', ...rest}})` → the spread
// overwrote the outer event type, frontend `t === 'card'` never matched, all
// LLM cards were silently dropped. v3.1 renames inner key to `kind`.
//
// v3.1 also resolves card meta server-side via card-meta.resolveCard, so the
// SSE payload carries title/desc/url ready-to-render. Frontend stops mapping
// slugs to titles. Single source of truth = card-meta.mjs.
//
// The handler calls buildEventStream(parsedJson, timings) which returns a
// ReadableStream<Uint8Array> emitting SSE bytes.
//
// Per phase-d-decisions-2026-04-27.md Decision 3 (1-call structured output),
// Decision 16 (server stamps real ms), Decision 17 (pill animation from server).
// Per docs/plans/enter-v3.1-spec.md B1 (wire fix) + B3 (card meta SSOT).

import { resolveLLMCard, resolveCard } from './card-meta.mjs';
import { scrubDebugPayload } from './debug-emit.mjs';

const enc = new TextEncoder();

// Encode a single SSE event to bytes.
function sseEvent(type, data) {
  const payload = JSON.stringify({ type, ...data });
  return enc.encode(`data: ${payload}\n\n`);
}

// Emit a glassbox `debug` SSE event. Payload is scrubbed via the central
// allowlist (debug-emit.mjs) before it hits the wire. Tier 2 tags drop when
// verbose is false. Unknown tags drop. Bad payloads (circular refs etc.)
// silently fail without breaking the rest of the stream.
function emitDebug(controller, tag, payload, verbose) {
  const scrubbed = scrubDebugPayload(tag, payload, verbose);
  if (!scrubbed) return;
  try {
    controller.enqueue(sseEvent('debug', { tag, payload: scrubbed, ts: Date.now() }));
  } catch {
    // drop on JSON.stringify failure; rest of stream unaffected
  }
}

// Split answer text into word-boundary chunks for synthetic streaming.
// ~30ms stagger is applied client-side; server emits all tokens at once.
function tokenChunks(text) {
  if (!text) return [];
  // Split on word boundaries (space-delimited), keeping spaces attached to next token.
  const words = text.split(/(?<=\s)|(?=\s)/g).filter(Boolean);
  // Group into 2-3 word chunks for natural rhythm.
  const chunks = [];
  let buf = '';
  for (const w of words) {
    buf += w;
    if (buf.trim().split(/\s+/).length >= 2 && buf.endsWith(' ')) {
      chunks.push(buf);
      buf = '';
    }
  }
  if (buf) chunks.push(buf);
  return chunks.length > 0 ? chunks : [text];
}

// Build a ReadableStream<Uint8Array> from parsed structured output + timing map.
//
// Args:
//   parsed       { trace: [{verb, args}], answer: string, cards: [{slug, type, priority}] }
//   timings      Map<step_label, ms> — real wall-clock per pipeline step
//   MIN_PILL_MS  minimum duration for pill animation (Decision 17, default 600ms)
//
// Returns ReadableStream<Uint8Array>.
//
// MIN_DISPLAY_MS is the floor applied to the ms value rendered as the trace
// pill counter. Sub-millisecond ops (cache lookups, in-memory KG joins) round
// to 0 with Math.round — and "0ms" reads as broken or untracked. 12ms read
// as suspiciously identical across pills; bumped to a randomized 20-30ms band
// so each pill reads as an independent fast-path measurement instead of a
// uniform floor. Floor only applies when realMs > 0 (preserves null semantics
// for steps that genuinely had no timing).
const MIN_DISPLAY_MS_LO = 20;
const MIN_DISPLAY_MS_HI = 30;
function syntheticDisplayMs() {
  return MIN_DISPLAY_MS_LO + Math.floor(Math.random() * (MIN_DISPLAY_MS_HI - MIN_DISPLAY_MS_LO + 1));
}

export function buildEventStream(parsed, timings = {}, MIN_PILL_MS = 600, meta = {}, verbose = false) {
  const trace = Array.isArray(parsed?.trace) ? parsed.trace : [];
  const answer = typeof parsed?.answer === 'string' ? parsed.answer : '';
  const cards = Array.isArray(parsed?.cards) ? parsed.cards : [];

  return new ReadableStream({
    start(controller) {
      try {
        // --- Glassbox header (debug events) -----------------------------------
        // Emit pipeline meta first so /enter/log sees the route decision +
        // retrieval shape before any pill lands. All payloads pass through
        // the allowlist scrubber (debug-emit.mjs) — IP-bearing fields never
        // make it to the wire.
        if (meta.route)      emitDebug(controller, 'route_decision', meta.route, verbose);
        if (meta.cache)      emitDebug(controller, 'cache_status', meta.cache, verbose);
        if (meta.retrieval)  emitDebug(controller, 'retrieval_meta', meta.retrieval, verbose);
        if (meta.retry)      emitDebug(controller, 'retry_meta', meta.retry, verbose);
        emitDebug(controller, 'timings_map', timings, verbose);

        // --- Trace events ---
        // Per-pill timing resolution. Three outcomes:
        //   1. Verb maps to a key AND that key has a real measurement →
        //      stamp real ms (floored at synthetic 20-30 band if sub-ms).
        //   2. Verb is unknown OR key wasn't measured (step didn't run server-
        //      side; e.g. LLM hallucinated retrieval on headline route) →
        //      stamp a fresh random 20-30ms per pill via syntheticDisplayMs().
        //      Each pill gets its own random draw so unrelated pills NEVER
        //      end up with identical ms (was the v3.1 bug — every unmapped
        //      verb pulled `timings['synthesize']` and 3-4 pills came back
        //      stamped 3000ms+ in lockstep).
        //   3. Animation duration (pill_ms) always uses MIN_PILL_MS floor.
        //      Real steps use max(realMs, MIN_PILL_MS) so a 3s synth call
        //      gets a 3s count-up. Synthetic pills stay at MIN_PILL_MS so
        //      the trace row doesn't drag on no-op verbs.
        for (let i = 0; i < trace.length; i++) {
          const line = trace[i];
          if (!line || typeof line !== 'object') continue;
          const verb = String(line.verb || '');
          const args = String(line.args || '');

          const timingKey = resolveTimingKey(verb);
          const measured = timingKey !== null ? timings[timingKey] : undefined;
          const stepRan = measured !== undefined;

          const realRounded = stepRan ? Math.round(measured) : null;
          // displayMs: real value when measured (sub-ms ops still get floored
          // to the synthetic 20-30 band so "0ms" never renders). When step
          // didn't run, every pill gets an independent random draw — no
          // shared fallback value across pills.
          const displayMs = stepRan
            ? (realRounded < MIN_DISPLAY_MS_LO ? syntheticDisplayMs() : realRounded)
            : syntheticDisplayMs();
          // pillMs: animation duration. Real → match the measured time so
          // count-up paces with reality. Synthetic → MIN_PILL_MS (no point
          // dragging a fast-path pill out for seconds).
          const pillMs = stepRan ? Math.max(measured, MIN_PILL_MS) : MIN_PILL_MS;

          // Glassbox: fallbackUsed=true means this pill's ms is synthetic
          // (LLM emitted a verb for a step that wasn't measured). Honest
          // signal for /enter/log — amber border highlights these rows so
          // visitors can see when the model claimed work that didn't happen.
          const fallbackUsed = !stepRan;

          emitDebug(controller, 'pill_resolve', {
            verb,
            timingKey,
            realMs: realRounded,
            displayMs,
            pillMs: Math.round(pillMs),
            fallbackUsed,
          }, verbose);

          controller.enqueue(sseEvent('trace', {
            verb,
            args,
            ms: displayMs,
            pill_ms: Math.round(pillMs),
          }));
        }

        // --- Token events (word-chunked answer) ---
        const chunks = tokenChunks(answer);
        for (const chunk of chunks) {
          controller.enqueue(sseEvent('token', { text: chunk }));
        }
        emitDebug(controller, 'token_count', { count: chunks.length }, verbose);
        emitDebug(controller, 'answer_meta', { len: answer.length }, verbose);

        // --- Card events (v3.1: server resolves meta, emits ready-to-render) ---
        // Resolve each LLM-emitted card via card-meta.resolveLLMCard. Unknown
        // slugs return null and are dropped (LLM was given the canonical slug
        // list in the system prompt; unknown = drift, not a user-facing fault).
        for (const card of cards) {
          const resolved = resolveLLMCard(card);
          if (!resolved) continue;
          emitDebug(controller, 'card_summary', {
            slug: resolved.slug,
            priority: resolved.priority,
            kind: resolved.kind,
          }, verbose);
          controller.enqueue(sseEvent('card', {
            slug: resolved.slug,
            kind: resolved.kind,
            priority: resolved.priority,
            title: resolved.title,
            desc: resolved.desc,
            url: resolved.url,
            arrow_label: resolved.arrow_label,
          }));
        }

        // --- Done sentinel ---
        controller.enqueue(sseEvent('done', {}));
        controller.close();
      } catch (err) {
        try {
          controller.enqueue(sseEvent('error', { message: err?.message || 'stream_error' }));
        } catch {}
        try { controller.close(); } catch {}
      }
    },
  });
}

// Map trace verb → timing key. The handler emits these keys via measure():
//   'preroute', 'classify', 'retrieve_wiki', 'retrieve_edges', 'synthesize', 'retry'
//
// Covers the full LLM-allowed verb list (see groqHandler.mjs SYSTEM_PROMPT,
// `Allowed verbs by activity`). Unknown verbs return null so the caller can
// render an honest "—" instead of inheriting an unrelated step's ms via a
// fallback (which is what the v3.1 bug was — every unmapped verb stamped
// `timings['synthesize']` and pills came back identical across steps).
//
// Grouping rationale: retrieval / search / match / rank verbs all collapse
// to `retrieve_wiki` because that's the single aggregate timing bucket the
// handler measures for "fetch context from wiki + beliefs". `retrieve_edges`
// is separate because KG edge fetch is measured independently. Synthesis
// verbs (composed/synthesized/reasoned/...) → `synthesize`. Verification +
// greeting + deflection → `preroute` (those branches run during pre-route).
// Retry → `retry` (D-9a server stamps when confidence retry fires).
const VERB_TO_KEY = {
  // intent / classification
  parsed: 'classify', classified: 'classify', routed: 'classify', recognized: 'classify',
  // retrieval (args no longer sniffed — verb alone decides)
  read: 'retrieve_wiki', pulled: 'retrieve_wiki', fetched: 'retrieve_wiki',
  loaded: 'retrieve_wiki', retrieved: 'retrieve_wiki',
  // search / lookup
  searched: 'retrieve_wiki', scanned: 'retrieve_wiki', 'looked-up': 'retrieve_wiki', queried: 'retrieve_wiki',
  // matching
  matched: 'retrieve_wiki', mapped: 'retrieve_wiki', identified: 'retrieve_wiki', resolved: 'retrieve_wiki',
  // ranking / selection
  ranked: 'retrieve_wiki', ordered: 'retrieve_wiki', picked: 'retrieve_wiki', scored: 'retrieve_wiki',
  // graph / edge traversal
  traced: 'retrieve_edges', walked: 'retrieve_edges', followed: 'retrieve_edges',
  // synthesis
  composed: 'synthesize', synthesized: 'synthesize', reasoned: 'synthesize',
  summarized: 'synthesize', distilled: 'synthesize',
  // verification → preroute (validation happens during pre-route classification)
  checked: 'preroute', verified: 'preroute', validated: 'preroute', confirmed: 'preroute',
  // greeting / deflection → preroute (those branches short-circuit at pre-route)
  warm: 'preroute', greeted: 'preroute', deflected: 'preroute', declined: 'preroute',
  // D-9a synthetic verb the server injects after a successful confidence retry
  expanded: 'retry',
  // server-injected meta verbs (cache replay, F5 padder) → preroute bucket
  cached: 'preroute', padded: 'preroute',
};

function resolveTimingKey(verb) {
  const v = String(verb || '').toLowerCase();
  return VERB_TO_KEY[v] || null;
}

// Emit a card via the SSE channel using card-meta.resolveCard. Internal
// helper for the static streams below — same wire shape as the LLM-emitted
// cards in buildEventStream. Also emits a card_summary glassbox debug event
// when verbose is meaningful (kept paired with the card event so /enter/log
// stays time-ordered with the SSE wire stream).
function enqueueResolvedCard(controller, slug, priority = false, verbose = false) {
  const resolved = resolveCard(slug, { priority });
  if (!resolved) return;
  emitDebug(controller, 'card_summary', {
    slug: resolved.slug,
    priority: resolved.priority,
    kind: resolved.kind,
  }, verbose);
  controller.enqueue(sseEvent('card', {
    slug: resolved.slug,
    kind: resolved.kind,
    priority: resolved.priority,
    title: resolved.title,
    desc: resolved.desc,
    url: resolved.url,
    arrow_label: resolved.arrow_label,
  }));
}

// Build a static deflect SSE stream (no LLM call).
//
// v3.1: deflect cards vary across requests within a bounded set. Same handler,
// same input always picks the same triple (deterministic by hash of `text`),
// but different deflect texts yield different triples. Avoids the v3 problem
// of every deflect ending with the identical lab+resume trio.
//
// Triples (locked 2026-05-03 per user direction): all deflect rows ship 3
// cards so the row aligns visually with synthesis/lookup rows. Earlier
// 2-tuple sets exposed the pre-existing 32px CSS bleed-drift between
// 2-card and 3-card rows in mixed-intent conversations.
const DEFLECT_CARD_SETS = [
  ['lab', 'resume', 'wiki/graph'],
  ['wiki/graph', 'lab', 'resume'],
  ['resume', 'wiki/graph', 'lab'],
  ['lab', 'calendly', 'wiki/graph'],
];
function pickDeflectCards(text) {
  // Cheap deterministic hash: sum of charcodes mod set count.
  const seed = (text || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return DEFLECT_CARD_SETS[seed % DEFLECT_CARD_SETS.length];
}

export function buildDeflectStream(text, meta = {}, verbose = false) {
  return new ReadableStream({
    start(controller) {
      try {
        // Glassbox: surface the deflect decision before pills land.
        emitDebug(controller, 'route_decision',
          meta.route || { type: 'deflect', reason: 'off_topic', themes: [], confidence: 1 },
          verbose);
        controller.enqueue(sseEvent('trace', { verb: 'parsed', args: 'intent(off-topic)', ms: syntheticDisplayMs(), pill_ms: 600 }));
        controller.enqueue(sseEvent('trace', { verb: 'deflected', args: 'personal', ms: syntheticDisplayMs(), pill_ms: 600 }));
        const chunks = tokenChunks(text);
        for (const chunk of chunks) {
          controller.enqueue(sseEvent('token', { text: chunk }));
        }
        emitDebug(controller, 'token_count', { count: chunks.length }, verbose);
        emitDebug(controller, 'answer_meta', { len: text.length }, verbose);
        const [pri, sec, ter] = pickDeflectCards(text);
        enqueueResolvedCard(controller, pri, true, verbose);
        enqueueResolvedCard(controller, sec, false, verbose);
        enqueueResolvedCard(controller, ter, false, verbose);
        controller.enqueue(sseEvent('done', {}));
        controller.close();
      } catch (err) {
        try { controller.enqueue(sseEvent('error', { message: err?.message || 'deflect_stream_error' })); } catch {}
        try { controller.close(); } catch {}
      }
    },
  });
}

// Build a static fallback SSE stream (pool exhausted).
export function buildFallbackStream(meta = {}, verbose = false) {
  const text = "Service is busy right now. The wiki at /wiki/ has the answer to most questions.";
  return new ReadableStream({
    start(controller) {
      emitDebug(controller, 'route_decision',
        meta.route || { type: 'fallback', reason: 'pool_exhausted', themes: [], confidence: 0 },
        verbose);
      const chunks = tokenChunks(text);
      for (const chunk of chunks) {
        controller.enqueue(sseEvent('token', { text: chunk }));
      }
      emitDebug(controller, 'token_count', { count: chunks.length }, verbose);
      emitDebug(controller, 'answer_meta', { len: text.length }, verbose);
      enqueueResolvedCard(controller, 'wiki', true, verbose);
      enqueueResolvedCard(controller, 'lab', false, verbose);
      controller.enqueue(sseEvent('done', {}));
      controller.close();
    },
  });
}

// Build a static cache-replay SSE stream. v3.1 fix for B2: cache hits used to
// drop cards entirely (cached only {text}). Now caches {text, cards} where
// cards is the array of stored slugs + priority flags. Replay re-resolves
// meta via card-meta so card content stays in sync if titles change.
export function buildCacheReplayStream({ text, cards = [] }, meta = {}, verbose = false) {
  return new ReadableStream({
    start(controller) {
      try {
        emitDebug(controller, 'cache_status', { hit: true }, verbose);
        if (meta.route) emitDebug(controller, 'route_decision', meta.route, verbose);
        controller.enqueue(sseEvent('trace', {
          verb: 'cached',
          args: 'replay()',
          ms: 0,
          pill_ms: 0,
        }));
        controller.enqueue(sseEvent('token', { text, cached: true }));
        emitDebug(controller, 'token_count', { count: 1 }, verbose);
        emitDebug(controller, 'answer_meta', { len: (text || '').length }, verbose);
        for (const card of cards) {
          if (!card?.slug) continue;
          enqueueResolvedCard(controller, card.slug, card.priority === true, verbose);
        }
        controller.enqueue(sseEvent('done', {}));
        controller.close();
      } catch (err) {
        try { controller.enqueue(sseEvent('error', { message: err?.message || 'cache_replay_stream_error' })); } catch {}
        try { controller.close(); } catch {}
      }
    },
  });
}
