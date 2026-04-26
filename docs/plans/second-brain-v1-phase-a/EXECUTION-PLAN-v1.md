---
type: ExecutionPlan
status: locked-for-execution
written: 2026-04-26
purpose: Bind CC autonomous execution to a specific sequence with CoT+ReAct discipline, drift-catch gates, and frequent commit cadence. Read this BEFORE every task in the sequence.
authoritative_inputs:
  - docs/plans/second-brain-v1.md (canonical spec)
  - docs/plans/second-brain-v1-ceo-review.md (scope decisions)
  - docs/plans/enter-v3.md (locked sections 1-6)
  - ~/.claude/plans/rosy-plotting-flame.md (system architecture)
  - docs/plans/second-brain-v1-phase-a/synthesis/* (R1-R9 outputs)
  - docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final/_taste-pass-decisions.md (21 binding decisions)
  - docs/plans/second-brain-v1-phase-a/interim-taste-calls.md (5 binding decisions)
  - docs/plans/second-brain-v1-phase-a/INTEGRATION-PLAN.md (synthesis-to-consumer mapping)
  - docs/plans/second-brain-v1-phase-a/GAPS-vs-SPEC-AND-SYSTEM-ARCH.md (drift catalog from earlier)
---

# Execution plan v1 — CC autonomous tasks before code

## Why this doc exists

Two prior drift events in this session:
1. I (Claude) underdrafted `/enter v3` architecture from first principles when the spec already specified it.
2. I treated the corpus synthesis as standalone instead of as Track A v2 input (which the spec anticipated).

Both drifts are now corrected (`GAPS-vs-SPEC-AND-SYSTEM-ARCH.md` + `INTEGRATION-PLAN.md`). This execution plan exists to prevent a third drift.

**Binding rules for every task in the sequence:**
1. Re-read this doc + the relevant authoritative input before starting any task.
2. Apply CoT + ReAct (explicit Thought → Action → Observation passes) before drafting any output.
3. Self-critique against drift-catch checklist (§3) before each commit.
4. Commit + push after every milestone. Frequent, not batched.
5. Update STATUS.md after each milestone.
6. Document any new decision (taste call, architectural call) inline in the relevant binding doc.

---

## 1. Architectural decisions — locked here, autonomously decided

These were the 5 open questions from system arch §10. All 5 are now locked. Override by editing this doc + binding cascade if any read wrong.

### D1 — Wiki retriever shape: in-function bundle (option A)

**Decision:** at build time, `scripts/build-kg.mjs` reads each `wiki-page-drafts-final/<slug>.md`, extracts `Core belief` + `How it formed` + `What it implies` sections (skips Tension + Evidence + Open Q to keep tokens tight), and emits `netlify/functions/lib/wiki-excerpts.mjs` — one ~600-1000 token excerpt per theme. groqHandler imports module at cold-start, retriever pulls excerpts for `themes_likely[]` from classifier output.

**Reasoning:** spec + system arch recommend this. No runtime SPOF, one-time cold-start cost amortized, wiki + function ship same commit.

**Implication:** wiki updates trigger function redeploy. Acceptable per spec §11.

### D2 — Wiki HTML generation: scaffold + hand-finish

**Decision:** `scripts/build-wiki.mjs` reads each `wiki-page-drafts-final/<slug>.md` markdown source and emits `wiki/<slug>/index.html` scaffold containing:
- DOCTYPE, head with OG tags, meta, design tokens (per existing v2 page contract)
- Shared v2 header (icon bar) inline
- Shared aa. mark inline + stroke-draw animation script
- `<article>` tag with placeholder for prose
- Closing tags

CC then hand-finishes each page by populating the article body with prose from the markdown source, applying typography conventions (max-width column, prose styling per spec §5).

**Reasoning:** site convention requires self-contained inline-style HTML per page (per CLAUDE.md). Pure hand-authoring 12 pages = inconsistency risk. Full automated generation breaks site convention. Scaffold + hand-finish balances both.

**Implication:** the build-wiki.mjs scaffolder is a small utility (~100 lines). The hand-finish per page is ~10 min CC work × 12 pages = ~2 hours.

### D3 — Eval harness: two harnesses (existing + new)

**Decision:** keep `eval-prompt.mjs` as-is for voice-fidelity testing against direct Groq calls. Net-new `eval-function.mjs` calls `groqHandler.mjs` end-to-end for structural assertions: classifier accuracy, card emission rules, abuse defense triggers, SSE event protocol.

**Reasoning:** existing voice-fidelity coverage is useful and cheap. Rewriting it into the function-E2E harness slows iteration. Two harnesses = clean separation of concerns.

**Implication:** Phase D Task #13 splits into #13a (voice eval, existing) + #13b (structural eval, net-new).

### D4 — Card schema field names: locked

**Decision:** card object schema:
```typescript
type Card = {
  slug: string         // unique identifier, e.g. "lab-second-brain"
  type: 'page' | 'external' | 'action' | 'agent'
  title: string        // 1-line, descriptive
  desc: string         // 1 sentence, what/how-much/when
  href: string         // path or full URL
  icon: string         // Font Awesome class, e.g. "fa-flask"
  priority?: boolean   // exactly 1 per response
}
```

Emitted as `event: card` SSE events per spec §6.

**Reasoning:** matches enter-v3.md §4 anatomy fields (icon/title/desc/href). `slug` for stable reference. `type` for visual styling (per §4 5-types table). `priority` modifier per §4 limits.

**Implication:** client SSE parser must dispatch on `event: card` and accept this schema.

### D5 — Per-IP header: `x-nf-client-connection-ip`

**Decision:** rate-limit identity uses Netlify's `x-nf-client-connection-ip` request header. Confirmed at Phase D impl time.

**Reasoning:** documented in Netlify Functions docs as the trustworthy client IP source. Other headers (X-Forwarded-For) can be spoofed.

**Implication:** trivial; not a real decision blocker.

---

## 2. Scenario reframe — derived from synthesis, not iterating on draft

Original enter-v3.md §3 listed 11 draft scenarios with explicit caveat: "before ship, run an exhaustive session: walk Agam's full profile, identity, values, and build range, then expand to 20-30 scenarios with nuanced trigger patterns." That session is now happening, post-synthesis.

**Coverage matrix — 11 dimensions × sub-scenarios:**

| Dim | Scenario | Trigger pattern | Synthesis source |
|---|---|---|---|
| Theme | T01 agent-first arc | "what's his thesis", "agent-first", "kill prompting" | wiki-page-drafts-final/agent-first.md |
| Theme | T02 voice-AI craft | "voice ai", "shararat", "AIonOS voice" | voice-ai-craft.md (note Decision 2: under-share) |
| Theme | T03 breadth-as-differentiation | "is he T-shaped", "depth or breadth", "AI generalist" | breadth-as-differentiation.md |
| Theme | T04 pm-taste | "PM philosophy", "taste", "anti-slop" | pm-taste.md |
| Theme | T05 ai-pm-skillset | "AI PM skills", "what makes a good AI PM" | ai-pm-skillset.md |
| Theme | T06 enterprise-ai-reality | "enterprise AI", "POCs vs production", "10 to 2" | enterprise-ai-reality.md |
| Theme | T07 second-brain | "what is second-brain", "Karpathy method" | second-brain.md |
| Theme | T08 spec-first-taste | "spec first", "spec-first-taste", "should-we vs can-we" | spec-first-taste.md |
| Theme | T09 career-reflection | "his career", "career advice", "IC vs management" | career-reflection.md |
| Theme | T10 linkedin-as-instrument | "why does he post", "linkedin strategy", "writing in public" | linkedin-as-instrument.md |
| Theme | T11 personal-projects-tinkering | "side projects", "github", "what's he tinkering on" | personal-projects-tinkering.md |
| Theme | T12 root substance-over-hype | "anti-hype", "is X overhyped", "what does he think of [hype topic]" | root.substance-over-hype.md |
| Cross | C01 hiring (recruiter probe) | "is he available", "hire", "open to opportunities" | resume + book-call mapping |
| Cross | C02 capability AI (peer) | "is he good at AI", "AI experience", "AI builds" | T05 + T11 + projects-tech-lineage |
| Cross | C03 background / who-is-he | "who is he", "tell me about agam", "background" | agam-profile-v1 + resume |
| Cross | C04 specific role at X | "at FarEye", "AIonOS AVP", "UKG" | resume anchors + projects |
| Cross | C05 Top Voice credentials | "credentials", "awards", "recognition" | collab-articles-deep-dive (top 1-2% AI + PM) |
| Cross | C06 evolution / philosophy | "how has his thinking evolved", "what changed his mind" | tensions.md evolution arcs |
| Meta | M01 what is this site | "what is this", "did he build this site", "is this AI-generated" | second-brain.md + spec |
| Meta | M02 the agent itself | "are you Agam", "are you AI", "what are you" | enter-v3.md §1 persona (P2 Operator deflect) |
| Special | X01 deflect (off-topic / personal / political) | family, politics, religion, hostile | enter-v3.md §1 deflection lines |
| Special | X02 empty / first load | initial state, no message yet | enter-v3.md §6 |
| Special | X03 agent crawler (UA gate) | UA contains GPTBot / ClaudeBot / etc. | spec §7 Tier 0 UA gate |

**Total: 23 scenarios.** Higher than my earlier 17 estimate because synthesis surfaced specific scenarios that didn't exist in the draft (Top Voice credentials, kill-prompting arc as standalone, evolution arcs as cross-cutting, the agent-itself meta question).

**Quality bar applied during drafting:**
- Distinct trigger pattern (no overlap)
- Answer ≤70 words per persona spec
- 2-4 cards with exactly 1 priority
- Voice register matched to question type
- Corpus evidence cited with date when relevant
- No banned LLM-isms in answer prose

If during drafting I find redundancy, I'll cut to 20-21. If a critical gap, I'll add. Final count is "however many distinct query classes exist," not a target.

---

## 3. Drift-catch checklist (run before every commit)

Before each commit in this execution sequence, self-critique:

1. **Did I re-read the authoritative input(s) for this task?** (spec / enter-v3 / system arch / taste-pass-decisions / interim-taste-calls)
2. **Does my output align with all 5 interim-taste-calls?** (drop interior-design / voice-AI under-share / collab articles primary / em-dash banned / silences not dramatized)
3. **Does my output align with all 21 taste-pass decisions?** (key checks: stance evolved not reversed for kill-prompting; AIonOS stripped from wiki; help-market-flourish has 2026 evidence; never-be-smartest demoted; root has tier:root in ontology only, not body label; etc.)
4. **Did I introduce any new architecture not in spec?** If yes, justify or remove.
5. **Did I underdraft a spec-locked component?** (persona P2 Operator, trace verbs, card taxonomy, sitemap DAG, abuse defense tiers, SSE event protocol)
6. **Voice rules:** zero em-dashes in generated prose? zero banned LLM-isms? (deeply, robust, leverage, navigate, delve, "It's not just X, it's Y", generic openers, triadic prose lists, conclusion-recap paragraphs)
7. **Did I update STATUS.md?**
8. **Did I commit + push?**

If any "no" → fix before committing. If any drift → write to `GAPS-vs-SPEC-AND-SYSTEM-ARCH.md` so it doesn't recur.

### 3.1 gstack review gate (Phase B binding, added 2026-04-26)

**Every coding milestone in Phase B (any task that ships HTML, JS, or CSS) MUST pass three gstack reviews before being marked complete:**

1. **`/review`** — engineering review (correctness, architecture, security, edge cases).
2. **`/design-review`** — visual / UX consistency vs site contract (v2 page contract, design tokens, header + aa.mark, typography).
3. **`/qa`** — quality assurance pass (broken links, missing assets, console errors, mobile / a11y regressions).

Sequence per milestone:
1. Write the code, commit + push (so the reviewers see the actual state).
2. Run the three gstack skills against the diff or the new files.
3. Capture findings inline; resolve HIGH / MEDIUM issues before moving to the next milestone. LOW issues are tracked in TODO.md or as follow-ups.
4. Mark the milestone complete only after fixes are committed.

**Scope:** all Phase B tasks (B1-B6) and any Phase C / Phase D coding work. Not required for pure markdown / docs commits.

---

## 4. CoT + ReAct protocol (mandatory for every task)

Each task in the sequence begins with these passes BEFORE any output:

### Pass 1 — Authoritative input read
Thought: "What does the spec / enter-v3 / system arch / taste-pass say about THIS task?"
Action: re-read the relevant section(s).
Observation: list the binding constraints in 3-5 bullet points.

### Pass 2 — Synthesis input harvest
Thought: "Which Phase A synthesis files feed this task?"
Action: open the relevant synthesis file(s).
Observation: extract the directly-usable content (lines, slugs, edges).

### Pass 3 — Output structure
Thought: "What's the output shape? File path? Format? Required sections?"
Action: sketch the output skeleton.
Observation: confirm against spec.

### Pass 4 — Drafting
Thought: "What's the body content?"
Action: draft section by section.
Observation: check voice rules + LLM-ism filter at each section break.

### Pass 5 — Self-critique (drift-catch checklist §3 above)
Thought: run all 8 checks.
Action: fix anything that fails.
Observation: commit-ready.

### Pass 6 — Commit + push + STATUS update
Thought: "What's the 1-line summary of what just landed?"
Action: stage, commit, push, update STATUS.md.
Observation: confirm push succeeded.

---

## 5. Task sequence — locked for execution

Each task gets its own milestone commit. Frequent, not batched.

### Task A — Refresh STATUS to CHECKPOINT 18 + add execution-plan reference

**Goal:** make this execution plan discoverable from STATUS.md.

**Steps:**
1. Edit STATUS.md to reference EXECUTION-PLAN-v1.md, INTEGRATION-PLAN.md, GAPS-vs-SPEC-AND-SYSTEM-ARCH.md.
2. Add CHECKPOINT 18 entry summarizing what's about to happen.
3. Commit.

**Estimate:** 10 min.

### Task B — Lock ontology v1 (Task #8 from spec)

**Goal:** apply 21 taste-pass decisions to `ontology-v1-draft.md` → `ontology-v1.md` (final, locked).

**Apply per `_taste-pass-decisions.md`:**
- Belief renames: `llm-as-voice-extension` → `llm-as-primary-daily-tool`; `non-functional-reqs-are-55pct-of-failure` → `non-functional-reqs-are-dominant-failure-mode`
- Belief tier moves: `never-be-smartest-in-room` demote from co-root to standard belief under career-reflection; `two-roles-ahead-framing` elevate from peripheral to named belief tier
- Evidence additions: 2026-04 evidence for `help-market-flourish` (this repo open-source); AI-era IC reframe added to `ic-path-legitimacy`
- Slug additions: `agamarora.com voice-AI case study` as Project node; evidence edge to voice-ai-craft
- Project reclassifications: V2 Games → career-stage entity (not tinkering); top-tier projects = Shararat / second-brain / luna-monitor / ai-resume / agamarora.com
- Tier markers: `root.substance-over-hype` gets `tier: root` field; all other 11 themes are `tier: theme`
- Strip AIonOS from all wiki-rendered nodes / edges
- Drop `humanness-as-depth Mo Gawdat attribution` framing; restore Agam-synthesis framing
- Demote `silence-precedes-crystallization` (already done in R5)

**Output:** `synthesis/ontology-v1.md` (locked).

**Estimate:** 30-45 min.

### Task C — Final wiki polish (apply 21 decisions to 13 drafts)

**Goal:** apply taste-pass decisions inline to each `wiki-page-drafts-final/*.md`.

**Per page changes from taste-pass:**
- agent-first: kill-prompting framed as evolution (skill layer migrated, stance held); not "named waypoint" reversal
- pm-taste: explicit "strong opinion about no strong opinions" meta-belief callout
- linkedin-as-instrument: tinker-publicly merged as loop-closure framing
- ai-pm-skillset: 2023 line "ChatGPT for everything except PM" still holds in 2026; AI replaces grunt, not taste
- ai-pm-skillset: rename llm-as-voice-extension to llm-as-primary-daily-tool, restate factually
- second-brain: hobbyist-primary, hint-of-universal scope (B3)
- breadth-as-differentiation: humanness-as-depth = Agam's synthesis (April 2024 EQ predates Mo Gawdat)
- pm-taste / spec-first-taste: anti-customization scoped to enterprise
- enterprise-ai-reality: drop 10-to-2 number; keep "roughly 80%" frame
- enterprise-ai-reality + pm-taste: drop 55% Standish stat; keep "NFRs dominant failure mode"
- career-reflection: drop family-rebellion frame; AI-era IC reframe added
- career-reflection: V2 Games here (career-stage); two-roles-ahead promoted
- personal-projects-tinkering: V2 Games removed; foreground 5 top-tier projects; learning-tinkering tier mentioned
- voice-ai-craft: agamarora.com case study evidence; primary tension = linkedin-as-instrument
- voice-ai-craft: AIonOS stripped, generic "enterprise voice AI platform"
- root.substance-over-hype: sole root, no body label (hybrid implementation), never-smartest demoted
- All pages: AIonOS stripped throughout; em-dashes removed; banned LLM-isms removed

**Output:** updated `wiki-page-drafts-final/*.md` (13 files). Existing audit fixes preserved.

**Estimate:** 90-120 min via subagent-driven pass.

### Task D — Draft 23 scenarios with full trace + answer + cards spec

**Goal:** produce `docs/plans/enter-v3-scenarios-v2.md` — 23 scenarios per coverage matrix in §2 above.

**Per scenario:**
- ID (T01 / C01 / M01 / X01 etc.)
- Trigger patterns (3-5 phrasings)
- Trace lines (2-5 from locked verb vocab)
- Answer (≤70 words, register selected per question shape)
- Cards (2-4 with exactly 1 priority, slugs from sitemap DAG + wiki routes)
- Voice register used (1/2/3/4 from voice-spec)
- Eval pin: classifier expected type + themes_likely + cards expected + voice markers

**Estimate:** 90-120 min.

### Task E — Draft `site.json`

**Goal:** the sitemap DAG + externals + actions + sub-agents per spec §2 + enter-v3 §2.

**Includes:**
- All existing routes (/, /lab, /lab/<project>, /resume, /enter, /moodboard)
- 12 new wiki theme routes (/wiki/<slug>)
- 1 root wiki route (/wiki/root.substance-over-hype)
- 1 wiki home (/wiki)
- 1 voice page (/wiki/voice)
- 1 quotes page (/wiki/quotes)
- 1 thesis route (/writing/second-brain-live)
- Externals (github, linkedin, youtube, shararat-live)
- Actions (resume-pdf, email, book-call)
- Sub-agents (agent-lab placeholder)

**Output:** `site.json` at repo root.

**Estimate:** 30 min.

### Task F — Draft `kg-themes-summary.mjs` (mock data, real values from ontology-v1.md)

**Goal:** the in-function bundled kg index for `/enter v3` retriever.

**Output:** `netlify/functions/lib/kg-themes-summary.mjs` exporting `KG_THEMES_SUMMARY` array (12 themes + 1 root, slug + title + wiki_url + 1-line + node_count + edge_count).

**Estimate:** 15-30 min.

### Task G — Update STATUS to CHECKPOINT 19 (Phase A complete)

**Goal:** mark Phase A as DONE; document Phase B/C/D entry conditions.

**Output:** STATUS.md updated. CHECKPOINT 19 = "Phase A done; ready for Phase B (wiki HTML build) per spec §9."

**Estimate:** 10 min.

### Task H — Belief sub-pages polish (NEW, post-brainstorm 2026-04-26)

**Why added:** v1 wiki was 12 themes + root only — too thin given 35 belief deep-dives sitting in synthesis. User flagged "feels like missed opportunity of the massive analysis." Adding belief sub-pages turns the wiki into a navigable knowledge graph: theme page → belief page → cross-belief navigation via supports/contradicts/supersedes edges. People + project sub-pages explicitly DROPPED from v1 per user call.

**Goal:** produce 19 polished belief page markdown drafts at `synthesis/belief-page-drafts-final/<slug>.md`, ready for Phase B HTML scaffolding.

**Source:** existing `synthesis/belief-deep-dives/*.md` (35 files, 25-50KB each). Light edit pass — NOT rewriting from scratch.

**Per belief page:**
- Frontmatter: `type: BeliefPage`, `slug`, `parent_theme`, `related_beliefs[]` (from ontology supports/contradicts/supersedes edges), `tier: 1`, `length_target: 400-800w`
- Sections (per spec §5 page structure, lighter than theme pages):
  - **Statement** — 1-paragraph distillation (the belief itself)
  - **Origin** — earliest evidence, dated post(s)
  - **Refinement arc** — how the belief evolved (if relevant; uses supersedes/refines edges)
  - **Cross-links** — to related beliefs + parent theme
  - **Evidence** — 3-7 dated post citations
- Apply same voice rules: no em-dashes, banned LLM-isms removed, taste-pass decisions baked in (renames, scope notes, etc.).

**Scope:** 19 Tier-1 beliefs from ontology-v1.md. Tier-2/Tier-3 beliefs stay as graph nodes only (no wiki pages).

**Sub-task:** subagent fan-out, batches of 3-4 per Agent message. ~6 batches. Estimate 3-4 hr autonomous CC work.

**Output destination:** `docs/plans/second-brain-v1-phase-a/synthesis/belief-page-drafts-final/<slug>.md` (19 files).

**Estimate:** 3-4 hours.

### Task I — Wiki graph visualization page spec (NEW, post-brainstorm 2026-04-26)

**Why added:** kg.json is a public static asset with 250+ nodes / 180+ edges. Without a viz, density is invisible to a wandering visitor. Adding `/wiki/graph/` makes density navigable.

**Goal:** design + spec the /wiki/graph/ page. Self-contained HTML per site convention. Reads `/wiki/kg.json` client-side, renders force-directed graph, click-to-navigate to wiki pages.

**Output:** `docs/designs/wiki-graph-spec.md` covering:
- Layout (canvas + sidebar filters + selected-node detail panel)
- Library choice — d3-force vs cytoscape.js vs vis-network. Pick lightest fit-for-purpose, vendor as inline `<script>` per site convention (no npm deps).
- Filters: by theme, by tier (root/theme/tier1/tier2/tier3), by node type (belief/project/person/tech), by relationship (supports/contradicts/supersedes/builds_on/etc.)
- Interactions: hover = highlight node + 1-hop neighbors; click = navigate to wiki page (theme/belief) OR open detail panel (project/person/tech without page); double-click = focus node + zoom.
- Performance budget: render 250 nodes + 180 edges smooth; lazy-load heavy details.
- Mobile: simplified — list view by theme, expand to subtree, no force layout (force layout sucks on small screens).
- Color encoding: theme = color hue (12 distinct), tier = saturation, edge type = stroke style.
- Empty-state hint: "Click any node to enter that part of his thinking. Drag to explore. Filter by theme to focus."
- Accessibility: keyboard navigation through nodes; screen-reader-friendly fallback list view; ARIA labels.

**Implementation deferred:** spec only at this task; Phase B/C builds the HTML page.

**Estimate:** 1-2 hours design pass.

---

## 6. After Tasks A-I — Phase B/C/D entry

Phase A done = synthesis final + integrated + locked + dense surface scoped. Phase B starts: hand-author wiki HTML pages from polished markdown drafts.

**Phase B page count (revised post-brainstorm):**
- Theme HTML: 12 + 1 root = 13 pages
- Belief HTML: 19 pages
- Voice page: 1
- Quote page: 1
- Projects DAG page: 1 (per spec §4)
- Graph viz page: 1 (NEW)
- Wiki home: 1
- **Total: ~37 pages** (vs. ~15 in original spec)

This is denser but still scoped. People + project deep-dive pages explicitly NOT in v1.

Phase A done = the synthesis is final + integrated + locked. Phase B starts: hand-author 12 wiki HTML pages from polished markdown drafts using scaffold + hand-finish (D2). Phase B/C/D timeline per spec §9.

**Decisions deferred to Phase D:**
- None. All 5 architectural decisions are locked in §1.

**Decisions deferred to Agam at any point:**
- Override D1-D5 if any read wrong.
- Approve scenario draft before Phase D eval harness wires to it.
- Hand-finish or review wiki HTML scaffold output during Phase B.

---

## 7. Drift-catch trigger conditions (if any of these happen, STOP and update GAPS doc)

- I find myself reasoning about retrieval mechanics → check if I'm drifting from classifier-driven retrieval (D1) toward embeddings.
- I find myself proposing new card types → check enter-v3 §4 (5 types locked).
- I find myself proposing new trace verbs → check enter-v3 §5 (10 verbs locked).
- I find myself loosening abuse defense → spec §7 says cost cap is THE defense.
- I find myself dropping "it has to be Agam's voice" → voice-spec is the runtime authority.
- I find myself ignoring a taste-pass decision → re-read `_taste-pass-decisions.md`.

If any trigger fires: stop, log to GAPS doc, re-anchor to spec, then proceed.

---

*Locked for execution 2026-04-26. Start Task A immediately. Commit after each milestone. Update STATUS after each task. CoT+ReAct passes mandatory.*
