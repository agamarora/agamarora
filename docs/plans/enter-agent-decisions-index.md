# /enter agent — decisions index

**Purpose:** single canonical entry point for "how does the /enter agent work, and what decisions have we made about it?" Future sessions read this first.

**Date created:** 2026-04-27
**Branch:** main
**Maintainer:** Agam Arora

---

## What we're building

`agent.agam` — a first-person AI agent that represents Agam Arora to visitors of agamarora.com. NOT a chatbot about him. It reads his structured wiki + KG, routes visitors through SSE-streamed trace + answer + cards, and hands off to specific pages.

Architecture is three layers:

```
┌─────────────────────────────────────────────────────┐
│  Layer 1 — WIKI (live, 36+ pages)                    │
│  Theme + belief + project + voice + quotes pages.    │
│  Human-readable, AEO-indexable, hand-authored prose. │
│  Source: /docs/plans/second-brain-v1-phase-a/        │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│  Layer 2 — KG (live, /wiki/kg.json)                  │
│  227 nodes (12 theme + 64 belief + 20 project        │
│  + 56 tech + 75 post) + 224 edges. Machine-readable. │
│  Source: scripts/build-kg.mjs reads ontology-v1.md   │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│  Layer 3 — /enter v3 (Phase D, IN PLANNING)          │
│  Thin runtime: classifier → wiki retrieval → LLM →   │
│  SSE trace+answer+cards. Reads layers 1+2; doesn't   │
│  re-derive synthesis at request time.                │
└─────────────────────────────────────────────────────┘
```

## Why we're building it

Per `second-brain-v1.md` §0:
- Wiki + KG already shipped. /enter v3 is the playback layer that turns synthesis into routed conversation.
- Launch gate is single-moment: wiki + agent + thesis post live together. No partial ship.
- Positioning: "AI guy, not voice AI guy." Wiki shows breadth; agent enforces breadth in routing decisions.

## Phase progression

| Phase | What | Status | Checkpoint |
|---|---|---|---|
| A | LinkedIn corpus → synthesis (themes, beliefs, voice spec, ontology) | ✅ DONE | CP-31 |
| B | Build pipeline (kg.json from ontology, wiki from drafts) | ✅ DONE | (rolled into C) |
| C | Reauthor wiki w/ §D1 voice + graph viz | ✅ DONE | CP-32 |
| AEO/SEO gate | Person schema, FAQPage/HowTo, Q&A overlay, BLUF, view-source audit, comparison tables, evidence outbound | ✅ CLEARED | CP-33 |
| C-polish | Graph hover refinement, sitemap refresh, build-clobber lesson | ✅ DONE | CP-33b |
| **D** | **/enter v3 + groqHandler upgrade — multi-provider LLM stack, classifier, abuse defense, eval harness 23/23** | **IN PLANNING** | (CP-34 target) |
| E | Launch (thesis post + 23/23 prod eval + monitoring on) | TODO | (CP-35 = LAUNCHED) |

---

## Locked decisions (do NOT relitigate)

Every decision below is settled. Future sessions reference these by file path; do not propose alternatives unless explicitly asked.

### Product / experience layer

| Decision | Doc | Section |
|---|---|---|
| Persona = P2 Operator (first-person agent, never speaks AS Agam) | `docs/plans/enter-v3.md` | §1 |
| Voice rules + banned words + deflection lines | `docs/plans/enter-v3.md` | §1 |
| Voice registers (4 registers + signatures + banned LLM-isms) | `docs/plans/second-brain-v1-phase-a/synthesis/voice-spec.md` | full |
| Sitemap DAG (pages + externals + actions + sub-agents) | `docs/plans/enter-v3.md` | §2 |
| Default intent → card routing | `docs/plans/enter-v3.md` + `kg-themes-summary.mjs` | §2 + `KG_DEFAULT_ROUTING` |
| 23 pinned scenarios (T01-T12, C01-C06, M01-M02, X01-X03) | `docs/plans/enter-v3-scenarios-v2.md` | full |
| Card taxonomy (5 types, anatomy, responsive rules) | `docs/plans/enter-v3.md` | §4 |
| Trace verb vocabulary + line format + animation | `docs/plans/enter-v3.md` | §5 |
| Empty / first-load state behavior | `docs/plans/enter-v3.md` | §6 |
| Positioning: "AI guy, not voice AI guy" | `docs/plans/second-brain-v1.md` | §0 |
| Card priority rule: 1 priority + 2-3 supporting per response, gold accent on priority | `docs/plans/enter-v3.md` | §2 + §4 |
| Launch gate: wiki + agent + thesis post live together, no partial ship | `docs/plans/second-brain-v1.md` | §0 + §8 |

### Knowledge layer

