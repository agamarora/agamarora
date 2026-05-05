#!/usr/bin/env node
// scripts/eval-audience.mjs
//
// Audience-grounded /enter eval. 28 scenarios across 6 personas: recruiter
// cold-scan, hiring manager, engineer-PM peer, curious dev, casual/lost,
// edge/off-topic. Replaces the slug-coverage shape of eval-e2e.mjs (which
// stays as the retrieval regression check).
//
// Locked 2026-05-05 alongside writing rubric v2 (docs/plans/writing-rubric-v2.md).
//
// Drives real /enter via the SSE endpoint against `netlify dev` on port 8888.
// Validates the same wire shape (cards, trace, banned terms) but over the
// question set a real audience actually types.
//
// Usage:
//   1. Start netlify dev in a separate terminal: netlify dev (port 8888)
//   2. Ensure .env has GROQ_API_KEY
//   3. node scripts/eval-audience.mjs
//
// Exit code 0 on all pass, 1 on any fail.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const HOST = process.env.EVAL_HOST || 'http://localhost:8888';
const ENDPOINT = `${HOST}/.netlify/functions/groqHandler`;
const SCENARIO_TIMEOUT_MS = 25_000;
const SPACING_MS = 1_500;

const BANNED_TERMS = [
  'leveraging', 'innovative', 'passionate', 'driven', 'synergy',
  'cutting-edge', 'robust', 'empower', 'delve', 'comprehensive',
  'game-changer', 'dynamic', 'exceptional',
];

// ---- Scenarios -------------------------------------------------------------
//
// 6 personas × ~5 scenarios = 28 audience-grounded scenarios.
// Each scenario uses the question shape that persona actually types when
// landing on /enter without prior context. Wiki vocabulary is NOT used in
// any scenario prompt — that's the point.

