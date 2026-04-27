// themes-enum.mjs
//
// Single source of truth for valid theme slugs.
// Used by:
//   - classifier.mjs to validate themes_likely[] from LLM
//   - eval-prompt.mjs scenario assertions
//   - card slug resolvers
//
// Derived from KG_THEMES_SUMMARY (kg-themes-summary.mjs).
//
// Per docs/plans/phase-d-decisions-2026-04-27.md Decision 4
// (closes critical hallucinated-slug gap).

import { KG_THEMES_SUMMARY } from './kg-themes-summary.mjs';

export const THEME_SLUGS = KG_THEMES_SUMMARY.map(t => t.slug);
export const THEME_SLUGS_SET = new Set(THEME_SLUGS);

export function isValidThemeSlug(slug) {
  return typeof slug === 'string' && THEME_SLUGS_SET.has(slug);
}

// Filter an array of slug strings — drop unknowns, keep order, dedupe.
// Caller logs `classifier_invalid_slug` for dropped entries.
export function filterValidSlugs(slugs) {
  if (!Array.isArray(slugs)) return { valid: [], dropped: [] };
  const seen = new Set();
  const valid = [];
  const dropped = [];
  for (const s of slugs) {
    if (typeof s !== 'string') { dropped.push(s); continue; }
    if (!THEME_SLUGS_SET.has(s)) { dropped.push(s); continue; }
    if (seen.has(s)) continue;
    seen.add(s);
    valid.push(s);
  }
  return { valid, dropped };
}
