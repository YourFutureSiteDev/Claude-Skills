# The six roles

Read this before running the chain. The table in SKILL.md is the map; this is the
actual work each role does.

A note on where these come from. Three of the roles apply frameworks that are
publicly associated with particular creators, and they are credited here because
knowing the source makes the rule easier to apply well. They are techniques
discussed openly in interviews and teardowns, not anyone's private method, and
they are written here as rules. **Never prompt a model to "be" a named person.**
It produces an impression of a personality instead of the discipline that made
the personality work, and it is the wrong thing to do to a real person besides.

---

## Role 1 — Angle

**Produces:** `angle`, one sentence.

Byron arrives with a topic. A topic is not a video. "AI agents" is a topic;
"I gave six AI agents one idea and they made the whole video without me" is an
angle. The job is to find the version of the topic that has a reason to exist.

The test, borrowed from how MrBeast talks about premise selection: **a stranger
who hears it once can repeat it accurately.** If repeating it needs a preamble,
it is not ready. That test is doing real work — it filters out angles that are
only interesting if you already care about the subject, which is the default
state of anything written by the person who built the thing.

Three angles worth reaching for, in order of how well they hold:

1. **A number that shouldn't be possible.** Six agents, one idea, zero edits.
2. **A result with a visible before and after.** The thing changed, on screen.
3. **A specific stranger's problem.** Not "how to do X" but "what happens when
   you try X and it breaks".

Reject: anything whose angle is "here is a tool that exists". A tool existing is
not a thing happening.

**Handoff:** one sentence, plus one line on why this angle over the others
considered. The why matters because role 2 needs to know what the promise is
before it can write a hook that keeps it.

---

## Role 2 — Packaging

**Produces:** `hooks[]`, five of them, ranked, and the first frame.

This is the role that decides whether anything else gets seen. The framework is
the one Paddy Galloway argues for in his packaging teardowns: **the click is the
product.** The video cannot outperform its own hook, so the hook gets the same
effort as the content.

Write five. Not one, five, because the first hook anyone writes is the literal
description of the video and that is almost never the best one. Vary the shape:

| Shape | Example |
|---|---|
| Stated stakes | "I gave six AI agents one idea and deleted my editor." |
| Open loop | "The fifth agent is the one nobody builds. It's also the only one that matters." |
| Contradiction | "The best AI video tool is six worse ones." |
| Blunt result | "One sentence in. Finished video out. No edits." |
| Direct address | "If your AI videos look like everyone else's, you're using one model for six jobs." |

Then apply three gates, in this order:

1. **The sound-off test.** Most of the feed is muted. The top hook has to work as
   the first frame's text. If it only lands when spoken, it is a script line, not
   a hook.
2. **The one-second test.** Read only the first second aloud. If the interesting
   word has not arrived yet, move it forward. "In this video I want to show you
   how I built..." spends its whole second on nothing.
3. **The promise-keeping test.** Does the video actually deliver this? A hook the
   content does not pay off is the fastest way to train the algorithm that people
   leave.

**Handoff:** all five, with the winner marked and one line on why. Keep the four
rejects in the brief. On a re-run, they stop the chain circling back to a hook
that was already dismissed.

---

## Role 3 — Story

**Produces:** `beats[]` and the `words` budget.

Two jobs, and the second one is the one people skip.

**The beats.** The structure that holds attention is the one Ryan Trahan uses in
practice: every beat **changes the situation**. Not "then I explain the second
agent" — that is a list, and a list has no reason to continue past the first
item. "The second agent rewrote the first one's idea and made it worse" is a
beat, because the state is different afterwards.

Test each beat by asking what is true after it that was not true before. If the
answer is "the viewer knows one more fact", it is a list item. Merge it into a
real beat or cut it.

A 30-second short holds a hook, three beats and a payoff. That is all. The
instinct to fit five beats in is how a video ends up rushing the payoff, which is
the part that earns the follow.

**The word budget.** Set it now, before a word of script exists, from the target
length:

| Target | Words at `+8%` | Shape |
|---|---|---|
| 15s | 45-50 | hook + one beat + payoff |
| 30s | 90-100 | hook + three beats + payoff |
| 45s | 135-150 | hook + three beats + turn + payoff |
| 60s | 180-200 | ceiling |

Divide the budget across the beats and write the number next to each one. Role 4
writes to those numbers. This is the whole reason the chain works: the script
cannot overrun the footage if it was never allowed to.

**Handoff:** the beats with a word count each, summing to the budget.

---

## Role 4 — Script

**Produces:** `script`, word for word, and nothing else.

Written to be **spoken by edge-tts and read as burned captions at the same
time.** That double duty sets the constraints:

- **Short sentences.** The captions appear word by word. A 40-word sentence has
  no punctuation rhythm on screen and turns into a wall.
- **No parentheses, no em dashes, no "i.e.".** TTS reads punctuation as pauses
  in places you did not intend. Commas and full stops only. (This matches
  Byron's standing no-dashes rule anyway.)
- **Numbers as words when they are spoken as words.** "six agents" not "6
  agents", because the caption should match what is heard.
- **No stage directions in the script field.** Those go in `shots[]`. Anything in
  `script` gets spoken out loud, including the word "cut to".
- **The winning hook is the first line, verbatim.** Do not improve it here. It
  was already tested; rewriting it at the script stage is how the tested version
  gets lost.

Then **count the words.** Within 5% of budget or it goes back. A quick check:

```bash
node -e "const s=require('fs').readFileSync(process.argv[1],'utf8');console.log(s.trim().split(/\s+/).length+' words, ~'+(s.trim().split(/\s+/).length/3.1).toFixed(1)+'s')" script.txt
```

**Handoff:** the script, its word count, and the predicted duration.

---

## Role 5 — Producer

**Produces:** `shots[]` and the chosen `background`.

Decides what is on screen for every second, and where it comes from. The
constraint that keeps this honest: **every shot names a real source before the
render starts.** A shot list with "b-roll of a city" in it is a shot list with a
hole in it, and the hole gets found at render time.

Walk the background ladder in SKILL.md step 3 and stop at the first option that
fits. Most shorts on this rail use option 1 or 2 and never need a generated
frame.

Two things worth getting right:

- **Shot length against cut rate.** `buildShotReel` defaults to 2.4-second cuts.
  Faster than about 1.5s reads as frantic on a phone; slower than about 4s reads
  as a screensaver. Leave the default unless there is a reason.
- **Where the captions sit.** The renderer burns them centred. Footage with its
  own on-screen text at the centre will collide. Either pick different footage or
  set `trimBottom` to crop the source's subtitle band off first.

If a shot genuinely has to be invented, hand that one shot to the `generate`
skill with a described frame. It quotes the price and waits. Do not batch four
"while we're here" renders into one ask; that is how a free video becomes a paid
one.

**Handoff:** `shots[]` with a source against each, and `background` filled in.

---

## Role 6 — Editor

**Produces:** the MP4.

Assembles `brief.json` and runs the renderer. Exact flags and the field list are
in `render-rail.md`.

The decisions that belong here:

- **Caption font.** Leave the renderer's default unless the project has a brand
  font. A client-facing video uses the client's.
- **Hashtags.** They render as a line under the captions. Three, relevant, or
  omit the field. A stack of fifteen reads as automated, which is the one thing
  these accounts cannot afford to look like.
- **End card.** Worth it when there is an actual next step. `holdSecs` defaults
  to 2.0, which is long enough to read a handle and short enough not to bleed
  retention.

Then grade it against `grade.md`. Do not skip this because the render succeeded.
ffmpeg exiting 0 means a file exists, not that the video is good.
