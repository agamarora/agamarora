---
type: Theme
slug: enterprise-ai-reality
title: Enterprise AI reality  -  ships vs demos
status: draft-r9-polished
length_target: 800-1200
voice_register: 1 (free-form post-essay)
beliefs:
  - belief.enterprise-ai-production-reality (anchor; frame: roughly 80% don't reach production; 10-to-2 specific number dropped per D2)
  - belief.moats-are-infra-talent-data
  - belief.data-readiness-is-pipeline-not-corpus
  - belief.non-functional-reqs-are-dominant-failure-mode (renamed; 55% Standish stat dropped per E4)
  - belief.mcp-as-enterprise-primitive (ghost  -  resume-grounded only)
---

# Enterprise AI reality  -  ships vs demos

*Era: 2024 to 2026 · 12+ posts + 4 Collab items · 4 beliefs*

---

## Core belief

Building for a demo and building for production are different beasts. Enterprises are experimenting broadly, and correctly, because the substrate is real. But they are benching most experiments, also correctly, because most attempts cannot clear the production bar. Roughly 80% of enterprise AI experiments don't reach production. The experiments that fail do not fail on model capability. They fail on non-functional requirements, data pipeline gaps, governance overhead, and time-to-value math. The category is transformative. The deployment rate is brutal. Both facts are true simultaneously, and conflating them is the most expensive mistake an enterprise AI team can make.

---

## How it formed

The belief did not start as a thesis. It started as a taxonomy of failure modes, assembled piece by piece across the spring and summer of 2024.

In March 2024, Agam was grinding LinkedIn Collaborative Articles for the AI Top Voice badge. The surface forced compression of real expertise: non-functional requirements are the dominant failure mode in software production. Non-functional requirements (NFRs) are not tick boxes. They are the specification layer where most products fail. That Collab reply landed three months before any enterprise field data. Then, in June 2024, about four weeks before joining the enterprise voice AI platform: "A common trap that teams fall in is that data readiness does not just mean having a large historical corpus to train on but the systems to be able to continuously collect, process and update the training data. Without the right architecture around storage, transformation and insights mining moving forward is nigh impossible." Agam had the failure-mode taxonomy before he had the field data to validate it.

The enterprise voice AI platform role started 2024-07-04. Sixty days later, on 2024-09-04, came the canonical anchor: nine takeaways from building and demoing a considerable number of GenAI product concepts to potential enterprise customers. "Building for a demo vs. building for production is a different beast." Enterprises are experimenting a lot but benching ideas even more. Time to value is king. Putting an AI stamp is no longer the north star. And the forecast at the close: "Like any new tech, we are in the honeymoon period - everyone is trying everything until something clicks, and then the rush towards structure and methods begins."

The nine takeaways were observation. That final sentence was a prediction.

Three months later, on 2024-12-04, the field data distilled into competitive strategy: infrastructure, talent, data are the three durable AI moats. That post was the lift-out  -  the answer to what survives when 80% of experiments die.

Nine months after the anchor, on 2025-06-20, Agam returned to confirm the pattern: "The shift from '10 experiments' to '2 production grade wins' is underway." The honeymoon-period prediction had closed. The durable frame: roughly 80% of enterprise AI experiments don't reach production. The same post opened toward agent-first territory: enterprises want agent onboarding, not agent building. Production reality and agent-first are not separate beliefs. They are the same observation at two different time points in the enterprise AI adoption cycle.

---

## What it implies

Roughly 80% don't ship. Three implications follow.

**On failure mode:** the experiments that don't reach production don't fail on model capability. They fail on non-functional requirements (performance, security, scalability, ease of use), governance and compliance overhead, data pipelines that were never built for continuous collection, and time-to-value arithmetic that fails before the POC ever reaches a real user. Non-functional requirements are the dominant failure mode. The failures are predictable. The failure modes are enumerable. A PM who specs NFRs before chasing features is applying production-reality discipline from the first document. (Cross-link: [`voice-ai-craft`](/wiki/voice-ai-craft/) for a worked production example of these constraints at enterprise scale.)

**On moats:** three durable assets survive the 2/10 rate. Infrastructure: compute and serving substrate that scales with agents, not just chatbots. Talent: the small population of people who can build, fine-tune, and operate foundational AI systems; there are not many, and that scarcity compounds. Data: not raw corpus volume but the architecture underneath it. "Having data is one thing; having AI-ready data is where the value lies." Data collection pipelines, transformation layers, continuous ingestion systems. Plant the seed today. What is NOT on the moats list: the model itself. Foundation-model capability runs on a rough 12-month commoditization cycle. GPT-4 cost went from $36 to $4 per million tokens in one year. A position built on "we have a great model" is a position that resets every release cycle.

**On data specifically:** data readiness is not a volume problem. An enterprise with a large historical corpus and no live pipeline is building on a decaying foundation. The relevant question is not "how much data do we have?" but "how quickly can that data be collected, processed, and updated?" Pipeline infrastructure is the hardest moat to replicate by spending money. That is why data ranks highest of the three.

---

## Tension with `agent-first`

The agent-first theme is optimistic about enterprise AI's direction. This theme is cautious about its deployment rate. The 2025-06-20 post is where both stitched together.

The resolution is scope-difference, not contradiction. Production reality names the rate at which experiments clear the production bar, today. Agent-first names the direction enterprises are consolidating toward, next. The same field data produces both: "10 experiments yield 2 wins" and "horizontal AI does not scale, agentic AI is the new direction." Skepticism about the rate is not pessimism about the destination. Agent-first IS the framework for being among the 2-of-10: serving-lens-first, reversibility in from the start, NFRs specified at PRD-time  -  those are what the production-grade projects do differently.

Cross-link: [`agent-first`](/wiki/agent-first/)  -  same 2025-06-20 post carries both claims. Different analytical frame: direction vs current rate.

---

## Evidence

| Date | Surface | What it shows |
|---|---|---|
| 2024-03-08 | Collab Article comment | NFR failure mode seed: non-functional requirements are the dominant failure mode in production (dispositional claim; specific third-party statistic dropped) |
| 2024-06-07 | Collab Article comment | Data-readiness seed: data readiness is pipeline architecture, not just historical corpus |
| 2024-08-30 | Post | Model commoditization observed: GPT-4 cost 36 to 4 USD per million tokens in 12 months; model is not the moat |
| 2024-09-04 | Post (9 takeaways) | Anchor: demo vs production is a different beast; enterprises experimenting a lot, benching ideas even more; honeymoon-period prediction |
| 2024-12-04 | Post (three AI moats) | Distillation: infrastructure, talent, data are the three durable moats; model not on list; Data moat ranked highest |
| 2025-06-20 | Post (GenAI paradox) | Confirmation: roughly 80% bench rate; honeymoon period is gone; agent-first pivot named |
| 2025-06-20 | Own-comment on post | McKinsey Seizing the Agentic AI Advantage (June 2025) cited as external validation within hours |
| 2025-09-29 | Comment-thread reply | Field data: production enterprise voice AI stack (cloud LLMs, MCP-first API layer, business KPI ordered ahead of tech KPI); one worked example among many |
| 2025-12-04 | Post (anti-customization) | Extension to PM craft: "six months of implementation, an implementation partner, hundreds of training documents"  -  the demo-vs-production gap at the PRD layer |

---

## Open question

Governance is now table stakes, the shift to structured platform investment is underway, and enterprises with real moats are compounding. The durable version of this belief is about the structure of failure rather than a specific rate. Roughly 80% bench rate is the frame; the precise number shifts as the cycle matures.

---

*Polished: taste-pass decisions applied 2026-04-26.*
