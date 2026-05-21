# TTFT Resume Point

**Created:** 2026-05-21
**Branch:** `ttft-game` (pushed to origin)
**Status:** Plan locked + reviewed. Ready to build. No code written yet.

## Pick up here

1. **Switch to branch:**
   ```bash
   cd D:/AA/agamarora && git checkout ttft-game && git pull
   ```

2. **Read the docs in order:**
   - `docs/plans/ttft-game.md` — the v2 plan (744 lines, full spec)
   - `docs/plans/ttft-game-reviews.md` — 24 review findings + code patches (the authoritative version)

   The review findings doc OVERRIDES the v1 details inside `ttft-game.md` where they differ. Build from `ttft-game-reviews.md` snippets, not from the v1 JS skeleton inside the main plan.

3. **First action — curl verify:**
   ```bash
   curl https://api.groq.com/openai/v1/chat/completions \
     -H "Authorization: Bearer $GROQ_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "model": "llama-3.3-70b-versatile",
       "messages": [{"role":"user","content":"Return JSON {\"test\": \"ok\"}"}],
       "response_format": {"type":"json_object"},
       "max_tokens": 50
     }'
   ```
   If 200 + valid JSON: proceed with this model.
   If error on `response_format`: fall back to `llama3-70b-8192` or drop the param and use prose-extraction.

4. **Build order:**
   - `netlify/functions/reflectHandler.mjs` (server first, test independently)
   - `lab/type/index.html` (single-file inline CSS + JS)
   - Add card to `lab/index.html`
   - Add to `sitemap.xml`

5. **13 manual tests in `ttft-game.md` Test Plan section** — run all before merging.

## Locked decisions (do not relitigate)

| Topic | Decision |
|---|---|
| Route | `/lab/type/` (NOT subdomain) |
| Surface | Desktop only — mobile + any touch device gets redirect screen |
| Metric | TTFT = crystallization moment (Groq identifies word, JS finds timestamp) |
| Session | 60s timer + "done →" early end button |
| Backspace | Blocked — keydown + beforeinput (incl. insertFromDrop + deleteByCut) |
| Prompts | 3 cards horizontal grid, retroactive highlight on results screen only |
| Timer | Gold progress bar drains 60s; last-10s mono countdown fades in |
| Model | `llama-3.3-70b-versatile` (verify json_object support first) |
| H1 | "First Thought." (NOT "Time to First Thought." — 1-3 word voice rule) |
| Subhead | "Models output their first token in milliseconds. How long until yours?" |
| Tokens | EXACT moodboard values — `--bg #0B0A09`, `--surface #12110F`, etc. |
| Keyboard bg | Reuse /enter, opacity 0.12 (not 0.32). Key glow amplified to compensate. |

## Critical traps to avoid

1. **Word #0 timestamp** — loop condition is `words.length > wordTimestamps.length` (NOT `> length - 1`). Missing this = first word never gets a timestamp = TTFT silently wrong for short sessions.
2. **Last word timestamp** — capture trailing partial word on `submit()` before sending to Groq.
3. **window.blur** — pause timer on window blur, NOT just visibilitychange. Mac users switching windows is the common case.
4. **Mobile block logic** — OR not AND: `narrow viewport OR ontouchstart OR navigator.maxTouchPoints > 0`. iPad Pro at 1366px must be blocked.
5. **Groq response type guards** — every field must be `typeof === 'string'` or `[1,2,3].includes()` checked server-side. Array response = white-screen crash if missed.
6. **IME composition** — listen for `compositionstart` to set t0 (CJK users skip first-key detector).
7. **Reuse `isInjectionAttempt`** from `lib/defense.mjs` (used by groqHandler.mjs) — do NOT only rely on string sanitize.

## What's NOT in scope for v1

Leaderboards, OG-image sharing, mobile layout, A/B prompt testing, replay sessions, "challenge a friend" links, analytics beyond Netlify defaults.

## Open items deferred to build

- Verify exact `lib/defense.mjs` path + `isInjectionAttempt` export signature
- Verify model TTFT/throughput numbers in the comparison table (table is approximate; confirm before ship)
- Decide whether to add OPTIONS handler explicitly or rely on Netlify CDN default
- Final copy pass on results screen edge cases

## Files in this branch

```
docs/plans/ttft-game.md          # 744 lines, v2 plan
docs/plans/ttft-game-reviews.md  # 205 lines, 24 findings + patches
docs/plans/ttft-game-RESUME.md   # this file
```

Nothing else changed. `main` is untouched.
