---
type: BeliefPage
slug: enterprise-ai-production-reality
title: Enterprise AI reality: demos are not deployments
one_line: "~80% of enterprise AI experiments don't ship. Failures are non-functional, data-pipeline, governance, time-to-value - not model."
parent_theme: enterprise-ai-reality
related_beliefs: [substance-over-hype, anti-customization, moats-are-infra-talent-data, non-functional-reqs-are-dominant-failure-mode, agent-first, spec-over-sprint]
tier: 1
length_target: 400-800w
status: draft-task-h
---

# Enterprise AI reality: demos are not deployments

## Statement

Building for a demo versus building for production is a different beast.

Roughly 80% of enterprise AI experiments don't reach production. The failures are not model-quality failures. They are non-functional-requirement failures, data-pipeline failures, governance failures, and time-to-value failures. Enterprises are experimenting a lot and benching ideas even more. The gap between a working demo and a working deployment is wider than vendors admit, more boring than analysts cover, and consistently fatal to most attempts.

The category is genuinely transformative. The deployment rate is genuinely brutal. Both are true simultaneously. The substrate passes the test; most implementations don't clear the production bar.

## Origin

This belief is empirical, not theoretical. It crystallized from field experience building and demoing a considerable number of GenAI-based product concepts to potential enterprise customers - not from reading analyst reports.

**Spring 2024 (seed phase, pre-field-data):** Three failure-mode frames surfaced in written Collab Article content: non-functional requirements as the dominant failure mode; data readiness as pipeline, not corpus ("having a large historical corpus to train on" is not readiness - the systems to collect, process and update data are); hype as a production-management variable that sets unrealistic expectations before the first sprint.

**Fall 2024 (crystallization - 60 days into a senior enterprise AI role):** Nine field-data takeaways published from building and demoing a considerable number of GenAI product concepts to potential enterprise customers. Core trio: building for demo vs production is a different beast; ethics and security concerns reign supreme; enterprises are experimenting a lot but benching ideas even more. Closing frame: "Like any new tech, we are in the honeymoon period - everyone is trying everything until something clicks, and then the rush towards structure and methods begins." That was a forecast.

## Refinement arc

**Q4 2024 - distillation:** The nine takeaways compressed into three moats. An AI company needs to build one or all of the following to survive: AI Infrastructure, AI Talent, AI-Ready Data. "Having data is one thing; having AI-ready data is where the value lies. Think about building data collection and preparation pipelines for the future."

**Q2 2025 (nine months later, same field-data instrument re-deployed):** The honeymoon-period prediction confirmed. "The period of experimentation is gone: the shift from broad experimentation to a small number of production-grade wins is underway. Governance is now table stakes. Enterprises want agent onboarding, not agent building. Your systems must serve agents too."

This is when the roughly-80% frame became durable. Not a specific ratio with precision to pin down - a directional frame that holds across cohorts. The durable claim is the gap, not the exact number.

**Late 2025 - PM-craft extension:** Production-reality applied at the PRD layer. Customization is the B2B SaaS hype-word that consistently destroys time-to-value. "My brain is wired to jump to the long-term horizon where today's 'super customizable' product eventually requires six months of implementation, an implementation partner, hundreds of training documents, and a roadmap item just to enable a true day-zero go-live." The six-months-of-implementation line is the demo-vs-production gap restated as a refusal in the spec.

## Cross-links

- `belief.substance-over-hype`: parent disposition. Production-reality is substance-over-hype applied to the enterprise AI category specifically. The same disposition that named the blockchain hype in 2018 grades enterprise AI deployment rates in 2024.
- `belief.anti-customization`: refines production-reality at PRD-layer. The time-to-value frame from the nine takeaways and the six-months-of-implementation line are the same observation from two angles.
- `belief.non-functional-reqs-are-dominant-failure-mode`: specific failure mode within production-reality. NFRs are not a checklist item - they are the primary failure surface.
- `belief.agent-first`: derivative. Points 6-8 of the 2025 confirmation post are the agent-first thesis statement; points 1-5 are the production-reality restate.
- `belief.spec-over-sprint`: if the gap between demo and production is fatal, then speccing before generating is the discipline that closes the gap.

## Evidence

Five-round provenance (R2, R3a, R3b, R3d, R3e). 12 surfaces across 22 months.

- Spring 2024 (Collab Articles): NFR failure mode named, data-readiness-as-pipeline, anti-hype-as-PM-craft.
- 2024-09-04 (canonical anchor): "I have built a considerable number of GenAI-based product concepts... had the chance to demo many of them to potential enterprise customers." Nine takeaways. Honeymoon-period forecast.
- 2025-06-20 (nine-month confirmation): "The GenAI paradox is real: Heavy investments. Low returns." Closes the 2024 forecast. Roughly-80% frame established as the durable claim.
- 2025-09-29 (field reply, highest-density single item): Business KPI before tech KPI. Cloud-vs-on-prem trade-offs. MCP as abstraction layer. One production case among many.
- 2025-12-04: "Six months of implementation, an implementation partner, hundreds of training documents, and a roadmap item just to enable a true day-zero go-live."

---
*Draft for Phase B HTML scaffolding.*
