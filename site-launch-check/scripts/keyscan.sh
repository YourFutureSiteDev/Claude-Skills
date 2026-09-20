#!/bin/bash
# keyscan.sh: the "Ctrl+F sk-" test from the outside, automated.
# Fetches each live site's HTML plus every script it loads and greps the lot
# for API key shapes. Usage: bash keyscan.sh https://site-one.pages.dev https://site-two.com.au
# Exit 1 if anything is found. Prints redacted hits only, never the full key.
PAT='sk-ant-[A-Za-z0-9_-]{10,}|sk-proj-[A-Za-z0-9_-]{10,}|sk-[A-Za-z0-9]{32,}|api\.anthropic\.com|x-api-key|AIza[0-9A-Za-z_-]{30,}|ghp_[A-Za-z0-9]{30,}|xox[bp]-[0-9A-Za-z-]{20,}|-----BEGIN (RSA |EC )?PRIVATE KEY|re_[A-Za-z0-9]{20,}|SG\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}'
found=0
work=$(mktemp -d 2>/dev/null || echo "C:/Temp/keyscan-$$")
for site in "$@"; do
  d="$work/$(echo "$site" | sed 's#https\?://##; s#/.*##; s#:#_#g')"; mkdir -p "$d"
  code=$(curl -skL -m 20 -A "Mozilla/5.0" -o "$d/index.html" -w "%{http_code}" "$site")
  if [ "$code" != "200" ]; then echo "$site  HTTP $code (could not fetch)"; continue; fi
  grep -oE '(src|href)="[^"]+\.(js|mjs|json)(\?[^"]*)?"' "$d/index.html" | sed -E 's/^(src|href)="//; s/"$//' | sort -u | while read -r u; do
    case "$u" in http*) full="$u";; //*) full="https:$u";; /*) full="${site%/}$u";; *) full="${site%/}/$u";; esac
    n=$(echo "$full" | md5sum | cut -c1-8); curl -skL -m 20 -A "Mozilla/5.0" -o "$d/$n.js" "$full"
  done
  hits=$(grep -rhoE "$PAT" "$d" | sort -u | sed -E 's/((sk-ant-|sk-proj-|sk-|AIza|ghp_|xox.-|re_|SG\.)[A-Za-z0-9_-]{4})[A-Za-z0-9_.-]+/\1…/' | tr '\n' ' ')
  n=$(ls "$d" | wc -l)
  if [ -z "$hits" ]; then echo "$site  clean ($n files)"; else echo "$site  HITS: $hits"; found=1; fi
done
rm -rf "$work"
exit $found
