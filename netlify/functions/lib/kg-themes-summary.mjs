// kg-themes-summary.mjs
//
// In-function bundled KG index for /enter v3 retriever.
// Imported synchronously at cold-start by groqHandler.mjs.
// Avoids runtime fetch — no SPOF.
//
// Source: docs/plans/second-brain-v1-phase-a/synthesis/ontology-v1.md (locked 2026-04-26).
// Build path: scripts/build-kg.mjs reads ontology-v1.md → emits this file (Phase B).
// At v0 (manual seed before build script): hand-written below from ontology-v1.md.
//
// Schema:
//   KG_THEMES_SUMMARY[]: { slug, title, wiki_url, tier, one_line, node_count, edge_count, primary_beliefs[] }
//   KG_VERSION: string
//   KG_GENERATED_AT: ISO date

export const KG_VERSION = "1.0";
export const KG_GENERATED_AT = "2026-04-26";
export const KG_SOURCE = "ontology-v1.md (locked 2026-04-26)";

export const KG_THEMES_SUMMARY = [
  {
    slug: "root.substance-over-hype",
    title: "Substance over hype - the root disposition",
    wiki_url: "/wiki/root.substance-over-hype/",
    tier: "root",
    one_line: "Reduce any hyped category to its substrate, then evaluate. 8-year through-line from blockchain to anti-customization.",
    primary_beliefs: ["substance-over-hype", "ico-is-funding-not-product"],
    node_count: 2,
    edge_count: 8,
    canonical_dates: ["2018-03-06", "2025-12-04"]
  },
  {
    slug: "agent-first",
    title: "Agent-first thesis",
    wiki_url: "/wiki/agent-first/",
    tier: "theme",
    one_line: "Platforms that cannot talk to autonomous agents are already behind. The prompting skill layer migrated; the verdict held.",
    primary_beliefs: ["agent-first", "context-over-prompt", "prompts-as-engineering-primitive", "kill-prompting", "reversibility-over-consequences", "application-layer-is-where-safety-lives", "agent-layer-is-threat-surface"],
    node_count: 7,
    edge_count: 22,
    canonical_dates: ["2023-03-24", "2024-12-24", "2025-07-17", "2026-01-06", "2026-04-09", "2026-04-23"]
  },
  {
    slug: "voice-ai-craft",
    title: "Voice AI craft - cost, latency, scale",
    wiki_url: "/wiki/voice-ai-craft/",
    tier: "theme",
    one_line: "Voice AI is a distinct engineering discipline with its own constraints. Under-share on LinkedIn is deliberate; case study is on agamarora.com /lab.",
    primary_beliefs: ["voice-as-enterprise-wedge", "enterprise-ai-production-reality"],
    node_count: 2,
    edge_count: 6,
    canonical_dates: ["2025-09-29"]
  },
  {
    slug: "breadth-as-differentiation",
    title: "Breadth as differentiation",
    wiki_url: "/wiki/breadth-as-differentiation/",
    tier: "theme",
    one_line: "Breadth differentiates. Depth makes it matter. Humanness-as-depth (EQ, taste, judgment) is the AI-era axis.",
    primary_beliefs: ["breadth-as-differentiation", "breadth-needs-depth"],
    node_count: 2,
    edge_count: 7,
    canonical_dates: ["2024-04-12"]
  },
  {
    slug: "pm-taste",
    title: "PM taste - craft, metaphors, what a PM actually does",
    wiki_url: "/wiki/pm-taste/",
    tier: "theme",
    one_line: "PM is taste of what to build, what experience, what value. 99% should-we, 1% can-we. Strong opinion about not having strong opinions licenses everything else.",
    primary_beliefs: ["pm-is-99-should-we-1-can-we", "pm-is-featherless-hat", "pm-as-parenting", "anti-customization", "data-literacy-is-pm-core", "build-measure-learn", "idea-validation-3-pillars", "non-functional-reqs-are-dominant-failure-mode", "design-thinking-as-speed-tool", "strong-opinion-about-no-strong-opinions"],
    node_count: 10,
    edge_count: 28,
    canonical_dates: ["2021-07-12", "2021-09-22", "2021-12-12", "2022-06-03", "2025-12-04"]
  },
  {
    slug: "ai-pm-skillset",
    title: "What AI PM actually requires",
    wiki_url: "/wiki/ai-pm-skillset/",
    tier: "theme",
    one_line: "LLMs are the primary daily tool. AI replaces the grunt - thinking, writing, coding, PRDs. Taste of what to build is the irreducible PM job.",
    primary_beliefs: ["ai-pm-skillset-table-stakes", "ai-fluency-required", "learn-concepts-not-tools", "llm-as-primary-daily-tool", "its-not-the-model-its-the-problem", "tech-as-enabler", "design-thinking-as-speed-tool"],
    node_count: 7,
    edge_count: 18,
    canonical_dates: ["2023-03-14", "2023-03-19", "2021-07-14"]
  },
  {
    slug: "enterprise-ai-reality",
    title: "Enterprise AI reality - ships vs demos",
    wiki_url: "/wiki/enterprise-ai-reality/",
    tier: "theme",
    one_line: "Roughly 80% of enterprise AI experiments don't reach production. Moats are infrastructure, talent, data: model is not on the list.",
    primary_beliefs: ["enterprise-ai-production-reality", "moats-are-infra-talent-data", "data-readiness-is-pipeline-not-corpus", "mcp-as-enterprise-primitive"],
    node_count: 4,
    edge_count: 12,
    canonical_dates: ["2024-09-04", "2024-12-04", "2024-06-07"]
  },
  {
    slug: "second-brain",
    title: "Second brain - structured knowledge for agents",
    wiki_url: "/wiki/second-brain/",
    tier: "theme",
    one_line: "Built for me, hobbyist scope, Karpathy-inspired. Personal context layer for AI sessions. Pattern probably generalizes for builders.",
    primary_beliefs: ["second-brain-is-context-layer", "self-instrumentation", "quantified-self-as-mindfulness", "llm-as-primary-daily-tool", "personal-website-is-present-tense"],
    node_count: 5,
    edge_count: 14,
    canonical_dates: ["2018-05-28", "2020-02-20", "2023-04-16", "2026-04-23"]
  },
  {
    slug: "spec-first-taste",
    title: "Spec first, taste always - the builder trilogy",
    wiki_url: "/wiki/spec-first-taste/",
    tier: "theme",
    one_line: "Spec > Sprint. Taste > Execution. Context > Prompt. Lived since 2021, named April 2026. Same disposition, sharper words.",
    primary_beliefs: ["spec-over-sprint", "taste-over-execution", "context-over-prompt", "anti-customization"],
    node_count: 4,
    edge_count: 11,
    canonical_dates: ["2026-04-09"]
  },
  {
    slug: "career-reflection",
    title: "Career reflection - IC path, learning, market lift",
    wiki_url: "/wiki/career-reflection/",
    tier: "theme",
    one_line: "IC path is legitimate; AI-era amplifies IC leverage. Help the market flourish (this repo open-source is the proof). Learn concepts not tools.",
    primary_beliefs: ["help-market-flourish", "ic-path-legitimacy", "learn-concepts-not-tools", "certifications-are-collectibles", "muscle-memory-over-novelty", "two-roles-ahead-framing", "never-be-smartest-in-room", "lead-yourself-first"],
    node_count: 8,
    edge_count: 21,
    canonical_dates: ["2017-09-14", "2019-07-11", "2019-12-04", "2021-10-30", "2024-11-15", "2025-12-26", "2026-04-26"]
  },
  {
    slug: "linkedin-as-instrument",
    title: "LinkedIn as instrument - the meta-platform game",
    wiki_url: "/wiki/linkedin-as-instrument/",
    tier: "theme",
    one_line: "Platform to be gamed productively. Posting IS the thinking. Loop closes when others learn (build → post → teach → learn → build).",
    primary_beliefs: ["linkedin-as-instrumental-platform", "strong-opinion-about-no-strong-opinions"],
    node_count: 2,
    edge_count: 10,
    canonical_dates: ["2017-01-20", "2024-07-04"]
  },
  {
    slug: "personal-projects-tinkering",
    title: "Personal projects - ship it or it doesn't exist",
    wiki_url: "/wiki/personal-projects-tinkering/",
    tier: "theme",
    one_line: "Five top-tier open-source projects. Ideas are cheap; the prototype is the argument. Loop: build, post, teach, learn, build.",
    primary_beliefs: ["ship-the-prototype", "personal-website-is-present-tense", "gaming-as-economic-intuition"],
    node_count: 3,
    edge_count: 9,
    canonical_dates: ["2020-05-19", "2023-04-16"]
  }
];

