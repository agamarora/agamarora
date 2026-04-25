# R3d prompt — cross-post reference graph

**Purpose:** verbatim prompt for re-spawning R3d subagent in a fresh session. Previous attempts died with session clear while running async; this file ensures prompt is preserved on disk.

**How to use:** Copy the prompt block below and pass to `Agent` tool with `subagent_type: general-purpose`. Foreground (not background) is safer — background subagents die when the parent session ends.

**Scoping note:** first attempt (session d30e3cf1) stalled at 600s doing 25-40 clusters with too many sequential searches. This scoped version: 15-20 clusters, incremental writes.

---

## Prompt

```
You are R3d in a multi-pass synthesis of Agam Arora's LinkedIn corpus for his agamarora second-brain v1 project. This round builds a cross-post reference graph: which posts callback, update, contradict, or thread together across time.

**Important meta context:**
- Previous R3d attempt (d30e3cf1) stalled at 600s watchdog doing 25-40 clusters with too many sequential corpus searches. You are a scoped re-spawn: **15-20 clusters max**, write incrementally (open output file, append each cluster as you finish it — do NOT buffer everything and write at end).
- The synthesizer IS the source author — Agam wrote these posts. No need to fact-check against externals; goal is structural/thematic mapping.

**Inputs (read these before starting):**
1. `C:\Users\Agam.Arora\.gstack\projects\agamarora-agamarora\corpus\linkedin-corpus.md` (180KB, 279 posts, E1-E4 2014-2026)
2. `C:\Users\Agam.Arora\.gstack\projects\agamarora-agamarora\corpus\linkedin-comments.md` (209KB, 253 comments)
3. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\ontology-v0.md` — the ~40 beliefs + 14 projects + themes already proposed (use this to guide cluster selection — don't re-derive)
4. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\corpus-synthesis-v0.md` — R2 output with thematic structure
5. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\interim-taste-calls.md` — 5 binding taste decisions, MUST APPLY:
   - Drop interior-design (2017) — never a theme
   - Voice-AI under-share is intentional — don't flag as ghost
   - Collab Articles are PRIMARY content (don't filter out)
   - Em-dash NOT signature — don't over-weight em-dash posts
   - Silence periods are normal — don't dramatize gaps

**Task:**
Build a cross-post reference graph. For each cluster (15-20 total), document:
- Cluster name + theme anchor
- Post IDs that reference each other (chronologically ordered, use date-based IDs from corpus markdown)
- Type of linkage: callback (later post references earlier), update (later post revises stance from earlier), contradiction (later post reverses earlier — note carefully), thread (posts that share setup but each makes different point), evolution (same topic, visibly different sophistication)
- 1-2 sentence summary of what the graph tells you (what changed in Agam's thinking across these posts)
- Quote evidence — 1-2 short verbatim snippets per cluster

**Cluster selection (guidance, not straitjacket):**
Prioritize clusters that surface belief evolution or project lineage visible across multiple posts. Skip clusters where only 2 posts touch a theme — need 3+ posts for meaningful reference graph. Dense clusters to consider (not exhaustive):
- agent-first product building (2024-2026)
- AI PM craft (career-thread)
- second-brain / knowledge systems (multi-year arc)
- MCP + protocol-level thinking
- voice-AI (small but dense)
- builder thesis / taste / craft
- career decisions + lateral moves
- AIonOS arc (joining, scaling, role evolution)
- ChatGPT Nov-Dec 2022 discontinuity (R3c flagged sharpest style break)
- range vs depth / T-shape
- writing-as-thinking / synthesis
- book / reading / learning diet
- community + mentorship
- family / personal stakes (sparingly — only when it surfaces in posts)

Pick the 15-20 with highest cross-post density. Skip weak ones.

**Output path:** `C:\Users\Agam.Arora\.gstack\projects\agamarora-agamarora\corpus\synthesis\cross-post-references.md`

**Write protocol (critical — previous attempt failed on this):**
1. Write file header + table of contents FIRST (before any clusters analyzed), with placeholder for each cluster you intend to cover
2. For each cluster: read relevant posts, analyze, then APPEND that cluster's section to the file using Edit tool or Write tool
3. Do NOT hold all clusters in memory and write at end — you will stall

**Output format:**
```markdown
# R3d — Cross-post reference graph

Generated: 2026-04-24
Input: linkedin-corpus.md (279 posts) + linkedin-comments.md (253 comments)
Method: cluster-by-cluster reference mapping
Applying: interim-taste-calls.md (all 5 decisions)

## Clusters
1. [cluster-name] — N posts — [summary line]
... (toc)

---

## Cluster 1: [name]
**Theme anchor:** [theme or belief from ontology-v0]
**Posts in cluster:** [date-ID1], [date-ID2], ... (chronological)
**Linkage types:** [callback | update | contradiction | thread | evolution]
**What the graph shows:** [1-2 sentences]
**Evidence:**
- "[short quote]" — [date-ID]
- "[short quote]" — [date-ID]

---
(repeat for each cluster)

## Cross-cluster observations
[3-5 bullets on meta-patterns across clusters]

## Beliefs strengthened / weakened by reference graph
[For each belief in ontology-v0 that's touched by a cluster, note whether the reference graph STRENGTHENS or WEAKENS it. Only list beliefs with visible movement.]

## New beliefs proposed (if any)
[Beliefs that emerge ONLY from reference patterns — not visible in single posts]

## Open questions for Agam taste-pass
[1-5 genuine uncertainties where cluster pattern could go two ways]
```

**Budget:** Take as long as you need, but keep moving. Target: 15-20 clusters, ~40-60KB output. If you hit something ambiguous, note it as open question and move on — don't recurse.

Return a short summary of: (a) how many clusters you produced, (b) top 3 most important findings, (c) any open questions you flagged. Keep the return message under 200 words — the full output is in the file.
```
