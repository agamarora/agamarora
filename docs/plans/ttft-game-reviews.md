# TTFT Plan — Review Findings & Amendments

Companion to `ttft-game.md`. Captures the design + engineering review (2026-05-21, Claude subagents) and the resulting plan changes.

---

## Design Review Findings

| # | Severity | Finding | Fix Applied |
|---|---|---|---|
| D1 | CRITICAL | Results screen treats all elements with equal weight — kills emotional payoff of TTFT number | TTFT number gets focal gold glow behind it (4% opacity radial). Dramatic spacing via `--padding-section` (48px) and `--space-9` (64px) blocks. Reflection + quote get breathing room. Secondary metrics + model comparison demoted via card container + border divider. |
| D2 | HIGH | Vertical stack of 3 prompt cards pushes textarea below fold on normal laptops | Prompt cards in horizontal grid: `display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap-default);` |
| D3 | HIGH | `/enter` keyboard opacity stated as 0.42 — actual value is 0.32 | Fix all references |
| D4 | MEDIUM | Model comparison block reads as orphaned body copy | Wrap in project-card pattern: surface bg + border + radius + padding |
| D5 | MEDIUM | "done →" pre-game state via class swap is fragile + ghost border barely visible | Pre-game: `opacity: 0.35; cursor: not-allowed;` on ghost button. Activation removes opacity + swaps to primary. |
| D6 | MEDIUM | Key glow at 0.12 board opacity will be invisible (was tuned for 0.32 board) | Bump `.lit` key glow: `box-shadow: 0 0 32px rgba(229,165,75,0.22); border-color: rgba(229,165,75,0.55);` |
| D7 | MEDIUM | H1 "Time to First Thought." is 4 words — violates 1-3 word section head rule | Shorten H1 to "First Thought." — subhead carries "Time to..." framing |
| D8 | LOW | Mobile CTA "← back to lab" has leading arrow — site convention is verb-first, arrow-after | Change to "lab →" |
| D9 | LOW | "your text was a steady stream — no single crystallization moment" undersells the result | Reframe positively: "no single crystallization moment — your thought was already formed when you started." Treat as alternate result, not error. |

## Engineering Review Findings

| # | Severity | Finding | Fix Applied |
|---|---|---|---|
| E1 | BLOCKER | `response_format: { type: 'json_object' }` not reliably supported on llama-3.1-8b-instant | Switch model to `llama-3.3-70b-versatile` (confirmed json_object support). Verify with curl test before code. Fallback: drop response_format + use regex extraction. |
| E2 | BLOCKER | Word #0 never gets a timestamp — loop excludes index 0 | Fix loop condition to `words.length > wordTimestamps.length` |
| E3 | BLOCKER | Last word before submit never gets a timestamp (no trailing space event) | In `submit()`, capture trailing partial word before Groq call |
| E4 | BLOCKER | `window.blur` not paused — Mac window switches inflate TTFT | Add `window.addEventListener('blur'/'focus', ...)` alongside visibilitychange |
| E5 | BLOCKER | `beforeinput` block list missing `insertFromDrop` + `deleteByCut` | Add both to blocked inputType list |
| E6 | BLOCKER | Groq could return `crystallization_word` as array — `.toLowerCase()` throws, white-screen | Add type guards on all parsed fields server-side before responding |
| E7 | BLOCKER | Mobile block boolean logic redundant — iPad Pro at 1366px passes | Change to OR not AND: `(narrow viewport) OR (any touch capability)` — explicit touch check regardless of viewport |
| E8 | HIGH | IME composition (CJK input) skips first-key detection, leaves `t0=null`, causes NaN timestamps | Listen for `compositionstart` on textarea — start timer there if not already started |
| E9 | HIGH | No `isInjectionAttempt()` filter on reflectHandler — groqHandler.mjs uses one via `defense.mjs` | Import + call `isInjectionAttempt` from `lib/defense.mjs`. If detected, return FALLBACK + log server-side. |
| E10 | HIGH | Browser autofill bypasses input blocking | Add `autocomplete="off"` to textarea, no `name` attribute |
| E11 | MEDIUM | "type again" + in-flight Groq fetch race | Wrap fetch in AbortController; abort on "type again". Check session ID in renderResults before mutating DOM. |
| E12 | MEDIUM | macOS dead-key sequences skip first-key detection | Accepted limitation. Added to failure-modes registry. |
| E13 | MEDIUM | Groq 429 rate limit body gets spread untreated into results | Check `res.status` before `.json()`; non-200 → log + return fallback |
| E14 | LOW | rAF loop continues during paused tab — wastes CPU | Acceptable. No fix. |
| E15 | LOW | No retry/secondary model on Groq failure | Accept for v1. Fallback message is the rescue. |

