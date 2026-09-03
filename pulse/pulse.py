#!/usr/bin/env python3
"""Send Byron a Pulse: a phone notification with the Pulse icon that opens the Pulse app.

Usage:
  pulse.py "Title" "Body text" [--kind todo|alert|win|info] [--item "line"]... [--image URL] [--link URL] [--silent]

The token is read from ~/.config/pulse/token (never from the repo). The app URL
defaults to https://pulse.yourfuturesitedev.workers.dev, override with PULSE_URL.
"""
import argparse, json, os, sys, urllib.request, urllib.error

URL = os.environ.get("PULSE_URL", "https://pulse.yourfuturesitedev.workers.dev")

def token():
    for p in (os.environ.get("PULSE_TOKEN"), os.path.expanduser("~/.config/pulse/token"), r"C:\Users\PC\.config\pulse\token"):
        if not p: continue
        if os.path.exists(p):
            return open(p, encoding="utf-8").read().strip()
        if p and not os.path.sep in p and len(p) > 20:
            return p
    sys.exit("pulse: no token found at ~/.config/pulse/token")

def main():
    ap = argparse.ArgumentParser(description="Send a Pulse to Byron's phone")
    ap.add_argument("title"); ap.add_argument("body", nargs="?", default="")
    ap.add_argument("--kind", default="info", choices=["todo", "alert", "win", "info"])
    ap.add_argument("--item", action="append", default=[], help="bullet line, repeatable")
    ap.add_argument("--image", default="", help="https image URL shown in the notification and the card")
    ap.add_argument("--link", default="", help="URL for an Open button")
    ap.add_argument("--source", default="claude")
    ap.add_argument("--silent", action="store_true", help="add to the app without a phone notification")
    a = ap.parse_args()
    payload = {"title": a.title, "body": a.body, "kind": a.kind, "items": a.item, "image": a.image, "link": a.link, "source": a.source, "silent": a.silent}
    req = urllib.request.Request(URL + "/api/push", data=json.dumps(payload).encode(), method="POST",
                                 headers={"content-type": "application/json", "authorization": "Bearer " + token(), "user-agent": "Mozilla/5.0 pulse-cli/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            out = json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"pulse: HTTP {e.code} {e.read().decode(errors='ignore')[:200]}")
    push = out.get("push", {})
    ok = push.get("ok") or push.get("skipped")
    print(f"pulse sent: id={out.get('id')} push={'ok' if push.get('ok') else push.get('skipped') or 'FAILED ' + str(push)}")
    if not ok: sys.exit(1)

if __name__ == "__main__":
    main()
