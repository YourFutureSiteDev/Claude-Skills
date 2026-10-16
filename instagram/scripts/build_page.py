"""Merge the batch analyses, rank them and write the report page.

  python -I build_page.py <scratch> <outdir>
      reads <scratch>/analysis/*.json, <scratch>/instagram/<id>/manifest.json, <scratch>/patterns.json
      writes <outdir>/results.json, <outdir>/patterns.json, <outdir>/sheets/*.jpg, <outdir>/report.html

  python -I build_page.py --from <results.json> [<outdir>]
      rebuilds a past batch with no scratchpad: reads results.json, the patterns.json
      beside it and its sheets/<id>.jpg, keeps the saved order and ranks, and writes
      <outdir>/report.html (default: the folder results.json is in)

The title takes its date from the batch folder name (YYYY-MM-DD), else today.
The analysis shape each row follows is references/analysis-shape.md.
"""
import base64, datetime, glob, html, json, os, re, shutil, subprocess, sys

E = lambda s: html.escape(str(s or ""), quote=True)


def b64(path):
    return base64.b64encode(open(path, "rb").read()).decode() if os.path.exists(path) else None


def from_scratch(scratch, out):
    os.makedirs(os.path.join(out, "sheets"), exist_ok=True)
    rows = []
    for f in sorted(glob.glob(os.path.join(scratch, "analysis", "*.json"))):
        rows += json.load(open(f, encoding="utf-8"))
    seen, uniq = set(), []
    for r in rows:
        if r["id"] not in seen:
            seen.add(r["id"]); uniq.append(r)
    rows = uniq
    pfile = os.path.join(scratch, "patterns.json")
    P = json.load(open(pfile, encoding="utf-8"))
    for r in rows:
        r["topic"] = P.get("topics", {}).get(r["id"], r["topic"])
        m = json.load(open(os.path.join(scratch, "instagram", r["id"], "manifest.json"), encoding="utf-8"))
        r["url"] = m["url"]; r["likes"] = m.get("like_count"); r["comments"] = m.get("comment_count")
        r["duration"] = m.get("duration"); r["slides"] = len(m.get("frames") or []) if m.get("kind") == "carousel" else None
        r["kind"] = m.get("kind") or r.get("kind")
        src = m.get("sheet")
        dst = os.path.join(out, "sheets", r["id"] + ".jpg")
        if src and os.path.exists(src):
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-vf", "scale=480:-2", "-q:v", "7", dst])
        r["sheet_b64"] = b64(dst)

    rows.sort(key=lambda r: (-int(r["use"]), -int(r["craft"]), r["creator"].lower()))
    for i, r in enumerate(rows, 1):
        r["rank"] = i
    json.dump([{k: v for k, v in r.items() if k != "sheet_b64"} for r in rows],
              open(os.path.join(out, "results.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    # keep patterns beside results so --from can rebuild this batch once the scratchpad is gone
    if os.path.abspath(pfile) != os.path.abspath(os.path.join(out, "patterns.json")):
        shutil.copyfile(pfile, os.path.join(out, "patterns.json"))
    return rows, P


def from_results(path):
    base = os.path.dirname(os.path.abspath(path))
    rows = json.load(open(path, encoding="utf-8"))
    P = json.load(open(os.path.join(base, "patterns.json"), encoding="utf-8"))
    bad = [i for i, r in enumerate(rows, 1) if r.get("rank") != i]
    if bad:
        print("warning: saved ranks out of order at positions", bad[:10], file=sys.stderr)
    for r in rows:
        r["sheet_b64"] = b64(os.path.join(base, "sheets", r["id"] + ".jpg"))
    return rows, P


def batch_label(folder):
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", os.path.basename(os.path.normpath(folder)))
    d = datetime.date(*map(int, m.groups())) if m else datetime.date.today()
    return f"{d.day} {d:%B}"


a = sys.argv[1:]
if a and a[0] == "--from":
    rows, P = from_results(a[1])
    out = a[2] if len(a) > 2 else os.path.dirname(os.path.abspath(a[1]))
    label = batch_label(os.path.dirname(os.path.abspath(a[1])))
else:
    scratch, out = a[:2]
    rows, P = from_scratch(scratch, out)
    label = batch_label(out)
os.makedirs(out, exist_ok=True)

rank_of = {r["id"]: r["rank"] for r in rows}
for a in P["act"]:
    a["rank"] = rank_of[a["id"]]
tiers = {"keep": "Keep", "maybe": "Maybe", "skip": "Skip"}
topics = sorted({r["topic"] for r in rows})
count = lambda pred: sum(1 for r in rows if pred(r))


def num(n):
    if n is None:
        return None
    return f"{n/1000:.1f}k".replace(".0k", "k") if n >= 10000 else f"{n:,}"


def card(r):
    t = r["tier"] if r["tier"] in tiers else "maybe"
    meta = ["Swipe post, %d slides" % r["slides"] if r["kind"] == "carousel" else "Reel, %ds" % round(r["duration"] or 0)]
    if r.get("likes") is not None:
        meta.append(num(r["likes"]) + " likes")
    if r.get("comments") is not None:
        meta.append(num(r["comments"]) + " comments")
    beats = "".join(f"<li>{E(b.strip())}</li>" for b in str(r.get("structure", "")).split(" | ") if b.strip())
    steal = "".join(f"<li>{E(s)}</li>" for s in r.get("steal") or [])
    flags = "".join(f"<li>{E(s)}</li>" for s in r.get("flags") or [])
    img = (f'<img class="sheet" loading="lazy" alt="Frames from the post, in order" src="data:image/jpeg;base64,{r["sheet_b64"]}">'
           if r.get("sheet_b64") else '<div class="sheet none">No frames</div>')
    hype = '<span class="pill hype">Hype</span>' if r.get("hype") else ""
    return f"""<article class="card {t}" id="r{r['rank']}" data-tier="{t}" data-topic="{E(r['topic'])}">
<header class="ch"><span class="rank">{r['rank']}</span>
<div class="who"><h3>{E(r['creator'])}</h3><p class="what">{E(r['what'])}</p></div>
<div class="scores"><span class="pill {t}">Use {r['use']}/10</span><span class="pill craft">Craft {r['craft']}/10</span>{hype}</div></header>
<p class="verdict">{E(r['verdict'])}</p>
<p class="take"><span class="lab">The useful bit</span>{E(r.get('takeaway'))}</p>
<div class="body">{img}
<dl><dt>Hook</dt><dd>{E(r['hook'])}</dd>
<dt>Structure</dt><dd><ol class="beats">{beats}</ol></dd>
<dt>Editing</dt><dd>{E(r['editing'])}</dd>
<dt>Why it works</dt><dd>{E(r['why'])}</dd></dl></div>
<div class="foot"><div><h4>Steal this</h4><ul>{steal}</ul></div>
{'<div class="flags"><h4>Red flags</h4><ul>' + flags + '</ul></div>' if flags else ''}</div>
<p class="meta"><span class="tag">{E(r['topic'])}</span>{''.join(f'<span>{E(x)}</span>' for x in meta)}<a href="{E(r['url'])}" target="_blank" rel="noopener">Open on Instagram</a></p>
</article>"""


pats = "".join(f"<li><strong>{E(p['title'])}</strong> <span class='cnt'>{E(p['count'])}</span><p>{E(p['body'])}</p></li>" for p in P["patterns"])
acts = "".join(f"<li><a href='#r{a['rank']}'>{E(a['text'])}</a></li>" for a in P["act"])
toc = "".join(f"<li data-tier='{r['tier']}' data-topic='{E(r['topic'])}'><a href='#r{r['rank']}'><span class='tn'>{r['rank']}</span><span class='tc'>{E(r['creator'])}</span><span class='ts {r['tier']}'>{r['use']}</span></a></li>" for r in rows)
chips_t = "".join(f"<button type='button' class='chip' data-k='tier' data-v='{k}' aria-pressed='false'>{v} <span>{count(lambda r, k=k: r['tier'] == k)}</span></button>" for k, v in tiers.items())
chips_c = "".join(f"<button type='button' class='chip' data-k='topic' data-v='{E(t)}' aria-pressed='false'>{E(t)} <span>{count(lambda r, t=t: r['topic'] == t)}</span></button>" for t in topics)
nv, nc = count(lambda r: r["kind"] != "carousel"), count(lambda r: r["kind"] == "carousel")

page = f"""<meta charset="utf-8">
<title>Saved Reels, {label}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Instrument+Sans:wght@400;600&family=JetBrains+Mono:wght@500&display=swap">
<style>
/* Same family as the 6 October page: a ranked reading list, patterns first, one card per post with a frame strip beside the notes */
:root{{--bg:#F2F3F6;--surface:#FFFFFF;--ink:#15171C;--muted:#5D6270;--line:#DADDE5;--accent:#2B48C8;--keep:#1F7A4D;--keep-bg:#E2F2E9;--maybe:#8A5A00;--maybe-bg:#FBF0D9;--skip:#9A2B2B;--skip-bg:#F8E4E4;--hype:#7A3FA0;--hype-bg:#F1E6F8;
 --d:"Bricolage Grotesque",ui-sans-serif,system-ui,sans-serif;--b:"Instrument Sans",ui-sans-serif,system-ui,sans-serif;--m:"JetBrains Mono",ui-monospace,Consolas,monospace}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{color-scheme:dark;--bg:#111318;--surface:#1A1D24;--ink:#E8EAF0;--muted:#9AA0AE;--line:#2C303A;--accent:#8EA3FF;--keep:#6BD39E;--keep-bg:#16302A;--maybe:#F0C060;--maybe-bg:#33290F;--skip:#F08A8A;--skip-bg:#3A1C1C;--hype:#D3A6F0;--hype-bg:#2E2038}}}}
:root[data-theme="dark"]{{color-scheme:dark;--bg:#111318;--surface:#1A1D24;--ink:#E8EAF0;--muted:#9AA0AE;--line:#2C303A;--accent:#8EA3FF;--keep:#6BD39E;--keep-bg:#16302A;--maybe:#F0C060;--maybe-bg:#33290F;--skip:#F08A8A;--skip-bg:#3A1C1C;--hype:#D3A6F0;--hype-bg:#2E2038}}
body{{background:var(--bg);color:var(--ink);font:15px/1.55 var(--b);padding-inline:16px;padding-block:32px 64px}}
.wrap{{max-width:980px;margin:0 auto;display:grid;gap:28px}}
h1,h2,h3{{font-family:var(--d);text-wrap:balance;margin:0;line-height:1.1}}
h1{{font-size:clamp(30px,5vw,46px)}} h2{{font-size:24px}} h3{{font-size:19px}}
.lede{{color:var(--muted);max-width:64ch;margin:8px 0 0}}
.eyebrow{{font:500 12px var(--m);letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}}
.stats{{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}}
.panel{{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:22px}}
.panel ol{{margin:14px 0 0;padding-left:20px;display:grid;gap:12px}}
.panel p{{margin:2px 0 0;color:var(--muted);max-width:70ch}}
.act ol{{gap:8px}} .act a{{color:var(--ink);text-decoration-color:var(--line);text-underline-offset:3px}} .act a:hover{{text-decoration-color:var(--accent)}}
.cnt{{font:500 12px var(--m);color:var(--accent);margin-left:6px}}
.filters{{display:grid;gap:10px;position:sticky;top:env(safe-area-inset-top,0px);z-index:2;background:var(--bg);padding-block:10px;border-bottom:1px solid var(--line)}}
.row{{display:flex;flex-wrap:wrap;gap:6px;align-items:center}}
.chip{{font:500 13px var(--b);color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:5px 12px;cursor:pointer}}
.chip span{{font:500 11px var(--m);color:var(--muted);margin-left:4px}}
.chip[aria-pressed="true"]{{background:var(--accent);border-color:var(--accent);color:var(--surface)}} .chip[aria-pressed="true"] span{{color:var(--surface)}}
.chip:focus-visible,.toc a:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
.shown{{font:500 12px var(--m);color:var(--muted);margin-left:auto}}
.toc ol{{list-style:none;padding:0;margin:12px 0 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px}}
.toc a{{display:flex;gap:10px;align-items:center;padding:6px 10px;border-radius:8px;color:var(--ink);text-decoration:none;border:1px solid var(--line);background:var(--surface);font-size:14px;min-width:0}}
.toc a:hover{{border-color:var(--accent)}}
.tn{{font:500 12px var(--m);color:var(--muted);min-width:20px;font-variant-numeric:tabular-nums}} .tc{{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}}
.ts{{margin-left:auto;font:500 12px var(--m)}} .ts.keep{{color:var(--keep)}} .ts.maybe{{color:var(--maybe)}} .ts.skip{{color:var(--skip)}}
.cards{{display:grid;gap:18px}}
.card{{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:20px;display:grid;gap:14px;border-left:4px solid var(--line);scroll-margin-top:120px}}
.card.keep{{border-left-color:var(--keep)}} .card.maybe{{border-left-color:var(--maybe)}} .card.skip{{border-left-color:var(--skip)}}
.ch{{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}}
.rank{{font:700 28px var(--d);color:var(--accent);min-width:38px;font-variant-numeric:tabular-nums}}
.who{{flex:1;min-width:200px}} .what{{margin:4px 0 0;color:var(--muted)}}
.scores{{display:flex;gap:6px;flex-wrap:wrap}}
.pill{{font:500 12px var(--m);padding:4px 9px;border-radius:999px;white-space:nowrap}}
.pill.keep{{background:var(--keep-bg);color:var(--keep)}} .pill.maybe{{background:var(--maybe-bg);color:var(--maybe)}} .pill.skip{{background:var(--skip-bg);color:var(--skip)}}
.pill.craft{{background:var(--bg);color:var(--muted);border:1px solid var(--line)}} .pill.hype{{background:var(--hype-bg);color:var(--hype)}}
.verdict{{margin:0;font-weight:600;max-width:70ch}}
.take{{margin:0;padding:10px 14px;background:var(--bg);border-radius:10px;max-width:none}}
.lab{{display:block;font:500 11px var(--m);letter-spacing:.07em;text-transform:uppercase;color:var(--accent);margin-bottom:2px}}
.body{{display:grid;grid-template-columns:minmax(0,240px) minmax(0,1fr);gap:18px;align-items:start}}
.sheet{{width:100%;border-radius:8px;border:1px solid var(--line);display:block}} .sheet.none{{padding:24px;text-align:center;color:var(--muted)}}
dl{{margin:0;display:grid;gap:6px;min-width:0}} dt{{font:500 11px var(--m);letter-spacing:.07em;text-transform:uppercase;color:var(--muted)}} dd{{margin:0 0 6px;max-width:68ch}}
.beats{{margin:0;padding-left:18px;display:grid;gap:3px}}
.foot{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}}
.foot h4{{margin:0 0 4px;font:500 11px var(--m);letter-spacing:.07em;text-transform:uppercase;color:var(--accent)}}
.flags h4{{color:var(--skip)}} .foot ul{{margin:0;padding-left:18px;display:grid;gap:4px}}
.meta{{margin:0;display:flex;gap:14px;flex-wrap:wrap;align-items:center;font:500 12px var(--m);color:var(--muted)}}
.tag{{color:var(--ink);border:1px solid var(--line);border-radius:6px;padding:2px 7px}}
.meta a{{color:var(--accent);margin-left:auto}}
.empty{{text-align:center;color:var(--muted);padding:30px}}
@media (max-width:640px){{.body{{grid-template-columns:1fr}} .sheet{{max-width:320px}} .meta a{{margin-left:0}} .filters{{position:static}}}}
</style>
<div class="wrap">
<header><div class="eyebrow">Insta Inbox · {len(rows)} posts · {nv} reels, {nc} swipe posts</div><h1>Saved Reels, {label}</h1>
<p class="lede">{E(P['lede'])}</p>
<div class="stats"><span class="pill keep">{count(lambda r: r['tier']=='keep')} keep</span><span class="pill maybe">{count(lambda r: r['tier']=='maybe')} maybe</span><span class="pill skip">{count(lambda r: r['tier']=='skip')} skip</span><span class="pill hype">{count(lambda r: r.get('hype'))} hype</span></div></header>
<section class="panel act"><div class="eyebrow">Act on these first</div><h2>Worth your time this week</h2><ol>{acts}</ol></section>
<section class="panel"><div class="eyebrow">Patterns across the batch</div><h2>What keeps showing up</h2><ol>{pats}</ol></section>
<nav class="filters" aria-label="Filter posts"><div class="row">{chips_t}<span class="shown" id="shown">{len(rows)} shown</span></div><div class="row">{chips_c}</div></nav>
<nav class="toc"><div class="eyebrow">Ranked by usefulness, then craft</div><ol id="toc">{toc}</ol></nav>
<section class="cards" id="cards">{''.join(card(r) for r in rows)}<p class="empty" id="empty" hidden>Nothing matches those filters.</p></section>
</div>
<script>
(function(){{
 var on={{tier:null,topic:null}};
 var chips=[].slice.call(document.querySelectorAll('.chip'));
 var cards=[].slice.call(document.querySelectorAll('.card')), items=[].slice.call(document.querySelectorAll('#toc li'));
 function ok(el){{return (!on.tier||el.dataset.tier===on.tier)&&(!on.topic||el.dataset.topic===on.topic);}}
 function apply(){{var n=0;cards.forEach(function(c){{var s=ok(c);c.hidden=!s;if(s)n++;}});items.forEach(function(i){{i.hidden=!ok(i);}});
  document.getElementById('shown').textContent=n+' shown';document.getElementById('empty').hidden=n>0;
  chips.forEach(function(c){{c.setAttribute('aria-pressed',on[c.dataset.k]===c.dataset.v?'true':'false');}});}}
 chips.forEach(function(c){{c.addEventListener('click',function(){{var k=c.dataset.k;on[k]=on[k]===c.dataset.v?null:c.dataset.v;apply();}});}});
}})();
</script>
"""
open(os.path.join(out, "report.html"), "w", encoding="utf-8").write(page)
print("rows", len(rows), "bytes", len(page.encode()))
