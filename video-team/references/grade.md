# Grading a finished video

The check that runs after the render and before Byron sees it. It exists because
ffmpeg exiting 0 means a file exists, not that the video is good, and because a
flat video needs a named cause to be fixable.

Each check maps to the role that owns it, so a failure says which role to redo
rather than sending the whole chain back to the top.

## The mechanical checks

Run these first. They are objective and take seconds.

```bash
# Duration, resolution, audio track, in one go.
ffprobe -v error -show_entries format=duration:stream=width,height,codec_type \
  -of default=noprint_wrappers=1 "<out>.mp4"
```

Expect `width=1080`, `height=1920`, both a video and an audio stream, and a
duration within about 2.5s of word count divided by the voice's measured rate (see the table in render-rail.md; 2.8 w/s for most, 2.29 for Natasha).

```bash
# The captions that were actually burned in. Should be one line per spoken word.
grep -c "^Dialogue" "<out>.ass"
```

Compare that to the word count the renderer reported. A large mismatch means the
timings and the audio disagree, and the captions will drift visibly.

### The contact sheet: 30 frames across the whole video

Three frames (start, middle, end) miss whatever happens between them. Read the
whole video on one page instead:

```bash
node "C:/Users/PC/.claude/skills/video-team/scripts/contact-sheet.mjs" --in "<project>/out/<slug>.mp4"
```

It writes three files to `<project>/work/<slug>/` and prints their paths as JSON:

- `sheet.png`: 30 tiles, 6 across and 5 down, one every `duration / 30` seconds
  from 0. Each tile is stamped with its time, and carries a red line and tint
  over the bottom 300px of the frame.
- `start.png`: full size at 0.6s, for the hook check.
- `end.png`: full size 1.2s from the end, for the end card. The last tile sits
  `duration / 30` from the end, 2.07s on a 62s video, and the end card holds for
  only 2.0s, so the sheet alone can miss it.

Under the hood it is the plain command below plus the stamps and the rail line.
Use the plain one when node is not to hand:

```bash
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "<out>.mp4")
ffmpeg -y -loglevel error -i "<out>.mp4" -vf "fps=30/$dur,scale=180:320,tile=6x5" -frames:v 1 work/sheet.png
```

Read `sheet.png` for three things, then the two full size grabs:

1. **Text over text.** Captions or a hook on top of text already in the footage,
   or a title box covering the thing the video is about. Checks 7 and 9 below.
2. **Anything inside the red tint.** That is the bottom 300px, where TikTok's
   caption bar and action rail sit, so it is hidden on a phone. Hashtags sit at
   `MarginV 300`, right on the line, which is correct.
3. **A shot held past 4 seconds.** The JSON's `heldIfInARow` says how many
   matching tiles in a row that takes (5 on a 31s video, 3 on a 62s one). It
   means the same picture with nothing moving, not the same layout: a talking
   head that keeps talking is not held. Check 6 below.

Then `start.png`: the hook text fully on screen and not colliding with the
footage's own text. That frame decides whether anyone watches. And `end.png`:
the end card rendered rather than the video stopping dead.

A tile's time is what check 9 needs: look the stamp up in `words.json` to see
what was being said when that frame was on screen.

On its first run (17 Oct 2026, the drama lane's placeholder episode) the sheet
showed what three frames only hint at: the footage's own burned captions
straddled the red line in every one of the 30 tiles, not just the one grab, and
a landscape title card cropped to its middle letters ("NAR LANDIN") sat between
the old start and middle grabs, where nothing looked.

## The judgement checks

These need reading, not measuring.

| # | Check | Owner | Failing looks like |
|---|---|---|---|
| 1 | Hook's interesting word lands inside the first second | Packaging | "In this video I'm going to show you how..." |
| 2 | First frame works with the sound off | Packaging | The hook only makes sense spoken |
| 3 | Every beat changes the situation | Story | A list of facts with "also" between them |
| 4 | Word count within 5% of budget | Story/Script | 140 words against a 96-word budget |
| 5 | No dashes, no emoji, no parentheses in the script | Script | An em dash TTS reads as a dead stop |
| 6 | Visuals change at least every 3 seconds | Producer | One static shot for 30 seconds |
| 7 | Captions never collide with the footage's own text | Producer | Two layers of white text overlapping |
| 8 | Nothing claimed that cannot be screenshotted | Angle | "This made me $10k" with no dashboard |
| 9 | On-screen text agrees with the word being spoken | Producer | The slide says 621 while the voice says 398 |

Check 9 needs the word timings, not a guess. Grab a frame and ask what was being
said at that timestamp:

```bash
node -e 'const w=require("./work/<slug>/words.json");const t=Number(process.argv[1]);
console.log(t+"s -> "+(w.filter(x=>x.start<=t).pop()||{}).word)' 17.0
```

It caught a real failure on the first run of this skill: slides built on a fixed
3.8-second cadence drifted a whole beat behind narration that does not keep an
even pace, so the number on screen contradicted the number being spoken. See
`roles/05-producer.md` for the fix.

## Fixing by role

The point of naming the owner is that most fixes do not need a re-render of
everything:

- **Packaging fail (1, 2)** — rewrite the first line, re-run the render. The
  footage and shot reel are cached in `work/`, so this is fast.
- **Story fail (3, 4)** — back to the beats. This one does need the chain again
  from role 3, because the script is downstream of the budget.
- **Script fail (5)** — fix the characters, re-render. Cheap.
- **Producer fail (6)** — change `shotSecs`. No creative rework.
- **Producer fail (7)** — **pick different footage.** `trimBottom` is the
  second-best fix and it is worth knowing why: measured at `0.18` on a source
  with burned-in subtitles, it moved them clear of the hashtag line but left
  them visible along the bottom edge. It crops the source *before* the reel is
  cut, and `renderVideo` then fill-crops the shorter frame to 9:16, which
  re-centres what is left. It reduces a collision; it does not remove text from
  frame. Footage that carries its own captions is the wrong footage for a
  captioned video.
- **Angle fail (8)** — stop. This is the one that cannot be patched at the
  render stage, and shipping it anyway is the LARP problem. Cut the claim.

## The loop, when nobody is watching

Content Engine's pipeline runs on cron from the Vitals box, so there is no one
to ask. The loop has to run itself:

> Render. Grade against the checks above. Fix every failure and re-grade. At most
> **three** passes. If a check still fails on the third, stop, leave the video in
> `out/` unposted, and write the failing check and the reason to the run log.

The cap is there because a wrong standard with no cap burns the whole night's
tokens on one video. Three passes catches the real failures; a fourth means the
brief is wrong, not the render.
