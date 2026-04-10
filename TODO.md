# TODO — agamarora.com

## Dead Files
- [x] ~~Delete `styles/backup.css`~~ — removed
- [x] ~~Delete `styles/main.css.old`~~ — removed
- [x] ~~Delete `styles/refactored.css`~~ — removed
- [x] ~~Delete `css-refactoring-guide.md`~~ — already gone
- [x] ~~Delete `how-to-use-css.md`~~ — already gone
- [x] ~~Delete `assets/avatar-front.png`~~ — removed
- [x] ~~Delete `assets/logos/ukg_dark.png` / `ukg_light.png`~~ — removed (webp versions used)
- [x] ~~Delete `experiments/`~~ — removed (phaser prototype, mockup-room)
- [x] ~~Delete `.DS_Store`~~ — removed, added to .gitignore

## Inconsistencies
- [ ] Fix LinkedIn URL: `/in/agamarora` in header links vs `/in/agam-arora/` in schema.org JSON-LD — pick one
- [x] Fix job title: "AI Product Leader" in landing schema.org vs "AI Product Manager" in explore schema.org
- [ ] Update copyright from 2025 to 2026 in landing page footer

## Dead Code
- [ ] Remove video click handler in `lab.js:17-23` — references a `<video>` element that was replaced with YouTube iframe
- [ ] Remove empty `<nav>` placeholder tags on all 3 pages (or add real navigation)
- [x] ~~`callGroq()` in utils.js~~ — removed (Groq now called directly from enter/index.html)

## SEO / Meta
- [ ] Remove duplicate `<!-- Primary Meta Tags -->` comments on landing and explore pages
- [ ] Fix `og:image` on lab page — references `/assets/lab-preview.png` which doesn't exist (only `lab-hero.webp`)
- [ ] Add `<meta name="robots" content="index, follow">` to landing and explore pages (only lab has it)

## Content
- [ ] Add more projects to Lab page — currently only 1 (Shararat Voice AI)
- [ ] Consider a blog/writing section — 12+ years of product experience to share
- [ ] Consider a contact form instead of bare `mailto:` link in lab footer
- [ ] Explore page "Learn more about me!" links off-site to LinkedIn — consider on-site about section

## Performance
- [ ] Font Awesome 6.5.0 full CSS loaded for ~10 icons — consider subset or self-hosting

## Next Session — v1 Optimization
- [ ] Run full site optimization pass on existing v1 (performance, dead files, inconsistencies, dead code)
- [ ] Fix all items in Dead Files, Inconsistencies, Dead Code, and SEO/Meta sections above
- [ ] Performance audit — lighthouse scores, bundle sizes, loading times
- [ ] Mobile QA — test all 3 pages on phone-sized viewports

## v2 — /aa Mark Exploration (continue from moodboard/aa-mark.html)
- [ ] More font exploration — try beyond Patrick Hand, Kalam, Satisfy (current finalists)
- [ ] Explore `aa.` variations (with period) — different energy than `/aa`
- [ ] Refine slash treatment — mono slash vs dimmed vs smaller vs alternative symbols (`_`, `>`, `~`, `.`)
- [ ] Test more stroke weights systematically per font
- [ ] Color decision — white vs gold vs mixed (dim slash + bright aa)
- [ ] Multi-size test — hero animation, nav corner, favicon (16px). Which marks survive small?
- [ ] Decide: does `/` stay or does an alternative prefix win?
- [ ] Once mark is locked: build the actual hero animation component for the site
