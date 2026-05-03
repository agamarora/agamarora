import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  resolveCard,
  resolveLLMCard,
  isKnownSlug,
  validateLLMCards,
  padCardsToThree,
  pickPadFamily,
  __test,
} from './card-meta.mjs';

// ---- resolveCard / isKnownSlug --------------------------------------------

test('resolveCard returns card for known slug', () => {
  const c = resolveCard('wiki/agent-first');
  assert.ok(c);
  assert.equal(c.slug, 'wiki/agent-first');
  assert.equal(c.kind, 'page');
  assert.equal(c.url, '/wiki/agent-first/');
});

test('resolveCard returns null for unknown slug', () => {
  assert.equal(resolveCard('does-not-exist'), null);
  assert.equal(resolveCard(''), null);
  assert.equal(resolveCard(null), null);
});

test('resolveCard sets priority when opts.priority=true', () => {
  const c = resolveCard('book-call', { priority: true });
  assert.equal(c.priority, true);
  const c2 = resolveCard('book-call');
  assert.equal(c2.priority, false);
});

test('isKnownSlug strips leading/trailing slashes', () => {
  assert.equal(isKnownSlug('/lab'), true);
  assert.equal(isKnownSlug('lab/'), true);
  assert.equal(isKnownSlug('lab'), true);
  assert.equal(isKnownSlug('not-real'), false);
});

// ---- validateLLMCards ------------------------------------------------------

test('validateLLMCards drops malformed entries', () => {
  const r = validateLLMCards([
    { slug: 'wiki/agent-first', priority: true, type: 'page' },
    null,
    { slug: '' },
    { slug: 42 },
    { slug: 'totally-fake-slug' },
    { not_slug: true },
    { slug: 'lab', type: 'page', priority: false },
  ]);
  assert.equal(r.valid.length, 2);
  assert.equal(r.dropped, 5);
  assert.equal(r.valid[0].slug, 'wiki/agent-first');
  assert.equal(r.valid[0].priority, true);
});

test('validateLLMCards normalizes slug (strip slashes)', () => {
  const r = validateLLMCards([{ slug: '/lab/', priority: false }]);
  assert.equal(r.valid[0].slug, 'lab');
});

test('validateLLMCards handles non-array input', () => {
  assert.deepEqual(validateLLMCards(null), { valid: [], dropped: 0 });
  assert.deepEqual(validateLLMCards('nope'), { valid: [], dropped: 0 });
});

// ---- pickPadFamily ---------------------------------------------------------

test('pickPadFamily: themes contact → contact family', () => {
  const f = pickPadFamily({ themes: ['contact'], query: 'whatever' });
  assert.equal(f.name, 'contact');
  assert.deepEqual(f.slugs, ['book-call', 'linkedin', 'github']);
});

test('pickPadFamily: themes headline → headline family', () => {
  const f = pickPadFamily({ themes: ['headline'], query: 'best work' });
  assert.equal(f.name, 'headline');
  assert.deepEqual(f.slugs, ['wiki/agent-first', 'wiki/graph', 'lab']);
});

test('pickPadFamily: hiring keyword query → hiring family', () => {
  const f = pickPadFamily({ themes: [], query: 'is he available for a role' });
  assert.equal(f.name, 'hiring');
});

test('pickPadFamily: voice keyword query → voice family', () => {
  const f = pickPadFamily({ themes: [], query: 'tell me about voice ai work' });
  assert.equal(f.name, 'voice');
});

test('pickPadFamily: agent/wiki keyword query → agent family', () => {
  const f = pickPadFamily({ themes: [], query: 'his thesis on agents' });
  assert.equal(f.name, 'agent');
});

test('pickPadFamily: bare bio query → default family', () => {
  const f = pickPadFamily({ themes: [], query: 'who is he' });
  assert.equal(f.name, 'default');
  assert.deepEqual(f.slugs, ['resume', 'lab', 'wiki/graph']);
});

// ---- padCardsToThree -------------------------------------------------------

test('padCardsToThree: synthesis with 0 LLM cards → 3 family cards, first priority', () => {
  const r = padCardsToThree([], {
    intent: 'synthesis',
    themes: ['headline'],
    query: 'best work',
  });
  assert.equal(r.cards.length, 3);
  assert.equal(r.padMiss, false);
  assert.equal(r.family, 'headline');
  assert.equal(r.cards[0].slug, 'wiki/agent-first');
  assert.equal(r.cards[0].priority, true, 'first padded card should be priority when LLM had none');
  assert.equal(r.cards[1].priority, false);
  assert.equal(r.cards[2].priority, false);
});

