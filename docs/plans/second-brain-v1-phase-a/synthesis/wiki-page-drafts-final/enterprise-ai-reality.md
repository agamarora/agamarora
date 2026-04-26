---
type: Theme
slug: enterprise-ai-reality
title: Enterprise AI reality  -  ships vs demos
one_line: "Why ~80% of enterprise AI experiments don't reach production, and which non-functional failure modes actually decide the outcome."
status: c-voice-r1-cp6
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

This is one of twelve themes in the wiki. It holds a field observation I have been making since 2024, built from demos, POCs, and boardroom slides: building for a demo and building for production are different beasts. You are likely here because the phrase "roughly 80% don't reach production" appeared somewhere on this site and you want the evidence and the failure taxonomy behind it, or because [agent-first](/wiki/agent-first/) sent you here for the production-rate context. This page sits between the optimism of the agent-first direction and the ground-level data on how fast enterprises actually get there.

The thesis is blunt: enterprises are experimenting broadly, and correctly. They are benching most experiments, also correctly. The category is real. The deployment rate is brutal. Both facts are true simultaneously, and conflating them is the most expensive mistake an AI team can make.

## The observation: demo vs production

Building for a demo and building for production are different beasts. That sentence is from September 4, 2024 - nine takeaways from building and demoing a considerable number of GenAI product concepts to potential enterprise customers. At that point I had been at the enterprise voice AI platform for sixty days.

The nine takeaways were observation. The final sentence was a prediction: "Like any new tech, we are in the honeymoon period - everyone is trying everything until something clicks, and then the rush towards structure and methods begins."

By June 20, 2025, the prediction had closed. The honeymoon period was over. The post named the confirmed frame: 10 experiments yield 2 production-grade wins. Roughly 80% bench rate. Not a forecast anymore - a field number.

## What the failures look like

The experiments that don't reach production don't fail on model capability. They fail on four things, enumerable in advance.

**Non-functional requirements.** Performance, security, scalability, ease of use. These are not tick-box compliance items. They are the specification layer where most products fail. I named this in a LinkedIn Collaborative Article in March 2024, three months before joining the enterprise voice AI platform: non-functional requirements are the dominant failure mode in production. The field data confirmed the dispositional claim, not the other way around. An AI PM who specs NFRs before chasing features is applying production-reality discipline from the first document.

**Data pipelines that were never built for continuity.** In June 2024, a month before the enterprise role started: "A common trap that teams fall in is that data readiness does not just mean having a large historical corpus to train on but the systems to be able to continuously collect, process and update the training data." An enterprise with a large historical corpus and no live pipeline is building on a decaying foundation. The relevant question is not "how much data do we have?" but "how quickly can that data be collected, processed, and updated?" That architecture is hard to replicate by spending money. It is the hardest moat.

**Governance and compliance overhead.** This accelerates with scale, not with models. It bites hardest after the POC, when legal, security, and privacy requirements land on a prototype that was never designed to carry them.

**Time-to-value arithmetic that fails before real users arrive.** Putting an AI stamp is no longer the north star. Time to value is king. A POC that cannot show business-metric movement within a cycle does not reach production - not because the technology failed, but because the ROI case never closed.

## Three moats that survive the 2/10 rate

In December 2024, the field data distilled into competitive strategy. Three assets survive when 80% of experiments die.

Infrastructure: compute and serving substrate that scales with agents, not just chatbots. The teams that treat infrastructure as a sprint-1 concern are the ones still using it in production two years later.

Talent: the small population of people who can build, fine-tune, and operate foundational AI systems. There are not many, and that scarcity compounds. One honest line from that post: "Having data is one thing; having AI-ready data is where the value lies."

Data: not raw corpus volume but the architecture underneath it. Collection pipelines, transformation layers, continuous ingestion systems. Plant the seed today.

What is NOT on the moats list: the model itself. Foundation-model capability runs on a rough 12-month commoditization cycle. GPT-4 cost went from $36 to $4 per million tokens in one year. A position built on "we have a great model" is a position that resets every release cycle.

## How this connects to agent-first

The [agent-first](/wiki/agent-first/) theme is optimistic about enterprise AI's direction. This theme is precise about its current deployment rate. They look like a contradiction. They are a scope difference.

Production reality names the rate at which experiments clear the bar, today. Agent-first names the direction enterprises are consolidating toward, next. The same June 20, 2025 post carries both: "10 experiments yield 2 wins" and "horizontal AI does not scale, agentic AI is the new direction." Same post, same field data, different analytical frame.

The resolution matters practically: agent-first IS the framework for being among the 2-of-10 that ships. Serving-lens-first, reversibility built in from the start, NFRs specified at PRD-time - those are what the production-grade projects do differently. The skepticism about the rate is not pessimism about the destination. The destination is real. The path to it costs more than most teams budget.

## Where to go from here

Three exits, depending on what you came for.

If you want the **craft layer** - what "non-functional requirements at PRD-time" actually looks like in a live production voice AI deployment - read [voice AI craft](/wiki/voice-ai-craft/). That page is the worked example: cloud vs on-prem trade-offs, MCP-first abstraction, business KPI ordered before tech KPI, all from a system running 4M+ calls per year.

If you want the **direction** this field is heading next - the agent-first thesis and why the 20% that ships is converging on serving-lens-first architecture - read [agent-first](/wiki/agent-first/). The June 2025 post where both claims originate is there.

If you want the **full belief graph** - all twelve themes and their cross-links laid out together - the [knowledge graph](/wiki/graph/) is the navigator.

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
