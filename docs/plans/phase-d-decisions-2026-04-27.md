# Phase D — open architectural decisions

**Date:** 2026-04-27
**Branch:** main · HEAD `741bfe0` (decisions taste-passed same session)
**Companion to:** `docs/plans/enter-agent-decisions-index.md`
**Source:** `~/.gstack/projects/agamarora-agamarora/reviews/plan-eng-review-phase-d-2026-04-27.md`
**Status:** ✅ TASTE-PASSED 2026-04-27 by Agam Arora. All 12 rows locked.

## Locked decisions at a glance

| # | Decision | Choice | Notes |
|---|---|---|---|
| 1 | LLM provider abstraction | A — single `llm-pool.mjs` | |
| 2 | Wiki retrieval | A — bundle `wiki-extracts.json` at build | |
| 3 | SSE flow | A — 1-call structured output | client stagger is theatre |
| 4 | Classifier | A — pin Groq `llama-3.1-8b-instant`, temp 0, enum-validate | closes critical hallucinated-slug gap |
| 5 | Heuristic pre-routing | A — pull forward to v1 | |
| 6 | Groq cool-down state | A — Upstash-persisted + module-memory fallback | fallback on Upstash error, log + degrade |
| 7 | Eval per-provider matrix | **B — Groq only** | Mistral path untested in eval; risk: voice drift caught only in prod |
| 8 | Spend ledger | **DROPPED** | both providers free tier; no cost tracking, no daily/monthly/per-query caps |
| 9 | Streaming buffer | A — buffer first 50 chars | clean failover invisible |
| 10 | Rate-limit values | A — server 60 q/h + burst 5/10s · browser 1 q/2s soft | rate-limit is the ONLY defense post-D8-drop |
| 11 | DeepSeek + Anthropic v1 | A — defer both, no triggers documented | reintroduce ad-hoc later if needed |
| 12 | Test runner | A — `node --test` | zero deps |

## Architectural deltas to spec (apply in spec amendments)

- **Provider stack:** Groq pool {KEY, KEY_2, KEY_3} → Mistral pool {KEY, KEY_2-incoming} → static fallback. Both providers free tier. No cost tracking.
- **Classifier:** pinned Groq `llama-3.1-8b-instant`, temp 0, output `themes_likely[]` validated against THEME_SLUGS_SET (drop unknown slugs, log `classifier_invalid_slug`).
- **Pre-route:** heuristic `preRoute()` runs before classifier; obvious patterns (greetings, deflects, direct theme keywords) skip classifier.
- **Wiki retrieval:** `scripts/build-wiki-extracts.mjs` emits `netlify/functions/lib/wiki-extracts.json` at build time. No HTTP fetch, no LRU cache, no race dedup.
- **SSE:** single LLM call with structured output `{trace, answer, cards}`. Server emits SSE events with client-side stagger animation per spec §5. No reconnect protocol — disconnect = client retries. Server buffers first 50 chars before flushing for clean mid-stream failover.
- **Abuse defense:** Tier 0 + Tier 1 only. Tier 2 (spend caps) DROPPED. Browser-side throttle (1 q / 2s soft block) NEW. Per-IP server bucket: 60 q/h sliding window + burst 5 in any 10s. Upstash failure: rate bucket fail open, cooldown state degrade to module memory.
- **Eval gate:** 23/23 on Groq path only. Mistral path not tested in eval. Risk noted for post-launch monitoring.
- **Test runner:** `node --test` builtin. New `npm test` script.

## Decision changelog

- D8 dropped → spec §7 Tier 2 entire section gone.
- D7 picked B over recommended A → eval cost bounded but Mistral fidelity unverified.
- All other decisions match the engineering recommendation.

## CEO review extension — Decisions 13-15 (2026-04-27, post D-1)

| # | Decision | Choice | Notes |
|---|---|---|---|
| 13 | KG edges at runtime | A — emit `wiki-kg-edges.json` bundle + inject on synthesis intent | Closes biggest agentic-reality gap below tool-calling; ~5-10KB additional bundle; trace verb `pulled supersedes edges` becomes real |
| 14 | Variant land for /enter v3 UI | A — Variant A (CONSOLE) baseline + cherry-pick Variant D's gold pill-chip trace compression | Skips Variant B (too editorial) and Variant D's full artifact-canvas pane (Phase 1.5+ if it earns its place) |
| 15 | Synthesis confidence retry | A — bounded 1 retry when synthesis answer < 80 chars | Bounds visible failure mode; not a full agent loop; absorbed in 50-char SSE buffer window so user sees no extra latency |

