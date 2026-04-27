# 2026 AI Product Management Portfolio: SEO & AEO Architecture Guide

**Document Purpose:** This guide outlines the strategic architecture and exact technical implementation required to build a portfolio optimized for both traditional search engines (Google SEO) and modern Generative AI engines (Gemini, ChatGPT, Claude AEO/GEO).

**Core Directive for Development:** We are optimizing for **extraction**, not just indexing. The site must be modular, machine-readable, and designed to serve factual answers directly to AI crawlers.

**When to run this pass:** After major content work is done (e.g. C-voice-themes, C-voice-beliefs) AND BEFORE Phase D (AI plumbing / `/enter` v3 / groqHandler upgrade). Reference from `docs/plans/second-brain-v1-phase-a/STATUS.md` checkpoint notes.

---

## Part 1: Strategic Grounding Principles (The "Why")

Before writing code or formatting content, ensure all pages adhere to these 2026 search realities:

1. **Optimize for "Net Information Gain":** Generative engines filter out generic information. The site must feature proprietary data, specific use-case metrics, and contrarian insights. Do not publish standard definitions; publish specific, hard-won production lessons.
2. **Bottom Line Up Front (BLUF):** Search algorithms now reward "Good Abandonment" (when a user gets their answer instantly and leaves satisfied). Place an "Executive Summary" at the absolute top of every page or case study.
3. **Entity Over Keywords:** The portfolio is an "authority node." We are not targeting keywords; we are mapping an identity to specific machine learning concepts using exact semantic terminology and JSON-LD schema.
4. **Modular Consumption:** AI models do not read narrative pages top-to-bottom. They extract discrete blocks. Break complex case studies into distinct, extractable Question-and-Answer formats using strict HTML semantics.

---

## Part 2: Technical Implementation (The "How")

*Developer Note: All variables enclosed in `[BRACKETS]` must be customized before deployment.*

### 1. The `llms.txt` Standard (Root Directory)

AI crawlers look for an `llms.txt` file at the root of the domain before parsing the HTML DOM. This file serves as an unstyled, machine-readable summary of the professional entity.

**File Location:** `https://www.[yourdomain.com]/llms.txt`

**Content Template (Strict Markdown):**

```markdown
# [Your Full Name] - AI Product Management Portfolio

> [Your Full Name] is an AI Product Manager specializing in [Core Competency 1] and [Core Competency 2]. This file serves as the canonical source for professional background and case studies.

## Core Competencies
- [Specific AI Skill 1, e.g., RAG Pipeline Strategy]
- [Specific AI Skill 2, e.g., AI UX & Trust Guardrails]
- [Specific AI Skill 3, e.g., Model Evaluation Metrics]

## Official Links
- Professional Network: [Link to Professional Profile/LinkedIn]
- Portfolio: https://www.[yourdomain.com]/portfolio

## Featured Case Studies
- [Title of Case Study 1]: https://www.[yourdomain.com]/[path-to-case-study-1]
- [Title of Case Study 2]: https://www.[yourdomain.com]/[path-to-case-study-2]
```

### 2. Entity Resolution Schema (Head Tag)

Google relies on `Person` schema to connect the website to a real-world entity and categorize their expertise.

**Inject into `<head>` of the index page:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[Your Full Name]",
  "url": "https://www.[yourdomain.com]",
  "image": "https://www.[yourdomain.com]/assets/[filename-of-professional-headshot.jpg]",
  "jobTitle": "AI Product Manager",
  "description": "[1-2 sentence summary of specific AI PM focus]",
  "sameAs": [
    "[Full URL to Professional Network Profile]",
    "[Full URL to GitHub/Substack/Secondary Profile]"
  ],
  "knowsAbout": [
    "Artificial Intelligence",
    "Product Management",
    "Machine Learning",
    "Generative AI",
    "[Specific Sub-Niche 1]",
    "[Specific Sub-Niche 2]"
  ],
  "alumniOf": {
    "@type": "Organization",
    "name": "[University or Notable Past Employer]"
  }
}
</script>
```

### 3. Meta Tags & Bot Allowances (Head Tag)

Ensure bots are explicitly allowed to crawl and extract snippets.

**Inject into `<head>` of all pages:**

```html
<title>[Your Name] | AI Product Manager</title>
<meta name="title" content="[Your Name] | AI Product Manager">
<meta name="description" content="Portfolio of [Your Name], an AI Product Manager specializing in [Niche]. View case studies, frameworks, and metrics.">
<meta name="author" content="[Your Name]">

<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

