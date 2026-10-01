#!/usr/bin/env python3
"""Free keyword map: Google autocomplete expansion, intent tags, clusters,
and a page map against a live sitemap. No accounts, no API keys.

Usage:
  kwmap.py --seeds "tradie website,website for plumber" --site https://yourfuturesite.com.au --out DIR
Writes DIR/keywords.csv, DIR/clusters.csv and DIR/keyword-map.md.

Uses curl (python urllib has no trust store on Byron's Mac).
"""
import argparse, csv, json, os, re, subprocess, time, collections

SUGGEST = "https://suggestqueries.google.com/complete/search?client=firefox&gl={gl}&hl=en&q={q}"
STOP = set("a an the for of to in on and or with my your is are do does i me best top".split())
INTENT = [
    ("price", r"\b(cost|costs|price|prices|pricing|cheap|cheapest|affordable|how much|quote|budget)\b"),
    ("local", r"\b(near me|sydney|melbourne|brisbane|perth|adelaide|canberra|hobart|darwin|gold coast|newcastle|wollongong|geelong|nsw|vic|qld|wa|sa|tas|australia)\b"),
    ("question", r"^(how|what|why|do|does|can|is|are|should|which|when|who)\b"),
    ("compare", r"\b(vs|versus|alternative|alternatives|review|reviews|best|examples|templates?)\b"),
    ("hire", r"\b(designer|designers|agency|agencies|company|companies|builder|builders|developer|services?|hire|freelancer)\b"),
]

def curl(url):
    r = subprocess.run(["curl", "-s", "--max-time", "10", "-A", "Mozilla/5.0", url], capture_output=True, text=True)
    return r.stdout

def suggest(q, gl):
    try:
        data = json.loads(curl(SUGGEST.format(gl=gl, q=q.replace(" ", "+"))))
        return data[1]
    except Exception:
        return []

def expand(seed, gl, deep):
    """seed alone, seed + a..z, and (deep) question prefixes. Position is kept as a rough popularity signal."""
    out = collections.Counter()
    queries = [seed] + [f"{seed} {c}" for c in "abcdefghijklmnopqrstuvwxyz"]
    if deep:
        queries += [f"{w} {seed}" for w in ("how much", "best", "cheap", "how to", "do i need")]
    for q in queries:
        for pos, s in enumerate(suggest(q, gl)):
            out[s.lower().strip()] += 10 - pos  # top suggestion scores 10
        time.sleep(0.15)
    return out

def intents(k):
    return [name for name, rx in INTENT if re.search(rx, k)] or ["topic"]

def core(k):
    words = [w for w in re.findall(r"[a-z0-9]+", k) if w not in STOP]
    words = [re.sub(r"s$", "", w) if len(w) > 3 else w for w in words]
    return words

def cluster(keys):
    """Group by the two most common meaningful words a keyword shares with the corpus."""
    df = collections.Counter(w for k in keys for w in set(core(k)))
    groups = collections.defaultdict(list)
    for k in keys:
        ws = sorted(set(core(k)), key=lambda w: (-df[w], w))
        label = " ".join(sorted(ws[:2])) if len(ws) >= 2 else (ws[0] if ws else k)
        groups[label].append(k)
    return groups

def site_pages(site):
    xml = curl(site.rstrip("/") + "/sitemap.xml")
    return re.findall(r"<loc>([^<]+)</loc>", xml)

def match_page(words, pages):
    best, score = None, 0
    for p in pages:
        slug = set(core(re.sub(r"https?://[^/]+", "", p).replace("-", " ").replace("/", " ")))
        s = len(slug & set(words))
        if s > score:
            best, score = p, s
    return best if score else None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seeds", required=True, help="comma separated seed phrases")
    ap.add_argument("--site", help="live site root; its sitemap.xml is used for the page map")
    ap.add_argument("--gl", default="au", help="country code for suggestions (default au)")
    ap.add_argument("--deep", action="store_true", help="also try question and price prefixes")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    scores = collections.Counter()
    for seed in [s.strip() for s in a.seeds.split(",") if s.strip()]:
        scores.update(expand(seed, a.gl, a.deep))
    keys = list(scores)
    groups = cluster(keys)
    pages = site_pages(a.site) if a.site else []

    with open(os.path.join(a.out, "keywords.csv"), "w", newline="") as f:
        w = csv.writer(f); w.writerow(["keyword", "signal", "intent"])
        for k, s in scores.most_common():
            w.writerow([k, s, "+".join(intents(k))])

    rows = []
    for label, ks in groups.items():
        ks.sort(key=lambda k: -scores[k])
        sig = sum(scores[k] for k in ks)
        it = collections.Counter(i for k in ks for i in intents(k)).most_common(1)[0][0]
        page = match_page(label.split(), pages)
        rows.append((label, sig, len(ks), it, page or "NEW PAGE", ks[0], " | ".join(ks[:8])))
    rows.sort(key=lambda r: -r[1])
    with open(os.path.join(a.out, "clusters.csv"), "w", newline="") as f:
        w = csv.writer(f); w.writerow(["cluster", "signal", "keywords", "main_intent", "page", "lead_keyword", "sample"])
        w.writerows(rows)

    with open(os.path.join(a.out, "keyword-map.md"), "w") as f:
        f.write(f"# Keyword map\n\nSeeds: {a.seeds}  \nCountry: {a.gl}  \nKeywords found: {len(keys)}, clusters: {len(rows)}\n\n")
        f.write("Signal is autocomplete rank summed, not search volume. Treat it as an order, not a number.\n\n")
        f.write("| Cluster | Signal | Intent | Page | Lead keyword |\n|---|---|---|---|---|\n")
        for r in rows[:60]:
            f.write(f"| {r[0]} | {r[1]} | {r[3]} | {r[4]} | {r[5]} |\n")
    print(f"{len(keys)} keywords, {len(rows)} clusters, {sum(1 for r in rows if r[4]=='NEW PAGE')} without a page -> {a.out}")

if __name__ == "__main__":
    main()
