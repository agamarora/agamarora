// groqHandler.mjs
//
// /enter v3 backend — Lane A integration.
//
// FLOW
//   request
//     → CORS + method guard
//     → input validation (length, history)
//     → injection filter
//     → timing.now() starts
//     → route() = preRoute() ?? classify()          [D-1 / Decision 4+5]
//     → deflect short-circuit  →  buildDeflectStream()
//     → D-3: wiki extract retrieval for matched themes
//     → D-3a: KG edge retrieval for synthesis intent
//     → D-2: build v3 system prompt (stable prefix + dynamic suffix)
//     → D-4: invokeSynthesisJson() — 1-call structured output
//     → D-9a: confidence retry (synthesis intent + answer.length < 80 → retry once)
//     → server stamps real timings into trace events  (Decision 16)
//     → buildEventStream() → SSE  (trace / token / card / done)
//
// SSE shape (v3 — enter/index.html v3 consumer):
//   data: {"type":"trace","verb":"...","args":"...","ms":42,"pill_ms":600}\n\n
//   data: {"type":"token","text":"..."}\n\n
//   data: {"type":"card","slug":"...","type":"page","priority":false}\n\n
//   data: {"type":"done"}\n\n
//
// Per phase-d-decisions-2026-04-27.md Decisions 1-18.

import { invokeSynthesisJson } from './lib/llm-pool.mjs';
import { route } from './lib/classifier.mjs';
import {
  ALLOWED_ORIGINS,
  MAX_INPUT_LENGTH,
  MAX_HISTORY_TURNS,
  MAX_HISTORY_CHARS,
  RETRY_THRESHOLD,
  MAX_SYNTH_RETRIES,
  MAX_SYNTH_TOKENS,
  MIN_PILL_DURATION_MS,
} from './lib/constants.mjs';
import { measure, now } from './lib/timing.mjs';
import {
  getThemeExtract,
  getEdgesForThemes,
  formatEdgesForPrompt,
  wikiDiagnostics,
} from './lib/wiki-retrieval.mjs';
import { buildEventStream, buildDeflectStream, buildFallbackStream } from './lib/ssestream.mjs';
import {
  BANNED_USER_FACING_TERMS,
  BANNED_LLM_ISMS,
  BANNED_OPENERS,
  BANNED_TRACE_VERBS,
} from './lib/voice-rules.mjs';
// Lane B defense layer: UA gate, dup cache, rate limit, injection filter.
// Single defend() call at top of handler short-circuits abusive requests
// before they hit the LLM pool. dupCacheLookup/dupCacheStore wrap synthesis.
import { defend, dupCacheLookup, dupCacheStore, getClientIP, isInjectionAttempt } from './lib/defense.mjs';

// ---- D-2: System prompt v3 (stable prefix) -----------------------------------
//
// STATIC PREFIX — goes first in messages[] for cache-friendly ordering.
// Provider caches (Groq, Mistral) benefit from a stable prefix. This block
// never changes between requests. Dynamic content (retrieved context, query
// restatement) is appended as a trailing user/system message.
//
// Voice rules are imported from lib/voice-rules.mjs (CQ-1) and injected
// at build-time (below) so there's one source of truth.

const BANNED_TERMS_INLINE = [
  ...BANNED_USER_FACING_TERMS,
  ...BANNED_LLM_ISMS,
].join(', ');

const BANNED_OPENERS_INLINE = BANNED_OPENERS.join(' / ');

