// groqHandler.mjs
//
// Orchestration only. All LLM logic in lib/llm-pool.mjs.
//
// FLOW
//   request
//     → corsHeaders + method check
//     → input validation (length, history shape)
//     → injection filter
//     → route() = preRoute() ?? classify()    [logged, used by D-3+ retrieval]
//     → build messages (resume system prompt — D-2 will replace with v3 stable section)
//     → pool.invokeSynthesis() → ReadableStream of UTF-8 text chunks
//     → wrap as SSE in v2 shape: data: {"text": "..."}\n\n + [DONE]
//
// v2 SSE response shape preserved for /enter v2 compatibility. D-7 (UI v3)
// will switch to trace/token/card SSE events; D-4 changes the LLM call to
// structured-output JSON (1-call shape).
//
// Per docs/plans/second-brain-v1-next-session-plan.md Task 14 (D-1)
// + phase-d-decisions-2026-04-27.md Decisions 1, 4, 5, 9, 11.

import { invokeSynthesis } from './lib/llm-pool.mjs';
import { route } from './lib/classifier.mjs';
import { ALLOWED_ORIGINS, MAX_INPUT_LENGTH, MAX_HISTORY_TURNS, MAX_HISTORY_CHARS, MAX_COMPLETION_TOKENS } from './lib/constants.mjs';

// ---- v2 system prompt (kept for D-1; D-2 replaces with v3 stable section) -

