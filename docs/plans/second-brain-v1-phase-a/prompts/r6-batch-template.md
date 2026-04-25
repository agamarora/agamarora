# R6 per-theme wiki-page-draft template

**Purpose:** spawn 1 subagent per final theme from R5 (12 themes + 1 root page = 13 total). Each subagent drafts a wiki page following spec §5 structure.

**Model:** sonnet (per project hard rule).

---

## Universal R6 prompt block

```
You are an R6 wiki-page-draft subagent for Agam Arora's second-brain v1 Phase A. Your single theme: **`{{THEME_SLUG}}`** ({{THEME_TITLE}}).

**Task:** draft the wiki page (markdown source) for this theme, following spec §5 structure. This is the DRAFT that goes to Agam taste-pass — not final HTML, no design system code yet.

**Inputs (read all):**
1. `C:\aa\agamarora\docs\plans\second-brain-v1.md` — spec, especially §5 (Wiki Page Spec) for page structure + §4 (Theme List) for length target
2. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\theme-refinement.md` — Section 3 entry for {{THEME_SLUG}} (your spec-of-record): beliefs assigned, voice register, length target, lead post, open Qs
3. **All R4 belief deep-dives for assigned beliefs:** {{BELIEF_DEEP_DIVE_PATHS}}
4. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\corpus-synthesis-v0.md` — cross-era context
5. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\style-fingerprint.md` — voice register reference (which register dominates this theme per R5 assignment)
6. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\voice-samples.md` — verbatim voice samples
7. `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\interim-taste-calls.md` — 5 binding taste-calls (apply all)

---

## REASONING PROTOCOL — explicit Chain-of-Thought + ReAct loop (MANDATORY)

You MUST work in interleaved Thought→Action→Observation cycles. Do NOT start drafting until reasoning is complete.

**Required passes:**

### Pass 1 — Theme spec internalization
Thought: "What does R5 (theme-refinement.md Section 3) say my theme is?" Action: read theme-refinement.md row for {{THEME_SLUG}} verbatim. Observation: list assigned beliefs, voice register, length target, lead post, open Qs.

### Pass 2 — Per-belief evidence harvest
Thought: "What are the strongest 1-2 sentences in each belief deep-dive that I should quote/paraphrase?" Action: read each assigned belief's §1 (refined statement), §2 (evidence chronology), §7 (most quotable expressions). Observation: collect 2-4 quotes/paraphrases per belief, dated.

### Pass 3 — Narrative arc assembly
Thought: "What's the 'How it formed' story for this theme? Earliest evidence → crystallization → current form." Action: order evidence chronologically across beliefs. Observation: draft 1-paragraph arc.

### Pass 4 — Tension identification
Thought: "What does this theme push against? Other theme? Past version of belief? Industry consensus?" Action: check master-belief-list.md tension pairs + theme-refinement.md Section 4 deltas. Observation: draft 1-paragraph tension.

### Pass 5 — Voice register check
Thought: "R5 assigned this theme voice register X. Are my drafted paragraphs in that register, or am I drifting LLM-default?" Action: cross-check style-fingerprint.md for the assigned register's signatures (sentence length, punctuation, opening verbs). Observation: rewrite where drift detected.

### Pass 6 — Self-critique (BEFORE writing output file):
- Did I hit length target (per spec §4)?
- Are 5+ post permalinks cited in Evidence section with dates?
- Does Tension section name a specific other theme or belief?
- Voice: any em-dashes? (Decision 4 — soft-banned.) Any banned LLM-isms ("It's not just X, it's Y")?
- Did I apply all 5 binding decisions?
- Does the page invite Agam to delete/refine/keep — i.e., is it draft-quality with explicit Open Qs callouts inline, not pretending to be final?

If any "no" → another pass.

---

## Output structure — write to `synthesis/wiki-page-drafts/{{THEME_SLUG}}.md`

Follow spec §5 page structure (markdown source for wiki HTML, NOT HTML yet):

```markdown
---
type: Theme
slug: {{THEME_SLUG}}
title: {{THEME_TITLE}}
era: [list applicable eras]
status: draft-r6
length_target: {{LENGTH_TARGET}}
beliefs:
  - {{slug}} — {{1-line distillation}}
  - ...
references:
  - post.YYYY-MM-DD-hash — short snippet
  - ...
open_qs_for_taste_pass:
  - {{open Q from R5 + any new from this draft}}
---

# {{Theme title}}

