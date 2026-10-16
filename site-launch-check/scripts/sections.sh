#!/bin/bash
# sections.sh: print a page's h1, h2 and h3 headings in order, plus each
# <section id> and aria-label, so the landing page and service page section
# order checks can be read in one glance instead of scrolling the page.
# Usage:
#   bash sections.sh https://site.pages.dev          one page (or a local .html path)
#   bash sections.sh --sitemap https://site.pages.dev every URL in its sitemap.xml
#   bash sections.sh --sitemap path/to/sitemap.xml    same, reading a local sitemap
# --sitemap also accepts the sitemap URL itself, and follows one level of a
# sitemap index. It only reads; judging which sections are missing is still
# your job.

fetch() {
  if [ -f "$1" ]; then cat "$1"; else curl -skL -m 20 -A "Mozilla/5.0" "$1"; fi
}

outline() {
  html=$(fetch "$1")
  if [ -z "$html" ]; then echo "could not read $1"; return 1; fi
  printf '%s' "$html" | tr '\n\r' '  ' \
    | sed -E 's/<(h1|h2|h3|section)[ >]/\
&/g' \
    | grep -E '^<(h1|h2|h3|section)' \
    | while IFS= read -r line; do
        tag=$(printf '%s' "$line" | sed -E 's/^<(h1|h2|h3|section).*/\1/')
        if [ "$tag" = "section" ]; then
          id=$(printf '%s' "$line" | grep -oE '^<section[^>]*' | grep -oE 'id="[^"]*"' | head -1)
          lab=$(printf '%s' "$line" | grep -oE '^<section[^>]*' | grep -oE 'aria-label="[^"]*"' | head -1)
          [ -n "$id$lab" ] && echo "  [section $id $lab]"
        else
          text=$(printf '%s' "$line" | sed -E "s#</$tag>.*##; s/<[^>]+>//g; s/&amp;/\&/g; s/&nbsp;/ /g; s/&#39;|&rsquo;/'/g; s/  +/ /g; s/^ //")
          if [ "$tag" = "h3" ]; then echo "    h3  $text"; else echo "$tag  $text"; fi
        fi
      done
}

locs() {
  fetch "$1" | tr '\n\r' '  ' | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g; s/^ +//; s/ +$//'
}

if [ "$1" = "--sitemap" ]; then
  src="$2"
  if [ -z "$src" ]; then echo "usage: bash sections.sh --sitemap <base url | sitemap url | sitemap.xml>"; exit 2; fi
  if [ ! -f "$src" ] && ! printf '%s' "$src" | grep -qE '\.xml$'; then src="${src%/}/sitemap.xml"; fi
  urls=$(locs "$src")
  if [ -z "$urls" ]; then echo "no <loc> entries in $src"; exit 1; fi
  # A sitemap index lists other sitemaps; expand them one level.
  all=""
  for u in $urls; do
    if printf '%s' "$u" | grep -qE '\.xml$'; then all="$all $(locs "$u")"; else all="$all $u"; fi
  done
  n=0
  for u in $all; do
    n=$((n + 1))
    echo "=== $u"
    outline "$u"
    echo
  done
  echo "$n pages from $src"
  exit 0
fi

src="$1"
if [ -z "$src" ]; then echo "usage: bash sections.sh <url or file>   or   --sitemap <url>"; exit 2; fi
outline "$src" || exit 1