<meta property="og:type" content="website">
<meta property="og:url" content="https://www.[yourdomain.com]/">
<meta property="og:title" content="[Your Name] | AI Product Manager">
<meta property="og:description" content="Portfolio of [Your Name], an AI Product Manager specializing in [Niche].">
<meta property="og:image" content="https://www.[yourdomain.com]/assets/[og-image-filename.jpg]">
```

### 4. Semantic HTML for AEO Blocks (Body Content)

Do not hide core text inside JavaScript accordions or sliders. AI bots only read raw DOM text. Wrap your insights in Answer Engine Optimization (AEO) blocks.

**AEO "Extractable" Block Template (Use for FAQs, Frameworks, About pages):**

*Rule: 1 specific Question in the Header -> 40-60 word factual Answer immediately below.*

```html
<section id="ai-evaluation-framework">
  <h2>How does [Your Name] evaluate AI product success?</h2>
  <p><strong>[Your Name]</strong> evaluates AI products by balancing user engagement with model-specific KPIs. Success is measured by reducing hallucination rates to [Target %], optimizing latency metrics, and tracking user acceptance through explicit feedback loops, ensuring AI features drive measurable business value.</p>
</section>
```

**Case Study "BLUF" Template (Use at the top of all portfolio items):**

```html
<article>
  <header>
    <h1>[Case Study Title]</h1>
  </header>

  <div class="executive-summary" aria-label="Case Study Summary">
    <h3>Executive Summary</h3>
    <dl>
      <dt>The Challenge:</dt>
      <dd>[1-sentence description of the problem]</dd>

      <dt>AI Architecture:</dt>
      <dd>[List of specific tools, APIs, or Models used]</dd>

      <dt>Business Impact:</dt>
      <dd>[Hard metric: e.g., Reduced latency by X% and increased adoption by Y%]</dd>
    </dl>
  </div>

