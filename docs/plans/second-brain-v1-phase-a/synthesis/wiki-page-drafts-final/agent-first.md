---
type: Theme
slug: agent-first
title: Agent-first thesis  -  serving lens for autonomous agents
one_line: "Agents are users too, and maybe first - the serving lens that matters once horizontal AI hits the depth wall."
status: c-voice-r1-cp1-reference
length_target: 800-1200
voice_register: 1 (free-form post-essay)
beliefs:
  - belief.agent-first  -  Platforms that can't talk to autonomous agents are behind
  - belief.agent-first-ecosystem-instinct  -  ChatGPT plugins were the first AI marketplace
  - belief.application-layer-is-where-safety-lives  -  agents kept from decisions unless programmatic
  - belief.reversibility-over-consequences  -  decouple tokens from decisions
  - belief.agent-layer-is-threat-surface  -  model wasn't broken, agent layer was
  - belief.prompts-as-engineering-primitive  -  prompts are plumbing, not UX
  - belief.context-over-prompt  -  context is the lever
  - belief.kill-prompting  -  stance evolved (prompting -> context engineering -> harness engineering); verdict held, layer migrated
---

# Agent-first thesis  -  serving lens for autonomous agents
This is one of twelve themes in the wiki. It names a stance that took two and a half years to crystallize: agents are users too, and the platforms that cannot serve them are already behind. You are likely here because you saw "agent-first" used as a noun and want the operational shape, or because you came in from [substance over hype](/wiki/root.substance-over-hype/) and want the strongest applied case.

Three things follow, in the order they make sense to read: the thesis, how it formed, and the corollaries it forces at the craft layer.

## The thesis

Platforms that cannot talk to autonomous agents are already behind. Build serving-lens first: APIs, data surfaces, system design must be legible to agents calling on behalf of users, not just to the users themselves. The building lens gets most of the attention. The serving lens is where the differentiation lives.

"(and maybe first)" is the strongest single claim in the manifesto: agents may be primary users before humans are. Not a futurist claim. A 2026 claim. Production traffic on enterprise voice systems is already 100% MCP + APIs, 0% UI - one example, but the shape generalizes.

## How the thesis formed

The intuition arrived early. The vocabulary did not.

In March 2023, when OpenAI shipped ChatGPT Plugins, most observers saw a feature: "This will open up a new ecosystem in itself. The very first AI marketplace." LLM plus third-party tools plus actions was the revolution. The LLM alone was not.

The thesis hardened through eighteen months of demos, POCs, and boardroom slides. By June 2024, multi-agent systems were "not a question of if, but when." By September 2024: "building for a demo vs. building for production is a different beast." The observation was correct. The agentic frame was not yet there.

On June 20, 2025, three moves landed in one post. Horizontal AI declared dead - "chatbots and copilots are cool until they hit a wall without real domain depth." Agentic AI named as the new direction. And the serving lens introduced as the differentiation move: "Most importantly, start thinking 'agent first'. Not just from a building lens but from a serving lens. That will be the differentiation."

What was superseded was explicit. Horizontal-AI-will-scale, single-model-as-substrate, prompt-as-primary-interface - all three dissolved at this boundary. The 2023-03-14 post ("I find myself using ChatGPT for just about everything") represents the pre-hinge stance accurately. It stayed live. The arc is public.

After the manifesto, agent-first became a flat assumption. By April 2026 it had become craft posture: "Context > Prompt." [Second-brain v1](/wiki/second-brain/) is agent-first applied to personal knowledge - every future AI session reads the same brain and writes back to it.

## Agent-first vs human-first - what changes

| Dimension | Human-first (default) | Agent-first |
|---|---|---|
| Primary user | Human in a UI | Autonomous agent calling on behalf of a human |
| Interface | Web UI, mobile app, dashboard | API surface, MCP tool catalog, structured data |
| Latency budget | Hundreds of ms acceptable | Sub-second per call, agents chain dozens |
| Authentication | OAuth + session cookies | Scoped API keys, OAuth-for-agents, tool permissions |
| Failure surface | Confusing message - human retries | Stale tool catalog, ambiguous schema - agent loops or stops |
| Observability | Session replay, click heatmaps | Tool-call traces, eval harnesses, action ledgers |
| Documentation | Onboarding docs, video tours | OpenAPI specs, llms.txt, MCP descriptors |
| Default state | Read by default, write on click | Read by default, write only with reversibility constraints |

Both lenses can coexist on the same product. The shift is which one drives the architecture decisions when they conflict. By April 2026, production traffic on enterprise voice systems is already 100% MCP + APIs, 0% UI - one example, but the shape generalizes.

## What the thesis forces at the craft layer

