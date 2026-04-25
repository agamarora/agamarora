# R9 — Final consolidation synthesizer prompt

**Purpose:** one synthesizer subagent that consumes R6 drafts + R7 tensions + R8 voice spec + R5 theme refinement + master belief list, and produces the THREE final Phase A outputs:

1. `synthesis/agam-profile-v1.md` — canonical 1-page profile (the agent's "who is Agam" prose)
2. `synthesis/ontology-v1-draft.md` — final ontology JSON-shaped markdown (themes, beliefs, projects, people, edges)
3. `synthesis/wiki-page-drafts-final/*.md` — 12 wiki page drafts re-polished with R7 cross-links + R8 voice calibration applied

After R9 returns, work hands to **Agam** for Task #2b taste-pass (60-90 min, irreplaceable). Then Task #8 ontology lock.

**Model:** sonnet (project hard rule).

**Spawn shape:** ONE foreground subagent. Big output, but R9 is purely consolidation — all reasoning was done in R3-R8. R9 reads + stitches + applies the cross-link table from R7 §7 and the register rules from R8 §1-§4.

---

## Universal R9 prompt block

```
You are the R9 final-consolidation synthesizer for Agam Arora's second-brain v1 Phase A. Your single task: consume the entire upstream synthesis chain and produce three final Phase A artifacts. After you return, work hands to Agam for the human taste-pass (Task #2b). This is the LAST automated step.

**Your three outputs (write all three):**

1. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\agam-profile-v1.md` — canonical 1-page profile
2. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\ontology-v1-draft.md` — final ontology
3. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\wiki-page-drafts-final\<theme-slug>.md` (12 files, one per theme + 1 root)

**Project context (read first):**
1. `C:\aa\agamarora\docs\plans\second-brain-v1.md` — canonical spec, especially §4 (Theme List), §5 (Wiki Page Spec), §6 (Ontology Spec)
2. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\STATUS.md` — round state
3. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\interim-taste-calls.md` — 5 binding taste-calls (apply all)

**Primary inputs (read all):**
4. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\tensions.md` — R7. Section 7 (cross-link map) is your wiki-cross-link spec. Sections 1-6 are tension content to integrate. Section 8 Open Qs flow through to per-page Open Qs.
5. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\voice-spec.md` — R8. Section 1 (4 registers) tells you which register each wiki page uses (cross-reference R5 theme assignments). Sections 2-4 are HARD voice rules to apply to YOUR OWN writing across all 3 outputs. Section 9 (wiki-home voice doc snippet) goes into agam-profile-v1.md or stands alone — use your judgment.
6. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\theme-refinement.md` — R5. The 12-theme + 1-root final taxonomy. Section 3 per-theme entries are spec-of-record.
7. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\master-belief-list.md` — final belief inventory with verdicts (CONFIRM/REFINE/MERGE/DEMOTE). The ontology beliefs[] array sources from this.
8. All 12 R6 wiki page drafts in `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\wiki-page-drafts\` — your STARTING POINT for the 12 final wiki pages. Apply R7 cross-links + R8 voice calibration; otherwise preserve.
9. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\projects-tech-lineage.md` — R3a. Source of truth for projects[] in ontology (52 projects, 58 tech, 41 lineage edges, 36 belief-evidence edges).
10. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\comments-network.md` — R3b. Source for people[] in ontology (35+ net-new people).
11. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\corpus-synthesis-v0.md` — R2. Cross-era context.
12. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\ontology-v0.md` — R2. Your STARTING POINT for ontology-v1-draft (refine, do not start from scratch). Note ontology-v0 had 14 projects and ~40 beliefs — v1 must reflect R3a's 52 projects + R4's refined belief inventory (verdicts in master-belief-list).
13. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\r6-qualitative-audit.md` + `r6-qualitative-audit-batch-6d.md` — confirm R6 drafts are SHIP-grade post-fixes; you do not need to re-audit, but if you spot residual issues during polish, fix them inline.

---

## REASONING PROTOCOL — explicit Chain-of-Thought + ReAct (MANDATORY before any writes)

Do NOT start writing outputs until all 8 passes complete.

### Pass 1 — Cross-link map internalization
Action: read R7 §7 verbatim. Build an internal table: theme → primary tension link → secondary tension link → category. You will use this table to re-write the "Tension with [other theme]" section in each of the 12 wiki pages.

### Pass 2 — Register-per-page assignment
Action: cross-reference R5 §3 (per-theme voice register from theme-refinement) with R8 §1 (4 register definitions). For each theme, confirm which register dominates. If R5 said "register 1 free-form" and the R6 draft drifted into LLM-default, you fix it in R9 polish.

### Pass 3 — Ontology refresh from upstream
Thought: "What does ontology-v0 say, and what has changed since R3+R4+R5?"
- Themes: 12 final + 1 root, per R5. Drop early-career + thinking-in-writing as standalone (folded into career-reflection + linkedin-as-instrument). DROPPED: humor-wit. ELEVATED: substance-over-hype to root.
- Beliefs: apply master-belief-list verdicts. Keep CONFIRM. Apply REFINE rewordings. Execute MERGE collapses (e.g., STP into learn-concepts-not-tools; tinker-publicly into ship-the-prototype). DROP DEMOTEd beliefs (5 from R5 + silence-precedes-crystallization).
- Projects: 52 from R3a. Note `/enter v3` real date is April 2026 (ontology-v0 had 2023-05-10 — fix).
- People: 35 net-new from R3b plus original ontology-v0 set.
- Edges: keep ontology-v0 edges that survive; add R3a's 41 lineage + 36 belief-evidence; add R7 tension-with edges (one per theme pair from §7 cross-link map).

### Pass 4 — Profile distillation
Thought: "Agam-profile-v1.md is the single most-read artifact. The agent loads it as system-prompt context. The wiki home page renders it. What 600-1200 word prose captures who Agam is, in his own register-1 voice, given everything we now know?"
Action: outline a profile with these sections (you may reshape if you have a better case): (a) opener / 1-paragraph identity, (b) how he thinks (substance-over-hype as root + 3-4 strongest beliefs as scaffolding), (c) what he builds (1 paragraph spanning second-brain + voice-AI satellite + spec-first-taste), (d) how he writes (R8 voice principles condensed), (e) what he is wrong about / open questions (humility marker).

### Pass 5 — Wiki page polish loop
For each of the 12 R6 drafts: read the existing draft, identify gaps vs (a) R7 cross-link assignment for this theme, (b) R8 register fit, (c) R5 length-target compliance, (d) any R6-audit residuals. Plan the rewrite per page before executing. Aim to PRESERVE 80%+ of each R6 draft and CHANGE only what R7/R8 dictate.

### Pass 6 — Voice self-check on YOUR own output
Thought: "Am I writing in agent-default LLM voice in the profile + ontology + wiki polishes, or am I matching Agam's register?" Action: check your draft prose against R8 §2 (banned LLM-isms) and §3 (real signatures). Fix em-dashes (banned). Replace "It's not just X, it's Y" constructions. Strip gratuitous adverbs. Direct declarative.

### Pass 7 — Open Qs consolidation
Action: collect all Open Qs from R7 §8 + R8 §10 + each R6 draft's "Open Qs for taste-pass" callout. Deduplicate. Group by theme. These flow into agam-profile-v1.md §(e) AND into a master `wiki-page-drafts-final/_open-qs-for-taste-pass.md` index file.

### Pass 8 — Self-critique BEFORE writing:
- Are all 3 outputs planned with section structure?
- Profile: 600-1200 words? In register-1 voice?
- Ontology: refreshed from v0 with R3a projects + R4 verdicts + R7 tension edges? Date errors fixed?
- 12 wiki pages: cross-link table applied? Register confirmed per page? R6 ship-grade preserved?
- Open Qs callout file: all R7/R8/R6 Open Qs deduplicated and grouped?
- All 5 binding taste-calls applied? (drop interior-design, voice-AI under-share, collab articles primary, em-dash banned, no silence dramatization)

If any "no" → another pass.

---

## Output #1 — agam-profile-v1.md

```markdown
---
type: AgamProfile
version: v1-draft-r9
status: pending-taste-pass
inputs: [R5 themes, R6 drafts, R7 tensions, R8 voice spec, R4 belief deep-dives, master-belief-list]
length_words: [target 600-1200]
voice_register: 1 (free-form post-essay, register 1 from R8)
---

# Agam Arora — Profile v1 (draft for taste-pass)

[Identity opener — 1 paragraph]

## How I think
[3-4 strongest beliefs as scaffolding. Substance-over-hype as root. 200-300 words.]

## What I build
[Second-brain primary, voice-AI as one example, spec-first-taste as method. 150-250 words.]

## How I write
[Condensed from R8. 4 registers in 1 sentence each. Banned LLM-isms summary. Real signatures summary. 100-200 words.]

## What I am still figuring out
[Humility marker. 5-8 of the most consequential Open Qs from upstream rounds. 100-200 words.]

---
*Draft for Agam taste-pass. Not final.*
```

## Output #2 — ontology-v1-draft.md

Follow spec §6 ontology shape. Markdown but clearly JSON-portable. Sections:

```markdown
---
type: Ontology
version: v1-draft-r9
status: pending-taste-pass
sources: [ontology-v0 baseline, R3a projects, R3b people, R4 belief verdicts, R5 theme refinement, R7 tension edges]
---

# Ontology v1 — DRAFT for Agam taste-pass

## Themes (12 + 1 root)
For each: slug, title, 1-line core belief, length target, voice register (1-4), assigned beliefs (slug list), wiki page link.

## Beliefs (final inventory after R4 verdicts)
For each: slug, statement (1-2 sentences), status (confirmed/refined/merged-into/demoted), parent theme, evidence post count, key-evidence dates, tier (1-4), tension-with edges.

## Projects (52)
For each: slug, name, year, status (shipped/abandoned/in-progress), tech stack, lineage parent (if any), beliefs-evidenced (slug list).

## People (~50+)
For each: name, relation (mentor / peer / colleague / public-thinker-cited), interaction surface (post-mention / comment / collab-article / collaborator), beliefs-evidenced (if any).

## Tech (58)
For each: slug, year-first-used, projects-using.

## Edges
- lineage (project → project)
- evidences (post → belief)
- supersedes (belief vN → belief vN+1)
- tension-with (theme ↔ theme, from R7 §7)
- mentor (person → Agam)

## Date corrections applied
- /enter v3: ontology-v0 had 2023-05-10; corrected to April 2026 (R3a finding).
- [list any other corrections]

## Counts
| Entity | v0 | v1 |
|---|---|---|
| Themes | 13 | 12 + 1 root |
| Beliefs | ~40 | [count after R4] |
| Projects | 14 | 52 |
| People | ~25 | [count] |
| Tech | [count] | 58 |
| Edges | 77 proposed | [count] |
```

## Output #3 — wiki-page-drafts-final/<theme-slug>.md (12 files + open-qs index)

Process: for each R6 draft, copy verbatim, then apply:
- Replace "Tension with [other theme]" section with R7 §7 cross-link assignment for this theme + tension content from R7 §1-§6.
- Voice calibration per R8 §1 register assignment.
- Strip any em-dashes in connective prose; replace with colons or hyphen-with-spaces.
- Fix any banned LLM-isms.
- Move Open Qs to header callout (preserve verbatim).

Files to write to `wiki-page-drafts-final/`:
1. agent-first.md
2. ai-pm-skillset.md
3. breadth-as-differentiation.md
4. career-reflection.md
5. enterprise-ai-reality.md
6. linkedin-as-instrument.md
7. personal-projects-tinkering.md
8. pm-taste.md
9. root.substance-over-hype.md
10. second-brain.md
11. spec-first-taste.md
12. voice-ai-craft.md
13. _open-qs-for-taste-pass.md (index of all Open Qs grouped by theme)

---

**Voice rules (apply to ALL 3 outputs in YOUR own writing):**
- No em-dashes. Use colons + hyphen-with-spaces.
- No banned LLM-isms (R8 §2): no "It's not just X, it's Y" / "deeply" / "robust" / "leverage" / "navigate" / "delve" / generic openers / triadic prose lists / conclusion-recap paragraphs / corporate motivational aphorism / hashtag.
- Direct declarative connective prose. No third-person character analysis ("Agam's X is Y").
- Apply 5 binding interim-taste-calls.

**Write protocol:** sequential — write agam-profile-v1.md first (smallest, fastest feedback), then ontology-v1-draft.md, then 12+1 wiki page polishes. Use Write tool per file.

**Budget:** unlimited tokens per Agam. Multi-pass to convergence is fine. Length budgets per spec §4 + R5 §3 + R8.

**Return summary (under 250 words):**
(a) profile word count + register fit
(b) ontology entity counts (themes/beliefs/projects/people/tech/edges) + date corrections applied
(c) 12 wiki polishes — count of pages where R7 cross-link applied, voice fixes count, em-dashes removed, banned LLM-isms removed
(d) Open Qs index file written + total Q count grouped by theme
(e) confirmation all 14 files (1 profile + 1 ontology + 12 wiki + 1 open-qs index) on disk with sizes
(f) any residual issues that should be flagged for Task #2b taste-pass beyond the Open Qs already collected
```

---

## Spawn protocol

- ONE foreground sonnet subagent.
- After return: mechanical verify (14 files exist, correct sizes), commit + push, update STATUS to CHECKPOINT 17, hand to Agam for Task #2b.
- If subagent dies / runs out of context mid-flight: re-spawn with this prompt, instructing it to skip already-written files and resume.
