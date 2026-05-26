#!/usr/bin/env node
// indexnow-ping.mjs
//
// Pings api.indexnow.org with URLs that need re-crawling. IndexNow is a single
// endpoint that fans out to Bing, Yandex, Seznam, Naver, and others. Google does
// not participate (use Search Console for Google).
//
// Two modes:
//   1. Auto: parses sitemap.xml, picks URLs with lastmod == today (YYYY-MM-DD).
//      Run as part of `npm run build` on Netlify deploy.
//   2. Manual: pass URLs as args.
//      Run: node scripts/indexnow-ping.mjs https://agamarora.com/some/page/
//
// Safety:
//   - Only runs when NETLIFY=true OR INDEXNOW_FORCE=1. Skips locally otherwise
//     so dev rebuilds don't flood IndexNow with duplicate pings.
//   - Network failures log a warning but exit 0. Never blocks the build.
//   - Submits in batches of 10000 URLs per IndexNow spec (we'll never hit that).
//
// Verification: Bing fetches https://agamarora.com/<KEY>.txt to confirm ownership.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const KEY = "0029705b2c16ba033f404ab72b7cb55a";
const HOST = "agamarora.com";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const args = process.argv.slice(2);
const FORCE = process.env.INDEXNOW_FORCE === "1";
const ON_NETLIFY = process.env.NETLIFY === "true";

if (!FORCE && !ON_NETLIFY) {
  console.log("[indexnow] skip (not on Netlify, set INDEXNOW_FORCE=1 to override)");
  process.exit(0);
}

function urlsFromSitemap() {
  const xml = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
  // Today in UTC, YYYY-MM-DD.
  const today = new Date().toISOString().slice(0, 10);
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
  const urls = [];
  for (const b of blocks) {
    const loc = b.match(/<loc>([^<]+)<\/loc>/);
    const mod = b.match(/<lastmod>([^<]+)<\/lastmod>/);
    if (!loc) continue;
    if (mod && mod[1].slice(0, 10) === today) {
      urls.push(loc[1]);
    }
  }
  return urls;
}

const urls = args.length > 0 ? args : urlsFromSitemap();

if (urls.length === 0) {
  console.log("[indexnow] no URLs to submit (no sitemap entries with today's lastmod)");
  process.exit(0);
}

console.log(`[indexnow] submitting ${urls.length} URL(s):`);
for (const u of urls) console.log(`  ${u}`);

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
};

try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  // IndexNow returns 200/202 on success. Empty body is fine.
  if (res.status === 200 || res.status === 202) {
    console.log(`[indexnow] OK ${res.status} (${urls.length} URLs accepted)`);
  } else if (res.status === 422) {
    console.warn(`[indexnow] WARN 422 (validation): ${text}`);
  } else if (res.status === 429) {
    console.warn(`[indexnow] WARN 429 (rate-limited)`);
  } else {
    console.warn(`[indexnow] WARN ${res.status}: ${text}`);
  }
} catch (e) {
  console.warn(`[indexnow] WARN network: ${e.message}`);
}

// Never fail the build.
process.exit(0);
