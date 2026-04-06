# Changelog

All notable changes to agamarora.com will be documented in this file.

## [Unreleased]

- Added DESIGN.md with approved v2.0 design: "The Cinematic Scroll" (scroll-driven career animation + portfolio)
- Added CLAUDE.md with full project documentation
- Added TODO.md with 22 tech debt items across 6 categories
- Added CHANGELOG.md and VERSION (1.0.0) for release tracking
- Updated README.md with page table, stack overview, and dev setup

## [1.0.0] — 2025-05-28

Initial version of the site as it stands today.

### Landing Page (`/`)
- Animated multilingual greeting (Hello, Hola, Bonjour, नमस्ते, こんにちは, 안녕하세요, Shalom)
- Text scramble effect cycling through modular → scalable → valuable → efficient → impactful
- Company logo strip (FarEye, AIonOS, AbsolutData, Aroma Magic, V2 Games)
- Dark/light theme toggle with lightbulb SVG animation

### Explore Page (`/explore`)
- Full-viewport scroll-snap sections
- Hero with proof badges (12+ years, 1x entrepreneur, 50+ clients)
- Trusted By logo row
- Bento grid: AI Product Strategist, Built GenAI that Shipped, Led Global Tech Teams, Zero to One, Execution > Ideas
- "My Cozy Space" personal section with family photo

### Lab Page (`/lab`)
- Dark hero with background image
- Scramble bridge text (imagine → design → dream → ... → build)
- Featured project: Shararat Voice AI (YouTube embed, try/watch/code buttons)
- Collaboration footer with mailto CTA

### Infrastructure
- Netlify deployment with custom domain agamarora.com
- Groq serverless function (llama-3.1-8b-instant) wired but unused in UI
- PWA manifest with app icons
- Open Graph and Twitter Card meta on all pages
- Schema.org JSON-LD (Person)
