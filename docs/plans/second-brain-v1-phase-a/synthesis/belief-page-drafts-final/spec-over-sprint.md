---
type: BeliefPage
slug: belief.spec-over-sprint
title: Spec over Sprint
one_line: "When AI makes iteration nearly free, the binding constraint is spec quality - the model amplifies whatever you put in front of it."
parent_theme: spec-first-taste
related_beliefs:
  - belief.taste-over-execution
  - belief.context-over-prompt
  - belief.anti-customization
  - belief.ship-the-prototype
  - belief.substance-over-hype
tier: 1
length_target: 400-800w
status: draft-task-h
---

# Spec over Sprint

## Statement

When you have already spent hours speccing every pixel (typography scale, spacing tokens, color palette, border radius), a generative tool gives you a worse version of what you already decided. This is the shift: in an era where AI makes iteration nearly free, the binding constraint is no longer how fast you can build. It is how clearly you can spec. The model amplifies whatever you give it. Invest in the spec, not the iteration speed.

## Origin

Earliest dated evidence: 2022-06-03: "Product management is the grind of answering 99 questions of 'should we do it?' to get to that 1 bonus question of 'can we do it?'." The 99 "should we" questions are spec-work. The habit predates the vocabulary by four years.

The crystallization post: 2026-04-09. Agam tried Google Stitch, dropped it in under 30 minutes, and published the three-line builder thesis: "Spec > Sprint / Taste > Execution / Context > Prompt." The post explains the reason directly: the tool generated a decent layout in seconds but couldn't hit locked design tokens. Wrong fonts, wrong colors, approximate everything. The generative tool averaged across a population; the spec had already converged.

## Refinement arc

**Supersedes `belief.ship-fast` (2020-05-19):** The earlier stance was "quick and dirty, yet powerful and clean" - speed-to-prototype as the primary virtue. The 2026-04-09 post inverts this exactly. The 2020 virtue was a 30-minute ship; the 2026 virtue is a 30-minute drop.

The flip is not arbitrary. The economics changed. When iteration was scarce (slow CI, manual coding, week-long design rounds), a fast prototype gave irreplaceable user-feedback signal. Speed mattered more than preparation. When iteration is cheap (generative tools produce full layouts in seconds), a fast prototype produces noise: "approximate everything." Now preparation matters more than speed, because spec quality is what the AI amplifies.

**Does not supersede `belief.ship-the-prototype`:** Agam still ships. The second-brain v1 launch (2026-04-23: "Plain markdown. Git. Open source. MIT. Free forever.") is shipping. What died was the sub-axiom that "quick and dirty is acceptable." The successor position: ship the well-spec'd prototype.

**Trilogy relationship (2026-04-09):** Spec > Sprint, Taste > Execution, and Context > Prompt are siblings, not a hierarchy. They are three views of one disposition across three layers: process (what you write before building), craft (what you discriminate worth building), and tooling (what context you give the model). All three appeared in the same post; all three name the same structural claim: the load-bearing work has migrated from doing to deciding. Wiki surface: one theme page, not three.

## Cross-links

- Parent theme: wiki:spec-first-taste
- Related beliefs: wiki:beliefs:belief.taste-over-execution
- Related beliefs: wiki:beliefs:belief.context-over-prompt
- Related beliefs: wiki:beliefs:belief.anti-customization
- Related beliefs: wiki:beliefs:belief.ship-the-prototype
- Root disposition: wiki:root.substance-over-hype

## Evidence

- 2022-06-03 - "PM is the grind of answering 99 questions of 'should we do it?' to get to that 1 bonus question of 'can we do it?'" - linkedin-corpus, Cluster 6
- 2025-12-04 - "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings." - linkedin-corpus, urn:li:activity:7402319253036531712
- 2025-12-26 - "While I continue to spend more time practising these, it continues to benefit me to re-watch and re-read some of his material. To get this into my muscle memory." (Shreyas Doshi) - linkedin-corpus, Cluster 16
- 2026-04-08 - "I am going to be watching this very carefully." (Mythos observer posture) - linkedin-corpus, Cluster 16
- 2026-04-09 - "Tried and dropped Google Stitch in under 30 minutes...wrong fonts, wrong colors, approximate everything...Spec > Sprint / Taste > Execution / Context > Prompt" - linkedin-corpus, Cluster 16 (canonical)
- 2026-04-23 - "Plain markdown. Git. Open source. MIT. Free forever." (second-brain v1 launch, belief embodied as shipped product) - project.second-brain-v1

---
*Draft for Phase B HTML scaffolding.*