| Decision | Doc | Section |
|---|---|---|
| Ontology v1 (12 themes + 1 root, 250+ KG nodes) | `docs/plans/second-brain-v1-phase-a/synthesis/ontology-v1.md` | full |
| Theme list (10 + voice + quotes + projects + graph + beliefs + 1 root) | `docs/plans/second-brain-v1.md` | §4 |
| 21 binding taste-pass decisions (R3 etc) | `docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final/_taste-pass-decisions.md` | full |
| KG schema (Belief, Post, Comment, Project, Tech, Person, Company, Theme, Event, Skill) | `docs/plans/second-brain-v1.md` | §3 |
| `kg.json` plain JSON (JSON-LD convertible later) | `docs/plans/second-brain-v1.md` | §3 |
| LinkedIn corpus stays private (paraphrase + permalink, never republish full posts) | `docs/plans/second-brain-v1.md` | §1 |

### Runtime architecture (high-level — implementation details OPEN, see below)

| Decision | Doc | Section |
|---|---|---|
| Request flow: client → server → classify → route → build prompt → stream SSE | `docs/plans/second-brain-v1.md` | §6 |
| Cheap-first model waterfall (specifics shifting; see open decisions) | `docs/plans/second-brain-v1.md` | §6 |
| System prompt has STABLE (cached) + DYNAMIC sections | `docs/plans/second-brain-v1.md` | §6 |
| SSE event types: `trace`, `token`, `card`, `done` | `docs/plans/enter-v3.md` | §3 + §5 |
| Card emission: 2-4 cards per response, exactly 1 priority | `docs/plans/enter-v3.md` | §4 |
| Eval gate: 23/23 scenarios pass on production = launchable | `docs/plans/enter-v3-scenarios-v2.md` | §"Eval harness build notes" |

### Abuse defense framework

| Decision | Doc | Section |
|---|---|---|
| Cost cap is the only reliable defense | `docs/plans/second-brain-v1.md` | §7 |
| Tier 0 always-on $0 (UA gate + input val + dup cache + injection filter) | `docs/plans/second-brain-v1.md` | §7 |
| Tier 1 friction (per-IP bucket + low-effort gate + multi-key Groq rotation) | `docs/plans/second-brain-v1.md` | §7 |
| Tier 2 budget ceilings (daily $3 / monthly $30 / per-query $0.05) | `docs/plans/second-brain-v1.md` | §7 |
| Upstash failure modes: rate limit fail open, spend counter fail closed | `docs/plans/second-brain-v1.md` | §7 |
| Kill switches: `CLAUDE_DISABLED`, `LLM_DISABLED`, `WIKI_READ_ENABLED` | `docs/plans/second-brain-v1.md` | §7 |
| Tier 3-4 deferred (Cloudflare Turnstile, ASN, IP burst block, ML anomaly detection) | `docs/plans/second-brain-v1.md` | §7 |
| Account-less: no auth, no captcha v1 | `docs/plans/second-brain-v1.md` | §7 |

### Operational

| Decision | Doc | Section |
|---|---|---|
| Subagent model policy: sonnet default, haiku for trivial, never opus | `CLAUDE.md` | full |
| DRY chrome via `scripts/lib/chrome.mjs` + `npm run sync:chrome:check` CI guard | `CLAUDE.md` | full |
| Push to main after every commit (Netlify auto-deploy) | `CLAUDE.md` + auto memory | feedback |
| Honest counts on graph captions (no "227 nodes" while showing 144) | STATUS + DESIGN.md | full |
| No time-framing on public surfaces (dropped 2026-04-26) | `docs/plans/second-brain-v1.md` §0 + STATUS | full |

### Design / visual

