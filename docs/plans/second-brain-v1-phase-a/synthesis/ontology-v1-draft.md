---
type: Ontology
version: v1-draft-r9
status: pending-taste-pass
sources: [ontology-v0 baseline, R3a projects-tech-lineage, R3b comments-network, R4 belief verdicts, R5 theme refinement, R7 tension edges]
---

# Ontology v1 — DRAFT for Agam taste-pass

---

## Themes (12 + 1 root)

| Slug | Title | Core belief (1 line) | Length target | Voice register | Assigned beliefs | Wiki link |
|---|---|---|---|---|---|---|
| `root.substance-over-hype` | The root disposition: substance over hype | Reduce any hyped category to its substrate, then evaluate | 400-600w | Register 1 (provocation + quiet counterpoint) | substance-over-hype, ico-is-funding-not-product, never-be-smartest-in-room | /wiki/root |
| `agent-first` | Agent-first thesis | Platforms that cannot talk to autonomous agents are already behind | 1200-1500w | Register 1 (manifesto-mode) + Register 4 (craft sub-sections) | agent-first, agent-first-ecosystem-instinct, application-layer-is-where-safety-lives, reversibility-over-consequences, agent-layer-is-threat-surface, prompts-as-engineering-primitive, context-over-prompt, kill-prompting (historical) | /wiki/agent-first |
| `voice-ai-craft` | Voice AI craft — cost, latency, scale | Voice AI is a distinct engineering discipline with its own constraints; the under-share is deliberate | 800-1200w | Register 4 (technical-practitioner numbered precision) | voice-as-enterprise-wedge (ghost), enterprise-ai-production-reality (cross-link) | /wiki/voice-ai-craft |
| `breadth-as-differentiation` | Breadth as differentiation | Breadth differentiates; depth is what makes it matter | 800-1200w | Register 1 (aphorism-then-unpack) + mentor tone in sub-sections | breadth-as-differentiation, breadth-needs-depth | /wiki/breadth-as-differentiation |
| `pm-taste` | PM taste — craft, metaphors, and what a PM actually does | PM work is invisible when done well; it is 99% should-we, and requires taste at every layer | 1000-1500w | Register 1 (metaphor-builder stacked) + Register 4 (data-literacy, NFRs) | pm-is-99-should-we-1-can-we, pm-is-featherless-hat, pm-as-parenting, anti-customization, data-literacy-is-pm-core, build-measure-learn, idea-validation-3-pillars, non-functional-reqs-are-55pct-of-failure, design-thinking-as-speed-tool, strong-opinion-about-no-strong-opinions | /wiki/pm-taste |
| `ai-pm-skillset` | What AI PM actually requires | Application-layer AI fluency is table stakes; frame the problem first, let model selection follow | 1000-1500w | Register 4 (practitioner-manifesto credentialed) | ai-pm-skillset-table-stakes, ai-fluency-required, learn-concepts-not-tools (cross-link), llm-as-voice-extension, its-not-the-model-its-the-problem, tech-as-enabler (historical), design-thinking-as-speed-tool (cross-link) | /wiki/ai-pm-skillset |
| `enterprise-ai-reality` | Enterprise AI reality — ships vs demos | 10 experiments produce 2 production-grade wins; the gap between AI demo and deployment is wider than vendors admit | 800-1200w | Register 4 (field-data authority) + Register 1 (aphorism for moats) | enterprise-ai-production-reality, moats-are-infra-talent-data, data-readiness-is-pipeline-not-corpus, mcp-as-enterprise-primitive (ghost) | /wiki/enterprise-ai-reality |
| `second-brain` | Second brain — structured knowledge for agents | Every future AI session reads the same brain and writes back to it | 1000-1500w | Register 1 (builder-reflection) + technical precision for architecture | second-brain-is-context-layer, self-instrumentation, quantified-self-as-mindfulness, llm-as-voice-extension (cross-list), personal-website-is-present-tense | /wiki/second-brain |
| `spec-first-taste` | Spec first, taste always — the builder trilogy | Spec > Sprint. Taste > Execution. Context > Prompt. The constraint has migrated from execution to deciding | 900-1200w | Register 1 (builder-manifesto) | spec-over-sprint, taste-over-execution, context-over-prompt (cross-list with agent-first), anti-customization (cross-link) | /wiki/spec-first-taste |
| `career-reflection` | Career reflection — IC path, learning compound interest, collaborative growth | IC path is legitimate; learning compounds when you study concepts not tools; collaborative growth beats conquest | 1000-1400w | Register 3 (mentor-mode) + autobiographical disclosures | help-market-flourish, ic-path-legitimacy, learn-concepts-not-tools, certifications-are-collectibles, muscle-memory-over-novelty, two-roles-ahead-framing (peripheral), lead-yourself-first (E1 historical), never-be-smartest-in-room (cross-list) | /wiki/career-reflection |
| `linkedin-as-instrument` | LinkedIn as instrument — the meta-platform game | LinkedIn is a platform to be gamed productively; posting IS the thinking | 800-1000w | Register 1 (meta-aware transparency) | linkedin-as-instrumental-platform, strong-opinion-about-no-strong-opinions (cross-list) | /wiki/linkedin-as-instrument |
| `personal-projects-tinkering` | Personal projects — ship it or it doesn't exist | Ideas are cheap; the prototype is the argument; 52 projects over 10 years | 800-1200w | Register 1 (builder-pride low-boast high-show) | ship-the-prototype, personal-website-is-present-tense, gaming-as-economic-intuition (historical) | /wiki/personal-projects-tinkering |

