#!/usr/bin/env node
// build-wiki.mjs
//
// Reads docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final/<slug>.md
// and emits wiki/<slug>/index.html for each theme + root draft.
//
// Per spec D2: scaffold + hand-finish. This script produces a complete v2-contract
// HTML page from the markdown source. Hand-finish is light polish on whatever the
// converter can't render cleanly (footnote-style asides, unusual markdown).
//
// Run: node scripts/build-wiki.mjs
//      node scripts/build-wiki.mjs --only agent-first      (single page)
//      node scripts/build-wiki.mjs --strict                 (fail on parse errors)

import { readFileSync, writeFileSync, renameSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SHARED_PRELOAD_HTML,
  SHARED_CHROME_CSS,
  SVG_SPRITE,
  SHARED_HEADER_HTML,
  SHARED_AAMARK_HTML,
  AAMARK_SCRIPT,
} from "./lib/chrome.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const THEME_DRAFTS_DIR = join(
  ROOT,
  "docs/plans/second-brain-v1-phase-a/synthesis/wiki-page-drafts-final"
);
const BELIEF_DRAFTS_DIR = join(
  ROOT,
  "docs/plans/second-brain-v1-phase-a/synthesis/belief-page-drafts-final"
);
const META_DRAFTS_DIR = join(
  ROOT,
  "docs/plans/second-brain-v1-phase-a/synthesis/wiki-meta-drafts"
);
const OUT_DIR = join(ROOT, "wiki");

// Update when source synthesis is re-locked. Surfaced in page footer for provenance.
const ONTOLOGY_LOCK_DATE = "2026-04-26";

const args = process.argv.slice(2);
const ONLY = args.find((a) => a.startsWith("--only="))?.split("=")[1];
const STRICT = args.includes("--strict");

for (const d of [THEME_DRAFTS_DIR, BELIEF_DRAFTS_DIR]) {
  if (!existsSync(d)) {
    console.error(`[build-wiki] FATAL: drafts dir missing: ${d}`);
    console.error(
      `[build-wiki]   Phase A synthesis output is required to build wiki pages. Re-pull the repo or restore from origin/main.`
    );
    process.exit(1);
  }
}
// META_DRAFTS_DIR is optional - skip silently if missing (ships voice + quotes
// once those drafts are added; doesn't break themes/beliefs build).

// ---------------------------------------------------------------------------
// 1. Frontmatter parser (YAML-ish, just what the drafts use)
// ---------------------------------------------------------------------------
function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  let currentKey = null;
  for (const line of m[1].split("\n")) {
    if (/^\s*-\s/.test(line)) {
      // list item under previous key
      if (currentKey) {
        meta[currentKey] = meta[currentKey] || [];
        meta[currentKey].push(line.replace(/^\s*-\s/, "").trim());
      }
    } else {
      const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
      if (kv) {
        currentKey = kv[1];
        const val = kv[2].trim();
        meta[currentKey] = val === "" ? null : val;
      }
    }
  }
  return { meta, body: m[2] };
}

// ---------------------------------------------------------------------------
// 2. Inline markdown -> HTML
// ---------------------------------------------------------------------------
const escHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Slugs that have an actual wiki HTML page. Populated at startup from the
// drafts dirs so cross-link expansion can filter out graph-only T2/T3 belief
// refs (which are nodes in kg.json but never get their own page).
let HAS_PAGE = { themes: new Set(), beliefs: new Set() };
function refreshPageIndex() {
  if (existsSync(THEME_DRAFTS_DIR)) {
    HAS_PAGE.themes = new Set(
      readdirSync(THEME_DRAFTS_DIR)
        .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
        .map((f) => basename(f, ".md"))
    );
  }
  if (existsSync(BELIEF_DRAFTS_DIR)) {
    HAS_PAGE.beliefs = new Set(
      readdirSync(BELIEF_DRAFTS_DIR)
        .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
        .map((f) => basename(f, ".md"))
    );
  }
}
refreshPageIndex();

function inlineMd(text) {
  // Pre-pass: expand wiki shorthand into real markdown links so the standard
  // [text](url) handler below can render them. Only expand if the target page
  // actually exists. Otherwise render as plain code-styled text (graph-only
  // node, no page).
  //   [wiki:beliefs:slug]      ->  [slug](/wiki/beliefs/slug/) or `slug`
  //   [wiki:slug]              ->  [slug](/wiki/slug/) or `slug`
  text = text.replace(
    /\[wiki:beliefs:([a-z0-9.\-]+)\]/g,
    (_, slug) =>
      HAS_PAGE.beliefs.has(slug)
        ? `[${slug}](/wiki/beliefs/${slug}/)`
        : `\`${slug}\``
  );
  text = text.replace(
    /\[wiki:([a-z0-9.\-]+)\](?!\()/g,
    (_, slug) =>
      HAS_PAGE.themes.has(slug)
        ? `[${slug}](/wiki/${slug}/)`
        : `\`${slug}\``
  );

  // Code spans (so ** inside code doesn't get parsed)
  const codeSpans = [];
  text = text.replace(/`([^`]+)`/g, (_, c) => {
    codeSpans.push(c);
    return `CODE${codeSpans.length - 1}`;
  });

  // Escape raw HTML chars in remaining prose
  text = escHtml(text);

  // Markdown links [text](url)
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, t, u) => {
      const href = u.replace(/^urn:li:activity:(\d+)$/, "https://www.linkedin.com/feed/update/urn:li:activity:$1/");
      const ext = /^https?:/.test(href);
      return `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`;
    }
  );

  // Bold then italic (order matters: ** before *)
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

  // Restore code spans
  text = text.replace(/CODE(\d+)/g, (_, i) => `<code>${escHtml(codeSpans[+i])}</code>`);

  // Bare urn:li:activity:NNN -> LinkedIn permalink labelled "view post"
  // (the raw URN id is noise for both humans and agents; the link is what matters).
  text = text.replace(
    /(^|[\s>])(urn:li:activity:(\d+))/g,
    (_, pre, full, id) =>
      `${pre}<a href="https://www.linkedin.com/feed/update/${full}/" target="_blank" rel="noopener" class="urn-link">view post &rarr;</a>`
  );

  return text;
}

// ---------------------------------------------------------------------------
// 3. Block-level markdown -> HTML
// ---------------------------------------------------------------------------
function blockMd(body) {
  const lines = body.split("\n");
  const out = [];
  let i = 0;

  const flushParagraph = (buf) => {
    if (buf.length === 0) return;
    const text = buf.join(" ").trim();
    if (text === "") return;
    out.push(`<p>${inlineMd(text)}</p>`);
  };

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule (--- on its own line)
    if (/^-{3,}\s*$/.test(line)) {
      out.push("<hr>");
      i++;
      continue;
    }

    // Headings
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const id = heading[2]
        .toLowerCase()
        .replace(/<[^>]+>/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      out.push(`<h${level} id="${id}">${inlineMd(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    // Markdown table: | a | b | followed by | --- | --- |
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s\-|:]+\|?\s*$/.test(lines[i + 1])) {
      const headerCells = line.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      i += 2; // skip header + separator
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        const cells = lines[i].replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        rows.push(cells);
        i++;
      }
      out.push("<div class=\"md-table-wrap\"><table class=\"md-table\">");
      out.push("<thead><tr>" + headerCells.map((h) => `<th>${inlineMd(h)}</th>`).join("") + "</tr></thead>");
      out.push("<tbody>");
      rows.forEach((r) => {
        out.push("<tr>" + r.map((c) => `<td>${inlineMd(c)}</td>`).join("") + "</tr>");
      });
      out.push("</tbody></table></div>");
      continue;
    }

    // Blockquote: `> text` lines, possibly multi-line. Renders as semantic
    // <blockquote>. Used heavily by /wiki/quotes/.
    if (/^>\s?/.test(line)) {
      const items = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        items.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${inlineMd(items.join(" "))}</blockquote>`);
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      out.push("<ul>" + items.map((it) => `<li>${inlineMd(it)}</li>`).join("") + "</ul>");
      continue;
    }

    // Ordered list (1. / 2. / 3. ... or 1) / 2) / 3) ...).
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      out.push("<ol>" + items.map((it) => `<li>${inlineMd(it)}</li>`).join("") + "</ol>");
      continue;
    }

    // Blank line: separator
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph: collect until next block boundary
    const buf = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^-{3,}\s*$/.test(lines[i]) &&
      !/^\|/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    flushParagraph(buf);
  }

  return out.join("\n");
}

// ---------------------------------------------------------------------------
// 4. Per-page metadata defaults from frontmatter
// ---------------------------------------------------------------------------
function stripQuotes(s) {
  return (s || "").replace(/^["']|["']$/g, "").trim();
}

function pageMeta(meta, slug, fallbackTitle) {
  // Voice rule: no em-dashes. Keep titles as-authored (compound hyphens stay,
  // spaced-hyphen separator stays as " - ", never converted to em-dash).
  const title = stripQuotes(meta.title || fallbackTitle || slug);
  return {
    title,
    type: meta.type || "Theme",
    tier: meta.tier || "theme",
    slug: meta.slug || slug,
    description: title,
    oneLine: stripQuotes(meta.one_line || ""),
  };
}

// ---------------------------------------------------------------------------
// 5. v2 page template
// ---------------------------------------------------------------------------
const SHARED_HEAD_STYLES = `
${SHARED_CHROME_CSS}

  .page{max-width:760px;margin:0 auto;padding:calc(clamp(52px,6vw,64px) + var(--space-8)) clamp(var(--space-6),5vw,var(--space-8)) calc(var(--space-9) + var(--space-7));}

  .breadcrumb{font-family:var(--mono);font-size:0.74rem;color:var(--text-dim);letter-spacing:0.06em;margin-bottom:var(--space-6);}
  .breadcrumb a{color:var(--text-dim);text-decoration:none;border-bottom:1px dashed var(--border-hover);transition:color 0.2s,border-color 0.2s;}
  .breadcrumb a:hover{color:var(--accent);border-color:var(--accent);}
  .breadcrumb .sep{margin:0 var(--space-3);opacity:0.5;}

  article{font-size:1.04rem;}
  article > p, article > ul, article > .md-table-wrap, article > hr { margin-bottom: var(--space-6); }
  article h1{font-size:clamp(2.2rem,5vw,3rem);font-weight:700;letter-spacing:-0.025em;line-height:1.05;margin-bottom:var(--space-7);max-width:680px;}
  article h2{font-size:clamp(1.5rem,2.4vw,1.85rem);font-weight:600;letter-spacing:-0.02em;line-height:1.2;margin-top:var(--space-9);margin-bottom:var(--space-5);color:var(--text);}
  article h2:first-of-type{margin-top:0;}
  article h3{font-size:clamp(1.1rem,1.6vw,1.25rem);font-weight:600;letter-spacing:-0.01em;line-height:1.3;margin-top:var(--space-7);margin-bottom:var(--space-4);}
  article p{font-size:1.04rem;line-height:1.7;color:var(--text);opacity:0.92;}
  article p em{font-style:italic;opacity:0.85;}
  article p strong{color:var(--text);font-weight:600;opacity:1;}
  article p code,article li code{font-family:var(--mono);font-size:0.92em;background:var(--surface-2);border:1px solid var(--border);padding:1px 6px;border-radius:var(--radius-sm);color:var(--accent);}
  article a{color:var(--accent);text-decoration:none;border-bottom:1px solid var(--accent-dim);transition:border-color 0.2s;}
  article a:hover{border-color:var(--accent);}
  article a.urn-link{font-family:var(--mono);font-size:0.85em;color:var(--text-dim);border-bottom:1px dashed var(--border-hover);}
  article a.urn-link:hover{color:var(--accent);border-color:var(--accent);}
  article hr{border:0;height:1px;background:var(--border);margin:var(--space-8) 0;}
  article ul,article ol{padding-left:var(--space-6);margin-bottom:var(--space-6);}
  article ul li,article ol li{margin-bottom:var(--space-4);line-height:1.7;padding-left:var(--space-3);}
  article ol{counter-reset:item;list-style:none;padding-left:0;}
  article ol > li{counter-increment:item;position:relative;padding-left:calc(var(--space-7) + var(--space-3));margin-bottom:var(--space-5);}
  article ol > li::before{content:counter(item);position:absolute;left:0;top:0;width:var(--space-7);height:var(--space-7);display:inline-flex;align-items:center;justify-content:center;background:var(--surface-2);border:1px solid var(--border);border-radius:50%;font-family:var(--mono);font-size:0.78rem;color:var(--accent);font-weight:500;}

  .md-table-wrap{overflow-x:auto;margin:var(--space-6) 0;border:1px solid var(--border);border-radius:var(--radius-md);}
  .md-table{width:100%;border-collapse:collapse;font-size:0.92rem;}
  .md-table th,.md-table td{padding:var(--space-4) var(--space-5);text-align:left;border-bottom:1px solid var(--border);vertical-align:top;}
  .md-table th{background:var(--surface);color:var(--accent);font-family:var(--mono);font-size:0.74rem;letter-spacing:0.08em;text-transform:uppercase;font-weight:500;}
  .md-table td{color:var(--text);opacity:0.88;}
  .md-table tr:last-child td{border-bottom:0;}

  .theme-meta{font-family:var(--mono);font-size:0.78rem;color:var(--text-dim);letter-spacing:0.04em;margin-top:calc(-1 * var(--space-5));margin-bottom:var(--space-7);}
  .theme-meta .tier{color:var(--accent);}

  /* Page-purpose hook: one-line "what is this for?" rendered directly under h1. */
  .page-purpose{font-family:var(--sans);font-size:1.05rem;line-height:1.55;color:var(--text-dim);font-style:italic;margin-top:calc(-1 * var(--space-5));margin-bottom:var(--space-7);padding-left:var(--space-5);border-left:2px solid var(--accent-dim);max-width:640px;}

  /* Belief chip strip: graph-position metadata under h1. Desktop = single row with separator dots, mobile = each group stacks vertically with label-above-chips. */
  .belief-chips{display:flex;flex-wrap:wrap;gap:var(--space-3) var(--space-5);align-items:baseline;font-family:var(--mono);font-size:0.74rem;color:var(--text-dim);letter-spacing:0.04em;margin-top:calc(-1 * var(--space-5));margin-bottom:var(--space-5);}
  .belief-chips .group{display:inline-flex;align-items:baseline;gap:var(--space-3);flex-wrap:wrap;}
  .belief-chips .group-label{color:var(--accent);text-transform:uppercase;font-size:0.7rem;letter-spacing:0.08em;font-weight:500;white-space:nowrap;}
  .belief-chips .chip{color:var(--text);text-decoration:none;border-bottom:1px dashed var(--border-hover);padding-bottom:1px;transition:color 0.2s,border-color 0.2s;}
  .belief-chips .chip:hover{color:var(--accent);border-color:var(--accent);}
  .belief-chips .chip.dead{color:var(--text-dim);opacity:0.65;border-bottom:1px dotted var(--border);cursor:help;}
  .belief-chips .sep-dot{opacity:0.45;}
  @media (max-width: 720px) {
    .belief-chips{flex-direction:column;align-items:flex-start;gap:var(--space-4);}
    .belief-chips .group{display:flex;flex-direction:column;align-items:flex-start;gap:var(--space-3);width:100%;}
    .belief-chips .group-label{display:block;margin-bottom:0;font-size:0.66rem;}
    .belief-chips .group .chip,.belief-chips .group span:not(.group-label){display:inline-block;margin-right:var(--space-3);margin-bottom:var(--space-2);}
    .belief-chips .sep-dot{display:none;}
  }

  /* Belief tag strip: applies-to domain tags + confidence marker. Second row under chip strip. */
  .belief-tags{display:flex;flex-wrap:wrap;gap:var(--space-3) var(--space-4);align-items:center;font-family:var(--mono);font-size:0.7rem;color:var(--text-dim);letter-spacing:0.04em;margin-top:calc(-1 * var(--space-3));margin-bottom:var(--space-7);}
  .belief-tags .group-label{color:var(--accent);text-transform:uppercase;font-size:0.66rem;letter-spacing:0.08em;font-weight:500;white-space:nowrap;}
  .belief-tags .tag{display:inline-block;padding:2px 8px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-dim);font-size:0.7rem;white-space:nowrap;}
  .belief-tags .confidence{margin-left:auto;display:inline-flex;align-items:center;gap:var(--space-3);}
  .belief-tags .confidence .dot{width:6px;height:6px;border-radius:50%;display:inline-block;}
  .belief-tags .confidence.settled .dot{background:var(--accent);}
  .belief-tags .confidence.evolving .dot{background:var(--text-dim);}
  .belief-tags .confidence.contested .dot{background:#a23b3b;}
  @media (max-width: 720px) {
    .belief-tags{flex-direction:column;align-items:flex-start;gap:var(--space-3);}
    .belief-tags .group-label{display:block;margin-bottom:var(--space-2);}
    .belief-tags .confidence{margin-left:0;margin-top:var(--space-2);}
  }

  /* TL;DR quotable assertion: agent-grabbable single-line quote at top of body. */
  .belief-tldr{margin:0 0 var(--space-7) 0;padding:var(--space-5) var(--space-6);background:linear-gradient(90deg, var(--accent-dim), transparent 70%);border-left:3px solid var(--accent);border-radius:0 var(--radius-sm) var(--radius-sm) 0;}
  .belief-tldr .label{font-family:var(--mono);font-size:0.7rem;color:var(--accent);letter-spacing:0.1em;text-transform:uppercase;font-weight:500;display:block;margin-bottom:var(--space-3);}
  .belief-tldr .quote{font-family:var(--sans);font-size:1.15rem;line-height:1.5;color:var(--text);font-weight:500;margin:0;}
  @media (max-width: 720px) {
    .belief-tldr{padding:var(--space-4) var(--space-5);}
    .belief-tldr .quote{font-size:1.05rem;line-height:1.45;}
  }

  /* Related cross-links footer: rendered above theme-nav. */
  .related-links{margin-top:var(--space-9);padding-top:var(--space-6);border-top:1px solid var(--border);}
  .related-links h2{font-family:var(--mono);font-size:0.78rem;color:var(--text-dim);letter-spacing:0.08em;text-transform:uppercase;font-weight:500;margin:0 0 var(--space-5) 0;}
  .related-links ul{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:var(--space-3) var(--space-5);}
  .related-links li{font-size:0.94rem;line-height:1.5;}
  .related-links li a{color:var(--text);text-decoration:none;border-bottom:1px solid var(--border);transition:color 0.2s,border-color 0.2s;}
  .related-links li a:hover{color:var(--accent);border-color:var(--accent);}
  .related-links li .kind{font-family:var(--mono);font-size:0.72rem;color:var(--text-dim);letter-spacing:0.06em;margin-right:var(--space-3);}

  .theme-nav{margin-top:var(--space-9);padding-top:var(--space-6);border-top:1px solid var(--border);display:flex;justify-content:space-between;gap:var(--space-5);font-family:var(--mono);font-size:0.82rem;}
  .theme-nav a{color:var(--text-dim);text-decoration:none;transition:color 0.2s;border:0;}
  .theme-nav a:hover{color:var(--accent);}
  .theme-nav .home{color:var(--text-dim);}

  .footer-note{font-family:var(--mono);font-size:0.72rem;color:var(--text-dim);text-align:center;margin-top:var(--space-7);opacity:0.7;font-style:normal;}

  /* Blockquotes (used heavily on /wiki/quotes/). */
  article blockquote { border-left: 3px solid var(--accent-dim); padding: var(--space-3) var(--space-5); margin: var(--space-5) 0; background: var(--surface); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 1rem; line-height: 1.6; color: var(--text); opacity: 0.92; }
  article blockquote strong { color: var(--accent); }

  /* Collapsible Evidence block - kept for agents + research, hidden by default for humans. */
  details.evidence-block { margin: var(--space-6) 0; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0; }
  details.evidence-block > summary { font-family: var(--mono); font-size: 0.78rem; color: var(--accent); letter-spacing: 0.06em; padding: var(--space-4) var(--space-5); cursor: pointer; list-style: none; user-select: none; }
  details.evidence-block > summary::-webkit-details-marker { display: none; }
  details.evidence-block > summary::before { content: '+ '; color: var(--accent); display: inline-block; width: 1em; transition: transform 0.2s; }
  details.evidence-block[open] > summary::before { content: '- '; }
  details.evidence-block > summary:hover { color: var(--text); }
  details.evidence-block > * { padding: 0 var(--space-5); }
  details.evidence-block > *:last-child { padding-bottom: var(--space-4); }
  details.evidence-block .md-table-wrap { margin: var(--space-4) var(--space-5); border: 1px solid var(--border); }
  details.evidence-block ul { margin: var(--space-4) var(--space-5); padding-left: var(--space-5); }
  details.evidence-block a.evidence-link { color: var(--text-dim); font-family: var(--mono); font-size: 0.74rem; text-decoration: none; border-bottom: 1px dotted var(--border); transition: color 0.2s, border-color 0.2s; word-break: break-all; }
  details.evidence-block a.evidence-link:hover { color: var(--accent); border-bottom-color: var(--accent); }
`;

// SVG_SPRITE, SHARED_HEADER_HTML, SHARED_AAMARK_HTML, AAMARK_SCRIPT now imported
// from ./lib/chrome.mjs (see top of file). Single source of truth across hand pages
// and wiki pages.

// Theme nav: prev/next ordering (root + 11 themes from ontology)
const NAV_ORDER = [
  "root.substance-over-hype",
  "agent-first",
  "voice-ai-craft",
  "breadth-as-differentiation",
  "pm-taste",
  "ai-pm-skillset",
  "enterprise-ai-reality",
  "second-brain",
  "spec-first-taste",
  "career-reflection",
  "linkedin-as-instrument",
  "personal-projects-tinkering",
];

const NAV_TITLES = {
  "root.substance-over-hype": "Substance over hype",
  "agent-first": "Agent-first",
  "voice-ai-craft": "Voice AI craft",
  "breadth-as-differentiation": "Breadth as differentiation",
  "pm-taste": "PM taste",
  "ai-pm-skillset": "AI PM skillset",
  "enterprise-ai-reality": "Enterprise AI reality",
  "second-brain": "Second brain",
  "spec-first-taste": "Spec first, taste always",
  "career-reflection": "Career reflection",
  "linkedin-as-instrument": "LinkedIn as instrument",
  "personal-projects-tinkering": "Personal projects",
};

// Normalize a list-or-inline-array YAML field into a clean array of strings.
// Handles three frontmatter shapes:
//   foo:\n  - item-a\n  - item-b               -> ["item-a", "item-b"]   (parser path)
//   foo: [item-a, item-b, item-c]              -> string, split here
//   foo: item-a (single value)                 -> ["item-a"]
function normList(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean);
  const s = String(val).trim();
  if (s.startsWith("[") && s.endsWith("]")) {
    return s.slice(1, -1).split(",").map((x) => x.trim()).filter(Boolean);
  }
  return s ? [s] : [];
}

// "belief.agent-first  -  description prose" -> { slug: "agent-first", desc: "description prose" }
// "belief.agent-first" -> { slug: "agent-first", desc: "" }
function parseBeliefRef(raw) {
  const txt = String(raw).trim();
  // Strip parenthetical annotations like "(ghost belief; intentional ...)"
  const split = txt.split(/\s+-\s+/);
  const head = split[0].trim();
  const desc = (split[1] || "").trim().replace(/\s*\(.*?\)\s*$/, "");
  const slug = head.replace(/^belief\./, "").replace(/\s*\(.*$/, "").trim();
  return { slug, desc };
}

// Render "Related" cross-link footer. Returns "" if no links resolve.
function renderRelated(items) {
  const valid = items.filter((it) => it && it.href && it.label);
  if (valid.length === 0) return "";
  const lis = valid
    .map(
      (it) =>
        `<li><span class="kind">${escHtml(it.kind || "")}</span><a href="${it.href}">${escHtml(it.label)}</a></li>`
    )
    .join("");
  return `<aside class="related-links" aria-label="Related pages">
    <h2>Related</h2>
    <ul>${lis}</ul>
  </aside>`;
}

function themeNav(slug) {
  const idx = NAV_ORDER.indexOf(slug);
  if (idx === -1) return "";
  const prev = idx > 0 ? NAV_ORDER[idx - 1] : null;
  const next = idx < NAV_ORDER.length - 1 ? NAV_ORDER[idx + 1] : null;
  const prevHtml = prev
    ? `<a href="/wiki/${prev}/">&larr; ${NAV_TITLES[prev]}</a>`
    : "<span></span>";
  const nextHtml = next
    ? `<a href="/wiki/${next}/">${NAV_TITLES[next]} &rarr;</a>`
    : "<span></span>";
  return `<nav class="theme-nav">${prevHtml}<a href="/wiki/" class="home">wiki home</a>${nextHtml}</nav>`;
}

// ---------------------------------------------------------------------------
// 6. Build a single page (theme + root, OR belief)
// ---------------------------------------------------------------------------

// Safely serialize an object as JSON-LD body. Escapes `</` so a stray `</script>`
// inside any string field can't break out of the surrounding <script> tag.
// Standard XSS-defense pattern for inline JSON-LD.
function safeJsonLd(obj) {
  return JSON.stringify(obj, null, 2).replace(/<\//g, "<\\/");
}

function pageWrap({ title, description, canonical, breadcrumbHtml, articleHtml, navHtml, schemaType, faqPage }) {
  const ogImage = "https://agamarora.com/assets/og/lab.png"; // TODO: per-page OG (B-future)
  const faqLd = faqPage
    ? `\n<script type="application/ld+json">\n${safeJsonLd(faqPage)}\n</script>\n`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<title>${escHtml(title)} - Agam Arora's wiki.</title>
<meta name="description" content="${escHtml(description)}">
<meta name="theme-color" content="#0A0A0A">

<meta property="og:type" content="article">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${escHtml(title)} - Agam Arora's wiki.">
<meta property="og:description" content="${escHtml(description)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Agam Arora">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escHtml(title)} - Agam Arora's wiki.">
<meta name="twitter:description" content="${escHtml(description)}">
<meta name="twitter:image" content="${ogImage}">

<link rel="canonical" href="${canonical}">

<script type="application/ld+json">
${safeJsonLd({
  "@context": "https://schema.org",
  "@type": schemaType,
  "headline": title,
  "url": canonical,
  "isPartOf": { "@type": "WebSite", "@id": "https://agamarora.com/#website" },
  "author": { "@type": "Person", "@id": "https://agamarora.com/#person" }
})}
</script>${faqLd}

<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/favicon.png" sizes="48x48">
<link rel="manifest" href="/site.webmanifest">

<style>${SHARED_HEAD_STYLES}</style>
</head>
<body>

${SVG_SPRITE}

${SHARED_HEADER_HTML}

${SHARED_AAMARK_HTML}

<main class="page">
  ${breadcrumbHtml}

  <article role="main">
${articleHtml}
  </article>

  ${navHtml}
</main>

<script>${AAMARK_SCRIPT}</script>

</body>
</html>
`;
}

