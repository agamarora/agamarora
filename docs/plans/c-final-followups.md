# C-final follow-ups — MEDIUM/POLISH from /design-review pass

**Source:** /design-review on https://agamarora.com/wiki/ tree, 2026-04-27.
**Phase C declared COMPLETE** at CHECKPOINT 32 — these are non-blocking polish items deferred to v2.

Pages audited (archetypes covering 33-page tree via shared build template):
`/wiki/`, `/wiki/agent-first/`, `/wiki/beliefs/`, `/wiki/beliefs/agent-first/`, `/wiki/voice/`, `/wiki/quotes/`, `/wiki/projects/`, `/wiki/graph/`, `/wiki/root.substance-over-hype/`. Mobile + desktop. Zero console errors across all.

---

## MEDIUM (defer to v2)

### M1. Header icon touch targets below 44px
**Where:** all v2 pages — 5 SVG icons in top-left chrome (GitHub, LinkedIn, YouTube, Resume, Home).
**Measured:** 37×37px. Apple HIG / Material minimum is 44×44.
**Risk:** mobile tap miss on adjacent icons. 7px short.
**Fix:** in `scripts/lib/chrome.mjs` `SHARED_HEADER_HTML`, bump icon container to `44px` min or add 4px padding to expand hit area without changing visual size.
**Effort:** ~5 min. CSS-only.

### M2. /wiki/graph/ paints empty for ~3s on first load
**Where:** `/wiki/graph/` — 1104-node SVG constellation renders progressively after JS init.
**Measured:** desktop screenshot at t=0s shows only dim genesis dot; constellation fully rendered at t≈3s.
**Risk:** first-impression friction — visitor sees near-empty starfield, may bounce before render completes.
**Fix:** options ranked by intent-preservation:
- (a) Fade-in genesis + 11 themes immediately (synchronous, ~50 nodes), then load belief/project/post layers progressively. Preserves "celestial atlas materializes" feel.
- (b) Add subtle low-opacity caption "rendering constellation…" that fades out on first paint.
- (c) Inline first-paint SVG in HTML (genesis + 11 themes only), hydrate the rest via JS.
**Effort:** ~30-60 min depending on option. (a) preferred per locked design intent.

### M3. /wiki/ landing — `<h4>` directly under `<h2>` in Meta pages section
**Where:** `wiki/index.html` line ~420. `<h2 class="section-h">Meta pages</h2>` → 5× `<h4>Beliefs|Graph|Projects DAG|Voice|Quotes</h4>` cards.
**Measured:** heading sequence skips H3 in Meta pages section only (themes section uses H3 cards correctly).
**Risk:** SR users encounter heading-level skip. WCAG discouraged but not strictly forbidden.
**Fix:** swap meta-card `<h4>` → `<h3>` in `wiki/index.html`. CSS class `.meta-card h4` → `.meta-card h3` (or add `.meta-card .card-title` to break tag dependency).
**Effort:** ~5 min.

### M4. Heading visual scale inverts H2 (eyebrow 12.48px) vs H3 (card 30.4px / 17.92px)
**Where:** `/wiki/`, `/wiki/beliefs/` landings — `<h2 class="section-h">` styled as small-caps eyebrow appears smaller than H3 below it.
**Note:** editorial convention (NYT, Quanta use small-caps eyebrow above larger card titles). Semantic order is preserved. Sighted users read hierarchy by visual weight + position; SR users get correct DOM order. Decision is whether to keep editorial style or align visual scale.
**Risk:** low — pattern is conventional, but at-a-glance reading expects size = importance.
**Fix:** if changing, either (a) bump `.section-h` font-size to ~22px sans + caps so it dominates the cards below, or (b) swap markup to `<p class="section-label">` so visual-semantic reads as label, not heading. (b) is cleanest.
**Effort:** ~10 min.

---

## MEDIUM — from /review pass on build pipeline (2026-04-27)

