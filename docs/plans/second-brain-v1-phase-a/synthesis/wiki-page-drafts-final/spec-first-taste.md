---
type: Theme
slug: spec-first-taste
title: Spec first, taste always  -  the builder trilogy
one_line: "The April 2026 trilogy that names the builder stance: spec > sprint, taste > execution, context > prompt."
status: c-voice-r1-cp8
length_target: 1100-1500
voice_register: 1 (free-form post-essay)
beliefs:
  - belief.spec-over-sprint (anchor)
  - belief.taste-over-execution (co-anchor)
  - belief.context-over-prompt (cross-listed agent-first)
  - belief.anti-customization (cross-linked pm-taste; scope: enterprise per D1)
---

# Spec first, taste always  -  the builder trilogy

This is one of twelve themes in the wiki. It names the builder stance that crystallized on April 9, 2026: three lines, one post - Spec > Sprint, Taste > Execution, Context > Prompt. You are likely here because you saw the trilogy somewhere on this site and want the argument behind it. This page sits between [pm-taste](/wiki/pm-taste/) - the same disposition at the institutional PM altitude - and [agent-first](/wiki/agent-first/) - where "Context > Prompt" becomes a craft posture for agentic system design.

The three lines are not independent claims. They are three views of the same axiom across process, craft, and tooling. The composite: the load-bearing work has migrated from doing to deciding.

## The trilogy

Three lines. One post. April 9, 2026:

> Spec > Sprint
> Taste > Execution
> Context > Prompt

I tried Google Stitch that morning. Dropped it in under 30 minutes. Not because the tool was bad - it generated a decent layout in seconds. But it could not hit locked design tokens: wrong fonts, wrong colors, approximate everything. The observation became the axiom.

**Spec > Sprint:** when AI makes iteration near-zero-cost, better preparation beats more iteration. Pre-LLM, the binding constraint was existence - ship the thing or it isn't real. Post-LLM, the constraint migrated upstream to quality-of-spec. A well-spec'd build gives you your own vision back, faster. An under-spec'd build gives you noise at speed.

**Taste > Execution:** the skill AI cannot replace is discrimination. Knowing what is worth building. Knowing what to leave out - which is where most of the work now lives. Execution was always a craft; now it is also a commodity. The judgment you bring to the spec before the AI is invoked is the remaining differentiator.

**Context > Prompt:** the lever for useful AI output is the context you have curated, not the prompt you compose at the I/O seam. A rich personal context layer - structured knowledge, historical decisions, domain priors - outperforms clever prompting every time. The second-brain is the operational form of this claim.

The underlying disposition across all three: refuse the fast path. Let the AI sprint at an under-spec'd build and you get noise. Craft a clever prompt without curating the context layer and you are optimizing the wrong variable.

## How it formed

Lived this since 2021. Named it in April 2026. Same disposition, sharper words.

**2021-22: taste-work without taste-vocabulary.** The PM metaphor stack - featherless hat (2021-09-22), 99/1 grind (2022-06-03) - was doing taste-work under a different name. "Product management is the grind of answering 99 questions of 'should we do it?' to get to that 1 bonus question of 'can we do it?'" The 99 should-we questions are discrimination work. Refusal work. Five years before the explicit axiom, already framed as 99% taste / 1% execution - just not named that way.

**2024: field data from AIonOS.** Building GenAI products for enterprise customers produced a clear signal: smaller implementations are sought after, time to value is king, plug and play is the dream. Anti-customization-adjacent observations, but the personal craft-axis had not locked yet.

**2025-12-04: the hinge.** "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings." The shift from what enterprises want to what I am internally committed to. The corollary before the principle.

**2026-04-09: crystallization.** Google Stitch. Thirty minutes. Wrong fonts, wrong colors, approximate everything. Spec > Sprint / Taste > Execution / Context > Prompt.

**2026-04-23: the thesis shipped.** Second-brain launch: "Plain markdown. Git. Open source. MIT. Free forever." Eight words, four compressed refusals. The belief embodied in a shipped artifact.

## Spec-first vs sprint-first - what changes

