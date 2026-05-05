# Writing Rubric v2 — readable authority

**Status:** Locked 2026-05-05. Supersedes the Bulldozer 15-point rubric (`~/.claude/plans/lets-think-this-through-staged-zebra.md` §5.10).
**Audience:** Thoughtful PM/AI reader. Hiring managers included, but no longer the sole frame. Anyone who reads Lenny, Shreyas, Karpathy, or Simon Willison should feel at home here.
**Goal:** Articles that are warm enough to read for pleasure and authoritative enough that a senior practitioner pauses on them. Not L7-memo-cold. Not blog-soft. The middle path the field's best writers actually walk.

---

## Why this replaces Bulldozer

Bulldozer optimized for one signal — "feels exactly like a high-level internal strategy memo that leaked from a top-tech company." It got there by stripping warmth markers (hedging, first-person, asides, sentence rhythm variety, narrative anchors) on the theory that any softness would leak credibility.

Field evidence says the opposite. The writers most senior PMs and AI practitioners actually read — Lenny Rachitsky, Shreyas Doshi, Julie Zhuo, Paul Graham, First Round Review, Andrej Karpathy, Simon Willison, Eugene Yan, Chip Huyen, Ben Thompson, Anthropic's research blog — all carry warmth and authority simultaneously. They do it by routing warmth through specificity, calibrated hedging, and structural craft, not by stripping warmth out.

Google's helpful-content guidelines independently arrive at the same place: first-hand experience, original analysis, content that helps a real reader achieve a real goal, written by an identifiable person. The Bulldozer banned-vocab list and zero-hedging rule fight against half of that.

So: rubric v2 keeps the parts of Bulldozer that still serve readers (no meta-commentary, no defensive writing, definitive titles, friction-grounded strategy, metric anchoring) and replaces the parts that overshot (zero hedging, banned warmth-words, fragments-as-default, no first-person).

---

## The 18-point rubric (4 phases)

Each item: **criterion** → what good looks like → what failure looks like.

### Phase 1: Trust foundation (E-E-A-T, first-hand experience)

**1. First-hand experience is visible.**
*Good:* "When we built the Voice AI routing layer at AIonOS for 4M+ calls/year, the auth handoff broke first." Specific system, specific number, specific failure.
*Bad:* "Many enterprise systems struggle with auth at scale." Generic, no traceable evidence.

