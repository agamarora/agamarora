// wiki-retrieval.mjs
//
// Runtime wiki content and KG edge retrieval for /enter v3 synthesis path.
//
// Two exported functions:
//
//   getThemeExtract(slug)          → string (plain-text wiki content) | null
//   getEdgesForThemes(slugs)       → array of edge objects (~500 tokens for 5-10 slugs)
//
// Both run from module-init bundles (no HTTP, no cache, O(1) lookup).
//
// Per phase-d-decisions-2026-04-27.md Decision 2 (bundle wiki-extracts.json)
// + Decision 13 (KG edges at runtime) + D-3a task.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Feature flag: set WIKI_READ_ENABLED=0 to disable both extracts + edges retrieval.
// Useful for testing the fallback path or disabling retrieval without code changes.
const WIKI_ENABLED = process.env.WIKI_READ_ENABLED !== '0';

// ---- Load bundles at module init -------------------------------------------
// These are loaded once per container cold-start. Subsequent requests reuse
// the module-level vars (no re-reads, no fetches).

let wikiExtracts = null; // { _meta, themes: { [slug]: { title, purpose, sections[] } } }
let kgEdges = null;      // { _meta, edges[], theme_index: { [slug]: number[] } }

if (WIKI_ENABLED) {
  try {
    const req = createRequire(import.meta.url);
    wikiExtracts = req('./wiki-extracts.json');
  } catch (err) {
    console.warn('[wiki-retrieval] wiki-extracts.json not loaded:', err?.message);
  }

  try {
    const req = createRequire(import.meta.url);
    kgEdges = req('./wiki-kg-edges.json');
  } catch (err) {
    console.warn('[wiki-retrieval] wiki-kg-edges.json not loaded:', err?.message);
  }
}

// ---- Wiki extract retrieval ------------------------------------------------

// Returns plain-text wiki content for a theme slug, formatted for prompt injection.
// Includes: page purpose + up to 3 key sections (Core belief, How it formed, Tensions).
// Returns null if slug unknown or bundle missing.
export function getThemeExtract(slug) {
  if (!WIKI_ENABLED || !wikiExtracts) return null;
  if (typeof slug !== 'string') return null;

  const entry = wikiExtracts.themes?.[slug];
  if (!entry) return null;

  const parts = [];

  if (entry.title) parts.push(entry.title);
  if (entry.purpose) parts.push(entry.purpose);

  if (Array.isArray(entry.sections)) {
    // Prioritize key sections by heading keywords
    const PRIORITY_KEYWORDS = ['core belief', 'how it formed', 'what it implies', 'tension', 'open question'];
    const scored = entry.sections.map(s => {
      const headingLower = (s.heading || '').toLowerCase();
      const score = PRIORITY_KEYWORDS.findIndex(kw => headingLower.includes(kw));
      return { ...s, score: score === -1 ? 999 : score };
    });
    // Top 3 sections by priority, then by order
    const sorted = scored
      .sort((a, b) => a.score - b.score || 0)
      .slice(0, 3);

    for (const s of sorted) {
      if (s.heading) parts.push(`${s.heading}: ${s.text}`);
      else parts.push(s.text);
    }
  }

  const extract = parts.join('\n\n').trim();
  return extract || null;
}

// Returns char count of a theme's extract (for trace logging).
export function getThemeExtractCharCount(slug) {
  const extract = getThemeExtract(slug);
  return extract ? extract.length : 0;
}

// ---- KG edge retrieval -----------------------------------------------------

// Returns edges relevant to a list of theme slugs.
// For synthesis intent, injects 5-10 edges as relationship context.
// Returns empty array if no edges found or bundle missing.
export function getEdgesForThemes(slugs) {
  if (!WIKI_ENABLED || !kgEdges || !Array.isArray(slugs) || slugs.length === 0) return [];

  const edgeIdxSet = new Set();
  for (const slug of slugs) {
    const indices = kgEdges.theme_index?.[slug];
    if (Array.isArray(indices)) {
      for (const idx of indices) edgeIdxSet.add(idx);
    }
  }

  const allEdges = kgEdges.edges || [];
  return [...edgeIdxSet]
    .map(i => allEdges[i])
    .filter(Boolean)
    .slice(0, 10); // cap at 10 edges per spec (~500 tokens)
}

// Returns count of edges for trace logging.
export function getEdgesCount(slugs) {
  return getEdgesForThemes(slugs).length;
}

// Format edges for prompt injection (compact text representation).
// Produces ~300-500 tokens for 5-10 edges.
export function formatEdgesForPrompt(edges) {
  if (!Array.isArray(edges) || edges.length === 0) return '';

  const lines = [];
  for (const edge of edges) {
    if (edge.type === 'theme-theme') {
      const rel = edge.rel === 'tension-with' ? 'is in tension with' : edge.rel.replace(/-/g, ' ');
      lines.push(`- [${edge.from_slug}] ${rel} [${edge.to_slug}]: "${edge.from_one_line}" ↔ "${edge.to_one_line}"`);
    } else if (edge.type === 'belief-belief') {
      const rel = edge.rel === 'superseded_by' ? 'was superseded by' : edge.rel.replace(/-/g, ' ');
      lines.push(`- Belief evolution: "${edge.from_label}" ${rel} "${edge.to_label}"`);
    } else if (edge.type === 'theme-belief') {
      const rel = edge.rel.replace(/-/g, ' ');
      if (edge.direction === 'theme-to-belief') {
        lines.push(`- [${edge.theme_slug}] ${rel}: "${edge.belief_label}" (tier ${edge.belief_tier})`);
      } else {
        lines.push(`- Belief "${edge.belief_label}" (tier ${edge.belief_tier}) ${rel} [${edge.theme_slug}]`);
      }
    }
  }

  return lines.join('\n');
}

// Diagnostics for logging
export function wikiDiagnostics() {
  return {
    wiki_enabled: WIKI_ENABLED,
    extracts_loaded: !!wikiExtracts,
    extracts_themes: wikiExtracts ? Object.keys(wikiExtracts.themes || {}).length : 0,
    kg_edges_loaded: !!kgEdges,
    kg_edge_count: kgEdges ? (kgEdges.edges || []).length : 0,
  };
}
