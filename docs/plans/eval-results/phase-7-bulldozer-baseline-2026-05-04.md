# /enter eval baseline — post-Bulldozer

**Date:** 2026-05-04
**Branch:** dev
**Commit:** Phase 6 = `ee93a7e`
**Eval harness:** `scripts/eval-e2e.mjs` driving local netlify dev SSE endpoint
**Total scenarios:** 28

## Result

**26/28 PASS** — meets spec section 6 Phase 7 threshold (≥26/28).

## Failures (2)

1. **`[contact]`** — `book-call should be priority`. The book-call card surfaced but not in priority position. Routing edge case.
2. **`[belief-linkedin-as-instrumental-platform]`** — trace missing pull/read/fetch verb (got `parsed,composed`). Retrieval emitted no pull-verb event for this slug.

Both failures look like pre-existing routing logic edge cases, not Bulldozer rewrite regressions. Cards still surface correctly across all 28 scenarios.

## Notes

- Most synthesis answers landed on the "Service is busy" fallback because Groq API hit rate-limit / auth fallback during the eval window. The infrastructure tests (SSE wire shape, retrieval, cards, trace, deflect rules) still validated. A real human-driven eval through the UI with a working Groq key is the next gate before merge to main.
- Extracts size grew post-Bulldozer: 75986c (pre) -> 94450c (post). Retrieval has more content to pull from, not less.
- KG ontology preserved: 152 nodes, 111 edges (kg.json). Phase 5 source rewrites did not break ontology integrity.

## Action items before merge to main

- [ ] Re-run eval harness with working Groq key to validate synthesis quality (not just wire).
- [ ] Manual UI smoke of 6-8 representative scenarios per Phase D workflow.
- [ ] Investigate the two routing edge cases (`[contact]` priority, belief-linkedin trace) — may be pre-existing, may be related to Phase 5 rewrites.
