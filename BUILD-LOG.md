# BUILD LOG — agamarora.com v2.0

A documentary of every decision, research finding, dead end, and breakthrough on the road from v1 to v2. The approved spec lives in [DESIGN.md](DESIGN.md). This is the story of how we got there and how we're building it.

**Started**: 2026-03-28
**Branch**: `v2-experience`
**Status**: CEO review complete — "The Convergence Engine". Next: design consultation.

---

## Entry 001 — 2026-03-28: The Starting Point

Approved DESIGN.md after an `/office-hours` session. The concept: a scroll-driven cinematic that tells Agam's 12-year career as a character progression story. A geometric figure grows from simple shapes to full complexity across 4 chapters, then the site transitions into a structured portfolio.

Key decisions already made:
- Vanilla JS + Vite + GSAP (no framework)
- SVG-based character art, abstract/geometric
- Dark-first (Linear aesthetic)
- Mobile gets static cards, not animation
- Act 1 → Act 2 crossfade transition is the highest-risk element

Open questions before any code:
1. **Character art direction** — geometric shapes vs. stylized silhouette? Can we find open-source sprites or do we build from scratch?
2. **Case study content** — which 2-3 products make the strongest teardowns?
3. **Timeline pressure** — job hunting now or building for readiness?

---

## Entry 002 — 2026-03-28: Sprite & Asset Research

**Question**: Are there open-source 2D sprites or SVG character libraries that fit the "abstract geometric figure that evolves" concept? Or do we need to create everything from scratch?

**What we're looking for**:
- Abstract/geometric human figures (not cartoon characters)
- SVG format preferred (for GSAP animation)
- Must support the "growing complexity" narrative — simple shapes → complex forms
- License must allow use on a personal/commercial site
- Dark-theme friendly

### Findings

**Verdict: No off-the-shelf sprites fit. We build from scratch — but with great tooling.**

The open-source illustration ecosystem (Humaaans, Open Peeps, unDraw, Storyset, etc.) is designed for literal human figures or cartoon characters. Nothing matches "abstract geometric figure that evolves through career stages." The closest pre-made assets are building blocks, not finished characters.

#### Tier 1: Animation tools that DO fit (for building the character ourselves)

| Tool | License | What it does | Fit |
|------|---------|-------------|-----|
| **GSAP + MorphSVGPlugin** | Free (public sites) | Morph any SVG path into any other, tied to scroll position. Industry standard. MorphSVG went free in 2025. | **Best option** — already in our stack per DESIGN.md |
| **Flubber** | MIT | Shape interpolation between arbitrary SVG shapes. Returns `t` (0-1) function — perfect for scroll progress. Handles mismatched point counts. | **Excellent backup** if we want MIT-only morphing |
| **Two.js** | MIT | 2D scene graph with SVG renderer. Compose character from primitives (circles, lines, paths), animate individual properties. | **Good for procedural character construction** |
| **Anime.js** | MIT | General animation engine with built-in SVG morphing (`morphTo()`), line-drawing effects, motion paths. ~16KB. | **Lighter alternative to GSAP** |
| **KUTE.js** | MIT | SVG path morphing using D3-based algorithms. Lighter than GSAP, less ecosystem. | Decent, less community support |

#### Tier 2: Asset sources for building blocks (not characters, but useful primitives)

| Source | License | What it offers |
|--------|---------|---------------|
| **SVG Backgrounds** (svgbackgrounds.com) | 180 free shapes | Pure geometric SVG primitives — circles, polygons, stars, abstract forms. Atomic elements to compose into our character. |
| **Boring Avatars** (boringavatars.com) | MIT | 6 abstract styles. **Bauhaus** (geometric color blocks) and **Ring** (concentric circles) are closest to our vision. SVG output. |
| **DiceBear** (dicebear.com) | MIT | 30+ avatar styles. **Shapes** style = "layered geometric forms." Could generate 4 increasing-complexity avatars from the same seed. |
| **Haikei** (haikei.app) | Free (output is yours) | SVG generators for blob scatter, layered waves, polygon scatter. Good for background elements or abstract "body" shapes. |

#### Tier 3: Considered but wrong aesthetic

| Library | Why not |
|---------|---------|
| **Humaaans** (CC0) | Too literal/cartoon. Flat human figures, not geometric. |
| **Open Peeps** (CC0) | Hand-drawn sketchy style. Wrong for Apple/Linear aesthetic. |
| **Stubborn Generator** | Quirky character builder. Not geometric enough. |
| **Storyset** (Freepik) | Illustration-heavy. Too busy for dark premium feel. |
| **Absurd Design** | Surrealist/whimsical. Opposite of the clean geometric vision. |
| **itch.io / OpenGameArt** | Mostly pixel art and cartoon game sprites. Wrong medium entirely. |
| **LottieFiles** | Has some geometric animations but Lottie format is harder to decompose into individually controllable parts vs. raw SVG. Also adds ~300KB dependency. |

