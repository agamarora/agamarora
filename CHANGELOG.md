# Changelog

All notable changes to agamarora.com will be documented in this file.

## [Unreleased]

### v2.0 — Enter + Resume + AI Terminal (2026-04-10)
- `/enter` page: keyboard background with 3D perspective, AI terminal powered by Groq (llama-3.1-8b-instant), SSE streaming with word-by-word animation, conversation memory (6 messages), rotating question prompts with click-to-prefill, gold keyboard glow for user input, muted white for bot replies
- `/resume` page: dark editorial design using moodboard tokens, company links, mobile responsive, print-friendly
- Homepage: "Enter" (CTA), "Explore" (secondary), "Resume" buttons
- Groq serverless function: 4-model fallback, sandwich prompt defense, injection filter, CORS exact match, conversation history support
- System prompt v3: few-shot examples, real resume data, eval harness (36 test cases, 8.3/10 score)
- All metadata updated: "AI Product Manager" (was "Product Leader")
- Design system: DESIGN.md rewritten to reference moodboard as source of truth (Convergence Engine concept archived)
- Redirects: /preview and /talk both 301 to /enter

### Project Documentation
- Added CLAUDE.md with full project documentation
- Added TODO.md tracking tech debt
- Added CHANGELOG.md and VERSION (1.0.0) for release tracking
- readme.md rewritten as personal intro with banner, links to resume.md
- resume.md added as career data source of truth

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
