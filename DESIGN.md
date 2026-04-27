# Design System — agamarora.com

> The canonical design reference is the **moodboard** at [/moodboard](moodboard/index.html).
> This file summarizes the locked decisions. When in doubt, the moodboard wins.

**Last updated:** 2026-04-26
**Status:** v2 live on main. Moodboard sections 01-05 locked, 06-10 starting points. **Constellation graph subsystem locked 2026-04-26** for `/wiki/graph/` C-graph step (see ## Constellation graph below).

---

## Design Tokens

All tokens are defined in the moodboard (`moodboard/index.html :root`).

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | #0A0A0A | Page background |
| `--surface` | #111111 | Cards, elevated surfaces |
| `--border` | #1E1E1E | Dividers, subtle borders |
| `--text` | #E8E4DF | Primary text |
| `--text-dim` | #8a8a8a | Secondary text, labels (bumped from #7A7A7A 2026-04-27 to clear WCAG 2.1 AA 4.5:1 against `--surface`) |
| `--accent` | #E5A54B | Gold. Links, highlights, the "." in aa. |
| `--accent-dim` | rgba(229,165,75,0.12) | Hover states, subtle backgrounds |

## Typography

| Role | Font | Weight | Source |
|------|------|--------|--------|
| Body / headings | Satoshi Variable | 300-900 | Self-hosted woff2 |
| Code / terminal / labels | JetBrains Mono | 400, 500 | Google Fonts |
| aa. mark | Patrick Hand | 400 | Google Fonts |

No other fonts. Three is the max.

## Spacing

4px base grid. Tokens: `--space-1` (2px) through `--space-11` (128px). See moodboard section 03 for the full scale and semantic aliases (`--gap-tight`, `--padding-card`, `--padding-section`, etc).

## Pages

| Route | Purpose | Design approach |
|-------|---------|-----------------|
| `/` | Landing. Greeting, CTA buttons (Enter, Explore, Resume), company logos | v1 design (light/dark theme via main.css) |
| `/enter` | AI terminal. Keyboard background, Groq streaming, conversation memory | v2 dark-only. Moodboard tokens. |
| `/explore` | Portfolio. Scroll-snap sections, bento grid, personal section | v1 design |
| `/lab` | Projects. Shararat Voice AI showcase | v1 design |
| `/resume` | Career. Dark editorial layout, company links, print-friendly | v2 dark-only. Moodboard tokens. |
| `/moodboard` | Design system reference. 10 sections + living collection | The source of truth. |

## aa. mark

Locked. Patrick Hand font. Stroke-draw animation (dashoffset transition, then fill snap-in). Gold dot. Configurable speed. See `moodboard/aa-mark.html` for the isolated component.

## Keyboard background

3D perspective tilt (`rotateX(55deg) rotateZ(-15deg)`). Scale capped at 2.0. Depth-of-field blur on edge keys. Mouse parallax with subtle drift (lerp-based). Vignette fade via radial gradient. Gold glow on user keypress, muted white glow on bot response.

## Constellation graph

**Status:** Locked 2026-04-26 via `/design-consultation` (gstack). Aesthetic + interaction spec for `/wiki/graph/` (replaces the existing vis-network force layout). Implementation lands at C-graph CP-1..CP-7 per `docs/plans/second-brain-v1-phase-c/PHASE-C-DESIGN-PLAN.md` §D2-graph-UX-binding (revised).

**Memorable-thing (north-star):** "Authored atlas of the corpus, AI-enabled scale, governed by taste." Visitor reads: "they actually mapped their public thinking — this is a true AI-native systems thinker — what this powers is unique." (Time-framing intentionally dropped 2026-04-26 per taste-call: "n years" is a soft brag that distracts from the authored-atlas signal; the work speaks for itself.)

**Live preview:** `~/.gstack/projects/agamarora-agamarora/designs/c-graph-20260426/preview.html` (locked v6 reference).

### Aesthetic

**Authored Sky Atlas.** Reads as a deliberate celestial chart someone made by hand, NOT as a graph database visualization. References: Stellarium star charts, Quanta Magazine *Map of Mathematics*, d3-celestial. Anti-references (deliberate departures): Obsidian / Logseq / Roam graph view, force-directed default layouts, rainbow-palette dashboards.

### Geometry (organic, NOT geometric)

- **Genesis at center.** A bright golden anchor labeled `agam.arora` (mono caps, letter-spacing 0.12em) with sublabel `second brain` (mono 9px, accent at 50%). Concentric soft halos at r=16/24/36/50 (alpha 0.22 → 0.035). Core radius 11px, gold `#E5A54B`. NO time-framing in the genesis label or sublabel — it dilutes the authored-atlas signal.
- **11 themes orbit the genesis** at irregular distances (radial fraction 0.24-0.32 of `min(viewport.w, viewport.h)`). NOT a perfect circle — each theme has a hand-tuned `(angle, radF)` pair so the constellation reads organic. Pizza/wheel-spokes are forbidden.
- **Belief halos around each theme.** Each theme has a sub-cluster of belief nodes at jittered angles + jittered radii (radii pool: 22/28/34/40/46 px). Belief nodes drift slightly in angle + radius via per-node Lissajous parameters (amplitude 1.5-4 px, frequency 0.05-0.12 hz). Drift gives "living" feel; positions remain authored, not emergent.
- **No visible scaffolding.** No guide rings, no straight radial axes, no concentric dashed circles. The galactic layout is sensed, not drawn.
- **Magnitude-coded radius (3-tier hierarchy).** Genesis 11px > theme 8.5px > belief 4.0px (active) / 3.2px (inactive) > project 2.4-3.2px > tech 1.4-2.1px > post 1.1-1.8px > comment 0.7-1.3px. Logarithmic, NOT linear.

### Color (locked palette extended, no new hues)

- **Genesis + theme nodes:** `#E5A54B` (locked accent), full opacity, with soft Gaussian halo `drop-shadow(0 0 8px rgba(229,165,75,0.45))`.
- **Belief nodes:** warm white `#E8E4DF` at 70% opacity (active theme), 50% opacity (inactive). No halo on beliefs (halo is theme-status signal).
- **Project + tech + post + comment nodes:** warm white at descending opacity bands (0.55 → 0.40 → 0.20 → 0.10).
- **Edges at rest:** `rgba(232,228,223,0.04)` to `rgba(232,228,223,0.10)` for ambient corpus mesh. Real semantic edges (cross-theme cites/builds/supersedes) at `rgba(232,228,223,0.06-0.10)` baseline, scale UP on theme-active or hover (see Layered connections rule below).
- **Tension-with chords (theme↔theme productive friction):** `rgba(229,165,75,0.13)` dashed `2 6`.
- **No new colors introduced.** Every value derives from existing tokens. Do not add new accents without explicit /design-consultation pass.

### Typography (locked stack, role-extended)

- **Genesis label:** JetBrains Mono, 11px, letter-spacing 0.12em, lowercase-domain or proper noun, fill `rgba(229,165,75,0.85)`.
- **Theme labels:** Satoshi 500, 11px, letter-spacing 0.07em, lowercase, fill `rgba(232,228,223,0.62)`. Active theme fills accent gold. Positioned outside the node on radial baseline (NOT on top of node) with quadrant-aware text-anchor (`start` / `end` / `middle`).
- **Belief labels:** JetBrains Mono 9.5-10px, fill `rgba(232,228,223,0.7)`. Render only on the active or hovered theme cluster, NOT on every belief in every cluster.
- **Caption strip (top-right):** JetBrains Mono 11px, fill primary text at 55%, content: real counts only (e.g. `578+ entries · 227 graph nodes · 224 edges`). Honest counts only — never claim more than rendered. NO time-framing ("n years") — let the corpus density speak.
- **Sub-caption (top-right under caption):** JetBrains Mono 10px, fill text-dim at 40%, breakdown by node type.
- **Help strip (top-left):** JetBrains Mono 10px, breadcrumb pattern `wiki › graph`.

### Density (corpus IS the visual flex)

The viz must render the FULL corpus, not a curated subset. The authored-atlas signal dies if the canvas looks empty. Tier rendering:

| Tier | Source | Count | Style | Behavior |
|------|--------|-------|-------|----------|
| 0 | Genesis | 1 | gold core 11px + halos | always centered, brightest |
| 1 | Themes (kg.json `Theme`) | 12 (incl. root as genesis) | gold star 8.5px + halo | hand-placed orbital positions, drift via Lissajous |
| 2 | Beliefs (kg.json `Belief`) | 64 | warm-white 3.2-4.0px | inside parent theme cluster, jittered halos |
| 3 | Projects (kg.json `Project`) | 20 | warm-white 2.4-3.2px | near demonstrating theme |
| 4 | Tech (kg.json `Tech`) | 56 | warm-white 1.4-2.1px | scattered in wedges between themes |
| 5 | Curated posts (kg.json `Post`) | 75 | warm-white 1.6px | clustered by primary theme association |
| 6 | Uncurated corpus posts (linkedin-posts-full.json) | 295 | warm-white 1.1-1.8px @ 0.20-0.40 alpha | distributed across canvas with weak theme bias |
| 7 | Corpus comments (linkedin-comments-full.json) | 283 | warm-white 0.7-1.3px @ 0.12-0.27 alpha | finer scatter, full canvas |

Total visible elements: ~806 nodes. Plus the proximity mesh (≤900 short hairlines connecting nearby tier 6+7 entries). The deep-field tiers DO NOT animate per-frame (CSS-only twinkle), only the foreground tiers 0-2 drift with Lissajous.

### Connection layers (real edges, NOT random dashes)

Every drawn edge represents a real semantic relationship from `wiki/kg.json` or a derived corpus link. No spurious decorative lines. **Layered visibility — most edges dim at rest, contextual ones light up on interaction:**

1. **Ambient deep-field mesh** (~900 hairlines @ 0.025-0.13 alpha, never animated): proximity-derived between corpus posts and comments. Stands in for "co-mention" / "post-has-comment" relations. Visualizes the dense substrate.
2. **Contains-belief edges** (12 themes × N beliefs ≈ 64): drawn inside each theme group, theme→belief curved bezier with slight bow. Active theme: 0.32 alpha. Inactive: 0.12 alpha.
3. **Belief↔belief intra-cluster edges** (each belief connects to 1-2 sibling beliefs in same theme via curved arc): builds the "sub-graph per theme" feel.
4. **Belief→post citation edges** (each belief connects to 2 nearest local-post dots in its theme group): visualizes evidence grounding inside a cluster.
5. **Cross-theme interlinkage arcs** (~28 belief↔belief, belief↔post, project↔project across theme boundaries, weighted): demonstrates real density. Drawn as curved hairlines between theme group positions, control point pulled toward genesis. Endpoints follow drifting themes (recomputed per frame). Baseline 0.04-0.10 alpha; rises to 0.35-0.55 on theme-hover.
6. **Tension-with chords** (theme↔theme productive friction, dashed gold): 9 in v1, sourced from `tension-with` rel in kg.json.
7. **Association arcs** (theme↔theme weak co-reference, white): 10 in v1.
8. **Supersedes/refines edges** (intra-theme only): when both endpoints are real wiki beliefs in the same theme, drawn as gold dashed inside cluster. Floating-past-belief arcs (where the prior belief isn't a wiki page) are NOT drawn — they looked random.

**Layered visibility rule:** at rest, the canvas reads as composed and quiet. On theme hover or click, that theme's outgoing connections raise opacity (cross-link `+0.4` alpha boost, contains-belief edges to `0.45`, related theme nodes get a subtle accent halo). Hovering a single belief lights up its post-citation edges + cross-belief arcs. The graph reveals more density on engagement, not all at once.

### Motion vocabulary (named, parameterized)

| Name | Where | Frequency | Amplitude | Purpose |
|------|-------|-----------|-----------|---------|
| **twinkle** | theme stars, post dots | 4-7s ease-in-out, randomized phase per element | opacity 0.78 ↔ 1.0 | living-stars feel |
| **drift (Lissajous)** | theme positions | 0.07-0.20 hz x/y separately | 5-15 px | celestial-bodies-have-movement; not jiggle |
| **belief drift** | beliefs inside theme group | 0.05-0.12 hz | ±4° angle, ±2.5 px radial | breathing cluster |
| **halo pulse** | genesis halos | 5s | opacity 0.55 ↔ 0.85 | origin alive |
| **chord shimmer** | tension chords (dashed) | 22s linear | stroke-dashoffset 0 → -40 | productive-friction alive |
| **selection ring** | active theme | 1.8s loop | r 9 → 30, opacity 0.6 → 0 | one motion = "this is selected" |
| **signal pulse** | along edges | 0.5-1.7s per pulse, 4 cadences (radial / belief / cross-link / association / tension) | gold or white dot, 1.6-2.6px | neural-net firing |

**No idle physics simulation. No emergent positions.** Drift = visual property animation on fixed authored geometry. The constellation is composed when at rest; the LIFE is a layer above geometry.

### Big-bang entry (first paint, single-origin)

The first load animation is the genesis igniting + the universe expanding outward from a single point at canvas center. Everything starts at `(CX, CY)` with scale 0 and opacity 0; over `ENTRY_DURATION = 1800ms` everything radiates outward to its final position with `easeOutQuint` easing.

**Single-origin gate:** parallax background + deep-field corpus + theme groups must all expand from the same center point. No element starts pre-positioned, no element slides in from off-screen. Canvas is empty, then everything is born outward together.

Sequence (all timed from `entryStartTime = pageLoad + 250ms`):

| t | Element | Behavior |
|---|---------|----------|
| 0ms | shockwave | gold circle expands from r=0 to r=1100, stroke-width 2 → 0.3, opacity 0.7 → 0; cubic ease-out, 1700ms |
| 0ms | genesis core | already at center, halos start `core-pulse` |
| 0-1800ms | theme groups | each travels from `(CX,CY)` to `target.base`, scale `0.05` → `1`, opacity `0` → `1`; per-theme stagger 0-200ms total (hash-shuffled, NOT angle-ordered, so it doesn't read as clockwise sweep) |
| 0-1800ms | deep-field group | scale `0.05` → `1` around `(CX,CY)`, opacity `0` → `1`; expands as a uniform unit |
| 0-1800ms | parallax bg | scale `0.05` → `1` around `(CX,CY)`, opacity `0` → `0.85`; same origin as deep-field |
| ~990ms | edges + post-near-theme dots | fade in over 600ms |
| 1980ms | drift loop activates | regular Lissajous + signal pulses begin |

**Skippable on any user input** (click / keydown / touchstart). Skip cascade reveals everything at final state instantly.

**Implementation note:** SVG group transforms must use the `transform` attribute (`translate(CX,CY) scale(s) translate(-CX,-CY)` to scale around an arbitrary point), NOT CSS `transform` — CSS transform on SVG `<g>` is unreliable across Safari/Firefox. Theme group transform: `translate(targetX,targetY) scale(s)` (origin at group's local 0,0 since children are positioned around 0,0 inside group).

### Parallax atmosphere (echoes /enter keyboard pattern)

A deep, dim background SVG layer behind the interactive constellation:

- ~220 dim background stars at `0.06 → 0.24` alpha, sizes 0.4-2.0px, scattered uniformly across canvas
- Faint gold echo halos at slight offsets from each theme position (opacity 0.025-0.10), reinforcing the constellation pattern at depth
- Drifts on `mousemove` / `touchmove`: target offset = `-(normalizedDeltaFromCenter) * PARALLAX_STRENGTH (18px)`, lerped to actual position at factor 0.06 per frame
- During big-bang entry: scales from 0 to 1 around `(CX,CY)` synchronized with the deep-field

Same lerp-based-drift discipline as `/enter` keyboard background. No 3D tilt — that's keyboard's signature; constellation stays 2D.

### Mobile (first-class, NOT fallback)

**§D2 invariant 7 revised 2026-04-26:** previous spec said "below 768px, render flat list." Revoked. Mobile gets the same constellation experience as desktop, scaled and bound to viewport.

- **Responsive node sizing:** below 640px viewport, theme nodes shrink to 6.5px (from 8.5), belief nodes to 2.6/3.2px (from 3.2/4.0). Caption typography scales down (10/9/9px). Legend hidden entirely (`display:none`).
- **Touch interaction:** single-finger drag = pan canvas. Two-finger pinch = zoom (clamped). Tap on theme = expand cluster + click-through.
- **Pan + zoom + bounds (binding):** wheel ALONE scrolls the page (never zooms — see invariant 1). Cmd/Ctrl + wheel zooms. Pinch zooms on touch. Pan + zoom both clamped so the constellation cannot leave the viewport (anti-drift floor at "all 12 themes visible," upper zoom ~3x). Double-click background = recenter.
- **Fullscreen toggle (top-right button)** uses native Fullscreen API (`requestFullscreen()` / `exitFullscreen()`). Critical on mobile where the constellation deserves the full canvas. Button label: `⛶ fullscreen` ↔ `⛶ exit`.

### Honest counts rule

The caption MUST reflect what's actually drawn. If the canvas renders 144 visible elements but the caption says "227 nodes," the visualization is lying and the trust-via-density signal collapses. Always show:

- Real corpus scale: `578+ entries · 227 graph nodes · 224 edges`
- Breakdown: `12 themes · 64 beliefs · 20 projects · 56 tech · 295 posts · 283 comments`
- Update both whenever the underlying data shifts.

### Binding §D2 invariants (revised, supersede prior spec)

These are gates for C-graph CP-1..CP-7 (per PHASE-C-DESIGN-PLAN). Any sub-checkpoint that fails one is NOT done.

1. **Scroll isolation.** Wheel = page scroll. Cmd/Ctrl+wheel = zoom. Pinch (touch) = zoom.
2. **Always-centered.** Double-click background = re-fit to "all 12 themes + genesis visible."
3. **Anti-drift floor.** Pan + zoom both clamped so constellation cannot leave viewport.
4. **Default state = oriented, not raw.** Genesis + themes prominent at first paint; beliefs visible at low density inside their theme clusters; deep-field corpus stars present but dim; on-hover lights up real connections.
5. **Big-bang entry, single-origin.** Everything expands from `(CX, CY)` over 1.8s. No element slides in pre-positioned from off-screen.
6. **Click-through to wiki.** Theme click → `/wiki/<slug>/`. Belief click → `/wiki/beliefs/<slug>/`.
7. **Mobile = first-class.** Same constellation, viewport-responsive sizing, touch pan/zoom, fullscreen toggle. NOT a flat list fallback.
8. **Keyboard accessible.** Tab cycles theme nodes in NAV_ORDER. Enter on focused node opens its wiki page. Esc returns to wiki home.
9. **No external CDN runtime dep.** Hand-rolled SVG + inline JS. No vis-network, no d3, no unpkg.
10. **Re-fit-on-resize.** Window resize triggers re-fit + responsive re-sizing of nodes + labels.
11. **Real edges only.** Every visible connection traces to a real kg.json edge or a derived corpus link. No spurious decorative dashes.
12. **Layered visibility.** At rest the canvas is composed + quiet. On hover/click, real connections light up. The graph reveals density on engagement.
13. **Honest counts.** Caption matches what's drawn.

### Anti-patterns (forbidden)

- Perfect circle of equidistant theme nodes (pizza / wheel-spokes)
- Straight radial axes from genesis (also pizza)
- Force-directed physics simulation (jitter forever, Obsidian default)
- Multi-color rainbow palette per theme (rejected — gold-on-vacuum is the brief)
- Tendrils / decorative dashed S-curves with no semantic meaning
- Synthesized "floating beliefs" anchored at antipode-ish offsets (look random)
- Hover-glow on every node (halo is status, not feedback)
- Caption claiming more nodes than rendered

### Implementation reference

Locked v6 preview at `~/.gstack/projects/agamarora-agamarora/designs/c-graph-20260426/preview.html` is the binding visual contract. C-graph CP-1..CP-7 implements against it, reading real edges from `wiki/kg.json` and corpus counts from `~/.gstack/projects/agamarora-agamarora/corpus/linkedin-posts-full.json` + `linkedin-comments-full.json`.

Tweaks during build are expected — preview captures principles, implementation reveals edge cases. Any tweak that changes a rule above must be reflected back into this section.

## What this file replaced

Prior concepts explored and rejected (documented in BUILD-LOG.md):
- Convergence Engine (SVG thread animation)
- Self-Constructing Portfolio
- Playable Portfolio (Phaser.js)
- Cinematic Scroll
- Pixel art character/mascot

The moodboard approach won because it's buildable, shippable, and matches the editorial energy of the site.