### M5. `kg.json` parse has no try/catch in `build-wiki.mjs`
**Where:** `scripts/build-wiki.mjs:991, 1181` — `JSON.parse(readFileSync(kgPath))`.
**Risk:** if `wiki/kg.json` is malformed (manual edit, non-atomic write from a future tool), build-wiki crashes after some pages are written, leaving the tree partially rebuilt. build-kg already writes atomically so corruption is rare today.
**Fix:** hoist parse to top of `main`, wrap in try/catch with clear error + `process.exit(1)` before any pages are written. Most worth doing before Phase D since Phase D will add another consumer of kg.json.
**Effort:** ~10 min.

### M6. groqHandler `<think>` block stripping drops same-chunk prefix
**Where:** `netlify/functions/groqHandler.mjs:192-201`.
**Risk:** chunk like `"Hi there <think>...</think>"` loses `"Hi there "`. Unlikely with Groq's small chunk sizes but qwen3-32b can emit reasoning in the first token.
**Fix:** split on `<think>` first, enqueue prefix, then enter think mode. Defer to Phase D rewrite (D-1 already plans groqHandler rewrite).

### M7. JSON-LD `<script>` injection theoretical risk
**Where:** `scripts/build-wiki.mjs:566` — `${JSON.stringify(title)}` inside `<script type="application/ld+json">`.
**Risk:** if a future title contains `</script>`, it breaks out of the script tag. All current titles safe; theoretical only.
**Fix:** `JSON.stringify(title).replace(/</g, '\\u003c')` in Phase D template hardening pass.

---

## LOW — from /review pass

- `scripts/build-kg.mjs:348` — `statSync` imported but never used. Dead import.
- `scripts/build-kg.mjs:215` — `(r["internal-only"] || "").toLowerCase() === "yes" ? true : false` — redundant ternary (already boolean).
- `scripts/build-wiki.mjs:938-976` — `processDir` per-file failures only enforced via `--strict`. Default builds report success even if N pages failed. Acceptable; CI uses `--strict`.
- `netlify/functions/groqHandler.mjs:155` — `input.slice(0, 200)` runs *after* injection-detection on the longer trimmed string. Safe direction.
- `scripts/build-wiki.mjs` graph builder reads kg.json into a `<script>` block via `JSON.stringify`. All node ids/labels come from hand-authored ontology + draft files; no user-supplied input. Confirmed safe.

---

## POLISH (take when you want)

### P1. aa-mark touch box height shy
**Where:** all v2 pages — fixed-position aa. mark bottom-right, 60×30 measured.
**Note:** brand mark, not interactive critical-path. Acceptable as-is.
**Fix if pursuing:** add ~7px padding-y to `.aa-mark a` to bring tap target to ≥44px.

### P2. `<html>` element default cascade is Times New Roman
**Where:** all v2 pages.
**Note:** `<body>` overrides correctly with Satoshi. `<html>`, `<head>`, `<title>` — non-rendering, no visual impact. Defensive only.
**Fix if pursuing:** add `font-family: var(--sans)` to `:root` in `chrome.mjs` `SHARED_CHROME_CSS`.

### P3. Heading scale ratio not strictly modular
**Where:** wiki landing — H1 57.6 / H3 30.4 = 1.89, between major third (1.25) and golden (1.618).
**Note:** non-strict scale isn't a problem visually; just notable that there's no single ratio binding the tokens.

---

## Items reviewed and explicitly NOT issues

- **Wiki landing trunk test (search box absence):** `/wiki/graph/` IS the search/discover surface, surfaced as a Meta pages card. Adequate per personal-wiki context.
- **TLDR card with gold left-border on belief pages:** single semantic use (callout), not decorative grid. Not AI slop pattern #8.
- **Long-form prose density on theme pages:** matches editorial design intent. Reads well.
- **Constellation graph aesthetic:** locked spec per DESIGN.md "Authored Sky Atlas." Genesis + 11 themes + belief halos render correctly post-hydration.
- **Colors-in-use 6 unique:** within DESIGN.md token palette. No drift.
- **Fonts-in-use 3 (Satoshi + JetBrains Mono + Patrick Hand):** matches DESIGN.md exactly.

---

## Audit report

Full screenshots + per-page notes: `.gstack/design-audit/` (gitignored — local artifact).
