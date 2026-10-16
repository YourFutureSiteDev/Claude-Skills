"""Write the video-team brief file for every keep or maybe row adapted to a lane.

  python -I write_briefs.py <results.json> [--dry-run] [--force]

For each row whose tier is keep or maybe and whose adapt.lane is in the lane table
below, it writes Content Engine/instagram-research/<date>/adapt/<id>.json in the
shape of the hand-made 16 Oct briefs, and sets adapt.brief to that path relative to
the Content Engine folder. Skip rows and lane none get brief null. An existing brief
is kept unless --force is given, so hand edits survive. --dry-run lists the rows and
writes nothing. Exit code 1 if any row could not be turned into a brief.
Then run adapt_check.py on the batch. See references/adapt.md.
"""
import datetime, json, os, re, sys
from fractions import Fraction

# Mirrors the lane table in references/adapt.md. voice None with a rate: the lane
# speaks but its voice is not chosen yet (the rate is tts.py's default). voice and
# rate both None: no voice, the words are on screen.
LANES = {
    "A1": {"voice": None, "rate": "+8%",
           "cta": "Bio only, link passive. In the video the close is an opinion question; no comment gate, no DM.",
           "render": "A1 is not live. Bank this brief; render it once the lane goes live. Generated character clips, no paid credits."},
    "A2": {"voice": "en-US-AvaNeural", "rate": "+8%",
           "cta": "None. Story accounts die when they sell.",
           "render": "Live lane: video-team's TTS rail renders it over satisfying footage with word by word captions."},
    "B1": {"voice": None, "rate": None,
           "cta": "Every third B1 post, in the caption: we cut clips like this for streamers, link in bio. On screen the close is an opinion question, no comment gate.",
           "render": "No voice, so video-team's TTS rail cannot render this as it stands. It belongs on Content Engine's B1 clip pipeline: clips credited to their creator, original audio."},
    "B2": {"voice": "en-US-AndrewNeural", "rate": "+5%",
           "cta": "Weekly, in the caption: streamers, this is what we do all day, link in bio. On screen the close is the opinion question.",
           "render": "Official trailers and TMDB stills only, never ripped scenes. make-movie.js renders one film per video, so a beat list of several films needs a list mode first."},
    "C1": {"voice": None, "rate": "+8%",
           "cta": "Bio: watch, or buy the system, with the Whop storefront. In the video the close is an opinion question; no comment gate, no DM.",
           "render": "C1 is not live until month 3. Bank this brief; record every screen for real, no invented numbers."},
    "D1": {"voice": None, "rate": None,
           "cta": "Tracking link in the caption, nothing else. No comment gate, no DM.",
           "render": "No voice, so video-team's TTS rail cannot render this. D1 is not live, blocked on the programme's written answer; bank it for Content Engine's clip pipeline."},
    "serials": {"voice": None, "rate": "+8%",
                "cta": "Comment your country to move in. No gate, no link.",
                "render": "The serial's own renderer in Content Engine/serials makes Day N, 10 to 15 seconds, one fixed voice not chosen yet."},
}
# video-team's measured rates; every voice not listed sits near 2.8
WPS = {"en-AU-NatashaNeural": Fraction("2.29")}
DEFAULT_WPS = Fraction("2.8")

COMMENT = ("Adapt brief from the Insta Inbox, {day} batch. Structure and timings carried from the source, none of its "
           "words. Video-team starts at role 2: write five hooks of _hookType, keep one, then role 4 writes the script "
           "to _wordBudget. See ~/.claude/skills/instagram/references/adapt.md.")


class Bad(Exception):
    pass


def beat_secs(at, total):
    m = re.fullmatch(r"\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?|end)\s*", str(at or ""))
    if not m:
        raise Bad(f"beat at '{at}' is not start-end seconds")
    if m[2] == "end" and not total:
        raise Bad(f"beat at '{at}' ends at 'end' but the row has no seconds")
    end = Fraction(total) if m[2] == "end" else Fraction(m[2])
    secs = end - Fraction(m[1])
    if secs <= 0:
        raise Bad(f"beat at '{at}' has no length")
    return secs


def beat_words(secs, total):
    """Each beat's seconds times the lane rate, scaled to sum to total. The rate is a
    common factor, so it cancels: the share is the beat's part of the seconds. Largest
    remainder rounding, ties to the earlier beat, so the sum is exact."""
    whole = sum(secs)
    shares = [Fraction(total) * s / whole for s in secs]
    out = [int(x) for x in shares]
    order = sorted(range(len(shares)), key=lambda i: (-(shares[i] - out[i]), i))
    for i in order[:total - sum(out)]:
        out[i] += 1
    return out


def slug(date, lane, hook, text):
    tail = re.findall(r"[a-z0-9]+", (text or "").lower())[:3]
    return "-".join([date, "adapt", lane.lower(), *re.findall(r"[a-z0-9]+", hook.lower()), *tail])


