#!/usr/bin/env bash
# SmoothUI public API helper. No auth needed. Needs curl and node.
#   smoothui.sh suggest "what you need in plain words"   # ranked matches
#   smoothui.sh search  "keyword"                        # keyword search
#   smoothui.sh source  <component-name>                 # metadata + full TSX
#   smoothui.sh list                                     # every component, one line each
# Docs: https://smoothui.dev/docs/guides/api
set -euo pipefail
BASE="https://smoothui.dev"
cmd="${1:-}"; arg="${2:-}"
enc() { node -e 'process.stdout.write(encodeURIComponent(process.argv[1]))' "$1"; }

case "$cmd" in
  suggest)
    [ -n "$arg" ] || { echo 'usage: smoothui.sh suggest "need"' >&2; exit 1; }
    curl -sf -m 30 "$BASE/api/v1/suggest?need=$(enc "$arg")" | node -e '
      const d=JSON.parse(require("fs").readFileSync(0,"utf8"));
      for (const s of d.suggestions||[]) console.log(String(s.relevanceScore).padStart(3), s.name.padEnd(34), s.description);'
    ;;
  search)
    [ -n "$arg" ] || { echo 'usage: smoothui.sh search "keyword"' >&2; exit 1; }
    curl -sf -m 30 "$BASE/api/v1/components/search?q=$(enc "$arg")" | node -e '
      const d=JSON.parse(require("fs").readFileSync(0,"utf8"));
      const items=Array.isArray(d)?d:(d.components||d.results||d.data||[]);
      for (const s of items) console.log(s.name.padEnd(34), s.description||"");'
    ;;
  source)
    [ -n "$arg" ] || { echo 'usage: smoothui.sh source <name>' >&2; exit 1; }
    curl -sf -m 30 "$BASE/api/v1/components/$arg?include=source" | node -e '
      const d=JSON.parse(require("fs").readFileSync(0,"utf8")); const c=d.component;
      console.log("#", c.displayName, "|", c.category, "|", c.complexity, "| deps:", (c.dependencies||[]).join(", ")||"none", "| reduced-motion:", c.hasReducedMotion);
      console.log("#", c.description);
      for (const h of c.compositionHints||[]) console.log("# hint:", h);
      console.log("# docs:", c.docUrl); console.log();
      console.log(d.source||"");'
    ;;
  list)
    curl -sf -m 30 "$BASE/llms.txt" | grep '^- ' | sed 's/ — install:.*//'
    ;;
  *)
    sed -n '2,7p' "$0"; exit 1 ;;
esac