**CEO plan reference:** `~/.gstack/projects/agamarora-agamarora/ceo-plans/2026-04-27-phase-d-expansion.md`

These three decisions add NEW tasks to Phase D:
- **D-7a** (Task 14b) — variant land + locked visual mockup (blocks D-7)
- **D-3a** (Task 15a) — KG edge bundle + retrieval injection (precedes D-3)
- **D-9a** (Task 20a) — synthesis confidence retry

Plus scope-up of existing tasks: D-4 trace honest, D-6 multi-turn + visual asserts, D-7 full visual contract.

Total CC time delta: +3-4hr over original Phase D estimate.

## Eng review extension — Decisions 16-18 (2026-04-27, post CEO + Design)

| # | Decision | Choice | Notes |
|---|---|---|---|
| 16 | Real trace ms — model emits OR server stamps? | A — server stamps post-parse | Model emits `{trace: [{verb, args}], answer, cards}` w/o latencyMs. Handler measures wall-clock per step (preRoute, classify, retrieve wiki+edges, synthesize), splices real ms into trace events before SSE emit. Eval can assert ms are non-zero + non-rounded. Closes "client stagger is theatre" gap. |
| 17 | Pill animation — count-up + spinner→tick | A — locked per user feedback | Each pill renders initially with circular spinner + `0ms`. Over `max(realLatency, MIN_VISIBLE_DURATION 600ms)`: number counts up, spinner spins. At end: number settles, spinner morphs to checkmark via CSS transform. "Gives it more depth" per user 2026-04-27. Implemented in D-7 scheduler. |
| 18 | D-9a retry placement — before or after first SSE flush? | A — BEFORE first SSE flush | Pool returns full `{trace, answer, cards}` JSON non-streaming. Handler inspects `answer.length`. If `intent === 'synthesis'` AND `answer.length < 80`, fire ONE expand call THEN open SSE stream. User sees zero retry artifact. Fits naturally with Decision 3 (1-call non-streaming structured output). |

**Eng review reference:** `~/.claude/plans/sequential-hugging-mango.md` ## ENG REVIEW OUTPUT.
**Test plan reference:** `~/.gstack/projects/agamarora-agamarora/Agam-main-eng-review-test-plan-2026-04-27.md`.

These add code-quality decisions:
- **CQ-1:** centralize banned terms list at NEW `lib/voice-rules.mjs` (DRY across system prompt + classifier + eval grep)
- **CQ-2:** new pool method `invokeSynthesisJson()` for non-streaming JSON return (D-arch-3 needs this)
- **CQ-3:** `lib/timing.mjs` `now()` + `measure(label, fn)` helpers — single source of timing truth (D-arch-1 needs this)

Three parallel CC lanes for Phase D execution: Lane A (backend LLM stack: D-2 → D-3a → D-3 → D-4), Lane B (defense: D-5), Lane C (UI: D-7). Lane D (D-9a folded into Lane A; D-6 + D-9 sequential after merge). Wallclock estimate: ~5.5hr parallel vs ~10-14hr sequential.

---

## How to use this doc

12 open architectural calls. Each row has:
- **The call** — what's being decided
- **Options** — 2-3 with explicit tradeoffs
- **Recommendation** — engineering call from today's review
- **Blast radius** — task IDs + files affected
- **Decision** — taste-pass slot (BLANK until Agam fills)

Mark the **Decision** field as one of:
- `LOCKED [option]` — accept the recommendation or override with named option
- `DEFERRED to [trigger]` — push to Phase 1.5+
- `NEEDS CLARIFICATION [question]` — block the row, ask back

When all 12 rows are decided, this doc is read once more, then frozen. Spec amendments + plan rewrite follow.

---

## Decision 1 — LLM provider abstraction shape

**The call:** how do we structure the multi-provider LLM client code?

### Options