If agents are primary users, the production engineering rebuilds around them. Three corollaries fall out. Each is a separate belief on this site.

**Prompts are plumbing, not UX.** The interface to an agent is not the prompt string. It is the context surface, the tool catalog, the permission model. Building good prompts is a 2023 skill. Building good context is a 2025 skill. The December 2024 "kill prompting" post overstated the verb but got the diagnosis right: prompts as user-facing incantation are dead. Prompts as engineering primitive survived. The 2025-07-17 re-admission named the migration honestly: "While I hate the fact that reliance on the prompt is not reducing it is still the magic sauce in most cases." Plumbing, not UX.

**Context is the lever, not the prompt.** Personal data, conversation history, structured knowledge - what you put in front of the model before the session begins decides output quality more than the words you compose at the seam. Curation beats composition. Three lines from April 9, 2026: Spec > Sprint, Taste > Execution, Context > Prompt. Same shape three times: the upstream work matters more than the downstream one. See [context over prompt](/wiki/beliefs/context-over-prompt/) for the full belief.

**Reversibility over consequences.** Agent deployment without reversibility constraints is not deployment. It is exposure. The application layer is where safety lives - the November 2025 Chinese threat-actor incident with Claude landed a 17-month-old prediction on schedule: "The model wasn't broken, the agent layer was." The fix is checkpoints, programmatic evaluability, and GIT-style state at the orchestration layer. Software engineering primitives applied to a new surface.

A team that says "agent-first" but ships prompt-as-UX, context-by-accident, and irreversible-action-by-default has not absorbed the thesis. They have adopted the language.

There is a counter-claim worth naming directly. [Enterprise AI reality](/wiki/enterprise-ai-reality/) holds a different field observation: roughly 80% of enterprise AI experiments do not reach production. Both claims are true at once. Agent-first IS the framework for being in the 20% that ships - serving-lens-first, reversibility in from the start, agent layer hardened. Direction vs current rate. Different scopes.

## Where to go from here

Three exits, depending on what you came for.

If you want the **central belief** in its starkest form, read [the agent-first belief page](/wiki/beliefs/agent-first/). The 2025 manifesto and the 2023 ecosystem instinct sit on the same surface there.

If you want the **craft layer** - the part where "agent-first" stops being a thesis and starts being a builder posture - jump to [context over prompt](/wiki/beliefs/context-over-prompt/) or [second brain](/wiki/second-brain/).

If you want **adjacent themes**, [enterprise AI reality](/wiki/enterprise-ai-reality/) is the field-data lens, and the [knowledge graph](/wiki/graph/) shows all twelve themes and their cross-links at once.

## Evidence

| Date | Entry | Post |
|---|---|---|
| 2023-03-24 | "The very first AI marketplace." ChatGPT Plugins as ecosystem-instinct seed. | urn:li:activity:7044971627607900160 |
| 2024-06-06 | "Not a question of if, but when." Multi-Agent Systems as inevitable direction. First explicit agent-layer framing. | urn:li:activity:7204325913650491392 |
| 2024-09-04 | "Building for a demo vs. building for production is a different beast." Field data that feeds the manifesto. | urn:li:activity:7236941772336066560 |
| 2024-12-24 | "2025 is the year of agentic systems." Kill-prompting post contains the agentic-year prediction as underrated payload. | urn:li:activity:7277158028422914048 |
| 2025-06-20 | "Start thinking 'agent first'. Not just from a building lens but from a serving lens. That will be the differentiation." THE HINGE. | urn:li:activity:7341662205257433088 |
| 2025-07-17 | "While I hate the fact that reliance on the prompt is not reducing it is still the magic sauce in most cases." Prompts re-admitted as engineering plumbing. Agent-first presupposed as flat premise. | urn:li:activity:7351602695977226243 |
| 2025-09-29 | "0% automation driven through UI, 100% driven through MCP + APIs." Production deployment: one application of the serving-lens thesis at enterprise scale. | urn:li:activity:7378427141190799360 |
| 2025-11-17 | "The model wasn't broken, the agent layer was." 17-month prediction confirmed by Chinese threat-actor incident. | urn:li:activity:7396047657951064064 |
| 2026-01-06 | "This is not a research problem, but an application problem." Application-layer safety prescription: reversibility, checkpoints, programmatic evaluability. | urn:li:activity:7414150680820547584 |
| 2026-04-09 | "Context > Prompt." Agent-first as craft posture: context is the lever, prompt is the downstream seam. | urn:li:activity:7447981735901949952 |
| 2026-04-23 | "Every future AI session reads the same brain and writes back to it." Second-brain v1 as agent-first applied to personal knowledge. | urn:li:activity:7452998640345853952 |
