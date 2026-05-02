# /enter v3.1 — Working Spec

**Status:** LOCKED 2026-05-02 — autoplan dual-voice review complete, decisions taste-passed by Agam, execution underway on `enter-v3.1-dev` branch.
**Started:** 2026-05-02
**Branch:** main
**Predecessor:** `/enter v3` (LIVE, see `enter-v3.md` and `phase-d-decisions-2026-04-27.md`).
**Goal:** close real bugs surfaced in production, harden the wire contract, then earn one or two real "wow" lifts. Every change earns its position. No change is for the sake of change.

---

## 0. Investigation summary (what is actually true today)

### Pipeline as live on main (HEAD `2664116`)

```
POST /.netlify/functions/groqHandler
 │
 ├── defend()                                     UA / dup-cache / rate-limit / injection
 ├── route()                                      preRoute (regex) ?? classify (Groq llama-3.1-8b-instant)
 │     → { type: lookup | synthesis | deflect, themes_likely[], confidence, route_reason }
 │
 ├── if deflect  →  buildDeflectStream() (static)
 │
 ├── wikiExtracts = themes.map(getThemeExtract)   wiki-extracts.json   12 themes, 76K chars
 ├── if synthesis: edges = getEdgesForThemes()    wiki-kg-edges.json   19 edges
 │
 ├── buildDynamicContext()                        contact channel block + wiki + edges + route hint
 ├── invokeSynthesisJson()                        1 LLM call, JSON: { trace[], answer, cards[] }
 ├── if synthesis & answer<80:  invoke retry      D-9a, bounded 1
 │
 └── buildEventStream()  → SSE (trace → token → card → done)
       │
       ▼
   enter/index.html consumer
     ├── trace events → addTraceLine + scheduler
     ├── token events → fullText accumulator
     ├── card events  → sseCards.push + buildCard
     └── done         → showAnswer + showCards
```

### What's covered, what's not

| Surface | Coverage today | Gap |
|---|---|---|
| Wiki retrieval | 12 themes (76K chars total) | 19 belief pages + 56 tech + 75 post nodes from kg.json are NOT retrievable at runtime |
| KG edge retrieval | 19 edges in wiki-kg-edges.json | kg.json has 224 edges total — `/enter` sees ~8% |
| Classifier keyword fast-path | 12 theme regexes | belief-level slugs ("anti-customization", "spec-over-sprint") fall through to LLM |
| Card metadata | Title/desc only mapped client-side via `slugToTitle()` (12 known slugs) | LLM is told to emit slugs like `wiki/agent-first` per system prompt, but those slugs aren't in client map → fallback to `split('/').pop().replace('-',' ')` produces ugly strings |
| Eval scenarios | 0 of 23 scenarios automated | Phase D-6 still queued |
| Visual parity check | Manual | No CI gate. 17c7801 lesson: shipped without visual diff, broke card sizing, reverted |

### The contract claim that's broken

`netlify/functions/groqHandler.mjs:28` documents the SSE shape as:

```
data: {"type":"card","slug":"...","type":"page","priority":false}\n\n
```

That's two `type` keys. `sseEvent(eventType, data)` does `JSON.stringify({ type: eventType, ...data })` — the spread of `data` overwrites the outer `type`. On wire the payload becomes `{"type":"page","slug":...,"priority":...}`. Frontend `enter/index.html:1656` matches `t === 'card'`. Match never fires. Cards from the v3 path NEVER reach the renderer.

**Net effect today:** the cards visible on `/enter` come 100% from `generateFallbackCards()` (client-side regex on the prompt). The system prompt's elaborate card-routing rules and the LLM's emitted `cards[]` array are dead tokens. This is the central correctness defect of v3.

---

## 1. Bugs (ranked, with evidence)

