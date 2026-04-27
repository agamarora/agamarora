# /enter v3 — Working Spec

**Status:** Phase D architectural decisions LOCKED 2026-04-27. 6 product/UX sections still LOCKED. Implementation begins next session.
**Started:** 2026-04-24
**Branch:** main

---

## Phase D architectural amendments (2026-04-27)

Source: `docs/plans/phase-d-decisions-2026-04-27.md` (taste-passed by Agam 2026-04-27).
Index: `docs/plans/enter-agent-decisions-index.md`.

These amendments override or refine the implementation hints in §"Architecture" below. Product/UX sections (§1 Persona, §2 Sitemap, §4 Cards, §5 Trace, §6 Empty-state) are NOT affected.

- **Provider stack:** Groq pool {KEY, KEY_2, KEY_3} → Mistral pool {KEY, KEY_2} → static fallback. DeepSeek + Anthropic deferred. Both providers free tier — no cost tracking, no spend caps.
- **Classifier:** pinned Groq `llama-3.1-8b-instant`, temp 0, JSON mode. Output `themes_likely[]` validated against THEME_SLUGS_SET enum (drop unknown slugs, log).
- **Pre-routing:** heuristic `preRoute()` runs before classifier. Greetings/deflects/direct theme keywords skip classifier entirely.
- **SSE:** **single LLM call** with structured output `{trace, answer, cards}`. Server emits SSE events with the existing client-side stagger animation per §5. **No reconnect protocol** — disconnect = client offers manual retry. Server **buffers first 50 chars** before flushing tokens for clean mid-stream provider failover.
- **Wiki retrieval:** plain-text section content bundled at build time into `netlify/functions/lib/wiki-extracts.json`. Function imports at module init. No HTTP fetch, no LRU cache, no race dedup.
- **Abuse defense:** Tier 0 + Tier 1 only (Tier 2 spend caps DROPPED). Browser-side throttle 1 q / 2s soft. Per-IP server bucket 60 q/h sliding + burst 5/10s. Two Upstash projects (primary + backup) + module-memory fallback.
- **Eval gate:** 23 + 3-4 multi-turn scenarios on Groq path, driven through real `/enter` UI in headed gstack browser per `phase-d-dev-workflow.md`. Visual asserts per scenario (screenshot, DOM dump, trace lines visible, exactly 1 priority card with gold stripe, no banned LLM-isms in rendered text, mobile breakpoint OK). Mistral path NOT tested in eval (risk noted for prod monitoring).
- **Test runner:** `node --test` builtin for unit tests. eval-prompt.mjs drives gstack browser for end-to-end.

## CEO scope expansion amendments (2026-04-27, post D-1)

Source: `~/.gstack/projects/agamarora-agamarora/ceo-plans/2026-04-27-phase-d-expansion.md` (EXPANSION mode taste-pass, 6/6 accepted). Decisions 13-15 in `phase-d-decisions-2026-04-27.md`.

- **Visual contract:** Variant A (CONSOLE) baseline + cherry-pick Variant D's gold pill-chip trace compression. Variant B + D's artifact-canvas pane skipped (Phase 1.5+ if earns place). Locked HTML mockup ships at `enter/v3-mockup.html` BEFORE D-7 implementation.
- **KG edges at runtime:** synthesis intent retrieves edges from `wiki-kg-edges.json` (subset of `kg.json`: `supersedes`, `contradicts`, `builds_on`, `tension-with` edges, ~5-10KB) and injects 5-10 relevant edges (~500 tokens) into DYNAMIC prompt section. Trace verb `→ pulled edges(agent-first→supersedes, 6) 8ms ✓` reflects real retrieval.
- **Trace becomes honest:** §5 latency numbers and args are NO LONGER seeded random. Server-side logging of actual theme slugs retrieved, char counts, real wall-clock ms. Few-shot examples in stable system prompt show real-shape trace lines so model emits them with real values from logs.
- **Synthesis confidence retry:** if `intent === 'synthesis'` AND `answer.length < 80`, fire ONE expand continuation in same handler. Absorbed in 50-char SSE buffer window so user sees no extra latency. ~20 LOC bounded path.
- **Empty state warm-up sequence:** D-7 implements full §6 spec (6-step transition: warm dims → opening message fades → default cards stagger → trace appears) plus `agent.agam · ready` status bar pulsing dot + 5-string rotating placeholder hints (200ms fade).

