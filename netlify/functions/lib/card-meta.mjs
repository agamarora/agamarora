// card-meta.mjs
//
// Single source of truth for card metadata (slug → title, desc, url, kind).
//
// Why this exists:
// Card metadata used to live in two places — frontend slugToTitle/slugToUrl
// maps in enter/index.html, and the system prompt's CARD RULES section in
// groqHandler.mjs. When the LLM emitted a slug not in either place, frontend
// rendered an ugly fallback ("wiki/agent-first" → "agent first" via split-pop-
// replace). When 17c7801 fixed the SSE wire bug, the empty-desc + ugly-title
// regression hit production immediately and was reverted.
//
// v3.1 fix: server resolves card meta once, emits resolved fields in SSE
// payload, frontend renders verbatim. No client-side slug mapping.
//
// Sources:
//   - WIKI_THEMES: pulled from KG_THEMES_SUMMARY (existing module)
//   - WIKI_BELIEFS: pulled from kg.json belief nodes (Phase 3 — TBD)
//   - LAB_PAGES, EXTERNALS, ACTIONS: hand-curated below
//
// Per docs/plans/enter-v3.1-spec.md §6 decision 2 (card-meta SSOT) +
// §1 B3 (kill the slugToTitle/slugToDesc duplication).

import { KG_THEMES_SUMMARY } from './kg-themes-summary.mjs';
import { getAllBeliefs } from './wiki-retrieval.mjs';
import { BELIEF_NAMESPACE } from './beliefs-enum.mjs';

// ---- WIKI THEME CARDS ------------------------------------------------------
//
// Title shape: action-form ("Read X", "See Y") to match the empty-state
// hand-coded cards and the system prompt's CARD RULES ("action-shaped, NOT
// a label"). Sourced from KG_THEMES_SUMMARY for slug, wiki_url; action title
// + short desc hand-crafted (KG one_line is too long for a card).

const THEME_CARD_OVERRIDES = {
  'agent-first': {
    title: 'Read the agent-first take',
    desc: 'His full thesis on why agents are the new primary user.',
  },
  'voice-ai-craft': {
    title: 'Voice AI as a craft',
    desc: 'What it actually takes to ship voice AI at scale.',
  },
  'spec-first-taste': {
    title: 'Spec-first, taste always',
    desc: 'Context over prompt. Taste over execution. Spec over sprint.',
  },
  'second-brain': {
    title: 'See the second-brain',
    desc: 'The knowledge graph behind these answers.',
  },
  'breadth-as-differentiation': {
    title: 'Breadth as differentiation',
    desc: 'Why breadth + depth beats deep specialism in the AI era.',
  },
  'pm-taste': {
    title: 'What PM taste means',
    desc: '99% should-we, 1% can-we. The craft, not the title.',
  },
  'ai-pm-skillset': {
    title: 'What AI PM requires',
    desc: 'LLMs as the daily tool, taste as the irreducible job.',
  },
  'enterprise-ai-reality': {
    title: 'Why 80% of enterprise AI fails',
    desc: 'Moats are infrastructure, talent, data. Not the model.',
  },
  'career-reflection': {
    title: 'His career, reflected',
    desc: '12 years across 6 companies, 5 industries. Lessons earned.',
  },
  'linkedin-as-instrument': {
    title: 'LinkedIn as instrument',
    desc: 'Posting IS thinking. The platform as a game to play well.',
  },
  'personal-projects-tinkering': {
    title: 'Why he ships side projects',
    desc: 'The prototype is the argument. Build, post, teach, learn.',
  },
  'root.substance-over-hype': {
    title: 'Substance over hype',
    desc: 'Reduce any hyped category to its substrate, then evaluate.',
  },
};

const WIKI_THEMES = Object.fromEntries(
  KG_THEMES_SUMMARY.map((t) => {
    const override = THEME_CARD_OVERRIDES[t.slug] || {};
    return [
      `wiki/${t.slug}`,
      {
        kind: 'page',
        url: t.wiki_url,
        title: override.title || t.title,
        desc: override.desc || t.one_line,
        arrow_label: t.wiki_url,
      },
    ];
  }),
);

