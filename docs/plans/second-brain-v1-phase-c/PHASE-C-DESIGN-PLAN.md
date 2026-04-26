---
type: PhaseDesignPlan
status: drafted-2026-04-26
purpose: Stop hacking line-by-line. Plan the full Phase C UX + content reshape with self-eval gates before code. Frequent commits + reviews binding.
authoritative_inputs:
  - docs/plans/second-brain-v1.md (canonical spec)
  - docs/plans/second-brain-v1-phase-a/synthesis/voice-spec.md (voice rules)
  - docs/plans/second-brain-v1-phase-a/synthesis/ontology-v1.md (graph source)
  - docs/designs/wiki-graph-spec.md (graph viz contract from Phase A)
  - User feedback this session (the design escalation message)
---

# Phase C - Design + UX reshape (plan, not patches)

## Why this doc exists

Two-and-a-half hours into Phase C cutover, three real problems have surfaced from user review. Each is bigger than a render-time strip:

1. **The wiki pages were authored as agent-retrieval source, not as human-readable content.** Light-strip helps, but the underlying prose voice is still third-person analytical ("Agam saw an ecosystem", "the manifesto crystallized"). Voice page reads like Agam talking; theme pages read like a profile of Agam. Same site, two registers.
2. **The graph viz is technically correct but UX-broken.** vis-network with a default force layout drops a user into a dense node soup with no orientation. Scroll-traps on touchpads (the canvas captures wheel events). No "you are here" entry point. No narrative path through the graph. Expects manual exploration; humans need a guided experience.
3. **No clear page purpose at the front door.** A reader landing on `/wiki/agent-first/` sees Core belief / How it formed / What it implies / Evidence with no one-line answer to "what is this page for? why am I here?". The page assumes the reader has full Phase-A context.

Plus a layer of mechanical issues that the inline `/review` + `/design-review` already named: count mismatches between metadata + body, draft-trace artifacts (Cluster 6, taste-pass F1, R3a), truncated URNs in one source draft, breadcrumb dead-link, blockquote rendering. Those are line-edits and stay tracked - this doc is for the structural calls.

## Self-eval before action

Before any new code, name what we're optimizing for:

- **Primary reader 1: human visitor (recruiter, peer, curious lurker).** Time on page: 30-90 seconds. Question: "Who is this person and what does he think?" Won't expand collapsed sections. Will scan h1 + first paragraph + first link.
- **Primary reader 2: AI agent traversing the site.** Comes via `/llms.txt` or directly hits `/wiki/kg.json`. Question: "Give me the structured belief graph + ground-truth evidence." Reads everything. Wants taxonomy.
- **Tertiary reader: Agam himself + future taste-pass readers.** Wants the analytical scaffolding visible. The drafts in `synthesis/` already serve this.

The fix is NOT to write three different surfaces. The fix is: **the wiki HTML is for Reader 1. kg.json + the markdown drafts in synthesis/ are for Reader 2. The drafts stay where they are; the HTML reshapes around the human.**

This is the one-line decision the build pipeline now needs to enforce.

## Problem inventory (precise)

### P1 - Voice register on theme + belief pages

The drafts use third-person analytical prose because they were written by CC subagents during Phase A R6/R8/R9. Light-strip preserves the analytical body and only drops the appendices. Result: pages still read as research output, not as the author's voice.

**Two ways to fix:**

- **Option P1a - Reauthor in R1 voice.** Rewrite each theme + belief in Agam's actual voice (declarative thesis, colon rhythm, hyphen-with-spaces aside, short paragraphs, no hedging). Effort: 12 themes + 19 beliefs x 15-20 min = ~10-12 hours. Highest fidelity.
- **Option P1b - Add a voice-driven landing block above each analytical body.** Each page opens with a 60-100 word "in his voice" intro: thesis sentence, one supporting line, a link to the deep dive below. The analytical body stays as the deep dive (collapsed by default, expand to read). Effort: 31 pages x 5 min = ~3 hours. Hybrid.
- **Option P1c - Replace the analytical sections with a one-paragraph distillation, link out to /wiki/<slug>/source/ for the deep dive.** Effort: build the source/ subfolder + 31 short distillations = ~5 hours. Cleanest read.

