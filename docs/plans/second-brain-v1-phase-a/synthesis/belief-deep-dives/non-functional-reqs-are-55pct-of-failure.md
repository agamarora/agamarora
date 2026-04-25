# Belief deep-dive: `belief.non-functional-reqs-are-55pct-of-failure`

**Status:** seed (R3e proposed — R4 evidence pass, single primary surface but claim confirmed multi-surface)
**Theme:** theme.pm-taste (primary), theme.enterprise-ai-reality (secondary seed-edge)
**Provenance:** R3e (Collab Articles deep-dive seed) + R4 (this pass)
**Generated:** 2026-04-25 — R4 per-belief subagent
**Inputs read:** linkedin-corpus.md (279 posts, 2014-2026), linkedin-comments.md (2,800+ comments), master-belief-list.md, collab-articles-deep-dive.md (R3e seed), enterprise-ai-production-reality.md (parent belief R4 deep-dive), interim-taste-calls.md (5 binding decisions applied)
**Binding taste-calls applied:** Decision 1 (interior-design dropped — not relevant), Decision 2 (voice-AI under-share intentional — NFR-as-failure-mode is the right frame, not "voice AI has NFRs"), Decision 3 (Collab Articles ARE primary — the 2024-03-08 item is the origin surface; treated as first-class evidence), Decision 4 (em-dashes NOT Agam signature — none generated in quotables), Decision 5 (silences not dramatized — single-surface provenance is empirical discipline, not omission)

---

## 1. Refined statement

**Non-functional requirements — performance, scalability, security, and ease of use — are not the residue of engineering taste after functional requirements ship. They are the dominant failure mode.** Standish Group's 2023 Chaos report puts the number at 55% of software production issues traceable to NFR failures, not functional-requirement gaps. In the era of feature-packed products, the smoothest and most reliable experience is what separates great from good. A PM who treats NFRs as a compliance checklist — tick boxes to clear before launch — has already lost. The PM craft is to make NFRs primary, verifiable, and owned, not delegated to QA at the end of a sprint.

**The claim has two levels:**
1. **Empirical (Standish-anchored):** a cited 55% rate from an industry research body. This is the level that should be verified or revised by Agam before the wiki publishes the number.
2. **Dispositional (PM-craft):** treat NFRs as primary work, not secondary. This level is stated multiple times across 2024-2025 in different forms and holds regardless of whether the 55% number is precisely right.

The dispositional level is what makes this a real belief. The Standish citation is the numerical anchor that gives the belief its characteristic Agam voice — he prefers to land a claim with a specific number rather than a vague majority. If the 55% number cannot be verified, the belief survives as a dispositional claim; only the numerical-anchor register changes.

**Relation to parent:** This belief is a specific instantiation of `belief.enterprise-ai-production-reality`. If "building for a demo vs. building for production is a different beast," then the beast is made of NFRs. The 55% Standish number is the PM-facing quantification of what "production reality" means at the requirement-specification level.

---

## 2. Evidence (chronologically ordered)

Era distribution: E3-tail spring 2024 (3 entries — origin + immediate peer confirmations) + E4a fall 2024 (3 entries — from canonical production-reality anchor and 2 confirmatory posts) + E4b 2025 (2 entries — full-lifecycle extension + voice-AI field data) + E4b late-2025 (1 entry — PM-craft extension). 9 entries across 22 months.

### E3-tail — seed and immediate peer evidence (spring 2024)

