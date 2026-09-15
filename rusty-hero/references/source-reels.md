# Source: @ui_ux_rusty_freelancer (Rusty Emerite)

Instagram, 64.7k followers, UI/UX and Framer/Webflow designer, Cameroon.
Thirteen reels downloaded 15 Sep 2026 to
`Desktop\Claude\Skills\UI UX Rusty\posts\` (named `YYYYMMDD_postid.mp4`,
caption in the matching `.description`). Watch those, not this file, if a
value below needs checking.

## What every showpiece has in common

Seven reels (Jan to Sep 2026) are the same move applied to a different
product: Fanta, Sprite and Coke cans; a Nike puffer jacket in three colours;
a milk bottle; a jam jar. Each opens on a grey wireframe ("Before") and
reveals the finished hero ("After").

1. **The page takes the product's colour.** Not an accent, the whole
   viewport. Fanta turns the page orange, Sprite turns it green, Coke turns
   it red. Switch product and the page recolours with it. This is the single
   most recognisable thing he does and the reason the reels stop the scroll.
2. **One rounded hero card** (roughly 28px radius) sits on that page colour,
   in a deeper shade of the same hue, with a lighter radial glow behind the
   product. The card is the product's stage.
3. **Nav lives inside the card.** Logo top-left, a centred pill nav where the
   active item is a filled white pill, account and cart icons top-right.
4. **A fixed grid of content inside the card:**
   headline plus two-line description plus small tag chips top-left,
   product image large and centred (allowed to break the card edge),
   variant chips (250 / 500 / 1000, sizes 39 40 41) on the right,
   price and prev/next arrows bottom-left,
   quantity stepper plus one primary pill CTA bottom-right.
5. **Type is two faces:** a display face for the brand or headline (a
   Fraunces-like serif for "Fresh", a rounded fat sans for "Milk"), a
   neutral sans for everything else, body copy tiny at 10 to 12px. Product
   name in condensed all-caps.
6. **Depth cues, all cheap:** a soft drop shadow under the product, a thin
   elliptical ring under it like an orbit, the brand mark or a huge word
   ghosted behind the product at around 15% opacity (the Nike swoosh, the
   word "PLAN MILK").
7. **Switch motion:** the outgoing product shrinks and slides to a corner
   thumbnail, the incoming one slides in from the opposite side, the colour
   crossfades over about half a second, text fades up. Never a hard cut.

## What is NOT part of it

- The 2024 reels are intro and hire-me pieces, no pattern to lift.
- Two of the 2026 reels are sponsored (Runable AI). Ignored.
- He builds in Figma, Framer and Rive. Nothing here needs any of them;
  the whole move is CSS custom properties, a gradient and one transition.

## Why it works, so the port keeps the point

The colour takeover makes the product feel like it owns the page, and the
switch makes the visitor want to click through every variant just to watch
it happen. That is the effect worth keeping. The chips, the orbit ring and
the ghosted word are garnish; ship them when there is a real product image
to sit on, leave them when there is not.
