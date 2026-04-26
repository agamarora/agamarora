---
type: BeliefPage
slug: anti-customization
title: Anti-customization
one_line: "Every customization setting in a PRD is a deferred design decision that will cost six months, an implementation partner, and day-zero go-live."
quotable: "Say no to customization in the PRD, even when you're fighting yourself to do it."
parent_theme: pm-taste
related_beliefs:
  - belief.taste-over-execution
  - belief.spec-over-sprint
  - belief.pm-is-99-should-we-1-can-we
  - belief.enterprise-ai-production-reality
supersedes: []
conditioned_by: []
holds_with:
  - belief.spec-over-sprint
  - belief.taste-over-execution
applies_to:
  - product-management
  - prd-writing
  - scope-management
  - ai-product-development
  - customization-tradeoffs
  - product-strategy
confidence: settled
tier: 1
length_target: 400-600w
status: c-voice-beliefs-r1-cp12-d6.1
voice_register: 1 (free-form post-essay)
shape: principle-card-d6.1
---

# Anti-customization

## The belief

Every customization setting in a PRD is a deferred design decision. The moment a team writes "users can configure X," they have pushed a real product call into implementation, onboarding, and support - all places where it costs more and lands worse than if it had been decided at spec-time. Say no in the PRD, even when every room in the building is asking you to say yes.

This is an enterprise-AI belief. The economics are rooted in deployment reality: "super customizable" products eventually require six months of implementation, an implementation partner, hundreds of training documents, and a roadmap item just to enable a true day-zero go-live. Time to value is the metric customization-tax always violates.

## How to apply

1. **Default to no customization in the first PRD draft.** When a feature is proposed as "configurable," ask what the opinionated default would be. Write that default into the spec. Do not yield to configurability as a conflict-resolution mechanism.

2. **Treat customization requests as latent disagreements about product direction.** When a team asks for a settings panel, two valid use cases have usually not been reconciled at the product level. Resolve the tension in the PRD, not in the implementation. The settings panel is the lazy resolution.

3. **Audit the economic tail before approving any configuration setting.** For each proposed customization: estimate onboarding time, training-document overhead, and whether it blocks day-zero go-live. The cost is almost always underestimated at spec-time.

4. **Hold the scope line when "plug and play" is the actual customer promise.** Enterprise AI buyers want go-live, not flexibility. "No one wants to reinvent every time." Every customization option is a direct tax on time-to-value. The spec should reflect what the customer actually wants, not what the sales team found easier to agree to.

5. **Ship the opinionated version first.** A tight scope shipped fully beats a flexible scope shipped partially. If the opinionated version proves wrong in the field, add configuration in v2 - based on real evidence. Anti-customization is pro-evidence, not anti-iteration.

## What this is not

- **Not "never allow any configuration ever."** The belief is scoped to the PRD as the contract-setting moment. Configuration earned through field evidence - real user friction, real use-case divergence - is legitimate. The distinction is evidence-based configuration added later vs. spec-time configuration assumed preemptively.
- **Not a consumer-product principle.** The economic argument is enterprise-rooted. Consumer products with self-serve onboarding face a different tradeoff. The belief targets enterprise AI deployments where implementation cost and onboarding time compound.
- **Not "override stakeholder input."** The belief is about internal PM judgment: holding the scope line even when capitulating is the path of least resistance. Opinionatedness is needed precisely because the pressure to configure is always present and usually well-intentioned.

## Argues against

- "Make it configurable and let customers decide what they need."
- "Customization is a competitive feature - it's what enterprise buyers ask for in the RFP."
- "We can add defaults later; for now, give them the flexibility."

## Where to go from here

If you want the **parent theme** that holds this belief, go to [pm-taste](/wiki/pm-taste/). The theme frames why strong product opinions are a craft asset, not a negotiating posture.

If you want the **spec-layer version** of the same principle - why locking scope before iteration is correct when AI tools make iteration cheap - go to [spec over sprint](/wiki/beliefs/spec-over-sprint/). The binding constraint is how clearly you decided, not how fast you shipped.

If you want the **decision-making frame** that governs when to say no - ninety-nine "should we?" questions must be settled before "can we?" is relevant - go to [pm is 99 should-we 1 can-we](/wiki/beliefs/pm-is-99-should-we-1-can-we/).

## Evidence

| Date | Entry | Post |
|---|---|---|
| 2024-03-26 | "People are not paying for features. They are paying to solve their problems." JTBD aphorism: features as wrong unit. | linkedin-corpus |
| 2024-09-04 | "Smaller implementations are sought after." / "Time to value is king." / "Building for a demo vs. building for production is a different beast." Empirical seed: the metrics customization-tax violates. | linkedin-corpus |
| 2025-06-20 | "Plug and play is the dream. No one wants to reinvent every time." Agent-first manifesto, point 6: clearest pre-declaration. | linkedin-corpus |
| 2025-12-04 | "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings. My brain is wired to jump to the long-term horizon where today's 'super customizable' product eventually requires six months of implementation, an implementation partner, hundreds of training documents, and a roadmap item just to enable a true day-zero go-live." Canonical declaration. | linkedin-corpus, urn:li:activity:7402319253036531712 |
| 2026-04-09 | "It couldn't hit my locked design tokens...wrong fonts, wrong colors, approximate everything." Anti-customization extended to tool-craft: lock the tokens, trust the spec. | linkedin-corpus, Cluster 16 |
| 2026-04-23 | "Plain markdown. Git. Open source. MIT. Free forever." second-brain v1 shipped with no settings, preferences, themes, or plugins. Belief embodied as product. | project.second-brain-v1 |