// Strip whole sections from markdown body. Sections start at `## Title` and
// run until the next `## ` (any level-2 heading) or EOF.
function stripSections(body, titlesToStrip /* array of regex */) {
  const lines = body.split("\n");
  const out = [];
  let dropping = false;
  for (const l of lines) {
    const h2 = l.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      const title = h2[1];
      dropping = titlesToStrip.some((re) => re.test(title));
      if (dropping) continue;
    }
    if (!dropping) out.push(l);
  }
  return out.join("\n");
}

// Drop only the OBVIOUSLY mechanical draft trace stamps. Inline references
// like "(per taste-pass F1)", "Cluster 6", "R3a", "B1 resolution" require
// smart re-authoring (the original sentence was structured around the
// reference; deleting it leaves a half-claim). Those get fixed by editing
// the source drafts in Agam's voice, NOT by render-strip. This function
// only strips boilerplate that has zero claim content.
function stripDraftTraces(body) {
  return body
    // Italic footer / locked / era stamps that wrap the whole line
    .replace(/^\*(Polished|Final R\d+|R\d+\s+[^*]+|Locked\s[^*]+|Era:[^*]+)\*\s*$/gm, "")
    // Trim consecutive blank lines + trailing orphan ---
    .replace(/\n{3,}/g, "\n\n")
    .replace(/(?:\n---+\s*)+\s*$/m, "\n");
}

// Wrap the rendered Evidence section in <details>/<summary> so it collapses
// by default. Operates on the HTML output of blockMd. Looks for <h2 ...>Evidence</h2>
// and wraps from there until the next <h2>, <hr>, or end of article.
// AEO-14: Linkify LinkedIn URN strings (`urn:li:activity:NNNN...`) inside the
// Evidence body so each cited fact carries an outbound link to the source post.
// AEO research (OneFunder thesis): unique facts cited verbatim with a link beat
// paraphrasable paragraphs. Pattern only fires inside <td> cells to avoid mangling
// any incidental URN mention in surrounding prose.
function linkifyLinkedInUrns(body) {
  return body.replace(/(<td[^>]*>)([\s\S]*?)(<\/td>)/g, (_, open, cell, close) => {
    const linked = cell.replace(
      /(urn:li:activity:(\d+))/g,
      (m, full, id) =>
        `<a href="https://www.linkedin.com/feed/update/${full}/" target="_blank" rel="noopener" class="evidence-link">${full}</a>`
    );
    return open + linked + close;
  });
}

function collapseEvidenceHtml(html) {
  const pattern = /(<h2[^>]*>Evidence<\/h2>)([\s\S]*?)(?=<h2|<hr>|$)/i;
  return html.replace(pattern, (_, heading, body) => {
    body = linkifyLinkedInUrns(body);
    // Count data rows only - <tbody> contents for tables, <li> count for bullets.
    // Avoids the off-by-one from including <thead><tr>.
    const tbodyMatch = body.match(/<tbody>([\s\S]*?)<\/tbody>/);
    const rowCount = tbodyMatch
      ? (tbodyMatch[1].match(/<tr>/g) || []).length
      : (body.match(/<li>/g) || []).length;
    const noun = body.includes("<table") ? "rows" : "items";
    return `<details class="evidence-block"><summary>Evidence (${rowCount} dated ${noun} - click to expand)</summary>${body}</details>`;
  });
}

// Sections we drop from human-rendered theme pages. These are agent-retrieval
// source content kept in the markdown drafts; the agent fetches them via
// kg.json, but human readers do not need to wade through them.
const STRIP_THEME = [/^Tension with/i, /^Open question/i, /^Open Q/i];
// Sections we drop from human-rendered belief sub-pages.
const STRIP_BELIEF = [/^Refinement arc/i, /^Cross-links?/i];

function injectPagePurpose(articleHtml, oneLine) {
  if (!oneLine) return articleHtml;
  const purpose = `\n<p class="page-purpose">${inlineMd(oneLine)}</p>`;
  // Place after first </h1>
  return articleHtml.replace(/<\/h1>/, `</h1>${purpose}`);
}

