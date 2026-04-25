# belief.value-viability-usability-triad — R4 deep dive (Tier-2 SEED verification)

**Slug:** `belief.value-viability-usability-triad`
**R3e proposed status:** seed (single-surface)
**R4 verdict (this round):** **REFINE → demote-to-heuristic + merge under `belief.idea-validation-3-pillars` as AI-context refinement edge.** Standalone-belief status not warranted on current evidence.
**Confidence:** medium-high. One direct corpus surface; one fragmentary near-surface; the parent V/C/S frame is established multi-round; the IDEO/IBM-Design "desirable/feasible/viable" lineage is well-known industry vocabulary, so single-surface deployment is more plausibly **register** than **identity-level claim**.

---

## 1. Refined statement

**As Agam wrote it (verbatim, the only full surface — 2024-06-07 Collab, urn tail 7204678803065905153):**

> "Value, viability and usability. Like any other product, your AI project/product should demonstrate substantial value that users are willing to pay for, it's viable for the business to build with clear ROI and it's usable as close to frictionless as possible."

**R4 framing recommendation (post-demotion):**

Treat as a **deployment** of `belief.idea-validation-3-pillars` into the AI context, with the AI-specific axis-swap explicitly noted:

- 2020 general form (V/C/S): **Value / Consumers / Scalability** — for any new project. Scalability is the binding constraint when the failure mode is distribution.
- 2024 AI-specific form (V/V/U): **Value / Viability / Usability** — for AI projects. Usability is the binding constraint because the AI failure mode is user-cognitive-friction (does the user trust it, can they get a good answer fast?), and consumers/distribution become a downstream concern.

This belongs in the wiki as a **worked example** under `belief.idea-validation-3-pillars`, not as an independent thesis.

---

## 2. Evidence — corpus + comments

**Multi-surface scan result: 1 direct surface, 1 fragmentary near-surface, 0 corroborating restatements.**

### 2.1 Direct surface (the seed)
- **2024-06-07** (urn tail **7204678803065905153**, Collab Article "How to evaluate AI project viability"). Full quote in §1. The simplest, cleanest, and **only** statement of the V/V/U triad in the corpus.