#### Tier 4: Interesting tools for later (prototyping & generative art)

| Tool | Use case |
|------|----------|
| **p5.js + p5.js-svg** (LGPL/MIT) | Generative art. Great for procedurally generating character designs, then exporting to SVG for GSAP animation. |
| **Rive** (editor free, runtime MIT) | State-machine animations with scroll sync. Own format (not SVG). Marketplace has community assets. Worth evaluating if GSAP morphing proves insufficient. |
| **SuperformulaSVG** (MIT) | Generates complex organic/geometric SVG shapes from mathematical superformulas. Could create evolving character forms procedurally. |

#### Key references found

- **Codrops (March 2026)**: "SVG Mask Transitions on Scroll with GSAP and ScrollTrigger" — almost exactly our use case
- **Frontend Horse**: "The Linear Look" — breakdown of Linear's dark premium aesthetic, directly relevant to our design language
- **Chris Gannon's CodePen collection**: GSAP SVG animation showcases — good reference for what's possible with morphing
- **awesome-creative-coding** (GitHub): Curated list of creative coding tools and resources

### Decision

**We build the character from scratch using SVG primitives + GSAP MorphSVGPlugin.**

Rationale:
1. No existing library matches the "evolving geometric figure" concept
2. GSAP + MorphSVG is already in our tech stack and is the industry standard for exactly this
3. The character design IS the differentiator — using stock assets would undermine the whole point
4. We design 4 SVG states (one per chapter) and morph between them on scroll
5. Flubber (MIT) is our fallback if MorphSVG licensing becomes an issue

**Next research needed**: Art direction. What does the geometric character actually look like? Need visual references before designing the 4 SVG states. DESIGN.md mentions finding 2-3 Dribbble/Behance examples of abstract geometric character art.

---

## Entry 003 — 2026-03-28: The Pushback — Retro 2D Sprite Packs

**Instinct check**: The "build from scratch with SVG primitives" direction didn't feel right. There are tons of free 2D retro game character sprite packs with multiple animations — walk, idle, run, jump, level-up. Why not USE those? Building from scratch is risky and the geometric abstract concept might not land. A retro game character progression could be just as compelling — and more fun.

**This changes the art direction question entirely.** Instead of "abstract geometric shapes that evolve," we're now exploring: **retro 2D game character that levels up through career stages.** Think RPG character progression — gaining armor, weapons, skills — as a metaphor for career growth.

### Deep Dive: Free 2D Character Sprite Packs

#### Best Fit — Built for Character Progression

**1. CraftPix Swordsman 1-3 Level Pack** (BEST MATCH)
- URL: https://craftpix.net/freebies/free-swordsman-1-3-level-pixel-top-down-sprite-character-pack/
- License: Royalty-free, unlimited commercial
- Style: Pixel art, top-down RPG
- **Three progression levels built-in:**
  - Level 1 — Novice: tattered tunic, wooden sword
  - Level 2 — Brawler: leather vest, sharper blade
  - Level 3 — Hero: shining armor, steel sword
- Animations per level: idle, walk, attack, walk-attack, run, hurt, run-attack, death
- 4-directional (front, back, left, right)
- Format: PNG + PSD

**2. Universal LPC Spritesheet Character Generator**
- URL: https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/
- License: CC-BY-SA 3.0 + GPLv3 (attribution required)
- **Web-based generator** — design the SAME character at different gear levels (plain clothes → leather → iron → gold armor)
- Animations: walk, slash, thrust, shoot, cast, die, bow, climb, run, jump
- Full control over the progression narrative
- Male/female base + dozens of customization options

**3. OpenGameArt Modular Vector Characters (CC0)**
- URL: https://opengameart.org/content/free-cc0-modular-animated-vector-characters-2d
- License: CC0
- Style: Vector, modular body parts (2048x2048)
- Animations: idle, walk, roll, jump, hit, death
- **Modular system**: 3 heads, 3 hairs, 7 eyes, 5 horns, 8 mouths, weapons, wings
- 8 pre-made characters, all parts white for recoloring
- **Progression approach**: Add body parts and accessories as the character "levels up"

#### Same-Style Multi-Pack Progression