**1. 2024-03-08 · Collab Article contribution · URN tail `7171698939044196352`**
The origin surface. Full text, verbatim: "According to Standish Group's Chaos report of 2023, 55% of software production issues are due to non-functional requirements. Function requirements are what your product is supposed to do whereas non-functional requirements define how your product is supposed to carry out the tasks it is meant to do. Not having clear and verifiable non-functional metrics pose the bigger threats. Examples of non-functional requirements are performance, scalability, security and ease of use. In the era of great looking and feature packed products having the smoothest and bug free experience is what sets a great product apart. Non-functional requirements are not just tick boxes that a PM needs to go through but actively work towards."
Per Decision 3 (Collab Articles primary). This is the only surface where the 55% Standish number appears explicitly. Contains all three claim-components: empirical anchor (55%), NFR taxonomy (performance, scalability, security, ease of use), and PM-craft directive (not tick boxes — actively work towards). The phrase "clear and verifiable non-functional metrics" is load-bearing — verifiability makes NFRs testable, not aspirational.

**2. 2024-03-06 · Collab Article contribution · URN tail `7171171307559043072`**
Two days before the Standish citation, Agam contributes a Tech-PM identity piece that frames the job as: "building for the functional requirements while keeping the non-functional requirements right in front of you always." This is the dispositional level of the claim stated independently of the Standish number, two days before it. The proximity and the phrasing ("right in front of you always") is not incidental — Agam was thinking about NFRs as PM-primary in early March 2024, and the Standish citation was the numerical support he found for a pre-existing disposition. This reversal of order matters for belief-history: the disposition precedes the citation.

**3. 2024-03-29 · Collab Article contribution · URN tail `7179486165190721538`**
"Whether you decide to build or buy the next version you need to ensure you have plans to sunset the legacy version. It's not just about moving users but also ensuring all security, data and impact on other dependent services is handled." Security and data handling named as first-class concerns in a product-lifecycle decision (build-vs-buy / sunset-planning). NFRs are not framed as launch-gates but as ongoing strategic constraints. Cross-evidences `belief.enterprise-ai-production-reality` (NFRs loom large at EOL, not just at launch). Three weeks after the Standish citation, the underlying claim is operative in a different context.

### E4a — anchor + first restates (fall 2024)

**4. 2024-09-04 · post · `urn:li:activity:7236941772336066560`** (canonical 9 takeaways)
Takeaway 2: "Ethics and security concerns reign supreme." Takeaway 9: "Accuracy increases in importance as we move to more B2C use cases." Both are NFRs. Ethics and security = the security/governance NFR bucket. Accuracy = correctness-at-production-scale, an NFR for AI systems specifically. The 55% Standish number is NOT restated here, but two of the nine takeaways from 60 days of enterprise AI demos are NFR failures. The underlying claim (NFRs dominate failures) is structurally confirmed by field data, even if the specific number is not re-cited. This is the strongest corpus-side evidence that the dispositional level of the belief is real and independently arrived at from field experience, not just imported from a Standish report.

**5. 2024-11-21 · post · `urn:li:activity:7265354682963771393`** (product sunset post)
"Managing an End of Lifecycle Product is a beast in itself... Think legacy support... internal change management... external change management (training/retraining/adoption)... cost impact of running parallel products... Pricing impact and ROI." The five considerations for a product sunset are all NFR-adjacent: legacy support = reliability/compatibility NFR; change management = usability/adoption NFR at migration; cost impact of parallel products = operational NFR. This confirms the full-lifecycle extension: NFR primacy is not just a launch concern — it governs product death as much as product birth. The "beast in itself" phrasing echoes "a different beast" from the 9 takeaways.

**6. 2024-06-04 · post · `urn:li:activity:7204134749513162752`** (multi-agent systems warning)
"If you are trying [multi-agent systems] without the support of big tech be prepared to spend exponentially more time in debugging and performance tuning. Instead of having one point of failure and a central biased inefficient model you are now looking at a bunch of models. Each can have their own different bias, fairness and performance issues... Are you ready to handle the increased load on your LLMops and dev teams? Is your data in place? Do you have the right middleware/orchestration layer set up? Are you ready for the increased scale due to redundant data transfers?" This is an NFR checklist for multi-agent AI. Performance tuning, bias/fairness, scale-readiness, data architecture — the four questions at the end are all NFRs. Agam surfaces them as "are you ready" questions rather than feature questions. The claim that NFRs dominate failure is operative here three months before the 9 takeaways crystallizes it as production-reality.

