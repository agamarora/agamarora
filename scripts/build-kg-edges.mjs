#!/usr/bin/env node
// build-kg-edges.mjs
//
// Reads wiki/kg.json and emits netlify/functions/lib/wiki-kg-edges.json.
// Output is a curated subset of KG edges for runtime retrieval:
//   - theme-to-theme: tension-with edges (bidirectional)
//   - belief-to-belief: superseded_by (belief evolution)
//   - belief-to-theme: builds_on where src/dst relates to a theme
//
// The function imports this JSON at module init for zero-latency edge
// retrieval at synthesis time (~500 token injection, ~5-10KB).
//
// Per phase-d-decisions-2026-04-27.md Decision 13 (KG edges at runtime)
// + CEO expansion plan (D-3a task).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KG_THEMES_SUMMARY } from '../netlify/functions/lib/kg-themes-summary.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const STRICT = process.argv.includes('--strict');

const log = (...a) => console.log('[build-kg-edges]', ...a);
const fail = (msg) => { console.error('[build-kg-edges] ERROR:', msg); process.exit(1); };

// ---- Load kg.json ----------------------------------------------------------

const kgPath = resolve(ROOT, 'wiki/kg.json');
if (!existsSync(kgPath)) {
  fail(`wiki/kg.json not found at ${kgPath}`);
}

const kg = JSON.parse(readFileSync(kgPath, 'utf8'));
const nodes = kg.nodes || [];
const edges = kg.edges || [];

log(`loaded kg.json: ${nodes.length} nodes, ${edges.length} edges`);

// ---- Build lookup maps -----------------------------------------------------

const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
const themeNodes = nodes.filter(n => n.type === 'Theme');
const themeIdToSlug = Object.fromEntries(themeNodes.map(n => [n.id, n.slug]));
const themeSlugToId = Object.fromEntries(themeNodes.map(n => [n.slug, n.id]));
const beliefNodes = nodes.filter(n => n.type === 'Belief');
const beliefById = Object.fromEntries(beliefNodes.map(n => [n.id, n]));

// Theme slug set for validation
const VALID_THEME_SLUGS = new Set(KG_THEMES_SUMMARY.map(t => t.slug));

// ---- Extract relevant edges ------------------------------------------------

// Target relationship types for the runtime bundle
const TARGET_RELS = new Set(['tension-with', 'superseded_by', 'builds_on', 'supersedes', 'contradicts']);

const outputEdges = [];

for (const edge of edges) {
  if (!TARGET_RELS.has(edge.rel)) continue;

  const fromNode = nodeById[edge.from];
  const toNode = nodeById[edge.to];
  if (!fromNode || !toNode) continue;

  const fromType = fromNode.type;
  const toType = toNode.type;

  // Case 1: Theme → Theme edge (tension-with, builds_on, supersedes)
  if (fromType === 'Theme' && toType === 'Theme') {
    const fromSlug = fromNode.slug;
    const toSlug = toNode.slug;
    if (!VALID_THEME_SLUGS.has(fromSlug) || !VALID_THEME_SLUGS.has(toSlug)) continue;

    const fromTheme = KG_THEMES_SUMMARY.find(t => t.slug === fromSlug);
    const toTheme = KG_THEMES_SUMMARY.find(t => t.slug === toSlug);

    outputEdges.push({
      type: 'theme-theme',
      rel: edge.rel,
      from_slug: fromSlug,
      from_label: fromTheme?.title || fromSlug,
      from_one_line: fromTheme?.one_line || '',
      to_slug: toSlug,
      to_label: toTheme?.title || toSlug,
      to_one_line: toTheme?.one_line || '',
      bidirectional: edge.bidirectional || false,
    });
    continue;
  }

  // Case 2: Belief → Belief edge (superseded_by — belief evolution)
  if (fromType === 'Belief' && toType === 'Belief') {
    // Resolve parent themes
    const fromThemeId = fromNode.parent_theme;
    const toThemeId = toNode.parent_theme;
    const fromThemeSlug = fromThemeId ? themeIdToSlug[fromThemeId] || fromThemeId?.replace('theme.', '') : null;
    const toThemeSlug = toThemeId ? themeIdToSlug[toThemeId] || toThemeId?.replace('theme.', '') : null;

    outputEdges.push({
      type: 'belief-belief',
      rel: edge.rel,
      from_id: edge.from,
      from_label: fromNode.label || edge.from,
      from_theme: fromThemeSlug,
      to_id: edge.to,
      to_label: toNode.label || edge.to,
      to_theme: toThemeSlug,
    });
    continue;
  }

  // Case 3: Theme ↔ Belief (builds_on where a theme connects to/from a belief)
  if ((fromType === 'Theme' && toType === 'Belief') || (fromType === 'Belief' && toType === 'Theme')) {
    const themeNode = fromType === 'Theme' ? fromNode : toNode;
    const beliefNode = fromType === 'Belief' ? fromNode : toNode;
    const themeSlug = themeNode.slug;
    if (!VALID_THEME_SLUGS.has(themeSlug)) continue;

    const themeSummary = KG_THEMES_SUMMARY.find(t => t.slug === themeSlug);

    outputEdges.push({
      type: 'theme-belief',
      rel: edge.rel,
      theme_slug: themeSlug,
      theme_label: themeSummary?.title || themeSlug,
      belief_id: beliefNode.id,
      belief_label: beliefNode.label || beliefNode.id,
      belief_tier: beliefNode.tier,
      direction: fromType === 'Theme' ? 'theme-to-belief' : 'belief-to-theme',
    });
  }
}

