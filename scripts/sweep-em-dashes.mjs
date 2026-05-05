#!/usr/bin/env node
// One-shot em-dash sweep across all wiki source drafts.
// Replaces " — " with ". " (capitalizing next word), "—" with ", ",
// and "–" with "-". Preserves frontmatter unchanged. Run once after
// rubric v2 revision pass; not a recurring build step.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIRS = [
  join(ROOT, "docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final"),
  join(ROOT, "docs/plans/second-brain-v1-phase-a/synthesis/belief-page-drafts-final"),
];

function splitFrontmatterBody(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { head: "", body: src };
  return { head: `---\n${m[1]}\n---\n`, body: m[2] };
}

function sweepBody(body) {
  // " — " → ". " with next char uppercased.
  body = body.replace(/ — ([a-z])/g, (_, ch) => `. ${ch.toUpperCase()}`);
  // " — " (next char not lowercase letter — number, quote, etc.) → ", "
  body = body.replace(/ — /g, ", ");
  // "—" with no surrounding spaces (parenthetical) → ", "
  body = body.replace(/—/g, ", ");
  // "–" en-dash → "-"
  body = body.replace(/–/g, "-");
  return body;
}

let totalReplaced = 0;
let filesChanged = 0;

for (const dir of DIRS) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  for (const f of files) {
    const path = join(dir, f);
    const src = readFileSync(path, "utf8");
    const { head, body } = splitFrontmatterBody(src);
    const before = (body.match(/[–—]/g) || []).length;
    if (before === 0) continue;
    const newBody = sweepBody(body);
    writeFileSync(path, head + newBody, "utf8");
    totalReplaced += before;
    filesChanged++;
    console.log(`  ${f}: ${before} replaced`);
  }
}

console.log(`\n[sweep-em-dashes] ${filesChanged} files, ${totalReplaced} replacements`);
