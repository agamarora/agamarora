---
type: Theme
slug: voice-ai-craft
title: Voice AI craft  -  cost, latency, scale
one_line: "Production voice AI is a different beast from chatbots: latency, cost, and state at 4M+ calls per year - the public surface is intentionally light."
status: c-voice-r1-cp2
length_target: 800-1200
voice_register: 4 (technical-practitioner numbered precision)
positioning: peer_page (confirmed per E1)
evidence_anchor: agamarora.com /lab voice-AI production case study (2025-2026)  -  public surface independent from LinkedIn corpus
beliefs:
  - belief.voice-as-enterprise-wedge (ghost belief; intentional under-share per Decision 2)
  - belief.enterprise-ai-production-reality (cross-linked anchor)
---

# Voice AI craft  -  cost, latency, scale

This is one of twelve themes in the wiki. It covers what production voice AI actually requires: latency budgets in milliseconds, cost structures priced per call-minute, state management that survives mid-sentence network drops. You are likely here because the words "4M+ calls per year" or "MCP-first voice pipeline" appeared somewhere in the wiki and you want the operational shape. This page sits between [enterprise AI reality](/wiki/enterprise-ai-reality/) and [agent-first](/wiki/agent-first/) - the craft layer that connects the production philosophy to a specific domain.

One thing to know before reading: the LinkedIn corpus is intentionally sparse on voice AI specifics. The page explains why, and what the public record actually contains.

## The craft reality

Voice AI is not a chatbot with audio on top. The engineering constraints are different in kind, not in degree.

A production voice pipeline carries a latency budget measured in milliseconds. A user on a call does not wait. Every component in the chain - the speech recognition, the LLM call, the tool execution, the synthesis - has to fit inside a total time-to-first-token (TTFT) threshold that still feels like a real conversation. That threshold is unforgiving. Miss it and the product fails regardless of how accurate the model is.

Cost structure is priced per minute of call, not per token batch. At 4M+ calls per year, the difference between an expensive pipeline and an efficient one is not a rounding error. It is a business model question.

State management adds a third constraint. A voice call is a session with mid-sentence interruptions, human handovers, integration events, and network failures. Maintaining coherent state across that surface is an engineering problem that demo environments do not expose.

The discipline is real. The corpus is intentionally light on it.

## Why the corpus is sparse

The under-share here is deliberate - and worth naming directly, because the absence can look like ignorance if you do not know the reason.

Publishing craft specifics from a live enterprise voice AI platform carries disclosure risk: customer data, production stack details, NPS numbers tied to specific deployments. So the LinkedIn surface is thin by design. A March 2024 passing mention. A September 2025 production-stack reply. A case study on agamarora.com/lab. That is the full public record.

The agamarora.com /lab voice-AI production case study is the independent public anchor: engineering principles from the deployment, written for the personal site rather than the employer platform, with specifics calibrated to what can be named.

This page names what can be named. It does not invent specifics that would require disclosing customer or platform internals.

## Three principles from the field

The September 2025 reply to a production-stack survey (`urn:li:activity:7378427141190799360`) contains more voice-AI engineering specificity than all prior public LinkedIn output combined. Three principles come out of it directly.

**Principle 1: Cloud-first economics at this scale.** Self-hosting LLMs for a production voice pipeline at 4M+ calls per year is not a cost optimization. It is a cost increase with staffing and infrastructure overhead on top. The decision to run 100% cloud LLMs was not a capability compromise - it was the result of working through the math. This inverts the intuition many engineers bring ("self-hosting reduces inference cost"). At enterprise scale, the infrastructure management cost and reliability tail risk outweigh raw inference pricing. The inflection point where self-hosting wins is further out than it looks from a demo environment. The plan to pivot long-term acknowledges that the calculus shifts with volume and capability maturity. It is not a permanent answer.