// ---- WIKI META PAGES (graph, beliefs, projects, voice, quotes) -------------

const WIKI_META = {
  'wiki/graph': {
    kind: 'page',
    url: '/wiki/graph/',
    title: 'Explore the constellation',
    desc: 'His knowledge atlas as an interactive star map.',
    arrow_label: '/wiki/graph',
  },
  'wiki/beliefs': {
    kind: 'page',
    url: '/wiki/beliefs/',
    title: 'Indexed beliefs',
    desc: '19 Tier-1 positions, each with evidence.',
    arrow_label: '/wiki/beliefs',
  },
  'wiki/projects': {
    kind: 'page',
    url: '/wiki/projects/',
    title: 'Projects DAG',
    desc: 'Project lineage as a directed graph.',
    arrow_label: '/wiki/projects',
  },
  'wiki/voice': {
    kind: 'page',
    url: '/wiki/voice/',
    title: 'How he writes',
    desc: 'Voice rules, made public.',
    arrow_label: '/wiki/voice',
  },
  'wiki/quotes': {
    kind: 'page',
    url: '/wiki/quotes/',
    title: 'Signature lines',
    desc: 'Lines worth keeping.',
    arrow_label: '/wiki/quotes',
  },
  wiki: {
    kind: 'page',
    url: '/wiki/',
    title: 'Browse the wiki',
    desc: '12 themes, 19 beliefs, full atlas.',
    arrow_label: '/wiki',
  },
};

// ---- LAB PAGES -------------------------------------------------------------

const LAB_PAGES = {
  lab: {
    kind: 'page',
    url: '/lab',
    title: 'Browse his lab',
    desc: 'Projects, demos, and case studies.',
    arrow_label: '/lab',
  },
  'lab/second-brain': {
    kind: 'page',
    url: '/lab/second-brain/',
    title: 'second-brain PRFAQ',
    desc: 'Why AI forgets you every session, and what fixes it.',
    arrow_label: '/lab/second-brain',
  },
  'lab/ai-resume': {
    kind: 'page',
    url: '/lab/ai-resume/',
    title: 'AI Resume template',
    desc: 'Open-source resume that AI agents read first.',
    arrow_label: '/lab/ai-resume',
  },
  'lab/voice-ai-production': {
    kind: 'page',
    url: '/lab/voice-ai-production/',
    title: 'Voice AI in production',
    desc: '4 million annual calls at 50% lower cost. What it took.',
    arrow_label: '/lab/voice-ai-production',
  },
  'lab/product-shape': {
    kind: 'page',
    url: '/lab/product-shape/',
    title: 'How he scopes a product',
    desc: 'The shape of work he ships.',
    arrow_label: '/lab/product-shape',
  },
};

// ---- INTERNAL PAGES (resume, home) -----------------------------------------

const INTERNAL_PAGES = {
  resume: {
    kind: 'page',
    url: '/resume',
    title: 'See his background',
    desc: '12 years, 6 companies, 5 industries.',
    arrow_label: '/resume',
  },
  home: {
    kind: 'page',
    url: '/',
    title: 'Back to home',
    desc: 'Landing page.',
    arrow_label: '/',
  },
};

// ---- EXTERNALS (gh, li, yt, calendly) --------------------------------------

const EXTERNALS = {
  github: {
    kind: 'external',
    url: 'https://github.com/agamarora',
    title: 'See his GitHub',
    desc: 'Open-source builds and weekend experiments.',
    arrow_label: 'github.com',
  },
  linkedin: {
    kind: 'external',
    url: 'https://www.linkedin.com/in/agamarora/',
    title: 'Connect on LinkedIn',
    desc: 'Long form of the resume. 11 years of posts.',
    arrow_label: 'linkedin.com',
  },
  youtube: {
    kind: 'external',
    url: 'https://www.youtube.com/@agam_arora',
    title: 'YouTube channel',
    desc: 'Talks, demos, walkthroughs.',
    arrow_label: 'youtube.com',
  },
  calendly: {
    kind: 'external',
    url: 'https://calendly.com/agamarora/chat',
    title: 'Book a 15-min chat',
    desc: 'Fastest path to a real conversation.',
    arrow_label: 'calendly.com',
  },
  'book-call': {
    kind: 'external',
    url: 'https://calendly.com/agamarora/chat',
    title: 'Book a 15-min chat',
    desc: 'Fastest path to a real conversation.',
    arrow_label: 'calendly.com',
  },
  shararat: {
    kind: 'external',
    url: 'https://github.com/agamarora/shararat-ai',
    title: 'Shararat on GitHub',
    desc: 'Voice AI side demo. Source + README.',
    arrow_label: 'github.com',
  },
};