// Top-level summary stats
export const KG_STATS = {
  themes: 12,
  root_themes: 1,
  total_themes_with_root: 13,
  tier_1_beliefs: 19,
  tier_2_beliefs: 25,
  tier_3_peripheral: 6,
  total_belief_nodes: 57,
  projects: 52,
  people: 54,
  tech: 58,
  edges_total: 180
};

// Default routing — intent → priority slug + supporting slugs.
// Mirrors site.json default_intent_routing for /enter v3 cards.
export const KG_DEFAULT_ROUTING = {
  voice_ai: { priority: "lab-voice-ai-production", supporting: ["resume-avp", "shararat-code", "wiki:voice-ai-craft"] },
  side_projects: { priority: "lab", supporting: ["lab-second-brain", "wiki:personal-projects-tinkering", "github"] },
  hiring: { priority: "book-call", supporting: ["linkedin", "email", "resume-pdf"] },
  credentials: { priority: "resume", supporting: ["resume-pdf", "linkedin", "wiki:career-reflection"] },
  code: { priority: "github", supporting: ["lab", "wiki:personal-projects-tinkering"] },
  product_thinking: { priority: "wiki:pm-taste", supporting: ["resume-avp", "wiki:spec-first-taste", "lab-second-brain"] },
  ai_capability: { priority: "wiki:ai-pm-skillset", supporting: ["lab", "wiki:breadth-as-differentiation", "github"] },
  philosophy: { priority: "wiki:agent-first", supporting: ["wiki:root.substance-over-hype", "writing-second-brain-live"] },
  specific_role: { priority: "resume", supporting: ["resume-avp", "resume-fareye", "wiki:career-reflection"] },
  default_greeting: { priority: "lab", supporting: ["resume", "book-call"] }
};