---

## Beliefs (final inventory after R4 verdicts)

### Tier 1 — Core confirmed beliefs (live in wiki)

| Slug | Statement (1-2 sentences) | Status | Parent theme | Evidence (post count + key dates) | Tier | Tension edges |
|---|---|---|---|---|---|---|
| `belief.agent-first` | Start thinking agent-first — from both building and serving lens; platforms that cannot talk to autonomous agents are behind. | confirmed | agent-first | 11+ posts, 2023-03-24 to 2026-04-23 | 1 | enterprise-ai-reality (rate vs direction), spec-first-taste (craft layer) |
| `belief.agent-first-ecosystem-instinct` | ChatGPT plugins were the first AI marketplace. Early 2023 seed of the serving-lens agent thesis. | confirmed (ancestor seed) | agent-first | 3 rounds, 2023-03-24 | 2 | none |
| `belief.application-layer-is-where-safety-lives` | Agents should be kept away from decision-making unless the decision can be evaluated programmatically; safety is an application problem, not a research problem. | confirmed | agent-first | 2026-01-06 canonical | 2 | reversibility-over-consequences |
| `belief.reversibility-over-consequences` | Decouple tokens from decisions; agents kept from decision-making unless programmatically evaluable; GIT-style reversibility at orchestration layer. | confirmed | agent-first | 2 rounds, 2026-01-06 anchor | 2 | agent-first (deployment vs authorization scope) |
| `belief.agent-layer-is-threat-surface` | The model was not broken, the agent layer was; security vulnerabilities have migrated from model weights to agent orchestration. | confirmed | agent-first | 2 rounds, 2024-06-06 seed, 2025-11-17 confirmation | 2 | application-layer-is-where-safety-lives |
| `belief.prompts-as-engineering-primitive` | Prompts are plumbing inside the agent: guardrails, tool-calling, output parsing. Not user-facing UX. | confirmed | agent-first | 2 rounds, 2025-07-17 | 2 | kill-prompting (supersession arc) |
| `belief.context-over-prompt` | Context > Prompt. Personal and organizational context is the lever; the prompt string is the I/O seam. | confirmed | agent-first + spec-first-taste + second-brain (cross-theme) | 3 rounds, 2026-04-09 | 1 | none |
| `belief.kill-prompting` | We need to kill prompting. (Historical waypoint, overstated verb for correct diagnosis.) Refined by prompts-as-engineering-primitive. | tension (historical waypoint) | agent-first | 4 rounds, 2024-12-24 | 3 | prompts-as-engineering-primitive (supersession arc) |
| `belief.substance-over-hype` | Reduce any hyped category to its substrate, then evaluate. 8-year through-line from blockchain to anti-customization. | confirmed (ROOT DISPOSITION) | root | 3 rounds, 2018-03-06 to 2025-12-04 | 1 | none (it IS the frame) |
| `belief.never-be-smartest-in-room` | Never be the smartest person in the room; if you feel you are, get more people in the room or change the room. | confirmed (co-root) | root + career-reflection (cross-list) | 4 rounds, 2019-07-11 | 1 | none |
| `belief.ico-is-funding-not-product` | Somewhere between blockchain and ICO the product is getting lost. ICO is a fundraising tool, not a product. | confirmed (narrow, load-bearing) | root | 3 rounds, 2018-02-15 | 2 | industry-consensus.ico-is-product |
| `belief.ai-pm-skillset-table-stakes` | AI fluency is table stakes for PMs; the relevant AI-PM archetype is application-layer (using models to unlock growth), not foundation-layer (building models). | confirmed | ai-pm-skillset | 4 rounds, 2023-03-14 anchor | 1 | agent-first (partly unresolved — application-layer vs builder posture) |
| `belief.ai-fluency-required` | Modern jobs will soon require AI tools as fluent as PowerPoint and Excel. | confirmed | ai-pm-skillset | 2023-03-19 | 2 | tech-as-enabler (softening) |
| `belief.learn-concepts-not-tools` | Strive to learn concepts, not tools. Frameworks endure; tools rotate. Be a creator. | confirmed | career-reflection (own sub-page) + ai-pm-skillset (cross-link) | 4 rounds, 2019-12-04 anchor | 1 | none |
| `belief.llm-as-voice-extension` | The LLM is bound into Agam's workflow as cognitive substrate — not a tool picked up and put down, but a co-processor that extends his thinking surface. | confirmed | ai-pm-skillset (operational) + second-brain (architectural, cross-list) | 3 rounds, 2023-03-01 | 2 | none |
| `belief.its-not-the-model-its-the-problem` | Frame the business problem first; let model selection follow. | confirmed | ai-pm-skillset | 2 rounds, 2021-07-14 | 2 | none |
| `belief.enterprise-ai-production-reality` | 10 experiments produce 2 production-grade wins. Building for demo vs production is a different beast. | confirmed | enterprise-ai-reality | 5 rounds (strongest multi-round), 2024-09-04 anchor | 1 | agent-first (rate vs direction — resolved by scope-difference) |
| `belief.moats-are-infra-talent-data` | The three durable enterprise AI moats are infrastructure, talent, and data. The model is not on the list. | confirmed | enterprise-ai-reality | 2 rounds, 2024-12-04 | 2 | industry-consensus.more-data-wins |
| `belief.data-readiness-is-pipeline-not-corpus` | AI-ready data means continuous collection and transformation systems, not just a large historical corpus. | confirmed | enterprise-ai-reality | 2024-06-07 Collab seed + R4 | 2 | none |
| `belief.second-brain-is-context-layer` | All of us know the power of a personal context layer. Every future AI session reads the same brain and writes back to it. | confirmed | second-brain | 4 rounds, 2026-04-23 canonical | 1 | ai-pm-skillset (llm-as-voice-extension placement — context not contradiction) |
| `belief.self-instrumentation` | Retrospection is a real powerful tool. Observable patterns and personal apparatus as leverage. | confirmed | second-brain (trunk) | 4 rounds, 2018-05-28 earliest | 1 | none |
| `belief.quantified-self-as-mindfulness` | It isn't the tool, it's the habit of being mindful with time. Observable self-patterns as insight source. | confirmed | second-brain | 3 rounds, 2020-02-20 | 2 | none |
| `belief.personal-website-is-present-tense` | You are a brand, and you should have your own nameplate. After 12 years of procrastination, ship it. | confirmed | personal-projects-tinkering + second-brain | 2 rounds, 2023-04-16 | 2 | none |
| `belief.spec-over-sprint` | Spec > Sprint. When you have specced every pixel, a generative tool gives you a worse version of what you already decided. | confirmed | spec-first-taste | 3 rounds, 2026-04-09 canonical | 1 | ship-fast (superseded) + personal-projects-tinkering (temporal evolution) |
| `belief.taste-over-execution` | Taste > Execution. In an AI era that commoditizes execution, the bottleneck and differentiator is taste. | confirmed | spec-first-taste | 3 rounds, 2026-04-09 | 1 | none |
| `belief.anti-customization` | Extremely opinionated against customization settings in products. Each one signals a design decision deferred to the user. | confirmed | pm-taste (primary) + spec-first-taste (cross-link) | 3 rounds, 2025-12-04 | 1 | industry-consensus.configurability-is-feature |
| `belief.pm-is-99-should-we-1-can-we` | PM is the grind of answering 99 "should we?" to get to that 1 "can we?" — that 1 is disruption, the rest is food. | confirmed | pm-taste | 5 rounds, 2022-06-03 anchor | 1 | none |
| `belief.pm-is-featherless-hat` | Product management is a featherless hat — omnipresent yet indistinguishable if done properly. | confirmed | pm-taste | 3 rounds, 2021-09-22 | 2 | none |
| `belief.pm-as-parenting` | Building a product is like raising a child — make tough decisions, protect from distortion. | confirmed | pm-taste | 3 rounds, 2021-07-12 | 2 | none |
| `belief.data-literacy-is-pm-core` | Correlation is not causation. Measurement discipline as PM fundamental. | confirmed | pm-taste (primary) + ai-pm-skillset (cross-link) | 4 rounds, 2022-05-17 umbrella anchor | 2 | none |
| `belief.build-measure-learn` | Lean Startup loop as PM operating principle. Smallest feature set, measure, iterate. | confirmed | pm-taste (floor) | 3 rounds, 2016-01-04 earliest | 2 | none |
| `belief.idea-validation-3-pillars` | Value, Consumers, Scalability — three-pillar validation frame for new ideas. | confirmed | pm-taste | 2 rounds, 2020-07-04 | 2 | none |
| `belief.non-functional-reqs-are-55pct-of-failure` | Non-functional requirements are not tick boxes but primary PM work. (55% Standish figure — pending taste-pass verification.) | confirmed (seed elevated) | pm-taste | 2024-03-08 Collab anchor | 3 | industry-consensus.model-quality-is-bottleneck |
| `belief.design-thinking-as-speed-tool` | Design thinking is stakeholder alignment and diverse feedback, not UI/UX first. In AI context: Jupyter notebook + paper wireframe as the feedback loop. | confirmed | pm-taste + ai-pm-skillset (cross-link) | 2024-05-24 Collab | 3 | none |
| `belief.strong-opinion-about-no-strong-opinions` | I have a very strong opinion about having no strong opinions. Paradox-as-voice. | tension (HOLD — productively unresolved) | pm-taste (cross-list) + linkedin-as-instrument | 3 rounds, 2021-12-12 | 2 | ~30 strongly-opinionated E3-E4 takes (productive paradox) |
| `belief.help-market-flourish` | Go increase the size of the pie if you want a bigger share. Collaborative-growth over zero-sum. | confirmed | career-reflection | 3 rounds, 2017-09-14 origin | 1 | none |
| `belief.ic-path-legitimacy` | Individual Contributor path is a valid career arc. People management is critical but not for everyone. | confirmed | career-reflection | 2 rounds, 2021-10-30 | 2 | people-management-is-endgame (superseded) |
| `belief.certifications-are-collectibles` | Certifications fuel personal achievement but do not validate competence. Peer-voted badges acceptable; exam-gated certs rejected. | confirmed (tension resolved) | career-reflection | 2 rounds, 2024-11-15 canonical | 2 | linkedin-top-voice-badges (resolved via peer-voted vs exam-gated distinction) |
| `belief.muscle-memory-over-novelty` | Deliberate practice via repetition of frameworks (re-watch, re-read) over novelty. | confirmed (seed elevated) | career-reflection | 2025-12-26 Doshi anchor | 3 | none |
| `belief.linkedin-as-instrumental-platform` | LinkedIn is a platform to be gamed productively. Learn the mechanics, play inside them, stay honest about what the mechanics are. | confirmed | linkedin-as-instrument | 5 rounds, 2017-01-20 seed to 2024-07-04 | 1 | none |
| `belief.ship-the-prototype` | Build to validate; don't just conceptualize. The prototype is the argument. | confirmed | personal-projects-tinkering | 5 rounds, 2020-05-19 canonical | 1 | spec-over-sprint (temporal evolution: ship-fast superseded by spec-first) |
| `belief.breadth-as-differentiation` | Breadth of knowledge across domains is a professional differentiator. | confirmed | breadth-as-differentiation | R2 theme-level, 18+ posts E1-E4 | 1 | none |
| `belief.breadth-needs-depth` | If your breadth has no depth, you are what one could call a Human-GPT. Choose your niche and invest. | confirmed | breadth-as-differentiation (sub-page) | 3 rounds, 2024-04-12 anchor | 1 | none |

