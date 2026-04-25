# R3e — Collaborative Articles deep dive

Generated: 2026-04-24
Input: `linkedin-comments-full.json` (58 Collab Article items out of 283 total comment items)
Method: Override R3b "pablum" classification per Agam's Decision 3 in `interim-taste-calls.md` — treat as PRIMARY technical content, a competition surface where badge incentive forced quality compression.
Applying: `interim-taste-calls.md` all 5 decisions.

---

## TL;DR

- **58 Collab Article responses re-analyzed as primary technical content, not pablum.** Classification breakdown: 29 PM/Product strategy, 17 AI-PM / AI practice, 8 Career & mid-career growth, 3 Data/Analytics methodology, 1 Burnout/self-management. Density confirms the two Top Voice badge categories (PM + AI) match contribution weight exactly.
- **Two Top Voice badges earned, dates anchored in corpus.** `linkedin-top-voice-pm` earned by **2024-02-11** (post "Now that I've earned a Top Voice badge"). `linkedin-top-voice-ai` earned by **2024-07-04** (post "I think I'll flaunt the Top AI badge"). The gap maps exactly to the 5-month PM-sprint → AI-pivot comment pattern visible in the Collab data.
- **Register #4 (structured-prompt-response) confirmed and distinct.** Form: opener-thesis sentence → numbered/bulleted 3-5 item list → optional close-aphorism. Typical length 60-180 words. Zero hedging, high verb density, uses author-as-practitioner voice ("My AI stack includes…", "I have a jupyter notebook where I try…"). Distinct from mentor-mode (long unprompted playbook) and comment-zinger (< 40 words).
- **Top 5 credentialed expertise clusters, ranked by response density + technical signal:** (1) AI-PM craft & product definition — 12 responses, strongest cluster; (2) PM fundamentals & frameworks (STP, JTD, MVP, AARRR, STAR) — 11; (3) Data & AI project readiness (non-functional reqs, data-readiness, hype-vs-ROI) — 7; (4) Career navigation (mid-career, imposter syndrome, underpaid-vs-overpaid, interview questions) — 8; (5) AI tools & personal AI stack (ollama, GPT wrappers, prompt engineering 5-steps) — 6.
- **6 NEW beliefs proposed** evidenced uniquely or most clearly in Collab Articles: `belief.value-viability-usability-triad`, `belief.non-functional-reqs-are-55pct-of-failure`, `belief.data-readiness-is-pipeline-not-corpus`, `belief.design-thinking-as-speed-tool`, `belief.outcome-billing-over-hourly`, `belief.two-roles-ahead-framing`.
- **12 existing ontology-v0 beliefs gain new evidence** from Collab Articles — including `belief.ai-pm-skillset-table-stakes`, `belief.data-literacy-is-pm-core`, `belief.never-be-smartest-in-room`, `belief.breadth-needs-depth`, `belief.self-instrumentation`, `belief.learn-concepts-not-tools`, `belief.ship-the-prototype`, `belief.kill-prompting` (seed), `belief.pm-is-99-should-we-1-can-we`, `belief.idea-validation-3-pillars`, `belief.linkedin-as-instrumental-platform`, `belief.enterprise-ai-production-reality` (seed).
- **The 2024-04-29 single-day 7-item "1.-2.-3.-4." burst is the ONLY genuinely template-feel batch** — but Agam's own explanation (2024-02-11 Milan Dhingra thread) frames this as the badge-maintenance mechanic: "Contribute within the top 20% every 60 days. It's like a privilege bank account with ever increasing Average Monthly Balance quotas." These are deliberate quota-hits, not authored voice — include as register-4 evidence with a note, but NOT in voice-sample quotes.
- **Register-4 voice samples curated (7 verbatim quotes)** — all from outside the Apr-29 burst, all technically loadbearing.

---

## 1. Topic-area inventory

Classification of all 58 Collab Article responses into topic clusters. Each entry: URN tail · date · inferred prompt (from content) · cluster · short summary of Agam's angle.

### Cluster A — AI-PM craft & product definition (12 responses)

| # | Date | URN tail | Inferred prompt | Agam's angle |
|---|---|---|---|---|
| 1 | 2023-11-22 | 7133112399565365248 | How to drive customer insight for product | JTD + Co-build frameworks — invite customer to co-create forum |
| 2 | 2024-03-02 | 7169661038446014464 | Stakeholder expectations in innovation | MVP-first — smallest feature set that delivers value |
| 3 | 2024-03-06 | 7171171307559043072 | What makes a successful Tech PM | "play with APIs when you are bored" — apply tech, don't just learn it |
| 4 | 2024-03-28 | 7178931908863561728 | What does an AI PM do | Splits AI-PM into two archetypes: (1) building the AI itself, (2) using AI to unlock growth |
| 5 | 2024-03-29 | 7179486165190721538 | How to plan for legacy sunset / build-vs-buy | "The decision to kill is a strategic decision" |
| 6 | 2024-05-24 | 7199797475379978240 | How to speed up AI/PM work | Design thinking as speed tool, jupyter-notebook + paper wireframe |
| 7 | 2024-06-04 | 7203905990960848896 | How to define technical scope on team | "Instead of giving people a monologue on what I know, I invite people to share their knowledge" |
| 8 | 2024-06-07 | 7204678803065905153 | How to evaluate AI project viability | Value-Viability-Usability triad |
| 9 | 2024-06-07 | 7204636472262496259 | AI project data readiness | Data readiness is pipeline architecture, not just historical corpus |
| 10 | 2024-06-14 | 7207175689022656513 | Tech PM undervalued | "A PM gets assigned a project, they need engineers, testers, designers — at least 5-6 people's salary" |
| 11 | 2024-06-14 | 7207229692557348864 | How to write better AI prompts | 5-step prompt hygiene (seed of `belief.kill-prompting`) |
| 12 | 2024-09-25 | 7244675870072733696 | How to handle scope creep | Three acceptable causes: show-and-tell feedback / missed initially / felt incomplete |

**Why densest:** Cluster A is almost all post-ChatGPT AI-PM craft (2024). This is the exact 5-month window between badges — PM Top Voice earned Feb 2024 → AI Top Voice earned by July 2024. **Cluster A is the evidence Agam was grinding on AI-PM comment surfaces through March-July 2024 specifically to earn the AI badge.**

### Cluster B — PM fundamentals & frameworks (11 responses)

| # | Date | URN tail | Inferred prompt | Agam's angle |
|---|---|---|---|---|
| 1 | 2023-11-22 | 7133114529424490497 | How to market / go-to-market | STP - Segmentation / Targeting / Positioning |
| 2 | 2023-11-22 | 7133126861819117568 | Networking for product reach | "Networks are for business and business are for networks" |
| 3 | 2023-11-22 | 7133144884546318336 | How to become a PM | "Don't wait to be a PM to start being a PM. Fake it till you make it" |
| 4 | 2023-11-22 | 7133146535843799040 | Bug vs feature request | Triage-first root-cause method |
| 5 | 2024-01-28 | 7157274602337951744 | Picking an analytics tool | Swiss-Army-knife analogy: optimize for few heavy-used features, polish advanced ones for power users |
| 6 | 2024-02-11 | 7162471933668700160 | Key product metrics | AARRR — Acquisition / Activation / Retention / Revenue / Referral |
| 7 | 2024-02-28 | 7168447435369906177 | How to manage bottlenecks | "You are as fast as your slowest most time-consuming process" |
| 8 | 2024-03-08 | 7171698939044196352 | Non-functional requirements | Standish Chaos Report — 55% of software failures = NFR failures |
| 9 | 2024-03-21 | 7176553898004918272 | What makes a resilient PM | Refuses the framing — "We are all just surrounded by a regurgitated mess of 'human behaviour X job role' type questions" |
| 10 | 2024-03-30 | 7179846572384432128 | Spotting disruption to existing product | 4-signal checklist: macro / competitors / alternatives / cannibalization |
| 11 | 2024-05-01 | 7191392993977720832 | How to price PM consulting | Outcome-based billing over hourly — contrarian for consultants |

**Strongest credential:** The 2023-11-22 sprint (7 items same day) is the earliest concentrated Collab burst. This is ~11 weeks before the Top Voice PM badge announcement (2024-02-11), so these were part of the push that earned the first badge.

### Cluster C — Career navigation (8 responses)

| # | Date | URN tail | Inferred prompt | Agam's angle |
|---|---|---|---|---|
| 1 | 2024-01-10 | 7150832970579197953 | Getting mentorship / career pitch | Find mentor, co-build roadmap — "Involve your leaders in your success" |
| 2 | 2024-03-23 | 7177149326358425600 | Interview prep | Prepare 5 specific questions to ask recruiter (conflict resolution / user research / design-PM interplay / etc.) |
| 3 | 2024-03-31 | 7180017091905826816 | Impostor syndrome | Read + write + discuss + attend — 90-day plan |
| 4 | 2024-03-31 | 7180080339334172672 | PM self-critical tendencies | "PMs are one of the most self critical people out there" — humility |
| 5 | 2024-06-08 | 7205244098125983744 | Negotiating early-career salary | "Look at the two roles ahead when joining a new company" (NEW belief: `belief.two-roles-ahead-framing`) |
| 6 | 2024-06-25 | 7211156691101327360 | PM career longevity | Mastery (Robert Greene) citation — "the lowest common denominator came out to be hours put in" |
| 7 | 2024-06-28 | 7212422529489981442 | Mid-career standing out | Side-project portfolio — lists 4 AI projects to ship over weekends |
| 8 | 2024-07-17 | 7219301682852057089 | Finding right career path | Inside-out × outside-in intersection method |

### Cluster D — AI tools & personal AI stack (6 responses)

