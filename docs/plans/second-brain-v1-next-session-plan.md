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

**Dev + eval workflow LOCKED 2026-04-27:** all `/enter` work uses `docs/plans/phase-d-dev-workflow.md`. netlify dev (port 8888) + gstack browser headed + drive real `/enter` UI for every change AND every eval scenario. No function-only smoke as the sole signal — D-1 shipped a streaming hang that only end-to-end UI testing surfaced.

**CEO scope expansion LOCKED 2026-04-27 (post D-1):** /plan-ceo-review surfaced two gaps — UI plan undershot the variant exploration; KG was a publishing artifact not agent memory at runtime. EXPANSION mode taste-pass: 6/6 proposals accepted. New tasks D-7a (variant land + mockup), D-3a (KG edge runtime injection), D-9a (synthesis confidence retry). D-4 + D-6 + D-7 scopes raised. CEO plan: `~/.gstack/projects/agamarora-agamarora/ceo-plans/2026-04-27-phase-d-expansion.md`. Total CC time delta: +3-4hr Phase D. **Decisions 13-15** appended to `phase-d-decisions-2026-04-27.md`.

**Eng review CLEARED 2026-04-27 (post CEO + Design):** /plan-eng-review locked 3 architectural calls (Decisions 16-18) + 3 code-quality calls (CQ-1 voice-rules.mjs, CQ-2 invokeSynthesisJson, CQ-3 timing.mjs). 32 unit + 13 eval/E2E test gaps mapped. 1 critical failure mode flagged for impl: Mistral SSE parse error handling. Three parallel CC lanes feasible (Lane A backend, Lane B defense, Lane C UI) — wallclock ~5.5hr vs ~10-14hr sequential. Test plan artifact: `~/.gstack/projects/agamarora-agamarora/Agam-main-eng-review-test-plan-2026-04-27.md`. Full eng review: `~/.claude/plans/sequential-hugging-mango.md` ## ENG REVIEW OUTPUT.

**EXECUTION READY (start fresh session):** all reviews CLEARED. Phase D implementation can begin. Pickup at Task 15 D-2 (system prompt v3) per critical-path table. Run `netlify dev` + gstack browser headed before any /enter change per `phase-d-dev-workflow.md`.

---

## Resume context

**UPDATED 2026-04-27 (post-eng-review + decisions taste-pass).**

agamarora.com second-brain v1 is **pre-Phase-D**. Phase A synthesis ✅. Phase B build ✅. Phase C reauthor + graph viz ✅ (CP-32). AEO/SEO gate ✅ CLEARED (CP-33, 14 tasks shipped). Graph polish ✅ (CP-33b). Working tree clean. HEAD on main.

**Decisions LOCKED 2026-04-27 via taste-pass:** see `docs/plans/phase-d-decisions-2026-04-27.md` (12 architectural calls), `docs/plans/enter-agent-decisions-index.md` (canonical front door), and amendments to `second-brain-v1.md` §6 + §7, `enter-v3.md` (top section).

**Provider stack:** Groq pool {KEY, KEY_2, KEY_3} → Mistral pool {KEY, KEY_2} → static fallback. Both free tier. NO cost tracking, NO spend caps. Defense = rate limit only (browser 1 q/2s + per-IP 60 q/h + burst 5/10s) plus Tier 0 (UA gate, input val, dup cache, injection filter).

**What remains:** Tasks 0 + 0a (site nav promotion + graph CTAs, optional polish) → **Phase D** (Tasks 14a + 14-22 per locked decisions) → **Phase E** (launch). ~6-10hr total Phase D + E across 2-3 sessions.