**A) Single `lib/llm-pool.mjs` driver.** One module exposes `pool.invoke({models, messages, stream, jsonMode, maxTokens})`. Internally tracks 3 Groq keys + Mistral, manages cool-down, retry policy, error normalization. Concrete drivers (Groq SDK, Mistral SDK) are private implementation.

**B) Two separate clients (`groq-client.mjs`, `mistral-client.mjs`).** Each owns its own state. Handler orchestrates — tries Groq first, catches all-keys-cooled, falls to Mistral.

**C) Provider-agnostic via OpenAI-compatible protocol.** Wrap both Groq + Mistral as OpenAI-compatible clients (both expose this surface), one client class with a `baseURL` swap. Smaller code, less type safety on provider-specific features.

### Tradeoffs

| | A — single pool | B — two clients | C — OpenAI-compat wrapper |
|---|---|---|---|
| Lines of code | ~250 | ~350 (duplicated state machinery) | ~180 |
| Cool-down state location | One Map, atomic | Split across modules | One Map |
| Retry policy drift | Impossible (one policy) | Likely over time | Impossible |
| Provider-specific features (JSON schema, prefix cache) | Exposed via `pool.invoke` opts | Exposed in concrete client | Lost — lowest common denominator |
| Test surface | One module to mock | Two modules | One module |
| New provider in future | Add driver inside pool | Add new client + handler branch | Add baseURL config |

### Recommendation

**A) Single pool driver.**

Reason: the eng review's "DRY is important" preference + the cooldown thundering-herd issue is unsolvable cleanly with split state. Eliminates 100 lines of duplicated retry/cooldown code. Provider-specific feature support is preserved via `opts` pass-through.

### Blast radius

- Tasks: D-1, D-8 (collapse D-8 into D-1 entirely)
- Files: NEW `netlify/functions/lib/llm-pool.mjs`; `groqHandler.mjs` rewritten to call pool

### Decision

`<<< AWAITING AGAM >>>`

---

## Decision 2 — Wiki retrieval mechanism

**The call:** how does the function get plain-text wiki content into the synthesis prompt?

### Options

**A) Bundle `wiki-extracts.json` at build time.** New `scripts/build-wiki-extracts.mjs` walks the wiki source drafts (or rendered HTML) and emits a JSON file with per-theme plain-text section content (Core belief / How it formed / What it implies / Tension / Open question). Function imports the JSON at module init, reads from memory per request. ~30 min build script. ~50KB JSON. No HTTP fetch, no cache, no race conditions.

**B) HTTP fetch from `agamarora.com/wiki/<theme>/` at request time + LRU cache (60s TTL, 50 entries).** Per spec §6 and Task 16. Costs one cold fetch per theme per minute, with cache mitigating warm hits. Race-condition risk on concurrent misses (mitigatable with in-flight promise dedup). Adds a network dependency to the function path.

**C) Hybrid: bundle theme summaries, fetch only on synthesis intent + low confidence.** ~10KB bundled summaries cover 90% of synthesis prompts; fetch full HTML only when classifier confidence < 0.7. Two retrieval paths to maintain.

### Tradeoffs

| | A — bundle | B — HTTP fetch | C — hybrid |
|---|---|---|---|
| Cold-start prompt latency | 0ms (already in memory) | +200-400ms first fetch | 0ms summary, +200-400ms fallback |
| Failure modes | Build script broken → spec mismatch | Origin down → no synthesis | Both paths to monitor |
| Token efficiency | ~30% lower (no inline CSS/HTML) | Higher (full HTML in prompt) | Mixed |
| Cache complexity | None | LRU + TTL + race dedup | Both |
| Refresh on wiki change | `npm run build` regenerates | Auto (next fetch after CDN cache expires) | Mixed |
| Function package size | +50KB | 0 | +10KB |

### Recommendation

**A) Bundle wiki-extracts.json.**

Reason: eng review §A5 — eliminates HTTP fetch error path, race conditions, cache eviction, and ~30% wasted tokens on inline CSS/HTML chrome. Trade-off (`npm run build` must regenerate) already true for kg.json, sync:chrome:check, etc. Single mental model.

### Blast radius

- Tasks: REPLACE D-3 with new Task **14a — `scripts/build-wiki-extracts.mjs`**, then D-3 becomes "import the JSON in pool/handler" (~30 min instead of 30 min of cache logic)
- Files: NEW `scripts/build-wiki-extracts.mjs`; NEW `netlify/functions/lib/wiki-extracts.json` (build artifact); update `package.json` `build` script