</article>
```

### 5. Technical Guardrails & Performance

- **Unblock Bots:** Ensure the hosting provider (e.g., Cloudflare, Vercel) does not have WAF rules blocking known AI user agents (`ChatGPT-User`, `ClaudeBot`, `Google-Extended`).
- **Speed/TTFB:** The site must have a Time to First Byte (TTFB) under 800ms. If an AI crawler attempts a real-time retrieval to answer a user prompt and the site hangs, the bot will drop the crawl and source from a competitor.
- **Multimodal Alt Text:** Do not use generic image descriptions. Multimodal AIs index images heavily for technical context.
  - *Implementation Rule:* Use highly descriptive text. E.g., `alt="System architecture diagram showing a retrieval-augmented generation pipeline using [Database Name] and [LLM Provider]."`
- **Code Blocks:** Wrap all system instructions, prompt templates, or code snippets in `<pre><code>` tags. This signals technical depth to the crawler.

---

## Part 3: agamarora.com — current state vs targets

Audit done 2026-04-26. What we already have, what we still need:

### Already in place

- `llms.txt` at root (45-URL index, theme + belief catalog, canonical facts)
- `llms-full.txt` at root (long-form expansion)
- `Person` JSON-LD schema on `/` (basic shape — needs `knowsAbout` + `alumniOf` per Part 2 §2)
- `Article` JSON-LD on every `/wiki/<theme>/` page (canonical, headline, author Person ref)
- OG tags + Twitter card on every v2 page
- `<meta name="robots" content="index, follow">` on all pages
- Sitemap with all 45 URLs at `/sitemap.xml`, advertised in robots.txt

### Gaps to fix in the AEO/SEO pass

1. **Person schema enrichment** — `/index.html` JSON-LD `Person` needs `knowsAbout` array (specific niches: agent-first, voice-AI, application-layer-AI), `jobTitle: "AI Product Manager"`, and `description` from voice page.
2. **`max-snippet:-1` directive** — current `robots` meta is `index, follow`. Add `max-snippet:-1, max-image-preview:large` per Part 2 §3.
3. **AEO Q&A blocks on `/wiki/voice/` + `/wiki/quotes/`** — restructure so `<h2>` is a question, `<p>` immediately below is a 40-60 word answer. Currently both pages are narrative.
4. **BLUF executive summary on `/lab/<project>/` PRFAQ pages** — add `<dl class="executive-summary">` block at top of each Lab project page (challenge / architecture / business impact).
5. **Image alt text audit** — every `<img>` needs descriptive alt text per Part 2 §5. Currently /lab pages have generic alt strings.
6. **`<pre><code>` wrap audit** — every prompt/system-instruction/code snippet must be in `<pre><code>`. Check `/enter` system prompt examples + `/lab/ai-resume/` setup prompts + `/lab/second-brain/` paste-prompt.
7. **TTFB benchmark** — measure current TTFB on Netlify Edge. If >800ms anywhere, investigate cache headers in `netlify.toml`.
8. **Bot allowance verification** — confirm Netlify is not blocking `ChatGPT-User`, `ClaudeBot`, `Google-Extended`, `PerplexityBot`, `Bytespider`, etc. Check Netlify settings.

### Out of scope (deliberate)

- The wiki theme + belief pages already follow the BLUF + entity-extraction model by design (page-purpose tagline above orientation block, Evidence table at foot is the structured data layer). They do NOT need additional AEO restructuring.
- `/moodboard` is NoIndex by design.

---

## Part 2.5: Reddit AEO research synthesis (2026-04-27)

Sourced from r/SEO + r/marketing 7-10mo old practitioner threads. New items not previously in plan, folded into Tasks 14-18 below.

### Net-new tactics

1. **`FAQPage` JSON-LD schema** — every FAQ-shaped block (belief pages, /wiki/voice/, /wiki/quotes/, Lab PRFAQs) should ship `FAQPage` schema. Multiple practitioners cite this as the #1 AEO win. Pattern: `mainEntity` array of `{ @type: Question, name, acceptedAnswer: { @type: Answer, text } }`.
2. **`HowTo` JSON-LD schema** — `/lab/ai-resume/` setup-prompt + `/lab/second-brain/` paste-prompt are how-to shape. Add `HowTo` schema with `step` array.
3. **Raw-HTML answer-early-in-DOM audit** — open `view-source:` on every page; the headline answer must appear in raw HTML within first 150 words. No JS-rendered content for the lead. Confirmed Reddit consensus: "AI bots only read raw DOM text."
4. **`dateModified` + `datePublished` on Article schemas** — freshness is a ranking signal. Wiki Article schemas need both fields. Build script reads `frontmatter.published_at` + `git log -1 --format=%cI <file>` for `dateModified`.
5. **Post-deploy AI search QA** — practitioner standard: after every shipping pass, query Perplexity / Bing Copilot / ChatGPT search / Claude.ai with 5 representative prompts ("AI PM agent-first thesis", "voice AI craft 90% rule", etc.). Document whether agamarora.com surfaces and which page is cited. If a target page doesn't surface in 7-14 days, tweak clarity / context / internal-link weight and retest.
6. **Evidence-citation outbound links** — every Evidence drawer fact on belief pages should include outbound URL (LinkedIn post permalink, GitHub repo, etc.) where verifiable. OneFunder thesis: "unique facts cited verbatim with link beat paraphrasable paragraphs." Make individual facts the citable atom.

### Enhancements to existing tasks

- **AEO-3 (Q&A overlay)** — make pattern explicit: `H2 = question, first paragraph = 40-60 word answer, bullets/table = detail`. Apply to /wiki/voice/, /wiki/quotes/.
- **AEO-4 (BLUF)** — "first 150 words = direct answer" per Reddit consensus. Lab PRFAQ leads should test as standalone snippet.
- **Crawl audit (Part 5)** — add `view-source:` check: confirm answer text present in raw HTML, not JS-rendered.
- **DOM bloat audit** — confirm wiki pages don't carry hidden divs, CSS-injected content, or oversized inline scripts above the fold. Constellation graph page is the only legitimate JS-heavy surface.

### Tracking (optional, deferred)

- Tools like AiClicks.io track citations across ChatGPT / Perplexity / Gemini / Claude. Defer until first AEO pass deployed + 30 days.

---

## Part 2.6: goose-aeo framework synthesis (2026-04-27)

Source: https://github.com/gooseworks-ai/goose-aeo (open-source AEO toolkit + skill for Claude Code). MIT-licensed, queries 6 AI providers (Perplexity, OpenAI, Gemini, Grok, Claude, DeepSeek) and scores brand visibility.

### Their 6-dimension AI-search readiness audit

| Dimension | Maps to our work |
|---|---|
| Positioning Clarity | AEO-4 BLUF + AEO-1 Person schema description |
| Structured Content | AEO-3 Q&A overlay + AEO-10 FAQPage schema |
| **Query Alignment** | **NEW — AEO-13 prompt set should mirror "what does Agam think about X" queries; AEO-3 + AEO-4 content should answer those exactly** |
| Technical Signals | AEO-1, AEO-2, AEO-8, AEO-10, AEO-12 (dropped) |
| Content Depth | covered by long-form wiki pages |
| **Comparison Content** | **NEW — AEO-15 added: 3 explicit "X vs Y" comparison tables on theme pages** |

### Quantified metrics (folded into AEO-13)

- Mention rate per provider (% of prompts surfacing the brand)
- Prominence score (position-in-answer of mention)
- Share of voice (% of cited sources that are us)
- Source-page distribution (which page gets cited most)

Replaces our binary "did it surface" with structured measurement. Re-test quarterly post-deploy.

### What we're NOT adopting

- goose-aeo CLI / skill itself — we own a smaller surface, don't need 50-query batched runs across 6 paid providers. Manual 15-prompt re-test in AEO-13 is sufficient.
- Provider-cost optimization (Perplexity + OpenAI + Gemini = $2-5/run) — not relevant at our scale.

### Net new tasks added to plan

- AEO-15 (comparison content surfaces) — see next-session-plan Task 12.6
- AEO-13 expanded — 5 prompts → 15 prompts across identity/theme/comparison/long-tail. Quantified metrics replace binary surfacing.

---

## Part 4: Pass execution order

Run in this order when triggering an AEO/SEO pass:

1. Person schema enrichment on `/index.html`
2. `robots` meta directive update across v2 pages
3. AEO Q&A restructure on `/wiki/voice/` + `/wiki/quotes/`
4. BLUF executive summary on Lab project PRFAQ pages
5. Image alt text audit (script: scan all `<img>` for generic alt)
6. `<pre><code>` wrap audit (script: scan for prompts/code outside `<pre>` blocks)
7. TTFB benchmark via `curl -w "%{time_starttransfer}"` against 5 page types
8. Bot allowance verification via Netlify deploy log + headers check
9. Re-run `/design-review` and `/review` post-AEO to confirm no visual or behavioral regressions

Each step gets its own commit + push per Phase C frequent-checkpoint binding.

---

## Part 5: Crawl + indexability audit checklist

Quick wins to run alongside the structural pass. Each item is a small task with a verifiable outcome.

- [ ] **Audit `robots.txt`** — visit `https://agamarora.com/robots.txt` and verify no active `Disallow:` rules block important directories. Current file allows everything except `/moodboard/` (intentional). Confirm sitemap line still resolves: `Sitemap: https://agamarora.com/sitemap.xml`.

