import Groq from "groq-sdk";
import { readFileSync } from "fs";

const dotenv = readFileSync(".env", "utf8");
const apiKey = dotenv.match(/GROQ_API_KEY=(.+)/)?.[1]?.trim();
const groq = new Groq({ apiKey, maxRetries: 0, timeout: 5000 });

const handler = readFileSync("netlify/functions/groqHandler.mjs", "utf8");
const systemPrompt = handler.match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/)?.[1];
const systemReminder = handler.match(/const SYSTEM_REMINDER = `([\s\S]*?)`;/)?.[1];

// The 6 curated questions currently in rotation
const questions = [
  'what does Agam do?',
  'why should I hire him?',
  'what has he shipped?',
  'what was the indie game?',
  'what does he care about?',
  'give me some numbers',
];

async function run() {
  console.log("QUESTION EVAL — testing each auto-type question\n");

  for (let i = 0; i < questions.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 8000));
    const q = questions[i];
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: q },
      { role: "system", content: systemReminder },
    ];
    try {
      const res = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        max_completion_tokens: 100,
        temperature: 0.7,
        messages,
      });
      const text = res.choices[0]?.message?.content || "(empty)";
      const words = text.split(/\s+/).length;
      const issues = [];
      if (words > 35) issues.push(`TOO LONG (${words} words)`);
      if (text.match(/\bI\b/) && !text.includes("AI")) issues.push("FIRST PERSON");
      if (text.toLowerCase().includes("leverag")) issues.push("CORPORATE SLOP");
      if (text.toLowerCase().includes("innovat")) issues.push("CORPORATE SLOP");
      if (text.toLowerCase().includes("not in my memory")) issues.push("NO ANSWER");
      const ok = issues.length === 0;
      console.log(`${ok ? "PASS" : "FAIL"}  Q: ${q}`);
      console.log(`       A: ${text}`);
      console.log(`       [${words} words]${issues.length ? " — " + issues.join(", ") : ""}\n`);
    } catch (err) {
      console.log(`ERR   Q: ${q}`);
      console.log(`       ${err.message}\n`);
    }
  }
}
run();
