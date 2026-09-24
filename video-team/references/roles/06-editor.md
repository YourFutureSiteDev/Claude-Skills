# Role 6 — Editor

**Produces:** the MP4.

Assembles `brief.json` and runs the renderer. Exact flags, field list and failure
modes are in `../render-rail.md`.

---

## The decisions that belong here

**Caption font.** Leave the renderer's default unless the project has a brand
font. A client-facing video uses the client's.

**Hashtags.** They render at 44px, slightly transparent, above the app's own
bottom UI, for the whole video. Three, relevant, or omit the field. A stack of
fifteen reads as automated, which is the one thing these accounts cannot afford
to look like.

**End card.** Worth it whenever there is an actual next step. The renderer takes
exactly `{ title, year }`: title large, year smaller beneath it. For a non-film
short, title is the handle and year is the supporting line. `holdSecs` defaults
to 2.0, long enough to read a handle and short enough not to bleed retention.

Remember role 3's rule: the end card is the withdrawal, and it comes last.

## Run it

```bash
node "C:/Users/PC/.claude/skills/video-team/scripts/render-brief.mjs" --brief "<project>/brief.json"
```

It prints one JSON line: output path, duration, word count, voice. Intermediate
files stay in `work/<slug>/`, so a re-render after a hook change reuses the
download and the reel instead of fetching them again. That is what makes role
2's "tiny tweaks compound" rule affordable here: a second hook is close to free.

## Then grade it

Run `../grade.md` against the finished file. Do not skip it because the render
succeeded: ffmpeg exiting 0 means a file exists, not that the video is good.

The grade's checks map back to the roles, so a failure names who redoes what. A
packaging failure is a first-line rewrite and a cheap re-render. An angle failure
is not fixable at the render stage and the claim has to come out.

## Send him the file

Byron judges visual work by eye in seconds. Send the MP4, not a description of
it. A written summary of a video he cannot watch is worth nothing to him, and it
is the last line of the Done means for that reason.
