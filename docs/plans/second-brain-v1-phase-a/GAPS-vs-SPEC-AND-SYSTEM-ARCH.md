---
type: GapAnalysis
status: draft
written: 2026-04-26
purpose: Compare ARCHITECTURE-AND-FILE-AUDIT.md (sketch from Agam session) against canonical spec + system arch doc. Surface gaps before any code.
inputs:
  - docs/plans/second-brain-v1.md (canonical spec, locked 2026-04-24)
  - docs/plans/second-brain-v1-ceo-review.md (scope decisions, locked 2026-04-24)
  - ~/.claude/plans/rosy-plotting-flame.md (system architecture, approved 2026-04-24)
  - docs/plans/second-brain-v1-phase-a/ARCHITECTURE-AND-FILE-AUDIT.md (just-written sketch)
---

# Gaps — my arch sketch vs canonical spec

I (Claude) wrote `ARCHITECTURE-AND-FILE-AUDIT.md` from first principles after the taste-pass. It captured the file inventory and second-brain destiny well, but the `/enter v3` architecture I sketched was thin compared to what was already specified.

The canonical spec + system arch doc define a much richer `/enter v3` system. Below: every meaningful gap, classified.

---

## SUMMARY: 17 gaps, 4 categories

- **Category 1 — Architecture I missed entirely** (10 items): classifier, multi-tier model waterfall, cards system, SSE event protocol with trace/token/card/done events, abuse defense (T0-T2), Upstash Redis, multi-key Groq rotation, agent UA gate, kg.json public asset, site.json artifact.
- **Category 2 — Wrong design choice** (3 items): proposed embeddings + vector retrieval; spec says classifier-driven theme retrieval. Proposed building wiki HTML from markdown via /design-html; spec says hand-authored HTML per page (site convention) with build script for kg.json only. Proposed quarterly re-synthesis as primary update path; spec says manual + Phase 2 cadence.
- **Category 3 — Missing artifacts** (3 items): quote library page, per-theme OG images, thesis post at /writing/second-brain-live/, public voice page at /wiki/voice/.
- **Category 4 — Missing constraints** (1 item): launch gate is wiki + /enter v3 + thesis post live SIMULTANEOUSLY. No partial ship.

---

## GAP 1 — Classifier-then-router (CRITICAL)

**Spec §6 + arch doc §3.4:**

```
User query → Classifier (Groq 8B, 200 tokens, structured output)
            → returns { type, confidence, themes_likely[] }
              type ∈ {lookup, synthesis, bio, deflect}
            → Router picks LLM tier based on type
```

**My sketch said:** "embed question, score against 13 themes, pick top 2-3."

**The right shape:** classifier IS the router. No embeddings. Classifier uses cheap Groq 8B call (~200ms, free-tier-multikey) and returns intent + theme slugs directly. Router then picks the LLM tier:

- `lookup / deflect / bio` or low-confidence → Groq 8B (free, multi-key rotation)
- `synthesis` or multi-hop → DeepSeek V3 / Mixtral primary
- Fallback chain: Groq 8B → Groq 70B → DeepSeek → Mixtral → Claude Haiku 4.5 cached
- Claude Haiku ONLY when cheaper providers fail OR query flagged high-value

**Why this matters:** my embedding-based retrieval would have added a separate embedding service (cost + latency + SPOF) that the spec deliberately avoids. Classifier-driven retrieval is simpler, cheaper, and matches the cheap-first cost discipline.

**Action:** scrap embedding retrieval from arch doc §2. Replace with classifier + theme-bundle retriever per spec §6.

---

## GAP 2 — Cards system (CRITICAL)

**Spec §6:** every /enter response emits 2-4 cards. Exactly 1 has `priority: true` (gold-accent stripe). Cards link to `/wiki/<theme>`, `/resume`, `/lab/<project>`, externals (LinkedIn, GitHub, etc.), or actions.

Default intent → card mapping (spec §6):

| Intent | Priority | Supporting |
|---|---|---|
| Product thinking / taste | `/wiki/pm-taste` | `/wiki/agent-first`, `resume-avp` |
| Voice AI | `shararat-live` | `/wiki/voice-ai-craft`, `resume-avp` |
| AI capability probe | `/wiki/ai-pm-skillset` | `lab`, `/wiki/breadth-as-differentiation`, `github` |
| Evolution / philosophy | `/wiki/agent-first` | `/wiki/eras` (now retired), `/writing/second-brain-live` |

**My sketch:** zero cards. Just streamed text response.

