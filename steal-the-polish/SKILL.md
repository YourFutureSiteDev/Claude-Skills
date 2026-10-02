---
name: steal-the-polish
description: Twelve sources of finished UI polish (SmoothUI, Bencho, Amicro, Inspora, Best Designs on X, Godly, transitions.dev, and the house kits dashboard-lift, login-card, pay-ring, scroll-sequence and liquid-nav) and how to lift from each one into Byron's hand-written HTML, CSS and JS sites. Use it whenever a build needs a component, block, micro-interaction or chart that already exists somewhere polished, and whenever a page "looks fine but feels flat", "looks like AI slop", "needs some taste", or Byron asks for inspiration, references, "what do the good ones do", a swipe file, or something to copy the feel of. Also use it for any dashboard, stat row, KPI tile, big number, target-vs-actual chart, "make the numbers look live", glow tile, dot-matrix number, or an Instagram showcase post of a finished build: the dashboard-lift kit in assets/ is the drop-in for those. Also use it for any login, sign-up or client-portal page: the login-card kit is the drop-in. Also use it for any pay, checkout, deposit or Square button (pay-ring kit), any "builds itself as you scroll", scroll scrubbed product or frame sequence section (scroll-sequence kit), and any floating or pill nav, sliding active indicator, liquid glass bar or dark mode toggle (liquid-nav kit). Also use it when he names any of the sources, or says "steal the polish". Sits with `ui-signals` (feedback motion) and the React Bits and UI Libraries folders (hero motion, components): this is the newest batch and the two live inspiration feeds.
---

# Steal the polish

From a @shai.hq Instagram carousel Byron sent on 17 Sep 2026 (breakdown in
`references/source-post.md`). Its whole argument fits on one slide:

> Stop building from scratch. Steal the polish. Three libraries for the
> components. Two feeds for the taste. All free.

That is the split this skill keeps. **Three libraries** give you finished
code to port. **Two feeds** give you a bar to build to before you touch code.
**Five house kits** (dashboard lift, login card, pay ring, scroll sequence, liquid nav) are already ported and drop straight in.

## Behaviour first: ux-patterns

Before lifting a look from any source below, run `ux-patterns` for the module (settings, table, form, pricing, modal, nav, dashboard). It fixes the behaviour, states and copy from the matching @designmotionhq reel; this skill then supplies the finish. For dashboards the pattern row is de-ai-dashboard, number-formatting, charts-that-lie, loading-states-system and empty-states, and the house dashboard-lift kit here dresses what those specify. Gallery: https://ux-patterns.yourfuturesitedev.workers.dev

## The sources

