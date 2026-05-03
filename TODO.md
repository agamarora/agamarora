# TODO — agamarora.com

**Single source of truth for open work.** Closed items pruned. Session logs (BASELINE-*.md, etc.) capture history; this file captures backlog.

Last updated: 2026-05-03 (audited + triaged — stale entries removed, deferred items parked).

---

## Active

### `/writing/` framework — new content surface + build pipeline
**Why:** no home today for freeform essays / POV / industry commentary. `/lab/` is product PRFAQs, `/wiki/` is curated synthesis. Adding posts pollutes wiki; staying silent blocks blog cadence. Spec'd 2026-05-03, build pending.

- [ ] `scripts/build-writing.mjs` — modeled on `scripts/build-wiki.mjs`. Source: `content/writing/<slug>.md` (YAML frontmatter: title, date, summary, tags, canonical, optional `agent_retrievable: true`).
- [ ] Generates `/writing/<slug>/index.html` via `scripts/lib/chrome.mjs` (DRY contract enforced).
- [ ] Generates `/writing/index.html` — auto-listed reverse-chronological landing.
- [ ] Auto-merges entries into `sitemap.xml`, `llms.txt`, `llms-full.txt`, `site.json`.
- [ ] Optional: emits `wiki/extracts/writing-<slug>.md` so `/enter` agent can cite (when frontmatter `agent_retrievable: true`).
- [ ] Wire into `npm run build` after `build:wiki-extracts`.
- [ ] Locked decisions: `~/.claude/projects/D--AA-agamarora/memory/project_writing_framework.md`.

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