### Tier 2 — Peripheral / historical / seed beliefs (graph nodes, not wiki nav)

| Slug | Status | Disposition |
|---|---|---|
| `belief.ai-is-the-next-wave` | peripheral (historical ancestor) | theme.ai-pm-skillset origin node |
| `belief.tech-as-enabler` | peripheral (softened, not superseded) | theme.ai-pm-skillset historical note |
| `belief.gaming-as-economic-intuition` | peripheral | theme.personal-projects-tinkering historical |
| `belief.lead-yourself-first` | peripheral (E1) | theme.career-reflection historical |
| `belief.two-roles-ahead-framing` | peripheral (scope-constrained, taste-pass decision) | theme.career-reflection peripheral |
| `belief.agent-first-ecosystem-instinct` | core (ancestor seed) | theme.agent-first lineage |
| `belief.mcp-as-enterprise-primitive` | ghost (resume-grounded only) | theme.enterprise-ai-reality ghost annotation |
| `belief.voice-as-enterprise-wedge` | ghost (intentional under-share) | theme.voice-ai-craft ghost annotation |

### Beliefs DROPPED from graph (after R4 + R5)

| Slug | Reason | Disposition |
|---|---|---|
| `belief.silence-precedes-crystallization` | R4 REFINE/DEMOTE: Decision 5 binding + weak evidence (2 positive, 7 counter-cases) | Re-home as wiki narrative footnote in second-brain "How it formed" |
| `belief.outcome-billing-over-hourly` | R4 DEMOTE: single-surface, never restated in 12 years | Heuristic status only |
| `belief.tinker-publicly` | R4 MERGE: content absorbed into ship-the-prototype + linkedin-as-instrument | Slug retired |
| `belief.named-citation-as-confidence-marker` | External behavioral observation, not a belief Agam holds | Re-home as style signal in voice-spec |
| `belief.value-viability-usability-triad` | R4 DEMOTE: single-surface, subsumed into idea-validation-3-pillars | Heuristic status, mention as AI-context refinement edge |