**4. LuizMelo Series (all CC0)**
Multiple packs, same consistent pixel art style. Sequence for career metaphor:
- Martial Hero (https://luizmelo.itch.io/martial-hero-2) — barefoot fighter → early career
- Medieval Warrior (https://luizmelo.itch.io/medieval-warrior-pack) — gaining armor → mid career
- Medieval King (https://luizmelo.itch.io/medieval-king-pack) — crowned ruler → leadership
- Each pack: idle, run, jump, fall, attack, take hit, death animations

**5. CraftPix Assassin/Mage/Viking**
- URL: https://craftpix.net/freebies/assassin-mage-viking-free-pixel-art-game-heroes/
- License: Royalty-free, unlimited commercial
- Three distinct character classes, same art style, 128x128px
- Could represent: builder (assassin) → strategist (mage) → leader (viking)

**6. Pixel Frog Tiny Swords (CC0)**
- URL: https://pixelfrog-assets.itch.io/tiny-swords
- Multiple unit types: Warrior → Lancer → Archer → Monk
- 5 color factions, 8 building types
- Colorful, strategy/RTS style

#### Rich Animation Sets (single character, many states)

**7. rvros Animated Pixel Adventurer**
- URL: https://rvros.itch.io/animated-pixel-hero
- License: Free for personal and commercial use
- **30+ animation states**: idle, run, crouch, jump, somersault, fall, slide, sword draw/sheathe, ladder climb, punch (1/2/3), kick (1/2), drop kick, walk, cast spell, use item, air attack, bow animations
- 50x37 pixel canvas, includes Aseprite source file
- One of the most popular free character packs on itch.io

**8. Elthen Pixel Art Adventurer**
- URL: https://elthen.itch.io/pixel-art-adventurer-sprites
- 13+ states: idle, movement, 3x attack, damage, death, jump, climb, shoot, cast spell, run, roll, push, fall

**9. CraftPix Prototype Character Sprites**
- URL: https://craftpix.net/freebies/free-pixel-art-prototype-character-sprites/
- License: Royalty-free, unlimited commercial
- 25 animations at 128px — most of any free pack found
- Clean, readable silhouettes — designed for prototyping

#### Non-Pixel Art Options (HD 2D vector)

**10. GameArt2D Packs (all CC0)**
- The Knight: https://www.gameart2d.com/the-knight-free-sprites.html — HD 2D vector, 7 animations
- Ninja Adventure: https://www.gameart2d.com/ninja-adventure---free-sprites.html — 9 animations
- The Boy, The Robot, Adventurer Girl — all on https://www.gameart2d.com/freebies.html
- Smooth modern illustration style, not pixel art

**11. Kenney Platformer Characters (CC0)**
- URL: https://kenney.nl/assets/platformer-characters
- Clean vector/flat style, 150 assets
- Poses: standing, jumping, ducking, hurt, walking, climbing, swimming

**12. OpenGameArt Animated Stick Figure (CC0)**
- URL: https://opengameart.org/content/animated-stick-figure-character-2d-free-cc0
- Minimalist stick figure with 12 animation states
- Simplest possible character — could be interesting as the "starting point" before evolving into a more complex sprite

#### Also Found (modern/urban theme)

**13. CraftPix City Man Sprites**
- URL: https://craftpix.net/freebies/city-man-pixel-art-character-sprite-sheets/
- 3 modern/urban characters — idle, walk, run, attack, hurt, dead
- **Only pack with a "professional" non-fantasy aesthetic** — relevant since this IS a professional portfolio

### Key Insight

The retro sprite approach opens up a creative direction the geometric concept didn't have: **fun**. A pixel art character leveling up through career stages is:
- Immediately understandable (everyone knows RPG progression)
- Visually delightful (nostalgia + craft)
- Way cheaper to execute (assets exist, just need animation sequencing)
- Memorable in a different way than the "premium dark" sites this competes against

The risk: does it feel too playful/gimmicky for a senior PM portfolio targeting Stripe/Anthropic recruiters? Or does the craft and originality override that concern?

### Decision

**PENDING.** Need to actually look at these packs visually before deciding. Top candidates to evaluate:
1. CraftPix Swordsman 1-3 Level (built-in progression)
2. LuizMelo series (CC0, consistent style, mix-and-match)
3. rvros Animated Pixel Adventurer (richest animation set)
4. CraftPix City Man (modern/urban, non-fantasy)
5. Universal LPC Generator (fully customizable progression)

**Open question for Agam**: Fantasy RPG metaphor or something more grounded? The swordsman-leveling-up metaphor is strong but abstract. The city man pack is more literal but less fun. Or do we mix — start with a simple stick figure/pixel character and evolve into increasingly detailed sprites?

---

## Entry 004 — 2026-03-28: LimeZu Deep Dive + Modern/Tech Sprite Search

Narrowed to **LimeZu Modern Interiors** ($1.50) as the top candidate. It's the only pack with modern clothes, non-combat animations (seated, reading, phone, give object), and a character generator with 100+ outfits. Searched exhaustively for alternatives — nothing else combines modern aesthetic + rich animations.

Also found: CraftPix cyberpunk townspeople (free), TDSM Pixel Citizen ($5), GandalfHardcore Modern NPCs ($9). None match LimeZu's animation variety for the price.

Key reference found: **James Basoo's blog** on CSS scroll-driven sprite animation, and **multiple portfolio examples** using pixel art (RPG 2D Portfolio, nuuneoi interactive profile, mewmewdevart retro gamified portfolio).

---

## Entry 005 — 2026-03-28: First Principles — Office Hours Session

**Stepped back from the website entirely.** Ran a `/office-hours` session to question the fundamentals: does a PM portfolio need case studies? Does it need a game-like experience? What actually matters to recruiters?

### Key realizations from the session:

1. **"This person is different"** — that's the feeling we want. Not "qualified," not "ships." Different.

2. **The pedigree filter is the real problem.** No tier-1 college, no household-name companies. Recruiters pattern-match and filter Agam out before reading the work. The website can't fix credentials.

3. **PMs have no GitHub equivalent.** Engineers have verifiable proof of work. PMs have unverifiable resume bullets. There's no standard "proof of work" platform for product managers.

4. **A personal website is a hygiene factor, not a silver bullet.** Nobody forwards PM portfolios. Nobody visits agamarora.com unprompted. The website is one piece of a bigger system.

5. **"Building a website in isolation is not helping me."** The website needs to serve a larger strategy — but that strategy is undefined.

6. **The circular trap:** "Build a product to prove you can build products to get hired to build products." If the answer is "ship a product with real users," that's startup advice, not job-hunting advice.

7. **The unforgettable website is non-negotiable.** Despite all the strategic questioning, the desire for a wow experience remains. It's both a personal standard and a demonstration of taste.

### Premises agreed:
1. Website alone won't get hired — it's a hub for a larger strategy
2. Pedigree filter is real but beatable
3. Need a proof-of-work artifact beyond the resume
4. One channel at 100% beats four at 25%
5. Website's job is "home base"
6. The wow experience is non-negotiable

### Second opinion (Claude subagent) proposed: **The Playable Portfolio**
Instead of scroll-driven animation, make the site a navigable pixel art world. Walk into career-stage buildings, talk to an AI NPC powered by the existing Groq endpoint. A playable world, not a scrollable page.

---

## Entry 006 — 2026-03-28: The Playable Portfolio — Prototype + Rejection

**Went all-in on the playable world concept.**

### What we built:
1. Downloaded LimeZu Modern Interiors free pack
2. Learned Tiled map editor — designed a test room (14x9 tiles, wooden floor, white walls, furniture)
3. Built a rendering pipeline: Python script that reads Tiled JSON + tileset PNGs → composites room images
4. Created desktop vs. mobile mockup comparison
5. Built a **working Phaser.js prototype** — actual character walking around the Tiled room with arrow keys, interaction zones on furniture, dialogue boxes popping up on Enter

### What we learned:
- **Tiled is easy.** First room took ~10 minutes. Drag-and-drop tile painting.
- **Phaser.js works.** Character movement, tilemap rendering, collision, and interaction all functional.
- **The pipeline is proven:** Tiled → JSON → Phaser → browser. It works.
- **LimeZu assets look out of place on bare #111** — they need their own tileset environment (floors, walls). The game viewport needs warm interiors; the dark background frames the viewport.
- **Mobile works conceptually:** Camera zooms in, follows character, dialogue sheet at bottom.

### The honest verdict:
**The interaction model doesn't work.** Walking around a room and pressing Enter to read text boxes is just a more annoying way to read a webpage. It's not a wow experience — it's a game mechanic without a game. The novelty wears off in 30 seconds.

The pixel art aesthetic is appealing. The retro vibe is fun. But "walk to sofa, press Enter, read text about product strategy" is not the experience that makes a recruiter at Anthropic say "I've never seen a PM do this." It's a gimmick dressed up as innovation.

### What's preserved:
- Phaser.js prototype in `experiments/phaser-prototype/`
- Tiled map at `D:\AA\Tiled-AIPM-Project\test1.tmj`
- All research documented above
- LimeZu free pack downloaded locally
- Design doc at `~/.gstack/projects/agamarora-aipm/`

### What's still true:
- The unforgettable website is non-negotiable
- Mobile and desktop must be equally great
- The retro/pixel art aesthetic is interesting but the interaction model needs rethinking
- The bigger career strategy (distribution, proof of work) remains unsolved
- **No approach is confirmed yet. We're still searching.**

### Open question:
What interaction model would actually create a wow? Not walking and reading. Not scrolling and watching. Something that makes the visitor FEEL something in the first 10 seconds. We haven't found it yet.

---

## Entry 007 — 2026-03-28: The Self-Constructing Portfolio — Concept Locked

**Ran a second `/office-hours` session** focused solely on the interaction model question. After riffing through multiple directions, landed on the concept that felt right.

### The concept:

**The portfolio doesn't exist when you arrive. The page constructs itself.**

Dark page. Within 3-5 seconds, text begins typing itself into position — not in a chat window, but directly into the page layout. Headings materialize. Sections build themselves. Cards appear. Metrics animate into their slots. The page assembles before your eyes, as if an AI agent is constructing it in real time.

### Key decisions made:

1. **No chat interface.** The agent's narration text IS the page content — headings, paragraphs, labels type themselves into their final layout positions. No chat bubbles, no sidebar, no floating widget. Agam called chatbots "the most outdated AI usage over the last few years."

2. **Scripted core, not generative.** The page-build animation is choreographed and hand-crafted. It LOOKS like AI construction but is actually a perfectly polished cinematic. Agam's insight: "we are making something that may not ever work with the same level of polish" if truly AI-generated each time. Reliability over novelty.

3. **Text-first, voice optional.** Voice narration is progressive enhancement ("best with headphones" toggle). Recruiters are often at their desk without headphones.

4. **Tech stack unconstrained.** Explicitly rejected the prior "vanilla JS only" constraint. "Who said vanilla JS is a constraint?" Framework, animation library, build tool — all TBD, all follow the experience design.

5. **No compromise on vision.** When asked about shipping a stripped-down version, chose "I don't want to compromise." Full page builder, voice mode, the works.

### What's still open:

- **Level 2 AI experience.** After the page builds (first 60 seconds), what's the genuinely novel AI interaction? Explored options (live product teardown, problem solver, personalized deck, agentic demo) but parked the discussion — "we are going all over the place." Next session.
- **Tech stack.** React/Next.js + GSAP? Astro? Vercel AI SDK hybrid? Decided after Level 2 is locked.
- **The hook line.** The first sentence that types onto the page at second 3.
- **Case study content.** Which 2-3 products make the strongest teardowns.

### Landscape research:

Searched the 2026 landscape for AI-powered portfolios and generative UI. Found:
- AI portfolios exist but are ALL chatbot-on-a-page. Nobody has a self-constructing page.
- Vercel AI SDK generative UI is production-ready (streaming React components from LLMs).
- CopilotKit, assistant-ui, Google A2UI are mature frameworks for the AI layer.
- The gap is clear: everyone uses AI as a chatbot ON a portfolio. Nobody uses AI as the page constructor itself.

### Updated design doc:

Full spec in [DESIGN.md](DESIGN.md). Supersedes the prior "Cinematic Scroll" design.

---

## Entry 008 — 2026-03-28: CEO Review — "The Convergence Engine"

Ran `/plan-ceo-review` on the Self-Constructing Portfolio spec. The CEO review made several critical course corrections:

### What changed:

1. **Content is not a blocker.** Every design element is parameterized by structure (section count, thread count), not words. Placeholder content is sufficient for Phase 1.
2. **One design, two adaptations — not two designs.** The convergence theme must be consistent across mobile and desktop. A desktop SVG convergence + mobile circle indicator = two different stories. Wrong. One coherent visual metaphor that adapts.
3. **Mobile is not "desktop but narrower."** Mobile is a fundamentally different UX ecosystem. Swipes and touches, not clicks and scrolls. One-handed, variable attention. The convergence might need a completely different visual expression on mobile.
4. **Design mobile-first.** Start from the phone experience and scale UP to desktop.
5. **Build on v2-experience branch.** v1 is safe on main.

### New concept locked: "The Convergence Engine"

Five career threads (analytics, gaming, beauty, logistics, AI) physically converge as you scroll, representing skills compounding toward AI product leadership. Mobile-first. One coherent visual metaphor.

Output: [DESIGN-BRIEF.md](DESIGN-BRIEF.md) — the input for design consultation.

---

## Entry 009 — 2026-03-29: Design Consultation — 6 Concepts Explored and Rejected

Ran `/design-consultation` using DESIGN-BRIEF.md as input. Did competitive visual research (visited Linear, Stripe, Anthropic, Figma with headless browser, searched portfolio landscape). Then built 6 distinct HTML concept prototypes. Every one was rejected — each for a different reason, collectively revealing what the v2.0 experience must NOT be.

### Research findings:

**Target company visual language:**
- **Linear**: Near-black background (#09090B), Inter Display/Inter fonts, almost entirely monochrome, product UI IS the decoration, enormous negative space
- **Stripe**: Light base, rich gradients (purple/pink/amber), more expressive, logo marquees, premium enterprise feel
- **Anthropic**: Clean, understated, academic-meets-tech, minimal decoration
- **Figma**: Light with green accent (#0ACF83), playful but professional

**Portfolio landscape (2026):** PM portfolios are still boring Squarespace/Webflow with resume content. Scrollytelling is mainstream (The Pudding, SCMP) but nobody applies it to PM career narratives. Framer is popular for modern portfolios. Award-winning portfolios use WebGL/3D but are all designer/developer portfolios, not PM portfolios.

### Concepts built and rejected:

| # | Concept | What it was | User reaction | Why it failed |
|---|---------|-------------|---------------|---------------|
| A | Luminous Editorial | Dark scroll, Instrument Serif, glowing SVG threads behind chapters, grain texture | "v1.1 not v2.0" | Passive scroll-and-read. 5 sections with text. Generic. |
| B | Kinetic Chromatic | Dark scroll, Source Serif 4, giant 180px metrics, color washes per chapter, canvas-rendered threads | "v1.1 not v2.0" | Same pattern as A with bigger numbers. Still scroll-and-read. |
| C | Interactive Convergence | 2D canvas, 5 floating thread-nodes with physics, click to explore, threads drift to center after reading, merge animation | "Different but not unique enough" | Better interactivity but fundamentally "click → read → visual feedback." Not a standalone experience. |
| D | Neural 2D | 2D canvas, 5 neuron clusters with dendrites, synaptic pulses travel along connections, hover synapses for skill descriptions | "Clean, not v2.0" | Same pattern as C with neural aesthetic. Good looking, not share-worthy. |
| E | Code Review | Pixel-perfect GitHub PR UI, career told as TypeScript files with imports showing skill dependencies, git branch graph, review comments, merge button CTA | "Boring, didn't excite" | Clever interface hack but fundamentally reading text. The "aha" of imports-as-dependencies doesn't create emotional impact. |
| F | Living 3D Graph | Three.js, 5 clusters in 3D space, orbit controls, click to zoom into clusters, cross-cluster connections form, convergence animation | "Good looking, could be an additional page, but not standalone" | Visually appealing but not a complete experience. Could work as a sub-page of v1. Not the hero. |

### Design system decisions that ARE validated (carry forward):

- **Dark-first** (Linear-adjacent near-black): Confirmed across all concepts, never questioned
- **Typography**: Instrument Serif (display) + Instrument Sans (body) + JetBrains Mono (metrics) — the editorial pairing was never rejected, just the delivery mechanism
- **Thread colors**: Desaturated palette with one warm accent (amber/gaming) — the muted-to-vivid reveal concept was interesting
- **Spacing**: 8px base, spacious density — premium whitespace is table stakes
- **Motion**: GSAP ScrollTrigger — tech is right even if scroll-only delivery is wrong

### What we learned (the pattern across all 6 rejections):

1. **"Content wrapped in a visual container" is not v2.0.** Every concept was fundamentally "navigate to content, read content, see animation." The container changed (scroll, nodes, 3D, GitHub PR). The pattern never did.

2. **Passive consumption is the enemy.** Scroll-and-read, click-and-read, orbit-and-read — all passive. The visitor is a spectator, not a participant.

3. **"Clean and good looking" ≠ shareable.** Every concept was polished. None made someone want to forward a URL. Visual quality is necessary but not sufficient.

4. **Desktop-first thinking kept creeping in.** The OS concept, 3D orbit controls, GitHub PR layout — all optimized for desktop. The core audience (recruiters) opens links on their phone.

5. **The convergence STORY is strong.** Never questioned across 6 concepts. The problem is always delivery, never narrative.

6. **Concept F (3D graph) has legs as a secondary page.** Not the hero experience but worth preserving as an exploration/deep-dive page within v1 or v2.

### What "shareable" actually requires:

The user's consistent feedback: "this is not an experience," "not something people would share," "not breaking the mold." Analyzing what IS shared:
- Experiences that make you FEEL something (emotional impact in <10 seconds)
- Experiences where you DISCOVER something (the insight is yours, not told to you)
- Experiences that are impossible to describe — you have to see them ("open this link")
- Mobile-native interactions (thumb-friendly, one-handed, interruptible)

### What's NOT working as a direction:

- Scroll pages (any variation) — too passive
- Node/graph visualizations (any variation) — too cerebral, not emotional
- Interface hacks (GitHub PR, OS, terminal) — clever but cold
- Desktop-first spatial experiences (3D, canvas) — wrong device

### Open questions going into the next brainstorm:

1. **What mobile-first experience makes a recruiter think "get this person on the phone" within 60 seconds?**
2. **What experience would make the visitor DISCOVER the convergence themselves — without being told?**
3. **What does "wow" mean for this specific audience (busy hiring managers, phone, 30 seconds)?**
4. **Can the convergence theme survive a format change, or does the format need to drive the theme?**
5. **What mobile experiences has Agam personally found share-worthy?** (Reference needed — not websites, any app/link/content.)

### Status:

**Back to the drawing board.** The convergence narrative is locked. The delivery mechanism is completely open. Next step: brainstorm from the audience and device backward, not from the visual concept forward.

---

## Entry 010 — 2026-03-29: The Real Conversation — Beyond the Website

### What surfaced:

The design consultation hit a wall after 6 rejected concepts. Instead of proposing a 7th, we had the honest conversation about the actual problem.

**Agam's real situation:**
- Based in India, not the US. Geographic barrier is real.
- No pedigree — no FAANG, no Stanford/MIT, no household-name companies.
- Even with referrals, has never gotten a callback from target companies (Anthropic, Stripe, Linear, Figma).
- Resume alone does not open doors.
- Knows YouTube and side projects need to restart, but those channels haven't broken through either.
- A website alone is not the golden ticket — but it has to be PART of the golden moment.

### The pivot in thinking:

Tried to reframe the website as "home base that captures attention created elsewhere" (YouTube, side projects, content). Agam pushed back: **"the website has to be the viral moment."** LinkedIn and YouTube are rented platforms where the algorithm decides who sees you. The website is the one channel with full control.

This is correct. The viral portfolio moments that changed careers (Bruno Simon, Robby Leonardi) weren't from people with FAANG pedigree. The website WAS the pedigree.

### The key insight:

**Every viral portfolio was a product, not a portfolio.**

Bruno Simon's site isn't "a portfolio with a 3D car." It's a TOY that happens to contain a portfolio. Robby Leonardi's isn't "a resume with side-scrolling." It's a GAME that happens to be a resume. People shared them because the THING was fun/cool/novel. The career info was secondary.

We've been trying to make the convergence story the main character and find a delivery mechanism for it. Every viral portfolio did the opposite — **the experience was the main character and the career info rode along.**

### The inversion:

Old question: "How do we deliver the convergence story in a wow way?"
New question: **"What PRODUCT could agamarora.com be — something genuinely useful or delightful — that naturally embeds the convergence story as context?"**

For an AI product leader specifically, this product should demonstrate AI product thinking. Not a chatbot. Something where the AI capability is genuinely impressive and the portfolio is woven into the experience of using it.

### What this means for the design consultation:

The `/design-consultation` for visual design system (typography, color, spacing) is **paused**. Those decisions depend on what the product IS. You don't pick fonts before you know if you're building a tool, a toy, a demo, or an experience.

### The question going into the next session:

**If agamarora.com is a product, what would it be?**

Constraints:
- Must demonstrate AI product leadership (the medium IS the resume)
- Must be mobile-first
- Must be genuinely useful or delightful (not a gimmick)
- Must naturally embed the convergence narrative
- Must be shareable — people forward it because the PRODUCT is interesting
- Must be buildable by one person (Agam + AI tools)
- The career info rides along, it's not the main character

### Status:

Context will be cleaned and a fresh session will start on the product question. All 6 concept prototypes are in temp files. Concept F (3D graph) is noted as a possible sub-page for later. The convergence narrative, visual research, and design system decisions (Instrument Serif, dark-first, thread colors) are preserved in this log and DESIGN-BRIEF.md for when the product direction is locked and visual design resumes.

### Prototypes built (preserved for reference):
- `concept-a-luminous.html` — Scroll + Instrument Serif + glowing SVG threads
- `concept-b-kinetic.html` — Scroll + Source Serif 4 + giant metrics + color washes
- `concept-c-interactive.html` — 2D interactive floating nodes with physics
- `concept-d-neural.html` — 2D neural network with synaptic pulses
- `concept-e-codereview.html` — GitHub PR interface, career as TypeScript imports
- `concept-f-livinggraph.html` — Three.js 3D neural graph with orbit controls

---

## Entry 011 — 2026-04-04: Process Reset — Prototypes Over Documents

### Context:
After 10 entries and 6 rejected concepts, recognized the meta-problem: we were producing documents about a site that doesn't exist. The iteration loop was ideate → document → review → reject → document the rejection. Docs became the output, not the product.

### New process (effective now):

1. **Ideate** — conversation, not documents. Fast and messy.
2. **Spike** — when something clicks, build a clickable HTML/CSS/JS prototype. 2-3 hours max. No design system, no perfection. Just enough to feel it.
3. **React** — open it on phone. 5-second gut check. Kill it or keep going.
4. **Document** — after every spike (pass or fail), write a BUILD-LOG entry with:
   - Concept name + one-line pitch
   - What made it different from previous attempts
   - Screenshot/link to the prototype
   - Verdict — kill or continue, and specifically WHY
   - What we now know that we didn't before
5. **Lock** — concept survives multiple spike rounds → write the real spec.

### Key rule:
**Prototypes are the documentation.** No spec until a concept has been validated by building it. BUILD-LOG entries prevent circling back to explored territory.

### What we've already ruled out (quick reference):
- Scroll pages (any variation) — too passive
- Node/graph visualizations — too cerebral, not emotional
- Interface hacks (GitHub PR, OS, terminal) — clever but cold
- Desktop-first spatial experiences — wrong device
- Walking-around game world — gimmick wears off in 30 seconds
- "Content wrapped in visual container" — the pattern behind all 6 rejections

### What's locked (survived every pivot):
- Convergence narrative (5 industries → 1 AI leader)
- Dark-first aesthetic
- Mobile-first design
- Target: Anthropic/Stripe/Linear/Figma recruiters
- The site must be a PRODUCT, not a portfolio
- Career info rides along, experience is main character

### The open question:
**If agamarora.com is a product, what would it be?**

### Status:
Ready to ideate. No more docs until there's a prototype to document.

---

## Entry 012 — 2026-04-04: Office Hours Deep Dive — Research Gold, Concept Still Missing

### What happened:
Ran a full YC-style `/office-hours` session (startup mode — "I am the product"). Did deep research into how Anthropic/Stripe/Linear actually hire PMs. Got a cross-model second opinion. Generated 3 product approaches. All circled back to existing patterns.

### Critical research findings (carry forward to ALL future sessions):

1. **Target = Hiring Manager, not recruiter.** Head of Product / Director of PM. Recruiters filter; HMs get excited.
2. **Anthropic does "vibe coding exercises" in PM interviews.** You build working prototypes. Not pseudocode.
3. **Anthropic's culture: "demos over documentation."** (Cat Wu, Head of Product, Claude Code)
4. **Consumer PM role wants: "former consumer founders who ship products people love to tell friends about."**
5. **"People who land these roles have proof they can do the work before they're hired."**
6. **PM role globally shifting from PRDs to prototypes.** "Progress is measured by feedback, not files."

Sources: claude.com/blog/product-management-on-the-ai-exponential, Aakash Gupta's Anthropic hiring guide, alloy.app product agents article.

### Premises locked:

1. Target = hiring manager (Head of Product)
2. Site IS the product sense demonstration, not describes it
3. **Convergence narrative DROPPED ENTIRELY.** (Biggest decision — this survived 10 entries before being killed. Product is the proof. About page footnote at most.)
4. Product must be natively AI-era — couldn't exist before AI
5. Quality creates shareability naturally

### Approaches explored and rejected:

| Approach | What it was | Why it failed |
|----------|-------------|---------------|
| A: "Roast My Product" | URL paste → PM-level product critique via Claude API | Just one product that goes ON the lab page. Not a new concept for the site itself. |
| B: "Product Sense" | Screenshot → reverse-engineer PM decisions | Harder to share, less immediately "wow," still just a project on a page |
| C: "The Build Log" | Weekly micro-products, public shipping record | **This is what the existing /lab page already does.** Adding more projects to a showcase page is not v2. |

### What we now know:
- We're falling into "gallery of good things" because we haven't found the ONE great thing
- Bruno Simon / Robby Leonardi didn't need a lab page — the experience WAS the site
- The test for any concept: "The hiring manager's reaction should be 'wait, who built this thing I've been using?'"
- Three approaches that seem different can all collapse into the same pattern (showcase page with products)

### What's still ruled out (updated):
- Everything from Entry 011's list
- PM copilots/tools — crowded, derivative
- Chatbots — any form
- Gallery/showcase page with products — this is what v1/lab already does

### What's changed from Entry 011:
- **Convergence narrative: DEAD** (was "locked", now dropped entirely)
- **Target sharpened**: from "Anthropic/Stripe recruiters" to "Head of Product at Anthropic"
- **New constraint**: must be natively AI-era (couldn't exist before AI)

### Status:
Concept still missing. Premises are sharper than ever. Research is gold. Next session: optimize v1 while the concept search continues in parallel.

### Design doc:
Full session output at `~/.gstack/projects/agamarora-aipm/Agam-v2-experience-design-20260404-151420.md`
