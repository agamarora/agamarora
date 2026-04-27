import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { THEME_SLUGS, isValidThemeSlug, filterValidSlugs } from './themes-enum.mjs';

test('THEME_SLUGS is non-empty and unique', () => {
  assert.ok(THEME_SLUGS.length >= 12, `expected ≥12 slugs, got ${THEME_SLUGS.length}`);
  assert.equal(new Set(THEME_SLUGS).size, THEME_SLUGS.length, 'slugs must be unique');
});

test('isValidThemeSlug accepts known + rejects unknown', () => {
  assert.equal(isValidThemeSlug('agent-first'), true);
  assert.equal(isValidThemeSlug('not-a-real-slug'), false);
  assert.equal(isValidThemeSlug(null), false);
  assert.equal(isValidThemeSlug(123), false);
});

test('filterValidSlugs drops unknown, dedupes, preserves order', () => {
  const r = filterValidSlugs(['agent-first', 'BAD', 'voice-ai-craft', 'agent-first', 42, null]);
  assert.deepEqual(r.valid, ['agent-first', 'voice-ai-craft']);
  // dropped: 'BAD' (unknown), 42 (non-string), null (non-string).
  // Duplicate 'agent-first' silently deduped — not reported as dropped.
  assert.equal(r.dropped.length, 3);
});

test('filterValidSlugs handles non-array input', () => {
  const r = filterValidSlugs(null);
  assert.deepEqual(r.valid, []);
  assert.deepEqual(r.dropped, []);
});
