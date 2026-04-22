// Multi-turn conversation eval against LIVE prod (not direct Groq).
// Tests that the deployed function + prompt handles threaded follow-ups.
import { setTimeout as sleep } from "node:timers/promises";

const ENDPOINT = "https://agamarora.com/.netlify/functions/groqHandler";

const threads = [
  {
    name: "AIonOS deep dive",
    turns: [
      "what is AIonOS?",
      "and what does Agam do there?",
      "tell me more about the voice AI",
      "4M calls a year — what was the impact?",
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
      "so where does he keep coming back to?",
    ],
  },
  {
    name: "Hiring pitch",
    turns: [
      "why should I hire him?",
      "give me a concrete example",
      "would he fit at Anthropic?",
    ],
  },
  {
    name: "Technical depth",
    turns: [
      "is he technical?",
      "what does he build with?",
      "does he still code or is he more of a leader now?",
    ],
  },
  {
    name: "Harder questions",
    turns: [
      "what's his biggest weakness?",
      "how big were the teams he has run?",
      "why so many job changes in 2025?",
    ],
  },
];

async function ask(prompt, history) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://agamarora.com" },
    body: JSON.stringify({ prompt, history }),
  });

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = await res.json();
    return data.result || data.error || "(no content)";
  }

  // SSE — assemble text chunks
  let full = "";
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const chunks = buf.split("\n\n");
    buf = chunks.pop();
    for (const line of chunks) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6);
      if (payload === "[DONE]") continue;
      try {
        const { text } = JSON.parse(payload);
        if (text) full += text;
      } catch {}
    }
  }
  return full;
}

function tag(text) {
  const issues = [];
  const words = text.split(/\s+/).length;
  if (words > 75) issues.push(`LONG(${words}w)`);
  if (/\b(I'm|I'll|I've|my system|my prompt)\b/.test(text)) issues.push("FIRST_PERSON");
  if (/\b(leverag|innovat|passionate|synergy|cutting-edge|robust|empower|delve)/i.test(text)) issues.push("SLOP");
  if (/memory bank/i.test(text)) issues.push("MEMORY_BANK");
  if (/^[a-z]/.test(text.trim())) issues.push("LOWERCASE_START");
  return { words, issues };
}

async function runThread(t, gap) {
  console.log(`\n${"=".repeat(70)}\nTHREAD: ${t.name}\n${"=".repeat(70)}`);
  const history = [];
  for (let i = 0; i < t.turns.length; i++) {
    if (i > 0) await sleep(gap);
    const q = t.turns[i];
    let a;
    try { a = await ask(q, history.slice(-6)); }
    catch (e) { a = `ERROR — ${e.message}`; }
    const { words, issues } = tag(a);
    console.log(`\n  [${i+1}] User: ${q}`);
    console.log(`      Bot:  ${a}`);
    console.log(`      ${issues.length ? "FAIL [" + issues.join(",") + "]" : "OK"} · ${words}w`);
    history.push({ role: "user", content: q });
    history.push({ role: "assistant", content: a });
  }
}

const GAP = 22000; // prod uses cascading so we don't need crazy gaps, but 22s keeps tokens under TPM

const run = async () => {
  console.log("CONVERSATIONAL EVAL (against prod: " + ENDPOINT + ")");
  for (const t of threads) {
    await runThread(t, GAP);
    await sleep(GAP);
  }
  console.log("\nDONE");
};

run().catch(console.error);