log(`extracted ${outputEdges.length} edges (theme-theme: ${outputEdges.filter(e => e.type==='theme-theme').length}, belief-belief: ${outputEdges.filter(e => e.type==='belief-belief').length}, theme-belief: ${outputEdges.filter(e => e.type==='theme-belief').length})`);

if (outputEdges.length < 10) {
  const msg = `too few edges extracted (${outputEdges.length} < 10 minimum)`;
  if (STRICT) fail(msg); else log('WARN:', msg);
}

// ---- Build theme-indexed lookup for runtime retrieval ----------------------
// For each theme slug, pre-index which edges are relevant so retrieval is O(1).

const themeEdgeIndex = {};
for (const slug of VALID_THEME_SLUGS) {
  themeEdgeIndex[slug] = [];
}

for (const edge of outputEdges) {
  if (edge.type === 'theme-theme') {
    if (themeEdgeIndex[edge.from_slug]) themeEdgeIndex[edge.from_slug].push(outputEdges.indexOf(edge));
    if (edge.bidirectional && themeEdgeIndex[edge.to_slug]) themeEdgeIndex[edge.to_slug].push(outputEdges.indexOf(edge));
  } else if (edge.type === 'theme-belief') {
    if (themeEdgeIndex[edge.theme_slug]) themeEdgeIndex[edge.theme_slug].push(outputEdges.indexOf(edge));
  } else if (edge.type === 'belief-belief') {
    // Index under both source and destination themes if they're valid
    if (edge.from_theme && themeEdgeIndex[edge.from_theme]) themeEdgeIndex[edge.from_theme].push(outputEdges.indexOf(edge));
    if (edge.to_theme && edge.to_theme !== edge.from_theme && themeEdgeIndex[edge.to_theme]) {
      themeEdgeIndex[edge.to_theme].push(outputEdges.indexOf(edge));
    }
  }
}

// ---- Write output ----------------------------------------------------------

const totalChars = JSON.stringify(outputEdges).length;

const payload = {
  _meta: {
    generated_at: new Date().toISOString(),
    source: 'wiki/kg.json',
    edge_count: outputEdges.length,
    total_chars: totalChars,
    target_rels: [...TARGET_RELS],
  },
  edges: outputEdges,
  theme_index: themeEdgeIndex,
};

const outPath = resolve(ROOT, 'netlify/functions/lib/wiki-kg-edges.json');
writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n');

log(`wrote ${outPath}`);
log(`total: ${outputEdges.length} edges, ${totalChars} chars (~${Math.round(totalChars / 1024)}KB)`);
log(`theme index: ${Object.keys(themeEdgeIndex).length} themes indexed`);
