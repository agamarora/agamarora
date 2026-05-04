---
type: Theme
slug: spec-first-taste
title: "Spec first, taste always. Pre-code discipline at enterprise scale."
one_line: "The April 2026 builder trilogy: Spec over Sprint, Taste over Execution, Context over Prompt. The binding constraint migrated upstream."
status: c-bulldozer-r1-2026-05-04
length_target: 1100-1500
voice_register: 1 (free-form post-essay)
beliefs:
  - belief.spec-over-sprint
  - belief.taste-over-execution
  - belief.context-over-prompt
  - belief.anti-customization
---

# Spec first, taste always. Pre-code discipline at enterprise scale.

Cheap iteration is not an argument for more iteration. It is an argument for better preparation. The PM who grabs an LLM, skips the spec, and iterates fast is not moving quickly. They are compounding noise at machine speed. The builder who invests in the frozen spec gets their own vision back, amplified. The one who does not gets a plausible-looking product that diverges from intent on every cycle.

## The trilogy, stated absolutely

Three lines. One post. April 9, 2026:

> Spec > Sprint
> Taste > Execution
> Context > Prompt

The trigger was a 30-minute session with Google Stitch: decent layout in seconds, wrong fonts, wrong colors, approximate everything. The tool was not the problem. The absence of a locked spec before invoking it was. That observation became the axiom. The three lines are not independent claims. They are three views of the same principle across process, craft, and tooling: the load-bearing work has migrated from doing to deciding.

**Spec over Sprint.** Pre-LLM, the binding constraint was existence. Ship the thing or it stays theoretical. Post-LLM, the constraint migrated upstream to quality-of-spec. A well-spec'd build gives you your own vision back, faster. An under-spec'd build gives you noise at speed, multiplied. Better preparation beats more iteration when iteration approaches zero cost.

**Taste over Execution.** The skill AI cannot commoditize is discrimination. Knowing what is worth building. Knowing what to leave out, which is where most of the work now lives. Execution was always a craft; now it is also table stakes. The judgment applied to the spec before the model is invoked is the remaining differentiator. Execution without taste is the most efficient path to the wrong product.

**Context over Prompt.** The lever for useful AI output is the context curated before the session, not the prompt composed at the I/O seam. Structured knowledge, historical decisions, domain priors loaded upstream outperform clever prompting every time. The second-brain is the operational form of this claim. Without a persistent context layer, "Context over Prompt" is a slogan. With one, it is a unit-economics decision.

## How the trilogy formed

The disposition existed years before the vocabulary.

The PM metaphor stack built it under a different name. "Product management is the grind of answering 99 questions of 'should we do it?' to get to that 1 bonus question of 'can we do it?'" (2022). The ninety-nine should-we questions are discrimination work. Refusal work. Five years before the explicit axiom, the same discipline was framed as 99% taste, 1% execution.

Field data from AIonOS enterprise deployments confirmed the anti-customization signal. Smaller implementations ship faster. Time to value is the governing constraint. Plug and play is the enterprise dream. The cost of customization is not visible in the demo. It is visible in the implementation partner invoice and the training-document overhead six months post-close.

The hinge point was December 2025: "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings." The shift from what enterprises want to what the spec enforces absolutely.

April 2026 crystallized the trilogy. Google Stitch, thirty minutes, wrong tokens. Spec over Sprint / Taste over Execution / Context over Prompt. The second-brain launched the same month: "Plain markdown. Git. Open source. MIT. Free forever." Eight words, four compressed refusals. The trilogy embodied in a shipped artifact.

## Spec-first versus sprint-first

| Dimension | Sprint-first | Spec-first |
|---|---|---|
| Where time goes | Iteration cycles, ship-fast tempo | Spec authoring, schema design, eval harness |
| Failure mode | Drift between intent and shipped behavior | Over-spec'ing things that should stay cheap to iterate |
| Leverage point | Engineering velocity | Clarity of the input contract |
| Best fit | Pre-LLM, high build cost | Post-LLM, near-zero iteration cost |
| Taste check | Does it ship | Will the model amplify a clear spec into the right outcome |
| Code:spec ratio | High. Thousands of LOC per spec line | Low. Dozens of LOC per spec line, remainder is prompts and evals |

The shipping cadence does not have to change. The preparation upstream of it does. Cheap iteration rewards better preparation, not more iteration. Sprint-first was the correct default when existence was the binding constraint. It is the wrong default when the model is the execution engine. The spec-first operator architected the input contract before invoking the tool; the sprint-first operator routed the prompt into an underspecified context and iterated toward noise.

## Design as a non-designer

AI design tools do not produce taste. They produce slop, polished. Stitch, Claude design, every variant has the same failure mode: generates a layout in seconds, cannot hit locked tokens. Wrong fonts, wrong colors, approximate everything. The tool is not the constraint. The operator's discrimination is.

### What gets enforced before AI writes a line

Every solo-PM build that ships at quality enforces a frozen design spec before the model is invoked. The non-negotiables:

- **Study the operators who shipped at scale.** Dieter Rams, Vignelli, Ive, the Apple HIG, the Material Design source. Form an opinion. Without an opinion, every AI output reads as plausible default, which is to say indistinguishable from every other shipped product that month.
- **Freeze the tokens.** Color palette, typography stack with type scale and line-heights, spacing primitives, component states (hover, focus, disabled, error), motion vocabulary, breakpoint behavior. Locked artifacts before the model is invoked. The spec is the input contract; the model is the amplifier.
- **Encode the anti-patterns.** Document what to refuse: drop-shadows on cards, gradient noise, rounded corners on data tables, modal abuse, decorative motion. The refusal list is the spec's load-bearing half. Without it, the model defaults to the most common training-set output, which is to say the most common 2024 SaaS template.

This site shipped that way. Multiple weekends architecting the spec: aesthetic, type stack, color tokens for both palettes, spacing system, component states, motion vocabulary, voice rules, anti-patterns before Claude wrote a single line of code. The moodboard at [agamarora.com/moodboard](/moodboard) is the artifact.

## Bottom line

The trilogy is a single economic argument restated at three levels. At the process level: preparation beats iteration when iteration is free. At the craft level: discrimination is now the scarce skill, not execution velocity. At the tooling level: context curation is a higher-leverage investment than prompt engineering. The PM who enforces all three upstream compresses delivery cycles, ships artifacts that match the locked vision, and avoids the rework spiral that kills velocity inside enterprise delivery schedules. The PM who skips them ships fast in the wrong direction, then pays the rework tax in the same sprint where the deadline moved. The frozen spec is the hard constraint on every AI-generated artifact.