// Belief chip strip: graph-position metadata under h1. Reads parent_theme +
// supersedes + conditioned_by + holds_with frontmatter, resolves each slug to
// a renderable link if a wiki page exists, otherwise shows it as a dead chip
// (the slug is a graph node without a page - T2/T3 belief or pre-supersession
// state). The chip strip carries pre-req context that orientation prose used
// to carry, so a cold reader (or an agent) gets graph position in <1 second.
function injectBeliefChips(articleHtml, meta) {
  const groups = [];

  const parent = (meta.parent_theme || "").trim();
  if (parent) {
    groups.push({ label: "Theme", items: [{ slug: parent, kind: "theme" }] });
  }

  const addGroup = (label, slugs, kind) => {
    const items = normList(slugs)
      .map((s) => String(s).replace(/^belief\./, "").trim())
      .filter(Boolean);
    if (items.length) {
      groups.push({ label, items: items.map((slug) => ({ slug, kind })) });
    }
  };
  addGroup("Supersedes", meta.supersedes, "belief");
  addGroup("Conditions", meta.conditioned_by, "either");
  addGroup("Holds with", meta.holds_with, "belief");

  if (groups.length === 0) return articleHtml;

  const renderItem = ({ slug, kind }) => {
    const themeHit = HAS_PAGE.themes.has(slug);
    const beliefHit = HAS_PAGE.beliefs.has(slug);
    if (kind === "theme" && themeHit) {
      return `<a class="chip" href="/wiki/${slug}/">${escHtml(NAV_TITLES[slug] || slug)}</a>`;
    }
    if (kind === "belief" && beliefHit) {
      return `<a class="chip" href="/wiki/beliefs/${slug}/">${escHtml(slug)}</a>`;
    }
    if (kind === "either") {
      if (themeHit) return `<a class="chip" href="/wiki/${slug}/">${escHtml(NAV_TITLES[slug] || slug)}</a>`;
      if (beliefHit) return `<a class="chip" href="/wiki/beliefs/${slug}/">${escHtml(slug)}</a>`;
    }
    return `<span class="chip dead" title="graph node, no page">${escHtml(slug)}</span>`;
  };

  const groupHtml = groups
    .map(
      (g) =>
        `<span class="group"><span class="group-label">${escHtml(g.label)}:</span> ${g.items.map(renderItem).join(", ")}</span>`
    )
    .join('<span class="sep-dot">·</span>');

  const chipStrip = `\n<div class="belief-chips" aria-label="Graph position">${groupHtml}</div>`;
  return articleHtml.replace(/<\/h1>/, `</h1>${chipStrip}`);
}

// Belief tag strip: applies-to domain tags + confidence marker, second row
// under the chip strip. Renders only if frontmatter has either field.
// applies_to lists the domains/topics this belief is relevant to (agent
// matches user-query topic against these to decide which beliefs to retrieve).
// confidence marks the belief's settledness (settled / evolving / contested).
function injectBeliefTags(articleHtml, meta) {
  const tags = normList(meta.applies_to)
    .map((s) => String(s).trim())
    .filter(Boolean);
  const confidence = String(meta.confidence || "").trim().toLowerCase();
  const validConf = ["settled", "evolving", "contested"].includes(confidence);
  if (tags.length === 0 && !validConf) return articleHtml;

  const tagsHtml = tags.length
    ? `<span class="group-label">Applies to:</span> ${tags.map((t) => `<span class="tag">${escHtml(t)}</span>`).join(" ")}`
    : "";
  const confHtml = validConf
    ? `<span class="confidence ${confidence}" title="Belief settledness"><span class="dot"></span>${escHtml(confidence)}</span>`
    : "";
  const stripHtml = `\n<div class="belief-tags" aria-label="Domain tags and confidence">${tagsHtml}${confHtml}</div>`;
  // Insert AFTER the existing chip strip so it sits between chip strip and page-purpose.
  return articleHtml.replace(/<\/div>(\s*<p class="page-purpose")/, `</div>${stripHtml}$1`);
}

// TL;DR quotable assertion: a single-sentence agent-grabbable quote rendered
// in a highlighted block right under the page-purpose. Source: the `quotable`
// frontmatter field, OR the markdown `## TL;DR\n> {quote}` pattern. The agent
// can extract this verbatim for inclusion in answers without rephrasing.
function injectBeliefTldr(articleHtml, meta) {
  const quotable = stripQuotes(String(meta.quotable || "").trim());
  if (!quotable) return articleHtml;
  const tldrHtml = `\n<div class="belief-tldr" aria-label="Quotable assertion"><span class="label">TL;DR</span><p class="quote">${inlineMd(quotable)}</p></div>`;
  // Insert AFTER page-purpose if present, else after </h1>.
  if (articleHtml.includes('class="page-purpose"')) {
    return articleHtml.replace(/(<p class="page-purpose">[^<]*<\/p>)/, `$1${tldrHtml}`);
  }
  return articleHtml.replace(/<\/h1>/, `</h1>${tldrHtml}`);
}

// Pick "next" theme slug in NAV_ORDER, wrapping past root for variety.
function siblingTheme(parentTheme) {
  const idx = NAV_ORDER.indexOf(parentTheme);
  if (idx === -1) return null;
  // Prefer the next theme; if at end, wrap back to first non-root theme.
  const next = idx < NAV_ORDER.length - 1 ? NAV_ORDER[idx + 1] : NAV_ORDER[1];
  return next === parentTheme ? null : next;
}

function buildThemePage(slug, src) {
  const { meta, body } = parseFrontmatter(src);
  const m = pageMeta(meta, slug);
  // Lightweight strip: drop draft traces + Tension + Open Question sections.
  // Then collapse Evidence in the rendered HTML so the page reads as a clean
  // narrative (Core belief + How it formed + What it implies) with evidence
  // available on click.
  let trimmed = stripDraftTraces(body.trim());
  trimmed = stripSections(trimmed, STRIP_THEME);
  let articleHtml = blockMd(trimmed.trim());
  articleHtml = collapseEvidenceHtml(articleHtml);
  articleHtml = injectPagePurpose(articleHtml, m.oneLine);

  // Build Related footer for themes:
  //   - root link (unless this IS root)
  //   - up to 4 child T1 beliefs from frontmatter `beliefs:` list (filtered to existing belief pages)
  //   - 1 sibling theme (next in NAV_ORDER)
  const related = [];
  const isRoot = m.tier === "root" || slug.startsWith("root.");
  if (!isRoot) {
    related.push({
      kind: "root",
      label: "Substance over hype",
      href: "/wiki/root.substance-over-hype/",
    });
  }
  const beliefRefs = normList(meta.beliefs).map(parseBeliefRef);
  let beliefCount = 0;
  for (const ref of beliefRefs) {
    if (HAS_PAGE.beliefs.has(ref.slug) && beliefCount < 4) {
      related.push({
        kind: "belief",
        label: ref.slug,
        href: `/wiki/beliefs/${ref.slug}/`,
      });
      beliefCount++;
    }
  }
  const sib = siblingTheme(slug);
  if (sib && HAS_PAGE.themes.has(sib)) {
    related.push({
      kind: "theme",
      label: NAV_TITLES[sib] || sib,
      href: `/wiki/${sib}/`,
    });
  }
  // Always offer the wiki home + graph as escape routes for wider browsing.
  related.push({ kind: "graph", label: "Knowledge graph", href: "/wiki/graph/" });

  const relatedHtml = renderRelated(related);

  return pageWrap({
    title: m.title,
    description: m.oneLine || `${m.title} - one of twelve themes plus a root in agamarora.second-brain.`,
    canonical: `https://agamarora.com/wiki/${slug}/`,
    schemaType: "Article",
    breadcrumbHtml: `<nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/wiki/">wiki</a><span class="sep">/</span><span>${escHtml(m.title)}</span>
  </nav>`,
    articleHtml: articleHtml + (relatedHtml ? `\n${relatedHtml}` : ""),
    navHtml: themeNav(slug),
  });
}

function buildMetaPage(slug, src) {
  const { meta, body } = parseFrontmatter(src);
  const m = pageMeta(meta, slug);
  const articleHtml = blockMd(body.trim());

  // FAQPage JSON-LD for voice + quotes — pulled from explicit Q&A H2 block
  // added to source drafts during AEO-3.
  const META_FAQ = {
    voice: {
      question: "What does Agam Arora's voice sound like?",
      answer:
        "Four modes, one disposition. The take — bold declarative opener, structured body, zinger close. The four-word reply — Hindi or English compressed comment. The playbook — when someone asks how, hand over the full stack with no gatekeeping. The framework drop — thesis plus numbered slash-format items, dense and practitioner-voiced. No em dashes, no AI-mode words, curly quotes, signatures over substance.",
    },
    quotes: {
      question: "What are Agam Arora's signature lines?",
      answer:
        "Twelve years of LinkedIn posts compressed to roughly seventy verbatim lines. Each one anchors a date and an era. The manifesto theses lead the page — \"We need to kill prompting,\" \"Context > Prompt. Spec > Sprint. Taste > Execution,\" \"The model wasn't broken, the agent layer was.\" Then anti-hype, PM craft, the AI PM lines from 2023 that still hold, enterprise reality, career and learning, aphorisms, closers.",
    },
  };
  const f = META_FAQ[slug];
  const faqPage = f
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer },
          },
        ],
      }
    : null;

  return pageWrap({
    title: m.title,
    description: `${m.title} - meta page in agamarora.second-brain.`,
    canonical: `https://agamarora.com/wiki/${slug}/`,
    schemaType: "WebPage",
    breadcrumbHtml: `<nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/wiki/">wiki</a><span class="sep">/</span><span>${escHtml(m.title)}</span>
  </nav>`,
    articleHtml,
    navHtml: `<nav class="theme-nav"><span></span><a href="/wiki/" class="home">wiki home</a><span></span></nav>`,
    faqPage,
  });
}

function buildBeliefPage(slug, src) {
  const { meta, body } = parseFrontmatter(src);
  const m = pageMeta(meta, slug);
  // Same lightweight strip applied to belief sub-pages: drop Refinement arc +
  // Cross-links sections, drop draft traces, collapse Evidence.
  let trimmed = stripDraftTraces(body.trim());
  trimmed = stripSections(trimmed, STRIP_BELIEF);
  let articleHtml = blockMd(trimmed.trim());
  articleHtml = collapseEvidenceHtml(articleHtml);
  // When a belief has a TL;DR quotable assertion, the TL;DR block carries the
  // "what is this" job and the page-purpose italic block becomes redundant.
  // Skip page-purpose to reduce the above-the-fold density. Keep page-purpose
  // (one_line) in OG/meta description regardless - this only affects body render.
  const hasQuotable = stripQuotes(String(meta.quotable || "").trim()).length > 0;
  if (!hasQuotable) {
    articleHtml = injectPagePurpose(articleHtml, m.oneLine);
  }
  articleHtml = injectBeliefChips(articleHtml, meta);
  articleHtml = injectBeliefTags(articleHtml, meta);
  articleHtml = injectBeliefTldr(articleHtml, meta);

  const parentTheme = (meta.parent_theme || "").trim();
  const parentLink = parentTheme
    ? `<a href="/wiki/${parentTheme}/">${NAV_TITLES[parentTheme] || parentTheme}</a><span class="sep">/</span>`
    : "";

  // Build Related footer for beliefs:
  //   - parent theme (if any)
  //   - up to 4 related_beliefs filtered to existing belief pages
  //   - 1 sibling theme (next of parent in NAV_ORDER) for breadth
  const related = [];
  if (parentTheme && HAS_PAGE.themes.has(parentTheme)) {
    related.push({
      kind: "theme",
      label: NAV_TITLES[parentTheme] || parentTheme,
      href: `/wiki/${parentTheme}/`,
    });
  }
  const refs = normList(meta.related_beliefs);
  let count = 0;
  for (const r of refs) {
    const beliefSlug = String(r).replace(/^belief\./, "").trim();
    if (HAS_PAGE.beliefs.has(beliefSlug) && beliefSlug !== slug && count < 4) {
      related.push({
        kind: "belief",
        label: beliefSlug,
        href: `/wiki/beliefs/${beliefSlug}/`,
      });
      count++;
    }
  }
  const sib = parentTheme ? siblingTheme(parentTheme) : null;
  if (sib && HAS_PAGE.themes.has(sib)) {
    related.push({
      kind: "theme",
      label: NAV_TITLES[sib] || sib,
      href: `/wiki/${sib}/`,
    });
  }
  related.push({ kind: "index", label: "All beliefs", href: "/wiki/beliefs/" });

  const relatedHtml = renderRelated(related);

  // FAQPage JSON-LD: 1 Q&A using title + one_line. AEO-extractable.
  const faqPage = m.oneLine
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What does Agam Arora believe about ${m.title.toLowerCase()}?`,
            "acceptedAnswer": { "@type": "Answer", "text": m.oneLine },
          },
        ],
      }
    : null;

  return pageWrap({
    title: m.title,
    description: m.oneLine || `${m.title} - belief sub-page under ${parentTheme || "wiki"} in agamarora.second-brain.`,
    canonical: `https://agamarora.com/wiki/beliefs/${slug}/`,
    schemaType: "Article",
    // 'beliefs' links to /wiki/beliefs/ landing index (built in same C-struct pass).
    breadcrumbHtml: `<nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/wiki/">wiki</a><span class="sep">/</span><a href="/wiki/beliefs/">beliefs</a><span class="sep">/</span>${parentLink}<span>${escHtml(m.title)}</span>
  </nav>`,
    articleHtml: articleHtml + (relatedHtml ? `\n${relatedHtml}` : ""),
    navHtml: parentTheme
      ? `<nav class="theme-nav"><a href="/wiki/${parentTheme}/">&larr; ${NAV_TITLES[parentTheme] || parentTheme}</a><a href="/wiki/" class="home">wiki home</a><a href="/wiki/beliefs/">All beliefs &rarr;</a></nav>`
      : `<nav class="theme-nav"><span></span><a href="/wiki/" class="home">wiki home</a><a href="/wiki/beliefs/">All beliefs &rarr;</a></nav>`,
    faqPage,
  });
}

// ---------------------------------------------------------------------------
// 7. Main
// ---------------------------------------------------------------------------

let okCount = 0;
let errCount = 0;

function processDir(dir, kind) {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .filter((f) => !ONLY || f === `${ONLY}.md`);
  for (const f of files) {
    const slug = basename(f, ".md");
    let src;
    try {
      src = readFileSync(join(dir, f), "utf8");
    } catch (err) {
      console.error(`[build-wiki] FAIL read ${kind}/${slug}: ${err.code || ""} ${err.message}`);
      errCount++;
      if (STRICT) process.exit(1);
      continue;
    }
    try {
      const html =
        kind === "belief"
          ? buildBeliefPage(slug, src)
          : kind === "meta"
            ? buildMetaPage(slug, src)
            : buildThemePage(slug, src);
      const outDir =
        kind === "belief" ? join(OUT_DIR, "beliefs", slug) : join(OUT_DIR, slug);
      mkdirSync(outDir, { recursive: true });
      const out = join(outDir, "index.html");
      const tmp = `${out}.tmp`;
      writeFileSync(tmp, html);
      renameSync(tmp, out);
      const relPath = kind === "belief" ? `wiki/beliefs/${slug}/index.html` : `wiki/${slug}/index.html`;
      console.log(`[build-wiki] ${kind} ${slug} -> ${relPath} (${html.length} bytes)`);
      okCount++;
    } catch (err) {
      console.error(`[build-wiki] FAIL ${kind}/${slug}: ${err.message}`);
      errCount++;
      if (STRICT) process.exit(1);
    }
  }
}

processDir(THEME_DRAFTS_DIR, "theme");
processDir(BELIEF_DRAFTS_DIR, "belief");
if (existsSync(META_DRAFTS_DIR)) processDir(META_DRAFTS_DIR, "meta");

