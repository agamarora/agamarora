---
type: Theme
slug: enterprise-ai-reality
title: Enterprise AI reality — ships vs demos
status: draft-r6
length_target: 800-1200
beliefs:
  - belief.enterprise-ai-production-reality (anchor)
  - belief.moats-are-infra-talent-data
  - belief.data-readiness-is-pipeline-not-corpus
  - belief.mcp-as-enterprise-primitive (ghost — resume-grounded only; corpus has amber signal from 2025-09-29 comment naming MCP twice, but specifics not improvised here)
references:
  - "2024-09-04 · urn:li:activity:7236941772336066560 · '9 takeaways from building GenAI products' (anchor)"
  - "2024-06-07 · urn:li:activity:7204636472262496259 · Collab Article comment, data-readiness seed"
  - "2024-08-30 · urn:li:activity:7235123739565158402 · GPT-4 cost-collapse, model commoditization"
  - "2024-12-04 · urn:li:activity:7270067867885150209 · three AI moats distillation post"
  - "2025-06-20 · urn:li:activity:7341662205257433088 · GenAI paradox + 10-to-2 quantification"
  - "2025-09-29 · comment URN tail 7378427141190799360 · voice-AI production stack field reply"
  - "2025-12-04 · urn:li:activity:7402319253036531712 · anti-customization as production-reality extension"
open_qs_for_taste_pass:
  - "(From R4 enterprise-ai-production-reality §8 Q2) Is the 10-to-2 ratio still the operative rate at 2026-04-25, or does Agam want to frame it as 'roughly 80% bench rate' as the more durable claim? Should the wiki commit to '2 production grade wins' as the 2026 number?"
  - "(From R4 enterprise-ai-production-reality §8 Q1) The 55% Standish NFR anchor appears once (2024-03-08 Collab). Still cited internally at AIonOS? If yes, keep. If not, reframe as dispositional ('NFRs are the dominant failure mode') without the specific number."
  - "(From R4 enterprise-ai-production-reality §8 Q4) 2025-09-29 voice-AI production reply — include in Evidence section as a worked example with voice-AI label (truthful + demonstrative), or strip voice-AI specifics to preserve Decision 2? Default below is option A with framing 'one example among many' — Agam to confirm."
  - "(From R4 enterprise-ai-production-reality §8 Q5) Has the honeymoon-to-consolidation forecast actually landed as predicted? Upgrade to 'thesis confirmed' or stay cautious ('consolidation is real but uneven')?"
  - "(From R4 moats-are-infra-talent-data §8 Q2) Does the Data > Infra > Talent ranking still hold in 2026, or has 18 months of field data shifted it?"
  - "(New for R6) The 2025-09-29 comment names MCP as the interface layer ('100% driven through MCP + APIs'). Should this be cited here as a one-sentence note toward the ghost belief, or held entirely for when Agam confirms the MCP-as-enterprise-primitive belief?"
---

# Enterprise AI reality — ships vs demos

*Era: 2024 to 2026 · 12+ posts + 4 Collab items · 4 beliefs*

---

## Core belief

Building for a demo and building for production are different beasts. Enterprises are experimenting broadly, and correctly, because the substrate is real. But they are benching most experiments, also correctly, because most attempts cannot clear the production bar. The empirical rate Agam observes from the field: ten experiments yield roughly two production-grade wins. The eight that fail do not fail on model capability. They fail on non-functional requirements, data pipeline gaps, governance overhead, and time-to-value math. The category is transformative. The deployment rate is brutal. Both facts are true simultaneously, and conflating them is the most expensive mistake an enterprise AI team can make.

---

## How it formed

The belief did not start as a thesis. It started as a taxonomy of failure modes, assembled piece by piece across the spring and summer of 2024.

In March 2024, Agam was grinding LinkedIn Collaborative Articles for the AI Top Voice badge. The surface forced compression of real expertise: "According to Standish Group's Chaos report of 2023, 55% of software production issues are due to non-functional requirements." That Collab reply landed three months before any enterprise field data. Then, in June 2024, one week before joining AIonOS: "A common trap that teams fall in is that data readiness does not just mean having a large historical corpus to train on but the systems to be able to continuously collect, process and update the training data. Without the right architecture around storage, transformation and insights mining moving forward is nigh impossible." Agam had the failure-mode taxonomy before he had the field data to validate it.

AIonOS started 2024-07-04. Sixty days later, on 2024-09-04, came the canonical anchor: nine takeaways from building and demoing a considerable number of GenAI product concepts to potential enterprise customers. "Building for a demo vs. building for production is a different beast." Enterprises are experimenting a lot but benching ideas even more. Time to value is king. Putting an AI stamp is no longer the north star. And the forecast at the close: "Like any new tech, we are in the honeymoon period - everyone is trying everything until something clicks, and then the rush towards structure and methods begins."

The nine takeaways were observation. That final sentence was a prediction.

Three months later, on 2024-12-04, the field data distilled into competitive strategy: infrastructure, talent, data are the three durable AI moats. That post was the lift-out, the answer to what survives when 80% of experiments die.

Nine months after the anchor, on 2025-06-20, Agam returned with a new number: "The shift from '10 experiments' to '2 production grade wins' is underway." The honeymoon-period prediction had closed. The same post opened toward agent-first territory: enterprises want agent onboarding, not agent building. Production reality and agent-first are not separate beliefs. They are the same observation at two different time points in the enterprise AI adoption cycle.

