---
type: ArchitectureDoc
status: draft
written: 2026-04-26
purpose: Audit all Phase A artifacts + define how LLM uses them + define second-brain destiny
audience: Agam (decision-making) + future Claude Code sessions (implementation reference)
---

# Phase A — File audit + LLM architecture + second-brain destiny

This is the design pass before any code is written. Three sections:

1. **File audit** — what every Phase A file IS, who reads it, when it gets retired
2. **LLM architecture** — how `/enter v3` (and any other agent surface) uses these files at runtime
3. **Second-brain destiny** — what the wiki + ontology become, who they serve, lifecycle

---

## 1. File audit — every Phase A artifact, its role, its consumer

### Tier 0 — INPUTS (raw corpus, never edited, private)

| File | Size | What it is | Read by | Lifecycle |
|---|---|---|---|---|
| `~/.gstack/.../corpus/linkedin-corpus.md` | 180KB | 279 LinkedIn posts, raw markdown | R1-R8 subagents only | Frozen. Re-pull only if Agam exports new posts. |
| `~/.gstack/.../corpus/linkedin-comments.md` | 209KB | 253 comments | R3b only | Frozen. |
| `~/.gstack/.../corpus/linkedin-*.json` | 540KB | Same content, machine-readable | Reserved for future structured queries | Frozen. |

**Status:** Phase A read these. Not read again at runtime by `/enter` or wiki. They are evidence-of-record only.

### Tier 1 — INTERMEDIATE SYNTHESIS (Phase A working artifacts, retire after Task 8)

These exist because synthesis is multi-pass. Each layer feeds the next. Once ontology is locked + wiki is published, these become reference-only / archival.

| File | What it is | Why it existed | Retire when |
|---|---|---|---|
| `era-1-output.md` to `era-4-output.md` (R1) | 4 era chunks of corpus summarized | Token-efficient first-pass. No subagent reads 279 posts cold. | Ontology locked. |
| `corpus-synthesis-v0.md` (R2) | Cross-era synthesis | Connect era findings into themes/beliefs first cut. | Ontology locked. |
| `ontology-v0.md` (R2) | First ontology draft | Starting point for v1. | Replaced by `ontology-v1.md` (Task 8). |
| `voice-samples.md` (R2) | Verbatim voice extracts | Input to R8 voice spec. | After R8 voice-spec lock. |
| `projects-tech-lineage.md` (R3a) | 52 projects, 58 tech, lineage | Source-of-record for projects[] in ontology. | Ontology locked. |
| `comments-network.md` (R3b) | 253 comments analyzed, 35 net-new people | Source for people[] in ontology. | Ontology locked. |
| `style-fingerprint.md` (R3c) | Quantitative voice baseline | Input to R8. | After R8. |
| `cross-post-references.md` (R3d) | 18 thematic clusters | Input to R5 theme refinement + R7 tensions. | After R7. |
| `collab-articles-deep-dive.md` (R3e) | Collab Articles as primary content | Input to all later rounds. | After R6/R8. |
| `belief-deep-dives/*.md` (R4, 35 files) | One file per belief, evidence + verdict | Input to R5 theme refinement + R6 wiki drafts. | Reference-only after R9. |
| `master-belief-list.md` (R4 master) | Belief inventory with verdicts | Source of truth for beliefs[] in ontology. | Ontology locked. |
| `theme-refinement.md` (R5) | 12 themes + 1 root locked | Spec-of-record for R6 wiki drafts. | Reference-only after R9. |
| `wiki-page-drafts/*.md` (R6, 12 files) | First wiki draft pass | Input to R9 polish. | Replaced by wiki-page-drafts-final/. |
| `r6-qualitative-audit*.md` | Two audit reports | Caught factual errors in R6, fixed inline. | Reference-only. |
| `tensions.md` (R7) | Cross-theme tensions + cross-link map | Used by R9 to add tension sections. | Reference-only after wiki publishes. |
| `voice-spec.md` (R8) | 4 voice registers locked | Read at agent runtime. SEE TIER 3. | NEVER retire — runtime input. |

**Important:** voice-spec.md is the one Tier-1 file that promotes to Tier 3 (runtime). Everything else in Tier 1 is archival.

### Tier 2 — DECISION ARTIFACTS (binding instructions to subagents + future Claude sessions)

