---
type: BeliefPage
slug: taste-over-execution
title: Taste over Execution
one_line: "AI commoditizes execution. Taste - knowing what to build and what to refuse - is the irreducible PM skill that no model can replace."
quotable: "When AI can execute anything, the binding constraint is taste: knowing what to build, what to refuse, and what counts as done."
parent_theme: spec-first-taste
related_beliefs:
  - belief.spec-over-sprint
  - belief.context-over-prompt
  - belief.anti-customization
  - belief.pm-is-99-should-we-1-can-we
  - belief.substance-over-hype
supersedes: []
conditioned_by:
  - substance-over-hype
holds_with:
  - spec-over-sprint
  - context-over-prompt
applies_to:
  - product-management
  - design-decisions
  - ai-product-development
  - prd-writing
  - prioritization
  - ai-pm
confidence: settled
tier: 1
length_target: 400-600w
status: c-voice-beliefs-r1-cp4-d6.1
voice_register: 1 (free-form post-essay)
shape: principle-card-d6.1
---

# Taste over Execution

## The belief

AI commoditizes execution. Writing, coding, designing, drafting PRDs - these are no longer scarce. The scarce thing is the upstream judgment: what to build, what to refuse, what constitutes done, and what to leave out of the PRD entirely. Taste is the discriminating function. It has not been automated, and the proliferation of generation tools makes it more valuable, not less.

## How to apply

1. **When starting any product decision, resolve the "should we" before the "how we."** The PM job is 99 "should we build this?" questions for every 1 "can we build this?" question. The execution question is easy to answer; the taste question is the actual work. If a sprint is debating scope, the spec failed to exercise taste upstream.

2. **Audit the acceptance bar before reaching for a generation tool.** A model produces a plausible output by default. Plausible is not the same as right. Before prompting, name concretely what "right" looks like: the exact voice, the exact scope, the specific value. Without that standard, no taste is applied to the output - only vibes.

3. **Treat scope refusal as a deliverable, not a failure.** The taste-call is: does this belong at all? Saying no is the work. The PRD that ships without the wrong feature exercised taste; the one that included it did not.

4. **When a generative output disappoints, interrogate your taste standard before the tool.** Wrong voice, wrong scope, wrong prioritization in the output - these are almost always a reflection of an underspecified taste standard, not a tool failure. The tool averaged across a population; the taste call was missing.

5. **Recognize that "delight" is a taste judgment, not a feature category.** Building and measuring products is no longer the constraint. Knowing what delight looks like for this user, at this fidelity, is. No checklist produces that discrimination.

## What this is not

- **Not "execution doesn't matter."** Execution still ships the product. The belief is about which constraint is binding: when execution is cheap, taste is the bottleneck. In environments where execution is genuinely scarce - no engineers, no runway - taste-first advice is the wrong medicine.
- **Not "PM taste is unteachable."** The belief says taste is irreducible, not innate. The 99/1 framing and the anti-customization discipline are learnable. They require judgment under ambiguity, but that is different from being unteachable.
- **Not a claim that taste is faster than execution.** When AI makes execution nearly free, the investment should shift to the thing that remains scarce. Taste becomes the rate-limiter; that is the only claim.

## Argues against

- "Move fast and let the market tell you what to build - taste is something you discover in iteration."
- "Good enough shipped is better than perfect held - execution speed is the real PM discipline."
- "AI makes taste more democratic: anyone can generate a high-quality output now, so the bar has risen for everyone equally."

## Where to go from here

If you want the **parent theme** that holds this belief alongside its siblings, go to [spec-first-taste](/wiki/spec-first-taste/). The theme frames why the load-bearing work has migrated from doing to deciding.

If you want the **process-layer version** of the same claim - taste applied to what you write before building - go to [spec over sprint](/wiki/beliefs/spec-over-sprint/). For the **tooling-layer version** - taste applied to what you give the model - go to [context over prompt](/wiki/beliefs/context-over-prompt/).

If you want the **decision pattern** taste most directly produces - refusing scope at the PRD layer rather than the sprint - go to [anti-customization](/wiki/beliefs/anti-customization/).

## Evidence

| Date | Entry | Post |
|---|---|---|
| 2021-09-22 | "Product management is a featherless hat that is omnipresent yet indistinguishable if done properly." The taste-as-invisible-infrastructure framing. | linkedin-corpus, Cluster 6 |
| 2022-06-03 | "Product management is the grind of answering 99 questions of 'should we do it?' to get to that 1 bonus question of 'can we do it?'." 99 should-we questions = pure taste-work. | linkedin-corpus, Cluster 6 |
| 2024-Q1 | "Building and measuring products is not difficult now. Learning to delight is the next pitstop." Execution no longer the constraint; discrimination of delight is. | linkedin-comments (Collaborative Article) |
| 2025-12-04 | "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings." | urn:li:activity:7402319253036531712 |
| 2026-04-09 | "Spec > Sprint / Taste > Execution / Context > Prompt." Canonical trilogy crystallization. | linkedin-corpus, Cluster 16 |
| 2026-04-23 | "Plain markdown. Git. Open source. MIT. Free forever." Four compressed taste-refusals in eight words: refused tool-trap, over-build, defensive moat, freemium tier-hell. | project.second-brain-v1 |
| 2026-04-26 | "Product management was, is and will continue to be about taste of what to build and experience and value...we can outsource thinking and writing and coding but the taste of great product is still with product managers." | taste-pass session (B1 resolution) |