Two recent taste-calls 2026-04-26 still in effect:
1. **Drop time-framing.** No "n years of thinking" anywhere on public surfaces.
2. **Graph as wiki entry candidate.** /wiki/graph/ is a strong public landing.

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
| 0 | Site nav promotion (CV + Wiki + Graph discoverable from every page) | QUEUED (optional polish) | 60-90 min | (no bump) |
| 0a | Graph-as-entry CTAs (intra-graph nav) | QUEUED (optional polish) | 30-45 min | (no bump) |
| 1-3 | C-final — /design-review + /review + STATUS bump | ✅ DONE | — | CP-32 |
| 4-13 | **AEO/SEO gate — 14 tasks (Person schema, robots, Q&A, BLUF, alt text, pre/code, TTFB, bots, FAQPage+HowTo, view-source, comparison tables, evidence outbound, regression sweep, crawl audit)** | ✅ DONE | — | CP-33 |
| 13b | Graph hover/spokes refinement + sitemap refresh + build-clobber lesson | ✅ DONE | — | CP-33b |
| 13c | Phase D decisions taste-pass + spec amendments | ✅ DONE | — | CP-33c |
| 14a | **D-0 — wiki extracts build script (NEW)** | ✅ DONE (71fc6ed) | — | (under CP-34) |
| 14 | D-1 — LLM pool + classifier + pre-route + provider routing | ✅ DONE (2b82f9d, fix 45fc06b) | — | |
| 14b | **D-7a — variant land + locked visual mockup at `enter/v3-mockup.html`** | ✅ DONE (pending push) | — | unblocks D-7 |
| 15 | D-2 — system prompt v3 with cache breakpoint | QUEUED | 30 min | |
| 15a | **D-3a — KG edge bundle build + retrieval injection (NEW per CEO review)** | QUEUED | 60 min | precedes D-3 |
| 16 | D-3 — wiki extracts integration (now incl. edges from 15a) | QUEUED | 15 min | |
| 17 | D-4 — SSE encoder + 1-call structured output + **real trace from logs** | QUEUED | 60 min | scope-up per CEO P4 |
| 18 | D-5 — abuse defense Tier 0-1 (Tier 2 dropped) | QUEUED | 60-75 min | |
| 19 | D-6 — eval harness 23 + **3-4 multi-turn + visual asserts in headed gstack browser** | QUEUED | 90 min | scope-up per CEO P6 |
| 20 | D-7 — `/enter` UI v3 — **full visual contract from D-7a mockup** + SSE handlers + throttle + retry banner | QUEUED | 120 min | scope-up per CEO P1 |
| 20a | **D-9a — synthesis confidence retry (NEW per CEO review, bounded 1 retry)** | QUEUED | 30 min | precedes D-9 |
| 21 | ~~D-8 multi-key Groq rotation~~ — DROPPED, folded into D-1 | DROPPED | — | |
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

**Scope:** belief pages already ship Q&A shape via D6.1. Apply lighter Q&A overlay to /wiki/voice/ + /wiki/quotes/. Per Reddit AEO consensus 2026-04-27, the canonical extractable pattern is:
- **H2 = the question** (literal interrogative)
- **First paragraph = 40-60 word direct answer**
- **Bullets / table = supporting detail**

Apply this shape to:
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

**Scope:** each Lab project PRFAQ (`/lab/second-brain/`, `/lab/ai-resume/`, `/lab/<other>/`) gets a BLUF (Bottom Line Up Front) summary in first 150 words. Per Reddit AEO consensus: the first 150 words must work as a standalone snippet that fully answers "what is X." Pattern: "[Project name] is [what]. It does [Y]. Built because [why]." plus 1-2 bullet outcomes.

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

### Task 12.1 — AEO-10 FAQPage + HowTo JSON-LD schema (Reddit research 2026-04-27)

**Scope:** add structured-data schemas to FAQ-shaped + how-to-shaped content:
- `FAQPage` JSON-LD on every page with Q&A shape:
  - 19 belief pages (`/wiki/beliefs/<slug>/`) — TLDR + How to apply + What this is not + Argues against → `Question/Answer` pairs
  - `/wiki/voice/` — "What does Agam's voice sound like?" + register summaries
  - `/wiki/quotes/` — "What are Agam's signature lines?" + curated lines
  - Lab PRFAQs (`/lab/<project>/`) — existing FAQ sections
- `HowTo` JSON-LD on:
  - `/lab/ai-resume/` — setup-prompt as HowTo with `step` array (clone repo / paste system prompt / run / iterate)
  - `/lab/second-brain/` — paste-prompt as HowTo

**Pattern (FAQPage):**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the agent-first thesis?",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

**Files:** `scripts/build-wiki.mjs` (belief + voice + quotes builders), individual `/lab/<project>/index.html`.

**Gate:** validate via Google Rich Results Test on 3 sample pages.

**Commit message:**
```
AEO-10: FAQPage + HowTo JSON-LD schema

19 belief pages + voice + quotes + lab PRFAQs ship FAQPage schema.
Lab how-to pages (ai-resume, second-brain) ship HowTo schema with step
arrays. Per Reddit AEO research: FAQPage is the #1 cited extraction win.
Validated 3 samples in Rich Results Test.
```

### Task 12.2 — AEO-11 raw-HTML answer-early-in-DOM audit

**Scope:** open `view-source:https://agamarora.com/<page>` for each public page and verify:
- Headline answer appears within first 150 words of raw HTML
- No JS-rendered content above the fold (lead text must be in initial DOM)
- No hidden divs / `display: none` carrying core answer content
- No `aria-hidden=true` on the lead

