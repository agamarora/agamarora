# ontology-v0.md

Generated 2026-04-24. Schema per spec §3 (`docs/plans/second-brain-v1.md`).
Draft for Agam taste-pass → Task #8 ontology v1 lock.

---

## Themes (proposed v1 — Agam reviews)

| ID | Label | Slug | Era focus | Post count | Notes vs locked |
|---|---|---|---|---|---|
| theme.agent-first-thesis | Agent-First Thesis | agent-first-thesis | E4 (with E3b seeds) | 11 | SPLIT from locked `agent-first` |
| theme.agent-first-craft | Agent-First Craft | agent-first-craft | E4 | 7 | SPLIT from locked `agent-first` |
| theme.voice-ai | Voice AI | voice-ai | E4 | 2 | RENAME from `voice-ai-craft`; GHOST flag (resume-grounded) |
| theme.breadth-as-differentiation | Breadth as Differentiation | breadth-as-differentiation | E2-E4 | 18 | KEEP-AS-IS |
| theme.pm-taste | PM Taste | pm-taste | all eras (strongest E3-E4) | 37 | KEEP-AS-IS |
| theme.career-reflection | Career Reflection & Transitions | career-reflection | all eras | 28 | RENAME from `early-career` |
| theme.thinking-in-writing-aphorism | Thinking in Writing: Aphorism | thinking-in-writing-aphorism | all eras | ~35 | SPLIT from locked `thinking-in-writing` |
| theme.thinking-in-writing-essay | Thinking in Writing: Essay | thinking-in-writing-essay | E3a-E4 | ~21 | SPLIT from locked `thinking-in-writing` |
| theme.ai-pm-skillset | AI-PM Skillset | ai-pm-skillset | E3b-E4 (ancestor E1) | 24 | KEEP; note E3b origin |
| theme.enterprise-ai-reality | Enterprise AI Reality | enterprise-ai-reality | E4 (seeds E3) | 13 | KEEP (with ai-safety split) |
| theme.ai-safety-governance | AI Safety & Governance | ai-safety-governance | E4 | 5 | NEW (split from enterprise-ai-reality) |
| theme.second-brain | Second Brain | second-brain | E4 shipped; seeds E2-E3 | 9 | KEEP; note E2 seeds |
| theme.humor-wit | Humor & Wit | humor-wit | all eras | 34 | KEEP-AS-IS |
| theme.stoicism-dharma | Stoicism & Dharma | stoicism-dharma | E3a, echoes E4 | 7 | NEW |
| theme.personal-projects-tinkering | Personal Projects / Tinkering | personal-projects | E3-E4 | 9 | NEW |
| theme.spec-first-taste | Spec-First / Taste-Over-Execution | spec-first-taste | E4b | 3 | NEW (optional; tightly scoped but load-bearing) |
| theme.post-agi-speculation | Post-AGI Speculation | post-agi-speculation | E4 | 4 | NEW (optional) |
| theme.grind-ethos | Grind Ethos | grind-ethos | E2-E3a | 8 | NEW (optional — may be deprecated voice) |

**Dimension (not a theme node):**
| dim.anti-hype | Anti-Hype stance | anti-hype | cross-era | ~10 | Boolean attribute on posts |

---

## Beliefs (proposed)