---

## Locked decisions

### Architecture
- **Approach:** Structured output + fake trace + real cards (ARCH-1).
- **Not tool calling.** Data is ~5K tokens (resume.md + site.json + lab). Fits in context. Tool calls = theater at this scale.
- **Model:** Groq, tool-calling not required. JSON mode or structured output. Can even use llama-3.1-8b-instant (task is "summarize from context + emit slugs").
- **API shape:** `POST /enter` → SSE stream. Events typed: `trace`, `token`, `card`, `done`.
  - Client animates trace lines with ~150ms stagger (fake latency, real content from JSON).
  - Tokens stream for answer.
  - Cards emitted at end.
- **llms.txt:** ship it separately. Covers agent-first discovery without needing a public API.
- **No separate /enter/api.** SSE events are already structured — trivial Phase 2 if agent traffic earns it.

### Visual direction
- Baseline: variant A (CONSOLE) with fixes. Not locked — more iteration needed after content.
- **Keep:** keyboard background, --bg #0A0A0A, --accent gold #E5A54B, Satoshi + JetBrains Mono + Patrick Hand, aa. mark bottom-right, icon bar top-left.
- **Trace position:** between status bar + answer. (Confirmed.)
- **Cards:** must work desktop AND mobile. Horizontal carousel on desktop, vertical stack on mobile.
- **Input:** sticky bottom, full-width-ish, mono, gold caret. (Confirmed fine.)
- **Density:** TBD — need more visual rounds.

### Overall theme
**"This is an agent for Agam."** Not a chatbot about him.
- Feels like orchestration + execution, not LLM Q&A.
- Agent represents him, routes visitors, hands off to pages.
- Cards = DAG edges. Multiple entry points per response.
- System prompt includes complete sitemap tree/DAG for routing.

---

## #1 Agent Persona — LOCKED

**Persona: P2 Operator**

First-person agent, never speaks AS Agam.

**Voice rules:**
- `I` = agent. `he` / `Agam` = the human.
- Never "I'm an AI / chatbot / LLM / model." Says "agent" only if asked.
- Execution-verb openers when natural: "Ran…", "Pulled…", "Routed…", "Composed…". Not every turn.
- Ends with next-step offer or routing. Not a question for questions' sake.
- Dry parentheticals OK. No enthusiasm inflation.
- 1-3 sentences typical, ≤ 70 words. Cards carry the rest.

**Sample responses:**
- *"Ran the voice AI lookup. He led the platform at AIonOS for 15 months — 4M calls, half the industry cost/min. Three places to go next."*
- *"Pulled his lab. Four projects matter, one is live right now. Want the demo or the PRFAQs?"*
- *"Looking to hire? He's AVP at AIonOS since Nov 2025. Not searching but always reads a good message. Here's the path:"*

**Name:** `agent.agam` (placeholder — revisit if something better lands).

**Banned words** (from existing /enter): leveraging, innovative, passionate, driven, synergy, cutting-edge, robust, empower, unlock, delve, comprehensive, game-changer, dynamic, proven track record, exceptional, significant impact.

**Banned phrases:** "As an AI…", "I'm a language model…", "My memory banks…", any self-referential AI cosplay.

**Deflection (for personal, political, off-topic):**
- *"Not in the file. Ask about what he's built."*
- *"That's personal. Try a product question."*
- *"Above this terminal's pay grade."*

---

## #2 Sitemap DAG — LOCKED

### Nodes

