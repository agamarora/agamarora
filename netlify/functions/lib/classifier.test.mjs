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

test('preRoute: superlative → headline marker', () => {
  for (const q of [
    'what is his best work',
    'biggest project he has built',
    'favorite product he shipped',
    'whats his most impressive achievement',
    'main project hes proud of',
  ]) {
    const r = preRoute(q);
    assert.equal(r?.type, 'synthesis', `expected synthesis for "${q}"`);
    assert.deepEqual(r?.themes_likely, ['headline'], `expected ['headline'] for "${q}", got ${JSON.stringify(r?.themes_likely)}`);
    assert.equal(r?.route_reason, 'preroute_headline');
  }
});

test('preRoute: voice-specific superlative routes to voice-ai-craft theme, not headline', () => {
  // "best voice ai work" should hit voice-ai-craft keyword first (more specific)
  const r = preRoute('what voice ai stack hits 4M calls');
  assert.equal(r?.type, 'synthesis');
  assert.deepEqual(r?.themes_likely, ['voice-ai-craft']);
});

test('preRoute: contact query NOT misrouted to headline', () => {
  // "best way to reach him" — best appears but is contact-shaped
  // CONTACT_RE has higher priority in preRoute order (contact before headline)
  const r = preRoute('best way to reach him');
  assert.equal(r?.type, 'synthesis');
  assert.deepEqual(r?.themes_likely, ['contact']);
});