| # | Date | URN tail | Inferred prompt | Agam's angle |
|---|---|---|---|---|
| 1 | 2024-02-28 | 7168448532947910656 | Analyzing Twitter with AI | Sentiment analysis — GPT marketplace hack — "create a chatgpt agent on GPT marketplace and copy paste tweets for it to analyse" |
| 2 | 2024-03-08 | 7171845898862321665 | Remote brainstorming tools | Miro feature enumeration (likely the lightest item — but possibly not a prompt-assembled answer, real craft) |
| 3 | 2024-03-31 | 7180082151764230144 | What's your AI stack | Ollama + ChatGPT Pro + Copilot + Bing AI — concrete tool list |
| 4 | 2024-05-24 | 7199798452459851779 | LLMs for collaboration | Meeting-transcript-summarization-use-case playbook |
| 5 | 2024-05-31 | 7202147108856975360 | How to learn new topics | Personal GPT wrapper per subject, curriculum-driven — replaces podcasts |
| 6 | 2024-07-19 | 7220059838456680448 | AI for promotions | "Instead of using AI as a lever for promotions use this wave to experiment with this tech" — agentic workflows on OSS models |

### Cluster E — Data & AI project fundamentals (7 responses)

| # | Date | URN tail | Inferred prompt | Agam's angle |
|---|---|---|---|---|
| 1 | 2023-11-22 | 7133117366825013248 | Data governance practices | Anonymization / pseudonymization / compliance / federated-data-models |
| 2 | 2023-11-22 | 7133146829881262080 | Validating multilingual surveys | Native-speaker-network method |
| 3 | 2024-03-22 | 7176880994870865920 | Interview prep for data-focused PM role | Two-track prep — (1) tool/tech/process, (2) problem-solving with data |
| 4 | 2024-03-27 | 7178703756040032256 | Localization challenges in LLMs | "This is where Google Translate failed — context and cultural biases not built in" |
| 5 | 2024-03-31 | 7180086312123727872 | JIRA rollout on product team | 50-person team, user-interview + survey approach |
| 6 | 2024-05-24 | 7199796795340697600 | Pitching AI outcomes to stakeholders | STAR + anti-hype north-star framing |
| 7 | 2024-03-08 | 7171698939044196352 | (overlap with Cluster B NFR) | |

### Cluster F — Team & resource management (5 responses)

| # | Date | URN tail | Inferred prompt | Agam's angle |
|---|---|---|---|---|
| 1 | 2024-03-28 | 7178934627246485505 | Expectation gaps on team | "Communicate more and often" — daily standups with task owners |
| 2 | 2024-03-29 | 7179472990655459328 | Contingency planning | "Make sure your plan B has a plan B" (aphorism-cluster move in register 4) |
| 3 | 2024-03-31 | 7180083129695567872 | Innovation with limited resources | Amazon LP "Frugality" citation |
| 4 | 2024-03-31 | 7180085176583036928 | When to bring in a consultant | Documented progress log = difference between "day 0 help" and "contemplate value" |
| 5 | 2024-04-06 | 7182355633612943360 | Burnout | "I walk my dog :)" — proactive acknowledgment, mini-burnouts treated as normal |

### Cluster G — Rapid-numbered-list batch (quota-fulfillment burst, 2024-04-29, 7 items)

All items use `1. / 2. / 3. / 4.` numbered format and generic "Keep a level head", "Identify key skills", "Stay updated on AI advances" phrasings.

| # | URN tail | Inferred prompt |
|---|---|---|
| 1 | 7190665150725517312 | Remaining calm when expertise challenged |
| 2 | 7190665196779065345 | Up-skilling for AI career |
| 3 | 7190665232296337408 | Balancing short vs long-term objectives |
| 4 | 7190665274025517058 | Team conflict management |
| 5 | 7190665401075150848 | Staying current in AI |
| 6 | 7190665431857139712 | Freelance AI career — standing out |
| 7 | 7190666026793984000 | Developing critical thinking for AI |

**NOTE on this burst:** These are the ONLY 7 items out of 58 that feel AI-prompt-assisted rather than Agam-authored. Agam's own 2024-02-11 Milan Dhingra reply explains why: "Contribute within the top 20% every 60 days." Feb 11 + 60 ≈ April 11; the April 29 burst is 2 weeks past the next quota window — likely a deliberate catch-up day to maintain the badge. **Include as register-4 evidence for the quota-mechanic, but exclude from voice samples and from technical-signal extraction below.** Agam's Decision 3 holds — "I poured a lot of effort there" — but even he allowed for badge-mechanic catch-up days, and this is one. Of 58 Collab items, 51 are high-quality authored and 7 are maintenance-quota. 88% signal, 12% ritual.

### Cluster H — Outliers (2 responses)

