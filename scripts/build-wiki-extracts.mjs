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

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KG_THEMES_SUMMARY } from '../netlify/functions/lib/kg-themes-summary.mjs';

// Cap per belief extract — keeps total bundle bounded (~12KB for 19 beliefs).
// Worst-case retrieval = 3 themes + 2 beliefs ≈ 6.5K tokens. Per
// docs/plans/enter-v3.1-spec.md §5 Phase 3 + plans/fluffy-tinkering-crane.md.
const BELIEF_CHAR_CAP = 600;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const STRICT = process.argv.includes('--strict');

const log = (...a) => console.log('[build-wiki-extracts]', ...a);
const fail = (msg) => { console.error('[build-wiki-extracts] ERROR:', msg); process.exit(1); };

// Trim a string at the last whitespace boundary inside `maxChars`, append `…`
// if a trim was applied. Falls back to a hard slice when no whitespace is
// present in the cap window (preserves the cap as an upper bound).
function shortenAtWord(text, maxChars) {
  if (typeof text !== 'string' || text.length <= maxChars) return text || '';
  const slice = text.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(' ');
  // Only honor a word-boundary trim if it doesn't lop off too much (>40% of
  // the cap). Otherwise hard-slice — better to clip than emit a tiny stub.
  if (lastSpace > maxChars * 0.6) return slice.slice(0, lastSpace).replace(/[\s,;:.\-—]+$/, '') + '…';
  return slice.replace(/[\s,;:.\-—]+$/, '') + '…';
}

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

// Pick the TL;DR quote inside .belief-tldr block (belief pages only).
function getBeliefTldr(html) {
  const block = html.match(/<div\s+class="belief-tldr"[^>]*>([\s\S]*?)<\/div>/i);
  if (!block) return '';
  const q = block[1].match(/<p\s+class="quote"[^>]*>([\s\S]*?)<\/p>/i);
  return q ? htmlToText(q[1]) : '';
}

// Walk h2 sections. Returns [{ heading, text }].
function getSections(html) {
  // Drop continue-row + theme-nav so they don't bleed into the last section.
  const cleaned = html
    .replace(/<nav\b[^>]*class="[^"]*continue-row[^"]*"[\s\S]*?<\/nav>/gi, '')
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

// ---- Beliefs walker (Phase 3 / fluffy-tinkering-crane plan) ----------------
//
// Walks wiki/beliefs/<slug>/index.html. For each belief: extract title,
// TL;DR quote, and a capped digest of "The belief" + "How to apply" sections.
// Cap total per-belief char count at BELIEF_CHAR_CAP (600).

log('extracting beliefs');

const beliefsRoot = resolve(ROOT, 'wiki/beliefs');
const beliefSlugs = existsSync(beliefsRoot)
  ? readdirSync(beliefsRoot).filter((name) => {
      if (name === 'index.html' || name.startsWith('.')) return false;
      const p = join(beliefsRoot, name);
      try { return statSync(p).isDirectory(); } catch { return false; }
    }).sort()
  : [];

const beliefs = {};
let beliefTotalChars = 0;

for (const slug of beliefSlugs) {
  const path = resolve(beliefsRoot, slug, 'index.html');
  if (!existsSync(path)) continue;
  const html = readFileSync(path, 'utf8');
  const article = getArticle(html);
  const title = getH1Text(article);
  const tldr = getBeliefTldr(article);
  const sections = getSections(article);

  // Pick "The belief" and "How to apply" by id-keyword match. Fall back to
  // first 1-2 sections if a belief uses different headings.
  const wantedHeadings = ['the belief', 'how to apply', 'what it implies', 'core belief'];
  const picked = [];
  for (const want of wantedHeadings) {
    const hit = sections.find((s) => (s.heading || '').toLowerCase().includes(want));
    if (hit && !picked.includes(hit)) picked.push(hit);
    if (picked.length >= 2) break;
  }
  if (picked.length === 0) {
    // Fallback: take first 2 sections.
    for (const s of sections.slice(0, 2)) picked.push(s);
  }

  // Build capped extract: title + tldr + 2 short section digests.
  const parts = [];
  if (title) parts.push(title);
  if (tldr) parts.push(`TL;DR: ${tldr}`);
  // Reserve ~120 chars for title+tldr; remaining budget split across sections.
  const usedSoFar = parts.join('\n\n').length;
  const remaining = Math.max(0, BELIEF_CHAR_CAP - usedSoFar - 20); // -20 for separators
  const perSection = Math.floor(remaining / Math.max(1, picked.length));
  for (const s of picked) {
    const headTxt = s.heading ? `${s.heading}: ` : '';
    let body = s.text || '';
    if ((headTxt.length + body.length) > perSection) {
      body = body.slice(0, Math.max(0, perSection - headTxt.length - 1)).trimEnd() + '…';
    }
    if (headTxt || body) parts.push(`${headTxt}${body}`);
  }
  let extract = parts.join('\n\n').trim();
  if (extract.length > BELIEF_CHAR_CAP) extract = extract.slice(0, BELIEF_CHAR_CAP - 1).trimEnd() + '…';

  // Card title: human-friendly. Fallback to slug → title-case.
  const cardTitle = title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  // Card desc: target ~60 chars so the desc fits within 2 visible lines on
  // a 280px-wide card without mid-line truncation. Trim at the last word
  // boundary inside the cap so we never cut a word in half. Per user
  // direction 2026-05-03 — earlier 80-char hard slice produced
  // "...how clearly y..." mid-word breaks.
  const sourceForDesc = tldr || extract;
  const cardDesc = shortenAtWord(sourceForDesc, 60);

  beliefs[slug] = {
    title: cardTitle,
    tldr,
    extract,
    card_desc: cardDesc,
  };
  beliefTotalChars += extract.length;
  log(`  belief.${slug}: tldr=${tldr ? '✓' : '✗'} sections=${picked.length} extract=${extract.length}c`);
}

const outPath = resolve(ROOT, 'netlify/functions/lib/wiki-extracts.json');
const payload = {
  _meta: {
    generated_at: new Date().toISOString(),
    theme_count: Object.keys(out).length,
    belief_count: Object.keys(beliefs).length,
    total_chars: totalChars + beliefTotalChars,
    theme_chars: totalChars,
    belief_chars: beliefTotalChars,
  },
  themes: out,
  beliefs,
};
writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');

log(`wrote ${outPath}`);
log(`total: ${Object.keys(out).length} themes (${totalChars}c) + ${Object.keys(beliefs).length} beliefs (${beliefTotalChars}c) = ${totalChars + beliefTotalChars}c (~${Math.round((totalChars + beliefTotalChars) / 1024)}KB)`);