### Decision

`<<< AWAITING AGAM >>>`

---

## Decision 3 — SSE flow: 1-call vs 2-call

**The call:** does the LLM emit trace + answer + cards in one structured-output call, or does the server make two calls (call 1 = trace + cards JSON; call 2 = answer prose stream)?

### Options

**A) 1-call structured output.** Single LLM call returns `{ trace: [...], answer: "...", cards: [...] }`. Server parses, emits SSE events sequentially with client-side stagger (per spec §5: "Client-side seeded random, never >400ms per line"). Loses streaming-token feel for answer (model emits JSON tokens; client waits for JSON close before rendering answer).

**B) 2-call split.** Call 1 = JSON-mode classifier-style prompt → `{ trace, cards }`. Call 2 = streaming prose prompt → answer tokens. Server emits trace events first (from call 1), then streams tokens (from call 2), then emits cards (from call 1). True streaming feel for answer prose.

**C) 1-call with synthetic streaming.** Single call emits structured output. Server fakes token-by-token streaming by chunking the answer prose at word boundaries with 30ms stagger. Stagger is purely cosmetic.

### Tradeoffs

| | A — 1-call | B — 2-call | C — 1-call w/ fake stream |
|---|---|---|---|
| LLM cost per query | 1× | ~2× | 1× |
| Latency to first trace | ~400-700ms (single call kickoff) | ~300-500ms (call 1 fast w/o stream) | ~400-700ms |
| Latency to first answer token | After full JSON parse (~end of stream) | After call 2 first token (~700-1000ms total) | Synthetic — instant after JSON parse |
| Voice fidelity | Depends on JSON-mode prose quality | Higher (separate prose call has full attention) | Same as A |
| Implementation complexity | Lowest | Higher (2 prompt sets, 2 call paths, 2 error paths) | Lowest |
| Eval pin assertions | Direct (one response shape) | Two responses to assert | Same as A |

### Recommendation

**A) 1-call structured output.**

Reason: spec §5 already declared the stagger animation as client-side theatre ("seeded random, never >400ms per line"). Server-side actual streaming buys nothing the user sees. 2x cost penalty isn't worth a feel that the spec already concedes is fake. Implementation simpler, eval simpler.

Caveat: option C's synthetic streaming is also viable if Agam wants the answer prose to feel typed. ~10 LOC delta. Default to C if Agam prefers streaming feel; A if streaming feels gratuitous.

### Blast radius

- Tasks: D-4 (SSE streaming events) — concrete impl matches A or C
- Files: `groqHandler.mjs`, `lib/ssestream.mjs`, `enter/index.html` (UI consumes whichever shape)
- Spec amendment: `docs/plans/enter-v3.md` §3 add "1-call structured output" decision note

### Decision

`<<< AWAITING AGAM >>>` *(specifically: A or C? B is not recommended.)*

---

## Decision 4 — Classifier: model pin + temperature + enum validation

**The call:** can the classifier swap models or temperature, and does it validate `themes_likely[]` against a closed enum?

### Options

**A) Pin Groq `llama-3.1-8b-instant`, temperature 0, validate against THEME_SLUGS_SET enum.** Drop unknown slugs, log `classifier_invalid_slug`. Eval pin asserts classifier output exactly. Single deterministic fingerprint.

**B) Same as A but allow fallback to Mistral if Groq classifier 429s.** Adds variance (Mistral classifier may parse intent differently). Eval scenarios need OR-conditions.

**C) Free-form themes_likely without enum validation.** Trust the model. Simpler code; risk: hallucinated slugs cause silent retrieval misses (per eng review critical gap).

### Tradeoffs

| | A — pinned + validated | B — pinned + Mistral failover | C — free-form |
|---|---|---|---|
| Eval determinism | High (fingerprint pinned) | Medium (2 model fingerprints) | Low |
| Failure under classifier-Groq outage | Default to lookup path (graceful) | Mistral picks up | Default to lookup |
| Hallucinated slug risk | Caught at validation, logged | Caught at validation, logged | Silent retrieval miss → degraded answer |
| Implementation effort | Low | Low + extra failover branch | Lowest |
| Operational visibility | High (per-call validation log) | Medium | Low |

