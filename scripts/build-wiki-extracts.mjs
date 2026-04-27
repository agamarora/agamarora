#!/usr/bin/env node
// build-wiki-extracts.mjs
//
// Walks wiki/<theme>/index.html for each theme listed in
// netlify/functions/lib/kg-themes-summary.mjs and emits plain-text section
// extracts to netlify/functions/lib/wiki-extracts.json.
//
// The /enter v3 retriever imports this JSON at module init — no HTTP fetch,
// no LRU cache, no race dedup at request time.
//
// Per docs/plans/second-brain-v1-next-session-plan.md Task 14a (D-0)
// + phase-d-decisions-2026-04-27.md Decision 2 (bundle wiki extracts).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KG_THEMES_SUMMARY } from '../netlify/functions/lib/kg-themes-summary.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const STRICT = process.argv.includes('--strict');

const log = (...a) => console.log('[build-wiki-extracts]', ...a);
const fail = (msg) => { console.error('[build-wiki-extracts] ERROR:', msg); process.exit(1); };

// ---- HTML helpers (no deps) -----------------------------------------------

// Strip HTML tags + decode common entities to plain text.
function htmlToText(html) {
  return html
    .replace(/<details[\s\S]*?<\/details>/gi, '')   // drop evidence drawer
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rarr;/g, '→')
    .replace(/&larr;/g, '←')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Pick out <article>...</article> block.
function getArticle(html) {
  const m = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  return m ? m[1] : html;
}

// Pick text inside first <h1>.
function getH1Text(html) {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? htmlToText(m[1]) : '';
}

// Pick text inside .page-purpose paragraph if present.
function getPagePurpose(html) {
  const m = html.match(/<p\s+class="page-purpose"[^>]*>([\s\S]*?)<\/p>/i);
  return m ? htmlToText(m[1]) : '';
}

// Walk h2 sections. Returns [{ heading, text }].
function getSections(html) {
  // Drop related-links aside + theme-nav so they don't bleed into the last section.
  const cleaned = html
    .replace(/<aside\b[^>]*class="[^"]*related-links[^"]*"[\s\S]*?<\/aside>/gi, '')
    .replace(/<nav\b[^>]*class="[^"]*theme-nav[^"]*"[\s\S]*?<\/nav>/gi, '');

  const sections = [];
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  let match;
  const matches = [];
  while ((match = re.exec(cleaned)) !== null) {
    matches.push({ heading: htmlToText(match[1]), start: match.index, after: match.index + match[0].length });
  }
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].after;
    const end = i + 1 < matches.length ? matches[i + 1].start : cleaned.length;
    const body = cleaned.slice(start, end);
    const text = htmlToText(body);
    if (text) sections.push({ heading: matches[i].heading, text });
  }
  return sections;
}

// ---- Main ------------------------------------------------------------------

const themes = KG_THEMES_SUMMARY.map(t => t.slug);
log(`extracting ${themes.length} themes`);

const out = {};
let totalChars = 0;
let missing = [];

for (const slug of themes) {
  const path = resolve(ROOT, 'wiki', slug, 'index.html');
  if (!existsSync(path)) {
    missing.push(slug);
    continue;
  }
  const html = readFileSync(path, 'utf8');
  const article = getArticle(html);
  const title = getH1Text(article);
  const purpose = getPagePurpose(article);
  const sections = getSections(article);

  const entry = { title, purpose, sections };
  out[slug] = entry;
  const chars = JSON.stringify(entry).length;
  totalChars += chars;
  log(`  ${slug}: h1=${title ? '✓' : '✗'} purpose=${purpose ? '✓' : '✗'} sections=${sections.length} (${chars} chars)`);
}

if (missing.length) {
  const msg = `missing wiki theme dirs: ${missing.join(', ')}`;
  if (STRICT) fail(msg); else log('WARN:', msg);
}

const outPath = resolve(ROOT, 'netlify/functions/lib/wiki-extracts.json');
const payload = {
  _meta: {
    generated_at: new Date().toISOString(),
    theme_count: Object.keys(out).length,
    total_chars: totalChars
  },
  themes: out
};
writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');

log(`wrote ${outPath}`);
log(`total: ${Object.keys(out).length} themes, ${totalChars} chars (~${Math.round(totalChars / 1024)}KB)`);
