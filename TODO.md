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
- [ ] Generate a proper OG image for `/lab` (currently using the generic site preview)

## Content
- [x] ~~Add more projects to `/lab`~~ — 3 now: AI Resume, Voice AI, Claude Code Resource Monitor
- [ ] Consider a blog/writing section — 12+ years of product experience to share
- [ ] Consider a contact form instead of bare `mailto:` link in lab footer

## Performance
- [x] ~~Delete 2.3 MB unused `agamarora_banner.png`~~ — was unused in site, restored for readme.md (GitHub profile). Still on disk, serves the profile header.
- [x] ~~Remove main.css weight from site~~ — 32 KB unminified stylesheet, now orphan and deleted
- [x] ~~`assets/lab/vapi-thumbnail.png` (948 KB)~~ — deleted 2026-04-22 with its webp pair; the /lab Voice AI card embeds a YouTube iframe, neither file was referenced
- [ ] Font Awesome 6.5.0 full CSS — could subset to only the icons actually used (~8)

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
- [ ] Add `netlify.toml` redirect pre-warm for critical paths