| File | What it is | Authority |
|---|---|---|
| `interim-taste-calls.md` | 5 binding decisions Agam made mid-Phase-A | Spec-of-record for all R3-R9 subagents. |
| `_taste-pass-decisions.md` (just-written) | 21 binding decisions from 2026-04-26 session | Spec-of-record for Task 8 ontology lock + final wiki polish. |
| `STATUS.md` | Round-by-round state | Resume any session, any machine. |

These files are how human judgment binds machine work. They never go away — they're the audit trail.

### Tier 3 — RUNTIME ARTIFACTS (read by agent + wiki, every request)

These are the four files that actually power the second-brain at runtime. Everything else in Phase A existed to produce these four.

| File | What it is | Who reads it | Read frequency |
|---|---|---|---|
| `agam-profile-v1.md` | ~900-word identity snapshot, register-1 voice | `/enter v3` system prompt + wiki home page | Every `/enter` request, every wiki page load |
| `ontology-v1.md` (locked, post-Task 8) | Themes/beliefs/projects/people/tech/edges as machine graph | `/enter v3` retrieval layer + wiki nav builder | Every `/enter` request (queried subset), every wiki page render (full) |
| `voice-spec.md` | 4 registers + banned LLM-isms + signatures | `/enter v3` system prompt | Every `/enter` request |
| `wiki-page-drafts-final/*.md` (12 + 1 root + index) | Theme pages + Open Qs index | Wiki HTML build + agent retrieval grounding | Every wiki page render; selectively per-query in `/enter` |

**This is the irreducible runtime set.** Phase A's entire purpose was producing these four artifacts.

### Tier 4 — PROMPT TEMPLATES (re-spawn safety)

| File | What it is |
|---|---|
| `prompts/r4-batch-template.md` | R4 belief deep-dive subagent prompt |
| `prompts/r6-batch-template.md` | R6 wiki page draft prompt |
| `prompts/r9-final-consolidation.md` | R9 synthesizer prompt |
| `prompts/batch-*-pending.md` | Per-batch substitutions |

Useful for re-running rounds if needed. Otherwise dormant.

---

## 2. LLM architecture — how `/enter v3` uses this stack

### The core question: what gets loaded into the model context per request?

`/enter v3` is the AI terminal at agamarora.com/enter. User types a question, agent answers as Agam. Three moving pieces:

```
User question (typed in /enter terminal)
        |
        v
[/enter front-end]  ───>  [Netlify serverless function: groqHandler.mjs]
                                    |
                                    | builds the LLM context
                                    v
                          [Groq API request with assembled context]
                                    |
                                    v
                          [Stream response back to /enter]
```

### Context assembly — what goes in every Groq request

The context window for a `/enter` request, in priority order:

```
[SYSTEM PROMPT]
1. agam-profile-v1.md (~900 words, ~1.2K tokens)
   - The "who is Agam" prose. Identity snapshot. Register 1 voice.
2. voice-spec.md condensed (~1.5K tokens)
   - 4 registers + banned LLM-isms + signatures + register selection rules.
   - Mechanical self-check rules (no em-dash, no LLM-default phrasings).
3. Sandwich-prompt defense + injection filter (existing in groqHandler.mjs)

[ONTOLOGY RETRIEVAL — DYNAMIC]
4. Top-k themes + beliefs relevant to user question (~1-3K tokens)
   - Retrieved by similarity match: question --> theme/belief embedding
   - For each retrieved theme: pull 1-paragraph summary + assigned beliefs (slug + 1-line)
   - Cross-link map from R7 tensions.md: if theme A is retrieved, expose A's tension links
5. Top-k wiki page chunks (~2-5K tokens)
   - For the most-relevant theme(s), pull the "How it formed" + "What it implies" sections
   - NOT the full page — chunked for retrieval efficiency

[CONVERSATION HISTORY]
6. Last 6 messages (existing)

[USER MESSAGE]
7. The current question
```

**Total context per request:** ~6-12K tokens depending on retrieval breadth. Well within Groq model context windows.

### How retrieval works (no fancy vector DB needed at v1)

Two-stage:

**Stage 1: theme-level retrieval (cheap, deterministic).**
- Ontology has 12 themes + 1 root. For each, compute embedding once, cache.
- At query time: embed question, score against 13 themes, pick top 2-3.
- Cost: 1 embedding call per request. Trivial.

