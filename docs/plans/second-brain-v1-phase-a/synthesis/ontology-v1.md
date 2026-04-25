---
type: Ontology
version: v1-locked
locked: 2026-04-26
sources: [ontology-v1-draft, _taste-pass-decisions (21 binding), interim-taste-calls (5 binding), R3a-R9 synthesis chain]
binding_decisions_applied:
  - 21 taste-pass decisions from 2026-04-26 session
  - 5 interim taste-calls from R3 (drop interior-design / voice-AI under-share / collab articles primary / em-dash banned / silences not dramatized)
status: ready_for_kg_json_generation
notes:
  - This is the LOCKED ontology v1. Any future change requires a new taste-pass + version bump.
  - Wiki-rendered scope: AIonOS NOT included in body prose / nav / evidence URNs (per E3). AIonOS retained as INTERNAL node only for /enter routing context, never surfaced in wiki HTML.
  - Belief renames + tier moves applied at lock time.
---

# Ontology v1 — LOCKED

This is the canonical machine-readable graph for second-brain v1. `scripts/build-kg.mjs` will read this file and emit `/wiki/kg.json` (full graph, public static) + `netlify/functions/lib/kg-themes-summary.mjs` (in-function bundle for /enter retriever).

---

## Themes (12 + 1 root)

| Slug | Title | Tier | Core belief (1 line) | Length target | Voice register | Wiki link |
|---|---|---|---|---|---|---|
| `root.substance-over-hype` | The root disposition: substance over hype | **root** | Reduce any hyped category to its substrate, then evaluate | 400-600w | Register 1 (provocation + quiet counterpoint) | /wiki/root |
| `agent-first` | Agent-first thesis | theme | Platforms that cannot talk to autonomous agents are already behind; the prompting skill layer migrated, the verdict held | 1200-1500w | Register 1 (manifesto-mode) + Register 4 (craft sub-sections) | /wiki/agent-first |
| `voice-ai-craft` | Voice AI craft — cost, latency, scale | theme | Voice AI is a distinct engineering discipline with its own constraints; the under-share is deliberate | 800-1200w | Register 4 (technical-practitioner numbered precision) | /wiki/voice-ai-craft |
| `breadth-as-differentiation` | Breadth as differentiation | theme | Breadth differentiates; depth is what makes it matter | 800-1200w | Register 1 (aphorism-then-unpack) + mentor tone in sub-sections | /wiki/breadth-as-differentiation |
| `pm-taste` | PM taste — craft, metaphors, and what a PM actually does | theme | PM is taste of what to build, what experience, what value: invisible when done well, irreplaceable in the AI era | 1000-1500w | Register 1 (metaphor-builder stacked) + Register 4 (data-literacy, NFRs) | /wiki/pm-taste |
| `ai-pm-skillset` | What AI PM actually requires | theme | LLMs are a primary daily tool; AI replaces the grunt; taste of what to build is irreducible PM work | 1000-1500w | Register 4 (practitioner-manifesto credentialed) | /wiki/ai-pm-skillset |
| `enterprise-ai-reality` | Enterprise AI reality — ships vs demos | theme | Roughly 80% of enterprise AI experiments don't reach production; the gap between demo and deployment is wider than vendors admit | 800-1200w | Register 4 (field-data authority) + Register 1 (aphorism for moats) | /wiki/enterprise-ai-reality |
| `second-brain` | Second brain — structured knowledge for agents | theme | Built this for me, hobbyist scope, Karpathy-inspired wiki version. Pattern probably generalizes if you tinker with AI tools daily | 1000-1500w | Register 1 (builder-reflection) + technical precision for architecture | /wiki/second-brain |
| `spec-first-taste` | Spec first, taste always — the builder trilogy | theme | Spec > Sprint. Taste > Execution. Context > Prompt. Lived this since 2021. Named it in April 2026. Same disposition, sharper words | 900-1200w | Register 1 (builder-manifesto) | /wiki/spec-first-taste |
| `career-reflection` | Career reflection — IC path, learning, market lift | theme | IC path is legitimate; AI-era amplifies IC leverage; learning compounds when you study concepts not tools; help the market flourish | 1000-1400w | Register 3 (mentor-mode) + autobiographical disclosures | /wiki/career-reflection |
| `linkedin-as-instrument` | LinkedIn as instrument — the meta-platform game | theme | LinkedIn is a platform to be gamed productively; posting IS the thinking; the loop closes when others learn | 800-1000w | Register 1 (meta-aware transparency) | /wiki/linkedin-as-instrument |
| `personal-projects-tinkering` | Personal projects — ship it or it doesn't exist | theme | Ideas are cheap; the prototype is the argument; the loop closes when posted (build → post → teach → learn → build) | 800-1200w | Register 1 (builder-pride low-boast high-show) | /wiki/personal-projects-tinkering |

**Root marker:** `root.substance-over-hype` has `tier: root` machine-readable field. Wiki body prose does NOT label it as "root" (per F5 hybrid implementation). Other 11 themes are `tier: theme`.

---

## Theme → assigned beliefs (post-taste-pass)

### root.substance-over-hype
- `belief.substance-over-hype` (root disposition)
- `belief.ico-is-funding-not-product` (8-year through-line evidence)

