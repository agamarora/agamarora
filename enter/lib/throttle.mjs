// throttle.mjs
//
// Client-side 1 query / 2s soft throttle for /enter.
// Per docs/plans/phase-d-decisions-2026-04-27.md Decision 10.
//
// Usage (import as module or inline in enter/index.html):
//
//   import { canSubmit, markSubmit } from '/enter/lib/throttle.mjs';
//
//   submitButton.addEventListener('click', () => {
//     if (!canSubmit()) return;  // silently block (or show hint)
//     markSubmit();
//     // ... proceed with query
//   });
//
// NOTE for Lane C: include this module in enter/index.html.
// Either:
//   <script type="module" src="/enter/lib/throttle.mjs"></script>
//   (and import canSubmit/markSubmit in the main module)
// Or inline the 4 lines below directly in the submit handler.
//
// The throttle is client-side ONLY — it does not communicate with the
// server. Server-side burst (5/10s) and hourly (60/h) rate limits are
// the authoritative backstop. This throttle is purely UX polish to
// prevent double-submits and accidental rapid-fire.

const THROTTLE_MS = 2000; // 1 query per 2s
let lastSubmitAt = 0;

/**
 * Returns true if enough time has elapsed since the last submission.
 * Purely time-based; does not block server-side rate limit responses.
 */
export function canSubmit() {
  return Date.now() - lastSubmitAt >= THROTTLE_MS;
}

/**
 * Records that a submission just happened. Call immediately before
 * firing the query so the timer starts from the right moment.
 */
export function markSubmit() {
  lastSubmitAt = Date.now();
}

/**
 * Milliseconds remaining until next submission is allowed.
 * Returns 0 if already eligible.
 */
export function throttleRemaining() {
  return Math.max(0, THROTTLE_MS - (Date.now() - lastSubmitAt));
}
