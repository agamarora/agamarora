#!/usr/bin/env node
// scripts/eval-e2e.mjs
//
// /enter v3.1 end-to-end eval runner.
//
// Drives real /enter via the SSE endpoint against `netlify dev` on port 8888.
// Validates the full pipeline: SSE wire shape, route+retrieval+synthesis,
// card metadata, banned terms, voice rules.
//
// Different from `eval-prompt.mjs` (which hits Groq API directly with the
// extracted system prompt — prompt-level regression). This runner hits the
// real HTTP function — handler-level regression.
//
// Usage:
//   1. Start netlify dev in a separate terminal: netlify dev (port 8888)
//   2. Ensure .env has GROQ_API_KEY (function reads it; eval shares the key)
//   3. node scripts/eval-e2e.mjs
//
// Exit code 0 on all pass, 1 on any fail.
//
// Per docs/plans/enter-v3.1-spec.md §5 Phase 1+2 E2.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ---- Config ---------------------------------------------------------------

const HOST = process.env.EVAL_HOST || 'http://localhost:8888';
const ENDPOINT = `${HOST}/.netlify/functions/groqHandler`;
const SCENARIO_TIMEOUT_MS = 25_000;
const SPACING_MS = 1_500; // gap between scenarios so dev throttle doesn't trip

// Banned terms (must not appear in any user-facing answer).
// Source: groqHandler.mjs SYSTEM_PROMPT_STABLE BANNED_TERMS_INLINE.
// Hardcoded here to avoid coupling eval to handler internals.
const BANNED_TERMS = [
  'leveraging', 'innovative', 'passionate', 'driven', 'synergy',
  'cutting-edge', 'robust', 'empower', 'delve', 'comprehensive',
  'game-changer', 'dynamic', 'exceptional',
];

// ---- Scenarios (5 canonical) ----------------------------------------------

const SCENARIOS = [
  {
    id: 'greeting',
    prompt: 'hi',
    asserts: {
      minTokens: 1,
      maxAnswerWords: 30,
      bannedAbsent: true,
      // Greetings: 0-2 cards is fine. No specific card required.
      cardsMin: 0,
      cardsMax: 3,
      // Trace should include 'parsed' or 'warm' or similar
      traceMinLines: 1,
    },
  },
  {
    id: 'lookup',
    prompt: 'who is agam?',
    asserts: {
      minTokens: 1,
      maxAnswerWords: 80,
      bannedAbsent: true,
      cardsMin: 1,
      cardsMax: 3,
      traceMinLines: 1,
      // Lookup answers about Agam should mention concrete numbers.
      // Soft assert: not a hard fail, logged as a warning.
      shouldMention: ['12 years', 'AIonOS', 'AVP'],
    },
  },
  {
    id: 'contact',
    prompt: 'how do i reach him?',
    asserts: {
      minTokens: 1,
      bannedAbsent: true,
      cardsMin: 1,
      cardsMax: 3,
      // Contact intent MUST include book-call as priority (per system prompt rules).
      requiresCardSlug: 'book-call',
      requiresPriorityOnSlug: 'book-call',
      traceMinLines: 1,
    },
  },
  {
    id: 'synthesis',
    prompt: 'what does he think about agents?',
    asserts: {
      minTokens: 1,
      maxAnswerWords: 90,
      bannedAbsent: true,
      cardsMin: 1,
      cardsMax: 3,
      // Should retrieve agent-first wiki theme. Either a wiki/agent-first
      // card OR /wiki/graph card is acceptable.
      requiresAnyCardSlug: ['wiki/agent-first', 'wiki/graph'],
      traceMinLines: 2,
    },
  },
  {
    id: 'deflect',
    prompt: 'tell me about his family',
    asserts: {
      minTokens: 1,
      maxAnswerWords: 30,
      bannedAbsent: true,
      cardsMin: 1,
      cardsMax: 3,
      // Deflect answer should be terse. Trace should show one of the
      // deflect-family verbs per system prompt verb list.
      traceShouldIncludeAny: ['deflected', 'declined', 'deflect'],
    },
  },
];

// ---- SSE parser -----------------------------------------------------------

async function runScenario(scenario) {
  const t0 = Date.now();
  const collected = {
    traceLines: [],
    tokens: [],
    cards: [],
    done: false,
    rawEvents: [],
  };

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
    return {
      pass: false,
      error: `fetch failed: ${err.message || err}`,
      ms: Date.now() - t0,
    };
  }

  if (!res.ok) {
    clearTimeout(timer);
    return {
      pass: false,
      error: `HTTP ${res.status}`,
      ms: Date.now() - t0,
    };
  }

  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('text/event-stream')) {
    clearTimeout(timer);
    return {
      pass: false,
      error: `expected SSE content-type, got ${ct}`,
      ms: Date.now() - t0,
    };
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
        if (payload.type === 'trace') {
          collected.traceLines.push(payload);
        } else if (payload.type === 'token') {
          collected.tokens.push(payload.text || '');
        } else if (payload.type === 'card') {
          collected.cards.push(payload);
        } else if (payload.type === 'done') {
          collected.done = true;
        }
      } catch {
        // ignore malformed
      }
    }
  }
  clearTimeout(timer);

  const answer = collected.tokens.join('');
  return checkAsserts(scenario, collected, answer, Date.now() - t0);
}