### Superseded beliefs (kept in graph as historical)

| Slug | Superseded by | Date superseded |
|---|---|---|
| `belief.dominate-dont-compete` | `belief.help-market-flourish` | 2017-09-14 |
| `belief.ideas-are-enough` | `belief.ship-the-prototype` | 2020-05-19 |
| `belief.personal-website-is-future-tense` | `belief.personal-website-is-present-tense` | 2023-04-16 |
| `belief.horizontal-ai-will-scale` | `belief.agent-first` | 2025-06-20 |
| `belief.prompt-engineering-as-skill` | `belief.kill-prompting` then `belief.prompts-as-engineering-primitive` + `belief.context-over-prompt` | 2024-12-24, 2026-04-09 |
| `belief.ship-fast` | `belief.spec-over-sprint` | 2026-04-09 |
| `belief.people-management-is-endgame` (implicit family-default) | `belief.ic-path-legitimacy` | 2021-10-30 |

---

## Projects (52 total — R3a complete list)

Key milestone projects for wiki narrative (see projects-tech-lineage.md for full 52-project DAG):

| Slug | Name | Year | Status | Tech stack (key) | Lineage parent | Beliefs evidenced |
|---|---|---|---|---|---|---|
| `project.v2-games` | V2 Games India | 2016 | archived | Unity3D, C# | none | gaming-as-economic-intuition, ship-the-prototype |
| `project.flow-live` | Flow.live blockchain pivot | 2018 | archived | Solidity, ReactJS | v2-games | ico-is-funding-not-product, substance-over-hype |
| `project.toggl-quantified-self` | Personal Toggl quantified-self | 2020 | shipped | Toggl | none | quantified-self-as-mindfulness, self-instrumentation |
| `project.flutter-dart-prototyping` | Flutter/Dart cross-platform prototyping | 2020 | shipped | Flutter, Dart | none | ship-the-prototype |
| `project.fareye-analyze` | FarEye ANALYZE flagship data product | 2020 | shipped | enterprise data platform | none | enterprise-ai-production-reality, build-measure-learn |
| `project.chatgpt-pm-stack` | Personal ChatGPT-as-PM-copilot stack | 2023 | shipped | Python, Jupyter, SQL, GitHub Copilot | toggl-quantified-self | llm-as-voice-extension, ai-pm-skillset-table-stakes |
| `project.agamarora-com-v1` | agamarora.com v1 (Streamlit) | 2023 | archived | Python, Streamlit | flutter-dart-prototyping | personal-website-is-present-tense, ship-the-prototype |
| `project.agamarora-com-v2` | agamarora.com v2 (vanilla HTML/CSS/JS) | 2024 | live | HTML, CSS, JavaScript, Netlify | agamarora-com-v1 | personal-website-is-present-tense, spec-over-sprint |
| `project.ollama-keyboard-shortcut` | Local Ollama + LLaMA3 keyboard shortcut | 2024 | shipped | Python, Ollama | chatgpt-pm-stack | agent-first, llm-as-voice-extension |
| `project.crewai-agentic-system` | CrewAI / Autogen agentic experiment | 2024 | shipped | CrewAI, Autogen, Groq | ollama-keyboard-shortcut | agent-first, ship-the-prototype |
| `project.llm-comparator` | Groq + Streamlit LLM comparator | 2024 | shipped | Groq, Streamlit, Python | agamarora-com-v1 | ship-the-prototype, agent-first |
| `project.aionos-voice-platform` | AIonOS Voice-AI platform | 2024 | live | Cloud LLMs, MCP, enterprise integrations | fareye-analyze | enterprise-ai-production-reality, voice-as-enterprise-wedge, agent-first |
| `project.aionos-mcp-platform` | AIonOS MCP-first platform | 2024 | live | MCP | aionos-voice-platform | mcp-as-enterprise-primitive, agent-first |
| `project.ai-resume` | AI Resume | 2025 | live | HTML, CSS, JS, Netlify | agamarora-com-v2 | personal-website-is-present-tense, ship-the-prototype |
| `project.shararat-vapi` | Shararat — Vapi Build Challenge | 2025 | shipped | Vapi, voice AI | aionos-voice-platform | ship-the-prototype, agent-first |
| `project.claude-code-resource-monitor` | luna-monitor dashboard | 2026 | shipped | Claude Code, system monitoring | ollama-keyboard-shortcut | ship-the-prototype |
| `project.second-brain-v1` | second-brain v1 — wiki + kg.json + /enter v3 | 2026 | live | Markdown, JSON, HTML, Netlify | chatgpt-pm-stack | second-brain-is-context-layer, self-instrumentation, spec-over-sprint |
| `project.enter-v3` | /enter v3 — immersive AI terminal | 2026 | live | HTML, CSS, JS, Groq SDK, Netlify Functions | chatgpt-pm-stack | second-brain-is-context-layer, llm-as-voice-extension, agent-first |

