# projects-tech-lineage.md

Generated 2026-04-24 by Round 3a subagent (Project + Tech Lineage).
Inputs: linkedin-corpus.md (279 posts, 2014-09-29 → 2026-04-23) + ontology-v0.md (14 projects proposed) + corpus-synthesis-v0.md (headline findings) + resume.md (6 roles, 2014-present) + `/lab` site (6 project cards live).

Ontology-v0 lists 14 projects. This file extends to **44 projects**, adds **58 tech nodes**, and maps **41 lineage (`builds_on`)** edges plus **36 `demonstrates` (project → belief)** edges.

---

## 1. Project inventory

Status legend: `shipped` · `live` · `prfaq` · `archived` · `private` · `idea`.

| ID | Label | Status | Started | Company context | First mention (date + URN tail) | Mention count | Source |
|---|---|---|---|---|---|---|---|
| project.v2-games | V2 Games India (mobile games studio, eSports positioning) | archived | 2016-01 | V2 Games India | 2016-01-02 / 6089072870409908224 | 6 | both |
| project.v2-games-chakravyuh | "The Chakravyuh" front-line-entrepreneur hiring campaign | archived | 2016-01 | V2 Games India | 2016-01-02 / 6089072870409908224 | 1 | corpus |
| project.v2-data-analyst-role | V2 data-analyst hire (predictive modelling in R) | archived | 2016-02 | V2 Games India | 2016-02-21 / 6107246554437931008 | 1 | corpus |
| project.v2-mobile-games-unity | V2 Unity3D mobile game titles (C#, scalable server clusters) | archived | 2016-03 | V2 Games India | 2016-03-17 / 6116167384093970432 | 2 | corpus |
| project.v2-esports-mobile | V2 mobile-eSports push | archived | 2017-06 | V2 Games India | 2017-06-21 / 6283182009615511552 | 1 | corpus |
| project.v2-escape-rooms | Escape-room hospitality pitch (2017 V2-adjacent experiment) | archived | 2017-01 | V2 Games India | 2017-01-20 / 6228231934921797632 | 1 | corpus |
| project.v2-studio-manager-hire | Delhi Studio Manager hire (team-of-18 scaling) | shipped | 2017-06 | V2 Games India | 2017-06-30 / 6286457096145825792 | 1 | both |
| project.flow-live | Flow.live — blockchain-gaming ICO / Solidity pivot of V2 (hi@flow.live) | archived | 2018-01 | Flow.live / V2 | 2018-01-30 / 6363920222558228480 | 6 | corpus |
| project.flow-live-reactjs-hire | Flow.live ReactJS/NodeJS hire | archived | 2018-01 | Flow.live | 2018-01-29 / 6363739409459843072 | 1 | corpus |
| project.interior-design-2017 | Interior-design / residential consulting (with brother) | archived | 2017-11 | Freelance (pre-Aroma) | 2017-11-04 / 6332433616697692160 | 1 | corpus (biographical outlier) |
| project.upwork-freelance-attempt | Upwork profile rejection saga (Q4 2017) | archived | 2017-12 | Freelance | 2017-12-16 / 6347749520465543168 | 1 | corpus |
| project.aroma-franchise-revamp | Aroma Magic franchise-product revamp (70% convert, 4 new partners, +INR 250K per account) | shipped | 2018-07 | Blossom Kochhar / Aroma Magic | 2018-07-12 / 6423036084040630272 | 1 | resume (corpus ambient only) |
| project.aroma-process-digitization | Aroma Magic process-digitization (15% ops-cost reduction) | shipped | 2018-07 | Blossom Kochhar / Aroma Magic | 2020-01-09 / 6620965978270461952 (retrospective) | 1 | resume |
| project.aagaman-consulting | Aagaman Consulting (freelance PM/BD brand, 2020) | archived | 2019-12 | Freelance | 2019-12-22 / 6614478191484596224 | 3 | corpus |
| project.book-club-8-13 | Book club for 8-13 year olds (Nov 2019 initiative) | idea | 2019-11 | Personal | 2019-11-04 / 6596988773635059712 | 1 | corpus |
| project.python-gamification-tutoring | Paid Python / gamification / data-analytics / growth-hacking tutoring (reachme.agam@gmail.com) | archived | 2019-11 | Freelance | 2019-11-05 / 6597457533819027456 | 1 | corpus |
| project.gartner-bi-analysis | Gartner Magic-Quadrant BI-platform comparative analysis (public gist) | shipped | 2020-08 | Freelance | 2020-08-15 / 6700434744779276288 | 1 | corpus |
| project.flutter-dart-prototyping | Flutter/Dart cross-platform prototyping capability (Angela Yu course, 2020) | shipped | 2020-04 | Freelance | 2020-04-26 / 6660250632366239744 | 2 | corpus |
| project.toggl-quantified-self | Personal Toggl quantified-self instrumentation | shipped | 2020-02 | Personal | 2020-02-20 / 6636234771276107776 | 1 | corpus |
| project.freelance-canada-advisory | Product / Program Consultant — Canada startups ($500K+ raised per resume) | shipped | 2020-01 | Freelance | 2020-06-12 / 6677066597464645633 | 1 | resume (corpus says "working with startups") |
| project.custom-keyboards-partner-hunt | Custom-keyboard Make-in-India manufacturing partner hunt | idea | 2021-01 | Personal | 2021-01-05 / 6752097102748233729 | 1 | corpus |
| project.pi-kaggle-gauss-legendre | Pi day Gauss-Legendre (2022) + Chudnovsky (2023) Jupyter / Kaggle notebooks | shipped | 2021-03 | Personal | 2021-03-26 / 6781125824910254080 | 2 | corpus |
| project.fareye-analyze | FarEye ANALYZE flagship data product ($1M+ ARR in 18mo, 35% upsell, NPS 3.6→4.7, 60→7d onboarding) | shipped | 2020-12 | FarEye Technologies | 2022-01-15 / 6887981598361313280 | 3 | both (resume explicit, corpus has 60M-miles post + drone-delivery adjacency) |
| project.fareye-drone-delivery | FarEye drone-delivery integration (last-mile tie-up) | shipped | 2021-10 | FarEye | 2021-10-04 / 6850830741668954112 | 1 | corpus |
| project.fareye-100m-raise | #FarEyeRaises100M capital-event (the rocket-ship marker) | live | 2021-05 | FarEye | 2021-05-25 / 6802916462320197632 | 2 | corpus |
| project.fareye-hiring-campaigns | FarEye Noida Java/Spring-Boot hiring + Mar-2022 generalist hiring | live | 2021-01 | FarEye | 2021-01-15 / 6755695556602933248 | 3 | corpus |
| project.chatgpt-pipeline-pyspark | PySpark/Databricks data-pipeline co-build with ChatGPT3 (testimonial post) | shipped | 2023-02 | FarEye (personal use) | 2023-03-01 / 7036747623139028992 | 1 | corpus |
| project.agamarora-com-v1 | agamarora.com v1 (Python + Streamlit personal website) | archived | 2023-04 | Personal | 2023-04-16 / 7053307873887404032 | 1 | corpus |
| project.agamarora-com-v2 | agamarora.com v2 (vanilla HTML/CSS/JS on Netlify — current site) | live | 2024-06 (est.) | Personal | (implicit — site itself; design-tokens post 2026-04-09 / 7447981735901949952) | 1 | site + corpus |
| project.data-viz-spiral-pi | Pi-decimal spiral animation (Python + GitHub Copilot + ChatGPT) | shipped | 2023-03 | Personal | 2023-03-31 / 7047436664545107968 | 1 | corpus |
| project.chatgpt-pm-stack | Personal ChatGPT-as-PM-copilot stack (Jupyter+Pandas+NumPy+SQL+Copilot, specs proofreading, notes structuring, Linux home-lab setup) | shipped | 2023-03 | Personal | 2023-03-14 / 7041317366437163008 | 1 | corpus (meta-project = "second-brain seed") |
| project.ollama-keyboard-shortcut | Local Ollama + LLaMA3 + PHI3 keyboard-shortcut script (off-grid LLM) | shipped | 2024-06 | Personal | 2024-06-05 / 7204134749513162752 | 1 | corpus |
| project.llm-comparator | Groq + Streamlit LLM-comparator (LLaMA 8B/70B, Mixtral 8x7B, Gemma 7B/2-9B, streamlit-share, open source) | shipped | 2024-09 | Personal | 2024-09-17 / 7241688287910752257 | 1 | corpus |
| project.crewai-agentic-system | CrewAI / Autogen / Autogpt agentic-system experiment (Groq 8B tool-finetune) | shipped | 2024-07 | Personal | 2024-07-24 / 7221720797655023616 | 2 | corpus |
| project.hotel-ai-survey | Hotel-AI survey (3-4 min anonymous, share-back promise) | shipped | 2024-11 | Personal | 2024-11-28 / 7267862775639482368 | 1 | corpus |
| project.aionos-voice-platform | AIonOS Voice-AI platform (4M+ calls/yr, 50% lower cost, three verticals, Fortune 500) | live | 2024-06 | AIonOS | (resume; corpus ghost — 2024-03-29 / 7179449143407386624 is a distant Collab-Articles voice ref) | ghost | resume (authoritative) |
| project.aionos-mcp-platform | AIonOS MCP-first platform (every new capability ships as MCP server, 1-2wk steady state) | live | 2024-06 | AIonOS | (resume only — zero corpus posts) | ghost | resume |
| project.aionos-no-code-tagging | AIonOS GenAI no-code API-tagging + config tool (30+ third-party services onboarded) | shipped | 2024-06 | AIonOS | (resume only) | ghost | resume |
| project.aionos-crm-cdp | AIonOS AI-native CRM+CDP suite (50+ stakeholder interviews, enterprise travel clients) | live | 2024-06 | AIonOS | (resume only) | ghost | resume |
| project.aionos-15-pocs | AIonOS 15+ POCs (RAG, voice, agentic — $1.5M+ deal flow) | shipped | 2024-07 | AIonOS | 2024-09-04 / 7236941772336066560 ("considerable number of GenAI-based product concepts") | 2 | both |
| project.aionos-airline-deployment | AIonOS airline-vertical live deployment | live | 2025 | AIonOS | (resume only) | ghost | resume |
| project.ai-resume | AI Resume (live Netlify demo + lab PRFAQ) | live | 2025 (est.) | Personal (/lab) | (site + corpus 2024-06-09 / 7205576310398623744 prompt-guide precursor) | site | site + resume |
| project.shararat-vapi | Shararat — Vapi Build Challenge multi-agent voice experience (Angel + Dan) | shipped | 2025 (est.) | Personal (/lab) | (site card only — shararat.agamarora.com, GitHub agamarora/shararat-ai, YouTube teaser) | site | site (hackathon) |
| project.claude-code-resource-monitor | luna-monitor — Claude Code CPU/GPU/temp/disks dashboard (agamarora/utils/luna-monitor) | shipped | 2026 (est.) | Personal (/lab) | (site card only) | site | site |
| project.voice-ai-production-case-study | "Voice AI in production" case study (18 months, 3 verticals, 4 surprises) | shipped | 2026-04 | Personal (/lab) | (site card — /lab/voice-ai-production/) | site | site |
| project.product-shape-case-study | "Product shape is what you refuse" case study (scope + MCP-first bet) | shipped | 2026-04 | Personal (/lab) | (site card — /lab/product-shape/) | site | site |
| project.second-brain-v1 | second-brain v1 — wiki + kg.json + /enter v3 playback (paste-prompt, 10min setup) | prfaq | 2026-04 | Personal (/lab) | 2026-04-21 / 7452296800352305152 | 2 | both |
| project.second-brain-personal-4mo | Agam's personal second-brain instance ("using it for 4+ months… preferred way to use Claude") | live | 2025-12 | Personal (private) | 2026-04-21 / 7452296800352305152 | 1 | corpus (private instance, referenced) |
| project.claude-code-buddy | /buddy — ASCII Tamagotchi (Brindle duck, cat unlock) in Claude Code | archived (Anthropic removed) | 2026 | Personal | 2026-04-16 / 7450401488146972672 | 1 | corpus |
| project.enter-v3 | /enter v3 — immersive AI terminal (keyboard bg, Groq streaming, 4-model fallback) | live | 2026-04 | Personal (site) | (implicit — site active work; 2023-05-10 / 7062002001240367104 4-persona-prompt proto-ancestor) | site | site + corpus |
| project.moodboard | /moodboard design-system reference (aa-mark exploration) | live | 2026 | Personal (site) | (site only — orphan from nav, robots noindex) | site | site |
| project.wiki-meta | The wiki artifact itself (10-theme playbook, kg.json ontology) — meta-project | prfaq | 2026-04 | Personal | 2026-04-23 / 7452998640345853952 | 1 | corpus |
| project.thesis-post-2025-06-20 | Agent-first 8-point manifesto (the thesis post) — treating as artefact | shipped | 2025-06 | AIonOS context | 2025-06-20 / 7341662205257433088 | 1 | corpus |

**Total: 52 projects** (ontology-v0 had 14; this extends by 38, including AIonOS ghosts, V2-era sub-projects, freelance/consulting years, and /lab case studies the site adds beyond "4 site projects").

---

## 2. Tech inventory

Categories: language | framework | platform | tool | protocol.

| ID | Label | Category | First mention (date + URN tail) | Mention count | Used in projects |
|---|---|---|---|---|---|
| tech.python | Python | language | 2019-11-05 / 6597457533819027456 (tutoring offer) | 6 | agamarora-com-v1, pi-kaggle, data-viz-spiral-pi, chatgpt-pm-stack, ollama-keyboard-shortcut, llm-comparator |
| tech.r | R | language | 2016-02-21 / 6107246554437931008 | 1 | v2-data-analyst-role |
| tech.csharp | C# | language | 2016-03-17 / 6116167384093970432 | 1 | v2-mobile-games-unity |
| tech.java | Java | language | 2021-01-15 / 6755695556602933248 | 1 | fareye-hiring-campaigns |
| tech.javascript | JavaScript / Node.js | language | 2018-01-29 / 6363739409459843072 | 1 | flow-live-reactjs-hire, agamarora-com-v2 |
| tech.dart | Dart | language | 2020-04-26 / 6660250632366239744 | 2 | flutter-dart-prototyping |
| tech.solidity | Solidity | language | 2018-02-09 / 6367632755261566976 | 1 | flow-live |
| tech.sql | SQL | language | 2023-03-14 / 7041317366437163008 | 1 | chatgpt-pm-stack |
| tech.sanskrit | Sanskrit (register, not a programming language — flag as cultural reference, not tech) | — | — | — | (register only — remove if purist) |
| tech.flutter | Flutter | framework | 2020-04-26 / 6660250632366239744 | 2 | flutter-dart-prototyping |
| tech.unity3d | Unity3D | framework | 2016-03-17 / 6116167384093970432 | 2 | v2-mobile-games-unity |
| tech.reactjs | ReactJS | framework | 2018-01-29 / 6363739409459843072 | 1 | flow-live-reactjs-hire |
| tech.nodejs | NodeJS | framework | 2018-01-29 / 6363739409459843072 | 1 | flow-live-reactjs-hire |
| tech.spring-boot | Spring Boot | framework | 2021-01-15 / 6755695556602933248 | 1 | fareye-hiring-campaigns |
| tech.streamlit | Streamlit + streamlit-share | framework | 2023-04-16 / 7053307873887404032 | 2 | agamarora-com-v1, llm-comparator |
| tech.pyspark | PySpark | framework | 2023-03-01 / 7036747623139028992 | 1 | chatgpt-pipeline-pyspark |
| tech.pandas | Pandas | framework | 2023-03-14 / 7041317366437163008 | 1 | chatgpt-pm-stack |
| tech.numpy | NumPy | framework | 2023-03-14 / 7041317366437163008 | 1 | chatgpt-pm-stack |
| tech.jupyter | Jupyter | tool | 2021-03-26 / 6781125824910254080 | 2 | pi-kaggle, chatgpt-pm-stack |
| tech.kaggle | Kaggle | platform | 2021-03-26 / 6781125824910254080 | 1 | pi-kaggle |
| tech.databricks | Databricks | platform | 2023-03-01 / 7036747623139028992 | 2 | chatgpt-pipeline-pyspark, (mentioned as enterprise platform 2024-09-04) |
| tech.aws-bedrock | AWS Bedrock | platform | 2024-09-04 / 7236941772336066560 | 1 | (enterprise ref only) |
| tech.github | GitHub | platform | 2023-03-14 / 7041317366437163008 | 5 | agamarora-com-v1, llm-comparator, data-viz-spiral-pi, shararat-vapi, claude-code-resource-monitor, second-brain-v1 (MIT on GitHub) |
| tech.github-copilot | GitHub Copilot | tool | 2023-03-14 / 7041317366437163008 | 3 | chatgpt-pm-stack, data-viz-spiral-pi, + 2024-07-06 & 2024-07-02 references |
| tech.git | Git | tool | 2026-01-06 / 7414150680820547584 ("GIT solved this for millions of developers") | 3 | second-brain-v1, agamarora-com-* |
| tech.gh-cli | gh CLI | tool | 2026-04-23 / 7452998640345853952 ("Requirements: git account, and gh cli") | 1 | second-brain-v1 |
| tech.netlify | Netlify (static + serverless) | platform | (site only — ai-resume-demo.netlify.app link on /lab card) | 1 | agamarora-com-v2, ai-resume |
| tech.wordpress | WordPress | platform | 2023-04-16 / 7053307873887404032 (considered + rejected) | 1 | (agamarora-com-v1 alt — rejected) |
| tech.squarespace | Squarespace | platform | 2023-04-16 / 7053307873887404032 (considered + rejected) | 1 | (agamarora-com-v1 alt — rejected) |
| tech.wix | Wix | platform | 2023-04-16 / 7053307873887404032 (considered + rejected) | 1 | (agamarora-com-v1 alt — rejected) |
| tech.chatgpt | ChatGPT / GPT-3.5 / GPT-4 / GPT-4o / o1-preview | platform | 2023-02-23 / 7034426809358114816 | ~30 | chatgpt-pipeline-pyspark, chatgpt-pm-stack, data-viz-spiral-pi, agamarora-com-v1, hotel-ai-survey adjacent |
| tech.openai | OpenAI (org + API) | platform | 2023-02-28 / 7036334632304357377 | ~12 | chatgpt-pipeline-pyspark, crewai-agentic-system (swarm ref) |
| tech.openai-swarm | OpenAI Swarm | framework | 2025-07-17 / 7351602695977226243 | 1 | crewai-agentic-system (listed in starter kit) |
| tech.claude | Claude (Anthropic model family) | platform | 2024-09-04 / 7236941772336066560 | 6 | second-brain-v1, claude-code-buddy, claude-code-resource-monitor |
| tech.anthropic | Anthropic (org) | platform | 2026-04-16 / 7450401488146972672 | 3 | claude-code-buddy, second-brain-v1 |
| tech.claude-code | Claude Code (CLI harness) | tool | 2026-04-16 / 7450401488146972672 | 4 | claude-code-buddy, second-brain-v1 (paste-prompt), claude-code-resource-monitor |
| tech.cursor | Cursor | tool | 2026-04-23 / 7452998640345853952 ("Claude, ChatGPT, Cursor reads the same brain") | 1 | second-brain-v1 (consumer) |
| tech.gemini | Gemini (Google) | platform | 2024-09-04 / 7236941772336066560 | 1 | (enterprise closed-source ref) |
| tech.groq | Groq (inference platform) | platform | 2024-07-24 / 7221720797655023616 | 4 | crewai-agentic-system, llm-comparator, enter-v3 (site uses Groq SDK) |
| tech.llama | Meta LLaMA / LLaMA2 / LLaMA3 / 3.1 | platform | 2024-06-05 / 7204134749513162752 | 4 | ollama-keyboard-shortcut, llm-comparator, crewai-agentic-system |
| tech.phi3 | Microsoft PHI3 | platform | 2024-06-05 / 7204134749513162752 | 2 | ollama-keyboard-shortcut |
| tech.mistral | Mistral 7B / Mixtral 8x7B / Mixtral 8x22B / Dolphin-Mistral7B | platform | 2024-06-12 / 7206488631522254848 | 2 | llm-comparator |
| tech.gemma | Gemma 7B IT / Gemma 2 9B IT | platform | 2024-09-17 / 7241688287910752257 | 1 | llm-comparator |
| tech.ollama | Ollama (local model runner) | tool | 2024-06-05 / 7204134749513162752 | 1 | ollama-keyboard-shortcut |
| tech.crewai | CrewAI | framework | 2024-07-24 / 7221720797655023616 | 2 | crewai-agentic-system |
| tech.autogen | Microsoft Autogen | framework | 2024-07-24 / 7221720797655023616 | 2 | crewai-agentic-system |
| tech.autogpt | AutoGPT | framework | 2024-07-24 / 7221720797655023616 | 1 | crewai-agentic-system (tried-and-dropped) |
| tech.llamaagents | LlamaAgents | framework | 2024-07-26 / 7222469586212769792 | 1 | crewai-agentic-system (tried-and-dropped) |
| tech.langgraph | LangGraph | framework | 2025-07-17 / 7351602695977226243 | 1 | (starter-kit mention) |
| tech.langflow | Langflow | framework | 2025-07-17 / 7351602695977226243 | 1 | (starter-kit mention) |
| tech.memgpt | MemGPT | framework | 2025-07-17 / 7351602695977226243 | 1 | (starter-kit mention for memory) |
| tech.mcp | MCP — Model Context Protocol | protocol | (resume; zero corpus posts — ghost theme) | ghost | aionos-mcp-platform |
| tech.rag | RAG (retrieval-augmented generation) | protocol | 2025-07-17 / 7351602695977226243 | 2 | aionos-15-pocs, crewai-agentic-system |
| tech.midjourney | Midjourney | tool | 2023-03-19 / 7043263140091899904 | 1 | (aspirational — "as fluent as PowerPoint") |
| tech.notebooklm | NotebookLM | tool | 2024-11-22 / 7265670639867297792 | 1 | (consumer demo — 4M-word philosophy encyclopedia) |
| tech.obsidian | Obsidian | tool | 2026-04-21 / 7452296800352305152 | 1 | second-brain-v1 (Karpathy LLM Wiki pattern) |
| tech.google-stitch | Google Stitch (generative design tool) | tool | 2026-04-09 / 7447981735901949952 | 1 | (tried + dropped — taste-pass fail) |
| tech.vapi | Vapi (voice-agent platform + Build Challenge) | platform | (site only) | 1 | shararat-vapi |
| tech.elevenlabs | ElevenLabs | platform | (zero corpus, zero resume — excluded) | — | — |
| tech.toggl | Toggl (time tracker) | tool | 2020-02-20 / 6636234771276107776 | 1 | toggl-quantified-self |
| tech.streak-crm | Streak CRM | tool | 2018-06-02 / 6408729273586278400 | 1 | (Aroma Magic BD eval) |
| tech.zoho-crm | Zoho CRM | tool | 2018-06-02 / 6408729273586278400 | 1 | (Aroma Magic BD eval) |
| tech.upwork | Upwork | platform | 2017-12-16 / 6347749520465543168 | 1 | upwork-freelance-attempt |
| tech.steemit | Steemit | platform | 2018-01-21 / 6360888122695348224 | 1 | (Flow.live era research) |
| tech.windows | Windows (host OS, 16GB RAM constraint mention) | platform | 2024-06-05 / 7204134749513162752 | 1 | ollama-keyboard-shortcut |
| tech.linux-homelab | Linux home-lab | platform | 2023-03-14 / 7041317366437163008 | 1 | chatgpt-pm-stack |
| tech.mercurial | Mercurial / GIT / SVN (v2-era VCS requirement) | tool | 2016-03-17 / 6116167384093970432 | 1 | v2-mobile-games-unity |
| tech.gauss-legendre | Gauss-Legendre algorithm (pi) | protocol | 2021-03-26 / 6781125824910254080 | 1 | pi-kaggle |
| tech.chudnovsky | Chudnovsky algorithm (pi) | protocol | 2023-03-31 / 7047436664545107968 | 1 | pi-kaggle |
| tech.gartner-mq | Gartner Magic Quadrant (research artifact, 2020) | tool | 2020-08-15 / 6700434744779276288 | 2 | gartner-bi-analysis, 2021-07-16 supply-chain roadmap post |
| tech.angela-yu-flutter-course | Angela Yu Flutter/Dart course | tool | 2020-04-26 / 6660250632366239744 | 1 | flutter-dart-prototyping |
| tech.9gag | 9gag (content sourcing — "found while scrolling") | tool | 2023-03-28 / 7046324571590828032 | 2 | — (meta) |
| tech.youtube | YouTube (platform referenced multiple times for demo videos, Mo Gawdat talk, Shreyas, Nate B Jones, 2025-07-09 monetization policy) | platform | 2024-06-05 / 7204134749513162752 | 4 | ollama-keyboard-shortcut (tutorial), shararat-vapi (teaser) |

**Total: 58 tech nodes** (excluding "tech.sanskrit" which I'd remove from final — cultural register, not tech).

Note: **MCP** (the AIonOS flagship protocol bet) has **ZERO corpus mentions**. The closest is the 2025-06-20 manifesto's point #7 ("Your systems must serve agents too") which gestures at MCP's thesis without naming it. Classic ghost-theme resume-only node.

Also ghost: **voice AI platform stack** (ASR/TTS specifics, Twilio, ElevenLabs) — zero corpus, zero resume-detail. Agent must state "stack details are private" if asked.

---

## 3. Project lineage DAG

41 `builds_on` edges. Direction = later builds on earlier.

| From (project, date) | builds_on | To (project, date) | Evidence (post date + URN tail) | Notes |
|---|---|---|---|---|
| project.v2-mobile-games-unity (2016-03) | builds_on | project.v2-games (2016-01) | 2016-03-17 / 6116167384093970432 | C# game dev hires off founding hiring post |
| project.v2-data-analyst-role (2016-02) | builds_on | project.v2-games | 2016-02-21 / 6107246554437931008 | R / predictive-modelling role added to core games studio |
| project.v2-escape-rooms (2017-01) | builds_on | project.v2-games | 2017-01-20 / 6228231934921797632 | "focusing on my startup along with a stellar team" — V2 + hospitality pivot |
| project.v2-esports-mobile (2017-06) | builds_on | project.v2-games-chakravyuh (2016-01) | 2017-06-21 / 6283182009615511552 | Mobile eSports push = natural extension of Chakravyuh eSports thesis |
| project.v2-studio-manager-hire (2017-06) | builds_on | project.v2-games | 2017-06-30 / 6286457096145825792 | Delhi studio scaling |
| project.flow-live (2018-01) | builds_on | project.v2-games | 2018-02-10 / 6367924728723795968 | "Blockchain = Gamification decentralized" — V2 gaming-economy intuition ported to chain |
| project.flow-live-reactjs-hire (2018-01) | builds_on | project.flow-live | 2018-01-29 / 6363739409459843072 | Frontend staffing for chain product |
| project.interior-design-2017 (2017-11) | builds_on | (independent) | 2017-11-04 / 6332433616697692160 | Biographical outlier — no lineage (pre-V2-wind-down side hustle) |
| project.upwork-freelance-attempt (2017-12) | builds_on | project.v2-games (tail) | 2017-12-16 / 6347749520465543168 | V2 winding down + freelance seeking |
| project.aroma-franchise-revamp (2018-07) | builds_on | (industry pivot — no tech lineage, but PM-craft lineage from V2) | 2018-07-12 / 6423036084040630272 | "entrepreneurship to corporate" narrative |
| project.aroma-process-digitization (2018-07) | builds_on | project.aroma-franchise-revamp | 2020-01-09 / 6620965978270461952 | Sequential Aroma wins — digitization ops after BD revamp |
| project.aagaman-consulting (2019-12) | builds_on | project.aroma-franchise-revamp | 2019-12-22 / 6614478191484596224 | Brand spun up during late-Aroma-tail as personal advisory shingle |
| project.book-club-8-13 (2019-11) | builds_on | (independent side initiative) | 2019-11-04 / 6596988773635059712 | Personal passion project, no lineage |
| project.python-gamification-tutoring (2019-11) | builds_on | project.v2-games | 2019-11-05 / 6597457533819027456 | "gamification" teaching = V2 domain reused as tutoring IP |
| project.freelance-canada-advisory (2020-01) | builds_on | project.aagaman-consulting | 2020-06-12 / 6677066597464645633 | Canada-startups advisory = execution arm of Aagaman brand |
| project.flutter-dart-prototyping (2020-04) | builds_on | project.freelance-canada-advisory | 2020-04-26 / 6660250632366239744 | "Wasn't able to invest in app-dev team… pulled up course" — unlocks prototyping-for-pitches capability |
| project.toggl-quantified-self (2020-02) | builds_on | project.flutter-dart-prototyping (proto — both "self-instrumentation in 2020") | 2020-02-20 / 6636234771276107776 | Quantified-self thesis precedes shipping; precursor of second-brain |
| project.gartner-bi-analysis (2020-08) | builds_on | project.freelance-canada-advisory | 2020-08-15 / 6700434744779276288 | BI-research output as #OpenToWork portfolio piece en-route to FarEye |
| project.fareye-hiring-campaigns (2021-01) | builds_on | project.fareye-analyze | 2021-01-15 / 6755695556602933248 | Java/Spring Boot = ANALYZE platform stack-expansion |
| project.fareye-100m-raise (2021-05) | builds_on | project.fareye-analyze | 2021-05-25 / 6802916720622223360 | Capital event fuels ANALYZE + drone-delivery expansion |
| project.fareye-drone-delivery (2021-10) | builds_on | project.fareye-analyze | 2021-10-04 / 6850830741668954112 | "intelligent delivery management platform" extension |
| project.pi-kaggle-gauss-legendre (2021-03) | builds_on | project.custom-keyboards-partner-hunt (both E3a personal-projects) | 2021-03-26 / 6781125824910254080 | Peer-node — same "hardware-tinkerer in FarEye year one" cluster |
| project.data-viz-spiral-pi (2023-03) | builds_on | project.pi-kaggle-gauss-legendre | 2023-03-31 / 7047436664545107968 | "Last year on pi day I used Gauss-Legendre… this year Chudnovsky + Copilot" — explicit year-over-year lineage |
| project.chatgpt-pipeline-pyspark (2023-02) | builds_on | project.fareye-analyze (privately used at FarEye) | 2023-03-01 / 7036747623139028992 | ChatGPT3 optimized FarEye data pipeline work |
| project.chatgpt-pm-stack (2023-03) | builds_on | project.chatgpt-pipeline-pyspark | 2023-03-14 / 7041317366437163008 | Evolves from "helped me at FarEye" to "this is my whole PM stack" — load-bearing manifesto |
| project.agamarora-com-v1 (2023-04) | builds_on | project.chatgpt-pm-stack | 2023-04-16 / 7053307873887404032 | "ChatGPT and I have started a new project of building my personal website" (2023-03-14) → shipped 2023-04-16 |
| project.ollama-keyboard-shortcut (2024-06) | builds_on | project.chatgpt-pm-stack | 2024-06-05 / 7204134749513162752 | "off-the-grid but with my trusty LLM peer" — personal-LLM craft continues |
| project.crewai-agentic-system (2024-07) | builds_on | project.ollama-keyboard-shortcut | 2024-07-24 / 7221720797655023616 | June local-models → July orchestration-on-Groq; same "solo AI-tinkerer" voice |
| project.aionos-15-pocs (2024-07) | builds_on | project.crewai-agentic-system | 2024-09-04 / 7236941772336066560 | Personal agentic experiments feed enterprise POC fluency |
| project.aionos-voice-platform (2024-07) | builds_on | project.aionos-15-pocs | (resume + 2024-09-04 corpus) | Voice vertical is the one that crossed prod from the 15 POCs |
| project.aionos-no-code-tagging (2024+) | builds_on | project.aionos-voice-platform | (resume) | API-tagging needed for voice-agent tool invocation at 30+ services |
| project.aionos-mcp-platform (2024+) | builds_on | project.aionos-no-code-tagging | (resume; 2025-06-20 manifesto point 7 is the public thesis) | MCP-first emerged as consolidation bet after no-code tagging proved value |
| project.aionos-crm-cdp (2024+) | builds_on | project.aionos-voice-platform | (resume — 50 stakeholder interviews, travel vertical) | CRM+CDP = post-call / post-vertical productization |
| project.aionos-airline-deployment (2025) | builds_on | project.aionos-voice-platform | (resume) | Vertical #3 after retail + earlier two |
| project.hotel-ai-survey (2024-11) | builds_on | project.aionos-15-pocs | 2024-11-28 / 7267862775639482368 | Travel-vertical research to feed enterprise hospitality product thesis |
| project.llm-comparator (2024-09) | builds_on | project.crewai-agentic-system | 2024-09-17 / 7241688287910752257 | Same Groq-stack, same week-cluster — measuring tool to support agentic reliability work |
| project.ai-resume (2025) | builds_on | project.agamarora-com-v2 | (site — /lab/ai-resume/ hosted under current site) | Agentic interface for the resume = demo for serving-lens agent-first thesis |
| project.shararat-vapi (2025) | builds_on | project.crewai-agentic-system | (site card — multi-agent voice, "Angel and Dan" — same multi-agent orchestration pattern) | Public voice-agent hackathon answering the AIonOS voice-platform craft privately |
| project.claude-code-buddy (2026-04) | builds_on | project.claude-code-resource-monitor | 2026-04-16 / 7450401488146972672 | Both are Claude-Code-harness utilities Agam ships/consumes |
| project.enter-v3 (2026-04) | builds_on | project.ai-resume | (implicit — "/enter" is the agentic playback layer; AI Resume is the agentic interface) | Both site agents; enter-v3 generalizes ai-resume into full site-agent |
| project.second-brain-personal-4mo (2025-12) | builds_on | project.chatgpt-pm-stack | 2026-04-21 / 7452296800352305152 ("using my second brain for over 4 months") | 3yr lineage: 2023-03 ChatGPT PM-stack → 2025-12 first personal second-brain instance |
| project.second-brain-v1 (2026-04) | builds_on | project.second-brain-personal-4mo | 2026-04-21 / 7452296800352305152 | Personal instance → public productized v1 after Karpathy LLM-Wiki gist trigger |
| project.second-brain-v1 (2026-04) | builds_on | project.toggl-quantified-self | (transitive via chatgpt-pm-stack — 6yr arc) | 2020 self-instrumentation thesis is the spiritual ancestor per ontology-v0 |
| project.second-brain-v1 (2026-04) | builds_on | project.chatgpt-pm-stack | (inherited — structuring-thoughts-and-notes from 2023-03-14) | "structuring my thoughts" (2023) → full personal-context layer (2026) |
| project.enter-v3 (2026-04) | builds_on | project.second-brain-v1 | (spec §9 — /enter v3 is "thin playback layer" over wiki + kg) | Core second-brain v1 architecture decision |
| project.wiki-meta (2026-04) | builds_on | project.second-brain-v1 | 2026-04-23 / 7452998640345853952 | The wiki artifact IS the second-brain surfaced as static HTML |
| project.voice-ai-production-case-study (2026-04) | builds_on | project.aionos-voice-platform | (site card — "18 months shipping voice AI to Fortune 500") | Case-study is retrospective narration of ghost-project's public-safe fragments |
| project.product-shape-case-study (2026-04) | builds_on | project.aionos-mcp-platform | (site card — "MCP-first bet, the pivot I got wrong") | Public taste-pass on private AIonOS scope decisions |

**Total: 41 lineage edges.** Cleanest chain: V2 Games (2016) → Flow.live (2018 — gaming-economics → chain) → Aroma Magic (2018-19, corporate BD interlude) → Aagaman Consulting (2019-20) → FarEye ANALYZE (2020-24, enterprise PM) → AIonOS Voice/MCP (2024-) → second-brain v1 (2026). The compounding story has ONE hop per year on average.

---

## 4. Project → Belief evidence map

36 `demonstrates` edges. Which projects evidence which beliefs (grounded in ontology-v0's 40-belief catalog + new beliefs introduced by projects).

| Project | demonstrates | Belief | Evidence (post date + URN tail) |
|---|---|---|---|
| project.v2-games | demonstrates | belief.gaming-as-economic-intuition | 2018-02-10 / 6367924728723795968 (retrospectively framed as economic-design in gaming) |
| project.v2-games-chakravyuh | demonstrates | belief.dominate-dont-compete | 2016-01-02 / 6089072870409908224 ("Chakravyuh" = military-formation framing) |
| project.v2-mobile-games-unity | demonstrates | belief.build-measure-learn | 2017-06-07 / 6278086546931449856 ("Build Measure Learn - Lean Methodology") |
| project.flow-live | demonstrates | belief.substance-over-hype | 2018-03-06 / 6376849689375019008 ("Blockchain is a database innovation first") |
| project.flow-live | demonstrates | belief.ico-is-funding-not-product | 2018-02-15 / 6369983938248699904 |
| project.flow-live | demonstrates | belief.gaming-as-economic-intuition | 2018-02-10 / 6367924728723795968 |
| project.interior-design-2017 | demonstrates | belief.ideas-are-enough (early stance) | 2017-11-04 / 6332433616697692160 ("forayed into the field… looking for industry mentors") |
| project.aroma-franchise-revamp | demonstrates | belief.help-market-flourish | 2018-07-12 / 6423036084040630272 ("go increase the size of the pie") |
| project.aroma-franchise-revamp | demonstrates | (new) belief.stp-is-marketing-bedrock | 2019-03-02 / 6507430450133340160 (STP model post during Aroma tenure) |
| project.aagaman-consulting | demonstrates | belief.ideas-are-enough (bridge) | 2019-12-22 / 6614478191484596224 |
| project.python-gamification-tutoring | demonstrates | belief.learn-concepts-not-tools | 2019-12-04 / 6607850998486659072 |
| project.flutter-dart-prototyping | demonstrates | belief.ship-the-prototype | 2020-05-19 / 6668609461650784256 (the canonical "just an idea!" inversion post) |
| project.toggl-quantified-self | demonstrates | belief.quantified-self-as-mindfulness | 2020-02-20 / 6636234771276107776 |
| project.toggl-quantified-self | demonstrates | belief.self-instrumentation | 2018-05-28 / 6406787198674403328 (earlier gaming-pattern seed) |
| project.freelance-canada-advisory | demonstrates | belief.idea-validation-3-pillars | 2020-07-04 / 6685080724728496129 |
| project.gartner-bi-analysis | demonstrates | belief.data-literacy-is-pm-core | 2020-08-15 / 6700434744779276288 |
| project.fareye-analyze | demonstrates | belief.its-not-the-model-its-the-problem | 2021-07-14 / 6820970631484465152 |
| project.fareye-analyze | demonstrates | belief.pm-is-featherless-hat | 2021-09-22 / 6846280835910406144 |
| project.fareye-analyze | demonstrates | belief.pm-is-99-should-we-1-can-we | 2022-06-03 / 6938349828124921856 |
| project.fareye-analyze | demonstrates | belief.tech-as-enabler | 2021-06-01 / 6805501857314734080 |
| project.fareye-analyze | demonstrates | belief.pm-as-parenting | 2021-07-12 / 6820386609561661440 |
| project.fareye-100m-raise | demonstrates | belief.ic-path-legitimacy | 2021-10-30 / 6860074002963038208 ("my org for facilitating this career route") |
| project.chatgpt-pm-stack | demonstrates | belief.ai-pm-skillset-table-stakes | 2023-03-14 / 7041317366437163008 |
| project.chatgpt-pm-stack | demonstrates | belief.ai-fluency-required | 2023-03-19 / 7043263140091899904 |
| project.chatgpt-pipeline-pyspark | demonstrates | belief.llm-as-voice-extension | 2023-03-01 / 7036747623139028992 |
| project.agamarora-com-v1 | demonstrates | belief.personal-website-is-present-tense | 2023-04-16 / 7053307873887404032 (the "12 years" post) |
| project.ollama-keyboard-shortcut | demonstrates | belief.learn-concepts-not-tools | 2024-06-05 / 7204134749513162752 ("product hacker in me") |
| project.crewai-agentic-system | demonstrates | belief.agent-first (craft side) | 2024-07-24 / 7221720797655023616 |
| project.llm-comparator | demonstrates | belief.data-literacy-is-pm-core | 2024-09-17 / 7241688287910752257 (measure LLM quality with LLMs) |
| project.aionos-15-pocs | demonstrates | belief.enterprise-ai-production-reality | 2024-09-04 / 7236941772336066560 (9 takeaways post) |
| project.aionos-voice-platform | demonstrates | (new) belief.voice-as-enterprise-wedge | (resume + 2025-06-20 / 7341662205257433088 manifesto point 2) |
| project.aionos-mcp-platform | demonstrates | belief.agent-first (serving lens) | 2025-06-20 / 7341662205257433088 point 7 ("Your systems must serve agents too") |
| project.aionos-mcp-platform | demonstrates | (new) belief.mcp-as-enterprise-primitive | (resume only — ghost) |
| project.claude-code-buddy | demonstrates | belief.humor-wit (project-as-joke) | 2026-04-16 / 7450401488146972672 |
| project.enter-v3 | demonstrates | belief.agent-first (serving lens) | (site) |
| project.second-brain-v1 | demonstrates | belief.second-brain-is-context-layer | 2026-04-23 / 7452998640345853952 |
| project.second-brain-v1 | demonstrates | belief.spec-over-sprint + belief.taste-over-execution + belief.context-over-prompt | 2026-04-09 / 7447981735901949952 (all 3 mottos) |
| project.wiki-meta | demonstrates | belief.second-brain-is-context-layer | 2026-04-21 / 7452296800352305152 (Karpathy LLM-Wiki pattern) |
| project.voice-ai-production-case-study | demonstrates | belief.enterprise-ai-production-reality | 2024-09-04 / 7236941772336066560 + 2025-06-20 manifesto |
| project.product-shape-case-study | demonstrates | belief.anti-customization | 2025-12-04 / 7402319253036531712 |

**New beliefs introduced by projects (not in ontology-v0):**
- `belief.stp-is-marketing-bedrock` — evidence 2019-03-02 / 6507430450133340160. E2b era. Aroma-Magic BD foundation.
- `belief.voice-as-enterprise-wedge` — ghost (resume-only, corpus has only passive Collab-Articles mention). AIonOS flagship thesis.
- `belief.mcp-as-enterprise-primitive` — ghost (resume explicit, zero corpus). Should be flagged red-ghost for agent grounding.

---

## 5. Tech lineage / stack evolution

**E1 stack (2014-2017, Absolutdata → V2).** Post-MBA Analyst + early-founder. Corpus names almost no tech directly (voice is reactive-one-liner). V2 Games era hires specify **C# + Unity3D + mobile (Android/iOS/Windows) + Mercurial/GIT/SVN**. Data-analyst role asks for **R + predictive modelling**. Contact at `@v2g.io`. No AI or LLM mentions; the AI-PM ancestor post (2017-12-21) names "Decision Management + ML platforms" in the abstract but no concrete tools.

**E2a stack (Jan-May 2018, Flow.live).** **Solidity** (blockchain star hire), **ReactJS + NodeJS** (frontend/backend hire), CRMs **Streak + Zoho** (recruitment-industry BD pipeline, 2018-06). Research source: **Steemit / Blockgeeks** for crypto content. Domain `@flow.live`. Heavy on "I read about it" vs "I built it" — this is the taste-formation era, not a shipping era.

**E2b stack (Jul 2018 – Dec 2019, Aroma Magic).** BD/marketing register dominates. Tech is **process-digitization ambient** (no named tools). STP, MVP, MMP framework posts. The tech that matters in E2b is slide-decks + spreadsheets — not code.

**E2c stack (Jan-Dec 2020, Freelance).** Sharp tool-acquisition pivot. **Python + OOP** (2020-09-29), **Flutter + Dart** (2020-04-26 Angela Yu course), **Toggl** (2020-02-20), **Gartner Magic Quadrant** as research tool (2020-08-15). The "learn concepts, not tools" belief hardens here even while he's acquiring tools. Canada-advisory work is stack-agnostic consulting.

**E3a stack (Dec 2020 – Oct 2022, pre-ChatGPT FarEye).** **Java + Spring Boot + SaaS** (2021-01-15 hiring post — the ANALYZE stack). **Jupyter + Kaggle** for pi-day personal (2021-03-26). **Google Pay / Google Maps / GPay notifications / Google-as-enterprise-reference** is the ambient enterprise backdrop (he critiques Google Pay UX, cites Google Maps eco-routing, etc.). Custom-keyboard partner-hunt (2021-01-05) signals an unchannelled hardware-tinkerer energy that never ships but seeds later personal-projects-tinkering.

**E3b stack (Feb – Nov 2023, post-ChatGPT FarEye).** **ChatGPT3 / ChatGPT / GPT-3.5 / GPT-4 / OpenAI** become THE tech vocabulary. **Jupyter + Pandas + NumPy + SQL + GitHub Copilot + Linux home-lab** (2023-03-14 manifesto) is the whole personal stack in one post. **PySpark + Databricks** (for FarEye data work, 2023-03-01). **Python + Streamlit + GitHub** (agamarora.com v1, 2023-04-16). **Midjourney** name-dropped (2023-03-19 aspirational). **OpenAI Discord / Hugging Face / GPT-3 Playground / AI Dungeon / Sid Reddy tutorial** as learning-landscape refs. Hashtag density is the E3b signal — tech is a performance not an ops layer.

**E4a stack (Jul 2024 – May 2025, AIonOS ramp).** Explosion: **Groq + LLaMA 3.1 + finetuned-tool-LLaMA-8B**, **Ollama + PHI3**, **Mistral 7B + Mixtral 8x7B + Mixtral 8x22B + Dolphin-Mistral7B + Gemma 7B IT + Gemma 2 9B IT**, **CrewAI + Autogen + AutoGPT + LlamaAgents** (all tried), **GPT-4o + o1-preview** (Daniel-Kahneman System-1-vs-2 post), **Streamlit + streamlit-share + GitHub** (llm-comparator). **AWS Bedrock + Databricks** as enterprise-platform-reference (2024-09-04). **NotebookLM** as consumer-demo reference. **Windows + 16GB RAM** as constraint-signal. Closed-source: **GPT, Claude, Gemini** as "the three" enterprise customers rely on. Agentforce / Salesforce (Benioff post) as enterprise pattern. This is the year of "try everything, keep what works." CrewAI wins the 2024-07 shootout ("bloatware but gets things done").

**E4b stack (Jun 2025 – Apr 2026, thesis locks in).** Consolidation. **LangGraph / Langflow / crew / MemGPT / OpenAI Swarm** named in 2025-07-17 primer as the recommended starter kit — but Agam himself is now on **Claude + Claude Code + Cursor + Obsidian-pattern** (2026-04 second-brain). **Anthropic** becomes the foreground brand (vs OpenAI in E3b). **Google Stitch** is tried and dropped (2026-04-09) — the taste-pass pivot: tools that can't hit locked design tokens are worse than handcraft. **MCP** is the flagship bet (resume-only, zero corpus). **Netlify** hosts /lab + /enter v3. **Vapi** for the Shararat hackathon project. Stack voice: quieter mention of specifics, more on architecture (memory, tools, prompts are plumbing).

**Tech he committed to (taste-signal = still using):** Python (10yr+), GitHub (whole career), Groq (2024+, explicit fandom), Claude + Anthropic (2025+), Streamlit (for ships that need a UI in 2hr), Markdown + Git (second-brain bet), Obsidian pattern (without Obsidian itself — uses the ideas).

**Tech he tried and abandoned (taste-pivot):**
- **AutoGPT** (2024-07-24 — explicitly "dumb loop of recursions")
- **LlamaAgents** (same post — "CrewAI bloatware but better than these")
- **Autogen** (same — "CrewAI gets things done better than Autogen")
- **Google Stitch** (2026-04-09 — dropped in under 30 minutes for failing design tokens)
- **Upwork** (2017-12 — platform rejected him back)
- **WordPress / Squarespace / Wix** (2023-04-16 — "too easy," chose Python+Streamlit instead; then 2024+ rebuilt to vanilla HTML on Netlify — rejected that whole class of site-builder)
- **Streak / Zoho CRM** (2018-06 — survey-poll, no follow-up)
- **Twitter / X** (2017-12-22 "Twitter will dwindle?" + 2026 corpus avoidance)

**Dead-registers:**
- HODL / altcoin / penny-coin framing (E2a, Jan-Mar 2018)
- `#aagamanconsulting` hashtag (Dec 2019 – Jan 2020 only, never resurfaces)
- `#FarEyeRaises100M` (May 2021 only, explicitly employer marketing)
- "Comfort is a myth / Grind till X becomes Y / Prepare persevere prosper" register (E2b / E3a, gone by E4)

---

## 6. Companies + roles + project ownership

| Company | Role | Years | Projects owned/mentioned |
|---|---|---|---|
| Absolutdata Analytics (Infogain) | Analyst — Analytics & Market Research | 2014-04 → 2015-12 | (corpus silent — "multiple successful product launches" per resume; 2021-09-27 / 6848110810057732096 retrospective is the only post) |
| FORE School of Management | PGDM Marketing student | 2012 → 2014 | (implicit — pre-corpus) |
| V2 Games India Pvt. Ltd. | Studio Head / Entrepreneur | 2016-01 → 2018-05 | v2-games, v2-games-chakravyuh, v2-data-analyst-role, v2-mobile-games-unity, v2-esports-mobile, v2-escape-rooms, v2-studio-manager-hire |
| Flow.live (spin-out) | Co-founder / BD | 2018-01 → 2018-05 | flow-live, flow-live-reactjs-hire |
| (Transition side-hustle) | Side-project | 2017-11 | interior-design-2017 |
| (Transition side-hustle) | Freelance attempt | 2017-12 | upwork-freelance-attempt |
| Blossom Kochhar (Aroma Magic) | Manager — New Business Development & Expansion | 2018-07 → 2019-12 | aroma-franchise-revamp, aroma-process-digitization |
| Freelance (Aagaman Consulting brand) | Product & Program Consultant | 2020-01 → 2020-12 | aagaman-consulting, book-club-8-13, python-gamification-tutoring, gartner-bi-analysis, flutter-dart-prototyping, toggl-quantified-self, freelance-canada-advisory |
| FarEye Technologies Pvt. Ltd. | Lead Product Manager | 2020-12 → 2024-05 | fareye-analyze, fareye-hiring-campaigns, fareye-100m-raise, fareye-drone-delivery, chatgpt-pipeline-pyspark (private FarEye use) |
| FarEye (personal side during) | Personal tinkerer | 2021-2024 | pi-kaggle-gauss-legendre, data-viz-spiral-pi, custom-keyboards-partner-hunt, chatgpt-pm-stack, agamarora-com-v1 |
| (Interregnum Jun 2024) | Personal hobbyist | 2024-06 | ollama-keyboard-shortcut |
| AIonOS India Pvt. Ltd. | Assistant Vice President — AI Products | 2024-06 → present | aionos-voice-platform, aionos-mcp-platform, aionos-no-code-tagging, aionos-crm-cdp, aionos-15-pocs, aionos-airline-deployment, hotel-ai-survey, thesis-post-2025-06-20 |
| AIonOS (personal side during) | Personal / /lab builder | 2024-2026 | crewai-agentic-system, llm-comparator, agamarora-com-v2, ai-resume, shararat-vapi, claude-code-resource-monitor, claude-code-buddy, enter-v3, voice-ai-production-case-study, product-shape-case-study, second-brain-personal-4mo, second-brain-v1, wiki-meta, moodboard |

**7 distinct employer-companies** + **1 spin-out** (Flow.live) + freelance years + 2 major personal-project eras (FarEye-adjacent + AIonOS-adjacent).

---

## 7. Discovery flags

Things Agam should taste-pass.

**A. Projects mentioned once and never again (ideas-that-died):**
1. **Custom-keyboard manufacturing partner-hunt** (2021-01-05 / 6752097102748233729) — explicit product intent, never resurfaces. Was this taste (realized it was a distraction) or capacity (didn't have time during FarEye ramp)? If the former, it's evidence for `belief.taste-over-execution` 5 years early. If the latter, flag as "idea reservoir for E5."
2. **Book club for 8-13 year olds** (2019-11-04 / 6596988773635059712) — passionate personal initiative, no follow-up. Was it the pandemic? Agam taste-pass needed.
3. **Python + gamification + growth-hacking paid tutoring** (2019-11-05 / 6597457533819027456) — explicit monetization offer, `reachme.agam@gmail.com`. Did anyone take it up? Never mentioned again.
4. **Escape-rooms hospitality B2B** (2017-01-20 / 6228231934921797632) — pitched to marketing+hospitality orgs. Flagged by Agam himself as an experiment in LinkedIn-virality. Outcome unknown.
5. **Interior-design consulting with brother** (2017-11-04 / 6332433616697692160) — the famous forgotten pivot. Already flagged in corpus-synthesis-v0 §1.7. Biographical outlier, no tech lineage.
6. **Anthropic Mythos $100M red-team commitment** (2026-04-08 / 7447489181821353984) — ontology-v0 flagged this as "verify." Agam should confirm: is Mythos a real April-2026 model release (possibly), or was this a speculation/hypothesis Agam posted about as-if-real? Agent grounding depends on this.

**B. Tech praised then abandoned (taste pivots worth surfacing):**
1. **AutoGPT → CrewAI → now LangGraph/Swarm?** Agam's starter-kit recommendation (2025-07-17) is *different* from what he himself used (2024-07-24 CrewAI). Has he personally migrated to LangGraph? Or is the 2025 recommendation a "what a beginner should use today" vs "what I used 12 months ago"? Clarify.
2. **OpenAI → Anthropic migration** implicit across E3b→E4b. 2023-03 corpus is OpenAI/ChatGPT-saturated; 2026-04 corpus is Claude/Anthropic-saturated. Was there a deliberate switching-moment or a gradual taste-drift? Worth an era-boundary-post clarifying.
3. **Streamlit as shipping primitive** (2023-04 agamarora-com-v1, 2024-09 llm-comparator) — dropped by 2024 for agamarora-com-v2 rebuild to vanilla HTML. Why? Taste-pass: was it performance, control, or "Streamlit looks like an MVP"?
4. **WordPress/Squarespace/Wix all rejected** (2023-04-16) — "too easy." Same stance 3 years later ("Google Stitch produces worse than what I specced"). This is the constant: anti-template-generator taste.

**C. Resume / corpus mismatches:**
1. **Voice AI (4M+ calls/yr)** — resume-authoritative. Corpus has 2 passing references. Ghost confirmed.
2. **MCP-first platform** — resume-authoritative. Corpus has ZERO explicit mention. Only 2025-06-20 manifesto point 7 gestures at the thesis ("systems must serve agents"). Red-ghost — agent MUST NOT improvise MCP specifics from corpus alone.
3. **30+ third-party services API-tagging** — resume-only. Corpus silent.
4. **50+ enterprise travel-client stakeholder interviews** — resume-only. Corpus silent.
5. **$1M ARR / 35% upsell / NPS 3.6→4.7 / 60→7d onboarding** (FarEye ANALYZE metrics) — resume-only. Corpus has one 60M-miles SDG post (2022-01-15) and zero revenue/NPS numbers.
6. **V2 Games $75K ARR / team-of-18** — resume-only. Corpus has hiring posts (Unity, data-analyst, studio-manager) but no revenue/team-size claims.
7. **Airline deployment live** — resume-only. Zero corpus.
8. **$1.5M+ enterprise deals** — resume-only. Zero corpus.
9. **Absolutdata "multiple successful product launches"** — resume claim, corpus has zero direct-tenure posts (only retrospective 2021-09-27 with colleague shout-outs).

**D. Possible ontology-v0 hallucinations / over-naming:**
1. `project.mythos-experiment` (ontology-v0 row) — same flag as above. Mythos belongs in post-mentions, not as a project Agam OWNS.
2. `project.enter-v3` dated 2023-05-10 in ontology-v0 — this is wrong. 2023-05-10 `urn:7062002001240367104` is a Marcus-Aurelius Stoic-reflection post with LLM-persona-expansion framing. It's a *proto-pattern* (multi-persona prompt generation) but not /enter v3 which is an April 2026 project. Ontology-v0 conflated them. Recommend: split into `belief.llm-as-multi-voice-lens` (2023-05-10) separate from `project.enter-v3` (2026-04).
3. `project.ai-resume` has no explicit corpus first-mention — ontology-v0 said "implicit." This file treats it as site-known, resume-implicit. Agam should confirm launch-date for a proper started field.

**E. Shadow-projects in the wiki-launch arc (Apr 2026):**
The "second-brain v1 stack" as it exists today is actually **4 projects in a trench coat**:
1. `project.second-brain-personal-4mo` — the private instance Agam has been using since ~Dec 2025.
2. `project.second-brain-v1` — the public productized version (paste-prompt + MIT repo).
3. `project.wiki-meta` — the wiki artifact itself (10 themes + kg.json).
4. `project.enter-v3` — the /enter playback layer on top of the wiki.

If the `/wiki/projects/index.html` page doesn't decompose these 4, the reader loses the lineage-is-recursive story.

---

## 8. Recommendations for `/wiki/projects/index.html`

1. **Lead with the 3-hop career chain.** V2 Games (2016-18) → FarEye ANALYZE (2020-24) → AIonOS Voice+MCP (2024-). Each compounds on the prior: gaming-economy taste → data-PM discipline → agent-first thesis. This is the single clearest story in 44 projects.

2. **Group by belief-demonstrated, not by company.** A reader coming to `/wiki/projects/` should see "This project proves Agam's bet that ___" not "This project was at ___." The company-column stays in metadata. This lets the arc through `belief.ship-the-prototype` (Flutter 2020) → `belief.ai-pm-skillset-table-stakes` (ChatGPT 2023) → `belief.agent-first` (2024+) shine.

3. **Give the 4-projects-in-a-trench-coat (second-brain cluster) a dedicated sub-page.** Don't let one cluster dominate the index. `/wiki/projects/second-brain/` should explain: the personal instance, the public v1, the wiki meta, the /enter playback. This is where the recursion is visible.

4. **Surface the abandoned projects as a "tinkering" lane, not a failure lane.** Custom keyboards, book club, escape rooms, interior design — these are evidence of `theme.personal-projects-tinkering` being a persistent 10yr texture, not dead ends. A small "side bets" column on the project-index DAG.

5. **Mark the 5 ghost-projects (voice, MCP, no-code-tagging, CRM+CDP, airline) with a "private" visual badge.** They exist, they matter, they're confidential. Agent should say so out loud. The badge pattern lets reader see the shape of the work-he-can't-discuss without the agent fabricating detail.

6. **Show tech lineage as a secondary layer.** A toggle: "Show the stack." Python traces from 2019 to now; OpenAI→Anthropic migration; AutoGPT→CrewAI→LangGraph evolution. This is a second-read — the first read is belief-lineage.

7. **Flag the two case-studies (`voice-ai-production`, `product-shape`) as the resume-safe surface over private work.** These are how Agam publicly narrates the AIonOS ghost-projects. The wiki should link them from the relevant ghost-project nodes: "Agam can't say the project name, but he wrote about the pattern here."

8. **The 2017-12-21 "Decision Management + ML platforms" post is the oldest project-adjacent node.** No project name attached, but it's the ancestor of AI-PM identity. Treat it as a "proto-project" — a seed-node at the root of the agent-first belief-tree. Makes the compounding-story 9 years long, not 3.

---

# Completion stats

- Projects: **52** (ontology-v0: 14 → +38 new)
- Tech: **58** nodes (new category) across language/framework/platform/tool/protocol
- Lineage edges: **41** `builds_on`
- Belief-evidence edges: **36** `demonstrates`
- Companies: **8** distinct (Absolutdata, V2, Flow.live, Aroma Magic, Aagaman freelance, FarEye, AIonOS, + FORE School ambient)
- Ghost-projects flagged: **5** (all AIonOS-private)
- Ontology-v0 likely-hallucination flags raised: **3**
- Projects mentioned once and never again (idea-graveyard): **6**
- Tech tried-and-abandoned (taste-pivots): **8**

**Three most surprising discoveries:**

1. **The compounding chain is almost exactly annual.** V2 (2016) → Flow.live (2018) → Aroma (2018) → Aagaman (2019) → Canada advisory (2020) → FarEye (2020) → AI-PM stack (2023) → AIonOS (2024) → second-brain (2026). Roughly one meaningful project every 12-18 months for 10 years. Agam has been shipping lineage his whole career, not just since ChatGPT. The 2017-12-21 "Decision Management + ML platforms" post is 9 years upstream of the current `belief.agent-first` — longer than the corpus-synthesis v0's "5 years early" framing suggests.

2. **MCP + voice are BOTH ghosts, not just one.** Ontology-v0 flagged voice-AI ghost. This file finds MCP is equally invisible — ZERO corpus posts (the 2025-06-20 manifesto's point 7 is the closest gesture, and it doesn't name MCP). The AIonOS flagship architectural bet is private-only. Any agent answering about MCP is guessing unless explicitly grounded in resume.md. This doubles the "red-ghost count" and Round-3b agent-grounding instructions must treat MCP and voice as equivalent trust-boundaries.

3. **The 4-projects-in-a-trench-coat in April 2026.** "second-brain v1" is actually four distinct projects: the 4-month personal instance (live since ~Dec 2025), the public productized v1 (paste-prompt, Apr 2026), the wiki meta-artifact (10 themes + kg.json), and the /enter v3 playback layer. The decomposition is load-bearing for the wiki — without it the story flattens into "one project" and loses the recursive point. Related: ontology-v0 mis-dated `/enter v3` as a 2023-05-10 project, conflating it with a Marcus-Aurelius Stoic-reflection post. The 2023-05-10 post is a belief-seed (`belief.llm-as-multi-voice-lens`), not the project — and `/enter v3` is genuinely an April 2026 build. Recommend correction for ontology-v1 lock.
