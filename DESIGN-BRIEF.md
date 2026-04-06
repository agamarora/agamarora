# Design Consultation Brief — The Convergence Engine

**Branch:** v2-experience | **Date:** 2026-03-28
**Context:** Output of CEO review (/plan-ceo-review). Input for /design-consultation.
**Supersedes:** DESIGN.md assumptions about dual-layout and content-as-blocker.

---

## The Problem

Agam Arora is a 12-year AI product leader targeting senior PM roles at Anthropic, Stripe, Linear, Figma. No tier-1 pedigree (no FAANG, no Stanford/MIT). Career path crosses 5 industries: data analytics → game studio founder → beauty brand expansion → logistics platform 10x transformation → AI product leadership.

A resume presents this as chaos — 5 unrelated industries in 12 years. The website must reframe it as **convergence** — every chapter built a skill that compounds into the current AI work. The medium must change what the content means.

## The Theme: Convergence

Five career threads that were always heading toward the same point. Not a generalist ("I figure things out"). A specialist with range — someone who walks into unfamiliar territory and ships. Five times. With proof.

The through-line: "Everything converges here."
- **Analytics (Absolutdata)** → ML/data foundation
- **Gaming (V2 Games, founded)** → Acquisition/Retention/Monetization framework, engagement loops
- **Beauty/Retail (Blossom Kochhar)** → BD, negotiation, tech-driven process optimization across non-technical orgs
- **Logistics (FarEye)** → B2B SaaS platform architecture, 10x scale, data lakehouse
- **AI (AIonOS, now)** → The convergence point. RAG, Agentic AI, MAS, Voice AI, Copilots

## The Audience

Recruiters and hiring managers at Anthropic, Stripe, Linear, Figma. The site's job: make someone say "get this person on the phone." It is not the interview itself.

## Locked Premises

1. The website's job is to get someone on the phone, not close the deal.
2. Positioning: AI product leader whose non-obvious career path is the differentiator.
3. Cannot defeat the pedigree filter. CAN defeat "bounced around" by showing compounding skill accumulation.
4. Content must be specific enough to create credibility without verification. Vague = AI copywriting. Specific = truth.
5. Interaction model: visitor-controlled pace — not passive auto-animation.
6. Each career chapter needs: domain, honest challenge, specific decision, hard number, skill carried forward. No filler.
7. The "wow" comes from story + craft, not animation tricks. Animation serves narrative.
8. Design quality IS the proof of product taste. Must feel like it was built by someone who belongs at Stripe/Linear/Anthropic.

## What the CEO Review Established

1. **Content is not a blocker.** Every design element is parameterized by structure (section count, thread count), not words. Placeholder content (from GitHub README) is sufficient for Phase 1. Content is refined in parallel.

2. **One design, two adaptations — not two designs.** The convergence theme must be consistent across mobile and desktop. A desktop SVG convergence + mobile circle indicator = two different stories. Wrong. One coherent visual metaphor that adapts.

3. **Mobile is not "desktop but narrower."** Mobile is a fundamentally different UX ecosystem:
   - Swipes and touches, not clicks and scrolls
   - One-handed, variable attention, interruptible
   - Visual subtlety gets lost on small screens
   - 5 thin SVG lines converging on 390px may not have enough visual impact
   - The convergence might need a completely different visual expression on mobile — not a layout adaptation but a rethinking of how convergence FEELS when you're touching glass with your thumb

4. **Design mobile-first.** Start from the phone experience and scale UP to desktop. Not the other way around.

5. **Build on v2-experience branch.** v1 is safe on main. The Astro project IS the prototype — no separate throwaway prototypes needed.

## Open Design Questions

1. **How does convergence manifest visually on a phone?** Thin SVG paths may not work. What visual metaphor for convergence is impactful at 390px width with touch interaction?

2. **How does the mobile convergence design scale up to desktop?** The mobile design is the foundation. Desktop is the adaptation with more room.

3. **Color system.** One color per career thread? What palette says "premium AI product" not "creative agency"? Dark-first (Linear aesthetic) with light mode support.

4. **Typography.** What font family communicates the right level of craft? Roboto (current) feels generic for this level of ambition.

5. **The hook line.** First text on the page. Must make a recruiter lean forward in <5 seconds.

6. **The convergence payoff moment.** When the threads finally merge — what happens? How does it feel?

7. **The beauty/retail chapter.** Weakest link for the AI convergence story. Frame honestly as "BD + tech-driven optimization" or cut? (Premise 6: no filler chapters.)

8. **Interaction model on mobile.** Is scroll the right input? Or could convergence be expressed through touch/swipe — the user PARTICIPATES in bringing threads together?

## Constraints

- Performance: <2s first paint, 60fps scroll animation, ~300KB page weight budget
- Accessibility: prefers-reduced-motion support, semantic HTML, WCAG AA contrast, keyboard nav, no-JS fallback
- Tech: Astro + GSAP ScrollTrigger + Vite (chosen stack). Netlify deployment.
- Quality bar: indistinguishable from a Stripe/Linear marketing page.

## What Already Exists

- v1 site live at agamarora.com (vanilla HTML/CSS/JS on main branch)
- Theme system pattern (dark/light toggle, CSS custom properties, localStorage)
- Two rejected prototypes in experiments/ (pixel art room, Phaser.js game)
- Full decision history in BUILD-LOG.md
- Netlify deployment pipeline configured

## Career Content (for placeholder use)

Key numbers available:
- FarEye: 10x scale, 60-day→7-day delivery time, NPS 3.6→4.7
- V2 Games: 18-person team, $75K ARR
- Blossom Kochhar: 70% partner conversion, 15% cost reduction
- AIonOS: RAG, Agentic AI, MAS, Voice AI, Copilots

## Landscape Context

- PM portfolios are still boring (clean Squarespace with resume content)
- Scrollytelling is proven (SCMP, The Pudding, BMW) but nobody applies it to PM career narratives
- GSAP ScrollTrigger is industry standard. Astro + GSAP is a proven combo (Codrops, Feb 2026)
- SVG Mask Transitions tutorial (Codrops, March 2026) validates SVG + GSAP + ScrollTrigger pattern
- The gap: everyone uses scrollytelling to present content better. Nobody uses it to reveal a pattern invisible from raw data.

## Workflow

1. **/design-consultation** — using this brief as input. Finalize visual design system, mobile convergence metaphor, typography, color, spacing.
2. **Return to /plan-ceo-review** — mode selection + remaining sections.
3. **/plan-eng-review** — architecture, tests, performance plan.
4. **Build.**
