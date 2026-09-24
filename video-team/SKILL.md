---
name: video-team
description: Turn one rough idea into a finished vertical short (1080x1920 MP4 with burned word-by-word captions) by running it through six specialist roles in order — angle, hook, story, script, shot list, edit — then rendering it on Byron's free local rail. Use whenever he wants a short-form video, a TikTok, a Reel, a faceless clip, a talking-head script, b-roll with narration, or says "make me a video about X", "turn this into a short", "script me a reel", "make a clip for Content Engine", "I need a video for the Sited page". Also use when he has a script or hook already and wants the rest built around it, when a video came out flat and needs diagnosing role by role, or when he asks what a video will cost to make. Renders free by default (edge-tts plus ffmpeg) and never spends a credit without a quoted price and a yes.
---

# Video Team

Six roles, one idea in, one finished MP4 out. It exists because a short fails at
a specific stage and "make a better video" is not an actionable note. When the
work is split into six named handoffs, a flat video has a diagnosable cause: the
angle was generic, or the hook buried the payoff, or the script outran the
footage.

**The rail is free.** edge-tts for voice with real word-level timings, ffmpeg for
the composite, Content Engine's renderer for the burn-in. Zero cost, no API key,
runs on this PC. Paid generation is an opt-in for one specific case (a visual
that has to be invented), and it goes through the `generate` skill so the price
gets quoted once, in one place.

---

## What makes this different from the usual six-agent chain

The version of this going round as a carousel runs the roles in a line and hopes:
idea → hook → story → script → visuals → edit. It skips the constraint that
actually decides whether the video works.

**Lock the duration before the script is written.** In this renderer the script
*is* the timeline. `renderVideo` derives the video's length from the end of the
last spoken word, so a 180-word script is a 62-second video whether that was the
plan or not. Writing prose first and discovering the length afterwards is the
single most common way one of these comes out wrong: the footage runs out, the
hook lands at 0:09 instead of 0:01, or the payoff gets cut.

So role 3 sets a word budget and role 4 writes to it. The numbers:

| Target | Words at 2.8 w/s | Use for |
|---|---|---|
| 15s | 40-44 | one idea, one punchline |
| 30s | 80-86 | the default. A hook, three beats, a payoff |
| 45s | 122-128 | a story with a turn |
| 60s | 164-170 | ceiling. Past this, retention falls off a cliff |

**The rate is per voice, and it was measured, not assumed.** Same 92-word script
through five edge-tts voices at `+8%` on 24 Sep 2026:

| Voice | Words per second |
|---|---|
| `en-US-AndrewNeural` | 2.94 |
| `en-AU-WilliamNeural` | 2.82 |
| `en-US-AvaNeural` | 2.79 |
| `en-US-BrianNeural` | 2.77 |
| `en-AU-NatashaNeural` | **2.29** |

Four cluster around 2.8, which is what the table above uses. Natasha is the
outlier and needs roughly 18% fewer words for the same length, so a 30-second
video in her voice is about 69 words, not 84. `render-brief.mjs` holds the table,
predicts against the chosen voice, and prints a WORD BUDGET DRIFT warning when
the real speech comes back more than 2.5s off the plan.

Count the words; do not estimate the seconds.

---

## The six roles

Run them in order. Each one produces a **named artifact** that the next role
reads, which is what lets a failed run resume at the role that failed instead of
starting over.

**Read the file for the role you are running.** Roles 1 to 3 each encode a
specific documented method in detail, and the table below is only the index.

| # | Role | Method encoded | File |
|---|---|---|---|
| 1 | **Ideas** | MrBeast's leaked internal production doc: title and thumbnail first, the wow factor, stair stepping, creativity instead of budget | [roles/01-ideas.md](references/roles/01-ideas.md) |
| 2 | **Packaging** | Paddy Galloway: click-and-watch, specific over vague, familiar but unexpected, formats stolen across niches, 80/20 | [roles/02-packaging.md](references/roles/02-packaging.md) |
| 3 | **Story** | Ryan Trahan, via two teardowns: the five building blocks, the constraint that opens the loop, the visible clock | [roles/03-story.md](references/roles/03-story.md) |
| 4 | **Script** | The rail's own constraints: spoken by TTS and read as burned captions at once | [roles/04-script.md](references/roles/04-script.md) |
| 5 | **Producer** | The background ladder, measured text-collision behaviour | [roles/05-producer.md](references/roles/05-producer.md) |
| 6 | **Editor** | Assemble, render, grade, send | [roles/06-editor.md](references/roles/06-editor.md) |

Each file cites its sources so the method can be checked and updated when those
people publish something new. `references/roles.md` also records where two of the
sources flatly contradict each other on format lifespan, and which side wins at
Byron's audience size.

**Replicate the method, not the person.** No role prompts a model to be a named
individual or to write in their register. That is not squeamishness: asking for a
personality gets you an impression of a personality, which is a worse output than
the discipline that made the personality work. The stair-stepping structure
transfers. Someone's voice does not.

### Where the critic sits

Between roles 2 and 3, kill the weak hooks. This is the cheapest possible place
to fail: a bad hook caught here costs nothing, and caught after render costs the
whole render. Five hooks in, one out, and the four rejects stay in the brief so
the next attempt does not circle back to them.

---

## Running the chain

### Step 1 — establish where it lands and how long it is

Ask for the target length if it is not obvious, and pick the project folder
before producing anything. Byron's landing rule: every file made for a piece of
work goes in that work's folder the same session.

