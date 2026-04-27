// constants.mjs
//
// Shared numeric constants for /enter v3 plumbing.
// Per docs/plans/phase-d-decisions-2026-04-27.md Decisions 4, 6, 9, 10.

// Classifier
export const CLASSIFIER_TIMEOUT_MS = 800;
export const CLASSIFIER_MODEL = 'llama-3.1-8b-instant';

// Rate limit (Tier 1 — D-5 will consume)
export const RATE_LIMIT_PER_HOUR = 60;
export const BURST_LIMIT = 5;
export const BURST_WINDOW_MS = 10_000;

// Stream
export const BUFFER_FIRST_CHARS = 50;

// LLM caps
export const MAX_INPUT_LENGTH = 500;          // raised from v2 200; spec §7 input val
export const MAX_COMPLETION_TOKENS = 320;     // headroom for trace+answer+cards JSON in D-4
export const MAX_HISTORY_TURNS = 6;
export const MAX_HISTORY_CHARS = 4000;        // hard cap on conversation history total chars

// Cool-down (defaults if Retry-After absent)
export const COOLDOWN_DEFAULT_MS = 60_000;
export const COOLDOWN_MIN_MS = 60_000;

// Provider pools
export const GROQ_KEY_ENV = ['GROQ_API_KEY', 'GROQ_API_KEY_2', 'GROQ_API_KEY_3'];
export const MISTRAL_KEY_ENV = ['MISTRAL_API_KEY', 'MISTRAL_API_KEY_2'];

// Groq fallback chain for synthesis
export const GROQ_SYNTH_MODELS = [
  'llama-3.1-8b-instant',
  'qwen/qwen3-32b',
  'openai/gpt-oss-20b',
  'llama-3.3-70b-versatile',
];

// Mistral pinned model (synthesis)
export const MISTRAL_SYNTH_MODEL = 'mistral-small-latest';

// Allowed origins
export const ALLOWED_ORIGINS = new Set([
  'https://agamarora.com',
  'https://www.agamarora.com',
]);

// Bot UA allowlist (D-5 will gate; documented here)
export const BOT_UA_PATTERNS = [
  /GPTBot/i,
  /ClaudeBot/i,
  /PerplexityBot/i,
  /anthropic-ai/i,
  /Applebot-Extended/i,
  /Google-Extended/i,
  /Bytespider/i,
  /meta-externalagent/i,
  /Amazonbot/i,
  /Diffbot/i,
  /cohere-ai/i,
];
