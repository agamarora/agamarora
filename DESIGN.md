# Design System — agamarora.com

> The canonical design reference is the **moodboard** at [/moodboard](moodboard/index.html).
> This file summarizes the locked decisions. When in doubt, the moodboard wins.

**Last updated:** 2026-04-10
**Status:** v2 live on main. Moodboard sections 01-05 locked, 06-10 starting points.

---

## Design Tokens

All tokens are defined in the moodboard (`moodboard/index.html :root`).

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | #0A0A0A | Page background |
| `--surface` | #111111 | Cards, elevated surfaces |
| `--border` | #1E1E1E | Dividers, subtle borders |
| `--text` | #E8E4DF | Primary text |
| `--text-dim` | #7A7A7A | Secondary text, labels |
| `--accent` | #E5A54B | Gold. Links, highlights, the "." in aa. |
| `--accent-dim` | rgba(229,165,75,0.12) | Hover states, subtle backgrounds |

## Typography

| Role | Font | Weight | Source |
|------|------|--------|--------|
| Body / headings | Satoshi Variable | 300-900 | Self-hosted woff2 |
| Code / terminal / labels | JetBrains Mono | 400, 500 | Google Fonts |
| aa. mark | Patrick Hand | 400 | Google Fonts |

No other fonts. Three is the max.

## Spacing

4px base grid. Tokens: `--space-1` (2px) through `--space-11` (128px). See moodboard section 03 for the full scale and semantic aliases (`--gap-tight`, `--padding-card`, `--padding-section`, etc).

## Pages

| Route | Purpose | Design approach |
|-------|---------|-----------------|
| `/` | Landing. Greeting, CTA buttons (Enter, Explore, Resume), company logos | v1 design (light/dark theme via main.css) |
| `/enter` | AI terminal. Keyboard background, Groq streaming, conversation memory | v2 dark-only. Moodboard tokens. |
| `/explore` | Portfolio. Scroll-snap sections, bento grid, personal section | v1 design |
| `/lab` | Projects. Shararat Voice AI showcase | v1 design |
| `/resume` | Career. Dark editorial layout, company links, print-friendly | v2 dark-only. Moodboard tokens. |
| `/moodboard` | Design system reference. 10 sections + living collection | The source of truth. |

## aa. mark

Locked. Patrick Hand font. Stroke-draw animation (dashoffset transition, then fill snap-in). Gold dot. Configurable speed. See `moodboard/aa-mark.html` for the isolated component.

## Keyboard background

3D perspective tilt (`rotateX(55deg) rotateZ(-15deg)`). Scale capped at 2.0. Depth-of-field blur on edge keys. Mouse parallax with subtle drift (lerp-based). Vignette fade via radial gradient. Gold glow on user keypress, muted white glow on bot response.

## What this file replaced

Prior concepts explored and rejected (documented in BUILD-LOG.md):
- Convergence Engine (SVG thread animation)
- Self-Constructing Portfolio
- Playable Portfolio (Phaser.js)
- Cinematic Scroll
- Pixel art character/mascot

The moodboard approach won because it's buildable, shippable, and matches the editorial energy of the site.