**Date correction applied:** project.enter-v3 — ontology-v0 had 2023-05-10 as the date (this was a 4-persona-prompt prototype ancestor). Corrected to April 2026 for the live /enter v3 implementation. The 2023-05-10 post is the lineage ancestor, not the current project.

**Note on ghost projects:** aionos-voice-platform, aionos-mcp-platform, aionos-no-code-tagging, aionos-crm-cdp, aionos-15-pocs, aionos-airline-deployment are resume-grounded ghost projects per R3a. Corpus evidence sparse by Decision 2 (intentional under-share). These are listed in the ontology but not foregrounded in wiki narrative.

---

## People (~50+)

### Original ontology-v0 set (19 people)

| Name | Relation | Interaction surface | Beliefs evidenced |
|---|---|---|---|
| Saayan Sarkar | peer / colleague | post-mention (2021-09-27 Absolutdata retrospective) | help-market-flourish |
| Shahbaz Singh | peer / colleague | post-mention (2021-09-27) | help-market-flourish |
| Vamsi Krishna Bhupasamudram | peer / colleague | post-mention (2021-09-27) | none |
| Manas Bhatt | peer / colleague | post-mention (2021-09-27) | none |
| Praveen Yadav | peer / colleague | post-mention (2021-09-27) | none |
| Manish Mittal | peer / colleague | post-mention (2021-09-27) | none |
| Shravan Tickoo | peer / colleague | post-mention (2024-03-28 Collab) | ai-pm-skillset-table-stakes |
| Gautam / Kushal / Gaurav (FarEye founders) | mentor (professional) | post-mention (2024-05-19 farewell) | help-market-flourish |
| Daniel Shapero | public-thinker-cited | post-mention (2024-05-24) | linkedin-as-instrumental-platform |
| Shreyas Doshi | public-thinker-cited | post-mention (2025-12-26) | muscle-memory-over-novelty, learn-concepts-not-tools |
| Adam Conway | public-thinker-cited | post-mention (2026-01-06) | reversibility-over-consequences |
| Nate B Jones | public-thinker-cited | post-mention (2026-01-06) | reversibility-over-consequences |
| Mo Gawdat | public-thinker-cited | post-mention (2024-09-25) | breadth-needs-depth (humanness-as-depth extension) |
| Marc Benioff | public-thinker-cited | post-mention (2024-12-10) | agent-first |
| Seth Godin | public-thinker-cited | post-mention (2024-12-09) | agent-first |
| Grant Cardone | public-thinker-cited | post-mention (2017-09-14 — reaction post) | help-market-flourish (walk-back of dominate-dont-compete) |
| Andrej Karpathy | public-thinker-cited | post-mention (2026-04-21) | second-brain-is-context-layer |
| Milan Dhingra | peer | comment-mention + comment-reply thread (2024-02-11, 2026-03-25) | linkedin-as-instrumental-platform |
| Irfan Warsi | peer (non-authorial re-share — flag) | post-mention (2019-07-04 re-share) | none |