### 2.2 Fragmentary near-surface — "value and viability" without usability
- **2024-03-23** (urn tail **7177150883988738048**, comment on Tushar Vishwakarma's BMC post): "I've used BMC to validate early concepts of a product. I usually map the product as a company and by charting it out on a BMC I usually get a version which is similar to PRFAQ by Amazon PMs. You will know mostly everything about your product, **its perceived value and viability.** All that is left next is to validate."
  - Two-pillar fragment, not the triad. Missing the third axis. Reads as **set vocabulary** ("value and viability" is a stock pairing in PM/BD discourse), not as deliberate triad invocation.
  - Same speaker, ~10 weeks before the V/V/U Collab item. Suggests "value + viability" is a stable pairing in Agam's frame; usability is the AI-context add-on, not a long-held third leg.

### 2.3 Restatements after 2024-06-07 — none found
Searched corpus + comments for any of: `value-viability-usability`, `viability-usability`, `value.{0,30}usability`, `frictionless`, `substantial value`, `users willing to pay`, `clear ROI`. **No further deployments anywhere in 2024 H2, 2025, or 2026.** The triad does not propagate.

### 2.4 Echo in 2024-09-04 nine-takeaways post — NEGATIVE
The 2024-09-04 "9 takeaways from GenAI POCs" post is the era-defining production-reality anchor. If V/V/U were Agam's working frame, you'd expect it cited here (3 months later, same AI-PM topic, longer canvas). Instead the 9 takeaways post deploys different language: "10 experiments → 2 production grade wins," "horizontal AI doesn't scale," "agentic AI is the new direction," "governance is now table stakes," "systems must serve agents." Production-reality belief subsumed and recoded the AI-PM evaluation question without preserving the V/V/U triad.

### 2.5 Echo in mentor-mode comments — NEGATIVE
No mentor-mode reply, recruiter-Q reply, or career-advice comment in the corpus restates V/V/U. Compare with `belief.idea-validation-3-pillars` (V/C/S), which Agam has been observed redeploying conceptually (BMC comment above carries "value and viability" forward) — V/V/U is not similarly redeployed.

### 2.6 Echo in Apr-2024 Collab burst — NEGATIVE
The 2024-04-29 single-day 7-item Collab burst (the badge-quota-hit batch, per R3e §2.0) does not include V/V/U. The triad arrives 5 weeks later as a one-off response.

**Net evidence count beyond seed: 0 confirming, 1 fragmentary supporting (the BMC comment's "value and viability" pairing — supports the V+V backbone but not the triad).**

---

## 3. Counter-evidence — different triads at different surfaces

Agam uses **different triads on different topics**, and the V/C/S form is the only one with multi-round muscle.

| Triad | Surface | Date | Topic |
|---|---|---|---|
| **Value / Consumers / Scalability** | Post (urn tail 6685080724728496129) | 2020-07-04 | "Tips for idea validation" — general project frame. Multi-round provenance (R2, R3a). Canonical. |
| **Value / Viability / Usability** | Collab (urn tail 7204678803065905153) | 2024-06-07 | "How to evaluate AI project viability" — AI-context. **Single surface.** |
| **Humans-over-resources / Trust-over-contracts / Value-over-revenue** | Comment | (E2 era, urn tail under 4448 in linkedin-comments.md) | "our three pillars of continuous human growth" — gaming-studio retrospective on team culture. |
| **Infrastructure / Talent / Data** | Post (`belief.moats-are-infra-talent-data`) | 2024-12-04 | Enterprise AI moats. Multi-round. |
| **Spec / Taste / Context** | Post (`belief.spec-over-sprint` triad: Spec > Sprint, Taste > Execution, Context > Prompt) | 2026-04-09 | Live-now PM craft. Multi-round. |

Agam **deploys triads as a rhetorical shape often** — but most triads in the corpus are topic-specific frames, not deeply held identity-level beliefs. The V/V/U triad lives at the same density-tier as the "humans-over-resources" pillars — single surface, topic-bounded, register-driven. The V/C/S triad is the exception: it has a 4-year history with redeployments and lineage; V/V/U is not (yet) at that density.

This patterns supports **demotion** rather than confirmation: a belief Agam genuinely holds at identity level redeploys; V/V/U has not redeployed in ~22 months since its single 2024-06-07 surface.

---

## 4. Belief history

- **Origin (2020-07-04, V/C/S form):** General-purpose 3-pillar idea-validation frame. First clean PM framework post in the corpus. 5 months pre-FarEye. Crystallization of `belief.idea-validation-3-pillars` from prior `belief.build-measure-learn` lineage.
- **Fragmentary echo (2024-03-23):** "perceived value and viability" as the BMC-derived pairing. The V+V backbone visible without the third axis.
- **AI-context deployment (2024-06-07):** Usability gets added as the third axis, replacing scalability. Triggered by Collab prompt "How to evaluate AI project viability." This is the seed.
- **No subsequent crystallization:** 22 months of subsequent corpus content (2024-06 → 2026-04) contains zero restatement, zero recall in mentor-mode, zero echo in the 2024-09-04 production-reality anchor post that ought to inherit the frame if it were active.
- **Adjacent crystallizations 2024-06 onward:** the production-reality belief crystallizes (Sep 2024); enterprise-AI moats triad crystallizes (Dec 2024); agent-first crystallizes (Jun 2025). None of them cite or extend V/V/U.

This is the **profile of a topic-bounded register answer**, not a thesis-in-formation. Compare with `belief.context-over-prompt` (2026-04-09) which crystallizes once and immediately propagates into the spec/taste/context triad and gets repeated in the second-brain launch material — that's what crystallization looks like.

---

## 5. Relations

- **Refines `belief.idea-validation-3-pillars` (V/C/S) for AI-context.** Same shape, axis-swap (Consumers/Scalability → Viability/Usability). Recommended ontology edge: V/V/U as a **deployment instance** of V/C/S, not a peer belief. Note explicitly: "AI-PM context replaces Scalability with Usability because the binding constraint moves from distribution to friction."

- **Lives downstream of `belief.ai-pm-skillset-table-stakes`.** Per ai-pm-skillset-table-stakes deep dive §6 (already written): "Lives downstream of table-stakes — only an AI-fluent PM has the standing to use this triad." The triad is *what* an application-layer AI-PM evaluates by; the table-stakes belief is *that* an AI-PM exists at all.

- **Feeds into `belief.enterprise-ai-production-reality` weakly.** The "viable for the business to build with clear ROI" axis of V/V/U is the same proposition that gets recoded as "10 experiments → 2 production grade wins" in the Sep-2024 post. The production-reality post **subsumes** the viability axis of V/V/U into a stronger, more empirical frame. Once subsumed, V/V/U becomes vestigial.

- **Sibling to other AI-PM evaluation frames Agam deploys.** AARRR (level-1 + level-2 metrics, 2024-02-11), STP (2023-11-22), STAR (anti-hype frame, 2024-05-24), NFRs-are-55%-of-failure (2024-03-08). V/V/U sits in this same Collab-era set of "structured evaluation frames an AI-PM applies." None of these individual frames is a standalone identity belief — they're all **applied frameworks** under the parent belief `belief.learn-concepts-not-tools` ("frameworks endure; tools change").

- **Per `learn-concepts-not-tools.md` §3.2 row 14:** V/V/U is already cataloged as one of the frameworks Agam deploys, under the parent `belief.learn-concepts-not-tools`. This further supports the demotion-to-applied-framework recommendation.

---

## 6. **VERDICT**

### **REFINE → demote-to-heuristic + merge under `belief.idea-validation-3-pillars` as AI-context refinement edge.**

**Justification (one sentence as required):** With exactly one direct corpus surface, zero restatements over 22 months, no echo in the production-reality anchor post that would have inherited it, and visible subsumption of its "viability" axis into stronger downstream beliefs, V/V/U does not clear the multi-surface bar for standalone belief status — it is a register-driven AI-context deployment of the established V/C/S frame, best represented in the ontology as a refinement edge plus a worked-example node, not as a peer belief.

### What this means concretely

**DROP from belief list as a standalone slug.** Do not promote `belief.value-viability-usability-triad` to core. Remove from the seed-belief tally.

**ADD to ontology as:**
- A **node attribute** on `belief.idea-validation-3-pillars`: `ai_context_form: V/V/U (Value/Viability/Usability) — usability replaces scalability as binding constraint when failure mode is user-cognitive-friction rather than distribution.`
- A **post-evidence edge** from the 2024-06-07 Collab item to `belief.idea-validation-3-pillars` with edge type `deploys-AI-form-of`.
- A **post-evidence edge** from same item to `belief.learn-concepts-not-tools` with edge type `applied-framework` (parallels how STP, AARRR, STAR are cataloged).

**Master-belief-list update (R5 input):** master-belief-list.md should drop `belief.value-viability-usability-triad` from §Beliefs alphabetical and from §R4 spawn list Tier-2. Open Q #5 ("V/V/U vs V/C/S — keep both?") resolves to **NO, merge V/V/U as AI-context refinement of V/C/S.** Note the merge in §Merges performed.

**Wiki implication:** the wiki page for `belief.idea-validation-3-pillars` (theme: pm-taste / ai-pm-skillset cross-listed) should include the V/V/U deployment as the AI-PM-specific worked example, with the explicit axis-swap commentary. Do NOT give V/V/U its own page.

**Voice/agent implication:** if asked "how do you evaluate AI projects?", agent may invoke V/V/U as **a framework Agam has deployed** (cite the 2024-06-07 Collab) — but should not present it as Agam's primary or signature frame. Agent should reach first for production-reality (10 experiments → 2 wins), moats-are-infra-talent-data, or its-not-the-model-its-the-problem when the question is about Agam's *own* AI-PM evaluation lens. V/V/U is in the toolbox, not the byline.

### Why not full DEMOTE-to-evidence-pool footnote?

A full demote would lose the AI-context axis-swap insight — that **usability replaces scalability as the binding constraint in AI** is a genuinely interesting refinement of V/C/S, even if Agam stated it once. The refinement deserves preservation as ontology metadata on V/C/S, not consignment to a footnote. The merge-with-edge approach captures the insight while accurately representing the evidence weight (single-surface).

### Why not CONFIRM standalone?

Three independently sufficient reasons:
1. **Single direct surface** — the bar for standalone belief is multi-surface (R3e §evidence-density-rule).
2. **Zero post-2024-06 restatement** — even when Sep-2024 production-reality post was the obvious place to redeploy, Agam did not. Either the frame slipped or it was always a register-answer.
3. **Visible upstream subsumption** — the viability axis is now better-evidenced by `belief.enterprise-ai-production-reality` (5-round provenance, 2024-09-04 anchor + 2025-06-20 confirmation). Keeping V/V/U standalone would create redundant evidence-edges into a stronger belief.

### Why not full MERGE without retention?

The axis-swap commentary (scalability → usability for AI) is a real insight worth preserving. Pure merge without metadata loses it. Hence the proposed solution: V/V/U as **named-form-of** edge + node attribute on V/C/S, not as standalone slug.

---

## 7. Most quotable expressions

If wiki page for `belief.idea-validation-3-pillars` keeps the AI-context worked-example sub-section, these are the lines:

- **The triad statement (use verbatim):** "Value, viability and usability. Like any other product, your AI project/product should demonstrate substantial value that users are willing to pay for, it's viable for the business to build with clear ROI and it's usable as close to frictionless as possible." — 2024-06-07.
- **The general-form companion (use verbatim):** "The three pillars of starting any project are value, consumers and scalability." — 2020-07-04.
- **The BMC-pairing fragment (optional, supporting):** "by charting it out on a BMC I usually get a version which is similar to PRFAQ by Amazon PMs. You will know mostly everything about your product, its perceived value and viability." — 2024-03-23.

These three together, sequenced 2020 → 2024-03 → 2024-06, narrate the frame's evolution: V/C/S general → V+V backbone (BMC use) → V/V/U AI-context. That's the wiki-viable story.

---

## 8. Open Q for Agam taste-pass (post-R9)

R3e Open Q #5 (master-belief-list.md §Open-Q row 6) asks: **"two distinct beliefs with refinement edge, or one belief with context-specific triad?"** R4 preliminary recommendation was "keep both." This deep-dive **inverts** that preliminary call to **merge with refinement edge**.

**Specific Agam taste-pass questions:**

1. **Do you still hold V/V/U as your AI-project evaluation frame in 2026-04?** Or has the production-reality lens (10 experiments → 2 wins) + agent-first lens replaced it as your working frame? If V/V/U is still active, R4 should be revisited and the belief promoted. If it was a 2024 register-answer that's been subsumed, the demote+merge stands.

2. **Is "usability replaces scalability as binding constraint in AI" a sentence you'd actually write?** This is the load-bearing axis-swap insight. If yes, it earns its place as ontology metadata on V/C/S. If no (i.e., you'd argue scalability still matters in AI, or some other axis matters more), the wiki worked-example needs different framing.

3. **For wiki copy:** would you rather (a) have V/V/U as a sub-section under V/C/S titled "AI-context form" with both triads quoted, or (b) drop V/V/U from wiki entirely and only retain V/C/S? Affects whether the worked-example survives at all in user-facing wiki, vs. lives only in the kg.json metadata.

4. **Cross-cut to `belief.learn-concepts-not-tools`:** are you comfortable with V/V/U being cataloged as one of "the frameworks Agam deploys" (alongside STP, AARRR, STAR, NFRs, RWDA)? This is the cleanest home post-merge.

---

## 9. Application of binding taste-calls

- **Decision 1 (interior-design DROP):** N/A — no interior-design surface in V/V/U evidence.
- **Decision 2 (voice-AI under-share INTENTIONAL):** N/A — V/V/U is not voice-AI-specific.
- **Decision 3 (Collab Articles = signal not pablum):** Applied. The 2024-06-07 Collab item is the seed and is treated as legitimate primary evidence, not noise. The triad is in **register #4 (structured-prompt-response)** — the verdict accounts for register: register-4 register can carry real beliefs (V/V/U *is* a real evaluation frame Agam invoked), but density-of-deployment outside register-4 is what would lift it from heuristic to identity-level belief. Demotion is not because the Collab is "low-quality" — it is because the frame did not propagate.
- **Decision 4 (em-dash NOT signature):** Applied — this deep-dive avoids em-dashes; uses colon and plain `-with-spaces` per the style fingerprint.
- **Decision 5 (silences are normal, not dramatized):** N/A directly, but adjacent: the 22-month gap between V/V/U statement (2024-06) and now (2026-04) is *not* a silence-as-meaning-bearing event; it is an absence of restatement, which is evidence about the belief's salience to Agam, not evidence about Agam's professional cadence.

---

*End of value-viability-usability-triad R4 deep dive. Verdict: REFINE → demote standalone status, merge under `belief.idea-validation-3-pillars` as AI-context refinement edge with metadata. Master-list update + ontology edge proposed. Agam taste-pass Q #1-3 needed before final lock.*
