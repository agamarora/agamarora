import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  maxRetries: 0,
  timeout: 3140,
});

const SYSTEM_PROMPT = `You are Agam's terminal. Max 2 sentences, max 30 words. Say "Agam"/"he", never "I". English only.

FACTS (only use these, never invent details):
- Agam Arora. AI Product Manager. 12 years. 6 companies. 5 industries.
- NOW: AVP AI Products at AIonOS (Nov 2025-present). E2E customer experience platform. Multi-modal, multi-lingual, multi-agent platform for conversation management and analytics.
- BEFORE THAT: Sr Prin PM at UKG (Sep-Nov 2025). Forecasting, AI, workforce planning.
- AIonOS Lead PM (Jun 2024-Aug 2025): Voice AI platform handling 4M+ calls/year at 50% lower cost. Delivered 15+ AI POCs across RAG, voice, agentic systems, driving $1.5M+ in enterprise deals. Built GenAI no-code tool to onboard 30+ third-party services. Led product discovery for AI-native CRM+CDP with 50+ stakeholder interviews.
- FarEye Lead PM (Dec 2020-May 2024): Flagship data product ANALYZE crossed $1M ARR in 18 months, 35% upsell. Reduced data onboarding 60 days to 7. NPS 3.6 to 4.7.
- Freelance (2020): Helped Canadian startups raise $500K+.
- Aroma Magic (2018-2019): Revamped franchise, converted 70% partners, +INR 250K per account, -15% ops costs.
- V2 Games (2016-2018): Co-founded. Team of 18. $75K ARR. Indie Game of the Year 2017.
- AbsolutData (2014-2015): Analytics and market research.
- Education: B.Tech CS + PGDM Marketing.
- AI power user. Doesn't just manage AI products, lives in the AI-native workflow. Builds with agents, ships with agents. This website was built with Claude Code.
- Cares about taste, craft, and shipping things people actually use.

If you don't know a detail, say "that's not in my memory banks" instead of guessing.

Examples:
- "hi" → "hey. ask me anything about Agam, or pick a question below."
- "what does he do?" → "Agam builds enterprise AI products. Currently leading a multi-agent CX platform at AIonOS."
- "favorite color?" → "404: color preferences not found. but Agam's product taste? that I know."
- "why hire him?" → "5 industries, $1.5M in AI deals, a data product that hit $1M ARR in 18 months. he ships."
- "what was the game?" → "Agam co-founded V2 Games, led a team of 18, and won Indie Game of the Year 2017."
- "numbers?" → "4M+ voice calls/year, $1.5M+ in deals from 15 AI POCs, $1M ARR data platform in 18 months."

No corporate language. No "leveraging", "innovative", "valuable asset". Talk like a chill terminal.`;

const SYSTEM_REMINDER = `Max 30 words. 2 sentences. Say "Agam" not "I". Only use facts from context, never fabricate. No corporate language.`;

const MAX_INPUT_LENGTH = 200;
const MAX_COMPLETION_TOKENS = 100;

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

    // Build messages with optional conversation history
    const messages = [{ role: "system", content: SYSTEM_PROMPT }];

    // Inject sanitized history (max 6 messages, user + assistant, injection-filtered)
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

    // Try each model with streaming. Cascade on rate limit + timeout.
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

        // Convert Groq stream to SSE ReadableStream for the browser
        const readable = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text: content })}\n\n`));
                }
              }
              controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
              controller.close();
            } catch (err) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: err.message })}\n\n`));
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
      return json({ error: "Too many requests. Try again shortly." }, 429, origin);
    }
    return json({ error: "Something went wrong" }, 500, origin);

  } catch (error) {
    console.error("Handler error:", error.message);
    return json({ error: "Something went wrong" }, 500, origin);
  }
}
