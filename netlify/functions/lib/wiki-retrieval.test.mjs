// wiki-retrieval.test.mjs
//
// Unit tests for getThemeExtract, getEdgesForThemes, getEdgesCount.
// Tests run against the actual module state (wiki bundles loaded if present).
// Run: node --test netlify/functions/lib/wiki-retrieval.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  getThemeExtract,
  getThemeExtractCharCount,
  getEdgesForThemes,
  getEdgesCount,
} from './wiki-retrieval.mjs';

// ---- Unknown slug always returns null ----------------------------------------

test('getThemeExtract: returns null for empty slug', () => {
  const result = getThemeExtract('');
  assert.equal(result, null);
});

test('getThemeExtract: returns null for unknown slug', () => {
  const result = getThemeExtract('this-slug-does-not-exist-xyz-9999');
  assert.equal(result, null);
});

test('getThemeExtract: returns null for non-string slug (null)', () => {
  const result = getThemeExtract(null);
  assert.equal(result, null);
});

test('getThemeExtract: returns null for non-string slug (number)', () => {
  const result = getThemeExtract(42);
  assert.equal(result, null);
});

// ---- Known slug: string when wiki enabled, null when disabled ----------------

test('getThemeExtract: result is string-or-null for known slug "agent-first"', () => {
  const result = getThemeExtract('agent-first');
  // If wiki bundles are present, result is a non-empty string.
  // If wiki is disabled (WIKI_READ_ENABLED=0), result is null.
  assert.ok(result === null || (typeof result === 'string' && result.length > 0),
    'must be non-empty string or null');
});

// ---- getEdgesForThemes -------------------------------------------------------

test('getEdgesForThemes: returns array for empty slugs input', () => {
  const result = getEdgesForThemes([]);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 0);
});

test('getEdgesForThemes: returns array for non-array input (null)', () => {
  const result = getEdgesForThemes(null);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 0);
});

test('getEdgesForThemes: returns array for unknown slug', () => {
  const result = getEdgesForThemes(['this-does-not-exist-xyz-9999']);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 0);
});

test('getEdgesForThemes: result for known slug is array capped at 10', () => {
  const result = getEdgesForThemes(['agent-first']);
  assert.ok(Array.isArray(result));
  assert.ok(result.length <= 10, `expected at most 10 edges, got ${result.length}`);
});

// ---- getThemeExtractCharCount ------------------------------------------------

test('getThemeExtractCharCount: returns number for any slug', () => {
  const count = getThemeExtractCharCount('agent-first');
  assert.ok(typeof count === 'number' && count >= 0);
});

// ---- getEdgesCount -----------------------------------------------------------

test('getEdgesCount: returns 0 for unknown slug', () => {
  const count = getEdgesCount(['this-does-not-exist-xyz-9999']);
  assert.equal(count, 0);
});
