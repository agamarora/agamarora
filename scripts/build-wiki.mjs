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
  @font-face { font-family:'Satoshi'; src:url('/fonts/satoshi/Satoshi-Variable.woff2') format('woff2'); font-weight:300 900; font-display:swap; font-style:normal; }
  @font-face { font-family:'Satoshi'; src:url('/fonts/satoshi/Satoshi-VariableItalic.woff2') format('woff2'); font-weight:300 900; font-display:swap; font-style:italic; }
  @font-face { font-family:'JetBrains Mono'; src:url('/fonts/jetbrains-mono/jetbrains-mono-latin.woff2') format('woff2'); font-weight:400 500; font-display:swap; font-style:normal; }
  @font-face { font-family:'Patrick Hand'; src:url('/fonts/patrick-hand/patrick-hand-latin.woff2') format('woff2'); font-weight:400; font-display:swap; font-style:normal; }
  .icon { width:1em; height:1em; fill:currentColor; display:inline-block; vertical-align:-0.125em; flex-shrink:0; }
  :root {
    --bg:#0A0A0A; --surface:#111111; --surface-2:#161616;
    --border:#1E1E1E; --border-hover:#2A2A2A;
    --text:#E8E4DF; --text-dim:#7A7A7A;
    --accent:#E5A54B; --accent-dim:rgba(229,165,75,0.12);
    --mono:'JetBrains Mono',monospace;
    --sans:'Satoshi',system-ui,-apple-system,'Segoe UI',sans-serif;
    --mark:'Patrick Hand',cursive;
    --space-3:8px; --space-4:12px; --space-5:16px; --space-6:24px;
    --space-7:32px; --space-8:48px; --space-9:64px;
    --radius-sm:4px; --radius-md:8px; --radius-lg:12px;
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  body{background:var(--bg);color:var(--text);font-family:var(--sans);-webkit-font-smoothing:antialiased;line-height:1.6;min-height:100dvh;}
  ::selection{background:var(--accent);color:var(--bg);}

  header.site-header{position:fixed;top:0;left:0;right:0;height:clamp(52px,6vw,64px);z-index:100;padding:0 clamp(1rem,3vw,1.5rem);background:var(--bg);display:flex;align-items:center;}
  .icon-bar{display:inline-flex;align-items:center;}
  .icon-bar a{color:var(--text-dim);display:inline-flex;align-items:center;justify-content:center;width:2em;height:2em;font-size:clamp(1.15rem,1.3vw,1.5rem);transition:color 0.2s;text-decoration:none;}
  .icon-bar a:hover{color:var(--accent);}

  .aa-mark{position:fixed;bottom:clamp(16px,3vw,32px);right:clamp(16px,3vw,32px);z-index:50;text-decoration:none;line-height:1;opacity:0.7;transition:opacity 0.2s;}
  .aa-mark:hover{opacity:1;}
  .aa-mark svg{width:clamp(44px,5vw,60px);height:auto;overflow:visible;display:block;}

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
`;

const SVG_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
<symbol id="i-github" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"/></symbol>
<symbol id="i-linkedin" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></symbol>
<symbol id="i-youtube" viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></symbol>
<symbol id="i-house" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></symbol>
</svg>`;

const SHARED_HEADER_HTML = `<header class="site-header">
  <div class="icon-bar">
    <a href="https://github.com/agamarora" target="_blank" rel="noopener" aria-label="GitHub"><svg class="icon" aria-hidden="true"><use href="#i-github"/></svg></a>
    <a href="https://linkedin.com/in/agamarora" target="_blank" rel="noopener" aria-label="LinkedIn"><svg class="icon" aria-hidden="true"><use href="#i-linkedin"/></svg></a>
    <a href="https://www.youtube.com/@agam_arora" target="_blank" rel="noopener" aria-label="YouTube"><svg class="icon" aria-hidden="true"><use href="#i-youtube"/></svg></a>
    <a href="/" aria-label="Home"><svg class="icon" aria-hidden="true"><use href="#i-house"/></svg></a>
  </div>
</header>`;

const SHARED_AAMARK_HTML = `<a href="/" class="aa-mark" aria-label="agamarora.com">
  <svg id="aa-mark" viewBox="0 0 72 36">
    <text id="aa-stroke" x="2" y="28" fill="none" stroke="#E8E4DF" stroke-width="0.8" font-family="Patrick Hand" font-size="28">aa</text>
    <text id="dot-fill" x="0" y="28" fill="#E5A54B" opacity="0" font-family="Patrick Hand" font-size="28">.</text>
    <text id="aa-fill" x="2" y="28" fill="#E8E4DF" opacity="0" font-family="Patrick Hand" font-size="28">aa</text>
  </svg>
</a>`;

const AAMARK_SCRIPT = `(function(){
  const s=document.getElementById('aa-stroke'),f=document.getElementById('aa-fill'),d=document.getElementById('dot-fill');
  if(!s||!f||!d)return;
  document.fonts.ready.then(()=>{
    const len=s.getComputedTextLength();
    d.setAttribute('x',4+len-2);f.setAttribute('x',4);
    const dl=len*2;s.style.strokeDasharray=dl;s.style.strokeDashoffset=dl;s.style.opacity='1';
    s.getBoundingClientRect();
    s.style.transition='stroke-dashoffset 1.2s cubic-bezier(0.25,0.1,0.25,1)';s.style.strokeDashoffset='0';
    s.addEventListener('transitionend',function h(e){if(e.propertyName!=='stroke-dashoffset')return;
      s.removeEventListener('transitionend',h);
      f.style.transition='opacity 0.2s';f.style.opacity='1';
      d.style.transition='opacity 0.2s';d.style.opacity='1';
      s.style.transition='opacity 0.25s ease 0.05s';s.style.opacity='0';
    });
  });
})();`;

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
function pageWrap({ title, description, canonical, breadcrumbHtml, articleHtml, navHtml, schemaType }) {
  const ogImage = "https://agamarora.com/assets/og/lab.png"; // TODO: per-page OG (B-future)
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
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
{
  "@context": "https://schema.org",
  "@type": "${schemaType}",
  "headline": ${JSON.stringify(title)},
  "url": "${canonical}",
  "isPartOf": { "@type": "WebSite", "@id": "https://agamarora.com/#website" },
  "author": { "@type": "Person", "@id": "https://agamarora.com/#person" }
}
</script>

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
function collapseEvidenceHtml(html) {
  const pattern = /(<h2[^>]*>Evidence<\/h2>)([\s\S]*?)(?=<h2|<hr>|$)/i;
  return html.replace(pattern, (_, heading, body) => {
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
  const kg = JSON.parse(readFileSync(kgPath, "utf8"));
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
  const kg = JSON.parse(readFileSync(kgPath, "utf8"));

  // === Constellation CP-1 — authored sky atlas skeleton ===
  // Aesthetic + spec lives in DESIGN.md ## Constellation graph (locked 2026-04-26).
  // CP-1 = static foundation: genesis + 11 hand-placed theme nodes. No motion, no edges,
  // no deep-field, no big-bang yet. Those land at CP-2..CP-7.

  // Theme positions: hand-tuned (angle°, radF). Genesis at center; 11 themes orbit.
  // NOT a perfect circle — irregular radF gives organic distribution per memorable-thing.
  const THEMES = [
    { id: 'theme.agent-first',                 slug: 'agent-first',                 label: 'agent-first',         ang: 18,  radF: 0.27 },
    { id: 'theme.ai-pm-skillset',              slug: 'ai-pm-skillset',              label: 'ai-pm skillset',      ang: 62,  radF: 0.32 },
    { id: 'theme.pm-taste',                    slug: 'pm-taste',                    label: 'pm taste',            ang: 98,  radF: 0.25 },
    { id: 'theme.enterprise-ai-reality',       slug: 'enterprise-ai-reality',       label: 'enterprise ai',       ang: 138, radF: 0.30 },
    { id: 'theme.voice-ai-craft',              slug: 'voice-ai-craft',              label: 'voice ai craft',      ang: 168, radF: 0.27 },
    { id: 'theme.second-brain',                slug: 'second-brain',                label: 'second brain',        ang: 202, radF: 0.29 },
    { id: 'theme.spec-first-taste',            slug: 'spec-first-taste',            label: 'spec-first taste',    ang: 232, radF: 0.25 },
    { id: 'theme.breadth-as-differentiation',  slug: 'breadth-as-differentiation',  label: 'breadth as edge',     ang: 260, radF: 0.31 },
    { id: 'theme.linkedin-as-instrument',      slug: 'linkedin-as-instrument',      label: 'linkedin instrument', ang: 288, radF: 0.24 },
    { id: 'theme.career-reflection',           slug: 'career-reflection',           label: 'career reflection',   ang: 318, radF: 0.28 },
    { id: 'theme.personal-projects-tinkering', slug: 'personal-projects-tinkering', label: 'personal projects',   ang: 348, radF: 0.32 },
  ];

  const totalEntries = (kg.stats.posts || 0) + (kg.stats.comments || 0) + 220; // approximate corpus + uncurated

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=5.0,user-scalable=yes">
<title>Graph - Agam Arora's wiki.</title>
<meta name="description" content="Authored constellation of ${kg.stats.nodes_total} graph nodes and ${kg.stats.edges.total} edges across 11 years of thinking. Genesis + 11 themes, organic placement, dark-only.">
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

<!--
  C-graph implementation status — track CP completion against DESIGN.md ## Constellation graph
  CP-1 ✅ static skeleton: genesis + 11 theme nodes hand-placed, labels w/ quadrant anchor
  CP-2 ⏳ deep-field: 227 kg nodes + 578 corpus stars + proximity mesh
  CP-3 ⏳ real cross-theme interlinkages from kg.json edges
  CP-4 ⏳ motion vocabulary: twinkle / Lissajous-drift / signal pulses
  CP-5 ⏳ big-bang single-origin entry + parallax bg layer
  CP-6 ⏳ pan/zoom/bounds + fullscreen + mobile responsive
  CP-7 ⏳ keyboard a11y + /design-review against 13 §D2 invariants
-->

<style>
  @font-face { font-family:'Satoshi'; src:url('/fonts/satoshi/Satoshi-Variable.woff2') format('woff2'); font-weight:300 900; font-display:swap; font-style:normal; }
  @font-face { font-family:'Satoshi'; src:url('/fonts/satoshi/Satoshi-VariableItalic.woff2') format('woff2'); font-weight:300 900; font-display:swap; font-style:italic; }
  @font-face { font-family:'JetBrains Mono'; src:url('/fonts/jetbrains-mono/jetbrains-mono-latin.woff2') format('woff2'); font-weight:400 500; font-display:swap; font-style:normal; }
  @font-face { font-family:'Patrick Hand'; src:url('/fonts/patrick-hand/patrick-hand-latin.woff2') format('woff2'); font-weight:400; font-display:swap; font-style:normal; }
  .icon { width:1em; height:1em; fill:currentColor; display:inline-block; vertical-align:-0.125em; flex-shrink:0; }
  :root {
    --bg:#0A0A0A; --bg-deep:#050810; --surface:#111111;
    --border:#1E1E1E; --text:#E8E4DF; --text-dim:#7A7A7A;
    --accent:#E5A54B; --accent-dim:rgba(229,165,75,0.12);
    --mono:'JetBrains Mono',ui-monospace,monospace;
    --sans:'Satoshi',system-ui,-apple-system,'Segoe UI',sans-serif;
    --mark:'Patrick Hand',cursive;
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:100%;height:100%;overflow:hidden;}
  body{
    background:radial-gradient(ellipse at 50% 50%, var(--bg-deep) 0%, var(--bg) 70%, #000 100%);
    color:var(--text);font-family:var(--sans);position:relative;
    -webkit-font-smoothing:antialiased;line-height:1.6;
  }
  body::before{
    content:'';position:fixed;inset:0;pointer-events:none;z-index:1;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
    opacity:0.025;mix-blend-mode:screen;
  }
  ::selection{background:var(--accent);color:var(--bg);}

  header.site-header{position:fixed;top:0;left:0;right:0;height:clamp(52px,6vw,64px);z-index:20;padding:0 clamp(1rem,3vw,1.5rem);display:flex;align-items:center;}
  .icon-bar{display:inline-flex;align-items:center;}
  .icon-bar a{color:var(--text-dim);display:inline-flex;align-items:center;justify-content:center;width:2em;height:2em;font-size:clamp(1.15rem,1.3vw,1.5rem);transition:color 0.2s;text-decoration:none;}
  .icon-bar a:hover{color:var(--accent);}

  .aa-mark{position:fixed;bottom:clamp(16px,3vw,32px);right:clamp(16px,3vw,32px);z-index:15;text-decoration:none;line-height:1;opacity:0.7;transition:opacity 0.2s;}
  .aa-mark:hover{opacity:1;}
  .aa-mark svg{width:clamp(44px,5vw,60px);height:auto;overflow:visible;display:block;}

  .help-strip{position:fixed;top:18px;left:80px;z-index:15;font-family:var(--mono);font-size:10px;color:var(--text-dim);opacity:0.4;letter-spacing:0.04em;}
  .help-strip a{color:var(--text-dim);text-decoration:none;border-bottom:1px dashed rgba(232,228,223,0.15);transition:color 0.2s,border-color 0.2s;}
  .help-strip a:hover{color:var(--accent);border-color:var(--accent);}
  .caption{position:fixed;top:64px;right:24px;z-index:15;font-family:var(--mono);font-size:11px;color:var(--text);opacity:0.55;letter-spacing:0.04em;text-align:right;}
  .subcaption{position:fixed;top:84px;right:24px;z-index:15;font-family:var(--mono);font-size:10px;color:var(--text-dim);opacity:0.4;letter-spacing:0.04em;text-align:right;}

  .legend-strip{position:fixed;bottom:64px;left:24px;z-index:15;font-family:var(--mono);font-size:10px;color:var(--text-dim);opacity:0.5;letter-spacing:0.04em;line-height:1.7;}
  .legend-strip .swatch{display:inline-block;border-radius:50%;vertical-align:middle;margin-right:6px;}
  .legend-strip .gold{background:var(--accent);width:8px;height:8px;box-shadow:0 0 6px rgba(229,165,75,0.6);}
  .legend-strip .genesis{background:var(--accent);width:11px;height:11px;box-shadow:0 0 10px rgba(229,165,75,0.7);}

  .spec-tag{position:fixed;bottom:22px;left:24px;z-index:15;font-family:var(--mono);font-size:10px;color:var(--text-dim);opacity:0.5;letter-spacing:0.05em;}

  /* Two-layer SVG: parallax bg (dim, future CP-5) + interactive constellation foreground */
  svg.parallax-bg{position:fixed;inset:0;width:100vw;height:100vh;z-index:1;display:block;pointer-events:none;}
  svg.canvas{position:fixed;inset:0;width:100vw;height:100vh;z-index:2;display:block;}

  text{font-family:var(--sans);user-select:none;}
  .theme-label{font-family:var(--sans);font-weight:500;font-size:11px;letter-spacing:0.07em;text-transform:lowercase;fill:rgba(232,228,223,0.62);}
  .genesis-label{font-family:var(--mono);font-size:11px;letter-spacing:0.12em;text-transform:lowercase;fill:rgba(229,165,75,0.85);}
  .genesis-sublabel{font-family:var(--mono);font-size:9px;fill:rgba(229,165,75,0.5);letter-spacing:0.06em;}

  /* Genesis halo pulse — only motion in CP-1, signals "origin alive" */
  @keyframes core-pulse{0%,100%{opacity:0.55;}50%{opacity:0.85;}}
  .genesis-halo{animation:core-pulse 5s ease-in-out infinite;}

  .theme-node{cursor:pointer;transition:filter 0.2s;}
  .theme-node:hover{filter:drop-shadow(0 0 12px rgba(229,165,75,0.8));}
  .theme-group:hover .theme-label{fill:var(--accent);}
  .genesis-core{cursor:pointer;transition:filter 0.2s;}
  .genesis-core:hover{filter:drop-shadow(0 0 16px rgba(229,165,75,0.95));}

  @media (max-width: 768px){
    .legend-strip{display:none;}
    .help-strip{font-size:9px;left:64px;}
    .caption{font-size:10px;}
    .subcaption{font-size:9px;}
    .aa-mark svg{width:38px;}
    .spec-tag{display:none;}
  }
</style>
</head>
<body>

${SVG_SPRITE}

${SHARED_HEADER_HTML}

${SHARED_AAMARK_HTML}

<div class="help-strip"><a href="/wiki/">wiki</a> › graph</div>
<div class="caption">11 years · ${totalEntries}+ entries · ${kg.stats.nodes_total} graph nodes · ${kg.stats.edges.total} edges</div>
<div class="subcaption">${kg.stats.themes} themes · ${kg.stats.beliefs.tier_1 + kg.stats.beliefs.tier_2} beliefs · ${kg.stats.projects} projects · ${kg.stats.tech} tech · ${kg.stats.posts || 0} posts</div>

<div class="legend-strip">
  <div><span class="swatch genesis"></span>genesis</div>
  <div><span class="swatch gold"></span>theme</div>
  <div style="font-size:9px;opacity:0.7;margin-top:4px;">cp-1 skeleton · cp-2-7 incoming</div>
</div>

<!-- LAYER 0: parallax background (CP-5 will populate; reserved here) -->
<svg class="parallax-bg" id="parallax-bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"></svg>

<!-- LAYER 1: interactive constellation foreground -->
<svg class="canvas" id="constellation" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Knowledge graph constellation: genesis at center, 11 themes orbiting"></svg>

<div class="spec-tag">C-graph CP-1 · authored sky atlas (skeleton)</div>

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

  // Compute base positions for each theme
  THEMES.forEach(t => {
    const r = VB_MIN * t.radF;
    const p = polar(CX, CY, r, t.ang);
    t.x = p.x;
    t.y = p.y;
  });

  // === Render: genesis at center ===
  // Halos (concentric, alpha cascade)
  [
    { r:50, fill:'rgba(229,165,75,0.035)' },
    { r:36, fill:'rgba(229,165,75,0.06)'  },
    { r:24, fill:'rgba(229,165,75,0.12)'  },
    { r:16, fill:'rgba(229,165,75,0.22)'  },
  ].forEach(h => el('circle', { cx:CX, cy:CY, r:h.r, fill:h.fill, class:'genesis-halo' }));

  // Genesis core — clickable, navigates to wiki home
  const genesisCore = el('circle', { cx:CX, cy:CY, r:11, fill:'#E5A54B', class:'genesis-core' });
  genesisCore.style.cursor = 'pointer';
  genesisCore.addEventListener('click', () => { window.location.href = '/wiki/root.substance-over-hype/'; });

  // Genesis label + sublabel
  el('text', { x:CX, y:CY + 32, 'text-anchor':'middle', class:'genesis-label' }).textContent = 'agam.arora';
  el('text', { x:CX, y:CY + 50, 'text-anchor':'middle', class:'genesis-sublabel' }).textContent = '11 years · second brain';

  // === Render: 11 theme nodes ===
  THEMES.forEach(t => {
    const g = el('g', { class:'theme-group', 'data-theme':t.id, transform:'translate(' + t.x.toFixed(2) + ' ' + t.y.toFixed(2) + ')' });
    g.style.cursor = 'pointer';
    g.addEventListener('click', () => { window.location.href = '/wiki/' + t.slug + '/'; });

    // Concentric halos
    el('circle', { cx:0, cy:0, r:18, fill:'rgba(229,165,75,0.07)' }, g);
    el('circle', { cx:0, cy:0, r:11, fill:'rgba(229,165,75,0.16)' }, g);

    // The star
    el('circle', { cx:0, cy:0, r:8.5, fill:'#E5A54B', class:'theme-node' }, g);

    // Theme label — outside node, radial baseline, quadrant-aware anchor
    const labelP = polar(0, 0, 50, t.ang);
    let anchor = 'middle', baseDx = 0, baseDy = 4;
    if (t.ang > 12 && t.ang < 168){ anchor = 'start'; baseDx = 6; }
    else if (t.ang > 192 && t.ang < 348){ anchor = 'end'; baseDx = -6; }
    if (t.ang <= 12 || t.ang >= 348) baseDy = -10;
    if (t.ang >= 168 && t.ang <= 192) baseDy = 16;
    el('text', {
      x: (labelP.x + baseDx).toFixed(2),
      y: (labelP.y + baseDy).toFixed(2),
      'text-anchor': anchor,
      class:'theme-label',
    }, g).textContent = t.label;
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
  console.log(`[build-wiki] generated graph -> wiki/graph/index.html (${html.length} bytes) [CP-1 skeleton]`);
  okCount++;
}

buildGraphPage();

console.log(
  `[build-wiki] done. ${okCount} pages built${errCount ? `, ${errCount} failed` : ""}.`
);
if (errCount && STRICT) process.exit(1);