- Content Engine lanes → `Content Engine/out/` (and read that project's
  `PLAN.md` for the lane's fixed voice; A2 sounds nothing like B1)
- YFS or Sited marketing → that project's `generated/` folder
- A genuine one-off → `Desktop\Claude\Random\YYYYMMDD-what-it-is.mp4`

No home yet? Use the `project-folder` skill first.

### Step 2 — run roles 1 to 5, writing the brief as you go

Build up `brief.json` in the project folder. The full field list and an example
are in `assets/brief.example.json`. It is deliberately a file on disk rather
than conversation state, because the render is a separate process and a failed
render should be re-runnable without redoing the creative work.

### Step 3 — get the background

Work down this ladder and stop at the first that fits. Ladder order is cost, and
the free options are genuinely good enough for most of these.

1. **Footage Byron already has** — a file path. Free, instant, best.
2. **A YouTube URL via yt-dlp** — the renderer cuts it into a shot reel
   automatically. Free. Only for footage that is licensed to be circulated:
   official trailers and press material, never a ripped scene. Content Engine's
   `PLAN.md` settled this and the reasoning holds.
3. **Stills with a slow drift** — `buildStillReel` moves a crop window over each
   one, which reads as camera rather than animation. Free.
4. **Generated visuals** — hand off to the `generate` skill. It owns the backend
   ladder (WanGP local and free first, Everygen paid last), the price quote and
   the ledger. Do not call Everygen directly from here; the money rule lives in
   one place on purpose.

Everygen's balance was **0 credits with no subscription** as of 24 Sep 2026, so
option 4 means WanGP or it means nothing. Check before offering it.

### Step 4 — render

```bash
node "C:/Users/PC/.claude/skills/video-team/scripts/render-brief.mjs" --brief "<path>/brief.json"
```

It runs edge-tts, gets the word timings, builds the background, and burns the
captions in one pass. Prints JSON: output path, duration, word count. Exact call
shapes and every flag are in `references/render-rail.md`.

### Step 5 — grade it before handing it back

Run the grade in `references/grade.md` against the finished file. It is six
checks that map to the six roles, so a fail names the role to redo rather than
sending you back to the top. A video that fails the grade does not get handed
over as done; fix the named role and re-render.

Then show him the file. He judges visual work by eye in seconds, so send the MP4
itself, not a description of it.

---

## When he already has part of it

The chain is not all-or-nothing and forcing a full run when he arrives with a
script is a waste of his time.

- **Has a hook** → start at role 3, but still run the 1-second test on it.
- **Has a script** → start at role 5, and count the words first. If it is 340
  words he is asking for a 110-second video and probably does not know it. Say
  so before rendering.
- **Has a finished video that came out flat** → do not rebuild. Run the grade in
  `references/grade.md`, name the role that failed, fix only that.

---

## Cost

The default path costs nothing: edge-tts is free and keyless, ffmpeg is local,
yt-dlp is free. A 30-second render takes about a minute on this PC, most of it
ffmpeg at `crf 19`.

The only spend is generated visuals, and that is the `generate` skill's call
with its own quote-and-confirm gate. If asked what a video costs, the honest
answer for the standard path is nothing but PC time.

---

## What this skill will not do

- **Render before the word count is checked.** It is the one gate that catches
  the most common failure, and it costs a second.
- **Spend credits.** Visual generation delegates to `generate`, which quotes a
  price and waits for a yes. No exceptions and no silent retries.
- **Lift someone's video.** Stories are invented, footage is licensed for
  circulation. Content Engine's rule, and it is also the thing that keeps the
  accounts alive.
- **Mix an account's niches.** One niche per account. Check the lane's config
  before writing in a voice.
- **Ask a model to be a named real person.** Borrow the technique, credit it in
  the brief, write the rule.
- **Invent results to sell against.** No LARP content. It is misleading conduct
  under Australian Consumer Law and it lands on Byron personally.
- **Hand back a video that failed its own grade** without saying which check
  failed and why.

---

## Done means

Before handing the video back, check every line. If any fails, fix it and check
again. Do not report it as finished until all of them pass.

- [ ] The file plays: `ffprobe` shows 1080x1920, a video stream and an audio
      stream, and a duration within 2.5s of word count divided by the chosen
      voice's measured rate (render-rail.md has the table)
- [ ] The burned caption count matches the word count the renderer reported, so
      the captions cannot drift against the speech
- [ ] The hook's interesting word arrives inside the first second, checked by
      reading the first-frame grab rather than the script
- [ ] The first frame reads with the sound off, and its text does not overlap
      text already in the footage
- [ ] Script word count is within 5% of the budget role 3 set
- [ ] The script contains no em dash, en dash, spaced hyphen, emoji or
      parenthesis, because TTS reads them as pauses and Byron rejects them in
      any written output
- [ ] Any text on screen agrees with the word being spoken at that moment,
      checked against `work/<slug>/words.json` rather than assumed from the plan
- [ ] Nothing is claimed in the video that cannot be screenshotted
- [ ] The MP4 and its brief are in the project's folder, not a temp directory
- [ ] Any footage that came from someone else is licensed to be circulated
- [ ] The MP4 itself was sent to him, not a description of it

If a line cannot be checked without him, say which one and why, rather than
assuming it passes.

**Unattended runs** (Content Engine's cron on the Vitals box, where nobody is
there to ask): render, grade, fix every failure, re-grade. **At most three
passes.** If a line still fails on the third, stop, leave the video in `out/`
unposted, and write the failing line and the reason to the run log. Without the
cap a wrong standard burns the whole night on one video.
