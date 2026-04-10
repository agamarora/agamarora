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
| `/resume` | `resume/index.html` | Resume — dark editorial design, all career data, print-friendly |
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

`netlify/functions/groqHandler.mjs` — ESM, Web Standard Request/Response. Groq SDK streaming SSE. 4-model fallback chain (llama-3.1-8b-instant → qwen3-32b → gpt-oss-20b → llama-3.3-70b-versatile). Sandwich prompt defense, injection filter, conversation history (6 messages, user+assistant). System prompt grounded in resume.md with few-shot examples. Eval harness at `eval-prompt.mjs`.

## v2 Status

Live on `main`. The `/enter` page is the v2 experience.

- **Design system**: Moodboard at `/moodboard` is the source of truth. Summary in `DESIGN.md`.
- **Key files**: `DESIGN.md` (design system summary), `BUILD-LOG.md` (decision history), `moodboard/aa-mark.html` (mark exploration).
- **Brand elements**: aa. mark (Patrick Hand, gold dot, stroke-draw animation), keyboard background with 3D perspective tilt, parallax depth layers.
- **AI terminal**: Groq-powered, streaming SSE, word-by-word animation, conversation memory, rotating question prompts.
- **Resume**: Dark editorial page at `/resume`, career data sourced from `resume.md`.

## Known Issues

Tracked in `TODO.md`. Remaining:

- **Dead code**: `lab.js` video click handler for removed `<video>` element
- **Inconsistencies**: LinkedIn URL mismatch between header links and schema.org
- **Missing**: `og:image` on lab page references non-existent `/assets/lab-preview.png`
