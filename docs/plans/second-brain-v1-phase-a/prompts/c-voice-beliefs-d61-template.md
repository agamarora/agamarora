# C-voice-beliefs CP-{N} sonnet subagent prompt template (D6.1 shape)

Locked 2026-04-26 per PHASE-C-DESIGN-PLAN §D6.1-belief-shape-binding.

Per-CP cadence: spawn one sonnet subagent per belief, review output for triadic prose + em-dashes, build, commit + push, update STATUS, milestone-check, then next CP.

Project hard rule: subagents MUST run sonnet (or haiku for trivial). NEVER opus.

---

## Template (copy-paste, swap `{SLUG}` and `{REF_SLUG}` per CP)

```
You are reauthoring a wiki belief page from scratch as an operational principle-card per the D6.1 binding shape. This is CP-{N} of C-voice-beliefs, Phase C of the agamarora.com second-brain project.

# Goal

Rewrite the file `C:/aa/agamarora/docs/plans/second-brain-v1-phase-a/synthesis/belief-page-drafts-final/{SLUG}.md` IN PLACE. Preserve all existing frontmatter fields. Update only `status` and add new fields where missing. Replace the body completely.

# Inputs you MUST read in order

1. `C:/aa/agamarora/docs/plans/second-brain-v1-phase-a/synthesis/belief-page-drafts-final/{REF_SLUG}.md` - the BINDING REFERENCE PATTERN (typically agent-first.md or context-over-prompt.md, both already in D6.1 shape). Match its structure, voice, paragraph rhythm, decision-rule format. Do not copy content; copy shape.
2. `C:/aa/agamarora/docs/plans/second-brain-v1-phase-a/synthesis/belief-page-drafts-final/{SLUG}.md` - the source draft (current contents). Use it as the claim + evidence source. Do NOT preserve its prose; rewrite from scratch in D6.1 shape.
3. `C:/aa/agamarora/docs/plans/second-brain-v1-phase-c/PHASE-C-DESIGN-PLAN.md` §D6.1-belief-shape-binding - the full locked contract.
4. `C:/aa/agamarora/docs/plans/second-brain-v1-phase-a/synthesis/voice-spec.md` §1 (Register 1), §2 (banned LLM-isms), §3 (real signatures), §4 (mechanical self-check).

# Frontmatter requirements

Preserve: type, slug, title, parent_theme, related_beliefs, supersedes, conditioned_by, holds_with, cross_listed_themes (if present), tier, length_target.

**Slug field is the bare slug, NOT prefixed with `belief.`.** Example: `slug: spec-over-sprint`, NOT `slug: belief.spec-over-sprint`. The `belief.` prefix only appears in the `related_beliefs:` list (where it disambiguates from other graph node types) and in evidence body text where the slug is referenced as a graph entity. This is a real fan-out gotcha - subagents have written the wrong form on first try; double-check.

Update or add:
- `one_line:` keep existing if good (35-90 chars, descriptive); refine if it uses banned phrasing
- `quotable:` ADD - single sentence the agent can drop verbatim into responses without rephrasing. Active voice. Should restate the principle in its sharpest form. Example: "Context > Prompt. Curating context is the real skill."
- `applies_to:` ADD - 3-6 domain tags for query-to-belief matching. Lowercase, hyphenated. Examples: ai-architecture, prompt-engineering, retrieval-systems, agent-design, knowledge-management, ai-debugging
- `confidence:` ADD - one of `settled` | `evolving` | `contested`. Default to `settled` if the belief has been load-bearing for >12 months and no contradicting posts exist.
- `status:` set to `c-voice-beliefs-r1-cp{N}-d6.1`
- `voice_register: 1 (free-form post-essay)` (add if missing)
- `shape: principle-card-d6.1` (add if missing)

# Hard gates (binding - fail any one and the work is not done)

1. **Length: 400-600 words body prose** (excluding frontmatter and Evidence table).
2. **Section structure (in this exact order):**
   - `## The belief` - 1-3 declarative sentences, principle form, active voice. NO "Agam thinks" / "What does Agam think" / "Agam's view is" framing. The belief is a principle, not a biographical claim.
   - `## How to apply` - 3-5 NUMBERED decision rules. Each starts with bold imperative ("**Default to X.**", "**Audit Y first.**", "**Treat Z as W.**") followed by period and explanation. Rules must be testable - an agent should apply them to a novel question without needing the source corpus.
   - `## What this is not` - 2-3 BULLETS naming boundaries / failure modes / over-rotations. Each starts with bold ("**Not 'X.'**" or "**Not Y when Z.**") followed by period and explanation.
   - `## Argues against` - 3 bullets, each in QUOTATION MARKS, naming concrete counter-positions the belief explicitly rejects. Format: `- "Counter position stated as someone might say it."`
   - `## Where to go from here` - 3 named exit paths in prose ("If you want X, go to Y..."). Cross-link to parent theme + 2 related beliefs minimum.
   - `## Evidence` - markdown table with `| Date | Entry | Post |` columns. Use the urns from the source draft.