### Net-new people from R3b (35+ from comments-network analysis)

Key people from the comments network (R3b source: comments-network.md):

| Name | Relation | Interaction surface |
|---|---|---|
| Rahul Nair | peer (trusted) | comment — received full litellm/ollama/Groq/openrouter playbook (2026-03-31) |
| Swapnil (surname unclear) | peer (trusted) | comment — received Voice-AI production stack details (2025-09-29) |
| Arnav Chakravarty | peer / friend | comment-thread (warm register, Hindi mode triggered) |
| FarEye colleagues (multiple) | colleagues | farewell post + comment threads (2024-05-19) |
| AIonOS colleagues (multiple) | colleagues | comment threads (2024-2026) |
| Ishant Kathuria | community peer | comment on second-brain launch (2026-04-23) |
| [Additional 25+ from R3b comments-network.md — see that file for complete list] | peer / community | various comment interactions |

**Total people count:** 19 (ontology-v0) + ~35 net-new (R3b) = ~54 people in ontology.

---

## Tech (58 nodes — from R3a projects-tech-lineage)

Key tech nodes by category (see projects-tech-lineage.md for complete 58-item list):

**Languages (8):** Python, R, C#, Java, JavaScript/Node.js, Dart, Solidity, SQL

**Frameworks (9):** Flutter, Unity3D, ReactJS, NodeJS, Spring Boot, Streamlit, PySpark, Pandas, NumPy

