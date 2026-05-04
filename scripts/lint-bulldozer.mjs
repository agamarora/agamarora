#!/usr/bin/env node
// lint-bulldozer.mjs
//
// Bulldozer commit gate. Reads every wiki-source draft and fails with
// line-numbered violations if any of the following hold in body prose:
//   - banned vocabulary (LLM tells, wiki diary tells)
//   - hedging phrases ("I believe", "I think", ...)
//   - em-dash characters (— or –)
//   - first paragraph > 80 words (the "hook")
//   - last paragraph > 120 words (the "bottom line")
//   - H2 count < 3
//   - fewer than 3 distinct required action verbs
//
// Frontmatter + URLs are excluded (banned word "beliefs" is fine in
// frontmatter, /wiki/beliefs/ is fine in href).
//
// Run:
//   npm run lint:bulldozer
//   node scripts/lint-bulldozer.mjs --strict
//   node scripts/lint-bulldozer.mjs --slug agent-first  (one file)

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const THEME_DIR = join(ROOT, "docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final");
const BELIEF_DIR = join(ROOT, "docs/plans/second-brain-v1-phase-a/synthesis/belief-page-drafts-final");

const args = process.argv.slice(2);
const STRICT = args.includes("--strict");
const ONLY = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

// Bulldozer-anchor sources locked 2026-05-04. Only these are graded against
// the full ruleset until Phase 5 batches rewrite the rest. Anchor + Phase 2
// migration are the live test set.
const ANCHOR_SLUGS = new Set([
  "agent-first",            // belief + theme (Phase 4 anchor)
  "spec-first-taste",       // theme (Phase 2 migration target)
]);

const BANNED_VOCAB = [
  "passionate",
  "synergy",
  "journey",
  "cross-functional collaboration",
  "digital garden",
  "thought process",
];
// "beliefs" is special: banned in body prose, fine in URL paths + frontmatter.
const BANNED_BELIEFS_PROSE = /\b(beliefs?|the belief|this belief)\b/gi;

const HEDGING = [
  "i believe",
  "i think",
  "my thesis",
  "my approach",
  "i would argue",
];

const REQUIRED_VERBS = [
  "architected",
  "enforced",
  "shipped",
  "deprecated",
  "scaled",
  "constrained",
  "evaluated",
  "routed",
];

// Strip frontmatter block (between --- ... ---) so banned words inside
// frontmatter (slug, parent_theme, related_beliefs) don't trigger.
function splitFrontmatterBody(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { frontmatter: "", body: src };
  return { frontmatter: m[1], body: m[2] };
}

// Strip URL paths in [label](url) markdown links so /wiki/beliefs/foo/ doesn't
// trigger the body-prose "beliefs" rule.
function stripUrlPaths(body) {
  return body.replace(/\]\([^)]+\)/g, "]()");
}

// Word count of a paragraph (split on whitespace, drop empty).
function wordCount(s) {
  return s.replace(/[\s]+/g, " ").trim().split(" ").filter(Boolean).length;
}

