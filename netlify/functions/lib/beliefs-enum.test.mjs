import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  BELIEF_NAMESPACE,
  BELIEF_BARE_SLUGS,
  BELIEF_SLUGS,
  BELIEF_SLUGS_SET,
  isBeliefSlug,
  bareBeliefSlug,
} from './beliefs-enum.mjs';
import { filterValidSlugs } from './themes-enum.mjs';

test('BELIEF_NAMESPACE is "belief."', () => {
  assert.equal(BELIEF_NAMESPACE, 'belief.');
});

test('BELIEF_BARE_SLUGS contains all 19 belief pages', () => {
  assert.equal(BELIEF_BARE_SLUGS.length, 19, `expected 19 beliefs, got ${BELIEF_BARE_SLUGS.length}`);
  assert.ok(BELIEF_BARE_SLUGS.includes('agent-first'));
  assert.ok(BELIEF_BARE_SLUGS.includes('ship-the-prototype'));
  assert.ok(BELIEF_BARE_SLUGS.includes('pm-is-99-should-we-1-can-we'));
});

test('BELIEF_SLUGS are all namespaced', () => {
  for (const s of BELIEF_SLUGS) {
    assert.ok(s.startsWith(BELIEF_NAMESPACE), `${s} missing namespace`);
  }
});

test('isBeliefSlug accepts namespaced + rejects bare/unknown/non-string', () => {
  assert.equal(isBeliefSlug('belief.agent-first'), true);
  assert.equal(isBeliefSlug('agent-first'), false, 'bare slug must reject — namespace required');
  assert.equal(isBeliefSlug('belief.not-a-real-belief'), false);
  assert.equal(isBeliefSlug('belief.'), false);
  assert.equal(isBeliefSlug(null), false);
  assert.equal(isBeliefSlug(42), false);
  assert.equal(isBeliefSlug(''), false);
});

test('bareBeliefSlug strips prefix from valid slug, returns null otherwise', () => {
  assert.equal(bareBeliefSlug('belief.agent-first'), 'agent-first');
  assert.equal(bareBeliefSlug('agent-first'), null);
  assert.equal(bareBeliefSlug('belief.unknown'), null);
});

test('themes-enum filterValidSlugs accepts belief slugs alongside themes', () => {
  const r = filterValidSlugs(['agent-first', 'belief.agent-first', 'belief.spec-over-sprint', 'BAD', 'belief.NOPE']);
  assert.deepEqual(r.valid, ['agent-first', 'belief.agent-first', 'belief.spec-over-sprint']);
  assert.equal(r.dropped.length, 2, 'BAD + belief.NOPE both dropped');
});

test('themes-enum filterValidSlugs preserves order across mixed slug types', () => {
  const r = filterValidSlugs(['belief.spec-over-sprint', 'voice-ai-craft', 'belief.agent-first']);
  assert.deepEqual(r.valid, ['belief.spec-over-sprint', 'voice-ai-craft', 'belief.agent-first']);
});
