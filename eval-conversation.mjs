import Groq from "groq-sdk";
import { readFileSync } from "fs";

const dotenv = readFileSync(".env", "utf8");
const apiKey = dotenv.match(/GROQ_API_KEY=(.+)/)?.[1]?.trim();
const groq = new Groq({ apiKey, maxRetries: 0, timeout: 5000 });

const handler = readFileSync("netlify/functions/groqHandler.mjs", "utf8");
const systemPrompt = handler.match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/)?.[1];
const systemReminder = handler.match(/const SYSTEM_REMINDER = `([\s\S]*?)`;/)?.[1];

// Simulate a real conversation — each turn builds on the last
const conversations = [
  {
    name: "NATURAL FLOW",
    turns: [
      { user: "hey" },
      { user: "what does Agam do?" },
      { user: "tell me more" },
      { user: "interesting. what was he doing before AI?" },
    ]
  },
  {
    name: "RECRUITER PATH",
    turns: [
      { user: "why should I hire him?" },
      { user: "what has he actually shipped?" },
      { user: "is he technical?" },
    ]
  },
  {
    name: "CURIOSITY PATH",
    turns: [
      { user: "what was the indie game?" },
      { user: "why did he leave gaming?" },
      { user: "what does he care about?" },
    ]
  },
];

async function run() {
  console.log("CONVERSATION EVAL — testing multi-turn stitching\n");

  for (const conv of conversations) {
    console.log(`\n=== ${conv.name} ===`);
    const history = [];

    for (const turn of conv.turns) {
      await new Promise(r => setTimeout(r, 8000));

      const messages = [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: turn.user },
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

        console.log(`  USER: ${turn.user}`);
        console.log(`  BOT:  ${text}`);
        console.log(`        [${words} words]\n`);

        history.push({ role: "user", content: turn.user });
        history.push({ role: "assistant", content: text });
      } catch (err) {
        console.log(`  USER: ${turn.user}`);
        console.log(`  BOT:  ERROR — ${err.message}\n`);
      }
    }
  }
  console.log("\n=== EVAL COMPLETE ===");
}
run();
