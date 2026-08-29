# Claude skills

My personal Claude Code skills. This folder is `~/.claude/skills` on each machine.

## Skills here

- `watch` — download a video, pull frames and a transcript, answer questions about it
- `website` — design system lookup: UI styles, palettes, font pairings, UX rules, motion presets

## Set up on a new machine

Clone straight into the skills path.

macOS / Linux:

    git clone git@github.com:USER/REPO.git ~/.claude/skills

Windows:

    git clone git@github.com:USER/REPO.git %USERPROFILE%\.claude\skills

If that folder already exists and has files in it, clone elsewhere and move the
skill folders across by hand, then point the repo at the real location.

The `watch` skill needs `yt-dlp` and `ffmpeg` on PATH. Run `scripts/setup.py`
inside it after cloning.

## Keeping both machines in step

This is a manual sync. After adding or editing a skill:

    cd ~/.claude/skills && git add -A && git commit -m "what changed" && git push

On the other machine:

    cd ~/.claude/skills && git pull

## Not in here

The `anthropic-skills:*` skills come from the official plugin marketplace, not
from this folder. Add the marketplace on the new machine and they show up.