### Recommendation

**A) Pin model + temp 0 + enum validation.**

Reason: classifier is the highest-leverage call in the chain. Pinning eliminates a variable in eval. Validation closes the critical gap from §A6 of eng review (silent retrieval miss). Failover to Mistral (option B) buys little — classifier failures are rare and the lookup default is graceful.

### Blast radius

- Tasks: D-1 (folds classifier inside)
- Files: NEW `lib/classifier.mjs`; NEW `lib/themes-enum.mjs` (single source of THEME_SLUGS); `kg-themes-summary.mjs` (export THEME_SLUGS helper)

### Decision

`<<< AWAITING AGAM >>>`

---

## Decision 5 — Heuristic pre-routing in v1

**The call:** ship the "skip classifier on obvious patterns" optimization in v1 (per spec §6 Phase 1.5) or defer.

### Options

**A) Pull forward to v1.** ~5 LOC heuristic before classifier call:
- ≤3 words OR matches `(hi|hey|hello|sup|yo|test)` → `lookup`, skip classifier
- Matches off-topic patterns (`your family|politics|religion|where do you live`) → `deflect`, skip classifier
- Direct theme keyword match (`agent[- ]first|spec[- ]first|second[- ]brain|voice[- ]ai|...`) → `synthesis` with extracted slug
- All else → call classifier

Saves ~300-500ms on ~80% of queries. No classifier load on greetings/deflects.

**B) Defer to Phase 1.5.** Classifier handles everything in v1. Add heuristic later if latency or cost issues observed.

### Tradeoffs

| | A — v1 | B — defer |
|---|---|---|
| LOC added v1 | ~10 | 0 |
| Latency win on common queries | ~300-500ms on 80% | 0 |
| Classifier-token cost reduction | ~80% | 0 |
| Eval surface | +5 heuristic tests | 0 |
| Risk of misroute | Low (heuristics are conservative; ambiguous → classifier) | None |

### Recommendation

**A) Pull forward to v1.**

Reason: 5 LOC for 300-500ms saved on the common path. The heuristic is conservative (only routes obvious cases); ambiguous queries still hit classifier. Saves classifier cost AND latency. No reason to defer; cost of inclusion is trivial.

### Blast radius

- Tasks: D-1
- Files: `lib/classifier.mjs` (a `preRoute()` helper before the call)

### Decision

`<<< AWAITING AGAM >>>`

---

## Decision 6 — Groq cool-down state location

**The call:** track per-key cool-down in module memory only, or persist to Upstash so cold-start containers see existing cool-downs?

### Options

**A) Upstash-persisted.** Key: `groq:cooldown:{keyId}`. TTL = remaining cool-down seconds. Read once before invoke; write on 429. ~1 Redis read + occasional write per LLM call. Free tier handles it.

**B) Module memory only.** Per-container `Map` of cool-down state. Cold-start container doesn't see other containers' learned cool-downs — first request after each cold start probes all 3 keys, can chain 429s during sustained traffic.

### Tradeoffs

| | A — Upstash | B — module memory |
|---|---|---|
| Cold-start key burn risk | None | High under sustained traffic |
| Upstash budget impact | ~1 read/call (free tier 10K/day) | 0 |
| Implementation effort | +20 LOC | 0 |
| Operational complexity | One more Redis key family | None |
| Failure mode | Upstash down → fall back to module memory (degrade gracefully) | None |

### Recommendation

**A) Upstash-persisted.**

Reason: Upstash is already required for rate limit + spend ledger (Tier 1 + Tier 2 abuse defense). One extra read is free. Eliminates the eng review's flagged thundering-herd issue. Fallback (Upstash down → use in-memory) is trivial.

### Blast radius

- Tasks: D-1, D-5
- Files: `lib/llm-pool.mjs`, `lib/upstash-client.mjs`

### Decision

`<<< AWAITING AGAM >>>`

---

## Decision 7 — Eval per-provider matrix

**The call:** must scenarios pass on Groq path AND Mistral path, or only on Groq?

### Options

**A) Both providers required to pass.** Eval harness has `--provider=groq|mistral|both` flag. Default `both` for ship gate. 23 × 2 = 46 assertions per ship gate run.

