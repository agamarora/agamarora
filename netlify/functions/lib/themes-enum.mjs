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
import { isBeliefSlug } from './beliefs-enum.mjs';

export const THEME_SLUGS = KG_THEMES_SUMMARY.map(t => t.slug);
export const THEME_SLUGS_SET = new Set(THEME_SLUGS);

// Non-theme markers the classifier may emit. These don't correspond to
// wiki themes — they signal special routing intents that groqHandler
// reads to inject context (channel list, etc.) and surface specific
// cards. Kept narrow to avoid hallucinated-slug regressions.
//
// `headline` (added 2026-05-03) marks superlative queries ("best work",
// "biggest project") — groqHandler injects the HEADLINE WORK block.
export const SPECIAL_MARKERS_SET = new Set(['contact', 'headline']);

export function isValidThemeSlug(slug) {
  return typeof slug === 'string' && THEME_SLUGS_SET.has(slug);
}

// Filter an array of slug strings — drop unknowns, keep order, dedupe.
// Caller logs `classifier_invalid_slug` for dropped entries.
// Accepted: theme slugs, SPECIAL_MARKERS_SET, namespaced belief slugs
// (e.g. `belief.agent-first`).
export function filterValidSlugs(slugs) {
  if (!Array.isArray(slugs)) return { valid: [], dropped: [] };
  const seen = new Set();
  const valid = [];
  const dropped = [];
  for (const s of slugs) {
    if (typeof s !== 'string') { dropped.push(s); continue; }
    const ok = THEME_SLUGS_SET.has(s) || SPECIAL_MARKERS_SET.has(s) || isBeliefSlug(s);
    if (!ok) { dropped.push(s); continue; }
    if (seen.has(s)) continue;
    seen.add(s);
    valid.push(s);
  }
  return { valid, dropped };
}