**Pages:** `/`, `/wiki/`, `/wiki/<theme>/` (sample 3), `/wiki/beliefs/<slug>/` (sample 3), `/wiki/voice/`, `/wiki/quotes/`, `/lab/<project>/` (sample 2), `/resume/`. **Excludes** `/wiki/graph/` (legitimately JS-rendered, has fallback `<noscript>` block per Phase D plan).

**Output:** quick checklist in commit body.

**Commit message:**
```
AEO-11: raw-HTML answer-early-in-DOM audit

view-source: check on 12 pages. All confirm headline answer appears in
raw HTML within first 150 words. No JS-only lead content. /wiki/graph/
exempt (constellation viz, has <noscript> fallback). Per Reddit AEO
consensus: bots only read raw DOM text.
```

### Task 12.3 — AEO-12 dateModified + datePublished on Article schemas

**Scope:** every wiki Article JSON-LD on `/wiki/<theme>/` + `/wiki/beliefs/<slug>/` needs:
- `datePublished` from frontmatter (or fallback: oldest git commit touching the file)
- `dateModified` from latest `git log -1 --format=%cI <source-file>`

Build script reads git history at build time. Freshness is an AEO ranking signal.

**Files:** `scripts/build-wiki.mjs` Article schema emitter, frontmatter parser.

**Commit message:**
```
AEO-12: dateModified + datePublished on wiki Article schemas

Build script now reads git log for each source draft to populate
dateModified. datePublished from frontmatter where present, fallback
to oldest git touch. Freshness signals improve AEO ranking per Reddit
research.
```

### Task 12.4 — AEO-13 post-deploy AI search QA (expanded per goose-aeo framework)

**Scope:** after Tasks 4-12.3 ship, query representative prompts in each of: Perplexity, Bing Copilot, ChatGPT search, Claude.ai, Gemini, Grok. Document mention metrics + source citations.

**Framework upgrade (goose-aeo learnings 2026-04-27):**
Instead of binary "did it surface," capture per provider:
- **Mention rate** — % of prompts where agamarora.com (or "Agam Arora") appears
- **Prominence score** — order/position of mention in answer (1st = high, last = low)
- **Share of voice** — % of cited sources that are agamarora.com vs others
- **Source citations** — which page (wiki/<theme>, /lab/<project>, etc.) gets cited

**Prompt set (~15 prompts across 4 categories):**

*Person identity (3):*
1. "Who is Agam Arora AI product manager"
2. "Agam Arora AIonOS background"
3. "Agam Arora portfolio"

*Theme alignment (8 — one per major theme):*
1. "agent-first thesis AI products"
2. "voice AI 90% production reality"
3. "AI PM should we vs can we framework"
4. "second brain context layer for AI agents"
5. "spec-first vs sprint-first product development"
6. "breadth as differentiation AI engineering"
7. "enterprise AI ships vs demos"
8. "LinkedIn as instrument career"

*Comparison / vs queries (2):*
1. "AI PM vs traditional PM differences"
2. "agent-first vs human-first AI products"

*Long-tail discovery (2):*
1. "personal site authored constellation knowledge graph"
2. "AI product manager second brain wiki"

**Output:** `docs/plans/aeo-search-qa-2026-04-XX.md` with per-prompt × per-provider table:

| Prompt | Provider | Mentioned? | Prominence | Source page |
|---|---|---|---|---|

Plus aggregate: mention rate per provider, share of voice, weak prompts (zero mention), source-page distribution (which pages get cited most).

**Re-test cadence:** after first crawl cycle (7-14 days post-deploy). Then quarterly.

**Commit message:**
```
AEO-13: post-deploy AI search QA — 5 prompts × 4 engines

Documented surfacing on Perplexity / Bing Copilot / ChatGPT search /
Claude.ai. [N/20] prompts surfaced agamarora.com pages. Re-test in
7-14 days post-crawl.
```

### Task 12.6 — AEO-15 Comparison content surfaces (goose-aeo learning)

**Why:** goose-aeo audit framework lists "Comparison Content" as one of 6 AI-search readiness dimensions. AI engines surface vs/comparison pages disproportionately for "X vs Y" queries — which are common discovery prompts. Currently agamarora.com has zero explicit comparison content.

**Scope:** add 2-3 lightweight comparison surfaces. Not a marketing growth play — just AEO-extraction surface for queries like "AI PM vs traditional PM" or "agent-first vs human-first." Existing wiki content already implicitly compares (e.g. agent-first thesis is anti-human-first); pull the comparisons out into explicit Q&A blocks.