**B) Groq only.** Mistral is fallback path; testing it adds complexity for a path that runs <5% of the time in normal traffic. Accept risk that Mistral output may degrade voice when Groq is exhausted.

**C) Both, but Mistral only on synthesis scenarios.** Lookup/deflect/bio scenarios eval on Groq only (they don't usually hit Mistral). Synthesis eval on both. ~30 assertions per ship gate.

### Tradeoffs

| | A — both | B — Groq only | C — synthesis-only Mistral |
|---|---|---|---|
| Eval runtime (per ship gate) | ~10 min | ~5 min | ~7 min |
| Confidence Mistral path works | High | Untested in eval | Medium |
| Drift detection (provider-specific failure) | Yes | No | Partial |
| Cost per ship gate run | ~$0.20 | ~$0.10 | ~$0.15 |

### Recommendation

**A) Both providers required to pass.**

Reason: Mistral is the only fallback for sustained Groq exhaustion. If a 23-scenario suite passes only on Groq, we have no signal that the system gracefully degrades. The 5min extra runtime is cheap insurance. Spec §6 mandates 23/23 = ship; the integrity of "23/23" requires testing the ALL paths a real user can hit.

### Blast radius

- Tasks: D-6
- Files: `eval-prompt.mjs` (extend with --provider flag), new `eval-scenarios.json` data

### Decision

`<<< AWAITING AGAM >>>`

---

## Decision 8 — Spend ledger arithmetic

**The call:** how do we prevent the daily/monthly spend caps from being bypassed by concurrent requests?

### Options

**A) Atomic INCRBYFLOAT pre-call.** Estimate cost up-front. `INCRBYFLOAT spend:YYYY-MM-DD <estimate>`. If post-increment value > cap, refund (`INCRBYFLOAT -<estimate>`) and serve static fallback. After call, adjust with `INCRBYFLOAT (actual - estimate)` (usually 0).

**B) Read-then-write.** GET counter; if < cap, run call, INCR by actual. Simple but races: two concurrent requests both pass the gate at $2.99.

**C) Distributed lock.** Acquire Redis lock per cap check. Serializes spend checks. Adds latency.

### Tradeoffs

| | A — atomic pre-incr | B — read-then-write | C — distributed lock |
|---|---|---|---|
| Race-window bypass | Bounded by 1 query estimate | Up to N concurrent queries | None |
| Redis ops per call | 2-3 (estimate INCR + adjust) | 2 (GET + INCR) | 4-5 (lock + check + work + unlock + INCR) |
| Latency added | ~10-30ms | ~5-15ms | ~30-80ms |
| Implementation complexity | Medium | Low | High |

### Recommendation

**A) Atomic INCRBYFLOAT pre-call.**

Reason: at our scale, race-window bypass on option B can be 5-10 concurrent queries at boundary — that's $0.25-0.50 over cap. Option A bounds bypass to ~$0.005 (one query estimate). Option C overhead doesn't justify the marginal benefit.

### Blast radius

- Tasks: D-5
- Files: `lib/upstash-client.mjs`, `lib/abuse-defense.mjs`

### Decision

`<<< AWAITING AGAM >>>`

---

## Decision 9 — Streaming: buffer first 50 chars before flush

**The call:** to make provider failover invisible mid-stream, buffer the first ~50 characters server-side before emitting any token events. If provider fails inside the buffer window, transparently retry on next provider.

### Options

**A) Buffer 50 chars (~500ms typical).** If first chunk OK, flush all buffered + continue streaming. If error in window, swap provider, restart stream. Clean failover invisible to user.

**B) No buffer — stream raw.** First token reaches client in ~300-500ms. If mid-stream error, client sees partial output + an error event. User sees "...error, retry?".

**C) Buffer 50 chars only on cold-start invocations.** Heuristic: warm container has confidence the provider is healthy; cold container hasn't yet proven anything. Saves the ~500ms latency on warm calls.

### Tradeoffs

| | A — always buffer | B — stream raw | C — cold-only buffer |
|---|---|---|---|
| First-token latency | ~+300ms vs raw | Lowest | Lowest on warm; +300ms on cold |
| Mid-stream error UX | Invisible | Visible (partial output + error) | Cold start: invisible. Warm: visible. |
| Implementation complexity | Medium | None | Medium |
| Probability of mid-stream provider error | Low (a few %) | — | Low |

