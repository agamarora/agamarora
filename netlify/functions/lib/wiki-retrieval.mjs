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

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Renamed from __dirname to avoid collision with esbuild's auto-injected
// __dirname when Netlify Functions bundles ESM source. The collision throws
// "Identifier '__dirname' has already been declared" at module load.
const __thisDir = dirname(fileURLToPath(import.meta.url));

// Feature flag: set WIKI_READ_ENABLED=0 to disable both extracts + edges retrieval.
// Useful for testing the fallback path or disabling retrieval without code changes.
const WIKI_ENABLED = process.env.WIKI_READ_ENABLED !== '0';

// ---- Load bundles at module init -------------------------------------------
// These are loaded once per container cold-start. Subsequent requests reuse
// the module-level vars (no re-reads, no fetches).
//
// Why fs.readFileSync instead of createRequire:
// Netlify Functions bundles each function with esbuild, which inlines/rewrites
// `import.meta.url` and `createRequire(import.meta.url).require('./x.json')`
// in ways that break the resolver — `Cannot find module './wiki-extracts.json'`
// even though the file is shipped via includedFiles in netlify.toml. Reading
// the file directly via fs.readFileSync(resolve(__thisDir, 'x.json')) sidesteps
// the bundler entirely. The JSON files are flat data; no module semantics needed.

let wikiExtracts = null; // { _meta, themes: { [slug]: { title, purpose, sections[] } } }
let kgEdges = null;      // { _meta, edges[], theme_index: { [slug]: number[] } }

// Try multiple candidate paths because Netlify's esbuild bundles wiki-retrieval.mjs
// into the function output, flattening the directory structure. After bundling,
// __thisDir points to the bundled location (.netlify/functions-serve/groqHandler/
// netlify/functions/) — NOT the original lib/ subdirectory. The included_files
// config in netlify.toml ships the JSON next to the bundled .mjs at runtime, but
// in dev the bundle layout differs from the source. Try candidates in order:
//   1. Same dir as the (post-bundle) module (production prod-deployed layout)
//   2. lib/ subdir (production fallback if bundler nests differently)
//   3. parent's lib/ (dev mode where __thisDir is netlify/functions/)
function loadJsonFile(filename) {
  const candidates = [
    resolve(__thisDir, filename),
    resolve(__thisDir, 'lib', filename),
    resolve(__thisDir, '..', 'lib', filename),
    resolve(__thisDir, '..', filename),
  ];
  let lastErr = null;
  for (const path of candidates) {
    try {
      const text = readFileSync(path, 'utf8');
      return JSON.parse(text);
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error(`could not locate ${filename} in any candidate path`);
}

if (WIKI_ENABLED) {
  try {
    wikiExtracts = loadJsonFile('wiki-extracts.json');
  } catch (err) {
    console.warn('[wiki-retrieval] wiki-extracts.json not loaded:', err?.message);
  }

  try {
    kgEdges = loadJsonFile('wiki-kg-edges.json');
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

// ---- Belief extract retrieval (Phase 3 / fluffy-tinkering-crane) -----------
//
// Beliefs have a parallel data shape in wiki-extracts.json — see
// scripts/build-wiki-extracts.mjs. Each entry has { title, tldr, extract,
// card_desc }. extract is already capped at ~600 chars at build time.
//
// Caller passes the BARE slug (without `belief.` prefix). The namespacing
// happens at the classifier output layer; retrieval works in bare-slug space.
// Use bareBeliefSlug() from beliefs-enum.mjs to normalize at the boundary.

// Returns plain-text belief content for a belief slug (BARE — no prefix).
// Returns null if slug unknown or bundle missing.
export function getBeliefExtract(bareSlug) {
  if (!WIKI_ENABLED || !wikiExtracts) return null;
  if (typeof bareSlug !== 'string' || !bareSlug) return null;
  const entry = wikiExtracts.beliefs?.[bareSlug];
  if (!entry) return null;
  return entry.extract || null;
}

// Returns the title for a belief slug (BARE). Used by card-meta WIKI_BELIEFS
// registry build.
export function getBeliefTitle(bareSlug) {
  if (!WIKI_ENABLED || !wikiExtracts) return null;
  const entry = wikiExtracts.beliefs?.[bareSlug];
  return entry?.title || null;
}

// Returns the card-friendly desc (cap ~80c) for a belief slug (BARE).
export function getBeliefCardDesc(bareSlug) {
  if (!WIKI_ENABLED || !wikiExtracts) return null;
  const entry = wikiExtracts.beliefs?.[bareSlug];
  return entry?.card_desc || null;
}

// Returns char count of a belief's extract (for trace logging).
export function getBeliefExtractCharCount(bareSlug) {
  const extract = getBeliefExtract(bareSlug);
  return extract ? extract.length : 0;
}

// Iterate belief data (used by card-meta to build the registry).
// Returns { [bareSlug]: { title, tldr, extract, card_desc } } or {}.
export function getAllBeliefs() {
  if (!WIKI_ENABLED || !wikiExtracts) return {};
  return wikiExtracts.beliefs || {};
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
    extracts_beliefs: wikiExtracts ? Object.keys(wikiExtracts.beliefs || {}).length : 0,
    kg_edges_loaded: !!kgEdges,
    kg_edge_count: kgEdges ? (kgEdges.edges || []).length : 0,
  };
}
