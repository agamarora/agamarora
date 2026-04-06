# CLAUDE.md — agamarora.com

Personal website for Agam Arora. Live at **https://agamarora.com**. Deployed on Netlify. Source repo: `agamarora/aipm` (private).

## Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (ES6 modules). No framework, no build step.
- **Hosting**: Netlify (static site + serverless functions)
- **Fonts**: Roboto via Google Fonts
- **Icons**: Font Awesome 6.5.0 (CDN)
- **Backend**: Single Netlify serverless function (`groqHandler.js`) using Groq SDK (llama-3.1-8b-instant)
- **Domain**: agamarora.com (managed via Netlify DNS)

## File Structure

```
aipm/
├── index.html                    # Landing page (/)
├── explore/
│   └── index.html                # Portfolio page (/explore)
├── lab/
│   └── index.html                # Projects/playground page (/lab)
├── scripts/
│   ├── main.js                   # Landing + global init (theme, animations)
│   ├── explore.js                # Scroll navigation for /explore
│   ├── lab.js                    # Project card animations for /lab
│   └── utils.js                  # Shared: theme toggle, typewriter, scramble effects, Groq API, scroll utility
├── styles/
│   ├── main.css                  # Primary stylesheet (all pages)
│   ├── lab.css                   # Lab-specific overrides
│   ├── backup.css                # Old backup (not referenced)
│   ├── main.css.old              # Old backup (not referenced)
│   └── refactored.css            # Old backup (not referenced)
├── assets/
│   ├── preview.png               # OG/social share image
│   ├── avatar-front.png          # Avatar (front-facing, PNG)
│   ├── avatar-leftup-optimised.webp   # Avatar (left-up angle, WebP)
│   ├── avatar-tilted-optimised.webp   # Avatar (tilted, WebP) — used on /explore hero
│   ├── favicon.ico, favicon.png       # Favicons
│   ├── favicon-16x16.png, favicon-32x32.png
│   ├── favicon-dark.svg, favicon-light.svg
│   ├── apple-touch-icon.png
│   ├── icons/
│   │   ├── icon-192.png          # PWA icon
│   │   └── icon-512.png          # PWA icon
│   ├── images/
│   │   ├── agam-working.webp     # Bento grid avatar
│   │   ├── agam-family-pic.webp  # "My Cozy Space" family photo
│   │   ├── poc-light.svg, poc-dark.svg       # Bento card illustration
│   │   ├── teams-light.svg, teams-dark.svg   # Bento card illustration
│   │   └── world-light.svg, world-dark.svg   # Bento card world map
│   ├── logos/                    # Company logos (light + dark variants, WebP)
│   │   ├── fareye-{light,dark}.webp
│   │   ├── aionos-{light,dark}.webp
│   │   ├── absolutdata-{light,dark}.webp
│   │   ├── aroma-magic-{light,dark}.webp
│   │   └── v2g-{light,dark}.webp
│   └── lab/
│       ├── lab-hero.webp         # Lab page hero background
│       ├── vapi-thumbnail.png    # Shararat thumbnail (PNG)
│       └── vapi-thumbnail.webp   # Shararat thumbnail (WebP)
├── netlify/
│   └── functions/
│       └── groqHandler.js        # Serverless function: Groq LLM proxy
├── package.json                  # Dependencies: groq-sdk, dotenv
├── site.webmanifest              # PWA manifest
├── .env                          # GROQ_API_KEY (not committed)
├── .gitignore                    # Ignores .env, node_modules, .netlify
├── DESIGN.md                     # Approved v2.0 design doc — "The Cinematic Scroll"
├── CHANGELOG.md                  # Release history
├── TODO.md                       # Tech debt inventory (22 items)
├── VERSION                       # Current version (1.0.0)
├── css-refactoring-guide.md      # Internal notes (not deployed, listed for deletion in TODO)
├── how-to-use-css.md             # Internal notes (not deployed, listed for deletion in TODO)
└── README.md                     # Repo readme
```

## Pages

### 1. Landing (`/` — index.html)

**Purpose**: First impression. Establish identity.

**Sections**:
- **Header** (fixed): GitHub, LinkedIn, YouTube icons (left) + lightbulb theme toggle (right)
- **Hero**:
  - Animated greeting cycling through languages: Hello, Hola, Bonjour, नमस्ते, こんにちは, 안녕하세요, Shalom
  - "I'm Agam Arora."
  - "I'm an AI Product Manager. I help enterprises unlock value through [scrambling word] data & AI products."
  - Scramble words: modular → scalable → valuable → efficient → locks to **impactful**
  - Bouncing dot loader animation
  - "Explore" CTA button → /explore
- **Logo strip**: FarEye, AIonOS, AbsolutData, Aroma Magic, V2 Games (theme-aware light/dark)
- **Footer**: Copyright line

**Scripts**: main.js (theme init, greeting typewriter, hero scramble)

### 2. Explore (`/explore` — explore/index.html)

**Purpose**: Portfolio and personal brand. Full-viewport scroll-snap sections.

**Sections**:
1. **Hero** (100dvh):
   - Left: proof badges (12+ years, 1x entrepreneur, 50+ clients), headline "Building products for the age of intelligence", subheadline, "Explore Work" CTA → /lab, "Learn more about me" → LinkedIn
   - Right: avatar image (desktop only, hidden on mobile with background fallback)
   - Scroll hint chevron at bottom
