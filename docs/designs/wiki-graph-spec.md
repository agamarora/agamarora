---
type: DesignSpec
target: /wiki/graph/index.html
status: spec-only-phase-a
written: 2026-04-26
purpose: Define interactive knowledge graph visualization for second-brain v1. Implementation deferred to Phase B/C. This spec is the contract.
authoritative_inputs:
  - /wiki/kg.json (source data — generated from ontology-v1.md by scripts/build-kg.mjs)
  - docs/plans/second-brain-v1.md §5 (wiki page conventions)
  - CLAUDE.md (site convention: self-contained inline-style HTML per page)
  - netlify/functions/lib/kg-themes-summary.mjs (KG_TENSION_MAP for cross-link rendering)
---

# /wiki/graph/ — Knowledge graph visualization spec

## Why this page exists

The corpus synthesis produced ~250 graph nodes (57 beliefs + 52 projects + 54 people + 58 tech) and 180+ edges. Theme pages and belief pages render slices of this graph as prose. The graph page renders the graph itself as a navigable surface.

Without this page: density lives in `kg.json` but is invisible to a wandering visitor.
With this page: the visitor SEES the structure of how Agam thinks. Click any node to enter that part of his world.

User intent: "When a user is entering my portal, they are entering my world." Graph page is the "world map."

---

## Page placement + nav

- **URL:** `/wiki/graph/index.html`
- **Title:** "Knowledge graph - second-brain"
- **Linked from:** `/wiki/index.html` (theme grid header), every theme page footer ("see this in the graph"), every belief page footer.
- **OG:** generic site OG for v1; per-theme OG pipeline could later generate "agam graph - <focused theme>" for share links.
- **Robots:** indexable (default).

---

## Data source

Reads `/wiki/kg.json` client-side via `fetch()`. Single GET. No build-time bundling on the graph page (unlike the function bundle).

**kg.json schema reminder:**
```json
{
  "version": "1.0",
  "generated_at": "2026-04-26",
  "themes": [{ "slug", "title", "tier", "wiki_url", "one_line", ... }],
  "beliefs": [{ "slug", "statement", "parent_theme", "tier", ... }],
  "projects": [{ "slug", "name", "year", "lineage_parent", "beliefs_evidenced": [...] }],
  "people": [...],
  "tech": [...],
  "edges": [{ "from", "to", "rel", "weight?", "note?" }]
}
```

Page reads this once on load, builds the graph object client-side, renders.

**Performance budget:** 250 nodes + 180 edges should render smoothly on a modern laptop and a recent phone. If kg.json grows past 500 nodes, plan a lazy-load / clustering pass.

---

## Library choice

**Decision: vis-network** (vendor inline, no npm).

**Reasoning:**
- d3-force: lowest level, highest control, but requires assembling pan/zoom/click/hover/highlighting from primitives. Heavy build.
- cytoscape.js: feature-rich, fast, good API, but ~500KB minified. Overkill.
- **vis-network** (from vis.js): purpose-built for network graphs. ~200KB minified. Has hover/click/highlight/pan/zoom/filtering/clustering out of the box. Stable, well-documented, works on phones.

**Vendor approach (per site convention — no npm):**
- Download `vis-network.min.js` once. Place at `/assets/vendor/vis-network@9.x.x.min.js` (pin version).
- Inline `<script>` in `/wiki/graph/index.html` references it.
- Source the file from the official CDN at vendor time, save locally, never re-fetch at runtime.

**Fallback if vis-network has issues at impl:** drop to plain SVG + hand-rolled force layout. ~5x more code, same outcome.

---