| # | Source | What it is | Where the code lives |
|---|---|---|---|
| 1 | **SmoothUI** smoothui.dev | 130 animated components for shadcn: tabs, toggles, inputs, modals, toasts, drawers, number flow, text reveals, 20 AI-chat parts, shader page transitions. MIT. | Local: `UI Libraries/smoothui/packages/smoothui/components/<name>/`. Live: public REST API, `scripts/smoothui.sh`. |
| 2 | **Bencho** bencho.dev | 29 interactive blocks you tune with sliders before you take them: tilt card, slide to confirm, radial menu, command bar, liquid toggle, pull to refresh, reorder list, magnifying dock. Live, not mocked. MIT. | No public repo. Site only, read via the browser: `references/bencho.md`. |
| 3 | **Amicro** amicro.vercel.app | Micro-transitions: 30 buttons with one interaction each, card spreads, 3D carousels, loaders, 29 mono charts, 23 dither charts, CSS-only "whimsical" pieces. MIT. | Local: `UI Libraries/amicro/src/components/` and `src/data/*.ts` for the catalogue. |
| 4 | **Inspora** inspora.design | Design inspiration feed, mostly video so you see the motion: Web, Branding, Product, Motion, Illustration, 3D, Print. Updated hourly. | Feed. Read with `curl -s https://r.jina.ai/https://inspora.design/?category=Web`. Each post has an mp4 at `media.inspora.design`. |
| 5 | **Best Designs on X** bestdesignsonx.com | Hand-picked design posts from X, plus tabs for Fonts, Dribbble, Behance, App Icons and OG Images. Updated hourly. | Feed. Client-rendered, so open it in the built-in browser and search, `references/feeds.md`. |
| 6 | **Dashboard lift** (house kit) | Four dashboard looks lifted from the juicelab.uiux "Leadly AI" concept, 10 Sep 2026: dot-matrix numbers (Doto), glow stat tiles, white KPI card with dot clusters, target-vs-actual "ghost bars", plus the Instagram showcase frame and a count-up. Already ported, plain CSS and JS. | Local: `assets/dashboard-lift.css`, `assets/dashboard-lift.js`, demo `assets/dashboard-lift-demo.html`, breakdown `references/juicelab-dashboard.md`. |
| 7 | **Login card** (house kit) | The @code.xr "Login form V5" look, 20 Sep 2026: black ground with glowing circuit lines, a glass card split by a slanted divider, icon inputs that take the accent on focus, a gradient pill button. Plain CSS, one accent token. | Local: `assets/login-card.css`, demo `assets/login-card-demo.html`, breakdown `references/code-xr-login.md`. |
| 8 | **Godly** godly.design | Curated gallery of the best designed live websites, with section tabs for Hero, CTA, Footer, OG Images, Logos and App Icons. Added 1 Oct 2026. | Feed. Readable with `curl -s https://r.jina.ai/https://godly.design/hero` (or /cta, /footer, /websites). Screenshot one site and copy its decisions (spacing, type size, one accent), never its brand. |
| 9 | **transitions.dev** | 30 production UI transitions (card resize, number pop in, modal, menu dropdown, toast, success check, tabs sliding, skeleton reveal) on one motion token scale. Added 1 Oct 2026. | Local skills: `transitions-dev` (the library) and `transitions-polish` (aligns existing motion to its tokens). Plain CSS, so it ports straight in. |
| 10 | **Pay ring** (house kit) | A pay button that collapses into a progress ring while the payment runs, then turns into a green tick with a short burst, or reopens as Try again with the reason underneath. Indeterminate spin unless the code reports a real fraction. From a saved Instagram post, 2 Oct 2026. | Local: `assets/pay-ring.css`, `assets/pay-ring.js`, demo `assets/pay-ring-demo.html`. |
| 11 | **Scroll sequence** (house kit) | The "latte builds itself as you scroll" section: a sticky canvas scrubbing a JPG or WebP frame sequence through a tall section, with side steps (name, option chips, price, CTA) that swap at set points. Plain IntersectionObserver and rAF. 2 Oct 2026. | Local: `assets/scroll-sequence.css`, `assets/scroll-sequence.js`, demo `assets/scroll-sequence-demo.html` with 60 placeholder frames in `assets/scroll-sequence-frames/`. |
| 12 | **Liquid nav** (house kit) | Floating pill nav whose active indicator glides on a real spring, optional true glass refraction on Chromium (SVG displacement map in `backdrop-filter`) with a frosted fallback, scroll spy, and a theme toggle that reveals the new theme as a growing circle. 2 Oct 2026. | Local: `assets/liquid-nav.css`, `assets/liquid-nav.js`, demo `assets/liquid-nav-demo.html`. |

`UI Libraries` means `C:\Users\PC\OneDrive\Desktop\Claude\Skills\UI Libraries`.
Its `COMPONENT-INDEX.md` lists every component in all seven libraries there.

## When to reach for which

Byron's sites are hand-written HTML, CSS and JS on Cloudflare Pages, usually for
tradies, usually read on a phone. Pick by what the page needs, not by what
looks coolest in the demo.

- **A control that has to feel physical** (toggle, slider, confirm, stepper,
  dock, drag): **Bencho** first. Its blocks are the best-tuned and the CSS
  comes with a paragraph explaining *why* each value is what it is. Read that
  paragraph, it is the actual lesson.
- **A standard component with better motion** (tabs, dropdown, modal, toast,
  input, OTP, progress, avatar group, accordion): **SmoothUI**. Ask the API
  in plain words and it ranks matches.
- **A plain CSS transition** (modal, dropdown, toast, number pop in, success
  check, tab slide): the **transitions-dev** skill, since it is already plain
  CSS on one token scale.
- **A button or a chart with personality**, a loader, a number that counts:
  **Amicro**. `src/data/buttons.tsx` names all 30 button interactions
  (morph, sparkle, shake, pulse, ring, rotate).
- **Before designing anything visual**, or when a page is technically done
  but flat: ten minutes in **Inspora** (Web or Product category), **Best
  Designs on X** or **Godly** (best for a whole hero, CTA or footer section), pick one reference that is close to the job, and name it as
  the bar. `gauntlet-loop` wants exactly that.
- **A dashboard, stat row, KPI number or target-vs-actual chart**, or an
  Instagram post showing off a finished build: the **dashboard lift** kit.
  It is the only source here that is already plain CSS and JS, so it is
  the first stop for anything with big numbers on it. Read
  `references/juicelab-dashboard.md` for what each block is and the
  "two or three glow tiles per screen" limit. **The slop tell for a
  dashboard** (a @code.xr reel, 20 Sep 2026): near-black navy, purple to
  cyan gradient stat cards, a glowing donut, neon line chart, "Upgrade to
  Pro" card in the sidebar. That is the default every AI tool spits out and
  it reads as fake software. The "instead make these" side was a white or
  cream surface, one accent colour, flat stat tiles with a tiny sparkline,
  plain numbers, real table rows. Byron's business-tool dashboards go that
  way: light surface, one brand accent, glow tiles only where the kit's
  limit allows, never the neon set.