**Why this matters:** cards are the routing mechanism that turns /enter from "an AI that talks" into "an AI that hands you the right next page." Without cards, the wiki + lab + resume routes don't get pulled into the conversation. Cards are the conversion surface.

**Action:** add full cards spec to arch doc. Schema + emission rules + intent mapping. Update intent-to-card map to reflect taste-pass changes (eras retired; substance-over-hype now root; voice-ai-craft confirmed peer page).

---

## GAP 3 — SSE event protocol with discrete events (CRITICAL)

**Spec §6 + arch doc §3.5:** SSE stream has FOUR event types:

```
event: trace      data: { line: "Looking up agent-first thesis..." }
event: token      data: { text: " I think " }
event: card       data: { slug, priority, title, href, blurb }
event: done       data: { duration_ms, model_used, cost_estimate }
event: error      data: { message, fallback_used? }
```

Trace lines stagger 150ms client-side. Tokens stream as the LLM produces them. Cards arrive at end. Done closes the stream.

**My sketch:** "stream response back to /enter." Generic streaming.

**Why this matters:** the trace surface is the visible reasoning. User sees "Looking up agent-first..." → "Pulling 3 wiki excerpts..." → "Drafting answer..." then text streams in. This is the AGENT NESS of /enter v3. Without it, /enter is a chatbot. With it, /enter is an agent showing its work.

**Existing client (`enter/index.html:639-669`)** only knows `data:` lines without `event:` field. Must extend parser to dispatch on event type. Token rendering preserves existing drip pattern.

**Action:** lock the SSE protocol in arch doc. Note client + server ship in same commit (otherwise client breaks).

---

## GAP 4 — Abuse defense tiers 0-2 (CRITICAL)

**Spec §7 — full abuse defense spec:**

- **Tier 0** (always on, $0): UA gate (agent crawlers → static kg.json no LLM); input validation (msg ≤ 500 chars, history ≤ 4000 tokens, turn cap 6); duplicate-query in-mem cache 60s TTL; injection filter (block "ignore previous", "system prompt", etc.).
- **Tier 1** (Upstash Redis free tier): per-IP bucket 30 q/h sliding window; low-effort gate (≤3 words → cheap path).
- **Tier 2** (THE REAL DEFENSE): daily spend cap $3, monthly cap $30, per-query cap $0.05.
- **Multi-key Groq rotation:** 4 keys round-robin, cool-down on 429.
- **Kill switches:** `CLAUDE_DISABLED=1` env flag, `LLM_DISABLED=1` env flag.
- **Feature flag:** `WIKI_READ_ENABLED` to bypass wiki retrieval if regressions.

Spec's core principle: **"cost cap is the only reliable defense. Everything else is friction."**

**My sketch:** "existing sandwich-prompt defense + injection filter in groqHandler.mjs." Single line.

**Why this matters:** this is the entire reason /enter can be public-facing without burning Agam's wallet. Without spend caps, a single bad actor or runaway agent can rack up $100+ in hours. Spec is conservative — $3/day hard cap means worst case is $90/month. My sketch left this unsaid.

**Upstash Redis is a NEW external dependency.** Free tier sufficient. Two failure modes: rate-bucket fail-open (legitimate users keep working), spend-counter fail-closed (money protected).

**Action:** full abuse defense section in arch doc. Cost-cap-first framing. Upstash dep declared. Kill-switch env flags documented.

---

## GAP 5 — Multi-key Groq rotation (MEDIUM)

**Spec §7:** pool of 3-4 Groq API keys. Round-robin per request. On 429 from one key, mark cool-down 60s, move to next. Effective free-tier capacity = 4× single-key. Removes Groq rate limit as a spend trigger.

**My sketch:** single Groq call. No multi-key.

**Action:** declare GROQ_KEY_1..4 env vars. Round-robin client wrapper.

---

## GAP 6 — Agent UA gate (MEDIUM)

**Spec §7 Tier 0:**

```
UA list: GPTBot, ClaudeBot, PerplexityBot, Anthropic-ai, Applebot-Extended,
         cohere-ai, Google-Extended

Match → return static JSON manifest from /wiki/kg.json excerpt. NO LLM call.
```

**My sketch:** treated all `/enter` requests as human users.

**Why this matters:** when a crawler agent (e.g., ChatGPT browsing on behalf of a user) hits /enter, returning a structured static response is faster, cheaper, AND more parseable for the agent. The crawler doesn't want a streamed conversation; it wants the index. Agent UA gate is the right surface for that.

