# TODO — agamarora.com

**Single source of truth for open work.** Closed items pruned. Session logs (BASELINE-*.md, etc.) capture history; this file captures backlog.

Last updated: 2026-05-05 (Rubric v2 locked + all 31 wiki source drafts revised + lint script updated + pushed to dev as 77880d7. Pre-main gate: Real-Groq /enter eval + manual UI smoke per Phase D workflow.).

---

## Active

### Real-Groq /enter eval + UI smoke (gate before main merge)
**Why:** Rubric v2 revisions changed wiki extracts (`netlify/functions/lib/wiki-extracts.json` regenerated). Per Phase D workflow + `feedback_phase_d_workflow.md`, all `/enter` work needs netlify dev + headed gstack browser smoke. Synthesis quality against v2-revised extracts is unverified.

**Pre-conditions:**
- Working `GROQ_API_KEY` in `.env`
- `netlify dev` running on 8888
- gstack browser headed

**Steps:**
1. `npm run eval:e2e` — pass = ≥26/28 (Phase 7 baseline)
2. Manual UI drive 6-8 representative scenarios through `/enter` per Phase D workflow. Check synthesis answers carry the v2 voice (calibrated hedging, first-person where source supports, forward-opening). Verify cards/traces/citations still wire.
3. Visual diff 3-5 representative wiki pages (anchor + 2 themes + 2 beliefs) in headed browser. Check em-dash sweep didn't break readability anywhere severe.

**Pass criteria:** ≥26/28 eval pass + manual smoke clean + visual diff acceptable. Then merge `dev` → `main`.

**Risks to watch:**
- Em-dash sweep was rule-based. Some replacements may read awkwardly (parenthetical em-dashes mapping to comma-comma). If a section reads broken, edit in-place + recommit.
- /enter agent answers use synthesis prompt that was tuned against Bulldozer extracts. Voice register shift in extracts may shift synthesis output in unexpected directions.

### Bulldozer rewrite. Wiki landings second-pass only
**Why:** Wiki landed 2026-05-04 (`/wiki/*` 30 pages). User scoped down 2026-05-05: **`/`, `/resume`, `/lab/*` ALL OUT.** Only wiki landings (`/wiki/themes/`, `/wiki/beliefs/`) eligible for re-grade against rubric.

**Editorial contract:** Bulldozer spec at `~/.claude/plans/lets-think-this-through-staged-zebra.md` sections 5.1-5.10 (binding). Anchor reference: live `/wiki/agent-first/` + `/wiki/beliefs/agent-first/`. 15-point rubric per spec section 5.10.

**Backlog. Per-surface state + scope:**

| Surface | File | Voice state | Scope |
|---|---|---|---|
| `/wiki/themes/` landing hero | `wiki/themes/index.html` | Phase 6 already touched | Quick re-grade against rubric. May need second pass. |
| `/wiki/beliefs/` landing | `wiki/beliefs/index.html` (built from `scripts/build-wiki.mjs`) | Phase 6 already touched | Same. |

**Out of scope (user calls 2026-05-05):**
- `/` (home / root `index.html`) — stays as-is.
- `/resume` + `resume.md` — stays as-is.
- `/lab/*` (all subpages incl. second-brain, ai-resume, voice-ai-production, product-shape) — stays as-is.
- `/moodboard` — orphan design doc, skip.
- `/enter` UI text — locked per `docs/plans/enter-v3.1-spec.md` §5.
- `README.md` — locked per user 2026-05-03.

**Locked / do NOT touch:**
- `groqHandler.mjs` system prompt (locked positioning per `feedback_positioning.md`)
- `og-master.jpg` (user said "forget the og image. Nothing changes" 2026-05-04)
- Locked positioning text in `~/.claude/projects/D--AA-agamarora/memory/project_positioning_locked.md`

**Execution approach (per the Phase 5 pattern that worked on wiki):**
1. Read source page. Read anchor refs. Read rubric.
2. Edit in place per Bulldozer rules. ZERO em-dashes. Banned vocab body 0. Hedging 0. Hook ≤80w. Bottom line ≤120w. ≥3 H2 (where article-shape applies). ≥3 distinct action verbs.
3. Self-grade against 15-point rubric. Iterate to A or B+.
4. Visual diff in headed gstack browser before merge to main.
5. Commit per surface or per logical group.

**Estimated effort:** ~30-45 min CC. Could also be triaged as "ship as-is" since landings already touched in Phase 6.

### Real-Groq /enter eval (re-run when next on Groq)
**Why:** Phase 7 baseline ran 26/28 PASS but most synthesis answers fell back to "Service is busy" because Groq was rate-limited / key fallback during eval window. Wire shape + retrieval + cards + traces validated. Synthesis quality not validated against Bulldozer-rewritten extracts.

**Action:** with working Groq key in `.env`, re-run `npm run eval:e2e`. Manually drive 6-8 representative scenarios through `/enter` UI per Phase D workflow. Verify Bulldozer voice carries from wiki extracts into agent answers.

**Pass:** ≥26/28 + manual UI smoke clean.

### Phase 9 AEO smoke (post-deploy, 24-48h after main deploy)
Per spec section 6 Phase 9: query Perplexity + ChatGPT search for the 5 target phrases, verify Agam frameworks surface in ≥2/5 within 7 days.

---

## Build infra

- [ ] **`scripts/lib/kg-parse.mjs` unit tests.** Refactor done. Test file `tests/kg-parse.test.mjs` (referenced in source comment) not created. 6 test gaps: orphan-edge --strict, tableUnder branches, allTablesUnder EOF, cleanSlug, edge regex parsers, addBelief dedup. Tracked as B7.