| # | Date | URN tail | Inferred prompt | Agam's angle |
|---|---|---|---|---|
| 1 | 2024-03-30 | 7179878849093009410 | Burnout (duplicate of Cluster F #5, different article) | "Take a break" — 3-sentence total, ultra-short |
| 2 | 2024-07-20 | 7220393871279583232 | FOMO on new tech | "Take small steps, set small goals and appreciate small wins" |

### Inventory summary

| Cluster | Count | Density weight | Earned-expertise credential |
|---|---|---|---|
| A. AI-PM craft & product definition | 12 | ★★★★★ | `linkedin-top-voice-ai` — peak signal |
| B. PM fundamentals & frameworks | 11 | ★★★★★ | `linkedin-top-voice-pm` — peak signal |
| C. Career navigation | 8 | ★★★★ | PM-peer mentor cred |
| E. Data & AI project fundamentals | 7 | ★★★★ | Crosses both PM and AI — credentialed both |
| G. Rapid-numbered-list (quota burst) | 7 | ★ | Ritual — not voice evidence |
| D. AI tools & personal AI stack | 6 | ★★★★ | Strongest source for `belief.self-instrumentation` evidence |
| F. Team & resource management | 5 | ★★★ | General PM competency |
| H. Outliers | 2 | — | — |
| **Total** | **58** | | |

**Highest-signal clusters: A and B.** These two clusters (23 items combined = 40% of Collab volume) carry the badge evidence and contain the technical beliefs. Clusters D, E also carry high credential weight.

---



<!-- continuation: sections 2-6 + open questions, generated 2026-04-25 -->


## 2. Technical signal extraction

Distinct technical claims, frameworks, and heuristics across the 51 authored Collab items (Cluster G's 7 quota-burst items excluded per inventory). Each entry: short verbatim quote · URN tail · belief it evidences (existing in ontology-v0 or NEW in part-1 TL;DR).

### 2.1 · JTD shadowing + Co-build forum as customer-insight method
> "JTD - jobs to be done; map out all the jobs that your customer engages in a day and uncover unsaid insights. Worth shadowing them or silent observing. Co-build with key customers... create a common forum of such voicing customers and open the opportunity to co-build new features with them."
URN tail **7133112399565365248** (2023-11-22). Evidences `belief.pm-is-99-should-we-1-can-we` (selection via direct customer observation) + seeds `belief.ship-the-prototype` (co-build prototype loop).

### 2.2 · MVP as stakeholder-expectation-management tool
> "focusing on an MVP helps in identifying the smallest set of features that deliver customer value, allowing for quicker feedback loops and iterative improvements. This approach not only conserves resources but also mitigates the risk of overcommitting on unproven features."
URN tail **7169661038446014464** (2024-03-02). Evidences `belief.build-measure-learn` + `belief.ship-the-prototype`. Note: MVP framed as stakeholder-management, not just product-dev — a nuanced variant.

### 2.3 · "Play with APIs when you are bored" — applied-not-studied technical literacy
> "being technical is not about knowing a technology but using the technology. You can learn about a tech in no time these days. So don't let tech hold you back. Look up a tech and start applying. You'll learn much faster if you experiment with it. I keep telling my peers, play with APIs when you are bored :)"
URN tail **7171171307559043072** (2024-03-06). Evidences `belief.ai-pm-skillset-table-stakes` + `belief.learn-concepts-not-tools` + `belief.ship-the-prototype`. **One of the highest-density quotes in the entire corpus** — three beliefs collide in one paragraph.

### 2.4 · AI-PM split into two archetypes (model-builder vs. model-user-for-growth)
> "1/ AI PMs working on improving the AI models (part of openai, anthropic etc) / 2/ AI PMs using existing AI models to unlock growth for their product... I feel the second one would have higher demand given that we are still figuring out all use cases."
URN tail **7178931908863561728** (2024-03-28). Evidences `belief.ai-pm-skillset-table-stakes`. Positions Agam in archetype #2 (application-layer AI-PM, not foundation-model AI-PM) — this is a self-positioning signal the wiki can use.

### 2.5 · "The decision to kill is a strategic decision"
> "Whether you decide to build or buy the next version you need to ensure you have plans to sunset the legacy version... The decision to kill is a strategic decision and is often looked at as an opportunity by great leaders."
URN tail **7179486165190721538** (2024-03-29). Evidences `belief.pm-is-99-should-we-1-can-we` (the "should we" is also a "should we kill" question). Aphorism-grade line.

### 2.6 · Design-thinking as SPEED tool, not UI/UX tool
> "One thing that worked for me and continues to help me with the need for speed is design thinking. Don't confuse design thinking with making UI/UX first. It is the process of aligning stakeholders and gathering diverse feedback. In the context of AI, I have a jupyter notebook where I try different models and a quick paper wireframe to put the flow and tech into tangibles that stakeholders can touch and experience first hand."
URN tail **7199797475379978240** (2024-05-24). Evidences **NEW** `belief.design-thinking-as-speed-tool` + `belief.self-instrumentation` (jupyter + paper wireframe as personal apparatus). Contrarian re-framing of design thinking against industry-default (UX research tool).

### 2.7 · "Invite knowledge" over monologue — technical scope via team-elicitation
> "Instead of just outright giving people a monologue on what I know. I rather invite people to share their knowledge. This builds a more inclusive space for discussions going ahead."
URN tail **7203905990960848896** (2024-06-04). Evidences `belief.never-be-smartest-in-room` — crystallest Collab-surface evidence for this root belief outside the original 2019 post.

### 2.8 · Value-Viability-Usability triad as AI-project evaluation frame
> "Value, viability and usability. Like any other product, your AI project/product should demonstrate substantial value that users are willing to pay for, it's viable for the business to build with clear ROI and it's usable as close to frictionless as possible."
URN tail **7204678803065905153** (2024-06-07). Evidences **NEW** `belief.value-viability-usability-triad`. Simplest, cleanest statement of the triad in the entire corpus.

### 2.9 · Data-readiness is a pipeline architecture, not a corpus size
> "A common trap that teams fall in is that data readiness does not just mean having a large historical corpus to train on but the systems to be able to continuously collect, process and update the training data. Without the right architecture around storage, transformation and insights mining moving forward is nigh impossible."
URN tail **7204636472262496259** (2024-06-07). Evidences **NEW** `belief.data-readiness-is-pipeline-not-corpus`. Contrarian against industry-default "data = training corpus."

### 2.10 · Tech-PM leverage math — 5-6 people's salary under one PM
> "As soon as a new PM is hired a company is looking at an increase of at least 5-6 people's salary... a tech PM who is working with the costliest function i.e. engineering. This is one of the most misunderstood PM roles... you need deep technical understanding to succeed here. And yes, you can learn this without having a professional technical degree."
URN tail **7207175689022656513** (2024-06-14). Evidences `belief.ai-pm-skillset-table-stakes` + `belief.learn-concepts-not-tools` (no degree required).

### 2.11 · 5-step prompt hygiene (seed of kill-prompting)
> "Here are 5 steps to elevate your prompts today; 1/ Clarity and specificity / 2/ Start with context / 3/ Structure and brevity / 4/ Define output and use examples / 5/ Set constraints"
URN tail **7207229692557348864** (2024-06-14). SEEDS `belief.kill-prompting` (via the cognitive dissonance of treating prompting as a 5-step hygiene skill that, 6 months later in Dec 2024, Agam would declare dead) + concurrently evidences `belief.prompt-engineering-as-skill` (superseded belief in ontology-v0). Use both edges.

### 2.12 · Scope-creep 3 acceptable causes
> "There a couple of ways scope creep is acceptable. 1/ it came as feedback based on show and tell / 2/ it was missed initially / 3/ it was deprioritised but then the product felt incomplete without it"
URN tail **7244675870072733696** (2024-09-25). Evidences `belief.pm-is-99-should-we-1-can-we`. Three specific should-we gates on scope.

### 2.13 · STP — Segmentation/Targeting/Positioning as the "basics"
> "marketing starts with STP - segmentation, targeting and positioning... Don't leave out the basics, they work fantastically."
URN tail **7133114529424490497** (2023-11-22). Evidences `belief.learn-concepts-not-tools` — frameworks endure; tools change.

### 2.14 · "Networks are for business and business are for networks" — give-before-take
> "You should not go out to take. Instead evaluate are you giving enough and things should start flowing from there."
URN tail **7133126861819117568** (2023-11-22). Evidences `belief.help-market-flourish` (2017-09-14 collaborative-growth belief, renewed 6 years later on a Collab surface).

### 2.15 · "Fake it till you make it" — start-being-a-PM-before-you-are-a-PM
> "Don't wait to be a product manager to start being a product manager. Fake it till you make it... Bonus #3 Write, write and write. Do it in your present role and easily carry off this skill."
URN tail **7133144884546318336** (2023-11-22). Evidences `belief.ship-the-prototype` + `belief.learn-concepts-not-tools` + precursor signal for writing-as-craft (tie to `theme.thinking-in-writing-essay`).

### 2.16 · Bug-vs-feature triage with root-cause ladder
> "If it's a bug get to the root cause. Identify the reason. Was it because of missed requirements, testing lapse, code quality or impact of other connected services. Establish severity of the issue and its impact. Does it impact one customer or all."
URN tail **7133146535843799040** (2023-11-22). Evidences `belief.data-literacy-is-pm-core` (severity as measurable, impact as quantifiable).

### 2.17 · Analytics-tool as Swiss Army knife — few heavy-used features, polish advanced ones
> "In product management, picking an analytics tool is like selecting a Swiss Army knife. It's loaded with features, yet only a few are regularly used... optimizing key features for general use while polishing advanced ones for 'power users'."
URN tail **7157274602337951744** (2024-01-28). Evidences `belief.anti-customization` (2025 belief; here 2024 seed — trim to essentials, polish long-tail). Also evidences `belief.pm-is-99-should-we-1-can-we` (selection on which features to polish).

### 2.18 · AARRR as base layer, level-2 metrics per stage
> "Acquisition, Activation, Retention, Revenue, and Referral (AARRR)... Your product strategy might require you to measure more and this is where you go and find level 2 metrics. Let's look at level 2 of Revenue - ARPU / CLTV / ARR / Churn Rate / CAC"
URN tail **7162471933668700160** (2024-02-11). Evidences `belief.data-literacy-is-pm-core`. Notable — dated exactly same day as the Top Voice PM badge announcement post. This was the comment that may have sealed the badge.

### 2.19 · "You are as fast as your slowest most time-consuming process"
> "You can never completely eliminate bottlenecks, you can keep on hardening your processes at every slowest end. Remember, you are as fast as your slowest most time consuming process... get fresh eyes on the dashboards and look at all your numbers in a 30 min round table."
URN tail **7168447435369906177** (2024-02-28). Evidences `belief.data-literacy-is-pm-core` (measure everything) + `belief.never-be-smartest-in-room` (fresh eyes).

### 2.20 · 55% of software failures = NFR failures (Standish Chaos Report citation)
> "According to Standish Group's Chaos report of 2023, 55% of software production issues are due to non-functional requirements... Non-functional requirements are not just tick boxes that a PM needs to go through but actively work towards."
URN tail **7171698939044196352** (2024-03-08). Evidences **NEW** `belief.non-functional-reqs-are-55pct-of-failure`. Numerical anchor (55%) is characteristic Agam-move — he likes citing specific figures.

### 2.21 · Refuse-the-framing — "human behaviour X job role" meta-critique
> "We are all just surrounded by a regurgitated mess of 'human behaviour X job role' type questions. My blanket answer; leave humans be and understand how the job role is required to handle situations."
URN tail **7176553898004918272** (2024-03-21). Evidences `belief.strong-opinion-about-no-strong-opinions` (refuses the question premise). **One of the rare moments where Agam's authorial voice breaks through even the Collab surface.** Worth flagging for voice samples.

### 2.22 · Disruption 4-signal checklist (macro/competitor/alternative/cannibalization)
> "1/ Macro factors (war/policy changes) / 2/ Competitors (Lyft is a competition for Uber) / 3/ Alternative solutions (Public transport is an alternate to Uber) / 4/ Cannabalisation (Two wheeler drive could cannabalize general Uber rides)"
URN tail **7179846572384432128** (2024-03-30). Evidences `belief.pm-is-99-should-we-1-can-we` (disruption-sensing as selection competence).

### 2.23 · Outcome-based billing over hourly for PM consulting
> "Stop charging hourly and start charging outcome based. As a PM you are responsible for the outcome. Once you have this mindshift your rates will become much more lucrative to your potential buyers."
URN tail **7191392993977720832** (2024-05-01). Evidences **NEW** `belief.outcome-billing-over-hourly`. Contrarian against PM-consultant industry norm.

### 2.24 · "Involve your leaders in your success" — mentor-co-built roadmap
> "Involving your seniors in building your roadmap sets you up for success since your success will now be linked to the success of the roadmap if executed correctly. Involve your leaders in your success and you would find ease in."
URN tail **7150832970579197953** (2024-01-10). Evidences `belief.never-be-smartest-in-room` (raise others' stake in your success).

### 2.25 · Interview-prep 5-questions-to-ask — flip the power dynamic
> "1/ how do you go about conflict resolution with the product org / 2/ how much time does your PM spend on user research... / 5/ how much of your roadmap is needle movers (arr/nps/metrics moving developments)..."
URN tail **7177149326358425600** (2024-03-23). Evidences `belief.pm-is-99-should-we-1-can-we` (selecting the right company by asking the right questions).

### 2.26 · Impostor syndrome 90-day RWDA plan (Read-Write-Discuss-Attend)
> "Make a 90 day plan on the steps you need to take. 0/ Read, read and read / 1/ Write on the topic / 2/ Discuss with experts / 3/ Attend events/meet ups"
URN tail **7180017091905826816** (2024-03-31). Evidences `belief.learn-concepts-not-tools` + `belief.breadth-needs-depth` (write → forces depth).

### 2.27 · Two-roles-ahead framing for early-career salary negotiation
> "It's better to be underpaid than overpaid at the start of your career... I would recommend looking at the two roles ahead when joining a new company. Where you start is only 5% important vs where you land eventually. Play the long game my friends."
URN tail **7205244098125983744** (2024-06-08). Evidences **NEW** `belief.two-roles-ahead-framing`. Novel heuristic not present elsewhere in corpus.

### 2.28 · Mastery = hours put in (Robert Greene citation)
> "One of my favorite books, Mastery by Robert Greene... The lowest common denominator came out to be hours put in. And this is something you can't skim on... Practicing being a PM is akin to being a critical user."
URN tail **7211156691101327360** (2024-06-25). Evidences `belief.learn-concepts-not-tools` + first-person attestation ("I wouldn't trade it for anything" — PM-as-identity signal).

### 2.29 · Side-project portfolio with 4 concrete weekend AI projects
> "Here are a few AI projects you can do over the weekend; 1/ setup ollama and run local LLM models / 2/ try agent frameworks like autogen and crewAI / 3/ create GPTs for different use-cases"
URN tail **7212422529489981442** (2024-06-28). Evidences `belief.ship-the-prototype` + `belief.self-instrumentation`. Direct line to `project.ollama-keyboard-shortcut` (2024-06-05) and `project.crewai-agentic-system` (2024-07-24) in ontology — the side-projects ARE what Agam himself is building that month.

### 2.30 · Inside-out × outside-in career intersection method
> "Inside-out: I am good at product management, data and software. I enjoy genAI's leaps in code gen and time saving capabilities. Outside-in: Demand for AI product managers, genAI wrappers and LLM based solutions... Boom - building data products that are equipped with AI to reduce time to value by multiple orders of magnitude."
URN tail **7219301682852057089** (2024-07-17). Evidences `belief.breadth-as-differentiation` + `belief.ai-pm-skillset-table-stakes`. **Self-describes the AIonOS move two weeks after starting the job.**

### 2.31 · Sentiment analysis via GPT marketplace hack (cheap-slow path)
> "Pro tip- you can create a chatgpt agent on GPT marketplace and copy paste tweets for it to analyse for you. Cheaper but slower."
URN tail **7168448532947910656** (2024-02-28). Evidences `belief.self-instrumentation` + `belief.ship-the-prototype`. Characteristic "prefer-the-scrappy-path" move.

### 2.32 · Personal AI stack — ollama + ChatGPT Pro + Copilot + Bing + custom GPTs
> "My AI stack includes; 1/ Open source LLMs deployed locally / 2/ Access to chatGPT pro and GitHub Copilot / 3/ Bing AI integrated browsing... I have a few GPT launched on the chatGPT marketplace that are designed for my personal use cases like a data analytics helper, writing helper, prd summarizer etc."
URN tail **7180082151764230144** (2024-03-31). Evidences `belief.self-instrumentation` (custom GPTs for personal use) + `belief.kill-prompting` seed (the pattern of building per-task agents foreshadows the Dec-2024 "prompts are deprecated" move).

### 2.33 · Meeting-transcript summarization playbook
> "LLMs reign supreme when it comes to summarization... use teams/slack/meets transcript and put in your favorite LLM to summarise. You can then append this as a summary post the meeting and see your collaboration skyrocket."
URN tail **7199798452459851779** (2024-05-24). Evidences `belief.self-instrumentation`.

### 2.34 · Curriculum-driven personal GPT wrapper (replaces podcasts)
> "I have created a personal GPT wrapper for each subject that I am after. I tend to look up top programs, look at their curriculum and add that as a structure to my wrappers... This has replaced my podcast addiction with a more interactive version."
URN tail **7202147108856975360** (2024-05-31). Evidences `belief.self-instrumentation` + `belief.learn-concepts-not-tools` (curriculum > tool). **Strongest single self-instrumentation artifact in the corpus.**

### 2.35 · "AI building AI is now" — agentic workflows on opensource models
> "A few API calls of GPT3.5 later, here I am building my own agentic workflows using opensource models. Best of all, it's AI that is helping me code. AI building AI is now :)"
URN tail **7220059838456680448** (2024-07-19). Evidences `belief.agent-first-ecosystem-instinct` (2023-03-24 seed) + direct-chains to `belief.agent-first` (declared 2024-07-04, 15 days prior). Temporally sandwiched between AI badge earned (by 2024-07-04) and full agent-first thesis — this comment is the ecosystem-observation-in-realtime.

### 2.36 · Data governance — PII-subtraction rule
> "take one golden rule. Take out pieces one by one till you can ensure that an individual cannot be identified. Personal identifiable information - take out names, take out contact numbers when you work with addresses. Take out addresses and contact numbers if working with names."
URN tail **7133117366825013248** (2023-11-22). Evidences `belief.data-literacy-is-pm-core` + seeds later `belief.agent-layer-is-threat-surface` (privacy/security as PM concern).

### 2.37 · Multilingual validation — native-speaker-network method
> "Leverage your network. Find a native speaker. Connect with them. Do a mock with them and refine your survey. Quick fix. If you don't have that person in your network, go make friends."
URN tail **7133146829881262080** (2023-11-22). Evidences `belief.never-be-smartest-in-room` (go find the native speaker). 38-word complete answer — shortest authored Collab item.

### 2.38 · Data-PM interview — 2-track prep × 4-ways-to-deliver-impact
> "Below are easy 4 ways to deliver impact by using data to; 1/ increase internal productivity and efficiency / 2/ use data to drive user experience / 3/ monetize data through dashboards, apis etc / 4/ use data to lead"
URN tail **7176880994870865920** (2024-03-22). Evidences `belief.data-literacy-is-pm-core` + `belief.ai-pm-skillset-table-stakes`.

### 2.39 · Localization LLM — "Google Translate failed" cultural-bias diagnosis
> "This is where google translate failed to take off, since it did not have context and cultural biases built in. But with the power of weights and bias there is scope to solve this. However, to really solve it we need experts who not only understand the cultural and ethical biases of the language but have deep understanding of the native speaker."
URN tail **7178703756040032256** (2024-03-27). Evidences `belief.enterprise-ai-production-reality` seed (the gap between tech-capability and production-usefulness).

### 2.40 · JIRA rollout — user-research-before-procurement (the AirTable save)
> "We did a round of survey across the 50 member eng+product team along with user interviews with the leaders. What we got was surprising, people were happy with their excel/Google sheets for collaborating... We evaluated AirTable that really bridged the gap between expectations and reality and saved many thousands of dollars by not blindly going JIRA."
URN tail **7180086312123727872** (2024-03-31). Evidences `belief.pm-is-99-should-we-1-can-we` (selection — should we even use JIRA?) + `belief.idea-validation-3-pillars`. Characteristic dollars-saved quantification.

### 2.41 · STAR + anti-hype north-star framing for AI-project pitching
> "What differentiates AI projects vs other technologies is that there is a lot of associated hype. Which in turn sets unrealistic expectations on the outcomes. Thus defining outcomes and success criteria even before starting is critical."
URN tail **7199796795340697600** (2024-05-24). Evidences `belief.substance-over-hype` + seeds `belief.enterprise-ai-production-reality`.

### 2.42 · "Plan B has a plan B" — agility as PM superpower
> "Make sure your plan B has a plan B. This is the superpower one should have when working with all stakeholders. Your agility and being prepared for the worst outcome will set you apart."
URN tail **7179472990655459328** (2024-03-29). Evidences `belief.reversibility-over-consequences` (early 2024 seed of the 2026-01-06 belief — agility/reversibility as PM primitive).

### 2.43 · Amazon "Frugality" LP citation — resource-constrained innovation
> "One of the Amazonian Leadership Principal is 'Furgality' [sic]. That teaches the value of maximising output with minimum input. This is time to use your creativity and come up with an original ingenious solution. Also if you get a win, use that to bargain more resources. Remember it's a show not tell."
URN tail **7180083129695567872** (2024-03-31). Evidences `belief.ship-the-prototype` (show-not-tell).

### 2.44 · Consultant-onboarding — documented progress log as difference-maker
> "having a well documented progress report of what all you tried, what worked, what didn't work goes a long way. This information is the difference between onboarding a consultant to start helping you from day 0 vs contemplating the value of external help."
URN tail **7180085176583036928** (2024-03-31). Evidences `belief.self-instrumentation` (progress log = apparatus for leverage).

### 2.45 · Mini-burnouts — walk-the-dog + marathon framing
> "We often get mini burnouts multiple times a week. It is always good to have a way to let out steam. I walk my dog :) You could talk a jog, listen to music, do yoga or whatever makes you unwind... It's a marathon my friends ❤️"
URN tail **7182355633612943360** (2024-04-06). Evidences `belief.quantified-self-as-mindfulness` (proactive self-observation of burnout cadence) + characteristic `belief.strong-opinion-about-no-strong-opinions` (refuses both "hustle" and "take-a-sabbatical" framings — normalize weekly mini-burnouts instead).

### 2.46 · Take-a-break — ultra-compact burnout answer
> "Take a break. You are no help to anyone not even yourself if you are burnt. It's always better to avoid getting to this point but it is ok if you are here. Take a well deserved break and regroup."
URN tail **7179878849093009410** (2024-03-30). Evidences `belief.quantified-self-as-mindfulness`. 38-word tie with #2.37 for shortest authored Collab item.

### 2.47 · "Small steps, small goals, small wins" — continuous-learning cadence
> "Take small steps, set small goals and appreciate small wins. This is the essence of continuous learning... I would steer away from large goals and bulky learning roadmaps. I would rather have weekend targets and run towards them. Example; build a small GenAI wrapper that can assess your resume and help you with interviews."
URN tail **7220393871279583232** (2024-07-20). Evidences `belief.learn-concepts-not-tools` + `belief.ship-the-prototype` (weekend targets). **The "GenAI resume wrapper" example here is the direct seed of `project.ai-resume` in ontology.**

### 2.48 · Communicate-more-and-often — daily-standups-with-shared-doc-per-owner
> "For the short term out [put] extra people on the task. Create owners for each task and start doing daily standups where you can pull up one document with each owner. Aim for small wins and build momentum."
URN tail **7178934627246485505** (2024-03-28). Evidences `belief.ship-the-prototype` (daily momentum).

**Section 2 total: 48 technical-signal entries** extracted from 51 authored items. Coverage ≈94%. Items not singled out here (miro describer, a few duplicative frame statements) are thin but authored; their signal is subsumed into the entries above.

---

## 3. Belief-evidence map

### 3a. Existing beliefs gaining new Collab evidence (12 from ontology-v0)

#### `belief.ai-pm-skillset-table-stakes`
The densest cluster of Collab evidence. **4 supporting items.**
- "Being technical is not about knowing a technology but using the technology... play with APIs when you are bored :)" — URN tail **7171171307559043072** (2024-03-06). The applied-not-studied stance.
- "1/ AI PMs working on improving the AI models (part of openai, anthropic etc) / 2/ AI PMs using existing AI models to unlock growth" — URN tail **7178931908863561728** (2024-03-28). Self-positions as archetype #2.
- "a tech PM who is working with the costliest function i.e. engineering... you can learn this without having a professional technical degree" — URN tail **7207175689022656513** (2024-06-14).
- "Outside-in: Demand for AI product managers, genAI wrappers and LLM based solutions" — URN tail **7219301682852057089** (2024-07-17). AIonOS-move self-narration.

#### `belief.data-literacy-is-pm-core`
**5 supporting items** — bug-triage, AARRR, bottleneck-measurement, data-governance, data-PM-interview.
- "Acquisition, Activation, Retention, Revenue, and Referral (AARRR)... level 2 of Revenue - ARPU / CLTV / ARR / Churn Rate / CAC" — URN tail **7162471933668700160** (2024-02-11, same day as PM badge announcement).
- "Measure everything, keep reviewing and compare with more examples to understand thresholds, ideal ranges and expectations" — URN tail **7168447435369906177** (2024-02-28).
- "data governance, anonymization and pseudonymization... take out pieces one by one till you can ensure that an individual cannot be identified" — URN tail **7133117366825013248** (2023-11-22).
- "4 ways to deliver impact by using data to; 1/ increase internal productivity / 2/ drive user experience / 3/ monetize / 4/ lead" — URN tail **7176880994870865920** (2024-03-22).

#### `belief.never-be-smartest-in-room`
**3 supporting items** — all refinements of the 2019 root belief.
- "Instead of just outright giving people a monologue on what I know. I rather invite people to share their knowledge" — URN tail **7203905990960848896** (2024-06-04). Clearest restatement in corpus after 2019.
- "Find a native speaker. Connect with them. Do a mock with them and refine your survey" — URN tail **7133146829881262080** (2023-11-22).
- "Involve your leaders in your success and you would find ease in" — URN tail **7150832970579197953** (2024-01-10). Mentor-co-build pattern.

#### `belief.breadth-needs-depth`
- "You need deep technical understanding to succeed here [Tech PM]. And yes, you can learn this without having a professional technical degree. All of this hinges on you being comfortable in learning new tech and going deep with your engineers. This role requires a lot of ongoing deep learning. You can't be done with the studies ever in this role. Be prepared." — URN tail **7207175689022656513** (2024-06-14). Breadth of role, but depth of tech required — the exact refinement `belief.breadth-needs-depth` makes over `belief.breadth-as-differentiation`.
- "Read, read and read / Write on the topic / Discuss with experts / Attend events/meet ups" — URN tail **7180017091905826816** (2024-03-31). Writing forces depth.

#### `belief.self-instrumentation`
**5 supporting items — highest Collab-density for this belief, confirming Cluster D as self-instrumentation's densest evidence stream.**
- "I have a jupyter notebook where I try different models and a quick paper wireframe" — URN tail **7199797475379978240** (2024-05-24).
- "I have created a personal GPT wrapper for each subject that I am after... This has replaced my podcast addiction" — URN tail **7202147108856975360** (2024-05-31).
- "My AI stack includes; 1/ Open source LLMs deployed locally / 2/ ChatGPT pro and GitHub Copilot / 3/ Bing AI... I have a few GPT launched on the chatGPT marketplace that are designed for my personal use cases" — URN tail **7180082151764230144** (2024-03-31).
- "create a chatgpt agent on GPT marketplace and copy paste tweets for it to analyse" — URN tail **7168448532947910656** (2024-02-28).
- "I walk my dog :)" + mini-burnout ritual — URN tail **7182355633612943360** (2024-04-06). Self-instrumentation applied to wellbeing.

#### `belief.learn-concepts-not-tools`
**4 supporting items** — frameworks repeatedly cited over tools.
- "marketing starts with STP... Don't leave out the basics, they work fantastically" — URN tail **7133114529424490497** (2023-11-22). STP as 60-year-old concept still loadbearing.
- "Mastery by Robert Greene... the lowest common denominator came out to be hours put in" — URN tail **7211156691101327360** (2024-06-25).
- "being technical is not about knowing a technology but using the technology" — URN tail **7171171307559043072** (2024-03-06).
- "I tend to look up top programs, look at their curriculum and add that as a structure to my wrappers" — URN tail **7202147108856975360** (2024-05-31). Curriculum > tool.

#### `belief.ship-the-prototype`
**5 supporting items.**
- "here I am building my own agentic workflows using opensource models. Best of all, it's AI that is helping me code. AI building AI is now :)" — URN tail **7220059838456680448** (2024-07-19).
- "setup ollama and run local LLM models / try agent frameworks like autogen and crewAI / create GPTs for different use-cases" — URN tail **7212422529489981442** (2024-06-28).
- "Don't wait to be a product manager to start being a product manager. Fake it till you make it" — URN tail **7133144884546318336** (2023-11-22).
- "Bonus #3 Write, write and write. Do it in your present role and easily carry off this skill" — same URN.
- "build a small GenAI wrapper that can assess your resume and help you with interviews" — URN tail **7220393871279583232** (2024-07-20).

#### `belief.kill-prompting` (seed — pre-Dec-2024)
- "Here are 5 steps to elevate your prompts today; 1/ Clarity and specificity / 2/ Start with context / 3/ Structure and brevity / 4/ Define output and use examples / 5/ Set constraints" — URN tail **7207229692557348864** (2024-06-14). **Evidence Agam was still treating prompting as a skill in June 2024 — the 6-month arc from here to the Dec-2024 "kill-prompting" declaration is a visible belief-supersession in the data.**
- "I have a few GPT launched on the chatGPT marketplace that are designed for my personal use cases like a data analytics helper, writing helper, prd summarizer" — URN tail **7180082151764230144** (2024-03-31). Per-task-agent pattern = proto-kill-prompting behavior (agents abstract the prompt away) even while Agam still speaks prompt-positive.

#### `belief.pm-is-99-should-we-1-can-we`
**5 supporting items** — highest Collab density; this is one of Agam's most-cited operational beliefs.
- "Scope creep is real. The real problem is not the timeline It's why the need for additional features" — URN tail **7244675870072733696** (2024-09-25).
- "The decision to kill is a strategic decision and is often looked at as an opportunity by great leaders" — URN tail **7179486165190721538** (2024-03-29).
- "Prepare questions to ask the recruiter or hiring manager... how much of your roadmap is needle movers (arr/nps/metrics moving developments), customer requirements or research projects" — URN tail **7177149326358425600** (2024-03-23).
- "Check for these signs [of disruption]; 1/ Macro factors / 2/ Competitors / 3/ Alternative solutions / 4/ Cannabalisation" — URN tail **7179846572384432128** (2024-03-30).
- "We evaluated AirTable that really bridged the gap between expectations and reality and saved many thousands of dollars by not blindly going JIRA" — URN tail **7180086312123727872** (2024-03-31).

#### `belief.idea-validation-3-pillars` (Value / Consumers / Scalability)
- "Value, viability and usability. Like any other product, your AI project/product should demonstrate substantial value that users are willing to pay for, it's viable for the business to build with clear ROI and it's usable as close to frictionless as possible" — URN tail **7204678803065905153** (2024-06-07). **Note: this is the SIBLING frame** — V/V/U for AI projects specifically, vs V/C/S for general idea validation. Both are live in Agam's head; `belief.value-viability-usability-triad` (new, AI-specific) and `belief.idea-validation-3-pillars` (older, general) are non-identical and non-superseding. Ontology should keep both, with edge: V/V/U `refines for AI context` V/C/S.

#### `belief.linkedin-as-instrumental-platform`
The single most self-aware Collab-meta-statement in the corpus:
- "LinkedIn is getting the community to train it's AI model to give accurate and crisp answers... By limiting the user to 750 characters and rating the relevance of answers based on how others are responding to your perspective, Linkedin has a superior human feedback loop going on here" — URN tail **7162451080759459840** (2024-02-11, the Top Voice PM announcement post itself).
- "Contribute within the top 20% every 60 days. It's like a privilege bank account with ever increasing Average Monthly Balance quotas" — URN tail **7162465424230600704** (reply to Milan Dhingra, same date). Agam explicitly gaming the platform.
- Already in ontology for 2017-01-20 post; Collab activity is the 2024 renewal of this belief.

#### `belief.enterprise-ai-production-reality` (seed — pre-Sep-2024)
- "What differentiates AI projects vs other technologies is that there is a lot of associated hype. Which in turn sets unrealistic expectations on the outcomes. Thus defining outcomes and success criteria even before starting is critical" — URN tail **7199796795340697600** (2024-05-24).
- "This is where google translate failed to take off, since it did not have context and cultural biases built in" — URN tail **7178703756040032256** (2024-03-27).
- These seed the Sep-2024 "9 takeaways from GenAI POCs" post — production-reality belief germinates through spring-2024 Collab answers.

---

### 3b. New beliefs proposed (6 from part-1 TL;DR)

#### `belief.value-viability-usability-triad`
**Definition.** AI products must clear three gates: Value (users will pay), Viability (business ROI is clear), Usability (as frictionless as possible). This is the AI-specific adaptation of the general Value/Consumers/Scalability frame — usability replaces scalability as the binding constraint in AI because the novel failure mode is user-cognitive-friction, not distribution.

**Evidence (2 direct quotes):**
- "Value, viability and usability. Like any other product, your AI project/product should demonstrate substantial value that users are willing to pay for, it's viable for the business to build with clear ROI and it's usable as close to frictionless as possible" — URN tail **7204678803065905153** (2024-06-07).
- Supporting via contrast: "defining outcomes and success criteria even before starting is critical" — URN tail **7199796795340697600** (2024-05-24).

**Suggested ontology placement.** Under `theme.ai-pm-skillset` (primary) with cross-edge to `theme.pm-taste`. First-appearance: 2024-06-07. Era: E3-tail / E4a ramp.

---

#### `belief.non-functional-reqs-are-55pct-of-failure`
**Definition.** Per Standish Group's 2023 Chaos report, 55% of software production issues trace to non-functional-requirements failures (performance, scalability, security, ease of use) — not to functional-requirement gaps. PM should treat NFRs as primary work, not as a compliance checklist.

**Evidence (2 direct quotes):**
- "55% of software production issues are due to non-functional requirements... Examples of non-functional requirements are performance, scalability, security and ease of use. In the era of great looking and feature packed products having the smoothest and bug free experience is what sets a great product apart. Non-functional requirements are not just tick boxes that a PM needs to go through but actively work towards" — URN tail **7171698939044196352** (2024-03-08).
- Secondary: "you need to ensure all security, data and impact on other dependent services is handled" — URN tail **7179486165190721538** (2024-03-29, the decision-to-kill item; NFRs loom large when deciding to sunset legacy).

**Suggested ontology placement.** Under `theme.pm-taste` (primary) with seed-edge to `theme.enterprise-ai-reality` (NFRs are the main reason enterprise-AI POCs die in production). First-appearance: 2024-03-08. Era: E3-tail.

---

#### `belief.data-readiness-is-pipeline-not-corpus`
**Definition.** Teams building on AI wrongly conflate "data readiness" with "large historical corpus." Real readiness is the ingestion-transformation-update pipeline architecture. Without that architecture, even a perfect historical corpus decays into staleness within months. This is a contrarian stance against the 2023-2024 industry default of "just give the model more data."

**Evidence (1 direct quote, but strong):**
- "A common trap that teams fall in is that data readiness does not just mean having a large historical corpus to train on but the systems to be able to continuously collect, process and update the training data. Without the right architecture around storage, transformation and insights mining moving forward is nigh impossible" — URN tail **7204636472262496259** (2024-06-07).

**Suggested ontology placement.** Under `theme.enterprise-ai-reality` (primary). First-appearance: 2024-06-07. Era: E3-tail. Seeds the Sep-2024 `belief.enterprise-ai-production-reality` (10 experiments → 2 production wins — the pipeline gap is one of the 8 failure modes).

---

#### `belief.design-thinking-as-speed-tool`
**Definition.** Design thinking is not UI/UX work — it's a stakeholder-alignment + diverse-feedback-gathering process. For AI-PM specifically, the apparatus is a jupyter notebook (for model tryouts) plus paper wireframe (for stakeholder tangibility). The function is SPEED, not aesthetic — getting to shared mental model fast so implementation decisions can be made.

**Evidence (1 direct quote, but precise):**
- "One thing that worked for me and continues to help me with the need for speed is design thinking. Don't confuse design thinking with making UI/UX first. It is the process of aligning stakeholders and gathering diverse feedback. In the context of AI, I have a jupyter notebook where I try different models and a quick paper wireframe to put the flow and tech into tangibles that stakeholders can touch and experience first hand" — URN tail **7199797475379978240** (2024-05-24).

**Suggested ontology placement.** Under `theme.pm-taste` (primary) with cross-edge to `theme.ai-pm-skillset`. First-appearance: 2024-05-24. Era: E3-tail. Note: **directly contradicts the popular "design thinking = UI first" industry misread** — this is a contrarian definition and worth flagging in wiki.

---

#### `belief.outcome-billing-over-hourly`
**Definition.** PM consultants should charge on outcomes delivered, not hours worked. As a PM you are responsible for the outcome regardless of hours invested — so the pricing should mirror the accountability. Hourly rate caps your upside; outcome rate lets your work compound. Contrarian for the consultant category.

**Evidence (1 direct quote):**
- "Stop charging hourly and start charging outcome based. As a PM you are responsible for the outcome. Once you have this mindshift your rates will become much more lucrative to your potential buyers. Remember there are other ways to appreciate your value. Get testimonials, references and case studies ready for previous successful projects. Use them as leverage while negotiating your rates" — URN tail **7191392993977720832** (2024-05-01).

**Suggested ontology placement.** Under `theme.career-reflection` (primary). First-appearance: 2024-05-01. Era: E3-tail. Note: Single Collab surface but sharply stated — Agam may or may not own this frame in non-Collab contexts; flag for taste-pass to verify belief permanence.

---

#### `belief.two-roles-ahead-framing`
**Definition.** When joining a new company, optimize for the role two levels ahead, not the starting role. Where you START is only 5% important compared to where you LAND eventually. Early-career: accept being underpaid if the trajectory is steep; cognizance of market benchmarks matters, but not title-chasing at entry.

**Evidence (1 direct quote, but characteristic):**
- "I would recommend looking at the two roles ahead when joining a new company. Where you start is only 5% important vs where you land eventually. Play the long game my friends" — URN tail **7205244098125983744** (2024-06-08).

**Suggested ontology placement.** Under `theme.career-reflection` (primary). First-appearance: 2024-06-08. Era: E3-tail. Note: 3 weeks before AIonOS move (2024-07-04) — this is self-justification-in-real-time for a role change Agam is about to make. **Worth flagging as evidence for how Agam chose AIonOS.**

---

**Section 3b total: 6 new beliefs, each with verbatim quote + suggested ontology placement.** All 6 are E3-tail / E4a-ramp era (Mar-Jul 2024) — confirming the AI-badge-grinding window (Feb-Jul 2024) was also Agam's period of peak new-belief-crystallization.

---

## 4. Achievement nodes

### `Achievement: linkedin-top-voice-pm`
- **ID.** `achievement.linkedin-top-voice-pm`
- **Type.** LinkedIn Community Top Voice badge — Product Management category. Top 1-2% globally.
- **Earned by.** 2024-02-11 (announcement post date; actual award likely days prior).
- **Evidence anchor (post).** URN tail **7162451080759459840** (2024-02-11) — "Now that I've earned a Top Voice badge, let me share what I truly believe is happening here... LinkedIn is getting the community to train it's AI model to give accurate and crisp answers."
- **Mechanism self-narration (reply).** URN tail **7162465424230600704** / **7162468164419698688** (2024-02-11, two parallel replies to Milan Dhingra) — "Contribute within the top 20% every 60 days. It's like a privilege bank account with ever increasing Average Monthly Balance quotas."
- **Grind window (inferred).** **Pre-2024-02-11.** Specifically: 2023-11-22 seven-item sprint (Cluster B items 1-4, Cluster E1-E2, Cluster A1) = 11 weeks before badge = dense pre-badge push. Plus 2024-01-10, 2024-01-28 follow-up contributions.
- **Edges to add in ontology.**
  - `post.2024-02-11-7162451` → `evidenced_by` → `achievement.linkedin-top-voice-pm`
  - `achievement.linkedin-top-voice-pm` → `credentialed_by` → `theme.pm-taste`
  - `achievement.linkedin-top-voice-pm` → `credentialed_by` → `theme.ai-pm-skillset`
  - Cluster-B Collab items (11 URNs) → `part_of_grind_for` → `achievement.linkedin-top-voice-pm`

### `Achievement: linkedin-top-voice-ai`
- **ID.** `achievement.linkedin-top-voice-ai`
- **Type.** LinkedIn Community Top Voice badge — Artificial Intelligence category. Top 1-2% globally.
- **Earned by.** 2024-07-04 (announcement post date, likely award a few days prior — and deliberately timed to coincide with AIonOS start).
- **Evidence anchor (post).** URN tail **7214487241681772545** (2024-07-04) — "I think I'll flaunt the Top AI badge for sometime since I have joined AIONOS as an AI Product Manager. The best time to start with AI was in 1950s (but I wasn't born then). The next best is now!" Already in ontology-v0 edges as `part_of → company.aionos (start marker)`; ADD the achievement edge.
- **Grind window (inferred).** **2024-03-02 to 2024-07-04 (~4 months, 122 days).** All of Cluster A (12 items) falls in this window; all of Cluster D (6 items) except D1; all of E3-E6; all of F; all of Cluster G (the April-29 quota burst = hitting badge maintenance inside this window).
- **Edges to add in ontology.**
  - `post.2024-07-04-7214487` → `evidenced_by` → `achievement.linkedin-top-voice-ai`
  - `achievement.linkedin-top-voice-ai` → `credentialed_by` → `theme.ai-pm-skillset`
  - `achievement.linkedin-top-voice-ai` → `credentialed_by` → `theme.enterprise-ai-reality`
  - Cluster-A Collab items (12 URNs) → `part_of_grind_for` → `achievement.linkedin-top-voice-ai`
  - **Cross-achievement timing edge:** `achievement.linkedin-top-voice-pm` → `precursor_of` → `achievement.linkedin-top-voice-ai` (5-month gap; the PM badge framework/stamina carried over to the AI badge grind).

### Other achievements visible in corpus (scan result)
- **Nothing else at achievement-node level.** Grep across `linkedin-corpus.md` for keynote / award / panel / featured returned zero authorial hits. The FarEye-100M raise (2021-05-25 and 2024-06-14 hashtagged posts) is a company achievement, not Agam's — keep as `event.fareye-100m-raise` node (already in ontology), not as `achievement.`
- **Anti-achievement signal worth noting.** URN **7270... 2024-11-15** "Certifications are collectibles that fuel our personal sense of achievement. They are in no shape or means a validation of what you can and cannot do." This is `belief.certifications-are-collectibles` — already in ontology as a TENSION with badge-acceptance. **The two Top Voice badges are the ONE kind of "certification" Agam accepts: peer-rated, not exam-gated.** Worth a note in achievement metadata so the agent can resolve this tension coherently ("Agam rejects certifications but accepts peer-voted badges").

---

## 5. Voice register #4 — structured-prompt-response

### Length — confirmed
Range across 51 authored Collab items: **38 words (H1 take-a-break, E2 native-speaker) to ~215 words (A11 5-step prompt hygiene with reading list, C6 mastery-hours).**
- Median ≈ 110 words.
- P25-P75 band ≈ 70-160 words.
- TL;DR claim of "60-180 words" is correct-ish but slightly narrow — real floor is 38, real ceiling is ~215. Refine to **40-210 words (median 110).**

### Structural pattern
**Opener-thesis → numbered/bulleted 3-5 items → optional close-aphorism.**

- **Opener-thesis (1-2 sentences):** declarative frame. Examples: "Value, viability and usability." / "Scope creep is real." / "Stop charging hourly and start charging outcome based." / "Humans are humans." / "Two words, SENTIMENT ANALYSIS."
- **Body (3-5 items):** numbered list using format `1/ ` or `1. ` or `#1 ` or `- `. Strong preference for `1/ ` slash-format (~60% of items) — this IS a signature (contra em-dash).
- **Close-aphorism (optional, ~40% of items):** aphorism or CTA. Examples: "Don't leave out the basics, they work fantastically." / "All the best with the search." / "Play the long game my friends." / "AI building AI is now :)" / "It's a marathon my friends ❤️" / "Boom - building data products..."

### Tonal traits
- **Zero hedging.** No "maybe", "might be worth considering", "could potentially" padding. When Agam hedges, he says "I feel" once and moves on (e.g., A4 "I feel the second one would have higher demand").
- **High verb density.** "Map out", "shadow", "uncover", "involve", "prepare", "prioritise", "kill", "ship", "play", "measure", "invite". Imperatives and active-voice verbs dominate.
- **Author-as-practitioner voice.** First-person singular is frequent and specific: "my jupyter notebook", "my AI stack includes", "I have created a personal GPT wrapper", "I walk my dog", "I keep telling my peers", "I journal from time to time", "one of my favorite books", "we had the same problem in one of the companies". Not generalized advice-giving — every answer is anchored in "what I do/did." This is the single most distinctive tonal trait.
- **Numerical-anchor preference.** "55%" (NFR), "5-6 people's salary" (tech-PM), "50-member team" (JIRA), "5% important" (two-roles-ahead), "30 min round table" (bottleneck measurement), "4M words" (NotebookLM ref elsewhere). Agam quantifies.
- **`:)` emoticon occasional**, `❤️` red-heart occasional (Cluster F "It's a marathon my friends ❤️", B9 "Have a great day ❤️"). Per Decision 4, these are NOT em-dashes — they ARE actual Agam signatures in register 4.
- **Semicolon-before-list.** "Here are some top questions to ask;" / "My AI stack includes;" / "Check for these signs;" / "You should be prepared for two tracks or line of questions;" — the semicolon-before-colon-equivalent is characteristic. **This IS a punctuation signature** and consistent with the colon-heavy style R3c found (1.24 colons/post in E4).

### Distinctness from other registers
| Register | Trigger | Form | Length | Voice-marker |
|---|---|---|---|---|
| #1 post-essay (locked pattern) | Agam's own authored posts | paragraphs + occasional lists | 100-500 words | opinion-forward |
| #2 comment-zinger | replies on others' posts | single punchline / 1-2 sentences | <40 words | aphoristic |
| #3 mentor-mode / playbook | long unprompted replies | paragraph-heavy, citation-rich | 200-500 words | pedagogical |
| **#4 structured-prompt-response (THIS)** | Collab Article prompt | opener-thesis → 3-5 list → close | 40-210 words | practitioner-voice + numbered slash-format |

**Key distinctness:** Register #4 is the ONLY register that uses numbered lists as its dominant structural move. Post-essay occasionally lists; mentor-mode prefers prose. If the agent sees a prompt with the "Collab-Article shape" (broad PM/AI question with implicit 5-item-answer expectation), it should deploy register #4, not register #1 or #3. If the prompt is specific and technical, register #3 mentor-mode is better. If the prompt is a mic-drop hook, register #2 zinger is best.

### Use-cases for agent
1. Structured PM/AI Q&A where the asker wants a playbook (5 bullets, numbered).
2. "How do I..." / "What's your take on..." / "What makes a good..." style prompts.
3. Framework enumerations (AARRR, STP, STAR, JTD) — Agam deploys named frameworks with credit and brief expansion.
4. Personal-stack questions ("what's your AI stack / tool setup") — register #4 with first-person specificity.
5. Career-advice prompts where the 90-day plan / numbered-steps shape fits.

**Do NOT deploy register #4 for:**
- Thesis-level posts (register #1).
- Quick-reaction replies (register #2).
- Long-form pedagogical playbooks where flow matters more than bullets (register #3).

### Voice samples — 7 verbatim quotes (all from outside the Apr-29 Cluster-G burst; all technically loadbearing)

**Sample 1 — "Play with APIs when you are bored" (applied tech literacy)**
> "Being technical is not about knowing a technology but using the technology. You can learn about a tech in no time these days. So don't let tech hold you back. Look up a tech and start applying. You'll learn much faster if you experiment with it. I keep telling my peers, play with APIs when you are bored :)"
Topic: What makes a successful Tech PM. URN tail **7171171307559043072** (2024-03-06).

**Sample 2 — Value-Viability-Usability triad (opener-thesis form)**
> "Value, viability and usability. Like any other product, your AI project/product should demonstrate substantial value that users are willing to pay for, it's viable for the business to build with clear ROI and it's usable as close to frictionless as possible."
Topic: How to evaluate AI-project viability. URN tail **7204678803065905153** (2024-06-07).

**Sample 3 — Design-thinking-as-speed (first-person practitioner voice)**
> "One thing that worked for me and continues to help me with the need for speed is design thinking. Don't confuse design thinking with making UI/UX first. It is the process of aligning stakeholders and gathering diverse feedback. In the context of AI, I have a jupyter notebook where I try different models and a quick paper wireframe to put the flow and tech into tangibles that stakeholders can touch and experience first hand."
Topic: How to speed up AI/PM work. URN tail **7199797475379978240** (2024-05-24).

**Sample 4 — Invite-knowledge (never-smartest-in-room crystallization)**
> "Defining the technical scope of the project as well as the underlying tech that supports is required in any project. Instead of just outright giving people a monologue on what I know. I rather invite people to share their knowledge. This builds a more inclusive space for discussions going ahead. Another thing to ensure is continuous learning."
Topic: How to define technical scope on team. URN tail **7203905990960848896** (2024-06-04).

**Sample 5 — Scope-creep 3 causes (full numbered-list form)**
> "Scope creep is real. The real problem is not the timeline It's why the need for additional features. There a couple of ways scope creep is acceptable. 1/ it came as feedback based on show and tell / 2/ it was missed initially / 3/ it was deprioritised but then the product felt incomplete without it. The impact of the change would definitely be timelines and not just by a factor of x but could be more of the change impacts other things."
Topic: How to handle scope creep. URN tail **7244675870072733696** (2024-09-25).

**Sample 6 — Two-roles-ahead (career-advice + close-aphorism form)**
> "It's better to be underpaid than overpaid at the start of your career. It's always a rush when you can outperform tasks that come your way. Early career is not the time to chase titles or salaries. But it is also wise to be cognizant of the market benchmarks. I would recommend looking at the two roles ahead when joining a new company. Where you start is only 5% important vs where you land eventually. Play the long game my friends."
Topic: Negotiating early-career salary. URN tail **7205244098125983744** (2024-06-08).

**Sample 7 — AI stack (personal-stack first-person form)**
> "My AI stack includes; 1/ Open source LLMs deployed locally / 2/ Access to chatGPT pro and GitHub Copilot / 3/ Bing AI integrated browsing. These required some time to get familiar with but have considerably improved my speed for repetitive tasks. For example; for open source LLMs you can try ollama or similar to have your own local LLM. I use this for prompt testing. I have a few GPT launched on the chatGPT marketplace that are designed for my personal use cases like a data analytics helper, writing helper, prd summarizer etc."
Topic: What's your AI stack. URN tail **7180082151764230144** (2024-03-31).

**Register-4 characterization (2-sentence summary confirmed).** Voice register #4 is Agam's practitioner-voice bullet format: opener-thesis declarative, 3-5 numbered items (usually `1/ ` slash-style), optional close-aphorism, 40-210 words, high first-person specificity with named frameworks and concrete numerical anchors. Distinct from mentor-mode (prose-heavy, 200-500 words) and comment-zinger (<40 words, single punchline) — deploy when the prompt asks for a playbook on a PM/AI topic and the asker wants bullets not essays.

---

## 6. Top-cluster deep dives

### Cluster A — AI-PM craft & product definition (12 responses)
- **Response count.** 12 (highest density cluster).
- **Expertise credentialed.** `achievement.linkedin-top-voice-ai` — peak evidence. Window Mar-Jul 2024 maps exactly to the AI-badge grind.
- **Representative verbatim quotes (5):**
  1. "play with APIs when you are bored :)" — URN **7171171307559043072** (2024-03-06).
  2. "1/ AI PMs working on improving the AI models (part of openai, anthropic etc) / 2/ AI PMs using existing AI models to unlock growth for their product... I feel the second one would have higher demand" — URN **7178931908863561728** (2024-03-28).
  3. "Value, viability and usability" — URN **7204678803065905153** (2024-06-07).
  4. "data readiness does not just mean having a large historical corpus to train on but the systems to be able to continuously collect, process and update the training data" — URN **7204636472262496259** (2024-06-07).
  5. "I have a jupyter notebook where I try different models and a quick paper wireframe to put the flow and tech into tangibles that stakeholders can touch and experience first hand" — URN **7199797475379978240** (2024-05-24).
- **Best single quote to surface.** Sample #3 — "Value, viability and usability." Shortest, most quotable, covers the triad clean. Agent should default to this when asked about evaluating AI projects.
- **Thematic synthesis.** Cluster A shows Agam's AI-PM craft crystallizing in real-time through comment-surface work. The progression Mar-Jun 2024 is (a) self-typology (A4: two AI-PM archetypes, positions self as application-layer), (b) apparatus (A6: jupyter + paper wireframe), (c) evaluation frame (A8: V/V/U triad), (d) data-pipeline insight (A9), (e) economics (A10: 5-6 people's salary), (f) tactical hygiene (A11: 5-step prompts). **This cluster is the argument that Agam's AI-PM identity formed on LinkedIn Collab surfaces in 2024, not just post-AIonOS.** The AI-badge grind FORCED the identity articulation — badge incentive → required sustained technical answering → required Agam to put his AI-PM craft in writing → which is what the wiki can now cite.

### Cluster B — PM fundamentals & frameworks (11 responses)
- **Response count.** 11.
- **Expertise credentialed.** `achievement.linkedin-top-voice-pm` — peak evidence. Window Nov-2023 to May-2024 maps to the PM-badge grind (earned 2024-02-11).
- **Representative verbatim quotes (5):**
  1. "marketing starts with STP - segmentation, targeting and positioning... Don't leave out the basics, they work fantastically" — URN **7133114529424490497** (2023-11-22).
  2. "Don't wait to be a product manager to start being a product manager. Fake it till you make it" — URN **7133144884546318336** (2023-11-22).
  3. "Acquisition, Activation, Retention, Revenue, and Referral (AARRR)" + level-2 metrics — URN **7162471933668700160** (2024-02-11).
  4. "55% of software production issues are due to non-functional requirements... Non-functional requirements are not just tick boxes that a PM needs to go through but actively work towards" — URN **7171698939044196352** (2024-03-08).
  5. "Stop charging hourly and start charging outcome based. As a PM you are responsible for the outcome" — URN **7191392993977720832** (2024-05-01).
- **Best single quote to surface.** Sample #2 — "Don't wait to be a product manager to start being a product manager. Fake it till you make it." Agent should surface this when asked about becoming a PM / PM career entry. Compact, authored, and works cross-context.
- **Thematic synthesis.** Cluster B is Agam curating the PM canon he's committed to — named frameworks (STP, AARRR, STAR, JTD), measured heuristics (55% NFR, swiss-army knife, bottleneck-as-slowest-process), contrarian stances (outcome-vs-hourly, refuse-the-framing on resilient-PM). **The cluster reads as Agam's personal "PM fundamentals textbook" — every entry is a framework Agam TEACHES, not one he's still learning.** This maps to `theme.pm-taste` almost 1:1. Strongest single evidence that Agam's PM expertise is broad + deep + teachable.

### Cluster D — AI tools & personal AI stack (6 responses)
- **Response count.** 6.
- **Expertise credentialed.** Cross-credentials `achievement.linkedin-top-voice-ai` but more importantly is the **strongest Collab evidence stream for `belief.self-instrumentation`** in the entire corpus.
- **Representative verbatim quotes (5):**
  1. "My AI stack includes; 1/ Open source LLMs deployed locally / 2/ Access to chatGPT pro and GitHub Copilot / 3/ Bing AI integrated browsing... I have a few GPT launched on the chatGPT marketplace that are designed for my personal use cases like a data analytics helper, writing helper, prd summarizer etc" — URN **7180082151764230144** (2024-03-31).
  2. "I have created a personal GPT wrapper for each subject that I am after. I tend to look up top programs, look at their curriculum and add that as a structure to my wrappers... This has replaced my podcast addiction with a more interactive version" — URN **7202147108856975360** (2024-05-31).
  3. "create a chatgpt agent on GPT marketplace and copy paste tweets for it to analyse for you. Cheaper but slower" — URN **7168448532947910656** (2024-02-28).
  4. "use teams/slack/meets transcript and put in your favorite LLM to summarise. You can then append this as a summary post the meeting and see your collaboration skyrocket" — URN **7199798452459851779** (2024-05-24).
  5. "here I am building my own agentic workflows using opensource models. Best of all, it's AI that is helping me code. AI building AI is now :)" — URN **7220059838456680448** (2024-07-19).
- **Best single quote to surface.** Quote #2 — the personal GPT wrapper per-subject pattern. **This is the single best evidence in the corpus for Agam's self-instrumentation belief AND the philosophical precursor to second-brain v1.** If asked "how does Agam use AI personally" or "show me Agam's self-instrumentation", default to this quote.
- **Thematic synthesis.** Cluster D shows that Agam's relationship with AI tools has always been self-applied-first (build personal tools, test them on your own work, then generalize). Every AI tool mentioned is one Agam was/is actually running. The 2024-03-31 AI-stack list directly chains to the 2024-06-05 `project.ollama-keyboard-shortcut` and the 2024-07-24 `project.crewai-agentic-system` and further on to `project.second-brain` (2026-04-23) — Cluster D IS the early evidence stream for the self-instrumentation → second-brain arc. **Wiki theme `theme.second-brain` should cite at least 2 of these D quotes as pre-seed evidence (2 years before the project shipped).**

### Cluster E — Data & AI project fundamentals (7 responses)
- **Response count.** 7 (one item double-counted with Cluster B NFR).
- **Expertise credentialed.** Crosses both badges — `achievement.linkedin-top-voice-pm` AND `achievement.linkedin-top-voice-ai`. The only cluster that dual-credentials.
- **Representative verbatim quotes (5):**
  1. "Take out pieces one by one till you can ensure that an individual cannot be identified. Personal identifiable information - take out names, take out contact numbers when you work with addresses" — URN **7133117366825013248** (2023-11-22).
  2. "Find a native speaker. Connect with them. Do a mock with them and refine your survey. Quick fix. If you don't have that person in your network, go make friends" — URN **7133146829881262080** (2023-11-22).
  3. "Below are easy 4 ways to deliver impact by using data to; 1/ increase internal productivity and efficiency / 2/ use data to drive user experience / 3/ monetize data through dashboards, apis etc / 4/ use data to lead" — URN **7176880994870865920** (2024-03-22).
  4. "This is where google translate failed to take off, since it did not have context and cultural biases built in" — URN **7178703756040032256** (2024-03-27).
  5. "We evaluated AirTable that really bridged the gap between expectations and reality and saved many thousands of dollars by not blindly going JIRA" — URN **7180086312123727872** (2024-03-31).
- **Best single quote to surface.** Quote #5 — the AirTable-vs-JIRA save. Concrete, first-person, has a dollar-saved outcome, demonstrates both PM selection discipline (`should we JIRA?`) and data-literacy (user-interview + survey before tool-procurement). Agent should surface this when asked about PM-led tool decisions or "tell me about a time Agam saved a team from a bad decision."
- **Thematic synthesis.** Cluster E is the **hinge cluster** — Agam's expertise here straddles PM-data-literacy and AI-production-reality. E1 (data governance / PII subtraction) is pure PM-data work; E4 (Google Translate's localization failure) is pure AI-production reality. The cluster shows Agam's PM training making him a better AI-PM — he brings data hygiene, user-research discipline, and cost-aware tool selection to AI projects. This is the evidence stream for the recently-formed belief chain `belief.enterprise-ai-production-reality` (2024-09-04 — immediately after this Collab cluster's last item).

**Section 6 total: 4 clusters deep-dived, 20 representative quotes, 4 best-single-surface quotes, 4 thematic syntheses.** Clusters C (career), F (team), H (outliers) have narrower signal — their representative quotes are already covered in Sections 2 and 5.

---

## Open questions for Agam taste-pass

1. **`belief.outcome-billing-over-hourly` — single-surface confidence?** The outcome-vs-hourly belief (URN 7191392993977720832, 2024-05-01) is declared cleanly but exists only on this one Collab surface — it's never repeated in free-form posts or later Collab items. Does Agam still hold it at 2026-04-25? If yes, keep. If it was context-specific (answering a question about PM consulting rates), consider demoting to `heuristic.` instead of `belief.` — heuristics don't need ontology-wide consistency, beliefs do.

2. **`belief.two-roles-ahead-framing` — generalized career belief or AIonOS-move self-justification?** Posted 2024-06-08, 3 weeks before the AIonOS start (2024-07-04). Reads as self-talk before a role change. Does Agam give this advice routinely to mentees, or was it a one-time rationalization? If routine, keep as belief. If not, drop or merge into the broader `belief.ic-path-legitimacy` / career-reflection frame.

3. **Kill-prompting belief supersession timing — is June 2024 the genuine split?** The 5-step prompt-hygiene item (A11, 2024-06-14) and the Dec-2024 "prompts are deprecated" post (`belief.kill-prompting`) are only 6 months apart. Did Agam's view genuinely flip, or was prompting-as-skill always an interim stance he was teaching mentees while already privately building agents? If the flip was real, the ontology supersession edge is correct. If it was always performative, the prompt-hygiene item should NOT be evidence for the superseded `belief.prompt-engineering-as-skill` — it should be evidence that register-4 sometimes requires Agam to teach frames he's mentally done with, because the asker needs the ladder. **This distinction matters for agent voice calibration** — it's the difference between "Agam used to believe X then changed his mind" and "Agam teaches X while privately believing Y."

4. **Cluster G (April-29 quota burst, 7 items) — keep or drop in kg.json?** Part-1 TL;DR says "include as register-4 evidence for the quota-mechanic but exclude from voice samples." Does Agam want the 7 Cluster-G items to appear as `evidence_of → achievement.linkedin-top-voice-ai` edges in kg.json (truthful: they were part of the grind), or to be silently dropped (truthful in a different sense: they're not content Agam endorses)? Recommendation: KEEP them edged to the achievement node but add a `meta.quota-maintenance: true` attribute so the agent can cite them as grind-artifact if asked directly about the badge-mechanic, but never surface them as voice content.

5. **Value-Viability-Usability vs Value-Consumers-Scalability — keep both?** V/V/U is new (2024-06-07, AI-specific). V/C/S is older (2020-07-04, general). Section 3b suggests keeping both with a `refines-for-AI-context` edge — but this may be over-ontologized. Alternative: consolidate into `belief.3-pillar-validation` with a note about the AI-specific variant. Does Agam mentally hold these as two beliefs (one general, one AI-specific) or as a single belief that manifests two triads depending on context? The answer determines whether the agent should quote V/V/U only for AI questions or as the default triad.

