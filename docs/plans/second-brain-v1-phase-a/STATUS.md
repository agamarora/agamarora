# second-brain v1 — Phase A synthesis STATUS

**Single source of truth for resuming work across sessions + machines. Git-tracked. Update after every milestone.**

Last updated: 2026-04-24 22:20 — after R3a + R3b complete, R3c + R3d still running (session d30e3cf1)

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
| R3d | Cross-post reference graph | NOT YET LAUNCHED | `cross-post-references.md` (target) | Launch when 3a-3c return OR launch in parallel with them |
| R4 | Per-belief deep dive (1 subagent per proposed belief, ~40 parallel) | NOT STARTED | `belief-deep-dives/<belief-slug>.md` × ~40 | Blocks on R3 outputs |
| R5 | Theme refinement (recluster from refined beliefs) | NOT STARTED | `theme-refinement.md` | Blocks on R4 |
| R6 | Per-theme wiki page draft (1 subagent per final theme, ~10-15 parallel) | NOT STARTED | `wiki-page-drafts/<theme-slug>.md` × ~10-15 | Blocks on R5 |
| R7 | Tension surface | NOT STARTED | `tensions.md` | Blocks on R6 |
| R8 | Voice spec lock | NOT STARTED | `voice-spec.md` | Blocks on R6 (parallel with R7) |
| R9 | Final consolidation | NOT STARTED | `agam-profile-v1.md` + `ontology-v1-draft.md` (final) + `wiki-page-drafts/` (final) | Blocks on R7+R8 |
| Task #2b | **AGAM** taste-pass | NOT STARTED | `corpus/agam-taste-pass.md` | Blocks on R9 |
| Task #8 | Lock ontology v1 (CC, ~30min) | NOT STARTED | `~/.gstack/.../ontology-v1.md` | Blocks on Task #2b |

---

## Inline taste-pass calls (binding for downstream rounds)

See `interim-taste-calls.md` for full details. Summary:

1. **Drop interior-design 2017 pivot** — few-month phase, not a project node
2. **Voice-AI under-share is INTENTIONAL** — not a "ghost theme." Agent does NOT lead with voice-AI. Voice = one example among many.

---

## How to resume in a fresh session

### If status says R3 RUNNING:

1. Read this STATUS file
2. Check whether R3a/R3b/R3c outputs exist in `corpus/synthesis/` (filenames: `projects-tech-lineage.md`, `comments-network.md`, `style-fingerprint.md`)
3. If yes → mark R3a-c DONE in this STATUS file, launch R3d (or R4 if 3d also done)
4. If no → check background subagent IDs above with TaskOutput, OR re-spawn matching subagent prompts. Subagent prompts are NOT saved verbatim — they live in conversation history. If lost, re-derive from this STATUS + spec + interim-taste-calls.md

### If status says R4 NOT STARTED but R3 DONE:

1. Read all R3 outputs + all R2 outputs to refresh context
2. From `ontology-v0.md` extract list of proposed beliefs (~40)
3. Spawn one subagent per belief in batches (10-15 at a time to stay parallel-friendly)
4. Each belief subagent: re-read corpus FILTERED for evidence + counter-evidence of belief.X. Output: `belief-deep-dives/<slug>.md`
5. Update STATUS file when batch completes

### If status says R5+:

Refer to round-by-round descriptions in spec §9 (revised 2026-04-24) + this STATUS. Each round's prompt template should follow the recursive-classification model (Layers 1-5: surface → belief → network → theme → project) described in conversation 2026-04-24.

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

Goal: a fresh session reading this file should know exactly where we are within 60 seconds.
