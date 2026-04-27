// upstash-client.mjs
//
// Minimal REST client for Upstash Redis with primary → backup → null
// failover. Used by llm-pool (cool-down state) and abuse-defense (rate
// bucket + dedup cache, added in D-5).
//
// Failover semantics (per phase-d-decisions-2026-04-27.md Decision 6 + §7):
//   - Primary host fails → try backup host
//   - Backup also fails → return null; caller decides degrade behavior
//   - For cool-down: degrade to module-memory Map
//   - For rate bucket: fail open (allow request)
//
// All keys SHOULD carry TTL. Eviction policy on both Upstash projects
// is allkeys-lru (manual dashboard config — see next-session-plan.md
// "Manual TODO" note).

const PRIMARY = {
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
};
const BACKUP = {
  url: process.env.UPSTASH_REDIS_REST_URL_2,
  token: process.env.UPSTASH_REDIS_REST_TOKEN_2,
};

function isConfigured(host) {
  return !!(host.url && host.token);
}

async function rawCall(host, command, signal) {
  if (!isConfigured(host)) return { ok: false, error: 'unconfigured' };
  const res = await fetch(host.url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${host.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, error: `http_${res.status}`, detail: text };
  }
  const data = await res.json().catch(() => null);
  return { ok: true, result: data?.result };
}

// Run command against primary; on failure, try backup; on backup failure,
// return null (caller handles degrade). Logs failover events.
export async function call(command, { timeoutMs = 200 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const a = await rawCall(PRIMARY, command, ctrl.signal);
    if (a.ok) return a.result ?? null;
    if (a.error !== 'unconfigured') {
      console.warn('[upstash] primary failed', a.error);
    }
    const b = await rawCall(BACKUP, command, ctrl.signal);
    if (b.ok) {
      if (a.error !== 'unconfigured') {
        console.warn('[upstash] backup served (primary degraded)');
      }
      return b.result ?? null;
    }
    if (b.error !== 'unconfigured') {
      console.warn('[upstash] backup failed', b.error);
    }
    return null;
  } catch (err) {
    console.warn('[upstash] call abort/throw:', err?.message || err);
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function get(key, opts) {
  return call(['GET', key], opts);
}

// Set with TTL in seconds. Returns true on success, false on degrade.
export async function setEx(key, value, ttlSeconds, opts) {
  const r = await call(['SET', key, String(value), 'EX', String(Math.max(1, Math.floor(ttlSeconds)))], opts);
  return r === 'OK';
}

export async function del(key, opts) {
  return call(['DEL', key], opts);
}

// Increment with optional TTL on first set (NX). Returns numeric count or null.
export async function incrWithTtl(key, ttlSeconds, opts) {
  const v = await call(['INCR', key], opts);
  if (v === 1) {
    // Best-effort EXPIRE; if it fails silently the key still works without TTL
    // (eviction policy allkeys-lru bounds memory).
    await call(['EXPIRE', key, String(Math.max(1, Math.floor(ttlSeconds)))], opts);
  }
  return v;
}

export const __test = { rawCall, isConfigured };
