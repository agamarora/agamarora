# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal website for Agam Arora. Live at **https://agamarora.com**. Source repo: `agamarora/aipm` (private).

## Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (ES6 modules). No framework, no build step.
- **Hosting**: Netlify (static site + serverless functions)
- **Fonts**: Roboto via Google Fonts
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
| `/` | `index.html` | Landing — animated greeting, identity, company logos |
| `/explore` | `explore/index.html` | Portfolio — scroll-snap sections: hero, trusted-by logos, bento grid, personal section |
| `/lab` | `lab/index.html` | Projects — featured project showcase (currently only Shararat Voice AI) |

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

## v2.0 — "The Convergence Engine"

A redesign is in progress on the `v2-experience` branch. The concept: scroll-driven visual convergence — 5 career threads (analytics, gaming, beauty, logistics, AI) physically converge as you scroll, representing skills compounding toward AI product leadership. Mobile-first design. One coherent visual metaphor across all viewports.

- **Tech stack**: Astro + GSAP ScrollTrigger + SVG + Vite. Netlify deployment.
- **Current status**: CEO review complete. Next step: `/design-consultation` using `DESIGN-BRIEF.md`.
- **Key files**: `DESIGN.md` (full spec, some assumptions revised), `DESIGN-BRIEF.md` (current design input), `BUILD-LOG.md` (decision history).
- Prior approaches explored and rejected: Cinematic Scroll, Playable Portfolio (Phaser.js prototype in `experiments/`), Self-Constructing Portfolio.
- The current site (v1.0) remains live on `main` until v2.0 ships.

## Known Issues

Tracked in `TODO.md` (22 items). Key ones:

- **Dead files**: `styles/backup.css`, `styles/main.css.old`, `styles/refactored.css`, `css-refactoring-guide.md`, `how-to-use-css.md` — none referenced anywhere
- **Dead code**: `lab.js` has a video click handler for a `<video>` element that was replaced with a YouTube iframe
- **Inconsistencies**: LinkedIn URL mismatch between header links and schema.org; job title mismatch between landing and explore schema.org
- **Missing**: `og:image` on lab page references non-existent `/assets/lab-preview.png`
- **Unused**: `callGroq()` in utils.js is wired but no UI element calls it
