# TODO — agamarora.com

## Response evals (next session)
- [ ] Run full eval pass on /enter responses now that mobile UI is locked. Common asks tested 2026-04-27 surfaced: "linkedin" returns weak tautology, "is he available for hire" hallucinates "after current contract is fulfilled", "show me his projects" claims "AI resume template used by thousands" (not in spec). Cards on contact intents come from client-side fallback, not the LLM — server-side path is empty.
- [ ] Tighten: more conversational follow-ups. Agent should leave a hook on factual answers, not state the fact and stop. Reduce answering-machine cadence.
- [ ] Verify deflect rules don't fire on legitimate biographical questions ("is he hiring", "what's he like").
- [ ] Add JSON-schema validation for cards[] so LLM can't drop the contact-card set when CONTACT CONTEXT is injected.

## Dead Files
- [x] ~~Delete `styles/backup.css`, `main.css.old`, `refactored.css`~~ — removed
- [x] ~~Delete `assets/avatar-front.png`~~ — removed
- [x] ~~Delete old UKG PNG logos~~ — removed (webp versions used)
- [x] ~~Delete `experiments/`~~ — removed
- [x] ~~Delete `styles/main.css` + `styles/lab.css`~~ — removed 2026-04-22 (v2 pages are self-contained inline)
- [x] ~~Delete `scripts/main.js` + `lab.js` + `utils.js` + `explore.js`~~ — removed 2026-04-22
- [x] ~~Delete `explore/index.html`~~ — removed 2026-04-22 (netlify.toml handles 301 → /lab)

## Inconsistencies
- [x] ~~Fix LinkedIn URL mismatch in schema.org vs header~~ — unified on `agamarora` (no hyphen)
- [x] ~~Fix job title mismatch across pages~~ — "AI Product Manager" everywhere
- [x] ~~Update copyright year wherever it still says 2025~~ — no © markers on site; only date ranges in resume content (correct)

## SEO / Meta
- [x] ~~Fix `og:image` on `/lab`~~ — now points at existing `/assets/preview.png`
- [x] ~~Add `sitemap.xml`~~ — added 2026-04-22, 5 public URLs
- [x] ~~Add `robots.txt`~~ — allow-all with `Disallow: /moodboard/`, sitemap reference
- [x] ~~Add `/llms.txt` and `/llms-full.txt`~~ — AEO/GEO discoverability for AI answer engines
- [x] ~~Add `<link rel="canonical">` on all v2 pages~~
- [x] ~~Enhance JSON-LD~~ — Person @graph with alumniOf/knowsAbout/description on `/`, ProfilePage on `/resume`, CollectionPage on `/lab`
- [x] ~~Add `robots: noindex` to `/moodboard` pages~~
- [x] ~~Generate a proper OG image for `/lab`~~ — shipped 2026-04-24, per-page OGs for `/`, `/lab`, `/lab/second-brain/`, `/lab/ai-resume/`

## Content
- [x] ~~Add more projects to `/lab`~~ — 4 now: second-brain, AI Resume, Voice AI, Claude Code Resource Monitor
- [x] ~~Launch `/lab/second-brain/` PRFAQ~~ — shipped 2026-04-23, same body live on [Medium](https://medium.com/@agam.arora11/your-ai-forgets-you-every-session-78ad24bf49be) and [LinkedIn](https://www.linkedin.com/pulse/your-ai-forgets-you-every-session-agam-arora-8fafc/)
- [x] ~~Dedicated OG image for `/lab/second-brain/`~~ — shipped 2026-04-24

## Performance
- [x] ~~Delete 2.3 MB unused `agamarora_banner.png`~~ — was unused in site, restored for readme.md (GitHub profile). Still on disk, serves the profile header.
- [x] ~~Remove main.css weight from site~~ — 32 KB unminified stylesheet, now orphan and deleted
- [x] ~~`assets/lab/vapi-thumbnail.png` (948 KB)~~ — deleted 2026-04-22 with its webp pair; the /lab Voice AI card embeds a YouTube iframe, neither file was referenced
- [x] ~~Font Awesome 6.5.0 full CSS~~ — replaced with inline SVG sprite per page 2026-04-24. 274 KB font + 100 KB CSS → ~4 KB inline. Zero external deps.

## v2 Design System

All v2 pages follow a unified contract. See `CLAUDE.md` for the layout rules and tokens.

- [x] ~~Landing ported to v2~~
- [x] ~~`/lab` ported to v2~~
- [x] ~~`/lab/ai-resume` on v2~~
- [x] ~~`/resume` on v2~~
- [x] ~~`/enter` has shared v2 header + aa. mark~~

## AEO/SEO pass (2026 architecture)

- [ ] **Run AEO/SEO pass per `docs/aeo-seo-guidelines.md`** — full architecture guide for 2026 AI search optimization. Covers Person schema enrichment, AEO Q&A blocks, BLUF executive summaries on Lab PRFAQs, image alt text audit, `<pre><code>` wrap audit, TTFB benchmark, bot allowance verification, robots.txt audit, canonical tags audit, breadcrumbs + BreadcrumbList JSON-LD, internal link density, navigation interlinks. **Trigger: after major content work (currently C-voice-themes done, C-voice-beliefs queued) AND BEFORE Phase D (AI plumbing / `/enter` v3 / groqHandler upgrade).** Per Part 4 of the guide, run in 9-step order with commit per step.

## Open (Phase B follow-ups)

- [ ] **Site-wide favicon 404** — every v2 page references `/favicon.ico` + `/favicon.png` at root, but the actual files live at `/assets/favicon.ico` + `/assets/favicon.png`. Pre-existing across all 5 v2 pages (lab, resume, enter, index, wiki). Fix in one commit per CLAUDE.md "update all v2 pages in one commit" by either (a) updating all 5 page paths to `/assets/favicon.*` or (b) adding root copies. Surfaced by /qa pass on Phase B Task 2.
- [ ] **`/wiki/` OG image** — `wiki/index.html` currently reuses `/assets/og/lab.png`. Create `/assets/og/wiki.png` (1200x630) for dedicated social share preview. Same gap as the closed /lab issue when it shipped.
- [ ] **HTML stats drift from kg.json** — `wiki/index.html` hardcodes counts (12 pages, 44 beliefs, 20 projects, 111 edges). Will drift when ontology v2 lands. Wire build-kg.mjs to patch the HTML, or inline-fetch kg.json on page load. Tracked as B8.
- [ ] **`scripts/build-kg.mjs` unit tests** — 6 boilable-lake test gaps (orphan-edge --strict, tableUnder branches, allTablesUnder EOF, cleanSlug, edge regex parsers, addBelief dedup). Refactor helpers to scripts/kg-parse.mjs for testability. Tracked as B7.

## Future

- [x] ~~`/moodboard` robots noindex~~ — added 2026-04-22 on both `/moodboard/index.html` and `/moodboard/aa-mark.html`; also blocked in `robots.txt`
- [x] ~~Google Fonts vendored locally~~ — JetBrains Mono + Patrick Hand woff2 self-hosted 2026-04-24. `feedback_no_external_deps` fully satisfied.
- [x] ~~Security headers~~ — CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options added to netlify.toml 2026-04-24.
- [x] ~~Project tag contrast fix~~ — `.project-tag` color #7a7a7a → #8a8a8a, passes WCAG AA (5.18 ratio) 2026-04-24.
- [x] ~~Lab card aria-labels~~ — descriptive aria-label on Read more / Code CTAs 2026-04-24.
- [x] ~~Lab card image resize~~ — luna-monitor + ai-resume PNGs resized to displayed dimensions (.v2.png) 2026-04-24.
