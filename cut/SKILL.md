---
name: cut
description: Turn raw clips plus a one-line brief into a finished vertical reel, free and local, at C:\Cut. Use whenever Byron wants a video edited, a reel, a hype edit, a highlight cut, a montage, captions on a clip, "cut this to the beat", "make a reel from this", "edit this footage", or points at mp4 files and a song and asks for something short. Also use when he asks what Narrative or CapCut would do with footage. The pipeline measures the footage (scene cuts, loudness peaks, transcript, beat grid, contact sheets), Claude writes the edit as edl.json, Remotion renders 1080x1920 mp4 with kinetic text templates. Not for generating video from nothing: that is WanGP or Everygen.
---

# Cut

Brief in, reel out. Lives at `C:\Cut` (spec: `C:\Cut\docs\design.md`). You are
the editor; the tools measure and render. The whole job is four commands and
one JSON file you write.

## 1. Stage the job

```
C:\Cut\inbox\<job>\
    clip1.mp4 clip2.mp4 ...   copy the sources in (never reference Downloads or Medal by path)
    track.mp3                 optional music
    brief.md                  Byron's words, verbatim
```

Job names are short kebab-case. Copying multi-gigabyte sources is fine; the
renderer never reads them directly.

## 2. Measure

```bash
cd /c/Cut && uv run python tools/analyse.py <job>            # add --no-words when nobody speaks (game clips, sport)
```

Read `inbox/<job>/analysis/summary.md`, then `Read` every contact sheet in
`analysis/sheets/`. The sheet is 20 frames across the whole clip, so for a
ten-minute clip that is one frame per 30 seconds: enough to find the good
region, not the cut. Zoom in with:

```bash
uv run python tools/peek.py <job> clip1.mp4 9:22 9:37     # 2 fps sheet, real source timestamps on each frame
```

Do this for every window you intend to use. Do not guess in and out points
from the coarse sheet; a cut half a second early lands on the wrong frame
and the whole edit reads sloppy.

`analysis/beats.json` gives `bpm`, `beat_interval`, `beats`, `downbeats` and
`drops`. `energy.json` gives the loudest moments per clip (the action, in
footage with no speech). `words.json` gives word timestamps when there is
speech, for captions and for cutting on a line.

## 3. Write the edit

`inbox/<job>/edl.json`, contract in `C:\Cut\render\src\types.ts`. Rules that
make it look like the reels Byron sends rather than a slideshow:

- **Pick the music start on a downbeat**, then every cut lands on a beat or
  downbeat of reel time (`(t - music.start)` divisible by `beat_interval`).
  Cut lengths of 1, 2 or 4 beats; one 3-beat cut breaks the pattern nicely.
- **Open on the best-lit, most legible shot with the title over it.** Hero
  shot on the first drop with a `word-pop`. Second drop gets a bigger word.
  End on the widest shot with a `glass-caption` and the URL.
- **Shot order is contrast**: night then day, wide then close, fast then slow.
  Two similar shots back to back read as one long shot.
- **Sources are landscape, reel is portrait.** `fit: cover` crops to the
  middle third; use `zoom` 1.15 to 1.25 to push game HUD and watermarks off
  the edges, `pan` to keep the subject in frame. `fit: blur` only for
  talking heads that must not be cropped.
- **Speed** under 1 is slow motion: use on the one impact moment, not everywhere.
- `hits` (`zoom-hit`) go on the drops and on nothing else.
- Text over 5 words goes in `glass-caption`, never `word-pop`.
- Total length: 12 to 20 seconds unless the brief says otherwise.

## 4. Render

```bash
cd /c/Cut && uv run python tools/prepare.py <job>            # trims only the seconds used into inbox/<job>/stage (seconds)
cd /c/Cut/render && npx remotion render src/index.ts Reel "../out/<job>/<job>.mp4" --props="../inbox/<job>/stage/edl.json" --public-dir="../inbox/<job>/stage" --log=error
```

`mkdir -p /c/Cut/out/<job>` first. A 15-second reel renders in under a
minute. Re-run both after every `edl.json` change; `prepare` reuses segments
whose in/out did not move.

## 5. Watch it and grade it

```bash
cd /c/Cut && mkdir -p out/<job>/frames && ffmpeg -v error -y -i out/<job>/<job>.mp4 -vf "fps=2,scale=270:-2,tile=6x5" -frames:v 1 -q:v 3 out/<job>/frames/sheet.jpg
ffmpeg -y -i out/<job>/<job>.mp4 -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume"
```

`Read` the sheet, pull single frames at each text event with `-ss`, then run
the Done means list. Fix `edl.json`, prepare, render again. Three passes at
most; if it still fails, say which line and why.

Send the mp4 with `SendUserFile` as soon as a pass is watchable, not at the
end. Name the clips and timestamps used and the templates, and say whether
the music is a commercial track (posting it is Byron's call).

## Templates

`word-pop`, `glass-caption`, `shimmer-title`, `count-up` in
`C:\Cut\render\src\templates\index.tsx`; `zoom-hit` and `flash` in
`Reel.tsx`. Sources are named in each. Adding one: a component taking
`{ev, progress, frame, fps, width, height}`, registered in `TEMPLATES`, a
row in `C:\Cut\docs\templates.md`, and the union in `types.ts`. Port from
the UI libraries (`steal-the-polish`, React Bits) rather than inventing.

## Done means

Before handing this back, check every line. If any fails, fix it and check
again. Do not report the work as finished until all of them pass.

- [ ] Every cut time in `edl.json` sits on a beat of reel time (within 0.03s),
      checked by arithmetic against `beat_interval`, not by feel.
- [ ] No black, frozen or duplicated frame anywhere in the output sheet.
- [ ] No game HUD, watermark, chat box or timestamp visible in any frame;
      `zoom` or `pan` used to push it off.
- [ ] Every text event is readable on the frame it sits on: light text is not
      over a bright sky, nothing overlaps the subject's face or the car.
- [ ] Word pops land on drops or downbeats; captions with more than five
      words use `glass-caption`.
- [ ] Audio is present (`mean_volume` between -22 and -10 dB), the track
      starts on a downbeat and fades out, and nothing clips (`max_volume` below 0).
- [ ] The final length matches the brief within one beat.
- [ ] In and out points came from `peek.py` sheets at 2 fps, not from the
      20-frame overview.
- [ ] The reply names each clip and source timestamp, each template, the
      output path, and whether the music is a commercial track.
- [ ] The mp4 was sent to Byron with `SendUserFile`.

If a line cannot be checked without the user, say which one and why, rather
than assuming it passes.