test('padCardsToThree: synthesis with 1 LLM priority card → fills 2 non-priority', () => {
  const llm = [resolveCard('wiki/agent-first', { priority: true })];
  const r = padCardsToThree(llm, {
    intent: 'synthesis',
    themes: ['headline'],
    query: 'best',
  });
  assert.equal(r.cards.length, 3);
  assert.equal(r.cards[0].slug, 'wiki/agent-first');
  assert.equal(r.cards[0].priority, true);
  // Padder should not add another priority
  const priorityCount = r.cards.filter((c) => c.priority).length;
  assert.equal(priorityCount, 1);
});

test('padCardsToThree: synthesis with 1 non-priority LLM card → first padded becomes priority', () => {
  const llm = [resolveCard('lab', { priority: false })];
  const r = padCardsToThree(llm, {
    intent: 'synthesis',
    themes: ['headline'],
    query: 'best',
  });
  assert.equal(r.cards.length, 3);
  // LLM card stays non-priority, first padded picks priority
  const priorityCount = r.cards.filter((c) => c.priority).length;
  assert.equal(priorityCount, 1, 'exactly one priority across the row');
  assert.equal(r.cards.find((c) => c.priority).slug, 'wiki/agent-first');
});

test('padCardsToThree: synthesis with 3 LLM cards → returns as-is, padMiss=false', () => {
  const llm = [
    resolveCard('wiki/agent-first', { priority: true }),
    resolveCard('wiki/graph'),
    resolveCard('lab'),
  ];
  const r = padCardsToThree(llm, { intent: 'synthesis', themes: ['headline'], query: 'best' });
  assert.equal(r.cards.length, 3);
  assert.equal(r.padMiss, false);
  assert.equal(r.added.length, 0);
});

test('padCardsToThree: synthesis with overflow LLM cards → caps at 3', () => {
  const llm = [
    resolveCard('lab'),
    resolveCard('resume'),
    resolveCard('github'),
    resolveCard('linkedin'),
  ];
  const r = padCardsToThree(llm, { intent: 'synthesis', themes: [], query: 'who is he' });
  assert.equal(r.cards.length, 3);
});

test('padCardsToThree: contact intent → book-call/linkedin/github family', () => {
  const r = padCardsToThree([], {
    intent: 'synthesis',
    themes: ['contact'],
    query: 'how to reach him',
  });
  assert.equal(r.cards.length, 3);
  assert.equal(r.family, 'contact');
  assert.equal(r.cards[0].slug, 'book-call');
  assert.equal(r.cards[0].priority, true);
  assert.equal(r.cards[1].slug, 'linkedin');
  assert.equal(r.cards[2].slug, 'github');
});

test('padCardsToThree: greeting intent → no padding', () => {
  const r = padCardsToThree([], { intent: 'greeting', themes: [], query: 'hi' });
  assert.equal(r.cards.length, 0);
  assert.equal(r.padMiss, false);
  assert.equal(r.family, null);
});

test('padCardsToThree: deflect intent → no padding', () => {
  const r = padCardsToThree([resolveCard('resume')], { intent: 'deflect', themes: [], query: 'family' });
  assert.equal(r.cards.length, 1);
  assert.equal(r.family, null);
});

test('padCardsToThree: lookup intent → padded like synthesis', () => {
  const r = padCardsToThree([], { intent: 'lookup', themes: [], query: 'who is he' });
  assert.equal(r.cards.length, 3);
  assert.equal(r.family, 'default');
});

test('padCardsToThree: dedupes LLM slug against family', () => {
  const llm = [resolveCard('wiki/agent-first', { priority: true })];
  const r = padCardsToThree(llm, { intent: 'synthesis', themes: ['agent'], query: 'agents thesis' });
  // agent family = ['wiki/graph', 'wiki/agent-first', 'lab']
  // LLM has wiki/agent-first → padder skips, fills wiki/graph + lab
  assert.equal(r.cards.length, 3);
  const slugs = r.cards.map((c) => c.slug);
  assert.deepEqual(slugs, ['wiki/agent-first', 'wiki/graph', 'lab']);
});

test('padCardsToThree: F1 — no belief slugs in any family in commit 3', () => {
  // F1 hard rule: padder MUST NOT reference belief.* slugs until commit 4.
  for (const familyName of Object.keys(__test.FAMILIES)) {
    for (const slug of __test.FAMILIES[familyName]) {
      assert.ok(!slug.startsWith('belief.'), `family ${familyName} contains belief slug ${slug} — F1 violation`);
    }
  }
});

test('padCardsToThree: F5 escape hatch — does not fall back to default from specific family', () => {
  // Manually construct a degenerate context: voice family, all 3 voice slugs already in LLM cards.
  // No remaining family slugs to add. Should ship 3 cards with padMiss=false (already at 3).
  const llm = [
    resolveCard('lab/voice-ai-production'),
    resolveCard('lab'),
    resolveCard('resume'),
  ];
  const r = padCardsToThree(llm, { intent: 'synthesis', themes: [], query: 'voice ai work' });
  assert.equal(r.cards.length, 3);
  // No padding needed — LLM already filled.
  assert.equal(r.added.length, 0);
});
