#!/usr/bin/env node
// build-writing.mjs
//
// Reads content/writing/<slug>.md and emits writing/<slug>/index.html for each
// post + a writing/index.html landing (reverse-chrono). Auto-merges entries
// into sitemap.xml, llms.txt, llms-full.txt, and site.json via marker blocks
// (<!-- writing:start --> ... <!-- writing:end --> in text files; managed:"writing"
// flag on entries in site.json). Posts with frontmatter agent_retrievable: true
// also emit wiki/extracts/writing-<slug>.md for /enter retrieval.
//
// Run: node scripts/build-writing.mjs
//      node scripts/build-writing.mjs --strict   (fail on parse errors)
//
// Markdown engine is a stripped-down copy of build-wiki.mjs (no wiki shorthand,
// no LinkedIn URN linkification). Future refactor: extract shared md engine to
// scripts/lib/markdown.mjs.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
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
const SRC_DIR = join(ROOT, "content/writing");
const OUT_DIR = join(ROOT, "writing");
const EXTRACTS_DIR = join(ROOT, "wiki/extracts");
const SITEMAP_PATH = join(ROOT, "sitemap.xml");
const LLMS_PATH = join(ROOT, "llms.txt");
const LLMS_FULL_PATH = join(ROOT, "llms-full.txt");
const SITE_JSON_PATH = join(ROOT, "site.json");

const STRICT = process.argv.includes("--strict");

// ---------------------------------------------------------------------------
// 1. Helpers
// ---------------------------------------------------------------------------

const escHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const stripQuotes = (s) => (s || "").toString().replace(/^["']|["']$/g, "").trim();

function normList(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((s) => s.toString().trim()).filter(Boolean);
  const s = String(val).trim();
  if (s.startsWith("[") && s.endsWith("]")) {
    return s
      .slice(1, -1)
      .split(",")
      .map((x) => x.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return s ? [s] : [];
}

const safeJsonLd = (obj) => JSON.stringify(obj, null, 2).replace(/<\//g, "<\\/");

// ---------------------------------------------------------------------------
// 2. Frontmatter + markdown
// ---------------------------------------------------------------------------

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  let currentKey = null;
  for (const line of m[1].split("\n")) {
    if (/^\s*-\s/.test(line)) {
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

function inlineMd(text) {
  // Code spans first so ** inside code is not parsed.
  const codeSpans = [];
  text = text.replace(/`([^`]+)`/g, (_, c) => {
    codeSpans.push(c);
    return `CODE${codeSpans.length - 1}`;
  });

  text = escHtml(text);

  // Markdown links [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => {
    const ext = /^https?:/.test(u);
    return `<a href="${u}"${ext ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`;
  });

  // Bold then italic. ** before *.
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

  text = text.replace(/CODE(\d+)/g, (_, i) => `<code>${escHtml(codeSpans[+i])}</code>`);
  return text;
}

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

    if (/^-{3,}\s*$/.test(line)) {
      out.push("<hr>");
      i++;
      continue;
    }

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

    if (/^>\s?/.test(line)) {
      const items = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        items.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${inlineMd(items.join(" "))}</blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      out.push(
        "<ul>" + items.map((it) => `<li>${inlineMd(it)}</li>`).join("") + "</ul>"
      );
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      out.push(
        "<ol>" + items.map((it) => `<li>${inlineMd(it)}</li>`).join("") + "</ol>"
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const buf = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^-{3,}\s*$/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    flushParagraph(buf);
  }

  return out.join("\n");
}

// ---------------------------------------------------------------------------
// 3. Post discovery
// ---------------------------------------------------------------------------

function readPosts() {
  if (!existsSync(SRC_DIR)) {
    console.warn(`[build-writing] source dir missing: ${SRC_DIR} (no posts to render)`);
    return [];
  }
  const files = readdirSync(SRC_DIR).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const posts = [];
  for (const f of files) {
    const slug = basename(f, ".md");
    const src = readFileSync(join(SRC_DIR, f), "utf8");
    const { meta, body } = parseFrontmatter(src);
    if (!meta.title || !meta.date) {
      const msg = `[build-writing] post ${slug}: missing title or date in frontmatter`;
      if (STRICT) {
        console.error(msg);
        process.exit(1);
      }
      console.warn(msg);
      continue;
    }
    posts.push({
      slug,
      title: stripQuotes(meta.title),
      date: stripQuotes(meta.date),
      summary: stripQuotes(meta.summary || ""),
      tags: normList(meta.tags),
      canonical: stripQuotes(meta.canonical || `https://agamarora.com/writing/${slug}/`),
      agent_retrievable: String(meta.agent_retrievable || "").toLowerCase() === "true",
      tldr: stripQuotes(meta.tldr || ""),
      related: normList(meta.related),
      body,
      meta,
    });
  }
  // Reverse-chrono
  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

// ---------------------------------------------------------------------------
// 4. Per-page CSS (writing-specific layer on top of shared chrome)
// ---------------------------------------------------------------------------

const SHARED_HEAD_STYLES = `
${SHARED_CHROME_CSS}

  .page{max-width:760px;margin:0 auto;padding:calc(clamp(52px,6vw,64px) + var(--space-8)) clamp(var(--space-6),5vw,var(--space-8)) calc(var(--space-9) + var(--space-7));}

  .breadcrumb{font-family:var(--mono);font-size:0.74rem;color:var(--text-dim);letter-spacing:0.06em;margin-bottom:var(--space-6);}
  .breadcrumb a{color:var(--text-dim);text-decoration:none;border-bottom:1px dashed var(--border-hover);transition:color 0.2s,border-color 0.2s;}
  .breadcrumb a:hover{color:var(--accent);border-color:var(--accent);}
  .breadcrumb .sep{margin:0 var(--space-3);opacity:0.5;}

  article{font-size:1.04rem;}
  article > p, article > ul, article > ol, article > blockquote, article > hr { margin-bottom: var(--space-6); }
  article h1{font-size:clamp(2.2rem,5vw,3rem);font-weight:700;letter-spacing:-0.025em;line-height:1.05;margin-bottom:var(--space-5);max-width:680px;}
  article h2{font-size:clamp(1.4rem,2.4vw,1.7rem);font-weight:600;letter-spacing:-0.02em;line-height:1.2;margin-top:var(--space-9);margin-bottom:var(--space-5);color:var(--text);}
  article h2:first-of-type{margin-top:var(--space-7);}
  article h3{font-size:clamp(1.1rem,1.6vw,1.2rem);font-weight:600;letter-spacing:-0.01em;line-height:1.3;margin-top:var(--space-7);margin-bottom:var(--space-4);}
  article p{font-size:1.04rem;line-height:1.7;color:var(--text);opacity:0.92;}
  article p strong{color:var(--text);font-weight:600;opacity:1;}
  article p em{font-style:italic;opacity:0.85;}
  article p code,article li code{font-family:var(--mono);font-size:0.92em;background:var(--surface-2);border:1px solid var(--border);padding:1px 6px;border-radius:var(--radius-sm);color:var(--accent);}
  article a{color:var(--accent);text-decoration:none;border-bottom:1px solid var(--accent-dim);transition:border-color 0.2s;}
  article a:hover{border-color:var(--accent);}
  article hr{border:0;height:1px;background:var(--border);margin:var(--space-8) 0;}
  article ul,article ol{padding-left:var(--space-6);margin-bottom:var(--space-6);}
  article ul li,article ol li{margin-bottom:var(--space-4);line-height:1.7;padding-left:var(--space-3);}
  article ol{counter-reset:item;list-style:none;padding-left:0;}
  article ol > li{counter-increment:item;position:relative;padding-left:calc(var(--space-7) + var(--space-3));margin-bottom:var(--space-5);}
  article ol > li::before{content:counter(item);position:absolute;left:0;top:0;width:var(--space-7);height:var(--space-7);display:inline-flex;align-items:center;justify-content:center;background:var(--surface-2);border:1px solid var(--border);border-radius:50%;font-family:var(--mono);font-size:0.78rem;color:var(--accent);font-weight:500;}

  article blockquote{border-left:3px solid var(--accent-dim);padding:var(--space-4) var(--space-5);margin:var(--space-6) 0;background:var(--surface);border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-size:1rem;line-height:1.6;color:var(--text);opacity:0.92;}
  article blockquote strong{color:var(--accent);}

  /* Post header strip: date + tags. Sits tight under H1. */
  .post-meta{font-family:var(--mono);font-size:0.74rem;color:var(--text-dim);letter-spacing:0.06em;margin-top:calc(-1 * var(--space-4));margin-bottom:var(--space-5);display:flex;gap:var(--space-3) var(--space-4);flex-wrap:wrap;align-items:center;}
  .post-meta .date{color:var(--accent);text-transform:uppercase;font-size:0.72rem;letter-spacing:0.08em;}
  .post-meta .sep-dot{opacity:0.45;}
  .post-meta .tag{display:inline-block;padding:2px 8px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:0.68rem;color:var(--text-dim);}
  @media (max-width: 720px) {
    .post-meta{flex-direction:column;align-items:flex-start;gap:var(--space-3);}
    .post-meta .sep-dot{display:none;}
    .post-meta .tags-row{display:flex;flex-wrap:wrap;gap:var(--space-2);}
  }

  /* Italic summary block, mirrors page-purpose on belief/theme pages */
  .post-summary{font-family:var(--sans);font-size:1.05rem;line-height:1.55;color:var(--text-dim);font-style:italic;margin-bottom:var(--space-7);padding-left:var(--space-5);border-left:2px solid var(--accent-dim);max-width:640px;}

  /* TL;DR quotable assertion — same gold gradient as belief pages. */
  .writing-tldr{margin:0 0 var(--space-7) 0;padding:var(--space-5) var(--space-6);background:linear-gradient(90deg, var(--accent-dim), transparent 70%);border-left:3px solid var(--accent);border-radius:0 var(--radius-sm) var(--radius-sm) 0;}
  .writing-tldr .label{font-family:var(--mono);font-size:0.7rem;color:var(--accent);letter-spacing:0.1em;text-transform:uppercase;font-weight:500;display:block;margin-bottom:var(--space-3);}
  .writing-tldr .quote{font-family:var(--sans);font-size:1.15rem;line-height:1.5;color:var(--text);font-weight:500;margin:0;}
  @media (max-width: 720px) {
    .writing-tldr{padding:var(--space-4) var(--space-5);}
    .writing-tldr .quote{font-size:1.05rem;line-height:1.45;}
  }

  /* Related cross-links footer — same grid as wiki theme/belief pages. */
  .related-links{margin-top:var(--space-9);padding-top:var(--space-6);border-top:1px solid var(--border);}
  .related-links h2{font-family:var(--mono);font-size:0.78rem;color:var(--text-dim);letter-spacing:0.08em;text-transform:uppercase;font-weight:500;margin:0 0 var(--space-5) 0;}
  .related-links ul{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:var(--space-3) var(--space-5);}
  .related-links li{font-size:0.94rem;line-height:1.5;}
  .related-links li a{color:var(--text);text-decoration:none;border-bottom:1px solid var(--border);transition:color 0.2s,border-color 0.2s;}
  .related-links li a:hover{color:var(--accent);border-color:var(--accent);}
  .related-links li .kind{font-family:var(--mono);font-size:0.72rem;color:var(--text-dim);letter-spacing:0.06em;margin-right:var(--space-3);}

  /* Writing-nav — prev / index / next layout */
  .writing-nav{margin-top:var(--space-9);padding-top:var(--space-6);border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;gap:var(--space-5);font-family:var(--mono);font-size:0.82rem;}
  .writing-nav a{color:var(--text-dim);text-decoration:none;transition:color 0.2s;border:0;}
  .writing-nav a:hover{color:var(--accent);}
  .writing-nav .home{color:var(--text-dim);}
  .writing-nav .placeholder{display:inline-block;}

  /* Landing list */
  .post-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:var(--space-7);}
  .post-list li{padding-bottom:var(--space-7);border-bottom:1px solid var(--border);}
  .post-list li:last-child{border-bottom:0;}
  .post-list h2{font-size:clamp(1.25rem,2vw,1.5rem);font-weight:600;letter-spacing:-0.015em;line-height:1.25;margin-bottom:var(--space-3);margin-top:0;}
  .post-list h2 a{color:var(--text);text-decoration:none;border-bottom:0;}
  .post-list h2 a:hover{color:var(--accent);}
  .post-list .row-meta{font-family:var(--mono);font-size:0.72rem;color:var(--text-dim);letter-spacing:0.04em;margin-bottom:var(--space-4);display:flex;gap:var(--space-4);align-items:center;flex-wrap:wrap;}
  .post-list .row-meta .date{color:var(--accent);}
  .post-list .row-meta .sep{opacity:0.4;}
  .post-list .row-meta .tag{display:inline-block;padding:1px 6px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:0.66rem;color:var(--text-dim);}
  .post-list p.summary{font-size:1rem;line-height:1.6;color:var(--text);opacity:0.85;margin:0;}

  .empty-state{font-family:var(--sans);font-size:1.05rem;color:var(--text-dim);padding:var(--space-7) 0;text-align:left;font-style:italic;}
`;

// ---------------------------------------------------------------------------
// 5. Page wrap (head + body shell)
// ---------------------------------------------------------------------------

function pageWrap({ title, description, canonical, articleHtml, breadcrumbHtml, navHtml, jsonLd, ogImage }) {
  const ogImg = ogImage || "https://agamarora.com/assets/og/og-master.jpg";
  const SUFFIX = " — agamarora.com";
  const headTitle = (title + SUFFIX).length > 60 ? title : title + SUFFIX;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<title>${escHtml(headTitle)}</title>
<meta name="description" content="${escHtml(description)}">
<meta name="theme-color" content="#0A0A0A">

<meta property="og:type" content="article">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${escHtml(headTitle)}">
<meta property="og:description" content="${escHtml(description)}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="2400">
<meta property="og:image:height" content="1256">
<meta property="og:locale" content="en_US">
<meta property="og:site_name" content="Agam Arora">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escHtml(headTitle)}">
<meta name="twitter:description" content="${escHtml(description)}">
<meta name="twitter:image" content="${ogImg}">

<link rel="canonical" href="${canonical}">

${jsonLd ? `<script type="application/ld+json">\n${safeJsonLd(jsonLd)}\n</script>` : ""}

<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/favicon.png" sizes="48x48">
<link rel="manifest" href="/site.webmanifest">

${SHARED_PRELOAD_HTML}

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

// ---------------------------------------------------------------------------
// 6. Per-post page render
// ---------------------------------------------------------------------------

// Resolve a `related` shorthand string into a {kind, label, href} record.
//   "wiki:agent-first"            -> {kind: "wiki", label: "agent-first", href: "/wiki/agent-first/"}
//   "wiki:beliefs:ic-path-legitimacy" -> {kind: "belief", label: "ic-path-legitimacy", href: "/wiki/beliefs/ic-path-legitimacy/"}
//   "lab:second-brain"            -> {kind: "lab", label: "second-brain", href: "/lab/second-brain/"}
//   "writing:other-slug"          -> {kind: "writing", label: "other-slug", href: "/writing/other-slug/"}
//   "https://example.com|Label"   -> {kind: "link", label: "Label", href: "https://example.com"}
//   "https://example.com"         -> {kind: "link", label: hostname, href: "..."}
function resolveRelated(s) {
  if (!s) return null;
  const t = s.trim();
  if (/^https?:/.test(t)) {
    const [href, ...labelParts] = t.split("|");
    let label = labelParts.join("|").trim();
    if (!label) {
      try { label = new URL(href).hostname.replace(/^www\./, ""); } catch { label = href; }
    }
    return { kind: "link", label, href };
  }
  const m = t.match(/^([a-z]+):(.+)$/);
  if (!m) return null;
  const [, kind, rest] = m;
  if (kind === "wiki") {
    if (rest.startsWith("beliefs:")) {
      const slug = rest.slice("beliefs:".length).trim();
      return { kind: "belief", label: slug, href: `/wiki/beliefs/${slug}/` };
    }
    return { kind: "wiki", label: rest.trim(), href: `/wiki/${rest.trim()}/` };
  }
  if (kind === "lab") {
    return { kind: "lab", label: rest.trim(), href: `/lab/${rest.trim()}/` };
  }
  if (kind === "writing") {
    return { kind: "writing", label: rest.trim(), href: `/writing/${rest.trim()}/` };
  }
  return null;
}

function renderRelated(items) {
  const valid = items.map(resolveRelated).filter(Boolean);
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

function renderWritingNav(post, posts) {
  const idx = posts.findIndex((p) => p.slug === post.slug);
  // posts are reverse-chrono. "older" = idx + 1, "newer" = idx - 1.
  const newer = idx > 0 ? posts[idx - 1] : null;
  const older = idx < posts.length - 1 ? posts[idx + 1] : null;
  const olderHtml = older
    ? `<a href="/writing/${older.slug}/" rel="prev">&larr; ${escHtml(older.title)}</a>`
    : '<span class="placeholder"></span>';
  const newerHtml = newer
    ? `<a href="/writing/${newer.slug}/" rel="next">${escHtml(newer.title)} &rarr;</a>`
    : '<span class="placeholder"></span>';
  return `<nav class="writing-nav">${olderHtml}<a href="/writing/" class="home">writing index</a>${newerHtml}</nav>`;
}

function buildPostPage(post, posts) {
  // Body without the source markdown's H1 (we render H1 from frontmatter title
  // so authors can repeat it naturally OR omit it without breaking the page).
  const bodyTrimmed = post.body.trim().replace(/^#\s+.+\n+/, "");
  const articleBody = blockMd(bodyTrimmed);

  const tagsHtml = post.tags.length
    ? `<span class="tags-row">${post.tags
        .map((t) => `<span class="tag">${escHtml(t)}</span>`)
        .join(" ")}</span>`
    : "";

  const tldrHtml = post.tldr
    ? `\n<div class="writing-tldr" aria-label="TL;DR"><span class="label">TL;DR</span><p class="quote">${inlineMd(post.tldr)}</p></div>`
    : "";

  const headerHtml = `<h1>${escHtml(post.title)}</h1>
<div class="post-meta"><span class="date">${escHtml(post.date)}</span>${
    tagsHtml ? `<span class="sep-dot">·</span>${tagsHtml}` : ""
  }</div>${
    post.summary ? `\n<p class="post-summary">${inlineMd(post.summary)}</p>` : ""
  }${tldrHtml}`;

  const relatedHtml = renderRelated(post.related);
  const fullArticle = headerHtml + "\n" + articleBody + (relatedHtml ? `\n${relatedHtml}` : "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary || post.title,
    datePublished: post.date,
    url: post.canonical,
    image: "https://agamarora.com/assets/og/og-master.jpg",
    keywords: post.tags.join(", "),
    author: { "@type": "Person", "@id": "https://agamarora.com/#person" },
    publisher: { "@type": "Person", "@id": "https://agamarora.com/#person" },
    isPartOf: { "@type": "WebSite", "@id": "https://agamarora.com/#website" },
    mainEntityOfPage: post.canonical,
  };

  return pageWrap({
    title: post.title,
    description: post.summary || post.title,
    canonical: post.canonical,
    articleHtml: fullArticle,
    breadcrumbHtml: `<nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/writing/">writing</a><span class="sep">/</span><span>${escHtml(post.title)}</span>
  </nav>`,
    navHtml: renderWritingNav(post, posts),
    jsonLd,
  });
}

// ---------------------------------------------------------------------------
// 7. Landing render
// ---------------------------------------------------------------------------

function buildLandingPage(posts) {
  const items = posts
    .map((p) => {
      const tagsHtml = p.tags.length
        ? p.tags.map((t) => `<span class="tag">${escHtml(t)}</span>`).join(" ")
        : "";
      return `    <li>
      <h2><a href="/writing/${p.slug}/">${escHtml(p.title)}</a></h2>
      <div class="row-meta"><span class="date">${escHtml(p.date)}</span>${
        tagsHtml ? `<span class="sep">·</span>${tagsHtml}` : ""
      }</div>
      <p class="summary">${inlineMd(p.summary)}</p>
    </li>`;
    })
    .join("\n");

  const articleHtml = `<h1>Writing</h1>
<p class="post-summary">Essays, points of view, and industry commentary. Distinct from the curated wiki and product PRFAQs.</p>
${
  posts.length
    ? `<ul class="post-list">\n${items}\n</ul>`
    : '<p class="empty-state">No posts yet. Check back soon.</p>'
}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Writing — Agam Arora",
    description: "Essays, points of view, and industry commentary by Agam Arora.",
    url: "https://agamarora.com/writing/",
    isPartOf: { "@type": "WebSite", "@id": "https://agamarora.com/#website" },
    author: { "@type": "Person", "@id": "https://agamarora.com/#person" },
    hasPart: posts.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: p.canonical,
      datePublished: p.date,
    })),
  };

  return pageWrap({
    title: "Writing",
    description: "Essays, points of view, and industry commentary by Agam Arora.",
    canonical: "https://agamarora.com/writing/",
    articleHtml,
    breadcrumbHtml: `<nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/">home</a><span class="sep">/</span><span>writing</span>
  </nav>`,
    navHtml: "",
    jsonLd,
  });
}

// ---------------------------------------------------------------------------
// 8. Index merging via marker blocks
// ---------------------------------------------------------------------------

function replaceMarkerBlock(text, replacement) {
  const re = /(<!--\s*writing:start\s*-->)([\s\S]*?)(<!--\s*writing:end\s*-->)/;
  if (!re.test(text)) {
    throw new Error(
      "marker block <!-- writing:start --> ... <!-- writing:end --> missing. Insert markers in target file before running."
    );
  }
  return text.replace(re, `$1\n${replacement}\n$3`);
}

function updateSitemap(posts) {
  if (!existsSync(SITEMAP_PATH)) return;
  const text = readFileSync(SITEMAP_PATH, "utf8");
  const today = new Date().toISOString().slice(0, 10);
  const landing = `  <url>
    <loc>https://agamarora.com/writing/</loc>
    <lastmod>${posts[0]?.date || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  const entries = posts.map(
    (p) => `  <url>
    <loc>${p.canonical}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`
  );
  const block = [landing, ...entries].join("\n\n");
  writeFileSync(SITEMAP_PATH, replaceMarkerBlock(text, block));
}

function updateLlmsTxt(posts) {
  if (!existsSync(LLMS_PATH)) return;
  const text = readFileSync(LLMS_PATH, "utf8");
  const lines = posts.map(
    (p) => `- [${p.title}](${p.canonical}): ${p.summary}`
  );
  const block = `## Writing\n\n${
    lines.length ? lines.join("\n") : "- (no posts yet)"
  }`;
  writeFileSync(LLMS_PATH, replaceMarkerBlock(text, block));
}

function updateLlmsFull(posts) {
  if (!existsSync(LLMS_FULL_PATH)) return;
  const text = readFileSync(LLMS_FULL_PATH, "utf8");
  const blocks = posts.map((p) => {
    const stripped = p.body.trim();
    return `### ${p.title}\n\nDate: ${p.date}\nURL: ${p.canonical}\nTags: ${
      p.tags.join(", ") || "(none)"
    }\n\n${p.summary ? `> ${p.summary}\n\n` : ""}${stripped}`;
  });
  const block = `## Writing\n\n${
    blocks.length ? blocks.join("\n\n---\n\n") : "(no posts yet)"
  }`;
  writeFileSync(LLMS_FULL_PATH, replaceMarkerBlock(text, block));
}

function updateSiteJson(posts) {
  if (!existsSync(SITE_JSON_PATH)) return;
  const json = JSON.parse(readFileSync(SITE_JSON_PATH, "utf8"));
  // Drop existing managed entries first to keep things idempotent.
  json.pages = (json.pages || []).filter((p) => p.managed !== "writing");
  json.pages.push({
    slug: "writing",
    path: "/writing/",
    title: "Writing — essays + POV",
    type: "page",
    managed: "writing",
  });
  for (const p of posts) {
    json.pages.push({
      slug: `writing-${p.slug}`,
      path: `/writing/${p.slug}/`,
      title: p.title,
      type: "writing-post",
      date: p.date,
      tags: p.tags,
      managed: "writing",
    });
  }
  writeFileSync(SITE_JSON_PATH, JSON.stringify(json, null, 2) + "\n");
}

function updateExtracts(posts) {
  if (!existsSync(EXTRACTS_DIR)) mkdirSync(EXTRACTS_DIR, { recursive: true });
  for (const p of posts) {
    if (!p.agent_retrievable) continue;
    const path = join(EXTRACTS_DIR, `writing-${p.slug}.md`);
    const content = `---
title: ${p.title}
date: ${p.date}
url: ${p.canonical}
tags: ${p.tags.join(", ")}
source: writing
---

${p.body.trim()}
`;
    writeFileSync(path, content);
  }
}

// ---------------------------------------------------------------------------
// 9. Main
// ---------------------------------------------------------------------------

function safeRun(label, fn) {
  try {
    fn();
    console.log(`  merged ${label}`);
  } catch (e) {
    const msg = `[build-writing] ${label} merge failed: ${e.message}`;
    if (STRICT) {
      console.error(msg);
      process.exit(1);
    }
    console.warn(msg);
  }
}

function main() {
  const posts = readPosts();
  console.log(`[build-writing] ${posts.length} post(s) found`);

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  for (const p of posts) {
    const dir = join(OUT_DIR, p.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), buildPostPage(p, posts));
    console.log(`  wrote /writing/${p.slug}/index.html`);
  }

  writeFileSync(join(OUT_DIR, "index.html"), buildLandingPage(posts));
  console.log(`  wrote /writing/index.html`);

  safeRun("sitemap.xml", () => updateSitemap(posts));
  safeRun("llms.txt", () => updateLlmsTxt(posts));
  safeRun("llms-full.txt", () => updateLlmsFull(posts));
  safeRun("site.json", () => updateSiteJson(posts));
  safeRun("agent extracts", () => updateExtracts(posts));

  console.log(`[build-writing] done`);
}

main();
