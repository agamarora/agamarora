---
type: IntegrationPlan
status: draft
written: 2026-04-26
purpose: Map every Phase A corpus synthesis output to its concrete consumer in the live site + /enter v3 + Phase B/C/D artifacts. No drift. No new architecture. Use what's specified.
inputs_consumed:
  - docs/plans/second-brain-v1.md (canonical spec)
  - docs/plans/second-brain-v1-ceo-review.md (scope decisions)
  - docs/plans/enter-v3.md (working spec — 6 LOCKED sections + 1 DRAFT + 1 parked)
  - ~/.claude/plans/rosy-plotting-flame.md (system arch, approved 2026-04-24)
  - docs/plans/second-brain-v1-phase-a/synthesis/* (R1-R9 corpus synthesis outputs)
  - docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final/_taste-pass-decisions.md (21 binding decisions from 2026-04-26)
  - docs/plans/second-brain-v1-phase-a/interim-taste-calls.md (5 binding decisions from R3)
---

# Integration plan — corpus synthesis × spec /enter v3 × site-wide

The corpus synthesis we ran (R1-R9, ~700KB of structured analysis) IS the upstream "Track A v2 wiki/KG hybrid" parked in `enter-v3.md` Open Questions. The spec already anticipated this work would happen. What was missing: how each synthesis output maps to each consumer surface.

This doc fixes that. No new architecture. Just plumbing.

---

## The two tracks (locked in `enter-v3.md` parked questions)

**Track A — Knowledge backbone for `/enter v3`:**
- Spec said: "v1 = curated flat prompt. v2 candidates: RAG, KG, **wiki/KG hybrid — doubles as content asset, zero wasted synthesis**."
- We built: the wiki/KG hybrid. Skipped v1 flat-prompt entirely. This IS v2.
- Result: corpus synthesis = `/enter v3` knowledge backbone.

**Track B — Corpus as content factory:**
- Spec said: "topic digests, quote library, evergreen essays, /writing/ site section, AI-drafted posts in his voice. Not in scope for /enter v3. Separate workstream, same corpus, different goal."
- We have the raw material now. CEO review accepted `/wiki/quotes/` as Track B v0.5. Rest is Phase 2.

Both tracks read from the same synthesis. Build once, feed many. This is the spec's invariant.

---

## Master mapping — every synthesis output → every consumer

### Synthesis output index (left column) → consumers (right column)

| Synthesis file | Wiki | KG (kg.json) | /enter v3 | llms-full.txt | site.json | OG images | Quote library | Phase 2 Track B |
|---|---|---|---|---|---|---|---|---|
| `agam-profile-v1.md` | wiki home intro | — | system prompt STABLE block | header summary | meta | — | — | bio anchor for essays |
| `ontology-v1.md` (post-Task 8) | nav + cross-links | full graph | classifier `themes_likely[]` + retriever | inlined kg | sitemap DAG | — | — | topic-cluster source |
| `voice-spec.md` | `/wiki/voice/` | — | persona rules + banned-list + register routing + mechanical checks | voice section | — | — | signature line source | drafting-style for AI-drafted posts |
| `wiki-page-drafts-final/<slug>.md` (12) | 12 theme pages | frontmatter → kg.json | retriever payload (themes_likely match → bundled excerpt) | inlined per theme | nav entries | per-theme OG seed | quote extraction source | digest seed |
| `voice-samples.md` (R2) | — | — | few-shot examples | — | — | — | top-30 lines = quote library | LinkedIn deck content |
| `master-belief-list.md` (R4) | belief callouts in theme pages | beliefs[] array | trace `pulled_belief()` resolution | belief inventory | — | — | — | belief-evolution essays |
| `tensions.md` (R7) | "Tension with..." sections | tension-with edges | scenario coverage (S8-style "evolution/philosophy") | — | — | — | — | "Where I changed my mind" essays |
| `theme-refinement.md` (R5) | theme page metadata (length target, lead post, register) | themes[] meta | classifier prompt: theme list w/ 1-line each | — | — | — | — | series-planning input |
| `projects-tech-lineage.md` (R3a) | `/lab` enhancements + project sub-section | projects[] + tech[] + lineage edges | scenario S4/S6 evidence | inline projects | sitemap projects | — | — | annual-compounding-chain essay |
| `comments-network.md` (R3b) | "How it formed" evidence in theme pages | people[] + edges | mentor-mode register triggers | — | — | — | top mentor-mode quotes | network/credit essays |
| `style-fingerprint.md` (R3c) | — | — | mechanical voice checks (sentence length, punctuation rhythm) | — | — | — | — | drafting-time linter rules |
| `cross-post-references.md` (R3d) | "How it formed" arcs (kill-prompting → context engineering) | supersedes edges | scenario S8 evolution arcs | — | — | — | — | evolution essays |
| `collab-articles-deep-dive.md` (R3e) | evidence in pm-taste / ai-pm-skillset / breadth | Achievement nodes (Top Voice AI/PM) | structured-prompt register (R4) routing trigger | inline collab evidence | — | — | top-1-2% topic snippets | LinkedIn collab-style content |
| `belief-deep-dives/*.md` (35) | per-belief in-page detail | edges + node detail | scenario answer detail | belief evidence inline | — | — | — | per-belief deep dives |
| `_taste-pass-decisions.md` | 21 polish edits | renames + tier moves | persona binding rules | — | — | — | — | — |
| `interim-taste-calls.md` (R3) | 5 binding rules across all pages | entity drops/keeps | persona rules + deflection | — | — | — | — | — |
| `r6-qualitative-audit*.md` (2) | already-applied fixes | — | — | — | — | — | — | — |

If a cell shows `—`, that synthesis output does not feed that consumer.

---

## Track A — `/enter v3` integration (consumer-by-consumer)

The spec for `/enter v3` is mostly LOCKED in `enter-v3.md`. Below: how synthesis fills every locked slot.

### Slot 1 — System prompt STABLE block

Per spec §6 + system arch §3.3 + enter-v3.md, this block is cached at 5min TTL on Anthropic. Contents:

| STABLE field | Source (post-synthesis) |
|---|---|
| **Persona rules** | enter-v3.md §1 (P2 Operator) — `I` = agent, `he` = Agam, execution-verb openers, ≤70 words, banned phrases. Already locked. |
| **Voice calibration** | `voice-spec.md` §2 (13 banned LLM-isms) + §3 (12 real signatures) + §4 (mechanical self-checks). NEW post-synthesis content. |
| **Trace vocabulary** | enter-v3.md §5 (10 verbs locked). Already locked. |
| **Card types + limits** | enter-v3.md §4 (5 types, 2-4 cards, 1 priority). Already locked. |
| **`<site_map>`** | `site.json` (Task #15, net-new). Schema = enter-v3.md §2 sitemap DAG + wiki routes appended. |
| **`<knowledge_graph_index>`** | `kg-themes-summary.mjs` generated by `scripts/build-kg.mjs` from `ontology-v1.md`. 12 themes + 1 root, slug + title + wiki_url + 1-line + node count. ~1.5K tokens. NEW from synthesis. |
| **`<few_shot>`** | enter-v3.md §3 has 11 scenario drafts (S1-S11). Each scenario gets refined post-synthesis: scenario answer text uses voice-spec register; scenario evidence cites real corpus posts; cards extended to include `/wiki/<theme>` per intent map. NEW: refine 11 scenarios using synthesis. PARKED: expand to 20-30 in dedicated session per enter-v3.md §3. |

**Estimated STABLE token count:** ~15-25K tokens (per system arch §5). Well within Anthropic prompt-cache.

### Slot 2 — Classifier prompt (Groq 8B, 200 tokens)

Per spec §6:

```
Classify this query to agent.agam.
Query: "{user message}"
Types: lookup | synthesis | bio | deflect
Return JSON: { type, confidence, themes_likely: string[] }
```

**Synthesis input:** `themes_likely` enum = the 12 theme slugs from R5/R6. Plus a 1-line description of each theme so the classifier can match user phrasing → theme. Source: `theme-refinement.md` Section 3 (per-theme entries) condensed to 12 one-liners.

**Build path:** `scripts/build-kg.mjs` exports `KG_THEMES_SUMMARY` array. Classifier prompt template imports it at build time, inlines the 12 one-liners into the prompt body.

### Slot 3 — Wiki retriever (per-request DYNAMIC block)

Per system arch §3.3, two viable shapes — A (recommended) is in-function bundle.

**Build path:**
1. `scripts/build-kg.mjs` reads each `wiki-page-drafts-final/<slug>.md`.
2. Extracts the `Core belief` + `How it formed` + `What it implies` sections (skip Tension + Evidence + Open Q to keep token count tight).
3. Emits `wiki-excerpts.mjs` — one ~600-1000 token excerpt per theme. ~12K tokens total across all themes.
4. groqHandler imports module at cold-start.
5. At request: classifier returns `themes_likely[]`, retriever pulls excerpts for top-1-3 themes, injects into DYNAMIC block.

**Synthesis input:** `wiki-page-drafts-final/<slug>.md` (12 files) — already produced by R9, taste-pass-polished.

**Cross-links:** R7 `tensions.md` §7 (cross-link map) tells the retriever which OTHER themes to surface as supporting cards even if not directly retrieved. Example: classifier picks `agent-first` → retriever auto-includes `spec-first-taste` summary as supporting context (per R7 cross-link).

### Slot 4 — Trace lines (the visible reasoning surface)

Per enter-v3.md §5 LOCKED. Verb vocabulary is fixed. Synthesis adds:

| Verb | Synthesis-grounded args |
|---|---|
| `parsed` | `intent("voice-ai")`, `intent("hiring")` — from classifier `type` |
| `pulled` | `pulled_theme("agent-first")`, `pulled_belief("substance-over-hype")` — from retriever |
| `searched` | `searched_posts("agent-first")` — synthesis evidence dates |
| `matched` | `matched(3)` — count of retrieved themes |
| `ranked` | `ranked_by(recency)` — corpus dates from R3a/R3b |
| `composed` | `composed_response()` |
| `routed` | `routed_to_priority(/wiki/agent-first)` — priority card |

Trace output is fake-realistic per enter-v3.md §5 — model emits the verb + args, client adds latency numbers + checkmarks. Synthesis grounds the verb args in real corpus content (theme slugs, belief slugs, dates).

### Slot 5 — Cards (2-4 per response, 1 priority)

Per enter-v3.md §2 + §4 LOCKED. Default intent → cards mapping needs ONE update post-synthesis:

| Visitor intent | Priority card | Supporting cards (NEW: include `/wiki/<theme>`) |
|---|---|---|
| Voice AI / AI product work | `shararat-live` | `resume-avp`, `lab-voice-ai-production`, **`/wiki/voice-ai-craft`** |
| Side projects / builds | `lab` | `lab-second-brain`, **`/wiki/personal-projects-tinkering`**, `github` |
| Hiring / contact | `book-call` | `linkedin`, `email`, `resume-pdf` |
| Credentials / background | `resume` | `resume-pdf`, `linkedin`, **`/wiki/career-reflection`** |
| Code / open source | `github` | `lab`, **`/wiki/personal-projects-tinkering`** |
| Product thinking / taste | **`/wiki/pm-taste`** | `resume-avp`, **`/wiki/spec-first-taste`**, `lab-second-brain` |
| AI capability probe | **`/wiki/ai-pm-skillset`** | `lab`, **`/wiki/breadth-as-differentiation`**, `github` |
| Evolution / philosophy | **`/wiki/agent-first`** | **`/wiki/root.substance-over-hype`**, `/writing/second-brain-live` |
| Specific role / career | `resume` | deep-link `resume-avp`/`resume-fareye` + **`/wiki/career-reflection`** |
| Vague / greeting / default | `lab` | `resume`, `book-call` |

**Default cards (empty state, per enter-v3.md §6):** `lab` ⭐, `resume`, `book-call`. NO change. Honors "AI guy not voice AI guy."

### Slot 6 — Scenario catalog expansion (parked deep-session)

Per enter-v3.md §3, the 10-11 draft scenarios need expansion to 20-30 in a dedicated session, using corpus signals as triggers + ground truth.

**Synthesis adds these scenarios (high-value extensions):**

| New scenario | Trigger | Synthesis-grounded answer | Cards |
|---|---|---|---|
| **S12 — kill-prompting arc question** | "didn't he say kill prompting", "what changed about prompting" | "Stance held. Diagnosis was right. The skill layer migrated: prompting → context engineering → harness engineering. Writing-perfect-English-as-PM-skill is dead." (per A1 taste-pass) | `/wiki/agent-first` ⭐, `/wiki/ai-pm-skillset` |
| **S13 — anti-customization question** | "what does he think of fine-tuning", "should we customize the model" | "He argues against in enterprise contexts: 6mo cycles, training docs, foundation-model coupling. Scoped to enterprise; consumer math is different (per D1 taste-pass)." | `/wiki/enterprise-ai-reality` ⭐, `/wiki/spec-first-taste` |
| **S14 — Top Voice credentials** | "what credentials does he have", "any awards / recognition" | "LinkedIn Community Top Voice in BOTH AI and Product Management (top 1-2% globally). Earned through Collaborative Articles — peer-voted answers, not exam-gated." | `linkedin` ⭐, `/wiki/ai-pm-skillset` |
| **S15 — second-brain meta question** | "what is this site", "who built this", "is this AI generated" | "He built it. Open-source. /wiki is his thinking, structured. /enter is the agent he wired to retrieve from it. Pattern probably generalizes if you tinker with AI tools daily — try it." (per B3 taste-pass) | `/wiki/second-brain` ⭐, `lab-second-brain`, `github` |
| **S16 — substance-over-hype filter** | "what does he think of [hype topic]", "is X overrated" | "Filter applies: anti-hype, look for substance. He's been saying this 8 years (blockchain 2018 → GenAI 2023 → customization 2026)." | `/wiki/root.substance-over-hype` ⭐, `/wiki/enterprise-ai-reality` |
| **S17 — IC path / leverage in AI era** | "should I become a PM director", "is people management the goal" | "Universal claim: people-mgmt critical but not for everyone. AI-era amplifier: IC path matters MORE — IC + AI agents = leverage closer to a small team than ever." (per F3 taste-pass) | `/wiki/career-reflection` ⭐, `/wiki/ai-pm-skillset` |

**Scenario count target before ship:** 17 minimum (S1-S11 base + S12-S17 synthesis-derived). Spec target was 20-30; synthesis provides the lift.

### Slot 7 — Voice register routing inside `/enter v3` answers

`voice-spec.md` defines 4 registers. Agent picks register based on question shape:

| User question pattern | Register | Rationale |
|---|---|---|
| Open-ended "how does he think about X" | Register 1 (free-form post-essay, 80-280 words) — but compressed to ≤70 words per `agent.agam` persona spec | Identity-bound thinking. Agent uses R1 cadence in compressed form. |
| Quick lookup "what is X" | Register 2 (comment-zinger, <40 words) | Direct answer. No prelude. |
| Mentoring-shape "how should I do X" | Register 3 (mentor-mode playbook, 200-500 words) — but compressed | Numbered if applicable. No corporate-motivational tone. |
| Structured technical Q "what's the stack for X" | Register 4 (collab-article, 40-210 words, `1/ ` slash format) | Numbered list, structured prompt response. |

**Implementation:** voice-spec §1 trigger rules go into the system prompt STABLE block. Classifier output (`type` + question keywords) feeds register selection. Mechanical checks (em-dash regex strip, banned LLM-ism filter) run post-generation before SSE streaming.

### Slot 8 — Eval harness (10 pinned scenarios for ship)

Per spec §6 + system arch §6.1, eval harness needs full rewrite to call function E2E. Synthesis grounds the assertions:

For each of the 17 scenarios above, eval pins:
- Expected `type` (classifier accuracy)
- Expected `themes_likely[]` (theme slugs)
- Expected trace verb pattern (`pulled_theme`, `composed`, etc.)
- Expected card slug set + priority slug
- Voice markers: zero em-dashes, zero banned LLM-isms, register-appropriate length

Pass criteria: 17/17 (or 10/10 if cutting to ship-minimum) for launch gate.

---

## Track B — site-wide corpus content factory

Beyond `/enter v3`, the synthesis powers other surfaces:

### B1 — `/wiki/*` (the second-brain itself)

This is BOTH Track A (knowledge backbone) AND Track B (content asset). Already covered above.

### B2 — `/wiki/quotes/` (CEO review accepted scope)

**What it is:** copy-ready signature lines, sharable as social asset.

**Synthesis source:**
- `voice-samples.md` (R2) — 30 verbatim lines, dated.
- `voice-spec.md` §3 — 12 real signatures with concrete examples.
- `master-belief-list.md` — top quotable expressions per belief.

**Output:** `/wiki/quotes/index.html` — one page, ~50-80 quotes, grouped by theme/year, each with date + permalink + copy button.

**Effort:** ~45 min per CEO review. Synthesis already did the extraction; this is just HTML wrapping.

### B3 — `llms-full.txt` (rewrite, already exists)

Per system arch §6.4 — file already shipped, needs rewrite for second-brain v1.

**New content sources:**
- All 12 wiki pages (full text, inlined)
- Ontology summary (themes + beliefs as plain-text bullets)
- Profile bio
- Voice spec banned-list (so agents reading llms-full know the voice rules)

**Effort:** ~15 min per CEO review estimate. Mostly automated from existing synthesis.

### B4 — `/wiki/voice/` (public voice page, spec §4)

400-600 words. Lighter than `voice-spec.md` (which is internal/runtime).

**Synthesis source:**
- `voice-spec.md` §9 (wiki-home voice doc snippet) — Agam's first-person 150-300 word block already drafted.
- Plus: 4 register one-liners
- Plus: 5-8 banned LLM-isms (the most surprising ones)
- Plus: 3-5 real signatures with examples

### B5 — Per-theme OG images (CEO review accepted, ~30 min)

12 PNGs (one per theme). Each features a signature line from that theme's evidence + the theme title.

**Synthesis source per OG:**
- Theme title from `theme-refinement.md`
- Best 1-line quote from `master-belief-list.md` Tier-1 belief in that theme
- Date stamp

**Effort:** 12 PNGs at ~3 min each = ~30 min. Existing OG pipeline handles dimensions.

### B6 — `/writing/second-brain-live/` (thesis post, launch artifact)

The launch piece. Cross-posts to Medium + LinkedIn long-form on launch day. Spec §8.

**Synthesis source:**
- Tension surface (R7) — "what changed in my thinking" arcs are post-worthy.
- Evolution chains (R3d cross-post-references.md) — kill-prompting → context engineering is a clean narrative.
- Substance-over-hype 8-year through-line.
- The build pattern itself: synthesis-as-author method, replacing Karpathy full-read.

**Authorship:** Agam writes. Synthesis is source material, not draft. Needs Agam's register, not synthesizer's.

**Effort:** 2-4 hours for Agam writing + 30 min CC editing assist if requested.

### B7 — `/lab` page enhancements (taste-pass-derived)

Per F1 taste-pass: V2 Games reclassified to career-reflection. Top-tier lab projects: Shararat / second-brain / luna-monitor / ai-resume / agamarora.com.

**Action on `/lab`:**
- Verify the 4 existing lab cards (second-brain, ai-resume, voice-ai, luna-monitor) match the top-tier list. They do — voice-AI is the production case study card.
- Add cross-links from each lab card to its `/wiki/<theme>` page. Example: ai-resume card links to `/wiki/agent-first`. luna-monitor card links to `/wiki/personal-projects-tinkering`.
- No new cards needed.

**Effort:** ~20 min HTML edits.

### B8 — `/resume` page enhancements (light)

Resume is dark editorial, career data. Synthesis adds:
- "How I think" section (1 paragraph, links to /wiki) — optional addition.
- Cross-link from each role to relevant `/wiki/<theme>` (e.g., AIonOS role → /wiki/voice-ai-craft + /wiki/enterprise-ai-reality).

**Effort:** ~30 min if adding the "How I think" section. ~10 min if just adding cross-links.

### B9 — `/lab/second-brain/` PRFAQ live-demo section (spec §2 modification)

Existing PRFAQ page gets a "live instance" section linking to `/wiki/`. Per spec.

**Effort:** ~15 min HTML edit.

### B10 — `site.json` (Task #15, net-new)

Schema = enter-v3.md §2 sitemap DAG. Add:
- 12 wiki theme routes
- 1 root wiki route
- /wiki/voice
- /wiki/quotes
- /writing/second-brain-live
- llms.txt + llms-full.txt + kg.json as machine-readable manifests

**Effort:** ~30 min to write JSON + commit.

### B11 — Phase 2 Track B (parked, post-launch)

Per enter-v3.md parked section:
- Topic digests (cluster posts by theme → 500-word writeups)
- Evergreen essays (10 related posts → one long-form piece)
- AI-drafted posts in his voice (corpus + topic prompt → draft → edit)
- New `/writing/` section sibling to `/lab`

**Status:** Phase 2. Not in v1 launch scope. Synthesis preserves the source material.

---

## Concrete next-step checklist (no code yet)

### Pre-code (CC autonomous, ~3-5 hours)

1. **Task #8 — Lock ontology v1.** Apply 21 taste-pass decisions to `ontology-v1-draft.md` → `ontology-v1.md`. Includes: belief renames (llm-as-voice-extension → llm-as-primary-daily-tool, non-functional-reqs renaming), tier moves (never-be-smartest demote, two-roles-ahead promote), evidence additions (open-source repo as evidence for help-market-flourish, AI-era IC reframe), AIonOS strip across all nodes/edges.

2. **Final wiki polish.** Apply 21 decisions to all 13 `wiki-page-drafts-final/*.md` files. R9 already produced taste-pass-aware drafts; this pass applies the new 21 decisions on top. Subagent-driven, ~60-90 min.

3. **Refine 11 enter-v3 scenarios + add 6 synthesis-derived scenarios (S12-S17).** Output: `docs/plans/enter-v3-scenarios-v2.md`. Each with trigger / trace / answer / cards / eval-pin. ~45 min.

4. **Draft `site.json`.** From enter-v3.md §2 + wiki additions. ~30 min.

5. **Draft `kg-themes-summary.mjs`.** 12 themes + 1 root, slug + title + 1-line + counts. Mock data (real values come from ontology-v1.md when locked). ~15 min.

### Pre-code (Agam decisions needed before Phase D code)

1. **Wiki retriever shape:** in-function bundle (recommended A) vs runtime fetch (B). Lock for Phase D.
2. **Wiki HTML generation:** scaffold + hand-finish vs full generate vs pure hand-author per existing v2 contract. Lock.
3. **Eval harness:** rewrite to call function E2E vs keep two harnesses. Lock.
4. **Card schema field names:** lock to avoid client/server drift. From enter-v3.md §4 + add the wiki-route fields.
5. **Per-IP identity:** confirm Netlify `x-nf-client-connection-ip` header.
6. **Embedding model:** NOT NEEDED. Spec uses classifier-driven retrieval, not embeddings. Striking from earlier list.
7. **Wiki URL:** `/wiki/<slug>` confirmed by spec §2. Not a decision.
8. **Wiki design pass:** existing v2 page contract (header + aa. mark + dark mode + Satoshi/JetBrains/Patrick Hand) per spec §5. /design-shotgun NOT needed unless Agam wants visual exploration.

### Phase A → B handoff

After tasks 1-2 above complete, Phase A is DONE. Phase B starts: hand-author 12 wiki HTML pages + index + voice + quotes pages from polished markdown drafts. Per spec §9 weekend-1 timeline.

### Phase B → C → D handoff

Per spec §9. No change to sequence.

### Launch gate (per spec §0 + §8)

Wiki + `/enter v3` + thesis post LIVE TOGETHER. No partial ship.

---

## What this integration plan does NOT do

- Add new architecture beyond what spec + system arch already say.
- Change the persona (`agent.agam`, P2 Operator) — locked in enter-v3.md §1.
- Change the trace verb vocabulary — locked in enter-v3.md §5.
- Change card taxonomy — locked in enter-v3.md §4.
- Change abuse defense tiers — locked in spec §7.
- Promise Phase 2 Track B work in v1 scope.
- Re-litigate any taste-pass decision — those are content, integrated into the wiki/ontology already.

This doc is plumbing only.

---

*Phase A done. Phase B/C/D execution proceeds per spec §9. Open architectural decisions (5 listed) need user calls before Phase D code. Other tasks (1-5 above) are autonomous CC work.*