// ---- WIKI BELIEFS (Phase 3 commit 4 — registry built from wiki-extracts) ----
//
// 19 belief pages at /wiki/beliefs/<bare>/. Card data sourced from
// wiki-extracts.json belief entries (built by build-wiki-extracts.mjs walking
// wiki/beliefs/<bare>/index.html). Title + card_desc are pre-computed at
// build time — no runtime overhead.
//
// Per docs/plans/fluffy-tinkering-crane.md commit 4 + autoplan F1 (registry
// lands AFTER padder, so padder defaults stay non-belief).

function buildWikiBeliefsRegistry() {
  const beliefs = getAllBeliefs();
  const out = {};
  for (const [bareSlug, data] of Object.entries(beliefs)) {
    const key = `${BELIEF_NAMESPACE}${bareSlug}`;
    const url = `/wiki/beliefs/${bareSlug}/`;
    out[key] = {
      kind: 'page',
      url,
      title: data.title || bareSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      desc: data.card_desc || data.tldr || '',
      arrow_label: `/wiki/beliefs/${bareSlug}`,
    };
  }
  return out;
}

const WIKI_BELIEFS = buildWikiBeliefsRegistry();

// ---- ACTIONS (download, mailto) --------------------------------------------

const ACTIONS = {
  'resume-pdf': {
    kind: 'external',
    url: '/assets/artefacts/2026_Agam%20Arora.pdf',
    title: 'Download resume PDF',
    desc: 'One-page resume, print-ready.',
    arrow_label: 'pdf',
  },
  email: {
    kind: 'external',
    url: 'mailto:agam.arora@aionos.ai',
    title: 'Email Agam',
    desc: 'agam.arora@aionos.ai',
    arrow_label: 'mailto',
  },
};

// ---- COMBINED REGISTRY -----------------------------------------------------

const CARD_REGISTRY = {
  ...WIKI_THEMES,
  ...WIKI_META,
  ...WIKI_BELIEFS,
  ...LAB_PAGES,
  ...INTERNAL_PAGES,
  ...EXTERNALS,
  ...ACTIONS,
};

// ---- PUBLIC API ------------------------------------------------------------

