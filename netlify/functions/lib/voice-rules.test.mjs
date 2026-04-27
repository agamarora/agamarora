// voice-rules.test.mjs
//
// Unit tests for containsBannedTerm and startsWithBannedOpener.
// Run: node --test netlify/functions/lib/voice-rules.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  containsBannedTerm,
  startsWithBannedOpener,
  BANNED_USER_FACING_TERMS,
} from './voice-rules.mjs';

// ---- containsBannedTerm -------------------------------------------------------

test('containsBannedTerm: detects "delve"', () => {
  const hits = containsBannedTerm('Let me delve into this topic.');
  assert.ok(hits.includes('delve'), `expected "delve" in hits, got: ${JSON.stringify(hits)}`);
});

test('containsBannedTerm: detects "tapestry" is NOT in the list (no false positive)', () => {
  // "tapestry" is not in BANNED_USER_FACING_TERMS — should return empty
  const hits = containsBannedTerm('A rich tapestry of experience.');
  assert.equal(hits.length, 0, `expected no hits, got: ${JSON.stringify(hits)}`);
});

test('containsBannedTerm: detects "leveraging"', () => {
  const hits = containsBannedTerm('He is leveraging modern tools.');
  assert.ok(hits.includes('leveraging'));
});

test('containsBannedTerm: detects "innovative" case-insensitively', () => {
  const hits = containsBannedTerm('An INNOVATIVE approach.');
  assert.ok(hits.includes('innovative'));
});

test('containsBannedTerm: detects LLM-ism "as an ai"', () => {
  const hits = containsBannedTerm('As an AI, I cannot...');
  assert.ok(hits.includes('as an ai'));
});

test('containsBannedTerm: returns empty for clean text', () => {
  const hits = containsBannedTerm('He shipped 4 million voice calls in production.');
  assert.equal(hits.length, 0);
});

test('containsBannedTerm: handles non-string gracefully', () => {
  const hits = containsBannedTerm(null);
  assert.equal(hits.length, 0);
});

// ---- startsWithBannedOpener ---------------------------------------------------

test('startsWithBannedOpener: detects "in today\'s fast-paced world"', () => {
  const match = startsWithBannedOpener("In today's fast-paced world, everything changes.");
  assert.equal(match, "in today's fast-paced world");
});

test('startsWithBannedOpener: returns null for clean opener', () => {
  const match = startsWithBannedOpener('He shipped a product that handles 4M calls a year.');
  assert.equal(match, null);
});

test('startsWithBannedOpener: handles non-string gracefully', () => {
  assert.equal(startsWithBannedOpener(undefined), null);
});
