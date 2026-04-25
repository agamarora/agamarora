# R4 per-belief deep-dive — universal template

**Purpose:** verbatim prompt template for spawning R4 per-belief subagents. Each belief gets one subagent. Substitute the 4 placeholders below.

**How to use:** Copy the prompt block, replace `{{BELIEF_SLUG}}`, `{{BELIEF_STATEMENT}}`, `{{ANCHORS}}`, and `{{RELATIONS_NOTES}}`, then pass to `Agent` tool with `subagent_type: general-purpose`. **Use foreground (not background) — background subagents die when parent session ends.** This is critical and was the failure mode for R3d/R3e and R4 batch 2 in earlier sessions.

---

## Universal prompt block

```
You are an R4 per-belief deep-dive subagent for Agam Arora's second-brain v1 Phase A synthesis. Your single belief: **`{{BELIEF_SLUG}}`**.

**Belief statement (master-belief-list.md):** {{BELIEF_STATEMENT}}

**Inputs (read all):**
1. `C:\Users\Agam.Arora\.gstack\projects\agamarora-agamarora\corpus\linkedin-corpus.md` (180KB, 279 posts)
2. `C:\Users\Agam.Arora\.gstack\projects\agamarora-agamarora\corpus\linkedin-comments.md` (209KB, 253 comments)
3. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\master-belief-list.md` — your belief's full entry + relations
4. {{ANCHORS}}
5. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\interim-taste-calls.md` — 5 binding taste-calls (apply all)

---

## REASONING PROTOCOL — explicit Chain-of-Thought + ReAct loop (MANDATORY)

You MUST work in interleaved Thought → Action → Observation cycles. Do NOT jump to writing the output file until reasoning is complete. Show your reasoning in scratch internally, then write the structured output.

**ReAct loop (run until evidence saturated):**

```
Thought N: [What do I currently believe about this belief? What gap in evidence am I trying to close? What's my next search hypothesis?]
Action N: [grep / read / cross-reference. Concrete tool call with target.]
Observation N: [What the tool returned. Verbatim quotes/dates if relevant.]
Thought N+1: [How does this evidence update my prior? Does it confirm, refute, complicate, or open a new thread? What's next?]
...
```

**Required reasoning passes (minimum, more if needed):**

1. **Pass 1 — Anchor pass.** Thought: "What does master-belief-list say + what does the anchor doc say?" Action: read both. Observation: list candidate evidence pointers (dates, post fragments, quotes). Thought: rank by strength.

2. **Pass 2 — Corpus sweep.** Thought: "What keywords + date ranges most likely surface raw evidence?" Action: grep linkedin-corpus.md for ≥3 distinct query patterns (concept words, near-paraphrases, antagonists). Observation: collect hits with dates. Thought: which hits are first-class evidence vs glancing mention?

3. **Pass 3 — Comments + Collab sweep.** Thought: "Per Decision 3, Collab Articles are PRIMARY technical surface. What density appears in linkedin-comments.md?" Action: grep comments.md. Observation: tally hits, note register.

4. **Pass 4 — Counter-evidence hunt.** Thought: "What would falsify this belief? What antagonist phrasing would Agam use if he disagreed with himself?" Action: grep for antagonist terms + check superseded-by candidates. Observation: list complications.

5. **Pass 5 — Relations check.** Thought: "Per master-belief-list relations + {{RELATIONS_NOTES}}, which sibling beliefs share evidence? Read related belief-deep-dives if they exist." Action: read 1-3 most-related deep-dives. Observation: confirm/refine relation edges.

6. **Pass 6 — Verdict synthesis (Tier-2/3 seeds only — VERIFY mandate).** Thought: "Given evidence count, era distribution, sibling overlap, and counter-evidence — does CONFIRM / REFINE / MERGE / DEMOTE best fit?" Reason explicitly. Pick verdict. State 1-line justification.

**Worked example (illustrative only — your belief is different):**

```
Thought 1: Belief is `belief.X-over-Y`. Statement says canonical post 2024-09-04. Master-belief-list lists 5-round provenance. My anchor doc Cluster 3 has 4 candidate quotes. First task: confirm canonical post + see how anchor frames it.
Action 1: Read collab-articles-deep-dive.md Cluster 3 section.
Observation 1: 4 quotes pulled — 2024-09-04 (canonical), 2024-03-27 (seed), 2024-05-24 (seed), 2025-06-20 (confirm). Anchor frames as anti-hype substrate child.
Thought 2: Need raw post text — anchor paraphrases. Grep corpus for distinctive phrase.
Action 2: Grep linkedin-corpus.md "10 experiments" -B 2 -A 8.
Observation 2: Found 2024-09-04 post, full text 312 words. Verbatim: "10 experiments → 2 production grade wins."
Thought 3: Counter-evidence — does Agam ever say "POCs CAN scale"? Antagonist phrasing.
Action 3: Grep for "scale" + "POC" + "demo" in same post family.
Observation 3: 2025-11-22 post adds nuance — "demos that DID ship: 3 of them are now 6-figure ARR." So not zero — 30% ship rate not zero.
Thought 4: Refine statement to capture nuance. Counter-evidence is real but supportive (refines not refutes).
... [continue until saturated] ...
```

**Self-critique gate (before writing output):**
After ReAct passes, ask yourself:
- Did I pull verbatim quotes (not paraphrase)?
- Is era distribution honest (not cherry-picked)?
- Did I look for counter-evidence as hard as supporting evidence?
- Did I distinguish observed-behavior from stated-belief? (Behavioral patterns ≠ identity claims.)
- Did I apply ALL 5 interim-taste-calls?

If any answer is "no" or "uncertain", run another ReAct pass before writing.

**Then — and only then — write the structured output below.**

---

**Task — Sections 1-8 (standard R4 template):**

## 1. Refined statement
1-2 sentences in Agam's own framing (use his words where possible).

## 2. Evidence (chronologically ordered)
For each: date · post-or-comment · short verbatim quote · what it shows. Aim for 8-15 entries. Note era distribution.

## 3. Counter-evidence
Posts/comments that complicate or contradict. Don't whitewash.

## 4. Belief history
- Origin (earliest visible)
- Crystallization moment(s)
- Refinement(s)
- Current form (2026)
- Supersession status (supersedes / superseded-by)

## 5. Relations to other beliefs
{{RELATIONS_NOTES}}

## 6. Wiki page candidacy
- Top-level wiki theme? (Yes/no + why)
- If yes: 2-sentence draft theme description
- If no: which existing theme should it nest under?
- Voice register(s) Agam typically uses for this belief

## 7. Most quotable expressions
3-5 verbatim quotes for /enter v3 to surface. Specific, memorable, substantive.

## 8. Open Q for Agam taste-pass
1-3 genuine uncertainties this evidence pass couldn't resolve.

**Apply interim-taste-calls (all 5):**
- Drop interior-design (2017) refs
- Voice-AI under-share intentional
- Collab Articles ARE primary content
- Em-dash NOT signature (Agam uses colons + hyphen-with-spaces)
- Silence periods normal — don't dramatize

**Output path:** `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\belief-deep-dives\{{BELIEF_SLUG_NO_PREFIX}}.md`
(e.g., `belief.agent-first` → `belief-deep-dives/agent-first.md`)

**Write protocol:** Standard incremental — write file header first, then APPEND each section as you complete it. Don't buffer-then-write.

**Budget:** 15-25KB. If ambiguous, flag in Open Q section and move on.

Return summary (under 200 words): (a) evidence count + era spread, (b) counter-evidence found, (c) relations verified/refined, (d) wiki-candidacy recommendation, (e) confirmation file written.
```

---

## Batch 2 specific substitutions (6 beliefs spawned 2026-04-25 09:30, went background, died with session)

### 1. `belief.ai-pm-skillset-table-stakes`
- Statement: "I find myself using ChatGPT for just about everything except product management." AI fluency is table stakes for PMs; archetype of AI-PM is application-layer (using models to unlock growth) not foundation-layer. 4-round provenance (R2, R3a, R3d, R3e). 2023-03-14 manifesto.
- Anchors: cross-post-references.md (relevant clusters for AI-PM craft) + collab-articles-deep-dive.md (Cluster A — 12 AI-PM responses, dense evidence)
- Relations: connects to ai-fluency-required, llm-as-voice-extension, learn-concepts-not-tools. Distinct from ai-is-the-next-wave (peripheral 2017 ancestor).

### 2. `belief.anti-customization`
- Statement: "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings." 2025-12-04 declaration. Refines pm-taste. Fits anti-hype substrate. R3d strengthens.
- Anchors: cross-post-references.md (Cluster 16 Builder thesis + Cluster 10 Anti-hype/substance)
- Relations: manifestation of taste-over-execution + substance-over-hype at product layer. Sibling to spec-over-sprint. Connects to pm-taste family.

### 3. `belief.enterprise-ai-production-reality`
- Statement: Anti-hype substrate at enterprise scale. POCs ≠ production. Field-data realism: most enterprise AI fails non-functional reqs, data readiness is a pipeline problem, vendor demos are theater. Anchored in 9-takeaways post (2024-09-04). R3e seed-confirmed.
- Anchors: cross-post-references.md (Cluster 3 Enterprise AI POCs→production — EXACT anchor) + collab-articles-deep-dive.md (Cluster E Data & AI project fundamentals, 7 responses)
- Relations: child of substance-over-hype. Conditions data-readiness-is-pipeline-not-corpus (seed), non-functional-reqs-are-55pct-of-failure (seed), moats-are-infra-talent-data. Connects to AIonOS narrative.

### 4. `belief.learn-concepts-not-tools`
- Statement: Frameworks endure; tools come and go. Learn the underlying concept (STP, JTD, MVP, AARRR, STAR) — when the tool changes, the framework still holds. 60-year-old frameworks are still load-bearing. Absorbed `belief.stp-is-marketing-bedrock` (R3a-proposed, merged here per master-list).
- Anchors: cross-post-references.md (Cluster 12 Books / reading / learning diet) + collab-articles-deep-dive.md (Cluster B PM fundamentals, 11 items — STP/JTD/MVP/AARRR/STAR appearances)
- Relations: sibling of muscle-memory-over-novelty (seed — master-list Open Q #5: distinct or duplicate?). Connects to never-be-smartest-in-room (learning posture). Absorbed stp-is-marketing-bedrock (R3a) per master-list — confirm or push back.

### 5. `belief.second-brain-is-context-layer`
- Statement: The second-brain isn't a productivity tool, it's the context-layer that makes context > prompt operationally tractable. Personal AI infrastructure as an extension of self that supplies precise context to LLMs. The 2026-04-21/23 launch IS this belief shipped.
- Anchors: cross-post-references.md (Cluster 5 Second-brain multi-year arc — anchor + Cluster 15 Personal projects / tinkering lineage) + projects-tech-lineage.md (second-brain in 52-project lineage)
- Relations: child of self-instrumentation. Pairs with context-over-prompt (the WHY for context-over-prompt). Conditions /enter v3 design.

### 6. `belief.ship-the-prototype`
- Statement: "Ideas aren't enough — ship the prototype." Foundational/root level belief. Supersedes `belief.ideas-are-enough` (2020-05-19 supersession date). Drives personal-projects-tinkering theme. Each era of self-instrumentation IS one shipped prototype.
- Anchors: cross-post-references.md (Cluster 15 Personal projects / tinkering lineage) + projects-tech-lineage.md (52 projects R3a, lineage edges)
- Relations: substrate for self-instrumentation (each era = one shipped prototype). Refined-by spec-over-sprint (still ship, but ship the well-spec'd prototype). Connects to tinker-publicly seed (master-list Open Q #4: distinct or merge?).

---

## Remaining Tier-1 beliefs (10) for batch 3

(For when batch 2 is replayed and complete.)

10 remaining Tier-1 cores not yet covered:
1. `belief.breadth-needs-depth` — anchor: Cluster 8 (Range/T-shape/Human-GPT)
2. `belief.build-measure-learn` — anchor: foundational/root, Cluster 6 (PM craft)
3. `belief.data-literacy-is-pm-core` — anchor: Cluster B Collab + 5 R3e evidence quotes
4. `belief.help-market-flourish` — anchor: 2017-09-14 supersession of dominate-dont-compete
5. `belief.ic-path-legitimacy` — anchor: Cluster 7 (Career moves) + 2021-10-30 supersession of family-default
6. `belief.linkedin-as-instrumental-platform` — anchor: Cluster 18 + 2017+2024 split
7. `belief.llm-as-voice-extension` — anchor: theme.ai-pm-skillset
8. `belief.moats-are-infra-talent-data` — anchor: 2024-12-04 post + cluster 10 anti-hype
9. `belief.pm-is-featherless-hat` — anchor: Cluster 6 (PM craft) origin metaphor
10. `belief.prompts-as-engineering-primitive` — anchor: Cluster 2 prompts arc + tension partner with kill-prompting

## Tier 2 seeds (9) for batch 4 — verification, not consolidation

Per master-list R4 spawn list line 550. These need EVIDENCE PASS to confirm or demote:
- `application-layer-is-where-safety-lives`
- `data-readiness-is-pipeline-not-corpus`
- `design-thinking-as-speed-tool`
- `muscle-memory-over-novelty`
- `non-functional-reqs-are-55pct-of-failure`
- `outcome-billing-over-hourly`
- `silence-precedes-crystallization`
- `tinker-publicly`
- `two-roles-ahead-framing`
- `value-viability-usability-triad`

Plus Tier 3 tensions (2): `kill-prompting` reconciliation, `certifications-are-collectibles` confirmation.

Plus Tier 4 peripherals (15) — low-priority, can be batched faster or skipped if Phase A timeline tight.

---

## Spawning protocol (revised 2026-04-25 CHECKPOINT 11)

- **Default = FOREGROUND.** Spawn agents foreground unless Agam explicitly Ctrl+B-presses to background. Ctrl+B is the intentional signal — auto-async observed earlier was Agam pressing Ctrl+B, not a heuristic failure.
- When background, parent session can pause/resume safely; agent writes to disk regardless. Always save `prompts/batch-NN-pending.md` substitutions before background spawns so re-spawn is mechanical if needed.
- Always pass `model: "sonnet"` per project hard rule. Never opus. Haiku reserved for trivial single-grep / format-conversion tasks (not R4).