// Theme-by-tension cross-link map (from R7 §7).
// Used by retriever to surface related themes alongside primary match.
export const KG_TENSION_MAP = {
  "agent-first": { primary: "enterprise-ai-reality", secondary: "spec-first-taste", category: "genuine-contradiction-resolved + context-not-contradiction" },
  "voice-ai-craft": { primary: "linkedin-as-instrument", secondary: "enterprise-ai-reality", category: "productive-paradox" },
  "breadth-as-differentiation": { primary: "career-reflection", secondary: "ai-pm-skillset", category: "context-not-contradiction" },
  "pm-taste": { primary: "spec-first-taste", secondary: "linkedin-as-instrument", category: "context-not-contradiction + productive-paradox" },
  "ai-pm-skillset": { primary: "agent-first", secondary: "second-brain", category: "genuine-contradiction-partly-unresolved + context-not-contradiction" },
  "enterprise-ai-reality": { primary: "agent-first", secondary: "voice-ai-craft", category: "genuine-contradiction-resolved" },
  "second-brain": { primary: "ai-pm-skillset", secondary: "spec-first-taste", category: "context-not-contradiction" },
  "spec-first-taste": { primary: "personal-projects-tinkering", secondary: "pm-taste", category: "genuine-contradiction-resolved-as-evolution + context-not-contradiction" },
  "career-reflection": { primary: "ai-pm-skillset", secondary: "breadth-as-differentiation", category: "context-not-contradiction" },
  "linkedin-as-instrument": { primary: "pm-taste", secondary: "voice-ai-craft", category: "productive-paradox" },
  "personal-projects-tinkering": { primary: "spec-first-taste", secondary: "linkedin-as-instrument", category: "genuine-contradiction-resolved-as-evolution" },
  "root.substance-over-hype": { primary: null, secondary: null, category: "root-frame-no-tension" }
};

// Helper: resolve a theme slug to its full summary entry
export function getThemeBySlug(slug) {
  return KG_THEMES_SUMMARY.find(t => t.slug === slug) || null;
}

// Helper: resolve theme list from classifier themes_likely[] output
export function resolveThemes(themesLikely) {
  if (!Array.isArray(themesLikely)) return [];
  return themesLikely
    .map(slug => getThemeBySlug(slug))
    .filter(Boolean);
}

// Helper: get tension cross-links for a theme (for retriever to add supporting context)
export function getTensionLinks(slug) {
  const entry = KG_TENSION_MAP[slug];
  if (!entry) return [];
  const links = [];
  if (entry.primary) links.push({ slug: entry.primary, role: "primary-tension", category: entry.category });
  if (entry.secondary) links.push({ slug: entry.secondary, role: "secondary-tension", category: entry.category });
  return links;
}