| ID | Label | First-appearance date | Era | Supersedes? |
|---|---|---|---|---|
| belief.lead-yourself-first | "Leadership is not motivating your team, but yourself" | 2017-12-22 | E1 | none |
| belief.ai-is-the-next-wave | "Decision Management + ML platforms are the hottest AI tech" (ancestor of ai-pm-skillset) | 2017-12-21 | E1 | none |
| belief.linkedin-as-instrumental-platform | "LinkedIn is a platform to be gamed" | 2017-01-20 | E1 | none |
| belief.build-measure-learn | Lean Startup / MVP-first | 2016-01-04 | E1 | none |
| belief.dominate-dont-compete | Grant Cardone conquest-framing | 2016-01-02 | E1 | superseded by `belief.help-market-flourish` (2017-09-14) |
| belief.help-market-flourish | Collaborative-growth over zero-sum | 2017-09-14 | E1 | supersedes `belief.dominate-dont-compete` |
| belief.substance-over-hype | "Blockchain is a database innovation first" — ancestor of anti-hype | 2018-03-06 | E2a | none |
| belief.ico-is-funding-not-product | "Between blockchain and ICO the product is getting lost" | 2018-02-15 | E2a | contradicts industry-consensus `ICO-is-product` |
| belief.gaming-as-economic-intuition | "Blockchain = Gamification decentralized" | 2018-02-10 | E2a | none |
| belief.self-instrumentation | Observable-patterns retrospection (proto-second-brain) | 2018-05-28 | E2a | none |
| belief.learn-concepts-not-tools | "Strive to learn concepts, not tools. Be a creater" | 2019-12-04 | E2b | none |
| belief.never-be-smartest-in-room | Root Belief — "If you feel you are, get more people in the room or change the room" | 2019-07-11 | E2b | none |
| belief.quantified-self-as-mindfulness | Toggl + "mindfulness as skill to acquire" | 2020-02-20 | E2c | precursor to `second-brain` thesis |
| belief.ideas-are-enough | "Just an idea!" person is enough | — (E1-E2 implicit) | E2 | superseded by `belief.ship-the-prototype` (2020-05-19) |
| belief.ship-the-prototype | Build to validate, don't just conceptualize | 2020-05-19 | E2c | supersedes `belief.ideas-are-enough` |
| belief.idea-validation-3-pillars | Value / Consumers / Scalability | 2020-07-04 | E2c | refines `belief.build-measure-learn` |
| belief.tech-as-enabler | "Enabler not replacement → faster adoption" | 2021-06-01 | E3a | softened by `belief.ai-fluency-required` (2023-03-19) |
| belief.its-not-the-model-its-the-problem | ML-problem-vs-model | 2021-07-14 | E3a | contextualized by `belief.ai-fluency-required` post-ChatGPT |
| belief.pm-is-featherless-hat | PM omnipresent yet indistinguishable if done properly | 2021-09-22 | E3a | none |
| belief.pm-is-99-should-we-1-can-we | PM is the grind of selection | 2022-06-03 | E3a | none |
| belief.pm-as-parenting | "Building a product is like raising a child" | 2021-07-12 | E3a | none |
| belief.ic-path-legitimacy | Individual Contributor path is a valid career arc | 2021-10-30 | E3a | contradicts family-default `people-management-is-endgame` |
| belief.data-literacy-is-pm-core | "Umbrella-in-the-rain" correlation vs causation | 2022-05-17 | E3a | none |
| belief.strong-opinion-about-no-strong-opinions | Paradox as voice | 2021-12-12 | E3a | TENSION (still held) |
| belief.ai-fluency-required | "Modern jobs will require AI tools as fluent as PowerPoint & Excel" | 2023-03-19 | E3b | softens `belief.tech-as-enabler` |
| belief.llm-as-voice-extension | ChatGPT-wrote-my-testimonial + "tis but an extension" | 2023-03-01 | E3b | precursor to `second-brain` |
| belief.agent-first-ecosystem-instinct | "The very first AI marketplace" (ChatGPT plugins) | 2023-03-24 | E3b | seed of `belief.agent-first` (2024-07+) |
| belief.personal-website-is-present-tense | 12-year procrastination → ship | 2023-04-16 | E3b | supersedes `belief.personal-website-is-future-tense` |
| belief.ai-pm-skillset-table-stakes | "ChatGPT for everything except PM" | 2023-03-14 | E3b | none |
| belief.agent-first | "Agents read before humans" / serving-lens | 2024-07-04 | E4a | supersedes `belief.horizontal-ai-will-scale` (E4a earlier) |
| belief.horizontal-ai-will-scale | Early E4a hope for horizontal AI | — | E4a | superseded by `belief.agent-first` (2025-06-20) |
| belief.kill-prompting | Prompts as deprecated user-facing frame | 2024-12-24 | E4a | supersedes `belief.prompt-engineering-as-skill` |
| belief.prompt-engineering-as-skill | Earlier E3b-E4a frame | 2023-02-23 | E3b | superseded by `belief.kill-prompting` (2024-12-24) |
| belief.prompts-as-engineering-primitive | Prompts are plumbing, not UX | 2025-07-17 | E4b | reframes `belief.kill-prompting` |
| belief.context-over-prompt | "Context > Prompt" | 2026-04-09 | E4b | supersedes `belief.prompt-as-ux` |
| belief.taste-over-execution | "Taste > Execution" | 2026-04-09 | E4b | none |
| belief.spec-over-sprint | "Spec > Sprint" | 2026-04-09 | E4b | supersedes `belief.ship-fast` (E2) |
| belief.ship-fast | Earlier ship-first stance | 2020-05-19 | E2c | superseded by `belief.spec-over-sprint` (E4b) |
| belief.agent-layer-is-threat-surface | Security cluster — prompt injection / Chinese threat actor | 2025-11-17 | E4b | none |
| belief.reversibility-over-consequences | "Decouple tokens from decisions" | 2026-01-06 | E4b | refines `belief.agent-first` |
| belief.enterprise-ai-production-reality | 9 takeaways from GenAI POCs; 10 experiments → 2 production wins | 2024-09-04 | E4a | grounded through 2025-06-20 |
| belief.moats-are-infra-talent-data | 3 enterprise AI moats | 2024-12-04 | E4a | none |
| belief.breadth-needs-depth | "Human-GPT" critique | 2024-04-12 | E4-preamble | refines `belief.breadth-as-differentiation` |
| belief.anti-customization | "Opinionated about adding customization" — day-zero go-live | 2025-12-04 | E4b | refines `belief.pm-taste` |
| belief.certifications-are-collectibles | Anti-credentialism | 2024-11-15 | E4a | TENSION with badge-acceptance |
| belief.second-brain-is-context-layer | External cognitive extension as personal context layer | 2026-04-23 | E4b | extends `belief.self-instrumentation` (E2) |

