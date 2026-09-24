---
name: generate
description: Generate images and video (product ads, hero shots, social clips, mockup photos, b-roll) by routing the job to the cheapest backend that can actually do it, writing the prompt, and logging every render to a searchable ledger so prompts get reused instead of rewritten. Use whenever Byron asks for an image, a photo, a product shot, a render, a video, a clip, an ad, b-roll, a mockup image, a hero image or a thumbnail, and whenever a build needs a picture and there is no real photo for it. Also use when he asks what a render will cost, or to find a render he made before. Never spends credits without showing the price first and getting a yes.
---

# Generate

One entry point for every image and video render, with three jobs:

1. **Route to the cheapest backend that can do the job.** Three backends are
   wired up and they differ by roughly 100x in cost. Picking by habit instead
   of by job is how a $2 clip becomes a $40 clip.
2. **Write the prompt.** Byron describes the shot in a sentence. This writes the
   real prompt. See `references/prompting.md`.
3. **Log it.** Every render goes in the ledger with its prompt, model, cost and
   file path, so the next version of a shot starts from the prompt that worked.

**The money rule.** Byron's standing rule is no spend before a sale. Free
backends first, every time. A paid render needs a stated price and an explicit
yes before the call. Never chain paid renders "to get a better one".

---

## Step 1 — pick the backend

Work down this ladder. Stop at the first one that can do the job.

| # | Backend | Cost | Does | Catch |
|---|---------|------|------|-------|
| 1 | **WanGP** local, `C:\Wan2GP-src` | **Free** | Video and images on the 3060 Ti | PC must be on, MCP must be running, slow (minutes per clip) |
| 2 | **chatgpt-photos** skill | Free-ish | Stills only | Uses his limited ChatGPT image credits, manual paste step |
| 3 | **Everygen** MCP | **Paid credits** | Images, video, voiceover, captions, full ads | Balance was **0** as of 24 Sep 2026. Check before quoting. |

**Default for a still:** try chatgpt-photos unless he needs many variants, an
exact aspect ratio, or reference-image editing. Those need Everygen.

**Default for a clip:** WanGP if it is running or he is happy to start it.
Everygen only when he wants it now and has said yes to the price.

### Starting WanGP

The MCP is configured but only answers when the server is up. If
`mcp__wangp__*` tools are missing or refuse to connect, the server is not
running. Ask Byron to run:

```
C:\Wan2GP-src\Start WanGP MCP (for Claude).bat
```

Leave that window open. It serves `http://127.0.0.1:7866/mcp`. Never kill it
mid-session. Do not start it silently in the background; it is a GPU job on his
gaming machine and he should know it is running.

---

## Step 2 — pick the model (Everygen only)

Only relevant once he has approved paid spend. Full table with every price in
`references/models.md`. The short version:

**Images.** Default to **Nano Banana 2** (`gemini-3.1-flash-image-preview`),
2 credits, takes up to 14 reference images. Drop to **Nano Banana 2 Lite**
(1 credit) for throwaway drafts and placeholders. Go to **Nano Banana Pro**
(3 credits) only for a hero shot that ships to a client. The GPT Image models
cost 4 credits at every resolution and only take 4 references, so they are the
wrong default; reach for them only when Nano Banana refuses a specific edit.

**Video.** Default to **Kling 2.5 Turbo** (4 credits for 5s at 720p) or
**Seedance 2 Mini** (3 credits for 4s at 480p). These are the honest workhorses.

Know what you are avoiding, because the expensive models are the ones the
model picker shows first:

| Same 8-second 720p clip | Credits |
|---|---|
| Seedance 2 Mini | 11 |
| Veo 3.1 Fast | 14 |
| Seedance 2.5 | 31 |
| Veo 3.1 | 54 |
| Sora 2 Pro at 1080p | 94 |

Escalate only for a named reason: Kling 2.5 Turbo has no audio track, Veo and
Seedance do. Seedance 2.5 is the only one that goes past 15 seconds.

---

## Step 3 — quote before you spend

Before any Everygen call:

1. Call `get_credit_balance`. If it is 0, say so and stop. Do not quote a render
   he cannot run.
2. Call `estimate_generation_cost` for the exact job.
3. Tell him the number and what it buys, in one line:
   *"Kling 2.5 Turbo, 5s 720p, no audio: 4 credits. Go?"*
4. Wait for a yes. One yes covers one render, not a session of retries.

If a render comes back wrong, quote the retry as its own spend. Three silent
retries is how a 4-credit job becomes 12.

---

## Step 4 — write the prompt

Never pass his sentence through as the prompt. Read
`references/prompting.md` and write a real one: subject, surface, lighting,
lens, motion, and what must not be in frame.

Check the ledger first. If he has rendered something close before, start from
that prompt rather than a blank one:

```bash
uv run python ~/.claude/skills/generate/scripts/ledger.py search "amber serum bottle"
```

---

## Step 5 — save it where it belongs

Byron's landing rule: every file made for a piece of work goes in that work's
folder in the same session. Not Downloads, not a temp directory.

- Renders go to `<project>/generated/` in the project the work belongs to.
- If there is no project yet, use the `project-folder` skill before rendering.
- A genuine one-off goes to `Desktop\Claude\Random\` as
  `YYYYMMDD-what-it-is.png`.

Then log it:

```bash
uv run python ~/.claude/skills/generate/scripts/ledger.py add \
  --kind image \
  --backend everygen \
  --model gemini-3.1-flash-image-preview \
  --credits 2 \
  --path "C:/path/to/render.png" \
  --prompt "the full prompt that was actually sent"
```

The ledger lives at `C:\Users\PC\.claude\generate-ledger.jsonl`, deliberately
outside `~/.claude/skills` because **the skills folder is the public repo
`YourFutureSiteDev/Claude-Skills`.** Client prompts, client product names and
client image paths must never be committed there.

---

## What this skill will not do

- Spend a credit without a quoted price and a yes.
- Put a generated photo of a real person's child into a mockup. If a client
  photo has a kid in it, drop it. Byron's standing rule.
- Invent a client's product. A render for a real client either uses their own
  photo as reference or is labelled as a concept when shown.
- Render a person's likeness from a photo he does not own.
- Start the WanGP GPU server behind his back.

---

## Answering "what did this cost"

```bash
uv run python ~/.claude/skills/generate/scripts/ledger.py report
```

Totals by backend and by month, so the paid spend is visible rather than
dribbled away two credits at a time.
