# Next session resume — 2026-04-27 baseline

**HEAD:** see `git log -1 --oneline` (post-CP-33 graph polish round may have shipped additional commits — `44bdb4f` + edge subtlety + mobile -10% + hover-highlight fix)
**Branch:** main
**Working tree:** clean
**CHECKPOINT:** 33 — AEO/SEO gate CLEARED

---

## Pre-flight (run first on new session)

```bash
cd D:/AA/agamarora
git pull --ff-only origin main         # confirm 44bdb4f at HEAD
git status                             # must be clean
npm run sync:chrome:check              # all 10 pages in sync
npm run build                          # 36 pages, no errors
```

If on a new machine, re-run `npm run perf:bench` to capture local baseline (gitignored).

If on Windows and chrome-sync reports CRLF mismatches: `git config core.autocrlf false` then re-checkout.

---

## What shipped between CP-32 and CP-33

16 commits across 5 work streams:

### AEO gate (Batches 1-4 + post-deploy retest deferred)

| Commit | Task |
|---|---|
| `aa5ec44` | AEO-1 Person schema enrichment (knowsAbout 7→21, hasOccupation, knowsLanguage) |
| `68e185d` | AEO-2 robots meta directive audit (44 pages now ship max-snippet:-1) |
| `94a7353` | AEO-8 bot allowance — robots.txt explicit Allow for 15 AI crawlers |
| `58a6b6b` | AEO-3 Q&A overlay /wiki/voice/ + /wiki/quotes/ |
| `c528a4d` | AEO-4 BLUF executive-summary on Lab case-study PRFAQs |
| `bf07f52` | AEO-10 FAQPage + HowTo JSON-LD + safeJsonLd helper (folds M7) |
| `d595f18` | AEO-6 `<pre><code>` wrap on Lab paste-prompts |
| `1903df9` | AEO-11 raw-HTML audit + noscript fallback for /wiki/graph/ (folds M2) |
| `a078d5e` | AEO-14 Evidence-citation outbound links (120 LinkedIn permalinks) |
| `3b6af6d` | AEO-15 comparison tables on 3 theme pages |
| `8bce882` | docs: goose-aeo framework synthesis |
| `ecccfa4` | STATUS bump CP-33 + final audit doc |

### DRY chrome refactor (bonus from M-task review)

| Commit | What |
|---|---|
| `a55ee7f` | Removed 6 legacy duplicate chrome blocks; graph builder uses SHARED_CHROME_CSS; icons resized for better 44px fit |

### Graph polish (post-CP-33 user feedback)

| Commit | What |
|---|---|
| `a67fea4` | Theme radF -15% for mobile fit |
| `2da4d75` | Label offset 50→22, deep-field bias rebalance, theme labels rewritten crisp+self-explanatory |
| `44bdb4f` | nodeOffsets bookkeeping — non-theme positions track theme Lissajous drift, eliminates stranded white pulse trails |

---

## Deferred (NOT blocking next phase)

- **AEO-13 post-deploy AI search QA** — runs 7-14 days AFTER Phase D ships. 15 prompts × 4 engines (Perplexity, Bing Copilot, ChatGPT search, Claude.ai). Doc: `docs/plans/aeo-search-qa-2026-04-XX.md` (template in next-session-plan Task 12.4).
- **AEO-12 dateModified/datePublished** — DROPPED. Editorial timelessness preserved per `feedback_timelessness.md` memory.
- **/lab/ + /wiki/graph/ TTFB** — both over 800ms hard ceiling but have known causes (logo strip, inline graph JS). Tracked in BASELINE polish backlog. Not Phase D blockers.

---

## Next track: `/plan-eng-review` on Phase D

This is the **single comprehensive eng-review pre-Phase-D** per user directive. AEO was schema+content (low arch risk) so eng-review on AEO was skipped. Phase D introduces classifier + tier routing + retrieval + SSE + abuse defense — exactly where eng-review earns its keep.

### Inputs to load into eng-review