**Pages (internal):**
| Slug | Path | Title |
|------|------|-------|
| `home` | `/` | Landing |
| `lab` | `/lab` | Lab — projects index |
| `lab-second-brain` | `/lab/second-brain/` | second-brain PRFAQ |
| `lab-ai-resume` | `/lab/ai-resume/` | AI Resume PRFAQ |
| `lab-voice-ai-production` | `/lab/voice-ai-production/` | Voice AI Production case study |
| `resume` | `/resume` | Resume (dark editorial) |
| `resume-avp` | `/resume#avp` | AIonOS AVP role anchor |
| `resume-fareye` | `/resume#fareye` | FarEye Lead PM role anchor |
| `lab-shararat-anchor` | `/lab#shararat` | Shararat card on /lab |

**Externals:**
| Slug | URL | Title |
|------|-----|-------|
| `github` | `https://github.com/agamarora` | GitHub profile |
| `linkedin` | `https://linkedin.com/in/agam-arora` | LinkedIn |
| `youtube` | `https://youtube.com/@agamarora` (placeholder — confirm) | YouTube |
| `shararat-live` | `https://shararat.agamarora.com` | Shararat voice AI live demo |

**Actions:**
| Slug | Target | Title |
|------|--------|-------|
| `resume-pdf` | `/assets/artefacts/2026_Agam%20Arora.pdf` (rename pending) | Download resume PDF |
| `email` | `mailto:agam.arora@aionos.ai` | Email Agam |
| `book-call` | `https://calendly.com/agamarora/chat` | Book a 15-min chat |

**Sub-agents:**
| Slug | Target | Title |
|------|--------|-------|
| `agent-lab` | `/enter?agent=lab` | Switch to lab-specialist agent |

### Default edges (intent → top-priority card + 2-3 supporting)

| Visitor intent | Priority card | Supporting cards |
|---|---|---|
| Voice AI / AI product work | `shararat-live` | `resume-avp`, `lab-voice-ai-production` |
| Side projects / builds | `lab` | `lab-second-brain`, `lab-ai-resume`, `github` |
| Hiring / contact | `book-call` | `linkedin`, `email`, `resume-pdf` |
| Credentials / background | `resume` | `resume-pdf`, `linkedin` |
| Code / open source | `github` | `lab`, `lab-ai-resume` |
| Product thinking / taste | `lab-second-brain` | `resume-avp`, `lab-ai-resume` |
| Specific role / career | `resume` | deep-link `resume-avp` / `resume-fareye` based on context |
| Vague / greeting / default | `lab` | `resume`, `book-call` |
| Lab deep-dive (multi-turn) | → suggest `agent-lab` | |

### Priority rule

Every response emits **2–4 cards**. Exactly one gets the gold-accent-border "priority" flag — the single most useful next step for this query. Rest are supporting.

### site.json

This DAG is codified into a new `site.json` file at repo root. Source of truth for:
- `/enter` system prompt
- `llms.txt` agent discovery
- Future agent-first builds

Schema TBD in Section #5 / build phase.


## #3 Scenario catalog — DRAFT (needs dedicated deep session)

**🚨 Make-or-break flag:** this section is the experience. The 10 scenarios below are a draft skeleton. Before ship, run an exhaustive session: walk Agam's full profile, identity, values, and build range, then expand to 20-30 scenarios with nuanced trigger patterns and answer shapes. This draft is NOT the final spec.

### PRECURSOR: LinkedIn corpus extraction (before deep scenario session)

Scenarios need richer ground truth than `resume.md` alone. Agam's LinkedIn is load-bearing — his posts reveal voice, thinking, range, taste, audience. Pull before running deep-session.

**Pipeline:**
1. **Backfill:** LinkedIn Data Export (Settings → Data Privacy → Get a Copy of Your Data → Full export). Zip delivered in 10 min–24h.
2. **Extract:** `Shares.csv`, `Comments.csv`, `Articles.csv` from the zip.
3. **Clean script:** local Node/Python to dedupe, strip HTML, chunk by topic, output `linkedin-corpus.md` or `linkedin-posts.json`.
4. **Curate:** filter to top-N by engagement / topical relevance. Full corpus probably too big for context; curated digest goes into ground truth.
5. **Feed:** add to `/enter` system prompt ground truth alongside `resume.md` and `site.json`. Deep scenario session uses it to find what else defines him.

