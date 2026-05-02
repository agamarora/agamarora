// ssestream.mjs
//
// SSE encoder for /enter v3 structured event shape.
//
// Event types (per enter-v3.md §3 Architecture):
//   trace  — { verb, args, ms }          one per trace line
//   token  — { text }                    one per word-chunk of answer
//   card   — { slug, type, priority }    one per card
//   done   — {}                          stream sentinel
//   error  — { message }                 error event
//
// The handler calls buildEventStream(parsedJson, timings) which returns a
// ReadableStream<Uint8Array> emitting SSE bytes.
//
// Per phase-d-decisions-2026-04-27.md Decision 3 (1-call structured output),
// Decision 16 (server stamps real ms), Decision 17 (pill animation from server).

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

        // --- Card events ---
        // NOTE: inner key is `kind` (not `type`) to avoid collision with the
        // outer SSE event-type wrapper. sseEvent serializes as
        //   {type, ...data}
        // and a spread named `type` would silently overwrite the event-type,
        // which broke the frontend's `t === 'card'` matching for ages.
        for (const card of cards) {
          if (!card?.slug) continue;
          controller.enqueue(sseEvent('card', {
            slug: card.slug,
            kind: card.type || card.kind || 'page',
            priority: card.priority === true || card.priority === 'true',
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

// Build a static deflect SSE stream (no LLM call).
export function buildDeflectStream(text) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(sseEvent('trace', { verb: 'parsed', args: 'intent(off-topic)', ms: syntheticDisplayMs(), pill_ms: 600 }));
      controller.enqueue(sseEvent('trace', { verb: 'deflected', args: 'personal', ms: syntheticDisplayMs(), pill_ms: 600 }));
      const chunks = tokenChunks(text);
      for (const chunk of chunks) {
        controller.enqueue(sseEvent('token', { text: chunk }));
      }
      controller.enqueue(sseEvent('card', { slug: 'lab', kind: 'page', priority: true }));
      controller.enqueue(sseEvent('card', { slug: 'resume', kind: 'page', priority: false }));
      controller.enqueue(sseEvent('done', {}));
      controller.close();
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
      controller.enqueue(sseEvent('card', { slug: 'lab', kind: 'page', priority: true }));
      controller.enqueue(sseEvent('done', {}));
      controller.close();
    },
  });
}