**Platforms (12):** Kaggle, Databricks, GitHub Copilot, Groq, Ollama, LiteLLM, OpenRouter, Vapi, Netlify, Streamlit-share, CrewAI, Autogen

**Tools (10):** Jupyter, Toggl, Cursor, Claude Code, ChatGPT (API + interface), Midjourney, Linux (home-lab), GitHub, OpenAI API, Anthropic API

**Models used (10+):** LLaMA3, PHI3, LLaMA-8B, LLaMA-70B, Mixtral 8x7B, Gemma 7B/2-9B, GPT-4, GPT-3.5, Groq-hosted fast inference models, Qwen-32B

**Protocols/Patterns (5+):** MCP (Model Context Protocol), SSE (Server-Sent Events for streaming), REST API design, agentic orchestration patterns, RAG

**Note on `tech.sanskrit`:** flagged by R3a as cultural reference, not a programming language. Excluded from tech inventory.

---

## Edges

### Lineage edges (41 — from R3a, key examples)

```
project.v2-games → builds_on → (none, root project)
project.flow-live → builds_on → project.v2-games
project.agamarora-com-v1 → builds_on → project.flutter-dart-prototyping
project.agamarora-com-v2 → builds_on → project.agamarora-com-v1
project.chatgpt-pm-stack → builds_on → project.toggl-quantified-self
project.ollama-keyboard-shortcut → builds_on → project.chatgpt-pm-stack
project.crewai-agentic-system → builds_on → project.ollama-keyboard-shortcut
project.llm-comparator → builds_on → project.agamarora-com-v1
project.aionos-voice-platform → builds_on → project.fareye-analyze
project.aionos-mcp-platform → builds_on → project.aionos-voice-platform
project.second-brain-v1 → builds_on → project.chatgpt-pm-stack
project.enter-v3 → builds_on → project.chatgpt-pm-stack
project.ai-resume → builds_on → project.agamarora-com-v2
project.shararat-vapi → builds_on → project.aionos-voice-platform
[... 41 total in R3a projects-tech-lineage.md]
```

### Evidence edges (36 — project to belief, from R3a)

```
project.second-brain-v1 → demonstrates → belief.second-brain-is-context-layer
project.second-brain-v1 → demonstrates → belief.spec-over-sprint
project.enter-v3 → demonstrates → belief.agent-first
project.aionos-voice-platform → demonstrates → belief.enterprise-ai-production-reality
project.crewai-agentic-system → demonstrates → belief.agent-first
project.llm-comparator → demonstrates → belief.ship-the-prototype
project.flutter-dart-prototyping → demonstrates → belief.ship-the-prototype
project.toggl-quantified-self → demonstrates → belief.quantified-self-as-mindfulness
project.flow-live → demonstrates → belief.ico-is-funding-not-product
project.chatgpt-pm-stack → demonstrates → belief.llm-as-voice-extension
[... 36 total in R3a projects-tech-lineage.md]
```

### Post-to-belief supports edges (77 in ontology-v0, extended in v1 — key examples)

```
post.2018-03-06 → supports → belief.substance-over-hype
post.2022-06-03 → supports → belief.pm-is-99-should-we-1-can-we
post.2023-03-14 → supports → belief.ai-pm-skillset-table-stakes
post.2024-09-04 → supports → belief.enterprise-ai-production-reality
post.2025-06-20 → supports → belief.agent-first
post.2025-12-04 → supports → belief.anti-customization
post.2026-01-06 → supports → belief.reversibility-over-consequences
post.2026-04-09 → supports → belief.spec-over-sprint
post.2026-04-09 → supports → belief.taste-over-execution
post.2026-04-09 → supports → belief.context-over-prompt
post.2026-04-23 → supports → belief.second-brain-is-context-layer
[... see ontology-v0 for complete 77-edge list]
```

