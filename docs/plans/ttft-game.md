<!-- /autoplan restore point: /c/Users/Agam/.gstack/projects/agamarora-agamarora/main-autoplan-restore-20260521-182030.md -->

# Plan: TTFT — Time to First Thought (v2)

**Route:** `/lab/type/`
**Status:** v2 plan — pending design + eng review
**Date:** 2026-05-21
**Surface:** desktop only

---

## Concept

A typing experiment that measures **TTFT — Time to First Thought**: the moment a user's coherent idea crystallizes during a 60-second stream of consciousness, identified by an LLM analyzing the text. Mirrors the AI metric "time to first token" — but for humans, the meaningful latency isn't keystrokes, it's **when a thought becomes clear**.

AI commits to tokens immediately. Humans warm up. This experiment surfaces that warm-up as data.

**Tagline:** "Models have TTFT. So do you."

---

## Core Mechanic

1. Page loads. Three sentence-starter prompts displayed simultaneously.
2. Textarea below prompts with ghost text: "start typing to begin".
3. First keystroke = `t0` (start of typing). 60s countdown begins. Per-word timestamps recorded.
4. No-backspace rule enforced.
5. User types freely — can extend a prompt or ignore them.
6. User can hit "done →" anytime to submit early. Or timer hits 0 → auto-submit.
7. Text + per-word timestamps sent to Groq.
8. Groq returns: `{ crystallization_word, crystallization_quote, prompt_match, reflection }`.
9. JS cross-references `crystallization_word` against `wordTimestamps` to find when it was typed.
10. Results screen shows TTFT (crystallization moment), retroactive prompt highlight, WPM, model comparison, reflection.

---

## Desktop-Only Surface

This page is desktop only. On viewport width < 1024px (`--bp-medium`), the experience is replaced with a polite redirect screen.

**Detection logic:**
```javascript
if (window.matchMedia('(max-width: 1023px)').matches || 'ontouchstart' in window && !window.matchMedia('(min-width: 1024px)').matches) {
  document.body.classList.add('mobile-block');
}
```

Two checks: viewport width AND touch capability. Either signal triggers the redirect screen.

**Mobile block screen (full viewport):**
- Same header chrome (icon bar, aa. mark)
- Centered card, max-width 440px
- Eyebrow: `TTFT.LAB`
- Heading: `Open this on a desktop.`
- Body: `This experiment needs a physical keyboard and no-backspace flow. Mobile soft keyboards intercept too much. Come back from a laptop.`
- Single CTA: ghost button "← back to lab" linking to `/lab/`

No partial mobile layout. No fallback. Clean redirect.

---

## Screen States (5)

### 1. Pre-game (page load, desktop)

**Layout (single content column, max-width `--width-narrow` = 720px, centered):**
- Header (shared v2: icon bar top-left, aa. mark bottom-right via chrome.mjs)
- Eyebrow: `TTFT.LAB` (mono, gold, uppercase, 0.14em letter-spacing)
- H1: `Time to First Thought.` (Satoshi 700, clamp 2.1-3.4rem, -0.03em)
- Subhead: `Models output their first token in milliseconds. How long until yours?` (15 words, fits voice rule. text-secondary, max-width 620px)
- Three prompt cards (vertical stack, full content width):
  - Card 1 (category: `RIGHT NOW`): "The thing I keep putting off is..."
  - Card 2 (category: `FEELING`): "Honestly I'm a little..."
  - Card 3 (category: `WORLD`): "Something I don't understand is..."
- Textarea below cards: full width, min-height 200px
- Below textarea row: muted indicator "60s · no backspace" (text-dim mono) + "done →" button (ghost, dimmed)
- Keyboard background: reuse `kb-board` from `/enter`, opacity capped at 0.12. Texture only.

### 2. Active typing (post-first-keystroke)

