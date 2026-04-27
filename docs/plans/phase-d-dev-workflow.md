# Phase D dev + eval workflow — canonical method

**Date:** 2026-04-27 (locked end of session that shipped CP-33c + D-0 + D-1)
**Status:** ✅ Locked. Default for all `/enter` agent work, all of Phase D, and all eval work.

## TL;DR

Every change to `/enter` agent (function, prompt, UI, retrieval) ships through this loop:

1. **Kill stale node procs** — free RAM
2. **`netlify dev`** in background — port 8888, env auto-injected from cloud
3. **gstack browser headed** — visible Chromium, sidebar feed, agent control
4. **Drive real `/enter` UI** — `goto`, `js focus`, `type`, `press Enter`
5. **Read real outputs** — `network`, `console`, function logs in `/tmp/netlify-dev.log`, page DOM
6. **Iterate** — Netlify dev hot-reloads functions on save; static pages reload via `goto`/reload
7. **Commit + push** when green; Netlify auto-deploys main

No isolated function harness as the only signal. **Real UI + real responses** is the truth.

---

## Why this workflow

**Bug found in D-1 that this workflow caught:** ReadableStream pull-mode hung silently under Netlify dev v20. Backend logs (`[route]` + `[provider]`) all green; client received 0 bytes. An isolated unit test on `lib/llm-pool.mjs` would not have caught this because the bug was in the response-pipeline integration, not in the pool logic. **Only end-to-end through the real Netlify Functions pipeline + real client (curl AND browser) surfaced it.**

This is the kind of bug we will keep introducing through Phase D. Therefore: dev environment must mirror prod environment as closely as possible. Netlify dev does. gstack headed browser is the actual `/enter` UI rendered in real Chromium with real network + real console.

**Eval implication:** D-6 (eval harness) runs scenarios against the real `/enter` UI in this browser. Not a JSON assertion against the function. We capture: actual SSE event flow, actual rendered DOM, actual visual cards, actual trace animations, actual errors. The user sees what the eval sees.

---

## Setup commands (run on each session start)

```bash
# 1. Kill stale node procs
tasklist //FI "IMAGENAME eq node.exe" | tail -10
taskkill //IM node.exe //F 2>&1 | tail -5

# 2. Start netlify dev in background (auto-injects 9 cloud env vars)
netlify dev > /tmp/netlify-dev.log 2>&1 &
# Wait until "Server now ready on http://localhost:8888" appears in log
until grep -q "Server now ready" /tmp/netlify-dev.log; do sleep 2; done
tail -5 /tmp/netlify-dev.log

# 3. Launch gstack browser headed
B="$HOME/.claude/skills/gstack/browse/dist/browse"
[ -f .gstack/browse.json ] && rm -f .gstack/browse.json
rm -f ~/.gstack/chromium-profile/Singleton{Lock,Socket,Cookie} 2>/dev/null
"$B" connect

# 4. Navigate to local /enter
"$B" goto http://localhost:8888/enter
"$B" snapshot
```

After this, Chromium is visible, gstack sidebar shows live activity feed, function logs streaming to `/tmp/netlify-dev.log`.

---

## Iterate loop (per change)

### Code change → smoke test

```bash
# Edit lib/* or groqHandler.mjs — netlify dev hot-reloads automatically
# Then drive UI:
B="$HOME/.claude/skills/gstack/browse/dist/browse"
"$B" goto http://localhost:8888/enter   # reload page (or full reload via goto)
"$B" js "document.getElementById('terminal-input')?.focus()"
"$B" network --clear
"$B" console --clear
"$B" type "what is the agent-first thesis"
"$B" press "Enter"
sleep 6   # let stream complete
"$B" network                             # status, latency, byte size
"$B" console                             # client errors
"$B" js "document.body.innerText.slice(-500)"   # rendered text
tail -30 /tmp/netlify-dev.log            # function-side: [route], [provider], errors
```

### Curl path (faster for function-only checks)

```bash
curl -sN -X POST http://localhost:8888/.netlify/functions/groqHandler \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:8888" \
  --data '{"prompt":"hi","history":[]}' --max-time 15
```

Use curl for first-pass response-shape checks (status, byte size, SSE event sequence). Use gstack browser for real UI + real DOM + real animations.

---

## Eval workflow (D-6) — also runs through this loop

**Old plan:** isolated `eval-prompt.mjs` POSTs to function, asserts JSON shape.

**New plan (locked 2026-04-27):** eval harness drives the same `/enter` UI in the same headed browser. For each of 23 pinned scenarios:

1. `goto http://localhost:8888/enter` (fresh page, fresh history)
2. Focus input, type scenario prompt, press Enter
3. Wait for response (poll DOM for response container update OR SSE `[DONE]`)
4. Capture: rendered text, trace lines, cards (when D-7 ships), screenshot, network timing, function logs
5. Assert: pinned classifier output (from log line), pinned answer markers (≤70w, 0 em-dashes, 0 banned LLM-isms, scenario phrase contains), pinned card slugs in sitemap, exactly 1 priority card
6. Pass/fail per scenario; ship gate = 23/23

**Why:** voice drift, animation jank, card overflow, mobile layout — all of these only surface in real DOM. Function-only eval misses them. This catches them at eval time, not at user-report time.

Eval harness file: `eval-prompt.mjs` (rewrite per Task 19 / D-6). Drives gstack browser via `$B` calls. Runs against `localhost:8888/enter` (dev) AND `https://agamarora.com/enter` (post-deploy, prod gate).

**Pre-launch gate (Phase E):** 23/23 must pass against PROD URL, not just localhost. Same harness, different `BASE_URL` env var.

---

## Logs reference

| Source | What you see | How to read |
|---|---|---|
| `/tmp/netlify-dev.log` | Function logs: `[route]`, `[provider]`, `[upstash]`, `[llm-pool]`, errors | `tail -f /tmp/netlify-dev.log` |
| `$B network` | All requests from page: status, byte size, latency, headers | `$B network` |
| `$B console` | Client-side errors, console.log from `/enter` page | `$B console` |
| `$B js "<expr>"` | DOM state, trace text, card slugs, response container content | `$B js "document.body.innerText"` |
| `$B snapshot` | Accessibility tree (good for finding elements + refs) | `$B snapshot` |
| `$B screenshot` | Pixel-level visual capture | `$B screenshot ./shot.png` |

---

## Why this is locked, not optional

- Catches integration bugs unit tests miss (proven D-1 case)
- Eval results match what users actually experience
- One-command setup; cheap to run; high signal
- Visible to user — they can watch every action, course-correct mid-flight
- Same infrastructure dev → eval → launch gate; no harness drift

**Do not bypass this loop for `/enter` work.** If you find yourself running curl-only or unit-test-only, stop, spin up the browser, run through the loop. The 30 seconds of setup pays for itself the first time you ship a regression that an isolated harness would have missed.

---

## Restart commands (when things wedge)

```bash
# Kill all node + restart
taskkill //IM node.exe //F
B="$HOME/.claude/skills/gstack/browse/dist/browse"
"$B" disconnect 2>&1 || true
rm -f .gstack/browse.json
rm -f ~/.gstack/chromium-profile/Singleton*
# Then re-run setup commands above.
```