---

## Parked (revisit later, not committed to ship)

### CEO C5 — niche cascade to non-/enter surfaces (uncertain)
Agent-first niche shipped 2026-05-03 inside Netlify function only. Recruiter cold-scan of `/resume` or `/` still leads with "Engineer-PM. Voice AI." Verified 2026-05-03: `index.html` title still "AI Product Manager. Engineer-PM. Builder."; `resume/index.html` meta desc still leads "voice AI at enterprise scale". Triaged 2026-05-03 — keep visible, defer commit.

If picked up: rewrite `/` + `/resume` `<title>` / meta / OG / JSON-LD + `<h1>` tagline. Re-export `assets/og/og-master.jpg` with new tagline. LinkedIn headline manual. Source of truth: `~/.claude/projects/D--AA-agamarora/memory/project_positioning_locked.md`.

### Phase 4 — `/enter` demo pazzazz (uncertain)
Zero code shipped (verified 2026-05-03 — no citations, pill-expand, mini-graph in `enter/index.html` or `groqHandler.mjs`). LOCKED scope per `docs/plans/enter-v3.1-spec.md` §5. Triaged 2026-05-03 — keep visible, defer commit.

| ID | What |
|---|---|
| W1 | Inline citations `[1][2]` in answer prose. Server-side post-synthesis substring/fuzzy match. Hover preview desktop, tap mobile. |
| E7 | Pill click-to-expand. Click trace pill → inline expand to first 200 chars + link. Server already has the content. |
| W4 | Mini-graph. Real Canvas ~160px tall between trace pills + answer. Reuses `/wiki/graph` engine, scoped to retrieved subgraph. |

Phase 5 + 6 deferred. See spec §5.

---

## Reference

- Architecture / system stitching: `~/.claude/plans/rosy-plotting-flame.md`
- second-brain v1 canonical spec: `docs/plans/second-brain-v1.md`
- `/enter` v3.1 spec: `docs/plans/enter-v3.1-spec.md`
- Phase A status (closed): `docs/plans/second-brain-v1-phase-a/STATUS.md`
- Last session log: `docs/plans/BASELINE-2026-04-26.md`
- Phase D dev + eval workflow: `docs/plans/phase-d-dev-workflow.md` (BINDING for any /enter change)
- AEO/SEO gate audit (CLEARED): `docs/plans/aeo-gate-final-audit-2026-04-27.md`
- Locked positioning: `~/.claude/projects/D--AA-agamarora/memory/project_positioning_locked.md`
- Auto-memory index: `~/.claude/projects/D--AA-agamarora/memory/MEMORY.md`

---

## Closed (2026-05-04)

**Shipped on `dev` (was `dev/c5-niche-cascade`, renamed):**
- ~~Bulldozer rewrite (Phases 0-7)~~ — full /wiki/ rewrite landed on dev. 30 articles rewritten as L7 strategy memos (11 themes + 18 beliefs + 1 meta as "Operator aphorisms"). Voice meta retired. Build pipeline strip (chrome, page-purpose, em-dash). New lint script `scripts/lint-bulldozer.mjs`. /enter eval baseline 26/28 PASS. Spec sections 5.1-5.10 in `~/.claude/plans/lets-think-this-through-staged-zebra.md` are binding. Anchors: agent-first theme + belief.
- ~~`/writing/` framework~~ — built then RETIRED same week. Bulldozer review locked single-publication architecture: `/wiki/` is the canonical surface, `/writing/` is gone. `scripts/build-writing.mjs`, `writing/`, `content/writing/`, marker blocks, build chain entry, sitemap rows all removed. 301 `/writing/* → /wiki/graph/` in netlify.toml. Seed post migrated into `/wiki/spec-first-taste/` Phase 2.
- ~~Voice meta page (`/wiki/voice/`) retired~~ — collapsed into Bulldozer architecture. 301 to `/wiki/graph/`.
- ~~Wiki Related footer relabeled~~ — H2 changed from "Related" to "Related architecture memos" per 15-point rubric item #14.

---

## Closed / dropped this audit (2026-05-03)

**Verified shipped — do NOT relitigate:**
- ~~Favicon 404~~ — files exist at root + `/assets/`. Both paths work. False alarm.
- ~~`/wiki/` OG image~~ — `og-wiki.jpg` shipped + wired in `wiki/themes/index.html:15`.
- ~~Card schema validation~~ — `validateLLMCards` shipped at `card-meta.mjs:501`, used in `groqHandler:747`, has tests at `card-meta.test.mjs:43+`.
- ~~AEO/SEO BINDING gate~~ — CLEARED 2026-04-27 per `aeo-gate-final-audit-2026-04-27.md`. 14 tasks shipped.
- ~~Phase E publish to Medium + LinkedIn~~ — already shipped. Links live in `lab/second-brain/index.html:799,803`.

**Dropped — won't pursue:**
- ~~/enter thinking-dots animation~~ — cosmetic, not chasing.
- ~~/enter response evals re-run~~ — Apr 27 issues untested, niche-locked prompt may have resolved; not worth proactive sweep.
- ~~/enter conversational follow-ups~~ — vague, no clear ROI.
- ~~/enter deflect-rule audit~~ — already tightened 2026-05-03.
- ~~HTML stats drift in `wiki/themes/index.html`~~ — theoretical, only breaks if ontology changes; currently stable.
