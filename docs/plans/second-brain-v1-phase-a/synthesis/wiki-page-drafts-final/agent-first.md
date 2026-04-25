---
type: Theme
slug: agent-first
title: Agent-first thesis
status: draft-r9
length_target: 1200-1500
voice_register: 1 (free-form post-essay)
beliefs:
  - belief.agent-first — Platforms that can't talk to autonomous agents are behind
  - belief.agent-first-ecosystem-instinct — ChatGPT plugins were the first AI marketplace
  - belief.application-layer-is-where-safety-lives — agents kept from decisions unless programmatic
  - belief.reversibility-over-consequences — decouple tokens from decisions
  - belief.agent-layer-is-threat-surface — model wasn't broken, agent layer was
  - belief.prompts-as-engineering-primitive — prompts are plumbing, not UX
  - belief.context-over-prompt — context is the lever
  - belief.kill-prompting — historical waypoint, refined not held literally
---

# Agent-first thesis

*Era: 2023-03 to 2026-04 · 14+ posts · 8 beliefs*

---

## Core belief

Platforms and products that cannot talk to autonomous agents are already behind. Think serving-lens first: your APIs, your data surfaces, your system design must be legible to agents calling on behalf of users, not just to the users themselves. The building-lens question gets most of the attention. The serving-lens question is where the differentiation lives.

Prompts are plumbing, not UX. Context is the lever, not the prompt string. Agent deployment without reversibility constraints is not deployment: it is exposure. These three craft corollaries follow directly from the thesis.

---

## How it formed

The intuition arrived two and a half years before the manifesto.

In March 2023, when OpenAI shipped ChatGPT Plugins, most observers saw a feature. Agam saw an ecosystem: "This will open up a new ecosystem in itself. The very first AI marketplace." (2023-03-24) LLM plus third-party tools plus actions was the revolution, not the LLM alone.

The thesis hardened through 18 months of demos, POCs, and boardroom slides. By mid-2024, Multi-Agent Systems were "not a question of if, but when." By September 2024: "building for a demo vs. building for production is a different beast." The observation was correct. The agentic frame was not yet there.

On June 20, 2025, the thesis crystallized. Three moves in one post: horizontal AI declared dead ("chatbots and copilots are cool until they hit a wall without real domain depth"); agentic AI declared the new direction; and the serving lens introduced as the differentiation move. The key line: "Most importantly, start thinking 'agent first'. Not just from a building lens but from a serving lens. That will be the differentiation. If your platform can't talk to autonomous agents, you're not ready. Time for the new UX."

The "(and maybe first)" parenthetical is the strongest single claim: agents may be primary users before humans are.

What was superseded was explicit. Horizontal-AI-will-scale, single-model-as-substrate, prompt-as-primary-interface: all three dissolved at this boundary. The 2023-03-14 post ("I find myself using ChatGPT for just about everything") represents the pre-hinge stance accurately. It stayed live. The arc is public.

After the manifesto, agent-first became a flat assumption. By April 2026 it had become craft posture: "Context > Prompt." The second-brain v1 is agent-first applied to personal knowledge: "every future AI session reads the same brain and writes back to it."

---

## What it implies

**Building lens.** Agents are the new architectural substrate. Design every capability to be called by an orchestration layer. Agents decompose into three engineered surfaces: LLM inference plus prompting, tools, and memory. None are user-facing dials.

**Serving lens.** Every API, every data endpoint, every workflow must ask: can an agent parse it, act on it, and fail safely? Most teams optimize for human legibility. Agent legibility is the next constraint.

**Craft: prompts as plumbing, context as lever.** The December 2024 "kill prompting" post was a correct diagnosis with an overstated verb. What needed killing was prompts as user-facing incantation. What survived: "While I hate the fact that reliance on the prompt is not reducing it is still the magic sauce in most cases." (2025-07-17) Prompts enable guardrails, tool calling, output parsing, memory. The engineer ships them; the user never sees them.

Named waypoint: the 2024-12-24 kill-prompting post and the 2025-07-17 re-admission are both public, both still live. The arc is honest: overstated verb, correct diagnosis, refinement applied. Prompts-as-UX-layer died. Prompts-as-engineering-primitive survived. The U-turn is the evidence that the belief is held empirically, not as identity.