- [ ] **Check for rogue `noindex` tags** — inspect the `<head>` of every public page. Confirm no `<meta name="robots" content="noindex">` exists outside `/moodboard/` (which is correctly NoIndex by design). Script: `grep -r 'noindex' wiki/ lab/ resume/ enter/ index.html | grep -v moodboard`.

- [ ] **Set proper `<link rel="canonical">` tags** — every public page must have a self-canonical pointing to the prod URL. v2 pages already do this in `pageWrap()` (build-wiki.mjs) and in hand-authored pages. Audit: confirm all 8 hand-authored pages (`/`, `/lab/`, `/lab/<project>/`, `/resume/`, `/enter/`, `/wiki/`) have canonical pointing to `https://agamarora.com/<path>/`.

- [ ] **Interlink from existing content** — go through `/index.html`, `/lab/index.html`, `/resume/index.html` and add contextual prose links to high-value wiki pages (e.g. landing CTA could link directly to `/wiki/agent-first/` or `/wiki/spec-first-taste/`). Goal: every primary nav page has 3+ contextual outbound links into the wiki.

- [ ] **Link in main navigation** — verify icon bar header on every v2 page links to the most critical pages. Currently: GitHub, LinkedIn, YouTube, Home. Consider adding `/wiki/` and `/lab/` as additional icons (or a text-link strip below the icons).

- [ ] **Implement breadcrumbs** — wiki pages already have breadcrumbs (`wiki / <theme>` and `wiki / beliefs / <parent> / <belief>`). Add to:
  - `/lab/<project>/` pages: `Home / Lab / <project name>`
  - `/resume/` page: `Home / Resume`
  - `/enter/` page: `Home / Enter`
  - Each breadcrumb gets matching `BreadcrumbList` JSON-LD per schema.org.

- [ ] **JSON-LD `BreadcrumbList`** — add structured data for breadcrumbs to all pages that have them. Format:

  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://agamarora.com/"},
      {"@type": "ListItem", "position": 2, "name": "Lab", "item": "https://agamarora.com/lab/"},
      {"@type": "ListItem", "position": 3, "name": "Second-brain v1", "item": "https://agamarora.com/lab/second-brain/"}
    ]
  }
  </script>
  ```

- [ ] **Internal link density check** — run a script to count outbound internal links per wiki page. Target: every theme + belief page has at least 4 cross-links (already enforced by `.related-links` footer; verify nothing is orphaned).

- [ ] **404 page check** — confirm `/404.html` exists, has site nav, suggests popular pages. Currently exists with header + aa-mark.

Append all completed items as commit messages prefixed `seo: ...` so the audit trail is visible in `git log`.

