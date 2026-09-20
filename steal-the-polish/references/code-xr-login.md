# Login card: the @code.xr "Login form V5" reel

Ten-second Instagram reel by @code.xr (credit line on screen: "XNIMXS · Let
Him Cook"), sent by Byron on 20 Sep 2026. First filed as "nothing, no
lesson". Byron pushed back the same day: "if it does make things better then
how come they all look worse??" He was right. The UI Libraries forms work
better; this one looks better. So it was ported. File kept in
`Desktop\Claude\Skills\Source Reels\2026-09-20`.

## What is on screen

- Near-black ground with thin red circuit lines: right-angled paths with a
  small glowing dot at each corner and end, a warm red pool bottom right.
- One glass card, about 740px wide, 18px radius, thin light border, heavy
  drop shadow with a faint red bloom.
- The card is split by a slanted divider. Left panel is darker glass:
  "HELLO, FRIEND!" bold uppercase, then "Enter your personal details to
  start your journey with us." in muted grey, both centred.
- Right panel: "Sign Up" title, three inputs (user, mail, lock icons on
  the left, placeholder text, dark fill, thin border). The focused input
  has a red border and a red icon.
- A full-width red gradient pill button with a red glow under it, then
  "Already have an account? Login" with Login in red.
- The code shown underneath is React boilerplate (useState, a fake 1.5s
  submit). Nothing in it produces the look; the look is all CSS.

## The port

`assets/login-card.css` plus `assets/login-card-demo.html`. Plain CSS, no
JS needed for the component itself. One token, `--lc-accent`, drives the
lines, focus ring, button and link; the demo has swatches to prove the
swap (reel red, YFS orange, teal). Poppins from Google Fonts, or the
project's own sans through `--lc-font`. The slant is a skewed `::before`
so the text stays straight. On phones it stacks and drops the slant.

Verified 20 Sep 2026 in the browser pane at desktop and 375px, including
the focus state and the orange swap.

## Where it belongs

A login, sign-up or gated-area page on a dark site, or a client portal
landing. Not on a tradie brochure site: those are light and have no login.
The circuit lines are decoration; leave them out when the page already has
a hero.