### Recommendation

**A) Always buffer 50 chars.**

Reason: provider failover is exactly the case Phase D introduces (Groq → Mistral). The whole point of having a fallback is graceful degradation, including mid-stream. 300ms is below the spec's "trace stagger 150ms × 3-4 lines = 450-600ms" threshold; it's covered by trace animation. User doesn't perceive it.

### Blast radius

- Tasks: D-4
- Files: `lib/ssestream.mjs`

### Decision

`<<< AWAITING AGAM >>>`

---

## Decision 10 — Tier 1 rate-limit values

**The call:** rate-limit per IP — keep spec's 30 q/h, or bump to eng review's recommended 60 q/h + burst 5/10s?

### Options

**A) 60 q/h sliding window + burst 5 in any 10s.** A determined visitor can explore the agent for ~1 hour without hitting the limit. Bursts (clicking through 3-4 cards quickly) accommodated.

**B) 30 q/h sliding window per spec §7.** Tighter cost protection. May frustrate engaged visitors who hit the limit at ~10 minutes of active use.

**C) 60 q/h + manual override slot.** Same as A but admins/known-friendly IPs (e.g., Agam himself) get bypass. Adds complexity for v1.

### Tradeoffs

| | A — 60+burst | B — 30 q/h | C — 60+override |
|---|---|---|---|
| Engaged-visitor friction | Low | Medium-High | Lowest |
| Cost protection (worst case) | $X×2 over B | Baseline | Same as A |
| Implementation effort | +5 LOC for burst window | None over baseline | +30 LOC for override list |
| User-facing 429 frequency | Rare | Occasional | Rare |

### Recommendation

**A) 60 q/h + burst 5 in 10s.**

Reason: spec §7 framework is correct, the *number* was a guess. Eng review surfaced realistic engaged-visitor pattern (recruiter exploring, ~10-30 queries in a session). 30/h is a hard cliff at 10 minutes; 60/h with burst lets people *use* the agent. Cost protection at this level is still bounded by the per-query cap and daily total.

### Blast radius

- Tasks: D-5
- Files: `lib/upstash-client.mjs`, `lib/abuse-defense.mjs`
- Spec amendment: `second-brain-v1.md` §7 Tier 1 update

### Decision

`<<< AWAITING AGAM >>>`

---

## Decision 11 — DeepSeek + Anthropic v1 inclusion

**The call:** wire DeepSeek and Anthropic Haiku into the v1 fallback chain, or defer to Phase 1.5?

### Options

**A) Defer both.** Groq pool → Mistral → static fallback. DeepSeek key staged in env (`DEEPSEEK_API_KEY` set 2026-04-27) but no code path. Anthropic not in env at all.

**B) Wire DeepSeek as cheap-tier between Groq and Mistral.** Adds one more provider hop. ~30 min code.

**C) Wire DeepSeek + Anthropic Haiku as Phase 1.5 + Phase 2.** Same as A, with documented bring-up triggers.

### Tradeoffs

| | A — defer both | B — wire DeepSeek now | C — defer w/ explicit triggers |
|---|---|---|---|
| v1 provider hops | 2 (Groq→Mistral) | 3 (Groq→DeepSeek→Mistral) | 2 |
| Cost protection variance | Mistral failure = static fallback | DeepSeek catches Mistral outage | Same as A |
| Voice/quality variance | Mistral ≈ Groq adequate | DeepSeek different voice | Same as A |
| Code surface | Lowest | +1 driver in pool | Same as A |
| User-defined triggers for re-introduction | Implicit | n/a | Explicit |

### Recommendation

**C) Defer with explicit Phase 1.5 triggers.**

Reason: per user 2026-04-27, "we will use Groq and Mistral for now." Wiring DeepSeek now adds drivers for a path that won't run unless Mistral fails too — a low-probability event in v1. Anthropic Haiku is gone from cost projection; reintroduce only if quality drift observed.

Triggers for bringing DeepSeek back: Mistral monthly cost > $5, OR Mistral p95 latency > 3s, OR Mistral 429s observed in logs.
Triggers for Anthropic: persistent voice fidelity drift on Mistral, OR a high-value query class (recruiter from specific company) needs higher quality.

