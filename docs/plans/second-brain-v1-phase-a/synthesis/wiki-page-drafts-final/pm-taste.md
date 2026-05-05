---
type: Theme
slug: pm-taste
title: "PM taste as risk mitigation. The 99/1 discipline."
one_line: "PM work is 99% discrimination and 1% invention. Every yes is a decision to defer the question worth asking."
status: c-rubric-v2-revised-2026-05-05
length_target: 800-1200
voice_register: 1 (free-form post-essay)
beliefs:
  - belief.strong-opinion-about-no-strong-opinions
  - belief.pm-is-99-should-we-1-can-we
  - belief.pm-is-featherless-hat
  - belief.pm-as-parenting
  - belief.anti-customization
  - belief.data-literacy-is-pm-core
  - belief.build-measure-learn
  - belief.idea-validation-3-pillars
  - belief.non-functional-reqs-are-dominant-failure-mode
  - belief.design-thinking-as-speed-tool
---

# PM taste as risk mitigation. The 99/1 discipline.

The week a major enterprise prospect asked us to add forty-seven configuration toggles to close the deal, I said no. The sales lead gave me the look. You know the look. The product shipped six weeks later with zero settings and the implementation closed in three weeks instead of six. That compression is what PM taste actually looks like in enterprise. Not a design sensibility, but a risk-management function enforced under commercial pressure.

Taste is not aesthetics. It is the disciplined enforcement of "should we" before "can we" at every decision point in a product cycle. The PM who lacks it ships a feature factory. The PM who enforces it ships software that survives production. Enterprise deployments with six-month implementation cycles and multi-team support contracts do not forgive feature factories. Every premature "yes" compounds into rework that rarely shows up on the original roadmap.

## The ratio that defines the role

Product management is not a role you see when it is done right.

The 99/1 frame names the cognitive structure of the job: ninety-nine "should we do it" judgments for every one "can we do it" question. That single "can we" is the disruption window. Everything else is the cost of protecting access to it. A PM who says yes to ninety of the ninety-nine fills the pipeline with engineering effort that defers the one question worth answering. And the pipeline becomes a liability. Backlogs exist to be evaluated and deprecated, not to be built.

Three metaphors built this argument across three years, and they converge on the same operating discipline.

First, the parenting frame: "Building a product is like raising a child. You'll have to make tough decisions and piss people off at higher places to ensure least influence on your goal." Refusal as primary craft. Not creation, not output, not shipping cadence.

Second, the featherless hat: "Product management is a featherless hat that is omnipresent yet indistinguishable if done properly." A feathered hat announces itself. A featherless hat does the job without claiming the room. When PM taste holds, the product foregrounds the engineers who built it and the users who needed it. When it fails, everyone notices the PM's absence as the root cause.

Third, the ratio itself: "Product management is the grind of answering 99 questions of 'should we do it?' to get to that 1 bonus question of 'can we do it?' That 1 is disruption. The rest, food." Discrimination is the craft. Refusal is the output. The rare "can we" only materializes when the ninety-nine were enforced correctly.

## Anti-customization at the PRD layer

Customization is deferred design. Every toggle is a decision a PM refused to make.

The anti-customization stance is the 99/1 discipline made personal and costly: "I am extremely opinionated about adding customization to products. To the point where I feel like I've lost a hard-fought battle with myself if a PRD ends up including customization settings." The phrase "hard-fought battle with myself" is not rhetorical. Each customization setting is a pre-paid mortgage on every future deployment. Enterprise sales pressure routinely produces the ask. The informed answer, in most cases, is no.

The economic argument is enterprise-rooted. Six-month implementation cycles, foundation-model coupling, training-document overhead. A product with no settings pane ships a PM's decided stance. Forty-seven preference toggles ship a PM's inability to decide. The evaluation team at procurement can often read the difference. "Super customizable" closes the demo. It extends the implementation and, in my experience, reliably degrades the customer satisfaction score.

## Data literacy as scope enforcement

The PM who cannot scope data's explanatory power is doing astrology with better charts.

Data literacy in this context is not the ability to write SQL. It is the discipline of knowing which questions data can answer, then building against that category and refusing to build against the remainder. "Just because you open an umbrella when it's raining does not mean it will rain whenever you open the umbrella. Not everything can be explained by your data. Identify what can be, and build accordingly." The PM who fails this boundary correlates their way into the wrong product. Some should-we judgments are answered with data. Others require taste. Confusing the categories is a compounding error.

The build-measure-learn loop is only worth running if the first build is aimed at a real question. Idea validation enforces three constraints before a sprint begins: value (does the user actually need this), consumers (who specifically, how many, at what willingness to pay), and scalability (can the business structure support it). Skipping these three is not shipping fast. It is shipping blind, and the signal arriving six months later is more expensive to act on than the conversation that should have happened before sprint one.

## Non-functional requirements as primary PM work

NFRs are where most enterprise products fail. Not because engineers miss them. Because PMs delegate them.

Performance, scalability, security, compliance: these are not sprint-end QA checkboxes. They are the specification layer where the PM does the work that no one credits when it holds and everyone notices when it breaks. NFR targets specified upfront, owned by the PM, enforced as hard constraints through the build cycle. Latency thresholds, uptime SLAs, security scope named in the PRD. Or they become engineering judgment calls under delivery pressure. Engineering judgment calls under delivery pressure produce incidents. This pattern holds across every enterprise context I have worked in.

This is featherless-hat work at the requirement layer. Invisible when right. Audible when wrong. The PM who treats NFRs as load-bearing ships into enterprise accounts and stays in them. The PM who defers NFRs ships a demo that fails the security review six weeks into implementation. (The security review is not optional. It is just sometimes optional to prepare for it. And that choice shows up in the implementation timeline.)

Design thinking belongs at this same layer: as a speed and alignment tool, not a UI/UX process. The paper wireframe and the model-comparison notebook are the same move. Make something touchable before committing engineering capacity. Align stakeholders on what the product actually does before the sprint begins. The velocity multiplier in design thinking is upstream alignment, not downstream iteration.

## The conviction that has to survive the meeting room

PM taste enforced at institutional scale is a risk-management function. Every refused feature is a deployment that ships cleanly. Every enforced NFR is an enterprise deal that closes and stays closed. The 99/1 discipline is the mechanism.

The harder part is that the conviction has to survive the meeting room where "super customizable" gets the loudest applause and the VP of Sales is citing the deal at stake. The PM who holds the line ships products that survive production cycles, scale through enterprise onboarding, and deliver the NPS lift that drives upsell. The PM who caves to the room ships roadmaps. Roadmaps and products are not the same thing, and the market eventually makes that distinction for you.

Forward question: if the 99/1 discipline is the right frame for traditional PM work, what does the same ratio look like when the PM is speccing agent behavior instead of feature behavior? The discrimination problem gets harder. Not because agents are more complex, but because the cost of a bad "yes" scales instantly through the model. If you're working through that question, I'd like to compare notes.