**Surfaces:**
1. `/wiki/agent-first/` — already has "What this is not" + "Argues against" sections. Add an explicit `<table>` row "Agent-first vs Human-first." Frames the comparison as data.
2. `/wiki/spec-first-taste/` — same pattern: "Spec-first vs Sprint-first." Already implicit; surface explicit table.
3. `/wiki/ai-pm-skillset/` — "AI PM vs Traditional PM" comparison table.

**Pattern:** simple HTML table with 2-3 columns (Aspect | This | That) + 4-6 rows. Followed by 1-paragraph synthesis. Tables outperform paragraphs in AI extraction per Reddit AEO consensus + goose-aeo dimension scoring.

**Files:** `scripts/build-wiki.mjs` theme builders OR direct edits to source drafts in `docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final/`.

**Effort:** ~45min for 3 tables.

**Commit message:**
```
AEO-15: comparison content surfaces (goose-aeo learning)

3 wiki theme pages get explicit comparison tables: agent-first vs
human-first (/wiki/agent-first/), spec-first vs sprint-first
(/wiki/spec-first-taste/), AI PM vs traditional PM (/wiki/ai-pm-skillset/).
HTML tables outperform paragraphs in AI extraction; goose-aeo audit
framework counts comparison content as 1 of 6 AI-search readiness
dimensions.
```

### Task 12.5 — AEO-14 Evidence-citation outbound links on belief pages

**Scope:** belief page Evidence drawer currently has dated facts but no outbound link. Per Reddit AEO research (OneFunder thesis): unique facts cited verbatim with a link beat paraphrasable paragraphs. Each Evidence row should include outbound URL where verifiable:
- LinkedIn post permalinks for 2018-2025 corpus citations
- GitHub repo URLs for project references
- Public talk links for conference references

Where no public source exists, leave the date-only fact as is (private corpus citations).

**Files:** `docs/plans/second-brain-v1-phase-a/synthesis/belief-deep-dives/*.md` (source drafts), `scripts/build-wiki.mjs` (Evidence row renderer).

**Commit message:**
```
AEO-14: Evidence-citation outbound links on belief pages

Belief page Evidence drawer rows now include outbound URL where source
is publicly verifiable (LinkedIn permalink, GitHub repo, talk video).
[N rows] linked, [M rows] kept date-only (private corpus). Per Reddit
AEO consensus: linked unique facts get cited verbatim by AI engines.
```

---

### Task 13 — Crawl audit checklist (Part 5 of guidelines)

**Scope:** per `docs/aeo-seo-guidelines.md` Part 5:
- robots.txt audit
- noindex tag scan (cross-check with Task 5)
- canonical tag audit (every page has correct `<link rel="canonical">`)
- internal link density (each wiki page links to 4-7 others — already shipped via C-struct cross-link footers)
- breadcrumb + BreadcrumbList JSON-LD on Lab + Resume + Enter pages (currently only wiki has breadcrumb)
- nav link audit (all internal links resolve, no 404s)
- 404 page check (does `/404.html` render correctly + carry the v2 design contract?)
- view-source: check (cross-reference with AEO-11): confirm answer text in raw HTML on 5 spot-checked pages
- DOM bloat audit: no hidden divs / oversized inline scripts above the fold (constellation graph page exempt)

**Commit message:**
```
AEO crawl audit (Part 5) — Phase D entry conditions met

Crawl audit clean. AEO gate CLEARED. STATUS bump to CHECKPOINT 33 =
AEO gate clean. Ready for Phase D /enter v3 work.
```

After this commit: STATUS.md → CHECKPOINT 33 = AEO gate cleared.

---

## Tasks 14-22 — Phase D /enter v3 + groqHandler upgrade

**Source specs:**
- `docs/plans/enter-v3.md` (6 LOCKED sections + 2026-04-27 amendments at top)
- `docs/plans/enter-v3-scenarios-v2.md` (23 scenarios)
- `docs/plans/second-brain-v1.md` §6 + §7 (rewritten 2026-04-27)
- `docs/plans/phase-d-decisions-2026-04-27.md` (12 locked architectural calls)
- `docs/plans/enter-agent-decisions-index.md` (canonical front door)

