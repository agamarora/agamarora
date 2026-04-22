# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal website for Agam Arora. Live at **https://agamarora.com**. Source repo: `agamarora/agamarora`.

## Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript. No framework, no build step. Every page is self-contained — no shared stylesheets or scripts.
- **Hosting**: Netlify (static site + one serverless function)
- **Fonts**: Satoshi (self-hosted variable woff2 in `/fonts/satoshi/`), JetBrains Mono, Patrick Hand (Google Fonts)
- **Icons**: Font Awesome 6.5.0 (CDN, preload + onload swap)
- **Backend**: Netlify serverless function (`netlify/functions/groqHandler.mjs`) using Groq SDK, called from `/enter`
- **Domain**: agamarora.com (Netlify DNS, auto-deploys from `main`)

## Development Commands

```bash
# Install dependencies (only needed for the Groq serverless function)
npm install

# Local dev with static server (no serverless function)
npx serve .

# Local dev with Netlify functions (requires .env with GROQ_API_KEY)
netlify dev
```

There is no build step, linter, formatter, or test suite. Files are served as-is.

## Deployment

Pushes to `main` auto-deploy via Netlify. Cache headers + `/explore → /lab` 301 redirect are in `netlify.toml`. The Groq API key (`GROQ_API_KEY`) is set in the Netlify dashboard, not in the repo.

## Architecture

Every public page is a single standalone `index.html` with inline `<style>` and `<script>` blocks. No shared CSS, no shared JS, no build step to resolve. This is intentional — each page can be read, edited, or rewritten without cascading impact on the others.

### Pages (all v2)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `index.html` | Landing — greeting cycle, name, tagline, 3 CTAs, logo strip |
| `/lab` | `lab/index.html` | Projects — AI Resume, Voice AI, Claude Code Resource Monitor |
| `/lab/ai-resume/` | `lab/ai-resume/index.html` | AI Resume PRFAQ + setup wizard paste-prompt |
| `/resume` | `resume/index.html` | Resume — dark editorial, career data, print-friendly |
| `/enter` | `enter/index.html` | Immersive AI terminal — keyboard background, Groq streaming, conversation memory |
| `/moodboard` | `moodboard/index.html` | Design system reference (orphan from main nav, internal use) |
| `/moodboard/aa-mark` | `moodboard/aa-mark.html` | aa. mark component exploration |

### Shared layout contract (every v2 page)

- **Top-left: icon bar** (GitHub, LinkedIn, YouTube, Home) — fluid `clamp(52px, 6vw, 64px)` header, `clamp(1.15rem, 1.3vw, 1.5rem)` font
- **Bottom-right: aa. mark** — fixed position, `clamp(44px, 5vw, 60px)` wide, stroke-draw animation on load, opacity 0.7 → 1.0 on hover
- **Content: centered or left-aligned column** — max-width varies per page (~720-880px)

Each page defines these CSS rules inline (comment-tagged `=== Shared v2 header ===` / `=== Shared aa. mark ===`) so edits stay local. The stroke-draw animation JS lives inline at the bottom of each page.

### Design tokens (inline in every v2 page)

```
--bg: #0A0A0A          --mono: 'JetBrains Mono', monospace
--surface: #111111     --sans: 'Satoshi', system-ui, sans-serif
--border: #1E1E1E      --mark: 'Patrick Hand', cursive
--text: #E8E4DF        --accent: #E5A54B (gold)
--text-dim: #7A7A7A    --accent-dim: rgba(229, 165, 75, 0.12)
```

Spacing: 8px base, tokens `--space-3` (8px) through `--space-9` (64px).

Dark-only. No light mode. No theme toggle. The moodboard at `/moodboard` is the design system reference (orphan from live nav but kept as a design doc).

### Serverless function

`netlify/functions/groqHandler.mjs` — ESM, Web Standard Request/Response. Groq SDK streaming SSE. 4-model fallback chain (llama-3.1-8b-instant → qwen3-32b → gpt-oss-20b → llama-3.3-70b-versatile). Sandwich prompt defense, injection filter, 6-message conversation history. System prompt grounded in `resume.md` with few-shot examples. Eval harness at `eval-prompt.mjs`. Called only from `/enter`.

## Conventions

- **Edit patterns:** when changing the header or aa. mark, update all v2 pages in one commit so the contract stays unified. Look for the `=== Shared v2 header ===` and `=== Shared aa. mark ===` comment blocks.
- **Card media slots (e.g., `/lab` project cards):** flex row, `flex: 1 1 0; min-width: 0` on both columns, no `aspect-ratio` on the media element — info column drives row height, media stretches, img at `width/height: 100%` with `object-fit: cover` fills deterministically. See `lab-media-slot-parity` learning.
- **Images on lab cards:** pre-crop the source PNG to the intended aspect, use `object-position` only for a small anchor nudge. Do NOT CSS-crop aggressively. See `precrop-images-not-css` learning.
- **Icons on CTAs:** use semantic Font Awesome icons (`fa-book-open` for docs, `fa-download` for downloads, `fa-github` for code). Not generic arrows.
- **Display names:** on lab cards, the title should be plain-English descriptive ("Claude Code Resource Monitor"), not the repo/package name ("luna-monitor"). Repo names stay only in URLs, IDs, class names, asset filenames.

## Known Issues

Tracked in `TODO.md`. Current:

- `/moodboard` is orphan from main nav — by design (design doc, not user-facing), but leaks to search engines without a robots directive.
- No sitemap.xml, no robots.txt.
- `assets/preview.png` at ~950KB is heavy for a social-share OG image. Could be optimized.