**2. Original analysis, not rehash.**
*Good:* a framework, distinction, or argument that wasn't visible before the page existed. Synthesis the reader couldn't get from the source material alone.
*Bad:* restating points already covered better elsewhere with no added angle. (Google's "would you expect to see this in a printed encyclopedia or book" is the same test.)

**3. Substantial value over other pages on the same topic.**
*Good:* if the reader has already read the obvious sources, this still teaches them something. The page earns its existence.
*Bad:* the reader could close the tab and not lose anything.

**4. Author accountability is clear.**
*Good:* the voice is unmistakably Agam's. Personal experience, personal stakes, named projects appear early enough that a reader knows who is talking by paragraph two.
*Bad:* generic third-person "the engineer" voice. Could have been written by anyone.

**5. AI / automation disclosure where relevant.**
*Good:* on `/enter` and pages where LLM tooling is part of the product, the page is transparent about how AI is used (retrieval, synthesis, drafting). Especially important post-2024 — readers expect it, Google rewards it.
*Bad:* AI-generated content presented as hand-written; no disclosure on agent surfaces.

### Phase 2: Reader value (helpful-content)

**6. Reader leaves able to act.**
*Good:* the page resolves enough of the question that the reader can do something different on Monday — make a decision, run an experiment, choose between two approaches, drop an assumption.
*Bad:* "interesting" but the reader is no closer to acting than before they read.

**7. Title is a descriptive helpful summary.**
*Good:* "How we cut LLM routing latency from 800ms to 180ms" — descriptive, specific, scannable.
*Bad:* exaggerated ("The ONLY way to ship AI"), shocking ("Why 90% of PMs fail at AI"), or vague ("Thoughts on routing"). Per Google: "main heading or page title avoid exaggerating or being shocking in nature."

**8. Helps achieve a specific named goal, not generic enrichment.**
*Good:* "If you're a B2B PM building LLM features and your CFO is asking about unit economics, this page tells you which metrics to track and why." Stated job-to-be-done.
*Bad:* "thoughts on AI strategy" with no clear reader.

**9. Bookmarkable / shareable test.**
*Good:* a senior practitioner reading this would forward it to one specific person on their team with a one-line "this is exactly the framing I needed."
*Bad:* technically correct but not memorable, not quotable, no single sentence worth sharing.

### Phase 3: Voice and craft (writer research)

**10. Hook earns attention.**
*Good:* opens on concrete reader pain ("If you've ever shipped an LLM feature that worked in demo and broke in prod…"), contrarian truth ("Voice AI is not a moat, it's a tax"), or specific named scene ("Three weeks before launch, the auth team came back with a number we couldn't pay…"). Hook ≤ 80 words. Skips throat-clearing ("In this article I will…", "It's important to note that…").
*Bad:* generic abstraction, definition-first, restating the title.

**11. Calibrated hedging — locate claims, don't soften them.**
*Good:* hedges that pin a claim to its real domain. "In B2B contracts north of $250k ARR, the procurement gate is the binding constraint, not the model." The qualifier sharpens the claim.
*Bad:* hedging that weakens out of caution — "I think maybe in some cases…", "this might possibly be relevant for…". Either earn the hedge or remove it. Karpathy and Simon Willison hedge often; both still read as authoritative because every hedge carries information.

**12. Reader is treated as a peer practitioner.**
*Good:* "you" addressed to someone who does this work. Defines a term on first use without over-explaining ("backpropagation — the chain rule applied recursively across layers"). Trusts the reader to follow a long sentence.
*Bad:* over-defines (a senior PM doesn't need "API stands for"), or under-defines (parachutes in jargon and assumes shared vocabulary). Patronizing or gatekeeping — both lose the reader.

**13. Varied sentence rhythm.**
*Good:* every paragraph contains at least one short declarative under 15 words ("Voice AI is not a moat.") and at least one development sentence over 25 words that unpacks why. The short sentence carries the thesis. The long sentence does the explanation.
*Bad:* monorhythmic. Either all-short-fragments (Bulldozer failure mode — feels robotic) or all-long-flowing (academic failure mode — feels mushy). Both lose readers in different ways.

**14. Theory never naked — concrete example before each section ends.**
*Good:* every framework section closes with a named instance. "Schema enforcement at the routing layer prevents cascading failures downstream — the way we caught a 4M-row backfill drift on the Aionos KYC pipeline before it hit production."
*Bad:* abstract framework that promises an example and never delivers one. Reader nods along; nothing sticks.

**15. Warmth lives in asides, not the main claim.**
*Good:* the spine sentence is direct and confident. Warmth appears in a parenthetical aside, a self-deprecating admission, a specific personal moment. ("We rebuilt the routing layer three times before we got it right. The first version cost a six-figure overrun and a difficult Slack thread with the CFO.")
*Bad:* warm main sentences ("It's so important that we always remember…") read as soft. Cold main sentences with zero asides read as robotic. The asymmetry — confident spine, warm asides — is the move.

**16. Named specificity over abstraction.**
*Good:* proper nouns. Named systems, named numbers, named projects, named moments. "AIonOS Voice AI", "4M+ calls/year", "the Klarna procurement gate", "the Tuesday after the launch when…".
*Bad:* "an enterprise client", "many calls", "a procurement issue", "after the launch". Loses ten points of credibility per abstraction.

### Phase 4: Closing and polish

**17. Closing opens forward — invitation, question, or extended frame.**
*Good:* ends by putting the reader in motion. Open question ("What's the right unit economics frame for agent-first products in 2026?"), invitation ("If you're building this and want to compare notes, reach out."), or extended implication ("If schema enforcement at the routing layer is the new constraint, the next question is what happens when models get cheap enough that the schema becomes the bottleneck."). Per Lenny, Karpathy, Eugene Yan, Simon Willison — none of them end on summary.
*Bad:* recap of the article ("To summarize, we discussed three principles…"). The reader just read the article. Don't make them re-read it.

**18. Polish — spelling, style, no padding.**
*Good:* clean prose. Every paragraph earns its place. If you removed the paragraph would the article be worse? If no, cut it. Per Google: "Is the content produced well, or does it appear sloppy or hastily produced?"
*Bad:* typos, inconsistent tense, paragraphs added to hit a length target, AI-rehash phrases ("It's important to note that…", "In today's fast-paced world…"). Length is not a virtue. Substance is.

---

## Grading scale

- **A (16–18 pass):** ship as-is. The page is doing the work the field's best writers do.
- **B (12–15 pass):** ship after one revision pass on the failed items. Note which items failed in the commit message.
- **C (8–11 pass):** restructure. Likely a voice-or-craft problem, not a content problem. Re-read against items 10–16 specifically.
- **D / F (≤7 pass):** rewrite. The page is failing on multiple phases. Either the reader value (Phase 2) is unclear or the trust foundation (Phase 1) isn't there yet.

---

## What changes from Bulldozer

| Bulldozer rule | v2 disposition | Why |
|---|---|---|
| #1 No meta-commentary | **KEPT** (folded into #18 polish — "this wiki," "this corpus" still bad) | Self-referential filler still leaks credibility. |
| #2 No defensive writing | **KEPT** (folded into #10 hook — no throat-clearing, no "what this is not" headers) | Defensive structure still wastes the opening. |
| #3 No hedging (zero "I think") | **REPLACED by #11 calibrated hedging** | Was the biggest overshoot. Karpathy, Graham, Willison hedge constantly and read more authoritative for it. The rule should be earn the hedge, not ban the hedge. |
| #4 Definitive title | **KEPT + GOOGLE-AMPLIFIED** (item #7 — descriptive, not exaggerated/shocking) | Google explicitly penalizes shock-titles. Definitive ≠ shocking. |
| #5 Hook = stark enterprise reality / contrarian truth | **KEPT + EXPANDED** (item #10 — also allows concrete reader pain or named scene) | Three valid hook patterns instead of one. Karpathy opens on personal moment; Lenny opens on positional claim; Shreyas opens on contrarian truth. All work. |
| #6 Scannable hierarchy (H2/H3) | **KEPT, deprioritized** | Useful but not load-bearing. Google explicitly says heading order/count doesn't matter to ranking. Use headings when they help readers scan. |
| #7 Bottom line tying to business metric | **MODIFIED into #17 closing opens forward** | Business-metric anchoring stays useful for the resume-adjacent surfaces, but on a wiki article aimed at a thoughtful reader, ending on a forward-opening question/invitation is stronger than ending on "this is why it matters for revenue." |
| #8 Staccato rhythm | **REPLACED by #13 varied rhythm** | Pure staccato reads robotic. Varied — short anchors plus longer development — is the actual pattern in top writers. |
| #9 Engineering action verbs | **KEPT, softened** | "Architected, enforced, shipped, deprecated, constrained" still strong. But "built", "found", "tried", "shipped" are also fine when the sentence is doing real work. Don't force "deprecated" where "removed" reads better. |
| #10 Friction-grounded strategy | **KEPT** (folded into #14 theory never naked) | Still core. Consultant-speak grounded in engineering reality. |
| #11 So-what mandate | **KEPT** (folded into #6 reader leaves able to act) | Same idea, framed around reader value. |
| #12 Metric preservation | **KEPT** (folded into #16 named specificity) | Same idea. Specific numbers > smoothed generalities. |
| #13 AEO appendix formatting | **DROPPED as rubric item** | Pipeline-level concern, not voice-level. Belongs in build scripts, not a rubric a writer self-grades against. |
| #14 AEO semantic links / "Related architecture memos" | **DROPPED as rubric item** | Same. Pipeline-level. |
| #15 Process gate (3 iteration max) | **KEPT** | Still useful as a stop-rule. After 3 rewrites that don't reach B+, escalate. |

**New items not in Bulldozer:**
- #1 First-hand experience visible (Google E-E-A-T)
- #2 Original analysis (Google helpful-content)
- #3 Substantial value over other pages (Google helpful-content)
- #4 Author accountability (Google "Who")
- #5 AI disclosure (Google 2023+ guidance)
- #6 Reader leaves able to act (Google helpful-content)
- #9 Bookmarkable / shareable test (Google helpful-content self-assessment)
- #12 Reader as peer practitioner (writer research universal)
- #15 Warmth in asides (writer research universal)
- #17 Closing opens forward (writer research universal)

---

## Application to existing wiki

The 30 wiki pages were graded against Bulldozer. They likely cluster as:
- **Pages already strong on first-hand specificity + named systems + concrete examples:** probably grade B+ or A under v2 with light revision (mostly relaxing the staccato rhythm, allowing first-person where it's earned).
- **Pages that overshot Bulldozer's coldness — fragments-only, banned hedging, no first-person, no warmth asides:** likely grade C and need a real revision pass focused on items 11, 13, 15.
- **Pages that were thin on original analysis or first-hand evidence:** likely grade C/D under v2 — Bulldozer didn't catch this gap because Bulldozer didn't grade content originality, only voice register.

**Recommended approach:** don't auto-rewrite. Re-grade the 5 anchor pages first (`/wiki/agent-first/`, `/wiki/beliefs/agent-first/`, `/wiki/voice-ai-craft/`, `/wiki/spec-first-taste/`, plus one more) under v2, see the gap pattern, decide whether full re-grade is worth the cost.

The lint script (`scripts/lint-bulldozer.mjs`) needs revision too — banned-vocab and zero-hedging gates were the wrong signals. Move toward a positive lint: does the page have at least one short anchor sentence per major section, at least one named system per article, a forward-opening close. Negative lints (banned vocab) become advisory, not strict.

---

## What this rubric does not grade

- **SEO mechanics** — title tags, meta descriptions, structured data, sitemap inclusion, canonical URLs, internal link density. Handled at the build pipeline. The rubric is a writing rubric, not an SEO checklist.
- **AEO formatting** — citations appendix, related-links footer structure. Handled in `build-wiki.mjs`. Writers should not be self-grading against pipeline output.
- **Visual design** — typography, spacing, color use. Handled at `chrome.mjs` + `/moodboard`.
- **Mobile responsiveness, page speed, Core Web Vitals.** Important for ranking per Google, but separate from the writing.

If the page passes the 18-point rubric and the build pipeline is doing its job, the SEO mechanics follow. Google's own guidance is consistent on this: people-first content with first-hand expertise + original analysis + helpful framing is the durable signal. SEO mechanics are downstream.

---

## Sources

**Writer research (full fingerprints in chat history 2026-05-05):**
- Lenny Rachitsky, Shreyas Doshi, Julie Zhuo, Paul Graham, First Round Review, Marty Cagan
- Andrej Karpathy, Simon Willison, Eugene Yan, Chip Huyen, Ben Thompson, Anthropic, Latent Space

**Google official guidance:**
- [Core updates and your website](https://developers.google.com/search/updates/core-updates)
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Maintaining your website's SEO](https://developers.google.com/search/docs/advanced/guidelines/maintain-website)

**Internal references:**
- Bulldozer spec (superseded): `~/.claude/plans/lets-think-this-through-staged-zebra.md` §5.1–5.10
- Memory: `feedback_wiki_proof_of_work.md`, `feedback_no_chronological.md`, `project_positioning_locked.md`
