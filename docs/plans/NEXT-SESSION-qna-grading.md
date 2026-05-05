# Next session — /enter Q&A grading + refinement

**Date opened:** 2026-05-05 (end of rubric v2 session)
**Branch:** `main` (dev synced + merged + pushed as `4a043da`)
**Live:** agamarora.com auto-deploys from main on push.

---

## State at session close

**Shipped to main this session:**
- Writing rubric v2 (`docs/plans/writing-rubric-v2.md`) — 18-point rubric, replaces Bulldozer 15-point.
- 31 wiki source drafts revised (12 themes + 19 beliefs) → v2 voice register.
- Lint script v2 — `npm run lint:bulldozer --strict` passes 0 violations.
- Em-dash sweep — 220 replacements across 31 source drafts via `scripts/sweep-em-dashes.mjs`.
- Build outputs regenerated: 31 HTML pages + `wiki-extracts.json` + `wiki-kg-edges.json` + `kg.json`.

**Eval gate cleared:**
- `npm run eval:e2e` returned **28/28 PASS** against Real-Groq with v2 extracts (Phase 7 baseline was 26/28).
- Wire shape, retrieval, cards, traces, synthesis quality all green.

**Skipped at user direction:** manual UI smoke + visual diff. User chose to merge directly + spin up a focused next session for /enter Q&A grading.

---

## Goal of next session

**Grade and refine /enter Q&A responses, end-to-end.**

The 28-scenario eval validates wire + retrieval + synthesis at a coarse level (banned terms, voice rules, card metadata, trace shape). It does **not** grade the *quality* of the synthesis answer the user reads. That's the next-session lift.

Three layers of grading:

1. **Answer quality grading.** For each of the 28 scenarios, read the actual answer text. Grade it on:
   - First-hand specificity (named numbers, named systems, named projects)
   - Calibrated hedging (claims attached to real evidence)
   - Voice register (matches v2 anchor pages, not Bulldozer-cold)
   - Forward-opening close where natural (the answer doesn't dead-end on a metric recap)
   - Honest "I don't know" when the corpus doesn't support a claim

2. **Card relevance grading.** For each scenario, are the 3 cards (1 primary + 2 secondary) the right cards for that question? Or does the retrieval surface miss the obvious match?

3. **Refinement loop.** When an answer fails a grade item, identify which lever fixes it:
   - Wiki extract content (revise the source draft → regen extracts)
   - System prompt (revise `groqHandler.mjs` synthesis prompt — locked positioning per `feedback_positioning.md`, but voice rules can be tuned)
   - Card metadata (revise card titles, descriptions, slugs in `card-meta.mjs`)
   - Few-shot examples (revise the embedded shots in the system prompt)

Each refinement → re-run eval → diff against this session's baseline (28/28).

---

## Suggested workflow

### Phase 1: Capture baseline

Run `npm run eval:e2e` and save the full output (with answer text, cards, traces) to `docs/plans/eval-results/qna-grading-baseline-2026-05-XX.md`.

### Phase 2: Manual answer grading

For each of 28 scenarios, write a one-line grade against the answer. Pattern:

```
[scenario-id] GRADE / failure mode (if any) / fix lever
[belief-agent-first] A — clean, named numbers, forward implication
[belief-help-market-flourish] B — vague, no named example, fix at extract
[theme-pm-taste] C — recap close, fix at synthesis prompt voice rule
```

### Phase 3: Cluster + fix in priority order

Cluster failures by lever:
- "Extract gap" cluster → revise specific source drafts → regen extracts → re-eval
- "Synthesis prompt drift" cluster → tune voice rules in `groqHandler.mjs` → re-eval
- "Card retrieval miss" cluster → revise `card-meta.mjs` candidate set → re-eval

Each fix is one commit. Push to dev. Eval after each push. Don't batch.

### Phase 4: Visual smoke + ship

Manual UI drive 6-8 representative scenarios in headed gstack browser. Confirm answers carry the v2 voice in the actual rendered surface (font, line-height, citation pills, mini-graph if shipped, etc.).

Merge to main. Netlify auto-deploys.

---

## Reference material

**Binding rubric:** `docs/plans/writing-rubric-v2.md` (18 points).

**Anchor exemplars:**
- `docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final/agent-first.md`
- `docs/plans/second-brain-v1-phase-a/synthesis/belief-page-drafts-final/agent-first.md`

**System prompt:** `netlify/functions/groqHandler.mjs` (locked positioning; voice rules tunable).

**Eval scenarios:** `scripts/eval-e2e.mjs` (28 scenarios + banned-terms + voice rules + card schema validation).

**Phase D dev workflow:** `docs/plans/phase-d-dev-workflow.md` — netlify dev + headed gstack browser + drive real /enter UI.

**Locked memory references:**
- `feedback_phase_d_workflow.md` — every /enter change uses real DOM smoke
- `feedback_ui_sacrosanct.md` — visual diff before main merge
- `feedback_enter_user_voice.md` — agent answers translate corpus jargon to plain English; concrete evidence over abstract claims; action-titled cards
- `feedback_positioning.md` — locked positioning, do not touch system-prompt positioning lines
- `project_writing_rubric_v2.md` — rubric v2 + state on main as of 2026-05-05

**Last eval result:** 28/28 PASS this session. Use as the diff baseline.

---

## Open questions for next session

- Should the grading scale produce a per-scenario letter grade and a global score (e.g. "26/28 A or B+")?
- What's the bar for "ship vs iterate"? 24/28 at A/B+? 26/28 at A only?
- Do we want a graded eval CSV checked in alongside baseline.md, or just the prose grading?
- Agent answers occasionally use third-person ("Agam thinks...") instead of /enter's intended first-person Agam voice. Worth tightening, or accepted?
