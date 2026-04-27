# Mobile /enter native redesign — plan + restart point

**Status:** PLANNED, NOT STARTED
**Baseline tag:** `baseline-mobile-redesign-2026-04-27` (commit `a65d598`)
**Last good live state:** restored via revert of 7624405. Pre-revert architecture (single-mechanism vv-only) regressed mobile per user; reverted to interactive-widget + JS threshold approach.

---

## Context

`/enter` is the live AI terminal at agamarora.com/enter. Desktop works. Mobile (iPhone Safari + Android Chrome) is broken because the page squeezes the desktop layout into 360-414px viewports instead of having a mobile-native design.

User feedback (verbatim): *"because we are trying to squeeze desktop experience into mobile we are losing the essence of it"*.

Target devices: **iPhone Safari, Android Chrome** only. Other browsers can lag behind.

## Why the previous fixes failed

Previous session attempted ~7 piecemeal mobile fixes:
- Added `interactive-widget=resizes-content` viewport meta
- Wrote JS visualViewport listener with 80px threshold
- Locked html/body to `var(--vh, 100dvh)`
- Set body `display:flex; flex-direction:column`
- Made input bar `position:static` flex child
- Hid wordmark/aa-mark, shrunk type sizes

Each fix locally correct. Globally chaotic — multiple reflow mechanisms, no state model, no agreed mobile-native target. User finally said: *"the fact that you are going at it without a plan is worrying me"*.

The actual problem was never just keyboard handling. Mobile needs its own design, not a viewport-locked desktop.

---

## Mobile-native target design

```
DESKTOP (preserved as-is)              MOBILE (target — new)
═════════════════════════════         ═════════════════════════════════════
                                      
                                      ┌ status bar tight at top:
HUGE WORDMARK                         │ ● agent.agam · ready
AI Product Manager · ships            └ 
warm-trace                            
opening line (long)                   ┌ greeting (single line):
                                      │ "Hi. Ask anything about Agam."
[3 large cards horizontal]            └
                                      
                                      ┌ 3 starter pills (compact rows):
                                      │ → Constellation       /wiki/graph
                                      │ → Lab                 /lab
                                      │ → Resume              /resume
                                      └
                                      
                                      ┌ scrollable conversation area
                                      │ (empty until first turn)
                                      │
                                      └ flex: 1, overflow-y: auto
                                      
[ ask anything... ] (fixed bottom)    ┌──────────────────────────────┐
                                      │ ›  ask anything...           │
                                      └──────────────────────────────┘
                                      ━━━ keyboard region ━━━
```

### Mobile-native rules

1. **Drop AGAM ARORA wordmark on mobile.** Eats 30-40% of viewport above the fold. Replaces with one-line greeting.
2. **Drop tagline + warm-trace on mobile.** Redundant.
3. **Status bar at top.** `● agent.agam · ready` — keeps brand presence in 24px.
4. **Empty state = greeting line + 3 pill rows.** Not cards. Pill rows match Claude/ChatGPT/WhatsApp patterns.
5. **Input bar prominent.** 52px tall, fully rounded (`border-radius: 26px`), gold focus ring. Touch target generous.
6. **Type scale tighter.** Headings 1rem, body 0.95rem, monos 0.78rem.
7. **Card-after-answer = compact rows.** Already implemented; keep.
8. **No scroll-snap, no horizontal overflow.** Vertical only.
9. **Tap targets ≥ 44px.**

---

## Architecture (locked)

### Viewport handling — pick ONE, not both

| Approach | Works on | Cost |
|---|---|---|
| `<meta interactive-widget=resizes-content>` + `100dvh` | Android Chrome 108+, Edge | Doesn't work on iOS Safari (WebKit hasn't shipped) |
| visualViewport JS + `--vh` CSS var | Both iOS Safari + Android Chrome | Adds JS, slight reflow per vv event |
| Combined | Both | Two reflows per event = jitter |

