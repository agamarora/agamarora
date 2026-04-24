# second-brain v1 — Phase A artifacts

This directory contains the multi-pass recursive synthesis state for **second-brain v1 Phase A** (the synthesis foundation that feeds the wiki + KG + agent).

**Status:** WORK IN PROGRESS. Pre-taste-pass. Not authoritative.

**Why this is in the public repo:** spec lives at `docs/plans/second-brain-v1.md` as canonical. This sub-directory holds the live Phase A state so it survives across machines + sessions via git. The corpus content itself is public (LinkedIn posts are public by definition), but the extraction tooling/source archive is intentionally NOT documented here. What's in this directory: synthesis outputs derived from the corpus.

## How to read this directory

1. Start with `STATUS.md` — single source of truth for round-by-round Phase A state. Updated after every milestone.
2. `interim-taste-calls.md` — binding decisions Agam made inline during synthesis. Downstream rounds apply these.
3. `synthesis/` — generated artifacts per round. Each round adds files; later rounds supersede or extend earlier ones.

## How to resume on a new machine

```bash
gh repo clone agamarora/agamarora
cd agamarora
# Obtain the 4 corpus files (linkedin-corpus.md, linkedin-posts-full.json,
# linkedin-comments.md, linkedin-comments-full.json) via your usual personal
# archive method. Place them at:
mkdir -p ~/.gstack/projects/agamarora-agamarora/corpus
# (cp/scp/rsync/personal-cloud-pull — whatever you use; details intentionally not in this repo)

# Then: open Claude Code in the repo root, read docs/plans/second-brain-v1-phase-a/STATUS.md, resume.
```

## Authoring rule for Claude Code (binding)

- All synthesis artifacts (R3+ subagent outputs, taste-pass, ontology drafts) MUST be written to `docs/plans/second-brain-v1-phase-a/synthesis/<file>.md` so they're git-tracked.
- The `~/.gstack/projects/agamarora-agamarora/corpus/synthesis/` path is now **legacy working cache** — old subagents may still write there in-flight; new subagents write to repo path.
- Update `STATUS.md` after every round.
- **Don't commit corpus files** (linkedin-corpus.md, linkedin-comments.md, linkedin-posts-full.json, linkedin-comments-full.json) into this repo. Those stay in `~/.gstack/` only. Reason: corpus content is fine to be public (LinkedIn posts are public by default), but extraction tooling/method is intentionally not documented in this public repo.
- **Don't commit any extraction scripts, scrapers, or "how to pull LinkedIn data" instructions** into this repo.
- Synthesis outputs (which derive from corpus) ARE OK in this repo — they're processed analysis, not raw export.
