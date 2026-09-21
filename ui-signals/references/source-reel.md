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


# The second and third reels (20 Sep 2026)

Both sent by Byron on 20 Sep 2026 in a batch of seven videos with the ask
"make sure the videos become useful". Neither mp4 is committed here.

## Destructive actions, @designmotionhq

`ca1106cfbd324a99813e8ef5fe1f337a.mp4`, 59 seconds, same FutureVille look
as the first reel. Six patterns, spoken and captioned:

1. Hold to delete: "release early, nothing dies. The ring is the
   confirmation. 300 milliseconds of commitment replace a dialogue."
2. Labels: "Are you sure? Yes. Nobody reads that. Name the action: Delete
   project, Keep project. The verb is the warning." Shown with a "clicked
   in 0.4s, read nothing" tag on the Yes button.
3. Off the happy path: "Destructive buttons never sit where confirm lives.
   Muscle memory clicks primary spots blind."
4. The red budget: "Red is a budget, spend it on destruction only. A red
   log out button cries wolf, then delete looks routine."
5. Danger zone: "GitHub buries deletion in a danger zone. Bordered,
   labelled, last position on the page. Geography is friction."
6. Cooldown: "Deletion scheduled, 14 days to cancel. Time is the last line
   of defence." Shown as an account card with 14 day boxes and a full-width
   Cancel deletion button.

Closing card: "Danger is a design language. Save this before you ship a
delete button." Became signal 21, `danger-confirm`, and the two red-budget
lines in Done means.

## Empty states, Katherine Gilligan

instagram.com/reel/DY5PkUjyhMv, 69 seconds, part 8 of her "Building With
Good UX" series, talking head plus phone mockups. The argument: the empty
state is often the first thing a user sees, so make it a good impression.

- First-run dashboard: "You have no projects" leaves the user with no
  action. Add "Create your first project" with a button, then a
  step-by-step gamified checklist to get them started.
- Every section with no content yet: say what the section is for and how
  to start using it, never leave it blank.
- Empty search: "No results" is okay, but "No results for purple shoes.
  What about purple shoes?" with a link to that search keeps the user
  moving.
- When empty is the goal (inbox zero): make it feel like an achievement,
  add a nice animation, a background they look forward to seeing.
- Summary: "A good empty state tells a user why it's empty, shows them
  what to do next, and doesn't feel broken."

Became signal 22, `empty-state`. Her next video is on partial states.

## Login and sign-up blade, Code & Chill

instagram.com/reel/Db7fSM1v8Yg (@_code_and_chill_, 5 seconds, 5K likes,
sent by Byron 21 Sep 2026). A cream auth card with a deep green raked band
on its right, "VERSO, Welcome back." in serif with a gold italic. Click
"Create an account": the band slides left, covers the card, and the
sign-up form is on the left-hand side when it clears, with "Start the
first page." now showing on the band. Three code panes under the card:

- `index.html`: `.auth__band` ("one blade, two lit seams") holding
  `.band__edge--lead`, then `.band__inner` ("its transform, backwards")
  and `.band__page` ("back in card co-ordinates") with the welcome title.
- `app.css`: `.auth__band { overflow: hidden; transform: skewX(var(--rake))
  translateX(var(--sweep)); }` and `.band__inner { transform:
  translateX(calc(-1 * var(--sweep))) skewX(calc(-1 * var(--rake))); }`.
- `app.js`: set `auth.dataset.mode`, add `is-on` to the next pane, then
  after `T.cover` flip `inert` on the two panes: "the blade covers the card
  for a fifth of its travel, and the two states trade places under that
  dark".

Caption: "Login to Sign up, without a single fade. One rectangle. One
translateX. Sign up is just sign in mirrored, so the blade never has to
rotate: it travels one way and covers the card completely halfway across.
That dark is where the two states trade places. Real forms underneath.
Zero dependencies. Transform and opacity only."

Became signal 23, `auth-sweep`. The Verso name, copy and palette stay in
the demo only; a client site sets its own tokens.