**Total: ~40 beliefs proposed** (Agam taste-passes; some may merge/cut to a final ~25-30).

---

## Eras (proposed)

| ID | Label | Start | End | Companies | Post count |
|---|---|---|---|---|---|
| era.e1 | Observer → Founder | 2014-09-29 | 2017-12-22 | Absolutdata → V2 Games India | 31 |
| era.e1a (sub) | Observer (pre-V2) | 2014-09 | 2015-12 | Absolutdata | 9 |
| era.e1b (sub) | V2-Games Founder | 2016-01 | 2017-12 | V2 Games India | 22 |
| era.e2 | Transition Era | 2018-01-19 | 2020-12 (FarEye start) | V2 Games / Flow.live → Blossom Kochhar → Freelance | 93 |
| era.e2a (sub) | V2-tail / Flow.live blockchain pivot | 2018-01 | 2018-05 | Flow.live / V2 Games | 22 |
| era.e2b (sub) | Aroma Magic corporate BD | 2018-07 | 2019-12 | Blossom Kochhar / Aroma Magic | 35 |
| era.e2c (sub) | Freelance / pandemic / job-hunt | 2020-01 | 2020-12 | Freelance consulting | 36 |
| era.e3 | FarEye Lead PM | 2020-12 | 2024-05-19 | FarEye Technologies | 85 (+7 Feb-May 2024 FarEye-tail per E3a voice) |
| era.e3a (sub) | Pre-ChatGPT FarEye PM | 2020-12 | 2022-10-09 | FarEye | 67 |
| era.e3b (sub) | AI-PM identity crystallizes (post-ChatGPT) | 2023-02-23 | 2023-11-24 | FarEye | 18 |
| era.e3-tail (sub) | FarEye farewell | 2024-02-11 | 2024-05-19 | FarEye | 7 |
| era.e4 | AIonOS AI-PM | 2024-07-04 | present (2026-04-23) | AIonOS | 61 (was 68; 7 early-2024 reclassified to E3-tail) |
| era.e4a (sub) | AIonOS ramp | 2024-07 | 2025-05 | AIonOS | 35 |
| era.e4b (sub) | Thesis locks in / builder phase | 2025-06 | present | AIonOS | 26 |

---

## Projects, Companies, People mentioned (deduplicated across eras)

### Projects