| Decision | Doc | Section |
|---|---|---|
| Site-wide design tokens (gold #E5A54B, near-black, Satoshi/JetBrains Mono/Patrick Hand) | `DESIGN.md` | site-wide section |
| Constellation graph 13 §D2 invariants | `DESIGN.md` | ## Constellation graph |
| /enter v3 visual baseline = variant A CONSOLE w/ keyboard background | `docs/plans/enter-v3.md` | §"Visual direction" |
| Trace position between status bar + answer | `docs/plans/enter-v3.md` | §"Visual direction" |
| Cards work desktop + mobile (horizontal carousel desktop, vertical stack mobile) | `docs/plans/enter-v3.md` | §"Visual direction" |
| aa. mark Patrick Hand stroke-draw, locked on every v2 page | `MEMORY.md` + per-page CSS | full |
| Header icon bar on every v2 page (GitHub · LinkedIn · YouTube · Resume · Home) | `CLAUDE.md` + `chrome.mjs` | full |

---

## Open decisions (Phase D taste calls)

These 12 architectural calls are NOT yet locked. They were surfaced by today's eng review (2026-04-27, `~/.gstack/projects/agamarora-agamarora/reviews/plan-eng-review-phase-d-2026-04-27.md`). They affect implementation details; the product spec above does not change.

Full options + recommendations + blast radius for each: see `docs/plans/phase-d-decisions-2026-04-27.md` (companion doc).

| # | Open call | Lean recommendation |
|---|---|---|
| 1 | LLM provider abstraction shape | Single pool driver |
| 2 | Wiki retrieval mechanism | Bundle `wiki-extracts.json` at build time |
| 3 | SSE flow shape (1-call vs 2-call) | 1-call structured output |
| 4 | Classifier model pin + temp + enum validation | Pin + temp 0 + validate |
| 5 | Heuristic pre-routing in v1 | Yes, pull forward |
| 6 | Groq cool-down state location | Upstash-persisted |
| 7 | Eval per-provider matrix | Both Groq + Mistral required to pass |
| 8 | Spend ledger arithmetic | Atomic INCRBYFLOAT |
| 9 | Streaming buffer-first-50-chars | Yes |
| 10 | Tier 1 rate-limit values | 60 q/h + burst 5/10s |
| 11 | DeepSeek + Anthropic v1 inclusion | Defer (key staged, code path absent) |
| 12 | Test runner | `node --test` (built-in) |

Every "lean recommendation" is the eng review's call. Agam taste-pass closes each.

---

## Provider stack (current as of 2026-04-27)

User directive 2026-04-27: "we will use groq and mistral for now... rotate Groq keys first; if all three fail, move to Mistral."

```
Groq pool
  ├─ KEY  (GROQ_API_KEY)   ← existing
  ├─ KEY₂ (GROQ_API_KEY_2) ← added 2026-04-27
  └─ KEY₃ (GROQ_API_KEY_3) ← added 2026-04-27
       Round-robin per request. On 429: cool 60s, try next key.
       4-model fallback chain per key:
         llama-3.1-8b-instant → qwen3-32b → gpt-oss-20b → llama-3.3-70b-versatile

  ↓ (all 3 keys cooled OR all 3 hard-fail)

Mistral
  └─ MISTRAL_API_KEY  ← added 2026-04-27
       Model: mistral-small-latest (currently mistral-small-2506)
       Single key, no rotation pool.

  ↓ (Mistral fail)

Static fallback
  └─ kg.json default cards + canned message. No LLM call.
```

Staged but unwired in v1:
- `DEEPSEEK_API_KEY` (Phase 1.5 lift-up if Mistral cost or latency drifts)
- `ANTHROPIC_API_KEY` not in env (Phase 2 quality escape valve if added)

---

## Where to look for what

Quick navigator for next-session Claude:

| If you need... | Read |
|---|---|
| What is the agent's persona, voice, sitemap, cards, trace, empty state? | `docs/plans/enter-v3.md` |
| What scenarios must the eval harness pin? | `docs/plans/enter-v3-scenarios-v2.md` |
| What is the request flow, prompt structure, abuse defense framework? | `docs/plans/second-brain-v1.md` §6 + §7 |
| What are the implementation tasks in execution order? | `docs/plans/second-brain-v1-next-session-plan.md` Tasks 14-22 |
| What KG nodes/themes/edges does the agent retrieve from? | `docs/plans/second-brain-v1-phase-a/synthesis/ontology-v1.md` + `wiki/kg.json` |
| What signature voice patterns + banned LLM-isms apply? | `docs/plans/second-brain-v1-phase-a/synthesis/voice-spec.md` |
| What architectural decisions are still open? | `docs/plans/phase-d-decisions-2026-04-27.md` (this session's companion) |
| What did today's eng review surface? | `~/.gstack/projects/agamarora-agamarora/reviews/plan-eng-review-phase-d-2026-04-27.md` |
| What state are we currently in (last commit, last checkpoint)? | `docs/plans/second-brain-v1-phase-a/STATUS.md` |
| What was the last session's intent + pickup notes? | `docs/plans/NEXT-SESSION-RESUME-2026-04-27.md` |
| What design tokens / chrome / graph invariants apply? | `DESIGN.md` |
| What hard rules govern the project? | `CLAUDE.md` |

---

## Maintenance protocol

When a Phase D decision is finalized via taste-pass:
1. Update `phase-d-decisions-2026-04-27.md` Decision column.
2. Update this index's "Open decisions" table — move the row from "Open" to "Locked".
3. Amend the spec doc(s) called out in the row's blast radius.
4. Bump STATUS.md checkpoint with a one-line note.

When a new architectural decision arises post-Phase D:
1. Add a row to "Open decisions" with options + recommendation.
2. Taste-pass.
3. Move to "Locked" with cross-references.

This index doc is the single front door. Keep it scannable. Keep it current.
