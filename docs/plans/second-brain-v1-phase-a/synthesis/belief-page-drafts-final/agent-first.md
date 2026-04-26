---
type: BeliefPage
slug: agent-first
title: Agent-first thesis
one_line: "Platforms that cannot talk to autonomous agents are already behind: agents are users too, and maybe first."
parent_theme: agent-first
related_beliefs:
  - belief.context-over-prompt
  - belief.spec-over-sprint
  - belief.application-layer-is-where-safety-lives
  - belief.reversibility-over-consequences
  - belief.agent-layer-is-threat-surface
  - belief.substance-over-hype
tier: 1
length_target: 600-800w
status: c-voice-beliefs-r1-cp1-reference
voice_register: 1 (free-form post-essay)
---

# Agent-first thesis

This is the central belief that gives the [agent-first theme](/wiki/agent-first/) its name. It says: platforms that cannot talk to autonomous agents are already behind. The serving lens - what your APIs, data surfaces, and systems look like to an agent calling on behalf of a user - is where the next layer of differentiation lives. You are likely here from the parent theme and want the bare claim plus the supersession edges. Two minutes is enough.

## The claim

Verbatim from the June 20, 2025 manifesto: "Start thinking 'agent first'. Not just from a building lens but from a serving lens. That will be the differentiation."

The strongest single move in that post is the parenthetical. "(and maybe first)." Agents are users too, and maybe first. Not a 2030 prediction. A 2026 claim. One enterprise voice deployment in the corpus is already running 0% automation through UI, 100% through MCP and APIs.

Three things follow at the craft layer. Each is a separate belief in this graph, not a sub-claim of this one.

- Prompts are plumbing, not user-facing UX. See [prompts as engineering primitive](/wiki/beliefs/prompts-as-engineering-primitive/).
- Context is the lever, not the prompt. See [context over prompt](/wiki/beliefs/context-over-prompt/).
- Reversibility comes before consequences. The application layer is where safety lives. See [application-layer-is-where-safety-lives](/wiki/beliefs/application-layer-is-where-safety-lives/).

A team that says "agent-first" but ships prompt-as-UX, context-by-accident, and irreversible-action-by-default has not absorbed the belief. They have adopted the language.

## How the belief formed

The intuition was early. The vocabulary lagged.

March 2023: "This will open up a new ecosystem in itself. The very first AI marketplace." A ChatGPT Plugins post. The instinct read the LLM-plus-tools-plus-actions surface as the actual product, not the LLM alone. A marketplace-economics frame carried over from V2 Games - a database thinker's instinct applied to AI infrastructure.

Eighteen months of enterprise field work followed. June 2024: multi-agent systems "not a question of if, but when." September 2024: demo-versus-production "is a different beast" with nine takeaways. December 2024: the kill-prompting post named the broken layer with a verb that overshot the actual claim.

The crystallization landed in one June 20, 2025 post. Three moves at once: horizontal AI declared dead ("chatbots and copilots hit a wall without real domain depth"), agentic AI named as the new direction, the serving lens introduced as the differentiation move. After that post, agent-first stopped being an argument in the corpus and started behaving like a flat assumption. By July 2025 the prompts layer was re-admitted as plumbing: "While I hate the fact that reliance on the prompt is not reducing it is still the magic sauce in most cases." By April 2026 the whole stance had compressed into three lines: Spec over Sprint, Taste over Execution, Context over Prompt.

## What it supersedes, what conditions it, what it holds with

What got superseded, by direct declaration on 2025-06-20: horizontal-AI-will-scale, single-model-as-substrate, prompt-as-primary-interface. The 2023-03-14 post ("I find myself using ChatGPT for just about everything") sits on the pre-hinge side of the same arc. It stayed live. The supersession is public.

What conditions this belief: [substance over hype](/wiki/root.substance-over-hype/). Agent-first is the substance test applied to AI architecture - agents as substrate, not chatbots in a UX skin. Same disposition that called blockchain a database innovation in 2018.

What holds simultaneously: [enterprise AI reality](/wiki/enterprise-ai-reality/). Roughly 80% of enterprise AI experiments do not reach production. Both claims are true at once. Agent-first is the framework for being in the 20% that ships. Direction versus current rate. Different scopes.

## Where to go from here

Three exits.

If you want the **wide framing** with applications and the full thesis arc, go to the [agent-first theme](/wiki/agent-first/).

If you want the **craft-layer corollaries** in their starkest form, jump to [context over prompt](/wiki/beliefs/context-over-prompt/) or [spec over sprint](/wiki/beliefs/spec-over-sprint/). Each is a separate belief that this one forces.

If you want the **field data** that explains why the thesis matters operationally, [enterprise AI reality](/wiki/enterprise-ai-reality/) holds the production-truth view. Start there if you came in skeptical.

## Evidence

| Date | Entry | Post |
|---|---|---|
| 2023-03-24 | "The very first AI marketplace." ChatGPT Plugins as ecosystem-instinct seed. | urn:li:activity:7044971627607900160 |
| 2024-06-06 | Multi-agent systems: "not a question of if, but when." First explicit agent-layer framing. | urn:li:activity:7204325913650491392 |
| 2024-12-24 | "We need to kill prompting." Kill-prompting post contains the agentic-year prediction as underrated payload. | urn:li:activity:7277158028422914048 |
| 2025-06-20 | THE HINGE. "Start thinking 'agent first'. Not just from a building lens but from a serving lens. That will be the differentiation." | urn:li:activity:7341662205257433088 |
| 2025-07-17 | Agent architecture decomposed; prompts re-admitted as plumbing. | urn:li:activity:7351602695977226243 |
| 2025-09-29 | "0% automation driven through UI, 100% driven through MCP + APIs." Production application of the serving-lens thesis. | urn:li:activity:7378427141190799360 |
| 2025-11-17 | "The model wasn't broken, the agent layer was." 17-month prediction confirmed by the Chinese threat-actor incident. | urn:li:activity:7396047657951064064 |
| 2026-01-06 | Application-layer safety prescription: "This is not a research problem, but an application problem." | urn:li:activity:7414150680820547584 |
| 2026-04-23 | second-brain v1: agent-first applied to personal knowledge. Every future AI session reads the same brain and writes back to it. | urn:li:activity:7452998640345853952 |
