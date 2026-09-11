---
name: ui-signals
description: A catalogue of twenty feedback and state animations (drag feedback, honest progress, inline retry, upload preview, independent queue, button press, focus glow, submit states, section reveal, chip stagger, count-up and more) lifted from real motion-design reels, each with a strict rule for the one kind of element it belongs on. Use it every time Byron asks to animate a website, page, UI, form, upload, dashboard, button or component, or says "make it feel alive", "add motion", "make it react", "animate the site", "make the UI move", even when he does not name an element. It sits between `animate` (the physics and the should-it-move gate) and React Bits (hero and text showpieces): this is what each interactive element does when a user touches it, waits on it, or breaks it. Never sprays motion across a page; it inventories the page and places each signal only where it fits.
---

# UI Signals

The video that seeded this skill (a @designmotionhq reel, breakdown in
`references/source-reel.md`) makes one argument in five scenes: **an interface
has to answer back.** A dropzone that does nothing when a file is dragged over
it, a spinner that hides how long is left, an upload that dies at 90% and makes
you start over, a bare filename instead of a preview, a batch where one failure
blocks the rest. Each scene fixes one of those with a small, specific motion.

This skill is that idea generalised into twenty signals, and one rule that
matters more than any of them.

## The placement rule

**Every signal belongs to exactly one kind of element.** Drag feedback belongs
on a dropzone. Honest progress belongs on an operation that takes longer than a
second and has a measurable length. Count-up belongs on a stat. If the page has
no element of that kind, that signal does not ship, no matter how good it looks.

Byron's words for this were "only put them in relevant places." The failure he
is guarding against is the page where everything glows, everything slides in,
and nothing means anything. A signal that is on the wrong element is not a
small mistake, it is the whole mistake. So the workflow starts with an
inventory, not with the catalogue.

The same rule applies to the files: `signals.css` and `signals.js` go next to
the project's own stylesheet and script (its existing `css/`, `js/` or
`assets/` folder), never a new top-level folder, and a single-file site gets
only the blocks it uses inlined into its one stylesheet.

## Workflow

### 1. Inventory the page

Before opening the catalogue, list what is actually on the page by element
kind. Be literal: read the HTML, do not guess from the brief.

| Kind | What counts |
|---|---|
| Hero headline | The one H1 above the fold |
| Primary nav | The site's main links |
| Buttons | `<button>`, and `<a>` styled as a button |
| Text inputs | input, textarea, select |
| Form submit | The button that sends the form |
| File dropzone | Anywhere a file can be dragged or picked |
| Long operation | Anything that takes over ~1s: upload, export, payment, search |
| Batch operation | More than one long operation at once |
| Clickable card | A card that is itself a link |
| Static card | A card that is not |
| Tag / chip list | Features, benefits, badges, filters |
| Stat | A number the page is proud of |
| Async content | Content that arrives after first paint |
| Below-fold section | Sections the user scrolls to |
| Transient message | Toast, snackbar, "saved" |
| Modal / drawer | Overlays |
| Data table / body text | Things people read |

Write the inventory down in the reply, briefly. It is the evidence for what
was left out.

### 2. Run the gate

For each candidate, run the two questions from `animate`: how often will a
user see this (100+ a day means no animation), and what is the purpose
(feedback, state, spatial, preventing a jarring change, delight only on rare
moments). If you cannot name the purpose in one word, the signal does not
ship. Read `animate/SKILL.md` if the values below need justifying to Byron.

### 3. Pick from the catalogue

Match inventory rows to signals. A normal page lands **four to eight**. A
form-heavy or upload-heavy app lands more; a marketing page with no forms
lands fewer. Never all twenty.

| Signal | Belongs on | Never on | Trigger |
|---|---|---|---|
| `drop-answer` | File dropzone | Anything that is not a dropzone | dragenter / dragleave / drop |
| `honest-progress` | Long op with known length | Ops of unknown length (use `skeleton`) | progress events |
| `inline-retry` | Long op that can fail | Ops that cannot fail | error |
| `upload-preview` | After a file upload succeeds | Text-only confirmations | success |
| `own-lane-queue` | Batch operation | Single operations | each item's progress |
| `press` | Buttons, button-styled links | Nav text links, body links | pointerdown |
| `focus-glow` | Text inputs | Buttons, cards | focus |
| `submit-states` | Form submit button | Any other button | submit → loading → done / error |
| `field-error` | Invalid form field | The whole form | validation |
| `copy-swap` | Any label whose text changes with state | Static copy | state change |
| `state-glow` | Exactly one active element at a time | More than one at once, decoration | active state |
| `tick-draw` | Success states | Neutral or error states | success |
| `toast` | Transient message | Persistent content | show / hide |
| `chip-stagger` | Tag / chip list entering view | Lists the user is reading through | intersection, once |
| `headline-emphasis` | The hero H1, one phrase | Any other heading, body copy | load, once |
| `section-reveal` | Below-fold sections | Above-the-fold content, first section | intersection, once |
| `card-lift` | Clickable cards | Static cards, table rows | hover, hover-gated |
| `nav-underline` | Primary nav links | Footer links, in-text links | hover, active |
| `count-up` | Stats section | Prices in a checkout, table cells | intersection, once |
| `skeleton` | Async content | Content already in the HTML | until loaded |

