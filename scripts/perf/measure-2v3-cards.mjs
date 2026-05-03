#!/usr/bin/env node
// Compare left edge of a 3-card row (synthesis padded) vs 2-card row (deflect).
// Per user report 2026-05-03: visual misalignment between rows of different
// card counts.

import { chromium } from 'playwright';

const HOST = process.env.EVAL_HOST || 'http://localhost:8888';
const URL = `${HOST}/enter`;

(async () => {
  const browser = await chromium.launch();
  // Match user's screenshot ~1091 wide
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });

  // Empty-state row
  await page.waitForSelector('#default-cards.show', { timeout: 5000 }).catch(() => {});
  const empty = await rect(page, '#default-cards');

  // First turn — synthesis (padded to 3)
  await page.fill('#input', 'what is his best work and biggest project at scale');
  await page.press('#input', 'Enter');
  await page.waitForSelector('#cards-1', { timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll('#cards-1 > .card').length >= 1, { timeout: 30000 }).catch(() => {});
  await page.waitForFunction(() => !document.getElementById('input-bar')?.classList.contains('busy'), { timeout: 15000 });
  const turn1 = await rect(page, '#cards-1');
  const turn1Cards = await childRects(page, '#cards-1');

  // Second turn — deflect (2 cards)
  await page.fill('#input', 'tell me about his family life');
  await page.press('#input', 'Enter');
  await page.waitForSelector('#cards-2', { timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll('#cards-2 > .card').length >= 1, { timeout: 30000 }).catch(() => {});
  const turn2 = await rect(page, '#cards-2');
  const turn2Cards = await childRects(page, '#cards-2');

  // Reference points: trace + answer left edges
  const trace1 = await rect(page, '#trace-1');
  const trace2 = await rect(page, '#trace-2');
  const ans1 = await rect(page, '#answer-1');
  const ans2 = await rect(page, '#answer-2');

  await page.screenshot({ path: 'scripts/perf/cards-2v3.png', fullPage: true });
  await browser.close();

  console.log('VIEWPORT: 1100x900');
  console.log('');
  console.log('CONTAINER LEFT EDGES:');
  console.log(`  empty-state #default-cards : ${empty?.left.toFixed(2)}`);
  console.log(`  turn-1 (3 cards) #cards-1  : ${turn1?.left.toFixed(2)}`);
  console.log(`  turn-2 (2 cards) #cards-2  : ${turn2?.left.toFixed(2)}`);
  console.log('');
  console.log('REFERENCE LEFT EDGES:');
  console.log(`  trace-1                    : ${trace1?.left.toFixed(2)}`);
  console.log(`  trace-2                    : ${trace2?.left.toFixed(2)}`);
  console.log(`  answer-1                   : ${ans1?.left.toFixed(2)}`);
  console.log(`  answer-2                   : ${ans2?.left.toFixed(2)}`);
  console.log('');
  console.log('FIRST CARD LEFT EDGES (the visible card border, what user sees):');
  if (turn1Cards) console.log(`  turn-1 first card (3-card row): ${turn1Cards[0]?.left.toFixed(2)} (count=${turn1Cards.length})`);
  if (turn2Cards) console.log(`  turn-2 first card (2-card row): ${turn2Cards[0]?.left.toFixed(2)} (count=${turn2Cards.length})`);
  console.log('');
  if (turn1Cards && turn2Cards) {
    const drift = Math.abs(turn1Cards[0].left - turn2Cards[0].left);
    console.log(`FIRST-CARD DRIFT (3-card row vs 2-card row): ${drift.toFixed(2)}px`);
    if (drift > 1) console.log('❌ DRIFT — first card border-left differs between rows');
    else console.log('✓ aligned — first card border-left matches');
  }
})().catch((e) => { console.error('FAILED:', e); process.exit(1); });

async function rect(page, sel) {
  return page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, width: r.width };
  }, sel);
}

async function childRects(page, sel) {
  return page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    return Array.from(el.children).map((c) => {
      const r = c.getBoundingClientRect();
      return { left: r.left, right: r.right, width: r.width };
    });
  }, sel);
}
