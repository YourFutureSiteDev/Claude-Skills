# Writing the prompt

Byron says "a shot of the serum bottle, make it look expensive". That is the
brief, not the prompt. Turn it into one before you send it.

## The six slots

Fill every slot or decide out loud to leave it empty. A slot left silent is a
slot the model fills with stock-photo mush.

1. **Subject** — what it is, exactly. Material, colour, finish, label text if
   any. "Amber glass dropper bottle, ribbed black cap, silver foil label."
2. **Surface and set** — what it sits on and what is behind it. This is the
   single biggest lever on whether a product shot reads as expensive.
   "Wet black stone slab, seamless grey studio backdrop."
3. **Light** — direction, quality, colour. "Single hard key from upper left,
   large soft fill from the right, cool rim along the bottle edge."
4. **Lens** — focal length and distance. "85mm macro, three-quarter angle,
   shallow depth of field, bottle fills 60% of frame."
5. **Motion** (video only) — one movement, not three. "Slow push in, bottle
   rotates 15 degrees, water droplets slide down the glass."
6. **Negative** — what must not be in frame. Hands, text, reflections of the
   studio, extra bottles, logos you do not own.

## Rules that earn their place

**One motion per clip.** Ask for a push in, a rotation and a light sweep and
you get a mess. Pick one and let the render be short. Two good 4-second clips
cost less than one bad 8-second clip.

**Name the format up front.** 9:16 for reels and TikTok, 16:9 for a site hero,
4:5 for an Instagram feed post, 1:1 for a thumbnail grid. Rendering 16:9 and
cropping to 9:16 wastes the credits and the composition.

**Say the brand words you want rendered, and say them once.** Image models
render text badly. If a label must be legible, either use GPT Image 2.5
Sunburst, or render the bottle blank and put the real type on in HTML or an
image editor. The second option is free and always correct.

**Never invent a client's product.** For a real client, either pass their own
photo as a reference image, or label the output a concept when it is shown.
A render of a product they do not sell is a lie with a price tag.

**Real people stay out.** No likenesses from photos he does not own. No
children, ever, including from a client's own social media. That is a standing
rule and it does not bend for a mockup.

## Video prompt shape

Models take a paragraph, not a bullet list. Write it as one:

> Slow push in on an amber glass dropper bottle with a ribbed black cap,
> standing on wet black stone against a seamless grey backdrop. Single hard
> key light from the upper left, soft fill from the right, cool rim light
> along the glass edge. Water droplets slide down the bottle as the camera
> moves. 85mm macro, shallow depth of field. No hands, no text, no second
> bottle.

## Before you send it

- Search the ledger for a near-match and start from that prompt instead.
- Check the aspect ratio is one the chosen model supports
  (`references/models.md`).
- If it is a paid render, the price has been quoted and answered.
