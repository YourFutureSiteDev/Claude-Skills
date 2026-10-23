#!/bin/bash
# generic-copy.sh: list the stock phrases that make a page read as if it could
# belong to any business ("quality service you can trust", "contact us today",
# "solutions") and the leftovers that should never ship (lorem ipsum, YOUR PHOTO
# HERE), with forty characters either side so the line is easy to find. Used by
# points 2 and 9 of the nine point design check.
# Usage:
#   bash generic-copy.sh https://site.pages.dev            one page (or a local .html path)
#   bash generic-copy.sh --sitemap https://site.pages.dev  every URL in its sitemap.xml
# Scripts, styles, comments and tag attributes are skipped, so an input's
# placeholder="" is not a hit. Every hit is either rewritten in the business's
# own words or kept on purpose with the reason written in the report.

PHRASES='quality service|you can trust|contact us today|get in touch today|welcome to (our|the) (website|site)|one[ -]stop[ -]shop|solutions|elevate|seamless|cutting[ -]edge|state[ -]of[ -]the[ -]art|unlock|empower|game[ -]changer|next level|top[ -]notch|second to none|look no further|passionate about|in today.s (digital|fast)|lorem ipsum|your photo here|your (business|company) name|placeholder|insert (text|image)'

fetch() {
  if [ -f "$1" ]; then cat "$1"; else curl -skL -m 20 -A "Mozilla/5.0" "$1"; fi
}

text() {
  fetch "$1" | tr '\n\r' '  ' \
    | perl -pe 's#<(script|style|noscript|svg)\b.*?</\1>##gis; s#<!--.*?-->##gs; s#<[^>]+># #g; s/&amp;/&/g; s/&nbsp;/ /g; s/&#39;|&rsquo;/\x27/g; s/&ldquo;|&rdquo;/"/g; s/\s+/ /g'
}

scan() {
  t=$(text "$1")
  if [ -z "$t" ]; then echo "could not read $1"; return 1; fi
  hits=$(printf '%s' "$t" | grep -oiE ".{0,40}($PHRASES).{0,40}" | sed -E 's/^ +//; s/ +$//')
  if [ -z "$hits" ]; then
    echo "  clean"
  else
    printf '%s\n' "$hits" | sed 's/^/  /'
    echo "  $(printf '%s\n' "$hits" | wc -l | tr -d ' ') line(s) to look at"
  fi
}

locs() {
  fetch "$1" | tr '\n\r' '  ' | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g; s/^ +//; s/ +$//'
}

if [ "$1" = "--sitemap" ]; then
  src="$2"
  if [ -z "$src" ]; then echo "usage: bash generic-copy.sh --sitemap <base url | sitemap url | sitemap.xml>"; exit 2; fi
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
    scan "$u"
  done
  echo "$n pages from $src"
  exit 0
fi

src="$1"
if [ -z "$src" ]; then echo "usage: bash generic-copy.sh <url or file>   or   --sitemap <url>"; exit 2; fi
echo "=== $src"
scan "$src" || exit 1