Recommendation: **P1b**. Lowest effort to ship a human-readable surface without losing the analytical content. The deep dive stays available for the agent + curious readers.

### P2 - Graph viz UX

Current state: `vis-network` from CDN, force layout, all 190 nodes visible at once, mouse-only interactions, scroll-jacks the page. Loads in ~2-3 seconds, then drops the user into a moving cloud with no orientation.

**Real UX requirements:**
- The user does NOT manually explore. The user lands, sees the structure, recognizes a few labels, optionally clicks one to learn more.
- The graph must be SCROLL-FRIENDLY: the canvas should not capture page scroll. Pan happens on click-drag, zoom on pinch or modifier-key + wheel, NOT on bare scroll.
- The graph must be ALWAYS-CENTERED: at any zoom level, double-click on background re-fits the view. Zoom-out limit prevents the cloud from drifting off-screen.
- The graph needs a NARRATIVE entry: a static "tour" path that lights up themes -> beliefs -> projects in sequence on first load, then settles into the interactive state.
- Default state should be the 12 theme nodes prominent, beliefs collapsed-into-clusters, posts hidden. User toggles in posts/beliefs/projects.
- Mobile: the force layout sucks on small screens. Mobile gets a list view by theme instead of the force graph. Force graph desktop only.

**Three approaches:**
- **Option P2a - Tighter vis-network config.** Lock zoom range, disable wheel-on-canvas-scrolls-page, add re-center button, cluster T2/T3 beliefs by parent theme by default, hide posts behind a chip. Effort: ~2 hours.
- **Option P2b - Custom d3-force or canvas-based viz.** Full control. Higher effort, higher fidelity. ~8-10 hours.
- **Option P2c - Drop the force graph, render a curated "constellation" SVG with 12 themes laid out in a deliberate ring + click-to-expand belief clusters.** Hand-designed, not auto-laid. Strongest art direction. ~6-8 hours.

Recommendation: **P2a first** as a v1 ship-fix; **P2c** as the v2 polish target. The force layout is fundamentally not a great human surface for this size graph; the constellation is.

### P3 - Page purpose / linkage / starting point

A user landing on `/wiki/agent-first/` has no one-line answer to "what is this for?". The h1 is the title. The first paragraph dives into Core Belief without orientation.

**The fix is structural, not copy:**
- Every wiki page needs a one-line "what is this" hook directly under the h1, BEFORE the first h2.
- Every page needs a "why you might be here" navigation hint: 3-4 contextual links (related themes, parent root, related beliefs, deep-dive link).
- Cross-link density needs to come UP. Currently themes link to other themes via Tension section (now stripped) and to beliefs via Evidence (now collapsed). After strip, themes have almost no internal links. That's a regression.
- Belief breadcrumb "beliefs" links to /wiki/ - that's wrong. Either build /wiki/beliefs/ landing or make breadcrumb non-clickable.

**Approach:**
- Add a `## What is this` block at the top of each theme + belief page (1 sentence), rendered automatically from a frontmatter field (already exists: `one_line` for themes, `belief` statement for beliefs).
- Add a fixed "Related" sidebar OR inline footer with 4-6 cross-links per page.
- Build /wiki/beliefs/index.html as a flat list of all 19 beliefs grouped by parent theme.

### P4 - Mechanical fixes (no plan needed, just queue)

From inline /review + /design-review:
- wiki/index.html: Twelve→Eleven (3 places), 20→18 projects, 111→167 edges, 177→190 nodes
- Belief breadcrumb "beliefs" link broken (P3 fix overlaps)
- Evidence count off-by-one (counts thead tr)
- Truncated URNs in `ai-pm-skillset.md` source draft (3 pairs)
- "leverage" appears in llms.txt + llms-full.txt new sections (banned LLM-ism)
- 404.html visual center off due to fixed header
- Blockquotes in /wiki/quotes/ rendering as `<p>&gt; **text**</p>` instead of semantic `<blockquote>`
- /wiki/graph/ + 404.html missing `<link rel="manifest">`
- vis-network has no SRI hash on the CDN script
- kg-parse.mjs is dead/duplicate code until B7 wires it back
- Cosmetic: graph viz Post nodes accumulate dense edges when same URN cited from theme + belief (~15 such pairs)