---

## What it implies

The 10-to-2 ratio has three direct implications.

**On failure mode:** the eight experiments that die do not fail on model capability. They fail on the boring stuff: non-functional requirements (performance, security, scalability, ease of use), governance and compliance overhead, data pipelines that were never built for continuous collection, and time-to-value arithmetic that fails before the POC ever reaches a real user. The failures are predictable. The failure modes are enumerable. A PM who specs NFRs before chasing features is applying production-reality discipline from the first document.

**On moats:** three durable assets survive the 2/10 rate. Infrastructure: compute and serving substrate that scales with agents, not just chatbots. Talent: the small population of people who can build, fine-tune, and operate foundational AI systems; there are not many, and that scarcity compounds. Data: not raw corpus volume but the architecture underneath it. "Having data is one thing; having AI-ready data is where the value lies." Data collection pipelines, transformation layers, continuous ingestion systems. Plant the seed today. What is NOT on the moats list: the model itself. Foundation-model capability runs on a rough 12-month commoditization cycle. GPT-4 cost went from $36 to $4 per million tokens in one year. A position built on "we have a great model" is a position that resets every release cycle.

**On data specifically:** data readiness is not a volume problem. An enterprise with a large historical corpus and no live pipeline is building on a decaying foundation. The relevant question is not "how much data do we have?" but "how quickly can that data be collected, processed, and updated?" Pipeline infrastructure is the hardest moat to replicate by spending money. That is why data ranks highest of the three.

---

## Tension with `agent-first`

The agent-first theme is optimistic about enterprise AI's direction. This theme is cautious about its deployment rate. The 2025-06-20 post is where both stitched together.

The resolution is scope-difference, not contradiction. Production reality names the rate at which experiments clear the production bar, today. Agent-first names the direction enterprises are consolidating toward, next. The same field data produces both: "10 experiments yield 2 wins" and "horizontal AI does not scale, agentic AI is the new direction." Skepticism about the rate is not pessimism about the destination.

Cross-link: `theme.agent-first`

---

## Evidence

| Date | Surface | What it shows |
|---|---|---|
| 2024-03-08 | Collab Article comment | NFR failure rate seed: 55% of production issues are non-functional requirements (Standish Group) |
| 2024-06-07 | Collab Article comment | Data-readiness seed: data readiness is pipeline architecture, not just historical corpus |
| 2024-08-30 | Post | Model commoditization observed: GPT-4 cost 36 to 4 USD per million tokens in 12 months; model is not the moat |
| 2024-09-04 | Post (9 takeaways) | Anchor: demo vs production is a different beast; enterprises experimenting a lot, benching ideas even more; honeymoon-period prediction |
| 2024-12-04 | Post (three AI moats) | Distillation: infrastructure, talent, data are the three durable moats; model not on list; Data moat ranked highest |
| 2025-06-20 | Post (GenAI paradox) | Confirmation: 10 experiments to 2 production grade wins is the numeric rate; honeymoon period is gone; agent-first pivot named |
| 2025-06-20 | Own-comment on post | McKinsey Seizing the Agentic AI Advantage (June 2025) cited as external validation within hours |
| 2025-09-29 | Comment-thread reply | Field data: production voice-AI stack (cloud LLMs, MCP-first API layer, business KPI ordered ahead of tech KPI); one worked example among many, per Decision 2 |
| 2025-12-04 | Post (anti-customization) | Extension to PM craft: "six months of implementation, an implementation partner, hundreds of training documents" — the demo-vs-production gap at the PRD layer |

---

## Open question

The 10-to-2 ratio is Agam's empirical read as of 2025-06-20. The question is whether it travels forward. Governance is now table stakes, the shift to structured platform investment is underway, and enterprises with real moats are compounding. Does the rate improve? Is 2/10 still the right number in 2026, or is the more durable version of this belief about the structure of failure rather than the rate? Taste-pass decides: commit to the number, or commit to the frame.

---

*Draft for taste-pass. Not final.*

---

## Open Qs for Agam taste-pass (callout)

1. **10-to-2 rate in 2026:** Is the "2 production grade wins from 10 experiments" ratio still your operative number, or do you want to frame it as "roughly 80% bench rate" as the more durable framing? Has the rate shifted with governance maturation?

2. **55% Standish NFR anchor:** That number appears once, in a March 2024 Collab comment. Do you still cite it internally? If yes, lead with it. If it has faded, reframe as "NFRs are the dominant failure mode" without the specific number.

3. **2025-09-29 voice-AI production reply:** The worked example in Evidence uses voice-AI label with "one example among many" framing (option A from R4). Do you want it cited this way, or stripped of the voice-AI label per Decision 2?

4. **Honeymoon-to-consolidation forecast:** The 2024-09-04 prediction ("the rush towards structure and methods begins") and the 2025-06-20 confirmation ("the period of experimentation is gone") — upgrade to "thesis confirmed" on the wiki, or frame as "consolidation is real but uneven"?

5. **Data moat ranking:** The 2024-12-04 post ranks Data as "probably the biggest moat." Does that ranking still hold 18 months later, given how the AI infrastructure and talent markets have moved?

6. **MCP as enterprise primitive (ghost):** The 2025-09-29 comment names MCP as the interface layer ("100% driven through MCP + APIs"). Should this appear as a one-sentence ghost note under the Evidence section, or held entirely until the belief has corpus confirmation you are comfortable citing?