3. **DO NOT use these section headers** (build-wiki strips them): `## Refinement arc`, `## Cross-links`, `## Statement`, `## Origin`. Stick to the 6 sections above.
4. **Em-dash count: ZERO.** No `—` characters anywhere in body or frontmatter. Use ` - ` (space-hyphen-space) for asides. Use `:` for explanation rhythm. Use a period and new sentence for emphasis.
5. **Banned LLM-isms (zero tolerance):** no "leverage" (verb), "seamlessly", "robustly", "deeply" (filler), "navigate" (metaphor), "delve", "groundbreaking", "transformative", "cutting-edge", "It's not just X, it's Y", "In today's...", "I'm excited to announce", "Hot take:", hedging ladders, hashtags, conclusion-recap paragraphs.
6. **No triadic prose lists.** Banned: "X, Y, and Z" rhythmic three-item series in prose. When listing three things in prose, either (a) split into separate sentences, (b) use a numbered/bulleted list, or (c) use the `1/ ` slash-format. Lists with 4+ items in inline prose set off by hyphens are OK ("personal data, organizational data, prior conversation, structured knowledge").
7. **Zero biographical date framing in body.** No "March 2023 post...", "the June 20, 2025 manifesto", "by April 2026". Posts live ONLY in the Evidence table (with dates in the Date column). Body prose uses verbatim quotes when essential for grounding but does not date them in narrative form. The principle stands on its own; the corpus is in the drawer.
8. **R1 voice:** declarative thesis sentences, colon as primary rhythm, hyphen-with-spaces for asides, short paragraphs (1-4 sentences typical), no hedging ("perhaps", "potentially", "might be").

# Self-eval before returning

Mentally run gates 1-8. Count em-dashes (must be 0). Word-count the body (must be 400-600). Re-read each h2 section: does it self-introduce? Does the first sentence work without assuming the prior section was read? Re-read the whole body: are there any biographical date references? Re-read the decision rules: would an agent be able to apply them to a question it has never seen? If any gate fails, fix before returning.

# Deliverable

Write the rewritten file to `C:/aa/agamarora/docs/plans/second-brain-v1-phase-a/synthesis/belief-page-drafts-final/{SLUG}.md` using the Write tool. Then return a short summary: word count, gates verified, anything you decided to deviate on and why, plus the chosen `confidence` value with one-line justification.

Do NOT run npm build. Do NOT commit. Just rewrite the file.
```

---

## Per-CP review checklist (after subagent returns, before commit)

1. Read the rewritten file end-to-end
2. Grep for `—` (em-dash) - must be 0
3. Grep for banned LLM-isms: leverage|seamlessly|robustly|deeply|navigate|delve|groundbreaking|transformative
4. Word count the body - must be 400-600w
5. Section order matches §D6.1 binding (The belief / How to apply / What this is not / Argues against / Where to go from here / Evidence)
6. Frontmatter has all 4 D6.1-required fields: quotable, applies_to, confidence, shape
7. Triadic prose scan (manual read of every paragraph for "X, Y, and Z" rhythm)
8. No dated-post prose ("In March 2023...", "the June 20 manifesto...")
9. npm run build succeeds
10. wiki/beliefs/{SLUG}/index.html renders chip strip + tag strip + TL;DR + numbered ol counter
11. Mobile screenshot if any structural change introduced (use browse responsive)

If all 11 pass: commit per cadence, push, STATUS bump, next CP.
If any fail: fix manually before commit (subagent already returned; quicker to fix in-place than re-spawn).

---

## CP order (binding)

CP-1: agent-first (DONE - hand-author reference)
CP-2: context-over-prompt (DONE - retrofit to D6.1)
CP-3: spec-over-sprint (NEXT - trilogy completion)
CP-4: taste-over-execution (trilogy completion)
CP-5: second-brain-is-context-layer (operationalization)
CP-6: substance-over-hype (root T1 belief)
CP-7: enterprise-ai-production-reality (cross-checked simultaneity edge for agent-first)
CP-8: ship-the-prototype
CP-9: pm-is-99-should-we-1-can-we
CP-10: ic-path-legitimacy
CP-11: help-market-flourish
CP-12: anti-customization
CP-13: ai-pm-skillset-table-stakes
CP-14: breadth-as-differentiation
CP-15: breadth-needs-depth
CP-16: learn-concepts-not-tools
CP-17: linkedin-as-instrumental-platform
CP-18: llm-as-primary-daily-tool
CP-19: self-instrumentation

Total: 17 sub-CPs remaining (CP-3 through CP-19).
