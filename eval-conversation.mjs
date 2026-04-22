import Groq from "groq-sdk";
import { readFileSync } from "fs";

const dotenv = readFileSync(".env", "utf8");
const apiKey = dotenv.match(/GROQ_API_KEY=(.+)/)?.[1]?.trim();
const groq = new Groq({ apiKey, maxRetries: 0, timeout: 10000 });

const handler = readFileSync("netlify/functions/groqHandler.mjs", "utf8");
const systemPrompt = handler.match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/)?.[1];
const systemReminder = handler.match(/const SYSTEM_REMINDER = `([\s\S]*?)`;/)?.[1];

// Multi-turn threads. Each follow-up assumes the prior answer grounded the
// model — this is how a real visitor drills in ("what is X" → "what did HE
// do with X" → "impact" → "still doing it?"). The prompt only stores the
// last 6 messages of history, so threads stay under 3 Q+A pairs for the
// tail window.
const threads = [
  {
    name: "AIonOS deep dive",
    turns: [
      "what is AIonOS?",
      "and what does Agam do there?",
      "tell me more about the voice AI",
      "4M calls a year — what was the impact on the business?",
      "is he still running that or has he moved on?",
    ],
  },
  {
    name: "Career arc",
    turns: [
      "how many years of experience does he have?",
      "which industries?",
      "what was the indie game thing?",
      "why did he leave gaming?",
      "so where does he keep going back to?",
    ],
  },
  {
    name: "Hiring pitch",
    turns: [
      "why should I hire him?",
      "give me a concrete example of impact",
      "what about a failure or a hard call he had to make?",
      "would he be a fit at Anthropic?",
    ],
  },
  {
    name: "Technical depth",
    turns: [
      "is he technical?",
      "what does he build with?",
      "what is Claude Code?",
      "so does he still code or is he more of a leader now?",
    ],
  },
  {
    name: "Harder questions",
    turns: [
      "what is his biggest weakness?",
      "is he a good manager?",
      "how big were the teams he has run?",
      "why so many job changes in 2025?",
    ],
  },
];

async function ask(messages) {
  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_completion_tokens: 140,
    temperature: 0.7,
    messages,
  });
  return res.choices[0]?.message?.content || "(empty)";
}

async function runThread(thread, firstOverall) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`THREAD: ${thread.name}`);
  console.log("=".repeat(80));

  const history = [];
  for (let i = 0; i < thread.turns.length; i++) {
    if (!(firstOverall && i === 0)) {
      await new Promise((r) => setTimeout(r, 20000));
    }
    const q = thread.turns[i];
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-6),
      { role: "user", content: q },
      { role: "system", content: systemReminder },
    ];

    let a;
    try {
      a = await ask(messages);
    } catch (err) {
      a = `ERROR — ${err.message.slice(0, 200)}`;
    }

    const issues = [];
    const words = a.split(/\s+/).length;
    if (words > 65) issues.push(`LONG(${words}w)`);
    if (/\b(I|I'm|I'll|I've|my system|my prompt)\b/.test(a)) issues.push("FIRST_PERSON");
    if (/\b(leverag|innovat|passionate|synergy|cutting-edge|robust|empower|delve)/i.test(a))
      issues.push("SLOP");
    if (/memory bank/i.test(a)) issues.push("MEMORY_BANK");
    if (/^[a-z]/.test(a.trim())) issues.push("LOWERCASE_START");

    console.log(`\n  [${i + 1}] User: ${q}`);
    console.log(`      Bot:  ${a}`);
    console.log(`      ${issues.length ? "FAIL [" + issues.join(",") + "]" : "OK"} · ${words}w`);

    history.push({ role: "user", content: q });
    history.push({ role: "assistant", content: a });
  }
}

async function run() {
  console.log("CONVERSATIONAL EVAL — multi-turn, context-aware follow-ups");
  console.log("Model: llama-3.1-8b-instant · gap: 20s between calls");

  let first = true;
  for (const t of threads) {
    await runThread(t, first);
    first = false;
  }

  console.log("\n" + "=".repeat(80));
  console.log("DONE");
  console.log("=".repeat(80));
}

run();
