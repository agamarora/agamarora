# TODO — agamarora.com

## Dead Files
- [ ] Delete `styles/backup.css` — not referenced by any HTML
- [ ] Delete `styles/main.css.old` — not referenced by any HTML
- [ ] Delete `styles/refactored.css` — not referenced by any HTML
- [ ] Delete `css-refactoring-guide.md` — internal notes cluttering repo root
- [ ] Delete `how-to-use-css.md` — internal notes cluttering repo root
- [ ] Delete `assets/avatar-front.png` — PNG duplicate, never referenced (WebP variants used instead)

## Inconsistencies
- [ ] Fix LinkedIn URL: `/in/agamarora` in header links vs `/in/agam-arora/` in schema.org JSON-LD — pick one
- [ ] Fix job title: "AI Product Leader" in landing schema.org vs "AI Product Manager" in explore schema.org
- [ ] Update copyright from 2025 to 2026 in landing page footer

## Dead Code
- [ ] Remove video click handler in `lab.js:17-23` — references a `<video>` element that was replaced with YouTube iframe
- [ ] Remove empty `<nav>` placeholder tags on all 3 pages (or add real navigation)
- [ ] Evaluate `callGroq()` in utils.js — fully wired but never called from UI. Either use it or remove it

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
