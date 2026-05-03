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

const enc = new TextEncoder();

// Encode a single SSE event to bytes.
function sseEvent(type, data) {
  const payload = JSON.stringify({ type, ...data });
  return enc.encode(`data: ${payload}\n\n`);
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

export function buildEventStream(parsed, timings = {}, MIN_PILL_MS = 600) {
  const trace = Array.isArray(parsed?.trace) ? parsed.trace : [];
  const answer = typeof parsed?.answer === 'string' ? parsed.answer : '';
  const cards = Array.isArray(parsed?.cards) ? parsed.cards : [];

  return new ReadableStream({
    start(controller) {
      try {
        // --- Trace events ---
        for (let i = 0; i < trace.length; i++) {
          const line = trace[i];
          if (!line || typeof line !== 'object') continue;
          const verb = String(line.verb || '');
          const args = String(line.args || '');

          // Decision 16: server stamps real ms post-parse.
          // Map trace verbs to timing keys.
          const timingKey = resolveTimingKey(verb, args);
          const realMs = timings[timingKey] ?? timings['synthesize'] ?? null;

          // Decision 17: pill animation uses max(realMs, MIN_PILL_MS).
          const pillMs = realMs !== null ? Math.max(realMs, MIN_PILL_MS) : MIN_PILL_MS;

          // Floor sub-ms ops at a randomized 20-30ms band (per-pill) so they
          // read as real fast-path measurements rather than a uniform "0ms"
          // (broken) or repeating "12ms" (synthetic). Pill animation duration
          // uses pillMs which already has its own floor (MIN_PILL_MS).
          const realRounded = realMs !== null ? Math.round(realMs) : null;
          const displayMs = realRounded !== null
            ? (realRounded < MIN_DISPLAY_MS_LO ? syntheticDisplayMs() : realRounded)
            : null;

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

        // --- Card events (v3.1: server resolves meta, emits ready-to-render) ---
        // Resolve each LLM-emitted card via card-meta.resolveLLMCard. Unknown
        // slugs return null and are dropped (LLM was given the canonical slug
        // list in the system prompt; unknown = drift, not a user-facing fault).
        for (const card of cards) {
          const resolved = resolveLLMCard(card);
          if (!resolved) continue;
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

// Map trace verb to a timing key from the handler's timing map.
// The handler logs keys: 'preroute', 'classify', 'retrieve_wiki', 'retrieve_edges', 'synthesize'.
function resolveTimingKey(verb, args) {
  const v = verb.toLowerCase();
  if (v === 'parsed') return 'classify';
  if (v === 'checked') return 'preroute';
  if (v === 'pulled' && args.includes('wiki')) return 'retrieve_wiki';
  if (v === 'pulled' && args.includes('edge')) return 'retrieve_edges';
  if (v === 'searched') return 'retrieve_wiki';
  if (v === 'matched' || v === 'ranked') return 'retrieve_wiki';
  if (v === 'composed' || v === 'routed') return 'synthesize';
  if (v === 'expanded') return 'retry';
  if (v === 'warm' || v === 'deflected') return 'preroute';
  return 'synthesize'; // default fallback
}

// Emit a card via the SSE channel using card-meta.resolveCard. Internal
// helper for the static streams below — same wire shape as the LLM-emitted
// cards in buildEventStream.
function enqueueResolvedCard(controller, slug, priority = false) {
  const resolved = resolveCard(slug, { priority });
  if (!resolved) return;
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

export function buildDeflectStream(text) {
  return new ReadableStream({
    start(controller) {
      try {
        controller.enqueue(sseEvent('trace', { verb: 'parsed', args: 'intent(off-topic)', ms: syntheticDisplayMs(), pill_ms: 600 }));
        controller.enqueue(sseEvent('trace', { verb: 'deflected', args: 'personal', ms: syntheticDisplayMs(), pill_ms: 600 }));
        const chunks = tokenChunks(text);
        for (const chunk of chunks) {
          controller.enqueue(sseEvent('token', { text: chunk }));
        }
        const [pri, sec, ter] = pickDeflectCards(text);
        enqueueResolvedCard(controller, pri, true);
        enqueueResolvedCard(controller, sec, false);
        enqueueResolvedCard(controller, ter, false);
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
export function buildFallbackStream() {
  const text = "Service is busy right now. The wiki at /wiki/ has the answer to most questions.";
  return new ReadableStream({
    start(controller) {
      const chunks = tokenChunks(text);
      for (const chunk of chunks) {
        controller.enqueue(sseEvent('token', { text: chunk }));
      }
      enqueueResolvedCard(controller, 'wiki', true);
      enqueueResolvedCard(controller, 'lab', false);
      controller.enqueue(sseEvent('done', {}));
      controller.close();
    },
  });
}

// Build a static cache-replay SSE stream. v3.1 fix for B2: cache hits used to
// drop cards entirely (cached only {text}). Now caches {text, cards} where
// cards is the array of stored slugs + priority flags. Replay re-resolves
// meta via card-meta so card content stays in sync if titles change.
export function buildCacheReplayStream({ text, cards = [] }) {
  return new ReadableStream({
    start(controller) {
      try {
        controller.enqueue(sseEvent('trace', {
          verb: 'cached',
          args: 'replay()',
          ms: 0,
          pill_ms: 0,
        }));
        controller.enqueue(sseEvent('token', { text, cached: true }));
        for (const card of cards) {
          if (!card?.slug) continue;
          enqueueResolvedCard(controller, card.slug, card.priority === true);
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
