# Claude skills

My personal Claude Code skills. This folder is `~/.claude/skills` on each machine.

## Skills here

Loaded by Claude:

- `watch` — download a video, pull frames and a transcript, answer questions about it
- `website` — design system lookup: UI styles, palettes, font pairings, UX rules, motion presets

Backup only, not loaded (see `account-skills/README.md`):

- `account-skills/` — the 14 skills attached to your Claude account, including
  the two you wrote yourself, `chatgpt-photos` and `no-em-dashes`. Claude pulls
  these down on any machine you sign in to, so this copy is a safety net.

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

## Not in here

Plugin skills from the official marketplace (plugin-dev, skill-creator,
claude-security and the rest). They are a third-party repo, not yours, and
would go stale if copied. Add the marketplace on the new machine instead:

    /plugin marketplace add anthropics/claude-plugins-official