## Layout (desktop ≥768px)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [icon bar top-left]                                                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Knowledge graph                                                    │
│   second-brain v1 - 250+ nodes, 180+ edges                           │
│                                                                      │
│   ┌──────────────────┬───────────────────────────────────────────┐   │
│   │ FILTERS          │                                           │   │
│   │ ─────────        │                                           │   │
│   │ Theme            │           [graph canvas]                  │   │
│   │  ☐ agent-first   │                                           │   │
│   │  ☐ pm-taste      │      force-directed nodes + edges,        │   │
│   │  ☐ ...           │      colored by theme,                    │   │
│   │                  │      sized by tier,                       │   │
│   │ Tier             │      pannable + zoomable                  │   │
│   │  ☐ root          │                                           │   │
│   │  ☐ theme         │                                           │   │
│   │  ☐ tier-1        │                                           │   │
│   │  ☐ tier-2        │                                           │   │
│   │                  │                                           │   │
│   │ Type             │                                           │   │
│   │  ☐ belief        │                                           │   │
│   │  ☐ project       │                                           │   │
│   │  ☐ tech          │                                           │   │
│   │  ☐ people        │                                           │   │
│   │                  │                                           │   │
│   │ Edges            │                                           │   │
│   │  ☐ supports      │                                           │   │
│   │  ☐ contradicts   │                                           │   │
│   │  ☐ supersedes    │                                           │   │
│   │  ☐ builds_on     │                                           │   │
│   │  ☐ tension-with  │                                           │   │
│   │                  │                                           │   │
│   │ [Reset filters]  │                                           │   │
│   └──────────────────┴───────────────────────────────────────────┘   │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────────┐   │
│   │ SELECTED NODE PANEL (appears below graph on click)           │   │
│   │                                                              │   │
│   │ agent-first  [theme]                                         │   │
│   │ Platforms that cannot talk to autonomous agents are already  │   │
│   │ behind. The prompting skill layer migrated; the verdict held.│   │
│   │                                                              │   │
│   │ 7 beliefs | 22 edges | 11+ posts                             │   │
│   │                                                              │   │
│   │ Connected to:                                                │   │
│   │ ↔ enterprise-ai-reality (tension)                            │   │
│   │ ↔ spec-first-taste (context-not-contradiction)               │   │
│   │ → context-over-prompt (cross-listed)                         │   │
│   │ → kill-prompting (refinement arc)                            │   │
│   │                                                              │   │
│   │ [Open /wiki/agent-first/ →]                                  │   │
│   └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  [aa. mark bottom-right]                                             │
└──────────────────────────────────────────────────────────────────────┘
```

**Sidebar:** ~280px wide. Fixed. Filter checkboxes scroll if list is long.
**Canvas:** fills remaining width. Min-height 600px desktop, 400px mobile.
**Detail panel:** appears below canvas after click. Empty state: "Click any node to inspect."

---

## Layout (mobile <768px)

```
┌────────────────────────┐
│  [icon bar top-left]   │
├────────────────────────┤
│ Knowledge graph        │
│ 250+ nodes, 180+ edges │
│                        │
│ [Filter ▾] (collapsed) │
│                        │
│ ┌────────────────────┐ │
│ │  graph canvas      │ │
│ │  (smaller, simpler │ │
│ │  force layout)     │ │
│ │                    │ │
│ │                    │ │
│ └────────────────────┘ │
│                        │
│ Detail panel (below)   │
│                        │
│ [aa. mark]             │
└────────────────────────┘
```

**Mobile differences:**
- Filters collapse into a top-of-page disclosure widget. Tap to expand.
- Force layout uses simpler (faster) settings. Dampen physics aggressively to keep things still.
- No hover state (touch-only). Tap = highlight + show panel. Double-tap = focus + zoom.
- Sidebar layout disappears; everything stacks.
- **Fallback view (deepest mobile fallback if force layout struggles):** list-by-theme view. Each theme = expandable row. Tap to see beliefs + projects under it. Treat as accessible default.

---

## Interactions

| Action | Result |
|---|---|
| Hover (desktop only) | Highlight node + 1-hop neighbors. Dim everything else to 0.2 opacity. Show tooltip with title + tier. |
| Click node | Highlight + show detail panel below canvas. Pan to center node smoothly (300ms). |
| Double-click node | Same as click + zoom in 1.5x. |
| Drag node | Pin in place. Right-click to unpin. (Desktop only.) |
| Pan | Click + drag empty canvas. Touch + drag on mobile. |
| Zoom | Scroll wheel. Pinch on mobile. |
| Filter checkbox | Hide nodes/edges that don't match. Re-run force layout for ~500ms then settle. |
| Reset filters | All checkboxes ON. |
| Press `/` (desktop) | Focus search input in sidebar (search by node label). |
| Search type | Filter to nodes whose label/slug contains the query. |
| Click "Open /wiki/...page" in detail panel | Navigate to that wiki page. |

**Keyboard navigation (a11y):**
- Tab through nodes in fixed order (alphabetical by slug within type).
- Arrow keys navigate the focused node's neighbors when a node has focus.
- Enter on focused node = open detail panel.
- Esc = close panel + clear selection.

---

## Visual encoding

### Node visuals

| Property | Encoding |
|---|---|
| **Size** | Tier: root = 28px diameter; theme = 22px; tier-1 belief = 16px; tier-2 belief = 12px; project/person/tech = 10px |
| **Color (hue)** | Parent theme: 12 distinct hues from a pre-defined palette. Root = `--accent` gold (#E5A54B). Belief inherits from parent_theme. Project/person/tech = neutral gray with subtle theme tint based on first associated theme. |
| **Saturation** | Tier 1 = 100%; Tier 2 = 60%; Tier 3 / peripheral = 30%. |
| **Border** | Themes get a 2px gold border. Beliefs get 1px theme-color border. Other types: none. |
| **Label** | Always visible for themes + root. Beliefs label only on hover or zoom-in. Projects/people/tech: label only on hover. |
| **Shape** | Circle (default for all). Tech = square. Person = diamond. Lets users visually filter type without checking sidebar. |

### Edge visuals

| Edge type | Style |
|---|---|
| `supports` | Solid 1px gray |
| `contradicts` | Dashed 1px red |
| `supersedes` / `refined_by` | Solid 2px gold w/ arrowhead |
| `builds_on` (project lineage) | Solid 1px blue |
| `tension-with` | Solid 2px purple, dashed |
| `evidenced_by` / `demonstrates` | Solid 0.5px light gray (lots of these — keep faint) |
| `mentions` | Dotted 0.5px |

### Color palette (12 themes)

Pulled from existing site design tokens + extended for distinctness:
- agent-first: `#E5A54B` (gold accent, but theme can repeat root if filtered)
- pm-taste: `#7BA7D9`
- ai-pm-skillset: `#9B7BD9`
- enterprise-ai-reality: `#D97B7B`
- second-brain: `#7BD9A7`
- spec-first-taste: `#D9C57B`
- voice-ai-craft: `#7BD9D9`
- breadth-as-differentiation: `#D97BC5`
- career-reflection: `#A7D97B`
- linkedin-as-instrument: `#7BC5D9`
- personal-projects-tinkering: `#C57BD9`