| ID | Type | Label | First mentioned |
|---|---|---|---|
| project.v2-games | Project | V2 Games India (mobile games studio) | 2016-01-02 |
| project.flow-live | Project | Flow.live (blockchain gaming pivot of V2) | 2018-02-09 |
| project.interior-design-2017 | Project | Interior-design consulting pivot (brother + Agam) | 2017-11-04 |
| project.fareye-analyze | Project | FarEye ANALYZE data product | 2022-01-15 (60M miles post) |
| project.agamarora-com-v1 | Project | agamarora.com v1 (Python + Streamlit) | 2023-04-16 |
| project.llm-comparator | Project | Groq + Streamlit LLM comparator | 2024-09-17 |
| project.crewai-agentic-system | Project | CrewAI / Autogen agentic experiment | 2024-07-24 |
| project.ollama-keyboard-shortcut | Project | Local ollama + LLAMA3/PHI3 keyboard shortcut | 2024-06-05 |
| project.hotel-ai-survey | Project | Hotel-AI survey | 2024-11-28 |
| project.ai-resume | Project | AI Resume (lab project) | (implicit via agamarora.com /lab) |
| project.second-brain | Project | second-brain v1 (wiki + kg + agent) | 2026-04-21 |
| project.enter-v3 | Project | /enter v3 (immersive terminal) | (implicit — Apr 2026 active work) |
| project.claude-code-buddy | Project | Claude Code /buddy (Tamagotchi/Brindle) | 2026-04-16 |
| project.mythos-experiment | Project | Anthropic Mythos $100M red team — note: verify if real or hypothetical | 2026-04-08 |

### Companies

| ID | Type | Label | First mentioned |
|---|---|---|---|
| company.absolutdata | Company | Absolutdata Analytics | 2021-09-27 (retrospective) |
| company.fore-school | Company | FORE School of Management (PGDM Marketing) | (implicit — pre-2014) |
| company.v2-games-india | Company | V2 Games India Pvt. Ltd. | 2016-02-21 |
| company.blossom-kochhar | Company | Blossom Kochhar / Aroma Magic | (implicit 2018-07) |
| company.fareye | Company | FarEye Technologies Pvt. Ltd. | 2021-01-15 (hiring post) |
| company.aionos | Company | AIonOS India Pvt. Ltd. | 2024-07-04 |

### People (named in corpus or resume)

| ID | Type | Label | First mentioned |
|---|---|---|---|
| person.agam-brother | Person | Agam's brother (interior-design-pivot partner, name not in corpus) | 2017-11-04 |
| person.saayan-sarkar | Person | Saayan Sarkar (Absolutdata colleague) | 2021-09-27 |
| person.shahbaz-singh | Person | Shahbaz Singh (Absolutdata colleague) | 2021-09-27 |
| person.vamsi-krishna-bhupasamudram | Person | Vamsi Krishna Bhupasamudram | 2021-09-27 |
| person.manas-bhatt | Person | Manas Bhatt | 2021-09-27 |
| person.praveen-yadav | Person | Praveen Yadav | 2021-09-27 |
| person.manish-mittal | Person | Manish Mittal | 2021-09-27 |
| person.shravan-tickoo | Person | Shravan Tickoo (Bengaluru post) | 2024-03-28 |
| person.fareye-founders | Person(s) | Gautam / Kushal / Gaurav (FarEye founders, farewell post) | 2024-05-19 |
| person.irfan-warsi | Person | Irfan Warsi (re-shared job request, non-authorial — flag) | 2019-07-04 |
| person.daniel-shapero | Person | Daniel Shapero (LinkedIn COO — referenced) | 2024-05-24 |
| person.shreyas-doshi | Person | Shreyas Doshi (PM thinker referenced) | 2025-12-26 |
| person.adam-conway | Person | Adam Conway (referenced re: reversibility) | 2026-01-06 |
| person.nate-b-jones | Person | Nate B Jones (referenced) | 2026-01-06 |
| person.mo-gawdat | Person | Mo Gawdat (post-AGI speculation ref) | 2024-09-25 |
| person.marc-benioff | Person | Marc Benioff (Agentforce/Dreamforce ref) | 2024-12-10 |
| person.seth-godin | Person | Seth Godin (AI-as-electricity ref) | 2024-12-09 |
| person.grant-cardone | Person | Grant Cardone (dominate-dont-compete reaction ref) | 2017-09-14 |
| person.karpathy | Person | Andrej Karpathy (LLM Wiki gist trigger) | 2026-04-21 |

