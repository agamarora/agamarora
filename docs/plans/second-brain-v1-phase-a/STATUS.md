# second-brain v1 — Phase A synthesis STATUS

**Single source of truth for resuming work across sessions + machines. Git-tracked. Update after every milestone.**

Last updated: 2026-04-26 — **CHECKPOINT 16 — R7 + R8 COMPLETE.**

## CURRENT STATE (R7 + R8 DONE; R9 next)

- **R7 tension surface DONE.** `synthesis/tensions.md` (40KB, 5438 words). 8 sections: TL;DR, cross-theme genuine contradictions, productive paradoxes, context-not-contradiction, intra-theme tensions, evolution arcs, industry-consensus tensions, cross-link map for R9 (table for all 12 themes + root), 7 Open Qs for Agam taste-pass.
- **R8 voice spec lock DONE.** `synthesis/voice-spec.md` (35KB, 5605 words). 4 registers fully documented with all 7 fields each; 13 banned LLM-isms; 12 real signatures; 30 verbatim samples 2014-10-09 → 2026-04-21; mechanical self-checks; wiki-home voice-doc snippet (§9); 7 Open Qs for taste-pass.
- **Both ran in parallel as foreground sonnet subagents.** R7 hit rate-limit notice at end but file landed complete (verified — ends "*R7 draft — not final. Inputs to R9 consolidation.*").
- **Next: R9 final consolidation synthesizer.** Inputs ready: 12 R6 drafts + R7 tensions + R8 voice spec + R5 theme-refinement + master-belief-list. Output: `agam-profile-v1.md` + `ontology-v1-draft.md` + final-polished `wiki-page-drafts/` (apply R7 cross-links + R8 register calibration).

## PRIOR STATE (R6 COMPLETE, audited, fixed)

- **R1-R5 DONE.** Phase A synthesis layers all complete: era chunks, cross-era, R3a-e parallel rounds, 35 R4 belief deep-dives, R5 theme refinement (12 themes + 1 root page).
- **R6 DONE 12/12 wiki page drafts.** 4 batches (3+3+3+3) all landed:
  - Batch 6a: agent-first, pm-taste, root.substance-over-hype
  - Batch 6b: enterprise-ai-reality, ai-pm-skillset, second-brain
  - Batch 6c: spec-first-taste, career-reflection, linkedin-as-instrument
  - Batch 6d: voice-ai-craft, breadth-as-differentiation, personal-projects-tinkering
- **2 qualitative audits executed by independent subagents:**
  - `synthesis/r6-qualitative-audit.md` (22KB) — first 9 drafts: 7 SHIP, 2 REVISE, 0 REWRITE. 28/30 verbatim quotes verified exact. Zero fabrications.
  - `synthesis/r6-qualitative-audit-batch-6d.md` (20KB) — final 3 drafts: 2 SHIP, 1 REVISE, 0 REWRITE.
- **All audit fixes applied (CHECKPOINT 15):**
  - HIGH H1 ai-pm-skillset: 137-day silence sentence rewritten (correct dates)
  - HIGH H2 enterprise-ai-reality: "one week before AIonOS" → "about four weeks"
  - MEDIUM M1 linkedin-as-instrument: "RLHF farming" attribution replaced with paraphrase
  - MEDIUM M3 enterprise-ai-reality: moats peer-credit acknowledgment (already in body)
  - MEDIUM M4 spec-first-taste: arc claim hedged
  - MEDIUM M5 career-reflection: "the only post in eleven years" → "the clearest instance"
  - HIGH (batch 6d) voice-ai-craft: 2024-03-29 "experimenting" → "observing" (was inversion)
  - MEDIUM (6d) breadth-as-differentiation: Mo Gawdat attribution hedged
  - MEDIUM (6d) personal-projects-tinkering: Pi-day Gauss-Legendre date corrected
- **R6 prompt template revised** with 5 audit-derived rules (A-E: silence framing prohibition, date arithmetic, declarative connective prose, no pre-answering Open Qs, no unsupported superlatives).

## NEXT SESSION — PICK UP HERE

