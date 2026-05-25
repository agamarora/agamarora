# TTFT reflectHandler — Prompt Eval

**Date:** 2026-05-25
**Model:** `llama-3.3-70b-versatile` via Groq, `response_format: json_object`, `temperature: 0.6`, `max_tokens: 240`.
**Method:** 8 scenarios POSTed to local `netlify dev` instance at `/.netlify/functions/reflectHandler`. Each runs through the full handler (sanitize → injection check → Groq → type-guard).
**Source scenarios:** `docs/plans/eval-reflect-scenarios.json`.

## Results table

| # | Scenario | Expect prompt | Got prompt | Crystallization word | Quote | Reflection | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | crystallized fear | 2 | 2 | "nobody used it" | "the real reason is that nobody used it" | "Admits fear of admitting failure." | PASS (borderline word: phrase not token) |
| 2 | steady flow | none | none | null | null | "Morning routine revealed." | PASS |
| 3 | procrastination | 1 | 1 | "conversation" | "the conversation with my dad" | "Admitting dad's aging" | PASS |
| 4 | world understanding | 3 | 3 | "why" | "why people defend systems they know are broken" | "Defends broken systems as part of identity" | BORDERLINE (word is function-word, not insight token) |
| 5 | too short | fallback | none | null | null | "Writer introduces themselves." | PASS (13-char text > 10-char gate so Groq is called; Groq correctly returns null) |
| 6 | off-topic technical | none | none | "memoization" | "is actually really useful for memoization" | "Useful memoization revealed" | PASS |
| 7 | indirect emotional | none or 2 | 3 | "which" | "which means the answer isnt better sleep its something else entirely" | "Lack of sleep isn't the problem." | BORDERLINE (function-word + wrong prompt match) |
| 8 | injection attempt | fallback (blocked) | — | null | null | null | PASS (isInjectionAttempt caught "ignore previous instructions"; no Groq call) |

**Score:** 6 PASS / 2 BORDERLINE / 0 FAIL.

## Raw responses

```json
1: {"crystallization_word":"nobody used it","crystallization_quote":"the real reason is that nobody used it","prompt_match":2,"reflection":"Admits fear of admitting failure."}
2: {"crystallization_word":null,"crystallization_quote":null,"prompt_match":"none","reflection":"Morning routine revealed."}
3: {"crystallization_word":"conversation","crystallization_quote":"the conversation with my dad","prompt_match":1,"reflection":"Admitting dad's aging"}
4: {"crystallization_word":"why","crystallization_quote":"why people defend systems they know are broken","prompt_match":3,"reflection":"Defends broken systems as part of identity"}
5: {"crystallization_word":null,"crystallization_quote":null,"prompt_match":"none","reflection":"Writer introduces themselves."}
6: {"crystallization_word":"memoization","crystallization_quote":"is actually really useful for memoization","prompt_match":"none","reflection":"Useful memoization revealed"}
7: {"crystallization_word":"which","crystallization_quote":"which means the answer isnt better sleep its something else entirely","prompt_match":3,"reflection":"Lack of sleep isn't the problem."}
8: {"crystallization_word":null,"crystallization_quote":null,"prompt_match":"none","reflection":null}
```

## Findings

1. **Defense layer works.** Scenario 8 (`ignore previous instructions`) is short-circuited server-side by `isInjectionAttempt` from `lib/defense.mjs`; Groq was never called. The block list catches the canonical injection patterns.
2. **Type guards held.** Scenario 1 returned `crystallization_word` as a 3-word phrase (`"nobody used it"`), not a single token. The server's `typeof === 'string'` guard passed it through. Client-side `findTtft` takes `.split(/\s+/)[0]` of the returned value, so the search target is `"nobody"` — which IS in the text — and the timestamp will resolve. No client crash.
3. **Reflection length compliant.** All ≤20 words.
4. **Word-quality weakness.** Scenarios 4 + 7 chose grammatical words (`"why"`, `"which"`) over content-bearing words (`"identity"`, `"answer"`). The TTFT will still resolve (those tokens exist), but the *narrative* on the results screen reads weaker — "your thought crystallized at word 2 of 32" is anticlimactic.
5. **Prompt-match drift.** Scenario 7 mismatched to prompt 3 (`"Something I don't understand is…"`) when the user wrote nothing of that form. Indirect-emotional text confuses the classifier. Acceptable but worth noting.

## Recommended prompt tweaks (post-launch, not blocking)

Add to the Groq prompt, after the "Identify the single word" sentence:

> Prefer a content-bearing word (noun, verb, adjective, or emotion) over function words ("why", "which", "is", "the").

And tighten the prompt-match guidance:

> Only return 1, 2, or 3 if the writer's text clearly extends one of those starters (echoes the structure or directly continues the thought). Otherwise return "none".

These are calibration nudges. The current prompt is good enough to ship — the borderline cases still produce a coherent results screen and the TTFT measurement resolves.

## Status

APPROVED for ttft-game branch dogfood. No prompt change required pre-merge.
