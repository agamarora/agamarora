# /enter v3.1 — Working Spec

**Status:** DRAFT — investigation complete, not yet locked.
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

## 5. Proposed phasing

The phasing is a recommendation. Each phase is a separate commit. No bundling. Each phase has visual parity check before commit.

### Phase 1 — Wire correctness (P0, 1 session)
1. E2 eval runner skeleton + 5 canonical scenarios (greeting, lookup, contact, synthesis, deflect)
2. E3 visual parity script
3. B1 SSE wire fix (rename `type` → `kind`)
4. B2 cache-replay cards
5. B4 dead-code removal
6. B8 docstring fix

Gate: all 5 eval scenarios green, parity diff acceptable, manual headed-browser smoke.

### Phase 2 — Card-metadata SSOT (P1, 1 session)
1. E1 server-side card-meta table + SSE shape extension `{slug, kind, priority, title, desc, url, arrow_label}`
2. B3 client `buildCard` becomes pure render (drop `slugToTitle`/`slugToUrl`/`slugToDesc`)
3. B7 ride-along (theme slug rendering correct)
4. B11 deflect cards: variety per request (still bounded set)
5. Eval scenarios extended for each known card-bearing intent

Gate: parity check, eval green, every theme + lab subpage renders correct title+desc.

### Phase 3 — Coverage (P1, 1 session)
1. B9 / E4 belief-page retrieval — extend `wiki-extracts.json` build script + classifier
2. E6 cards JSON-schema validation + defaults injection (closes B10)
3. B5 confidence retry trace fix
4. B6 trace timing key broadening (low priority, do if cheap)

Gate: 19-belief eval scenarios + retrieval coverage report.

### Phase 4 — Surface lifts (earn-place, 1 session each, optional)
1. W1 inline citations
2. E7 pill click-to-expand
3. W2 `/enter?q=...` deep-link
4. W3 cross-session memory

Each is independent. Each must demo a clear lift on its own commit + parity + eval.

### Phase 5 — Multi-turn (only if asks demand it)
1. E5 conversation history condensation

---

## 6. Decisions still needed (gate to lock spec)

1. **Card metadata SSOT location.** New file `card-meta.mjs`, or extend `kg-themes-summary.mjs`?
2. **Belief slug namespace.** `beliefs/<slug>` or flat `<slug>`? Affects classifier + URL routing.
3. **Inline citation rendering.** Numbered `[1]` (Perplexity) or footnote-style with hover? Mobile fallback?
4. **localStorage memory key.** Per-domain only, or also per-anonymized-fingerprint?
5. **Eval runner home.** Existing `eval-prompt.mjs` or new `eval-prompt-v3.mjs`?
6. **Visual parity diff tooling.** Pixelmatch / odiff / manual screenshot review?

These get answered in the next session before any code lands.

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
