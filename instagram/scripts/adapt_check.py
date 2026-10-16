"""Check that adapted angles and beats carry the structure, not the words.

  python -I adapt_check.py <results.json> [<manifest root>]

For every row with an adapt field it builds the source text from the row's hook
and structure (the on screen and slide text the analysis quoted) plus, when a
manifest root is given, that post's transcript and caption. A row fails if any
run of six words from the source turns up in adapt.angle, adapt.beats[].job,
or the brief file's _angle and _beats[].beat, after lower casing and stripping
punctuation. Exit code 1 on any failure. See references/adapt.md.
"""
import json, os, re, sys

N = 6


def words(s):
    return re.findall(r"[a-z0-9']+", (s or "").lower().replace("’", "'"))


def runs(s):
    w = words(s)
    return {tuple(w[i:i + N]) for i in range(len(w) - N + 1)}


def source(r, root):
    parts = [r.get("hook"), r.get("structure")]
    used = ["hook", "structure"]
    if root:
        mf = os.path.join(root, r["id"], "manifest.json")
        if os.path.exists(mf):
            m = json.load(open(mf, encoding="utf-8"))
            parts += [re.sub(r"\[\d+:\d{2}\]", " ", m.get("transcript") or ""), m.get("description")]
            used += ["transcript", "caption"]
    # each part checked on its own, so no false run spans two fields
    src = set()
    for p in parts:
        src |= runs(p)
    return src, used


def ours(r, base):
    a = r["adapt"]
    texts = [("angle", a.get("angle"))] + [(f"beat {b.get('at')}", b.get("job")) for b in a.get("beats") or []]
    brief = a.get("brief")
    if brief:
        f = os.path.join(base, brief)
        if os.path.exists(f):
            b = json.load(open(f, encoding="utf-8"))
            texts += [("brief _angle", b.get("_angle"))]
            texts += [(f"brief beat {x.get('at')}", x.get("beat")) for x in b.get("_beats") or []]
        else:
            texts += [("brief", None)]
            print(f"  missing brief file {brief}")
    return texts


def main(path, root=None):
    sys.stdout.reconfigure(encoding="utf-8")
    rows = json.load(open(path, encoding="utf-8"))
    # brief paths are relative to the Content Engine folder: <CE>/instagram-research/<date>/results.json
    base = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(path))))
    checked = failed = 0
    for r in rows:
        if not r.get("adapt") or r["adapt"].get("lane") in (None, "none"):
            continue
        checked += 1
        src, used = source(r, root)
        hits = []
        for where, text in ours(r, base):
            for run in sorted(runs(text) & src):
                hits.append(f"{where}: \"{' '.join(run)}\"")
        tag = f"#{r.get('rank')} {r['id']} ({r['adapt']['lane']}) against {', '.join(used)}"
        if hits:
            failed += 1
            print("FAIL", tag)
            for h in hits:
                print("   ", h)
        else:
            print("pass", tag)
    print(f"{checked} checked, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    a = sys.argv[1:]
    sys.exit(main(a[0], a[1] if len(a) > 1 else None))