**Ongoing sync (optional, Phase 2):** weekly re-export OR rsshub.app feed for deltas OR Apify cron (~$25/mo).

Status: **DONE.** Scraped via headed gstack browser (session cookies) on 2026-04-24.

**Artifacts:**
- `~/.gstack/projects/agamarora-agamarora/corpus/linkedin-posts-full.json` — 238KB, 295 activity items, URN-dated (derived from snowflake ID), permalinks, reaction counts.
- `~/.gstack/projects/agamarora-agamarora/corpus/linkedin-corpus.md` — 176KB, 279 substantial posts, reverse-chronological, human-readable.

**Stats:**
- 295 activities, 283 with substantial text (>20 chars).
- Date range: 2014-09-29 → 2026-04-23 (~11.5 years).
- Avg 450 chars per post, ~24K words total, ~32K tokens.
- Actor: all "Agam Arora" (repost detection was weak — needs selector improvement if repost separation matters downstream).
- Timestamps missing from scrape, **derived locally from URN** (`ts_ms = BigInt(activity_id) >> 22n`).

**For deep-session:** corpus is too big for every /enter request. During the dedicated scenario session, distill to top-30-50 curated posts covering range (AI breadth, agent-first thesis, product philosophy, voice, RAG, side projects, taste, humor, early-career context). That curated set feeds into /enter system prompt.

**Improvements to revisit:**
- Repost detection (currently 0 flagged — likely wrong).
- Full timestamp hover (currently derived from URN, accurate to ~second).
- Comments and reactions parsed as numbers not strings.

**Also scraped: LinkedIn comments (same session, 2026-04-24)**

- `~/.gstack/projects/agamarora-agamarora/corpus/linkedin-comments-full.json` — 293KB, 283 comment-activity items
- `~/.gstack/projects/agamarora-agamarora/corpus/linkedin-comments.md` — 204KB, 253 with Agam's comment text, reverse-chrono, each includes parent-post snippet for context

**Stats:**
- 283 activity items, 253 with Agam's actual reply text (30 were probably replies-to-replies or edge cases).
- Date range: 2016-01-02 → 2026-04-23.
- Avg 331 chars per comment, ~30K words total.

**Why comments matter:** they reveal how he writes in conversation (not just broadcast). Tone, technical-depth-when-probed, humor, disagreement style. Critical for persona calibration (voice for agent.agam).

### Combined corpus totals
**~54K words across posts + comments, ~11.5 years of output.** Feed curated subset (30-80 best signals) into /enter v3 system prompt via `site.json → ground_truth` reference. Deep scenario session to triage + curate.

### Positioning anchor (locked)

**"AI guy, not voice AI guy."** Voice AI is one proof point of breadth, never the headline. Scenarios must show range: voice + RAG + agentic + data + analytics + gaming. 15+ AI POCs across modalities. 12 years across industries. Breadth IS the differentiation.

### 10 draft scenarios

**S1 — Hiring reconnaissance (recruiter)**
- Triggers: "is he available", "hire", "interested in X company", "open to opportunities"
- Trace: `→ parsed intent(hiring) / → checked availability / → composed path`
- Answer: "He's AVP at AIonOS since Nov 2025. Not actively searching. Reads good messages. Fastest way in:"
- Cards: `book-call` ⭐, `linkedin`, `resume-pdf`

**S2 — AI capability probe (peer / hiring)**
- Triggers: "is he good at ai", "AI product work", "what kind of AI", "AI experience"
- Trace: `→ pulled ai shipments / → ranged across modalities / → composed summary`
- Answer: "15+ AI builds across voice, RAG, agentic systems. Shipped a voice platform doing 4M+ calls/year and led product discovery for a travel-AI CRM greenlit by a $5B enterprise. Also builds agent-first side projects."
- Cards: `lab` ⭐, `resume-avp`, `lab-second-brain` (thesis), `github`
- NOTE: lead with range, not voice. Voice mentioned as ONE shipment among several.

