// timing.mjs
//
// Shared timing utilities for /enter v3 agent runtime.
// Imported by groqHandler.mjs, wiki-retrieval.mjs, and llm-pool.mjs.
//
// Rationale: server stamps REAL wall-clock ms per pipeline step
// (preRoute, classify, retrieve wiki, retrieve edges, synthesize)
// then splices those values into SSE trace events before emit.
// Model emits {trace:[{verb,args}], answer, cards} with NO latencyMs —
// server fills it in post-parse.
//
// Per phase-d-decisions-2026-04-27.md Decision 16 + CQ-3.

// Return current wall-clock time in ms (high-resolution monotonic).
// Falls back gracefully if performance.now() is unavailable.
export function now() {
  try {
    return Math.round(performance.now());
  } catch {
    return Date.now();
  }
}

// Measure async or sync fn execution time.
// Returns { result, ms } where ms is real wall-clock elapsed.
// If fn throws, rethrows after logging timing_anomaly.
export async function measure(label, fn) {
  const start = now();
  let result;
  try {
    result = await fn();
  } catch (err) {
    const elapsed = now() - start;
    console.warn(`[timing] timing_anomaly label=${label} ms=${elapsed} err=${err?.message}`);
    throw err;
  }
  const ms = now() - start;
  return { result, ms };
}

// Measure sync fn execution time.
// Returns { result, ms }.
export function measureSync(label, fn) {
  const start = now();
  let result;
  try {
    result = fn();
  } catch (err) {
    const elapsed = now() - start;
    console.warn(`[timing] timing_anomaly label=${label} ms=${elapsed} err=${err?.message}`);
    throw err;
  }
  const ms = now() - start;
  return { result, ms };
}

// Format ms for display in trace lines. Returns string like "142ms" or "—".
// Pill animation uses this as the settled value.
export function formatMs(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms < 0) return '—';
  return `${Math.round(ms)}ms`;
}