**Architectural decisions baked in (from 2026-04-27 taste-pass):**
- Single `lib/llm-pool.mjs` driver (collapses old D-1 + D-8 into one)
- Groq pool {KEY, KEY_2, KEY_3} round-robin + Mistral pool {KEY, KEY_2} fallback
- Wiki extracts bundled at build time (no HTTP fetch)
- Single-call structured output for SSE
- Classifier pinned: `llama-3.1-8b-instant`, temp 0, enum-validated `themes_likely[]`
- Heuristic pre-routing in v1
- Upstash-persisted Groq cooldown w/ module-memory fallback
- Tier 2 spend caps DROPPED (free-tier model)
- Browser throttle 1 q / 2s + per-IP 60 q/h + burst 5/10s
- Eval gate Groq-only
- `node --test` runner
- Two Upstash projects (primary + backup) for HA, eviction `allkeys-lru`

### Task 14a — D-0 Wiki extracts build script (NEW)

**Scope:** new `scripts/build-wiki-extracts.mjs` that walks wiki theme pages and emits plain-text section content (Core belief / How it formed / What it implies / Tension / Open question) per theme into `netlify/functions/lib/wiki-extracts.json`. Function imports JSON at module init; no HTTP fetch at request time.

**Files:** `scripts/build-wiki-extracts.mjs` (NEW), `netlify/functions/lib/wiki-extracts.json` (build artifact, gitignored or committed — choose committed for Netlify deploy).

**Update:** `package.json` `build` script chains `npm run build:kg && npm run build:wiki && npm run build:wiki-extracts`.

**Gate:** `wiki-extracts.json` exists, contains all 13 theme slugs, parsed plain-text per section, total ~50KB.

**Commit message:**
```
D-0: wiki-extracts build script + JSON bundle

scripts/build-wiki-extracts.mjs walks wiki/<theme>/index.html, extracts
plain-text section content per theme (Core belief / How it formed /
What it implies / Tension / Open question / Evidence). Emits
netlify/functions/lib/wiki-extracts.json (~50KB). Function imports at
module init; no HTTP fetch, no LRU cache, no race dedup.

Per phase-d-decisions-2026-04-27.md Decision 2 (bundle wiki extracts).
```

### Task 14 — D-1 LLM pool + classifier + pre-route + provider routing

**Scope:** rewrite `netlify/functions/groqHandler.mjs` as orchestration only (~200 LOC). All LLM logic in `lib/llm-pool.mjs`.

