# AEO/SEO gate final audit — CHECKPOINT 33

**Date:** 2026-04-27
**Gate:** AEO/SEO BINDING gate (per 2026-04-26 user directive)
**Status:** **CLEARED** — Phase D unblocked.

---

## Tasks shipped

| # | Task | Commit |
|---|---|---|
| AEO-1 | Person schema enrichment (knowsAbout 7→21, hasOccupation entity, knowsLanguage) | `aa5ec44` |
| AEO-2 | robots meta directive audit (44 pages) | `68e185d` |
| AEO-8 | Bot allowance verification (15 explicit AI crawlers) | `94a7353` |
| AEO-3 | Q&A overlay /wiki/voice/ + /wiki/quotes/ (H2=Q pattern) | `58a6b6b` |
| AEO-4 | BLUF executive-summary on case-study Lab PRFAQs | `c528a4d` |
| AEO-10 + M7 | FAQPage on 19 belief + voice + quotes / HowTo on ai-resume + second-brain / safeJsonLd helper | `bf07f52` |
| AEO-6 | `<pre><code>` wrap on Lab paste-prompts | `d595f18` |
| AEO-11 + M2 | Raw-HTML view-source audit (13 pages pass) + noscript fallback for /wiki/graph/ | `1903df9` |
| AEO-14 | Evidence-citation outbound links (120 LinkedIn permalinks across 19 belief pages) | `a078d5e` |
| AEO-15 | Comparison content surfaces (3 wiki theme tables) | `3b6af6d` |
| AEO-7 | TTFB benchmark + baseline doc | `aeo-ttfb-baseline-2026-04-27.md` |
| AEO-9 | Console regression sweep (7 pages, 0 errors) | this audit |
| AEO crawl audit (Part 5) | robots.txt, noindex, canonical, 404 — all pass | this audit |
| **DRY enforcement** (bonus) | Removed 6 legacy duplicate chrome blocks; graph builder now uses SHARED_CHROME_CSS | `a55ee7f` |

Tasks deferred:
- AEO-5 image alt audit — clean by inspection (only short alts are entity names: UKG, FarEye, AIonOS — entity-correct, no fix needed)
- AEO-12 dateModified/datePublished — DROPPED (timelessness preserved per editorial stance)
- AEO-13 post-deploy AI search QA — runs **after Phase D deploys** (re-test 7-14 days post-crawl-cycle)

---

## Verification matrix

### Schema validation (Google Rich Results Test required for full pass)

| Surface | Schemas |
|---|---|
| `/` | Person + WebSite (in `@graph`) |
| `/wiki/<theme>/` × 11 + root | Article |
| `/wiki/beliefs/<slug>/` × 19 | Article + **FAQPage** |
| `/wiki/voice/`, `/wiki/quotes/` | WebPage + **FAQPage** |
| `/lab/ai-resume/` | SoftwareApplication + **HowTo** |
| `/lab/second-brain/` | Article + **HowTo** |
| `/lab/voice-ai-production/`, `/lab/product-shape/` | Article |

All schemas use `safeJsonLd()` helper (escapes `</` to prevent script-tag breakout).

### Crawler reachability

```
robots.txt    →  HTTP 200
sitemap.xml   →  reachable, advertised in robots.txt
404 page      →  HTTP 404 (proper)
canonical     →  46/48 pages (only /moodboard/* missing — intentional, noindex)
noindex       →  /404, /moodboard/* (intentional)
```

### AI bot verification

```
curl -A "ClaudeBot"      https://agamarora.com/  →  HTTP 200
curl -A "GPTBot"         https://agamarora.com/  →  HTTP 200
curl -A "PerplexityBot"  https://agamarora.com/  →  HTTP 200
```

15 explicit Allow rules in robots.txt: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, Anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, cohere-ai, Bytespider, Amazonbot, CCBot, Diffbot.

### Performance baseline (cold-cache curl, 2026-04-27)

| Page | TTFB | Total |
|---|---|---|
| `/` | 853ms | 853ms |
| `/wiki/` | 583ms | 584ms |
| `/wiki/graph/` | 893ms | 1101ms |
| `/lab/` | 596ms | 801ms |
| `/enter/` | 557ms | 763ms |

p50 = 596ms, just clears the 600ms target. Two pages over hard ceiling have known causes (logo strip on /, inline graph JS on /wiki/graph/) — tracked in BASELINE polish backlog. Not AEO-blocking.

### Console regression

7 pages tested across types (landing, wiki landing, theme, belief detail, graph, lab PRFAQ x2). **Zero console errors.** AI Slop score remains A. Editorial system intact.

### Raw-HTML extractability (AEO-11)

13 representative pages audited via view-source. **All show headline answer in first 150 raw-HTML words.** /wiki/graph/ exempt (legitimately JS-rendered) but ships `<noscript>` fallback with 11 theme links + brand label.

---

## Net new schema surface (AEO win)

Before AEO gate: ~30 JSON-LD blocks site-wide (Person, Article, WebSite).

After AEO gate: ~70 JSON-LD blocks site-wide:
- Person enriched (21 knowsAbout entries, hasOccupation, knowsLanguage)
- 19 new FAQPage blocks on belief pages
- 2 new FAQPage blocks on voice + quotes
- 2 new HowTo blocks (ai-resume + second-brain)
- All existing schemas now safeJsonLd()-escaped

---

## Verdict

**AEO/SEO gate CLEARED at CHECKPOINT 33.** All BINDING items shipped or explicitly deferred with rationale. Phase D (/enter v3 + groqHandler upgrade) unblocked.

Next: `/plan-eng-review` on consolidated Phase D plan before D-1 groqHandler rewrite.

---

## Local artifacts (gitignored)

- `.gstack/benchmark-reports/benchmark-20260427-111605.json` — fresh perf bench
- `.gstack/design-audit/screenshots/` — visual verification screenshots from this session