const SYSTEM_PROMPT_STABLE = `You are the voice of agamarora.com, an AI agent that answers questions about Agam Arora for recruiters, engineers, and curious visitors. You translate Agam's story into plain English. The wiki content injected below is the source of truth; generate answers from it.

## IDENTITY + PERSONA
- You are the agent. You speak ABOUT Agam in third person. Never "I", "me", "my", "I'll", "I'm".
- Proper nouns: Agam, AIonOS, FarEye, UKG, ANALYZE, Shararat, Claude Code, Anthropic.
- You are calm, direct, and concrete. No hype. No hedging.

## VOICE RULES (locked voice-spec §11, 2026-04-27)
- 70 words max per answer. 1-3 sentences when possible.
- Normal sentence case. No markdown, no bullets, no headers, no emojis.
- Plain English over insider terms. Translate before using: no "thesis", "manifesto", "corpus", "ontology", "atlas", "lens" (building/serving), "supersedes", "contradicts", "builds-on", "synthesis", "retrieval", "classification", "edges" - unless you define inline first.
- Concrete numbers + named products beat abstract claims. If a number is in the context, use it.
- Show the evidence: "At AIonOS, all enterprise voice traffic runs through APIs: 4 million calls a year" beats "he has a strong agent-first view".
- Date framing: never drop a naked date. Either frame it ("back in 2023") or cut it.
- Third person always for facts about Agam.
- Greetings (hi / hey / hello / sup / yo / test): ONE short greeting line. No bio.

## BANNED WORDS + PHRASES
Never use in user-facing answers: ${BANNED_TERMS_INLINE}
Never open with: ${BANNED_OPENERS_INLINE}
Never use em-dashes. Use colon ("title: explanation"), hyphen-with-spaces for asides.

## STRUCTURED OUTPUT FORMAT
Respond ONLY with valid JSON. No prose outside the JSON object.

{
  "trace": [
    { "verb": "parsed", "args": "intent(synthesis) themes=[agent-first] conf=0.87" },
    { "verb": "pulled", "args": "wiki(agent-first, 1842 chars)" },
    { "verb": "pulled", "args": "edges(agent-first→supersedes, 4)" },
    { "verb": "composed", "args": "answer()" }
  ],
  "answer": "...",
  "cards": [
    { "slug": "wiki/agent-first", "type": "page", "priority": true },
    { "slug": "lab", "type": "page", "priority": false }
  ]
}

## TRACE RULES
- trace[] contains 2-5 objects: { "verb": string, "args": string }
- Allowed verbs: parsed, pulled, matched, checked, composed, routed, expanded, warm, deflected, searched, ranked
- Args are plain-English compact: "intent(synthesis) themes=[agent-first]", "wiki(agent-first, 1842 chars)", "edges(agent-first→supersedes, 4)"
- Banned trace verbs: ${BANNED_TRACE_VERBS.join(', ')}
- Do NOT include latency ms in trace: the server stamps real ms.
- Trace must be accurate to what happened: only include verbs for steps that actually ran.

## CARD RULES
- cards[] contains 0-3 objects: { "slug": string, "type": "page"|"wiki", "priority": boolean }
- slug is a URL path without leading slash: "wiki/agent-first", "lab", "resume"
- priority: true = gold-stripe card, rendered first. At most ONE priority=true per response.
- Card title is action-shaped (NOT a label): "Read the full take" not "Agent-first thesis"
- Include cards only when they genuinely help. Zero cards is valid for conversational replies.

## ANSWER RULES
- answer: plain English, 70 words max, 1-3 sentences.
- For greetings: one short line. No bio.
- For factual questions (dates, roles, numbers, companies, degrees): state the fact plainly.
- For vague asks ("tell me about him", "who is he"): current role + years of experience + one memorable fact.
- For synthesis questions: lead with the concrete claim, add evidence (number or named product), optional card.
- Generic concept questions: one line on the concept, then how Agam has applied it.
- Opinions grounded in the retrieved wiki content are fair. Never invent facts not in the context.
- If a fact isn't in the context, say you don't have it. Don't fill with hallucinated details.

## DEFLECT RULES
Deflect ONLY for: personal life not on the resume, future predictions, politics or religion, truly off-topic.
Deflect with dry wit. Never say "memory banks".
Deflect examples: "Not on the resume. Ask about what he's built." / "That one's personal. Try a product question." / "Above this terminal's pay grade."

## GROUND TRUTH: AGAM'S STORY

Agam Arora. AI Product Manager by designation, engineer and marketer by education, builder by disposition. Based in India. 12 years shipping products across analytics, gaming, beauty tech, logistics, and AI.
Education: MBA in Marketing from FORE School of Management, New Delhi (2012-2014). B.Tech in Computer Science from B.M. Institute of Engineering & Technology (2008-2012).
Top skills: go-to-market strategy, cross-functional collaboration, program management. Languages: English, Hindi.

Career (most recent first):
AIonOS: AVP, AI Product Management (Nov 2025-present). Scaling a multi-channel, multi-modal, multi-lingual, context-sensitive CX platform.
UKG: Senior Principal PM (Sep-Nov 2025, Noida). Short stint on Forecasting and Planning in PRO WFM. Exited to return to AIonOS.
AIonOS: Lead PM, Data & AI (May 2024-Aug 2025). 3 enterprise deals >$1.5M in year one. 15+ AI POCs across voice, RAG, and agentic systems. Led cross-functional team of 15 on a vertical Voice AI platform: 4M+ annual calls at 50% lower cost per minute. Ran discovery with 50+ travel agents for a Travel-first AI-native CRM+CDP (sponsored by a $5B travel tech enterprise).
FarEye: Lead PM (Dec 2020-May 2024). 10x scale transformation of the data platform: 23% cost reduction, data go-live cut from 60 days to 7. NPS for reliability: 3.6 to 4.7. Delivery tracking algorithm: 11% less battery, 6x accuracy.
Aagaman Consulting: Product & Program Consultant (Jun 2018-Dec 2020). Advised Canadian VC-backed startups. $500K+ raised.
Blossom Kochhar Beauty Products (Aroma Magic): Manager, New Business Dev (Jul 2018-Dec 2019). 70% partner conversion. +INR 250K contract value per account. 15% cost reduction via digitization.
V2 Games: Studio Head (Jan 2016-May 2018). $0 to $75K ARR, team of 18. Indie Game of the Year 2017.
Absolutdata Analytics: Analyst (Apr 2014-Dec 2015). Data analytics and market research.

What he cares about: taste, craft, and shipping things people actually use. Products that respect both the technology and the user. Lives in an AI-native workflow. This website was built entirely with Claude Code.

Pages:
- /resume: full resume
- /lab: open source projects and experiments
- /lab/ai-resume: the open source AI resume template he built
- /wiki: authored knowledge atlas (10 themes)
- /wiki/graph: constellation graph view of the wiki
- https://github.com/agamarora: GitHub
- https://shararat.agamarora.com: Shararat Voice AI demo

When a page would genuinely help, include it as a card slug. Max one priority card per reply. Never force a card.

## FEW-SHOT EXAMPLES (target answer shape)

Q: "What does Agam think about agents?"
CORRECT answer: "AI agents now read websites and call APIs the same way humans use apps. Most products only design for the human visitor. He thinks that's already obsolete: design for the agent too, or sometimes the agent first. At AIonOS, all enterprise voice traffic runs through APIs, not a UI."
WRONG answer: "Agam has a strong agent-first thesis that he articulated as a lens for building and serving."

Q: "How long has Agam been in AI?"
CORRECT answer: "12 years across six companies, five industries. Currently AVP AI Products at AIonOS, leading a multi-channel CX platform: 4 million voice calls a year in production."
WRONG answer: "Agam has been passionately working in the innovative field of AI for over a decade, leveraging his comprehensive skillset."

Q: "What did he do at FarEye?"
CORRECT answer: "Lead PM for four and a half years. He rebuilt the data platform from scratch: cut go-live from 60 days to 7, reduced costs 23%, lifted reliability NPS from 3.6 to 4.7."
WRONG answer: "At FarEye, Agam significantly impacted the data platform, demonstrating his proven track record."

When history exists, build on the thread: reference what was just said, add a new angle, do not repeat.`;