Recipes, values and the HTML they expect are in `references/catalogue.md`.
Read the entry for every signal you ship; do not write the CSS from memory.

### 4. Install the assets in the project's own structure

`assets/signals.css` and `assets/signals.js` are dependency-free and written
for hand-written HTML, CSS and JS on Cloudflare Pages, which is what Byron's
sites are. Never add React or a motion library to a static site to use them.

- Copy both files into the folder the project already keeps its CSS and JS
  in. Link `signals.css` last, after the project's own stylesheet and any
  inline `<style>`, so its state rules (an error button going red, a focused
  input's ring) beat the project's base button and input styles at equal
  specificity. The demo page does this on purpose.
- Set the three tokens at the top of `signals.css` (`--sig-accent`,
  `--sig-danger`, `--sig-surface`) from the project's palette. Never leave
  the demo teal on a client site.
- If the project has one stylesheet and no JS file, inline only the blocks
  for signals that shipped. Unused blocks are dead weight.
- If a signal needs a component the site does not have (a real toast, a
  modal), take it from Preline or daisyUI in
  `Desktop\Claude\Skills\UI Libraries` rather than hand-rolling one, and
  name the component in the reply.

### 5. Wire only matching elements

Each signal is opted into by a class or data attribute on the element it
belongs to. Nothing is applied globally except the easing tokens. If you find
yourself adding `data-sig-reveal` to every section including the hero, stop
and re-read the placement rule.

### 6. Verify in the browser

Open the page in the browser pane. For every signal that shipped, trigger its
state (drag a file, submit the form, scroll to the section, hover the card)
and screenshot it in that state. Then toggle reduced motion (DevTools
rendering panel, or `resize_window` with the emulation) and confirm the page
still reads correctly with the motion gone. A signal that only works in your
head has not shipped.

### 7. Report

In Byron's style: one line per signal that landed, naming the element it is
on; one line listing what was deliberately left out and why; the name of the
source (this reel, React Bits component, Preline component) so he can look at
the original. Show the screenshots. No essay.

## The "plus more"

This catalogue is the feedback layer. Two other sources cover the rest, and
they are read, not reinvented:

- **Hero motion, text effects, animated backgrounds:** `Desktop\Claude\Skills\React Bits`
  (`COMPONENT-INDEX.md` first). Port by hand into CSS and JS; name the
  component you took it from.
- **Modals, drawers, dropdowns, accordions, hold-to-confirm:** `animate/RECIPES.md`.
- **Whole components (docks, navs, pricing tables):** `Desktop\Claude\Skills\UI Libraries`.

When a request is "animate the site" with no further detail, the split is:
this skill for every interactive element, React Bits for the hero only if the
page is a marketing page, and `animate` as the referee for every value.

## Values

All timings and curves come from `animate`. The ones this catalogue uses:

```css
--sig-ease-out: cubic-bezier(0.23, 1, 0.32, 1);     /* entrances, state changes */
--sig-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1); /* on-screen movement */
--sig-dur-press: 120ms;
--sig-dur-state: 150ms;    /* focus, hover, copy swap */
--sig-dur-enter: 220ms;    /* toast, error row, preview card */
--sig-dur-reveal: 400ms;   /* below-fold sections, marketing tier */
--sig-dur-count: 800ms;    /* count-up */
```

Progress bars move with `transform: scaleX()` on a `linear` curve, never
`width`. Nothing enters from `scale(0)`. Nothing uses `transition: all`.
Hover motion is gated behind `@media (hover: hover) and (pointer: fine)`.
Reduced motion keeps colour and opacity changes and drops movement.

## Done means

Before handing this back, check every line. If any fails, fix it and check
again. Do not report the work as finished until all of them pass.

- [ ] The reply contains the page inventory, and every shipped signal maps to a row in it
- [ ] No signal is on an element kind listed in its "Never on" column
- [ ] The hero and any above-the-fold content have no `section-reveal`
- [ ] At most one element carries `state-glow` at any time
- [ ] `signals.css` and `signals.js` live in the project's existing asset folder, not a new one, and the tokens are set to the project's palette (no demo teal on a client site)
- [ ] No React or motion library was added to a static site
- [ ] Every shipped signal was triggered in the browser pane and screenshotted in its animated state
- [ ] Reduced motion was checked and the page still reads with movement removed
- [ ] No `transition: all`, no `scale(0)` entrance, no `ease-in`, no animated `width`/`height`/`top`/`left` (progress bars use `scaleX`)
- [ ] The reply names what was left out and why, and names the source of anything lifted (this reel, a React Bits component, a Preline or daisyUI component)
- [ ] No em dashes, no emojis, in the reply or in any copy written into the site

If a line cannot be checked without Byron (for example, whether a card is
meant to be clickable), say which one and why, rather than assuming it
passes.

When Byron sends something back, the fix is a new line here, not a rewrite of
the instructions above.