### E4b 2025 — confirmation + field-data precision

**7. 2025-09-29 · comment-thread reply · URN tail `7378427141190799360`** (voice-AI production field reply)
"North star metric — business metric (% of cases handled with neutral to positive customer NPS). Tech kpi to optimise for us was achieve a certain blended cost per minute + certain TTFT for the whole voice pipeline." Per Decision 2, voice-AI is one example among many. But this comment is the single most precise corpus example of an NFR being operationalized into a production-grade KPI. TTFT (time to first token) for a voice pipeline IS a latency NFR with a specific numeric target — not a tick box. The fact that Agam named the "blended cost per minute + TTFT" as THE tech KPI (not model accuracy alone, not feature completeness) confirms the "actively work towards" directive in the 2024-03-08 origin.

**8. 2024-12-25 · post · `urn:li:activity:7277158028422914048`** (prompt engineering phase-out)
"If the performance of your application is walled by the user's ability to write a genius prompt, good luck!" Ease-of-use framed as a production constraint. Frictionlessness = usability NFR. If usability is wall-blocked by prompt complexity, the application fails at scale. This is the ease-of-use NFR from the 2024-03-08 taxonomy ("ease of use" is one of the four examples) applied to the specific AI-usability problem of prompt-dependence. The 2024-03-08 claim predicted this exactly — ease of use is not a nice-to-have, it is a production gate.

### E4b late-2025 — PM-craft extension

**9. 2025-12-04 · post · `urn:li:activity:7402319253036531712`** (anti-customization)
"Today's 'super customizable' product eventually requires six months of implementation, an implementation partner, hundreds of training documents, and a roadmap item just to enable a true day-zero go-live." This is an NFR failure in the enterprise B2B context: excessive customization destroys time-to-value (an operational NFR), onboarding-complexity (usability NFR), and implementation reliability (scalability NFR under new customer load). Agam's anti-customization stance is an NFR argument wearing a product-philosophy coat. The word "frictionless" (from `belief.value-viability-usability-triad`) and the NFR taxonomy from 2024-03-08 are the same claim at two scales.

---

## 3. Counter-evidence

**Three candidate violations:**

**3.1 Feature-shipping language in early-era posts (2017-2022)**
Across E1-E2, Agam's posts are largely functional-requirement oriented — what products do, what tech enables, what features ship. FarEye logistics optimization posts (2019-2023) are outcome-framed without explicit NFR awareness. Reads as: NFR primacy was not part of Agam's visible PM vocabulary before 2024. Mitigation: this is an era effect, not a contradiction. The Collab Articles badge grind (Nov 2023 to Feb 2024) appears to have crystallized formal NFR language from Agam's existing operational practice. The 2024-03-06 post ("keeping the non-functional requirements right in front of you always") suggests the practice predated the vocabulary — but the explicit belief-as-articulated-claim is a 2024 emergence.

**3.2 Speed-focus in early AI posts (2024-06-03)**
"OpenAI celebrates GPT-4o's remarkable speed. I, too, initially praised its fast performance upon launch. However, within a week, I find myself urging it to deliberate and proceed thoughtfully." This post critiques speed as insufficient — which COULD read as de-prioritizing a performance NFR (speed) in favor of accuracy. But read carefully, it is the opposite: Agam is saying speed without accuracy violates the accuracy NFR ("still going in circles, just a tad bit faster"). This is an NFR trade-off awareness post, not an anti-NFR post.