Root substance-over-hype keeps full `--accent` gold. Backgrounds use `--bg #0A0A0A` per site dark mode.

---

## Detail panel — node-type-specific layout

### Theme node selected
```
agent-first  [theme tier]
[1-line core belief]

7 beliefs | 22 edges | 11+ posts | 2023-04-23 → 2026-04-23

Connected:
↔ tension: enterprise-ai-reality (rate vs direction)
↔ context-not-contradiction: spec-first-taste

[Open /wiki/agent-first/ →]
```

### Belief node selected
```
context-over-prompt  [tier 1]
[Statement, 1-2 sentences]

Parent theme: agent-first
Cross-listed: spec-first-taste, second-brain

Connected:
→ refinement arc: kill-prompting → prompts-as-engineering-primitive
→ supports: agent-first (theme)

[Open /wiki/beliefs/context-over-prompt/ →]
```

### Project node selected
```
second-brain-v1  [project]
2026 · live · open-source

Lineage parent: chatgpt-pm-stack (2023)
Demonstrates: second-brain-is-context-layer, spec-over-sprint, help-market-flourish
Tech: Markdown, JSON, HTML, Netlify

[Open /lab/second-brain/ →]
```

### Person node selected
```
Andrej Karpathy  [public-thinker-cited]

Cited in 1 post: 2026-04-21
Beliefs evidenced: second-brain-is-context-layer

[No wiki page yet]
```

### Tech node selected
```
Claude Code  [tool]

Used in 2 projects: claude-code-resource-monitor, second-brain-v1
First used: 2025

[No wiki page yet]
```

When a node has no `/wiki/<slug>/` route, show "No wiki page yet" instead of a link. Don't fake links.

---

## Empty state

Default when page first loads (before any selection):