**Decision:** visualViewport JS only. Drop `interactive-widget`. Single mechanism, same behavior on iOS + Android.

### CSS skeleton (mobile @media)

```css
@media (max-width: 760px) {
  html, body {
    height: var(--vh, 100dvh);
    min-height: 0;            /* override SHARED_RESET min-height:100dvh */
    overflow: hidden;
    overscroll-behavior: none;
  }
  body { display: flex; flex-direction: column; }
  main.terminal {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 64px 16px 16px;  /* top: header offset */
  }
  .input-bar {
    position: static;
    flex-shrink: 0;
    padding: 12px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  }
}
```

### JS

```js
if (isMobile() && window.visualViewport) {
  const vv = window.visualViewport;
  const updateVH = () => {
    document.documentElement.style.setProperty('--vh', vv.height + 'px');
  };
  vv.addEventListener('resize', updateVH);
  updateVH();
}
```

No threshold. No scroll listener. No `--vv-offset`. No orientationchange dance.

---

## State model

```
USER STATE         VIEWPORT       LAYOUT BEHAVIOR
─────────────────  ────────────   ─────────────────────────────────────
IDLE               vv=full        body=full vh; main fills; bar at bottom
INPUT_FOCUSED      vv=shrunk      body shrinks once; bar at vv bottom
TYPING             vv stable      no reflow; bar stays put
SUGGESTION_BAR     vv shrinks     bar tracks new vv bottom (1 reflow)
KEYBOARD_DISMISS   vv=full        body grows; bar drops to phone bottom
ROTATION           vv axis flip   body resizes; layout adjusts
```

---

## Implementation steps (sequential)

1. Revert any partial mobile work back to baseline tag.
2. Define `--mobile-greeting` text content + 3 pill content (graph, lab, resume).
3. Write mobile @media block that hides wordmark/tagline/warm-trace, shows greeting + pills.
4. Implement viewport lock (CSS + JS as above).
5. Style input bar mobile (rounded, 52px, gold focus ring).
6. Test scenarios on iPhone Safari + Android Chrome:
   - Load page → greeting + 3 pills + input bar visible
   - Tap input → keyboard opens, bar at keyboard top, no jump
   - Type → no reflow per keystroke
   - Submit → empty state replaced by trace + answer + cards
   - Long conversation → main scrolls internally
   - Dismiss keyboard → body grows, bar drops to phone bottom
   - Rotate → relayout
   - Home indicator (iPhone) → bar respects safe-area-inset
7. Verify desktop unchanged.
8. Ship.

---

## Out of scope

- Mobile Firefox / mobile Edge tuning (different browser-specific quirks)
- iOS PWA install / standalone mode
- Landscape-specific design (use portrait layout, accept compromise)
- Pull-to-refresh, swipe gestures
- Haptic feedback
- VirtualKeyboard API (`env(keyboard-inset-height)`) — not yet shipped on iOS

---

## Restart prompt for new clean context

When opening a fresh Claude Code session in this repo, paste this:

> Read `docs/plans/mobile-enter-redesign-2026-04-27.md`. We're at baseline tag `baseline-mobile-redesign-2026-04-27`. Implement the mobile-native redesign of `/enter` per that plan. Single mechanism (visualViewport JS only, drop `interactive-widget`). Mobile gets its own design — no wordmark, greeting + 3 pills, prominent rounded input bar. Test on netlify dev (port 8888) via real iPhone + Android over LAN IP. Don't ship until both phones look right. No piecemeal fixes — implement steps 1-8 in order from the plan.

---

## Sources cited in research

- mattpilott/ios-chat — canonical iOS PWA chat pattern
- htmhell.dev/adventcalendar/2024/4 — interactive-widget tradeoffs
- bram.us/2021/09/13 — VirtualKeyboard API
- ishadeed.com/article/virtual-keyboard-api — env(keyboard-inset-height)
- franciscomoretti.com — fix mobile keyboard with dvh
