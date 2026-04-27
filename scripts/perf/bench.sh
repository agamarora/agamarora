#!/bin/bash
# Cold-cache benchmark via curl. Measures TTFB + HTML transfer per page,
# then enumerates *real assets* (script src, link rel=stylesheet|preload|icon|manifest,
# img src, video src, source src, poster) and sums sizes. Skips outbound <a href>
# destinations (browsers don't fetch those).

set -uo pipefail

PAGES=(
  "https://agamarora.com/"
  "https://agamarora.com/wiki/"
  "https://agamarora.com/wiki/graph/"
  "https://agamarora.com/lab/"
  "https://agamarora.com/enter/"
)

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_DIR="$REPO_ROOT/.gstack/benchmark-reports"
mkdir -p "$OUT_DIR/baselines"
RESULT_JSON="$OUT_DIR/benchmark-$(date +%Y%m%d-%H%M%S).json"
BASE="https://agamarora.com"

echo "{" > "$RESULT_JSON"
echo "  \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"," >> "$RESULT_JSON"
echo "  \"branch\": \"$(git branch --show-current 2>/dev/null)\"," >> "$RESULT_JSON"
echo "  \"commit\": \"$(git rev-parse --short HEAD 2>/dev/null)\"," >> "$RESULT_JSON"
echo "  \"pages\": {" >> "$RESULT_JSON"

extract_assets() {
  # Pull only browser-fetched asset URLs from HTML on stdin.
  # Collapse newlines so multi-line tags (e.g. <video\n  src=...>) match.
  local html
  html=$(cat | tr '\n' ' ')
  {
    # <script src="...">
    echo "$html" | grep -oiE '<script\b[^>]*[[:space:]]src[[:space:]]*=[[:space:]]*"[^"]+"' | sed -E 's/.*src[[:space:]]*=[[:space:]]*"([^"]+)".*/\1/i'
    # <link rel="stylesheet|preload|icon|manifest|shortcut icon" href="...">
    echo "$html" | grep -oiE '<link\b[^>]*>' | grep -iE 'rel[[:space:]]*=[[:space:]]*"[^"]*(stylesheet|preload|icon|manifest)' | sed -E 's/.*\bhref[[:space:]]*=[[:space:]]*"([^"]+)".*/\1/i'
    # <img src="...">, <video src="...">, <source src="...">, <audio src="...">
    echo "$html" | grep -oiE '<(img|video|source|audio)\b[^>]*[[:space:]]src[[:space:]]*=[[:space:]]*"[^"]+"' | sed -E 's/.*src[[:space:]]*=[[:space:]]*"([^"]+)".*/\1/i'
    # poster="..." on video
    echo "$html" | grep -oiE '\bposter[[:space:]]*=[[:space:]]*"[^"]+"' | sed -E 's/.*poster[[:space:]]*=[[:space:]]*"([^"]+)".*/\1/i'
  } | sort -u
}

first=1
for url in "${PAGES[@]}"; do
  [ "$first" = "0" ] && echo "    }," >> "$RESULT_JSON"
  first=0

  echo "=== $url ===" >&2

  metrics=$(curl -sS --compressed -o /tmp/page.html \
    -w "ttfb_ms=%{time_starttransfer}\ntotal_ms=%{time_total}\nsize=%{size_download}\nhttp_code=%{http_code}\n" \
    "$url")

  ttfb=$(echo "$metrics"  | grep ^ttfb_ms=    | cut -d= -f2 | awk '{print int($1*1000)}')
  total=$(echo "$metrics" | grep ^total_ms=   | cut -d= -f2 | awk '{print int($1*1000)}')
  html_size=$(echo "$metrics" | grep ^size=   | cut -d= -f2)
  http_code=$(echo "$metrics" | grep ^http_code= | cut -d= -f2)

  assets=$(extract_assets < /tmp/page.html)

  total_assets=0
  total_asset_bytes=0
  fa_cdn_bytes=0
  font_bytes=0
  img_bytes=0
  js_bytes=0
  css_bytes=0
  video_bytes=0

  while IFS= read -r asset; do
    [ -z "$asset" ] && continue
    case "$asset" in
      http*) full="$asset" ;;
      //*)   full="https:$asset" ;;
      /*)    full="$BASE$asset" ;;
      *)     continue ;;
    esac

    sz=$(curl -sS --compressed -o /dev/null -w "%{size_download}" "$full" 2>/dev/null || echo 0)
    [ -z "$sz" ] && sz=0
    total_assets=$((total_assets + 1))
    total_asset_bytes=$((total_asset_bytes + sz))

    case "$full" in
      *cdnjs.cloudflare.com*font-awesome*|*fontawesome*) fa_cdn_bytes=$((fa_cdn_bytes + sz)) ;;
    esac
    case "$full" in
      *.woff2|*.woff|*.ttf) font_bytes=$((font_bytes + sz)) ;;
      *.webp|*.png|*.jpg|*.jpeg|*.svg|*.gif|*.ico) img_bytes=$((img_bytes + sz)) ;;
      *.mp4|*.webm|*.mov)   video_bytes=$((video_bytes + sz)) ;;
      *.js|*.mjs)           js_bytes=$((js_bytes + sz)) ;;
      *.css)                css_bytes=$((css_bytes + sz)) ;;
    esac
  done <<< "$assets"

  total_bytes=$((html_size + total_asset_bytes))

  key=$(echo "$url" | sed 's|^https://agamarora.com||; s|^/$|landing|; s|/$||; s|^/||; s|/|_|g')
  [ -z "$key" ] && key="landing"

  echo "    \"$key\": {" >> "$RESULT_JSON"
  echo "      \"url\": \"$url\"," >> "$RESULT_JSON"
  echo "      \"http_code\": $http_code," >> "$RESULT_JSON"
  echo "      \"ttfb_ms\": $ttfb," >> "$RESULT_JSON"
  echo "      \"total_ms\": $total," >> "$RESULT_JSON"
  echo "      \"html_bytes\": $html_size," >> "$RESULT_JSON"
  echo "      \"asset_count\": $total_assets," >> "$RESULT_JSON"
  echo "      \"asset_bytes\": $total_asset_bytes," >> "$RESULT_JSON"
  echo "      \"total_bytes\": $total_bytes," >> "$RESULT_JSON"
  echo "      \"js_bytes\": $js_bytes," >> "$RESULT_JSON"
  echo "      \"css_bytes\": $css_bytes," >> "$RESULT_JSON"
  echo "      \"font_bytes\": $font_bytes," >> "$RESULT_JSON"
  echo "      \"img_bytes\": $img_bytes," >> "$RESULT_JSON"
  echo "      \"video_bytes\": $video_bytes," >> "$RESULT_JSON"
  echo "      \"fa_cdn_bytes\": $fa_cdn_bytes" >> "$RESULT_JSON"

  printf "  TTFB:%4dms  TOTAL:%4dms  HTML:%6db  ASSETS:%2d (%db)  VIDEO:%db  FA-CDN:%db\n" \
    "$ttfb" "$total" "$html_size" "$total_assets" "$total_asset_bytes" "$video_bytes" "$fa_cdn_bytes" >&2
done

echo "    }" >> "$RESULT_JSON"
echo "  }" >> "$RESULT_JSON"
echo "}" >> "$RESULT_JSON"

echo "" >&2
echo "Wrote: $RESULT_JSON" >&2