**Stage 2: chunk-level retrieval within selected themes.**
- For each top-2-3 theme, the wiki page is pre-chunked (2-3 chunks per page: Core/How-it-formed/What-it-implies/Tension/Evidence).
- Embed chunks once, cache.
- Score chunks within selected themes against question, pick top 3-5 chunks total.

Result: agent gets ~3-5 chunks of wiki prose grounded to the specific question, plus theme/belief summaries for breadth.

**v1 storage:** flat JSON file with theme/chunk embeddings. ~50KB. Lives in `data/embeddings.json` (or similar). Computed once, regenerated when wiki changes.

**v2 evolution:** if scale demands, swap to a real vector DB. Not needed at v1.

### How the system prompt is assembled

```
You are Agam Arora speaking in first person.

# Who I am (from agam-profile-v1.md)
{profile body, ~900 words}

# How I write (from voice-spec.md, condensed)
{4 registers, banned LLM-isms, signatures, mechanical checks}

# Relevant context for THIS question (retrieved)
{top-2-3 themes: 1-paragraph summary each + belief slugs}
{top-3-5 wiki chunks: prose excerpts}
{cross-link hints if relevant tensions exist}

# Hard rules
- No em-dashes.
- No banned LLM-isms (list).
- Pick register based on question shape (rules).
- If asked about something outside corpus: say "I haven't written about this. Here's what I'd guess, but verify with me directly."
- Voice-AI under-share intentional: don't lead with voice-AI as identity.
- Cite specific posts/dates when grounding a claim.

User: {question}
```

### Why this design

- **Profile + voice spec are static** = caching is easy, system prompt is stable.
- **Retrieval is question-shaped** = small context, focused answer, no "agent stuffs the whole wiki in every prompt."
- **No code framework needed** = Groq SDK + a similarity scorer (cosine over embeddings) is enough. v1 fits in the existing groqHandler.mjs file.
- **Wiki is human-readable AND machine-readable** = same artifact serves both surfaces.

### What changes vs current `/enter` (v2)

Current `/enter` (v2):
- System prompt grounded in `resume.md` (one file) + 4-model fallback chain.
- No retrieval. Static context.
- Generic LLM voice + few-shot examples.

`/enter v3`:
- System prompt grounded in `agam-profile-v1.md` + `voice-spec.md`.
- Stage-1 + stage-2 retrieval over ontology + wiki chunks.
- Voice register routing based on question shape.
- Cross-link awareness (knows tensions exist between themes).

### Failure modes + mitigations

