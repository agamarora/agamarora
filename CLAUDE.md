# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal website for Agam Arora. Live at **https://agamarora.com**. Source repo: `agamarora/agamarora`.

## Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (ES6 modules). No framework, no build step.
- **Hosting**: Netlify (static site + serverless functions)
- **Fonts**: Satoshi (self-hosted variable), JetBrains Mono, Patrick Hand (Google Fonts)
- **Icons**: Font Awesome 6.5.0 (CDN)
- **Backend**: Single Netlify serverless function (`netlify/functions/groqHandler.js`) using Groq SDK (llama-3.1-8b-instant) — wired but **not called from any UI** currently
- **Domain**: agamarora.com (Netlify DNS, auto-deploys from `main` branch)

## Development Commands

```bash
# Install dependencies (only needed for the Groq serverless function)
npm install

# Local dev with static server (no serverless function)
npx serve .

# Local dev with Netlify functions (requires .env with GROQ_API_KEY)
netlify dev
```

There is no build step, linter, formatter, or test suite. HTML/CSS/JS files are served as-is.

## Deployment

Pushes to `main` auto-deploy via Netlify. No CI pipeline beyond Netlify's build. The Groq API key (`GROQ_API_KEY`) is set in the Netlify dashboard, not in the repo.

## Architecture

### Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `index.html` | v1 Landing — animated greeting, identity, company logos |
| `/explore` | `explore/index.html` | v1 Portfolio — scroll-snap sections: hero, trusted-by logos, bento grid, personal section |
| `/lab` | `lab/index.html` | v1 Projects — featured project showcase (currently only Shararat Voice AI) |
| `/enter` | `enter/index.html` | v2 Enter — keyboard background, AI terminal, Groq streaming, conversation memory |
| `/moodboard` | `moodboard/index.html` | v2 Design system moodboard (10 sections + living collection) |

### JavaScript Module Structure

All pages load `scripts/main.js` as their entry point. Shared logic lives in `scripts/utils.js`.

| File | Role |
|------|------|
| `scripts/main.js` | Global init: theme setup, greeting typewriter, hero scramble. Runs on all pages. |
| `scripts/utils.js` | Shared utilities: `setupThemeToggle()`, `swapLogosForTheme()`, `typeLetter()`, `typeAndDeleteLoop()`, `scrambleToWords()`, `scrambleToWordsLockFinal()`, `scrollToElement()`, `callGroq()` |
| `scripts/explore.js` | Explore-only: wires scroll-down chevron buttons to next section |
| `scripts/lab.js` | Lab-only: project card fade-in animation |

### Theme System (critical pattern)

Dark/light theme is a core architectural concern touching HTML, CSS, and JS:

1. **CSS**: `:root` defines light tokens; `.dark-theme` class overrides them. Key tokens: `--text-color`, `--background-color`, `--accent-color`, `--prof-color`, `--prof-color-light`.
2. **JS**: `setupThemeToggle()` in utils.js toggles `.dark-theme` on `<body>`, persists to `localStorage("theme")`, falls back to `prefers-color-scheme`.
3. **Images**: All logos and some illustrations have light/dark variants. `<img>` tags use `data-light` and `data-dark` attributes; `swapLogosForTheme()` swaps `src` on theme change. **Any new image that differs by theme must follow this pattern.**

| Token | Light | Dark |
|-------|-------|------|
| `--text-color` | #333333 | #EEEEEE |
| `--background-color` | #FFFFFF | #111111 |
| `--accent-color` | #ACACAC | #FFA726 |
| `--prof-color` | #005A9C | #FFA726 |
| `--prof-color-light` | #FFC107 | #FFCC80 |

### Layout Constants

- `--max-content-width: 1200px`, `--header-height: 64px`, `--border-radius: 8px`
- Spacing base: 8px (`--spacing-xxs` through `--spacing-lg`)
- Breakpoints: Desktop 1024px+, Tablet 768–1024px, Mobile <768px, Small mobile <500px

### Serverless Function

`netlify/functions/groqHandler.js` — CommonJS, accepts POST with `{ prompt, systemPrompt }`, returns `{ result }`. Model: llama-3.1-8b-instant, max_tokens=100, temperature=0.9.

## v2.0 Redesign

In progress on `dev` branch. The concept has evolved through several iterations (see `BUILD-LOG.md`).

- **Current direction**: Keyboard as background depth layer, terminal as entry point to explore. Live preview at `/preview`.
- **Design system**: Complete moodboard at `/moodboard` (sections 01-05 locked, 06-10 starting points, 11 living collection).
- **Key files**: `DESIGN.md` (full spec), `DESIGN-BRIEF.md` (design input), `BUILD-LOG.md` (decision history), `moodboard/aa-mark.html` (mark exploration).
- **Brand elements**: aa. mark (Patrick Hand, gold dot, stroke-draw animation), keyboard background with 3D perspective tilt, parallax depth layers.
- Prior approaches explored and rejected: Convergence Engine, Cinematic Scroll, Playable Portfolio (Phaser.js prototype, now deleted), Self-Constructing Portfolio, pixel art character.
- The current site (v1.0) remains live on `main` until v2.0 ships.

## Known Issues

Tracked in `TODO.md`. Dead files cleaned up (backup CSS, experiments, duplicate PNGs). Remaining:

- **Dead code**: `lab.js` video click handler for removed `<video>` element; `callGroq()` wired but unused
- **Inconsistencies**: LinkedIn URL mismatch between header links and schema.org; job title mismatch between pages
- **Missing**: `og:image` on lab page references non-existent `/assets/lab-preview.png`
