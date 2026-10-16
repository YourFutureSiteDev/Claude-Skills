"""Mark every analysed post done on the phone, same as prep.py --done, in one process.
  python mark_done.py <results.json> <artifact url>"""
import json, sys, time, urllib.request
sys.path.insert(0, r"C:\Users\PC\dev\insta-inbox")
import prep

rows = json.load(open(sys.argv[1], encoding="utf-8"))
base = sys.argv[2]
ok = 0
for r in rows:
    summary = f"#{r['rank']} of {len(rows)} · Use {r['use']}/10 · {r['tier'].title()}\n{r['phone']}"
    for attempt in range(3):
        try:
            raw = prep.cf("/values/" + urllib.request.quote("v:" + r["id"], safe=""), raw=True)
            item = json.loads(raw)
            item.update(status="analysed", analysedAt=int(time.time() * 1000), summary=summary[:4000],
                        report=f"{base}#r{r['rank']}")
            prep.put_item(item)
            ok += 1
            print(r["id"], "ok", flush=True)
            break
        except Exception as e:
            print(r["id"], "retry", repr(e)[:80], flush=True)
            time.sleep(2)
print("marked", ok, "of", len(rows))