| Failure | Mitigation |
|---|---|
| Retrieval misses (question doesn't match any theme) | Fallback: profile-only context, agent answers from identity. Add "I haven't written about this directly" disclaimer. |
| Voice drift (agent slips into LLM-default) | voice-spec mechanical checks in system prompt. Also: post-generation regex strip of em-dashes / banned LLM-isms before streaming to user. |
| Hallucinated quotes | System prompt: "Quote only from retrieved chunks. If quoting, name date." Plus eval harness checks. |
| User tries injection | Existing sandwich-prompt defense + injection filter in groqHandler.mjs. |
| Out-of-corpus question | Profile says "I haven't written about this. Here's what I'd guess, but verify with me." |

---

## 3. Second-brain destiny — what this becomes, who it serves

### What the second-brain IS at v1

Three layers, public-facing, hosted at agamarora.com:

```
+--------------------------------------------------+
|              agamarora.com                       |
+--------------------------------------------------+
|                                                  |
|  /                  Landing (existing)           |
|  /lab               Projects (existing)          |
|  /resume            Resume (existing)            |
|  /enter             AI terminal (UPGRADED to v3) |
|                                                  |
|  /wiki              NEW — second-brain root      |
|  /wiki/<theme-slug> NEW — 12 theme pages         |
|  /wiki/_root        NEW — substance-over-hype    |
|                                                  |
+--------------------------------------------------+
|              shared static layer                 |
|     (HTML pages built from wiki-page-drafts-     |
|      final/ + design system from /moodboard)     |
+--------------------------------------------------+
|              ontology-v1.json                    |
|   (loaded by /enter v3 + wiki nav at build time) |
+--------------------------------------------------+
```

### Who it serves

**Reader 1: Random visitor (the wiki crawler).**
- Lands on /wiki, scans the 12 theme cards, clicks one that's relevant.
- Reads "Core belief" + "How it formed" + "What it implies."
- Sees Tension cross-link, jumps to a related theme.
- Finds the open-qs callout — sees you're publicly tracking what you don't know.
- May DM you on LinkedIn.

**Reader 2: Recruiter / candidate / collaborator.**
- Reads /resume + /lab as before.
- Reads /wiki to understand HOW you think (not just what you've shipped).
- Decision: do they want to talk to you?

**Reader 3: You (Agam) at 2027/2028.**
- The wiki is your own thinking, externalized.
- When you need to remember why you believed X, the wiki is faster than scrolling LinkedIn.
- When your thinking changes, you update the wiki + add the supersession edge in ontology.

**Reader 4: The agent (`/enter v3`).**
- Loads profile + voice spec into system prompt.
- On each query: retrieves relevant themes + wiki chunks.
- Grounds answers in specific posts/dates. Says "I don't know" when corpus is silent.
- Speaks in your register, not LLM-default.

### Lifecycle — how the second-brain stays alive

The second-brain is NOT a frozen artifact. Three update paths:

**Path A: Periodic re-synthesis (quarterly or as-needed).**
- New LinkedIn posts since last synthesis run.
- Re-pull corpus, re-run R3 (project lineage + comments + style fingerprint) + R4 (any new beliefs surfaced).
- Re-lock ontology, re-publish wiki.
- This is the "automated batch update."

**Path B: Manual edit (you, in any moment).**
- You think something new. You open the relevant wiki page in markdown. You edit. You push.
- Ontology auto-updates from the wiki frontmatter (themes/beliefs declared in YAML).
- This is the "dogfood" path — you living inside your own second-brain.

**Path C: Agent-suggested updates (Phase D).**
- /enter v3 conversation surfaces a contradiction or a gap.
- Agent flags: "This question doesn't map to anything in the wiki. Want to add it as an Open Q?"
- You confirm in chat. Agent appends to the wiki. You review next time.
- Speculative for now. v1 doesn't need this.

### What changes between v1 and v2

**v1 (the current build target):**
- Wiki is markdown + HTML. Static. Ontology is JSON file checked into repo.
- /enter v3 reads ontology JSON + wiki chunks at runtime.
- Single-author, single-reader. You write, you and the agent and the world read.

**v2 (later, if it earns the right):**
- Live editing UI on the wiki itself (not just markdown commits).
- Agent reads-and-writes back to the wiki — Path C above.
- Multi-modal: voice input via voice-AI stack (relevant given your day job).
- Possibly: opt-in "second-brain export" so other people can build their own using the same architecture.

### Honest scope discipline

- v1 is hobbyist scope (per Q6 / B3 decision). Don't over-promise universal value.
- The wiki proves the pattern works for one person. That is the v1 claim, no more.
- If the pattern generalizes, v2 codifies it. If not, v1 still served you.

---

## What's needed before any code

Locked decisions (taste-pass DONE — see `_taste-pass-decisions.md`):
- 21 binding calls applied to ontology + wiki polish.

Pending CC work (no human input needed beyond approval):
1. **Task 8 — ontology lock.** Apply taste-pass decisions to `ontology-v1-draft.md` → `ontology-v1.md` (final). ~30 min.
2. **Final wiki polish.** Apply taste-pass decisions to `wiki-page-drafts-final/*.md` (the 12 + 1 root pages). ~60-90 min via subagent.
3. **Decide content overlap with /lab/second-brain page.** That page already exists as a PRFAQ. The /wiki entry is different — wiki is the thinking, /lab is the project. Cross-link, don't duplicate.

Pending Agam decisions (still open before code):
1. **Wiki URL structure.** /wiki/<slug> vs /<slug> at root vs /lab/wiki/<slug>? Recommend /wiki/<slug>.
2. **Wiki design.** Run /design-shotgun for the wiki page template? Or apply existing v2 page contract (header + aa. mark + dark mode)?
3. **Embedding model + cache location.** Groq doesn't host embeddings — need to pick one (OpenAI text-embedding-3-small, Voyage, or local). Cheap call, computed at build.

Then code:
1. Build wiki HTML from markdown drafts (likely /design-html skill or hand-coded per existing v2 contract).
2. Wire ontology JSON serving (static file or Netlify function).
3. Upgrade /enter v3: replace resume.md grounding with profile + voice + retrieval.
4. Eval harness: 10-20 questions you know the answer to, check agent doesn't drift.
5. Deploy + canary.

---

*This document is the architectural contract for Phase B. Edit as decisions evolve.*