| Dimension | Sprint-first (the 2020 default) | Spec-first (the post-LLM stance) |
|---|---|---|
| What gets the most time | Iteration cycles, ship-fast tempo | Spec authoring, schema design, eval harness |
| Failure mode | Drift between intent and shipped behavior | Slow start - over-spec'ing things that should be cheap to iterate |
| Where leverage lives | Engineering velocity | Clarity of the input contract |
| Best fit | Pre-LLM products with high build cost | Post-LLM products where iteration is near-free |
| Taste check | "Does it ship?" | "Will the model amplify a clear spec into the right outcome?" |
| Code:spec ratio | High - thousands of LOC per spec line | Low - dozens of LOC per spec line, the rest is prompts + evals |

The shipping cadence does not have to change. The preparation upstream of it does. Cheap iteration rewards better preparation, not more iteration.

## What it means for how I build

The rational response to cheap iteration is not more iteration. It is better preparation.

Ship-fast - my 2020 identity - is correctly listed as superseded. The shipping cadence did not change. The preparation upstream of it did. The spec is the leverage. The model amplifies whatever you put in front of it.

Anti-customization scope: the belief applies to enterprise AI deployments specifically - six-month implementation cycles, foundation-model coupling, training-document overhead. The economic argument has not been tested against consumer products where the cost structure differs.

Without a persistent context layer, "Context > Prompt" is a slogan. The [second-brain](/wiki/second-brain/) page holds the operational shape - the engineering choice that makes the third line true rather than aspirational.

## Design as a non-designer

AI design tools do not produce taste. They produce slop, polished. Stitch, Claude design, every variant has the same failure mode: generates a layout in seconds, cannot hit locked tokens. Wrong fonts, wrong colors, approximate everything. The tool is not the constraint - the operator's discrimination is.

### What gets enforced before AI writes a line

Every solo-PM build that ships at quality enforces a frozen design spec before the model is invoked. The non-negotiables:

- **Study the operators who shipped at scale.** Dieter Rams, Vignelli, Ive, the Apple HIG, the Material Design source. Form an opinion. Without an opinion, every AI output reads as plausible default - which is to say, indistinguishable from every other shipped product that month.
- **Freeze the tokens.** Color palette, typography stack with type scale and line-heights, spacing primitives, component states (hover, focus, disabled, error), motion vocabulary, breakpoint behavior. Locked artifacts before the model is invoked. The spec is the input contract; the model is the amplifier.
- **Encode the anti-patterns.** Document what to refuse - drop-shadows on cards, gradient noise, rounded corners on data tables, modal abuse, decorative motion. The refusal list is the spec's load-bearing half. Without it, the model defaults to the most common training-set output, which is to say the most common 2024 SaaS template.

This site shipped that way. Multiple weekends architecting the spec - aesthetic, type stack, color tokens for both palettes, spacing system, component states, motion vocabulary, voice rules, anti-patterns - before Claude wrote a single line of code. The moodboard at [agamarora.com/moodboard](/moodboard) is the artifact.

### Bottom line

Design discipline upstream of the model is the unit-economics lever for the solo PM shipping AI products. The operator architects the system; the model executes against it. Skip the spec and the velocity multiplier inverts - every iteration drifts further from the locked vision, every fix surfaces three regressions, the artifact decays toward training-set median. Spec-first design enforces the same axiom as Spec > Sprint at the visual layer. The B2B PM who survives the next product cycle is the one who refuses to ship slop and treats the frozen spec as a hard constraint on every AI-generated artifact.

## Where this sits in the wiki

Same disposition, two altitudes.

[pm-taste](/wiki/pm-taste/) covers the institutional PM layer: the metaphor stack, the grind of the role, anti-customization applied to PRDs. That page answers "how does Agam think about what a PM does?" This one answers "how does Agam build with AI in 2026?" Same person, different frame.

The 99/1 grind from 2022 is the slow-building form of Taste > Execution - both say the discrimination work is the work. [personal-projects-tinkering](/wiki/personal-projects-tinkering/) is the complement: ship-the-prototype is preparation before shipping, not a contradiction. The binding constraint moved upstream; the shipping verb stayed.

## Where to go from here

Three exits, depending on what you came for.

If you want the **institutional PM altitude** - the same disposition applied to what a PM does inside a company - read [pm-taste](/wiki/pm-taste/). Anti-customization lives there in its strongest form; the metaphor stack built the vocabulary the trilogy names.

If you want the **"Context > Prompt" claim in operational form** - a running system every AI session reads from - read [second-brain](/wiki/second-brain/). That page holds what makes the third line a build decision rather than a positioning statement.

If you want the **serving-lens thesis** - where "agent-first" and "context-over-prompt" become the same argument at the infrastructure level - read [agent-first](/wiki/agent-first/).

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