**Read in this order to fully resume:**
1. `docs/plans/second-brain-v1.md` — canonical spec (revised 2026-04-24)
2. `docs/plans/second-brain-v1-phase-a/README.md` — directory guide
3. **THIS FILE** — full state
4. `docs/plans/second-brain-v1-phase-a/interim-taste-calls.md` — 5 binding decisions
5. `docs/plans/second-brain-v1-phase-a/synthesis/theme-refinement.md` — R5 final theme list (12 + 1 root)
6. `docs/plans/second-brain-v1-phase-a/synthesis/r6-qualitative-audit.md` — first audit
7. `docs/plans/second-brain-v1-phase-a/synthesis/r6-qualitative-audit-batch-6d.md` — second audit

**Remaining Phase A rounds (R7, R8, R9):**

| Round | Description | Inputs ready? |
|---|---|---|
| R7 | Tension surface (cross-theme + intra-theme contradictions) | YES — 12 R6 drafts + master-belief-list tension pairs + R3d clusters all available |
| R8 | Voice spec lock (canonical voice doc — bans, signatures, registers) | YES — style-fingerprint.md + voice-samples.md + R3c register findings + Decision 4 binding |
| R9 | Final consolidation → agam-profile-v1.md + ontology-v1-draft.md (final) + wiki-page-drafts/ (final polished) | Blocks on R7+R8 |
| Task #2b | **AGAM** taste-pass (60-90min, irreplaceable human step) | Blocks on R9 |
| Task #8 | Lock ontology v1 (CC, ~30min) | Blocks on Task #2b |

**Recommended next-session action: spawn R7 + R8 in parallel (independent), then R9 synthesizer once both return. Use refined CoT+ReAct + audit-derived rules template at `prompts/r6-batch-template.md` (reusable for R7/R8).**

## R7 + R8 prompt seeds (ready to fire)

**R7 — Tension surface synthesizer:**
- Read all 12 R6 drafts + master-belief-list "Tension pairs" table + theme-refinement.md Section 4 deltas
- Output `synthesis/tensions.md`: cross-theme contradictions, productive paradoxes (D R3d HOLD = strong-opinion-about-no-strong-opinions), evolution arcs (kill-prompting → prompts-as-primitive), context-not-contradiction (agent-first ↔ reversibility)
- Goal: feed Tension sections in R9 final wiki polish

