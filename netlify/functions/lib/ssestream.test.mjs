// Tests for ssestream.mjs — focus on the v3.1.1 pill-timing fix:
//   - Full LLM verb allowlist resolves to the correct timing key
//   - Verbs whose step didn't run get a fresh synthetic ms (20-30) per pill,
//     NOT a shared fallback (was the bug — every unmapped verb pulled
//     timings['synthesize'] and pills came back identical across steps)
//   - Verbs whose step ran get the real measured ms
//   - fallbackUsed flag accurately reports synthetic vs measured

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { buildEventStream } from './ssestream.mjs';

// Drain a ReadableStream<Uint8Array> of SSE events into parsed objects.
async function drain(stream) {
  const reader = stream.getReader();
  const dec = new TextDecoder();
  let buf = '';
  const events = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split('\n\n');
    buf = parts.pop();
    for (const p of parts) {
      if (!p.startsWith('data: ')) continue;
      try { events.push(JSON.parse(p.slice(6).trim())); } catch {}
    }
  }
  return events;
}

const baseParsed = (verbs) => ({
  trace: verbs.map((v) => ({ verb: v, args: 'ctx' })),
  answer: 'hi',
  cards: [],
});

test('pill ms: real value when step measured (composed → synthesize)', async () => {
  const events = await drain(buildEventStream(
    baseParsed(['composed']),
    { preroute: 12, classify: 12, synthesize: 3000 },
    600,
  ));
  const trace = events.filter((e) => e.type === 'trace');
  assert.equal(trace.length, 1);
  assert.equal(trace[0].ms, 3000);
  assert.equal(trace[0].pill_ms, 3000);
});

test('pill ms: synthetic 20-30 when step did NOT run (pulled on no-retrieval route)', async () => {
  const events = await drain(buildEventStream(
    baseParsed(['pulled']),
    { preroute: 12, classify: 12, synthesize: 1200 }, // no retrieve_wiki
    600,
  ));
  const trace = events.filter((e) => e.type === 'trace');
  assert.equal(trace.length, 1);
  // ms must be in synthetic band, NOT 1200 (the bug was pasting synthesize ms)
  assert.ok(trace[0].ms >= 20 && trace[0].ms <= 30,
    `expected ms in [20,30], got ${trace[0].ms}`);
  assert.notEqual(trace[0].ms, 1200);
  assert.equal(trace[0].pill_ms, 600); // MIN_PILL_MS floor
});

test('pill ms: independent random per pill (no-op pulled × 3 produces variance over many runs)', async () => {
  // Statistical: run 30 streams with 3 no-op pulled pills each, collect all
  // ms values. With 11 possible draws (20-30 inclusive) across 90 samples,
  // we'd expect >5 distinct values. The bug would produce a single repeated
  // value because the fallback grabbed timings['synthesize'].
  const allMs = [];
  for (let i = 0; i < 30; i++) {
    const events = await drain(buildEventStream(
      baseParsed(['pulled', 'pulled', 'pulled']),
      { preroute: 12, classify: 12, synthesize: 1200 },
      600,
    ));
    const trace = events.filter((e) => e.type === 'trace');
    assert.equal(trace.length, 3);
    for (const t of trace) allMs.push(t.ms);
  }
  const distinct = new Set(allMs);
  assert.ok(distinct.size >= 5,
    `expected at least 5 distinct synthetic ms values across 90 draws, got ${distinct.size} (${[...distinct].join(',')})`);
});

test('verb map: full LLM allowlist routes to expected timing keys', async () => {
  // Each group should resolve to the named key. We check via observable
  // behavior: when only that key is in timings, the pill should stamp the
  // real value (not synthetic).
  const groups = [
    { key: 'classify',       verbs: ['parsed', 'classified', 'routed', 'recognized'] },
    { key: 'retrieve_wiki',  verbs: ['read', 'pulled', 'fetched', 'loaded', 'retrieved',
                                     'searched', 'scanned', 'looked-up', 'queried',
                                     'matched', 'mapped', 'identified', 'resolved',
                                     'ranked', 'ordered', 'picked', 'scored'] },
    { key: 'retrieve_edges', verbs: ['traced', 'walked', 'followed'] },
    { key: 'synthesize',     verbs: ['composed', 'synthesized', 'reasoned', 'summarized', 'distilled'] },
    { key: 'preroute',       verbs: ['checked', 'verified', 'validated', 'confirmed',
                                     'warm', 'greeted', 'deflected', 'declined'] },
    { key: 'retry',          verbs: ['expanded'] },
  ];

  for (const group of groups) {
    for (const verb of group.verbs) {
      const timings = { [group.key]: 1234 };
      const events = await drain(buildEventStream(baseParsed([verb]), timings, 600));
      const trace = events.filter((e) => e.type === 'trace');
      assert.equal(trace.length, 1, `verb ${verb} produced no trace event`);
      assert.equal(trace[0].ms, 1234,
        `verb ${verb} expected to resolve to key ${group.key} → ms 1234, got ms ${trace[0].ms}`);
    }
  }
});

test('verb map: unknown verb gets synthetic ms (not synthesize fallback)', async () => {
  const events = await drain(buildEventStream(
    baseParsed(['zzz_unknown_verb']),
    { preroute: 12, classify: 12, synthesize: 5000 },
    600,
  ));
  const trace = events.filter((e) => e.type === 'trace');
  assert.equal(trace.length, 1);
  assert.ok(trace[0].ms >= 20 && trace[0].ms <= 30,
    `unknown verb should yield synthetic ms, got ${trace[0].ms}`);
});

test('fallbackUsed: true when synthetic, false when measured (verbose debug events)', async () => {
  // Mix: composed (measured) + pulled (no retrieve_wiki → synthetic)
  const events = await drain(buildEventStream(
    baseParsed(['composed', 'pulled']),
    { preroute: 12, classify: 12, synthesize: 2500 },
    600,
    {},
    true, // verbose → tier-2 pill_resolve events emitted
  ));
  const pillResolves = events.filter((e) => e.type === 'debug' && e.tag === 'pill_resolve');
  assert.equal(pillResolves.length, 2);
  const composedDbg = pillResolves.find((d) => d.payload.verb === 'composed');
  const pulledDbg = pillResolves.find((d) => d.payload.verb === 'pulled');
  assert.equal(composedDbg.payload.fallbackUsed, false);
  assert.equal(composedDbg.payload.realMs, 2500);
  assert.equal(pulledDbg.payload.fallbackUsed, true);
  assert.equal(pulledDbg.payload.realMs, null);
  assert.ok(pulledDbg.payload.displayMs >= 20 && pulledDbg.payload.displayMs <= 30);
});

test('no-op pills do NOT inherit timings.synthesize value (regression: v3.1 bug)', async () => {
  // Three different unmapped/no-step verbs. With the v3.1 bug, all three
  // would receive ms === timings.synthesize (3217). After fix, none should
  // ever match the synthesize value.
  const events = await drain(buildEventStream(
    baseParsed(['unknown_a', 'unknown_b', 'unknown_c']),
    { preroute: 10, classify: 10, synthesize: 3217 },
    600,
  ));
  const trace = events.filter((e) => e.type === 'trace');
  assert.equal(trace.length, 3);
  for (const t of trace) {
    assert.notEqual(t.ms, 3217, `pill ${t.verb} inherited synthesize ms (regression!)`);
    assert.ok(t.ms >= 20 && t.ms <= 30);
  }
});
