# Everygen model and price table

Pulled live from `list_supported_models` on 24 September 2026. Everygen can
change these. If a number matters to a decision, re-check with
`estimate_generation_cost` rather than trusting this file.

Everything below is in **Everygen credits**, not dollars.

---

## Images

| Model | id | Credits | Max res | Refs | Search |
|---|---|---|---|---|---|
| Nano Banana 2 Lite | `gemini-3.1-flash-lite-image` | **1** | 1K | 3 | no |
| Nano Banana | `gemini-2.5-flash-image` | **1** | 1K | 3 | no |
| **Nano Banana 2** | `gemini-3.1-flash-image-preview` | **2** (3 at 4K) | 4K | **14** | yes |
| Nano Banana Pro | `gemini-3-pro-image-preview` | **3** (4 at 4K) | 4K | **14** | yes |
| GPT Image 2 | `gpt-image-2` | **4** flat | 4K | 4 | no |
| GPT Image 2.5 Flare | `gpt-image-2.5-flare` | **4** flat | 4K | 4 | no |
| GPT Image 2.5 Sunburst | `gpt-image-2.5-sunburst` | **4** flat | 4K | 4 | no |

All image models take the same aspect ratios: 9:16, 16:9, 1:1, 4:3, 3:4, 3:2,
2:3, 4:5, 5:4, 21:9.

**Reading this table.** Nano Banana 2 at 2 credits gives 4K, 14 reference
images and search grounding. GPT Image 2.5 Sunburst costs double, caps at 4
references and has no search. Sunburst wins on precise text rendering inside
an image and on some literal edits Nano Banana refuses. That is the only
reason to pay the extra.

**Note the 4K trap.** Nano Banana 2 costs 2 credits at both 1K and 2K, and 3
at 4K. If a shot is going on a website, 2K is free relative to 1K and 4K is a
50% surcharge for pixels nobody will see.

---

## Video

Credits below are for a **single text-to-video clip at multiplier 1**. Adding
reference images or a first frame can change the price, so quote the real job
with `estimate_generation_cost`.

### The cheap tier — start here

| Model | Duration | Res | Credits | Audio | Refs |
|---|---|---|---|---|---|
| Seedance 2 Mini | 4s | 480p | **3** | yes | 9 |
| Seedance 2 Mini | 8s | 480p | **5** | yes | 9 |
| Seedance 2 Mini | 8s | 720p | **11** | yes | 9 |
| Kling 2.5 Turbo | 5s | 720p | **4** | no | 1 |
| Kling 2.5 Turbo | 10s | 720p | **7** | no | 1 |
| Kling 2.6 | 5s / 10s | 720p | **4 / 7** | no | 1 |
| Seedance 2 Fast | 4s | 480p | **4** | yes | 9 |
| Grok Imagine | 4s | 480p | **4** | yes | 99 |
| Veo 3.1 Lite | 4s / 8s | 720p | **5 / 9** | yes | 0 |
| MiniMax H3 | 4s | 720p | **6** | yes | 9 |
| Kling 2.6 Pro | 5s / 10s | 720p | **6 / 12** | yes | 1 |

### The middle tier — a named reason only

| Model | Duration | Res | Credits | Notes |
|---|---|---|---|---|
| Veo 3.1 Fast | 8s | 720p | **14** | good motion, native audio |
| Kling O1 | 10s | 720p | **14** | no audio |
| Gemini Omni 1.1 Flash | 8s | 720p | **14** | first and last frame |
| Kling 3.0 | 8s | 720p | **12** | audio toggle, extendable |
| Seedance 2 | 8s | 720p | **21** | 4K capable |

### The expensive tier — client hero shots, quoted out loud

| Model | Duration | Res | Credits |
|---|---|---|---|
| Seedance 2.5 | 8s | 720p | **31** |
| Kling 2.1 Master | 5s | 720p | **24** |
| Veo 3.1 | 8s | 720p or 1080p | **54** |
| Seedance 2.5 | 8s | 1080p | **77** |
| Veo 3.1 | 8s | 4K | **80** |
| Sora 2 Pro | 8s | 720p | **40** |
| Seedance 2 | 8s | 4K | **104** |
| Sora 2 Pro | 8s | 1080p | **94** |

Sora 2 and Sora 2 Pro are flagged `availableForStandardGeneration: false`, so
they are not reachable through the normal generate call anyway.

---

## Capability lookups

Reach past the cheap tier only when the job needs one of these.

| Need | Cheapest model that does it |
|---|---|
| Longer than 15 seconds | **Seedance 2.5** (up to 30s) — the only one |
| 4K video | Seedance 2 (104 credits at 8s) or Veo 3.1 (80) |
| First **and** last frame | Seedance family, MiniMax H3, Veo 3.1, Kling 2.6 Pro, Gemini Omni 1.1 |
| Native audio on a budget | Seedance 2 Mini (3 credits at 4s/480p) |
| Many reference images | Grok Imagine (99), Seedance 2.5 (30), MiniMax H3 (9) |
| Extend an existing clip | Grok Imagine, Seedance 2.5, Veo 3.1, Kling 2.5/2.6, Kling 3.0 |
| No audio wanted at all | Kling 2.5 Turbo, Kling O1, Kling 2.1 Master |

## Orientation gotcha

Most models take `portrait` / `landscape`. The Seedance family and MiniMax H3
take concrete ratios instead. MiniMax H3 text-to-video **requires** a concrete
ratio; `auto` is only valid when it has reference media. Passing the wrong one
fails the call and can still cost time.