| Doc | Purpose |
|---|---|
| `docs/plans/enter-v3.md` | 6 LOCKED sections — persona, sitemap, cards, trace, empty-state, abuse defense |
| `docs/plans/enter-v3-scenarios-v2.md` | 23 pinned eval scenarios |
| `docs/plans/second-brain-v1.md` §6 + §7 | Model selection + abuse defense tiers |
| `docs/plans/second-brain-v1-next-session-plan.md` | Tasks 14-22 (D-1 through D-8) |
| `netlify/functions/groqHandler.mjs` | Current state — D-1 will rewrite entirely |
| `netlify/functions/lib/kg-themes-summary.mjs` | KG theme excerpt — feeds Phase D system prompt |

### What eng-review should pressure-test

- **Classifier reliability** (D-1): 200-token Groq-8B classifier with 500ms timeout. Failure modes? Do classifier+retrieve+answer chain compose without unbounded latency?
- **Tier routing economics** (D-1): Groq 8B → DeepSeek V3 → Mixtral → Claude Haiku fallback. Cost ceiling honored under failure cascades?
- **System prompt cache breakpoint** (D-2): ~20K stable tokens vs dynamic retrieval. Cache hit rate target 85% — measurable?
- **Wiki retrieval TTL + LRU** (D-3): 60s TTL, 50-entry LRU. Race conditions with concurrent function instances? Origin scrape timing on cold cache?
- **SSE event protocol** (D-4): trace/token/card/done sequence guarantees? Frontend resync if disconnect mid-stream?
- **Abuse defense tiers** (D-5): T0 (UA gate, dedup, injection filter) + T1 (Upstash rate limit, multi-key Groq) + T2 (spend caps daily/monthly/per-query). Fail-open rate / fail-closed spend semantics correct?
- **Eval gate** (D-6): 23/23 scenarios for ship. Gating logic robust to model nondeterminism?
- **Multi-key Groq rotation** (D-8): 3-4 keys, 60s cool-down on 429. Hot-key thundering herd on cool-down expiry?
- **Frontend SSE handler** (D-7): trace stagger, card render, priority gold-stripe. Reconnect strategy?

### Eng-review output

`~/.gstack/projects/agamarora-agamarora/reviews/plan-eng-review-phase-d-2026-04-XX.md`

Plan amendments fold into `next-session-plan.md`. STATUS notes review pass + outcome.

---

## Resume command sequence (copy-paste)

```bash
# 1. Sync state
cd D:/AA/agamarora
git pull --ff-only origin main
git log --oneline -5             # confirm 44bdb4f at HEAD
git status                       # must be clean
npm run sync:chrome:check        # 10 pages in sync

# 2. Read this resume doc + STATUS
cat docs/plans/NEXT-SESSION-RESUME-2026-04-27.md
cat docs/plans/second-brain-v1-phase-a/STATUS.md | head -20

# 3. Optional: refresh perf baseline
npm run perf:bench

# 4. Kick off eng-review
# In Claude Code session, invoke:
#   /plan-eng-review on Phase D plan (inputs listed in this doc)
# Or invoke gstack /plan-eng-review skill explicitly.
```

---

## Memory references (for fresh sessions)

`~/.claude/projects/D--AA-agamarora/memory/` carries durable preferences:

- `feedback_always_push_main.md` — push every commit on main without confirming
- `feedback_timelessness.md` — no dateModified / "last updated" content signals
- `feedback_no_external_deps.md` — vendor everything, no runtime CDN
- `project_second_brain_v1.md` — current spec lock
- `user_agam_profile.md` — AI PM, AVP at AIonOS, target list
- 16+ other entries (see MEMORY.md index)

These auto-load on session start.

---

## Open follow-ups (not blockers)

`docs/plans/c-final-followups.md` — M4/P1/P2/P3 explicitly skipped, M6 folds into D-1 rewrite. Re-read only if eng-review surfaces something new.

`docs/plans/BASELINE-2026-04-26.md` polish backlog — split graph builder JS to `assets/graph.js` (~1300 lines), auto-generate `kg-themes-summary.mjs`, dedicated `/lab` OG image.

---

**Read order on fresh session:** this doc → STATUS.md head → eng-review inputs above.