---

## Edges (proposed top ~60, deduplicated across eras)

| From | Rel | To | Source post (date + URN tail) |
|---|---|---|---|
| post.2017-12-22-6349836 | supports | belief.lead-yourself-first | 2017-12-22 / urn:6349836362509848576 |
| post.2017-12-21-6349574 | supports | belief.ai-is-the-next-wave | 2017-12-21 / urn:6349574083381944321 |
| post.2017-09-14-6314056 | contradicts | belief.dominate-dont-compete | 2017-09-14 / urn:6314056957212876800 |
| post.2017-09-14-6314056 | supports | belief.help-market-flourish | 2017-09-14 / urn:6314056957212876800 |
| post.2017-01-20-6228231 | demonstrates | belief.linkedin-as-instrumental-platform | 2017-01-20 / urn:6228231934921797632 |
| post.2016-01-02-6089072 | part_of | project.v2-games | 2016-01-02 / urn:6089072870409908224 |
| post.2016-03-17-6116167 | part_of | project.v2-games | 2016-03-17 / urn:6116167384093970432 |
| post.2016-06-07-6145895 | part_of | project.v2-games | 2016-06-07 / urn:6145895501385560064 |
| post.2017-05-16-6270156 | part_of | project.v2-games | 2017-05-16 / urn:6270156810246815744 |
| post.2017-06-30-6286457 | part_of | project.v2-games | 2017-06-30 / urn:6286457096145825792 |
| post.2017-11-04-6332433 | part_of | project.interior-design-2017 | 2017-11-04 / urn:6332433616697692160 |
| post.2018-02-09-6367632 | part_of | project.flow-live | 2018-02-09 / urn:6367632755261566976 |
| post.2018-03-04-6375987 | part_of | project.flow-live | 2018-03-04 / urn:6375987034745593856 |
| post.2018-03-06-6376849 | supports | belief.substance-over-hype | 2018-03-06 / urn:6376849689375019008 |
| post.2018-02-15-6369983 | contradicts | industry-consensus.ico-is-product | 2018-02-15 / urn:6369983938248699904 |
| post.2018-02-10-6367924 | supports | belief.gaming-as-economic-intuition | 2018-02-10 / urn:6367924728723795968 |
| post.2018-05-28-6406787 | supports | belief.self-instrumentation | 2018-05-28 / urn:6406787198674403328 |
| post.2018-07-12-6423036 | triggered_by | career-transition.v2-to-aroma | 2018-07-12 / urn:6423036084040630272 |
| post.2019-07-11-6555075 | supports | belief.never-be-smartest-in-room | 2019-07-11 / urn:6555075258217521152 |
| post.2019-12-04-6607850 | supports | belief.learn-concepts-not-tools | 2019-12-04 / urn:6607850998486659072 |
| post.2020-02-20-6636234 | supports | belief.quantified-self-as-mindfulness | 2020-02-20 / urn:6636234771276107776 |
| post.2020-02-20-6636234 | precursor_of | project.second-brain | 2020-02-20 / urn:6636234771276107776 |
| post.2020-05-19-6668609 | supersedes | belief.ideas-are-enough | 2020-05-19 / urn:6668609461650784256 |
| post.2020-05-19-6668609 | supports | belief.ship-the-prototype | 2020-05-19 / urn:6668609461650784256 |
| post.2020-07-04-6685080 | supports | belief.idea-validation-3-pillars | 2020-07-04 / urn:6685080724728496129 |
| post.2020-08-11-6698867 | triggered_by | event.covid-layoff | 2020-08-11 / urn:6698867401104076800 |
| post.2020-08-15-6700434 | part_of | career-transition.freelance-to-fareye | 2020-08-15 / urn:6700434744779276288 |
| post.2021-05-25-6802916 | mentions | event.fareye-100m-raise | 2021-05-25 / urn:6802916462320197632 |
| post.2021-06-01-6805501 | supports | belief.tech-as-enabler | 2021-06-01 / urn:6805501857314734080 |
| post.2021-07-11-6819871 | during | role.fareye-lead-pm | 2021-07-11 / urn:6819871608199495680 |
| post.2021-07-12-6820386 | supports | belief.pm-as-parenting | 2021-07-12 / urn:6820386609561661440 |
| post.2021-07-14-6820970 | supports | belief.its-not-the-model-its-the-problem | 2021-07-14 / urn:6820970631484465152 |
| post.2021-09-22-6846280 | supports | belief.pm-is-featherless-hat | 2021-09-22 / urn:6846280835910406144 |
| post.2021-10-30-6860074 | supports | belief.ic-path-legitimacy | 2021-10-30 / urn:6860074002963038208 |
| post.2021-10-30-6860074 | contradicts | belief.people-management-is-endgame | 2021-10-30 / urn:6860074002963038208 |
| post.2021-12-12-6875865 | demonstrates | belief.strong-opinion-about-no-strong-opinions | 2021-12-12 / urn:6875865378761830401 |
| post.2022-01-15-6887981 | during | role.fareye-lead-pm | 2022-01-15 / urn:6887981598361313280 |
| post.2022-05-17-6932147 | supports | belief.data-literacy-is-pm-core | 2022-05-17 / urn:6932147133936480256 |
| post.2022-06-03-6938349 | supports | belief.pm-is-99-should-we-1-can-we | 2022-06-03 / urn:6938349828124921856 |
| post.2023-03-01-7036747 | demonstrates | belief.llm-as-voice-extension | 2023-03-01 / urn:7036747623139028992 |
| post.2023-03-14-7041317 | supports | belief.ai-pm-skillset-table-stakes | 2023-03-14 / urn:7041317366437163008 |
| post.2023-03-14-7041317 | precursor_of | project.second-brain | 2023-03-14 / urn:7041317366437163008 |
| post.2023-03-14-7041317 | triggered_by | event.chatgpt-public-release | 2023-03-14 / urn:7041317366437163008 |
| post.2023-03-19-7043263 | supports | belief.ai-fluency-required | 2023-03-19 / urn:7043263140091899904 |
| post.2023-03-19-7043263 | softens | belief.tech-as-enabler | 2023-03-19 / urn:7043263140091899904 |
| post.2023-03-24-7044971 | demonstrates | belief.agent-first-ecosystem-instinct | 2023-03-24 / urn:7044971627607900160 |
| post.2023-04-16-7053307 | evidenced_by | project.agamarora-com-v1 | 2023-04-16 / urn:7053307873887404032 |
| post.2023-04-16-7053307 | supersedes | belief.personal-website-is-future-tense | 2023-04-16 / urn:7053307873887404032 |
| post.2023-05-10-7062002 | builds_on | project.enter-v3 (proto — 4-persona prompt) | 2023-05-10 / urn:7062002001240367104 |
| post.2024-02-11-7162451 | demonstrates | belief.linkedin-as-instrumental-platform | 2024-02-11 / urn:7162451080759459840 |
| post.2024-04-12-7184395 | supports | belief.breadth-needs-depth | 2024-04-12 / urn:7184395502451400706 |
| post.2024-05-19-7198012 | part_of | company.fareye (farewell) | 2024-05-19 / urn:7198012491551891457 |
| post.2024-06-05-7204134 | evidenced_by | project.ollama-keyboard-shortcut | 2024-06-05 / urn:7204134749513162752 |
| post.2024-06-06-7204325 | supports | belief.agent-layer-is-threat-surface (seed) | 2024-06-06 / urn:7204325913650491392 |
| post.2024-07-04-7214487 | part_of | company.aionos (start marker) | 2024-07-04 / urn:7214487241681772545 |
| post.2024-07-12-7217322 | supports | belief.agent-first | 2024-07-12 / urn:7217322824502267905 |
| post.2024-07-24-7221720 | evidenced_by | project.crewai-agentic-system | 2024-07-24 / urn:7221720797655023616 |
| post.2024-07-26-7222469 | evidenced_by | project.crewai-agentic-system | 2024-07-26 / urn:7222469586212769792 |
| post.2024-09-04-7236941 | supports | belief.enterprise-ai-production-reality | 2024-09-04 / urn:7236941772336066560 |
| post.2024-09-17-7241688 | evidenced_by | project.llm-comparator | 2024-09-17 / urn:7241688287910752257 |
| post.2024-09-19-7242370 | supersedes | belief.prompt-engineering-as-skill (partial) | 2024-09-19 / urn:7242370458749165569 |
| post.2024-12-04-7270067 | supports | belief.moats-are-infra-talent-data | 2024-12-04 / urn:7270067867885150209 |
| post.2024-12-09-7271698 | supports | belief.agent-first | 2024-12-09 / urn:7271698391787560960 |
| post.2024-12-24-7277158 | supports | belief.kill-prompting | 2024-12-24 / urn:7277158028422914048 |
| post.2024-12-24-7277158 | supersedes | belief.prompt-engineering-as-skill | 2024-12-24 / urn:7277158028422914048 |
| post.2025-06-20-7341662 | supports | belief.agent-first | 2025-06-20 / urn:7341662205257433088 |
| post.2025-06-20-7341662 | supersedes | belief.horizontal-ai-will-scale | 2025-06-20 / urn:7341662205257433088 |
| post.2025-07-17-7351602 | demonstrates | belief.prompts-as-engineering-primitive | 2025-07-17 / urn:7351602695977226243 |
| post.2025-11-17-7396047 | supports | belief.agent-layer-is-threat-surface | 2025-11-17 / urn:7396047657951064064 |
| post.2025-12-04-7402319 | supports | belief.anti-customization | 2025-12-04 / urn:7402319253036531712 |
| post.2026-01-06-7414150 | supports | belief.reversibility-over-consequences | 2026-01-06 / urn:7414150680820547584 |
| post.2026-01-06-7414150 | builds_on | belief.agent-layer-is-threat-surface | 2026-01-06 / urn:7414150680820547584 |
| post.2026-04-08-7447489 | mentions | project.mythos-experiment (verify) | 2026-04-08 / urn:7447489181821353984 |
| post.2026-04-09-7447981 | supports | belief.spec-over-sprint | 2026-04-09 / urn:7447981735901949952 |
| post.2026-04-09-7447981 | supports | belief.taste-over-execution | 2026-04-09 / urn:7447981735901949952 |
| post.2026-04-09-7447981 | supports | belief.context-over-prompt | 2026-04-09 / urn:7447981735901949952 |
| post.2026-04-09-7447981 | supersedes | belief.ship-fast | 2026-04-09 / urn:7447981735901949952 |
| post.2026-04-16-7450401 | evidenced_by | project.claude-code-buddy | 2026-04-16 / urn:7450401488146972672 |
| post.2026-04-21-7452296 | evidenced_by | project.second-brain | 2026-04-21 / urn:7452296800352305152 |
| post.2026-04-21-7452296 | triggered_by | external.karpathy-llm-wiki-gist | 2026-04-21 / urn:7452296800352305152 |
| post.2026-04-23-7452998 | evidenced_by | project.second-brain (launch) | 2026-04-23 / urn:7452998640345853952 |
| post.2026-04-23-7452998 | supports | belief.second-brain-is-context-layer | 2026-04-23 / urn:7452998640345853952 |

**Total edges shown: 77.** Full ontology will have ~200-250 edges after per-theme tagging expansion.

---

## Summary stats

- **Themes:** 13 strong candidates + 5 optional + 1 dimension (vs 10 locked) — Agam taste-passes to final ~10-12.
- **Beliefs:** ~40 proposed (Agam taste-passes to ~25-30 final).
- **Eras:** 4 parent + 8 sub-eras documented.
- **Projects:** 14 distinct.
- **Companies:** 6 distinct.
- **People:** 19 named in corpus (more in graph via taste-pass).
- **Edges:** 77 in this draft (~200-250 expected in v1 after full tagging).
- **Posts:** 277 total (31 + 93 + 85 + 68).

**Flagged for Agam attention:**
1. `project.mythos-experiment` (2026-04-08 post) — verify if Anthropic Mythos is real April 2026 reality or hypothetical.
2. `person.irfan-warsi` — 2019-07-04 post is a re-share, not authorial. Exclude from voice samples but keep as graph mention.
3. Voice-AI + MCP ghost themes — require explicit resume-grounding nodes outside corpus.
4. `belief.grind-ethos` (and related theme) — may be a deprecated voice Agam no longer owns; taste-pass decision.