def brief(r, date):
    a = r["adapt"]
    lane = LANES.get(a.get("lane"))
    if lane is None:
        raise Bad(f"lane '{a.get('lane')}' is not in the lane table")
    words, seconds = a.get("words"), a.get("seconds")
    if not isinstance(words, int) or words <= 0:
        raise Bad(f"words is {words!r}, not a whole number above 0")
    beats = a.get("beats") or []
    if not beats:
        raise Bad("no beats")
    per = beat_words([beat_secs(b.get("at"), seconds) for b in beats], words)
    job = lambda s: (s or "")[:1].upper() + (s or "")[1:]

    src = {"id": r["id"], "creator": r.get("creator"), "hookType": a.get("hook_type"), "url": r.get("url")}
    if r.get("slides"):
        src["slides"] = r["slides"]
    elif r.get("duration"):
        src["seconds"] = round(r["duration"])

    voiced = lane["rate"] is not None
    if voiced:
        wps = WPS.get(lane["voice"], DEFAULT_WPS)
        note = f"{seconds} s at {float(wps):g} words a second."
        if lane["voice"] is None:
            note += f" {a['lane']}'s voice is not chosen yet; 2.8 fits Ava, Andrew, Brian and William."
    else:
        note = f"{a['lane']} has no voice: these are on screen words, spread by beat length. Clip lengths set the seconds."

    day = datetime.date.fromisoformat(date)
    return {
        "_comment": COMMENT.format(day=f"{day.day} {day:%b %Y}"),
        "slug": slug(date, a["lane"], a.get("hook_type") or "", a.get("phone") or a.get("angle")),
        "_lane": a["lane"],
        "_adaptedFrom": src,
        "_angle": a.get("angle"),
        "_angleWhy": a.get("why_lane"),
        "_hookType": a.get("hook_type"),
        "_hooks": [],
        "_beats": [{"at": b.get("at"), "beat": job(b.get("job")), "words": n} for b, n in zip(beats, per)],
        "_wordBudget": words,
        "_wordBudgetNote": note,
        "script": "",
        "voice": lane["voice"],
        "rate": lane["rate"],
        "_cta": lane["cta"],
        "_renderNote": lane["render"],
    }


def check_rate(r):
    """A voiced row's words should be its seconds times the voice's rate."""
    a = r["adapt"]
    lane = LANES[a["lane"]]
    if lane["rate"] is None or not a.get("seconds"):
        return None
    wps = WPS.get(lane["voice"], DEFAULT_WPS)
    want = round(a["seconds"] * wps)
    if abs(a["words"] - want) > max(2, want // 10):
        return f"words is {a['words']}, but {a['seconds']} s at {float(wps):g} words a second is {want}"


def main(path, dry=False, force=False):
    sys.stdout.reconfigure(encoding="utf-8")
    path = os.path.abspath(path)
    with open(path, encoding="utf-8") as f:
        rows = json.load(f)
    batch = os.path.dirname(path)
    date = os.path.basename(batch)
    # brief paths are relative to the Content Engine folder: <CE>/instagram-research/<date>/results.json
    base = os.path.dirname(os.path.dirname(batch))
    out = os.path.join(batch, "adapt")
    changed = False
    counts = {"wrote": 0, "kept": 0, "failed": 0}
    if dry:
        print("dry run: nothing written")

    for r in sorted(rows, key=lambda r: r.get("rank") or 0):
        a = r.get("adapt")
        if not a:
            continue
        tag = f"#{r.get('rank')} {r['id']} ({a.get('lane')})"
        if r.get("tier") not in ("keep", "maybe") or a.get("lane") in (None, "none"):
            if a.get("brief") is not None:
                a["brief"] = None
                changed = True
            continue
        try:
            b = brief(r, date)
        except Bad as e:
            counts["failed"] += 1
            print(f"FAIL {tag}: {e}")
            continue
        f = os.path.join(out, f"{r['id']}.json")
        rel = os.path.relpath(f, base).replace(os.sep, "/")
        if os.path.exists(f) and not force:
            counts["kept"] += 1
            print(f"{'would keep' if dry else 'kept'} {tag} {rel}: exists, --force to overwrite")
        else:
            counts["wrote"] += 1
            print(f"{'would write' if dry else 'wrote'} {tag} {rel}")
            if not dry:
                os.makedirs(out, exist_ok=True)
                with open(f, "w", encoding="utf-8") as fh:
                    json.dump(b, fh, indent=2, ensure_ascii=False)
                    fh.write("\n")
        warn = check_rate(r)
        if warn:
            print(f"check {tag}: {warn}")
        if a.get("brief") != rel:
            a["brief"] = rel
            changed = True

    if changed and not dry:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(rows, f, indent=1, ensure_ascii=False)
    verb = "would write" if dry else "wrote"
    print(f"{counts['wrote']} {verb}, {counts['kept']} kept, {counts['failed']} failed"
          + ("" if dry or not changed else "; results.json updated"))
    if not dry:
        print("Next, the self test:\n  /c/Sayso/.venv/Scripts/python.exe -I ~/.claude/skills/instagram/scripts/adapt_check.py "
              f"\"{path}\" \"<scratchpad>/instagram\"")
    return 1 if counts["failed"] else 0


if __name__ == "__main__":
    args = sys.argv[1:]
    flags = {a for a in args if a.startswith("--")}
    rest = [a for a in args if not a.startswith("--")]
    unknown = flags - {"--dry-run", "--force"}
    if len(rest) != 1 or unknown:
        sys.exit(__doc__.strip().splitlines()[2].strip() if not unknown else f"unknown flag {', '.join(sorted(unknown))}")
    sys.exit(main(rest[0], "--dry-run" in flags, "--force" in flags))