When the prompt is plumbing, the leverage moves upstream: to the context layer, the personal and organizational data and history that determines what the agent knows before it reasons. "Context > Prompt" (2026-04-09). The second-brain wiki and kg.json are the operational form: a durable context layer every agent session reads without being prompted.

**Safety: application-layer, not research-layer.** "This is not a research problem, but an application problem. I am glad we are stepping into solving these outside the realms of models now. No more waiting for the smarter model to solve my broken and intermittent workflow drifts." (2026-01-06)

The authorization test: can the decision be evaluated programmatically? If yes, the agent executes. If no, the agent surfaces the decision for a human. Reversibility is the mechanism: snapshots, checkpoints, evals, GIT-style version control at the orchestration layer. Software engineering primitives applied to a new surface.

The threat-surface corollary arrived November 2025 when a Chinese threat actor ran a full cyberattack using Anthropic's Claude as an autonomous agent. Agam had flagged orchestration-level risk 17 months earlier. The confirmation: "The model wasn't broken, the agent layer was." Diagnosis and prescription point the same direction: application layer is both where the threat lives and where the fix is built.

---

## Tension with `enterprise-ai-reality`

The enterprise-ai-reality theme holds a field observation: 10 experiments produce 2 production-grade wins. If agent-first is bullish on deployment and enterprise reality is cautious on production wins, is there a contradiction?

No: different scopes. Enterprise-ai-reality is about what is currently happening. Deployments fail to reach production not because the architecture is wrong but because conditions are not met: data readiness, KPI definition, reversibility, non-functional requirements. Agent-first is a structural bet about where the architecture is going. The reconciliation: agent-first IS the framework for being among the 2-of-10. Serving-lens-first, reversibility in from the start, agent layer hardened — those are the production-grade projects.

The tension with `reversibility-over-consequences` is structural and held, not resolved. Bullish on deployment. Bearish on decision authority without programmatic evaluability. The 2026-01-06 post holds both: "Not just guardrails, but checks and balances." Deployment scope and authorization scope are not the same dial.

Cross-link: [`enterprise-ai-reality`](/wiki/enterprise-ai-reality/) — same field data, different analytical frame: direction vs current rate.

---

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

---

## Open question

The manifesto says agents may be primary users. The reversibility belief says keep agents from decisions that cannot be evaluated programmatically. Both hold. The open question: at what decision-altitude does programmatic evaluability become tractable?

GIT-style reversibility works for deterministic state transitions. Enterprise decisions involving customer NPS, legal exposure, or brand risk are harder to reduce to a check function. The gap between "reversibility as architectural primitive" and "reversibility that covers the full enterprise decision surface" is where application-layer safety work happens next.

Agent-first is bullish on deployment. Whether the safety stack matures at the same rate as capability is the builder problem of 2026.

---

*Draft for taste-pass: not final.*

---

> **Open Qs for Agam taste-pass (callout)**
>
> 1. **kill-prompting visibility:** The 2024-12-24 U-turn post is on the public record. This draft names it as a named waypoint ("overstated verb, correct diagnosis, refinement applied"). Does this framing read as honest intellectual evolution, or should the arc be described more directly?
>
> 2. **application-layer-safety placement:** All three safety beliefs (application-layer-is-where-safety-lives, reversibility-over-consequences, agent-layer-is-threat-surface) are nested under "What it implies." Should they stay here, or should one anchor a cross-theme sidebar?
>
> 3. **serving-lens vs craft as lead:** The 2025-06-20 manifesto leads with the serving lens. By 2026-04-09 it has become craft posture. Does Agam want the page to open with the 2025 strategic frame and trace forward, or lead with current-voice (craft) and trace backward?
>
> 4. **"(and maybe first)" parenthetical weight:** Does Agam endorse the radical reading (agents may be primary users before humans) as the operative framing, or the softer reading (agents are also users, treat them as first-class)?
>
> 5. **2025-09-29 production comment framing:** Decision 2 binds voice-AI as intentional under-share. Preferred citation: (a) cite as voice-AI production ("one application of the serving lens"), or (b) paraphrase as "MCP-first backend-driven deployment" without naming voice-AI explicitly?
