---
type: Theme
slug: spec-first-taste
title: Spec first, taste always  -  the builder trilogy
one_line: "The April 2026 trilogy that names the builder stance: spec > sprint, taste > execution, context > prompt."
status: draft-r9-polished
length_target: 900-1200
voice_register: 1 (free-form post-essay)
beliefs:
  - belief.spec-over-sprint (anchor)
  - belief.taste-over-execution (co-anchor)
  - belief.context-over-prompt (cross-listed agent-first)
  - belief.anti-customization (cross-linked pm-taste; scope: enterprise per D1)
---

# Spec first, taste always  -  the builder trilogy

*Era: E4b 2025-26 · 6+ posts · 4 beliefs*

---

## Core belief

Three lines. One post. April 9, 2026:

> Spec > Sprint
> Taste > Execution
> Context > Prompt

These are not three independent claims. They are three views of the same axiom across three layers: process, craft, and tooling. The composite statement: **the load-bearing work has migrated from doing to deciding.** In an era where AI commoditizes iteration, the constraint is no longer execution speed. It is taste  -  knowing what to build, what to ship, and what to refuse. When you have already specced every pixel, a generative tool gives you a worse version of what you already decided. The spec is the leverage. The model amplifies whatever you put in front of it.

This is Agam's builder stance as of E4b. Not a PM methodology. A disposition.

---

## How it formed

Lived this since 2021. Named it in April 2026. Same disposition, sharper words.

The vocabulary arrived on April 9, 2026. The disposition predates it by five years.

**2021-22: taste-work without taste-vocabulary.** The PM metaphor stack  -  featherless hat (2021-09-22), 99/1 grind (2022-06-03), product-as-parenting (2021-07-12)  -  was doing taste-work under a different name. Looking back, these stack. At the time each was its own post. "Product management is the grind of answering 99 questions of 'should we do it?' to get to that 1 bonus question of 'can we do it?'" The 99 should-we questions are discrimination work. Refusal work. Spec work. Five years before the explicit axiom, the PM job was already framed as 99% taste / 1% execution  -  just not named that way.

**2024: field data from AIonOS.** Building GenAI products for enterprise customers produced a clear signal: smaller implementations are sought after; time to value is king; plug and play is the dream. The enterprise-AI-production-reality thesis forms here. Anti-customization-adjacent observations, but the personal craft-axis hasn't locked.

**2025-12-04: the hinge.** "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings." The shift from "what enterprises want" to "what I am internally committed to" signals E4b builder-phase voice. The corollary before the principle.

**2026-04-09: crystallization.** Tried Google Stitch. Dropped it in under 30 minutes. Not because it was bad  -  it generated a decent layout in seconds. But it could not hit locked design tokens: wrong fonts, wrong colors, approximate everything. The observation becomes the axiom: Spec > Sprint / Taste > Execution / Context > Prompt.

**2026-04-23: the thesis shipped.** Second-brain launch: "Plain markdown. Git. Open source. MIT. Free forever." Eight words, four compressed refusals. The belief is not just declared  -  it is embodied in a shipped artifact.

---

## What it implies

Three structural claims. One underlying disposition.

**Spec > Sprint:** invest in the spec, not in iteration speed. Pre-LLM, iteration was scarce  -  speed was the binding constraint. Post-LLM, iteration is near-zero-cost. The model amplifies whatever you give it. An under-spec'd build gives you noise at speed. A well-spec'd build gives you your own vision back, faster. The rational response to cheap iteration is better preparation, not more iteration.

This is a clean temporal evolution with a specific economics trigger: AI changed the cost structure of iteration. Pre-LLM, the binding constraint was existence  -  ship the thing or it isn't real. Post-LLM, the binding constraint moved upstream to quality-of-spec. Ship-fast (the 2020 belief) is correctly listed as superseded. The shipping cadence did not change. The preparation upstream of it did. (See: [`personal-projects-tinkering`](/wiki/personal-projects-tinkering/) for the evolution arc.)

