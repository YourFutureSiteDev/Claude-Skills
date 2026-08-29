# Claude skills

My personal Claude Code skills. This folder is `~/.claude/skills` on each machine.

## Skills here

**Business**

- `your-future-site` — Your Future Site job runner: quotes, builds, delivery
- `client-portal` — one client's branded Square payment page
- `discord-bot` — the Your Future Site Discord bot and server
- `lead-research-assistant` — find and qualify leads for a product or service

**Design and build**

- `ui-ux-pro-max` — design system lookup: UI styles, palettes, font pairings, UX rules, motion presets
- `hallmark` — anti-slop design: greenfield pages, audits, redesigns, extraction from a URL
- `scroll-world` — scroll-scrubbed fly-through landing pages (MIT, cyw)
- `framer` — design, edit and publish Framer sites
- `framer-code-components` — Framer code component authoring rules

**Writing and comms**

- `stop-slop` — strip AI writing patterns out of prose (MIT, Hardik Pandya)
- `caveman` — ultra-compressed replies, cuts output tokens

**Knowledge and memory**

- `graphify` — turn any input into a queryable knowledge graph
- `mempalace` — mine projects and conversations into a searchable memory palace
- `mempalace-recall` — search the palace before answering about past work
- `session-retro` — mine a finished session for corrections, write permanent fixes

**Workflow**

- `project-folder` — decide where new work lives on disk and set it up
- `watch` — download a video, pull frames and a transcript, answer questions about it

**Account skills**

`account-skills/` mirrors the skills that come with the account rather than this
folder. They are kept here for reference. They are one level down on purpose so
Claude does not load them twice.

## Set up on a new machine

Clone straight into the skills path.

macOS / Linux:

    git clone git@github.com:YourFutureSiteDev/Claude-Skills.git ~/.claude/skills

Windows:

    git clone git@github.com:YourFutureSiteDev/Claude-Skills.git %USERPROFILE%\.claude\skills

If that folder already exists and has files in it, clone elsewhere and move the
skill folders across by hand, then point the repo at the real location.

The `watch` skill needs `yt-dlp` and `ffmpeg` on PATH. Run `scripts/setup.py`
inside it after cloning.

## Keeping both machines in step

This is a manual sync. After adding or editing a skill:

    cd ~/.claude/skills && git add -A && git commit -m "what changed" && git push

On the other machine:

    cd ~/.claude/skills && git pull

## Notes

`scroll-world` and `stop-slop` are third-party MIT skills. Their LICENSE files
travel with them.
