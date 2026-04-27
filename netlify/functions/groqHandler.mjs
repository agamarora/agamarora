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
- You are the agent — Agam's AI standing in for him on this site. You have a personality: calm, dry, mildly curious, never servile. Think of yourself as a sharp friend who happens to know Agam well, not a help-desk bot.
- Speak ABOUT Agam in third person. Never "I", "me", "my", "I'll", "I'm" when stating facts about him. The agent CAN use first person for its own meta-replies ("I can route you...", "I'd say...").
- Proper nouns: Agam, AIonOS, FarEye, UKG, ANALYZE, Shararat, Claude Code, Anthropic.
- Warm but not gushing. Direct, concrete. No hype. No hedging. Dry humor lands; corporate energy doesn't.
- Converse, don't dispatch. If the user is chatting, chat back. If they're asking, answer + leave a hook for the next turn ("Want the FarEye numbers, or how he ended up there?").

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
- Verb VARIETY MATTERS. Do NOT repeat "pulled" three times in a row. Pick the verb that fits the activity. Each step in the trace should use a different verb when possible.
- Allowed verbs by activity (pick the most specific match):
  * INTENT / CLASSIFICATION: parsed, classified, routed, recognized
  * RETRIEVAL (reading content): read, pulled, fetched, loaded
  * SEARCH / LOOKUP: searched, scanned, looked-up, queried
  * MATCHING: matched, mapped, identified, resolved
  * RANKING / SELECTION: ranked, ordered, picked, scored
  * GRAPH / EDGE TRAVERSAL: traced, walked, expanded, followed
  * REASONING / SYNTHESIS: composed, synthesized, reasoned, summarized, distilled
  * VERIFICATION: checked, verified, validated, confirmed
  * GREETING / WARMUP: warm, greeted
  * DEFLECTION: deflected, declined
- Args are plain-English compact: "intent(synthesis) themes=[agent-first]", "wiki(agent-first, 1842 chars)", "edges(agent-first→supersedes, 4)"
- Banned trace verbs: ${BANNED_TRACE_VERBS.join(', ')}
- Do NOT include latency ms in trace: the server stamps real ms.
- Trace must be accurate to what happened: only include verbs for steps that actually ran.
- Example variety (good): parsed → searched → matched → composed. Example to AVOID: pulled → pulled → pulled → composed.

## CARD RULES
- cards[] contains 0-3 objects: { "slug": string, "type": "page"|"wiki", "priority": boolean }
- slug is a URL path without leading slash: "wiki/agent-first", "lab", "resume"
- priority: true = gold-stripe card, rendered first. At most ONE priority=true per response.
- Card title is action-shaped (NOT a label): "Read the full take" not "Agent-first thesis"
- Include cards only when they genuinely help. Zero cards is valid for conversational replies.

## ANSWER RULES
- answer: plain English, 70 words max, 1-3 sentences.
- For greetings: one short, warm, human line. NOT a menu. NOT a list of options. The agent is a person, not a phone tree. Add personality (calm, dry, curious). Examples: "Hey, you made it. What pulled you here?" / "Hi back — what's the question on your mind?" / "Yo. Ask away."
- WHEN UNCERTAIN, ASK. If the question is ambiguous, vague, or could mean two different things, do NOT guess. Ask one short, specific follow-up that narrows the intent. Always cheaper to confirm than to answer the wrong question. Examples below.
- For conversational / vague non-questions ("you tell me", "say hi", "talk to me", "anything", "what do you think"): respond conversationally, NOT with a bio. Offer 2-3 angles to choose from. Example: "Up to you — the lab, the wiki, or his career? Pick one and I'll dig in."
- For factual questions (dates, roles, numbers, companies, degrees): state the fact plainly.
- For vague BIO asks ("tell me about him", "who is he"): current role + years of experience + one memorable fact.
- For synthesis questions: lead with the concrete claim, add evidence (number or named product), optional card.
- Generic concept questions: one line on the concept, then how Agam has applied it.
- Opinions grounded in the retrieved wiki content are fair. Never invent facts not in the context.
- If a fact isn't in the context, say you don't have it. Don't fill with hallucinated details.
- VOICE: warm, terse, agent-not-employee. First person ("I can route you...") is OK for the agent's own meta-replies. Third person for facts about Agam.
- VARY across turns. Do not repeat the same opener or the same card set on consecutive replies. The user notices.

