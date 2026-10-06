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
