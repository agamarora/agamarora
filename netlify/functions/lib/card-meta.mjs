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
