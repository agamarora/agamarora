// kg-parse.mjs
//
// Pure parser helpers extracted from scripts/build-kg.mjs for testability.
// No I/O, no side effects. Inputs: strings. Outputs: arrays/strings.
//
// Tests live at tests/kg-parse.test.mjs - run via `npm test`.

export const splitRow = (line) =>
  line
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

export const stripBackticks = (s) => s.replace(/`/g, "").trim();

// Clean a slug cell: drop parenthetical notes + take leading token. Used
// when ontology rows have inline annotations like:
//   `belief.people-management-is-endgame (implicit family-default)`
// We only want the slug.
export const cleanSlug = (s) => stripBackticks(s).split(/\s|\(/)[0].trim();

// Pull the FIRST markdown table under a heading. Stops at the next heading
// (any level: ##, ###, ####). Multiple tables in one section -> only first.
export function tableUnder(headingRegex, src) {
  const lines = src.split("\n");
  const startIdx = lines.findIndex((l) => headingRegex.test(l));
  if (startIdx === -1) return [];
  const rows = [];
  let inTable = false;
  let headers = null;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^#{2,4}\s/.test(l)) break;
    if (/^\|/.test(l)) {
      const cells = splitRow(l);
      if (!inTable) {
        headers = cells.map((h) => h.toLowerCase());
        inTable = true;
        continue;
      }
      if (cells.every((c) => /^-+$/.test(c) || c === "")) continue;
      const obj = {};
      headers.forEach((h, idx) => (obj[h] = cells[idx] ?? ""));
      rows.push(obj);
    } else if (inTable && l.trim() === "") {
      // Reset so a second table in the same section can be picked up via
      // a separate tableUnder call (or via allTablesUnder).
      inTable = false;
      headers = null;
    }
  }
  return rows;
}

// All tables under a heading. Only breaks on next level-2 heading so ###
// subsections stay in scope. Returns array of arrays of row-objects.
export function allTablesUnder(headingRegex, src) {
  const lines = src.split("\n");
  const startIdx = lines.findIndex((l) => headingRegex.test(l));
  if (startIdx === -1) return [];
  const tables = [];
  let cur = null;
  let headers = null;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^##\s/.test(l)) break;
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

// Edge regex bank. Each parser takes a code-block body string and returns
// an array of edge objects. Exported for test coverage of the unicode
// arrows (-> and <->) which silently break if a regex copy-paste mishap
// substitutes the wrong arrow character.

export function parseLineageEdges(block) {
  const out = [];
  for (const line of block.split("\n")) {
    const m = line.match(/^(\S+)\s*→\s*(\S+)\s*→\s*(.+)$/);
    if (m) {
      const to = m[3].trim();
      if (!/^\(none/.test(to)) out.push({ from: m[1], rel: m[2], to });
    }
  }
  return out;
}

export function parseSimpleEdges(block) {
  const out = [];
  for (const line of block.split("\n")) {
    const m = line.match(/^(\S+)\s*→\s*(\S+)\s*→\s*([^\s(]+)/);
    if (m) out.push({ from: m[1], rel: m[2], to: m[3] });
  }
  return out;
}

export function parseTensionEdges(block) {
  const out = [];
  for (const line of block.split("\n")) {
    const m = line.match(/^(\S+)\s*↔\s*tension-with\s*↔\s*(\S+)/);
    if (m) {
      out.push({ from: m[1], rel: "tension-with", to: m[2], bidirectional: true });
    }
  }
  return out;
}
