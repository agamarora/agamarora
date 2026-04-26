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

## Where this stops and asks the user

This plan locks the **structural shape** but leaves three taste calls open:

- **D1 - Voice approach for themes + beliefs:** P1a (full reauthor) vs P1b (voice intro + collapsed deep-dive) vs P1c (replace with distillation).
- **D2 - Graph viz target:** P2a (tighter vis-network) for v1 + P2c (constellation) for v2, OR jump straight to P2c?
- **D3 - Sequencing:** mechanical-fixes first vs voice-pass first vs graph viz first? The plan above proposes mechanical → structural → voice → graph, but the user may want the visible-impact pieces (graph + voice) earlier.

Pause for user direction on D1/D2/D3 before C-mech kickoff.

---

*Drafted 2026-04-26 in response to user feedback. Subject to change once user replies on D1-D3.*
