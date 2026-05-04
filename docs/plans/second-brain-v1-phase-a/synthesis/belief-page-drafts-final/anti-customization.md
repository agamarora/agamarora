---
type: BeliefPage
slug: anti-customization
title: "Anti-customization. The PRD discipline that protects enterprise sales velocity."
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
status: c-bulldozer-r1-2026-05-04
voice_register: 1 (free-form post-essay)
shape: principle-card-d6.1
---

# Anti-customization. The PRD discipline that protects enterprise sales velocity.

Every customization setting in a PRD is a deferred design decision. The team writes "users can configure X," pushes the real product call into implementation, onboarding, and support, and then watches time-to-value evaporate. Today's "super customizable" product becomes six months of implementation, an implementation partner, hundreds of training documents, and a roadmap item just to enable day-zero go-live. The metric customization-tax always violates is time-to-value. Enterprise buyers do not pay for flexibility. They pay to go live.

## The economic tail is always underestimated at spec-time

Customization debt compounds. A single configuration setting adds three separate cost lines: onboarding documentation, training overhead, and support burden when the setting interacts unexpectedly with a customer's environment. Evaluated at one item, the cost looks small. Evaluated across a full PRD that allowed configurability as a conflict-resolution mechanism, the tail is the six-month implementation cycle the sales team is now explaining to a churned customer.

The calculation enforced at spec-time: for each proposed customization, estimate onboarding time, training-document overhead, and whether it blocks day-zero go-live. The number is almost always higher than the feature team expects. That number belongs in the PRD before the setting ships, not in the post-mortem after.

## Customization requests are latent product disagreements

When a team asks for a settings panel, two valid use cases have not been reconciled at the product level. The settings panel is the lazy resolution. It passes the argument downstream to implementation, where the cost to resolve it is five to ten times higher than at spec-time.

The discipline: treat every configurability request as a signal that the product decision is not yet made. Resolve it in the PRD. Name the opinionated default. Ship that. A tight scope shipped completely beats a flexible scope shipped partially. The opinionated version proves the thesis; field evidence earns the configuration in v2. Anti-customization is pro-evidence, not anti-iteration.

## Plug-and-play is the actual customer promise

Enterprise AI buyers enter procurement with one question that overshadows the RFP feature matrix: how fast can we go live? The sales team that spent twelve weeks negotiating a flexible configuration surface has not accelerated the deal. They have created a professional services dependency that shows up on the customer's P&L six months after signature.

The architectural response: deprecated the configuration-as-feature pattern at the PRD layer. Enforced the opinionated default. Shipped the version that closes the implementation gap before it opens. Plug-and-play is not a marketing claim. It is a scope decision made at spec-time, held under pressure from stakeholders who found configurability easier to agree to than an opinion.

## Bottom line

Anti-customization is a PRD-layer discipline with enterprise sales velocity as the business outcome. Smaller implementations sell faster. Implementations that do not require an integration partner close on the first renewal. The PM who holds the scope line under pressure is not being rigid; they are protecting the time-to-value metric that the customer bought. Configuration earned through field evidence in v2 is legitimate. Configuration assumed preemptively at spec-time is a deployment risk masquerading as a feature.
