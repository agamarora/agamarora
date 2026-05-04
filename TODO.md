# TODO — agamarora.com

**Single source of truth for open work.** Closed items pruned. Session logs (BASELINE-*.md, etc.) capture history; this file captures backlog.

Last updated: 2026-05-04 (Bulldozer wiki landed live on main. Em-dash sweep + dead CSS strip shipped. Backlog: rewrite remaining non-wiki surfaces in Bulldozer voice.).

---

## Active

### Bulldozer rewrite. Non-wiki surfaces
**Why:** Wiki landed 2026-05-04 (`/wiki/*` 30 pages). Other public surfaces still in pre-Bulldozer voice. Hiring manager who lands on `/lab/second-brain/` or `/resume` from a /enter card click drops out of the L7-memo register. Inconsistent voice across surfaces is the next biggest credibility leak.

**Editorial contract:** Bulldozer spec at `~/.claude/plans/lets-think-this-through-staged-zebra.md` sections 5.1-5.10 (binding). Anchor reference: live `/wiki/agent-first/` + `/wiki/beliefs/agent-first/`. 15-point rubric per spec section 5.10.

**Backlog. Per-surface state + scope:**

| Surface | File | Voice state | Scope |
|---|---|---|---|
| `/lab/` | `lab/index.html` | OLD | Card titles + descs + lead copy. 4 lab cards |
| `/lab/second-brain/` | `lab/second-brain/index.html` | OLD (PRFAQ shape) | PRFAQ body text. Subhead. Quote-tile copy. Paste-prompt block intact. |
| `/lab/ai-resume/` | `lab/ai-resume/index.html` | OLD (PRFAQ shape) | PRFAQ body. Setup wizard paste-prompt unchanged. |
| `/lab/voice-ai-production/` | `lab/voice-ai-production/index.html` | OLD (case study) | Body sections. Lead. Lessons. Should align with `/wiki/voice-ai-craft/` register. |
| `/lab/product-shape/` | `lab/product-shape/index.html` | OLD (case study) | Body. Lead. Three-section structure. |
| `/resume` | `resume/index.html` | OLD subtitle ("B2B AI PM. Technical PM, AI agents. 12 years. 5 industries.") + role bullets | Subtitle. Each role bullet against 15-point rubric. Skip dates + employer names (factual ground truth). |
| `resume.md` | `resume.md` | OLD ground-truth file | Summary line + role bullets. **Re-run `/enter` eval per Phase D workflow if bullets shift materially.** |
| `/moodboard` | `moodboard/index.html` | OLD (design doc, orphan) | Lowest pri. Internal design ref, not user-facing path. Skip unless re-promoted. |
| `/enter` UI text | `enter/index.html` | OLD (locked-ish) | Status bar verbs + empty-state copy. **Locked scope per `docs/plans/enter-v3.1-spec.md` §5**. Touch only if user explicitly opens. |
| `/wiki/themes/` landing hero | `wiki/themes/index.html` | Phase 6 already touched | Quick re-grade against rubric. May need second pass. |
| `/wiki/beliefs/` landing | `wiki/beliefs/index.html` (built from `scripts/build-wiki.mjs`) | Phase 6 already touched | Same. |
| `README.md` | `readme.md` | LOCKED per user 2026-05-03 | Do NOT touch unless user re-opens. |

**Locked / do NOT touch:**
- `groqHandler.mjs` system prompt (locked positioning per `feedback_positioning.md`)
- `og-master.jpg` (user said "forget the og image. Nothing changes" 2026-05-04)
- Locked positioning text in `~/.claude/projects/D--AA-agamarora/memory/project_positioning_locked.md`

**Execution approach (per the Phase 5 pattern that worked on wiki):**
1. Read source page. Read anchor refs. Read rubric.
2. Edit in place per Bulldozer rules. ZERO em-dashes. Banned vocab body 0. Hedging 0. Hook ≤80w. Bottom line ≤120w. ≥3 H2 (where article-shape applies). ≥3 distinct action verbs.
3. Self-grade against 15-point rubric. Iterate to A or B+.
4. Visual diff in headed gstack browser before merge to main.
5. Eval re-run if `resume.md` bullets shifted.
6. Commit per surface or per logical group.

**Estimated effort:** ~6-8 hr CC for the lab batch + resume + landings second pass. ~2 hr Agam for spot-checks.

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