// ---------------------------------------------------------------------------
// 8. Generated pages from kg.json (projects DAG + graph viz)
// ---------------------------------------------------------------------------
function buildProjectsPage() {
  const kgPath = join(OUT_DIR, "kg.json");
  if (!existsSync(kgPath)) {
    console.log(`[build-wiki] skipping projects page (kg.json missing - run build:kg first)`);
    return;
  }
  let kg;
  try {
    kg = JSON.parse(readFileSync(kgPath, "utf8"));
  } catch (e) {
    console.error(`[build-wiki] FATAL: ${kgPath} is malformed JSON. Run 'npm run build:kg' to regenerate. Underlying error: ${e.message}`);
    process.exit(1);
  }
  const projects = kg.nodes.filter((n) => n.type === "Project" && !n.internal_only);
  const lineage = kg.edges.filter((e) => e.rel === "builds_on");
  const childOf = new Map();
  lineage.forEach((e) => childOf.set(e.from, e.to));
  const labelOf = new Map(projects.map((p) => [p.id, p.label]));

  // Group projects by year band (newest first); fall back to "various" / unknown
  const byYear = projects.slice().sort((a, b) => {
    const ay = (a.year || "").match(/(\d{4})/)?.[1] || "0";
    const by = (b.year || "").match(/(\d{4})/)?.[1] || "0";
    return by.localeCompare(ay);
  });

  const projectRows = byYear
    .map((p) => {
      const parent = childOf.get(p.id);
      const parentLabel = parent ? labelOf.get(parent) || parent : null;
      const tech = (p.tech_stack || p.tech || "").trim();
      const beliefs = (p.beliefs_evidenced || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 4)
        .join(", ");
      return `<tr>
<td><strong>${escHtml(p.label || p.id)}</strong></td>
<td>${escHtml(p.year || "")}</td>
<td>${escHtml(tech) || "<span style=\"opacity:0.5\">-</span>"}</td>
<td>${parentLabel ? `builds on <em>${escHtml(parentLabel)}</em>` : "<span style=\"opacity:0.5\">root</span>"}</td>
<td style="font-size:0.86em;opacity:0.78">${escHtml(beliefs)}</td>
</tr>`;
    })
    .join("\n");

  const articleHtml = `<h1 id="projects">Projects</h1>
<p class="theme-meta"><span class="tier">DAG view</span> &middot; ${projects.length} projects &middot; ${lineage.length} lineage edges &middot; sourced from <a href="/wiki/kg.json">kg.json</a></p>
<p>Twelve years of building. Day-job work is intentionally generic here. Personal projects are the substrate of the ship-the-prototype belief: the prototype is the argument. Every learning project compounds into a top-tier project later.</p>
<p>The lineage column shows the parent project that taught the technique or framework. Read it as a directed acyclic graph, newest at the top.</p>

<div class="md-table-wrap"><table class="md-table">
<thead><tr><th>Project</th><th>Year</th><th>Tech</th><th>Lineage</th><th>Beliefs evidenced</th></tr></thead>
<tbody>
${projectRows}
</tbody></table></div>

<hr>

<p><em>Two day-job projects (internal voice-AI platform + MCP-first enterprise platform) are tracked in <a href="/wiki/kg.json">kg.json</a> as internal-only nodes. The wiki body uses generic phrasing per Decision E3.</em></p>
`;

  const html = pageWrap({
    title: "Projects",
    description: `${projects.length} projects across twelve years. DAG view of lineage and belief evidence in agamarora.second-brain.`,
    canonical: "https://agamarora.com/wiki/projects/",
    schemaType: "WebPage",
    breadcrumbHtml: `<nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/wiki/">wiki</a><span class="sep">/</span><span>Projects</span>
  </nav>`,
    articleHtml,
    navHtml: `<nav class="theme-nav"><span></span><a href="/wiki/" class="home">wiki home</a><a href="/wiki/graph/">Graph &rarr;</a></nav>`,
  });

  const outDir = join(OUT_DIR, "projects");
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, "index.html");
  const tmp = `${out}.tmp`;
  writeFileSync(tmp, html);
  renameSync(tmp, out);
  console.log(`[build-wiki] generated projects -> wiki/projects/index.html (${html.length} bytes)`);
  okCount++;
}

buildProjectsPage();

// /wiki/beliefs/ landing index: 19 T1 beliefs grouped by parent_theme.
function buildBeliefsIndex() {
  // Read all belief drafts -> { slug, title, parent_theme, oneLine }
  const beliefs = [];
  const files = readdirSync(BELIEF_DRAFTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  for (const f of files) {
    const slug = basename(f, ".md");
    const src = readFileSync(join(BELIEF_DRAFTS_DIR, f), "utf8");
    const { meta } = parseFrontmatter(src);
    beliefs.push({
      slug,
      title: stripQuotes(meta.title || slug),
      parent_theme: (meta.parent_theme || "").trim(),
      oneLine: stripQuotes(meta.one_line || ""),
      tier: (meta.tier || "1").toString(),
    });
  }

  // Group by parent_theme in NAV_ORDER. Themes with zero T1 belief pages are skipped.
  const groups = NAV_ORDER.map((theme) => ({
    theme,
    title: NAV_TITLES[theme] || theme,
    items: beliefs
      .filter((b) => b.parent_theme === theme)
      .sort((a, b) => a.title.localeCompare(b.title)),
  })).filter((g) => g.items.length > 0);

  // Catch any orphans (parent_theme not in NAV_ORDER)
  const orphans = beliefs.filter((b) => !NAV_ORDER.includes(b.parent_theme));
  if (orphans.length) {
    groups.push({
      theme: "_orphan",
      title: "Other",
      items: orphans.sort((a, b) => a.title.localeCompare(b.title)),
    });
  }

  const total = beliefs.length;

  const groupBlocks = groups
    .map((g) => {
      const themeHref =
        g.theme === "_orphan" ? null : `/wiki/${g.theme}/`;
      const headingHtml = themeHref
        ? `<h2 id="${g.theme}"><a href="${themeHref}">${escHtml(g.title)}</a></h2>`
        : `<h2 id="other">${escHtml(g.title)}</h2>`;
      const items = g.items
        .map(
          (b) => `<li>
            <a href="/wiki/beliefs/${b.slug}/" class="belief-card-link"><strong>${escHtml(b.title)}</strong></a>
            ${b.oneLine ? `<p class="belief-card-desc">${inlineMd(b.oneLine)}</p>` : ""}
          </li>`
        )
        .join("\n");
      return `${headingHtml}
<ul class="belief-card-list">
${items}
</ul>`;
    })
    .join("\n\n");

  const articleHtml = `<h1 id="beliefs">Beliefs</h1>
<p class="page-purpose">${escHtml(`${total} Tier-1 beliefs grouped by their parent theme. Each one has a sub-page with origin, evidence, and current state. The full graph (themes + Tier-2 / Tier-3 beliefs + projects + posts) lives in the knowledge graph.`)}</p>
<p class="theme-meta"><span class="tier">${total} beliefs</span> &middot; ${groups.filter((g) => g.theme !== "_orphan").length} parent themes &middot; sourced from <a href="/wiki/kg.json">kg.json</a></p>

${groupBlocks}
`;

  // Per-page CSS for belief cards lives on the index only.
  const extraCss = `
  .belief-card-list { list-style: none; padding: 0; margin: 0 0 var(--space-7) 0; display: grid; grid-template-columns: 1fr; gap: var(--space-5); }
  .belief-card-list li { padding: var(--space-5); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); transition: border-color 0.2s; }
  .belief-card-list li:hover { border-color: var(--border-hover); }
  .belief-card-link { color: var(--text); text-decoration: none; border: 0 !important; display: inline-block; margin-bottom: var(--space-3); }
  .belief-card-link strong { color: var(--text); font-weight: 600; font-size: 1.04rem; transition: color 0.2s; }
  .belief-card-list li:hover .belief-card-link strong { color: var(--accent); }
  .belief-card-desc { font-size: 0.92rem !important; line-height: 1.55 !important; color: var(--text-dim) !important; margin: 0 !important; opacity: 0.95 !important; }
  article > h2 { scroll-margin-top: calc(clamp(52px,6vw,64px) + var(--space-5)); }
  article > h2 a { color: var(--text); text-decoration: none; border: 0; transition: color 0.2s; }
  article > h2 a:hover { color: var(--accent); }
`;

  // Inline the extra CSS into the page-level <style> by post-processing the wrap.
  const html = pageWrap({
    title: "Beliefs",
    description: `Index of ${total} Tier-1 beliefs grouped by parent theme in agamarora.second-brain.`,
    canonical: "https://agamarora.com/wiki/beliefs/",
    schemaType: "WebPage",
    breadcrumbHtml: `<nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/wiki/">wiki</a><span class="sep">/</span><span>Beliefs</span>
  </nav>`,
    articleHtml,
    navHtml: `<nav class="theme-nav"><a href="/wiki/">&larr; wiki home</a><a href="/wiki/" class="home">wiki home</a><a href="/wiki/graph/">Graph &rarr;</a></nav>`,
  }).replace(/<\/style>\n<\/head>/, `${extraCss}\n</style>\n</head>`);

  const outDir = join(OUT_DIR, "beliefs");
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, "index.html");
  const tmp = `${out}.tmp`;
  writeFileSync(tmp, html);
  renameSync(tmp, out);
  console.log(`[build-wiki] generated beliefs index -> wiki/beliefs/index.html (${html.length} bytes)`);
  okCount++;
}

buildBeliefsIndex();