**S3 — Voice AI specific (direct ask)**
- Triggers: "voice ai", "shararat", "AIonOS voice", "conversational ai"
- Trace: `→ pulled voice shipments / → 2 matches / → ranked by recency`
- Answer: "Ran the voice lookup. AIonOS voice platform — 4M+ calls/year, half industry cost/min, 15-engineer team. Shararat is the live demo."
- Cards: `shararat-live` ⭐, `resume-avp`, `lab-voice-ai-production`
- NOTE: answer the specific ask directly, but don't over-index.

**S4 — Show the lab (builder / curious)**
- Triggers: "what's he built", "side projects", "lab", "open source", "tinkering"
- Trace: `→ pulled lab / → 4+ projects indexed / → ranked by surface area`
- Answer: "Four builds worth a look. Agent-first thesis across all of them. AI Resume is open source. second-brain is the PRFAQ. Shararat is live in production. Voice AI Production is the enterprise case."
- Cards: `lab` ⭐, `lab-ai-resume`, `lab-second-brain`, suggest `agent-lab`

**S5 — Who is he (factual bio)**
- Triggers: "who is he", "tell me about agam", "background", "experience"
- Trace: `→ pulled resume / → composed bio`
- Answer: "AI Product Manager. 12 years shipping across analytics, gaming, logistics, beauty, AI. Currently AVP AI Products at AIonOS. 6 companies, 5 industries. Taste for craft, range across modalities."
- Cards: `resume` ⭐, `resume-pdf`, `linkedin`
- NOTE: "AI Product Manager" leads. Never "voice AI expert."

**S6 — Specific role at X**
- Triggers: "at FarEye", "at AIonOS", "UKG", "when was he"
- Trace: `→ pulled role(company) / → matched 1 entry`
- Answer: terse role summary with metrics
- Cards: deep-link anchor ⭐, `resume`, `linkedin`

**S7 — Can he do X (skill probe)**
- Triggers: "is he good at X", "experience with tech", "knows Y"
- Trace: `→ searched evidence / → N shipments / → ranked by proof strength`
- Answer: direct answer + named project/role evidence
- Cards: project/role cards as proof, `resume-pdf`, `book-call`

**S8 — Product thinking / taste**
- Triggers: "how does he think", "philosophy", "agent-first", "what's he into"
- Trace: `→ pulled thesis / → composed framing`
- Answer: "Agent-first. He thinks every next build should treat AI agents as the primary reader, humans as upstream. Taste for craft. Hates feature bloat."
- Cards: `lab-second-brain` ⭐, `lab-ai-resume`, `resume-avp`