**`lib/llm-pool.mjs` (NEW):**
- Groq pool: `[GROQ_API_KEY, GROQ_API_KEY_2, GROQ_API_KEY_3]`. Round-robin cursor seeded `(Date.now()/1000) % 3` on cold start.
- Mistral pool: `[MISTRAL_API_KEY, MISTRAL_API_KEY_2]`. Same round-robin pattern.
- Cool-down state: read from Upstash key `cooldown:{provider}:{keyId}` before invoke; write on 429 with TTL = max(60s, Retry-After). On Upstash error → fall back to module-memory `Map`. Logs `upstash_cooldown_fallback`.
- Per-Groq-key 4-model fallback chain (synthesis path): `llama-3.1-8b-instant → qwen3-32b → gpt-oss-20b → llama-3.3-70b-versatile`. Try next model on non-429 error; jump to next key on 429.
- Mistral path: pinned `mistral-small-latest` (currently `mistral-small-2506`). No model fallback within Mistral.
- Classifier path: PINNED `llama-3.1-8b-instant`, temp 0, JSON mode, no model fallback. On 429 → try next Groq key. On all 3 keys cooled → default to `lookup` path (don't call Mistral for classifier).
- Buffer first 50 chars of stream before flushing for clean mid-stream provider failover.
- Normalized error envelope: `{ kind: 'rate_limit' | 'timeout' | 'server_error' | 'unknown', retryAfterMs?, status? }`.

**`lib/classifier.mjs` (NEW):**
- `preRoute(message)` heuristic: greetings → lookup, off-topic → deflect, direct theme keyword → synthesis (with extracted slug). Else returns null.
- `classify(message)` calls pool via pinned model. 800ms timeout. Validates `themes_likely[]` against `THEME_SLUGS_SET` (drop unknowns, log `classifier_invalid_slug`). Empty after dropping AND type was synthesis → downgrade to lookup. On timeout/error → default `{type: 'lookup', confidence: 0, themes_likely: []}`.

**`lib/themes-enum.mjs` (NEW):**
- `THEME_SLUGS = KG_THEMES_SUMMARY.map(t => t.slug)`, `THEME_SLUGS_SET = new Set(THEME_SLUGS)`. Single source for classifier validation, eval pins, card slug validators.

**`groqHandler.mjs` (rewrite):**
- Top-of-file ASCII flow diagram (per eng review CQ8).
- Orchestration: corsHeaders → method check → tier 0 → tier 1 → preRoute → classify (if not preRouted) → wiki extracts lookup → build prompt → pool.invoke → SSE encode → emit.

**Files:** `netlify/functions/groqHandler.mjs` (rewrite), `lib/llm-pool.mjs` (NEW), `lib/classifier.mjs` (NEW), `lib/themes-enum.mjs` (NEW), `lib/constants.mjs` (NEW: COOLDOWN_MS, CLASSIFIER_TIMEOUT_MS=800, RATE_LIMIT_PER_HOUR=60, BURST_LIMIT=5, BURST_WINDOW_MS=10_000, BUFFER_FIRST_CHARS=50).

**Gate:** unit tests pass (`npm test`); 5 smoke queries (lookup/synthesis/deflect/bio/UA-gate) hit correct path; classifier slug validation logged on synthetic invalid input.

**Commit message:**
```
D-1: LLM pool + classifier + pre-route + provider routing

Single lib/llm-pool.mjs driver consolidates Groq pool {KEY,KEY_2,KEY_3}
+ Mistral pool {KEY,KEY_2}. Cool-down state in Upstash w/ module-memory
fallback. Round-robin cursor seeded on cold start.

Classifier pinned llama-3.1-8b-instant temp 0 JSON mode, 800ms timeout,
themes_likely[] enum-validated against THEME_SLUGS_SET (drops unknowns,
logs classifier_invalid_slug). Closes critical hallucinated-slug gap.

Heuristic preRoute() pulled forward to v1: greetings/deflects/direct
theme keywords skip classifier (~80% queries, ~300-500ms saved).

Buffer first 50 chars before flushing stream for clean mid-stream
provider failover (Groq → Mistral invisible to user).

Per phase-d-decisions-2026-04-27.md Decisions 1, 4, 5, 6, 9.
Old D-8 standalone task collapsed into this one.
```

### Task 15 — D-2 System prompt v3

**Scope:** structure prompt with stable cache-breakpoint section. Note: spec's earlier "Anthropic 5min cache TTL" language is obsolete (Anthropic dropped). Cache hit rate target now applies to Mistral prefix cache (GA on Small/Medium) and Groq per-model where supported.

- STABLE (~10-12K tokens, cacheable on supporting providers):
  - Persona rules (per `enter-v3.md` §1)
  - Voice calibration (registers + banned LLM-isms from `voice-spec.md`)
  - Trace verb vocabulary (per `enter-v3.md` §5)
  - Card schema + limits (per `enter-v3.md` §4)
  - `<site_map>` from `site.json`
  - `<knowledge_graph_index>` from `KG_THEMES_SUMMARY`
  - 5-10 few-shot examples (one per representative scenario class)
- DYNAMIC (per-request, ~2-5K tokens, not cached):
  - `<conversation>` last 6 turns (token-truncated to 4000 max)
  - `<retrieved_wiki>` 1-3 theme extracts from bundled `wiki-extracts.json`
  - `<current_query>` user message

**Files:** `netlify/functions/lib/prompts/system-stable.mjs` (NEW), `lib/prompts/few-shot.mjs` (NEW), `lib/prompts/classifier-prompt.mjs` (NEW).

**Commit message:**
```
D-2: system prompt v3 with cache breakpoint

Stable section ~10-12K tokens: persona + voice + trace vocab + card
schema + site.json + KG_THEMES_SUMMARY + 5-10 few-shot. Dynamic section
~2-5K tokens: conversation + retrieved wiki extracts + current query.

Anthropic cache language dropped (Anthropic deferred). Cache target
applies to Mistral prefix cache + Groq per-model where supported.
```

### Task 16 — D-3 Wiki extracts integration (REPLACED)

**Scope:** integrate `wiki-extracts.json` (built in Task 14a) into the prompt building pipeline. No HTTP fetch, no cache, no race dedup.

```js
// lib/wiki-retrieval.mjs (NEW, ~30 LOC)
import EXTRACTS from './wiki-extracts.json' assert { type: 'json' };

export function getThemeExtract(slug) {
  return EXTRACTS[slug] ?? null;
}
export function getThemeExtracts(slugs) {
  return slugs.map(getThemeExtract).filter(Boolean);
}
```

`WIKI_READ_ENABLED=0` env flag bypasses extracts → agent works from `KG_THEMES_SUMMARY` one-liners only.

**Files:** `netlify/functions/lib/wiki-retrieval.mjs` (NEW).

**Commit message:**
```
D-3: wiki extracts integration (bundled, no fetch)

Reads from bundled netlify/functions/lib/wiki-extracts.json (Task 14a).
No HTTP fetch, no LRU cache, no race dedup. WIKI_READ_ENABLED=0 falls
back to KG_THEMES_SUMMARY one-liners only.

Per phase-d-decisions-2026-04-27.md Decision 2.
```

### Task 17 — D-4 SSE encoder + single-call structured output

**Scope:** new `lib/ssestream.mjs` exporting `encodeSSE(event, data)` and `sse(stream, origin)` response helper.

Single LLM call returns JSON `{trace: [...], answer: string, cards: [...]}`. Server parses, emits events sequentially:
- `event: trace` — each trace line individually (client animates 150ms stagger per `enter-v3.md` §5)
- `event: token` — answer prose, optionally chunked synthetically at word boundaries with 30ms stagger for typed-out feel
- `event: card` — card array
- `event: done` — sentinel

Trace format: `{ verb: 'parsed'|'pulled'|..., args: {...}, latencyMs: 50-220 }` (client-side seeded random).
Card schema: `{ slug, type: 'page'|'external'|'action'|'agent', label, href, priority?: boolean, intent? }`. 2-4 cards. Exactly 1 priority.

No reconnect protocol. Disconnect = client surfaces "connection lost, retry?" affordance.

**Files:** `netlify/functions/lib/ssestream.mjs` (NEW).

**Commit message:**
```
D-4: SSE encoder + 1-call structured output

Single LLM call returns {trace, answer, cards} JSON. Server emits SSE
events with client-side stagger animation per enter-v3.md §5. Token
event optionally chunked at word boundaries for typed-out feel (~30ms
stagger). No reconnect protocol — disconnect = client manual retry.

Per phase-d-decisions-2026-04-27.md Decision 3 + 9.
```

### Task 18 — D-5 Abuse defense Tier 0-1 (Tier 2 DROPPED)

**Scope:** per `docs/plans/second-brain-v1.md` §7 (rewritten 2026-04-27).

**Tier 0** (always on, $0):
- UA gate: match against extended allowlist (GPTBot, ClaudeBot, PerplexityBot, Anthropic-ai, Applebot-Extended, Google-Extended, Bytespider, meta-externalagent, Amazonbot, Diffbot). Match → static manifest from KG_THEMES_SUMMARY, no LLM.
- Input validation: msg length 0-500 chars, conv history ≤4000 tokens, turns ≤6.
- Duplicate-query cache: module-scope Map<ip:queryHash, response>, 60s TTL, LRU 1000 entries.
- Injection filter: extended patterns (existing list + bidi/zero-width unicode + base64-shaped strings + role-newline injections).

**Tier 1** (Upstash + browser):
- **Browser-side throttle (NEW, in `enter/index.html`):** submit button disabled 2s after each request, visible countdown. Soft 1 q/2s.
- **Per-IP rate bucket:** 60 q/h sliding window, burst 5 in any 10s. Upstash sliding-log pattern.
- **Low-effort query gate:** msg ≤ 3 words OR greeting → force `lookup` path.

**Tier 2: DROPPED.** No spend caps, no cost tracking, no `CLAUDE_DISABLED` flag.

**Upstash failover (NEW):**
- Primary: `UPSTASH_REDIS_REST_URL` / `_TOKEN`
- Backup: `UPSTASH_REDIS_REST_URL_2` / `_TOKEN_2`
- On primary error → try backup. On backup error → fall back to module memory.
- Per-resource semantics: rate bucket fail open (allow request), cool-down state degrade to module memory.
- All cooldown/dup/rate-bucket keys carry TTL. Eviction policy `allkeys-lru` set on both Upstash projects.

**Kill switches:**
- `LLM_DISABLED=1` → no LLM call, all requests serve static fallback.
- `WIKI_READ_ENABLED=0` → wiki extracts not loaded, KG one-liners only.

**Files:** `lib/abuse-defense.mjs` (NEW), `lib/upstash-client.mjs` (NEW: dual-host failover), `enter/index.html` (browser throttle UI).

**Env vars:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `UPSTASH_REDIS_REST_URL_2`, `UPSTASH_REDIS_REST_TOKEN_2`, `GROQ_API_KEY`, `GROQ_API_KEY_2`, `GROQ_API_KEY_3`, `MISTRAL_API_KEY`, `MISTRAL_API_KEY_2`. (DEEPSEEK + ANTHROPIC keys staged but unused.)

**Commit message:**
```
D-5: abuse defense Tier 0-1 (Tier 2 DROPPED)

T0: UA gate (extended allowlist), input val (0-500 chars / ≤4000 tok /
≤6 turns), dup cache (60s TTL Map), injection filter (extended w/ bidi
+ base64 + role-newline patterns).

T1: browser throttle (1 q/2s soft, button disabled w/ countdown), per-IP
60 q/h sliding + burst 5/10s, low-effort gate.

T2 dropped per phase-d-decisions-2026-04-27.md Decision 8: both
providers free tier, no cost tracking, no spend caps.

Upstash dual-host failover: primary → backup → module memory. Eviction
allkeys-lru. Rate bucket fail open, cooldown state degrades.

Per phase-d-decisions-2026-04-27.md Decisions 6, 8, 10.
```

### Task 19 — D-6 Eval harness 23 scenarios (Groq path only, real UI driven)

**Workflow LOCKED 2026-04-27:** harness drives the real `/enter` UI in headed gstack browser against `localhost:8888` (dev) and `https://agamarora.com` (prod gate). NOT an isolated function-call harness. Per `docs/plans/phase-d-dev-workflow.md`. Voice drift, animation jank, card overflow, mobile layout regressions only surface in real DOM — function-only eval missed them in v2.

**Scope:** rewrite `eval-prompt.mjs` (current 143-line v2 stub) to run 23 pinned scenarios from `enter-v3-scenarios-v2.md`:
- T01-T12: theme-anchor scenarios
- C01-C06: cross-cutting (hiring, capability, bio, role lookup, credentials, evolution)
- M01-M02: meta (site origin, agent identity)
- X01-X03: special (deflect, empty state, agent crawler UA gate)

Each scenario pins: classifier output (type + themes_likely contains expected), trace pattern (verbs from locked vocab, count 2-5), answer assertions (≤70 words, 0 em-dashes, 0 banned LLM-isms, scenario-specific phrase contains), cards (2-4, exactly 1 priority, expected priority slug, all slugs in sitemap).

**Eval gate:** Groq path only (Mistral path NOT tested per Decision 7). Risk: Mistral voice drift only caught in production observation.

**Retry policy:** 3 retries per scenario, pass on ≥1. Bounds flake from temperature 0.7 on synthesis path.

**Files:** `eval-prompt.mjs` (rewrite), `eval-scenarios.json` (NEW, scenario data extracted from enter-v3-scenarios-v2.md).

**Pass criteria:** 23/23 for ship gate. Re-run on each ontology / wiki-extracts change.

**Commit message:**
```
D-6: eval harness — 23 pinned scenarios (Groq path only)

Rewrites eval-prompt.mjs (was 143-line v2 stub) to run T01-T12, C01-C06,
M01-M02, X01-X03. Per-scenario pins: classifier output, trace pattern,
answer markers (≤70w, 0 em-dashes, 0 banned LLM-isms, scenario phrase),
cards (count, priority, slug enum).

Eval gate Groq path only per phase-d-decisions-2026-04-27.md Decision 7.
Mistral path drift caught only in prod monitoring.

Retry up to 3x per scenario (pass on ≥1) bounds temperature flake.
```

### Task 20 — D-7 /enter UI v3 SSE handler + browser throttle

**Scope:** update `enter/index.html`:
- Consume new SSE events (`trace`, `token`, `card`, `done`).
- Render trace lines with 150ms client-side stagger animation (per `enter-v3.md` §5).
- Stream answer tokens to conversation pane (existing pattern; new event name).
- Render card array as horizontal scroll strip on desktop, vertical stack on mobile (per `enter-v3.md` §4).
- Priority card gets gold-accent stripe.
- **NEW: browser-side throttle** — submit button disabled 2s after each submit, visual countdown ("retry in 2s..."). Per `lib/abuse-defense.mjs` Tier 1.
- **NEW: connection-lost banner** — on stream disconnect, show "Connection lost. Retry?" with one-click retry that resends last user message (no server-side reconnect).

Keep keyboard background, conversation memory (last 6 turns), existing v2 visual contract.

**Files:** `enter/index.html`.

**Commit message:**
```
D-7: /enter UI v3 SSE handler + browser throttle

Front-end consumes server-emitted trace/token/card/done events. Trace
stagger 150ms client-side. Cards rendered as horizontal scroll strip
(desktop) / vertical stack (mobile); priority = gold-accent stripe.

Browser-side throttle: submit button disabled 2s after submit, visible
countdown. Soft layer atop server's per-IP bucket.

Connection-lost banner on stream disconnect — one-click retry resends
last user message (no server-side reconnect; SSE is fire-and-forget).

Per phase-d-decisions-2026-04-27.md Decisions 9, 10.
```

### Task 21 — DROPPED (folded into Task 14 D-1)

D-8 multi-key Groq rotation collapsed into D-1's `lib/llm-pool.mjs` per Decision 1. Single pool driver owns both Groq + Mistral rotation. No standalone task.

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
