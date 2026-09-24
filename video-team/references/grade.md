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
duration within about 1.5s of the script's word count divided by 3.1.

```bash
# The captions that were actually burned in. Should be one line per spoken word.
grep -c "^Dialogue" "<out>.ass"
```

Compare that to the word count the renderer reported. A large mismatch means the
timings and the audio disagree, and the captions will drift visibly.

```bash
# Eyeball three frames rather than trusting the numbers: start, middle, end.
ffmpeg -y -loglevel error -ss 0.6 -i "<out>.mp4" -frames:v 1 work/check-start.png
ffmpeg -y -loglevel error -ss <half> -i "<out>.mp4" -frames:v 1 work/check-mid.png
ffmpeg -y -loglevel error -sseof -1.2 -i "<out>.mp4" -frames:v 1 work/check-end.png
```

Read those three images. The start frame is the one that decides whether anyone
watches, so check the hook text is fully on screen and not colliding with the
footage's own text. The end frame confirms the end card rendered rather than the
video stopping dead.

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