**3.3 The 55% number is unverified in the corpus**
The Standish Group's 2023 Chaos Report is cited but the corpus contains no secondary confirmation of the 55% statistic. The 2024-03-08 item is the only occurrence. Standish Chaos reports historically address project failure rates (on-time, on-budget, on-scope), not specifically NFR failure distribution. The 55% number as stated may be: (a) Agam's accurate recall of a genuine Standish finding; (b) Agam's synthesis of a Standish-adjacent stat into NFR framing; or (c) a misattribution where the 55% was from a different study. This is the most significant counter-evidence: the number is asserted with confidence ("According to...") but only appears once in 22 months of corpus. If a fact of this magnitude were foundational, Agam's numerical-anchor habit (confirmed by R3c: 0.55 citations/post in E4) would suggest it would reappear. It does not. **This is an Open Q for taste-pass** (see Section 8 Q1).

**Net counter-evidence verdict:** The single genuine tension is the Standish number's unverified status and single-surface occurrence. The dispositional claim ("NFRs are the dominant failure mode in production; PMs must treat them as primary work") holds across 9 evidence items. The counter-evidence weakens the empirical level; it does not affect the dispositional level. The belief survives the counter-evidence test for the dispositional form. The empirical form needs taste-pass verification before the wiki commits to "55%" as a stated figure.

---

## 4. Belief history

### Pre-crystallization (2014-2023): dispositional background, no explicit NFR language

Across E1-E3b, Agam's work is operationally quality-conscious (FarEye logistics optimization, LLM comparator performance benchmarking) but the explicit NFR frame does not appear. The operational instinct is present: Agam runs performance tests, benchmarks models against "reliable, accurate, safe" (2024 LLM comparator post), and applies precision-first language. The vocabulary is tacit.

### Crystallization event: 2024-03-06 to 2024-03-08 (E3-tail, Collab Articles sprint)

**Two-day window, two Collab items:**
- **2024-03-06** (URN `7171171307559043072`): "building for the functional requirements while keeping the non-functional requirements right in front of you always." Dispositional level stated without a number.
- **2024-03-08** (URN `7171698939044196352`): Standish 55% citation added. Numerical-anchor level stated. The belief is complete.

The two-day sequence suggests Agam found the Standish number between the 6th and 8th and deployed it as evidence for a claim he had already made dispositionally. Per the numerical-anchor style fingerprint (R3c), he would not have led with the Standish citation in isolation — it confirms a pre-existing stance. The stance came first; the number validated it.

This is consistent with the badge-grind context (Decision 3): Collab Articles were a competition surface where Agam was writing at maximum compression and citation density. The 55% appears here because this is the surface where Agam was most likely to surface research-grade anchors for PM-craft claims.

### Immediate reinforcement (2024-03-29)

**Three weeks later**: the "security, data and impact on other dependent services" item (URN `7179486165190721538`) applies the claim to a build-vs-buy/sunset decision. Not a repeat of the Standish number — a different NFR instance, different context, same underlying hierarchy: NFRs are first-class strategic constraints, not launch-gate tick boxes.

### Field-data confirmation (2024-09-04)

**60 days into AIonOS**, Agam publishes the 9 takeaways. Takeaways 2 and 9 are NFRs. The Standish number is not restated, but the claim is confirmed by field data: out of 9 observations from enterprise AI demos, 2 are pure NFR failures. That is 22% of the canonical production-reality belief expressed as NFR claims. Not 55% — but consistent with NFRs being disproportionately represented in what enterprises flag in real demos.

**The gap between 55% (Collab citation) and 22% (implied from 9 takeaways structure) is itself informative.** Either the 55% applies to general software (not AI-specific), or the 9 takeaways collapsed multiple NFR sub-issues into ethics/security and accuracy bins, or the production rate for enterprise AI is lower because AI POCs die before NFRs can even surface (they fail earlier, on data-readiness or business-case grounds). This is an Open Q.

### Full-lifecycle extension (Q4 2024-Q4 2025)

- **2024-11-21 sunset post**: NFRs at product death (legacy support, migration reliability, change management).
- **2025-09-29 voice-AI field reply**: NFRs operationalized into production KPIs (TTFT, blended cost per minute).
- **2025-12-04 anti-customization post**: NFRs at PRD-layer (customization destroys usability and time-to-value NFRs before the product even ships).