```
Click any node to enter that part of his thinking.
Drag to explore. Filter by theme to focus.

Try: agent-first (gold) is the densest cluster. Substance-over-hype
(gold root) connects them all. Pm-taste pushes back against agent-first
when you zoom into the spec-first-taste link.
```

The hint text rotates between 3-4 variations per page load to keep the empty state alive without being chatty.

---

## Performance + technical constraints

**Render budget:** 250 nodes + 180 edges. Force layout settle target: ≤2 seconds on a 2018-era laptop.

**Settings (vis-network options):**
```js
const options = {
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based',
    forceAtlas2Based: { gravitationalConstant: -50, springLength: 100 },
    stabilization: { iterations: 200, fit: true }
  },
  interaction: {
    hover: true,
    tooltipDelay: 200,
    keyboard: { enabled: true }
  },
  layout: { improvedLayout: true }
};
```

After stabilization (settle), DISABLE physics so layout is stable for navigation. Re-enable only on filter changes.

**Mobile fallback trigger:** if `window.innerWidth < 768`, AND if FPS drops below 20 during stabilization, fall through to list view automatically.

---

## File structure

```
/wiki/graph/
└── index.html       # self-contained: DOCTYPE, head with OG + design tokens,
                     # inline <style> per site convention,
                     # inline <script> with module logic,
                     # references /assets/vendor/vis-network@x.x.x.min.js
```

**No separate JS file** per site convention (each page self-contained). Vendor library is the only external script reference.

**Total page weight target:** ≤30KB inline + 200KB vendor = 230KB total. Acceptable.

---

## Accessibility

- Skip-to-content link as first focusable element.
- Canvas has `role="img"` with `aria-label="Knowledge graph visualization. Use Tab to navigate nodes, Enter to inspect, slash key to search."`
- Sidebar filters are real `<input type="checkbox">` with proper labels.
- Detail panel updates an `aria-live="polite"` region when a node is selected.
- All node info also reachable via the search-and-list flow (no graphical interaction required to find a node).
- High contrast: theme colors all pass WCAG AA against `--bg #0A0A0A`.
- Focus rings visible on all interactive elements.

---

## Telemetry (optional, lightweight)

Plausible event hooks for engagement understanding:
- `graph_node_clicked` (node_type, node_slug)
- `graph_filter_applied` (filter_dimension, filter_value)
- `graph_search_used` (query_length only, NOT query content)
- `graph_navigated_to_wiki` (target_url)

No PII. No corpus content sent.

---

## Out of scope for v1

- 3D graph (overkill, browser-perf-fragile)
- Custom edge animations beyond static styles
- Real-time graph updates (kg.json regenerated at build, not at runtime)
- Save/share custom filter view URL state (good Phase 2 if visitors actually want this)
- Graph editing (the wiki is read-only from visitors; graph editing happens via markdown commits)

---

## Implementation tasks (Phase B/C)

When this spec gets built, the work breaks into:

1. Vendor `vis-network@x.x.x.min.js` to `/assets/vendor/`. Pin version in CHANGELOG.
2. Build `/wiki/graph/index.html` shell per site v2 page contract (header, aa. mark, dark tokens, inline style/script).
3. Implement node + edge construction from `kg.json` fetch.
4. Implement filters sidebar (desktop) + collapsed disclosure (mobile).
5. Implement detail panel templates (one per node type).
6. Implement search-and-list fallback.
7. Wire telemetry hooks.
8. QA pass on Chrome + Safari + iOS Safari + Firefox + Android Chrome.
9. /design-review pass for visual polish.
10. Add link from `/wiki/index.html` and from theme/belief pages.

**Implementation estimate (Phase B/C):** 1.5-2 days of focused work. About 60% of that is the visual/interaction polish and mobile fallback, not the data wiring.

---

## What this spec does NOT lock

- Exact pixel sizes (small adjustments allowed during build)
- Final color palette (the 12 hues are starting points; can shift if accessibility audit demands)
- Exact `vis-network` version (pin at vendor time)
- Telemetry implementation details (Plausible vs custom — pick at impl)

---

*Spec only — Phase A. Implementation Phase B/C per spec §9 + revised page count in EXECUTION-PLAN-v1.md §6.*
