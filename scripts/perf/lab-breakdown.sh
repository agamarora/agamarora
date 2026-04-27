#!/bin/bash
# Per-asset breakdown of /lab/ — find the heavy hitters
set -uo pipefail

URL="https://agamarora.com/lab/"
BASE="https://agamarora.com"

curl -sS "$URL" -o /tmp/lab.html

assets=$(grep -oE '(src|href|poster)="[^"]+"' /tmp/lab.html \
  | sed -E 's/^(src|href|poster)="//; s/"$//' \
  | grep -E '^(https?://|/)' \
  | grep -vE '\.html$|^#|mailto:|tel:' \
  | sort -u)

printf "%10s  %s\n" "BYTES" "URL"
printf "%10s  %s\n" "----------" "----------------------"

total=0
while IFS= read -r asset; do
  [ -z "$asset" ] && continue
  case "$asset" in
    http*) full="$asset" ;;
    /*) full="$BASE$asset" ;;
    *) continue ;;
  esac
  sz=$(curl -sS --compressed -o /dev/null -w "%{size_download}" "$full" 2>/dev/null || echo 0)
  [ -z "$sz" ] && sz=0
  total=$((total + sz))
  printf "%10d  %s\n" "$sz" "${full#https://agamarora.com}"
done <<< "$assets" | sort -rn

printf "\n%10d  TOTAL ASSET BYTES\n" "$total"
