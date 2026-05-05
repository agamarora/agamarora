# /enter Q&A grading — UI baseline

**Date:** 2026-05-05
**Method:** headed gstack browser, real `/enter` UI on `localhost:8888/enter/`, real Groq.
**Rubric:** `docs/plans/writing-rubric-v2.md` (18 points). Per-scenario grade A/B/C/D + top failure mode + fix lever.
**Layers:** (1) answer quality, (2) card relevance, (3) cluster fails by lever.

---

## Scenarios

### 1. niche-positioning — "what kind of pm is he"
**Answer:** "He is an agent-first AI Product Manager. He blends deep engineering fluency with product judgment, focusing on framing problems before picking models. He leads a voice platform at AIonOS that handles 4 million calls a year."

**Cards:** ★Read the agent-first take → /agent-first · Explore the constellation → /graph · Browse his lab → /lab
**Trace:** parsed → searched → matched → composed (1218ms)

**Grade: B-**
- ✅ #1 first-hand: AIonOS + 4M calls
- ✅ #16 named specificity: voice platform, AIonOS, 4M
- ✅ #13 rhythm: varied
- ❌ #15 warmth: zero asides, no specific moment
- ❌ #17 close: ends on metric "4 million calls a year" — not forward-opening
- ❌ Voice register: workmanlike, third-person memo. Not anchor-warm.

**Fix lever:** synthesis prompt voice rules in `groqHandler.mjs`. Add directive: "Close with forward implication or specific moment, not metric recap."