The belief expands from "NFRs cause failures at launch" to "NFRs govern the full product lifecycle from PRD to sunset." This is a maturation, not a change of substance.

### Current status (2026-04-25)

Active, dispositionally confirmed, numerically unconfirmed in the public corpus. No supersession. The agent can cite the underlying claim confidently. The 55% number should be cited with a verification note pending taste-pass.

---

## 5. Relations

### Parent (this belief conditions)

**`belief.enterprise-ai-production-reality`** — direct parent. The production-reality belief names "a different beast" between demo and production. This belief specifies what makes it a beast: NFRs are the dominant failure mode. The 2024-03-08 Standish item appears in enterprise-ai-production-reality.md §2 as a seed evidence item precisely because it anchors the failure-mode at the requirement level. The two beliefs are vertically stacked: production-reality is the observation; NFR-55pct is the mechanism.

### Sibling (same parent, different failure mode)

**`belief.data-readiness-is-pipeline-not-corpus`** — sibling seed under `belief.enterprise-ai-production-reality`. Both were seeded in R3e from the same Collab Articles sprint window (March-June 2024). Both name a specific failure mode within the production gap. Data-readiness is the data-architecture NFR failure mode; NFR-55pct is the general NFR failure mode. Together they cover the two most common reasons enterprise-AI POCs die in production: the data-pipeline is wrong, and the quality attributes were never specified as primary. Neither is a functional-requirement failure.

### Sibling (numerical-anchor signature)

**`belief.data-literacy-is-pm-core`** — the R3e deep-dive suggests these pair by style: both use specific numerical anchors (55% for NFRs; Agam uses AARRR-level metric specificity for data literacy). The numerical anchor is the style fingerprint that connects them. Both are PM-craft beliefs with cited quantification, both live in `theme.pm-taste`. A wiki reader encountering one would expect the other nearby.

### Downstream (this belief enables)

**`belief.value-viability-usability-triad`** — usability is an NFR. The 2024-06-07 Collab item ("usable as close to frictionless as possible") is the specific AI-product application of the ease-of-use NFR from the 2024-03-08 origin. Usability-as-binding-constraint in the triad is an NFR argument — frictionlessness cannot be an afterthought. The triad is the positive frame; NFR-55pct is the failure-mode frame. They are complementary.

**`belief.anti-customization`** — the anti-customization stance is grounded in NFR failure: excessive customization destroys usability, time-to-value, and implementation reliability. The 2025-12-04 post is an application of the NFR-as-primary-work principle to a specific product decision. NFR-55pct is the abstract; anti-customization is the concrete.

### Conditions

**`theme.enterprise-ai-reality`** — the NFR belief is seeded into this theme via its secondary theme edge. When enterprise AI POCs die, they die for NFR reasons: ethics/security (takeaway 2 of 9-takeaways), accuracy at B2C scale (takeaway 9), time-to-value (takeaway 7), platformness/scalability (takeaway 5). All NFRs. The 55% rate provides the theme-level statistical frame: if you are running 10 experiments and 8 fail, and 55% of software failures are NFR-driven, then 4-5 of your 8 failures trace to NFR problems. The two beliefs (production-reality + NFR-55pct) form a statistical argument together.

---

## 6. Wiki candidacy and VERDICT

### Evidence summary for decision

| Factor | Score | Notes |
|--------|-------|-------|
| Primary surface count | 1 (explicit) + 8 (implicit/confirmatory) | Only 1 surface cites the 55% number; 8 confirm the dispositional claim |
| Era distribution | 22 months (Mar 2024 - Dec 2025) | Consistent span, not concentrated |
| Round provenance | R3e seed, R4 confirmation | Single prior round proposing |
| Numerical anchor verification | OPEN | 55% appears once; Standish attribution unconfirmed in corpus |
| Relationship density | 6 connections | Parent, 2 siblings, 2 downstream, 1 theme condition |
| Distinctness | High | No other belief covers "NFRs as primary-work PM craft" at this specificity |
| Theme fit | Dual: pm-taste (primary), enterprise-ai-reality (secondary) | Clean fit on both |

