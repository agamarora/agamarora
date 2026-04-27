#!/bin/bash
# Diff latest benchmark vs baseline.json. Prints a delta table.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_DIR="$REPO_ROOT/.gstack/benchmark-reports"
BASELINE="$OUT_DIR/baselines/baseline.json"
LATEST=$(ls -t "$OUT_DIR"/benchmark-*.json 2>/dev/null | head -1)

if [ -z "$LATEST" ]; then
  echo "No benchmark file found. Run bench.sh first." >&2
  exit 1
fi

if [ ! -f "$BASELINE" ]; then
  echo "No baseline. Promote a run with: cp $LATEST $BASELINE" >&2
  exit 1
fi

echo "Baseline: $BASELINE"
echo "Latest:   $LATEST"
echo ""

node -e '
const fs = require("fs");
const base = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const cur  = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

const fmt = (n) => {
  if (n >= 1e6) return (n/1e6).toFixed(2) + "MB";
  if (n >= 1e3) return Math.round(n/1e3) + "KB";
  return n + "B";
};
const delta = (b, c) => {
  const d = c - b;
  const pct = b ? Math.round((d / b) * 100) : 0;
  const sign = d >= 0 ? "+" : "";
  return `${sign}${fmt(Math.abs(d) === 0 ? 0 : d)} (${sign}${pct}%)`;
};

const pages = Object.keys(base.pages);
const cols = ["ttfb_ms", "total_ms", "html_bytes", "asset_count", "asset_bytes", "video_bytes", "total_bytes"];
const labels = { ttfb_ms: "TTFB", total_ms: "Total", html_bytes: "HTML", asset_count: "Assets#", asset_bytes: "AssetB", video_bytes: "Video", total_bytes: "TOTAL" };

for (const p of pages) {
  const b = base.pages[p];
  const c = cur.pages[p];
  if (!c) { console.log(`[${p}] missing in latest run`); continue; }
  console.log("=".repeat(70));
  console.log(`PAGE: ${b.url}`);
  console.log("-".repeat(70));
  console.log("Metric        Baseline       Current        Delta");
  for (const col of cols) {
    const bv = b[col] || 0, cv = c[col] || 0;
    const bs = (col.endsWith("_ms") ? bv + "ms" : (col === "asset_count" ? String(bv) : fmt(bv))).padEnd(13);
    const cs = (col.endsWith("_ms") ? cv + "ms" : (col === "asset_count" ? String(cv) : fmt(cv))).padEnd(13);
    const ds = delta(bv, cv);
    console.log(`${labels[col].padEnd(13)} ${bs}  ${cs}  ${ds}`);
  }
  console.log("");
}
' "$BASELINE" "$LATEST"
