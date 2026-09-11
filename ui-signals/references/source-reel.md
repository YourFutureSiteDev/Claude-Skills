# The source reel

Instagram reel by @designmotionhq, series "FutureVille · realization".
56 seconds, 720x1280, no speech. Byron sent it on 11 Sep 2026 as
`C:\Users\PC\Downloads\c9e6cb9f900a44edb44e287417171046.mp4` with the ask:
make a skill that uses animations like this plus more, applied whenever he
asks to animate a website or UI, but only in the places they belong.

The file is not committed here (it is their work, and this folder is a public
repo). This page is the breakdown so future sessions do not need the mp4.

## Look

Near-black background (`#0c0e12`) with a faint 40px grid. Panels one step
lighter (`#15181d`) with a 1px low-contrast border and 14px radius. Teal
accent (`#2dd4bf` region) for everything live, a pink-red for failure. Inter
style sans, one large headline per scene with the key phrase tinted accent
or danger. Small mono chips along the bottom summarise the scene's rule.
Every motion is short, ease-out, and tied to a state change; nothing loops
for decoration.

## Scenes

| t | Scene | What happens on screen | The rule it states |
|---|---|---|---|
| 0:00 | Cold open | A `brief.pdf` chip is dragged over a dead dropzone (top) and a live one (bottom): dashed teal border, teal glow behind, cloud icon becomes an arrow. | |
| 0:03 | Signal 01 · Drag feedback | "Nothing reacts." Dropzone: "Drop your file, PNG JPG PDF up to 50 MB". A `hero-banner.png 2.4 MB` chip approaches. Caption: "Users hesitate when nothing moves." | |
| 0:07 | | "It has to answer back." Border goes dashed teal, radial glow fades up, copy becomes "Release to upload" with "hero-banner.png, 2.4 MB" under it, icon becomes an up arrow. | |
| 0:13 | | Chips: 1 Border, 2 Glow, 3 Copy. Caption: "Three signals, before the drop." | A drag gets three answers before the drop. |
| 0:14 | Signal 02 · Honest progress | "A spinner hides the truth." Left card MYSTERY: red ring with "?", "Uploading…", time left ??, progress ??. Right card HONEST: `demo-recording.mp4 48 MB`, big teal 8%, thin bar. | |
| 0:18 | | Honest card at 62% with chips "7s left" and "2.4 MB/s". Bottom chips: % percent, time left, wait or walk away. Caption: "Let them decide, wait or walk away." | Show percent, time left and rate. |
| 0:22 | Signal 03 · Inline retry | "It dies at ninety percent." Upload card at 73%, then 90%. | |
| 0:25 | | Bar and percent go red at 90%. "Paused at 90%, file kept in memory". An error row grows in: warning icon, "Upload failed, Connection lost", a Retry button. Chips: connection lost, file kept loaded. Caption: "Never make them start over." | |
| 0:28 | | After Retry: bar teal again at 94%, "Resuming from 90%…". Third chip: one tap resumes. | Fail in place, keep the file, resume from where it stopped. |
| 0:31 | Signal 04 · Upload preview | "A filename is not feedback." TEXT ONLY: "✓ IMG_4032.jpg uploaded" in mono. | |
| 0:32 | | PREVIEW card grows in: filename, then a drawn tick "Uploaded just now". | |
| 0:34 | | Thumbnail fills in (teal gradient, image icon, "4032 × 3024" badge), JPG chip. Bottom: Thumbnail · Type · Size · Proof, each lighting as it appears. | |
| 0:36 | | "2.4 MB" size appears, then Replace and Remove buttons. All four bottom words lit. | Thumbnail, type, size, proof, then the next two actions. |
| 0:39 | Signal 05 · Independent queue | "Every file, its own lane." "Uploading 5 files", "0 of 5 done". Five rows: brief.pdf 20%, hero-banner.png 9%, demo-recording.mp4 17%, invoice-2026.pdf 37%, avatar-photo.jpg 6%. | |
| 0:45 | | "4 of 5 done". Four rows show teal ticks; the 48 MB video is still at 82%. Caption: "One failure never blocks the others." | One bar per item, one counter for the batch. |
| 0:48 | Outro | Three done chips stack, "Follow for more UX engineering. Save this for your next upload flow." Save button with a teal glow. | |
| 0:52 | | Fade to the handle. | |

## What the skill took from it

- The five signals, as 01 to 05 in the catalogue, with the same names for
  their states (over, uploading, error, done).
- The rule that motion is a state answer, never decoration, which became the
  placement rule in `SKILL.md`.
- The headline treatment (one tinted phrase after the line settles) as 15.
- The chip row that lights up as each point lands, as 14.
- The values: 150ms for state colour and copy, 220ms for things entering,
  linear for the bar, glow behind exactly one live element.