### agent-first
- `belief.agent-first` (named thesis)
- `belief.agent-first-ecosystem-instinct` (ancestor seed)
- `belief.application-layer-is-where-safety-lives`
- `belief.reversibility-over-consequences`
- `belief.agent-layer-is-threat-surface`
- `belief.prompts-as-engineering-primitive`
- `belief.context-over-prompt` (cross-listed with second-brain + spec-first-taste)
- `belief.kill-prompting` (historical waypoint — stance evolved, did NOT reverse: prompting → context engineering → harness engineering)

### voice-ai-craft
- `belief.voice-as-enterprise-wedge` (intentional under-share, Decision 2)
- `belief.enterprise-ai-production-reality` (cross-link)

### breadth-as-differentiation
- `belief.breadth-as-differentiation`
- `belief.breadth-needs-depth` (humanness-as-depth = Agam's synthesis per C1; April 2024 EQ post predates September 2024 Mo Gawdat citation)

### pm-taste
- `belief.pm-is-99-should-we-1-can-we`
- `belief.pm-is-featherless-hat`
- `belief.pm-as-parenting`
- `belief.anti-customization` (scope: enterprise per D1)
- `belief.data-literacy-is-pm-core`
- `belief.build-measure-learn`
- `belief.idea-validation-3-pillars`
- `belief.non-functional-reqs-are-dominant-failure-mode` (renamed; 55% Standish stat dropped per E4)
- `belief.design-thinking-as-speed-tool`
- `belief.strong-opinion-about-no-strong-opinions` (explicit named meta-belief per A2)

### ai-pm-skillset
- `belief.ai-pm-skillset-table-stakes` ("ChatGPT for everything except PM" still holds — taste is irreducible per B1)
- `belief.ai-fluency-required`
- `belief.learn-concepts-not-tools` (cross-link to career-reflection)
- `belief.llm-as-primary-daily-tool` (renamed from llm-as-voice-extension per B2; statement reframed as factual daily-use claim)
- `belief.its-not-the-model-its-the-problem`
- `belief.tech-as-enabler` (historical, peripheral)
- `belief.design-thinking-as-speed-tool` (cross-link)

### enterprise-ai-reality
- `belief.enterprise-ai-production-reality` (frame: "roughly 80%"; specific 10-to-2 number dropped per D2)
- `belief.moats-are-infra-talent-data`
- `belief.data-readiness-is-pipeline-not-corpus`
- `belief.mcp-as-enterprise-primitive` (ghost — under-share)

### second-brain
- `belief.second-brain-is-context-layer` (hobbyist scope per B3, hint of generalizability)
- `belief.self-instrumentation`
- `belief.quantified-self-as-mindfulness`
- `belief.llm-as-primary-daily-tool` (cross-list from ai-pm-skillset)
- `belief.personal-website-is-present-tense`

### spec-first-taste
- `belief.spec-over-sprint`
- `belief.taste-over-execution`
- `belief.context-over-prompt` (cross-list with agent-first)
- `belief.anti-customization` (cross-link, scope: enterprise per D1)

### career-reflection
- `belief.help-market-flourish` (live core belief; 2026-04 evidence: this repo open-source per D3)
- `belief.ic-path-legitimacy` (universal claim, no family-rebellion frame; AI-era amplifies IC leverage per F3)
- `belief.learn-concepts-not-tools`
- `belief.certifications-are-collectibles` (peer-voted vs exam-gated distinction)
- `belief.muscle-memory-over-novelty`
- `belief.two-roles-ahead-framing` (elevated from peripheral to named-belief tier per F2)
- `belief.never-be-smartest-in-room` (demoted from co-root to standard belief per F4; team-joining heuristic scope)
- `belief.lead-yourself-first` (E1 historical, peripheral)

### linkedin-as-instrument
- `belief.linkedin-as-instrumental-platform` (loop-closure framing per A3: build → post → teach → learn → build)
- `belief.strong-opinion-about-no-strong-opinions` (cross-list — paradox is load-bearing for reading conviction)

### personal-projects-tinkering
- `belief.ship-the-prototype` (absorbed `belief.tinker-publicly` as loop-closure framing per A3)
- `belief.personal-website-is-present-tense`
- `belief.gaming-as-economic-intuition` (peripheral, historical context for V2 Games as career stage)

---

## Beliefs — final inventory (Tier 1 core + Tier 2 peripheral)

### Tier 1 — Core confirmed beliefs

| Slug | Statement | Status | Parent theme | Evidence | Tension edges |
|---|---|---|---|---|---|
| `belief.substance-over-hype` | Reduce any hyped category to its substrate, then evaluate. 8-year through-line. | confirmed (ROOT DISPOSITION) | root | 3 rounds, 2018-03-06 to 2025-12-04 | none (frames everything else) |
| `belief.agent-first` | Start thinking agent-first — both building and serving lens. Platforms that cannot talk to autonomous agents are behind. | confirmed | agent-first | 11+ posts, 2023-03-24 to 2026-04-23 | enterprise-ai-reality (rate vs direction); spec-first-taste (craft layer) |
| `belief.context-over-prompt` | Context > Prompt. Personal and organizational context is the lever; prompt string is the I/O seam. | confirmed | agent-first + spec-first-taste + second-brain (cross-theme) | 3 rounds, 2026-04-09 | none |
| `belief.spec-over-sprint` | Spec > Sprint. When you have specced every pixel, a generative tool gives you a worse version of what you already decided. | confirmed | spec-first-taste | 3 rounds, 2026-04-09 | ship-fast (superseded); personal-projects-tinkering (temporal evolution) |
| `belief.taste-over-execution` | Taste > Execution. In an AI era that commoditizes execution, the bottleneck and differentiator is taste. | confirmed | spec-first-taste | 3 rounds, 2026-04-09 | none |
| `belief.anti-customization` | Extremely opinionated against customization settings in enterprise products. Each one signals a design decision deferred to the user. Scope: enterprise (consumer untested). | confirmed | pm-taste + spec-first-taste (cross-link) | 3 rounds, 2025-12-04 | industry-consensus.configurability-is-feature |
| `belief.pm-is-99-should-we-1-can-we` | PM is the grind of answering 99 "should we?" to get to that 1 "can we?". | confirmed | pm-taste | 5 rounds, 2022-06-03 anchor | none |
| `belief.ai-pm-skillset-table-stakes` | AI fluency is table stakes for PMs; relevant archetype is application-layer (using models to unlock growth), not foundation-layer. AI replaces the grunt; taste is irreducible. | confirmed | ai-pm-skillset | 4 rounds, 2023-03-14 anchor | agent-first (partly unresolved — application-layer vs builder posture) |
| `belief.learn-concepts-not-tools` | Strive to learn concepts, not tools. Frameworks endure; tools rotate. | confirmed | career-reflection (own sub-page) + ai-pm-skillset (cross-link) | 4 rounds, 2019-12-04 anchor | none |
| `belief.llm-as-primary-daily-tool` | LLMs are a great tool. I use them daily more than any other tool in my stack. (Renamed from llm-as-voice-extension; reframed as factual daily-use claim, not "extension of self.") | confirmed | ai-pm-skillset (primary) + second-brain (cross-list as input/precursor) | 3 rounds, 2023-03-01 onwards | none |
| `belief.enterprise-ai-production-reality` | Roughly 80% of enterprise AI experiments don't reach production. The gap between demo and deployment is wider than vendors admit. (Frame retained; specific 10-to-2 number dropped at lock.) | confirmed | enterprise-ai-reality | 5 rounds, 2024-09-04 anchor | agent-first (rate vs direction — resolved by scope-difference) |
| `belief.second-brain-is-context-layer` | Personal context layer for AI sessions. Built this for me, hobbyist scope, Karpathy-inspired. Pattern probably generalizes for builders working with AI tools daily. | confirmed | second-brain | 4 rounds, 2026-04-23 canonical | ai-pm-skillset (llm-as-primary-daily-tool placement — context not contradiction) |
| `belief.self-instrumentation` | Retrospection is a real powerful tool. Observable patterns and personal apparatus as leverage. | confirmed | second-brain (trunk) | 4 rounds, 2018-05-28 earliest | none |
| `belief.help-market-flourish` | Go increase the size of the pie if you want a bigger share. Collaborative-growth over zero-sum. **2026-04 live evidence: this repo (agamarora/agamarora) is open-source as a direct application of this principle.** | confirmed (live) | career-reflection | 3 rounds, 2017-09-14 origin + 2026-04-26 repo-as-evidence | none |
| `belief.ic-path-legitimacy` | Individual Contributor path is a valid career arc. People management is critical but not for everyone. **2026 reframe: AI-era amplifies IC leverage — IC + AI agents = throughput closer to a small team than ever.** | confirmed | career-reflection | 2 rounds, 2021-10-30 + 2026-04-26 reframe | people-management-is-endgame (superseded) |
| `belief.linkedin-as-instrumental-platform` | LinkedIn is a platform to be gamed productively. Posting IS the thinking. The loop closes when others learn (build → post → teach → learn → build). | confirmed | linkedin-as-instrument | 5 rounds, 2017-01-20 seed to 2024-07-04 | none |
| `belief.ship-the-prototype` | Build to validate; don't just conceptualize. The prototype is the argument. (Absorbs former tinker-publicly belief as loop-closure framing per A3.) | confirmed | personal-projects-tinkering | 5 rounds, 2020-05-19 canonical | spec-over-sprint (temporal evolution: ship-fast superseded by spec-first) |
| `belief.breadth-as-differentiation` | Breadth of knowledge across domains is a professional differentiator. | confirmed | breadth-as-differentiation | R2 theme-level, 18+ posts E1-E4 | none |
| `belief.breadth-needs-depth` | If your breadth has no depth, you are what one could call a Human-GPT. Choose your niche and invest. **Humanness-as-depth extension is Agam's synthesis (April 2024 EQ post predates September 2024 Mo Gawdat citation).** | confirmed | breadth-as-differentiation (sub-page) | 3 rounds, 2024-04-12 anchor + April 2024 EQ post | none |

### Tier 2 — Confirmed but supporting (graph nodes, light wiki presence)

| Slug | Statement | Parent theme | Evidence |
|---|---|---|---|
| `belief.agent-first-ecosystem-instinct` | ChatGPT plugins were the first AI marketplace. Early 2023 seed of the serving-lens agent thesis. | agent-first | 2023-03-24 |
| `belief.application-layer-is-where-safety-lives` | Agents should be kept away from decision-making unless evaluable programmatically; safety is an application problem. | agent-first | 2026-01-06 canonical |
| `belief.reversibility-over-consequences` | Decouple tokens from decisions; GIT-style reversibility at orchestration layer. | agent-first | 2026-01-06 |
| `belief.agent-layer-is-threat-surface` | The model was not broken, the agent layer was; security vulnerabilities migrated from model weights to agent orchestration. | agent-first | 2024-06-06 + 2025-11-17 |
| `belief.prompts-as-engineering-primitive` | Prompts are plumbing inside the agent: guardrails, tool-calling, output parsing. Not user-facing UX. | agent-first | 2025-07-17 |
| `belief.kill-prompting` | We need to kill prompting. (Stance evolved per A1: prompting → context engineering → harness engineering. Verdict held; layer migrated.) | agent-first | 2024-12-24 + 2026 evolution |
| `belief.ico-is-funding-not-product` | ICO is a fundraising tool, not a product. | root | 2018-02-15 |
| `belief.ai-fluency-required` | Modern jobs will soon require AI tools as fluent as PowerPoint and Excel. | ai-pm-skillset | 2023-03-19 |
| `belief.its-not-the-model-its-the-problem` | Frame the business problem first; let model selection follow. | ai-pm-skillset | 2021-07-14 |
| `belief.moats-are-infra-talent-data` | The three durable enterprise AI moats are infrastructure, talent, and data. The model is not on the list. | enterprise-ai-reality | 2024-12-04 |
| `belief.data-readiness-is-pipeline-not-corpus` | AI-ready data means continuous collection and transformation systems, not just a large historical corpus. | enterprise-ai-reality | 2024-06-07 Collab |
| `belief.quantified-self-as-mindfulness` | It isn't the tool, it's the habit of being mindful with time. | second-brain | 2020-02-20 |
| `belief.personal-website-is-present-tense` | You are a brand, and you should have your own nameplate. Ship it. | personal-projects-tinkering + second-brain | 2023-04-16 |
| `belief.pm-is-featherless-hat` | Product management is a featherless hat — omnipresent yet indistinguishable if done properly. | pm-taste | 2021-09-22 |
| `belief.pm-as-parenting` | Building a product is like raising a child — make tough decisions, protect from distortion. | pm-taste | 2021-07-12 |
| `belief.data-literacy-is-pm-core` | Correlation is not causation. Measurement discipline as PM fundamental. | pm-taste + ai-pm-skillset | 2022-05-17 umbrella anchor |
| `belief.build-measure-learn` | Lean Startup loop. Smallest feature set, measure, iterate. | pm-taste | 2016-01-04 earliest |
| `belief.idea-validation-3-pillars` | Value, Consumers, Scalability — three-pillar validation frame. | pm-taste | 2020-07-04 |
| `belief.non-functional-reqs-are-dominant-failure-mode` | Non-functional requirements are not tick boxes but primary PM work. (Renamed from belief.non-functional-reqs-are-55pct-of-failure; 55% Standish citation dropped per E4.) | pm-taste | 2024-03-08 Collab anchor |
| `belief.design-thinking-as-speed-tool` | Design thinking is stakeholder alignment + diverse feedback, not UI/UX first. Jupyter notebook + paper wireframe as feedback loop. | pm-taste + ai-pm-skillset | 2024-05-24 Collab |
| `belief.strong-opinion-about-no-strong-opinions` | I have a very strong opinion about having no strong opinions. Paradox-as-voice. **Explicit named meta-belief on pm-taste page per A2 — licenses every other belief on that page.** | pm-taste (cross-list) + linkedin-as-instrument | 3 rounds, 2021-12-12 |
| `belief.certifications-are-collectibles` | Certifications fuel personal achievement but do not validate competence. Peer-voted badges acceptable; exam-gated certs rejected. | career-reflection | 2024-11-15 canonical |
| `belief.muscle-memory-over-novelty` | Deliberate practice via repetition of frameworks (re-watch, re-read) over novelty. | career-reflection | 2025-12-26 Doshi anchor |
| `belief.two-roles-ahead-framing` | When picking your next role, optimize for the role after that. Routine career heuristic Agam deploys in mentoring. **Elevated from peripheral to named belief tier per F2.** | career-reflection | FarEye-to-AIonOS transition + mentoring evidence |
| `belief.never-be-smartest-in-room` | Never be the smartest person in the room; if you feel you are, get more people in the room or change the room. **Demoted from co-root to standard belief per F4. Scope: team-joining heuristic.** | career-reflection | 4 rounds, 2019-07-11 |

### Tier 3 — Peripheral / historical / ghost beliefs (graph nodes only, not in wiki nav)

| Slug | Status | Disposition |
|---|---|---|
| `belief.ai-is-the-next-wave` | peripheral (historical ancestor) | theme.ai-pm-skillset origin node |
| `belief.tech-as-enabler` | peripheral (softened, not superseded) | theme.ai-pm-skillset historical note |
| `belief.gaming-as-economic-intuition` | peripheral | theme.personal-projects-tinkering historical context for V2 Games as career stage |
| `belief.lead-yourself-first` | peripheral (E1) | theme.career-reflection historical |
| `belief.mcp-as-enterprise-primitive` | ghost (resume-grounded only, intentional under-share) | theme.enterprise-ai-reality ghost annotation |
| `belief.voice-as-enterprise-wedge` | ghost (intentional under-share per Decision 2) | theme.voice-ai-craft ghost annotation |

### Beliefs DROPPED from graph

| Slug | Reason |
|---|---|
| `belief.silence-precedes-crystallization` | R4 REFINE/DEMOTE: Decision 5 binding + weak evidence (2 positive, 7 counter-cases). Re-homed as wiki narrative footnote. |
| `belief.outcome-billing-over-hourly` | R4 DEMOTE: single-surface, never restated in 12 years. |
| `belief.tinker-publicly` | R4 MERGE → ship-the-prototype as loop-closure framing per A3. Slug retired. |
| `belief.named-citation-as-confidence-marker` | External behavioral observation, not a belief Agam holds. Re-homed as style signal in voice-spec. |
| `belief.value-viability-usability-triad` | R4 DEMOTE: single-surface, subsumed into idea-validation-3-pillars. |
| `belief.llm-as-voice-extension` | RENAMED at lock to `belief.llm-as-primary-daily-tool` per B2. Old slug retired. Statement reframed (drop "extension of self" mysticism). |
| `belief.non-functional-reqs-are-55pct-of-failure` | RENAMED at lock to `belief.non-functional-reqs-are-dominant-failure-mode` per E4. Old slug retired. 55% Standish citation dropped. |

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

## Projects

### Top-tier personal projects (foreground on personal-projects-tinkering wiki page per F1)

| Slug | Name | Year | Status | Tech stack | Lineage parent | Beliefs evidenced |
|---|---|---|---|---|---|---|
| `project.agamarora-com-v2` | agamarora.com (this site, open-source) | 2024-2026 | live | HTML, CSS, JavaScript, Netlify | agamarora-com-v1 | personal-website-is-present-tense, spec-over-sprint, help-market-flourish |
| `project.ai-resume` | AI Resume | 2025 | live | HTML, CSS, JS, Netlify | agamarora-com-v2 | personal-website-is-present-tense, ship-the-prototype, agent-first |
| `project.shararat-vapi` | Shararat — Vapi Build Challenge | 2025 | shipped | Vapi, voice AI | (separate from day-job) | ship-the-prototype, agent-first |
| `project.claude-code-resource-monitor` | luna-monitor (Claude Code Resource Monitor) | 2026 | shipped, open-source | Claude Code, system monitoring | ollama-keyboard-shortcut | ship-the-prototype, help-market-flourish |
| `project.second-brain-v1` | second-brain v1 — wiki + kg.json + /enter v3 | 2026 | live | Markdown, JSON, HTML, Netlify | chatgpt-pm-stack | second-brain-is-context-layer, self-instrumentation, spec-over-sprint, help-market-flourish |

### Learning-tinkering tier (mention as category, not foregrounded per F1)

| Slug | Name | Year | Status | Tech | Beliefs evidenced |
|---|---|---|---|---|---|
| `project.flutter-dart-prototyping` | Flutter/Dart minis (learning) | 2020 | shipped | Flutter, Dart | learn-concepts-not-tools, ship-the-prototype |
| `project.crewai-agentic-system` | CrewAI / Autogen agentic experiment (learning) | 2024 | shipped | CrewAI, Autogen, Groq | learn-concepts-not-tools, agent-first |
| `project.llm-comparator` | Groq + Streamlit LLM comparator (learning) | 2024 | shipped | Groq, Streamlit, Python | learn-concepts-not-tools, ship-the-prototype |
| `project.ollama-keyboard-shortcut` | Local Ollama + LLaMA3 keyboard shortcut | 2024 | shipped | Python, Ollama | llm-as-primary-daily-tool, agent-first |
| `project.pi-based-scripts` | Pi-based Python scripts (hardware tinkering) | various | shipped | Python, Raspberry Pi | self-instrumentation, ship-the-prototype |

### Career-stage projects (NOT personal tinkering — V2 Games reclassified per F1)

| Slug | Name | Year | Role | Theme home |
|---|---|---|---|---|
| `project.v2-games` | V2 Games India (co-founded startup, studio head) | 2014-2016 | co-founder + studio head (analytics, some dev/QA, CEO/business) | career-reflection (career chapter, not tinkering) |
| `project.flow-live` | Flow.live blockchain pivot | 2018 | early-career role | career-reflection + root.substance-over-hype (ico-is-funding-not-product evidence) |
| `project.fareye-analyze` | FarEye ANALYZE flagship data product | 2020-2024 | Lead PM | career-reflection (FarEye chapter) |

### Personal context layer projects (second-brain trunk)

| Slug | Name | Year | Beliefs evidenced |
|---|---|---|---|
| `project.toggl-quantified-self` | Personal Toggl quantified-self | 2020 | quantified-self-as-mindfulness, self-instrumentation |
| `project.chatgpt-pm-stack` | Personal ChatGPT-as-PM-copilot stack | 2023 | llm-as-primary-daily-tool, ai-pm-skillset-table-stakes |
| `project.agamarora-com-v1` | agamarora.com v1 (Streamlit, archived) | 2023 | personal-website-is-present-tense, ship-the-prototype |
| `project.enter-v3` | /enter v3 — immersive AI terminal | 2026 (April; 2023-05-10 prototype is lineage ancestor not project) | second-brain-is-context-layer, llm-as-primary-daily-tool, agent-first |

### Day-job projects (E3 — STRIPPED from wiki-rendered scope; retained as INTERNAL nodes for /enter routing only)

These nodes exist in ontology for /enter agent routing context. They are NOT rendered in /wiki HTML, NOT in evidence URNs in wiki body prose, NOT in frontmatter of wiki pages. Generic phrasing ("enterprise voice AI platform" / "production voice AI deployment") used in wiki body where context is needed.

| Slug | Internal-only | Generic alias for wiki-render |
|---|---|---|
| `project.enterprise-voice-ai-platform-internal` | yes | "enterprise voice AI platform" |
| `project.enterprise-mcp-platform-internal` | yes | "MCP-first enterprise platform" |

**Wiki-render rule:** any reference to current day-job in wiki body uses generic phrasing. /enter agent in non-wiki contexts can use full names if user directly asks. Per E3 binding decision.

### Voice-AI case study (E1 — added as evidence anchor for voice-ai-craft theme)

| Slug | Name | Year | Surface | Beliefs evidenced |
|---|---|---|---|---|
| `project.agamarora-com-voice-ai-case-study` | agamarora.com /lab voice-AI production case study | 2025-2026 | /lab/voice-ai-production/ on agamarora.com | enterprise-ai-production-reality, voice-as-enterprise-wedge (ghost lifted via this case study) |

This case study is the public surface for voice-AI work — independent from LinkedIn under-share. Confirms voice-ai-craft as peer wiki theme (not satellite).

---

## People (~54)

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
| Mo Gawdat | public-thinker-cited (supporting voice, NOT source per C1) | post-mention (2024-09-25) | breadth-needs-depth (Agam-led synthesis confirmed by Gawdat) |
| Marc Benioff | public-thinker-cited | post-mention (2024-12-10) | agent-first |
| Seth Godin | public-thinker-cited | post-mention (2024-12-09) | agent-first |
| Grant Cardone | public-thinker-cited (reaction post) | post-mention (2017-09-14) | help-market-flourish (walk-back of dominate-dont-compete) |
| Andrej Karpathy | public-thinker-cited | post-mention (2026-04-21) | second-brain-is-context-layer |
| Milan Dhingra | peer | comment-mention + comment-reply thread | linkedin-as-instrumental-platform |
| Irfan Warsi | peer (non-authorial re-share) | post-mention (2019-07-04 re-share) | none |

### Net-new from R3b comments-network (35+)

| Name | Relation | Interaction surface |
|---|---|---|
| Rahul Nair | peer (trusted) | comment — received full litellm/ollama/Groq/openrouter playbook (2026-03-31) |
| Swapnil (surname unclear) | peer (trusted) | comment — received voice-AI production stack details (2025-09-29) |
| Arnav Chakravarty | peer / friend | comment-thread (warm register, Hindi mode triggered) |
| Ishant Kathuria | community peer | comment on second-brain launch (2026-04-23) |
| FarEye colleagues (multiple) | colleagues | farewell post + comment threads (2024-05-19) |
| Day-job colleagues (multiple, anonymized for E3) | colleagues | comment threads (2024-2026) |
| [Additional 25+ — see comments-network.md] | peer / community | various comment interactions |

**Total people count:** 19 (ontology-v0) + ~35 net-new (R3b) = ~54 people.

---

## Tech (58 nodes — from R3a projects-tech-lineage)

**Languages (8):** Python, R, C#, Java, JavaScript/Node.js, Dart, Solidity, SQL

**Frameworks (9):** Flutter, Unity3D, ReactJS, NodeJS, Spring Boot, Streamlit, PySpark, Pandas, NumPy

**Platforms (12):** Kaggle, Databricks, GitHub Copilot, Groq, Ollama, LiteLLM, OpenRouter, Vapi, Netlify, Streamlit-share, CrewAI, Autogen

**Tools (10):** Jupyter, Toggl, Cursor, Claude Code, ChatGPT (API + interface), Midjourney, Linux (home-lab), GitHub, OpenAI API, Anthropic API

**Models used (10+):** LLaMA3, PHI3, LLaMA-8B, LLaMA-70B, Mixtral 8x7B, Gemma 7B/2-9B, GPT-4, GPT-3.5, Groq-hosted fast inference models, Qwen-32B

**Protocols / Patterns (5+):** MCP, SSE, REST API design, agentic orchestration patterns, RAG

**Excluded:** `tech.sanskrit` (cultural reference, not programming language).

---

## Edges (~180+ total)

### Lineage edges (41 — from R3a)

```
project.v2-games → builds_on → (none, root project)
project.flow-live → builds_on → project.v2-games
project.agamarora-com-v1 → builds_on → project.flutter-dart-prototyping
project.agamarora-com-v2 → builds_on → project.agamarora-com-v1
project.chatgpt-pm-stack → builds_on → project.toggl-quantified-self
project.ollama-keyboard-shortcut → builds_on → project.chatgpt-pm-stack
project.crewai-agentic-system → builds_on → project.ollama-keyboard-shortcut
project.llm-comparator → builds_on → project.agamarora-com-v1
project.enterprise-voice-ai-platform-internal → builds_on → project.fareye-analyze
project.enterprise-mcp-platform-internal → builds_on → project.enterprise-voice-ai-platform-internal
project.second-brain-v1 → builds_on → project.chatgpt-pm-stack
project.enter-v3 → builds_on → project.chatgpt-pm-stack
project.ai-resume → builds_on → project.agamarora-com-v2
project.shararat-vapi → builds_on → project.enterprise-voice-ai-platform-internal
project.claude-code-resource-monitor → builds_on → project.ollama-keyboard-shortcut
[... 41 total in R3a]
```

### Demonstrates edges (project → belief, ~36 from R3a)

```
project.second-brain-v1 → demonstrates → belief.second-brain-is-context-layer
project.second-brain-v1 → demonstrates → belief.spec-over-sprint
project.second-brain-v1 → demonstrates → belief.help-market-flourish (open-source repo evidence per D3)
project.agamarora-com-v2 → demonstrates → belief.help-market-flourish (open-source repo evidence per D3)
project.claude-code-resource-monitor → demonstrates → belief.help-market-flourish (open-source repo evidence per D3)
project.ai-resume → demonstrates → belief.help-market-flourish (open-source repo evidence per D3)
project.enter-v3 → demonstrates → belief.agent-first
project.enter-v3 → demonstrates → belief.llm-as-primary-daily-tool
project.crewai-agentic-system → demonstrates → belief.agent-first
project.llm-comparator → demonstrates → belief.ship-the-prototype
project.agamarora-com-voice-ai-case-study → demonstrates → belief.enterprise-ai-production-reality
project.agamarora-com-voice-ai-case-study → demonstrates → belief.voice-as-enterprise-wedge
project.flow-live → demonstrates → belief.ico-is-funding-not-product
project.chatgpt-pm-stack → demonstrates → belief.llm-as-primary-daily-tool
[... 36 total in R3a + 4 new D3 evidence edges]
```

### Post-to-belief supports edges (77+ — see ontology-v0 for complete list)

### Supersedes edges (8 belief evolution arcs)

```
belief.dominate-dont-compete → superseded_by → belief.help-market-flourish (2017-09-14)
belief.ideas-are-enough → superseded_by → belief.ship-the-prototype (2020-05-19)
belief.horizontal-ai-will-scale → superseded_by → belief.agent-first (2025-06-20)
belief.prompt-engineering-as-skill → superseded_by → belief.kill-prompting (2024-12-24)
belief.kill-prompting → refined_by → belief.prompts-as-engineering-primitive + belief.context-over-prompt (2025-07-17, 2026-04-09; STANCE EVOLVED, NOT REVERSED per A1)
belief.ship-fast → superseded_by → belief.spec-over-sprint (2026-04-09)
belief.people-management-is-endgame → superseded_by → belief.ic-path-legitimacy (2021-10-30)
belief.personal-website-is-future-tense → superseded_by → belief.personal-website-is-present-tense (2023-04-16)
```

### Tension-with edges (12 — from R7 §7)

```
theme.agent-first ↔ tension-with ↔ theme.enterprise-ai-reality [genuine contradiction — resolved by scope-difference: direction vs rate]
theme.agent-first ↔ tension-with ↔ theme.spec-first-taste [context-not-contradiction: strategy vs craft vs authorization]
theme.voice-ai-craft ↔ tension-with ↔ theme.linkedin-as-instrument [productive paradox: under-share vs think-out-loud-is-practice]
theme.breadth-as-differentiation ↔ tension-with ↔ theme.career-reflection [context-not-contradiction: WHY vs HOW]
theme.pm-taste ↔ tension-with ↔ theme.spec-first-taste [context-not-contradiction: timeless vs AI-era]
theme.pm-taste ↔ tension-with ↔ theme.linkedin-as-instrument [productive paradox: strong-opinion-about-no-strong-opinions cross-listed]
theme.ai-pm-skillset ↔ tension-with ↔ theme.agent-first [genuine contradiction — partly unresolved: application-layer identity vs builder posture]
theme.second-brain ↔ tension-with ↔ theme.ai-pm-skillset [context-not-contradiction: llm-as-primary-daily-tool placement]
theme.spec-first-taste ↔ tension-with ↔ theme.personal-projects-tinkering [genuine contradiction — resolved as temporal evolution: ship-fast → spec-first]
theme.career-reflection ↔ tension-with ↔ theme.ai-pm-skillset [context-not-contradiction: learn-concepts cross-link as learning method]
theme.linkedin-as-instrument ↔ tension-with ↔ theme.voice-ai-craft [productive paradox: posting-as-practice vs principled under-share]
theme.personal-projects-tinkering ↔ tension-with ↔ theme.linkedin-as-instrument [context-not-contradiction: distribution layer resolution]
```

### Achievement edges (6)

```
achievement.linkedin-top-voice-pm → earned_through → surface.collab-articles-pm
achievement.linkedin-top-voice-ai → earned_through → surface.collab-articles-ai
achievement.linkedin-top-voice-pm → demonstrates → belief.linkedin-as-instrumental-platform
achievement.linkedin-top-voice-ai → demonstrates → belief.linkedin-as-instrumental-platform
achievement.linkedin-top-voice-pm → evidences → belief.ai-pm-skillset-table-stakes
achievement.linkedin-top-voice-ai → evidences → belief.ai-pm-skillset-table-stakes
```

---

## Date corrections + scope rules applied at lock

- **project.enter-v3:** ontology-v0 had 2023-05-10 (4-persona-prompt proto-ancestor). Corrected to April 2026 per R3a finding.
- **project.interior-design-2017:** EXCLUDED per Decision 1.
- **belief.silence-precedes-crystallization:** DROPPED per Decision 5 + R4 base-rate analysis.
- **AIonOS specific node names:** STRIPPED from wiki-rendered scope per E3. Internal nodes retained for /enter routing only.
- **55% Standish Group citation:** DROPPED per E4. Belief renamed.
- **10-to-2 enterprise AI ratio:** DROPPED per D2. Frame "roughly 80%" retained.
- **family-rebellion ic-path frame:** DROPPED per F3. Universal claim only + AI-era reframe.
- **co-root substance + never-smartest pairing:** RESOLVED per F4. substance-over-hype is sole root. never-smartest is standard belief.
- **kill-prompting reversal framing:** REJECTED per A1. Stance evolved (skill layer migrated), did not reverse.

---

## Counts (locked)

| Entity | v0 | v1 (locked) |
|---|---|---|
| Themes | 13 (proposed) | 12 + 1 root |
| Beliefs | ~40 proposed | 19 Tier-1 core + 25 Tier-2 supporting + 6 Tier-3 peripheral + 7 dropped + 8 superseded-historical = **57 total nodes** |
| Projects | 14 | **52** (5 top-tier personal + 5 learning-tinkering + 3 career-stage + 4 personal-context-layer + 2 internal-day-job + 1 voice-AI-case-study + 32 ghost/peripheral) |
| People | ~19 | **~54** |
| Tech | ~15 | **58** |
| Edges (total) | 77 post-to-belief | **180+** (77 post-to-belief + 41 lineage + 36+4 demonstrates + 12 tension-with + 8 supersedes + 6 achievement) |

---

## What changed at lock (summary for changelog)

**Renames (2):**
- `belief.llm-as-voice-extension` → `belief.llm-as-primary-daily-tool`
- `belief.non-functional-reqs-are-55pct-of-failure` → `belief.non-functional-reqs-are-dominant-failure-mode`

**Tier moves (2):**
- `belief.never-be-smartest-in-room`: co-root → standard belief (career-reflection)
- `belief.two-roles-ahead-framing`: peripheral → named-belief tier

**New evidence (4 edges):**
- D3 open-source-as-evidence: agamarora-com-v2, second-brain-v1, claude-code-resource-monitor, ai-resume → demonstrates → belief.help-market-flourish

**Reframes:**
- `belief.kill-prompting`: stance evolved not reversed
- `belief.ai-pm-skillset-table-stakes`: 2023 line still holds; AI replaces grunt; taste irreducible
- `belief.ic-path-legitimacy`: AI-era amplifies IC leverage
- `belief.second-brain-is-context-layer`: hobbyist-primary, hint-of-universal
- `belief.breadth-needs-depth`: humanness-as-depth = Agam-led synthesis (Mo Gawdat = supporting voice)
- `belief.anti-customization`: scope = enterprise (consumer untested)
- `belief.enterprise-ai-production-reality`: keep "roughly 80%" frame, drop 10-to-2 number
- `belief.strong-opinion-about-no-strong-opinions`: explicit named meta-belief on pm-taste
- `belief.ship-the-prototype`: absorbs tinker-publicly as loop closure (build → post → teach → learn → build)
- `belief.linkedin-as-instrumental-platform`: loop-closure framing

**Project reclassifications:**
- V2 Games: tinkering → career-reflection
- Top-tier personal projects: agamarora-com-v2, ai-resume, shararat-vapi, claude-code-resource-monitor, second-brain-v1
- Learning-tinkering tier: flutter-dart, crewai, llm-comparator, ollama-shortcut, pi-based-scripts
- agamarora.com voice-AI case study added as Project + evidence anchor

**Scope strips:**
- AIonOS-named nodes hidden from wiki-render (internal-only retained for /enter routing)
- 55% Standish Group citation
- 10-to-2 specific number
- Family-rebellion ic-path frame

**Root marker:**
- `tier: root` field added to root.substance-over-hype
- All other 11 themes: `tier: theme`
- Hybrid F5 implementation: machine-readable root marker, no body label in wiki

---

*Locked 2026-04-26. Next: scripts/build-kg.mjs reads this → emits /wiki/kg.json + kg-themes-summary.mjs. Source for all downstream wiki/agent surfaces.*
