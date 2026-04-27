// voice-rules.mjs
//
// Single source of truth for banned terms and voice rules.
// Imported by:
//   - groqHandler.mjs (system prompt v3 construction)
//   - eval-prompt.mjs (auto-grep banned terms in rendered output)
//   - classifier.mjs (injection patterns extension)
//
// Source: docs/plans/second-brain-v1-phase-a/synthesis/voice-spec.md §2 + §11
// Per phase-d-decisions-2026-04-27.md CQ-1 (centralize banned terms, DRY).

// Words banned from agent user-facing answers.
// Keep in lowercase for case-insensitive matching.
export const BANNED_USER_FACING_TERMS = [
  // v2 original list (preserved)
  'leveraging',
  'innovative',
  'passionate',
  'driven',
  'synergy',
  'cutting-edge',
  'robust',
  'empower',
  'unlock',
  'delve',
  'comprehensive',
  'game-changer',
  'dynamic',
  'proven track record',
  'exceptional',
  'significant impact',
  // voice-spec §2 additions
  'deeply',
  'robustly',
  'seamlessly',
  'groundbreaking',
  'transformative',
  'navigate',       // as metaphor for "dealing with something"
];

// Banned self-referential LLM phrases (agent persona rules).
// These indicate the agent is breaking persona.
export const BANNED_LLM_ISMS = [
  "as an ai",
  "i'm a language model",
  "i am a language model",
  "i'm an ai",
  "i am an ai",
  "my memory banks",
  "my training data",
  "as a large language model",
  "i don't have personal",
  "i cannot have opinions",
];

// Banned opener phrases (first-sentence checks).
// From voice-spec §2 Rule 4 + §1 Register 1 opener bans.
export const BANNED_OPENERS = [
  "in today's fast-paced world",
  "i'm excited to announce",
  "hot take:",
  "unpopular opinion:",
  "three things",
  "quick read:",
  "pro tip:",
  "let me tell you",
  "today i want to",
  "today, i want to",
  "in today's",
];

// Banned verbs from trace language (must not appear in trace lines).
// Per enter-v3.md §5.
export const BANNED_TRACE_VERBS = [
  'thinking',
  'considering',
  'analyzing',
  'reasoning',
  'pondering',
];

// Helper: check if text contains any banned user-facing term.
// Returns array of matched terms (empty = clean).
export function containsBannedTerm(text) {
  if (typeof text !== 'string') return [];
  const lower = text.toLowerCase();
  const found = [];
  for (const term of BANNED_USER_FACING_TERMS) {
    if (lower.includes(term)) found.push(term);
  }
  for (const phrase of BANNED_LLM_ISMS) {
    if (lower.includes(phrase)) found.push(phrase);
  }
  return found;
}

// Helper: check if text opens with a banned opener.
// Returns matched opener string or null.
export function startsWithBannedOpener(text) {
  if (typeof text !== 'string') return null;
  const lower = text.toLowerCase().trim();
  for (const opener of BANNED_OPENERS) {
    if (lower.startsWith(opener)) return opener;
  }
  return null;
}
