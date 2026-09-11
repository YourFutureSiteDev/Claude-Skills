#!/usr/bin/env python3
"""Reach Byron through Offsider: app message + phone notification (text only if the push fails, for todo/alert).

Usage:
  reach.py "Title" "Body" [--kind todo|alert|win|info] [--item "line"]... [--link URL] [--image URL]
           [--text | --no-text] [--no-push] [--source name]

Token: ~/.config/reach/token   URL: ~/.config/reach/url (default https://168-144-164-0.sslip.io:8766)
"""
import argparse, json, os, sys, urllib.request, urllib.error

def _read(name, default=""):
    for p in (os.environ.get("REACH_" + name.upper()), os.path.expanduser("~/.config/reach/" + name),
              r"C:\Users\PC\.config\reach\\" + name):
        if not p:
            continue
        if os.path.exists(p):
            return open(p, encoding="utf-8").read().strip()
        if name == "url" and p.startswith("http"):
            return p
        if name == "token" and os.path.sep not in p and len(p) > 20:
            return p
    if default:
        return default
    sys.exit(f"reach: no {name} at ~/.config/reach/{name}")

def main():
    ap = argparse.ArgumentParser(description="Reach Byron through Offsider")
    ap.add_argument("title"); ap.add_argument("body", nargs="?", default="")
    ap.add_argument("--kind", default="info", choices=["todo", "alert", "win", "info"])
    ap.add_argument("--item", action="append", default=[])
    ap.add_argument("--link", default=""); ap.add_argument("--image", default="")
    ap.add_argument("--source", default="claude")
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--text", action="store_true"); g.add_argument("--no-text", action="store_true")
    ap.add_argument("--no-push", action="store_true")
    a = ap.parse_args()
    payload = {"kind": a.kind, "title": a.title, "body": a.body, "items": a.item,
               "link": a.link, "image": a.image, "source": a.source, "push": not a.no_push}
    if a.text: payload["text"] = True
    if a.no_text: payload["text"] = False
    url = _read("url", "https://168-144-164-0.sslip.io:8766").rstrip("/")
    req = urllib.request.Request(url + "/api/reach", data=json.dumps(payload).encode("utf-8"), method="POST",
                                 headers={"Content-Type": "application/json", "Authorization": "Bearer " + _read("token"),
                                          "User-Agent": "reach-cli/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            out = json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"reach: HTTP {e.code} {e.read().decode(errors='ignore')[:300]}")
    p = out.get("push", {}); t = out.get("text", {})
    print(f"reach: stored {out.get('id')} | push {p.get('sent', 0)}/{p.get('of', 0)} | text "
          f"{'sent' if t.get('ok') else t.get('skipped') or ('FAILED ' + str(t.get('status')) + ' ' + str(t.get('detail', ''))[:120])}")
    if not out.get("ok"): sys.exit(1)

if __name__ == "__main__":
    main()
