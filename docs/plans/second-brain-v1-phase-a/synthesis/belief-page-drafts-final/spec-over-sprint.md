---
type: BeliefPage
slug: spec-over-sprint
title: Spec over Sprint
one_line: "When AI makes iteration nearly free, the binding constraint is spec quality - the model amplifies whatever you put in front of it, not how fast you put something in front of it."
quotable: "Spec > Sprint: when iteration is cheap, the binding constraint is how clearly you can spec, not how fast you can ship."
parent_theme: spec-first-taste
related_beliefs:
  - belief.taste-over-execution
  - belief.context-over-prompt
  - belief.anti-customization
  - belief.ship-the-prototype
  - belief.substance-over-hype
supersedes:
  - ship-fast
conditioned_by:
  - substance-over-hype
holds_with:
  - taste-over-execution
  - context-over-prompt
applies_to:
  - product-management
  - ai-pm
  - prd-writing
  - ai-product-development
  - scope-management
  - agile-methodology
confidence: settled
tier: 1
length_target: 400-600w
status: c-voice-beliefs-r1-cp3-d6.1
voice_register: 1 (free-form post-essay)
shape: principle-card-d6.1
---

# Spec over Sprint

## The belief

When iteration is cheap, preparation is the lever. Generative tools produce full layouts in seconds - wrong fonts, wrong colors, approximate everything. The tool averaged across a population; the spec had already converged. Invest upstream in what you want, not downstream in how fast you ship it.

## How to apply

1. **Default to spec-first when AI is in the loop.** Before opening any generative tool, write down what you want: the exact typography scale, the color tokens, the interaction model, the core jobs-to-be-done. The AI amplifies whatever you give it. Give it precision, get precision back. Give it a vague brief, get a plausible-but-wrong draft back.

2. **Audit the spec before blaming the tool.** When a generative output disappoints - wrong voice, wrong layout, missing constraints - the first question is not "how do I re-prompt?" It is "what was missing from the spec?" Most tool failures are spec gaps wearing a prompt mask.

3. **Treat quick-and-dirty as a cost, not a virtue.** The case for "ship fast and iterate" was built on the assumption that iteration was scarce. When a design round took two weeks and a coding cycle took four, fast prototypes delivered irreplaceable signal. That economics has changed. When a tool can produce a full layout in 30 seconds, a fast prototype produces noise. The correct virtue is: ship the well-spec'd prototype.

4. **Hold the scope line in the PRD before the sprint begins.** Scope creep is a spec failure that shows up late. "Should we do it?" is the PM's job. "Can we do it?" is the bonus question at the end. Every hour of sprint debate that could have been settled in the PRD is a tax on spec quality. The 99 "should we" questions are spec-work.

5. **Use iteration for refinement, not discovery.** Fast iteration is real leverage when the question is "how polished is this?" not "what are we building?" Generative tools excel at refinement. They are poor instruments for discovering what you want in the first place. Discovery lives in the spec.

## What this is not

- **Not "never ship until the spec is perfect."** The spec governs what you build, not whether you build. The second-brain v1 shipped as plain markdown: "Plain markdown. Git. Open source. MIT. Free forever." That is Spec > Sprint in action: a tight scope, shipped fully, without iteration-as-discovery.
- **Not "agile is dead."** Sprints still matter for sequencing, unblocking, and team cadence. The belief targets the sub-axiom that equates sprint velocity with product quality. Speed inside a well-spec'd system is a virtue. Speed as a substitute for a spec is not.
- **Not a solo PM principle only.** The claim applies anywhere AI is generating work output: design, code, copy, data pipelines. If you are directing a model, your spec quality is the binding constraint on output quality. The domain is irrelevant.

## Argues against

- "Move fast and iterate - the market will tell you what to build."
- "Good prompting can compensate for a weak brief - just keep refining."
- "Spec-first slows teams down; velocity is the real competitive advantage."

## Where to go from here

If you want the **parent theme** that this belief belongs to, go to [spec-first-taste](/wiki/spec-first-taste/). The theme holds the full argument for why preparation outranks execution speed across the spec-first trilogy.

If you want the **trilogy partner** that makes the same claim at the craft layer, go to [taste over execution](/wiki/beliefs/taste-over-execution/). If you want it at the tooling layer, go to [context over prompt](/wiki/beliefs/context-over-prompt/). The three beliefs share one structural claim: the load-bearing work has migrated from doing to deciding.

If you want the **anti-pattern** this belief directly argues against - the instinct to customize rather than scope tightly - go to [anti-customization](/wiki/beliefs/anti-customization/).

## Evidence

| Date | Entry | Post |
|---|---|---|
| 2022-06-03 | "PM is the grind of answering 99 questions of 'should we do it?' to get to that 1 bonus question of 'can we do it?'" The spec-work habit predates the vocabulary by four years. | linkedin-corpus, Cluster 6 |
| 2025-12-04 | "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings." Scope held at the spec layer, not the sprint layer. | urn:li:activity:7402319253036531712 |
| 2026-04-09 | "Tried and dropped Google Stitch in under 30 minutes...wrong fonts, wrong colors, approximate everything...Spec > Sprint / Taste > Execution / Context > Prompt" Canonical crystallization. The tool failed because the spec had already converged. | linkedin-corpus, Cluster 16 |
| 2026-04-23 | "Plain markdown. Git. Open source. MIT. Free forever." second-brain v1 launch. A tight scope, shipped fully: belief embodied as shipped product. | project.second-brain-v1 |
