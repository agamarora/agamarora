# TODO — agamarora.com

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
- [ ] Consider a blog/writing section — 12+ years of product experience to share
- [ ] Consider a contact form instead of bare `mailto:` link in lab footer
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

## Future

- [x] ~~`/moodboard` robots noindex~~ — added 2026-04-22 on both `/moodboard/index.html` and `/moodboard/aa-mark.html`; also blocked in `robots.txt`
- [ ] Refresh resume content as roles change
- [x] ~~Google Fonts vendored locally~~ — JetBrains Mono + Patrick Hand woff2 self-hosted 2026-04-24. `feedback_no_external_deps` fully satisfied.
- [x] ~~Security headers~~ — CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options added to netlify.toml 2026-04-24.
- [x] ~~Project tag contrast fix~~ — `.project-tag` color #7a7a7a → #8a8a8a, passes WCAG AA (5.18 ratio) 2026-04-24.
- [x] ~~Lab card aria-labels~~ — descriptive aria-label on Read more / Code CTAs 2026-04-24.
- [x] ~~Lab card image resize~~ — luna-monitor + ai-resume PNGs resized to displayed dimensions (.v2.png) 2026-04-24.
- [ ] Add `netlify.toml` redirect pre-warm for critical paths