**Taste > Execution:** the skill AI cannot replace is discrimination. Knowing what is worth building. Knowing what to leave out  -  which is where most AI-era work now lives. Execution was always a craft; now it is also a commodity. The remaining differentiator is the judgment layer: what the builder brings to the spec before the AI is invoked.

**Context > Prompt:** the lever for useful AI output is the context you have curated, not the prompt you compose at the I/O seam. A rich personal and organizational context layer  -  structured knowledge, historical decisions, domain priors  -  outperforms clever prompting every time. The second-brain is the operational form of this claim: a living wiki that every future AI session reads. Context beats prompt the same way spec beats sprint.

The underlying disposition across all three: refuse the fast path. Let the AI sprint at an under-spec'd build and you get noise. Ship a feature without deciding what the product is and you accumulate debt. Craft a clever prompt without curating the context layer and you are optimizing the wrong variable. Agam's builder stance is the systematic refusal of those defaults.

Anti-customization scope: the belief applies to enterprise AI deployments. Six-month implementation cycles, training documents, foundation-model coupling are all enterprise-shaped. The economic argument has not been fully tested against consumer products where the cost structure differs. (Cross-link: [`pm-taste`](/wiki/pm-taste/) for the full anti-customization belief with enterprise scope note; [`enterprise-ai-reality`](/wiki/enterprise-ai-reality/) for the production-reality context.)

---

## Tension with `pm-taste` and `personal-projects-tinkering`

Same person. Same disposition. Different altitude.

`pm-taste` addresses what a PM does institutionally  -  the metaphor stack (featherless hat, 99/1, parenting), the grind of the role, anti-customization applied to PRDs. Mostly timeless. Audience: "how does Agam think about what a PM actually does?"

`spec-first-taste` addresses what a builder does with AI tools in 2026  -  the trilogy as a composite axiom for working with generative AI at the bench level. Temporally anchored. Audience: "how does Agam approach building with AI?"

The 99/1 grind from 2022 is the slow-building form of "Taste > Execution"  -  both say the discrimination work is the work. Anti-customization cross-links both pages: it lives on pm-taste as the strongest personal-craft-axis declaration, and it is cited on spec-first-taste as the most concrete on-record example of the disposition. Same disposition, two entry-point audiences.

`personal-projects-tinkering` is the complement: ship-the-prototype is preparation before shipping, not refusal to ship. The spec-first-taste evolution refined the 2020 ship-fast identity by moving the binding constraint upstream. The shipping verb stayed; the preparation upstream of it changed.

Cross-link: [`pm-taste`](/wiki/pm-taste/)  -  same disposition, institutional altitude. [`personal-projects-tinkering`](/wiki/personal-projects-tinkering/)  -  the ship-fast belief that this one evolved from.

---

## Evidence

| Date | Surface | Claim |
|---|---|---|
| 2021-09-22 | Post | "Product management is a featherless hat that is omnipresent yet indistinguishable if done properly." (taste-as-invisible-load-bearing) |
| 2022-06-03 | Post | "Product management is the grind of answering 99 questions of 'should we do it?' to get to that 1 bonus question of 'can we do it?'." (99/1 as taste-in-practice, pre-vocabulary) |
| 2024-09-04 | Post | 9 takeaways from building GenAI products: "Smaller implementations are sought after" + "Time to value is king" (anti-customization empirical seed) |
| 2025-06-20 | Post | "Plug and play is the dream. No one wants to reinvent every time." (anti-customization named as enterprise signal) |
| 2025-12-04 | Post | "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings." (anti-customization as first-person craft-axis) |
| 2025-12-26 | Post | Shreyas Doshi re-read commitment: "To get this into my muscle memory." (taste as deliberate practice, not innate gift) |
| 2026-04-09 | Post (canonical) | "Tried and dropped Google Stitch in under 30 minutes... Spec > Sprint / Taste > Execution / Context > Prompt" (trilogy declaration) |
| 2026-04-23 | Post | "Plain markdown. Git. Open source. MIT. Free forever." (second-brain launch as embodiment of the trilogy) |

---

---

*Polished: taste-pass decisions applied 2026-04-26.*