const SYSTEM_REMINDER = `Reply in plain English, 1-3 sentences, 70 words max. Third person only. No markdown. Use concrete numbers from the context. No banned terms (leveraging, innovative, passionate, driven, synergy, cutting-edge, robust, empower, delve, comprehensive, game-changer, dynamic, exceptional). Return valid JSON only: {"trace":[...],"answer":"...","cards":[...]}.`;

// ---- CORS + helpers ----------------------------------------------------------

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

// Injection check delegated to defense.mjs (single source of truth).
// isInjectionAttempt imported above — no local duplicate needed.

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

// SSE response factory.
// Lane A v3 emits structured events via buildEventStream (ssestream.mjs);
// this helper wraps the resulting ReadableStream with the SSE headers.
// Lane B's v2 toV2Sse wrapper was dropped — v3 path no longer wraps a raw
// text stream. Dup cache wiring moved into the synthesis flow directly.
function sseResponse(stream, origin) {
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

// ---- D-3: build dynamic prompt suffix ----------------------------------------
//
// The stable SYSTEM_PROMPT_STABLE is the static prefix. Dynamic context
// (retrieved wiki + edges + the actual question) is appended as a user message.
// This ordering maximizes cache hit potential for providers with prefix caching.

function buildDynamicContext({ routeDecision, wikiExtracts, edges }) {
  const parts = [];

  // Retrieved wiki content
  if (wikiExtracts && wikiExtracts.length > 0) {
    parts.push('## RETRIEVED WIKI CONTEXT');
    for (const { slug, extract } of wikiExtracts) {
      parts.push(`### Theme: ${slug}\n${extract}`);
    }
  }

  // Retrieved KG edges
  if (edges && edges.length > 0) {
    const edgesText = formatEdgesForPrompt(edges);
    if (edgesText) {
      parts.push('## RETRIEVED RELATIONSHIP CONTEXT (KG edges)');
      parts.push(edgesText);
    }
  }

  // Route context hint
  if (routeDecision?.type) {
    parts.push(`## ROUTING CONTEXT\nintent: ${routeDecision.type} | themes: ${(routeDecision.themes_likely || []).join(', ') || 'none'} | confidence: ${routeDecision.confidence ?? 'n/a'}`);
  }

  return parts.join('\n\n');
}

// ---- Handler -----------------------------------------------------------------

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

    // D-5: Abuse defense (UA gate, input validation, injection filter, rate limit).
    // Single call; returns Response (early exit) or null (proceed).
    const defended = await defend(request, body);
    if (defended) return defended;

    let input = String(body.prompt || '').trim();

    if (!input) return json({ error: 'Empty input' }, 400, origin);
    if (input.length > MAX_INPUT_LENGTH) input = input.slice(0, MAX_INPUT_LENGTH);

    if (isInjectionAttempt(input)) {
      return json({ result: "Nice try. I don't break that easily." }, 200, origin);
    }

    // Pipeline timing state (Decision 16 — server stamps real ms per step)
    const timings = {};

    // ---- D-5: Duplicate-query cache check ------------------------------------
    //
    // Lane B defense layer. If the same IP+input lands within the LRU window,
    // we re-emit the cached response as a v3 SSE stream. Lane A's structured
    // output is cacheable as a single answer-text payload. Cards/trace events
    // are regenerated synthetically so the client UX still looks streamed.
    const ip = getClientIP(request);
    const { hit, body: cachedBody, key: dupKey } = dupCacheLookup(ip, input);
    if (hit && cachedBody) {
      console.log('[defense] dup_cache_returning', { ip, key: dupKey });
      try {
        const parsed = JSON.parse(cachedBody);
        const cachedText = parsed.text || '';
        const enc = new TextEncoder();
        const cachedStream = new ReadableStream({
          start(controller) {
            // Emit a single composed-trace marker + the answer + done.
            // Marked cached:true so the client/eval can detect it.
            controller.enqueue(enc.encode(
              `data: ${JSON.stringify({ type: 'trace', verb: 'cached', args: 'replay()', ms: 0, pill_ms: 0 })}\n\n`
            ));
            controller.enqueue(enc.encode(
              `data: ${JSON.stringify({ type: 'token', text: cachedText, cached: true })}\n\n`
            ));
            controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
            controller.close();
          },
        });
        return new Response(cachedStream, {
          status: 200,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Cache': 'HIT',
            ...corsHeaders(origin),
          },
        });
      } catch {
        // Cached body malformed — fall through to fresh synthesis
      }
    }

    // ---- Routing (D-1: preRoute + classify) ----------------------------------
    let routeDecision;
    const { result: rd, ms: routeMs } = await measure('route', async () => {
      try {
        return await route(input);
      } catch (err) {
        console.warn('[handler] route error', err?.message || err);
        return { type: 'lookup', confidence: 0, themes_likely: [], route_reason: 'route_threw' };
      }
    });
    routeDecision = rd;
    timings['preroute'] = routeMs;
    timings['classify'] = routeMs; // same step; trace resolves classify → preroute bucket

    console.log('[route]', JSON.stringify({
      type: routeDecision.type,
      reason: routeDecision.route_reason,
      themes: routeDecision.themes_likely,
      conf: routeDecision.confidence,
    }));

    // ---- Deflect short-circuit -----------------------------------------------

    if (routeDecision.type === 'deflect') {
      const text = "Not on the resume. Ask about what he's built.";
      // Cache deflect responses — they're deterministic and cheap to replay.
      dupCacheStore(dupKey, JSON.stringify({ text }));
      return sseResponse(buildDeflectStream(text), origin);
    }

    // ---- D-3: Wiki retrieval -------------------------------------------------

    const themes = Array.isArray(routeDecision.themes_likely) ? routeDecision.themes_likely : [];
    const wikiExtracts = [];
    let retrieveWikiMs = 0;

    if (themes.length > 0) {
      const { result: extracts, ms: wMs } = await measure('retrieve_wiki', async () => {
        const out = [];
        for (const slug of themes.slice(0, 3)) { // cap at 3 themes for token budget
          const extract = getThemeExtract(slug);
          if (extract) out.push({ slug, extract });
        }
        return out;
      });
      wikiExtracts.push(...extracts);
      retrieveWikiMs = wMs;
      timings['retrieve_wiki'] = wMs;
    }

    // ---- D-3a: KG edge retrieval (synthesis intent only) ----------------------

    let edges = [];
    let retrieveEdgesMs = 0;

    if (routeDecision.type === 'synthesis' && themes.length > 0) {
      const { result: e, ms: eMs } = await measure('retrieve_edges', async () => {
        return getEdgesForThemes(themes);
      });
      edges = e;
      retrieveEdgesMs = eMs;
      timings['retrieve_edges'] = eMs;
    }

    // ---- D-2: Build messages (stable prefix + dynamic suffix) ----------------

    const dynamicContext = buildDynamicContext({ routeDecision, wikiExtracts, edges });
    const history = clampHistory(body.history);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT_STABLE },
    ];

    // Inject history
    for (const msg of history) messages.push(msg);

    // Dynamic context as a system message appended after history
    // (stable prefix stays cacheable; dynamic content is always at the tail)
    if (dynamicContext) {
      messages.push({ role: 'system', content: dynamicContext });
    }

    messages.push({ role: 'user', content: input });
    messages.push({ role: 'system', content: SYSTEM_REMINDER });

    // ---- D-4: Single-call structured output (Decision 3) ---------------------

    const { result: synthResult, ms: synthMs } = await measure('synthesize', async () => {
      return invokeSynthesisJson({ messages, temperature: 0.7, maxTokens: MAX_SYNTH_TOKENS });
    });

    timings['synthesize'] = synthMs;

    let { json: parsed, providerKeyId, modelUsed, wallClockMs } = synthResult;

    console.log('[synthesize]', JSON.stringify({
      provider: providerKeyId,
      model: modelUsed,
      wallClockMs,
      answerLen: parsed?.answer?.length ?? 0,
      traceCount: parsed?.trace?.length ?? 0,
      cardCount: parsed?.cards?.length ?? 0,
    }));

    // ---- D-9a: Confidence retry (Decision 15 + 18) ---------------------------
    //
    // If intent=synthesis AND answer.length < RETRY_THRESHOLD (80 chars),
    // fire ONE expand call BEFORE opening SSE stream. Zero user-visible artifact.
    // Bounded: MAX_SYNTH_RETRIES (1). Does not fire for lookup/bio/deflect.

    const isSynthesisIntent = routeDecision.type === 'synthesis';
    const answerTooShort = typeof parsed?.answer === 'string' && parsed.answer.length < RETRY_THRESHOLD;
    const originalAnswerLen = parsed?.answer?.length ?? 0;

    if (isSynthesisIntent && answerTooShort) {
      console.warn('[D-9a] confidence retry triggered', {
        answerLen: originalAnswerLen,
        threshold: RETRY_THRESHOLD,
      });

      // Build expand messages: append the short answer + retry instruction
      const retryMessages = [
        ...messages,
        {
          role: 'assistant',
          content: JSON.stringify(parsed),
        },
        {
          role: 'user',
          content: 'Your answer is too short. Expand the "answer" field with concrete details from the retrieved context. Return the same JSON structure with a fuller answer (at least 80 characters). Keep trace and cards as-is unless the answer needs a new card.',
        },
      ];

      const { result: retryResult, ms: retryMs } = await measure('retry', async () => {
        return invokeSynthesisJson({ messages: retryMessages, temperature: 0.5, maxTokens: MAX_SYNTH_TOKENS });
      });

      timings['retry'] = retryMs;

      if (retryResult?.json?.answer && retryResult.json.answer.length > parsed.answer.length) {
        // Merge: take expanded answer + add expanded trace verb
        const expandedJson = retryResult.json;

        // Append an "expanded" trace verb to signal the retry happened
        const expandedTrace = [
          ...(Array.isArray(expandedJson.trace) ? expandedJson.trace : (parsed.trace || [])),
          {
            verb: 'expanded',
            args: `answer(${parsed.answer.length}→${expandedJson.answer.length} chars)`,
          },
        ];

        parsed = {
          trace: expandedTrace,
          answer: expandedJson.answer,
          cards: expandedJson.cards || parsed.cards,
        };

        console.log('[D-9a] retry accepted', {
          originalLen: originalAnswerLen,
          expandedLen: retryResult.json.answer.length,
          retryMs,
        });
      } else {
        console.warn('[D-9a] retry did not improve answer, using original');
      }
    }

    // ---- D-4 + Decision 16: Build SSE event stream ---------------------------
    //
    // buildEventStream() splices real timings into trace events (Decision 16).
    // Pill animation uses max(realMs, MIN_PILL_DURATION_MS) (Decision 17).

    const sseStream = buildEventStream(parsed, timings, MIN_PILL_DURATION_MS);

    // Log wiki diagnostics for observability
    const diag = wikiDiagnostics();
    console.log('[wiki]', JSON.stringify({
      ...diag,
      themes_requested: themes,
      extracts_returned: wikiExtracts.length,
      edges_returned: edges.length,
    }));

    // D-5: store synthesis result in dup cache so identical follow-ups replay
    // instead of burning another LLM call. Cache only the answer text — cards
    // and trace events are regenerated synthetically on cache hit (see top of
    // handler). Wrapped in try-block so cache write failure never breaks the
    // response.
    try {
      if (parsed?.answer) {
        dupCacheStore(dupKey, JSON.stringify({ text: parsed.answer }));
      }
    } catch (err) {
      console.warn('[defense] dup_cache_store failed', err?.message || err);
    }

    return sseResponse(sseStream, origin);

  } catch (error) {
    console.error('[handler] fatal error:', error?.message || error);
    return sseResponse(buildFallbackStream(), origin);
  }
}
