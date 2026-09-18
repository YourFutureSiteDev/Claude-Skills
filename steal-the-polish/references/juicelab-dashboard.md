# Source: juicelab.uiux "Leadly AI" dashboard concept

Instagram carousel, 6 slides, posted 10 Sep 2026, 900 likes.
https://www.instagram.com/p/DdEb9grklX1/

Byron sent it on 18 Sep 2026 and asked what could be used. It is a concept
mock by a UI agency (Jucie Lab), not a shipped product: the copy has a
"Dashbaord" typo and a "Water production" label on a sales screen. Take the
styling, not the layout.

Instagram is not wired into agent-reach. What worked: `yt-dlp --dump-single-json`
for the caption, then the built-in browser for the images (close the sign-up
dialog, click the carousel Next arrow, read `img[src]` from the DOM, curl the
CDN URLs). Slides are 3277x4096 JPEGs.

## What the design does

One light-grey screen, a browser chrome mock, a pill tab nav with one blue
active pill. Then a grid of cards in two families:

1. **Glow tiles.** Rounded (about 26px) tiles with a radial gradient: fully
   saturated at the centre, fading to a pale frosted rim. White text. Big
   number in a dot-matrix typeface. Under it a thin dashed baseline, a curved
   sparkline, a hollow ring at the start and a filled dot at the current
   point. Pink, blue, green, purple, one hue each.
2. **White cards.** Same radius, very light grey. Small title, big dot-matrix
   number, muted caption. Coloured dot clusters as a tiny legend. Under a
   hairline, two secondary numbers.

Charts:

- **Sales Activity**: dense grey vertical hairlines (target) with sparser black
  bars (actual) sitting in front. No legend needed, reads as planned vs done.
- **Sales Pipeline**: purple tile, white curve over a hatched band, dashed
  target line, big "View Pipeline" pill button.
- **Deal Forecast**: candle chart. Trading desk styling, left out.

Presentation: tilted monitor render, a giant faded "Dashboard" word behind it,
small corner labels ("Light Shot", "Dashboard Design", "UI UX Design").

## What was ported

`assets/dashboard-lift.css` and `assets/dashboard-lift.js`, demo in
`assets/dashboard-lift-demo.html`.

| Block | From the reference | Notes |
|---|---|---|
| `.dot-num` | dot-matrix numerals | Doto, Google Fonts, OFL. Load with the `ROND` axis or the dots come out square: `family=Doto:wght,ROND@400..900,0..100`. Numbers only, never body text. |
| `.glow-tile` | glow tiles | One HSL triple per tile in `--h`. The rim frost is a second radial gradient in `::after`. |
| `.kpi-card` | white cards, dot clusters | Dot clusters share the `--h` variable. |
| `.ghost-bars` | Sales Activity chart | Built by JS from `data-groups="target:actual,..."`. |
| `.showcase-post` | the Instagram frame | For posting Byron's own builds, not for client sites. |
| count-up | not in the reference | Magic UI `number-ticker`, spring swapped for ease-out cubic, reduced-motion sets the final value immediately. |

Left out: candle chart, the "Earth" tooltip, the avatar stack, the browser
chrome mock.

## Where it fits

- Business Tools pitch page: the top stat row, so it does not look like every
  other admin panel.
- Any dashboard build (job tracking, stock, quoting): the KPI row and ghost
  bars for target vs actual.
- Instagram posts of finished client work: the showcase frame.

Two or three glow tiles per screen at most. Byron's word for more than that
was "lolly shop".