### VERDICT: CONFIRM as seed-belief with notation

**CONFIRM** — the belief earns wiki placement as a seed-belief that may be upgraded to core after Agam's taste-pass confirms or revises the 55% number.

**Reasons to CONFIRM rather than MERGE or DEMOTE:**

1. **Distinct from parent.** `belief.enterprise-ai-production-reality` names the gap between demo and production. This belief names the mechanism at the requirement level. They are vertically related, not synonymous. A wiki that has production-reality but not NFR-55pct is missing the PM-craft prescription: what should a PM DO with the production-reality insight? The answer is: treat NFRs as primary work.

2. **Distinct from pm-taste anchor.** The `theme.pm-taste` anchor beliefs (pm-is-99-should-we-1-can-we, spec-over-sprint, taste-over-execution) are about PM judgment quality. NFR-55pct is about PM requirement management practice. The belief is additive, not redundant.

3. **The dispositional claim is multi-surface.** Even stripping the 55% number, the underlying claim ("NFRs are primary work, not tick boxes") appears in at least 4 distinct corpus items across 22 months (2024-03-06, 2024-03-29, 2024-09-04 takeaways 2+9, 2025-12-04). This clears the single-surface objection.

4. **Numerical-anchor form is characteristic.** The 55% citation is exactly the form Agam uses to anchor PM-craft beliefs. Dropping the number entirely to merge into a vaguer parent belief would lose the stylistic fingerprint (R3c numerical-anchor pattern). The wiki should preserve the number-with-note-to-verify.

**Reasons NOT to upgrade to core at R4:**

1. The 55% Standish number does not reappear in 22 months of subsequent corpus. For a numerical anchor Agam cites publicly, this is unusual. Either the number is wrong/misremembered, or the Collab Articles badge-grind context produced a citation Agam would not stand behind in a different register.

2. Single-explicit-surface provenance makes this structurally a seed by the master-belief-list taxonomy (core = multi-round + multi-surface).

**Wiki recommendation:** Include under `theme.pm-taste` with a semantic sub-note: "NFR primacy confirmed multi-surface (2024-2025); 55% Standish anchor present but single-surface — confirm in taste-pass before treating as Agam's cited statistic." Cross-link to `theme.enterprise-ai-reality` as secondary theme.

---

## 7. Most quotable expressions

Ranked by (a) standalone deployability, (b) voice-fidelity, (c) Agam numerical-anchor signature.

**Tier-1 (deploy first):**

1. **"Non-functional requirements are not just tick boxes that a PM needs to go through but actively work towards."** (2024-03-08, URN `7171698939044196352`.) The core directive. Eleven words past the "not just" — the real statement is in the "actively work towards." This is the wiki-quotable line. Does not require the 55% number to land.

2. **"In the era of great looking and feature packed products having the smoothest and bug free experience is what sets a great product apart."** (2024-03-08, same item.) The competitive framing. Feature parity is table stakes; NFR execution is differentiation. Works as a standalone claim in any discussion about product quality.

3. **"Not having clear and verifiable non-functional metrics pose the bigger threats."** (2024-03-08, same item.) "Verifiable" is the load-bearing word. This makes NFRs testable and owned, not aspirational. Pairs with the data-literacy belief (measure everything).

**Tier-2 (deploy when more context is wanted):**

4. **"Building for the functional requirements while keeping the non-functional requirements right in front of you always."** (2024-03-06, URN `7171171307559043072`.) The dispositional version. "Right in front of you always" is the position claim — not occasionally, not at QA sign-off, but always. Better for questions about PM workflow than for questions about failure modes.

5. **"Ethics and security concerns reign supreme."** (2024-09-04, takeaway 2.) Field-data version of the belief. Three words: "reign supreme" is strong and deployable. Works in the enterprise-AI context specifically.