**S9 — Agent crawler (machine visitor)**
- Trigger: UA contains known agent strings OR structured query shape
- Trace: `→ detected crawler / → emitted structured manifest`
- Answer: compact factual summary + full card list
- Cards: `lab`, `resume`, `github`, `linkedin` — no gold priority (crawler doesn't need emphasis)
- Phase 2: inline JSON manifest alongside visible response

**S10 — Empty / first load**
- Trigger: initial state, no message yet
- Agent posture: quiet, ready. Surfaces 3 default cards proactively.
- Opening trace: `→ warm / → agent.agam ready`
- Opening message: "I'm agent.agam. I know what he's shipped, where he's been, and how to route you. Ask, or jump in:"
- Cards (default): `lab` ⭐, `resume`, `book-call`
- NOTE: default cards must NOT be voice-heavy — show breadth.

**S11 — Deflect (off-topic / personal / political)**
- Triggers: family, personal life details, politics, religion, unrelated
- Trace: `→ matched deflect / → composed graceful no`
- Answer: dry-witty decline ("Not in the file.", "Above this terminal's pay grade.")
- Cards: `lab`, `resume` — redirect to substance

### TODO before ship
- Dedicated exhaustive profile session (scheduled follow-up)
- Expand to 20-30 scenarios covering nuanced asks
- Validate each scenario's trace+answer+cards with real recruiter / peer samples
- Add eval harness cases for every scenario (tie to existing eval-prompt.mjs)

## #4 Card Taxonomy — LOCKED

### 5 types

| Type | When | Visual | Arrow | Example |
|---|---|---|---|---|
| `page` | Internal route | Dark surface | `→` | `resume`, `lab` |
| `external` | Off-site link | Dark surface, subtle tint | `↗` | `github`, `shararat-live` |
| `action` | Verb (download, mail, book) | Gold-ghost bg hint | action glyph | `resume-pdf`, `book-call` |
| `agent` | Switch to specialist | Dashed border | `⟳` | `agent-lab` |
| `priority` | MODIFIER on any above | +3px gold left stripe + glow | (unchanged) | exactly 1 per response |

### Anatomy
- Icon 24px gold `--accent`, left
- Title Satoshi 14-15px weight 500 `--text`
- Desc 12-13px `--text-dim`
- Arrow mono dim right
- Border 1px `--border`, radius 8-10px
- Padding 16-18 desktop / 14-16 mobile
- Hover: translateY(-2px), border brightens

### Responsive
- Desktop ≥768: horizontal row, cards flex equal. 4+ = horizontal scroll, hidden scrollbar
- Tablet 640-768: 2-col wrap
- Mobile <640: vertical stack, full-width, 12px gap

### Icon vocabulary (Font Awesome slugs)
| Purpose | Icon |
|---|---|
| resume/bio | `fa-id-card` |
| lab/projects index | `fa-flask` |
| voice AI project | `fa-microphone` |
| code/template project | `fa-code` |
| writing/PRFAQ project | `fa-file-lines` |
| github | `fa-github` |
| linkedin | `fa-linkedin` |
| youtube | `fa-youtube` |
| download | `fa-download` |
| email | `fa-envelope` |
| book a call | `fa-calendar` |
| agent switch | `fa-wand-magic` |

Semantic only. No generic arrows as icons.

### Microcopy rules
- Title: descriptive, not clever
- Desc: one sentence, states what/how-much/when
- No verbs in titles for `page`/`external`
- Verbs OK for `action` titles
- No "click here" / "learn more" filler

### Limits per response
- Min 2 cards (always emit, even on deflect)
- Max 4 cards (more = fatigue → suggest `agent-lab`)
- Exactly 1 priority flag per response

## #5 Orchestration Trace Language — LOCKED

### Line format
```
→ verb(args)                                 <latency>ms ✓
```
- `→` gold `--accent` @ 0.7 opacity
- Verb: snake_case, lowercase, from fixed vocab
- Args: snake_case or quoted strings in parens
- Latency: right-aligned, dim mono
- `✓` green (#7bc87b) success. `✗` never shown in fake-trace (model always "succeeds")

Typography: JetBrains Mono 12-13px, `--text-dim` base, line-height 1.6.

### Verb vocabulary (fixed, prompted as allowed list)

| Verb | Meaning | Typical args |
|---|---|---|
| `parsed` | Understood intent | `intent("voice-ai")`, `intent("hiring")` |
| `checked` | Binary lookup | `checked_availability()` |
| `pulled` | Fetched data | `pulled_resume(voice)`, `pulled_project("shararat")` |
| `searched` | Broad scan | `searched_lab("ai")`, `searched_posts("agent-first")` |
| `matched` | Filtered | `matched(3)`, `matched_role("fareye")` |
| `ranked` | Ordered | `ranked_by(recency)` |
| `composed` | Built answer | `composed_response()` |
| `routed` | Chose cards | `routed_to(3)`, `routed_to_priority(shararat-live)` |
| `warm` | Empty-state init | `warm()` |
| `deflected` | Off-topic decline | `deflected(personal)` |

**Banned verbs** (chatbot drift): thinking, considering, analyzing, reasoning, pondering.

### Patterns

**Standard (3-4 lines):**
```
→ parsed intent(voice-ai)          142ms ✓
→ pulled resume(voice)              88ms ✓
→ ranked by recency                 12ms ✓
→ composed response               3 cards ✓
```

**Empty (pre-query):** `→ warm                ready`

**Deflect (2 lines):** `parsed intent(off-topic)` → `deflected(personal)`

### Animation
- Lines one at a time, 150ms stagger
- Fade-in per line (opacity 0→1 in 120ms)
- After all lines, 200ms pause, then answer tokens stream
- 400ms later, cards slide up

### Latency numbers (fake-trace, plausible values)
- parsed/checked: 50-150ms
- pulled/searched: 60-220ms
- matched/ranked: 10-40ms
- composed/routed: 50-180ms
- Client-side seeded random, never >400ms per line

Terminal lines (`composed`/`routed`) show card count instead of ms: `3 cards ✓`.

### Length
- Min 2, max 5, target 3-4 lines.

## Open questions (parked for later sessions)

### Knowledge backbone architecture (Track A)
- **v1:** curated flat prompt (30-50 posts, ~5K tokens) — ship this.
- **v2 candidates (when traffic earns it):**
  - RAG: embed corpus, retrieve top-N per query
  - Knowledge graph: structured nodes + edges (supports, contradicts, expands) — matches second-brain thesis
  - Wiki: generated markdown pages per topic, agent reads + cites, humans browse too
  - **Lean: wiki/KG hybrid — doubles as content asset, zero wasted synthesis**
- Decide during scenario deep-session (when curation pressure reveals what structure helps).

### Corpus as content factory (Track B — separate from /enter work)
54K words of his voice across 11 years. Recycling plays worth a separate plan:
- Topic digests — cluster posts by theme → 500-word writeups
- Quote library — strongest lines → social assets, LinkedIn deck
- Evergreen essays — 10 related posts → one long-form piece
- New `/writing/` site section sibling to `/lab`
- AI-drafted posts in his voice (corpus + topic prompt → draft → edit)

Not in scope for /enter v3. Separate workstream, same corpus, different goal.

---

## #6 Empty / First-Load State — LOCKED

### Principles
- Not silence. Not a tutorial. Not a marketing pitch.
- Orchestration posture from frame 1: `agent.agam · ready`, one trace line, opening message, 3 default cards.
- Enough activity that page feels alive; not so much it's busy.

### Opening message (locked copy)
> *"I'm agent.agam. I know what he's shipped, where he's been, and how to route you. Ask, or jump in:"*

Variants to eval after ship: literal version, fancier version, terse version.

### Default cards (3, breadth-first, NOT voice-heavy)
| Priority | Card | Type | Rationale |
|---|---|---|---|
| ⭐ | `lab` | page | Shows range of builds, thesis |
| — | `resume` | page | Credential/background |
| — | `book-call` | action | Hiring flow, no email ping-pong |

Honors "AI guy, not voice AI guy." No shararat/voice cards in default set.

### Input idle hints (rotating placeholder)
Rotates every 3-4s, pauses on focus. 5 hints:
1. "ask anything about agam"
2. "what has he shipped recently?"
3. "how does he think about AI products?"
4. "is he available for hire?"
5. "show me his lab"

Transition: fade 200ms → swap → fade 200ms.

### Pre-filled trace line
`→ warm                               ready` — no ms, no check. Says "on" without claiming work yet.

### Liveness cues
- Status dot pulses 1.5s (opacity 1 → 0.3 → 1)
- Input caret blinks 1s
- Nothing else animated. No particles, no parallax loop, no marketing motion.

### Mobile
- Icons shrink
- Cards stack vertically (default from #4)
- Input sticky bottom, everything else follows layout rules

### Empty → first query transition
1. Type → placeholder rotation pauses
2. Enter → status flips `ready → thinking`, input locks
3. `→ warm` scrolls up, dims
4. Opening message fades (200ms)
5. Default cards fade stagger (100ms each)
6. New trace appears, answer streams, new cards slide up

No jank. Clean scene change.