### B1. SSE `card` event collision — cards from LLM never render
- **File:** `netlify/functions/lib/ssestream.mjs:117` + `enter/index.html:1656`
- **Live impact:** all card routing on /enter is client-side regex theatre. LLM emit ignored.
- **Fix shape:** rename inner key `type` → `kind` on server emit; client reads `parsed.kind` for page/external. Update docstring at `groqHandler.mjs:28`.
- **Earns place:** correctness — current code lies about what it does.

### B2. Cache-replay path drops cards entirely
- **File:** `groqHandler.mjs:435-447` — cached SSE stream emits trace + token + done, no cards.
- **Live impact:** any duplicate query within the LRU window returns an answer with NO cards. Same query, different UX, no signal why.
- **Fix shape:** cache the `parsed.cards` array alongside `parsed.answer` text. Replay both.
- **Earns place:** correctness — duplicates today produce a degraded experience that looks like a regression.

### B3. Card metadata mismatch — root cause of 17c7801 visual regression
- **File:** `enter/index.html:1221` `slugToTitle()` map covers 12 slugs only. `slugToDesc()` doesn't exist.
- **Live impact:** when (B1) is fixed and LLM cards reach `buildCard()`, cards have empty `desc`, `title` falls through to `slug.split('/').pop().replace('-',' ')` (e.g. "wiki/agent-first" → "agent first"). Different rhythm from hand-coded empty-state cards which have full title+desc. **This is what user saw and reverted in 17c7801.**
- **Fix shape:** make card metadata server-side. Source-of-truth is `wiki-extracts.json` (theme title + one-line summary already present per theme) and a small static slug→meta table for non-wiki slugs (lab, resume, github, linkedin, calendly, book-call, email, youtube, shararat, lab/voice-ai-production, etc.). Server emits `{slug, kind, priority, title, desc}` in the SSE card event. Client renders verbatim, no client-side slug→title map needed.
- **Earns place:** correctness + DRY — current setup duplicates editorial copy in two places (frontend JS + system prompt) and falls apart when LLM emits a slug that's in neither.

### B4. Dead v2 fallback paths
- **File:** `enter/index.html:1568-1612` (JSON-response branch) and `:1400-1438` (`generateFallbackTrace`).
- **Live impact:** server never returns `application/json`. ~50 LOC dead. Confusion on next reader.
- **Fix shape:** delete both. SSE is the only path. v2 fallback (`generateFallbackCards`) stays for now — useful as belt-and-suspenders if v3 cards ever come back empty post-(B1)(B3).
- **Earns place:** debt removal earns place when dead branches mislead — they do here.

### B5. Confidence retry overwrites trace, contradicts retry instruction
- **File:** `groqHandler.mjs:603-620`. Retry prompt says "Keep trace as-is" but server then takes `retryResult.trace` (which is usually a copy or empty) and appends an `expanded` verb.
- **Live impact:** trace pills shown to user can mismatch the actual original retrieval steps after a retry.
- **Fix shape:** keep `parsed.trace` (original), append the synthetic `expanded` verb to that, ignore `retryResult.trace`.
- **Earns place:** trace honesty is the entire point of the surface. Drift = surface lying.

### B6. Trace timing key mapping is fragile
- **File:** `ssestream.mjs:139` `resolveTimingKey()` relies on `args.includes('wiki')` etc. If LLM phrases args differently the key falls through to `synthesize`.
- **Live impact:** pill shows synth ms for a retrieve step. Subtle.
- **Fix shape:** broaden matchers OR ship `verb→key` map keyed on verb only with `args` as tiebreaker. Don't fix without an eval scenario covering it.
- **Earns place:** P2 — only matters once eval gate is in place.

### B7. `voice-ai-craft` and other theme slugs render with ugly fallback titles
- Same root as (B3). Tracked as one fix.

### B8. Out-of-date docstrings
- `groqHandler.mjs:28` SSE shape comment is wrong (the `type` collision). `enter/index.html:1175` claims "future schema" for Lane A — that schema is live now.
- Trivial fix; ride along with (B1)/(B3).

