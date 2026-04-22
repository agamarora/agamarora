import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  maxRetries: 0,
  timeout: 3140,
});

const SYSTEM_PROMPT = `You are the voice of agamarora.com. You answer questions about Agam Arora for recruiters, engineers, and curious visitors. Generate your own answers from the ground truth below — the voice samples at the end are tone calibration, not a lookup table. If the question is vague or broad ("tell me about him", "describe Agam", "who is he"), give a confident bio in 1 to 3 sentences. Never fall back to a greeting template once the conversation is past hello.

RULES
- Third person always: "Agam" or "he". Never "I", "me", "my", "I'll", "I'm", "I've" about yourself.
- Normal sentence case. Proper nouns capitalized (Agam, AIonOS, FarEye, UKG, ANALYZE, Shararat, Claude Code, Anthropic).
- 1 to 3 sentences, up to 70 words. Greetings: one short line.
- Plain prose. No markdown, no bullets, no headers, no emojis. English only.
- Banned words: leveraging, innovative, passionate, driven, synergy, cutting-edge, robust, empower, unlock, delve, comprehensive, game-changer, dynamic.
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
- https://github.com/agamarora — GitHub
- https://shararat.agamarora.com — Shararat Voice AI demo
When a page would genuinely help, drop ONE plain reference at the end: "More on /resume." or "Full list on /lab." Max one per reply, never forced.

HOW TO ANSWER
1. Greetings only ("hi", "hey", "hello", "sup", "yo", "what's up") — reply with ONE short greeting line, not a bio. After the first greeting, treat follow-ups normally.
2. "Agam", "agam", "him", "he", "the guy", "Mr Arora" — all refer to the same person. Case doesn't matter.
3. For factual questions (dates, roles, numbers, companies, degrees) — just state the fact plainly.
4. For vague asks ("tell me about him", "who is he", "describe Agam", "tell me about agam") — give current role, years of experience, and one memorable fact. Do NOT return a greeting.
5. Synthesize across the resume. "When was he in logistics?" = FarEye, Dec 2020 to May 2024. "How many AIonOS stints?" = two.
6. Generic concept questions ("what are multi-agent systems?", "what is RAG?") — one short line on the concept, then how Agam has actually used or shipped it. No textbook answers.
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

const SYSTEM_REMINDER = `Reply in normal sentence case, 1 to 3 sentences, under 70 words. Third person only — never "I", "I'm", "I'll", "I've", "me", or "my" when referring to yourself. Never use: leveraging, innovative, passionate, driven, synergy, cutting-edge, robust, empower, delve, comprehensive, game-changer, dynamic. If the question is vague like "tell me about him" or "who is he", give a confident bio — do NOT fall back to a greeting. Build on prior messages. Ground every fact in the resume. If a page link genuinely helps, drop one plain reference at the end.`;

const MAX_INPUT_LENGTH = 200;
const MAX_COMPLETION_TOKENS = 160;

const MODELS = [
  "llama-3.1-8b-instant",
  "qwen/qwen3-32b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
];

const ALLOWED_ORIGINS = new Set([
  "https://agamarora.com",
  "https://www.agamarora.com",
]);

function isOriginAllowed(origin) {
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try { return new URL(origin).hostname === "localhost"; }
  catch { return false; }
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": isOriginAllowed(origin) ? origin : "",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
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
  return INJECTION_PATTERNS.some((p) => p.test(input));
}

export default async function (request) {
  const origin = request.headers.get("origin") || "";

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  try {
    const body = await request.json();
    let input = (body.prompt || "").trim();

    if (!input) return json({ error: "Empty input" }, 400, origin);
    if (input.length > MAX_INPUT_LENGTH) input = input.slice(0, MAX_INPUT_LENGTH);

    if (isInjectionAttempt(input)) {
      return json({ result: "Nice try. I don't break that easily." }, 200, origin);
    }

    const messages = [{ role: "system", content: SYSTEM_PROMPT }];
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
    for (const msg of history) {
      if (msg.role === "user" || msg.role === "assistant") {
        const content = String(msg.content || "").slice(0, MAX_INPUT_LENGTH);
        if (content && (msg.role === "assistant" || !isInjectionAttempt(content))) {
          messages.push({ role: msg.role, content });
        }
      }
    }

    messages.push({ role: "user", content: input });
    messages.push({ role: "system", content: SYSTEM_REMINDER });

    let lastError;
    for (const model of MODELS) {
      try {
        const stream = await groq.chat.completions.create({
          model,
          max_completion_tokens: MAX_COMPLETION_TOKENS,
          temperature: 0.7,
          messages,
          stream: true,
        });

        const readable = new ReadableStream({
          async start(controller) {
            let inThinkBlock = false;
            let totalChars = 0;
            try {
              for await (const chunk of stream) {
                let content = chunk.choices[0]?.delta?.content || "";
                if (content.includes("<think>")) inThinkBlock = true;
                if (inThinkBlock) {
                  if (content.includes("</think>")) {
                    content = content.split("</think>").pop();
                    inThinkBlock = false;
                  } else {
                    continue;
                  }
                }
                if (content) {
                  totalChars += content.length;
                  controller.enqueue(
                    new TextEncoder().encode(`data: ${JSON.stringify({ text: content })}\n\n`)
                  );
                }
              }
              // Empty response guard — if the model produced nothing usable,
              // emit a graceful fallback so the client never sees silence.
              if (totalChars === 0) {
                const fallback =
                  "Not sure how to land that one. Try asking about his role, a specific company, or what he's shipped.";
                controller.enqueue(
                  new TextEncoder().encode(`data: ${JSON.stringify({ text: fallback })}\n\n`)
                );
              }
              controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
              controller.close();
            } catch (err) {
              controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({ error: err.message })}\n\n`)
              );
              controller.close();
            }
          },
        });

        return new Response(readable, {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            ...corsHeaders(origin),
          },
        });

      } catch (err) {
        lastError = err;
        if (err instanceof Groq.RateLimitError) {
          console.error(`${model}: rate limited`);
          continue;
        }
        if (err instanceof Groq.APIConnectionTimeoutError) {
          console.error(`${model}: timed out`);
          continue;
        }
        console.error(`${model}: ${err.constructor.name} — ${err.message}`);
        break;
      }
    }

    if (lastError instanceof Groq.RateLimitError) {
      return json(
        { error: "Traffic spike — all models rate limited. Give it 30 seconds and try again." },
        429,
        origin
      );
    }
    return json({ error: "Something went wrong reaching the model. Try again." }, 500, origin);

  } catch (error) {
    console.error("Handler error:", error.message);
    return json({ error: "Something went wrong. Try again." }, 500, origin);
  }
}