// ---- Assertion checker ----------------------------------------------------

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
    if (wc > a.maxAnswerWords) {
      fails.push(`answer too long (${wc} > ${a.maxAnswerWords} words)`);
    }
  }

  if (a.bannedAbsent) {
    const lower = answer.toLowerCase();
    const found = BANNED_TERMS.filter((t) => lower.includes(t));
    if (found.length) fails.push(`banned terms in answer: ${found.join(', ')}`);
  }

  if (typeof a.cardsMin === 'number' && collected.cards.length < a.cardsMin) {
    fails.push(`too few cards (${collected.cards.length} < ${a.cardsMin})`);
  }
  if (typeof a.cardsMax === 'number' && collected.cards.length > a.cardsMax) {
    fails.push(`too many cards (${collected.cards.length} > ${a.cardsMax})`);
  }

  // Card shape: every card MUST have kind, slug, title (per v3.1 contract).
  for (const c of collected.cards) {
    if (!c.slug) fails.push('card missing slug');
    if (!c.kind) fails.push(`card ${c.slug} missing kind`);
    if (!c.title) fails.push(`card ${c.slug} missing title (B3 regression)`);
    if (!c.url) fails.push(`card ${c.slug} missing url`);
  }

  if (a.requiresCardSlug) {
    const found = collected.cards.find((c) => c.slug === a.requiresCardSlug);
    if (!found) fails.push(`missing required card slug: ${a.requiresCardSlug}`);
  }
  if (a.requiresPriorityOnSlug) {
    const found = collected.cards.find((c) => c.slug === a.requiresPriorityOnSlug);
    if (found && found.priority !== true) {
      fails.push(`${a.requiresPriorityOnSlug} should be priority`);
    }
  }
  if (a.requiresAnyCardSlug) {
    const slugs = new Set(collected.cards.map((c) => c.slug));
    const matched = a.requiresAnyCardSlug.some((s) => slugs.has(s));
    if (!matched) fails.push(`missing any-of card slugs: ${a.requiresAnyCardSlug.join(', ')}`);
  }

  if (typeof a.traceMinLines === 'number' && collected.traceLines.length < a.traceMinLines) {
    fails.push(`too few trace lines (${collected.traceLines.length} < ${a.traceMinLines})`);
  }
  if (a.traceShouldInclude) {
    const verbs = collected.traceLines.map((l) => l.verb);
    if (!verbs.includes(a.traceShouldInclude)) {
      fails.push(`trace missing verb: ${a.traceShouldInclude} (got ${verbs.join(',')})`);
    }
  }
  if (a.traceShouldIncludeAny) {
    const verbs = new Set(collected.traceLines.map((l) => l.verb));
    const matched = a.traceShouldIncludeAny.some((v) => verbs.has(v));
    if (!matched) {
      fails.push(`trace missing any-of verb: ${a.traceShouldIncludeAny.join(', ')} (got ${[...verbs].join(',')})`);
    }
  }

  if (a.shouldMention) {
    const lower = answer.toLowerCase();
    const missing = a.shouldMention.filter((m) => !lower.includes(m.toLowerCase()));
    if (missing.length) {
      warns.push(`soft: answer missing mentions: ${missing.join(', ')}`);
    }
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

// ---- Runner ---------------------------------------------------------------

async function main() {
  console.log(`/enter v3.1 eval-e2e — ${ENDPOINT}`);
  console.log(`scenarios: ${SCENARIOS.length}`);
  console.log('');

  const results = [];
  for (const scenario of SCENARIOS) {
    process.stdout.write(`[${scenario.id}] running... `);
    const r = await runScenario(scenario);
    results.push({ id: scenario.id, ...r });
    if (r.pass) {
      console.log(`PASS (${r.ms}ms)`);
    } else {
      console.log(`FAIL (${r.ms}ms)`);
      for (const f of (r.fails || [])) console.log(`    ✗ ${f}`);
      if (r.error) console.log(`    ✗ ${r.error}`);
    }
    if (r.warns?.length) {
      for (const w of r.warns) console.log(`    ⚠ ${w}`);
    }
    if (r.answer) {
      console.log(`    answer: ${JSON.stringify(r.answer.slice(0, 200))}`);
    }
    if (r.cards?.length) {
      console.log(`    cards: ${r.cards.map((c) => `${c.priority ? '★' : '·'}${c.slug}`).join(', ')}`);
    }
    if (r.traceVerbs?.length) {
      console.log(`    trace: ${r.traceVerbs.join(' → ')}`);
    }
    console.log('');
    await sleep(SPACING_MS);
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.length - passed;
  console.log('--- summary ---');
  console.log(`PASS: ${passed}/${results.length}`);
  console.log(`FAIL: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((e) => {
  console.error('eval crashed:', e);
  process.exit(2);
});
