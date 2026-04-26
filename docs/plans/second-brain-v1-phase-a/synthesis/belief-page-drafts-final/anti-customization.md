---
type: BeliefPage
slug: belief.anti-customization
title: Anti-customization
one_line: "Enterprise PRDs that overspec customization defer cost and break day-zero value. The PRD is where the contract gets set."
parent_theme: pm-taste
related_beliefs:
  - belief.taste-over-execution
  - belief.spec-over-sprint
  - belief.pm-is-99-should-we-1-can-we
  - belief.enterprise-ai-production-reality
  - belief.non-functional-reqs-are-dominant-failure-mode
tier: 1
length_target: 400-800w
status: draft-task-h
---

# Anti-customization

## Statement

Scope: enterprise AI deployments. This has not been tested against consumer products. The economic argument is enterprise-rooted.

In enterprise software, every customization setting in a PRD is a deferred design decision. Today's "super customizable" product eventually requires six months of implementation, an implementation partner, hundreds of training documents, and a roadmap item just to enable a true day-zero go-live. The economic tail on that is long and almost always underestimated at spec-time. The PRD is where the contract gets set. Customization in the PRD is a self-inflicted wound.

The defeat language in the 2025-12-04 declaration is not rhetorical: "I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings." Saying yes to customization is easier in every meeting room. Opinionatedness is needed precisely because the path of least PM resistance is to capitulate.

## Origin

This is an enterprise-AI-era belief. It does not predate the AIonOS enterprise-AI window.

Field observation first: the 2024-09-04 post on "9 takeaways" from demoing enterprise GenAI products to customers named symptoms before naming the cause: "Smaller implementations are sought after." "Time to value is king." "Building for a demo vs. building for production is a different beast." These are the metrics customization-tax violates. The variable was not yet named.

By 2025-06-20, the negation was explicit in the agent-first manifesto: "Plug and play is the dream. No one wants to reinvent every time." Still framed as "what enterprises want" rather than "what I believe."

The shift to personal craft-axis came on 2025-12-04: the first post where Agam locates the disposition inside his own PM judgment rather than the market's preference. That is what makes the declaration different from the earlier field observations.

The belief arc: 2024-09-04 field observation to 2025-12-04 declaration is roughly 15 months. Not a long-arc belief like substance-over-hype (8-year through-line). Enterprise-AI era only.

## Refinement arc

No supersession. This belief fills a previously unstated gap in the PM-taste family. It refines the parent disposition (pm-taste) by specifying one concrete decision-rule: refuse customization in the PRD, even when fighting yourself.

The 2026-04-09 Spec > Sprint trilogy extends the same disposition from PRD-craft to tool-craft: locking design tokens before using a generative tool is anti-customization at the build layer. Same disposition applied one level up. Second-brain v1 (2026-04-23: "Plain markdown. Git. Open source. MIT. Free forever.") ships the belief as a product: no settings, preferences, themes, or plugins. These are post-declaration confirmations, not refinements of the core position.

One counter-evidence post exists: 2024-09-25 BIM post listed "Customization: Tailored to meet specific organizational requirements" as value point #1 while curating an external article. This falls in the interregnum when field data was pointing toward anti-customization but the position had not yet locked. It is not evidence Agam believed customization was a virtue; it is evidence the belief had not yet crystallized.

## Cross-links

- Parent theme: wiki:pm-taste (primary)
- Cross-theme: wiki:spec-first-taste (secondary)
- Related beliefs: wiki:beliefs:belief.taste-over-execution
- Related beliefs: wiki:beliefs:belief.spec-over-sprint
- Related beliefs: wiki:beliefs:belief.pm-is-99-should-we-1-can-we
- Related beliefs: wiki:beliefs:belief.enterprise-ai-production-reality

## Evidence

- 2024-03-26 - "People are not paying for features. They are paying to solve their problems." (JTBD aphorism: features-as-wrong-unit) - linkedin-corpus
- 2024-09-04 - "Smaller implementations are sought after." / "Time to value is king." / "Building for a demo vs. building for production is a different beast." (9-takeaways anchor, empirical seed) - linkedin-corpus
- 2025-06-20 - "Plug and play is the dream. No one wants to reinvent every time." (agent-first manifesto, point 6 - clearest pre-cite) - linkedin-corpus
- 2025-12-04 - "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings. My brain is wired to jump to the long-term horizon where today's 'super customizable' product eventually requires six months of implementation, an implementation partner, hundreds of training documents, and a roadmap item just to enable a true day-zero go-live." - linkedin-corpus, urn:li:activity:7402319253036531712 (canonical declaration)
- 2026-04-09 - "It couldn't hit my locked design tokens...wrong fonts, wrong colors, approximate everything." (Spec > Sprint: anti-customization extended to tool-craft layer) - linkedin-corpus, Cluster 16
- 2026-04-23 - "Plain markdown. Git. Open source. MIT. Free forever." (second-brain v1: shipped product with no settings, preferences, or plugins) - project.second-brain-v1

---
*Draft for Phase B HTML scaffolding.*
