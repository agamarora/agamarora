import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { invokeSynthesisJson, diagnostics, __test } from './llm-pool.mjs';

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

// ---- invokeSynthesisJson: full pool exhaustion returns static fallback --------
//
// With no GROQ/MISTRAL keys in env, the attempt list is empty and
// invokeSynthesisJson must return staticFallbackJson immediately.

test('invokeSynthesisJson: returns staticFallbackJson when all keys absent', async () => {
  // Ensure no provider keys are set for this test
  const saved = {};
  for (const k of ['GROQ_API_KEY', 'GROQ_API_KEY_2', 'GROQ_API_KEY_3', 'MISTRAL_API_KEY', 'MISTRAL_API_KEY_2']) {
    saved[k] = process.env[k];
    delete process.env[k];
  }

  try {
    // invokeSynthesisJson resolves keys at module init time, so the pool
    // built at import time is already empty if no keys were set then.
    // This test validates the staticFallbackJson shape contract.
    const diag = diagnostics();
    if (diag.groq_keys > 0 || diag.mistral_keys > 0) {
      // Keys were set at import time — skip this specific assertion
      return;
    }

    const result = await invokeSynthesisJson({
      messages: [{ role: 'user', content: 'hello' }],
    });

    assert.ok(result, 'result must be defined');
    assert.equal(result.providerKeyId, 'static');
    assert.equal(result.modelUsed, 'static');
    assert.equal(typeof result.json.answer, 'string');
    assert.ok(result.json.answer.length > 0, 'fallback answer must not be empty');
    assert.ok(Array.isArray(result.json.trace), 'fallback must have trace array');
    assert.ok(Array.isArray(result.json.cards), 'fallback must have cards array');
    assert.ok(typeof result.wallClockMs === 'number', 'wallClockMs must be number');
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v !== undefined) process.env[k] = v;
    }
  }
});
