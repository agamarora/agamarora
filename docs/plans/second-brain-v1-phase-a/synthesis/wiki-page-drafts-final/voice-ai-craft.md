---
type: Theme
slug: voice-ai-craft
title: Voice AI craft — cost, latency, scale
status: draft-r9-polished
length_target: 800-1200
voice_register: 4 (technical-practitioner numbered precision)
positioning: peer_page (confirmed per E1)
evidence_anchor: agamarora.com /lab voice-AI production case study (2025-2026) — public surface independent from LinkedIn corpus
beliefs:
  - belief.voice-as-enterprise-wedge (ghost belief; intentional under-share per Decision 2)
  - belief.enterprise-ai-production-reality (cross-linked anchor)
---

# Voice AI craft — cost, latency, scale

*Era: 2024 to 2026 · 2 corpus posts + 1 production-stack comment · 1 ghost belief + cross-link to enterprise-ai-reality*

---

## Core belief

Voice AI is not a chatbot with audio on top. The engineering constraints are different: latency budgets measured in milliseconds, not seconds; cost structures priced per minute of call, not per token batch; state management that must survive a mid-sentence network hiccup. A production voice system that handles 4M+ calls per year is solving a different set of problems than a demo that impresses a boardroom. The discipline is real. The corpus is intentionally light on it.

The under-share is deliberate. Publishing craft specifics from a live enterprise voice AI platform carries disclosure risk. So what appears publicly is sparse: a passing mention in March 2024, a direct answer to a production-stack survey in September 2025, and a production case study on agamarora.com /lab. The absence on LinkedIn is not ignorance. It is restraint. The agamarora.com surface is the independent public record.

This page names what can be named: three craft principles distilled from the limited public surface, grounded in the 2025-09-29 field reply and the agamarora.com voice-AI case study. Specifics that would require disclosing customer or platform internals stay out.

---

## How it formed

The belief formed on the job, not on LinkedIn.

The public corpus has one pre-platform voice mention: a March 2024 post observing that voice-as-input would help drafting LinkedIn Collaborative Article responses (`urn:li:activity:7179449143407386624`). It is a product-feature observation, not hands-on experimentation. It establishes that voice-as-interface was on the radar early in E4, but carries no production learning.

The craft knowledge accumulated during the enterprise voice AI platform role starting July 2024, in a period with no corresponding LinkedIn post cadence on the topic. That is the field-data window: building, demoing, shipping at enterprise scale, and not writing about it publicly. When a direct production-stack survey asked in September 2025, the reply was specific:

> "Productionised use case: Voice AI with extensive tool calling, state management, human handover and enterprise integrations. 1. 100% cloud LLMs (self-deployment was costly short term with additional staffing and infra requirements). Plan was to pivot long term. 2. 0% automation driven through UI, 100% driven through MCP + APIs. 3. North star metric — business metric (% of cases handled with neutral to positive customer NPS). Tech KPI to optimise for us was achieve a certain blended cost per minute + certain TTFT for the whole voice pipeline (inc API calls)."
> — 2025-09-29 comment-thread reply (`urn:li:activity:7378427141190799360`)

That reply contains more voice-AI engineering specificity than all prior public LinkedIn output combined. Three principles come out of it cleanly.

---

## What it implies

### Principle 1: Cloud-first economics at this scale

Self-hosting LLMs for a production voice pipeline at 4M+ calls per year is not a cost optimization in the short term. It is a cost increase with staffing and infrastructure overhead on top. The decision to run 100% cloud LLMs was not a capability compromise. It was the result of working through the math.

This inverts the intuition many engineers bring to the problem ("self-hosting reduces inference cost"). At enterprise scale, the infra management cost and reliability tail risk matter more than raw inference pricing. The inflection point where self-hosting wins is further out than it looks from a demo environment. The plan to pivot long-term acknowledges that the calculus shifts with volume and capability maturity. It is not a permanent answer.

### Principle 2: Business KPI before tech KPI

The north star metric is the percentage of cases handled with neutral-to-positive customer NPS. Not TTFT. Not cost per minute. Those are tech KPIs: important constraints, not the objective.

The ordering is specific: business metric first, tech KPI second. TTFT and blended cost per minute are real constraints with real thresholds, but they exist to enable the business outcome, not to replace it. An engineering team that optimizes TTFT without knowing what case-handling rate constitutes a win has inverted the priority stack.

