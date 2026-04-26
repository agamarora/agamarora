---
type: Theme
slug: second-brain
title: Second brain  -  structured knowledge for agents
one_line: "The personal context layer that makes 'context over prompt' operationally tractable - plain markdown, git, kg.json, bidirectional with every AI session."
status: draft-r9-polished
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

*Era: 2018 to 2026 · 14+ posts · 5 beliefs*

---

## Core belief

Built this for me. Karpathy-inspired wiki version. Not a product, not a prescription.

Every future AI session reads the same brain and writes back to it. The second-brain is not a productivity tool. It is not a notes app, a Roam replacement, or a knowledge-management system. It is the substrate: plain markdown, git, a kg.json ontology. Any AI session (Claude, ChatGPT, Cursor, Claude Code) reads from it and writes back to it, so the next session inherits everything the last session learned. The belief is that this compounding is the lever. Context > Prompt. The second-brain is what makes that operationally true, not just a slogan.

If you are a builder working with AI tools daily, the pattern probably generalizes. Try it. Don't take my word for it.

---

## How it formed

The arc starts in 2018, not 2026. The second-brain launch on 2026-04-23 is the current substrate of an 8-year practice, not a new idea.

**2018: manual self-observation.** The first public expression of this loop was a gaming retrospection post on 2018-05-28 about V2 Games, the casual gaming platform Agam co-founded. "Retrospection is a real powerful tool. Only after looking into my gaming behavior and patterns I could realise my urge for gaming was never to indulge in virtual world but for the competitive element of it." No apparatus yet: just careful self-observation, four named patterns, a written-out hypothesis. The cognitive seed is in place. Observable-self-patterns are an insight source.

**2020: the first externalization.** On 2020-02-20, Agam started tracking time with Toggl, logging not just work hours but personal chores. The post's closing line: "it isn't the tool, it's the habit of being mindful with time." That sentence is still the correct framing in 2026. The substrate changed six times; the practice did not.

**2023: LLM as cognitive extension.** Six weeks after ChatGPT arrived in public discourse, Agam published the canonical statement on 2023-03-14: "To me, tis but an extension." The post listed six use cases where ChatGPT was embedded in his workflow: data analysis with Jupyter and Pandas, note-structuring, brainstorming, PRD proofreading, Linux home-lab setup, code-debugging. The note-structuring line is the hinge: "My notes have never been so actionable thanks to ChatGPT's help." That is the second-brain seed. The problem is that the context died when the chat window closed. Every session started from zero.

That same month, on 2023-04-16, agamarora.com v1 shipped. After 12 years of putting it off, the site went live. "You are a brand, and you should have your own nameplate." Externalizing identity to a public artifact is the same structural move as externalizing context to a git repository: both are substrates of self that outlast any single session or conversation.

**2024: the stack hardened.** By 2024-Q1 through Q3, the personal AI stack ran concurrently across Ollama locally, ChatGPT Pro, GitHub Copilot, plus custom GPT wrappers for data analytics, writing, and PRD summarization. One per-subject wrapper shaped around whatever curriculum Agam was chasing: "This has replaced my podcast addiction with a more interactive version." The substrate kept upgrading; the practice stayed stable.

**Dec 2025 onwards: private second-brain.** The private build began around December 2025. By the time of the public launch, Agam had been running it for over four months. The 2026-03-25 comment to Milan Dhingra on an Obsidian + Claude Code "Chief of Staff" thread describes it in operational-use voice: tracing decisions, pulling in stakeholder inputs, auto-updating the public-facing knowledge surface. Not a demo; a working context layer that had already become the preferred way to use Claude.

**2026-04: the launch.** On 2026-04-21, Agam published the announcement framing. On 2026-04-23, the canonical launch: the paste-prompt, the setup guide, the public artifact. "Plain markdown. Git. Open source. MIT. Free forever." The Dec 2024 through Jun 2025 silence that preceded this was heads-down time on the day job and family, not a gap in thinking. The build was already underway; the posts stopped, but the practice did not.

---

## What it implies

The second-brain operationalizes a belief that runs through all of Agam's E4 work: context is the lever, not the prompt string. The April 2026 trilogy states this directly: "Spec > Sprint. Taste > Execution. Context > Prompt." The third line is what the second-brain is built for. Without a context layer, context > prompt is aspirational. With one, it is an engineering choice.

The practical implication: personal AI infrastructure is a cognitive extension, not a configuration. The LLM is not a tool Agam uses and puts down. It is bound into the workflow as a co-processor, and the second-brain is the persistent memory that makes the co-processor accumulate rather than reset.

This has a specific technical shape. The wiki is human-readable. The kg.json ontology is machine-readable. The /enter v3 terminal is a thin retrieve-quote-route layer over both. Three layers, one substrate. The architectural decision is a direct expression of the belief: agent runtime should read FROM the second-brain, not store its own state. /enter v3 is not an AI app with a brain; it is a window onto Agam's brain.

The "why it failed before" framing matters here. Most second-brain attempts broke on maintenance: keeping a personal knowledge system updated and cross-linked was itself a job. AI mostly solves that. The grunt work of categorizing and surfacing connections is automatable. Human judgment is upstream (what to include) and downstream (calibration, voice). The middle layer, which was the failure mode, is now handled.

The belief slug is `llm-as-primary-daily-tool`  -  factual daily-use claim. LLMs are a great tool; I use them daily more than any other tool in my stack. This is entirely separate from voice-AI products; see the [`voice-ai-craft`](/wiki/voice-ai-craft/) theme for that.

---

## Tension with `ai-pm-skillset`

The belief `belief.llm-as-primary-daily-tool` lives in both themes. As an operational claim, it belongs under ai-pm-skillset: how Agam uses AI in daily workflow, from note-structuring to code-debugging to brainstorming. As an architectural claim, it belongs here: the LLM as the cognitive substrate that makes the context layer meaningful.

Primary home: ai-pm-skillset (the operational framing). Cross-listed here as the precursor belief in the substrate chain. The second-brain page closes the chain. Four-step lineage: self-instrumentation (2018) to quantified-self-as-mindfulness (2020) to llm-as-primary-daily-tool (2023) to second-brain-is-context-layer (2026).

Cross-link: [`ai-pm-skillset`](/wiki/ai-pm-skillset/) for the operational framing, and [`spec-first-taste`](/wiki/spec-first-taste/) where the "Context > Prompt" axiom this theme operationalizes was declared.

---

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

---

---

*Polished: taste-pass decisions applied 2026-04-26.*
