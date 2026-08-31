---
name: verify-loop
description: Add a written grading standard to a skill so the agent marks its own work before handing it back, and run a task on a loop until it passes that standard. Use when a skill keeps returning work that is not up to standard, when the user says "it keeps getting this wrong", "make it check its own work", "add a verification loop", "grade itself", "don't hand it back until it's right", or when writing or editing any skill that produces a deliverable. Also use when retrofitting existing skills that have instructions for doing the job but none for checking it.
---

# Verification loops

Most skills tell an agent how to do the job. Almost none tell it how to know
the job is done. That gap is why work comes back at 80% and you have to point
out the same five things every time.

The fix is not a better prompt. It is a written standard, in the skill file,
next to the instructions, that the agent grades itself against before it hands
anything back.

## The rule

**Every skill that produces a deliverable carries a "Done means" section.**

Not "check your work carefully". That does nothing. It has to be the actual
list you run through in your head when you look at the output and decide
whether to accept it.

If you cannot write that list down, the skill is not ready to be written yet.
Go and do the task by hand once, notice what you reject, and write that.

## Writing the standard

A good "Done means" section has three properties.

**Checkable, not aspirational.** "The copy is compelling" cannot be graded.
"Every heading names a specific benefit, not a category" can. Each line should
be something a reader can answer yes or no to while looking at the output.

**Specific to this skill.** Generic quality advice belongs nowhere. If the same
checklist would fit any skill, it is too vague to catch anything.

**Written as failures, where you can.** The things that actually go wrong are
more useful than the things that should go right. "No placeholder text left in
the file" catches more than "the content is complete."

Aim for five to twelve lines. Under five and you have not thought about it.
Over twelve and the agent starts skimming.

## The shape

Put this at the end of the skill, after the instructions:

```markdown
## Done means

Before handing this back, check every line. If any fails, fix it and check
again. Do not report the work as finished until all of them pass.

- [ ] <the thing that goes wrong most often, phrased as the passing state>
- [ ] <the second thing>
- [ ] ...

If a line cannot be checked without the user, say which one and why, rather
than assuming it passes.
```

That last sentence matters. Without it an agent will quietly mark an
uncheckable line as passed. With it you get told.

## Running the loop

Writing the standard is half of it. The other half is actually looping.

**In a session:** after giving the task, say "run this against the Done means
section and fix anything that fails, then tell me the result of each line."
The agent produces, grades, fixes, and reports. You read the report instead of
the whole deliverable.

**Unattended (cron, VPS, background runs):** the loop has to be in the skill
itself, because nobody is there to ask for it. Write the instruction into the
skill: *"Produce the deliverable. Then grade it against Done means. Fix every
failure and re-grade. Repeat at most three times. If a line still fails on the
third pass, stop and report which line and why."*

The cap matters. Without it a wrong standard produces an infinite loop that
burns tokens all night.

## When the output is still bad

If the work fails after passing its own check, **the standard is wrong, not the
prompt.** Something you reject is not written down.

Find the thing you rejected. Add it as a line. That is the whole maintenance
loop, and it is why this compounds: every time a skill disappoints you, it
gets one line better and never makes that mistake again.

Resist rewriting the instructions instead. Instructions tell it what to aim
at; the standard tells it when it has arrived. Fixing the wrong half is the
most common mistake here.

## Retrofitting existing skills

To add loops to skills that already exist:

1. List the skills that produce a deliverable. Skills that only look things up
   or route to other skills do not need this.
2. For each one, ask the user: "what do you check when you look at the output
   of this skill, and what have you had to send back?" Their answer is the
   standard. Do not invent it for them.
3. Write the "Done means" section from their answer, in their words.
4. Add the unattended loop instruction if the skill ever runs on a schedule.

Do them one at a time and confirm each with the user. A standard invented by
the agent is worth nothing, because the whole point is that it encodes what
*this user* rejects.

## What this is not

It is not tests, linting, or a build step. Those check that code runs. This
checks that a deliverable is good, which no test can do.

It is not a review by a second agent either. That has its place, but it costs
another full pass and it does not accumulate — the second agent starts from
nothing every time. A written standard gets better every time it fails.

## Done means

Before handing back a skill you have added a loop to:

- [ ] The "Done means" section is at the end of the skill file, after the instructions
- [ ] Every line can be answered yes or no by looking at the output
- [ ] No line is generic enough to fit a different skill
- [ ] The standard came from what the user actually rejects, not from your guess
- [ ] There are between five and twelve lines
- [ ] If the skill runs unattended, the loop instruction and its retry cap are written in
- [ ] The instruction to report uncheckable lines rather than assume them is present
- [ ] You have not silently rewritten the skill's existing instructions while adding this