- **A login, sign-up or client-portal page on a dark site:** the **login
  card** kit. Set `--lc-accent` to the brand colour and drop the circuit
  lines if the page already has a hero. Not for light brochure sites.
- **A pay, deposit or checkout button:** the **pay ring** kit. It owns
  the wait and the ending, never the payment. On a Square hosted checkout
  link (every YFS client portal button) use link mode, which only spins
  until the browser leaves; see the client-portal skill. **Not for** plain
  form submits that are not money (a contact form wants a normal loading
  button from `ui-signals`), and never call `progress()` with a timer: a
  card payment has no real fraction, so it spins.
- **A product or process that is better shown building up** (a coffee being
  made, a burger stacking, a deck being built, before and after on a job):
  the **scroll sequence** kit. Needs real frames: a 3 to 6 second clip
  filmed or generated, cut with the ffmpeg line in the JS header. **Not
  for** a section with no real footage (placeholder frames read as cheap),
  for more than one sequence per page, or for a tradie home page whose
  visitors want the phone number, not a show. Keep total frames under 5 MB
  and put every word of copy in the steps, never in the frames.
- **A site nav for a one page or few page business site:** the **liquid
  nav** kit, with `data-spy` on one page sites. Refraction only shows on
  Chromium and only reads over busy imagery; over a flat colour leave
  `data-glass` off. Add the theme toggle only when the site really has a
  dark theme designed. **Not for** sites with more than five or six top
  level links (use a normal header and menu), and not as well as an
  existing header.
- **Never** reach here for hero motion or text effects: that is React Bits.
  Never for feedback states (drag over, upload, retry): that is `ui-signals`.

## Getting the code

**SmoothUI, from the API (no auth):**

```bash
bash ~/.claude/skills/steal-the-polish/scripts/smoothui.sh suggest "sliding tab indicator"
bash ~/.claude/skills/steal-the-polish/scripts/smoothui.sh source animated-tabs
```

`suggest` returns ranked names with a one-line description. `source` returns
the metadata (dependencies, reduced-motion support, composition hints) and the
full TSX. Or read the same file from the local clone.

**Amicro, from the local clone.** Find the entry in `src/data/` (buttons,
cards, loaders, monoCharts, ditherCharts, metrics, textAnimations, toggles,
transitions), then open the component it points to. Buttons live inline in
`src/data/buttons.tsx` as small React functions; each one is one interaction.

**Bencho, from the site.** Follow `references/bencho.md`. In short: open
`https://bencho.dev/?c=<slug>`, set the sliders to what the page needs, open
the code tab, capture the Usage and CSS copies with a small clipboard shim in
the page. The CSS tab is the real payload.

**Inspora and Best Designs on X.** `references/feeds.md`. Do not scrape them
wholesale; pull one or two references per job and describe what they do in
words (spacing, weight, motion, colour) so the description survives even if
the link dies.

**Dashboard lift, from this skill.** Copy `assets/dashboard-lift.css` into the
project's css folder and `assets/dashboard-lift.js` into its js folder, keep
only the blocks the page uses, and add the Google Fonts link from the top of
the CSS file (Doto needs the `ROND` axis in the URL or the dots render
square). Class names: `.dot-num`, `.glow-tile`, `.kpi-card`, `.ghost-bars`,
`.showcase-post`. Open `assets/dashboard-lift-demo.html` to see all of them
and copy the markup. `.showcase-post` is for Instagram, never a client site.

**Pay ring, from this skill.** Copy `assets/pay-ring.css` and
`assets/pay-ring.js` into the project's css and js folders. Add
`data-pay-ring` to the pay button (add class `pay-ring--block` for full
width), set `--pr-bg` to the brand button colour, and call
`PayRing.start(btn)` when the payment begins, then `PayRing.success(btn)` or
`PayRing.fail(btn, "what went wrong and what to do")`. `PayRing.progress(btn,
0.6)` only when the code knows a true fraction. For a link out to Square or
any hosted checkout, use `data-pay-ring="link"` and no JS calls at all.
Labels: `data-label-busy`, `data-label-done`, `data-label-retry`.

