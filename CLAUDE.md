# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal website for Agam Arora. Live at **https://agamarora.com**. Source repo: `agamarora/agamarora`.

## Active Work

**second-brain v1** — three-layer build: wiki (10 themes) + kg.json ontology + /enter v3 as thin playback layer.

- **Spec** (canonical): `docs/plans/second-brain-v1.md` — locked 2026-04-24
- **CEO review**: `docs/plans/second-brain-v1-ceo-review.md`
- **Architecture doc** (system stitching, request flow, failure modes, gaps): `~/.claude/plans/rosy-plotting-flame.md` — approved 2026-04-24
- **Project memory**: `~/.claude/projects/C--aa-agamarora/memory/project_second_brain_v1.md`

**Corpus** is local at `~/.gstack/projects/agamarora-agamarora/corpus/` (4 files copied 2026-04-24 from private repo `agamarora/agam-linkedin`).

**Phase A pivot 2026-04-24:** Original spec §12 required Agam full-read. Pivoted because synthesizer = source author (Agam wrote the corpus, doesn't need to "learn" it). Replaced with Task #2a (CC subagent fan-out, autonomous, 1-2hr) + Task #2b (Agam taste-pass, 60-90min, irreplaceable). See spec §12 revised + architecture doc §1.

**Next session pickup (READ THIS):** Open `docs/plans/second-brain-v1-phase-a/STATUS.md` first. It's the git-tracked single source of truth for Phase A round-by-round state, updated + pushed after every milestone. Tells you exactly which round to spawn next, what binding taste-calls to apply, and how to resume across machines/sessions.


## Subagent model policy (HARD RULE)

For this project, subagents MUST run sonnet or haiku — never opus, never inherit opus from parent.

- **Default**: `model: "sonnet"` on every Agent tool call.
- **Haiku exception**: pass `model: "haiku"` for simple stateless tasks — single-file lookups, single-grep, format conversions, trivial diffs, doc reformats. No reasoning chain, no multi-step research.
- **Never**: `model: "opus"` for any subagent. No exceptions.
- Agent definitions at `~/.claude/agents/*.md` already pin sonnet via frontmatter; the per-call `model` param here exists only to drop to haiku when warranted.

Decision rule: if task is "find/read/transform one thing, no judgment" → haiku. Else → sonnet.

## Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript. No framework, no build step. Every page is self-contained — no shared stylesheets or scripts.
- **Hosting**: Netlify (static site + one serverless function)
- **Fonts**: Satoshi (self-hosted variable woff2 in `/fonts/satoshi/`), JetBrains Mono, Patrick Hand (Google Fonts)
- **Icons**: Font Awesome 6.5.0 (CDN, preload + onload swap)
- **Backend**: Netlify serverless function (`netlify/functions/groqHandler.mjs`) using Groq SDK, called from `/enter`
- **Domain**: agamarora.com (Netlify DNS, auto-deploys from `main`)

## Development Commands

```bash
# Install dependencies (only needed for the Groq serverless function)
npm install

# Local dev with static server (no serverless function)
npx serve .

# Local dev with Netlify functions (requires .env with GROQ_API_KEY)
netlify dev
```

There is no build step, linter, formatter, or test suite. Files are served as-is.

## Deployment

Pushes to `main` auto-deploy via Netlify. Cache headers + `/explore → /lab` 301 redirect are in `netlify.toml`. The Groq API key (`GROQ_API_KEY`) is set in the Netlify dashboard, not in the repo.

## Architecture

Every public page is a single standalone `index.html` with inline `<style>` and `<script>` blocks. No shared CSS, no shared JS, no build step to resolve. This is intentional — each page can be read, edited, or rewritten without cascading impact on the others.

### Pages (all v2)

| Route | File | Purpose |
|-------|------|---------|
| `/` | `index.html` | Landing — greeting cycle, name, tagline, 3 CTAs, logo strip |
| `/lab` | `lab/index.html` | Projects — second-brain, AI Resume, Voice AI, Claude Code Resource Monitor |
| `/lab/second-brain/` | `lab/second-brain/index.html` | second-brain PRFAQ + launch-article copy + paste-prompt (same body ships to Medium + LinkedIn long-form) |
| `/lab/ai-resume/` | `lab/ai-resume/index.html` | AI Resume PRFAQ + setup wizard paste-prompt |
| `/resume` | `resume/index.html` | Resume — dark editorial, career data, print-friendly |
| `/enter` | `enter/index.html` | Immersive AI terminal — keyboard background, Groq streaming, conversation memory |
| `/moodboard` | `moodboard/index.html` | Design system reference (orphan from main nav, internal use) |
| `/moodboard/aa-mark` | `moodboard/aa-mark.html` | aa. mark component exploration |

### Shared layout contract (every v2 page)

- **Top-left: icon bar** (GitHub · LinkedIn · YouTube · CV · Home) — fluid `clamp(52px, 6vw, 64px)` header, social icons `clamp(1.15rem, 1.3vw, 1.5rem)`. CV is a JetBrains Mono text-icon (class `nav-icon`, `clamp(0.78rem, 0.95vw, 0.92rem)`, weight 500, uppercase, letter-spacing 0.04em) sized to fit the same 2em box as the SVG icons — keeps the bar subtle, no separators or text labels. Wiki and Lab are reachable from the landing page CTAs (Enter / Wiki / Lab), not the header.
- **Bottom-right: aa. mark** — fixed position, `clamp(44px, 5vw, 60px)` wide, stroke-draw animation on load, opacity 0.7 → 1.0 on hover
- **Content: centered or left-aligned column** — max-width varies per page (~720-880px)

Each page defines these CSS rules inline (comment-tagged `=== Shared v2 header ===` / `=== Shared aa. mark ===`) so edits stay local. The stroke-draw animation JS lives inline at the bottom of each page.

### Design tokens (inline in every v2 page)

```
--bg: #0A0A0A          --mono: 'JetBrains Mono', monospace
--surface: #111111     --sans: 'Satoshi', system-ui, sans-serif
--border: #1E1E1E      --mark: 'Patrick Hand', cursive
--text: #E8E4DF        --accent: #E5A54B (gold)
--text-dim: #7A7A7A    --accent-dim: rgba(229, 165, 75, 0.12)
```

Spacing: 8px base, tokens `--space-3` (8px) through `--space-9` (64px).

Dark-only. No light mode. No theme toggle. The moodboard at `/moodboard` is the design system reference (orphan from live nav but kept as a design doc).

### Serverless function

`netlify/functions/groqHandler.mjs` — ESM, Web Standard Request/Response. Groq SDK streaming SSE. 4-model fallback chain (llama-3.1-8b-instant → qwen3-32b → gpt-oss-20b → llama-3.3-70b-versatile). Sandwich prompt defense, injection filter, 6-message conversation history. System prompt grounded in `resume.md` with few-shot examples. Eval harness at `eval-prompt.mjs`. Called only from `/enter`.

## Conventions

- **Edit patterns:** when changing the header or aa. mark, update all v2 pages in one commit so the contract stays unified. Look for the `=== Shared v2 header ===` and `=== Shared aa. mark ===` comment blocks.
- **Card media slots (e.g., `/lab` project cards):** flex row, `flex: 1 1 0; min-width: 0` on both columns, no `aspect-ratio` on the media element — info column drives row height, media stretches, img at `width/height: 100%` with `object-fit: cover` fills deterministically. See `lab-media-slot-parity` learning.
- **Images on lab cards:** pre-crop the source PNG to the intended aspect, use `object-position` only for a small anchor nudge. Do NOT CSS-crop aggressively. See `precrop-images-not-css` learning.
- **Icons on CTAs:** use semantic Font Awesome icons (`fa-book-open` for docs, `fa-download` for downloads, `fa-github` for code). Not generic arrows.
- **Display names:** on lab cards, the title should be plain-English descriptive ("Claude Code Resource Monitor"), not the repo/package name ("luna-monitor"). Repo names stay only in URLs, IDs, class names, asset filenames.

## gstack

gstack (Garry Tan's 23-skill engineering toolkit) is the default workflow here. Install it with:

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

**Web browsing:** always use the `/browse` skill from gstack. Never use `mcp__claude-in-chrome__*` tools.

**Available skills:** `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`, `/retro`, `/investigate`, `/document-release`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`.

Run `/gstack-upgrade` periodically to stay current.

## Known Issues

Tracked in `TODO.md`. Current:

- `/moodboard` is orphan from main nav — by design (design doc, not user-facing). `robots: noindex` and `robots.txt` entries added 2026-04-22.
- `/lab` OG image is still the generic site preview. A dedicated OG image for the lab page (and for `/lab/second-brain/` individually) would lift social-share CTR.
- Font Awesome 6.5.0 full CSS loads from CDN on every v2 page. Only ~8 icons actually used — could be subset.

## Conventions for video media in lab slots

- `/lab/second-brain/` uses a looping video both in the `/lab` card media slot and in the PRFAQ hero. Source encoded at 720×720, H.264, no audio, `+faststart`. 1.2MB. Plays `autoplay muted loop playsinline` with a poster JPG for instant paint.
- Media-slot behavior matches image behavior: `object-fit: cover`, flex-stretched, info column drives row height.
- When re-encoding: use `imageio-ffmpeg` bundled Python package if ffmpeg is not on PATH (pip install imageio-ffmpeg, then `python -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"`).