### Blast radius

- Tasks: D-1 (clean drop, no DeepSeek/Anthropic code)
- Files: `lib/llm-pool.mjs` driver list
- Spec amendment: `second-brain-v1.md` §6 update model tiering

### Decision

`<<< AWAITING AGAM >>>`

---

## Decision 12 — Test runner

**The call:** add a test runner to the project for Phase D unit + integration tests?

### Options

**A) `node --test` (Node 18+ built-in).** Zero deps. Runs `*.test.mjs` natively. Add `"test": "node --test netlify/functions/lib/**/*.test.mjs"` to `package.json`.

**B) Vitest.** More features (watch mode, coverage, snapshots). +1 dependency, +10MB node_modules.

**C) No runner — eval-prompt.mjs is the only test layer.** Skip unit tests; rely on eval harness for end-to-end coverage.

### Tradeoffs

| | A — node --test | B — Vitest | C — eval only |
|---|---|---|---|
| Dependencies | 0 | +1 (~10MB) | 0 |
| Watch mode / coverage | Manual | Built-in | None |
| Unit test surface (per eng review §3) | Yes — 47 gaps coverable | Yes | No |
| CI integration | `npm test` | `npm test` | `npm run eval` |
| Onboarding cost | None | Read Vitest docs | None |

### Recommendation

**A) `node --test`.**

Reason: zero deps matches site convention (vanilla HTML, no build step). 47 test gaps from eng review need a runner; eval-only doesn't catch unit-level regressions (cool-down state, rate bucket math, slug enum validation). Built-in is enough.

### Blast radius

- Tasks: D-1, D-5, D-6 (all add unit tests)
- Files: `package.json` (`test` script); test files alongside lib modules

### Decision

`<<< AWAITING AGAM >>>`

---

## Summary — quick decision sheet

| # | Decision | Recommend | Decision |
|---|---|---|---|
| 1 | LLM provider abstraction | Single `llm-pool.mjs` | _____ |
| 2 | Wiki retrieval | Bundle `wiki-extracts.json` | _____ |
| 3 | SSE flow | 1-call structured output (or C synthetic streaming) | _____ |
| 4 | Classifier pin + validate | Pin model + temp 0 + enum-validate | _____ |
| 5 | Heuristic pre-routing | Pull forward to v1 | _____ |
| 6 | Groq cool-down state | Upstash-persisted | _____ |
| 7 | Eval per-provider matrix | Both Groq + Mistral required | _____ |
| 8 | Spend ledger arithmetic | Atomic INCRBYFLOAT | _____ |
| 9 | Streaming buffer | Buffer first 50 chars | _____ |
| 10 | Rate-limit values | 60 q/h + burst 5/10s | _____ |
| 11 | DeepSeek + Anthropic v1 | Defer both (Phase 1.5+ triggers) | _____ |
| 12 | Test runner | `node --test` | _____ |

---

## After taste-pass

When all 12 decisions are filled:

1. **Spec amendments** — 4 doc edits as small atomic commits:
   - `second-brain-v1.md` §6 (provider stack to Groq×3 → Mistral; classifier pinned + temp 0)
   - `second-brain-v1.md` §7 (rate-limit 60 + burst, atomic spend, Upstash cooldown)
   - `enter-v3.md` §3 (SSE 1-call decision, no-reconnect policy)
   - `next-session-plan.md` Tasks 14-22 (collapse D-8 into D-1, add Task 14a for wiki-extracts, update model list)

2. **Index doc update** — move resolved rows from "Open" to "Locked" in `enter-agent-decisions-index.md`.

3. **Phase D execution** — next session picks up the first QUEUED row in next-session-plan.md, no architectural calls left to make.

4. **Eval gate** — 23/23 across both providers, fix any failing scenario before Phase E launch.

When this doc is fully decided, save commit message:

```
chore(plan): lock Phase D architectural decisions

12 open architectural calls from 2026-04-27 eng review
locked via taste-pass. Spec amendments in following commits.

Decisions captured in docs/plans/phase-d-decisions-2026-04-27.md.
Index updated in docs/plans/enter-agent-decisions-index.md.
```
