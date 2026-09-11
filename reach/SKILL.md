---
name: reach
description: Reach Byron on his phone through Offsider (his Everything AI). One call lands a message in the Offsider app, buzzes his phone with a notification, and for todo and alert kinds falls back to a text from the Your Future Site number only when the push cannot land. Use whenever something finishes, breaks, needs his decision, or is worth knowing while he is away from the PC, and whenever he says "ping me", "text me", "let me know on my phone", "notify me". Also the channel for scheduled or unattended jobs that must reach him with his devices off. One reach per real event, never a stream.
---

# Reach

Offsider runs on the VPS at `https://168-144-164-0.sslip.io:8766`. Its
`/api/reach` endpoint takes a bearer token and does three things at once:
stores a message on the Calls page of Byron's account, sends a Web Push to
every phone he has switched on under "Reach me", and texts him from
+61 468 053 175 through GoHighLevel only as the backup: for `todo` and `alert`
kinds when no push got through (no phone switched on, or Apple refused it), or
whenever `--text` is passed. Push and text never both land for one call, that
was the double message he kept getting until 11 Sep 2026. Texts cost money, so
do not force one for chit-chat.

## Send one

```bash
python3 ~/.claude/skills/reach/reach.py "Title" "One or two lines" --kind todo --item "first thing" --item "second thing" --link https://... --image https://...
```

- `--kind` is `todo` (needs him, texts if the push fails), `alert` (money, outage,
  deadline, urgent push, texts if the push fails), `win` (something good landed, push only), `info` (default,
  push only).
- `--item` lines become bullets in the message, the notification and the text.
- `--link` gives the message an Open button and the notification an Open action.
- `--image` (https) shows in the app card and the phone notification.
- `--text` forces a text, `--no-text` suppresses one, `--no-push` skips phones.

The token is read from `~/.config/reach/token` and the URL from
`~/.config/reach/url`. Neither is in this repo. On the server the same token
sits in `~/.local/share/offsider/reach.json`, owned by byron, mode 600.

From a cloud routine, call the API directly:

```
POST https://168-144-164-0.sslip.io:8766/api/reach
Authorization: Bearer <token>
{"kind":"todo","title":"...","body":"...","items":["..."],"link":"https://...","text":true}
```

## Writing it

Byron reads it on a lock screen. Title under 50 characters that says the
outcome. Body two lines at most, exact names, amounts, dates. No em dashes.
Bullets carry the list. Australian spelling.

## Source

`C:\EverythingAI\app\reach.py`, routes in `server.py`, worker `static/sw.js`,
the page in `static/app.js` (`pReach`). Checks in `doctor.py`
(`reaching_them`). Deploy with `bash deploy.sh` from `C:\EverythingAI`.