These are all 5-10 min fixes individually. Batch them as a single "C-mechanical" commit.

### P5 - Local dev server experience

`npx serve` returns directory listings for `/wiki/<slug>/` instead of auto-serving `index.html`. This is what made the user think the root was broken. Netlify works correctly in prod.

Fix: ship a `serve.json` config OR document `python -m http.server 8888` as the local dev path OR add `index.html` files explicitly (already done). Or fix Netlify dev's edge-function crash so we can use the production-equivalent path locally.

## Sequenced execution plan (proposal)

If approved, executed in this order with self-eval + commit + push between each step:

| Step | Scope | Effort | Self-eval gate |
|---|---|---|---|
| **C-mech** | Apply all P4 mechanical fixes in one batch + commit. | 30-45 min | All counts match, all links resolve, evidence count correct. |
| **C-1** | Implement P3 structural: one-line hook under h1, related-links footer, build /wiki/beliefs/ landing. | 1-2 hr | Every page has hook + related links. Belief breadcrumb resolves. |
| **C-2** | Apply P1b voice intro to all 12 themes (60-100w each, hand-authored from voice-spec, in Agam's R1 register). | 3-4 hr (subagent fan-out per theme) | /design-review confirms voice fidelity B+ or higher. |
| **C-3** | Apply P1b voice intro to all 19 beliefs. | 3-4 hr (same fan-out pattern) | Voice fidelity gate. |
| **C-4** | Implement P2a graph viz UX fixes: scroll-friendly, always-centered, default-theme-only view, mobile fallback to list view. | 2-3 hr | Manual UX test on desktop + mobile viewport. |
| **C-5** | Run `/design-review` + `/review` on full wiki tree. Fix HIGH/MEDIUM. | 1 hr | All gates pass. |
| **C-6** | STATUS update + final commit. Phase C complete. | 30 min | STATUS reflects ship-state + clean handoff. |

**Total: ~12-16 hours of focused work.** Significantly more than the patches I've been shipping. This is what the user is asking for.

## Frequent-commit + self-eval discipline (binding)

Per user feedback this session:
- Commit after every step, not at the end. WIP-prefix optional.
- Push after every commit so cross-machine continuity holds.
- Self-eval before each step start: "is this still the right step? did the previous step change the assumption?"
- Self-eval before each commit: "does this match the plan? am I drifting?"
- Run `/review` + `/design-review` after every 2-3 steps, not just at the end.
- If the plan needs revision (new info, changed direction), edit THIS doc first, get user sign-off, then code.

## Decisions locked 2026-04-26

User taste calls received:

- **D1 - Voice approach: P1a Full reauthor in R1 voice + narrative restructure (folded together, one pass).** Each draft rewritten from scratch in Agam's actual voice (declarative thesis, colon rhythm, hyphen-with-spaces aside, short paragraphs, no hedging). Drop analytical scaffolding entirely. AND each rewritten page must work for a cold reader (lone human OR lone agent landing with no whole-corpus context). See §D1-narrative-binding below for the cold-reader contract. Re-use synthesis evidence to ground claims, don't show the work. Highest fidelity. Effort: ~10-12hr via subagent fan-out across multiple sessions.
- **D2 - Graph viz target: P2c hand-designed constellation.** Drop the vis-network force layout entirely. Build a curated SVG constellation: 12 themes in a deliberate ring, click-to-expand belief clusters per theme, posts as small dots near parent. See §D2-graph-UX-binding below for the binding UX invariants (scroll isolation, always-centered, narrative entry, anti-drift floor, mobile fallback). ~6-8hr.
- **D3 - Sequencing: mechanical → structural → voice → graph (plan default).** Multiple checkpoints per step. Multi-session persistence via STATUS.md. Frequent commits. Graph stays last per user taste-call 2026-04-26: voice work compounds quality on already-readable pages, but graph UX is a usability gate that bypasses voice value if visitors bounce. Despite that ordering logic, sequence stays mechanical → structural → voice → graph because voice batches will surface narrative patterns that the graph "tour" path needs to encode (graph entry tour cites pages by their cold-reader open lines).
- **D4 - Frequent checkin cadence (binding 2026-04-26).** Every 2-4 page rewrites: stop, show user 1 sample page, take taste-call, apply learnings to remaining batches before continuing. /design-review after every C-step (not deferred to C-final). Self-eval lives in commit message: what optimized for, what tradeoffs.
- **D5 - Belief page shape: Q&A card + auto-rendered chip strip (locked 2026-04-26 mid-CP-3 taste-call).** After CP-1 (hand-author belief.agent-first) and CP-2 (sonnet subagent belief.context-over-prompt) shipped, user surfaced fundamental question: belief pages are not for human-direct landing; they are for /enter v3 agent retrieval, /llms.txt-fed external AI assistants (Claude/ChatGPT/Cursor), and AEO/SEO answer-machines (Perplexity, Google AI Overviews, ChatGPT search). Reframe accordingly. See §D5-belief-shape-binding below for the full shape contract. **SUPERSEDED by D6/D6.1 within the same session.**
- **D6 - Belief page as operational building block (drafted 2026-04-26 mid-CP-3 taste-call after D5).** User feedback after D5 sample landed: "What does Agam think" framing was wrong. Beliefs are not biographical claims about a person; they are operational primitives that influence agent reasoning. Drop the question framing. Drop dated-post prose ("March 2023 post...", "June 20 manifesto") from body - move post references to evidence drawer only. Add operational sections: "How to apply" (decision rules) + "What this is not" (boundaries / failure modes). See §D5-belief-shape-binding below (now reads as D6 shape after this update; section name retained for git history continuity). **SUPERSEDED by D6.1 within the same session.**
- **D6.1 - D6 plus more agent-grabbable bits + format polish (LOCKED 2026-04-26 post-/design-review).** Final shape. After D6 sample landed, user asked for more bits agents can extract structurally + better formatting consistency. Three additions: (a) `quotable:` frontmatter field rendered as a TL;DR gold-gradient block above body - single sentence agent drops verbatim into responses; (b) `applies_to:` domain tags rendered as a second strip under chip strip - agent matches user-query topic to tags for retrieval; (c) `confidence: settled|evolving|contested` marker rendered as a colored dot. New body section: `## Argues against` lists concrete positions the belief rejects. /design-review caught three mobile issues (chip strip wrap, tag strip confidence margin-left:auto break, page-purpose + TL;DR redundancy) - all fixed in commit 17806ab. See §D6.1-belief-shape-binding below for the full locked contract. Effective immediately: CP-1 retrofitted to D6.1 (commit 33c9cd3 + 7d310ce + 17806ab); CP-2 retrofit + CP-3..CP-19 fan-out commence under D6.1 template.

### §D1-narrative-binding — cold-reader contract for every reauthored page

Every theme + belief page must serve a reader who lands with NO prior context — no familiarity with the wiki, the corpus, or Agam's positioning. Same page also must serve an autonomous agent that lands via /llms.txt or /wiki/kg.json without traversing peers.

Binding requirements per page:

1. **Orientation block (open).** First 2-3 sentences orient: "This is X. You are reading it because Y. It sits between Z and W in the bigger frame." Cold reader knows what they're holding within 10 seconds. Agent extracts purpose without inferring from h2 structure. The one_line frontmatter hook (added in C-struct) is a tagline, not a substitute for this block.
2. **Self-introducing h2s.** Every section's first sentence introduces the section without assuming the prior section was read. A reader landing via direct deep-link to `#how-it-formed` should know what "it" is from sentence one.
3. **Explicit exit paths (close).** Every page closes with 3 named navigation paths: "If you came here for [X], read [page]. If you want [evidence], jump to [section]. If you want [related theme], go to [link]." Not just a Related sidebar (already shipped in C-struct). A prose-level handoff that names the reader's likely intent and routes them.
4. **Standalone essence.** Each page must say what it's about without depending on the parent or sibling pages. The wiki is a graph, not a book — readers do not arrive in NAV_ORDER sequence. Every node is an entry point.
5. **Both surfaces.** Human reads the prose; agent reads the prose AND extracts structure. So the prose must be both a narrative for humans and a parseable claim sequence for an agent. Bullet-heavy or table-heavy pages fail the human read; prose-only pages can fail the agent read. Mix is intentional.

Voice register (R1, declarative thesis + colon rhythm + hyphen asides + short paragraphs + no hedging) is the voice. The cold-reader contract is the structure. Subagents apply both per page.

**Reference-page-first protocol:** Before any subagent fan-out, hand-author 2 reference pages from scratch (1 theme = agent-first, 1 belief = agent-first / belief variant). These are binding contracts the subagents pattern-match against. Reference pages also become the subagent prompt examples.

**Per-batch taste-call:** After each subagent batch (4 pages), stop. Show 1 batch sample. Take taste-call. Apply learnings to next batch.

### §D2-graph-UX-binding — invariants for C-graph (P2c constellation)

The graph viz is a user-experience problem first, technology second. The current /wiki/graph/ vis-network layout fails on UX (scroll-jacking, easy drift-out, no orientation, no narrative path). C-graph replaces it with a hand-designed SVG constellation. Binding invariants — these are not features, they are pass/fail gates:

1. **Scroll isolation.** Wheel scroll on the graph canvas = page scroll, never zoom. Zoom = pinch on touch, OR modifier-key + wheel (cmd/ctrl) on desktop. The user must never lose the page-scroll affordance by accidentally hovering the graph.
2. **Always-centered.** At any zoom level, double-click on background re-fits view to "all 12 themes visible". Single recovery action. No buried "reset view" button.
3. **Anti-drift floor.** Zoom-out has a floor that clamps at "all 12 themes visible". Cannot zoom out further. Pan also has bounds: cannot drag the constellation off-screen. The graph cannot become irrecoverable.
4. **Default state = oriented, not raw.** Page first-paint shows 12 themes prominent + collapsed belief clusters per theme + posts hidden. Not the full 188-node soup. User toggles in beliefs / projects / posts as chips.
5. **Narrative entry tour.** First load runs a 1.5-2s scripted tour: a path lights up in sequence (e.g. root → agent-first → context-over-prompt → second-brain → /lab project), then settles into the interactive default state. Cold visitor lands oriented, not lost. Tour can be skipped by any input.
6. **Click-through to wiki.** Every theme + belief node click navigates to its `/wiki/<slug>/` or `/wiki/beliefs/<slug>/` page. The graph is a navigator, not a destination.
7. **Mobile fallback.** Below 768px, no force/SVG. Render a flat list grouped by theme (similar to /wiki/beliefs/ landing). Force layouts are unusable on small screens with this node count.
8. **Keyboard accessible.** Tab cycles theme nodes in NAV_ORDER. Enter on a focused node opens its wiki page. Esc returns to wiki home. Without this the page is a screen-reader dead zone.
9. **No external CDN runtime dep.** Drop unpkg/vis-network. Constellation is hand-rolled SVG + ~200 lines of inline JS. No SRI hash needed. No CSP allowance for unpkg.
10. **Re-fit-on-resize.** Window resize triggers re-fit, not stale viewBox.

These invariants are gates. Any C-graph implementation that fails one is not done. /design-review run on C-graph must verify all ten with a manual UX test on desktop (incl. touchpad) + mobile viewport + screen-reader-emulator.

### §D5-belief-shape-binding — Q&A card + chip strip contract for every belief page

Belief pages are not primarily for human direct-landing. The actual readers ranked by traffic share:

1. /enter v3 agent (Phase D) doing retrieval-augmented grounding when a user asks about Agam
2. External AI assistants (Claude, ChatGPT, Cursor, Perplexity) reading via /llms.txt + /llms-full.txt
3. AEO/SEO answer-machines (Google AI Overviews, Perplexity, ChatGPT search) indexing for "what does Agam think about X" queries
4. Human deep-link from theme page or graph node — secondary, not primary

User confirmed 2026-04-26: human direct-land is rare; the routing is via agent or AEO. Therefore optimize the page for retrieval and answer-extraction, not for narrative deep-read. R1 voice still applies in the answer body (humans who DO land get a readable answer), but the structure is Q&A-first.

Binding shape per belief page:

1. **Frontmatter additions.** Three new lists alongside `related_beliefs`: `supersedes:` (list of belief slugs this belief replaces), `conditioned_by:` (list of belief/theme slugs this belief depends on), `holds_with:` (list of belief slugs that hold simultaneously despite apparent tension). Source: extracted from current `## Cross-links` sections that the build-wiki strip already drops. These three fields drive both the chip strip render AND eventual kg.json edge generation.

2. **Auto-rendered chip strip under h1.** build-wiki.mjs reads the three frontmatter fields, filters to existing pages (themes + Tier-1 beliefs that have pages), emits a mono-font dim-color chip strip directly under h1 and above the page-purpose block. Format: `Conditions: [parent_theme]  ·  Supersedes: [list]  ·  Holds with: [list]`. Each chip is a clickable link. Reader gets graph position in <1 second instead of parsing a 2-3 sentence orientation paragraph. Same data the agent already wants from kg.json.

3. **Body sections — Q&A shape.** Replace the current essay structure (`## The claim` / `## How the belief formed` / `## What it supersedes`) with two body sections:
   - `## The question` — 1-2 sentences phrasing the natural-language question someone would ask an AI assistant about Agam that this belief answers. Examples: "What is Agam's agent-first thesis?" / "Does Agam think prompt engineering still matters?" / "Why does Agam say context beats prompt?" These become the AEO-indexable question stems.
   - `## The answer` — R1 voice, ~300-500w. Folds in the claim, when it formed, the supersession arc, and the simultaneity edges. One block of prose, not three sections. Tighter than current essay because the chip strip carries the graph context that orientation prose used to carry.

4. **Closing sections retained:**
   - `## Where to go from here` — 3 named exit paths in prose (current shape).
   - `## Evidence` — table with Date / Entry / Post columns (current shape).

5. **Length target: 500-700w body** (down from 600-800w). Chip strip + Q&A structure mean less prose is needed to deliver the same information.

6. **Voice: still R1.** Declarative thesis, colon rhythm, hyphen-with-spaces aside, short paragraphs, no hedging. The shape changed; the voice did not. A human who DOES land on the page reads a piece of writing, not a database row.

7. **Cold-reader contract still applies but redistributed.** Orientation work moves from prose paragraph (current) into chip strip (auto) + question stem (manual). The combined effect: a cold reader knows what the page is, what it depends on, what it supersedes, and what question it answers — all in the first 5 seconds, all above the fold.

8. **AEO/SEO fold-in.** The Q&A shape is the AEO restructure. The currently-queued "AEO Q&A restructure on /wiki/voice/ + /wiki/quotes/" gate (per STATUS line 17) extends to belief pages naturally. Belief pages become the primary AEO surface; voice + quotes pages get a lighter Q&A overlay. One pass, two surfaces.

9. **kg.json downstream.** build-kg.mjs is updated in a follow-on pass (not blocking) to ingest `supersedes` / `conditioned_by` / `holds_with` from belief frontmatter and emit corresponding edges (rel: `supersedes`, `conditioned-by`, `holds-with`). Today these relationships live only in prose; making them frontmatter-typed lets the graph carry them.

10. **Retrofit CP-1 + CP-2.** Both already-shipped pages (belief.agent-first 0c50e5f, belief.context-over-prompt 253fcef) are rewritten to the new shape in the same retrofit commit. Retrofit cost: ~30min for both. Lower than re-running them as fresh CPs because the source content is already correct, only the structure changes.

These are gates. Any belief page that ships without all three frontmatter fields, the chip strip render, and the Q&A body shape is not done.

### §D6.1-belief-shape-binding — final locked contract (supersedes §D5-belief-shape-binding above)

Belief pages are operational building blocks for agent reasoning. NOT biographical claims about a person. NOT historical artifacts of an evolving thinker. Optimize for retrieval + answer-extraction by agents (Reader 1: /enter v3; Reader 2: external AI assistants via /llms.txt; Reader 3: AEO/SEO answer-machines). Human direct-land is rare and incidental.

**Locked frontmatter fields per page:**

```yaml
type: BeliefPage
slug: <slug>
title: <Title Case Belief Name>
one_line: "<35-90 word description for OG meta + social share - NOT rendered visibly when quotable is present>"
quotable: "<single-sentence verbatim assertion, agent drops this into responses without rephrasing>"
parent_theme: <theme-slug>
related_beliefs:
  - belief.<slug>
  - ...
supersedes:
  - <belief-slug-or-graph-node>
conditioned_by:
  - <belief-or-theme-slug>
holds_with:
  - <belief-slug>
applies_to:
  - <domain-tag-1>
  - <domain-tag-2>
  - ... (3-6 tags)
confidence: settled  # settled | evolving | contested
tier: 1
length_target: 400-600w
status: c-voice-beliefs-r1-cp{N}-d6.1
voice_register: 1 (free-form post-essay)
shape: principle-card-d6.1
```

**Locked body sections (in this order):**

1. `# <Title>` (h1)
2. `## The belief` — 1-3 declarative sentences, principle form, active voice. State what the belief asserts as true. Do NOT use "Agam thinks" / "What does Agam think" / "Agam's view is" framing. The belief is a principle, not a biographical claim.
3. `## How to apply` — 3-5 numbered decision rules. Format: bold-claim period explanation. Each rule starts with "When [trigger condition]" or an imperative verb ("Default to...", "Treat the X as Y", "Audit Z first"). Rules must be testable - an agent should be able to take the rule and apply it to a novel question without needing the source corpus.
4. `## What this is not` — 2-3 bullets naming boundaries / failure modes / over-rotations. Format: bold-statement period explanation. Helps the agent know when this belief does NOT apply or when reaching for a different belief is correct.
5. `## Argues against` — 3 bullets, each in quotation marks, naming concrete counter-positions the belief explicitly rejects. Lets the agent identify when user input invokes a counter-position and route to the appropriate rebuttal.
6. `## Where to go from here` — 3 named exit paths in prose ("If you want X, go to Y..."). Cross-link to parent theme + 2 related beliefs minimum.
7. `## Evidence` — markdown table with `| Date | Entry | Post |` columns. Auto-collapsed by build-wiki into a `<details>` drawer (closed by default for human reads, open-on-click for audit / agent grounding).

**Locked body rules:**

- **Length: 400-600 words** body prose (excluding frontmatter and Evidence table). Includes The belief + How to apply + What this is not + Argues against + Where to go from here.
- **Voice: R1.** Declarative, colon rhythm, hyphen-with-spaces aside, short paragraphs, no hedging.
- **Zero em-dashes (—).** Use ` - ` (hyphen+spaces) or colon or new sentence.
- **Zero banned LLM-isms.** No "leverage" (verb), "seamlessly", "robustly", "deeply" (filler), "navigate" (metaphor), "delve", "groundbreaking", "transformative", "It's not just X, it's Y", hashtags, hedging ladders, conclusion-recap paragraphs.
- **Zero triadic prose lists.** When listing three things, use a numbered or bulleted list, not "X, Y, and Z" rhythm in prose.
- **Zero biographical date framing in body.** No "March 2023 post...", "the June 20, 2025 manifesto", "by April 2026". Posts live ONLY in the Evidence table (with dates in the Date column). The body uses verbatim quotes when essential for grounding but does not date them in narrative form.

**Auto-rendered blocks (build-wiki injects, not manual):**

- **Chip strip** under h1: Theme · Supersedes · Conditions · Holds with. Each chip is either a clickable link (page exists) or a dead chip (graph node, no page). Mobile: stacks vertically per group below 720px.
- **Tag strip** below chip strip: Applies to: <tag chips> + confidence dot. Mobile: confidence wraps below tags.
- **TL;DR block** below page-purpose (or replacing it when quotable is present): gold-gradient highlighted block with `TL;DR` label and the quotable quote. The agent extracts this verbatim.
- **Page-purpose** is SKIPPED on belief pages with quotable. The one_line still drives OG/meta description for social shares - it just doesn't render in the body when TL;DR carries the visible job.
- **Evidence table** is auto-wrapped in `<details>` with summary "Evidence (N dated rows - click to expand)".

**Mobile gates (verified by /design-review on every CP):**

1. Chip strip stacks each group vertically with label-above-chips below 720px viewport
2. Tag strip confidence indicator wraps to its own line below tags below 720px
3. Sep-dots between chip groups hidden on mobile
4. TL;DR padding/font-size tuned for narrow viewports (slightly smaller)
5. Numbered "How to apply" circles render as `::before` pseudo-element with mono accent number (not native `<ol>` markers)

These gates are pass/fail. Any belief page that fails one is not done.

**Subagent prompt template:**

The CP-3..CP-19 sonnet subagent prompt template is saved at `prompts/c-voice-beliefs-d61-template.md` (see this file for the canonical text to copy-paste per CP, swapping only the slug + reference belief).

## Locked execution sequence

| Step | Scope | Effort | Sub-checkpoints | Self-eval gate |
|---|---|---|---|---|
| **C-mech** | All mechanical fixes from /review + /design-review in one batch | 30-45 min | None (single batch) | All counts match, breadcrumb resolves or non-clickable, blockquotes semantic, manifest links present, 404 center fixed, llms.txt clean of banned LLM-isms |
| **C-struct** | Page-purpose layer (one-line hook under h1, cross-link footers, /wiki/beliefs/ landing index) | 1-2 hr | CP-1 hooks added; CP-2 footers added; CP-3 beliefs index | Every page has hook + 4-6 cross-links. Belief breadcrumb resolves to a real index page. |
| **C-voice-themes** | Full reauthor of 12 theme + 1 root pages in R1 voice via per-theme sonnet subagent (no parallel batches per user taste-call 2026-04-26), with §D1-narrative-binding cold-reader contract folded in | 6-8 hr | CP-1 reference pass on agent-first BY HAND (DONE 2026-04-26); CP-2 voice-ai-craft; CP-3 breadth-as-differentiation; CP-4 pm-taste; CP-5 ai-pm-skillset; CP-6 enterprise-ai-reality; CP-7 second-brain; CP-8 spec-first-taste; CP-9 career-reflection; CP-10 linkedin-as-instrument; CP-11 personal-projects-tinkering; CP-12 root. **After EACH theme**: review subagent output against gates, build, commit + push, update STATUS, milestone check. No batching. | Each theme reviewed against voice-spec + §D1-narrative-binding before merge. Voice fidelity gate B+ minimum. Cold-reader test: a fresh subagent given only the rewritten page (no other corpus context) can summarize what the page is for + name 3 exit paths. /design-review run after CP-12. |
| **C-voice-beliefs** | Full reauthor of 19 belief pages with §D1-narrative-binding folded in | 8-10 hr | CP-1 reference belief BY HAND; CP-2 through CP-20 one belief per checkpoint via sonnet subagent. **After each belief**: review, build, commit + push, STATUS update, milestone check. No batching. | Voice fidelity gate B+ minimum. Cold-reader test pass on every page. /design-review run after CP-20. |
| **C-graph** | P2c hand-designed constellation viz, gated by §D2-graph-UX-binding 10 invariants | 7-9 hr | CP-1 SVG layout sketch + invariant checklist; CP-2 theme ring + scroll isolation + zoom-floor; CP-3 belief cluster expand/collapse + always-centered double-click; CP-4 post chips + narrative tour; CP-5 mobile fallback list view; CP-6 keyboard accessibility + re-fit-on-resize; CP-7 final polish + /design-review with all 10 gates | Manual UX test desktop touchpad + mobile viewport + screen-reader-emulator. All 10 §D2 invariants pass. No external CDN. Tour fires on first load. |
| **C-final** | /design-review + /review on full wiki, STATUS update CHECKPOINT 23 (Phase C complete) | 1-2 hr | CP-1 design-review pass; CP-2 review pass; CP-3 fixes; CP-4 STATUS commit | Both gates clean. Phase D entry conditions met. |

**Total: ~20-28hr** (revised up from 17-25hr to account for §D1-narrative-binding folded into voice + §D2 expanded gate count). Will span multiple sessions. STATUS.md tracks current step + sub-checkpoint after every commit so any new session can resume immediately.

## Multi-session persistence binding

After every commit:
1. Update STATUS.md with current step + sub-checkpoint reached
2. Push to origin/main (cross-machine handoff)
3. Note any blocker / open question / decision needed in STATUS

Before any new session start:
1. Read STATUS.md last entry
2. Read this plan doc
3. Resume at the named sub-checkpoint, do not start from scratch

---

*Drafted 2026-04-26 in response to user feedback. Updated 2026-04-26 with locked D1/D2/D3 decisions. C-mech kicks off immediately.*
