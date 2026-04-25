# R3e prompt — Collaborative Articles deep dive

**Purpose:** verbatim prompt for re-spawning R3e subagent in a fresh session.

**How to use:** Copy the prompt block below and pass to `Agent` tool with `subagent_type: general-purpose`. Foreground (not background) is safer.

---

## Prompt

```
You are R3e in a multi-pass synthesis of Agam Arora's LinkedIn corpus for his agamarora second-brain v1 project. This round is a DEEP DIVE on LinkedIn Collaborative Article responses — comments Agam wrote on LinkedIn's AI-prompted article features, which earned him Community Top Voice badges (top 1-2% globally) in AI and Product Management.

**Critical framing (READ FIRST):**
Previous R3b pass classified these as "AI-pablum noise" (58 of 253 comments, ~20%) and recommended excluding them from voice samples. Agam REJECTED this classification. See `interim-taste-calls.md` Decision 3. Per Agam:

> "I poured a lot of effort there. Collaborative article content includes a lot more nuanced technical material than anything... because I was grinding for top badges. If you get enough likes on a comment, one was awarded. I managed to get into the top 1-2% of each AI and Product Management. So the comments I posted on these articles were gems."

These are NOT noise. They are a **competition surface** where badge incentive forced quality. The 5-bullet format is structural, not lazy. Same form can be pablum (someone else) or load-bearing (Agam grinding for Top Voice).

**Your task:** Re-process all Collaborative Article comments as PRIMARY technical content.

**Inputs (read these before starting):**
1. `C:\Users\Agam.Arora\.gstack\projects\agamarora-agamarora\corpus\linkedin-comments.md` (209KB, 253 comments — Collab Articles are in here, identifiable by format: responding to an AI-prompted question, usually structured 5-bullet format)
2. `C:\Users\Agam.Arora\.gstack\projects\agamarora-agamarora\corpus\linkedin-comments-full.json` (296KB — machine-readable version with metadata, may have article topic / question clearer here)
3. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\comments-network.md` — R3b's original analysis (treat as a starting point, but override its pablum classification)
4. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\ontology-v0.md` — existing belief list to map evidence to
5. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\interim-taste-calls.md` — 5 binding taste decisions

**Deliverables (in one output file):**

1. **Topic-area inventory** — for each Collab Article Agam responded to, what was the article topic / prompt? Group into clusters (e.g., "prompt engineering," "product roadmap prioritization," "AI agent evaluation," "cross-functional communication," etc.). Estimate which clusters have the highest response density — those represent Agam's strongest credentialed expertise (where he grinded hardest for Top Voice).

2. **Technical signal extraction** — pull out concrete technical claims, frameworks, heuristics from the comments. For each: short quote + what it evidences (which belief in ontology-v0, or new belief).

3. **Belief-evidence map** — for every belief in ontology-v0 touched by a Collab Article, append evidence. Propose new beliefs where the comments show a distinct technical claim not in ontology-v0.

4. **Achievement nodes** — propose:
   - `Achievement: linkedin-top-voice-ai` — when was this earned? (cite post or comment evidence if findable)
   - `Achievement: linkedin-top-voice-pm` — same
   - Any other achievement visible in the corpus (article features, speaker slots, etc.)

5. **Voice register #4 confirmed** — Agam uses 4 registers: post-essay, comment-zinger, mentor-playbook (found in R3b), structured-prompt-response (this one). Document this register's characteristics: typical length, structural pattern, tonal traits, use cases. Give 5-8 verbatim excerpts as voice samples.

6. **Top-cluster deep dives** — for the 3-5 topic clusters with the highest response density + strongest technical signal, do a per-cluster writeup: what expertise does it credential Agam for? What claims does he make? What's the most useful quote for an agent to surface when asked about this area?

**Apply interim-taste-calls (all 5):**
- Drop interior-design (2017) references
- Voice-AI under-share intentional — don't flag Collab Article voice-AI responses as ghost
- Collab Articles ARE primary (this round's premise)
- Em-dash NOT signature — don't over-weight em-dash-containing comments
- Silence periods normal — don't dramatize

**Output path:** `C:\Users\Agam.Arora\.gstack\projects\agamarora-agamarora\corpus\synthesis\collab-articles-deep-dive.md`

**Write protocol (critical — incremental writes, do NOT buffer-then-write):**
1. Write file header + section placeholders first
2. As you complete each section, APPEND using Edit tool
3. Sections are large enough that buffering all = stall risk

**Output format:**
```markdown
# R3e — Collaborative Articles deep dive

Generated: 2026-04-24
Input: linkedin-comments.md (253 comments, ~58 Collaborative Article responses)
Method: Override R3b "pablum" classification per Agam's Decision 3 — treat as PRIMARY technical content
Applying: interim-taste-calls.md (all 5)

## TL;DR
[5-8 bullets — top findings, most credentialed expertise areas, key Achievement nodes proposed]

---

## 1. Topic-area inventory
[Table or list: article topic / prompt → count of Agam responses → summary of his angle]

## 2. Technical signal extraction
[For each distinct technical claim, framework, or heuristic: short quote + what belief/expertise it evidences]

## 3. Belief-evidence map
### Existing beliefs (from ontology-v0) with new evidence
- `belief.X` → [evidence lines + short quotes from Collab Articles]
- ...

### New beliefs proposed (emerging from Collab Articles, not in ontology-v0)
- `belief.Y` → [definition + evidence]
- ...

## 4. Achievement nodes
- `Achievement: linkedin-top-voice-ai` — [status, date earned if findable, corpus evidence]
- `Achievement: linkedin-top-voice-pm` — [same]
- (others as found)

## 5. Voice register #4 — structured-prompt-response
**Characteristics:**
- Typical length: [range]
- Structural pattern: [e.g., "5-bullet, each bullet 1-2 sentences, bullet opens with concept-label"]
- Tonal traits: [...]
- Use cases (when agent should deploy this register): [...]

**Voice samples (5-8 verbatim excerpts):**
1. "[quote]" — on [topic]
2. "[quote]" — on [topic]
...

## 6. Top-cluster deep dives (3-5 densest clusters)
### Cluster A: [topic area]
- Response count: N
- Expertise credentialed: [...]
- Representative quotes: [...]
- Best single quote for agent to surface: "[...]"

### Cluster B: [...]
...

## Open questions for Agam taste-pass
[1-5 genuine uncertainties]
```

**Budget:** Take as long as you need, but keep moving. Target output: 50-80KB.

Return a short summary of: (a) how many Collab Articles re-analyzed, (b) top 3-5 expertise clusters identified, (c) Achievement nodes proposed, (d) voice-register-4 characterization in 2 sentences. Keep the return message under 250 words — full output is in the file.
```