**R8 — Voice spec lock:**
- Read style-fingerprint.md + voice-samples.md + comments-network.md (4 voice registers found) + collab-articles-deep-dive.md (Top Voice register #4) + Decision 4 (em-dash NOT signature)
- Output `synthesis/voice-spec.md`: 4 registers documented with signatures, banned LLM-isms, sentence-length distribution, punctuation rhythm (colon + hyphen-with-spaces = real signatures), specific positive samples per register
- Goal: agent voice calibration + wiki home-page voice doc

**R9 — Final consolidation synthesizer:**
- Read R7 tensions + R8 voice spec + 12 R6 drafts + R5 theme-refinement + master-belief-list
- Output: `agam-profile-v1.md` + `ontology-v1-draft.md` + final-polished wiki-page-drafts (apply tension cross-links + voice-spec calibration)

## Spawn protocol (revised CHECKPOINT 11)

- Foreground default. 1-3 Agent calls per message max.
- Background only on explicit Ctrl+B.
- Always pass `model: "sonnet"` (project hard rule, never opus).
- After each batch: mechanical verify (length, em-dash-in-prose, sections, banned LLM-isms) → qualitative audit (independent subagent on 3-9 drafts) → fix HIGH/MEDIUM issues inline → commit checkpoint → push to main.
- Commit + push after every milestone. Push permission: granted. **R5 launching now** entry below is from CP13. CHECKPOINT 12 below. **R4 Tier-1: 24/24 DONE. Tier-2: 7/10 done. Tier-3: 1/1 DONE.** Batch 5a + 5b returns: data-readiness-is-pipeline-not-corpus (20.5KB CONFIRM, sub-section under moats-are-infra-talent-data), non-functional-reqs-are-55pct-of-failure (30KB CONFIRM seed, theme.pm-taste primary; 55% number is single-surface — Open Q for taste-pass), design-thinking-as-speed-tool (31KB CONFIRM, status seed→core-B, sub-section pm-taste with cross-edge ai-pm-skillset), muscle-memory-over-novelty (21.5KB CONFIRM DISTINCT from learn-concepts-not-tools, status seed→peripheral, sub-section under learn-concepts-not-tools wiki page with refines-practice-of edge), **silence-precedes-crystallization (14.9KB REFINE→DEMOTE per Decision 5; drop from belief list, re-home as wiki narrative footnote — base rate 7/9 silences had no crystallization)**, certifications-are-collectibles (48KB CONFIRM R3d Cluster 13 peer-voted/exam-gated split, refinement: anti-cert ≠ anti-recognition, anti-institutional-gatekeeping). **Template refined CHECKPOINT 11 with explicit CoT + ReAct loop + worked example + 5-question self-critique gate — applied successfully to 5b.** Remaining Tier-2 (3): outcome-billing-over-hourly, two-roles-ahead-framing, tinker-publicly. Then Tier-4 triage + R5.

**Repo path (canonical):** `docs/plans/second-brain-v1-phase-a/STATUS.md` (this file, git-tracked)
**Workspace cache path (legacy, in-flight subagents only):** `~/.gstack/projects/agamarora-agamarora/corpus/synthesis/STATUS.md`
When two paths diverge, repo path wins.

---

## TL;DR for fresh session (any machine)

Read these in order to fully resume:
1. `docs/plans/second-brain-v1.md` — canonical spec (revised 2026-04-24, eras dropped, multi-pass synthesis)
2. `docs/plans/second-brain-v1-phase-a/README.md` — Phase A directory guide + machine-bootstrap instructions
3. **THIS FILE** — current Phase A round-by-round state
4. `docs/plans/second-brain-v1-phase-a/interim-taste-calls.md` — binding inline decisions Agam made

Optional CC-local context (regenerable from spec if absent):
- `~/.claude/plans/rosy-plotting-flame.md` — system architecture
- `~/.claude/projects/C--aa-agamarora/memory/project_second_brain_v1.md` — project memory

## Bootstrap on new machine

See `README.md` in this directory for clone + corpus-pull steps.

## Privacy posture (Agam call 2026-04-24)

- Corpus content: PUBLIC (LinkedIn posts are public by default)
- Extraction tooling / source-of-export: PRIVATE — never documented in this public repo
- Synthesis outputs: PUBLIC (derived analysis, not raw export)
- Implication for downstream rounds: subagents can quote verbatim post snippets in synthesis outputs without legal/ToS concern; no need to anonymize people Agam already publicly tagged.

---

## Phase A multi-pass synthesis — round status

**Plan:** 9 CC rounds → Agam taste-pass (Task #2b) → ontology lock (Task #8). Unlimited token budget.

| Round | Description | Status | Output(s) | Notes |
|---|---|---|---|---|
| R1 | 4 era chunk subagents (E1/E2/E3/E4) | DONE | `era-1-output.md` (17.4KB), `era-2-output.md` (28.1KB), `era-3-output.md` (30.3KB), `era-4-output.md` (30.6KB) | 277 of 279 posts processed |
| R2 | Cross-era synthesis | DONE | `corpus-synthesis-v0.md` (35.9KB), `ontology-v0.md` (24.2KB), `voice-samples.md` (20.7KB) | 13+5 themes, ~40 beliefs, 14 projects, 6 companies, 19 people, 77 edges proposed |
| R3a | Project + tech lineage | DONE | `synthesis/projects-tech-lineage.md` (55.9KB) | **52 projects** (3.7x ontology-v0's 14), 58 tech, 41 lineage edges, 36 belief-evidence edges. **MCP is also ghost theme** (zero corpus posts). Annual compounding chain 2016→2026 = wiki narrative. **Date error to fix at ontology lock:** /enter v3 mis-dated 2023-05-10 in ontology-v0; real date April 2026. |
| R3b | Comments + network analysis | DONE | `synthesis/comments-network.md` (36.8KB) | 253 comments, 35 net-new people, **3rd voice register found (mentor-mode)**, 20% of comments = LinkedIn AI-pablum (excluded from voice samples), most-vulnerable disclosure (60% pay-cut Aug 2025) is in comments not posts |
| R3c | Style fingerprint | DONE | `synthesis/style-fingerprint.md` (29.2KB) | Word range 32-280, ideal 80-180 (E4 median 116.5). **Em-dash NOT signature** (only 3 in 287 posts) — colon + hyphen-with-spaces are real rhythm. Hashtags hard-zero in E4. ChatGPT Nov/Dec 2022 = sharpest style break (median 28→185 words). Voice-AI under-share quantitatively confirmed. **Open Q for Agam:** Dec 2024-Jun 2025 = 164-day silence — intentional or life event? |
| R3d | Cross-post reference graph | DONE | `synthesis/cross-post-references.md` (53.2KB) | All 18 clusters mapped (pt1 1-7 + pt2 8-18 concat'd). **Top finding:** anti-hype/substance is the most stable cross-era stance (8-year through-line — blockchain 2018 → Devin → GenAI → customization 2026). **Candidate root disposition** for wiki. Self-callback is deliberate — Agam writes aware of own corpus, makes belief-supersession edges easier. **New proposed belief:** `silence-precedes-crystallization` (2 silences each preceded thesis-lock posts, 2 data points = open Q). |
| R3e | Collaborative Articles deep dive | DONE | `synthesis/collab-articles-deep-dive.md` (83.4KB) | All sections done (pt1 TL;DR+inventory + pt2 sections 2-6 concat'd). 48 technical-signal entries. All 12 existing ontology-v0 beliefs gain new evidence. All 6 new beliefs proposed bodied (`belief.value-viability-usability-triad`, `belief.non-functional-reqs-are-55pct-of-failure`, `belief.data-readiness-is-pipeline-not-corpus`, `belief.design-thinking-as-speed-tool`, `belief.outcome-billing-over-hourly`, `belief.two-roles-ahead-framing`). 2 Top Voice achievements anchored. **Register #4 refined:** 40-210 words (median ~110), `1/ ` slash-format ~60% — genuine signature. Distinctness from registers #1-3: only register w/ numbered lists as dominant structural move. |
| R4 | Per-belief deep dive (1 subagent per proposed belief, ~40 parallel) | **DONE** (24/24 Tier-1 + 10/10 Tier-2 + 1/1 Tier-3 = 35 dives. Tier-4 15 peripheral SKIPPED — R5 folds from master-list directly. Verdict tally: 27 CONFIRM, 4 REFINE-or-downgrade, 3 MERGE, 2 DEMOTE.) | `belief-deep-dives/<slug>.md` | Master list at `synthesis/master-belief-list.md`. Batch template at `prompts/r4-batch-template.md`. **Batch 1 (8):** substance-over-hype (ROOT, 27.8KB), agent-first (29KB), spec-over-sprint (25.2KB), taste-over-execution (25KB), context-over-prompt (24.4KB), self-instrumentation (25KB), pm-is-99-should-we-1-can-we (24.9KB), never-be-smartest-in-room (24.9KB). **Batch 2 (3+3 recovered = 6):** ai-pm-skillset-table-stakes (28KB), enterprise-ai-production-reality (38KB), second-brain-is-context-layer (30KB), anti-customization (25.7KB — nest under theme.pm-taste, not own page), learn-concepts-not-tools (25.9KB — STP merge CONFIRMED, muscle-memory DISTINCT), ship-the-prototype (30.9KB — tinker-publicly RECOMMEND MERGE >90% overlap). **NEW Open Qs / R4 resolutions (preliminary, await Agam taste-pass):** (1) one root or two roots (substance + never-smartest)? (2) STP merge into learn-concepts-not-tools confirmed; (3) muscle-memory-over-novelty distinct from learn-concepts-not-tools with `refines-practice-of` edge; (4) tinker-publicly merge into ship-the-prototype recommended. **Batch 3a (3):** breadth-needs-depth (27.7KB — own page under theme.breadth-as-differentiation), prompts-as-engineering-primitive (25.9KB — sub-section under theme.agent-first-craft, kill-prompting layer-migration edge), moats-are-infra-talent-data (29.6KB — own page under theme.enterprise-ai-reality). **Batch 3b (3):** pm-is-featherless-hat (28.5KB), help-market-flourish (23.5KB), data-literacy-is-pm-core (25.8KB). **Batch 3c (3):** ic-path-legitimacy (26.9KB), linkedin-as-instrumental-platform (37KB), llm-as-voice-extension (31KB). **Batch 4a (3 in flight, async-lost on session pause):** build-measure-learn, value-viability-usability-triad (seed), application-layer-is-where-safety-lives (seed). Substitutions in `prompts/batch-4a-pending.md`. **Remaining Tier-1 (1, in flight):** build-measure-learn. **Remaining Tier-2 (9):** application-layer-is-where-safety-lives, data-readiness-is-pipeline-not-corpus, design-thinking-as-speed-tool, muscle-memory-over-novelty, non-functional-reqs-are-55pct-of-failure, outcome-billing-over-hourly, silence-precedes-crystallization, tinker-publicly (master-list says MERGE recommended already — may skip dedicated R4), two-roles-ahead-framing, value-viability-usability-triad. **Remaining Tier-3 (1):** certifications-are-collectibles. **Tier-4 (15):** triage decision pending — voice/meat value vs skip. | |
| R5 | Theme refinement (recluster from refined beliefs) | **DONE** (CHECKPOINT 14) | `synthesis/theme-refinement.md` (53KB) | 12 final themes + 1 root page. pm-taste SPLIT; spec-first-taste NEW; personal-projects-tinkering FORMALIZED; humor-wit DROPPED; early-career+thinking-in-writing MERGED; linkedin-as-instrument FORMALIZED; substance-over-hype ELEVATED to root. 5 beliefs DROPPED from graph. 10 Open Qs for Agam taste-pass. Full R6 hand-off instructions in Section 9. |
| R6 | Per-theme wiki page draft (1 subagent per final theme) | **DONE 12/12** (CHECKPOINT 15, audited+fixed) | `wiki-page-drafts/*.md` (12 files) + `r6-qualitative-audit.md` + `r6-qualitative-audit-batch-6d.md` | Both audit files written. 28/30 quotes verified exact. 0 fabrications. All 9 audit issues fixed inline. |
| R7 | Tension surface | **DONE** (CHECKPOINT 16) | `tensions.md` (40KB, 5438w) | 8 sections incl. cross-link map for R9 + 7 Open Qs |
| R8 | Voice spec lock | **DONE** (CHECKPOINT 16) | `voice-spec.md` (35KB, 5605w) | 4 registers, 13 banned LLM-isms, 12 signatures, 30 verbatim samples, 7 Open Qs |
| R9 | Final consolidation | NOT STARTED — READY TO LAUNCH | `agam-profile-v1.md` + `ontology-v1-draft.md` (final) + `wiki-page-drafts/` (final) | All inputs ready (R6 drafts + R7 tensions + R8 voice spec + R5 theme-refinement + master-belief-list) |
| Task #2b | **AGAM** taste-pass | NOT STARTED | `corpus/agam-taste-pass.md` | Blocks on R9 |
| Task #8 | Lock ontology v1 (CC, ~30min) | NOT STARTED | `~/.gstack/.../ontology-v1.md` | Blocks on Task #2b |

---

## Inline taste-pass calls (binding for downstream rounds)

See `interim-taste-calls.md` for full details. Summary:

1. **Drop interior-design 2017 pivot** — few-month phase, not a project node
2. **Voice-AI under-share is INTENTIONAL** — not a "ghost theme." Agent does NOT lead with voice-AI. Voice = one example among many.
3. **Collaborative Articles are PRIMARY technical surface, NOT pablum** — Top Voice top 1-2% in AI + PM. Must be included as 4th register + propose Achievement nodes. R3e re-processes them.
4. **Em-dash is NOT Agam's fingerprint** — only 3 in 287 posts. Agent should use colons + hyphen-with-spaces. Banned LLM-isms confirmed.
5. **Posting silences are normal, not professional gaps** — agent does not dramatize gaps. Post cadence ≠ professional cadence.

---

## How to resume in a fresh session — STEP BY STEP

### Step 1: Read context (5 minutes)

Open in this order:
1. `docs/plans/second-brain-v1.md` — canonical spec (revised 2026-04-24, eras dropped, multi-pass synthesis)
2. `docs/plans/second-brain-v1-phase-a/README.md` — directory guide + bootstrap
3. **THIS FILE** — round-by-round state
4. `docs/plans/second-brain-v1-phase-a/interim-taste-calls.md` — 5 binding inline decisions Agam made

### Step 2: Check for completed-while-context-cleared subagent outputs

The previous session left R3d + R3e running async. Check:

```bash
ls ~/.gstack/projects/agamarora-agamarora/corpus/synthesis/cross-post-references.md 2>/dev/null
ls ~/.gstack/projects/agamarora-agamarora/corpus/synthesis/collab-articles-deep-dive.md 2>/dev/null
```

For each file that exists:
1. Read it
2. Copy to `docs/plans/second-brain-v1-phase-a/synthesis/<filename>.md`
3. Update the matching STATUS row (RUNNING ASYNC → DONE, add file size + key findings)
4. Update "Last updated" timestamp at top

If a file does NOT exist after a reasonable wait, the async subagent may have died with the previous session. Re-spawn it using the prompt template in spec §9 / round-by-round descriptions. Use the per-round prompt patterns documented in this file.

### Step 3: Decide next round to launch

Refer to the round table above. The first row marked NOT STARTED is your next target.

After R3 fully done (3a/b/c synced + 3d/e synced or re-spawned):
- **Launch R4** (per-belief deep dive) — see "If status says R4 NOT STARTED" below

### Step 4: R4 launch instructions (per-belief deep dive)

When R3 fully complete:
1. Read `synthesis/ontology-v0.md` — extract list of proposed beliefs (~40 from R2, plus any new ones from R3a/R3e)
2. Compile a master belief list (deduplicate across rounds)
3. Spawn 1 subagent per belief, in batches of 10-15 parallel max
4. Each belief subagent prompt: "Re-read `corpus/linkedin-corpus.md` + `corpus/linkedin-comments.md` filtered for evidence + counter-evidence of `belief.X`. Output: `synthesis/belief-deep-dives/<belief-slug>.md`. Apply interim-taste-calls.md decisions."
5. After each batch returns: sync outputs to repo, update STATUS

### Step 5: R5+ rounds

R5 (theme refinement), R6 (per-theme wiki page draft), R7 (tension surface), R8 (voice spec lock), R9 (final consolidation). Each described in spec §9.

After R9: hand to Agam for Task #2b taste-pass. Lock ontology v1 (Task #8) when taste-pass returns.

---

## What "good resumption" looks like

Fresh session opens this file, knows within 2 minutes:
- Where we are: 5 of 5+ R3 outputs likely available, R4 not started
- What's next: sync any new R3 outputs, then launch R4
- What blockers exist: none for CC; eventual blocker is Agam taste-pass after R9
- What context to maintain: 5 binding inline taste calls, never relitigated

---

## Workspace layout (REVISED 2026-04-24 — repo is now canonical)

### Public repo (git-tracked, syncs everywhere via GitHub)
```
C:/aa/agamarora/  (or your local clone of agamarora/agamarora)
└── docs/plans/
    ├── second-brain-v1.md                          (canonical spec)
    ├── second-brain-v1-ceo-review.md
    └── second-brain-v1-phase-a/                    (Phase A artifacts, all git-tracked)
        ├── README.md                               (directory guide + bootstrap)
        ├── STATUS.md                               ← THIS FILE
        ├── interim-taste-calls.md                  (binding inline decisions)
        └── synthesis/
            ├── era-1-output.md                     (R1)
            ├── era-2-output.md                     (R1)
            ├── era-3-output.md                     (R1)
            ├── era-4-output.md                     (R1)
            ├── corpus-synthesis-v0.md              (R2)
            ├── ontology-v0.md                      (R2)
            ├── voice-samples.md                    (R2)
            ├── projects-tech-lineage.md            (R3a — pending, in-flight subagent writes to ~/.gstack/, sync to repo when done)
            ├── comments-network.md                 (R3b — same)
            ├── style-fingerprint.md                (R3c — same)
            ├── cross-post-references.md            (R3d — same)
            ├── belief-deep-dives/                  (R4)
            ├── theme-refinement.md                 (R5)
            ├── wiki-page-drafts/                   (R6, ~10-15 files)
            ├── tensions.md                         (R7)
            ├── voice-spec.md                       (R8)
            ├── agam-profile-v1.md                  (R9, canonical)
            └── ontology-v1-draft.md                (R9, canonical)
```

### Private corpus (separate private repo `agamarora/agam-linkedin`, NEVER in public repo)
```
~/.gstack/projects/agamarora-agamarora/
├── corpus/
│   ├── linkedin-corpus.md         (180KB, 279 posts — INPUT, never edit, never commit to public repo)
│   ├── linkedin-posts-full.json   (242KB)
│   ├── linkedin-comments.md       (209KB, 253 comments)
│   ├── linkedin-comments-full.json (296KB)
│   ├── agam-taste-pass.md         (scaffold for Task #2b)
│   └── synthesis/                 (LEGACY working cache for in-flight R3 subagents only — repo is canonical going forward)
```

---

## Update protocol (CC-internal — keep doing this)

After every round (or every meaningful subagent return), update this file:
- Move that row's status (NOT STARTED → RUNNING → DONE)
- Add output filename + size
- Add 1-line key finding
- Update "Last updated" timestamp at top
- Add new inline taste-pass calls if Agam made any during the work
- COMMIT to git (single-line commit msg OK: `docs(plans): R<N> complete + STATUS update`)
- PUSH after each round so cross-machine continuity survives session/laptop crash

Goal: a fresh session reading this file should know exactly where we are within 60 seconds.

## Resume prompt (paste into fresh session if needed)

```
I'm resuming second-brain v1 Phase A work in this repo. Read these in order:
1. docs/plans/second-brain-v1.md (canonical spec)
2. docs/plans/second-brain-v1-phase-a/README.md (directory guide)
3. docs/plans/second-brain-v1-phase-a/STATUS.md (round-by-round state)
4. docs/plans/second-brain-v1-phase-a/interim-taste-calls.md (5 binding inline decisions)
5. docs/plans/second-brain-v1-phase-a/prompts/r4-batch-template.md (R4 universal prompt template + batch substitutions)
6. docs/plans/second-brain-v1-phase-a/prompts/batch-4a-pending.md (3 in-flight subagents may have died — check disk + re-spawn if missing)

Current state: R3 fully done. R4 = 23/24 Tier-1 belief deep dives complete + 3 batch-4a in flight (may have landed). Next steps:

STEP A: Check disk for batch-4a outputs (build-measure-learn, value-viability-usability-triad, application-layer-is-where-safety-lives). If missing, re-spawn from prompts/batch-4a-pending.md. CRITICAL: spawn FOREGROUND not background — use 2 Agent calls per message max (3 has gone background-async repeatedly — protocol revision).

STEP B: Tier-2 seed verification (7 remaining beliefs after batch-4a returns 2 of 9): data-readiness-is-pipeline-not-corpus, design-thinking-as-speed-tool, muscle-memory-over-novelty, non-functional-reqs-are-55pct-of-failure, outcome-billing-over-hourly, silence-precedes-crystallization, two-roles-ahead-framing. Plus tinker-publicly may skip (already MERGE recommended in ship-the-prototype deep dive).

STEP C: Tier-3 reconciliation (1 remaining): certifications-are-collectibles. (kill-prompting tension already resolved in prompts-as-engineering-primitive deep dive.)

STEP D: Tier-4 triage — quick read of master-list Tier-4 (15 peripheral). Decide which to spawn for voice/meat value.

STEP E: R5 theme refinement (parallelized — 1 subagent per ~3 themes, ~3-4 batches).

STEP F: R6 wiki page drafts (10-15 pages), R7 tensions, R8 voice spec, R9 final consolidation.

STEP G: Hand to Agam for Task #2b taste-pass.

Auto mode active. Caveman mode active. Multi-pass to convergence; unlimited token budget per Agam.
```

## Spawning protocol (lessons learned)

When invoking R4 (or any) subagents:
- **Spawn FOREGROUND.** 1-3 Agent calls per message maximum. Mixing more than ~3-4 in a single message can flip them to background-async, where they die with parent session if they don't finish in time.
- **Watch the tool result.** "Async agent launched successfully" message = background. If you see this, immediately save the verbatim prompt to `prompts/` so re-spawn is mechanical if the session ends.
- **Anthropic rate limits exist.** Subagents share parent session's quota. Plan for ~10-12 subagents per quota window before rate-limit hits. Resets every ~5 hours per session signal.

**Batch sizing recommendation for R4:**
- 3-4 subagents per Agent-message (foreground guarantee)
- Wait for return + sync to disk
- Commit checkpoint after each batch
- Then next batch
- Expect ~10-12 successful subagents per rate-limit window