**Principle 2: Business KPI before tech KPI.** The north star metric is the percentage of cases handled with neutral-to-positive customer NPS. Not TTFT. Not cost per minute. The ordering matters: business metric first, tech KPI second. TTFT and blended cost per minute are real constraints with real thresholds - they exist to enable the business outcome, not to replace it. An engineering team that optimizes TTFT without knowing what case-handling rate constitutes a win has inverted the priority stack. The user experience degradation from misaligned priorities is immediate and audible. Literally audible - this is the domain where "it works in the demo" fails the hardest.

**Principle 3: Abstraction layer choice is a reliability decision.** The interface was 100% MCP and APIs, 0% browser automation. That is not a constraint imposed by the platform. It is a deliberate choice about where complexity lives and who maintains it. Browser automation in a production voice pipeline adds a fragile layer: DOM changes break it, CAPTCHA handling becomes a dependency, headless browser infrastructure adds cost and failure surface. MCP as the abstraction layer keeps the tool-calling surface clean and observable. When something breaks in a voice call flow spanning multiple tool calls, you want the failure in a place you control. Browser automation is not that place. The implication generalizes beyond voice: in any agentic system at production scale, the integration layer choice is a reliability decision first.

## The productive paradox

The largest professional contribution in the corpus by volume - 4M+ calls per year, enterprise deployments, two-plus years of production work - generates almost no LinkedIn output.

[LinkedIn as instrument](/wiki/linkedin-as-instrument/) holds that posting IS the thinking: writing sharpens the thought, distribution is a byproduct of the practice. Voice-ai-craft is the counterexample. Both are true at once. Posting is thinking-out-loud when the topic is safe to think out loud about. When the topic carries disclosure risk, the practice shifts to private.

The 2025-09-29 reply shows the private-to-public pattern at its most concentrated: two-plus years of production work, one field-data comment when a direct question landed on a survey thread. The under-share is not a contradiction of the linkedin-as-instrument thesis. It is the constraint that defines its boundary condition.

## Where to go from here

Three exits, depending on what you came for.

If you want the **production AI context** - the broader field-data lens on why enterprise AI experiments fail and what the 20% that ships looks like - read [enterprise AI reality](/wiki/enterprise-ai-reality/). The 2025-09-29 voice-AI reply appears there as a worked example in the evidence section.

If you want the **craft layer** that explains the MCP-first choice and why abstraction layer matters across agentic systems beyond voice - read [agent-first](/wiki/agent-first/). The "100% MCP + APIs, 0% UI" production deployment is one application of that thesis.

If you want the **full public case study** with engineering principles from the actual deployment - the agamarora.com /lab voice-AI production case study is the independent evidence anchor, written for the personal site and scoped to what can be named publicly.

## Evidence

The corpus surface for this theme is intentionally sparse. Decision 2 (interim-taste-calls) names the under-share as deliberate. What exists:

**2024-03-29 · `urn:li:activity:7179449143407386624`**
Voice-based LLM experimentation for drafting LinkedIn Collaborative Article responses. Hobbyist context, not enterprise. Establishes voice-as-interface on the radar in early E4. No production learning carried here.

**2024-07-04 · `urn:li:activity:7214487241681772545`**
Enterprise voice AI platform role announced. Names the role ("AI Product Manager") and context. No craft specifics. Background evidence that the production voice work begins here.

**2025-2026 · agamarora.com /lab voice-AI production case study**
Public case study on the personal site: production voice AI deployment, engineering principles, independent of the LinkedIn corpus. This is the primary non-LinkedIn public surface for voice-AI craft evidence. (`project.agamarora-com-voice-ai-case-study`)

**2025-09-29 · comment URN tail `7378427141190799360`**
Production-stack reply to an agentic-production survey. The highest-density craft evidence in the corpus: cloud vs on-prem trade-off, MCP vs browser automation choice, business KPI ordering (NPS % of cases handled) before tech KPIs (blended cost per minute, TTFT). This item is the source for all three principles named in "Three principles from the field" above.

Per Decision 2: voice-AI is one example of the production-reality described in `theme.enterprise-ai-reality`. The 2025-09-29 reply appears there as a worked example in the evidence section.
