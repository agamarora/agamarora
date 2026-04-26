# second-brain v1 — next-session execution plan

**Generated 2026-04-26 at CHECKPOINT 31. Designed to be the entry doc for the next auto-mode session after context clear.**

This doc lists every remaining task in execution order, each with: scope, files touched, commands to run, gates to pass, commit-message template. Pick up at the first row marked QUEUED in the [Task tracker](#task-tracker) below.

---

## How to use this doc (paste into next session)

1. Read the [Resume context](#resume-context) — 1 paragraph telling Claude where we are.
2. Read the [Locked artifacts](#locked-artifacts) — paths to canonical specs + decisions.
3. Run the [Pre-flight](#pre-flight) commands to verify clean state.
4. Open the [Task tracker](#task-tracker) and pick the first QUEUED row.
5. For that task: read its detailed section, execute, commit, push, mark DONE in the tracker, move to the next QUEUED row.

Auto mode: yes. Caveman mode: yes (fragments OK; code/commits stay normal). Subagent rule: sonnet default, haiku for trivial, never opus (project hard rule per CLAUDE.md).

---

## Resume context

agamarora.com second-brain v1 is in Phase C close. Phase A synthesis ✅. Phase B build ✅. Phase C reauthor + graph viz ✅ (5/6 sub-tasks). C-graph ✅ — `/wiki/graph/` now serves an authored sky atlas constellation (genesis `agam.arora` at center, 11 organic theme positions, 227 kg.json nodes, 578 corpus deep-field stars, 50 real cross-theme edges, Lissajous drift, big-bang single-origin entry, parallax bg, pan/zoom/fullscreen/mobile, a11y, layered hover visibility — single self-contained 77KB HTML, no external CDN). Working tree clean. HEAD `4dbe07f`. All commits pushed.

What remains: **C-final** (close Phase C with /design-review + /review pass) → **AEO/SEO gate** (BINDING before AI plumbing) → **Phase D** (/enter v3 + groqHandler upgrade) → **Phase E** (launch). ~9-15hr total across 5-6 sessions.

Two recent taste-calls 2026-04-26 to honor:
1. **Drop time-framing.** No "n years of thinking" anywhere on public surfaces — dilutes the authored-atlas signal. Caption stripped, genesis sublabel stripped, DESIGN.md updated.
2. **Graph as wiki entry candidate.** /wiki/graph/ is a strong landing for visitors without the /enter path. Add CTA strip (home, agent, written wiki) so it can serve as a public starting point. Folded into Task 0 below.

---

## Locked artifacts (read before any work)

| Doc | Purpose |
|---|---|
| `docs/plans/second-brain-v1.md` | Canonical site spec |
| `docs/plans/enter-v3.md` | Phase D agent runtime spec (6 LOCKED sections) |
| `docs/plans/enter-v3-scenarios-v2.md` | 23 pinned eval scenarios for /enter v3 |
| `docs/plans/second-brain-v1-phase-c/PHASE-C-DESIGN-PLAN.md` | Phase C plan w/ D1/D2/D3/D6.1 locked decisions + §D2 invariants |
| `docs/plans/second-brain-v1-phase-a/STATUS.md` | Multi-session state (this is the one to update) |
| `docs/plans/second-brain-v1-phase-a/synthesis/ontology-v1.md` | Locked KG source (drives `wiki/kg.json` via `scripts/build-kg.mjs`) |
| `docs/plans/second-brain-v1-phase-a/synthesis/voice-spec.md` | Voice registers + banned LLM-isms + 12 signatures |
| `docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final/_taste-pass-decisions.md` | 21 binding taste calls |
| `docs/aeo-seo-guidelines.md` | AEO/SEO architecture (9 steps + crawl audit) |
| `DESIGN.md` | Site-wide design system + ## Constellation graph subsystem (~250 lines, 13 §D2 invariants) |
| `~/.gstack/projects/agamarora-agamarora/designs/c-graph-20260426/preview.html` | Locked constellation visual contract |
| `CLAUDE.md` | Project rules (subagent model policy, stack, deployment, conventions) |

Hard rules:
- **Never** push to `main` without commit + push protocol after every milestone (per `CLAUDE.md` + STATUS protocol).
- **Never** call subagents with `model: "opus"` — sonnet default, haiku for trivial.
- **Never** edit existing tokens in `DESIGN.md` site-wide section without /design-consultation pass — they're locked across 8+ live v2 pages.
- Honest counts rule: caption / claim values match drawn elements. No "227 nodes" while showing 144.

---

## Pre-flight (run on session start)

```bash
git status --short            # must be clean
git log --oneline -5           # confirm we're at expected HEAD
git pull --ff-only origin main # in case another machine pushed
ls wiki/graph/index.html       # verify last-shipped artifact
node -e "console.log(JSON.parse(require('fs').readFileSync('wiki/kg.json','utf8')).stats)"  # sanity-check kg counts
```

If anything fails, STOP and reconcile state before proceeding.

---

## Task tracker

Pick the first QUEUED row. Mark DONE after commit + push. Bump CHECKPOINT in STATUS.md.

| # | Task | Status | Effort | CHECKPOINT |
|---|---|---|---|---|
| 0 | **Site nav promotion (CV + Wiki + Graph discoverable from every page)** | QUEUED | 60-90 min | (no bump, polish under CP-31) |
| 0a | Graph-as-entry CTAs (intra-graph nav) | QUEUED | 30-45 min | (no bump, polish under CP-31) |
| 1 | C-final — /design-review pass on full wiki | QUEUED | 45-60 min | bump to CP-32 |
| 2 | C-final — /review pass on build pipeline | QUEUED | 30-45 min | (under CP-32) |
| 3 | C-final — fix sweep + STATUS commit (Phase C COMPLETE) | QUEUED | 30 min | CP-32 sealed |
| 4 | AEO-1 — Person schema enrichment on `/` | QUEUED | 15-20 min | (under CP-33) |
| 5 | AEO-2 — `robots` meta directive audit | QUEUED | 10-15 min | |
| 6 | AEO-3 — Q&A overlay on `/wiki/voice/` + `/wiki/quotes/` | QUEUED | 30 min | |
| 7 | AEO-4 — BLUF on Lab PRFAQ pages | QUEUED | 20 min | |
| 8 | AEO-5 — image alt text audit | QUEUED | 15 min | |
| 9 | AEO-6 — `<pre><code>` wrap audit | QUEUED | 10 min | |
| 10 | AEO-7 — TTFB benchmark + record | QUEUED | 15 min | |
| 11 | AEO-8 — bot allowance verification | QUEUED | 15 min | |
| 12 | AEO-9 — /design-review + /review post-AEO regression | QUEUED | 20 min | bump to CP-33 (AEO gate cleared) |
| 13 | AEO crawl audit checklist (Part 5) | QUEUED | 30 min | |
| 14 | D-1 — groqHandler classifier + tier routing | QUEUED | 60 min | (under CP-34) |
| 15 | D-2 — system prompt v3 with cache breakpoint | QUEUED | 30 min | |
| 16 | D-3 — wiki retrieval pipeline + 60s in-memory cache | QUEUED | 30 min | |
| 17 | D-4 — SSE streaming events (trace / token / card / done) | QUEUED | 45 min | |
| 18 | D-5 — abuse defense Tier 0-2 | QUEUED | 60-90 min | |
| 19 | D-6 — eval harness 23 scenarios | QUEUED | 45 min | |
| 20 | D-7 — `/enter` UI v3 SSE handler + card render | QUEUED | 60 min | |
| 21 | D-8 — multi-key Groq rotation | QUEUED | 30 min | |
| 22 | D-9 — `/lab/second-brain/` live-demo section | QUEUED | 30 min | bump to CP-34 (Phase D ready) |
| 23 | E — launch sequence | QUEUED | 2-4 hr | bump to CP-35 = LAUNCHED |

---

## Task 0 — Site nav promotion (CV + Wiki + Graph discoverable site-wide)

**Why (user taste-call 2026-04-26):**
- /wiki/, /wiki/graph/, /wiki/beliefs/ are currently orphaned — no site-wide button leads visitors there.
- Wiki is more powerful than /lab as a positioning artifact (the second brain IS the differentiator).
- Resume should be promoted to top nav (currently only reachable via landing page CTA).
- Resume should be labeled "CV" in nav (shorter, internationally clearer, more confident).

**Current icon-bar (top-left, on every v2 page):**
```
GitHub · LinkedIn · YouTube · Home (⌂)
```
DESIGN.md ## Pages section + ## Shared layout contract document this as locked.

**New icon-bar proposal (commit to this in next session unless user pivots):**
```
GitHub · LinkedIn · YouTube · | · CV · Wiki · Lab · Home (⌂)
```
- GitHub / LinkedIn / YouTube remain (social, leftmost cluster).
- Vertical separator dot or small gap between social cluster and nav cluster.
- CV → /resume (text label, JetBrains Mono uppercase, dim color, hover gold). Probably 11-12px.
- Wiki → /wiki/ (text label).
- Lab → /lab (text label).
- Home (⌂) icon stays rightmost as the safety-net.

Alternative (cleaner): two-row icon-bar at narrow widths — social row + nav row. But probably overkill; horizontal w/ separator is fine.

**Why CV not Resume:** "Resume" reads American + verbose; "CV" reads international + crisp. Aligns with the rest of the site's monospace mono-cap aesthetic (e.g. JetBrains Mono breadcrumbs, kg.json node IDs).

**Mobile (< 768px):** icon-bar already gets tighter. May need to:
- Drop YouTube (least-used social) on narrow
- Or: collapse all nav into a hamburger
- Or: drop the 3 text labels into a small dropdown
- Decision: try keeping all visible w/ 9-10px font + tighter gap first; collapse only if cramped.

**Files touched (this is a SITE-WIDE change — be careful):**
- `index.html` (landing page)
- `enter/index.html`
- `resume/index.html`
- `lab/index.html`
- `lab/<project>/index.html` × N
- `moodboard/index.html`
- `moodboard/aa-mark.html`
- `scripts/build-wiki.mjs` SHARED_HEADER_HTML constant + per-page header overrides (graph page has its own)
- `wiki/graph/index.html` (regenerated from build script)
- `DESIGN.md` ## Shared layout contract section (update spec to reflect new nav)
- `404.html` if it exists

**Approach:**
1. Update SHARED_HEADER_HTML in `scripts/build-wiki.mjs` first; rebuild; verify all wiki pages get the new nav.
2. Update each non-build-managed v2 page (`/`, `/enter`, `/resume`, `/lab`, `/lab/<projects>/`) by hand (per CLAUDE.md "edit pattern: when changing the header, update all v2 pages in one commit").
3. Update `DESIGN.md` ## Shared layout contract to reflect the new nav.
4. Run `/design-review` quick pass to catch any layout breakage.
5. Verify on mobile + desktop via gstack `/browse`.

**Gates:**
- All v2 pages have identical icon-bar markup + style (look for the `=== Shared v2 header ===` comment block in each).
- Mobile: nav still readable < 768px without overlap.
- Click-through works on every link from every page.
- DESIGN.md updated to match.

**Commit message template:**
```
Site nav promotion: CV + Wiki added to top nav on every v2 page

User taste-call 2026-04-26: /wiki/ + /wiki/graph/ were orphaned routes
(no site-wide button led to them). Wiki is more powerful than /lab as a
positioning artifact, and the constellation graph is a strong public
landing without /enter. Resume promoted to top nav as "CV" (international,
crisp, monospace-cap aesthetic).

New icon-bar (every v2 page):
  GitHub · LinkedIn · YouTube · | · CV · Wiki · Lab · Home

Files: SHARED_HEADER_HTML in scripts/build-wiki.mjs (drives all wiki
pages); plus hand updates on /, /enter, /resume, /lab, /lab/<project>/ × N,
/moodboard. DESIGN.md ## Shared layout contract updated.

/design-review pass: no layout regressions on desktop or mobile.
```

---

## Task 0a — Graph-as-entry CTAs (intra-graph nav)

**Why:** /wiki/graph/ is a strong public landing for visitors without the /enter path. Currently has zero navigation CTAs — viewers can click theme stars to navigate, but no obvious "what is this and where do I go?" affordance for first-timers.

**Scope:**
- Add a small CTA strip near bottom-center (or below caption, top-right) with 3 actions:
  - **Read the wiki** → `/wiki/` (theme grid landing)
  - **Talk to the agent** → `/enter` (note: still v2 until Phase D ships; CTA copy should still work)
  - **About** → `/` (home / landing)
- CTA style: matches existing v2 button pattern. JetBrains Mono 11px. Border 1px var(--border-hover). Padding 6-10px. Hover: border + text turn gold.
- Position: small fixed strip, low priority — should not compete with the constellation. One option: bottom-center horizontal strip above aa-mark. Another: top-center under header. Pick one that doesn't crowd existing chrome.
- Mobile: collapse to a single "menu" toggle that expands the 3 CTAs. Or keep horizontal but center-aligned.
- Earn-its-place rule: each CTA must have clear viewer job. "About" might be redundant w/ icon-bar Home button — consider dropping to 2 CTAs (wiki + agent).

**Files touched:**
- `scripts/build-wiki.mjs` — buildGraphPage() function: add CTA strip HTML + CSS
- Run `npm run build` to regenerate `wiki/graph/index.html`

**Gates:**
- /design-review eye-check on desktop + mobile viewports
- CTAs do not overlap existing chrome (icon-bar, fs-btn, caption, legend, aa-mark)
- Viewer can immediately answer "what is this and where do I go?" within 2 seconds of landing

**Commit message template:**
```
C-graph: add CTAs — graph-as-wiki-entry path

Adds 2-CTA strip ("read the wiki" → /wiki/, "talk to the agent" → /enter)
positioned [bottom-center / top-under-header / wherever]. /wiki/graph/ now
serves as a viable public landing for visitors without going through the
/enter path. Mobile: [collapsed pattern].

Per user taste-call 2026-04-26: graph is a great starting point for the
second brain; CTAs make that explicit instead of relying on viewer to
discover the wiki via theme-click.
```

---

## Task 1 — C-final / design-review pass

**Why:** before declaring Phase C COMPLETE, run /design-review against every wiki page to catch visual inconsistencies / AI slop / broken responsive states.

**Scope:**
- Use gstack `/design-review` skill (NOT `/qa` — design-review is the visual-quality gate).
- Pages to review (33 total):
  - `/wiki/` (theme grid)
  - `/wiki/<theme>/` × 11 + `/wiki/root.substance-over-hype/`
  - `/wiki/beliefs/` (landing)
  - `/wiki/beliefs/<slug>/` × 19 (D6.1 principle-cards)
  - `/wiki/voice/`, `/wiki/quotes/`, `/wiki/projects/`, `/wiki/graph/`
- For each: HIGH issues → fix inline, MEDIUM → add to follow-up list, INFORMATIONAL → ignore unless cumulative.

**Files touched:** likely `scripts/build-wiki.mjs` for any cross-page fixes; individual wiki source markdown if content needs adjustment.

**Gates:**
- Zero HIGH issues remaining
- All MEDIUM issues documented in a follow-up file (e.g. `docs/plans/c-final-followups.md`) for v2 polish
- /design-review report committed under `~/.gstack/projects/agamarora-agamarora/reviews/`

**Commit message template:**
```
C-final CP-1: /design-review pass on full wiki tree (33 pages)

Findings: N HIGH (fixed inline), M MEDIUM (deferred to v2 follow-up doc),
K INFORMATIONAL. Pages reviewed: [list]. Fixes applied to [files]. MEDIUM
follow-ups in docs/plans/c-final-followups.md.
```

---

## Task 2 — C-final / review pass on build pipeline

**Why:** Phase C added significant code to `build-wiki.mjs` (graph page is now ~600 lines of inline JS in the build script template). Run /review to catch atomic-write issues, error handling gaps, dead code, type drift, maintainability red flags.

**Scope:**
- Use gstack `/review` skill on:
  - `scripts/build-wiki.mjs` (full file)
  - `scripts/build-kg.mjs`
  - `netlify/functions/groqHandler.mjs` (current state, before D-1 rewrite)
  - `netlify/functions/lib/kg-themes-summary.mjs`
- Fix CRITICAL inline. Defer MEDIUM/LOW to v2.

**Gates:**
- Zero CRITICAL issues remaining
- Build still passes (`npm run build` → 36 pages, no errors)
- /review report committed

**Commit message template:**
```
C-final CP-2: /review pass on build pipeline

Findings: N critical (fixed inline), M maintainability deferred. Files
reviewed: scripts/build-wiki.mjs, scripts/build-kg.mjs, netlify/functions/.
Fixes: [list]. npm run build verified after fixes.
```

---

## Task 3 — C-final fix sweep + STATUS commit

**Scope:**
- If Tasks 1+2 surfaced cross-cutting fixes that need their own commits, ship them as small atomic commits per fix.
- Once clean: bump STATUS.md to **CHECKPOINT 32 = Phase C COMPLETE**.
- Update sub-task table in STATUS.md: C-final row → DONE with commit ref.
- Update top-of-file "Last updated" line to reflect Phase C close.

**Commit message template:**
```
Phase C COMPLETE — STATUS bump to CHECKPOINT 32

C-final closed. /design-review + /review passes done. All wiki pages clean.
Build pipeline reviewed. Working tree clean. Next: AEO/SEO gate (binding
before Phase D AI plumbing).
```

---

## Tasks 4-13 — AEO/SEO gate (BINDING)

**Why:** every wiki page is the AEO surface for "what does Agam think about X" queries from Perplexity / Google AI Overviews / ChatGPT search. Phase D AI plumbing depends on these surfaces being indexed correctly. This is a HARD GATE per user directive 2026-04-26 — do NOT start Phase D until AEO gate is cleared.

**Source:** `docs/aeo-seo-guidelines.md` (full doc).

### Task 4 — AEO-1 Person schema enrichment on `/`

**Scope:** add JSON-LD `@type:Person` to landing page. Fields: name, alternateName, jobTitle, alumniOf, knowsAbout, sameAs (LinkedIn, GitHub, YouTube, Twitter), description, image, url.

**Files:** `index.html` (or wherever the landing template lives).

**Gate:** validate JSON-LD via Google Rich Results Test (URL: search.google.com/test/rich-results).

**Commit message:**
```
AEO-1: Person schema JSON-LD on /

Adds @type:Person markup for AI search engines + rich results. Fields:
name, jobTitle, alumniOf, knowsAbout (12 themes from kg.json), sameAs
(LinkedIn, GitHub, YouTube), description, url.
```

### Task 5 — AEO-2 robots meta directive audit

**Scope:** scan all v2 pages for `<meta name="robots">`. Confirm:
- All public pages: `index, follow`
- `/moodboard` + `/moodboard/aa-mark`: `noindex, follow` (already set per CLAUDE.md)
- `/wiki/kg.json`, `/llms.txt`: explicit `index` (these are the AI-crawler surfaces)

**Files:** all `index.html` pages, run a grep.

**Commit message:**
```
AEO-2: robots meta directive audit + corrections

[N pages had missing/wrong directive — corrected]. Confirmed: all public
v2 pages index+follow, /moodboard remains noindex.
```

### Task 6 — AEO-3 Q&A overlay on /wiki/voice/ + /wiki/quotes/

**Scope:** belief pages already ship Q&A shape via D6.1. Apply lighter Q&A overlay to /wiki/voice/ + /wiki/quotes/:
- /wiki/voice/: add a "What does Agam's voice sound like?" section with the 4 register summaries.
- /wiki/quotes/: structure as "What are Agam's signature lines?" with the curated 50-80 lines.

**Files:** `scripts/build-wiki.mjs` meta-page generation.

**Commit message:**
```
AEO-3: Q&A overlay on /wiki/voice/ + /wiki/quotes/

Lighter Q&A shape than belief pages — single anchor question + structured
answer. Indexable as "what is Agam's voice / signature lines" by AI search.
```

### Task 7 — AEO-4 BLUF executive summary on Lab PRFAQ pages

**Scope:** each Lab project PRFAQ (`/lab/second-brain/`, `/lab/ai-resume/`, `/lab/<other>/`) gets a BLUF (Bottom Line Up Front) summary in first ~50 words. Pattern: "[Project name] is [what]. It does [Y]. Built because [why]."

**Files:** individual `/lab/<project>/index.html` files.

**Commit message:**
```
AEO-4: BLUF executive summary on Lab PRFAQ pages

Each PRFAQ now leads with a 50-word BLUF. AI search engines that snippet
the first paragraph get a complete answer to "what is X" instead of
needing to traverse the whole page.
```

### Task 8 — AEO-5 image alt text audit

**Scope:** scan every `<img>` for descriptive alt. OG images, lab project screenshots, hero images — all need alt that describes content for AI crawlers + screen readers.

**Files:** all pages with `<img>`.

**Commit message:**
```
AEO-5: image alt text audit + fixes

[N images had missing/generic alt. Fixed to descriptive content.] Pages
updated: [list].
```

### Task 9 — AEO-6 `<pre><code>` wrap audit

**Scope:** code blocks on technical pages (PRFAQs w/ code samples, /lab/ai-resume/ paste-prompt, etc.) need proper `<pre><code class="language-X">` wrap so AI crawlers can extract code as code (not prose).

**Commit message:**
```
AEO-6: <pre><code> wrap audit + fixes

[N code blocks missing language class or wrapped only in <code> without
<pre>. Fixed.] Pages updated: [list].
```

### Task 10 — AEO-7 TTFB benchmark

**Scope:** measure Time To First Byte for key pages via Lighthouse + WebPageTest. Document baseline. If TTFB > 600ms, flag for Netlify config investigation. Goal: < 400ms p50.

**Output:** `docs/plans/aeo-ttfb-baseline-2026-04-26.md` with measurements.

**Commit message:**
```
AEO-7: TTFB baseline measurement

Pages: /, /wiki/, /wiki/graph/, /enter, /resume, /lab. Lighthouse + WPT
runs. p50 baseline: Xms. Flag pages > 600ms for follow-up.
```

### Task 11 — AEO-8 bot allowance verification

**Scope:** confirm `robots.txt` + Netlify headers explicitly allow major AI crawlers:
- GPTBot (OpenAI)
- ClaudeBot (Anthropic)
- PerplexityBot
- Anthropic-ai
- Applebot-Extended
- cohere-ai
- Google-Extended

These are the bots /enter v3 will recognize via UA-gate (return static kg.json excerpt). Confirm robots.txt does NOT block them.

**Files:** `robots.txt`, possibly `netlify.toml` headers.

**Commit message:**
```
AEO-8: bot allowance verification

robots.txt confirmed allowing GPTBot, ClaudeBot, PerplexityBot,
Anthropic-ai, Applebot-Extended, cohere-ai, Google-Extended. No netlify
header overrides blocking. Ready for /enter v3 UA-gate behavior.
```

### Task 12 — AEO-9 /design-review + /review regression

**Scope:** AEO additions touched several pages. Run gstack `/design-review` quick pass + `/review` on `scripts/build-wiki.mjs` to catch regressions from Tasks 4-11.

**Commit message:**
```
AEO-9: post-AEO regression review

/design-review + /review pass after AEO gate work. [N issues found, all
fixed.] AEO gate now clean.
```

### Task 13 — Crawl audit checklist (Part 5 of guidelines)

**Scope:** per `docs/aeo-seo-guidelines.md` Part 5:
- robots.txt audit
- noindex tag scan (cross-check with Task 5)
- canonical tag audit (every page has correct `<link rel="canonical">`)
- internal link density (each wiki page links to 4-7 others — already shipped via C-struct cross-link footers)
- breadcrumb + BreadcrumbList JSON-LD on Lab + Resume + Enter pages (currently only wiki has breadcrumb)
- nav link audit (all internal links resolve, no 404s)
- 404 page check (does `/404.html` render correctly + carry the v2 design contract?)

**Commit message:**
```
AEO crawl audit (Part 5) — Phase D entry conditions met

Crawl audit clean. AEO gate CLEARED. STATUS bump to CHECKPOINT 33 =
AEO gate clean. Ready for Phase D /enter v3 work.
```

After this commit: STATUS.md → CHECKPOINT 33 = AEO gate cleared.

---

## Tasks 14-22 — Phase D /enter v3 + groqHandler upgrade

**Source spec:** `docs/plans/enter-v3.md` (6 LOCKED sections) + `docs/plans/enter-v3-scenarios-v2.md` (23 scenarios) + `docs/plans/second-brain-v1.md` §6 + §7.

### Task 14 — D-1 Classifier + tier routing

**Scope:** rewrite `netlify/functions/groqHandler.mjs`:
- Classify query (Groq 8B, 200 tokens, structured JSON output): `{ type: 'lookup'|'synthesis'|'deflect'|'bio', confidence: 0-1, themes_likely: string[] }`
- Route by type:
  - lookup / deflect / bio / low-confidence → Groq 8B (rotate keys)
  - synthesis / multi-hop → DeepSeek V3 (or Mixtral via OpenRouter)
  - Fallback chain on error: Groq 8B → Groq 70B → DeepSeek → Mixtral → Claude Haiku 4.5 cached
- Hard 500ms timeout on classifier; default to lookup on timeout/error.

**Files:** `netlify/functions/groqHandler.mjs`.

**Gate:** locally test 5 queries (lookup / synthesis / deflect / bio / agent-UA) hit the right model path.

**Commit message:**
```
D-1: groqHandler classifier + tier routing

Adds 200-token Groq-8B classifier; routes by intent + confidence + tier.
Cheap-first waterfall: 8B → DeepSeek → Mixtral → Claude Haiku fallback.
Classifier 500ms timeout → default lookup path. Locally smoke-tested
[N] queries.
```

### Task 15 — D-2 System prompt v3

**Scope:** structure prompt with stable cache-breakpoint section:
- STABLE (5min Anthropic cache TTL):
  - Persona rules (per /enter v3 spec §1)
  - Voice calibration: banned LLM-isms, signature patterns
  - Trace vocabulary (allowed verbs)
  - Card schema + limits
  - `<site_map>{site.json}</site_map>`
  - `<knowledge_graph_index>{kg-themes-summary excerpt}</knowledge_graph_index>`
  - 5-10 few-shot examples
- DYNAMIC (per-request, not cached):
  - `<conversation>{last 6 turns}</conversation>`
  - `<retrieved_wiki>{1-3 wiki page full text}</retrieved_wiki>`
  - `<current_query>{user message}</current_query>`

**Files:** `netlify/functions/groqHandler.mjs`, `netlify/functions/lib/kg-themes-summary.mjs` (already exists).

**Commit message:**
```
D-2: system prompt v3 with cache breakpoint

Stable section ~20K tokens: persona + voice + trace vocab + card schema +
site.json + kg.json themes summary + few-shot. Dynamic section:
conversation + retrieved wiki + current query. Cache hit rate target
~85% on warm sessions.
```

### Task 16 — D-3 Wiki retrieval pipeline

**Scope:** on synthesis intent, fetch full text of 1-3 wiki theme pages relevant to `themes_likely` array. In-memory cache per function instance: `Map<theme-slug, { html, ts }>`. 60s TTL. LRU evict at 50 entries.

**Files:** `netlify/functions/groqHandler.mjs`, optionally extract retrieval to `lib/wiki-retrieval.mjs`.

**Commit message:**
```
D-3: wiki retrieval pipeline + 60s in-memory cache

Synthesis queries fetch 1-3 relevant theme page HTMLs from Netlify origin.
LRU cache 50 entries / 60s TTL per function instance. Cache hit
short-circuits the read. WIKI_READ_ENABLED env flag (default 1) gates the
retrieval entirely for kill-switch.
```

### Task 17 — D-4 SSE streaming events

**Scope:** server emits SSE events:
- `event: trace` — one trace line at a time
- `event: token` — answer tokens streaming
- `event: card` — card array at end
- `event: done` — stream complete

Trace format: `{ verb: string, args: object }`. Card schema: `{ type: 'route'|'external'|'action', label, href, slug?, priority?: bool, intent? }`. 2-4 cards per response, exactly 1 with `priority: true`.

**Files:** `netlify/functions/groqHandler.mjs`.

**Commit message:**
```
D-4: SSE streaming events (trace/token/card/done)

Server emits structured events per /enter v3 spec §3. Trace lines
authored by model via structured-output prompt. Cards array always
includes 1 priority + 1-3 supporting per intent→card mapping.
```

### Task 18 — D-5 Abuse defense Tier 0-2

**Scope:** per `docs/plans/second-brain-v1.md` §7:

- Tier 0 (always on, $0):
  - UA gate (return static kg.json excerpt for AI crawler UAs)
  - Input validation (msg length 0-500 chars, conv tokens ≤ 4000, turns ≤ 6)
  - Duplicate-query cache (60s TTL Map per instance)
  - Injection filter (existing sandwich defense kept)
- Tier 1 (Upstash Redis free tier):
  - Per-IP bucket: 30 q/h sliding window
  - Low-effort gate: msg ≤ 3 words OR known-spam → force 8B path
  - Multi-key Groq rotation (3-4 keys, 60s cool-down on 429) — see Task 21
- Tier 2 (budget ceilings):
  - Daily spend cap: $3/day
  - Monthly cap: $30/month
  - Per-query cost cap: $0.05
  - `CLAUDE_DISABLED=1` → no Claude calls
  - `LLM_DISABLED=1` → no LLM at all (static fallback)

Upstash failure modes: rate limit fail open, spend counter fail closed.

**Files:** `netlify/functions/groqHandler.mjs`, `lib/abuse-defense.mjs`, `lib/upstash-client.mjs`.

**Env vars:** `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN`, `GROQ_KEY_1..4`, `DEEPSEEK_API_KEY`, `OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY`.

**Commit message:**
```
D-5: abuse defense Tier 0-2

T0: UA gate, input validation, dup cache, injection filter.
T1: Upstash per-IP bucket (30q/h), low-effort gate, multi-key Groq.
T2: spend caps daily $3 / monthly $30 / per-query $0.05. Kill switches
CLAUDE_DISABLED + LLM_DISABLED. Fail-open rate, fail-closed spend.
```

### Task 19 — D-6 Eval harness 23 scenarios

**Scope:** extend `eval-prompt.mjs` to run the 23 pinned scenarios from `enter-v3-scenarios-v2.md`:
- T01-T12: theme-anchor lookup
- C01-C06: cross-theme synthesis
- M01-M02: meta queries (about Agam, the wiki)
- X01-X03: deflect/edge

Each scenario pins: expected classifier output, expected trace pattern (verbs + arg shapes), expected card set (priority + supporting, order-invariant), voice markers present/absent.

Pass criteria: 23/23 for ship.

**Files:** `eval-prompt.mjs` (extend), `eval-scenarios.json` (data).

**Commit message:**
```
D-6: eval harness — 23 pinned scenarios

Extended eval-prompt.mjs to run T01-T12, C01-C06, M01-M02, X01-X03.
Each scenario validates: classifier intent + confidence threshold, trace
verb pattern, card set (priority + supporting, order-invariant), voice
markers (banned absent, signature present).
```

### Task 20 — D-7 /enter UI v3

**Scope:** update `enter/index.html` front-end to consume the new SSE events:
- Render trace lines with 150ms client-side stagger
- Stream answer tokens to the conversation pane
- Render card array as horizontal scroll strip (or grid on wide viewport)
- Priority card gets gold-accent stripe

Keep keyboard background, conversation memory, existing v2 visual contract.

**Files:** `enter/index.html`.

**Commit message:**
```
D-7: /enter UI v3 SSE handler + card render

Front-end now consumes server-emitted trace/token/card/done events.
Trace stagger 150ms client-side. Cards rendered as horizontal scroll
strip; priority card gets gold-accent stripe. Conversation memory +
keyboard background unchanged.
```

### Task 21 — D-8 Multi-key Groq rotation

**Scope:** 3-4 `GROQ_KEY_N` env vars in Netlify dashboard. Round-robin per request. On 429: mark cool-down 60s, move to next. Effective free-tier capacity: 4x single-key limits.

**Files:** `lib/groq-client.mjs` (key pool + rotation logic).

**Commit message:**
```
D-8: multi-key Groq rotation

Pool of 4 GROQ_KEY_N env vars. Round-robin per request. 60s cool-down
on 429. Removes single-key rate limit as a spend trigger; hits Groq
free-tier ceiling 4x slower.
```

### Task 22 — D-9 /lab/second-brain/ live-demo section

**Scope:** add a "Live demo" section to the existing `/lab/second-brain/` PRFAQ page. Embed a small CTA strip linking to `/wiki/` + `/wiki/graph/` + `/enter` (note: phase D /enter v3 must be live before this section ships). Optionally embed a 30s screen-recording or interactive embed.

**Files:** `lab/second-brain/index.html`.

**Commit message:**
```
D-9: /lab/second-brain/ live-demo section

PRFAQ now has a "Live demo" block linking to the second-brain wiki +
constellation graph + agent. Phase D /enter v3 dependency: confirmed
live before this section published.
```

After D-9: STATUS.md → CHECKPOINT 34 = Phase D ready. 23/23 eval pass on production = launch gate met.

---

## Task 23 — Phase E launch sequence

**Source:** `docs/plans/second-brain-v1.md` §8.

**Scope (do in one sitting):**
1. `git status --short` clean on main
2. Smoke test on production /enter v3 (5 queries: lookup / synthesis / deflect / bio / agent-UA)
3. Run full 23-scenario eval against production. **23/23 or abort + rollback.**
4. Push thesis post at `/writing/second-brain-live/` (Task #5 from canonical spec — flag if not yet drafted; may need a separate session for thesis writing).
5. Verify OG tags + sitemap.xml + robots.txt updated.
6. Publish thesis on Medium.
7. Cross-post to LinkedIn long-form.
8. Share in: LinkedIn personal post, AI-PM Slack/Discord communities, relevant Twitter.
9. Monitor first 24h: Netlify function logs, Upstash rate-limit hits, spend counter. Kill-switch ready (`CLAUDE_DISABLED=1` if abuse).

**Rollback plan:** revert commits on main → Netlify redeploys previous build → /enter v2 still works from last good commit.

**Commit message:**
```
Phase E LAUNCH — second-brain v1 live

Thesis published on Medium + LinkedIn. /enter v3 live on production.
23/23 eval pass. Monitoring active. Kill-switches ready.
STATUS bump to CHECKPOINT 35 = LAUNCHED.
```

---

## Cross-cutting reminders

- **Push protocol:** `git push origin main` after every commit (per CLAUDE.md + STATUS protocol).
- **Subagent rule:** `model: "sonnet"` default; `model: "haiku"` only for trivial single-step tasks; **never** opus.
- **Caveman mode + auto mode:** stay terse in chat; commit messages + spec docs stay normal voice.
- **Honest counts:** caption / claim values must match drawn elements. Caption format: `578+ entries · 227 graph nodes · 224 edges` — NO time-framing.
- **DESIGN.md is locked:** site-wide tokens (gold #E5A54B, near-black, Satoshi/JetBrains Mono/Patrick Hand) are not editable without /design-consultation. ## Constellation graph subsection is the binding spec for `/wiki/graph/`.
- **STATUS.md updates:** after every task completion, update the sub-task table + bump the checkpoint number + commit.
- **Failures:** if any /design-review or /review pass surfaces a HIGH issue that's bigger than 30 min to fix, STOP and report back to user — don't burn the next-session budget on a side-quest.
- **Eval gate:** Phase E launch is blocked by 23/23 eval pass. If only 22/23 pass, fix the failing scenario before launch, even if it pushes launch by a session.

---

## Final note for next-session Claude

The user has invested significant taste-calibration into this project. Bias toward:
- **Density visible** (not hidden — corpus density IS the flex).
- **Authored geometry** (no force-physics, no perfect circles, no straight spokes — universe + neurons aren't perfect).
- **Real connections only** (every drawn edge traces to kg.json or a derived corpus link).
- **Layered visibility** (most dim at rest, light up on engagement).
- **Person-as-anchor** (root = `agam.arora`, not abstract dispositions).
- **Mobile first-class** (not fallback).
- **Single-origin entry** (everything expands from one point).
- **No time-framing** ("n years" was dropped 2026-04-26).
- **Earn-its-place** for every visible text element.

When uncertain, prefer organic + layered + dense + honest + earn-its-place over symmetric + static + sparse + claimed + decorative.

Good luck. Ship it.