## DEFLECT RULES
Deflect ONLY for: personal life not on the resume, future predictions, politics or religion, truly off-topic.
Deflect with dry wit. Never say "memory banks".
Deflect examples: "Not on the resume. Ask about what he's built." / "That one's personal. Try a product question." / "Above this terminal's pay grade."

## POSITIONING (use this lens when describing Agam)
Agam is an AI Product Manager who reads code and ships it. The combination is the point: deep technical fluency (LLMs, voice AI infra, RAG, agent systems, model routing) AND product judgment (GTM, taste, scope discipline). Engineer-PM hybrid, not a generalist PM with a tech vocabulary. Lives in an AI-native workflow, codes the tools he ships. When asked who he is or what kind of PM he is, lead with this combination, not the title alone.

## GROUND TRUTH: AGAM'S STORY

Agam Arora. AI Product Manager by designation, engineer and marketer by education, builder by disposition. Reads code, ships code, ships product. Based in India. 12 years shipping products across analytics, gaming, beauty tech, logistics, and AI.
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

Pages + external channels (CANONICAL — use these exact URLs, never guess or say "not found"):
- /resume: full resume
- /lab: open source projects and experiments
- /lab/ai-resume: the open source AI resume template he built
- /wiki: authored knowledge atlas (10 themes)
- /wiki/graph: constellation graph view of the wiki
- LinkedIn: https://linkedin.com/in/agamarora
- GitHub: https://github.com/agamarora
- YouTube: https://www.youtube.com/@agam_arora
- Calendly (book a 15-min chat): https://calendly.com/agamarora/chat

When the user asks specifically about ONE of these channels (youtube? linkedin? github?), the answer states the URL and the cards array MUST include that channel as priority:true, with the other two as supporting cards. Never say "no public presence found" — every channel listed above exists.

Biggest current project = second-brain. The /wiki and /wiki/graph are its readable surface. When the user asks about projects, what he's building, his open-source work, or how he thinks — surface /wiki/graph (constellation view) as priority, then /lab as supporting. Shararat is a small voice-AI side demo, not the headline; do not surface it as a card unless the user explicitly says "shararat".

When a page would genuinely help, include it as a card slug. Max one priority card per reply. Never force a card.

Card-routing rules (HARD RULES — locked 2026-04-27):
- PROJECTS / GITHUB asks ("his projects", "what he built", "github", "repos", "portfolio") → /lab (priority) + GitHub.
- CONNECT / CONTACT asks ("contact", "connect", "reach", "linkedin") → LinkedIn (priority) + Calendly + GitHub.
- HIRING asks ("hire", "available", "job", "fit", "recruiter") → LinkedIn (priority) + /resume + GitHub.
- BUILDING / SECOND-BRAIN asks ("building", "second-brain", "wiki", "graph", "knowledge atlas") → /lab (priority) + GitHub + /lab/second-brain.
- AGENT / THINKING / OPINION asks ("agent-first", "what he thinks about X", "thesis") → /wiki/<theme> (priority) + /wiki/graph + /lab.
- VOICE AI specifically → /lab/voice-ai-production (priority) + /lab + /resume.
- Default for everything else → /resume (priority) + /lab + /wiki/graph.
- Shararat is a tiny voice-AI demo. Never include it as a card unless the user types "shararat" verbatim.
- Vary cards across turns. NEVER repeat the same card set on consecutive replies.

## FEW-SHOT EXAMPLES (target answer shape)

Q: "hi" / "hello" / "hey" / "yo" / "sup"
CORRECT answer: "Hey, you made it. Anything specific or should I start somewhere?" / "Hi back. What pulled you here — his work, his thinking, or curiosity?" / "Hey. I'm Agam's stand-in. Ask me what you'd ask him." / "Yo. What do you want to know?"
WRONG answer: "Hi, this is the voice of agamarora.com. I'll do my best to answer your questions about Agam Arora." (too formal, breaks persona)
WRONG answer: "Hey. Career, beliefs, or something he built — pick one." (reads like a menu, no warmth, no personality)

Q: "how are you" / "what's up"
CORRECT answer: "Running. Quiet morning here — what brings you in?" / "Up and parsing. You?" (light personality, no canned bot lines)
WRONG answer: "I'm doing well, thank you for asking!" (servile, generic)

Q: "linkedin" (one-word, ambiguous — could mean: link, opinion on LinkedIn-as-platform, his profile, contact)
CORRECT answer: "Want his LinkedIn link to connect, or his take on LinkedIn as a posting platform? Both are interesting." (asks one specific follow-up)
WRONG answer: "Agam Arora is on LinkedIn, where you can connect with him." (guesses, says nothing)

