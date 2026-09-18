---
name: steal-the-polish
description: Six sources of finished UI polish (SmoothUI, Bencho, Amicro, Inspora, Best Designs on X, and the house dashboard-lift kit) and how to lift from each one into Byron's hand-written HTML, CSS and JS sites. Use it whenever a build needs a component, block, micro-interaction or chart that already exists somewhere polished, and whenever a page "looks fine but feels flat", "looks like AI slop", "needs some taste", or Byron asks for inspiration, references, "what do the good ones do", a swipe file, or something to copy the feel of. Also use it for any dashboard, stat row, KPI tile, big number, target-vs-actual chart, "make the numbers look live", glow tile, dot-matrix number, or an Instagram showcase post of a finished build: the dashboard-lift kit in assets/ is the drop-in for those. Also use it when he names any of the sources, or says "steal the polish". Sits with `ui-signals` (feedback motion) and the React Bits and UI Libraries folders (hero motion, components): this is the newest batch and the two live inspiration feeds.
---

# Steal the polish

From a @shai.hq Instagram carousel Byron sent on 17 Sep 2026 (breakdown in
`references/source-post.md`). Its whole argument fits on one slide:

> Stop building from scratch. Steal the polish. Three libraries for the
> components. Two feeds for the taste. All free.

That is the split this skill keeps. **Three libraries** give you finished
code to port. **Two feeds** give you a bar to build to before you touch code.
**One house kit** (dashboard lift) is already ported and drops straight in.

## The six

| # | Source | What it is | Where the code lives |
|---|---|---|---|
| 1 | **SmoothUI** smoothui.dev | 130 animated components for shadcn: tabs, toggles, inputs, modals, toasts, drawers, number flow, text reveals, 20 AI-chat parts, shader page transitions. MIT. | Local: `UI Libraries/smoothui/packages/smoothui/components/<name>/`. Live: public REST API, `scripts/smoothui.sh`. |
| 2 | **Bencho** bencho.dev | 29 interactive blocks you tune with sliders before you take them: tilt card, slide to confirm, radial menu, command bar, liquid toggle, pull to refresh, reorder list, magnifying dock. Live, not mocked. MIT. | No public repo. Site only, read via the browser: `references/bencho.md`. |
| 3 | **Amicro** amicro.vercel.app | Micro-transitions: 30 buttons with one interaction each, card spreads, 3D carousels, loaders, 29 mono charts, 23 dither charts, CSS-only "whimsical" pieces. MIT. | Local: `UI Libraries/amicro/src/components/` and `src/data/*.ts` for the catalogue. |
| 4 | **Inspora** inspora.design | Design inspiration feed, mostly video so you see the motion: Web, Branding, Product, Motion, Illustration, 3D, Print. Updated hourly. | Feed. Read with `curl -s https://r.jina.ai/https://inspora.design/?category=Web`. Each post has an mp4 at `media.inspora.design`. |
| 5 | **Best Designs on X** bestdesignsonx.com | Hand-picked design posts from X, plus tabs for Fonts, Dribbble, Behance, App Icons and OG Images. Updated hourly. | Feed. Client-rendered, so open it in the built-in browser and search, `references/feeds.md`. |
| 6 | **Dashboard lift** (house kit) | Four dashboard looks lifted from the juicelab.uiux "Leadly AI" concept, 10 Sep 2026: dot-matrix numbers (Doto), glow stat tiles, white KPI card with dot clusters, target-vs-actual "ghost bars", plus the Instagram showcase frame and a count-up. Already ported, plain CSS and JS. | Local: `assets/dashboard-lift.css`, `assets/dashboard-lift.js`, demo `assets/dashboard-lift-demo.html`, breakdown `references/juicelab-dashboard.md`. |

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
- **A button or a chart with personality**, a loader, a number that counts:
  **Amicro**. `src/data/buttons.tsx` names all 30 button interactions
  (morph, sparkle, shake, pulse, ring, rotate).
- **Before designing anything visual**, or when a page is technically done
  but flat: ten minutes in **Inspora** (Web or Product category) or **Best
  Designs on X**, pick one reference that is close to the job, and name it as
  the bar. `gauntlet-loop` wants exactly that.
- **A dashboard, stat row, KPI number or target-vs-actual chart**, or an
  Instagram post showing off a finished build: the **dashboard lift** kit.
  It is the only source here that is already plain CSS and JS, so it is
  the first stop for anything with big numbers on it. Read
  `references/juicelab-dashboard.md` for what each block is and the
  "two or three glow tiles per screen" limit.
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

If a line cannot be checked without the user, say which one and why, rather
than assuming it passes.
