---
type: BeliefPage
slug: agent-first
title: Agent-first thesis
parent_theme: agent-first
related_beliefs:
  - belief.horizontal-ai-will-scale
  - belief.context-over-prompt
  - belief.spec-over-sprint
  - belief.application-layer-is-where-safety-lives
  - belief.reversibility-over-consequences
  - belief.agent-layer-is-threat-surface
  - belief.substance-over-hype
tier: 1
length_target: 400-800w
status: draft-task-h
---

# Agent-first thesis

## Statement

Start thinking agent-first. Not just from a building lens - from a serving lens. Platforms that cannot talk to autonomous agents are already behind. Horizontal AI does not scale: chatbots and copilots hit a wall without real domain depth. Agentic AI replaces the horizontal-monolith dream because depth is composable through tool-calling and orchestration. The serving lens is where differentiation lives - your APIs, your data surfaces, and your systems must be legible to autonomous agents calling on behalf of users. Your systems must serve agents too, and maybe first.

## Origin

The earliest seed appears in a March 2023 post on ChatGPT Plugins: "This will open up a new ecosystem in itself. The very first AI marketplace." At the time, Agam framed it in marketplace-economics terms carried from V2 Games - the LLM was not the revolution, the ecosystem around it was. The intuition was present two years before the full thesis arrived.

The field-data phase followed across 18 months of enterprise AI work. A June 2024 post on multi-agent systems called MAS "not a question of if, but when" while warning on cost and complexity. A September 2024 post converted demo-vs-production observations into nine takeaways without yet naming agents as the answer. A December 2024 post predicted "2025 will be the year of agentic systems" - but framed it through the prompting critique rather than the serving lens.

The crystallization arrived in a single June 20, 2025 manifesto post. Three moves in one: (a) horizontal AI declared dead, (b) agentic AI declared the new direction, (c) the serving lens introduced as the differentiation move. All three appeared together for the first time. "Start thinking agent first. Not just from a building lens but from a serving lens. That will be the differentiation."

## Refinement arc

The refinement arc for agent-first intersects with the prompts arc. The December 2024 "kill prompting" declaration was the last pre-manifesto post - correctly diagnosing that something was broken, using a headline that overshot the actual claim. The skill layer migrated; the verdict held.

By July 2025, a primer post decomposed agent architecture as three primitives: LLM inference and prompting, tools, and memory. Prompts were re-admitted as plumbing - guardrails, tool-calling, output parsing - not user-facing UX. The arc: prompt-engineering-as-skill (2023) assumed composing words was the primary determinant; kill-prompting (Dec 2024) correctly rejected that; prompts-as-engineering-primitive (Jul 2025) and context-over-prompt (Apr 2026) named what actually is. Tonal overshoot; diagnosis held.

Two November 2025 posts refined the safety boundary: a Chinese threat actor used Claude as an autonomous agent for a cyberattack. "The model wasn't broken, the agent layer was." This confirmed the prediction from a June 2024 MAS post - 17 months earlier - that the agent layer would become the primary threat surface. A January 2026 post added the authorization constraint: agents should be kept away from decision-making unless the decision can be evaluated programmatically. Bullish on deployment scope; cautious on decision authority. Both held simultaneously.

By April 2026, agent-first reached craft posture. The Spec > Sprint / Taste > Execution / Context > Prompt trilogy treats agent-building as a taste problem, not a strategy problem. The second-brain v1 launch is itself an agent-first artifact: plain markdown, open-source, built so Claude, ChatGPT, and Cursor can read the same knowledge layer.

## Cross-links

- Parent theme: [wiki:agent-first](/wiki/agent-first)
- Related beliefs: [wiki:beliefs:context-over-prompt], [wiki:beliefs:spec-over-sprint], [wiki:beliefs:application-layer-is-where-safety-lives], [wiki:beliefs:reversibility-over-consequences], [wiki:beliefs:agent-layer-is-threat-surface]
- Supersedes: [wiki:beliefs:horizontal-ai-will-scale] (2025-06-20 direct declaration)
- Conditioned by: [wiki:root.substance-over-hype] (agent-first is anti-hype applied to AI - same disposition that called blockchain a database innovation in 2018)
- Tension: agent-first (bullish deployment) held simultaneously with reversibility-over-consequences (cautious authorization) - orchestration scope is not authorization scope

## Evidence

- 2023-03-24 - "The very first AI marketplace" - ChatGPT Plugins ecosystem seed - urn:li:activity:7044971627607900160
- 2024-06-06 - Multi-agent systems: "not a question of if, but when" - urn:li:activity:7204325913650491392
- 2024-12-24 - "We need to kill prompting... While 2025 is the year of agentic systems" - urn:li:activity:7277158028422914048
- 2025-06-20 - "Start thinking agent first. Not just from a building lens but from a serving lens. That will be the differentiation." - urn:li:activity:7341662205257433088
- 2025-07-17 - Agent architecture decomposed; prompts re-admitted as plumbing - urn:li:activity:7351602695977226243
- 2025-11-17 - "The model wasn't broken, the agent layer was" - Chinese threat actor incident - urn:li:activity:7396047657951064064
- 2026-01-06 - "Agents should be kept away from decision making unless the decision can be evaluated programmatically... This is not a research problem, but an application problem" - urn:li:activity:7414150680820547584
- 2026-04-23 - second-brain v1 launch: "every future AI session reads the same brain and writes back to it" - urn:li:activity:7452998640345853952

---
*Draft for Phase B HTML scaffolding. Source: belief-deep-dives/agent-first.md.*