---

## Updated Code Snippets

### Mobile Block (E7 fix)

```javascript
const isNarrowViewport = window.matchMedia('(max-width: 1023px)').matches;
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
if (isNarrowViewport || isTouchDevice) {
  document.body.classList.add('mobile-block');
} else {
  initTTFTGame();
}
```

### Word-Boundary Tracking (E2, E3 fix)

```javascript
textarea.addEventListener('input', () => {
  if (!state.t0) return;
  state.text = textarea.value;
  const words = state.text.trim().split(/\s+/).filter(Boolean);
  while (state.wordTimestamps.length < words.length) {
    const idx = state.wordTimestamps.length;
    const word = words[idx];
    const t = performance.now() - state.t0 - state.totalPausedMs;
    state.wordTimestamps.push({ word, t });
  }
});

function captureTrailingWord() {
  const words = state.text.trim().split(/\s+/).filter(Boolean);
  if (words.length > state.wordTimestamps.length) {
    const lastWord = words[words.length - 1];
    const t = performance.now() - state.t0 - state.totalPausedMs;
    state.wordTimestamps.push({ word: lastWord, t });
  }
}
```

### Pause Logic (E4, E8 fix)

```javascript
const onPause = () => {
  if (state.submitted || !state.t0 || state.pauseStart) return;
  state.pauseStart = performance.now();
};
const onResume = () => {
  if (state.submitted || !state.pauseStart) return;
  state.totalPausedMs += performance.now() - state.pauseStart;
  state.pauseStart = null;
};
document.addEventListener('visibilitychange', () => {
  document.hidden ? onPause() : onResume();
});
window.addEventListener('blur', onPause);
window.addEventListener('focus', onResume);
textarea.addEventListener('compositionstart', () => {
  if (!state.t0) {
    state.t0 = performance.now();
    startTimer();
    document.querySelectorAll('.prompt-card').forEach(c => c.classList.add('faded'));
    document.querySelector('.timer-bar').classList.add('active');
  }
});
```

### No-Backspace Block List (E5 fix)

```javascript
textarea.addEventListener('beforeinput', (e) => {
  const blocked = [
    'deleteContentBackward',
    'deleteContentForward',
    'insertFromPaste',
    'insertFromDrop',
    'deleteByCut',
    'historyUndo',
    'historyRedo',
  ];
  if (blocked.includes(e.inputType)) {
    e.preventDefault();
    shake();
  }
});
```

### Server-Side Response Validation (E6 fix)

```javascript
const parsed = JSON.parse(raw);
const out = {
  crystallization_word: typeof parsed.crystallization_word === 'string'
    ? parsed.crystallization_word
    : null,
  crystallization_quote: typeof parsed.crystallization_quote === 'string'
    ? parsed.crystallization_quote
    : null,
  prompt_match: [1, 2, 3].includes(parsed.prompt_match)
    ? parsed.prompt_match
    : 'none',
  reflection: typeof parsed.reflection === 'string'
    ? parsed.reflection.slice(0, 200)
    : null,
};
return Response.json(out);
```

### Results Screen Spacing (D1 fix)

```css
.results { padding-top: var(--padding-section); }
.results-ttft-block {
  position: relative;
  padding: var(--space-9) 0;
  text-align: center;
}
.results-ttft-block::before {
  content: '';
  position: absolute;
  inset: -30% -10%;
  background: radial-gradient(ellipse, rgba(229,165,75,0.04) 0%, transparent 60%);
  z-index: -1;
  pointer-events: none;
}
.results-quote-block { margin: var(--space-8) auto; }
.results-reflection { margin-bottom: var(--padding-section); }
.results-divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: var(--padding-section) 0;
}
.results-secondary {
  display: flex;
  flex-direction: column;
  gap: var(--gap-loose);
  padding: var(--padding-card);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.results-actions {
  margin-top: var(--padding-section);
  display: flex;
  gap: var(--gap-default);
  justify-content: center;
}
```

---

## Final Approval

All 24 findings resolved in plan. Status: APPROVED for build.

**Implementation order:**
1. Curl-verify `llama-3.3-70b-versatile` supports `response_format: json_object`
2. Create `netlify/functions/reflectHandler.mjs`
3. Create `lab/type/index.html` (single-file, inline CSS + JS)
4. Verify all 13 test plan items in `ttft-game.md`
5. Verify moodboard token alignment via DevTools
6. Add project card to `lab/index.html`
7. Add `/lab/type/` to `sitemap.xml`
8. Push branch `ttft-game` to remote
