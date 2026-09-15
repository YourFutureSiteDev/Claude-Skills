---
name: rusty-hero
description: The product-colour hero lifted from @ui_ux_rusty_freelancer (Rusty Emerite). One rounded card holds the product, the whole page takes the product's colour, and switching product recolours the page with a slide. Ships as a dependency-free CSS and JS pair with a data-driven switcher. Use it whenever Byron says "Rusty", "Rusty style", "ui/ux rusty", "the colour switching hero", "make the page change colour with the product", or asks for a hero, showcase, product switcher, plan switcher, pricing hero or "pick a product" section on any site, app or dashboard, and whenever a page has two or more things a visitor chooses between (products, plans, services, bots, agents, tiers). It is a hero, not a theme: it goes on the one section where a choice is made and nowhere else.
---

# Rusty hero

Seven of Rusty's reels are the same move on a different product, and the
move is what people stop scrolling for: **the product owns the page.** Pick
the Fanta can and the page goes orange. Pick Sprite and it goes green. One
rounded card is the stage, the product floats in the middle of it, and every
control is a pill. The breakdown of the reels is in
`references/source-reels.md`; the reels themselves are in
`Desktop\Claude\Skills\UI UX Rusty\posts\`.

The port keeps exactly that: one colour in, a whole palette out, and a
switch that slides the old product away and the new one in while the page
crossfades. Everything else in his frames (orbit ring, ghosted word, size
chips) is garnish that ships only when there is a real product to sit on.

## The placement rule

The hero needs **a choice**. Two or more subjects a visitor picks between,
each with its own colour. Products, plans, services, bots, agents, tiers,
packs. If a page has one thing to sell, or nothing to choose, this skill does
not apply, and no amount of liking the look changes that. A colour takeover
with nothing to switch is a coloured box.

It goes on **one section per page**, the one where the choice happens.
Usually the hero. Never the whole site, never every card, never the footer.
The rest of the page keeps its own design; the hero is the one place that
argues loudly.

Which mode, by what the page is:

| Page is | Mode | What happens |
|---|---|---|
| Marketing site, shop, landing page, portfolio, demo | `full` | The page background recolours with the subject. Rusty's actual move. |
| Web app, dashboard, console, internal tool | `tint` | Only the card recolours; the page gets a 12% tint of the colour so data around it stays readable. |

The `tint` mode exists because a dashboard full of numbers turning orange is
unreadable, and Byron picked dashboards for this deliberately (15 Sep 2026).
Give them the card and the selector, not the takeover.

## Workflow

### 1. Find the choice

Read the page's HTML, not the brief. Write down, in the reply, the subjects
this hero will switch between and the colour each one owns. Sources for the
colour, in order: the product's own packaging or logo, the brand's colour if
it is a third party (ServiceM8 is teal, Tradify is blue), otherwise a colour
from the project's own palette per subject. Two subjects sharing a colour
defeats the point; pick again.

If there is no honest list of two or more, stop and say so. Do not invent
subjects to have something to switch.

### 2. Decide what the media is

Rusty's frames work because a real product image sits in the middle. In
order of preference:

- A cut-out product photo or render (PNG with transparency, or a photo that
  reads as an object).
- The subject's logo, large, if the subject is a third-party brand.
- A big typographic mark: the plan name, the price, the bot's ticker. Set it
  in `.rusty-ghost` style at full opacity as the media itself and drop the
  separate ghost word.
- A screenshot in a rounded frame, last resort.

Never an emoji, never a stock icon. If the best available media is weaker
than the copy, make the copy the media and keep the card clean.

### 3. Install in the project's own structure

`assets/rusty.css` and `assets/rusty.js` are dependency free and written for
hand-written HTML, CSS and JS on Cloudflare Pages, which is what Byron's
sites are. Never add React, Tailwind or a motion library to use them.

- Copy both files into the folder the project already keeps CSS and JS in.
  Link `rusty.css` after the project's own stylesheet.
- Set `--rusty-display` and `--rusty-body` on the scope to the project's
  own fonts. The demo uses Georgia; a client site must not.
- Mark the scope with `data-rusty="full"` or `data-rusty="tint"`. For `full`
  the scope is usually `<body>` or `<main>`; for `tint` it is the section
  around the card.
- Put the subjects in a `<script type="application/json" data-rusty-subjects>`
  block inside the scope. Copy the shape from `assets/demo.html`. Fields you
  leave out are hidden, so a plan switcher with no image simply has no image.
- The card markup is in `assets/demo.html`. Keep the grid areas; drop the
  blocks you have no content for (a dashboard has no quantity stepper).
- A single-file page inlines only what it uses.

If the site already has a hero, this replaces it, it does not stack under
it. Two heroes is one too many.

### 4. Make the colours honest

`rusty.js` derives page, card, edge, glow and text colour from the one
`colour` per subject. Check the result on every subject, not just the first:
a very light subject colour (cream, pale yellow) gives dark text on a light
card, which is correct but reads differently from the orange frame. If a
derived text colour fails contrast on a real subject, darken that subject's
`colour` rather than patching the CSS.

Chips, arrows and the CTA inherit from the derived ink. Never hard-code a
colour into the card.

### 5. Wire the switch to something real

The switcher fires `rusty:change` on the scope with the subject. Use it. On
a shop the price and cart link change; on a plan switcher the checkout link
changes; on a dashboard the selected bot's live numbers load. A switch that
only changes the colour is decoration, and Byron will ask what it is for.

Deep links work out of the box (`#rusty=<id>`), so a nav link or an email
can land on a specific subject.

