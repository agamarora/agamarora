#!/usr/bin/env node
// build-kg.mjs
//
// Parses docs/plans/second-brain-v1-phase-a/synthesis/ontology-v1.md
// and emits wiki/kg.json (full graph, public static asset).
//
// Source of truth: ontology-v1.md (locked 2026-04-26). Any change to nodes
// or edges happens there first, then this script regenerates kg.json.
//
// Run: node scripts/build-kg.mjs
//
// kg-themes-summary.mjs (in-function bundle for /enter v3) stays hand-authored
// at netlify/functions/lib/kg-themes-summary.mjs for now. Phase D may add
// regeneration here once the wire-up settles.

import { readFileSync, writeFileSync, renameSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ONTOLOGY = join(ROOT, "docs/plans/second-brain-v1-phase-a/synthesis/ontology-v1.md");
const OUT = join(ROOT, "wiki/kg.json");

// Update when ontology is re-locked. Stamped into kg.json `source` field.
const ONTOLOGY_LOCK_DATE = "2026-04-26";

let src;
try {
  src = readFileSync(ONTOLOGY, "utf8");
} catch (err) {
  console.error(`[build-kg] FATAL: cannot read ontology at ${ONTOLOGY}`);
  console.error(`[build-kg]   ${err.code || ""} ${err.message}`);
  console.error(
    `[build-kg]   Phase A synthesis may be missing on this clone. Re-pull the repo or restore from origin/main.`
  );
  process.exit(1);
}

// Helpers
const splitRow = (line) =>
  line
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

const stripBackticks = (s) => s.replace(/`/g, "").trim();
// Clean a slug cell: drop parenthetical notes + take leading token
const cleanSlug = (s) =>
  stripBackticks(s).split(/\s|\(/)[0].trim();

// Pull markdown table rows under a section heading
function tableUnder(headingRegex, src) {
  const lines = src.split("\n");
  const startIdx = lines.findIndex((l) => headingRegex.test(l));
  if (startIdx === -1) return [];
  const rows = [];
  let inTable = false;
  let headers = null;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^#{2,4}\s/.test(l)) break; // next section
    if (/^\|/.test(l)) {
      const cells = splitRow(l);
      if (!inTable) {
        headers = cells.map((h) => h.toLowerCase());
        inTable = true;
        continue;
      }
      if (cells.every((c) => /^-+$/.test(c) || c === "")) continue; // separator
      const obj = {};
      headers.forEach((h, idx) => (obj[h] = cells[idx] ?? ""));
      rows.push(obj);
    } else if (inTable && l.trim() === "") {
      // table ended on blank line; keep scanning for another table in this section
      inTable = false;
      headers = null;
    }
  }
  return rows;
}

// All tables under a heading (handles sections with multiple sub-tables).
// Only breaks on next level-2 heading so ### subsections stay in scope.
function allTablesUnder(headingRegex, src) {
  const lines = src.split("\n");
  const startIdx = lines.findIndex((l) => headingRegex.test(l));
  if (startIdx === -1) return [];
  const tables = [];
  let cur = null;
  let headers = null;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^##\s/.test(l)) break; // next top-level section
    if (/^\|/.test(l)) {
      const cells = splitRow(l);
      if (!cur) {
        headers = cells.map((h) => h.toLowerCase());
        cur = [];
        continue;
      }
      if (cells.every((c) => /^-+$/.test(c) || c === "")) continue;
      const obj = {};
      headers.forEach((h, idx) => (obj[h] = cells[idx] ?? ""));
      cur.push(obj);
    } else if (cur && l.trim() === "" && cur.length > 0) {
      tables.push(cur);
      cur = null;
      headers = null;
    }
  }
  if (cur && cur.length) tables.push(cur);
  return tables;
}

// ---------------------------------------------------------------------------
// 1. Themes (12 + 1 root)
// ---------------------------------------------------------------------------
const themeRows = tableUnder(/^## Themes/i, src);
const themes = themeRows.map((r) => ({
  type: "Theme",
  id: `theme.${stripBackticks(r.slug)}`,
  slug: stripBackticks(r.slug),
  label: r.title,
  tier: r.tier?.replace(/\*\*/g, "").trim() || "theme",
  one_line: r["core belief (1 line)"] || "",
  length_target: r["length target"] || "",
  voice_register: r["voice register"] || "",
  wiki_url: `/wiki/${stripBackticks(r.slug)}/`,
}));

// ---------------------------------------------------------------------------
// 2. Beliefs (Tier 1 + Tier 2 + Tier 3)
// ---------------------------------------------------------------------------
const t1Rows = tableUnder(/^### Tier 1/i, src);
const t2Rows = tableUnder(/^### Tier 2/i, src);
const t3Rows = tableUnder(/^### Tier 3/i, src);

const beliefs = [];
const seenBeliefIds = new Set();

const addBelief = (r, tier) => {
  const id = stripBackticks(r.slug);
  if (!id || seenBeliefIds.has(id)) return;
  seenBeliefIds.add(id);
  beliefs.push({
    type: "Belief",
    id,
    label: r.statement || r.disposition || "",
    tier,
    parent_theme: r["parent theme"]
      ? `theme.${r["parent theme"].split(/[+,]/)[0].trim().replace(/\s.*/, "")}`
      : null,
    status: r.status || "",
    evidence: r.evidence || "",
  });
};
t1Rows.forEach((r) => addBelief(r, "1"));
t2Rows.forEach((r) => addBelief(r, "2"));
t3Rows.forEach((r) => addBelief(r, "3"));

// Dropped beliefs (kept as historical / retired ids)
const droppedRows = tableUnder(/^### Beliefs DROPPED/i, src);
droppedRows.forEach((r) => {
  const id = stripBackticks(r.slug);
  if (!id || seenBeliefIds.has(id)) return;
  seenBeliefIds.add(id);
  beliefs.push({
    type: "Belief",
    id,
    label: r.reason || "(dropped)",
    tier: "dropped",
    status: "retired",
  });
});

// Superseded beliefs
const supersededRows = tableUnder(/^### Superseded beliefs/i, src);
supersededRows.forEach((r) => {
  const id = cleanSlug(r.slug);
  if (!id || seenBeliefIds.has(id)) return;
  seenBeliefIds.add(id);
  beliefs.push({
    type: "Belief",
    id,
    label: "(superseded)",
    tier: "superseded",
    status: "historical",
  });
});

// ---------------------------------------------------------------------------
// 3. Projects (multiple tables under ## Projects)
// ---------------------------------------------------------------------------
const projectTables = allTablesUnder(/^## Projects/i, src);
const projects = [];
const seenProjectIds = new Set();
projectTables.forEach((tbl) => {
  tbl.forEach((r) => {
    const id = stripBackticks(r.slug);
    if (!id || seenProjectIds.has(id)) return;
    seenProjectIds.add(id);
    projects.push({
      type: "Project",
      id,
      label: r.name || "",
      year: r.year || "",
      status: r.status || r.role || "",
      tech_stack: r["tech stack"] || r.tech || "",
      lineage_parent: r["lineage parent"] || "",
      beliefs_evidenced: r["beliefs evidenced"] || "",
      surface: r.surface || "",
      theme_home: r["theme home"] || "",
      internal_only:
        (r["internal-only"] || "").toLowerCase() === "yes" ? true : false,
      generic_alias: r["generic alias for wiki-render"] || "",
    });
  });
});

// ---------------------------------------------------------------------------
// 4. People - INTENTIONALLY EXCLUDED from kg.json (per Agam call 2026-04-26)
// ---------------------------------------------------------------------------
// People nodes were stripped from the public knowledge graph because tracking
// people-as-graph-nodes is not the value the wiki is meant to deliver. Beliefs,
// projects, themes, and tech form the graph that matters. The People section
// in ontology-v1.md remains as historical synthesis context but is not parsed.
const people = [];

// ---------------------------------------------------------------------------
// 5. Tech (categorized text under ## Tech)
// ---------------------------------------------------------------------------
const techSection = src.match(/^## Tech[^\n]*\n([\s\S]*?)\n## /m);
const tech = [];
const seenTechIds = new Set();
if (techSection) {
  const lines = techSection[1].split("\n");
  let category = "";
  for (const line of lines) {
    const cat = line.match(/^\*\*([^(]+?)\s*(?:\([^)]+\))?:\*\*\s*(.*)$/);
    if (cat) {
      category = cat[1].trim().toLowerCase();
      const items = cat[2]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      items.forEach((label) => {
        const id = `tech.${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
        if (!seenTechIds.has(id)) {
          seenTechIds.add(id);
          tech.push({ type: "Tech", id, label, category });
        }
      });
    }
  }
}

