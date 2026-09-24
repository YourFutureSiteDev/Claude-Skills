# The render rail

What actually turns a brief into an MP4, and the real call shapes. Verified
against Content Engine's `src/` on 24 Sep 2026.

## The one command

```bash
node "C:/Users/PC/.claude/skills/video-team/scripts/render-brief.mjs" --brief "<project>/brief.json"
```

| Flag | Default | Notes |
|---|---|---|
| `--brief` | required | Path to brief.json. Its folder is where the video lands. |
| `--engine` | `C:/Users/PC/OneDrive/Desktop/Claude/Content Engine` | Only pass it if the project moved. |
| `--out` | `<brief folder>/out/<slug>.mp4` | Override the output path. |

Prints one JSON line on success: `out`, `duration`, `words`, `scriptWords`,
`voice`, `background`. Non-zero exit with the reason on failure. Intermediate
files stay in `<brief folder>/work/<slug>/` so a re-render reuses the download
instead of fetching it again.

## What it does, in order

1. **Counts the script's words** and warns over about 62 seconds. Free, and it
   catches the most common mistake before anything expensive happens.
2. **Narrates with edge-tts** via the engine's `src/tts.py`. Free, keyless. The
   reason this helper exists at all rather than using the edge-tts CLI: the
   library emits `WordBoundary` events, the CLI throws them away into
   sentence-level subtitles. Word-by-word captions are most of why these hold
   attention, and estimated timings drift audibly against real speech.
3. **Builds the background** per `background.kind`.
4. **Renders** through `renderVideo`: crops to fill 1080x1920 without squashing,
   a light grade (`contrast 1.05`, `saturation 1.10`) because film is graded for
   a dark room and a phone is not one, then burns the ASS subtitles in.
   `libx264 crf 19 preset medium`, AAC 192k, `+faststart`.

## The duration is not yours to set

`renderVideo` computes it:

```
duration = (end of last spoken word) + 0.15 + (endCard ? holdSecs : 0.4)
```

There is no length parameter, by design. It deliberately ignores the raw audio
length because edge-tts pads trailing silence, which showed up as dead air with
no caption on screen. **The script is the timeline.** If the video needs to be
30 seconds, the script needs to be about 95 words. Nothing downstream can fix a
script that is twice its budget.

## Background options

### `file`

```json
{ "kind": "file", "path": "C:/.../clip.mp4", "reel": true, "shotSecs": 2.4, "trimBottom": 0 }
```

`reel: true` (the default) cuts it into a shot reel: detects real cuts, scores
candidate frames, and buckets them across the source so the reel tracks the
footage's escalation instead of clustering in one act. `reel: false` uses the
file as-is and lets ffmpeg loop it, which is right for a texture or a long
continuous take.

### `youtube`

```json
{ "kind": "youtube", "url": "https://www.youtube.com/watch?v=..." }
```

yt-dlp downloads it once into `work/`, then it is cut as above. **Licensed to
circulate only:** official trailers and press material. Studios publish trailers
to be circulated and that is precisely what makes the lane survivable. Never a
ripped scene.

`trimBottom` is the partial fix for a source that carries burned-in subtitles,
not a cure. Measured at `0.18`: the source's own captions moved clear of the
hashtag line but stayed visible along the bottom edge, because the crop happens
before the reel is cut and `renderVideo` then fill-crops the shorter frame back
to 9:16, re-centring what remains. Use it when the footage is the only footage
available. When there is a choice, choose footage without text in it.

### `stills`

```json
{ "kind": "stills", "urls": ["https://...", "..."], "holdSecs": 3.2 }
```

Each still gets a slow moving crop, which reads as camera rather than animation.
It uses a crop window rather than `zoompan` deliberately: zoompan rescales the
whole frame every output frame and took 42 seconds per still on 4K sources, for a
result nobody can tell apart.

It needs about `targetSecs / holdSecs + 1` images and cycles if there are fewer.

### Generated visuals

Not handled here. Hand the shot to the **`generate`** skill, which owns the
backend ladder (WanGP local and free, then Everygen paid), the price quote and
the ledger. It writes the file, you put its path in `background.path`.

Everygen's balance was **0 credits, no subscription** on 24 Sep 2026. Check
before offering it as an option.

## Known limits of the rail

Worth knowing so they are not rediscovered mid-render.

- **Caption size is not settable from the brief.** `buildAss` takes a `size`
  (default 96) but `renderVideo` only forwards `font`. Changing size means
  editing the engine, which is a Content Engine change, not a skill change.
- **Captions are centred.** No position option. Footage with its own on-screen
  text will collide, and `trimBottom` only softens it. Pick different footage.
- **Output must be handed to `renderVideo` as a relative path.** It escapes a
  Windows drive letter into `C\\:` inside the `subtitles=` filter, which ffmpeg
  reads as an escaped backslash plus a bare colon, so the filename ends early:
  *Unable to parse "original_size"*. `render-brief.mjs` works around it by
  chdir-ing to the output directory and passing the bare filename. Content
  Engine never hits this because `make-movie.js` passes `out/x.mp4` relative.
  If the engine's `render.js` is ever fixed, drop the workaround.
- **`endCard` is `{ title, year }` only.** Title renders large at y=880, year
  smaller beneath at y=1010. It is not a free-form lines array. For a non-film
  video, use title for the handle and year for the supporting line.
- **Hashtags render at 44px, `MarginV 300`,** slightly transparent, on screen for
  the whole video. That margin clears TikTok's caption bar and action rail;
  lower and they sit behind the interface on most phones.
- **One background per video.** No multi-source timeline. A video needing
  intercut sources has to be assembled into one file first.

## Voices

edge-tts, all free. `en-AU-*` for anything Australian-facing.

| Voice | Reads as |
|---|---|
| `en-US-AvaNeural` | default, warm, neutral |
| `en-US-AndrewNeural` | male, conversational, good for build-in-public |
| `en-US-BrianNeural` | male, lower, documentary |
| `en-AU-NatashaNeural` | Australian female |
| `en-AU-WilliamNeural` | Australian male |

`rate` defaults to `+8%`, which is a touch quicker than natural and matches
short-form pacing. Past about `+20%` the word timings start to feel clipped
against the captions.

Full list: `py -m edge_tts --list-voices`.

## When it fails

| Error | Cause and fix |
|---|---|
| `no python with edge_tts installed` | `py -m pip install edge-tts` |
| `edge-tts returned no word timings` | Usually a script of only punctuation or emoji. Captions would be empty, so it stops rather than shipping a silent video. |
| `no stills downloaded` | Every URL failed. Check they are direct image URLs, not page URLs. |
| `buildShotReel` produces a stuttery reel | The source had no detectable cuts, so it fell back to even sampling. Set `reel: false` or use a different source. |
| ffmpeg exits non-zero on `subtitles=` | A path quoting problem. The script already escapes the Windows drive colon; if it recurs, check for an apostrophe in the project folder name. |
