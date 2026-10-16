# Formats lifted from saved reels

These are moves from reels Byron saved to his Insta Inbox, kept where they
measurably held attention. Each one has to fit the rail: TTS voice, burned
captions, a background reel, ffmpeg. A format that needs a face on camera is
marked as such.

Source run: 6 Oct 2026, 19 posts. The ranked report is at
https://claude.ai/artifact/XRtQmcztWqkSMHigWjzzKM and the raw analysis is in
`Content Engine/instagram-research/2026-10-06/results.json`.

## Video formats

**1. Floating UI cards that fill in live.** (Jayant, 2.5k likes; Nick Saraev,
5k likes.) Soft grey or cream background. A white card with a soft shadow
slides in and its text types itself out: a GitHub card, a reel builder, a
caption box. A new card about every 2 seconds. Best for any "here is a tool"
or "here is a system" video. On the rail: render each card as a PNG (HTML
page screenshotted, or ffmpeg drawbox and drawtext), then use it as the
background reel with a slow scale-in. No face needed.

**2. Chapter pill plus counter.** "01 / 05" in a small coloured pill in the
top corner, changing on each beat. It tells the viewer how far through they
are, which holds them to the end of a list video. Use it on any script with
a numbered list. In the brief, add it as an overlay per beat.

**3. Taped headline strip with word-by-word captions.** (chenbuildsai, the
best crafted video of the batch.) Two caption layers: a fixed headline for
the beat, on a "taped paper" strip at the top, and the spoken words one at a
time at the bottom. The top strip carries the idea, so someone watching with
the sound off still gets it. Works for faceless Content Engine lanes.

**4. Split screen, graphics over b roll.** (Joshua Stevenson.) Motion
graphics in the top half, b roll or a face in the bottom half, with a
monospace caption pill sitting on the seam. Cheap to make, and it reads as
more produced than a full-screen talking head.

**5. A planned screenshot freeze.** Hold one dense frame (a checklist, a
50-question list, a cheat sheet) still for 2 to 3 seconds, with the line
"screenshot this". It drives saves without comment bait. Put it in the
middle third, never the hook.

## Hook moves that worked

- **Proof first:** open on the finished result ("this, this and this")
  before explaining how. (Camille Adrian.)
- **Prohibition:** "Don't post anything else until you..." (Jayant). Use it
  sparingly; it wears out.
- **A real number in the first 5 seconds**, counted up slowly (Byron's rule:
  2 seconds or more). Never a number that changes between the voice, the
  caption and the screen. Nick Saraev's reel said 20k, 22k and 24k stars for
  the same repo, and someone will notice.

## Caption rule (the text under the reel)

Result first, then proof, then one ask, all before Instagram's "more" cut.

## Carousel templates (for YFS, Sited and Content Engine posts)

**Cream editorial.** (Anushka M, Start UX Design.) Off-white background, a
small coloured eyebrow (STEP 1, READ THIS TWICE), a heavy two-line headline
with a short underline, one real UI card or screenshot, and a "04 / 11"
counter in the footer. One idea per slide. It reads as expert, not hype.

**Contents slide second.** Slide 2 lists every item with a one-line promise,
which gives people a reason to keep swiping.

**"Real cost" slide.** Add up the minutes or dollars the problem costs
(Ola Conley: about 95 minutes per idea to post manually). For YFS: the hours
a tradie loses a week without a booking form.

## Moves from the 16 Oct 2026 batch

Ten posts (ranked 11, 12, 14, 27, 35, 37, 48, 50, 52 and 53 in
`Content Engine/instagram-research/2026-10-16/results.json`). Built into the
three C1 templates in `Content Engine/templates/` on 17 Oct 2026, so each move
below has a working file, not just a note.

**6. The empty list fills on the first word.** (Lincoln Devine, 8.4k likes.)
A numbered list of empty slots is on screen from frame one, and each slot
fills on the first word of its item, never on a timer. It is an open loop
the viewer can see closing. On the rail: build one PNG per list state, cut
them on word starts from `work/<slug>/words.json`, join into one background
MP4 with `background.kind: "file", reel: false`. The list sits above and
below the centre band the captions own. `templates/list-reel/build-background.mjs`
does the whole thing from a `cues` list in the brief; the longest hold on
the first run was 3.8s with 16 states on a 32s video.

**7. Same tool, two outcomes.** (Gabriel Gouvea, 2.4k likes.) Two identical
cards side by side, one labelled with the small result, one with the big
one. Here: the same five jobs priced at US$59.23 a month of paid tools
against $0. The first frame carries it muted, which is grade check 2. Both
numbers must be real and sourced; the pair is the whole claim.

**8. Mistake 0X.** (Web Pros, card 37.) A `MISTAKE / 0X` kicker, a heavy
headline with one accent word, one line, a labelled before and after pair,
one rule under a divider. The pair can be real frames (ours, through the
real pipeline) or drawn grey wireframes, never film or TV clips (card 35's
stamps are fine, its Austin Powers b-roll is not). Stamps `INCOMPLETE` and
`COMPLETED` sit in the label row, not over the thing being shown.

**9. Field guide item.** (Mahan Jafari, card 14.) Monospace job kicker,
`02 / 08` counter, a giant index number beside the tool name, one plain
line, "stands in for X at $Y a month" with the vendor's own price and the
check date on the slide, and one real screenshot taken on this PC. A slide
with no screenshot or no price source does not render.

**10. Close on an opinion question, say the search term twice.** (Muhammad
Abubakar, card 48, 1,064 comments on 5,288 likes with no gate; Alex & Max,
card 52.) The last slide or the last line asks a plain opinion question,
and where a link would go it writes or says the exact search term instead,
twice in a reel. No link, no gate, no "comment X".

**Measured on the rail, 17 Oct 2026:** `en-US-AndrewNeural` reads a script
full of tool names and one-word sentences ("One. yt-dlp pulls...") at
2.46 w/s, not the 2.94 measured on prose. Budget list scripts at about 2.5
w/s. `render-brief.mjs --narrate-only` narrates first so the background can
be cut from the real timings, and the narration is reused on the full
render while script, voice and rate are unchanged. Write `whisper cpp`, not
`whisper.cpp`: edge-tts gives the dot its own caption.

## Repurposing (from Ola Conley)

One finished clip gets exported at 9:16 (TikTok, Reels, Shorts), 4:5
(Instagram feed), 1:1 and 16:9, with captions per platform written from one
voice guide. That is a render flag pass, not a new video.

## Do not copy

- **Comment-a-keyword-for-the-link.** 15 of the 19 posts did it. It inflates
  comments, and Byron's no-automated-links rule rules it out anyway.
- **Face swapping an AI character into other creators' viral clips**
  (Sebastian Hardy). It breaks TikTok's AI labelling and unoriginal content
  rules and risks the account.
- **Five recycled trend posts a day.** It invites unoriginal content
  penalties.
