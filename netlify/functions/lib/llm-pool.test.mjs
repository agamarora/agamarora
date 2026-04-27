import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { __test } from './llm-pool.mjs';

const { resolveKeys, normalizeError, rotated } = __test;

test('resolveKeys filters env vars without values', () => {
  process.env.__TEST_K1 = 'a';
  delete process.env.__TEST_K2;
  process.env.__TEST_K3 = 'c';
  const keys = resolveKeys(['__TEST_K1', '__TEST_K2', '__TEST_K3']);
  assert.equal(keys.length, 2);
  assert.equal(keys[0].env, '__TEST_K1');
  assert.equal(keys[1].env, '__TEST_K3');
});

test('rotated produces full-length cycle from cursor', () => {
  const arr = ['a', 'b', 'c'];
  assert.deepEqual(rotated(arr, 0), ['a', 'b', 'c']);
  assert.deepEqual(rotated(arr, 1), ['b', 'c', 'a']);
  assert.deepEqual(rotated(arr, 2), ['c', 'a', 'b']);
  assert.deepEqual(rotated([], 0), []);
});

test('normalizeError maps 429-shaped fetch error to rate_limit', () => {
  const err = new Error('rate'); err.status = 429;
  const fakeHeaders = new Map([['retry-after', '12']]);
  err.headers = { get: (k) => fakeHeaders.get(k) };
  const r = normalizeError(err);
  assert.equal(r.kind, 'rate_limit');
  assert.equal(r.retryAfterMs, 12000);
});

test('normalizeError maps 500 to server_error', () => {
  const err = new Error('boom'); err.status = 500;
  const r = normalizeError(err);
  assert.equal(r.kind, 'server_error');
});

test('normalizeError unknown shape', () => {
  const r = normalizeError(new Error('weird'));
  assert.equal(r.kind, 'unknown');
});