### Supersedes edges (belief evolution arcs)

```
belief.dominate-dont-compete → superseded_by → belief.help-market-flourish (2017-09-14)
belief.ideas-are-enough → superseded_by → belief.ship-the-prototype (2020-05-19)
belief.horizontal-ai-will-scale → superseded_by → belief.agent-first (2025-06-20)
belief.prompt-engineering-as-skill → superseded_by → belief.kill-prompting (2024-12-24)
belief.kill-prompting → refined_by → belief.prompts-as-engineering-primitive (2025-07-17)
belief.ship-fast → superseded_by → belief.spec-over-sprint (2026-04-09)
belief.people-management-is-endgame → superseded_by → belief.ic-path-legitimacy (2021-10-30)
belief.personal-website-is-future-tense → superseded_by → belief.personal-website-is-present-tense (2023-04-16)
```

### Tension-with edges (from R7 §7 cross-link map)

```
theme.agent-first ↔ tension-with ↔ theme.enterprise-ai-reality [genuine contradiction — resolved by scope-difference: direction vs rate]
theme.agent-first ↔ tension-with ↔ theme.spec-first-taste [context-not-contradiction: strategy vs craft vs authorization]
theme.voice-ai-craft ↔ tension-with ↔ theme.linkedin-as-instrument [productive paradox: under-share vs think-out-loud-is-practice]
theme.breadth-as-differentiation ↔ tension-with ↔ theme.career-reflection [context-not-contradiction: WHY vs HOW — different question levels]
theme.pm-taste ↔ tension-with ↔ theme.spec-first-taste [context-not-contradiction: timeless vs AI-era]
theme.pm-taste ↔ tension-with ↔ theme.linkedin-as-instrument [productive paradox: strong-opinion-about-no-strong-opinions cross-listed]
theme.ai-pm-skillset ↔ tension-with ↔ theme.agent-first [genuine contradiction — partly unresolved: application-layer identity vs builder posture]
theme.second-brain ↔ tension-with ↔ theme.ai-pm-skillset [context-not-contradiction: llm-as-voice-extension placement]
theme.spec-first-taste ↔ tension-with ↔ theme.personal-projects-tinkering [genuine contradiction — resolved as temporal evolution: ship-fast to spec-first]
theme.career-reflection ↔ tension-with ↔ theme.ai-pm-skillset [context-not-contradiction: learn-concepts cross-link as learning method]
theme.linkedin-as-instrument ↔ tension-with ↔ theme.voice-ai-craft [productive paradox: posting-as-practice vs principled under-share]
theme.personal-projects-tinkering ↔ tension-with ↔ theme.linkedin-as-instrument [context-not-contradiction: distribution layer resolution]
```

### Achievement edges

```
achievement.linkedin-top-voice-pm → earned_through → surface.collab-articles-pm
achievement.linkedin-top-voice-ai → earned_through → surface.collab-articles-ai
achievement.linkedin-top-voice-pm → demonstrates → belief.linkedin-as-instrumental-platform
achievement.linkedin-top-voice-ai → demonstrates → belief.linkedin-as-instrumental-platform
achievement.linkedin-top-voice-pm → evidences → belief.ai-pm-skillset-table-stakes
achievement.linkedin-top-voice-ai → evidences → belief.ai-pm-skillset-table-stakes
```

---

## Date corrections applied

- **project.enter-v3:** ontology-v0 had 2023-05-10 (the 4-persona-prompt proto-ancestor). Corrected to April 2026 for the live /enter v3 implementation per R3a finding. The 2023 post is now properly listed as lineage ancestor, not the project itself.
- **project.interior-design-2017:** excluded per Decision 1 (Agam call: "That was a few-month phase"). No project node, no ontology citation, no evidence edge.

---

## Counts

| Entity | v0 | v1 |
|---|---|---|
| Themes | 13 (proposed) | 12 + 1 root |
| Beliefs | ~40 proposed | 44 (28 core, 8 peripheral, 5 dropped, 7 superseded-historical) |
| Projects | 14 | 52 |
| People | ~19 | ~54 (~19 original + ~35 net-new from R3b) |
| Tech | ~15 (implicit) | 58 |
| Edges (total) | 77 post-to-belief | 77 post-to-belief + 41 lineage + 36 demonstrates + 12 tension-with + 8 supersedes + 6 achievement = ~180+ |

---

*Draft for Agam taste-pass. Not final. Task #8 (ontology lock) follows taste-pass.*