**Scroll sequence, from this skill.** Cut the frames (`ffmpeg -i clip.mp4 -vf
"fps=24,scale=1280:-2" -q:v 4 frames/name-%03d.jpg`, WebP line in the JS
header, ffmpeg is at `~/.local/bin/ffmpeg`), copy the CSS and JS in, and copy
the section markup from `assets/scroll-sequence-demo.html`. Set
`data-frames` (with `{n}`), `data-count`, `data-pad`, and point the
`.scroll-seq__still` `<img>` at frame 1 with its real width and height. Each
`.scroll-seq__step` gets a `data-at` from 0 to 1. Set `--seq-bg` to the
frames' background colour and `--seq-track` for how long it plays (400vh
default). Optional `data-frames-small` for a 720px phone set. Reduced
motion and no JS get the still plus every step stacked, automatically.
GSAP ScrollTrigger can drive it instead (`data-driver="external"` plus
`ScrollSequence.seek(section, progress)`), see the JS header.

**Liquid nav, from this skill.** Copy the CSS and JS in, copy the `<nav>`
from `assets/liquid-nav-demo.html`, and set `--ln-pill`, `--ln-tint` and
`--ln-ink` (plus their `[data-theme="dark"]` versions) from the site
palette. `data-glass="refract"` for Chromium refraction, `data-spy` for one
page sites, `.liquid-nav--bottom` for a thumb reach bar. For the theme
toggle, put a `<button data-theme-toggle>` in the nav, put the one line
`<script>` from the JS header in `<head>` so there is no flash of the wrong
theme, and give the site's own tokens a `[data-theme="dark"]` block (and a
`prefers-color-scheme` block, as the demo does). Give section targets
`scroll-margin-top` so the floating bar does not cover headings.

## Porting rule

All three libraries are React. **Never add React, Tailwind or shadcn to a
static site to use one component.** Read the component, understand the effect,
rewrite it in the site's own CSS and JS. Check what it leans on first:

- `motion` / `motion/react` (Framer Motion): rewrite as CSS transitions,
  `@keyframes`, or the Web Animations API. Springs become
  `cubic-bezier(0.34, 1.56, 0.64, 1)` or a short WAAPI keyframe list.
- `gsap`: port to CSS, or load GSAP from cdnjs, which the site CSP allows.
- Shader and canvas transitions (SmoothUI's `shader-reveal-*`, `sdf-*`):
  WebGL. Wrong answer for a tradie site on a phone. Skip.
- Bencho ships CSS with a `@media (hover: hover)` split and reduced-motion
  rules already. Keep both when porting.
- Keep every `prefers-reduced-motion` guard. SmoothUI marks
  `hasReducedMotion` in its metadata; if it is false, add the guard yourself.

Put the CSS in the project's existing css folder and the JS in its existing js
folder. Never a new folder for one component.

Tell Byron which source and which component you lifted, by name and slug
(`SmoothUI animated-tabs`, `Bencho slide-to-confirm`, `Amicro btn-9 shake`),
so he can look at the original.

## Done means

Before handing this back, check every line. If any fails, fix it and check
again. Do not report the work as finished until all of them pass.

- [ ] The source and component are named in the reply (library, slug, and for
      a feed the post URL), so Byron can open the original.
- [ ] No React, Tailwind, shadcn or Motion was added to the site. The ported
      code is plain CSS and JS in the project's existing folders.
- [ ] The port keeps the reduced-motion guard, and on a touch phone it does
      not depend on hover.
- [ ] The component was chosen because the page needed that element, not
      because it looked good in the demo. Say which element on the page it
      serves.
- [ ] If an inspiration feed was used, the reference is described in words
      (what it does with space, weight, motion, colour), not just linked.
- [ ] Bencho values were read from the tuned sliders, not the defaults, and
      the CSS comment explaining the values was read before porting.
- [ ] No WebGL or shader component went onto a client site without Byron
      saying yes to it.
- [ ] The result was opened in the browser and the interaction actually runs
      (screenshot or a one-line description of what happened on click/hover).

- [ ] If the dashboard lift kit was used: only the blocks the page needs
      were kept, no more than three `.glow-tile`s share one screen, Doto is
      on numbers only, the font URL carries the `ROND` axis, and
      `.showcase-post` is not on a client site.

- [ ] If the pay ring kit was used: no fake percentage anywhere (no
      `progress()` fed by a timer), the error copy says what to do next,
      link mode is used on hosted checkout links, and the button was
      clicked through all three endings in the browser.
- [ ] If the scroll sequence kit was used: frame 1 shows before JS (the
      still `<img>` has width and height), total frames are under 5 MB,
      all copy is real DOM text in the steps, and reduced motion was
      checked and shows the still with stacked steps.
- [ ] If the liquid nav kit was used: no more than six links, the bar was
      checked in Safari or iPhone (frosted fallback) as well as Chrome, the
      active link carries `aria-current`, every link is at least 44px tall,
      and if the theme toggle is on, the dark theme was actually designed.

If a line cannot be checked without the user, say which one and why, rather
than assuming it passes.