**Action:** add UA gate to arch doc Tier 0 section.

---

## GAP 7 — kg.json as public static asset (MEDIUM)

**Spec §3:** `/wiki/kg.json` is a PUBLIC STATIC ASSET. Full graph (themes/beliefs/projects/people/tech/edges) served from CDN. Clients + agents + llms.txt all reference it.

**My sketch:** ontology lives "behind the function only." Treated ontology-v1.md as private input that the agent reads.

**The right shape:** kg.json is BOTH things at once.
- **Public static asset** at `/wiki/kg.json` — for agent crawlers, third parties, llms.txt manifest.
- **In-function bundle** — `kg-themes-summary.mjs` is generated at build time and imported by groqHandler. Avoids HTTP fetch inside function. No SPOF.

**Action:** correct arch doc tier 3 to make kg.json public + machine-readable. Add `scripts/build-kg.mjs` as the generator.

---

## GAP 8 — site.json artifact (MEDIUM)

**Spec §6 + arch doc:** `site.json` is the sitemap DAG + externals + actions + sub-agents. Loaded into the STABLE cached system prompt block. Net-new artifact (Task #15).

**My sketch:** never mentioned site.json.

**Why this matters:** site.json gives the agent the structural map of agamarora.com. Without it, the agent doesn't know `/lab/second-brain` exists, can't link to `/resume`, etc. Cards reference site.json entries.

**Action:** add site.json to artifact tree in arch doc. Note it's net-new.

---

## GAP 9 — llms.txt + llms-full.txt (LOW but flagged)

**Spec §0.5:** llms-full.txt at repo root, full wiki text inlined for one-shot agent reads. Already exists per system arch §6.4 (extending, not net-new).

**My sketch:** never mentioned.

**Action:** add to arch doc artifact tree.

---

## GAP 10 — Voice page at /wiki/voice/ (LOW)

**Spec §4:** `/wiki/voice/index.html` is the PUBLIC-FACING voice calibration doc (400-600 words, lighter than internal `voice-spec.md`).

**My sketch:** treated voice-spec.md as runtime-only.

**Action:** flag /wiki/voice as a derived public page. Source from voice-spec.md §9 (wiki-home voice doc snippet) + register summaries.

---

## GAP 11 — Wrong design choice: embeddings vs classifier retrieval

**My sketch:** stage-1 theme retrieval via embedding cosine similarity, stage-2 chunk retrieval same. Flat JSON cache of embeddings.

**Spec design:** classifier returns `themes_likely[]` (slugs). Retriever looks up bundled wiki excerpts for those slugs from an in-memory JS module. No embeddings, no vector store, no cosine.

**Why spec is right:**
- Classifier already has to run for routing decision. Reusing its `themes_likely` output is free.
- Embeddings add: embedding service dep + cost per query + cache invalidation complexity + a SPOF.
- Theme set is small (12 themes). Slug-keyword matching in classifier prompt is enough.

**Action:** scrap embeddings entirely from arch doc. Replace with classifier-driven theme bundling per spec §6.

---

## GAP 12 — Wrong design choice: HTML generation

**My sketch:** "Build wiki HTML from markdown drafts via /design-html skill or hand-coded per existing v2 contract."

**Spec §11 + system arch §4:** markdown source in workspace, build script generates kg.json. HTML per theme page is **hand-authored** (per agamarora.com site convention — every page is self-contained inline-style HTML). The build script is for kg.json only.

System arch §4 surfaces this as Open Q2 — scaffold + hand-finish vs full generate. Spec implies hand-authored.

**Action:** correct arch doc to: markdown is source, HTML is hand-authored per existing v2 page contract (`=== Shared v2 header ===`, `=== Shared aa. mark ===`), build script handles kg.json + kg-themes-summary.mjs only.

---

## GAP 13 — Wrong design choice: re-synthesis cadence

**My sketch:** "Path A: Periodic re-synthesis (quarterly or as-needed)" as the primary update path.

**Spec §11 Q5:** "Update cadence: manual for v1. Weekly LinkedIn re-scrape + diff + re-synthesize is Phase 2."

**Action:** demote periodic re-synthesis from primary to "Phase 2 if the cadence earns it." Manual edit (Path B) is the ONLY v1 path.

---

## GAP 14 — Missing artifact: quote library

**CEO review accepted scope (Task #23):** `/wiki/quotes/` page — extracted signature lines from corpus, copy-ready social asset. ~45 min effort.

**My sketch:** never mentioned.

**Action:** add to artifact tree. Source signature lines from voice-spec.md §3 (real signatures) + voice-samples.md verbatim list.

---

## GAP 15 — Missing artifact: per-theme OG images

**CEO review accepted scope (Task #24):** custom OG image per wiki theme page, reusing existing per-page OG pipeline. ~30 min for 10 themes (now 12).

**My sketch:** mentioned generic OG once, didn't make it part of the build.

**Action:** add to artifact tree. Note existing OG pipeline at agamarora.com handles this; just need 12 source PNGs.

---

## GAP 16 — Missing artifact: thesis post

**Spec §2 + Task #5:** `/writing/second-brain-live/` thesis post. The launch artifact. Cross-posts to Medium + LinkedIn long-form on launch day.

**My sketch:** mentioned launching but didn't include thesis post in the artifact tree.

**Action:** add /writing/second-brain-live/index.html to artifact tree. Mark as launch-blocker.

---

## GAP 17 — Launch gate: simultaneous, not sequential

**Spec §0 + §8:** "Launch gate: wiki + /enter v3 + thesis post live together. No partial ship. Single moment, multiple assets."

**My sketch:** Phase B then Phase C then Phase D as if sequential ships were okay.

**Why this matters:** the thesis post drives traffic. Without /enter v3 ready, the post sends people to a broken or pre-existing /enter v2 that doesn't reflect the wiki. Without the wiki, the post has nowhere to point. All three ship the same day or none ship.

**Action:** correct arch doc §3 (second-brain destiny) to lock the launch sequence per spec §8.

---

## What MY sketch got right (preserve in revision)

- Tier 3 runtime artifact identification: profile + voice spec + ontology + wiki pages are the 4 runtime files. (Spec agrees.)
- File audit by tier (input/intermediate/decision/runtime/template). Useful organization spec doesn't have.
- Three reader personas (random visitor, recruiter, future-Agam, agent). Spec implies but doesn't enumerate.
- Lifecycle paths A/B/C. Spec confirms manual is v1; periodic + agent-suggested are Phase 2/3.
- Hobbyist-scope discipline per taste-pass B3 decision. Doesn't conflict with spec's launch claims.

## What MY sketch got wrong (correct in revision)

- Embedding-based retrieval (Gap 11) — scrap.
- HTML generation from markdown (Gap 12) — correct to hand-authored.
- Quarterly re-synthesis as primary path (Gap 13) — demote to Phase 2.
- Sequential phase ships (Gap 17) — correct to simultaneous launch.

## What MY sketch missed entirely (add in revision)

- Classifier-then-router (Gap 1)
- Cards system (Gap 2)
- SSE event protocol (Gap 3)
- Abuse defense tiers (Gap 4)
- Multi-key Groq (Gap 5)
- Agent UA gate (Gap 6)
- kg.json public static asset (Gap 7)
- site.json (Gap 8)
- llms.txt files (Gap 9)
- /wiki/voice/ public page (Gap 10)
- Quote library (Gap 14)
- Per-theme OG images (Gap 15)
- Thesis post (Gap 16)

---

## What this means for next steps

The taste-pass decisions still hold — those are about content (themes, beliefs, voice). The taste-pass did NOT change `/enter v3` architecture; the spec already specified it.

What's needed:

1. **Discard or revise** `ARCHITECTURE-AND-FILE-AUDIT.md` Section 2 (LLM architecture). The spec + system arch doc are canonical. My sketch was an underdraft.
2. **Apply taste-pass decisions** to ontology + wiki content (Task 8 + final wiki polish). These are content changes, NOT architecture changes.
3. **Read the system arch doc (`~/.claude/plans/rosy-plotting-flame.md`) when implementing Phase D.** It's already approved; just hadn't been surfaced in this session.
4. **Open architectural decisions still need user calls** (per system arch §10):
   - **Q1:** Wiki retriever — bundle in function (recommend) vs runtime fetch?
   - **Q2:** Wiki HTML generation — scaffold + hand-finish vs full generate vs pure hand-authored?
   - **Q3:** Eval harness — full rewrite to call function E2E, or two harnesses?
   - **Q4:** Card schema field names — lock now to avoid drift.
   - **Q5:** Per-IP identity for rate limit — Netlify `x-nf-client-connection-ip` header confirmed.

These 5 decisions block Phase D code. Phase A → B → C can proceed without them.

---

*This gap analysis exists to keep my (Claude's) future passes grounded in what's already locked. The spec is authoritative; my session sketch is not.*
