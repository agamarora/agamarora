# interim-taste-calls.md

Taste-pass decisions made by Agam INLINE during Round 3 (before formal Task #2b taste-pass). These bind downstream rounds — do not relitigate.

Updated 2026-04-24.

---

## Decision 4 — Em-dash is NOT Agam's fingerprint (Round 3c finding, not Agam pushback — but binding for downstream rounds)

**Context:** Round 3c style fingerprint quantified punctuation patterns: only 3 em-dashes in 287 posts (0.01/post). LLMs commonly default to em-dashes as "intelligent prose" marker. Agent prompts elsewhere may have wrongly assumed Agam uses em-dashes (this CC session has been writing with em-dashes — wrong).

**Binding effect:**
- Agent voice spec MUST exclude em-dashes as a "use this" signature
- Agent voice spec MUST include them in soft ban-list ("avoid; if you generate one, regenerate")
- Real rhythm tools to USE: **colon** (1.24/post in E4 — peak, the actual signature), plain hyphen-with-spaces (` - `, 0.28/post in E4), rare ellipsis
- Banned LLM-isms confirmed: em-dash flourish, paragraph balance, "It's not just X, it's Y" cadence
- All future synthesis subagents: when extracting voice samples, do NOT favor em-dash-containing lines (selection bias would over-represent them)

**Open question for Agam taste-pass (Task #2b):**
- Dec 2024 → Jun 2025 is a 164-day silence (longest in E4, second-longest all-time). Round 3c flagged: was this intentional (AIonOS heads-down ship) or life-event? Agent should know how to represent the gap.

---

## Decision 1 — Interior design pivot: DROP

**Context:** Round 1 (E1 subagent) flagged a 2017-11-04 post about a residential interior design consulting venture with Agam's brother. Round 2 surfaced as outlier candidate ("biographical outlier, never resurfaces — decide whether to include as project node").

**Agam call:** DROP. "That was a few-month phase."

**Binding effect:**
- NOT a Project node in ontology
- NOT in outlier shortlist for taste-pass
- NOT cited as evidence anywhere
- Subagents may still encounter the post; ignore it for ontology purposes

---

## Decision 3 — LinkedIn Collaborative Articles: KEEP as signal, NOT pablum

**Context:** Round 3b (comments + network analysis, 2026-04-24) flagged 58 of 283 comments (~20%) as LinkedIn AI-prompt pablum from "Collaborative Articles" feature. Recommendation: exclude from voice samples + ban-list the 5-bullet canned format.

**Agam call (expanded 2026-04-24):** REJECT R3b recommendation. "I poured a lot of effort there. Collaborative article content includes a lot more nuanced technical material than anything... because I was grinding for top badges. If you get enough likes on a comment, one was awarded. I managed to get into the top 1-2% of each AI and Product Management. So the comments I posted on these articles were gems."

**What this means:**
- Collaborative Articles were a COMPETITION SURFACE — badge incentive forced quality
- Agam achieved **Community Top Voice** (top 1-2% globally) in BOTH AI and Product Management categories
- Per his own framing, these comments contain his MOST nuanced technical material — denser than free-form posts
- R3b's "5-bullet canned format = pablum" heuristic is exactly wrong: the format constraint forced compression of real expertise, not generic prompt-response

**Binding effect:**
- DO NOT exclude Collaborative Article items from the corpus
- DO NOT ban the 5-bullet format from agent output (it's a register Agam genuinely uses)
- INCLUDE Collaborative Article items in voice samples — they're a third evidence stream alongside posts + free-form comments
- Round 4 (per-belief deep dive) and beyond: include Collaborative Articles as evidence for AI-PM craft beliefs (`belief.ai-pm-skillset`, `belief.pm-taste`, etc.)
- Treat them as a SPECIFIC REGISTER ("structured-prompt response" — peer to post-essay, comment-zinger, mentor-mode/playbook), not as noise
- Round 3b's "ban-list for agent output" needs to drop the Collaborative-Article entry; the others (CFBR, generic "Amazing", emoji-only) still hold

**Why this matters:**
- R3b's heuristic was "format = pablum." Wrong heuristic. Format is structural; effort + insight is content. Same form can be lazy (someone else) or load-bearing (Agam).
- The agent's voice fidelity DEPENDS on capturing all 4 registers (post-essay, comment-zinger, mentor-playbook, structured-prompt). Drop any one and voice flattens.
- The pivot pattern (synthesizer-as-author overrides subagent's "noise" judgment) repeats here — feedback memory `feedback_synthesizer_as_author.md` applies again.

**Re-process implication for R3b output:**
- The 58 Collaborative Articles need re-analysis as PRIMARY technical-content surface, not as 4th-register-among-equals
- **Spawn dedicated Round 3e** — "Collaborative Articles deep dive" subagent — extracts technical signal, builds belief evidence map, identifies which AI + PM topics Agam ranked top-1-2% on (those topics = strongest credentialed expertise)
- Output: `synthesis/collab-articles-deep-dive.md`
- This gets PARALLEL priority to remaining R3 work (R3c style, R3d cross-post still in flight)
- Deferred-to-R8 plan REJECTED — these need first-class treatment now

**New ontology nodes implied:**
- `Achievement: linkedin-top-voice-ai` (status: held, span: TBD-cite from corpus)
- `Achievement: linkedin-top-voice-pm` (same)
- These become Achievement nodes the agent can cite when asked about credentials/recognition
- Topic-area expertise edges: collab-article responses on TOPIC X → demonstrates → belief.expertise-area-X (granular technical claims, not just "AI generally")

---

## Decision 2 — Voice-AI under-representation: INTENTIONAL, not ghost

**Context:** Round 1 (E4) + Round 2 flagged voice-AI as a "ghost theme" — only 2 corpus posts despite being AIonOS day-job (4M+ calls/year). Implied agent needs corpus-supplemental grounding (resume.md) to represent voice work truthfully.

**Agam call:** Intentional. "I talk little about voice ai because I don't want to box myself into voice ai."

**Binding effect:**
- This is consistent with locked positioning ("AI guy, not voice AI guy" — spec §0)
- Voice-AI stays a wiki theme (still locked §4 #2: `voice-ai-craft`) — but theme page emphasizes craft/principles, not "this is what I do"
- Agent must NOT lead with voice-AI as the answer to "what does Agam do?" — voice is ONE example among many, not THE example
- When agent describes Agam, prioritize: agent-first thesis → AI PM craft → range → voice-AI as one application
- Project lineage page (Round 3a output) shows voice-AI work but does NOT center it
- The "ghost theme" framing from Round 2 is REPLACED by "deliberately under-shared theme" — different downstream implication

**Why this matters:**
- Without this call, the agent would over-index on voice-AI when grounded against resume.md (which emphasizes voice-AI). With this call, the agent represents Agam's *positioning preference*, not just his *day-job reality*.
- The wiki + agent project the brand Agam wants, not the brand his employer assigns him.

---

## How downstream subagents apply these

- **Round 3a (project + tech lineage):** Drop interior-design from project list. Voice-AI projects (shararat, AIonOS voice platform, others) listed but DO NOT mark as "primary" or "lead" — they're peer to MCP work, agent-first builds, second-brain, etc.
- **Round 3b (comments network):** Don't add interior-design-related people if they only appear via that 2017 post.
- **Round 3c (style fingerprint):** Drop the 2017-11-04 post from style sample. May skew word frequency.
- **Round 3d (cross-post references):** Don't trace interior-design as a recurring theme (it isn't). Voice-AI references should be counted accurately but flagged with "intentional under-share" annotation.
- **Round 4 (per-belief deep dive):** Don't propose `belief.voice-ai-as-identity` — Agam explicitly rejects identity-level voice-AI framing.
- **Round 6 (per-theme wiki drafts):** voice-ai-craft theme page leads with craft/principle, not with day-job framing.
- **Round 9 (final consolidation):** agam-profile-v1 Position section says "AI PM with range; voice-AI is one application of many, not core identity."