6. **"Accuracy increases in importance as we move to more B2C use cases."** (2024-09-04, takeaway 9.) NFR scaling claim. Relevant when the conversation is about AI product quality at consumer scale. Names accuracy as an NFR (not a feature) and makes it context-dependent (more important at B2C).

**Tier-3 (NFR numerical anchor — deploy only with verification note):**

7. **"According to Standish Group's Chaos report of 2023, 55% of software production issues are due to non-functional requirements."** (2024-03-08.) The numerical anchor. Characteristic Agam form. Deploy only after taste-pass confirms the number. Currently should be cited as: "Agam references 55% from Standish's 2023 Chaos report — [pending confirmation]."

---

## 8. Open Q

Questions that R4 evidence does not resolve — for Agam taste-pass.

**Q1. Is the 55% Standish number still a number you stand behind?**
The 55% figure appears once in the corpus (2024-03-08 Collab Article) and not again in 22 months. Agam's numerical-anchor habit (R3c: 0.55 citations/post in E4) suggests this number would reappear if it were foundational. Three hypotheses: (a) Agam recalls it accurately and it is a live cite; (b) the 55% number was specific to the Collab-badge-grind register — useful there, not restated elsewhere because the register did not call for it again; (c) Agam's confidence in the number has since shifted. **This directly affects wiki language:** should the wiki say "55% per Standish 2023" or "NFRs are the dominant failure mode in software production"? Only Agam can answer.

**Q2. Does the 55% apply to general software or to enterprise-AI specifically?**
If the Standish 2023 number is for all software projects (not AI-specific), then the wiki should be careful not to import it directly into the enterprise-AI failure discussion without adjustment. Enterprise-AI failures may have a different NFR distribution (accuracy + latency are AI-specific NFRs not in traditional Chaos methodology). The belief may hold at both levels, but the scope affects how the wiki stitches it to `belief.enterprise-ai-production-reality`.

**Q3. How should the wiki handle the TTFT-as-NFR evidence from the voice-AI field reply?**
The 2025-09-29 comment (TTFT + blended cost per minute as tech KPI) is the single most operationally precise NFR evidence in the corpus. Per Decision 2, voice-AI is intentionally under-shared. Options: (a) include as worked-example with voice-AI framing; (b) abstract to "latency + cost are NFRs in AI production pipelines" without naming voice-AI; (c) omit from wiki entirely and use it only as evidence in the deep-dive. Recommendation: (b) — the operational principle (latency and cost are NFRs to own, not features to defer) holds for all AI pipelines, not just voice.

**Q4. Upgrade to core after taste-pass, or keep as seed?**
If Agam confirms the 55% number and it is traceable to Standish Group's published research, the belief strengthens from "characteristic numerical-anchor with verification note" to "cited industry statistic with Agam's PM-craft directive." That would be a promotion argument to core. If the number is revised or dropped, the belief remains as a dispositional seed — still wiki-worthy, slightly less punchy.

**Q5. Is "not having clear and verifiable non-functional metrics" a distinct belief from this one?**
The phrase "clear and verifiable non-functional metrics" implies a measurement belief — NFRs must have numeric success criteria, not just descriptions. This is close to `belief.data-literacy-is-pm-core` (measure everything) applied to requirement engineering. Is this worth a separate sub-belief (`belief.nfr-metrics-must-be-verifiable`) or is it captured by the parent? The distinction matters for how the wiki handles PM-specification craft as a topic.

---

**End of R4 deep-dive — `belief.non-functional-reqs-are-55pct-of-failure`.** Inputs read, 9 evidence items across 22 months, all 5 interim taste-calls applied, parent/sibling/downstream relations mapped, CONFIRM verdict with seed-status and verification note on 55% number, wiki placement recommended under theme.pm-taste with cross-edge to theme.enterprise-ai-reality.