This is the same disposition that runs through the broader enterprise-ai-reality belief: the failures are not capability failures, they are alignment-with-business-outcome failures. Voice AI is one domain where that misalignment kills products fast. The user experience degradation is immediate and audible.

### Principle 3: Abstraction layer choice matters

The interface was 100% MCP and APIs, 0% browser automation. That is not a constraint imposed by the platform. It is a deliberate choice about where complexity lives and who maintains it.

Browser automation in a production voice pipeline adds a fragile layer: DOM changes break it, CAPTCHA handling becomes a dependency, headless browser infrastructure adds cost and failure surface. MCP as the abstraction layer keeps the tool-calling surface clean and auditable. When something breaks in a voice call flow that spans tool calls, you want the failure to be in a place you control and can observe. Browser automation is neither.

The implication generalizes beyond voice: in any agentic system at production scale, the choice of integration layer is a reliability decision, not just a capability decision. See [`agent-first`](/wiki/agent-first/) for the broader pattern.

---

## Tension with `linkedin-as-instrument`

The productive paradox sitting at the core of this page is not between voice AI and any adjacent technical belief. It is between voice-ai-craft and [`linkedin-as-instrument`](/wiki/linkedin-as-instrument/).

LinkedIn-as-instrument holds that posting IS the thinking — that writing sharpens the thought, that distribution is a byproduct of the practice. Voice-ai-craft is the counterexample: the largest single professional contribution (4M+ calls/year, enterprise deployments, two-plus years of production work) generates almost no LinkedIn output. The under-share is intentional (Decision 2, binding).

Both are true: posting is thinking-out-loud when the topic is safe to think out loud about. When the topic carries disclosure risk (live enterprise platform, customer NPS, production stack specifics), the practice shifts to private. The paradox names something real about professional voice: you can only think publicly about what you can afford to publish. The voice-ai-craft under-share is not a contradiction of the linkedin-as-instrument thesis; it is the constraint that defines its boundary condition.

The 2025-09-29 reply shows the private-to-public pattern at its most concentrated: two-plus years of production work, one field-data comment when a direct question landed on a survey thread. The framing in the corpus is correct: "The absence is not ignorance. It is restraint."

Secondary cross-link: [`enterprise-ai-reality`](/wiki/enterprise-ai-reality/) — where the production voice AI reply appears as a worked example in the evidence section.

---

## Evidence

The corpus surface for this theme is intentionally sparse. Decision 2 (interim-taste-calls) names the under-share as deliberate. What exists:

**2024-03-29 · `urn:li:activity:7179449143407386624`**
Voice-based LLM experimentation for drafting LinkedIn Collaborative Article responses. Hobbyist context, not enterprise. Establishes voice-as-interface on the radar in early E4. No production learning carried here.

**2024-07-04 · `urn:li:activity:7214487241681772545`**
Enterprise voice AI platform role announced. Names the role ("AI Product Manager") and context. No craft specifics. Background evidence that the production voice work begins here.

**2025-2026 · agamarora.com /lab voice-AI production case study**
Public case study on the personal site: production voice AI deployment, engineering principles, independent of the LinkedIn corpus. This is the primary non-LinkedIn public surface for voice-AI craft evidence. (`project.agamarora-com-voice-ai-case-study`)

**2025-09-29 · comment URN tail `7378427141190799360`**
Production-stack reply to an agentic-production survey. The highest-density craft evidence in the corpus: cloud vs on-prem trade-off, MCP vs browser automation choice, business KPI ordering (NPS % of cases handled) before tech KPIs (blended cost per minute, TTFT). This item is the source for all three principles named in "What it implies" above.

Per Decision 2: voice-AI is one example of the production-reality described in `theme.enterprise-ai-reality`. The 2025-09-29 reply appears there as a worked example in the evidence section. Cross-link: [`enterprise-ai-reality`](/wiki/enterprise-ai-reality/).

---

Structural note: this page is confirmed as a peer wiki theme (not satellite to enterprise-ai-reality) per E1. The agamarora.com /lab voice-AI case study is the public evidence anchor that sustains peer status independent of the thin LinkedIn corpus.

Primary tension cross-link: [`linkedin-as-instrument`](/wiki/linkedin-as-instrument/) — productive paradox: under-share on LinkedIn vs richer public surface on agamarora.com case study. Secondary cross-link: [`enterprise-ai-reality`](/wiki/enterprise-ai-reality/) — production AI realities exemplified.

---

*Polished: taste-pass decisions applied 2026-04-26.*
