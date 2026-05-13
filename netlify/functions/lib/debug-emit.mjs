// debug-emit.mjs
//
// Allowlist scrubber for /enter/log glassbox observability.
//
// Two tiers:
//   Tier 1 (always emitted)  — matches what user already perceives via /enter UI
//   Tier 2 (verbose toggle)  — backend mechanics needed to diagnose pipeline bugs
//
// Hard rule: NEVER serialize system prompt, dynamicContext body, wiki/belief
// extract text, providerKeyId, cache keys, env vars, error.stack, or any
// content the public-facing UI doesn't already reveal. The allowlist enforces
// this — anything not on the per-tag whitelist is dropped, NOT logged.
//
// Page consumes via SSE `debug` events. See enter/log/index.html.

const TIER_1_FIELDS = {
  route_decision: ['type', 'reason', 'themes', 'confidence'],
  card_summary:   ['slug', 'priority', 'kind'],
  token_count:    ['count'],
  answer_meta:    ['len'],
};

const TIER_2_FIELDS = {
  timings_map:    ['preroute', 'classify', 'retrieve_wiki', 'retrieve_edges', 'synthesize', 'retry'],
  pill_resolve:   ['verb', 'timingKey', 'realMs', 'displayMs', 'pillMs', 'fallbackUsed'],
  retrieval_meta: ['theme_slugs', 'belief_slugs', 'theme_chars', 'belief_chars', 'edge_count'],
  retry_meta:     ['triggered', 'accepted', 'originalLen', 'expandedLen', 'retryMs'],
  cache_status:   ['hit'],
};

// Returns scrubbed payload (only allowlisted fields) or null if:
//   - tag is unknown
//   - tag is tier-2 but verbose is false
//
// Caller is responsible for enqueueing the SSE `debug` event with the result.
export function scrubDebugPayload(tag, payload, verbose) {
  const t1 = TIER_1_FIELDS[tag];
  const t2 = TIER_2_FIELDS[tag];
  const allow = t1 || (verbose ? t2 : null);
  if (!allow) return null;
  if (!payload || typeof payload !== 'object') return null;
  const out = {};
  for (const k of allow) {
    const v = payload[k];
    if (v !== undefined) out[k] = v;
  }
  return out;
}

export function isKnownDebugTag(tag) {
  return TIER_1_FIELDS[tag] !== undefined || TIER_2_FIELDS[tag] !== undefined;
}

// Exported for client-side allowlist mirror (enter/index.html captureDebug).
// Keep in sync with TIER_1_FIELDS + TIER_2_FIELDS. Client uses these to drop
// unknown SVR tags arriving on the SSE stream (defense in depth against drift).
export const KNOWN_DEBUG_TAGS = Object.freeze([
  ...Object.keys(TIER_1_FIELDS),
  ...Object.keys(TIER_2_FIELDS),
]);
