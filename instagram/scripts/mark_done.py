"""Mark every analysed post done on the phone, same as prep.py --done, in one process.

  python -I mark_done.py <results.json> <report url> [--only 3,27]
  python -I mark_done.py <results.json> [<report url>] --dry-run [--only 3,27]

Each summary is '#rank of N · Use x/10 · Tier', then the row's phone lines, then
one Adapt line under 100 characters when the row's adapt field has a lane
(references/adapt.md). The report link points at that post's card.

--dry-run prints what it would write and never imports prep.py, so nothing
reaches Cloudflare or the phone. --only limits the run to those ranks.
"""
import json, sys, time

INBOX = r"C:\Users\PC\dev\insta-inbox"
LANES = {"A1", "A2", "B1", "B2", "C1", "D1", "serials"}
LIMIT = 99


def adapt_line(r):
    a = r.get("adapt") or {}
    if a.get("lane") not in LANES:
        return None
    head = f"Adapt: {a['lane']}, {str(a.get('hook_type') or '').replace('-', ' ')}, {a.get('seconds')}s. "
    text = (a.get("phone") or a.get("angle") or "").strip()
    if len(head + text) > LIMIT:
        cut = text[:LIMIT - len(head) - 1]  # leave room for the ellipsis
        if " " in cut:
            cut = cut[:cut.rfind(" ")]
        text = cut.rstrip(" ,;:.") + "\u2026"
    return head + text


def summary(r, n):
    lines = [f"#{r['rank']} of {n} \u00b7 Use {r['use']}/10 \u00b7 {r['tier'].title()}", r["phone"]]
    line = adapt_line(r)
    if line:
        lines.append(line)
    return "\n".join(lines)


def main(a):
    sys.stdout.reconfigure(encoding="utf-8")
    dry = "--dry-run" in a
    only = None
    if "--only" in a:
        only = {int(x) for x in a[a.index("--only") + 1].split(",")}
    pos = [x for i, x in enumerate(a) if not x.startswith("--") and not (i and a[i - 1] == "--only")]
    path, base = pos[0], (pos[1] if len(pos) > 1 else None)
    rows = json.load(open(path, encoding="utf-8"))
    todo = [r for r in rows if only is None or r["rank"] in only]

    if dry:
        for r in todo:
            s = summary(r, len(rows))
            print(f"--- #{r['rank']} {r['id']} (would write {len(s.splitlines())} lines, {len(s)} characters)")
            print(s)
            print("report:", f"{base}#r{r['rank']}" if base else "none")
        print(f"dry run: {len(todo)} of {len(rows)} shown, nothing written")
        return 0

    if not base:
        sys.exit("a live run needs the report url; use --dry-run to only print")
    sys.path.insert(0, INBOX)
    import urllib.request
    import prep  # the only code that reaches the phone, loaded for live runs only

    ok = 0
    for r in todo:
        s = summary(r, len(rows))
        for attempt in range(3):
            try:
                raw = prep.cf("/values/" + urllib.request.quote("v:" + r["id"], safe=""), raw=True)
                item = json.loads(raw)
                item.update(status="analysed", analysedAt=int(time.time() * 1000), summary=s[:4000],
                            report=f"{base}#r{r['rank']}")
                prep.put_item(item)
                ok += 1
                print(r["id"], "ok", flush=True)
                break
            except Exception as e:
                print(r["id"], "retry", repr(e)[:80], flush=True)
                time.sleep(2)
    print("marked", ok, "of", len(todo))
    return 0 if ok == len(todo) else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
