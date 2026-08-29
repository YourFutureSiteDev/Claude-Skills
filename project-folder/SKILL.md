---
name: project-folder
description: Decide where new work lives on disk and set the folder up. Use this at the START of anything that will produce files, before writing the first one, whenever the work does not already have a home folder. Triggers on "start a new project", "let's build X", "I want to make X", "can you knock up a X", "new client", "help me with X" where X is new, and on any request that will save a file when it is not obvious which existing folder it belongs in. Also use when a one-off in Random has grown into real work and needs promoting to its own folder.
---

# Where new work goes

Two destinations, and picking wrong costs real work. A one-off dumped into its
own folder leaves a graveyard of half-finished directories. A real project
dumped into Random loses its notes the first time somebody tidies up.

Ask the question **before saving the first file**, not after. Retrofitting a
folder means chasing files across Downloads and scratch directories, which is
exactly the mess this exists to prevent.

## Step 1: is it a project or a one-off?

**It is a project if any of these is true:**

* It will be picked up again in a later session.
* It has a client, a customer, or somebody else waiting on it.
* It will produce more than about three files, or any file that gets revised.
* It needs its own state: a queue, a resume note, a list of what is done.
* Byron calls it a project, a client, or names it.

**It is a one-off if all of these are true:** it is answered and finished in this
session, nobody else is waiting, and nothing in it will be edited again. A
throwaway script, one generated image, a quick comparison, a test page, a
converted file.

**If it is genuinely unclear, ask.** One short question beats either failure
mode. Do not guess from enthusiasm; a lot of one-offs are described excitedly.

## Step 2a: one-off goes in Random

`C:\Users\PC\OneDrive\Desktop\Claude\Random`

Name the file `YYYYMMDD-what-it-is.ext`. The date is what makes Random
survivable, because in three months the name is the only thing distinguishing
one throwaway HTML file from another.

No subfolder unless the one-off is several files that only make sense together,
in which case one folder named `YYYYMMDD-what-it-is`.

Random is disposable by design. Nothing in it is backed up in any meaningful
sense and nothing should be the only copy of anything that matters. If something
in Random turns out to matter, that is Step 3.

## Step 2b: project gets its own folder

Default location: `C:\Users\PC\OneDrive\Desktop\Claude\<Project Name>`

Use the name Byron uses, in the capitalisation he uses. The existing four are
`YourFutureSite`, `Fineline`, `Perform By Paige`, `LSPDFR`.

**The size exception.** That Desktop is OneDrive backed. If the project will
hold more than roughly a gigabyte, or is mostly binaries that are
re-downloadable (game assets, mod archives, model weights, build trees, video
source), put it at `C:\<projectname>` on the local disk instead and say why in
its CLAUDE.md. `C:\LSPDFR` is the worked example: 5.3 GB that would have blown
the OneDrive quota. Code with a virtualenv also belongs on a short local path,
because venvs record absolute paths and long paths with spaces break tooling.
`C:\fl` is that example.

Then create these:

1. **`CLAUDE.md`** at the folder root, from the template below. This is the file
   that makes the folder self-explaining to a future session.
2. **`RESUME_HERE.md`** if the work will span sessions. Live state: what is done,
   what is next, what is parked and why. Write into it as work lands, not at the
   end, so a fresh chat continues without re-explaining.
3. **Subfolders only once you know what they are.** An empty `assets/` folder
   created out of habit is noise. Add each one the first time something needs it.

Finally, **write a memory** for the project: type `project`, describing what it
is and where it lives, and add its one-line pointer to `MEMORY.md`. Link it to
[[project-file-routing]], which is the standing rule this skill implements.

### CLAUDE.md template

```markdown
# <Project Name>: where files go

<One or two sentences: what this project is, and anything about it that a
future session would otherwise get wrong.>

| Folder | Contents |
|---|---|
| `<folder>/` | <what belongs here> |

<If any part of the project lives outside this folder, a table saying where and
why it cannot move. Be specific about what breaks, or somebody will "tidy" it.>

## The landing rule

Anything produced or downloaded for this project moves into this folder in the
same session it is made. Not Downloads, not a scratch directory.

<Any hard rule specific to this project: never publish, never quote above X,
never touch Y without asking.>
```

Keep it short. A CLAUDE.md nobody reads is worse than none, because it looks
like the question was answered.

## Step 3: promoting a one-off

When something in Random gets a second session, a client, or a revision, it has
stopped being a one-off. Move it into a real project folder that same session
and run Step 2b properly. Do not leave it in Random with a note.

Going the other way is fine too. If a project folder turns out to have been a
one-off, collapse it into Random rather than keeping an empty directory.

## What not to do

* Do not create the folder speculatively while still discussing the idea. Wait
  until there is a file to put in it.
* Do not put a project inside another project's folder to save a decision.
* Do not save into `C:\Users\PC\Downloads` or a scratch directory and plan to
  move it later. Scratch directories are wiped between sessions and Downloads is
  where the last cleanup found a client's only mockup.