### B9. Belief-page coverage gap (functional, not bug, but live)
- 19 Tier-1 belief pages live at `/wiki/beliefs/<slug>/` — full reauthored content, principle-card shape. **None retrievable** by `/enter`. Asks like "what does he think about anti-customization" or "spec-over-sprint" can't ground.
- Fix shape: extend `wiki-extracts.json` to include belief pages. Extend `THEME_SLUGS` enum or add a parallel `BELIEF_SLUGS` set. Extend classifier KEYWORD_TO_SLUG.
- Earns place: closes the largest semantic hole. The wiki has been reauthored at the belief level; the agent can't see that work.

### B10. Cards array sometimes empty for legitimate intents (CONTACT, etc.)
- TODO.md line 7 already calls this out: `Cards on contact intents come from client-side fallback, not the LLM — server-side path is empty.`
- After (B1) fix this gets exposed. System prompt has CONTACT card-routing rules (`groqHandler.mjs:268-273`); LLM may or may not honor them. Need a JSON-schema validator on `parsed.cards` that enforces the contract: contact intent → must include book-call+linkedin+github with book-call priority.
- Earns place: P1 once (B1) fixed.

### B11. Deflect stream emits same two cards always (lab + resume)
- `ssestream.mjs:163-164`. Acceptable for now. Track.

---

## 2. Enhancements (rank by earned position)

### E1. Single source of truth for card metadata
Already implied by (B3). State as a structural change: card metadata lives in one server-side table (`netlify/functions/lib/card-meta.mjs` or extend `kg-themes-summary.mjs`). Wiki theme metadata reuses titles + summaries from `wiki-extracts.json`. SSE emits resolved `{slug, kind, priority, title, desc, url, arrow_label}`. Client `buildCard` becomes a pure render. Removes `slugToTitle`, `slugToUrl`, `slugToDesc` maps from client. **Earns place because it kills B3+B7+B8 in one move and prevents the next bundling-revert cycle.**