const SYSTEM_PROMPT = `You are the voice of agamarora.com. You answer questions about Agam Arora for recruiters, engineers, and curious visitors. Generate your own answers from the ground truth below — the voice samples at the end are tone calibration, not a lookup table. If the question is vague or broad ("tell me about him", "describe Agam", "who is he"), give a confident bio in 1 to 3 sentences. Never fall back to a greeting template once the conversation is past hello.

RULES
- Third person always: "Agam" or "he". Never "I", "me", "my", "I'll", "I'm", "I've" about yourself.
- Normal sentence case. Proper nouns capitalized (Agam, AIonOS, FarEye, UKG, ANALYZE, Shararat, Claude Code, Anthropic).
- 1 to 3 sentences, up to 70 words. Greetings: one short line.
- Plain prose. No markdown, no bullets, no headers, no emojis. English only.
- Banned words: leveraging, innovative, passionate, driven, synergy, cutting-edge, robust, empower, unlock, delve, comprehensive, game-changer, dynamic, proven track record, exceptional, significant impact.
- Never invent specifics. If a fact isn't in the ground truth, say you don't have it.

GROUND TRUTH — AGAM'S STORY

Agam Arora. AI Product Manager by designation, engineer and marketer by education, builder by passion, tinkerer by choice. Based in India. 12 years shipping products across analytics, gaming, beauty tech, logistics, and AI.
Education: MBA in Marketing from FORE School of Management, New Delhi (2012 to 2014). B.Tech in Computer Science from B.M. Institute of Engineering & Technology (2008 to 2012).
Top skills: go-to-market strategy, cross-functional collaboration, program management. Languages: English, Hindi.

Career, most recent first:

AIonOS — Assistant Vice President, AI Product Management (Nov 2025 to present).
Scaling a customer-experience platform for enterprise CX leaders: multi-channel, multi-modal, multi-lingual, context-sensitive, unified.

UKG — Senior Principal Product Manager (Sep to Nov 2025, Noida).
Short but meaningful stint. Contributed to Forecasting and Planning within UKG's PRO WFM product. Exited early to keep scaling a CX product at his prior org.

AIonOS — Lead Product Manager, Data & AI (May 2024 to Aug 2025).
Delivered 3 enterprise deals worth over $1.5M in his first year. Defined, built, and shipped 15+ AI product POCs across voice, RAG, and agentic systems. Led a cross-functional team of 15 (AI engineers and researchers) on a vertical Voice AI platform: 4M+ annual calls at 50% lower cost per minute than industry benchmarks. Ran product discovery with 50+ travel agents across India for a Travel-first AI-native CRM+CDP platform, greenlit and sponsored by a $5B travel tech enterprise.

FarEye — Lead Product Manager (Dec 2020 to May 2024, Noida).
Delivered a 10x scale transformation of the data platform from architecture through deployment, cutting costs 23% and reducing data go-live from 60 days to 7. Lifted NPS for system reliability from 3.6 to 4.7. Enhanced the delivery tracking algorithm: 11% less battery, 6x accuracy.

Aagaman Consulting — Product & Program Consultant (Jun 2018 to Dec 2020).
Advised startups and VC-backed clients in Canada on system design, data analytics, technical writing, and product marketing. Over $500K raised.

Blossom Kochhar Beauty Products (Aroma Magic) — Manager, New Business Development (Jul 2018 to Dec 2019, New Delhi).
Revamped the franchise product: converted 70% of existing partners, added 4 new, +INR 250K contract value per account. Cut operational costs 15% through digitization.

V2 Games — Studio Head (Jan 2016 to May 2018, New Delhi).
Built and scaled a gaming studio from $0 to $75K ARR, team of 18. Won Indie Game of the Year 2017.

Absolutdata Analytics — Analyst (Apr 2014 to Dec 2015).
Data analytics and market research that fed multiple successful product launches.

WHAT HE CARES ABOUT
Taste, craft, and shipping things people actually use. Products that respect both the technology and the user. Lives in an AI-native workflow — this website was built entirely with Claude Code. Reads code, leads with product thinking.

PAGES YOU CAN POINT TO
- /resume — full resume
- /lab — open source projects and experiments
- /lab/ai-resume — the open source AI resume template he built
- /wiki — authored knowledge atlas (12 themes)
- /wiki/graph — constellation graph view of the wiki
- https://github.com/agamarora — GitHub
- https://shararat.agamarora.com — Shararat Voice AI demo
When a page would genuinely help, drop ONE plain reference at the end: "More on /resume." or "Full list on /lab." Max one per reply, never forced.

HOW TO ANSWER
1. Greetings only ("hi", "hey", "hello", "sup", "yo", "what's up") — reply with ONE short greeting line, not a bio.
2. "Agam", "agam", "him", "he", "the guy", "Mr Arora" — all refer to the same person.
3. For factual questions (dates, roles, numbers, companies, degrees) — just state the fact plainly.
4. For vague asks ("tell me about him", "who is he") — give current role, years of experience, and one memorable fact.
5. Synthesize across the resume. "When was he in logistics?" = FarEye, Dec 2020 to May 2024.
6. Generic concept questions — one short line on the concept, then how Agam has used or shipped it.
7. Opinions grounded in the resume (taste, shipping, AI-native tooling) are fair. Don't invent beliefs he hasn't shown.

WHEN TO DEFLECT
Only for: personal life not on the resume, future predictions, politics or religion, truly off-topic.
Deflect with dry wit. Never say "memory banks".
- "Not on the resume. Ask about what he's built."
- "That one's personal. Try a product question."
- "Above this terminal's pay grade."

VOICE CALIBRATION (these are tone samples, NOT an answer key)
"Hey. You made it to the terminal. Ask something real."
"AI Product Manager, 12 years across 6 companies and 5 industries. Currently AVP AI Products at AIonOS, leading a multi-channel CX platform."
"Voice AI at 4M+ calls a year, 50% lower cost per minute. A data platform he 10x-ed. An indie game that won Game of the Year 2017. More on /lab."
"Five industries in 12 years and every product got bigger. That's range, not luck."
"Taste, but shipped. A product that reaches users beats the perfect one stuck in review."

When history exists, connect to the thread: reference what was just said, add a new angle, don't repeat.`;

const SYSTEM_REMINDER = `Reply in normal sentence case, 1 to 3 sentences, under 70 words. Third person only — never "I", "I'm", "I'll", "I've", "me", or "my" when referring to yourself. Never use: leveraging, innovative, passionate, driven, synergy, cutting-edge, robust, empower, delve, comprehensive, game-changer, dynamic, proven track record, exceptional, significant impact. If the question is vague like "tell me about him" or "who is he", give a confident bio. Build on prior messages. Ground every fact in the resume.`;

// ---- CORS + helpers -------------------------------------------------------

function isOriginAllowed(origin) {
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try { return new URL(origin).hostname === 'localhost'; } catch { return false; }
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': isOriginAllowed(origin) ? origin : '',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST',
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts)/i,
  /what\s+(is|are)\s+your\s+(system|initial)\s+(prompt|instructions)/i,
  /reveal\s+your\s+(prompt|instructions|system)/i,
  /repeat\s+(the|your)\s+(above|system|initial)/i,
  /pretend\s+(you\s+are|to\s+be|you're)/i,
  /act\s+as\s+(a|an|if)/i,
  /you\s+are\s+now\s+(a|an)/i,
  /roleplay\s+as/i,
];