*Era: [list] · N posts · M beliefs*

## Core belief

[1-paragraph distillation. Plain English. Teach-back. The thesis of this theme in 80-150 words.]

## How it formed

[Narrative arc. Earliest → crystallization → current. Dated posts. Key events. Voice should match R5-assigned register. 200-400 words.]

## What it implies

[Practical consequences in builds, decisions, career moves. 150-300 words.]

## Tension with [other theme]

[Where this pushes against another belief or theme. Link target theme by slug. 80-200 words.]

## Evidence

- [YYYY-MM-DD] — [1-line snippet] — `permalink-or-id`
- [5-12 entries — chronologically ordered]

## Open question

[What Agam doesn't yet know about this theme. What could prove him wrong. Or: what the wiki reader is left wondering. 60-150 words.]

---
*Draft for taste-pass — not final.*

## Open Qs for Agam taste-pass (callout)

- [verbatim from R5 Section 3 Open Qs entry for this theme]
- [any new Q surfaced during drafting]
```

---

**Audit-derived prompt rules (post-batch-6c qualitative review):**

- **A. Silence framing prohibition.** Do NOT use "X-day silence" language or describe any posting gap as significant. If you reference a quiet period, say only "Agam posted less frequently during this window" or similar. Treat silences as normal cadence variation per Decision 5.
- **B. Date-interval arithmetic.** Before stating any relative-timing claim ("one week before," "three months later," "just after"), compute the actual interval from the corpus dates. Do not estimate from context — derive from the dates.
- **C. Voice register for connective prose.** Connective sentences between quotes should be direct declarative. Prefer "The page turned here: [quote]" over "This belief reached maturity when Agam recognized that..." Avoid third-person character-analysis framing ("Agam's X is Y"). If you find yourself writing analytical-summary prose about Agam's beliefs, replace with a direct quote or a simpler factual statement.
- **D. Don't pre-answer Open Qs.** If R5 or R4 flagged a question as Open for taste-pass, the body prose must NOT commit to an answer. Hedge the body, keep the answer in the callout.
- **E. Verify single-superlative claims.** Avoid "the only post in N years" / "the first time he ever" claims unless explicitly supported in master-belief-list. Use "the clearest instance" / "the canonical surface" instead.

**Apply interim-taste-calls (all 5):**
- Drop interior-design (2017) refs
- Voice-AI under-share intentional — even if writing voice-ai-craft theme, lead with craft/principle, not identity
- Collab Articles ARE primary content (cite them as evidence equal to free-form posts)
- Em-dash NOT signature — use colons + hyphen-with-spaces; soft-ban em-dashes
- Silence periods normal — don't dramatize gaps

**Output path:** `C:\aa\agamarora\docs\plans\second-brain-v1-phase-a\synthesis\wiki-page-drafts\{{THEME_SLUG}}.md`

**Write protocol:** incremental — write frontmatter first, then APPEND each section.

**Budget:** match R5 length_target. Going slightly over is fine; under is a flag.

Return summary (under 200 words): (a) word count + length-target compliance, (b) belief count cited, (c) evidence post count + dates spread, (d) Open Qs surfaced (R5-carried + new), (e) confirmation file written + size.
```

---

## Per-theme substitutions

For each theme: derive {{BELIEF_DEEP_DIVE_PATHS}} from theme-refinement.md Section 3 belief assignments. {{LENGTH_TARGET}} from same.

13 final themes (12 + root):
- `agent-first` — 1200-1500w
- `voice-ai-craft` — 800-1200w
- `breadth-as-differentiation` — 800-1200w
- `pm-taste` — 1000-1500w
- `early-career` — sub-section of career-reflection (no own page) — SKIP
- `thinking-in-writing` — merged into linkedin-as-instrument — SKIP
- `ai-pm-skillset` — 1000-1500w
- `enterprise-ai-reality` — 800-1200w
- `linkedin-as-instrument` — 800-1000w
- `second-brain` — 1000-1500w
- `spec-first-taste` — 900-1200w
- `career-reflection` — 1000-1400w
- `personal-projects-tinkering` — 800-1200w
- `root.substance-over-hype` — 400-600w

Net: 11 theme pages + 1 root page = **12 R6 subagents**. (early-career + thinking-in-writing skip — content folds into Theme 12 + Theme 9 respectively, no own page per R5.)

## Spawning protocol

Foreground default. 3 subagents per Agent-message max. ~4 batches needed.
