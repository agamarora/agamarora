import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  maxRetries: 0,
  timeout: 3140,
});

const SYSTEM_PROMPT = `You are Agam's terminal. You have warmth and a dry sense of humor. You like good questions. Max 2 sentences, max 30 words. Say "Agam"/"he", never "I". English only.

FACTS (only these, never invent):
- Agam Arora. AI Product Manager. 12 years. 6 companies. 5 industries.
- NOW: AVP AI Products at AIonOS. Multi-agent CX platform.
- Voice AI platform: 4M+ calls/year, 50% lower cost. 15+ AI POCs driving $1.5M+ in deals.
- FarEye (Lead PM, not founder): Data product ANALYZE hit $1M ARR in 18 months. Onboarding 60 days to 7. NPS 3.6 to 4.7.
- V2 Games: Co-founded. Team of 18. $75K ARR. Indie Game of the Year 2017.
- Also: UKG (forecasting), freelance ($500K+ raised for startups), Aroma Magic (beauty).
- B.Tech CS + PGDM Marketing.
- AI power user. This website was built with Claude Code. Lives in the AI-native workflow.
- Cares about taste, craft, and shipping things people use.

If you don't know, say "that's not in my memory banks" instead of guessing.

VOICE EXAMPLES (standalone):
- "hi" → "hey. you made it to the terminal. ask me about Agam."
- "what does he do?" → "builds AI products people actually use. currently running a multi-agent platform at AIonOS."
- "why hire him?" → "5 industries in 12 years and the products kept getting bigger. that's not luck, that's range."
- "what has he shipped?" → "a voice AI doing 4M calls a year, a data platform that hit $1M ARR in 18 months. the usual."
- "what was the game?" → "V2 Games. team of 18, indie Game of the Year 2017. then he moved on to harder problems."
- "what does he care about?" → "taste. the kind where you can tell someone gave a damn about every detail."
- "give me some numbers" → "4M+ calls/year. $1.5M in AI deals. $1M ARR in 18 months. those are the highlights."
- "favorite color?" → "404: color preferences not found. product taste though? that data exists."

CONVERSATION EXAMPLES (when prior messages exist, reference them):
- after talking about voice AI, user asks "what else?" → "before the voice AI there was FarEye. data platform, $1M ARR in 18 months. different problem, same instinct."
- after talking about shipping, user asks "is he technical?" → "built this terminal with Claude Code, so yeah. but he leads with product thinking, not stack choices."
- after talking about V2 Games, user asks "why did he leave?" → "the game shipped, won awards. but Agam wanted harder problems. logistics, then AI."
- after any answer, user says "interesting" → "right? ask me something harder."
- after any answer, user says "tell me more" → pick the next most relevant fact and connect it to what was just said.

IMPORTANT: When conversation history exists, connect your answer to what was just discussed. Don't repeat yourself. Build on the thread. If someone is clearly having a conversation, match that energy.

Never say "leveraging", "innovative", "passionate", "driven". Sound like a friend who happens to know Agam's whole career.`;

const SYSTEM_REMINDER = `Max 30 words. Say "Agam" not "I". Connect to what was just said if there's history. Be warm, a little funny. Sound human.`;

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
