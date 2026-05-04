# TODO — agamarora.com

**Single source of truth for open work.** Closed items pruned. Session logs (BASELINE-*.md, etc.) capture history; this file captures backlog.

Last updated: 2026-05-04 (Bulldozer rewrite in progress on dev — wiki = single publication, /writing/ retired, all 35 article pages getting Proof-of-Work rewrite).

---

## Active

### Ruthless copy pass — full website
**Why:** C5 niche cascade (2026-05-04) flipped headline + meta to "B2B AI Product Manager. Technical PM building AI agents." across `/`, `/resume`, sitemap, llms.txt, llms-full.txt, site.json, resume.md, moodboard. Cascade was a positioning swap — not a quality pass. Body copy across surfaces still has generic PM phrasing, fluff, weak action verbs. This task is the ruthless edit pass.

**Scope:** every public page — `/`, `/resume`, `/lab/`, `/lab/<slug>/`, `/wiki/`, `/wiki/<theme>/`, `/wiki/beliefs/<slug>/`, `/moodboard` (orphan, lower priority). Skip: `/enter` (live agent UI, locked), `README.md` (locked 2026-05-03), `og-master.jpg` (manual export task #2).

**Editorial brief (paste verbatim into editor agent):**

> **Role & Context:** Act as a ruthless Director of Product at a top-tier B2B enterprise tech company (Stripe, AWS, Databricks). You are reviewing the personal website copy of a highly technical Product Manager who specializes in AI products, B2B SaaS, and complex engineering systems.
>
> **Task:** Proofread, edit, and elevate the provided website copy. Do not just fix grammar; ruthlessly optimize tone, structure, and technical density.
>
> **Strict Editorial Guidelines:**
>
> 1. **Zero Fluff & Buzzwords:** Eradicate generic PM phrases ("cross-functional collaboration," "driving synergy," "passionate about users"). Replace with concrete, action-oriented technical language ("shipped," "architected," "reduced latency," "scaled").
> 2. **Tone & Persona:** Authoritative, battle-tested, highly opinionated. Sounds like an internal strategy memo from a Senior/Principal PM — not generic marketing.
> 3. **The "So What?" Test:** Every paragraph connects a technical action to a distinct business outcome (ARR, engineering velocity, scale). If a sentence doesn't add immediate value, delete.
> 4. **Formatting for Scannability:** Dense paragraphs → scannable bullets. Clear hierarchy via H2/H3. Core argument understandable in a 3-second scroll.
> 5. **Answer Engine Optimization (AEO):** Technical concepts + definitions stated clearly and directly in the first sentence of each paragraph so LLMs / AI search summaries ingest them cleanly.
>
> **Output:** Revised copy, plus a brief bulleted list of the specific changes that elevated authority + technical density.

**Execution plan (per-surface):**
- [ ] `/` (`index.html`) — hero tagline + greeting line, CTAs (only if weak)
- [ ] `/resume` (`resume/index.html`) — role bullets, summary subtitle
- [ ] `resume.md` — Summary section + role bullets (ground truth, used by /enter — re-eval scenarios after if bullets shift materially)
- [ ] `/lab/` (`lab/index.html`) — card descs
- [ ] `/lab/second-brain/`, `/lab/ai-resume/`, `/lab/voice-ai-production/`, `/lab/product-shape/` — PRFAQ body
- [ ] `/wiki/themes/`, `/wiki/<12 themes>/`, `/wiki/beliefs/<19 beliefs>/` — theme + belief intros (auto-generated from synthesis MD; edit source `docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final/` then `npm run build:wiki`)
- [ ] `/moodboard/` (orphan, lowest pri) — optional

**Boundaries:**
- Do NOT touch `/enter` UI / `groqHandler.mjs` system prompt / `README.md` / `og-master.jpg` (separate locked artefacts).
- Stay on dev branch. UI sacrosanct rule: any rendered-surface change → before/after visual diff in headed gstack browser before merging to main.
- If `resume.md` bullets change materially, re-run /enter eval scenarios per Phase D workflow.

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
- ~~`/writing/` framework~~ — built then RETIRED same week. Bulldozer review (2026-05-04) locked single-publication architecture: `/wiki/` is the canonical surface, `/writing/` is gone. `scripts/build-writing.mjs`, `writing/`, `content/writing/`, marker blocks, build chain entry, sitemap rows all removed. 301 `/writing/* → /wiki/graph/` in netlify.toml. Seed post migrating to `/wiki/spec-first-taste/` in Phase 2.

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