### 6. Verify in the browser

Fastest route: `node ~/.claude/skills/rusty-hero/scripts/shots.mjs <page.html or url> <outdir>`
clicks every subject headless and writes desktop, phone and reduced-motion
screenshots plus the scope background colour per subject (first run:
`npm i --no-save playwright-core@1.47` inside the skill folder). Look at the
images, do not just trust the log. Or by hand: open the page in the browser pane. Click through every subject and screenshot
each one: the colour must change, the media must slide, the copy must swap,
the CTA must point at the right place. Then the phone width, then reduced
motion. A hero that only works on the first subject has not shipped.

### 7. Report

In Byron's style: the subjects and their colours, one line; what the media
is, one line; what the switch actually changes, one line; what was
deliberately left out and why. Screenshots. Name the source ("Rusty hero,
from @ui_ux_rusty_freelancer") so he can look at the original.

## Values

```css
--rusty-radius: 28px;
--rusty-ease: cubic-bezier(0.23, 1, 0.32, 1);
--rusty-dur-colour: 600ms;   /* page and card crossfade */
--rusty-dur-move: 520ms;     /* product out and in */
```

Colour transitions run on registered custom properties (`@property`), so
the gradient itself crossfades, not just a flat background. Product motion
is `transform` and `opacity` only. Hover motion is gated behind
`(hover: hover) and (pointer: fine)`. Reduced motion keeps the colour change
and drops the slide.

## What this is not

It is not a theme, a colour system, or permission to recolour a site. It is
one section that changes colour when a visitor makes a choice. Motion for the
rest of the page goes through `ui-signals`; hero text effects come from
React Bits; whole components from `UI Libraries`.

## Done means

Before handing this back, check every line. If any fails, fix it and check
again. Do not report the work as finished until all of them pass.

- [ ] The reply lists two or more real subjects and the colour each owns, and no two share a colour
- [ ] The hero is on exactly one section per page, the one where the choice is made
- [ ] Mode is `full` on marketing pages and `tint` on apps and dashboards
- [ ] The media is a product image, a brand logo or a typographic mark, never an emoji or stock icon
- [ ] `rusty.css` and `rusty.js` sit in the project's existing asset folder, `rusty.css` is linked after the project stylesheet, and `--rusty-display` and `--rusty-body` are the project's own fonts, not the demo's Georgia
- [ ] No React, Tailwind or motion library was added
- [ ] The switch changes something real (price, link, loaded data), not only the colour
- [ ] Every subject was clicked in the browser pane and screenshotted, and the page recoloured on each
- [ ] Phone width was checked and the card stacks without horizontal scroll
- [ ] Reduced motion was checked and the colour still changes with the slide removed
- [ ] The old hero, if there was one, is gone, not stacked above or below this one
- [ ] No em dashes, no emojis, in the reply or in any copy written into the site

If a line cannot be checked without the user, say which one and why, rather
than assuming it passes.