2. **Trusted By** (100dvh): Logo row (same 5 companies), scroll hint
3. **Bento Grid** ("What I Build"): 4-column CSS grid with cards:
   - Dark cards: "AI Product Strategist", "Execution > Ideas"
   - Light cards with icons: "Enterprise Growth Leader", "B2B Champion" (desktop only)
   - Split cards (text + SVG): "Built GenAI that Shipped", "Zero to One. Nailed."
   - Full card: "Led Global Tech Teams"
   - World map SVG, working avatar image
   - Scroll hint
4. **My Cozy Space** (personal/about): 2-column grid with family photo + personal text about family, toddler, wife, dog Luna. Scroll-up chevron.

**Scripts**: main.js + explore.js (scroll button navigation with easeInOutCubic)

### 3. Lab (`/lab` — lab/index.html)

**Purpose**: Project showcase / playground.

**Sections**:
- **Hero** (90dvh): Dark overlay on lab-hero.webp background. "The Lab" headline.
- **Bridge**: Scrambling text (imagine → design → dream → tinker → break → create → innovate → fail → locks to **build**). "Whatever you do, do not stop."
- **Featured Project — Shararat Voice AI**:
  - Badge: "VAPI Build Challenge"
  - YouTube embed (teaser video)
  - Tags: Voice AI, Conversational UX, Natural Language
  - Description of the multi-agent voice experience
  - Action buttons: Try it (shararat.agamarora.com), Watch (YouTube), Code (GitHub)
- **Footer**: "Interested in collaboration?" + mailto CTA

**Scripts**: main.js + lab.js (project card fade-in animation)

## Design System

### Themes

| Token | Light | Dark |
|-------|-------|------|
| `--text-color` | #333333 | #EEEEEE |
| `--background-color` | #FFFFFF | #111111 |
| `--accent-color` | #ACACAC | #FFA726 |
| `--prof-color` | #005A9C (blue) | #FFA726 (orange) |
| `--prof-color-light` | #FFC107 (gold) | #FFCC80 (light orange) |

Theme stored in `localStorage("theme")`. Falls back to `prefers-color-scheme`. Toggled via lightbulb SVG icon. All logos have light/dark variants swapped by JS.

### Typography

- **Font**: Roboto, Helvetica, Arial, sans-serif
- **Base size**: 16px, line-height 1.5
- **Headings**: clamp(2.5rem, 6vw, 4rem) for h1, line-height 1.2
- **Body**: clamp(1rem, 2.5vw, 1.25rem)

### Spacing (8px base)

`--spacing-xxs: 0.25rem` | `--spacing-xs: 0.5rem` | `--spacing-sm: 0.75rem` | `--spacing-md: 1.5rem` | `--spacing-lg: 2rem`

### Layout

- `--max-content-width: 1200px`
- `--header-height: 64px`
- `--border-radius: 8px`

### Breakpoints

- Desktop: 1024px+
- Tablet: 768px–1024px
- Mobile: <768px
- Small mobile: <500px

## JavaScript Features

| Feature | File | Description |
|---------|------|-------------|
| Theme toggle | utils.js `setupThemeToggle()` | Toggles dark-theme class, persists to localStorage, swaps logo images |
| Logo swap | utils.js `swapLogosForTheme()` | Reads data-light/data-dark attributes, swaps img src |
| Typewriter | utils.js `typeLetter()` | Single-run character-by-character typing |
| Type-delete loop | utils.js `typeAndDeleteLoop()` | Cycles through words with type/delete animation |
| Scramble | utils.js `scrambleToWords()` | Random character scramble transitioning between words |
| Scramble + lock | utils.js `scrambleToWordsLockFinal()` | Scramble through words, lock on final word |
| Scroll nav | utils.js `scrollToElement()` | Smooth scroll with easeInOutCubic inside explore-wrapper |
| Groq API | utils.js `callGroq()` | Calls /.netlify/functions/groqHandler (not used in current UI) |
| Explore scroll | explore.js | Wires scroll-down buttons to next section |
| Lab animation | lab.js | Fade-in for project card after 300ms |

## Serverless Backend

**Endpoint**: `/.netlify/functions/groqHandler`
**Model**: llama-3.1-8b-instant (Groq)
**Config**: max_tokens=100, temperature=0.9
**Auth**: GROQ_API_KEY env var (set in Netlify dashboard, not in repo)
**Status**: Wired up in utils.js but **not called from any UI element** currently. Ready for future use.

## SEO & Social

- Open Graph and Twitter Card meta tags on all pages
- Schema.org JSON-LD (Person) on landing and explore pages
- site.webmanifest for PWA support
- Separate OG images: /assets/preview.png (main), /assets/lab-preview.png (lab)
- robots meta: index, follow (lab page)

## Known Issues / Debt

- `styles/backup.css`, `styles/main.css.old`, `styles/refactored.css` are dead files (not referenced anywhere)
- `css-refactoring-guide.md` and `how-to-use-css.md` are internal notes sitting in repo root
- `.env` file exists locally with GROQ_API_KEY (gitignored, but noted)
- Groq integration is fully wired but unused in the UI
- Lab page has only 1 project (Shararat Voice AI)
- Footer copyright says 2025
- LinkedIn URL inconsistent: `/in/agamarora` on landing, `/in/agam-arora/` in schema.org
- Schema.org says "AI Product Leader" on landing, "AI Product Manager" on explore
- Empty `<nav>` tags with comment placeholders on all pages
- `lab.js` has dead code for a `<video>` element that was replaced with a YouTube iframe
