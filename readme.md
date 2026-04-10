# [agamarora.com](https://agamarora.com) [![Netlify Status](https://api.netlify.com/api/v1/badges/ba314c8a-98a5-4e91-ae2e-4df7754b15bf/deploy-status)](https://app.netlify.com/sites/agamarora/deploys)

Personal website for Agam Arora. AI Product Leader, 12 years across analytics, gaming, beauty, logistics, and AI.

## Live

- **v1 (current)**: [agamarora.com](https://agamarora.com) — vanilla HTML/CSS/JS, three pages (landing, explore, lab)
- **v2 (preview)**: [agamarora.com/preview](https://agamarora.com/preview) — keyboard background, terminal entry point, design system in progress

## Stack

- Vanilla HTML, CSS, JavaScript (no framework, no build step)
- Netlify (static site, auto-deploys from `main`)
- Fonts: Satoshi (self-hosted), JetBrains Mono, Patrick Hand (Google Fonts)
- Serverless: Netlify function with Groq SDK (wired but unused in UI)

## Structure

```
index.html              # v1 landing page
explore/index.html      # v1 portfolio (scroll-snap sections)
lab/index.html          # v1 projects page
preview.html            # v2 concept (keyboard + terminal hero)
moodboard/index.html    # v2 design system moodboard (10 sections)
moodboard/aa-mark.html  # aa. mark exploration (stroke-draw animation)
fonts/satoshi/          # self-hosted Satoshi variable font
scripts/                # v1 JS modules (main, utils, explore, lab)
styles/                 # v1 CSS (main, lab)
assets/                 # images, logos, favicons
netlify/functions/      # Groq serverless handler
```

## v2 Redesign

In progress on `dev` branch. The concept: keyboard as background depth layer, terminal as the entry point to explore. Design system moodboard locked (sections 01-05 final, 06-10 starting points, 11 living collection).

Key design decisions documented in `DESIGN.md`, `DESIGN-BRIEF.md`, and `BUILD-LOG.md`.

## Development

```bash
# Static server (no serverless)
npx serve .

# With Netlify functions (needs .env with GROQ_API_KEY)
netlify dev
```

No build step. No tests. HTML/CSS/JS served as-is.

## Contact

- [reachme.agam@gmail.com](mailto:reachme.agam@gmail.com)
- [linkedin.com/in/agamarora](https://www.linkedin.com/in/agamarora)
