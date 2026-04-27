// classifier.mjs
//
// Two-stage routing for /enter v3:
//
//   1. preRoute(message)   — heuristic skip-classifier on obvious patterns
//   2. classify(message)   — LLM classifier on Groq pinned model
//
// preRoute returns a result object on match, null otherwise.
// classify always returns an object (graceful default on failure).
//
// Shape:
//   { type: 'lookup' | 'synthesis' | 'deflect',
//     confidence: 0..1,
//     themes_likely: string[],   // validated against THEME_SLUGS_SET
//     route_reason: string }
//
// Per phase-d-decisions-2026-04-27.md Decisions 4 + 5.

import { invokeClassifier } from './llm-pool.mjs';
import { THEME_SLUGS, filterValidSlugs } from './themes-enum.mjs';

// ---- preRoute ------------------------------------------------------------

const GREETING_RE = /^(hi|hey|hello|sup|yo|test|hola|namaste|good (morning|afternoon|evening))[\s!.?]*$/i;
const DEFLECT_RES = [
  /your\s+(family|wife|girlfriend|kids|children|parents)/i,
  /(political|politics|religion|religious|caste)/i,
  /where\s+do\s+you\s+live/i,
  /home\s+address/i,
  /salary\s+(of|details)/i,
];

// Direct theme keyword → synthesis with extracted slug.
// Matched against `message`; first hit wins.
const KEYWORD_TO_SLUG = [
  [/agent[\s\-]?first|serving\s+lens|agents?\s+(are|as)\s+users?/i, 'agent-first'],
  [/voice\s*ai|voice\s+platform|stt|tts/i, 'voice-ai-craft'],
  [/spec[\s\-]?first|context\s+over\s+prompt|taste\s+over\s+execution/i, 'spec-first-taste'],
  [/second[\s\-]?brain|knowledge\s+graph|context\s+layer/i, 'second-brain'],
  [/breadth[\s\-]?as[\s\-]?differentiation|breadth\s+vs\s+depth|t[\s\-]?shaped/i, 'breadth-as-differentiation'],
  [/pm\s+taste|product\s+taste|featherless\s+hat|99%\s+should/i, 'pm-taste'],
  [/ai\s+pm|llm\s+as\s+(daily|primary)\s+tool|ai[\s\-]?fluency/i, 'ai-pm-skillset'],
  [/enterprise\s+ai|80%\s+(don'?t|do\s+not)\s+(reach|ship)|moats?\s+are/i, 'enterprise-ai-reality'],
  [/career\s+(reflection|path)|ic\s+path|individual\s+contributor/i, 'career-reflection'],
  [/linkedin\s+(as|is)\s+(instrument|platform|game)|posting\s+is\s+thinking/i, 'linkedin-as-instrument'],
  [/personal\s+projects?|tinkering|ship\s+the\s+prototype/i, 'personal-projects-tinkering'],
  [/substance\s+over\s+hype|root\s+disposition/i, 'root.substance-over-hype'],
];

export function preRoute(message) {
  if (typeof message !== 'string') return null;
  const trimmed = message.trim();

  if (!trimmed || GREETING_RE.test(trimmed) || trimmed.split(/\s+/).length <= 3) {
    return {
      type: 'lookup',
      confidence: 1,
      themes_likely: [],
      route_reason: 'preroute_greeting_or_short',
    };
  }

  for (const re of DEFLECT_RES) {
    if (re.test(trimmed)) {
      return {
        type: 'deflect',
        confidence: 1,
        themes_likely: [],
        route_reason: 'preroute_deflect_pattern',
      };
    }
  }

  for (const [re, slug] of KEYWORD_TO_SLUG) {
    if (re.test(trimmed)) {
      return {
        type: 'synthesis',
        confidence: 0.85,
        themes_likely: [slug],
        route_reason: 'preroute_keyword_match',
      };
    }
  }

  return null;
}

// ---- LLM classifier -------------------------------------------------------

const CLASSIFIER_SYSTEM = `You classify a user query against a fixed set of routing options. Return JSON only.

Routing options:
  type: "lookup"     — bio/role/credentials/dates/numbers/single facts
  type: "synthesis"  — opinion, belief, theme, multi-source synthesis
  type: "deflect"    — personal life, politics, religion, off-topic

themes_likely[] — zero or more slugs from this closed set (drop slugs not in set):
${THEME_SLUGS.map(s => `  - ${s}`).join('\n')}

Output exactly: {"type": "...", "confidence": 0..1, "themes_likely": ["..."]}
Do not include any other keys, prose, or markdown. Return JSON only.`;

export async function classify(message) {
  const messages = [
    { role: 'system', content: CLASSIFIER_SYSTEM },
    { role: 'user', content: String(message).slice(0, 500) },
  ];
  const result = await invokeClassifier({ messages });
  if (!result || !result.text) {
    return {
      type: 'lookup',
      confidence: 0,
      themes_likely: [],
      route_reason: 'classifier_unavailable',
    };
  }
  let parsed;
  try {
    parsed = JSON.parse(result.text);
  } catch {
    return {
      type: 'lookup',
      confidence: 0,
      themes_likely: [],
      route_reason: 'classifier_invalid_json',
    };
  }
  const rawType = parsed?.type;
  const validType = (rawType === 'lookup' || rawType === 'synthesis' || rawType === 'deflect') ? rawType : 'lookup';
  const { valid, dropped } = filterValidSlugs(parsed?.themes_likely);
  if (dropped.length) {
    console.warn('[classifier] classifier_invalid_slug', { dropped, kept: valid });
  }
  let finalType = validType;
  if (validType === 'synthesis' && valid.length === 0) {
    // Down-grade to lookup if synthesis intended but no valid slugs survived.
    finalType = 'lookup';
  }
  return {
    type: finalType,
    confidence: typeof parsed?.confidence === 'number' ? parsed.confidence : 0.5,
    themes_likely: valid,
    route_reason: 'classifier_llm',
    providerKeyId: result.providerKeyId,
  };
}

// Combined: preRoute then classify. Caller passes the user message.
export async function route(message) {
  const pre = preRoute(message);
  if (pre) return pre;
  return classify(message);
}

export const __test = { GREETING_RE, KEYWORD_TO_SLUG, CLASSIFIER_SYSTEM };