function buildGraphPage() {
  const kgPath = join(OUT_DIR, "kg.json");
  if (!existsSync(kgPath)) {
    console.log(`[build-wiki] skipping graph page (kg.json missing - run build:kg first)`);
    return;
  }
  let kg;
  try {
    kg = JSON.parse(readFileSync(kgPath, "utf8"));
  } catch (e) {
    console.error(`[build-wiki] FATAL: ${kgPath} is malformed JSON. Run 'npm run build:kg' to regenerate. Underlying error: ${e.message}`);
    process.exit(1);
  }

  // === Constellation CP-1 — authored sky atlas skeleton ===
  // Aesthetic + spec lives in DESIGN.md ## Constellation graph (locked 2026-04-26).
  // CP-1 = static foundation: genesis + 11 hand-placed theme nodes. No motion, no edges,
  // no deep-field, no big-bang yet. Those land at CP-2..CP-7.

  // Theme positions: hand-tuned (angle°, radF). Genesis at center; 11 themes orbit.
  // NOT a perfect circle — irregular radF gives organic distribution per memorable-thing.
  // Theme radial fractions tightened 2026-04-27 (-15%) so all nodes fit on
  // mobile viewport without pan-scroll. Original spec range was 0.24-0.32 of
  // min(vw,vh); now 0.20-0.27. Genesis still center, organic placement preserved.
  // Labels rewritten 2026-04-27 to be crisp + self-explanatory for first-time
  // visitors — no slugs, no jargon, sentence-case, ≤3 words each.
  const THEMES = [
    { id: 'theme.agent-first',                 slug: 'agent-first',                 label: 'Agent-first AI',     ang: 18,  radF: 0.230 },
    { id: 'theme.ai-pm-skillset',              slug: 'ai-pm-skillset',              label: 'AI PM craft',        ang: 62,  radF: 0.272 },
    { id: 'theme.pm-taste',                    slug: 'pm-taste',                    label: 'PM taste',           ang: 98,  radF: 0.213 },
    { id: 'theme.enterprise-ai-reality',       slug: 'enterprise-ai-reality',       label: 'Enterprise AI',      ang: 138, radF: 0.255 },
    { id: 'theme.voice-ai-craft',              slug: 'voice-ai-craft',              label: 'Voice AI in prod',   ang: 168, radF: 0.230 },
    { id: 'theme.second-brain',                slug: 'second-brain',                label: 'Second brain',       ang: 202, radF: 0.247 },
    { id: 'theme.spec-first-taste',            slug: 'spec-first-taste',            label: 'Spec over sprint',   ang: 232, radF: 0.213 },
    { id: 'theme.breadth-as-differentiation',  slug: 'breadth-as-differentiation',  label: 'Breadth as edge',    ang: 260, radF: 0.264 },
    { id: 'theme.linkedin-as-instrument',      slug: 'linkedin-as-instrument',      label: 'LinkedIn craft',     ang: 288, radF: 0.204 },
    { id: 'theme.career-reflection',           slug: 'career-reflection',           label: 'Career arc',         ang: 318, radF: 0.238 },
    { id: 'theme.personal-projects-tinkering', slug: 'personal-projects-tinkering', label: 'Personal projects',  ang: 348, radF: 0.272 },
  ];

  const totalEntries = (kg.stats.posts || 0) + (kg.stats.comments || 0) + 220; // approximate corpus + uncurated

  // === CP-2: per-theme node distribution from kg.json edges ===
  // Count beliefs (contains-belief), projects+posts+tech (demonstrates / cites-post / etc.) per theme.
  // We need ratios to scatter belief/project/tech/post nodes around their parent theme group.
  const beliefByTheme = {};
  const projectByTheme = {};
  const postByTheme = {};
  const techByTheme = {};
  THEMES.forEach(t => {
    beliefByTheme[t.id] = []; projectByTheme[t.id] = [];
    postByTheme[t.id] = []; techByTheme[t.id] = [];
  });
  const beliefParent = {};
  kg.edges.forEach(e => {
    if (e.rel === 'contains-belief' && e.from.startsWith('theme.') && e.to.startsWith('belief.')) {
      if (beliefByTheme[e.from]) {
        beliefByTheme[e.from].push(e.to);
        beliefParent[e.to] = e.from;
      }
    }
  });
  kg.edges.forEach(e => {
    if (e.rel === 'demonstrates' && e.to.startsWith('theme.') && e.from.startsWith('project.')) {
      if (projectByTheme[e.to]) projectByTheme[e.to].push(e.from);
    }
    if (e.rel === 'cites-post') {
      // belief→post: assign post to belief's parent theme
      const parent = beliefParent[e.from] || (e.from.startsWith('theme.') ? e.from : null);
      if (parent && postByTheme[parent]) postByTheme[parent].push(e.to);
    }
  });
  // Round-robin remaining projects + tech across themes (most aren't directly edge-linked)
  const allProjects = kg.nodes.filter(n => n.type === 'Project').map(n => n.id);
  const allTech = kg.nodes.filter(n => n.type === 'Tech').map(n => n.id);
  const allPosts = kg.nodes.filter(n => n.type === 'Post').map(n => n.id);
  const placedProjects = new Set(Object.values(projectByTheme).flat());
  const placedPosts = new Set(Object.values(postByTheme).flat());
  let rr = 0;
  allProjects.forEach(pid => {
    if (!placedProjects.has(pid)) {
      projectByTheme[THEMES[rr % THEMES.length].id].push(pid);
      rr++;
    }
  });
  allTech.forEach(tid => {
    techByTheme[THEMES[rr % THEMES.length].id].push(tid);
    rr++;
  });
  allPosts.forEach(pid => {
    if (!placedPosts.has(pid)) {
      postByTheme[THEMES[rr % THEMES.length].id].push(pid);
      rr++;
    }
  });
  // Attach counts onto THEMES for JS
  THEMES.forEach(t => {
    t.beliefCount  = beliefByTheme[t.id].length;
    t.projectCount = projectByTheme[t.id].length;
    t.postCount    = postByTheme[t.id].length;
    t.techCount    = techByTheme[t.id].length;
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=5.0,user-scalable=yes">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<title>Graph - Agam Arora's wiki.</title>
<meta name="description" content="Authored constellation of ${kg.stats.nodes_total} graph nodes and ${kg.stats.edges.total} edges across the corpus. Genesis + 11 themes, organic placement, dark-only.">
<meta name="theme-color" content="#0A0A0A">

<meta property="og:type" content="website">
<meta property="og:url" content="https://agamarora.com/wiki/graph/">
<meta property="og:title" content="Graph - Agam Arora's wiki.">
<meta property="og:description" content="Authored constellation. ${kg.stats.nodes_total} nodes, ${kg.stats.edges.total} edges.">
<meta property="og:image" content="https://agamarora.com/assets/og/lab.png">

<link rel="canonical" href="https://agamarora.com/wiki/graph/">
<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/favicon.png" sizes="48x48">
<link rel="manifest" href="/site.webmanifest">

<!-- Preload Patrick Hand so the aa. mark stroke-draw measurement runs against the real font, not the cursive fallback (DESIGN.md ## aa. mark spec) -->
<link rel="preload" as="font" type="font/woff2" href="/fonts/patrick-hand/patrick-hand-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/satoshi/Satoshi-Variable.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/jetbrains-mono/jetbrains-mono-latin.woff2" crossorigin>

<!--
  C-graph implementation status — track CP completion against DESIGN.md ## Constellation graph
  CP-1 ✅ static skeleton: genesis + 11 theme nodes hand-placed, labels w/ quadrant anchor
  CP-2 ✅ deep-field: kg.json beliefs+projects+posts+tech rendered, 578 corpus stars, proximity mesh
  CP-3 ✅ real cross-theme interlinkages: tension-with + superseded_by + refined_by + builds_on + demonstrates edges drawn as curved beziers
  CP-4 ✅ motion vocabulary: twinkle (CSS) + Lissajous theme drift + signal pulses (5 cadences) + cross-edge recompute per frame
  CP-5 ✅ big-bang single-origin entry (1.8s easeOutQuint) + parallax bg w/ 220 stars + theme echo halos + lerp-based mouse/touch drift
  CP-6 ✅ pan/zoom (cmd-wheel + drag desktop, pinch touch) + bounds clamp + double-click recenter + fullscreen toggle + responsive mobile sizing
  CP-7 ✅ keyboard a11y (Tab cycles themes, Enter navigates, Esc home) + layered visibility on hover + 13-invariant verification
-->

<style>
${SHARED_CHROME_CSS}

  /* Graph-specific overrides on top of the shared chrome.
     Single source of truth for fonts, tokens, reset, header, icon-bar, aa-mark
     lives in scripts/lib/chrome.mjs. Everything below is graph-only. */
  :root { --bg-deep:#050810; }
  html,body{width:100%;height:100%;overflow:hidden;}
  body{
    background:radial-gradient(ellipse at 50% 50%, var(--bg-deep) 0%, var(--bg) 70%, #000 100%);
    position:relative;
  }
  body::before{
    content:'';position:fixed;inset:0;pointer-events:none;z-index:1;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
    opacity:0.025;mix-blend-mode:screen;
  }
  /* Override: graph header has fullscreen button on the right, needs space-between. */
  header.site-header{justify-content:space-between;}

  .fs-btn{background:transparent;border:1px solid rgba(232,228,223,0.2);color:var(--text);font-family:var(--mono);font-size:11px;letter-spacing:0.05em;padding:6px 12px;border-radius:4px;cursor:pointer;opacity:0.6;transition:opacity 0.15s,border-color 0.15s,color 0.15s;}
  .fs-btn:hover{opacity:1;border-color:var(--accent);color:var(--accent);}

  /* Pan/zoom interactivity */
  svg.canvas{touch-action:none;}
  svg.canvas.panning{cursor:grabbing;}
  svg.canvas.zoomable{cursor:grab;}

  /* Help strip moved BELOW header zone (header is up to ~64px) so it stops getting hidden */
  .help-strip{position:fixed;top:calc(clamp(52px,6vw,64px) + 12px);left:24px;z-index:90;font-family:var(--mono);font-size:10px;color:var(--text-dim);opacity:0.5;letter-spacing:0.04em;}
  .help-strip a{color:var(--text-dim);text-decoration:none;border-bottom:1px dashed rgba(232,228,223,0.15);transition:color 0.2s,border-color 0.2s;}
  .help-strip a:hover{color:var(--accent);border-color:var(--accent);}
  /* Caption: real corpus scale below header on right side. */
  .caption{position:fixed;top:calc(clamp(52px,6vw,64px) + 12px);right:24px;z-index:90;font-family:var(--mono);font-size:11px;color:var(--text);opacity:0.6;letter-spacing:0.04em;text-align:right;max-width:calc(100vw - 48px);}

  .legend-strip{position:fixed;bottom:84px;left:24px;z-index:50;font-family:var(--mono);font-size:10px;color:var(--text-dim);opacity:0.5;letter-spacing:0.04em;line-height:1.7;}
  .legend-strip .swatch{display:inline-block;border-radius:50%;vertical-align:middle;margin-right:6px;}
  .legend-strip .gold{background:var(--accent);width:8px;height:8px;box-shadow:0 0 6px rgba(229,165,75,0.6);}
  .legend-strip .genesis{background:var(--accent);width:11px;height:11px;box-shadow:0 0 10px rgba(229,165,75,0.7);}

  /* Entry CTAs — graph as public landing path. Bottom-center, low priority,
     does not crowd aa-mark (right) / legend-strip (left). */
  .entry-ctas{position:fixed;bottom:32px;left:50%;transform:translateX(-50%);z-index:50;display:flex;gap:10px;align-items:center;}
  .entry-ctas a{font-family:var(--mono);font-size:11px;letter-spacing:0.05em;text-transform:lowercase;color:var(--text);background:rgba(10,10,10,0.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(232,228,223,0.2);border-radius:4px;padding:7px 14px;text-decoration:none;opacity:0.7;transition:opacity 0.2s,border-color 0.2s,color 0.2s;}
  .entry-ctas a:hover{opacity:1;border-color:var(--accent);color:var(--accent);}
  .entry-ctas a .arr{opacity:0.5;margin-left:6px;}
  @media (max-width:480px){.entry-ctas{bottom:20px;gap:6px;}.entry-ctas a{font-size:10px;padding:6px 10px;letter-spacing:0.04em;}}


  /* Two-layer SVG: parallax bg (dim, future CP-5) + interactive constellation foreground */
  svg.parallax-bg{position:fixed;inset:0;width:100vw;height:100vh;z-index:1;display:block;pointer-events:none;}
  svg.canvas{position:fixed;inset:0;width:100vw;height:100vh;z-index:2;display:block;}

  text{font-family:var(--sans);user-select:none;}
  .theme-label{font-family:var(--sans);font-weight:500;font-size:11px;letter-spacing:0.07em;text-transform:lowercase;fill:rgba(232,228,223,0.62);}
  .genesis-label{font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:lowercase;fill:rgba(229,165,75,0.85);}
  .genesis-sublabel{font-family:var(--mono);font-size:9px;fill:rgba(229,165,75,0.5);letter-spacing:0.06em;}

  /* Genesis halo pulse — origin alive */
  @keyframes core-pulse{0%,100%{opacity:0.55;}50%{opacity:0.85;}}
  .genesis-halo{animation:core-pulse 5s ease-in-out infinite;}

  /* CP-4 motion: twinkle on theme stars + dim corpus stars (CSS animation, GPU-accelerated) */
  @keyframes star-twinkle{0%,100%{opacity:1;}50%{opacity:0.78;}}
  .theme-node{animation:star-twinkle 4.5s ease-in-out infinite;}

  /* Tension chord shimmer (subset of cross-edges with stroke-dasharray) */
  @keyframes chord-shimmer{0%{stroke-dashoffset:0;}100%{stroke-dashoffset:-30;}}
  .cross-edge[data-rel="tension-with"]{animation:chord-shimmer 22s linear infinite;}
  .cross-edge[data-rel="superseded_by"]{animation:chord-shimmer 18s linear infinite;}
  .cross-edge[data-rel="refined_by"]{animation:chord-shimmer 18s linear infinite;}

  /* Signal pulse: gold dot traveling along edges */
  .signal-pulse{fill:var(--accent);filter:drop-shadow(0 0 5px rgba(229,165,75,0.85));pointer-events:none;}
  .signal-pulse-white{fill:rgba(232,228,223,0.55);filter:drop-shadow(0 0 3px rgba(232,228,223,0.3));pointer-events:none;}

  /* Parallax bg star twinkle — slower, dimmer than foreground */
  @keyframes bg-twinkle{0%,100%{opacity:var(--bg-base,0.15);}50%{opacity:calc(var(--bg-base,0.15) * 1.7);}}
  .bg-star{animation:bg-twinkle 8s ease-in-out infinite;}

  .theme-node{cursor:pointer;transition:filter 0.2s;}
  .theme-node:hover{filter:drop-shadow(0 0 12px rgba(229,165,75,0.8));}
  .theme-group:hover .theme-label{fill:var(--accent);}
  .genesis-core{cursor:pointer;transition:filter 0.2s;}
  .genesis-core:hover{filter:drop-shadow(0 0 16px rgba(229,165,75,0.95));}

  .belief-node{cursor:pointer;transition:fill 0.15s,r 0.15s;}
  .belief-node:hover{fill:var(--accent) !important;}
  .deep-mesh-line{pointer-events:none;}

  /* CP-7: keyboard focus rings */
  .theme-group:focus, .genesis-core:focus, .belief-node:focus{outline:none;}
  .theme-group:focus-visible .theme-node{stroke:var(--accent);stroke-width:2;}
  .theme-group:focus-visible .theme-label{fill:var(--accent);}
  .genesis-core:focus-visible{stroke:var(--accent);stroke-width:2;}
  .belief-node:focus-visible{stroke:var(--accent);stroke-width:1.5;}

  /* CP-7: layered visibility on theme hover/focus — connected cross-edges light up */
  .cross-edge{transition:stroke 0.15s,stroke-width 0.15s,opacity 0.15s;}
  .cross-edge.highlit{stroke:rgba(229,165,75,0.32) !important;stroke-width:0.8 !important;stroke-dasharray:2 4 !important;}
  .cross-edge.dimmed{opacity:0.12 !important;}

  /* Mobile chrome: aggressive hide to prevent overlap. Only essentials remain. */
  @media (max-width: 768px){
    .legend-strip{display:none;}
    .help-strip{display:none;}
    .caption{font-size:10px;}
    .fs-btn{font-size:10px;padding:5px 9px;}
  }
  @media (max-width: 480px){
    /* Smallest devices: drop caption too, keep only icon-bar + aa. mark + fs-btn */
    .caption{display:none;}
  }
</style>
</head>
<body>

${SVG_SPRITE}

<header class="site-header">
  <div class="icon-bar">
    <a href="https://github.com/agamarora" target="_blank" rel="noopener" aria-label="GitHub"><svg class="icon" aria-hidden="true"><use href="#i-github"/></svg></a>
    <a href="https://linkedin.com/in/agamarora" target="_blank" rel="noopener" aria-label="LinkedIn"><svg class="icon" aria-hidden="true"><use href="#i-linkedin"/></svg></a>
    <a href="https://www.youtube.com/@agam_arora" target="_blank" rel="noopener" aria-label="YouTube"><svg class="icon" aria-hidden="true"><use href="#i-youtube"/></svg></a>
    <a href="/resume" aria-label="Resume"><svg class="icon" aria-hidden="true"><use href="#i-file-lines"/></svg></a>
    <a href="/" aria-label="Home"><svg class="icon" aria-hidden="true"><use href="#i-house"/></svg></a>
  </div>
  <button class="fs-btn" id="fs-btn" type="button" aria-label="Toggle fullscreen">⛶ fullscreen</button>
</header>

${SHARED_AAMARK_HTML}

<div class="help-strip"><a href="/wiki/themes/">themes</a> › graph</div>
<div class="caption">${totalEntries}+ entries · ${kg.stats.nodes_total} graph nodes · ${kg.stats.edges.total} edges</div>

<div class="legend-strip">
  <div><span class="swatch genesis"></span>genesis · agam.arora</div>
  <div><span class="swatch gold"></span>theme</div>
  <div style="font-size:9px;opacity:0.85;margin-top:2px;">belief · project · post · tech</div>
</div>

<nav class="entry-ctas" aria-label="Wiki entry">
  <a href="/wiki/themes/">read the wiki<span class="arr">→</span></a>
  <a href="/enter">talk to the agent<span class="arr">→</span></a>
</nav>

<!-- LAYER 0: parallax background (CP-5 will populate; reserved here) -->
<svg class="parallax-bg" id="parallax-bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"></svg>

<!-- LAYER 1: interactive constellation foreground -->
<svg class="canvas" id="constellation" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Knowledge graph constellation: genesis at center, 11 themes orbiting"></svg>

<!-- AEO-11 / M2: noscript fallback. AI crawlers without JS execution
     (and any user with JS disabled) get a text-equivalent of the constellation:
     genesis brand label + the 11 themes as an HTML link list. Bots with JS
     execute the big-bang animation and index the rendered graph. -->
<noscript>
  <section class="graph-noscript" aria-label="Knowledge graph text equivalent">
    <h2>agam.arora &mdash; second brain</h2>
    <p>Authored constellation of ${kg.stats.nodes_total} nodes and ${kg.stats.edges.total} edges. The interactive graph requires JavaScript; the eleven themes orbiting the genesis are listed below.</p>
    <ul>
${THEMES.map(t => `      <li><a href="/wiki/${t.slug}/">${escHtml(t.label)}</a></li>`).join('\n')}
    </ul>
    <p><a href="/wiki/themes/">Browse themes</a> &middot; <a href="/wiki/beliefs/">All beliefs</a> &middot; <a href="/wiki/projects/">Projects DAG</a></p>
  </section>
</noscript>

<script>
${AAMARK_SCRIPT}

(function(){
  // === Constellation CP-1: static genesis + 11 themes ===
  const THEMES = ${JSON.stringify(THEMES)};
  const VB_W = 1600, VB_H = 900;
  const CX = VB_W / 2, CY = VB_H / 2;
  const VB_MIN = Math.min(VB_W, VB_H);

  function polar(cx, cy, r, deg){
    const a = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('constellation');
  function el(tag, attrs, parent){
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(e);
    return e;
  }

  // Compute base positions for each theme.
  // Mobile (≤480px viewport): pull themes another 10% closer to genesis so the
  // tight-cluster reads even cleaner on small portrait screens. Desktop unchanged.
  const mobileShrink = (typeof window !== 'undefined' && Math.min(window.innerWidth, window.innerHeight) <= 480) ? 0.9 : 1.0;
  THEMES.forEach(t => {
    const r = VB_MIN * t.radF * mobileShrink;
    const p = polar(CX, CY, r, t.ang);
    t.x = p.x;
    t.y = p.y;
  });

  // === Z-order discipline ===
  // deep-field group FIRST (renders beneath everything; populated at end of CP-2)
  // genesis NEXT (center anchor, above deep-field)
  // theme groups LAST (each contains belief-cluster sub-group rendered FIRST inside the
  // group so beliefs/projects/posts/tech sit beneath the gold star within the cluster)
  // CP-2 appends deep-field stars + mesh to the early-created group so DOM order = z-order.

  // CP-2 deep-field rng + deepFieldGroup created BEFORE genesis so it sits at the back.
  function mulberry32(seed){
    return function(){
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const deepFieldGroup = el('g', { id:'deep-field' });
  const deepFieldPositions = [];
  function deepStar(x, y, r, opacity){
    const c = el('circle', { cx:x.toFixed(2), cy:y.toFixed(2), r:r.toFixed(2), fill:'rgba(232,228,223,'+opacity.toFixed(3)+')' }, deepFieldGroup);
    deepFieldPositions.push({ x, y });
    return c;
  }

  // === CP-5: parallax bg layer population ===
  // 220 dim background stars + faint gold echo halos at theme positions.
  // Wrapped in bgRoot for entry-scale + bgGroup for parallax-translate (nested transforms).
  const bgSvg = document.getElementById('parallax-bg');
  const bgRoot = document.createElementNS(NS, 'g');
  const bgGroup = document.createElementNS(NS, 'g');
  bgRoot.appendChild(bgGroup);
  bgSvg.appendChild(bgRoot);

  const bgRng = mulberry32(7777);
  for (let i = 0; i < 220; i++){
    const x = bgRng() * VB_W;
    const y = bgRng() * VB_H;
    const r = 0.4 + bgRng() * 1.6;
    const op = 0.06 + bgRng() * 0.18;
    const star = document.createElementNS(NS, 'circle');
    star.setAttribute('cx', x);
    star.setAttribute('cy', y);
    star.setAttribute('r', r);
    star.setAttribute('fill', bgRng() < 0.85 ? 'rgba(232,228,223,'+op+')' : 'rgba(229,165,75,'+(op*0.9)+')');
    star.setAttribute('class', 'bg-star');
    star.style.setProperty('--bg-base', op);
    star.style.animationDelay = '-' + (bgRng() * 8).toFixed(2) + 's';
    bgGroup.appendChild(star);
  }
  // Faint echo halos at theme positions (offset to feel like "depth" reverb)
  THEMES.forEach(t => {
    const r = VB_MIN * t.radF;
    const p = polar(CX, CY, r, t.ang);
    const ex = p.x + 30, ey = p.y - 20;
    const halo = document.createElementNS(NS, 'circle');
    halo.setAttribute('cx', ex); halo.setAttribute('cy', ey);
    halo.setAttribute('r', 14);
    halo.setAttribute('fill', 'rgba(229,165,75,0.025)');
    bgGroup.appendChild(halo);
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', ex); dot.setAttribute('cy', ey);
    dot.setAttribute('r', 3.5);
    dot.setAttribute('fill', 'rgba(229,165,75,0.10)');
    bgGroup.appendChild(dot);
  });

  // Parallax drift via mouse / touch — lerp-based, target offset ±18px in viewBox space.
  let parallaxTargetX = 0, parallaxTargetY = 0, parallaxX = 0, parallaxY = 0;
  const PARALLAX_STRENGTH = 18;
  document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) - 0.5;
    const ny = (e.clientY / window.innerHeight) - 0.5;
    parallaxTargetX = -nx * PARALLAX_STRENGTH;
    parallaxTargetY = -ny * PARALLAX_STRENGTH;
  });
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length === 0) return;
    const t = e.touches[0];
    const nx = (t.clientX / window.innerWidth) - 0.5;
    const ny = (t.clientY / window.innerHeight) - 0.5;
    parallaxTargetX = -nx * PARALLAX_STRENGTH;
    parallaxTargetY = -ny * PARALLAX_STRENGTH;
  }, { passive: true });

  // === Render: genesis at center ===
  // Halos (concentric, alpha cascade)
  [
    { r:50, fill:'rgba(229,165,75,0.035)' },
    { r:36, fill:'rgba(229,165,75,0.06)'  },
    { r:24, fill:'rgba(229,165,75,0.12)'  },
    { r:16, fill:'rgba(229,165,75,0.22)'  },
  ].forEach(h => el('circle', { cx:CX, cy:CY, r:h.r, fill:h.fill, class:'genesis-halo' }));

  // Genesis core — clickable + keyboard accessible, navigates to wiki home
  const genesisCore = el('circle', {
    cx:CX, cy:CY, r:11, fill:'#E5A54B', class:'genesis-core',
    tabindex:'0', role:'button',
    'aria-label':'agam.arora root — open wiki home',
  });
  genesisCore.style.cursor = 'pointer';
  genesisCore.addEventListener('click', () => { window.location.href = '/wiki/root.substance-over-hype/'; });
  genesisCore.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); window.location.href = '/wiki/root.substance-over-hype/'; }
  });

  // Genesis label + sublabel
  el('text', { x:CX, y:CY + 32, 'text-anchor':'middle', class:'genesis-label' }).textContent = 'agam.arora';
  el('text', { x:CX, y:CY + 50, 'text-anchor':'middle', class:'genesis-sublabel' }).textContent = 'second brain';

  // === Render: 11 theme nodes ===
  THEMES.forEach((t, ti) => {
    const g = el('g', {
      class:'theme-group',
      'data-theme':t.id,
      transform:'translate(' + t.x.toFixed(2) + ' ' + t.y.toFixed(2) + ')',
      tabindex:'0',
      role:'button',
      'aria-label':'theme: ' + t.label + ' — open /wiki/' + t.slug + '/',
    });
    g.style.cursor = 'pointer';
    g.addEventListener('click', (ev) => {
      // Don't navigate if click landed on an inner belief node (it has its own handler)
      if (ev.target.classList && ev.target.classList.contains('belief-node')) return;
      window.location.href = '/wiki/' + t.slug + '/';
    });
    g.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); window.location.href = '/wiki/' + t.slug + '/'; }
    });

    // Belief-cluster sub-group — created FIRST so beliefs/projects/posts/tech (CP-2 appends here)
    // render BENEATH the theme halos + star within this group.
    el('g', { 'data-belief-cluster':t.id }, g);

    // Concentric halos (drawn above belief cluster)
    el('circle', { cx:0, cy:0, r:18, fill:'rgba(229,165,75,0.07)' }, g);
    el('circle', { cx:0, cy:0, r:11, fill:'rgba(229,165,75,0.16)' }, g);

    // The star (always on top within group)
    el('circle', { cx:0, cy:0, r:8.5, fill:'#E5A54B', class:'theme-node' }, g);

    // Theme label — just outside node halo, radial baseline, quadrant-aware anchor.
    // 22 = ~3 units outside outermost halo (r=18), legible without floating away.
    const labelP = polar(0, 0, 22, t.ang);
    let anchor = 'middle', baseDx = 0, baseDy = 3;
    if (t.ang > 12 && t.ang < 168){ anchor = 'start'; baseDx = 4; }
    else if (t.ang > 192 && t.ang < 348){ anchor = 'end'; baseDx = -4; }
    if (t.ang <= 12 || t.ang >= 348) baseDy = -6;
    if (t.ang >= 168 && t.ang <= 192) baseDy = 12;
    el('text', {
      x: (labelP.x + baseDx).toFixed(2),
      y: (labelP.y + baseDy).toFixed(2),
      'text-anchor': anchor,
      class:'theme-label',
    }, g).textContent = t.label;
  });

  // === CP-2: Per-theme inner-cluster render ===
  // Each theme group has a [data-belief-cluster] sub-group reserved during theme render
  // (z-order: cluster sits BENEATH theme halos + star).
  const beliefClusters = {};
  THEMES.forEach((t) => {
    beliefClusters[t.id] = svg.querySelector('g[data-theme="' + t.id + '"] g[data-belief-cluster="' + t.id + '"]');
  });

  const beliefByTheme = ${JSON.stringify(beliefByTheme)};
  const projectByTheme = ${JSON.stringify(projectByTheme)};
  const postByTheme = ${JSON.stringify(postByTheme)};
  const techByTheme = ${JSON.stringify(techByTheme)};

  // beliefId -> wiki page slug (for click-through)
  // (only Tier-1 beliefs have pages; others are graph nodes only)
  const beliefSlug = {};
  ${(() => {
    const beliefs = kg.nodes.filter(n => n.type === 'Belief');
    return beliefs.map(b => `beliefSlug[${JSON.stringify(b.id)}] = ${JSON.stringify(String(b.tier) === '1' ? b.id.replace(/^belief\./,'') : null)};`).join('\n  ');
  })()}

  // Position map for CP-3 cross-theme edge rendering: nodeId -> { x, y } in canvas space.
  // For non-theme nodes (beliefs/projects/posts/tech) we ALSO record the offset relative
  // to their parent theme so the animation loop can recompute world position each frame
  // when themes drift via Lissajous. Without this, cross-edges to non-theme endpoints
  // point at stale (init-time) positions and pulses appear to fly off into deep field.
  const nodeWorldPos = {};
  const nodeOffsets = {}; // nodeId -> { themeId, ox, oy }
  // Theme positions are already known
  THEMES.forEach(t => { nodeWorldPos[t.id] = { x: t.x, y: t.y }; });

  THEMES.forEach((t, ti) => {
    const cluster = beliefClusters[t.id];
    if (!cluster) return;
    const rng = mulberry32(t.ang * 1000 + ti * 31 + 13);

    // 1. Beliefs — irregular halo at jittered angle/radius (radii 22/28/34/40/46 ± 4)
    const beliefs = beliefByTheme[t.id] || [];
    beliefs.forEach((bid, bi) => {
      const baseA = (360 / Math.max(beliefs.length, 1)) * bi;
      const jitterA = (rng() - 0.5) * 40;
      const a = baseA + jitterA;
      const radiiPool = [22, 28, 34, 40, 46];
      const r = radiiPool[Math.floor(rng() * radiiPool.length)] + (rng() - 0.5) * 8;
      const p = polar(0, 0, r, a);
      const slug = beliefSlug[bid];
      const node = el('circle', {
        cx:p.x.toFixed(2), cy:p.y.toFixed(2), r:3.4,
        fill:'rgba(232,228,223,0.55)',
        class:'belief-node',
        'data-id':bid,
      }, cluster);
      if (slug) {
        node.style.cursor = 'pointer';
        node.addEventListener('click', (ev) => {
          ev.stopPropagation();
          window.location.href = '/wiki/beliefs/' + slug + '/';
        });
      }
      nodeWorldPos[bid] = { x: t.x + p.x, y: t.y + p.y };
      nodeOffsets[bid] = { themeId: t.id, ox: p.x, oy: p.y };
    });

    // 2. Projects — placed slightly farther out, mid-bright
    const projects = projectByTheme[t.id] || [];
    projects.forEach((pid, pi) => {
      const baseA = (360 / Math.max(projects.length, 1)) * pi + 18;
      const a = baseA + (rng() - 0.5) * 40;
      const r = 50 + rng() * 24;
      const p = polar(0, 0, r, a);
      el('circle', {
        cx:p.x.toFixed(2), cy:p.y.toFixed(2), r:(2.2 + rng()*0.6).toFixed(2),
        fill:'rgba(232,228,223,'+(0.42 + rng()*0.18).toFixed(3)+')',
        'data-id':pid,
      }, cluster);
      nodeWorldPos[pid] = { x: t.x + p.x, y: t.y + p.y };
      nodeOffsets[pid] = { themeId: t.id, ox: p.x, oy: p.y };
    });

    // 3. Posts — small, dim, scattered in theme wedge
    const posts = postByTheme[t.id] || [];
    posts.forEach((pid, pi) => {
      const a = (rng() - 0.5) * 70;
      const r = 60 + rng() * 38;
      const p = polar(0, 0, r, a);
      el('circle', {
        cx:p.x.toFixed(2), cy:p.y.toFixed(2), r:(1.2 + rng()*0.5).toFixed(2),
        fill:'rgba(232,228,223,'+(0.25 + rng()*0.15).toFixed(3)+')',
        'data-id':pid,
      }, cluster);
      nodeWorldPos[pid] = { x: t.x + p.x, y: t.y + p.y };
      nodeOffsets[pid] = { themeId: t.id, ox: p.x, oy: p.y };
    });

    // 4. Tech — smallest, dimmest, scattered in wedge
    const tech = techByTheme[t.id] || [];
    tech.forEach((tid, tii) => {
      const a = (rng() - 0.5) * 90;
      const r = 35 + rng() * 50;
      const p = polar(0, 0, r, a);
      el('circle', {
        cx:p.x.toFixed(2), cy:p.y.toFixed(2), r:(1.0 + rng()*0.4).toFixed(2),
        fill:'rgba(232,228,223,'+(0.18 + rng()*0.14).toFixed(3)+')',
        'data-id':tid,
      }, cluster);
      nodeWorldPos[tid] = { x: t.x + p.x, y: t.y + p.y };
      nodeOffsets[tid] = { themeId: t.id, ox: p.x, oy: p.y };
    });
  });

  // === CP-3: Real cross-theme interlinkage edges ===
  // Render kg.json edges where endpoints land in DIFFERENT theme groups, plus theme-theme tensions.
  // Edge types we render (real semantic relationships only):
  //   - tension-with (theme↔theme productive friction): gold dashed chord through center
  //   - superseded_by + refined_by (belief evolution arcs): gold dashed
  //   - builds_on (project lineage): warm-white solid hairline
  //   - demonstrates (project↔theme evidence): white dim
  // Skipped: contains-belief (implicit in cluster), cites-post (113 = too dense, implicit)
  const CROSS_EDGES = ${JSON.stringify(
    kg.edges.filter(e =>
      ['tension-with','superseded_by','refined_by','builds_on','demonstrates'].includes(e.rel)
    ).map(e => ({ from: e.from, to: e.to, rel: e.rel }))
  )};

  // Insert cross-edges in their own group, BENEATH theme-groups but ABOVE deep-field/genesis halos
  // We append the group to the DOM AFTER deepFieldGroup but want it BENEATH theme groups.
  // Trick: insert the group BEFORE the first theme-group child of svg.
  const crossEdgeGroup = document.createElementNS(NS, 'g');
  crossEdgeGroup.setAttribute('id', 'cross-edges');
  const firstThemeGroup = svg.querySelector('g.theme-group');
  if (firstThemeGroup) svg.insertBefore(crossEdgeGroup, firstThemeGroup);
  else svg.appendChild(crossEdgeGroup);

  function styleForRel(rel){
    // Subtler 2026-04-27: white edges dropped ~40% alpha so they read as
    // atmosphere, not foreground structure. Gold (semantic) edges unchanged.
    if (rel === 'tension-with')  return { stroke: 'rgba(229,165,75,0.16)', dasharray: '2 6', width: '0.6' };
    if (rel === 'superseded_by') return { stroke: 'rgba(229,165,75,0.32)', dasharray: '3 5', width: '0.7' };
    if (rel === 'refined_by')    return { stroke: 'rgba(229,165,75,0.32)', dasharray: '3 5', width: '0.7' };
    if (rel === 'builds_on')     return { stroke: 'rgba(232,228,223,0.10)', dasharray: '',    width: '0.4' };
    if (rel === 'demonstrates')  return { stroke: 'rgba(232,228,223,0.06)', dasharray: '',    width: '0.35' };
    return { stroke: 'rgba(232,228,223,0.05)', dasharray: '', width: '0.35' };
  }

  let renderedEdges = 0;
  CROSS_EDGES.forEach(edge => {
    const a = nodeWorldPos[edge.from];
    const b = nodeWorldPos[edge.to];
    if (!a || !b) return; // endpoint not rendered (e.g. floating belief not in any theme)
    // Only render if endpoints are in DIFFERENT theme groups OR theme↔theme directly.
    // We always render theme-theme (tension-with) regardless.
    const sty = styleForRel(edge.rel);
    // Curve control point pulled toward genesis center for organic arc through interior
    const mx = (a.x + b.x)/2 + (CX - (a.x + b.x)/2) * 0.45;
    const my = (a.y + b.y)/2 + (CY - (a.y + b.y)/2) * 0.45;
    const path = el('path', {
      d: 'M ' + a.x.toFixed(2) + ' ' + a.y.toFixed(2) + ' Q ' + mx.toFixed(2) + ' ' + my.toFixed(2) + ' ' + b.x.toFixed(2) + ' ' + b.y.toFixed(2),
      stroke: sty.stroke,
      'stroke-width': sty.width,
      'stroke-dasharray': sty.dasharray,
      fill: 'none',
      'data-rel': edge.rel,
      'data-from': edge.from,
      'data-to': edge.to,
      class: 'cross-edge',
    }, crossEdgeGroup);
    renderedEdges++;
  });
  console.log('[constellation] rendered ' + renderedEdges + ' cross-cluster edges');

  // === Theme spokes: theme node → its own children (beliefs/projects/posts/tech) ===
  // Hidden by default; revealed only when the parent theme is hovered. These are intra-cluster
  // visual links — not in CROSS_EDGES (which are cross-cluster only). Drawn beneath theme groups
  // so theme dots sit on top. Tiered alpha by child kind so beliefs/projects read first,
  // posts/tech recede.
  const spokeGroup = document.createElementNS(NS, 'g');
  spokeGroup.setAttribute('id', 'theme-spokes');
  if (firstThemeGroup) svg.insertBefore(spokeGroup, firstThemeGroup);
  else svg.appendChild(spokeGroup);

  function spokeStyleFor(nid){
    if (nid.startsWith('belief.'))  return { stroke: 'rgba(229,165,75,0.42)', width: '0.7', dash: '2 4' };
    if (nid.startsWith('project.')) return { stroke: 'rgba(229,165,75,0.30)', width: '0.6', dash: '2 4' };
    if (nid.startsWith('post.'))    return { stroke: 'rgba(229,165,75,0.20)', width: '0.5', dash: '2 4' };
    if (nid.startsWith('tech.'))    return { stroke: 'rgba(229,165,75,0.16)', width: '0.45', dash: '2 4' };
    return { stroke: 'rgba(229,165,75,0.20)', width: '0.5', dash: '2 4' };
  }
  const spokeRefs = [];
  for (const nid in nodeOffsets) {
    const off = nodeOffsets[nid];
    const tp = nodeWorldPos[off.themeId];
    const cp = nodeWorldPos[nid];
    if (!tp || !cp) continue;
    const sty = spokeStyleFor(nid);
    const path = el('path', {
      d: 'M ' + tp.x.toFixed(2) + ' ' + tp.y.toFixed(2) + ' L ' + cp.x.toFixed(2) + ' ' + cp.y.toFixed(2),
      stroke: sty.stroke,
      'stroke-width': sty.width,
      'stroke-dasharray': sty.dash,
      fill: 'none',
      class: 'theme-spoke',
      'data-theme': off.themeId,
    }, spokeGroup);
    path.style.opacity = '0';
    path.style.transition = 'opacity 0.15s';
    spokeRefs.push({ path: path, themeId: off.themeId, childId: nid });
  }

  // === CP-2: Uncurated corpus deep-field (295 posts + 283 comments = 578 stars) ===
  // These are ATMOSPHERIC density — they live OUTSIDE theme groups, fixed in canvas space,
  // representing the raw corpus we synthesized from. Mostly uniform with weak theme bias —
  // so when theme constellation tightens, atmosphere stays full-canvas (revised 2026-04-27).
  const dfRng = mulberry32(424242);

  // 295 corpus posts (mid-density). 30% theme-biased, 70% uniform across canvas.
  for (let i = 0; i < 295; i++){
    const themeBias = dfRng() < 0.30;
    let x, y;
    if (themeBias){
      const t = THEMES[Math.floor(dfRng() * THEMES.length)];
      const baseR = VB_MIN * t.radF;
      const aOff = (dfRng() - 0.5) * 90;
      // rFac 0.6-2.0 of baseR — themed stars now extend further outward
      // so they reach the canvas edges and avoid the gap-around-cluster look.
      const rFac = 0.6 + dfRng() * 1.4;
      const p = polar(CX, CY, baseR * rFac, t.ang + aOff);
      x = p.x; y = p.y;
    } else {
      x = 40 + dfRng() * (VB_W - 80);
      y = 40 + dfRng() * (VB_H - 80);
    }
    const dx = x - CX, dy = y - CY;
    if (Math.sqrt(dx*dx + dy*dy) < 55) continue;  // don't crowd the genesis
    // Clamp to canvas (some themed stars at large rFac may overshoot)
    if (x < 30 || x > VB_W - 30 || y < 30 || y > VB_H - 30) continue;
    deepStar(x, y, 1.1 + dfRng() * 0.7, 0.20 + dfRng() * 0.20);
  }

  // 283 corpus comments (smaller, dimmer). 25% theme-biased, 75% uniform.
  for (let i = 0; i < 283; i++){
    let x, y;
    if (dfRng() < 0.25){
      const t = THEMES[Math.floor(dfRng() * THEMES.length)];
      const baseR = VB_MIN * t.radF;
      const aOff = (dfRng() - 0.5) * 110;
      const rFac = 0.6 + dfRng() * 1.6;
      const p = polar(CX, CY, baseR * rFac, t.ang + aOff);
      x = p.x; y = p.y;
    } else {
      x = 30 + dfRng() * (VB_W - 60);
      y = 30 + dfRng() * (VB_H - 60);
    }
    const dx = x - CX, dy = y - CY;
    if (Math.sqrt(dx*dx + dy*dy) < 45) continue;
    if (x < 20 || x > VB_W - 20 || y < 20 || y > VB_H - 20) continue;
    deepStar(x, y, 0.7 + dfRng() * 0.6, 0.12 + dfRng() * 0.15);
  }

  // === CP-2: Proximity mesh — short hairlines between nearby corpus stars ===
  // Synthesizes co-mention / post-comment relations as visual proxy.
  // Real semantic edges from kg.json land at CP-3.
  (function buildMesh(){
    const MESH_RADIUS = 95;
    const MAX_PER = 2;
    const MAX_EDGES = 900;
    const cellSize = MESH_RADIUS;
    const cols = Math.ceil(VB_W / cellSize) + 2;
    const rows = Math.ceil(VB_H / cellSize) + 2;
    const grid = new Array(cols * rows).fill(null).map(() => []);
    function cellIdx(x, y){
      const cx = Math.floor(x / cellSize);
      const cy = Math.floor(y / cellSize);
      return { idx: cy * cols + cx, cx, cy };
    }
    deepFieldPositions.forEach((p, i) => {
      const { idx } = cellIdx(p.x, p.y);
      if (idx >= 0 && idx < grid.length) grid[idx].push(i);
    });
    const drawn = new Set();
    let total = 0;
    deepFieldPositions.forEach((p, i) => {
      if (total >= MAX_EDGES) return;
      const { cx, cy } = cellIdx(p.x, p.y);
      const cands = [];
      for (let oy = -1; oy <= 1; oy++){
        for (let ox = -1; ox <= 1; ox++){
          const cidx = (cy + oy) * cols + (cx + ox);
          if (cidx < 0 || cidx >= grid.length) continue;
          grid[cidx].forEach(j => {
            if (j === i) return;
            const q = deepFieldPositions[j];
            const dx = q.x - p.x, dy = q.y - p.y;
            const d = Math.sqrt(dx*dx + dy*dy);
            if (d > 0 && d <= MESH_RADIUS) cands.push({ j, d });
          });
        }
      }
      cands.sort((a, b) => a.d - b.d);
      cands.slice(0, MAX_PER).forEach(({ j, d }) => {
        const key = i < j ? i + '|' + j : j + '|' + i;
        if (drawn.has(key)) return;
        drawn.add(key);
        const q = deepFieldPositions[j];
        const op = (1 - d / MESH_RADIUS) * 0.10 + 0.025;
        el('line', {
          x1:p.x.toFixed(2), y1:p.y.toFixed(2),
          x2:q.x.toFixed(2), y2:q.y.toFixed(2),
          stroke:'rgba(232,228,223,'+op.toFixed(3)+')',
          'stroke-width':'0.35',
          class:'deep-mesh-line',
        }, deepFieldGroup);
        total++;
      });
    });
  })();

  // === CP-4: Lissajous theme drift + signal pulses ===
  // Living-but-authored: theme groups drift in small irregular paths around their base
  // position via per-theme Lissajous parameters. Belief/project/post/tech nodes drift WITH
  // the theme (because they're inside the theme group transform). Cross-edges recompute
  // per frame because their endpoints moved.

  const themeDrift = THEMES.map((t, i) => {
    const r = mulberry32(i * 131 + 17);
    return {
      ax: 6 + r() * 10,         // amplitude px x
      ay: 5 + r() * 9,          // amplitude px y
      fx: 0.10 + r() * 0.10,    // frequency hz x
      fy: 0.07 + r() * 0.10,    // frequency hz y
      px: r() * Math.PI * 2,    // phase x
      py: r() * Math.PI * 2,    // phase y
    };
  });

  // Pre-cache references to theme groups for animation loop
  const themeGroupEls = THEMES.map(t => svg.querySelector('g.theme-group[data-theme="' + t.id + '"]'));

  // Cache cross-edge paths + endpoint node ids for per-frame recompute
  const crossEdgeRefs = Array.from(svg.querySelectorAll('path.cross-edge')).map(path => ({
    path,
    from: path.getAttribute('data-from'),
    to: path.getAttribute('data-to'),
  }));

  // Track current theme world position (used by signal pulses + cross-edge recompute)
  const themeCurPos = THEMES.map(t => ({ x: t.x, y: t.y }));

  // Randomize twinkle delay per theme node (so they desync — feels like real stars)
  document.querySelectorAll('.theme-node').forEach(e => {
    e.style.animationDelay = '-' + (Math.random() * 4.5).toFixed(2) + 's';
  });

  // === CP-5: Big-bang entry — single-origin radial expansion ===
  // All elements start at scale ~0 around (CX, CY) with opacity 0. Over ENTRY_DURATION
  // they expand outward to final state. Skippable on user input.
  const ENTRY_DURATION = 1800;
  const ENTRY_THEME_STAGGER = 16; // ms per theme — small + near-simultaneous
  const entryStartTime = performance.now() + 250;
  let entryComplete = false;

  // Hash-shuffle theme entry delays so it doesn't read as clockwise sweep
  THEMES.forEach((t, i) => {
    const h = (Math.sin(i * 17.3 + 9.1) + 1) * 0.5;
    t.entryDelay = h * ENTRY_THEME_STAGGER * THEMES.length;
  });

  function scaleAroundCenter(s){
    return 'translate(' + CX + ' ' + CY + ') scale(' + s.toFixed(4) + ') translate(' + (-CX) + ' ' + (-CY) + ')';
  }
  function easeOutQuint(t){ return 1 - Math.pow(1 - t, 5); }
  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

  // Hide initial state — everything invisible except parallax bg + deep-field which scale from center
  themeGroupEls.forEach(g => { if (g) g.style.opacity = '0'; });
  crossEdgeRefs.forEach(ref => { ref.path.style.opacity = '0'; });
  deepFieldGroup.setAttribute('transform', scaleAroundCenter(0.05));
  deepFieldGroup.style.opacity = '0';
  bgRoot.setAttribute('transform', scaleAroundCenter(0.05));
  bgRoot.style.opacity = '0';

  // Genesis halos + label fade in (genesis core itself stays visible — it IS the origin)
  const genesisLabelEl = svg.querySelector('text.genesis-label');
  const genesisSubEl = svg.querySelector('text.genesis-sublabel');
  if (genesisLabelEl) { genesisLabelEl.style.opacity = '0'; genesisLabelEl.style.transition = 'opacity 1s ease-out 0.6s'; }
  if (genesisSubEl) { genesisSubEl.style.opacity = '0'; genesisSubEl.style.transition = 'opacity 1s ease-out 0.8s'; }

  // Shockwave element
  const shockwave = el('circle', {
    cx: CX, cy: CY, r: 0,
    fill: 'none',
    stroke: 'rgba(229,165,75,0.55)',
    'stroke-width': '2',
    opacity: '0',
  });

  // Skip handler
  let bbSkipped = false;
  function skipBigBang(){
    bbSkipped = true;
    themeGroupEls.forEach((g, i) => {
      if (!g) return;
      g.style.opacity = '1';
      g.setAttribute('transform', 'translate(' + THEMES[i].x.toFixed(2) + ' ' + THEMES[i].y.toFixed(2) + ')');
    });
    crossEdgeRefs.forEach(ref => { ref.path.style.opacity = '1'; });
    deepFieldGroup.setAttribute('transform', scaleAroundCenter(1));
    deepFieldGroup.style.opacity = '1';
    bgRoot.setAttribute('transform', scaleAroundCenter(1));
    bgRoot.style.opacity = '0.85';
    if (genesisLabelEl) genesisLabelEl.style.opacity = '1';
    if (genesisSubEl) genesisSubEl.style.opacity = '1';
  }
  window.addEventListener('click', skipBigBang, { once: true });
  window.addEventListener('keydown', skipBigBang, { once: true });
  window.addEventListener('touchstart', skipBigBang, { once: true, passive: true });

  let lastT = performance.now();
  function frame(now){
    const t = now / 1000;
    lastT = now;

    // === ENTRY PHASE ===
    if (!entryComplete && !bbSkipped){
      const sinceEntry = now - entryStartTime;

      // Shockwave animates first
      if (sinceEntry > 0){
        if (!shockwave._fired){ shockwave._fired = true; shockwave._start = now; }
        const swT = Math.min((now - shockwave._start) / 1700, 1);
        const swEased = easeOutCubic(swT);
        shockwave.setAttribute('r', (swEased * 1100).toFixed(1));
        shockwave.setAttribute('stroke-width', (2 - swEased * 1.7).toFixed(2));
        shockwave.style.opacity = (1 - swEased) * 0.7;
      }

      // Deep-field + parallax bg expand uniformly from center
      const dfT = Math.max(0, Math.min(sinceEntry / ENTRY_DURATION, 1));
      const dfEased = easeOutQuint(dfT);
      const s = 0.05 + dfEased * 0.95;
      deepFieldGroup.setAttribute('transform', scaleAroundCenter(s));
      deepFieldGroup.style.opacity = dfEased.toFixed(3);
      bgRoot.setAttribute('transform', scaleAroundCenter(s));
      bgRoot.style.opacity = (dfEased * 0.85).toFixed(3);

      // Per-theme entry: travel from (CX, CY) to base position
      let allDone = true;
      THEMES.forEach((th, i) => {
        const themeStart = entryStartTime + th.entryDelay;
        const themeT = Math.max(0, Math.min((now - themeStart) / ENTRY_DURATION, 1));
        if (themeT < 1) allDone = false;
        const eased = easeOutQuint(themeT);
        const tx = CX + (th.x - CX) * eased;
        const ty = CY + (th.y - CY) * eased;
        const s = 0.05 + eased * 0.95;
        const g = themeGroupEls[i];
        if (g){
          g.style.opacity = themeT > 0.05 ? Math.min(themeT * 2, 1).toFixed(3) : '0';
          g.setAttribute('transform', 'translate(' + tx.toFixed(2) + ' ' + ty.toFixed(2) + ') scale(' + s.toFixed(3) + ')');
        }
        themeCurPos[i].x = tx;
        themeCurPos[i].y = ty;
      });
      // Update node world map for cross-edges (themes + non-theme children that ride the theme transform)
      THEMES.forEach((th, i) => { nodeWorldPos[th.id] = { x: themeCurPos[i].x, y: themeCurPos[i].y }; });
      for (const nid in nodeOffsets) {
        const off = nodeOffsets[nid];
        const tp = nodeWorldPos[off.themeId];
        if (tp) nodeWorldPos[nid] = { x: tp.x + off.ox, y: tp.y + off.oy };
      }

      // Cross-edges fade in past 55% of entry
      if (sinceEntry > ENTRY_DURATION * 0.55){
        const fadeT = Math.min((sinceEntry - ENTRY_DURATION * 0.55) / 600, 1);
        crossEdgeRefs.forEach(ref => { ref.path.style.opacity = fadeT; });
      }
      // Recompute edges so they track moving theme endpoints during entry
      crossEdgeRefs.forEach(ref => {
        const a = nodeWorldPos[ref.from];
        const b = nodeWorldPos[ref.to];
        if (!a || !b) return;
        const mx = (a.x + b.x)/2 + (CX - (a.x + b.x)/2) * 0.45;
        const my = (a.y + b.y)/2 + (CY - (a.y + b.y)/2) * 0.45;
        ref.path.setAttribute('d', 'M ' + a.x.toFixed(2) + ' ' + a.y.toFixed(2) + ' Q ' + mx.toFixed(2) + ' ' + my.toFixed(2) + ' ' + b.x.toFixed(2) + ' ' + b.y.toFixed(2));
      });
      // Theme spokes track theme drift too (visibility hover-driven, geometry per frame)
      spokeRefs.forEach(ref => {
        const tp = nodeWorldPos[ref.themeId];
        const cp = nodeWorldPos[ref.childId];
        if (!tp || !cp) return;
        ref.path.setAttribute('d', 'M ' + tp.x.toFixed(2) + ' ' + tp.y.toFixed(2) + ' L ' + cp.x.toFixed(2) + ' ' + cp.y.toFixed(2));
      });

      if (allDone && sinceEntry > ENTRY_DURATION * 1.1){
        entryComplete = true;
        // Lock final state
        themeGroupEls.forEach((g, i) => {
          if (g){
            g.style.opacity = '1';
            g.setAttribute('transform', 'translate(' + THEMES[i].x.toFixed(2) + ' ' + THEMES[i].y.toFixed(2) + ')');
          }
        });
        crossEdgeRefs.forEach(ref => { ref.path.style.opacity = '1'; });
        deepFieldGroup.setAttribute('transform', scaleAroundCenter(1));
        deepFieldGroup.style.opacity = '1';
        bgRoot.setAttribute('transform', scaleAroundCenter(1));
        bgRoot.style.opacity = '0.85';
      }

      // Parallax drift active during entry too
      parallaxX += (parallaxTargetX - parallaxX) * 0.06;
      parallaxY += (parallaxTargetY - parallaxY) * 0.06;
      bgGroup.setAttribute('transform', 'translate(' + parallaxX.toFixed(2) + ' ' + parallaxY.toFixed(2) + ')');

      requestAnimationFrame(frame);
      return;
    }

    // === DRIFT PHASE (post-entry) ===

    // Parallax bg lerp
    parallaxX += (parallaxTargetX - parallaxX) * 0.06;
    parallaxY += (parallaxTargetY - parallaxY) * 0.06;
    bgGroup.setAttribute('transform', 'translate(' + parallaxX.toFixed(2) + ' ' + parallaxY.toFixed(2) + ')');

    // Update theme positions + group transforms
    THEMES.forEach((th, i) => {
      const d = themeDrift[i];
      const dx = Math.sin(t * d.fx * 2 * Math.PI + d.px) * d.ax;
      const dy = Math.cos(t * d.fy * 2 * Math.PI + d.py) * d.ay;
      const x = th.x + dx;
      const y = th.y + dy;
      themeCurPos[i].x = x;
      themeCurPos[i].y = y;
      const g = themeGroupEls[i];
      if (g) g.setAttribute('transform', 'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ')');
    });

    THEMES.forEach((th, i) => {
      nodeWorldPos[th.id] = { x: themeCurPos[i].x, y: themeCurPos[i].y };
    });
    // Non-theme children ride the parent theme's drift via the offset map.
    for (const nid in nodeOffsets) {
      const off = nodeOffsets[nid];
      const tp = nodeWorldPos[off.themeId];
      if (tp) nodeWorldPos[nid] = { x: tp.x + off.ox, y: tp.y + off.oy };
    }

    crossEdgeRefs.forEach(ref => {
      const a = nodeWorldPos[ref.from];
      const b = nodeWorldPos[ref.to];
      if (!a || !b) return;
      const mx = (a.x + b.x)/2 + (CX - (a.x + b.x)/2) * 0.45;
      const my = (a.y + b.y)/2 + (CY - (a.y + b.y)/2) * 0.45;
      ref.path.setAttribute('d', 'M ' + a.x.toFixed(2) + ' ' + a.y.toFixed(2) + ' Q ' + mx.toFixed(2) + ' ' + my.toFixed(2) + ' ' + b.x.toFixed(2) + ' ' + b.y.toFixed(2));
    });
    // Theme spokes track drift each frame (visibility hover-driven)
    spokeRefs.forEach(ref => {
      const tp = nodeWorldPos[ref.themeId];
      const cp = nodeWorldPos[ref.childId];
      if (!tp || !cp) return;
      ref.path.setAttribute('d', 'M ' + tp.x.toFixed(2) + ' ' + tp.y.toFixed(2) + ' L ' + cp.x.toFixed(2) + ' ' + cp.y.toFixed(2));
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Signal pulses — gold/white dots traveling along paths or straight lines, fade in/out
  function pulseAlongLine(x1, y1, x2, y2, duration, color, radius){
    const cls = color === 'gold' ? 'signal-pulse' : 'signal-pulse-white';
    const pulse = el('circle', { cx:x1, cy:y1, r:radius || 2.4, class:cls, opacity:0 });
    const start = performance.now();
    function tick(now){
      const t = Math.min((now - start) / duration, 1);
      const eased = t * t * (3 - 2 * t);
      pulse.setAttribute('cx', x1 + (x2 - x1) * eased);
      pulse.setAttribute('cy', y1 + (y2 - y1) * eased);
      let op = 0;
      if (t < 0.18) op = t / 0.18;
      else if (t > 0.82) op = (1 - t) / 0.18;
      else op = 1;
      pulse.setAttribute('opacity', op * (color === 'gold' ? 0.95 : 0.40));
      if (t < 1) requestAnimationFrame(tick);
      else pulse.remove();
    }
    requestAnimationFrame(tick);
  }
  function pulseAlongPath(pathEl, duration, color, radius){
    if (!pathEl || !pathEl.getTotalLength) return;
    let len;
    try { len = pathEl.getTotalLength(); } catch(e){ return; }
    if (!len || len < 10) return;
    const cls = color === 'gold' ? 'signal-pulse' : 'signal-pulse-white';
    const pulse = el('circle', { r:radius || 2.2, class:cls, opacity:0 });
    const start = performance.now();
    function tick(now){
      const t = Math.min((now - start) / duration, 1);
      const eased = t * t * (3 - 2 * t);
      try {
        const pt = pathEl.getPointAtLength(eased * len);
        pulse.setAttribute('cx', pt.x);
        pulse.setAttribute('cy', pt.y);
      } catch(e){ pulse.remove(); return; }
      let op = 0;
      if (t < 0.18) op = t / 0.18;
      else if (t > 0.82) op = (1 - t) / 0.18;
      else op = 1;
      pulse.setAttribute('opacity', op * (color === 'gold' ? 0.85 : 0.32));
      if (t < 1) requestAnimationFrame(tick);
      else pulse.remove();
    }
    requestAnimationFrame(tick);
  }

  // Cadence 1: genesis → theme straight pulse (every 0.7-1.6s)
  function fireRadial(){
    const i = Math.floor(Math.random() * THEMES.length);
    pulseAlongLine(CX, CY, themeCurPos[i].x, themeCurPos[i].y, 1000, 'gold', 2.4);
    setTimeout(fireRadial, 700 + Math.random() * 900);
  }
  setTimeout(fireRadial, 800);

  // Cadence 2: cross-edge pulse (every 0.6-1.5s) — fires along a real interlinkage
  function fireCrossEdge(){
    if (crossEdgeRefs.length){
      const ref = crossEdgeRefs[Math.floor(Math.random() * crossEdgeRefs.length)];
      pulseAlongPath(ref.path, 1300, 'white', 1.8);
    }
    setTimeout(fireCrossEdge, 600 + Math.random() * 900);
  }
  setTimeout(fireCrossEdge, 1200);

  // Cadence 3: tension chord pulse (every 2.4-5s) — bigger, gold, big-event signals
  function fireTension(){
    const tensions = crossEdgeRefs.filter(r => r.path.getAttribute('data-rel') === 'tension-with');
    if (tensions.length){
      const ref = tensions[Math.floor(Math.random() * tensions.length)];
      pulseAlongPath(ref.path, 1700, 'gold', 2.0);
    }
    setTimeout(fireTension, 2400 + Math.random() * 2600);
  }
  setTimeout(fireTension, 2700);

  // Cadence 4: supersedes/refines pulse (every 1.5-3.2s) — narrative arc signals
  function fireNarrative(){
    const narr = crossEdgeRefs.filter(r => {
      const rel = r.path.getAttribute('data-rel');
      return rel === 'superseded_by' || rel === 'refined_by';
    });
    if (narr.length){
      const ref = narr[Math.floor(Math.random() * narr.length)];
      pulseAlongPath(ref.path, 1500, 'gold', 2.6);
    }
    setTimeout(fireNarrative, 1500 + Math.random() * 1700);
  }
  setTimeout(fireNarrative, 1900);

  // Cadence 5: builds_on lineage pulse (every 1.0-2.0s) — project chain firing
  function fireLineage(){
    const lin = crossEdgeRefs.filter(r => r.path.getAttribute('data-rel') === 'builds_on');
    if (lin.length){
      const ref = lin[Math.floor(Math.random() * lin.length)];
      pulseAlongPath(ref.path, 1200, 'white', 1.6);
    }
    setTimeout(fireLineage, 1000 + Math.random() * 1000);
  }
  setTimeout(fireLineage, 1600);

  // === CP-6: Pan + zoom + bounds + double-click recenter + fullscreen ===
  // Wheel ALONE = page scroll (never intercept). Cmd/Ctrl+wheel = zoom. Pinch on touch = zoom.
  // Drag on background (not on a node) = pan. Double-click on background = recenter.
  // Pan + zoom both clamped: zoom-out floor at full viewBox (anti-drift); pan can't push
  // constellation beyond viewport bounds.
  const DEFAULT_VB = { x: 0, y: 0, w: VB_W, h: VB_H };
  let curVB = { ...DEFAULT_VB };
  const ZOOM_MIN = 1.0;     // 1.0 = full canvas (zoom-out floor)
  const ZOOM_MAX = 4.0;     // up to 4x zoom-in
  let curZoom = 1.0;

  function applyVB(){
    svg.setAttribute('viewBox', curVB.x + ' ' + curVB.y + ' ' + curVB.w + ' ' + curVB.h);
  }
  function clampPan(){
    // Bounds: viewBox cannot extend beyond a margin around the canvas
    const margin = 100;
    const minX = -margin;
    const maxX = VB_W - curVB.w + margin;
    const minY = -margin;
    const maxY = VB_H - curVB.h + margin;
    if (curVB.x < minX) curVB.x = minX;
    if (curVB.x > maxX) curVB.x = maxX;
    if (curVB.y < minY) curVB.y = minY;
    if (curVB.y > maxY) curVB.y = maxY;
  }
  function setZoom(z, focusX, focusY){
    const newZ = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
    if (newZ === curZoom) return;
    // Compute viewBox-space focus point (normalized 0..1)
    const fx = focusX / window.innerWidth;
    const fy = focusY / window.innerHeight;
    const oldW = curVB.w, oldH = curVB.h;
    const newW = VB_W / newZ;
    const newH = VB_H / newZ;
    // Anchor zoom at focus point
    curVB.x += (oldW - newW) * fx;
    curVB.y += (oldH - newH) * fy;
    curVB.w = newW;
    curVB.h = newH;
    curZoom = newZ;
    clampPan();
    applyVB();
  }

  // Mouse wheel zoom (cmd/ctrl modifier required so plain wheel scrolls page)
  svg.addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return; // plain wheel = page scroll
    e.preventDefault();
    const direction = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(curZoom * direction, e.clientX, e.clientY);
  }, { passive: false });

  // Drag-to-pan
  let panStart = null;
  svg.addEventListener('mousedown', (e) => {
    // Only pan on left mouse button + bg click (not on nodes)
    if (e.button !== 0) return;
    if (e.target.closest('.theme-group, .belief-node, .genesis-core, .fs-btn, a')) return;
    panStart = { x: e.clientX, y: e.clientY, vbX: curVB.x, vbY: curVB.y };
    svg.classList.add('panning');
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!panStart) return;
    const dx = (e.clientX - panStart.x) / window.innerWidth * curVB.w;
    const dy = (e.clientY - panStart.y) / window.innerHeight * curVB.h;
    curVB.x = panStart.vbX - dx;
    curVB.y = panStart.vbY - dy;
    clampPan();
    applyVB();
  });
  document.addEventListener('mouseup', () => {
    panStart = null;
    svg.classList.remove('panning');
  });

  // Double-click background = recenter to default viewBox
  svg.addEventListener('dblclick', (e) => {
    if (e.target.closest('.theme-group, .belief-node, .genesis-core, .fs-btn, a')) return;
    e.preventDefault();
    curVB = { ...DEFAULT_VB };
    curZoom = 1.0;
    applyVB();
  });

  // Touch: 1-finger drag = pan, 2-finger pinch = zoom
  let touchPanStart = null;
  let touchZoomStart = null;
  svg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1){
      const t = e.touches[0];
      if (e.target.closest('.theme-group, .belief-node, .genesis-core, .fs-btn, a')) return;
      touchPanStart = { x: t.clientX, y: t.clientY, vbX: curVB.x, vbY: curVB.y };
    } else if (e.touches.length === 2){
      const a = e.touches[0], b = e.touches[1];
      const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      const cx = (a.clientX + b.clientX) / 2;
      const cy = (a.clientY + b.clientY) / 2;
      touchZoomStart = { dist, zoom: curZoom, cx, cy };
      touchPanStart = null;
    }
  }, { passive: false });
  svg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && touchPanStart){
      const t = e.touches[0];
      const dx = (t.clientX - touchPanStart.x) / window.innerWidth * curVB.w;
      const dy = (t.clientY - touchPanStart.y) / window.innerHeight * curVB.h;
      curVB.x = touchPanStart.vbX - dx;
      curVB.y = touchPanStart.vbY - dy;
      clampPan();
      applyVB();
      e.preventDefault();
    } else if (e.touches.length === 2 && touchZoomStart){
      const a = e.touches[0], b = e.touches[1];
      const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      const newZ = touchZoomStart.zoom * (dist / touchZoomStart.dist);
      setZoom(newZ, touchZoomStart.cx, touchZoomStart.cy);
      e.preventDefault();
    }
  }, { passive: false });
  svg.addEventListener('touchend', () => {
    touchPanStart = null;
    touchZoomStart = null;
  });

  // Re-fit on resize: reset to default viewBox + adjust aspect strategy
  function applyAspectStrategy(){
    const w = window.innerWidth, h = window.innerHeight;
    const viewportAR = w / h;
    const canvasAR = VB_W / VB_H;
    // On portrait or very narrow viewports, use 'slice' so canvas fills the screen
    // (corners crop slightly but no letterbox). 'meet' on landscape desktop preserves
    // the full constellation w/ minor side margins.
    const useSlice = viewportAR < canvasAR * 0.85;
    svg.setAttribute('preserveAspectRatio', useSlice ? 'xMidYMid slice' : 'xMidYMid meet');
    bgSvg.setAttribute('preserveAspectRatio', useSlice ? 'xMidYMid slice' : 'xMidYMid slice');
  }
  applyAspectStrategy();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      curVB = { ...DEFAULT_VB };
      curZoom = 1.0;
      applyVB();
      applyAspectStrategy();
    }, 200);
  });

  // Fullscreen toggle (browser native API)
  const fsBtn = document.getElementById('fs-btn');
  if (fsBtn){
    fsBtn.addEventListener('click', async () => {
      if (!document.fullscreenElement){
        try { await document.documentElement.requestFullscreen(); } catch(e){}
      } else {
        try { await document.exitFullscreen(); } catch(e){}
      }
    });
    document.addEventListener('fullscreenchange', () => {
      fsBtn.textContent = document.fullscreenElement ? '⛶ exit' : '⛶ fullscreen';
    });
  }

  // === CP-7: layered visibility on hover/focus ===
  // Hovered body = theme node itself. Cross-edge highlit iff theme node is endpoint
  // (theme↔theme tensions, theme↔belief in other clusters, theme↔genesis). Belief↔belief
  // chords stay dimmed — they aren't this theme's connections, even if one belief lives
  // in this theme's wedge. Subtle dotted style (.cross-edge.highlit). Spokes from theme
  // to its own children are revealed in parallel via spokeRefs (see theme-spokes block).
  function highlightTheme(themeId){
    crossEdgeRefs.forEach(ref => {
      const isConnected = ref.from === themeId || ref.to === themeId;
      ref.path.classList.toggle('highlit', isConnected);
      ref.path.classList.toggle('dimmed', !isConnected);
    });
    spokeRefs.forEach(ref => {
      ref.path.style.opacity = ref.themeId === themeId ? '1' : '0';
    });
  }
  function clearHighlight(){
    crossEdgeRefs.forEach(ref => {
      ref.path.classList.remove('highlit');
      ref.path.classList.remove('dimmed');
    });
    spokeRefs.forEach(ref => { ref.path.style.opacity = '0'; });
  }
  document.querySelectorAll('g.theme-group').forEach(g => {
    const tid = g.getAttribute('data-theme');
    g.addEventListener('mouseenter', () => highlightTheme(tid));
    g.addEventListener('mouseleave', clearHighlight);
    g.addEventListener('focus', () => highlightTheme(tid));
    g.addEventListener('blur', clearHighlight);
  });

  // === CP-7: keyboard global handlers ===
  // Esc → site home (graph IS wiki entry; Esc exits to landing)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      // Prefer exiting fullscreen first if active
      if (document.fullscreenElement){
        document.exitFullscreen().catch(() => {});
        return;
      }
      window.location.href = '/';
    }
  });

})();
</script>

</body>
</html>
`;

  const outDir = join(OUT_DIR, "graph");
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, "index.html");
  const tmp = `${out}.tmp`;
  writeFileSync(tmp, html);
  renameSync(tmp, out);
  console.log(`[build-wiki] generated graph -> wiki/graph/index.html (${html.length} bytes) [CP-7 a11y + layered visibility — C-graph COMPLETE]`);
  okCount++;
}

buildGraphPage();

console.log(
  `[build-wiki] done. ${okCount} pages built${errCount ? `, ${errCount} failed` : ""}.`
);
if (errCount && STRICT) process.exit(1);