// ---------------------------------------------------------------------------
// 6. Edges
// ---------------------------------------------------------------------------
const edges = [];

// Lineage edges (code block under ### Lineage edges)
const lineageBlock = src.match(/### Lineage edges[\s\S]*?```\n([\s\S]*?)```/);
if (lineageBlock) {
  lineageBlock[1].split("\n").forEach((line) => {
    const m = line.match(/^(\S+)\s*→\s*(\S+)\s*→\s*(.+)$/);
    if (m) {
      const to = m[3].trim();
      if (!/^\(none/.test(to)) {
        edges.push({ from: m[1], rel: m[2], to });
      }
    }
  });
}

// Demonstrates edges
const demonstratesBlock = src.match(/### Demonstrates edges[\s\S]*?```\n([\s\S]*?)```/);
if (demonstratesBlock) {
  demonstratesBlock[1].split("\n").forEach((line) => {
    const m = line.match(/^(\S+)\s*→\s*(\S+)\s*→\s*(\S+)/);
    if (m) edges.push({ from: m[1], rel: m[2], to: m[3] });
  });
}

// Supersedes edges
const supersedesBlock = src.match(/### Supersedes edges[\s\S]*?```\n([\s\S]*?)```/);
if (supersedesBlock) {
  supersedesBlock[1].split("\n").forEach((line) => {
    const m = line.match(/^(\S+)\s*→\s*(\S+)\s*→\s*([^\s(]+)/);
    if (m) edges.push({ from: m[1], rel: m[2], to: m[3] });
  });
}

// Tension-with edges
const tensionBlock = src.match(/### Tension-with edges[\s\S]*?```\n([\s\S]*?)```/);
if (tensionBlock) {
  tensionBlock[1].split("\n").forEach((line) => {
    const m = line.match(/^(\S+)\s*↔\s*tension-with\s*↔\s*(\S+)/);
    if (m) {
      edges.push({
        from: m[1],
        rel: "tension-with",
        to: m[2],
        bidirectional: true,
      });
    }
  });
}

// Achievement edges
const achievementBlock = src.match(/### Achievement edges[\s\S]*?```\n([\s\S]*?)```/);
if (achievementBlock) {
  achievementBlock[1].split("\n").forEach((line) => {
    const m = line.match(/^(\S+)\s*→\s*(\S+)\s*→\s*(\S+)/);
    if (m) edges.push({ from: m[1], rel: m[2], to: m[3] });
  });
}

// Theme → belief assignments (parsed from ## Theme → assigned beliefs section)
const themeAssignSection = src.match(
  /^## Theme → assigned beliefs[\s\S]*?\n## /m
);
if (themeAssignSection) {
  const block = themeAssignSection[0];
  const themeBlocks = block.split(/\n### /).slice(1);
  themeBlocks.forEach((tb) => {
    const themeSlug = tb.split("\n")[0].trim();
    const themeId = `theme.${themeSlug}`;
    const lines = tb.split("\n").slice(1);
    lines.forEach((line) => {
      const m = line.match(/^-\s*`(belief\.[^`]+)`/);
      if (m) {
        edges.push({ from: themeId, rel: "contains-belief", to: m[1] });
      }
    });
  });
}

// ---------------------------------------------------------------------------
// 6.5 Post nodes from evidence URNs in wiki + belief drafts
// ---------------------------------------------------------------------------
// Phase B + C call: posts are first-class graph nodes. Each urn:li:activity:NNN
// reference in any wiki theme draft or belief draft becomes a Post node, edged
// to the theme (theme.<slug> -[cites-post]-> post.<urn>) and/or the belief
// (belief.<slug> -[cites-post]-> post.<urn>). This wires evidence into the
// graph viz instead of burying it inside table rows.
import { readdirSync as _readdirSync } from "node:fs";

const THEME_DRAFTS = join(ROOT, "docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final");
const BELIEF_DRAFTS = join(ROOT, "docs/plans/second-brain-v1-phase-a/synthesis/belief-page-drafts-final");

const posts = new Map(); // id -> { id, type, label, urn, dates: Set, snippet }
const postEdges = [];

function scanDraftsForUrns(dir, parentKind /* 'theme' | 'belief' */) {
  let files;
  try { files = _readdirSync(dir); } catch { return; }
  for (const f of files) {
    if (!f.endsWith(".md") || f.startsWith("_")) continue;
    const slug = f.replace(/\.md$/, "");
    const parentId = parentKind === "theme" ? `theme.${slug}` : `belief.${slug}`;
    let text;
    try { text = readFileSync(join(dir, f), "utf8"); } catch { continue; }
    const seenInThisFile = new Set();
    // Pattern: urn:li:activity:DIGITS (with optional surrounding context).
    // Capture the line containing the URN to derive a date + 1-line snippet.
    for (const line of text.split("\n")) {
      const urnMatch = line.match(/urn:li:activity:(\d+)/);
      if (!urnMatch) continue;
      const urn = `urn:li:activity:${urnMatch[1]}`;
      // Real LinkedIn activity URNs are 18-20 digits. Anything shorter is a
      // truncated draft entry like 'urn:li:activity:7341662...' - those
      // produce ghost Post nodes with broken permalinks.
      if (urnMatch[1].length < 18) {
        console.warn(`[build-kg] WARNING: truncated URN in ${dir}/${f}: ${urn}`);
        continue;
      }
      if (seenInThisFile.has(urn)) continue;
      seenInThisFile.add(urn);
      const id = `post.${urn.replace(/:/g, "-")}`;
      // Date: first ISO date on the line, e.g. 2024-12-24
      const dateMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : "";
      // Snippet: first quoted phrase on the line, fall back to leading text
      const quote = line.match(/"([^"]+)"/) || line.match(/“([^”]+)”/);
      const snippet = quote ? quote[1] : line.replace(/\|/g, " ").replace(/^[\s\-|*]+/, "").slice(0, 120).trim();
      if (!posts.has(id)) {
        posts.set(id, {
          type: "Post",
          id,
          urn,
          permalink: `https://www.linkedin.com/feed/update/${urn}/`,
          label: snippet.slice(0, 80) || `Post ${urn}`,
          date,
          snippet,
        });
      } else {
        // Earliest date wins (rare conflict); accumulate snippet length
        const p = posts.get(id);
        if (date && (!p.date || date < p.date)) p.date = date;
      }
      postEdges.push({ from: parentId, rel: "cites-post", to: id });
    }
  }
}

scanDraftsForUrns(THEME_DRAFTS, "theme");
scanDraftsForUrns(BELIEF_DRAFTS, "belief");

// ---------------------------------------------------------------------------
// 7. Validate
// ---------------------------------------------------------------------------
const postsArr = Array.from(posts.values());
edges.push(...postEdges);
const allNodes = [...themes, ...beliefs, ...projects, ...tech, ...postsArr];
const nodeIds = new Set(allNodes.map((n) => n.id));
// Extra slugs that exist as ontology references but aren't in our parsed nodes
const knownExternalIds = new Set([
  "achievement.linkedin-top-voice-pm",
  "achievement.linkedin-top-voice-ai",
  "surface.collab-articles-pm",
  "surface.collab-articles-ai",
]);
knownExternalIds.forEach((id) => nodeIds.add(id));

const orphanEdges = edges.filter(
  (e) => !nodeIds.has(e.from) || !nodeIds.has(e.to)
);
if (orphanEdges.length) {
  console.warn(
    `[build-kg] ${orphanEdges.length} edges reference unknown nodes (kept in output, validation warning):`
  );
  orphanEdges.slice(0, 10).forEach((e) =>
    console.warn(
      `  ${e.from} -[${e.rel}]-> ${e.to}` +
        (!nodeIds.has(e.from) ? ` (from missing)` : "") +
        (!nodeIds.has(e.to) ? ` (to missing)` : "")
    )
  );
}

// ---------------------------------------------------------------------------
// 8. Themes summary (per spec §3 kg.json shape — themes[] with counts)
// ---------------------------------------------------------------------------
const themesSummary = themes.map((t) => {
  const themeBeliefs = edges.filter(
    (e) => e.from === t.id && e.rel === "contains-belief"
  ).length;
  const evidenceEdges = edges.filter(
    (e) =>
      e.rel === "demonstrates" &&
      beliefs.some((b) => b.parent_theme === t.id && b.id === e.to)
  ).length;
  return {
    slug: t.slug,
    title: t.label,
    wiki_url: t.wiki_url,
    tier: t.tier,
    one_line: t.one_line,
    node_count: themeBeliefs + 1,
    edge_count: themeBeliefs + evidenceEdges,
  };
});

// ---------------------------------------------------------------------------
// 9. Stats
// ---------------------------------------------------------------------------
const stats = {
  themes: themes.length,
  beliefs: {
    tier_1: beliefs.filter((b) => b.tier === "1").length,
    tier_2: beliefs.filter((b) => b.tier === "2").length,
    tier_3: beliefs.filter((b) => b.tier === "3").length,
    dropped: beliefs.filter((b) => b.tier === "dropped").length,
    superseded: beliefs.filter((b) => b.tier === "superseded").length,
    total: beliefs.length,
  },
  projects: projects.length,
  tech: tech.length,
  posts: postsArr.length,
  edges: {
    total: edges.length,
    by_relation: edges.reduce((acc, e) => {
      acc[e.rel] = (acc[e.rel] || 0) + 1;
      return acc;
    }, {}),
  },
  nodes_total: allNodes.length,
};

// ---------------------------------------------------------------------------
// 10. Emit
// ---------------------------------------------------------------------------
const kg = {
  version: "1.0",
  generated_at: new Date().toISOString(),
  source: `docs/plans/second-brain-v1-phase-a/synthesis/ontology-v1.md (locked ${ONTOLOGY_LOCK_DATE})`,
  nodes: allNodes,
  edges,
  themes: themesSummary,
  stats,
};

// Atomic write: tmp + rename so a SIGKILL or disk-full mid-write can't leave
// wiki/kg.json half-written and unparseable for downstream consumers.
mkdirSync(dirname(OUT), { recursive: true });
const TMP = `${OUT}.tmp`;
writeFileSync(TMP, JSON.stringify(kg, null, 2) + "\n");
renameSync(TMP, OUT);

console.log(`[build-kg] wrote ${OUT}`);
console.log(`[build-kg] ${stats.nodes_total} nodes, ${stats.edges.total} edges`);
console.log(
  `[build-kg]   themes: ${stats.themes}, beliefs: ${stats.beliefs.total} (T1=${stats.beliefs.tier_1} T2=${stats.beliefs.tier_2} T3=${stats.beliefs.tier_3} dropped=${stats.beliefs.dropped} superseded=${stats.beliefs.superseded})`
);
console.log(
  `[build-kg]   projects: ${stats.projects}, tech: ${stats.tech}, posts: ${stats.posts || 0}`
);
console.log(`[build-kg]   edge relations: ${JSON.stringify(stats.edges.by_relation)}`);
if (orphanEdges.length) {
  console.warn(`[build-kg] WARNING: ${orphanEdges.length} orphan edges (see above)`);
  // Strict mode: --strict flag fails the build on orphan edges so CI catches
  // ontology-vs-data drift instead of shipping a broken kg.json.
  if (process.argv.includes("--strict")) {
    console.error("[build-kg] FAIL (strict): orphan edges present");
    process.exit(1);
  }
}
