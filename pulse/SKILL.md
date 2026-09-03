---
name: pulse
description: Send Byron a phone notification through his Pulse app (icon, optional photo, tap opens the app with the item highlighted). Use whenever something finishes, breaks, needs his decision, or is worth knowing while he is away from the PC, and whenever he says "ping me", "let me know on my phone", "notify me", "send it to Pulse". Also the right channel for any scheduled or unattended job that must reach him with his devices off. Do not use for chit-chat or progress noise, one Pulse per real event.
---

# Pulse

Pulse is Byron's own notification app: a Cloudflare Worker at
`https://pulse.yourfuturesitedev.workers.dev` that stores items and pushes them
to his phone through ntfy. Tapping the notification opens the app on that item.

## Send one

```bash
python3 ~/.claude/skills/pulse/pulse.py "Title" "One or two lines of body" --kind todo --item "first thing" --item "second thing" --image https://... --link https://...
```

- `--kind` is one of `todo` (needs him), `alert` (money, outage, deadline),
  `win` (something good landed), `info` (default, plain update).
- `--item` lines render as bullets in the notification and the card. Keep to
  five or fewer.
- `--image` must be an https URL, it shows as the notification picture and in
  the card. A screenshot pushed to a pages.dev site works well.
- `--link` adds an Open button.
- `--silent` puts it in the app without buzzing the phone.

Token is read from `~/.config/pulse/token`. It is not in this repo and must
never be committed. From a cloud routine, call the API directly:

```
POST https://pulse.yourfuturesitedev.workers.dev/api/push
authorization: Bearer <token>
{"kind":"todo","title":"...","body":"...","items":["..."],"image":"https://...","link":"https://..."}
```

## Writing the message

Byron reads it on a lock screen. Title under 50 characters, says the outcome.
Body two lines at most, exact names, amounts, dates. No em dashes. Bullets carry
the list, not the body. One Pulse per event, never a stream.

## Health

`curl https://pulse.yourfuturesitedev.workers.dev/api/health` returns `{"ok":true}`.
Source and deploy notes: `Desktop\Claude\Apps\Pulse`.
