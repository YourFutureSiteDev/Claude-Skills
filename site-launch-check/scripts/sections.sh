#!/bin/bash
# sections.sh: print a page's h1 and h2 headings in order, plus each
# <section id> and aria-label, so the landing page section order check can be
# read in one glance instead of scrolling the page.
# Usage: bash sections.sh https://site.pages.dev   (or a local .html path)
# It only reads; judging which sections are missing is still your job.
src="$1"
if [ -z "$src" ]; then echo "usage: bash sections.sh <url or file>"; exit 2; fi
if [ -f "$src" ]; then html=$(cat "$src"); else html=$(curl -skL -m 20 -A "Mozilla/5.0" "$src"); fi
if [ -z "$html" ]; then echo "could not read $src"; exit 1; fi
printf '%s' "$html" | tr '\n\r' '  ' \
  | sed -E 's/<(h1|h2|section)[ >]/\
&/g' \
  | grep -E '^<(h1|h2|section)' \
  | while IFS= read -r line; do
      tag=$(printf '%s' "$line" | sed -E 's/^<(h1|h2|section).*/\1/')
      if [ "$tag" = "section" ]; then
        id=$(printf '%s' "$line" | grep -oE '^<section[^>]*' | grep -oE 'id="[^"]*"' | head -1)
        lab=$(printf '%s' "$line" | grep -oE '^<section[^>]*' | grep -oE 'aria-label="[^"]*"' | head -1)
        [ -n "$id$lab" ] && echo "  [section $id $lab]"
      else
        text=$(printf '%s' "$line" | sed -E "s#</$tag>.*##; s/<[^>]+>//g; s/&amp;/\&/g; s/&nbsp;/ /g; s/  +/ /g; s/^ //")
        echo "$tag  $text"
      fi
    done