// Resolve a slug to a complete card object.
// Returns null if slug unknown — caller can decide whether to drop the card
// or render a placeholder. Server-side flow drops unknown slugs (the LLM
// was told the canonical slug list in the system prompt; unknown = drift).
export function resolveCard(slug, opts = {}) {
  if (typeof slug !== 'string' || !slug) return null;
  const normalized = slug.replace(/^\//, '').replace(/\/$/, '');
  const meta = CARD_REGISTRY[normalized];
  if (!meta) return null;
  return {
    slug: normalized,
    kind: meta.kind,
    priority: opts.priority === true,
    title: meta.title,
    desc: meta.desc,
    url: meta.url,
    arrow_label: meta.arrow_label,
  };
}

// Returns true if a slug is known to the registry.
export function isKnownSlug(slug) {
  if (typeof slug !== 'string' || !slug) return false;
  const normalized = slug.replace(/^\//, '').replace(/\/$/, '');
  return Boolean(CARD_REGISTRY[normalized]);
}

// Resolve an LLM-emitted card object {slug, type|kind, priority} into a
// full card with title/desc/url. Drops unknown slugs (returns null).
// type ('page'|'external') from LLM is overridden by registry kind because
// LLM sometimes emits 'page' for external slugs.
export function resolveLLMCard(card) {
  if (!card || typeof card.slug !== 'string') return null;
  return resolveCard(card.slug, { priority: card.priority === true });
}

// Return the full registry. Intended for build scripts and tests; runtime
// code should prefer resolveCard().
export function _getRegistry() {
  return CARD_REGISTRY;
}

// ---- LLM CARD VALIDATION + PADDER -----------------------------------------
//
// Per docs/plans/fluffy-tinkering-crane.md §B + §E + §C (autoplan F1+F2+F4+F5).
//
// Pipeline order (in groqHandler post-LLM):
//   1. validateLLMCards(parsed.cards)  — drop malformed, normalize shape
//   2. resolveLLMCard(...) per entry    — registry resolution
//   3. padCardsToThree(resolved, ctx)   — fill to 3 from intent-family
//                                          OR ship < 3 with pad_miss flag (F5)
//
// HARD RULE (F1): padder family slugs are theme/lab/external ONLY in
// commit 3. Belief slugs (`belief.*`) are added in commit 4 once
// WIKI_BELIEFS registry lands. Mixing family belief refs before the
// registry exists would silently drop them via resolveCard → null and
// break the always-3 promise this padder exists to enforce.

// Validate raw LLM card array. Drops:
//  - non-objects
//  - entries without string `slug`
//  - entries with unknown slug (resolveCard returns null)
// Normalizes shape: returns { slug, priority, type } objects safe to feed
// resolveLLMCard. type stays advisory; registry kind always wins downstream.
export function validateLLMCards(rawCards) {
  if (!Array.isArray(rawCards)) return { valid: [], dropped: 0 };
  const valid = [];
  let dropped = 0;
  for (const c of rawCards) {
    if (!c || typeof c !== 'object' || typeof c.slug !== 'string' || !c.slug) {
      dropped++;
      continue;
    }
    if (!isKnownSlug(c.slug)) {
      dropped++;
      continue;
    }
    valid.push({
      slug: c.slug.replace(/^\//, '').replace(/\/$/, ''),
      priority: c.priority === true,
      type: typeof c.type === 'string' ? c.type : (typeof c.kind === 'string' ? c.kind : 'page'),
    });
  }
  return { valid, dropped };
}

// Intent-keyed card families. NO belief slugs in commit 3 (F1 enforced).
// First entry of each family is the priority candidate when padder fills
// from zero. Order matters: padder tries entries in sequence, skipping
// already-emitted slugs.
const FAMILIES = {
  contact:  ['book-call', 'linkedin', 'github'],
  headline: ['wiki/agent-first', 'wiki/graph', 'lab'],
  hiring:   ['linkedin', 'resume', 'github'],
  projects: ['lab', 'github', 'lab/voice-ai-production'],
  voice:    ['lab/voice-ai-production', 'lab', 'resume'],
  agent:    ['wiki/graph', 'wiki/agent-first', 'lab'],
  default:  ['resume', 'lab', 'wiki/graph'],
};

// Pick padder family from routing context. themes_likely[] markers win
// (contact, headline). Otherwise query keywords decide. Returns
// { name, slugs }.
export function pickPadFamily(ctx) {
  const themes = Array.isArray(ctx?.themes) ? ctx.themes : [];
  if (themes.includes('contact'))  return { name: 'contact',  slugs: FAMILIES.contact };
  if (themes.includes('headline')) return { name: 'headline', slugs: FAMILIES.headline };

  const q = String(ctx?.query || '').toLowerCase();
  if (/\b(hire|hiring|recruit|recruiter|available|availability|opportunit|interview|job|role|position|fit\b)/.test(q))
    return { name: 'hiring', slugs: FAMILIES.hiring };
  if (/\b(github|repo|open[\s\-]?source|portfolio)\b|\bprojects?\b|what.{0,12}(he|hes|has).{0,12}(built|shipped|made)/.test(q))
    return { name: 'projects', slugs: FAMILIES.projects };
  if (/\b(voice|speech|conversational\s*ai|4m\s+calls|million\s+calls)\b/.test(q))
    return { name: 'voice', slugs: FAMILIES.voice };
  if (/\b(agent|agentic|thesis|thinking|opinion|believe|believes|belief|beliefs|philosophy|stance|position|wiki|graph|knowledge\s+(graph|atlas)|constellation|second[\s\-]?brain|atlas)\b/.test(q))
    return { name: 'agent', slugs: FAMILIES.agent };
  return { name: 'default', slugs: FAMILIES.default };
}

// Pad an array of resolved cards up to 3, filling from the matched intent
// family. Greetings + deflect intents return cards as-is.
//
// F5 escape hatch: if the family cannot supply enough valid fillers (every
// remaining slug already in cards OR fails to resolve), ship < 3 cards and
// flag pad_miss. NEVER fall back to the default family from a specific
// family (irrelevant fillers dilute hiring-signal cards).
//
// Priority handling: at most ONE card is priority. If LLM emitted a
// priority card, padder fillers stay non-priority. If LLM emitted no
// priority, the FIRST padded card claims priority.
//
// ctx: { intent: 'synthesis'|'lookup'|'deflect'|'greeting'|'lookup-greeting',
//        themes: string[],
//        query: string }
//
// Returns: { cards: resolvedCard[], padMiss: bool, family: string|null,
//            added: string[]  /* slugs added by padder */ }
export function padCardsToThree(resolvedCards, ctx) {
  const intent = ctx?.intent;
  const baseCards = Array.isArray(resolvedCards) ? resolvedCards : [];

  // Already at or above cap — never exceed 3.
  if (baseCards.length >= 3) {
    return { cards: baseCards.slice(0, 3), padMiss: false, family: null, added: [] };
  }

  // Greetings + deflect with ZERO emitted cards: stay terse, no card row.
  // Pure conversational replies should not auto-grow into a menu. Only pad
  // when the LLM (or a deterministic stream) has already seeded at least
  // one card — that signals "this answer is card-worthy" and the user
  // expects a complete row, so fill to 3 for visual consistency with
  // synthesis + lookup rows.
  //
  // This trades the original voice-spec §11 "warm not menu" terse stance
  // for visual consistency: prior CSS bleed math produced a 32px LEFT-edge
  // drift between 2-card and 3-card rows in mixed-intent conversations.
  // Always-3 (when seeded) hides the drift. Per user direction 2026-05-03.
  if (baseCards.length === 0 && intent !== 'synthesis' && intent !== 'lookup') {
    return { cards: [], padMiss: false, family: null, added: [] };
  }

  const family = pickPadFamily(ctx);
  const seen = new Set(baseCards.map((c) => c?.slug).filter(Boolean));
  const hasLLMPriority = baseCards.some((c) => c?.priority === true);
  let priorityAssigned = hasLLMPriority;
  const out = [...baseCards];
  const added = [];

  // Retrieval-aware fillers: when retrieval ran (themes or beliefs pulled
  // server-side), prefer those slugs as fillers BEFORE generic family slugs.
  // Without this, a belief query that the LLM answers without emitting a
  // belief card falls to the family default (resume/lab/wiki-graph) — cards
  // lose all relevance to what the user actually asked. Per smoke check
  // 2026-05-03: "what does context over prompt mean to him" retrieved
  // wiki/spec-first-taste but cards were resume + lab + wiki/graph.
  const retrievedFillers = (Array.isArray(ctx?.retrievedSlugs) ? ctx.retrievedSlugs : [])
    .filter((s) => typeof s === 'string' && isKnownSlug(s));

  const fillerSequence = [...retrievedFillers, ...family.slugs];

  for (const slug of fillerSequence) {
    if (out.length >= 3) break;
    if (seen.has(slug)) continue;
    const card = resolveCard(slug, { priority: !priorityAssigned });
    if (!card) continue; // unknown — skip per F1 belief-slug guard
    out.push(card);
    added.push(slug);
    seen.add(slug);
    if (card.priority) priorityAssigned = true;
  }

  return {
    cards: out.slice(0, 3),
    padMiss: out.length < 3,
    family: family.name,
    added,
  };
}

// Test surface
export const __test = { FAMILIES };
