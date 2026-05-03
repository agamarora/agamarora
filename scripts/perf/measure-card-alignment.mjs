#!/usr/bin/env node
// Measure card-row left edge: empty-state vs first turn.
// Per docs/plans/fluffy-tinkering-crane.md §A acceptance + autoplan F6.
//
// Usage: node scripts/perf/measure-card-alignment.mjs
// Requires: netlify dev running on port 8888.

import { chromium } from 'playwright';

const HOST = process.env.EVAL_HOST || 'http://localhost:8888';
const URL = `${HOST}/enter`;

async function measure(viewport, label) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  page.on('pageerror', (e) => console.error(`[${label}] pageerror:`, e.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('#default-cards.show', { timeout: 5000 }).catch(() => {});

  const emptyRect = await page.evaluate(() => {
    const el = document.getElementById('default-cards');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, width: r.width, computed: getComputedStyle(el) ? {
      marginLeft: getComputedStyle(el).marginLeft,
      paddingLeft: getComputedStyle(el).paddingLeft,
      overflowX: getComputedStyle(el).overflowX,
    } : null };
  });

  // Trigger a query
  await page.fill('#input', 'who is agam');
  await page.press('#input', 'Enter');
  await page.waitForSelector('#cards-1', { timeout: 30000 });
  // Wait for cards to be populated
  await page.waitForFunction(() => {
    const el = document.getElementById('cards-1');
    return el && el.children.length > 0;
  }, { timeout: 30000 }).catch(() => {});

  const turn1Rect = await page.evaluate(() => {
    const el = document.getElementById('cards-1');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, width: r.width, childCount: el.children.length, computed: getComputedStyle(el) ? {
      marginLeft: getComputedStyle(el).marginLeft,
      paddingLeft: getComputedStyle(el).paddingLeft,
      overflowX: getComputedStyle(el).overflowX,
    } : null };
  });

  // Trigger a second query for turn 2 (best-effort — drops if input busy)
  let turn2Rect = null;
  try {
    await page.waitForFunction(() => !document.getElementById('input-bar')?.classList.contains('busy'), { timeout: 15000 });
    await page.fill('#input', 'best work');
    await page.press('#input', 'Enter');
    await page.waitForSelector('#cards-2', { timeout: 20000 });
    await page.waitForFunction(() => {
      const el = document.getElementById('cards-2');
      return el && el.children.length > 0;
    }, { timeout: 20000 }).catch(() => {});
    turn2Rect = await page.evaluate(() => {
      const el = document.getElementById('cards-2');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, width: r.width, childCount: el.children.length };
    });
  } catch (e) {
    console.error(`[${label}] turn2 skipped:`, e.message.slice(0, 80));
  }

  // Take screenshot for visual evidence
  const screenshotPath = `scripts/perf/card-alignment-${label}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await browser.close();

  return { viewport: label, empty: emptyRect, turn1: turn1Rect, turn2: turn2Rect, screenshot: screenshotPath };
}

(async () => {
  console.log('=== Desktop (1280x800) ===');
  const desktop = await measure({ width: 1280, height: 800 }, 'desktop-1280');
  console.log(JSON.stringify(desktop, null, 2));

  console.log('\n=== Mobile (390x844) ===');
  const mobile = await measure({ width: 390, height: 844 }, 'mobile-390');
  console.log(JSON.stringify(mobile, null, 2));

  // Verdict
  console.log('\n=== ALIGNMENT VERDICT ===');
  for (const r of [desktop, mobile]) {
    if (!r.empty || !r.turn1) {
      console.log(`${r.viewport}: MISSING DATA`);
      continue;
    }
    const dt1 = Math.abs(r.empty.left - r.turn1.left);
    const dt2 = r.turn2 ? Math.abs(r.empty.left - r.turn2.left) : null;
    console.log(`${r.viewport}: empty.left=${r.empty.left.toFixed(2)} turn1.left=${r.turn1.left.toFixed(2)} delta=${dt1.toFixed(2)}px${dt2 !== null ? ` turn2.left=${r.turn2.left.toFixed(2)} delta2=${dt2.toFixed(2)}px` : ''}`);
    console.log(`  empty.computed: ${JSON.stringify(r.empty.computed)}`);
    console.log(`  turn1.computed: ${JSON.stringify(r.turn1.computed)}`);
    if (dt1 > 1) console.log(`  ❌ DRIFT — empty vs turn1 differs by ${dt1.toFixed(2)}px`);
    else console.log(`  ✓ aligned within 1px`);
  }
})().catch((e) => { console.error('FAILED:', e); process.exit(1); });
