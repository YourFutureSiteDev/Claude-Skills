# Role 5 — Producer

**Produces:** `shots[]` and the chosen `background`.

Decides what is on screen for every second and where it comes from. The rule that
keeps it honest: **every shot names a real source before the render starts.** A
shot list containing "b-roll of a city" has a hole in it, and the hole is found
at render time when it is expensive.

---

## The background ladder

Work down it and stop at the first option that fits. The order is cost, and the
free options are genuinely good enough for most shorts. Role 1's
creativity-instead-of-budget rule applies directly here: when a shot needs
something unaffordable, the answer is a more creative shot.

1. **Footage Byron already has.** A file path. Free, instant, best. Screen
   recordings of his own systems running are the strongest material he owns,
   because they are the thing no competitor can fake.
2. **A licensed-to-circulate URL via yt-dlp.** Official trailers, press
   material. The renderer cuts it into a shot reel automatically. Never a ripped
   scene: Content Engine's `PLAN.md` settled this, and the reasoning is that
   studios publish trailers precisely to be circulated.
3. **Stills with a slow drift.** `buildStillReel` moves a crop window across
   each one, which reads as camera rather than animation.
4. **Generated visuals.** Hand the single shot to the `generate` skill, which
   owns the backend ladder, the price quote and the ledger. Everygen was at 0
   credits with no subscription on 24 Sep 2026, so in practice this means WanGP
   locally or it means nothing.

Never batch four "while we're here" renders into one ask. That is how a free
video becomes a paid one.

## Make the clock visible

Role 3 handed over `visibleClock`: the thing that shows progress on screen. This
role decides what it actually is. A counter, a running total, a bar, a number
that moves, a stack that grows. It is the cheapest retention device available and
it costs one overlay.

If `visibleClock` came through empty, say so rather than skipping it silently.

## Cut to the narration, not to a clock

The mistake worth not repeating. On the first real run of this skill the slides
were built on an even 3.8-second cadence, which looked correct on paper: 83
words, 30.2 seconds of speech, 8 slides, 3.775 seconds each. It rendered a video
where the screen said 621 while the voice said 398, because narration does not
keep an even pace. One long sentence and everything after it is a beat behind.

**Take the boundaries from the word timings.** `work/<slug>/words.json` holds
every word with its start and end, so each slide's duration is the gap between
the first word of its own sentence and the first word of the next slide's:

```bash
node -e 'require("./work/<slug>/words.json").forEach((x,n)=>
  console.log(String(n).padStart(3),x.start.toFixed(2),x.word))'
```

Read off the start time of each sentence that gets its own slide, and the
differences are the durations. This needs the voiceover to exist first, so the
order is: script, then narrate, then read the timings, then build the visual.
A re-render after a hook change reuses the same audio, so it only costs once.

Then check the result rather than trusting the arithmetic: grab a frame and ask
what word was being spoken at that timestamp. Grade check 9.

**Watch what the split does to cut rate.** Timing to sentences produces uneven
durations, and two of them on this run came out at 6.1 and 8.3 seconds, well past
the ~4s screensaver ceiling. Both got split into two slides, taking the sequence
from 8 slides to 10. A sentence that earns more than about four seconds on screen
needs a second image, not a longer hold.

## Shot length against cut rate

`buildShotReel` defaults to 2.4-second cuts. Faster than roughly 1.5s reads as
frantic on a phone; slower than roughly 4s reads as a screensaver. Leave the
default unless there is a reason, and write the reason down if you change it.

The grade checks that visuals change at least every three seconds. One static
shot for thirty seconds fails, however good the script is.

## Text collision is a producer problem

The captions burn centred and the hashtags sit above the app UI. Footage carrying
its own on-screen text will collide with both, and this was measured rather than
assumed: on a source with burned-in subtitles, `trimBottom: 0.18` moved them
clear of the hashtag line but left them visible along the bottom edge, because
the crop happens before the reel is cut and the renderer then fill-crops the
shorter frame back to 9:16.

So `trimBottom` softens a collision, it does not remove text from frame. **When
there is a choice, choose footage without text in it.** Use `trimBottom` only
when the footage is the only footage available.

## Check the first frame before the render

Role 2 handed over three first-frame concepts. Pick one and make sure the
background at second zero actually supports it: the hook text has to be legible
against whatever is behind it. A hook that tested well against a mental image and
badly against the real frame is a failure this role owns, and it is visible in a
single frame grab.

---

## Handoff

- `shots[]` — each with a time range, what it shows, and a real named source
- `background` — the filled-in block the renderer reads
- `clock` — what shows progress on screen
- `collisions` — any known text collision and what was done about it