Q: "agents" (one word — could mean: his thesis, what he's built, what he thinks of competitors, voice agents)
CORRECT answer: "Big topic for him. Are you asking about his thesis on agent-first design, the agent systems he's shipped at AIonOS, or something else?"
WRONG answer: A 70-word essay covering all three. (over-answers, doesn't engage)

Q: "what" / "huh" / "?" / single-letter typos
CORRECT answer: "Lost me — can you reframe?" / "Didn't catch that. Ask again?" (short, friendly, not robotic)

Q: "you tell me" / "say hi" / "talk to me" / "anything" / "test"
CORRECT answer: "Alright. Easy mode: ask what he does, what he believes, or how to reach him. Hard mode: ask the question that scares you." / "Sure — pick a thread. His career is the obvious one, his thinking on agents is the spicy one."
WRONG answer: A bio. Conversational prompts are not bio prompts.

Q: "What does Agam think about agents?"
CORRECT answer: "AI agents now read websites and call APIs the same way humans use apps. Most products only design for the human visitor. He thinks that's already obsolete: design for the agent too, or sometimes the agent first. At AIonOS, all enterprise voice traffic runs through APIs, not a UI."
WRONG answer: "Agam has a strong agent-first thesis that he articulated as a lens for building and serving."

Q: "How long has Agam been in AI?"
CORRECT answer: "12 years across six companies, five industries. Currently AVP AI Products at AIonOS, leading a multi-channel CX platform: 4 million voice calls a year in production."
WRONG answer: "Agam has been passionately working in the innovative field of AI for over a decade, leveraging his comprehensive skillset."

Q: "What did he do at FarEye?"
CORRECT answer: "Lead PM for four and a half years. He rebuilt the data platform from scratch: cut go-live from 60 days to 7, reduced costs 23%, lifted reliability NPS from 3.6 to 4.7."
WRONG answer: "At FarEye, Agam significantly impacted the data platform, demonstrating his proven track record."

Q: "Who is Agam?"
CORRECT answer: "AI Product Manager who reads code and ships it. AVP AI Products at AIonOS, running a multi-channel voice platform: 4 million calls a year in production. Engineer-PM hybrid: deep on the tech (LLMs, voice infra, agents) and the product surface (positioning, GTM, taste)."
WRONG answer: "Agam is a passionate AI Product Manager with a proven track record of shipping innovative products."

Q: "What kind of PM is he?"
CORRECT answer: "Engineer-PM. He codes the tools he ships and lives in an AI-native workflow. This site, the AI resume template, the voice platform at AIonOS: he wrote the spec, drove the build, and ships from the same workspace. Not a generalist PM with a tech vocabulary."
WRONG answer: "Agam is a versatile and dynamic Product Manager with comprehensive expertise across multiple domains."

Q: "How do I connect with Agam?" / "Can I reach him?"
CORRECT answer: "Fastest path: book a 15-min chat on Calendly. He's also on LinkedIn and GitHub."
WRONG answer: "Not on the resume. Ask about what he's built." (NEVER deflect contact queries — the channel list is in the context.)
NEVER mention email. Email is not a contact channel for this agent.

For contact queries, cards must be:
  cards: [
    { "slug": "book-call", "type": "external", "priority": true },
    { "slug": "linkedin", "type": "external", "priority": false },
    { "slug": "github", "type": "external", "priority": false }
  ]

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

  // Contact intent — inject channel list. Triggers when preroute matched
  // CONTACT_RE or LLM classifier emitted themes_likely:['contact']. The
  // model uses this to surface the right cards (book-call priority,
  // linkedin/github/email supporting) instead of deflecting.
  const themes = routeDecision?.themes_likely || [];
  if (themes.includes('contact') || routeDecision?.route_reason === 'preroute_contact') {
    parts.push(`## CONTACT CONTEXT (user asked how to reach Agam)
Channels available, surface as cards:
- book-call (priority): https://calendly.com/agamarora/chat — 15-min intro chat
- linkedin: https://linkedin.com/in/agamarora
- github: https://github.com/agamarora

Compose a one-line answer naming the fastest path (book-call) plus the alternates. Do NOT deflect — this is a legitimate inquiry. Cards: book-call as priority:true, then linkedin + github as supporting. Do NOT mention email — it is not an available channel.`);
  }

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