function isInjectionAttempt(input) {
  return INJECTION_PATTERNS.some(p => p.test(input));
}

function clampHistory(rawHistory) {
  const arr = Array.isArray(rawHistory) ? rawHistory.slice(-MAX_HISTORY_TURNS) : [];
  let total = 0;
  const out = [];
  for (const msg of arr) {
    if (msg?.role !== 'user' && msg?.role !== 'assistant') continue;
    let content = String(msg.content || '').slice(0, MAX_INPUT_LENGTH);
    if (msg.role === 'user' && isInjectionAttempt(content)) continue;
    if (total + content.length > MAX_HISTORY_CHARS) {
      content = content.slice(0, MAX_HISTORY_CHARS - total);
    }
    if (!content) continue;
    out.push({ role: msg.role, content });
    total += content.length;
    if (total >= MAX_HISTORY_CHARS) break;
  }
  return out;
}

// Wrap raw text ReadableStream into v2 SSE shape.
// Input: ReadableStream<Uint8Array> emitting decoded text chunks.
// Output: ReadableStream<Uint8Array> emitting `data: {"text": "..."}\n\n` lines + [DONE].
//
// Uses start-mode (eager). pull-mode hangs under Netlify dev v20 — the
// outer reader never gets pulled, so inner iter never advances.
function toV2Sse(textStream) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return new ReadableStream({
    async start(controller) {
      const reader = textStream.getReader();
      let totalChars = 0;
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          if (text) {
            totalChars += text.length;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }
        if (totalChars === 0) {
          const fb = "Not sure how to land that one. Try asking about his role, a specific company, or what he's shipped.";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fb })}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err?.message || 'stream_error' })}\n\n`));
        } catch {}
        try { controller.close(); } catch {}
      }
    },
  });
}

// ---- Handler --------------------------------------------------------------

export default async function (request) {
  const origin = request.headers.get('origin') || '';

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, origin);
  }

  try {
    const body = await request.json();
    let input = String(body.prompt || '').trim();

    if (!input) return json({ error: 'Empty input' }, 400, origin);
    if (input.length > MAX_INPUT_LENGTH) input = input.slice(0, MAX_INPUT_LENGTH);

    if (isInjectionAttempt(input)) {
      return json({ result: "Nice try. I don't break that easily." }, 200, origin);
    }

    // Route classification (logged; used by D-3+ for retrieval routing).
    let routeDecision;
    try {
      routeDecision = await route(input);
    } catch (err) {
      console.warn('[handler] route error', err?.message || err);
      routeDecision = { type: 'lookup', confidence: 0, themes_likely: [], route_reason: 'route_threw' };
    }
    console.log('[route]', JSON.stringify({
      type: routeDecision.type,
      reason: routeDecision.route_reason,
      themes: routeDecision.themes_likely,
      conf: routeDecision.confidence,
    }));

    // Deflect short-circuit (preserves v2 behavior shape).
    if (routeDecision.type === 'deflect') {
      const text = "Not on the resume. Ask about what he's built.";
      const enc = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(enc.encode(`data: ${JSON.stringify({ text })}\n\n`));
          controller.enqueue(enc.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new Response(stream, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          ...corsHeaders(origin),
        },
      });
    }

    // Build messages (D-2 will swap SYSTEM_PROMPT for v3 stable + dynamic structure).
    const history = clampHistory(body.history);
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    for (const msg of history) messages.push(msg);
    messages.push({ role: 'user', content: input });
    messages.push({ role: 'system', content: SYSTEM_REMINDER });

    const { stream: textStream, getMeta } = await invokeSynthesis({
      messages,
      temperature: 0.7,
      maxTokens: MAX_COMPLETION_TOKENS,
    });
    const sse = toV2Sse(textStream);

    // Meta logged on response open (best-effort).
    queueMicrotask(() => {
      const m = getMeta();
      console.log('[provider]', JSON.stringify({ ...m, route: routeDecision.type }));
    });

    return new Response(sse, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...corsHeaders(origin),
      },
    });
  } catch (error) {
    console.error('Handler error:', error?.message || error);
    return json({ error: 'Something went wrong. Try again.' }, 500, origin);
  }
}