- Gold progress bar at top of viewport (4px, `--accent`, drains left→right over 60s via CSS transition)
- All 3 prompt cards fade to opacity 0.4 (uniform — we don't know which prompt yet)
- Textarea active. Each keystroke triggers keyboard glow on background (reusing /enter's mechanic)
- "done →" button activates (primary style: gold bg, dark text)
- Indicator stays muted: "no backspace" below textarea
- Last 10s: small JetBrains Mono countdown fades in top-right ("08", "07"...)

### 3. Submitted (timer at 0 OR user hit "done →")

- Textarea blurs + becomes readonly. Border flashes `--accent` for `--motion-fast` (200ms)
- Progress bar fills 100% gold then fades over `--motion-moderate`
- Status line replaces button: "reading your words…" (text-dim italic Satoshi)
- Background kb-board freezes — no more key glows

### 4. Results

**Hierarchy top to bottom:**

```
[EYEBROW]               TTFT · YOUR THOUGHT

[TTFT NUMBER]           18.4s
[CAPTION]               your thought crystallized at word 23 of 47

[CRYSTALLIZED QUOTE]    "the thing I'm actually scared of is"

[REFLECTION]            You hesitated four seconds, then warmed up,
                        then named the fear directly.

[DIVIDER]               ─────

[SECONDARY METRICS]     WPM 47 · 60s · no backspace
[RETROACTIVE PROMPT]    You were responding to:
                        ▎"Honestly I'm a little..." (gold left-border)

[MODEL COMPARISON]      Claude Sonnet outputs its first token in 0.5s.
                        You took 18.4s to crystallize a thought.
                        Different kinds of speed.

[CTAs]                  [copy result →]    [type again]
```

### 5. Edge case / error states

| Case | Behavior |
|---|---|
| 0 words typed in 60s | Show: "you didn't type." + single CTA "try again". No Groq call. |
| 1-3 words typed | Skip Groq call. Show "too short to measure" + WPM if any. |
| Groq returns no crystallization word | Skip TTFT number. Show: "your text was a steady stream — no single crystallization moment." + WPM + reflection if available. |
| Groq fails (network, timeout, 5xx) | Show WPM + "the reflection model didn't respond. your stats stand." Hardcoded fallback. |
| User pastes text | Blocked at `beforeinput`. Shake. |
| User backspaces | Blocked at `keydown`. 2px horizontal shake on textarea, border flash gold for 200ms. |
| Tab switch / browser blur during active typing | Timer pauses. Resume on visibility return. TTFT preserved. |
| Mobile / tablet viewport on load | Render mobile-block screen. No game. |

---

## TTFT Measurement

### Client-side recording
- `t0`: timestamp of first printable keystroke (`performance.now()`)
- `wordTimestamps`: array of `{ word, t }` where `t` = ms since `t0`, recorded on word-boundary events (space, enter, terminal punctuation). One entry per completed word.
- `text`: full typed string
- `elapsedMs`: total active typing time (excludes paused intervals)

### Server contract — POST `/.netlify/functions/reflectHandler`

**Request:**
```json
{
  "text": "the user's full typed text",
  "wpm": 47,
  "duration_s": 60
}
```

**Groq prompt template (server-side):**
```
A person typed the following text in a 60-second flow-typing experiment.
No backspace was allowed. Their WPM was {WPM}.

TEXT:
"""
{USER_TEXT}
"""

Identify the single word or short phrase where the writer's thought clearly crystallized — where they stopped warming up and the real idea emerged. If the text was a steady, consistent flow with no single crystallization moment, return null for crystallization_word.

Also identify which of these 3 prompts they were most likely responding to (or "none" if they ignored all):
1. "The thing I keep putting off is..."
2. "Honestly I'm a little..."
3. "Something I don't understand is..."

Return ONLY a JSON object:
{
  "crystallization_word": "fear" | null,
  "crystallization_quote": "the thing I'm actually scared of is" | null,
  "prompt_match": 1 | 2 | 3 | "none",
  "reflection": "One sentence about what the writer revealed. Reference their actual words. Max 20 words."
}
```

**Response shape:**
```json
{
  "crystallization_word": "fear" | null,
  "crystallization_quote": "..." | null,
  "prompt_match": 1 | 2 | 3 | "none",
  "reflection": "..." | null
}
```

### JS reconciliation
1. If `crystallization_word` is null → display "no single crystallization moment"
2. Else: case-insensitive search through `wordTimestamps` for first occurrence (strip punctuation when matching)
3. If found: TTFT = `wordTimestamps[i].t / 1000` (seconds, 1 decimal)
4. If not found (Groq hallucinated a word not in text): show `crystallization_quote` without timestamp

---

## Visual Design — Bound to Moodboard

**Tokens used (all from `moodboard/index.html :root`):**

```
/* Surfaces */
--bg: #0B0A09           /* n-50 */
--surface: #12110F      /* n-100 */
--elevated: #191714     /* n-150 */
--border: #201D18       /* n-200 */
--border-heavy: #2D2924 /* n-300 */

/* Text */
--text: #E8E4DF
--text-strong: #C8C0B8
--text-secondary: #A59D95
--text-dim: #8A817A
--text-decorative: #6B6359

/* Accent */
--accent: #E5A54B
--accent-dim: rgba(229, 165, 75, 0.12)

/* Type */
--mono, --sans, --mark

/* Spacing — 4px base, 11 tokens */
--space-1..11 (2/4/8/12/16/24/32/48/64/96/128)
--gap-tight (8) / --gap-default (16) / --gap-loose (24)
--padding-element (12) / --padding-card (32) / --padding-section (48) / --padding-page (96)

/* Radius */
--radius-sm (4) / --radius-md (8) / --radius-lg (12)

/* Widths */
--width-narrow (720) / --width-default (1080)

/* Motion */
--motion-instant (100ms) / --motion-fast (200ms) / --motion-moderate (350ms) / --motion-slow (500ms)
--ease-decelerate cubic-bezier(0.16, 1, 0.3, 1)
```

**Voice rules (moodboard section 10):**
- Section heads: 1-3 words ("Your thought", "Type again")
- Subheads: 8-15 words, one claim
- Body: 2-3 sentences, 40-60 words max
- CTAs: 2-3 words, verb-first ("copy result", "type again", "done →")
- No superlatives without numbers

**Imagery (moodboard section 08):**
- No mesh gradients, no decorative shapes, no abstract blobs
- Keyboard background at 12% opacity = material texture (within "subtle texture for material feel" rule)
- Whitespace IS the decoration — generous spacing between sections
- Optional: focal gold glow behind hero (4% opacity, ~60vw radius)

### Component bindings (moodboard section 09)

**Buttons:**
- Primary: `background: var(--accent); color: var(--bg); border: none; border-radius: var(--radius-sm); padding: var(--space-4) var(--space-7); font-family: var(--sans); font-weight: 600; transition: opacity var(--motion-fast) var(--ease-decelerate);`
- Ghost: `background: transparent; color: var(--text); border: 1px solid var(--border-heavy); border-radius: var(--radius-sm); padding: var(--space-4) var(--space-7); transition: border-color var(--motion-fast) var(--ease-decelerate);` hover → `border-color: var(--accent)`

**Project card pattern (for prompt cards):**
- `background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--padding-card);`
- Hover: `border-color: var(--border-heavy)`
- Matched (retroactive): `border-left: 3px solid var(--accent); background: var(--accent-dim);`

**Tag (for category labels above prompts):**
- JetBrains Mono, 11px, letter-spacing 0.14em, uppercase, color `var(--text-dim)`

### Page-specific extensions (not in moodboard, page-bindings doc material)

**Flow textarea:**
```css
.flow-textarea {
  width: 100%;
  min-height: 200px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  font-family: var(--sans);
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text);
  resize: none;
  caret-color: var(--accent);
  transition: border-color var(--motion-fast) var(--ease-decelerate);
}
.flow-textarea:focus { outline: none; border-color: var(--border-heavy); }
.flow-textarea.shake { animation: shake 200ms var(--ease-decelerate); }
.flow-textarea.locked { opacity: 0.7; cursor: not-allowed; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); border-color: var(--accent); }
  75% { transform: translateX(2px); border-color: var(--accent); }
}
```

**Progress bar:**
```css
.timer-bar {
  position: fixed;
  top: 0; left: 0;
  height: 4px;
  width: 0%;
  background: var(--accent);
  z-index: 200;
  transition: width var(--motion-instant) linear;
}
.timer-bar.active { width: 100%; transition: width 60s linear; }
```

**Last-10s counter:**
```css
.last-10s-counter {
  position: fixed;
  top: var(--space-5);
  right: var(--space-5);
  font-family: var(--mono);
  font-size: 0.85rem;
  color: var(--accent);
  opacity: 0;
  transition: opacity var(--motion-moderate) var(--ease-decelerate);
  z-index: 150;
}
.last-10s-counter.visible { opacity: 1; }
```

**Results TTFT display:**
```css
.ttft-number {
  font-family: var(--mono);
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 500;
  color: var(--text);
  letter-spacing: -0.03em;
  line-height: 1;
}
.ttft-caption {
  font-family: var(--mono);
  font-size: 0.78rem;
  color: var(--text-dim);
  letter-spacing: 0.08em;
  text-transform: lowercase;
}
.crystallized-quote {
  font-family: var(--sans);
  font-style: italic;
  font-size: clamp(1.2rem, 2.4vw, 1.6rem);
  color: var(--accent);
  text-align: center;
  line-height: 1.4;
  letter-spacing: -0.01em;
}
.reflection {
  font-family: var(--sans);
  font-size: 1.05rem;
  color: var(--text);
  text-align: center;
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.5;
  opacity: 0.88;
}
```

**Keyboard background reuse:**
- Reuse `.kb-board`, `.kb-row`, `.kb-key`, `.kb-scene`, `.kb-fade` from `/enter/index.html`
- Override `.kb-board { opacity: 0.12; }` for ttft page (was 0.42 in /enter)
- Reuse keydown→key-glow handler from /enter
- Disable during pre-game and post-submit states

---

## Engineering Spec

### Files to create
- `lab/type/index.html` — single self-contained page (HTML + inline CSS + inline JS, per site convention)
- `netlify/functions/reflectHandler.mjs` — new function, separate from `groqHandler.mjs`

### Files to modify
- `lab/index.html` — add project card for TTFT (after build + verification)
- `sitemap.xml` — add `/lab/type/` after launch

### JS skeleton (inline in `lab/type/index.html`)

```javascript
// Mobile/tablet block — check before anything else
if (window.matchMedia('(max-width: 1023px)').matches ||
    ('ontouchstart' in window && !window.matchMedia('(min-width: 1024px)').matches)) {
  document.body.classList.add('mobile-block');
  // Stop — no game logic loads on mobile
} else {
  initTTFTGame();
}

function initTTFTGame() {
  const textarea = document.querySelector('.flow-textarea');
  const doneBtn = document.querySelector('.done-btn');
  const timerBar = document.querySelector('.timer-bar');
  const counter = document.querySelector('.last-10s-counter');

  const state = {
    t0: null,
    wordTimestamps: [],
    text: '',
    elapsedMs: 0,
    pauseStart: null,
    totalPausedMs: 0,
    submitted: false,
  };

  // First-keystroke detector
  function onFirstKey(e) {
    if (e.key.length !== 1 && e.key !== 'Enter') return; // skip modifiers/arrows
    if (state.t0) return;
    state.t0 = performance.now();
    startTimer();
    textarea.removeEventListener('keydown', onFirstKey);
    document.querySelectorAll('.prompt-card').forEach(c => c.classList.add('faded'));
    timerBar.classList.add('active');
    doneBtn.classList.add('btn-primary');
    doneBtn.classList.remove('btn-ghost');
  }
  textarea.addEventListener('keydown', onFirstKey);

  // Word-boundary tracker — push timestamp when a NEW completed word appears
  textarea.addEventListener('input', () => {
    state.text = textarea.value;
    const words = state.text.trim().split(/\s+/).filter(Boolean);
    while (state.wordTimestamps.length < words.length - 1) {
      const idx = state.wordTimestamps.length;
      const word = words[idx];
      const t = performance.now() - state.t0 - state.totalPausedMs;
      state.wordTimestamps.push({ word, t });
    }
  });

  // No-backspace + no-paste + no-undo
  textarea.addEventListener('keydown', (e) => {
    const blocked = ['Backspace', 'Delete'];
    const ctrlBlocked = ['z', 'x', 'v'];
    if (blocked.includes(e.key) ||
        ((e.ctrlKey || e.metaKey) && ctrlBlocked.includes(e.key.toLowerCase()))) {
      e.preventDefault();
      shake();
    }
  });
  textarea.addEventListener('beforeinput', (e) => {
    if (['deleteContentBackward','deleteContentForward','insertFromPaste','historyUndo','historyRedo'].includes(e.inputType)) {
      e.preventDefault();
      shake();
    }
  });
  function shake() {
    textarea.classList.add('shake');
    setTimeout(() => textarea.classList.remove('shake'), 220);
  }

  // Timer with visibility-pause + last-10s counter
  function startTimer() {
    function tick() {
      if (state.submitted) return;
      const elapsed = performance.now() - state.t0 - state.totalPausedMs;
      const remaining = 60_000 - elapsed;
      if (remaining <= 0) { submit('timeout'); return; }
      if (remaining <= 10_000) {
        counter.classList.add('visible');
        counter.textContent = String(Math.ceil(remaining / 1000)).padStart(2, '0');
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', () => {
    if (state.submitted || !state.t0) return;
    if (document.hidden) {
      state.pauseStart = performance.now();
    } else if (state.pauseStart) {
      state.totalPausedMs += performance.now() - state.pauseStart;
      state.pauseStart = null;
    }
  });

  doneBtn.addEventListener('click', () => {
    if (!state.t0) return;
    submit('manual');
  });

  async function submit(reason) {
    if (state.submitted) return;
    state.submitted = true;
    state.elapsedMs = performance.now() - state.t0 - state.totalPausedMs;
    textarea.setAttribute('readonly', '');
    textarea.classList.add('locked');
    showLoadingState();
    const wpm = calculateWpm(state.text, state.elapsedMs);
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch('/.netlify/functions/reflectHandler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: state.text, wpm, duration_s: Math.round(state.elapsedMs/1000) }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);
      const data = await res.json();
      renderResults({ wpm, ...data });
    } catch (err) {
      renderResults({ wpm, crystallization_word: null, crystallization_quote: null, prompt_match: 'none', reflection: null, failed: true });
    }
  }

  function calculateWpm(text, ms) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = ms / 60_000;
    return minutes > 0 ? Math.round(words / minutes) : 0;
  }

  function findTtft(wordTimestamps, crystallizationWord) {
    if (!crystallizationWord) return null;
    const target = crystallizationWord.toLowerCase().replace(/[^a-z]/g, '');
    const hit = wordTimestamps.find(({ word }) =>
      word.toLowerCase().replace(/[^a-z]/g, '') === target
    );
    return hit ? hit.t / 1000 : null;
  }

  function renderResults(data) { /* template render — see results screen spec */ }
  function showLoadingState() { /* swap textarea/button row for "reading your words…" */ }
}
```

### Serverless function (`netlify/functions/reflectHandler.mjs`)

```javascript
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.1-8b-instant';
const MAX_USER_TEXT = 500;

function sanitize(text) {
  return String(text || '')
    .slice(0, MAX_USER_TEXT)
    .replace(/```/g, '')
    .replace(/"""/g, '')
    .trim();
}

const FALLBACK = {
  crystallization_word: null,
  crystallization_quote: null,
  prompt_match: 'none',
  reflection: null,
};

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  let body;
  try { body = await req.json(); }
  catch { return Response.json({ error: 'invalid json' }, { status: 400 }); }

  const text = sanitize(body.text);
  const wpm = Number(body.wpm) || 0;
  if (text.length < 10) return Response.json(FALLBACK);

  const prompt = `A person typed the following text in a 60-second flow-typing experiment. No backspace was allowed. Their WPM was ${wpm}.

TEXT:
"""
${text}
"""

Identify the single word or short phrase where the writer's thought clearly crystallized — where they stopped warming up and the real idea emerged. If the text was a steady, consistent flow with no single crystallization moment, return null for crystallization_word.

Also identify which of these 3 prompts they were most likely responding to (or "none" if they ignored all):
1. "The thing I keep putting off is..."
2. "Honestly I'm a little..."
3. "Something I don't understand is..."

Return ONLY a JSON object:
{
  "crystallization_word": "fear" | null,
  "crystallization_quote": "the thing I'm actually scared of is" | null,
  "prompt_match": 1 | 2 | 3 | "none",
  "reflection": "One sentence about what the writer revealed. Reference their actual words. Max 20 words."
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });
    const raw = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);
    return Response.json({
      crystallization_word: parsed.crystallization_word ?? null,
      crystallization_quote: parsed.crystallization_quote ?? null,
      prompt_match: parsed.prompt_match ?? 'none',
      reflection: parsed.reflection ?? null,
    });
  } catch {
    return Response.json(FALLBACK, { status: 200 });
  }
};

export const config = { path: '/.netlify/functions/reflectHandler' };
```

---

## Model Comparison Table (results screen)

| Model | TTFT (time to first token) | Sustained throughput |
|---|---|---|
| Claude Opus 4 | ~1.2s | ~50 tokens/sec |
| Claude Sonnet 4 | ~0.5s | ~100 tokens/sec |
| GPT-4o | ~0.6s | ~80 tokens/sec |
| Llama 3.1 8b (Groq) | ~0.2s | ~750 tokens/sec |
| Llama 3.1 70b (Groq) | ~0.3s | ~300 tokens/sec |

Used purely for the comparison line: "Claude Sonnet outputs its first token in 0.5s. You took {N}s to crystallize a thought. Different kinds of speed."

Approximate values. Verify before ship.

---

## What's NOT in Scope (v1)

- Mobile layout (desktop only — mobile gets redirect screen)
- Persistent leaderboards / user accounts
- Social share with OG image render
- Saving sessions / replays
- "Challenge a friend" link
- A/B testing variants of the Groq prompt
- Analytics beyond basic Netlify

If TTFT finds an audience: OG-image sharing is the obvious next add.

---

## What Already Exists (reuse)

- `enter/index.html` ~lines 816-823: kb-board HTML
- `enter/index.html` ~lines 95-145: kb-board CSS (perspective, scale, opacity, key styles, glow)
- `enter/index.html` ~lines 1020-1090: keydown→key-glow handler
- `scripts/lib/chrome.mjs`: design tokens, SVG sprite, header markup, aa-mark, font-face
- `netlify/functions/groqHandler.mjs`: reference pattern for Groq SDK setup (env var, error handling)
- `moodboard/index.html`: canonical token + component spec — page MUST inline these tokens exactly

---

## Failure Modes Registry

| # | Failure | Severity | Detection | Mitigation |
|---|---|---|---|---|
| 1 | Groq timeout (>8s) | High | client AbortController | hardcoded fallback, WPM still shown |
| 2 | Groq returns malformed JSON | High | JSON.parse throws server-side | catch, return FALLBACK shape |
| 3 | Groq hallucinates word not in text | Medium | client findTtft returns null | show crystallization_quote without timestamp |
| 4 | User pastes text | High | beforeinput insertFromPaste | block, shake, server-side 500-char cap |
| 5 | User tabs away mid-game | Medium | visibilitychange event | pause + accumulate totalPausedMs |
| 6 | Browser back mid-game | Low | implicit (state lost) | accept — one-shot game |
| 7 | Slow Groq (5-8s) | Medium | client 8s AbortController | timeout → fallback path |
| 8 | Prompt injection via typed text | High | server sanitize + template wrap | strip ``` and """, 500-char cap, template structure |
| 9 | User types only 1-2 words | Low | client word count check | skip Groq if text < 10 chars |
| 10 | Mobile/tablet load | High | viewport check at boot | mobile-block screen, no game loads |
| 11 | Touch device with desktop-sized viewport (iPad in landscape) | Medium | dual check: width + ontouchstart | blocked — soft keyboards break the mechanic |
| 12 | Hardware keyboard unplugged on iPad | Low | can't detect reliably | accept — edge case, user will see broken UX and leave |

---

## Test Plan (manual, pre-ship)

1. **Empty session:** load page, wait 60s without typing — no timer starts, "done →" inactive, nothing happens.
2. **Normal session:** type 30s of flowing text, hit "done →" — results screen renders with TTFT, quote, reflection, WPM, retroactive prompt highlight.
3. **Timeout session:** type, then idle past 60s — auto-submit at 60s, progress bar fully drained.
4. **No-backspace:** type, then hit Backspace, Delete, Ctrl+Z, Ctrl+X, Ctrl+V individually — all blocked with shake, no text changes.
5. **Tab-switch:** type 10s, switch tabs 5s, return, type 10 more — results show ~20s typing, not 25s.
6. **Groq failure:** disable network, type, submit — fallback renders, WPM calculated, no JS exception.
7. **Hallucinated word:** simulate by hacking Groq response (or by typing nonsense) — graceful: quote shown without timestamp.
8. **Mobile (real iOS Safari):** load page — redirect screen, no game.
9. **Tablet (iPad Safari):** load page — redirect screen.
10. **Desktop narrow window (resize to 1023px):** redirect screen.
11. **Retroactive prompt highlight:** type extending prompt 2 → only card 2 gets `.matched` class.
12. **Short text:** type 5 words, hit "done →" — skips Groq call, shows "too short to measure".
13. **Moodboard token alignment:** inspect computed styles — all token values match moodboard `:root` exactly (#0B0A09 not #0A0A0A).

---

## Decision Audit Trail

| # | Phase | Decision | Classification | Rationale |
|---|-------|----------|-----------|-----------|
| 1 | Plan | `/lab/type/` route (not subdomain) | User decision | User comfortable with /lab/, less risk |
| 2 | Concept | TTFT = crystallization moment (not first-keystroke latency) | User insight | Page-load→first-key contaminated by distraction; crystallization is real metric |
| 3 | UX | No card glow during typing; retroactive on results | User insight | We don't know which prompt until Groq analyzes |
| 4 | UX | "done →" button for early end | User addition | Removes "trapped for 60s" anxiety |
| 5 | Timer | Gold progress bar (not number countdown) | Taste | Ambient pressure, doesn't interrupt flow |
| 6 | Timer | Last-10s mono countdown fade-in | Mechanical | Final urgency without intruding earlier |
| 7 | Surface | Desktop-only (mobile redirect) | User decision | Mobile soft keyboards intercept too much |
| 8 | Eng | New reflectHandler.mjs (not groqHandler) | Mechanical | One-shot JSON, no streaming, separate concerns |
| 9 | Eng | Per-word timestamp (not per-keystroke) | Mechanical | Word granularity sufficient |
| 10 | Eng | Pause timer on visibility change | Mechanical | Tab switch invalidates TTFT |
| 11 | Eng | response_format: json_object | Mechanical | Reduces parse failures |
| 12 | Eng | 500-char server cap on USER_TEXT | Mechanical | Defense-in-depth |
| 13 | Eng | 8s client-side AbortController | Mechanical | Slow Groq doesn't hang results screen |
| 14 | Design | Moodboard tokens, exact values | User directive | DESIGN.md says moodboard is source of truth |
| 15 | Design | max-width: var(--width-narrow) = 720px | Mechanical | Matches /lab/second-brain/, voice rules require focused column |
| 16 | Design | Keyboard bg at 0.12 opacity (vs /enter's 0.42) | Mechanical | Texture, not focal |
| 17 | Design | Crystallized quote in gold Satoshi italic | Mechanical | Emotional beat; matches lab/index.html cs-cover-pull pattern |
| 18 | Voice | "Time to First Thought." as H1 | Mechanical | Within 1-3 word section heads / 8-15 word subheads rule (with subhead doing the elaboration) |

---

## Premises Confirmed

1. ✅ Keyboard asset reusable from /enter
2. ✅ Groq returns structured JSON in <2s for llama-3.1-8b-instant
3. ✅ Crystallization-based TTFT is novel + meaningful
4. ✅ 60s + "done →" early end is right session length
5. ✅ No-backspace creates flow (with clear UX explanation)
6. ✅ Three prompts with no required click works (Groq retroactively identifies)
7. ✅ /lab/type/ is correct venue (not subdomain)
8. ✅ Desktop-only is acceptable (mobile redirected politely)
9. ✅ Moodboard tokens are source of truth

---

## Open Questions (for review)

- Should "done →" appear during pre-game (dimmed/inactive) or hidden until typing starts? *Plan: visible but dimmed/disabled.*
- What's the exact copy if WPM is 0 or text < 10 chars? *Plan: "too short to measure."*
- Does keyboard background fade out on results screen, or stay at 0.12? *Plan: stay at 0.12 — visual continuity.*
- Should we log Groq hallucination cases (word not in text) for prompt tuning? *Plan: yes — server-side console log only, no client data.*
- Crystallization word case: if word appears multiple times, take first or last? *Plan: first (crystallization = moment thought emerged).*
- Mobile message copy tone — apologetic or assertive? *Plan: matter-of-fact, in moodboard voice.*