### E2. Eval scenarios — finally build them
Phase D-6 has 23 scenarios queued (per `second-brain-v1-next-session-plan.md`). Build the runner first (it's prerequisite to verifying any of B1-B10), then add eval coverage for each closed bug. Eval is the gate that prevents 17c7801-class regressions. **Earns place because every other change in this spec needs a regression net.**

### E3. Visual parity gate
Pair to E2. `npm run enter:parity` script — boots netlify dev, drives gstack browser headed, runs N canonical queries (greeting, lookup, contact, synthesis, deflect, voice-ai), screenshots before+after, diffs. Pre-commit advisory; blocks PR via CI. Even a manual `npm run enter:parity` that produces a diff folder is a 10x improvement on today's "manual smoke + push". **Earns place because the UI is sacrosanct rule needs teeth.**

### E4. Belief-page retrieval (closes B9)
Extend `build-wiki-extracts.mjs` to emit a `beliefs` map keyed by belief slug. Cap belief extracts at ~600 chars (they're principle-card shape, denser than themes). Extend classifier preRoute keywords. Token budget: ~12K extra chars at most for 19 beliefs. Within budget if we cap retrieval to 3 themes + 2 beliefs per query.

### E5. Conversation-history condensation
Today: hard-cap at 6 messages (3 turns). On turn 4+, oldest user query drops. Continuity for "what about FarEye?" → "tell me more" → "and the data platform numbers?" → "compare to AIonOS" breaks at turn 5. Condense to a 1-sentence summary stored in a separate slot. Cheap LLM call, server-side. **Earns place if multi-turn quality is hit; otherwise defer.**

### E6. Card-shape JSON schema validation
Already TODO. Validate `parsed.cards` shape post-LLM. Inject defaults for known intents (CONTACT must include book-call). Belt-and-suspenders for B10. **Earns place after E1 lands and `cards[]` becomes load-bearing.**

### E7. Trace pill click-to-expand
Show what was actually pulled. Hover/tap a `pulled wiki(agent-first, 1842 chars)` pill, expand inline to show the top 200 chars of what was injected. Agent shows its homework. **Earns place** in v3.1 because the trace is the differentiated surface; today it's read-only theatre. Cost: small CSS/JS, server emits already-have content. If we don't, every other "AI agent" demo on the web matches us.

### E8. Cache-hit user-visible signal
After (B2) fix, optionally show a tiny "cached" badge on the trace area for replays. User sees instant response and knows why. Optional. Would ship behind a feature flag.

---

## 3. Wow factors (raise the bar — only the ones that earn place)

### W1. Inline citations in answer prose
Today: card row is the only path from answer to wiki. Add Perplexity-style `[1]` superscripts after sentences grounded in retrieved themes. `[1]` links to `/wiki/<theme>#first-paragraph`. Hover preview on desktop. Tap on mobile.

Why earned: agent's job is to surface the atlas. Inline citations make answers research-grade. Differentiator vs every "ask me about X" landing page. Implementation: server-side, post-synthesis, regex match between answer text and retrieved theme keywords. Bounded scope.

Risk: hallucinated citations. Mitigation: only cite when the answer text contains a phrase from the retrieved extract (substring or fuzzy match). Otherwise skip the citation.

### W2. Deep-link query parameter `/enter?q=...`
LLM eats the query on load. Sharable. "Ask my agent: agamarora.com/enter?q=is+he+hiring" works as a LinkedIn post. Drops the canonical surface for outbound.

Why earned: free surface for distribution, supports the positioning (agent-first product). Tiny code, tiny risk.

Risk: query injection — already covered by `defend()` injection filter. Reuse.

### W3. Cross-session conversation memory
Persist last 6 turns in localStorage. Returning visitor lands on `/enter` and sees a tiny "continue last thread?" link. One click resumes context.

Why earned: every other AI demo treats each session as cold start. Continuity is a memorable differentiator. Aligns with "second-brain" thesis (memory matters).

Risk: privacy + key collision. Scope: localStorage, no server. User can clear via a "fresh start" button.

### Skipped (don't earn place yet)

- **Voice input via Web Speech API** — gimmick risk, no thesis tie-in.
- **Per-channel personality (recruiter / engineer mode)** — system prompt already covers this implicitly via card-routing rules.
- **Mini-graph in trace area** — `/wiki/graph` already exists; redundant.
- **Confidence-stripe on cards** — `priority:true` gold border already encodes this.
- **Pad cards to N with default supporting links** — explicitly rejected (this is what 17c7801 did wrong).

---

## 4. Out of scope for v3.1

- **Provider expansion** (Anthropic, DeepSeek) — Phase E concern.
- **kg.json full-graph runtime retrieval** — wait until belief retrieval (E4) earns its place; only then consider expanding to project/post nodes.
- **Sub-agent routing** (`/enter?agent=lab`) — Phase E.
- **Server-side response post-filter for banned words** — current voice-rules.mjs is prompt-side; post-filter is overkill until evals show drift.

---

## 5. Phasing (LOCKED 2026-05-02)

Subagent review surfaced a critical regression risk: B1 (SSE wire fix) cannot ship alone because LLM cards reaching `buildCard` with empty desc + ugly fallback titles is worse UX than today's all-fallback path. Phase 1 and Phase 2 therefore MERGE into a single atomic landing.

Each phase ships as a coherent commit set on `enter-v3.1-dev` branch. Visual parity check + eval gate before commit. No commits to main until full v3.1 lands and is taste-passed.

### Phase 1+2 (merged) — Wire correctness + card metadata SSOT (P0, atomic)
1. **E1** — `netlify/functions/lib/card-meta.mjs` (new). SSOT for slug→{title, desc, url, kind}. Sources wiki theme metadata from `wiki-extracts.json`. Static maps for lab pages, externals, actions. Export `resolveCard(slug)`.
2. **E2** — `scripts/eval-e2e.mjs`. Drives real /enter via SSE against `netlify dev`. 5 canonical scenarios first (greeting, lookup, contact, synthesis, deflect). Uses dedicated `GROQ_API_KEY_EVAL` env var (free-tier separate key). `npm run eval:e2e` manual trigger.
3. **E3** — Visual parity for v3.1 = user's eyeball check on `netlify dev`. eval-e2e.mjs already validates SSE shape + card metadata structurally (catches B3 regression directly). Auto pixelmatch + headed-browser screenshot script deferred to v3.2 once the gstack browse binary is available locally and cadence justifies the build cost.
4. **B1** — SSE wire fix. `ssestream.mjs` renames inner card key `type` → `kind`. Server now emits resolved meta: `{slug, kind, priority, title, desc, url, arrow_label}`. Frontend reads verbatim.
5. **B3 + B7** — Frontend `buildCard` becomes pure render. Drop `slugToTitle`, `slugToUrl`, `slugToDesc`, `inferCardIcon`. All resolution server-side.
6. **B2** — Cache replay stores + emits cards. `dupCacheStore({text, cards})`. Cache hit re-emits trace + token + card + done.
7. **B4** — Delete dead v2 JSON-response branch (`enter/index.html` ~1568-1612). Delete `generateFallbackTrace`. Keep `generateFallbackCards` as last-resort safety net for zero-card SSE.
8. **B8** — Update `groqHandler.mjs:28` SSE shape docstring.
9. **B11** — Deflect stream emits varied 2-card set (still bounded — pick from {lab, resume, wiki/graph, calendly} based on hash of input).

**Gate:** 5 eval scenarios green, parity screenshots reviewed, manual headed-browser smoke across desktop + mobile + 3 query types.

### Phase 3 — Retrieval coverage (P1, separate landing)
1. **B9 / E4** — Belief-page retrieval. Extend `scripts/build-wiki-extracts.mjs` to emit `beliefs` map keyed by belief slug, capped ~600 chars per belief. Extend `THEME_SLUGS` enum or add `BELIEF_SLUGS`. Extend classifier `KEYWORD_TO_SLUG`. Token budget verified safe: worst case 3 themes + 2 beliefs ≈ 6.5K tokens (subagent estimate).
2. **E6** — Cards JSON-schema validation. Post-LLM, validate `parsed.cards` shape. Inject defaults for known intents (CONTACT must include book-call+linkedin+github). Closes B10.
3. **B5** — Confidence retry trace fix. Use `parsed.trace` (original), append synthetic `expanded` verb, ignore retry's trace.
4. **B6** — Trace timing key broadening. Verb-keyed map with args as tiebreaker. Only if cheap.

**Gate:** 19-belief eval scenarios green, retrieval coverage report.

### Phase 4 — Demo pazzazz (LOCKED scope, ship in this order)
Built to sell. Each independent commit + parity + eval scenario.

1. **W1 — Inline citations [1][2] in answer prose.** Server-side post-synthesis: regex match between answer text and retrieved theme keywords. Substring/fuzzy match required (no hallucinated cites). `[1]` superscript links to `/wiki/<theme>`. Hover preview desktop, tap mobile. Per locked decision in §6.
2. **E7 — Pill click-to-expand.** Click `pulled wiki(agent-first, 1842 chars)` pill, inline expand to first 200 chars of injected extract + link to full `/wiki/<theme>`. Server already has the content; client just renders. Per locked decision in §6.
3. **W4 — Mini-graph.** Real Canvas, ~160px tall, between trace pills + answer. Reuses `/wiki/graph` rendering engine, scoped to retrieved subgraph (2-3 themes + 5-8 edges + 1 belief if KG hit). Same dark + gold style. Animated entry: nodes fade with offset, edges stroke-draw ~600ms. Click node → `/wiki/<theme>`. Mobile: collapse to horizontal node row with edge labels (graph layout doesn't work <400px). Per locked decision in §6 — earned its place because user judgement: "ASCII is nothing, this is the demo asset that sells."

### Phase 5 — Distribution + continuity (defer-able)
1. **W2** — `/enter?q=...` deep-link. URL param auto-runs query on load. LinkedIn-post surface.
2. **W3** — Cross-session memory. localStorage persist last 6 turns. Returning visitor: small `continue last thread?` link. Differentiator vs cold-start chatbots.

**Phase 5 is deferred until Phase 4 ships and demand is validated. Do not ship blind.**

### Phase 6 — Multi-turn (only if real asks demand it)
1. **E5** — Conversation history condensation.

---

## 6. Decisions (LOCKED 2026-05-02)

1. **Phase 1+2 atomicity** → MERGE. Subagent flagged regression window if B1 ships without B3. Atomic commit set on `enter-v3.1-dev`.
2. **Card metadata SSOT location** → New file `netlify/functions/lib/card-meta.mjs`. Imports wiki theme titles from `wiki-extracts.json`. Hardcodes lab/resume/socials. Single resolved object emitted to frontend.
3. **Belief slug namespace** → `wiki/beliefs/<slug>` URL pattern (matches existing `/wiki/beliefs/...` routes). Classifier emits flat slug; card-meta resolves to URL.
4. **Inline citation rendering** → Numbered `[1]` superscript (Perplexity-style). Hover preview on desktop showing first 80 chars of cited extract + link. Mobile: tap shows preview as inline expansion below answer paragraph (since hover unavailable).
5. **Mini-graph in scope** → YES, ship in Phase 4. Real Canvas reusing `/wiki/graph` engine, 160px tall. User judgement: "ASCII is nothing, this is the demo asset that sells."
6. **Eval runner** → New `scripts/eval-e2e.mjs`. Existing `eval-prompt.mjs` is prompt-level only and stays for prompt regression. Eval-e2e drives real HTTP+SSE against `netlify dev`. Uses dedicated `GROQ_API_KEY_EVAL` env var (free-tier separate key). Manual trigger only.
7. **Visual parity tooling** → Manual screenshot review for v3.1 (`scripts/enter-parity.mjs` produces before/after PNG sets). Auto pixelmatch deferred to v3.2 once cadence justifies the build cost.
8. **localStorage memory** → Phase 5 only, deferred. Domain-scoped key `agamarora.enter.history.v1`. No fingerprinting.
9. **Wow priorities for Phase 4** → Inline citations + pill expand + mini-graph (locked). Cross-session memory + deep-link defer to Phase 5 pending demand validation. Confidence-stripe rejected (priority gold border already encodes this signal).

### Open setup items (one-time, before Phase 1+2 lands)

- `GROQ_API_KEY_EVAL` env var must be added to local `.env` for `npm run eval:e2e`. Use a free-tier Groq key separate from production. (Production `GROQ_API_KEY` stays in Netlify dashboard; eval key is local-only for now.)

---

## 7. Deliberate non-changes (locked, do not propose to alter)

- Persona, voice rules, banned terms — locked in `voice-spec.md` §11, do not touch.
- aa. mark, header, fonts, color tokens — chrome system, sacrosanct.
- 70-word answer cap.
- Card row max 3, priority cap 1.
- Mobile/desktop layout from `mobile-enter-redesign-2026-04-27.md`.
- Wiki page editorial — don't touch in this spec; it's the source of truth.

---

## 8. Open follow-ups from earlier sessions, parked here for visibility

- TODO.md `/enter thinking-dots animation` — desktop pulse not visible. Diagnosis already in TODO. Fix path: gate placeholder removal behind `MIN_PILL_DURATION_MS` so even fast SSE responses let pulse render once. Roll into Phase 1 if cheap.
- TODO.md `Response evals` — captured by E2.

---

**End of spec.** No code yet. Decisions pending in §6. Phasing in §5 is the proposal — open for taste-pass before execution.