// Get first and last non-empty paragraph (treating ## as boundary).
// First paragraph = the hook (after H1, before first H2).
// Last paragraph = under the last H2 ("Bottom line" by convention).
function firstParagraph(body) {
  const afterH1 = body.replace(/^#\s+[^\n]+\n/, "");
  const beforeH2 = afterH1.split(/\n##\s/, 1)[0];
  const paras = beforeH2.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return paras[0] || "";
}
function lastParagraph(body) {
  const sections = body.split(/\n##\s+/);
  const last = sections[sections.length - 1];
  const paras = last.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return paras[paras.length - 1] || "";
}

function lineNumberOf(body, needle, fromIdx = 0) {
  const idx = body.toLowerCase().indexOf(needle.toLowerCase(), fromIdx);
  if (idx < 0) return -1;
  return body.slice(0, idx).split("\n").length;
}

function lintFile(filePath, slug, kind) {
  const src = readFileSync(filePath, "utf8");
  const { body } = splitFrontmatterBody(src);
  const bodyNoUrls = stripUrlPaths(body);
  const violations = [];

  // 1. Banned vocab
  for (const word of BANNED_VOCAB) {
    const re = new RegExp(`\\b${word.replace(/ /g, "\\s+")}\\b`, "gi");
    let m;
    while ((m = re.exec(bodyNoUrls)) !== null) {
      const ln = lineNumberOf(body, m[0], m.index);
      violations.push({ rule: "banned-vocab", word: m[0], line: ln });
    }
  }
  // "beliefs" / "belief" in body prose only.
  let m;
  while ((m = BANNED_BELIEFS_PROSE.exec(bodyNoUrls)) !== null) {
    const ln = lineNumberOf(body, m[0], m.index);
    violations.push({ rule: "banned-belief-word", word: m[0], line: ln });
  }
  BANNED_BELIEFS_PROSE.lastIndex = 0;

  // 2. Hedging
  for (const phrase of HEDGING) {
    const re = new RegExp(`\\b${phrase}\\b`, "gi");
    let h;
    while ((h = re.exec(bodyNoUrls)) !== null) {
      const ln = lineNumberOf(body, h[0], h.index);
      violations.push({ rule: "hedging", word: h[0], line: ln });
    }
  }

  // 3. Em-dash characters (anywhere in body, including frontmatter).
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === "—" || ch === "–") {
      const ln = src.slice(0, i).split("\n").length;
      violations.push({ rule: "em-dash", word: ch, line: ln });
    }
  }

  // 4. H2 count
  const h2s = (body.match(/^##\s+/gm) || []).length;
  if (h2s < 3) {
    violations.push({ rule: "h2-count", count: h2s, line: 0 });
  }

  // 5. Hook word count
  const hook = firstParagraph(body);
  const hookWc = wordCount(hook);
  if (hookWc > 80) {
    violations.push({ rule: "hook-length", count: hookWc, line: 0 });
  }

  // 6. Bottom-line word count
  const bottom = lastParagraph(body);
  const bottomWc = wordCount(bottom);
  if (bottomWc > 120) {
    violations.push({ rule: "bottom-length", count: bottomWc, line: 0 });
  }

  // 7. Required verbs (>=3 distinct).
  const verbHits = new Set();
  for (const v of REQUIRED_VERBS) {
    const re = new RegExp(`\\b${v}\\b`, "gi");
    if (re.test(bodyNoUrls)) verbHits.add(v);
  }
  if (verbHits.size < 3) {
    violations.push({ rule: "action-verbs", count: verbHits.size, line: 0 });
  }

  return { slug, kind, file: filePath, violations, hookWc, bottomWc, h2s, verbCount: verbHits.size };
}

function listSources() {
  const themes = existsSync(THEME_DIR)
    ? readdirSync(THEME_DIR).filter((f) => f.endsWith(".md")).map((f) => ({ kind: "theme", file: join(THEME_DIR, f), slug: f.replace(/\.md$/, "") }))
    : [];
  const beliefs = existsSync(BELIEF_DIR)
    ? readdirSync(BELIEF_DIR).filter((f) => f.endsWith(".md")).map((f) => ({ kind: "belief", file: join(BELIEF_DIR, f), slug: f.replace(/\.md$/, "") }))
    : [];
  return [...themes, ...beliefs];
}

function main() {
  const sources = listSources();
  const target = ONLY ? sources.filter((s) => s.slug === ONLY) : sources;
  if (target.length === 0) {
    console.error(`[lint-bulldozer] no sources matched: ${ONLY || "(all)"}`);
    process.exit(1);
  }

  let totalViolations = 0;
  let anchorViolations = 0;
  const reports = [];
  for (const s of target) {
    const r = lintFile(s.file, s.slug, s.kind);
    reports.push(r);
    totalViolations += r.violations.length;
    if (ANCHOR_SLUGS.has(s.slug)) anchorViolations += r.violations.length;
  }

  // Print per-anchor first (always loud), then summary for non-anchors.
  for (const r of reports) {
    if (!ANCHOR_SLUGS.has(r.slug) && r.violations.length === 0) continue;
    const tag = ANCHOR_SLUGS.has(r.slug) ? "ANCHOR" : "draft";
    console.log(`\n[${tag}] ${r.kind}/${r.slug}`);
    console.log(`  hook=${r.hookWc}w bottom=${r.bottomWc}w h2=${r.h2s} verbs=${r.verbCount}`);
    if (r.violations.length === 0) {
      console.log(`  PASS`);
    } else {
      for (const v of r.violations) {
        const where = v.line > 0 ? `:${v.line}` : "";
        const detail = v.word ? `"${v.word}"` : `count=${v.count}`;
        console.log(`  ${v.rule} ${detail} (${r.slug}${where})`);
      }
    }
  }

  // Summary line.
  const nonAnchorWithViolations = reports.filter((r) => !ANCHOR_SLUGS.has(r.slug) && r.violations.length > 0).length;
  console.log(
    `\n[lint-bulldozer] anchors: ${anchorViolations} violations across ${reports.filter((r) => ANCHOR_SLUGS.has(r.slug)).length} anchor file(s)`
  );
  console.log(
    `[lint-bulldozer] non-anchor drafts: ${nonAnchorWithViolations} of ${reports.length - reports.filter((r) => ANCHOR_SLUGS.has(r.slug)).length} have violations (expected pre-Phase-5)`
  );

  // Strict mode: anchors MUST pass. Non-anchors are advisory until Phase 5.
  if (STRICT && anchorViolations > 0) {
    console.error(`\n[lint-bulldozer] FAIL: ${anchorViolations} anchor violation(s) under --strict`);
    process.exit(1);
  }
  if (!STRICT && totalViolations > 0) {
    console.log(`\n[lint-bulldozer] WARN: ${totalViolations} violation(s) total. Run with --strict to gate commit on anchor purity.`);
  }
  process.exit(0);
}

main();
