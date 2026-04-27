import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { preRoute } from './classifier.mjs';

test('preRoute: bare greeting → lookup', () => {
  for (const g of ['hi', 'Hey', 'hello', 'sup', 'yo', 'good morning']) {
    const r = preRoute(g);
    assert.equal(r?.type, 'lookup', `expected lookup for "${g}"`);
  }
});

test('preRoute: very short query → lookup', () => {
  const r = preRoute('who is he');
  assert.equal(r?.type, 'lookup');
});

test('preRoute: deflect pattern (politics) → deflect', () => {
  const r = preRoute('what are your political views on the election');
  assert.equal(r?.type, 'deflect');
});

test('preRoute: deflect pattern (family) → deflect', () => {
  const r = preRoute('tell me about your family and kids');
  assert.equal(r?.type, 'deflect');
});

test('preRoute: agent-first keyword → synthesis with slug', () => {
  const r = preRoute('what is the agent-first thesis exactly');
  assert.equal(r?.type, 'synthesis');
  assert.deepEqual(r?.themes_likely, ['agent-first']);
});

test('preRoute: voice ai keyword → synthesis with slug', () => {
  const r = preRoute('how does the voice ai stack hit 4M calls');
  assert.equal(r?.type, 'synthesis');
  assert.deepEqual(r?.themes_likely, ['voice-ai-craft']);
});

test('preRoute: ambiguous / no match → null (caller calls classifier)', () => {
  const r = preRoute('what was his role at the analytics company in 2014');
  assert.equal(r, null);
});

test('preRoute: non-string input → null', () => {
  assert.equal(preRoute(null), null);
  assert.equal(preRoute(42), null);
});
