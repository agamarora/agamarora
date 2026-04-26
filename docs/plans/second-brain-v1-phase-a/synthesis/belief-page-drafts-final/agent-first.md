---
type: BeliefPage
slug: agent-first
title: Agent-first
one_line: "Build for autonomous agents as users, not just for humans. The serving lens is where the next layer of differentiation lives."
parent_theme: agent-first
related_beliefs:
  - belief.context-over-prompt
  - belief.spec-over-sprint
  - belief.application-layer-is-where-safety-lives
  - belief.reversibility-over-consequences
  - belief.agent-layer-is-threat-surface
  - belief.substance-over-hype
supersedes:
  - horizontal-ai-will-scale
  - prompt-as-primary-interface
conditioned_by:
  - substance-over-hype
holds_with:
  - enterprise-ai-production-reality
tier: 1
length_target: 400-600w
status: c-voice-beliefs-r1-cp1-reference-d6
voice_register: 1 (free-form post-essay)
shape: principle-card-d6
---

# Agent-first

## The belief

Platforms that cannot talk to autonomous agents are already behind. The serving lens - what your APIs, data surfaces, and systems look like to an agent calling on behalf of a user - is where the next layer of differentiation lives. Agents are users too, and maybe first.

## How to apply

1. **Default to agent-legible interfaces.** When designing a new system or feature, the API and the agent-callable surface are the primary specification. The human UI is downstream of that, not the other way around.
2. **Spec the agent flow alongside the user flow.** A PRD that lists user journeys without listing agent journeys is incomplete. For every user-facing action, name the agent equivalent and the contract it exposes.
3. **MCP / tool-calling first, UI second.** When the choice is "build a UI for this" vs "expose this as an MCP tool or programmatic surface," start with the programmatic surface. UI can wrap it later. The reverse is hard.
4. **Treat the agent layer as a security boundary, not a thin client.** Auth, rate limits, audit logs, reversibility checkpoints belong at the agent-callable surface. Assume the agent is the active principal, not a passive proxy for a human.
5. **Measure agent traffic explicitly.** If a system serves both humans and agents, instrument the split. If the agent share is rising, that is a signal to invest in the serving lens, not to wait for humans to catch up.

## What this is not

- **Not "no UI."** Agent-first does not mean ship API-only products. It means build the agent surface first and let the human view sit on top. A pure-API-no-UI product is the over-rotation, not the goal.
- **Not "agents are the only users."** Humans still matter. The claim is that agents are first-class, not exclusive. A system that ignores either surface fails the test.
- **Not contradicted by enterprise-AI failure rates.** Roughly 80% of enterprise AI experiments do not reach production (see `holds_with: enterprise-ai-production-reality`). Both claims are true. Agent-first is the framework for being in the 20% that ships, not a guarantee. Direction versus current rate.

## Where to go from here

If you want the **wide framing** with applications and the full thesis arc, go to the [agent-first theme](/wiki/agent-first/).

If you want the **craft-layer corollaries** that this belief forces, jump to [context over prompt](/wiki/beliefs/context-over-prompt/) or [spec over sprint](/wiki/beliefs/spec-over-sprint/).

If you want the **operational reality check**, [enterprise AI reality](/wiki/enterprise-ai-reality/) holds the production-truth view. Read it if you came in skeptical.

## Evidence

| Date | Entry | Post |
|---|---|---|
| 2023-03-24 | "The very first AI marketplace." Ecosystem-instinct seed. | urn:li:activity:7044971627607900160 |
| 2024-06-06 | Multi-agent systems: "not a question of if, but when." First explicit agent-layer framing. | urn:li:activity:7204325913650491392 |
| 2024-12-24 | "We need to kill prompting." Agentic-year prediction folded into a kill-prompting headline. | urn:li:activity:7277158028422914048 |
| 2025-06-20 | THE HINGE. "Start thinking 'agent first'. Not just from a building lens but from a serving lens. That will be the differentiation." | urn:li:activity:7341662205257433088 |
| 2025-07-17 | Agent architecture decomposed; prompts re-admitted as plumbing. | urn:li:activity:7351602695977226243 |
| 2025-09-29 | "0% automation driven through UI, 100% driven through MCP + APIs." Production application of the serving-lens claim. | urn:li:activity:7378427141190799360 |
| 2025-11-17 | "The model wasn't broken, the agent layer was." Agent layer named as the primary threat surface. | urn:li:activity:7396047657951064064 |
| 2026-01-06 | Application-layer safety prescription: "This is not a research problem, but an application problem." | urn:li:activity:7414150680820547584 |
| 2026-04-23 | second-brain v1: agent-first applied to personal knowledge. | urn:li:activity:7452998640345853952 |
