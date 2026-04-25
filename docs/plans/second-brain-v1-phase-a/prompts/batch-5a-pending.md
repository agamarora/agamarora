# Batch 5a — pending re-spawn (3 subagents, all background-async)

**Status:** Spawned 2026-04-25 CHECKPOINT 11. All 3 went background-async despite zero-mixed-tool message. If session ends before they write to disk, re-spawn from substitutions below using the universal template at `r4-batch-template.md`.

**Model:** sonnet (per project hard rule).

---

## 1. `belief.data-readiness-is-pipeline-not-corpus` (Tier-2 SEED — verify)

- Statement: "Data readiness does not just mean having a large historical corpus to train on but the systems to be able to continuously collect, process and update the training data." R3e seed from 2024-06-07 Collab item. Single-surface — VERIFY.
- Anchors: collab-articles-deep-dive.md (Cluster E) + belief-deep-dives/enterprise-ai-production-reality.md (parent)
- Relations: child of enterprise-ai-production-reality. Sibling moats-are-infra-talent-data. Connects to its-not-the-model-its-the-problem. Conditions AIonOS reality.
- VERDICT REQUIRED: CONFIRM / REFINE / MERGE (enterprise-ai-production-reality OR moats-are-infra-talent-data) / DEMOTE
- Output: `belief-deep-dives/data-readiness-is-pipeline-not-corpus.md` (12-20KB)

## 2. `belief.non-functional-reqs-are-55pct-of-failure` (Tier-2 SEED — verify)

- Statement: "55% of software production issues are due to non-functional requirements...Non-functional requirements are not just tick boxes that a PM needs to go through but actively work towards." R3e seed from 2024-03-08 Collab item. Numerical anchor characteristic.
- Anchors: collab-articles-deep-dive.md + belief-deep-dives/enterprise-ai-production-reality.md
- Relations: conditions enterprise-ai-production-reality. Sibling data-readiness-is-pipeline-not-corpus. Pairs with data-literacy-is-pm-core (numerical).
- VERDICT REQUIRED: CONFIRM / REFINE / MERGE (pm-taste / enterprise-ai-production-reality / data-literacy-is-pm-core) / DEMOTE
- Output: `belief-deep-dives/non-functional-reqs-are-55pct-of-failure.md` (12-20KB)

## 3. `belief.design-thinking-as-speed-tool` (Tier-2 SEED — verify)

- Statement: "Don't confuse design thinking with making UI/UX first. It is the process of aligning stakeholders and gathering diverse feedback. In the context of AI, I have a jupyter notebook where I try different models and a quick paper wireframe." R3e seed from 2024-05-24 Collab item. Contrarian re-framing.
- Anchors: collab-articles-deep-dive.md + belief-deep-dives/self-instrumentation.md + belief-deep-dives/spec-over-sprint.md
- Relations: also evidences self-instrumentation. Relates to spec-over-sprint + ship-the-prototype. Possible refinement of build-measure-learn.
- VERDICT REQUIRED: CONFIRM / REFINE / MERGE (self-instrumentation / spec-over-sprint / build-measure-learn) / DEMOTE
- Output: `belief-deep-dives/design-thinking-as-speed-tool.md` (12-20KB)

---

## Spawning protocol revision — backgound-async confirmed even with clean foreground

Despite zero mixed tools in spawn message, all 3 agents went background. Hypothesis: parallel Agent-tool calls in single message always go async on this Claude Code build. **REVISED PROTOCOL:** spawn 1 agent per message + wait for return, OR accept background-async and save re-spawn substitutions every batch (this file).
