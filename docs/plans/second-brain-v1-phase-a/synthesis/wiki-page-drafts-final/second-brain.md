---
type: Theme
slug: second-brain
title: Second brain  -  structured knowledge for agents
one_line: "The personal context layer that makes 'context over prompt' operationally tractable - plain markdown, git, kg.json, bidirectional with every AI session."
status: c-voice-r1-cp7
length_target: 1000-1500
voice_register: 1 (free-form post-essay)
beliefs:
  - belief.second-brain-is-context-layer (anchor; hobbyist scope, hint of universal per B3)
  - belief.self-instrumentation (trunk)
  - belief.quantified-self-as-mindfulness
  - belief.llm-as-primary-daily-tool (renamed from llm-as-voice-extension per B2; cross-list from ai-pm-skillset as input/precursor)
  - belief.personal-website-is-present-tense
---

# Second brain  -  structured knowledge for agents

This is one of twelve themes in the wiki. It is also the most self-referential one: this wiki IS the second-brain, built in public, launched 2026-04-23. You are likely here because "context over prompt" appeared somewhere on this site and you want the operational shape, or because you saw the launch post and want to understand the eight-year arc that preceded it. The page sits at the end of a four-step chain: self-instrumentation (2018) to quantified-self (2020) to LLM-as-daily-tool (2023) to this (2026).

One thing to know before reading: the second-brain is not a productivity tool or a Roam replacement. It is the substrate - plain markdown, git, a kg.json ontology - that every future AI session reads from and writes back to. That distinction is load-bearing everywhere on this page.

## The substrate, not the tool

Every AI session I run starts with the same brain and writes back to it. The context does not die when the chat window closes. The next session inherits everything the last one learned. That is the entire thesis.

Context over prompt is easy to say. It is the third line of the April 2026 trilogy: "Spec > Sprint. Taste > Execution. Context > Prompt." The second-brain is what makes the third line operationally true instead of aspirational. Without a persistent context layer, you are re-prompting from scratch on every session. With one, you are compounding.

The technical shape is intentionally simple: human-readable wiki in plain markdown, machine-readable ontology as kg.json, thin retrieve-quote-route layer via the /enter v3 terminal. Three layers, one substrate. The architectural decision is a direct expression of the belief: agents should read FROM the second-brain, not maintain their own state. /enter v3 is not an AI app with a brain. It is a window onto mine.

## How it formed - eight years, not eight weeks

The launch on 2026-04-23 is the current substrate of an eight-year practice, not a new idea.

**2018 - manual self-observation.** The first public expression was a gaming retrospection post on 2018-05-28 about V2 Games, the casual gaming platform I co-founded. "Retrospection is a real powerful tool." Four named patterns, a written-out hypothesis. No apparatus yet - just careful observation. The cognitive seed was already there: observable-self-patterns as an insight source.

**2020 - first externalization.** On 2020-02-20, I started tracking time with Toggl, logging not just work hours but personal chores. The post's closing line: "it isn't the tool, it's the habit of being mindful with time." That sentence is still the correct framing in 2026. The substrate changed six times. The practice did not.

**2023 - LLM as cognitive extension.** On 2023-03-14, six weeks after ChatGPT entered public discourse, I published the canonical statement: "To me, tis but an extension." The note-structuring use case was the hinge: "My notes have never been so actionable thanks to ChatGPT's help." That was the second-brain seed. The problem: context still died when the window closed. Every session started from zero.

**2024 - the stack hardened.** By mid-2024 I was running Ollama locally, ChatGPT Pro, GitHub Copilot, and custom GPT wrappers shaped around whatever curriculum I was chasing. The substrate kept upgrading. The practice stayed stable.

**Dec 2025 - private build begins.** The second-brain in its current form went private in December 2025. By the public launch I had been running it for over four months. The practice had already become my preferred way to use Claude before the announcement post went live.

**2026-04-23 - canonical launch.** Paste-prompt, setup guide, public artifact. "Plain markdown. Git. Open source. MIT. Free forever."

## Why it works now when it failed before

Most second-brain attempts broke on maintenance: keeping a personal knowledge system categorized and cross-linked was itself a full-time job. AI mostly solves that. The grunt work - categorizing, surfacing connections, updating cross-links - is automatable. Human judgment survives at two ends: upstream (what to include) and downstream (calibration, voice). The middle layer, which was the failure mode for every prior attempt I made, is now handled.

