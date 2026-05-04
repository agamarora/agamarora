# TODO — agamarora.com

**Single source of truth for open work.** Closed items pruned. Session logs (BASELINE-*.md, etc.) capture history; this file captures backlog.

Last updated: 2026-05-04 (Bulldozer rewrite SHIPPED Phases 0-7 on dev. Wiki rewritten as single publication. Outstanding: real-Groq UI eval before main merge + remaining surfaces (`/`, `/resume`, `/lab/*`) need Bulldozer pass).

---

## Active

### Real-Groq /enter eval (gate before main merge)
**Why:** Phase 7 baseline (2026-05-04) ran 26/28 PASS but most synthesis answers fell back to "Service is busy" because Groq was rate-limited / key fallback during the eval window. Wire shape + retrieval + cards + traces validated; synthesis quality not validated.

**Action:** with working Groq key in `.env`, re-run `npm run eval:e2e`. Manually drive 6-8 representative scenarios through `/enter` UI per Phase D workflow. Verify the Bulldozer voice carries from wiki extracts into agent answers.

**Pass:** ≥26/28 + manual UI smoke clean → green-light merge to main.

### Ruthless copy pass — non-wiki surfaces
**Why:** Wiki was Bulldozer'd 2026-05-04 (Phase 5). Non-wiki surfaces still need the same pass. C5 niche cascade flipped titles + meta on `/` and `/resume` but body copy is unchanged. Apply Bulldozer voice + 15-point rubric to remaining surfaces.

**Scope:** `/` (`index.html`), `/resume` (`resume/index.html`), `resume.md`, `/lab/` (`lab/index.html`), `/lab/<slug>/` PRFAQs, `/moodboard` (orphan, lowest pri).
Skip: `/enter` UI (locked), `groqHandler.mjs` system prompt (locked), `README.md` (locked 2026-05-03), `og-master.jpg` (image, defer), all wiki pages (already done Phase 5).

**Editorial contract:** the Bulldozer spec at `~/.claude/plans/lets-think-this-through-staged-zebra.md` sections 5.1-5.10 is binding. Anchor reference: the live `wiki/agent-first` theme + `wiki/beliefs/agent-first` belief.

**Execution plan (per-surface):**
- [ ] `/` (`index.html`) — hero tagline + greeting line + CTA copy
- [ ] `/resume` (`resume/index.html`) — role bullets + summary subtitle
- [ ] `resume.md` — Summary + role bullets (ground truth, used by /enter — re-run eval after if bullets shift materially)
- [ ] `/lab/` (`lab/index.html`) — card descs
- [ ] `/lab/second-brain/`, `/lab/ai-resume/`, `/lab/voice-ai-production/`, `/lab/product-shape/` — PRFAQ body
- [ ] `/moodboard/` (orphan, lowest pri) — optional

**Boundaries:**
- Stay on `dev` until manual UI smoke + real-Groq eval pass.
- UI sacrosanct rule: any rendered-surface change → before/after visual diff in headed gstack browser before merging to main.
- If `resume.md` bullets change, re-run /enter eval per Phase D workflow.
- Em-dash hard rule: zero in any shipped HTML/MD/JSON/TXT.

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