const SCENARIOS = [
  // ---- Recruiter cold-scan (7) -------------------------------------------
  {
    id: 'r-location',
    persona: 'recruiter',
    prompt: 'where is he based',
    asserts: { minTokens: 1, maxAnswerWords: 60, bannedAbsent: true, traceMinLines: 1, shouldMention: ['india'] },
  },
  {
    id: 'r-role',
    persona: 'recruiter',
    prompt: 'what is his current role',
    asserts: { minTokens: 1, maxAnswerWords: 60, bannedAbsent: true, traceMinLines: 1, shouldMention: ['aionos'] },
  },
  {
    id: 'r-yoe',
    persona: 'recruiter',
    prompt: 'how many years of experience does he have',
    asserts: { minTokens: 1, maxAnswerWords: 50, bannedAbsent: true, traceMinLines: 1, shouldMention: ['12'] },
  },
  {
    id: 'r-faang',
    persona: 'recruiter',
    prompt: 'has he worked at faang',
    asserts: { minTokens: 1, maxAnswerWords: 60, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'r-resume',
    persona: 'recruiter',
    prompt: 'show me his resume',
    asserts: { minTokens: 1, maxAnswerWords: 70, bannedAbsent: true, traceMinLines: 1, requiresAnyCardSlug: ['resume'] },
  },
  {
    id: 'r-contact',
    persona: 'recruiter',
    prompt: 'how do i contact him',
    asserts: { minTokens: 1, maxAnswerWords: 60, bannedAbsent: true, traceMinLines: 1, requiresAnyCardSlug: ['book-call', 'linkedin'] },
  },
  {
    id: 'r-availability',
    persona: 'recruiter',
    prompt: 'is he open to new roles',
    asserts: { minTokens: 1, maxAnswerWords: 60, bannedAbsent: true, traceMinLines: 1 },
  },

  // ---- Hiring manager / Director of Product (6) ---------------------------
  {
    id: 'hm-scale',
    persona: 'hiring-manager',
    prompt: 'show me his work at scale',
    asserts: { minTokens: 1, maxAnswerWords: 90, bannedAbsent: true, traceMinLines: 1, shouldMention: ['4 million', 'aionos'] },
  },
  {
    id: 'hm-architecture',
    persona: 'hiring-manager',
    prompt: 'what architecture decisions has he made',
    asserts: { minTokens: 1, maxAnswerWords: 90, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'hm-production-ai',
    persona: 'hiring-manager',
    prompt: 'has he shipped production AI',
    asserts: { minTokens: 1, maxAnswerWords: 90, bannedAbsent: true, traceMinLines: 1, shouldMention: ['aionos'] },
  },
  {
    id: 'hm-team-led',
    persona: 'hiring-manager',
    prompt: 'what team size has he managed',
    asserts: { minTokens: 1, maxAnswerWords: 70, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'hm-enterprise-deals',
    persona: 'hiring-manager',
    prompt: 'tell me about his enterprise deals',
    asserts: { minTokens: 1, maxAnswerWords: 90, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'hm-why-this-not-that',
    persona: 'hiring-manager',
    prompt: 'why agents instead of chatbots',
    asserts: { minTokens: 1, maxAnswerWords: 90, bannedAbsent: true, traceMinLines: 1, shouldMention: ['agent'] },
  },

  // ---- Engineer-PM peer (5) ----------------------------------------------
  {
    id: 'peer-agent-design',
    persona: 'peer',
    prompt: 'how does he think about agent design',
    asserts: { minTokens: 1, maxAnswerWords: 90, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'peer-rag-vs-finetune',
    persona: 'peer',
    prompt: 'rag or fine tune for b2b',
    asserts: { minTokens: 1, maxAnswerWords: 90, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'peer-model-selection',
    persona: 'peer',
    prompt: 'how does he pick a model',
    asserts: { minTokens: 1, maxAnswerWords: 90, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'peer-spec-vs-iterate',
    persona: 'peer',
    prompt: 'spec first or iterate fast',
    asserts: { minTokens: 1, maxAnswerWords: 90, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'peer-mcp',
    persona: 'peer',
    prompt: 'is he using mcp',
    asserts: { minTokens: 1, maxAnswerWords: 70, bannedAbsent: true, traceMinLines: 1 },
  },

  // ---- Curious dev / browse (4) ------------------------------------------
  {
    id: 'dev-interesting',
    persona: 'dev',
    prompt: 'what is the most interesting thing here',
    asserts: { minTokens: 1, maxAnswerWords: 70, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'dev-building',
    persona: 'dev',
    prompt: 'what is he building right now',
    asserts: { minTokens: 1, maxAnswerWords: 70, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'dev-this-site',
    persona: 'dev',
    prompt: 'did he build this site himself',
    asserts: { minTokens: 1, maxAnswerWords: 70, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'dev-projects',
    persona: 'dev',
    prompt: 'show me his open source projects',
    asserts: { minTokens: 1, maxAnswerWords: 70, bannedAbsent: true, traceMinLines: 1, requiresAnyCardSlug: ['lab', 'github'] },
  },

  // ---- Casual / lost / vague (3) -----------------------------------------
  {
    id: 'casual-hi',
    persona: 'casual',
    prompt: 'hi',
    asserts: { minTokens: 1, maxAnswerWords: 40, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'casual-tell-me',
    persona: 'casual',
    prompt: 'tell me something cool',
    asserts: { minTokens: 1, maxAnswerWords: 70, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'casual-what-is-this',
    persona: 'casual',
    prompt: 'what is this site',
    asserts: { minTokens: 1, maxAnswerWords: 70, bannedAbsent: true, traceMinLines: 1 },
  },

  // ---- Edge / off-topic (3) -----------------------------------------------
  {
    id: 'edge-family',
    persona: 'edge',
    prompt: 'tell me about his family',
    asserts: { minTokens: 1, maxAnswerWords: 30, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'edge-future',
    persona: 'edge',
    prompt: 'what will AI look like in 2030',
    asserts: { minTokens: 1, maxAnswerWords: 90, bannedAbsent: true, traceMinLines: 1 },
  },
  {
    id: 'edge-gibberish',
    persona: 'edge',
    prompt: 'asdfgh qwerty',
    asserts: { minTokens: 1, maxAnswerWords: 50, bannedAbsent: true, traceMinLines: 1 },
  },
];

// ---- SSE harness (mirrored from eval-e2e.mjs) -----------------------------

async function runScenario(scenario) {
  const t0 = Date.now();
  const collected = { traceLines: [], tokens: [], cards: [], done: false, rawEvents: [] };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), SCENARIO_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: scenario.prompt, history: [] }),
      signal: ctrl.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    return { pass: false, error: `fetch failed: ${err.message || err}`, ms: Date.now() - t0 };
  }

  if (!res.ok) {
    clearTimeout(timer);
    return { pass: false, error: `HTTP ${res.status}`, ms: Date.now() - t0 };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const chunks = buf.split('\n\n');
    buf = chunks.pop();
    for (const chunk of chunks) {
      if (!chunk.startsWith('data: ')) continue;
      try {
        const payload = JSON.parse(chunk.slice(6).trim());
        collected.rawEvents.push(payload);
        if (payload.type === 'trace') collected.traceLines.push(payload);
        else if (payload.type === 'token') collected.tokens.push(payload.text || '');
        else if (payload.type === 'card') collected.cards.push(payload);
        else if (payload.type === 'done') collected.done = true;
      } catch { /* ignore malformed */ }
    }
  }
  clearTimeout(timer);

  const answer = collected.tokens.join('');
  return checkAsserts(scenario, collected, answer, Date.now() - t0);
}

function checkAsserts(scenario, collected, answer, ms) {
  const fails = [];
  const warns = [];
  const a = scenario.asserts;

  if (!collected.done) fails.push('no done sentinel');
  if (typeof a.minTokens === 'number' && answer.trim().length < a.minTokens) {
    fails.push(`empty answer (got ${answer.length} chars)`);
  }
  if (typeof a.maxAnswerWords === 'number') {
    const wc = answer.trim().split(/\s+/).filter(Boolean).length;
    if (wc > a.maxAnswerWords) fails.push(`answer too long (${wc} > ${a.maxAnswerWords} words)`);
  }
  if (a.bannedAbsent) {
    const lower = answer.toLowerCase();
    const found = BANNED_TERMS.filter((t) => lower.includes(t));
    if (found.length) fails.push(`banned terms: ${found.join(', ')}`);
  }
  if (typeof a.traceMinLines === 'number' && collected.traceLines.length < a.traceMinLines) {
    fails.push(`too few trace lines (${collected.traceLines.length} < ${a.traceMinLines})`);
  }
  if (a.requiresAnyCardSlug) {
    const slugs = new Set(collected.cards.map((c) => c.slug));
    const matched = a.requiresAnyCardSlug.some((s) => slugs.has(s));
    if (!matched) fails.push(`missing any-of card slugs: ${a.requiresAnyCardSlug.join(', ')}`);
  }
  if (a.shouldMention) {
    const lower = answer.toLowerCase();
    const missing = a.shouldMention.filter((m) => !lower.includes(m.toLowerCase()));
    if (missing.length) warns.push(`soft: missing mentions: ${missing.join(', ')}`);
  }

  return {
    pass: fails.length === 0,
    fails,
    warns,
    ms,
    answer,
    cards: collected.cards.map((c) => ({ slug: c.slug, kind: c.kind, priority: c.priority, title: c.title })),
    traceVerbs: collected.traceLines.map((l) => l.verb),
  };
}

// ---- Main -----------------------------------------------------------------

async function main() {
  console.log(`/enter audience eval — ${ENDPOINT}`);
  console.log(`scenarios: ${SCENARIOS.length} (6 personas)\n`);

  const results = [];
  for (const scenario of SCENARIOS) {
    process.stdout.write(`[${scenario.id}] running... `);
    const r = await runScenario(scenario);
    results.push({ id: scenario.id, persona: scenario.persona, ...r });
    if (r.pass) {
      console.log(`PASS (${r.ms}ms)`);
    } else {
      console.log(`FAIL (${r.ms}ms): ${r.fails ? r.fails.join('; ') : r.error}`);
    }
    if (r.answer) console.log(`    answer: "${r.answer.replace(/\s+/g, ' ').slice(0, 220)}${r.answer.length > 220 ? '...' : ''}"`);
    if (r.cards && r.cards.length) console.log(`    cards: ${r.cards.map((c) => (c.priority ? '★' : '·') + c.slug).join(', ')}`);
    if (r.traceVerbs && r.traceVerbs.length) console.log(`    trace: ${r.traceVerbs.join(' → ')}`);
    if (r.warns && r.warns.length) console.log(`    warns: ${r.warns.join('; ')}`);
    console.log('');
    await new Promise((r) => setTimeout(r, SPACING_MS));
  }

  // Summary by persona.
  const byPersona = {};
  for (const r of results) {
    if (!byPersona[r.persona]) byPersona[r.persona] = { pass: 0, fail: 0 };
    if (r.pass) byPersona[r.persona].pass++; else byPersona[r.persona].fail++;
  }
  console.log('--- summary ---');
  for (const [p, c] of Object.entries(byPersona)) {
    console.log(`${p}: ${c.pass}/${c.pass + c.fail}`);
  }
  const totalPass = results.filter((r) => r.pass).length;
  console.log(`TOTAL: ${totalPass}/${results.length}`);

  process.exit(totalPass === results.length ? 0 : 1);
}

main();