The 2026-04-21 announcement post names this directly: "The reason why second brains failed for most people was the effort of maintaining it. But with AI this grunt work is mostly solved."

The belief slug is `llm-as-primary-daily-tool` - a factual daily-use claim. LLMs are the tool I use more than any other in my stack. That is entirely separate from the voice-AI products I build professionally. The [`voice-ai-craft`](/wiki/voice-ai-craft/) theme covers that surface.

## The chain this operationalizes

The second-brain closes a four-step lineage. Self-instrumentation (2018) named the practice: observe your own patterns, write them down, they become insight sources. Quantified-self-as-mindfulness (2020) added the tool: a mediating layer between you and your patterns. LLM-as-primary-daily-tool (2023) added the co-processor: but one that reset every session. Second-brain-is-context-layer (2026) closes the chain: the co-processor now accumulates instead of resets.

The practical implication is that personal AI infrastructure is a cognitive extension, not a configuration you set up and forget. The LLM is bound into the workflow as a co-processor, and the second-brain is the persistent memory that makes compounding possible.

The "Context > Prompt" axiom declared on 2026-04-09 - twelve days before the launch - is what this theme is built for. Without the substrate, it is a slogan. With it, it is an engineering choice.

## Where to go from here

Three exits, depending on what you came for.

If you want the **agent-first application** - the direct link between this substrate and the serving-lens thesis - read [agent-first](/wiki/agent-first/). The second-brain v1 is named there as the canonical applied case: every future AI session reads the same brain and writes back to it.

If you want the **operational framing** - how the LLM-as-daily-tool belief sits in daily workflow across note-structuring, code-debugging, and brainstorming - read [ai-pm-skillset](/wiki/ai-pm-skillset/). That page holds the primary home for the operational claim; this page holds the architectural claim.

If you want the **axiom this theme operationalizes** - the "Context > Prompt" declaration with the full April 2026 trilogy - read [spec-first-taste](/wiki/spec-first-taste/). The second-brain is what makes the third line of that trilogy an engineering choice rather than a positioning statement.

## Evidence

**2018-05-28  -  gaming retrospection.** V2 Games self-classification: four named patterns extracted from gaming behavior through deliberate retrospection. The cognitive seed: observable-self-patterns as insight source. No apparatus yet, but the practice is in place.

**2020-02-20  -  Toggl + mindfulness-as-skill.** First externalization: a tool now mediates between Agam and his patterns. The it-isn't-the-tool maxim. "I have been using toggl.com to track my working hours. And soon after I was tracking my personal chores over here." Read-only by Agam; no synthesis, no cross-session compounding. But the habit is formed.

**2023-03-14  -  "tis but an extension."** The canonical anchor. Six concrete use cases. "Structuring my thoughts and notes  -  my notes have never been so actionable thanks to ChatGPT's help." Cognitive perimeter expands to include the LLM. The second-brain seed: but context still dies when the window closes.

**2023-04-16  -  agamarora.com v1 ships.** "It took me 12 years!" After 12 years of procrastination, the personal site goes live. Python + Streamlit, open-source. Sister belief: personal-website-is-present-tense. Externalizing identity to a public substrate is the same structural move as externalizing context to git.

**2024-05-31  -  per-subject GPT wrappers.** "I have created a personal GPT wrapper for each subject that I am after. I tend to look up top programs, look at their curriculum and add that as a structure to my wrappers. This has replaced my podcast addiction with a more interactive version."

**2024-06-05  -  local-first move.** ChatGPT outage triggers Agam to download Ollama + LLaMA3 + PHI3 and bind them to a keyboard shortcut. "But this prompted me to be prepared for the times when I have to be off-the-grid but with my trusty LLM peer."

**2026-04-09  -  Context > Prompt trilogy.** "Spec > Sprint. Taste > Execution. Context > Prompt." The thesis post that the second-brain operationalizes. Twelve days before the public launch.

**2026-04-21  -  second-brain announcement.** "The reason why second brains failed for most people was the effort of maintaining it. But with AI this grunt work is mostly solved. I have been using my second brain for over 4 months now and it has become my preferred way to use Claude."

**2026-04-23  -  canonical launch.** Paste-prompt, setup guide, public artifact. "All of us know the power of a personal context layer. Every future AI session reads the same brain and writes back to it. Plain markdown. Git. Open source. MIT. Free forever." Karpathy's LLM Wiki gist cited and credited; substance-over-hype move throughout.
