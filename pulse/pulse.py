#!/usr/bin/env python3
"""Send Byron a Pulse: a phone notification with the Pulse icon (and photo) that opens the Pulse app.

Usage:
  pulse.py "Title" "Body text" [--kind todo|alert|win|info] [--item "line"]... [--image URL] [--link URL] [--silent]

Stores the item through the Pulse worker, then sends the ntfy notification from
this machine (ntfy throttles photo attachments coming from Cloudflare's shared
address, so the phone push goes direct). Token: ~/.config/pulse/token,
topic: ~/.config/pulse/topic. Override the app URL with PULSE_URL.
"""
import argparse, json, os, sys, urllib.request, urllib.error

URL = os.environ.get("PULSE_URL", "https://pulse.yourfuturesitedev.workers.dev")
UA = "Mozilla/5.0 pulse-cli/1.1"
TAGS = {"todo": "clipboard", "alert": "rotating_light", "win": "tada", "info": "bell"}

def secret(name):
    env = os.environ.get("PULSE_" + name.upper())
    if env: return env.strip()
    for p in (os.path.expanduser("~/.config/pulse/" + name), r"C:\Users\PC\.config\pulse\\" + name):
        if os.path.exists(p): return open(p, encoding="utf-8").read().strip()
    sys.exit(f"pulse: no {name} found at ~/.config/pulse/{name}")

def post(url, data, headers):
    req = urllib.request.Request(url, data=data, method="POST", headers={"user-agent": UA, **headers})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.status, r.read().decode(errors="ignore")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(errors="ignore")[:300]

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

    payload = {"title": a.title, "body": a.body, "kind": a.kind, "items": a.item, "image": a.image,
               "link": a.link, "source": a.source, "silent": True}
    code, text = post(URL + "/api/push", json.dumps(payload).encode(),
                      {"content-type": "application/json", "authorization": "Bearer " + secret("token")})
    if code != 200:
        sys.exit(f"pulse: store failed HTTP {code} {text}")
    item_id = json.loads(text).get("id", "")
    if a.silent:
        print(f"pulse stored silently: id={item_id}"); return

    body = a.body
    if a.item:
        body += ("\n" if body else "") + "\n".join("• " + s for s in a.item)
    headers = {
        "Title": a.title, "Tags": TAGS[a.kind],
        "Priority": "high" if a.kind == "alert" else "default",
        "Click": f"{URL}/#{item_id}", "Icon": f"{URL}/icons/icon-192.png",
    }
    if a.link: headers["Actions"] = f"view, Open, {a.link}, clear=true"
    topic = secret("topic")
    sent_with_image = False
    if a.image:
        code, text = post(f"https://ntfy.sh/{topic}", body.encode("utf-8"), {**headers, "Attach": a.image})
        sent_with_image = code == 200
    if not sent_with_image:
        code, text = post(f"https://ntfy.sh/{topic}", body.encode("utf-8"), headers)
    if code != 200:
        sys.exit(f"pulse: stored id={item_id} but phone push failed HTTP {code} {text}")
    print(f"pulse sent: id={item_id} photo={'yes' if sent_with_image else 'no'}")

if __name__ == "__main__":
    main()
