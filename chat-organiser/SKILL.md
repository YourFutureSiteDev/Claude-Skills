---
name: chat-organiser
description: Keeps Byron's Claude desktop Code sidebar tidy. Use at the start of every new desktop Code session (a SessionStart hook reminds you) to give the chat a short plain title, file it into the right sidebar group, and tell Byron which group. Also use when he asks to rename, organise, group or tidy his chats, and for the weekly clean up that archives chats unused for 30 days.
---

# Chat organiser

Byron wants every chat in the Claude desktop app named clearly and filed into a sidebar group the moment it starts, and old chats archived every week. This skill is the one place those rules live.

## When it applies

Only inside the Claude desktop app, where the `mcp__ccd_session_mgmt__*` and `mcp__ccd_sidebar__*` tools exist. Skip it silently, saying nothing, when:

- those tools are not available (the terminal CLI, a subagent, Claude Local or any other host);
- the session is a scheduled routine run (`get_session` with `"self"` shows a scheduled task link). The app files routine runs under their routine and refuses to group them;
- the session already has a group and a title Byron set himself.

## New chat: do this in your first reply

Do the real work first. Organising must never delay or replace the answer.

1. **Title.** Two to five plain words that say what the chat is for, like "Herd bot not trading", "DT poster layout" or "Client reply for Toned". Fix spelling. No dates, no quotes, no filler like "Help with". Rename with `mcp__ccd_session_mgmt__set_session_title` and `session_id: "self"`.
2. **Group.** Call `mcp__ccd_sidebar__list_groups` and pick the existing group that fits best, using the guide below. Prefer an existing group over making a near duplicate. File it with `mcp__ccd_sidebar__move_sessions`, `session_ids: ["self"]`.
3. **Nothing fits.** Create one short group (one to three words, named after the project, in Byron's style) with `mcp__ccd_sidebar__create_group`, then move the chat into it.
4. **Tell Byron** in one line at the very end of the reply:
   `Filed as **<title>** in **<group>**.` Add `(new group)` when you created it.
5. If the first message is too vague to name (just "hi"), wait and do it on the first reply where the topic is clear.

If Byron later says a chat belongs somewhere else, move it and use that choice for similar chats from then on.

## Group guide

Groups change, so always read `list_groups` first. As of 27 Sep 2026 his groups mean:

| Group | What goes in it |
|---|---|
| Websites | Your Future Site, client websites and mockups, the yourfuturesite.com.au site and journal, outreach and messaging bots for the web business |
| Console/VPS | The console dashboard, the VPS droplet, the C-suite desks, email and text sending bots |
| TikTok + Instagram Plan | Clipping, TikTok and Instagram, Whop campaigns and submissions |
| Trading Bots | Crude, Tide, Herd, the bot dashboard |
| Claude/PC Improvements | Mac fixes, Claude and Claude Code setup, skills, small Mac apps, the Obsidian brain, the Windows PC |
| Study App | The Year 11 study deck, the Prelim Tutor app, Canvas |
| Whoop App | WhoopDeck, Vitals |
| Everything AI | The Everything AI venture |
| Roblox | The Roblox game |
| Fineline | The Fineline stock system client |

Empty groups he made himself and may want used: Hybrid Rp, EnList, Conway, Golf Buggy Care, SideHussle, VPS/Dashbaord.

Do not recreate groups he has deleted (School, Personal, Scroll World, Websites For Tebex were removed on 27 Sep 2026). If a chat is about school work, use Study App.

## Weekly clean up

The app always asks before archiving inside a scheduled routine, even in bypass mode, so this does not run on a schedule (the `chat-archive-weekly` task is switched off). Instead the SessionStart hook (`~/.claude/hooks/chat-organiser-start.sh`) checks `~/.claude/chat-organiser-last-cleanup`. When a week has passed, it asks the first new chat to do the clean up in its first reply and then write the stamp with `date +%s > ~/.claude/chat-organiser-last-cleanup`. Byron's own sessions run in bypass mode, so the archives go through without prompts. Byron can also just ask for it.

1. `mcp__ccd_session_mgmt__list_sessions` with a high limit (200).
2. Archive, with `mcp__ccd_session_mgmt__archive_session`, every session whose `lastActivityAt` is more than 30 days ago, except ones that are pinned, running, or the current session. Give the reason "Unused for 30 days (weekly clean up)".
3. Never delete anything and never delete groups. Archiving is reversible from the Archived list.
4. Finish with a short report: how many were archived and their titles, grouped by sidebar group. If none qualified, say so in one line.
