# The catalogue

Twenty signals. Each entry: what it belongs on, what must never carry it, the
HTML it expects, and the values. The CSS and JS are in `../assets/`; the
snippets here show the shape, not the full rules. Read the entry for every
signal you ship. `demo.html` has a live example of each.

Contents: 01 drop-answer · 02 honest-progress · 03 inline-retry ·
04 upload-preview · 05 own-lane-queue · 06 press · 07 focus-glow ·
08 submit-states · 09 field-error · 10 copy-swap · 11 state-glow ·
12 tick-draw · 13 toast · 14 chip-stagger · 15 headline-emphasis ·
16 section-reveal · 17 card-lift · 18 nav-underline · 19 count-up ·
20 skeleton

The first five are the reel. The rest are the same rule applied to the parts
of a page the reel did not cover.

---

## 01 drop-answer

**The reel:** "Nothing reacts. It has to answer back. Three signals, before
the drop: border, glow, copy." A file dragged over a dead dropzone makes users
hesitate.

**Belongs on:** a file dropzone. **Never on:** anything else. A hero with a
glow behind it is not this signal, it is decoration.

**What moves, on dragenter:** the dashed border goes from muted to accent
(150ms), a radial accent glow fades up behind the content (150ms), the icon
swaps and rises 3px, the copy crossfades from "Drop your file" to "Release to
upload" plus what is being dragged. All four reverse on dragleave. Drop
returns to idle and hands the files on.

```html
<div class="sig-dropzone sig-glow" data-sig-dropzone>
  <div class="sig-swap">
    <div data-when="idle"> <svg class="sig-icon">…</svg> <h3>Drop your file</h3> <p>PNG, JPG, PDF, up to 50 MB</p> </div>
    <div data-when="over"> <svg class="sig-icon">…</svg> <h3>Release to upload</h3> <p data-sig-dropcopy></p> </div>
  </div>
  <input type="file" hidden>
</div>
```
```js
Signals.dropzone(el, { onFiles: function (files) { /* start the upload */ } });
```

Browsers do not expose filenames during dragover, only count and type, so
the over copy says "1 image" or "3 files". The reel's filename chip is a mock.

---

## 02 honest-progress

**The reel:** "A spinner hides the truth." Mystery: a ring with a question
mark and "Uploading…". Honest: 62%, 7s left, 2.4 MB/s. "Let them decide,
wait or walk away."

**Belongs on:** an operation over about one second whose length is known
(bytes, rows, steps). **Never on:** an operation of unknown length. A fake
percentage that stalls at 95% is worse than a spinner; use `skeleton` there.

**What moves:** the fill scales on X with `transition: transform 200ms
linear` (progress is constant motion, so linear). The percent is large,
tabular-nums, accent. Time left and rate arrive as small chips once they are
known (220ms rise), and leave when they are not.

```html
<div class="sig-progress" data-state="idle">
  <span class="sig-progress-pct" data-pct>0%</span>
  <div class="sig-bar"><i class="sig-bar-fill"></i></div>
  <div data-status></div>
  <div class="sig-progress-meta"><span data-eta></span><span data-rate></span></div>
</div>
```
```js
var ctrl = Signals.progress(el);
xhr.upload.onprogress = function (e) {
  ctrl.set(e.loaded / e.total * 100, { secondsLeft: est, rate: mbps + ' MB/s', status: 'Uploading' });
};
ctrl.done();
```

---

## 03 inline-retry

**The reel:** "It dies at ninety percent." The bar turns red where it
stopped, the status reads "Paused at 90%, file kept in memory", an error row
grows in under it with a Retry button. One tap resumes from 90%. "Never make
them start over."

**Belongs on:** any network action that can fail: upload, form submit,
payment. **Never on:** actions that cannot fail, and never as a full-page
error state that throws away what the user had.

**What moves:** on `fail()`, the fill and percent go danger colour (150ms),
the error row expands (grid-template-rows 0fr to 1fr, 220ms, the one
sanctioned height animation) with its content rising in. On `resume()` the
row collapses, colours return, and the bar carries on from its last value.
The element the user typed into or dropped is never removed.

```html
<div class="sig-retry-row">
  <div>
    <div class="sig-retry-card"> <b>Upload failed</b> <span data-error-msg>Connection lost</span> <button data-retry>Retry</button> </div>
  </div>
</div>
```
`data-retry` is wired by `Signals.progress`; pass `onResume(fromPercent)` to
restart the transfer with a range header or your own resume logic.

Only promise a resume the server can keep. A plain form post to a static
host cannot pick up at 90%, so "Resuming from 90%" there is a lie. In that
case the honest version is `submit-states` going to "Try again" with
everything the user typed and attached still in place, and no percentage.

---

## 04 upload-preview

**The reel:** "A filename is not feedback." Text only: "IMG_4032.jpg
uploaded". Preview: a card with the thumbnail, a JPG chip, 2.4 MB, a drawn
tick and "Uploaded just now", then Replace and Remove. "Thumbnail · Type ·
Size · Proof."

**Belongs on:** the moment after any file upload succeeds. **Never as:** a
line of text, and never before the upload has actually finished.

**What moves:** the card enters with opacity 0 to 1 and translateY 8px to 0
(220ms ease-out). The tick inside draws itself (see 12). Nothing else
animates; the content is the feedback.

```html
<div class="sig-preview" hidden>
  <div class="sig-thumb"><img data-thumb alt=""></div>
  <b data-name></b> <span class="sig-chip" data-type></span> <span data-size></span>
  <svg class="sig-tick">…</svg> Uploaded just now
  <button>Replace</button> <button>Remove</button>
</div>
```
```js
var pv = Signals.preview(card, file);  // fills name, size, type, image thumb
pv.hide();
```

On a form where the file only goes up when the form is sent (most contact
forms), show the card at attach time instead, because a bare filename is
still worse. Then the proof line says "Attached and ready to send", not
"Uploaded", and the tick waits for the real success.

---

## 05 own-lane-queue

**The reel:** "Every file, its own lane." Five rows, each with its own bar
and percent, a "4 of 5 done" counter, ticks appearing per row as each
finishes while the 48 MB video is still at 82%. "One failure never blocks the
others."

**Belongs on:** a batch of long operations. **Never on:** a single
operation, and never as one combined bar for the batch.

**What moves:** each row is its own `honest-progress` at 3px. On a row's
`done()` its percent fades out and its tick fades in and draws. The counter
is plain text that updates. A failed row goes danger and stays put; the
others carry on.

```html
<div class="sig-queue"> <span data-done></span>
  <div class="sig-queue-item" data-sig-queue-item> … <div class="sig-bar"><i class="sig-bar-fill"></i></div> <span data-pct></span> <span class="sig-tick-wrap"><svg class="sig-tick">…</svg></span> </div>
</div>
```
```js
var lanes = Signals.queue(list); lanes[i].set(40); lanes[i].done(); lanes[j].fail();
```

---

## 06 press

**Belongs on:** buttons, and links styled as buttons. **Never on:** nav
links, links in text, cards.

**What moves:** `transform: scale(0.97)` on `:active`, 120ms ease-out in
and out. Background and border colour changes share the 150ms state
duration. It is felt, not seen.

```html
<button class="sig-press">Send</button>
```

---

## 07 focus-glow

**Belongs on:** text inputs, textareas, selects. **Never on:** buttons,
cards, links.

**What moves:** on `:focus-visible` the border goes accent and a 4px soft
ring fades in (150ms). The default outline is replaced by the ring, not
removed; the ring has contrast. An errored field's ring is danger.

```html
<input class="sig-focus">
```

---

## 08 submit-states

**Belongs on:** the form's submit button. **Never on:** any other button.
One form, one button that goes through states.

**What moves:** on submit the button's width is locked to its current
width so it never jumps; the label fades up and out and a ring spinner fades
in (150ms). Success: spinner out, tick draws plus "Sent", holds 1.8s, then
idle. Error: one 300ms shake, background goes danger with "Try again", holds
1.6s, then idle. The shake is keyframed because it fires rarely and must
run to completion.

```html
<button type="submit" class="sig-submit" data-state="idle">
  <span class="sig-submit-stack">
    <span class="sig-submit-label">Send enquiry</span>
    <span class="sig-spinner"></span>
    <span class="sig-submit-done"><svg class="sig-tick">…</svg> Sent</span>
    <span class="sig-submit-error">Try again</span>
  </span>
</button>
```
```js
Signals.submit(form, function (formData) { return fetch(url, { method: 'POST', body: formData }).then(function (r) { if (!r.ok) throw r; }); });
```

---

## 09 field-error

**Belongs on:** the one field that failed validation. **Never on:** the
whole form. The reel's rule about never making them start over applies:
the user's other answers stay untouched.

**What moves:** the message grows under the field (grid rows, 220ms) with
its text rising in, the field border goes danger. Typing clears it.

```html
<div class="sig-field" data-state="idle">
  <input class="sig-focus">
  <div class="sig-field-msg"><div>That email does not look right</div></div>
</div>
```
```js
var f = Signals.field(wrap); f.error('That email does not look right'); f.clear();
```

---

## 10 copy-swap

**Belongs on:** any label whose text changes with state: a dropzone, a
button, a status line. **Never on:** static copy.

**What moves:** all variants sit in one grid cell; the outgoing one fades
and drops 4px, the incoming rises from 4px (150ms ease-out). No layout
shift because the cell holds the tallest variant.

```html
<div class="sig-swap" data-state="a"> <span data-when="a" class="is-on">Saving</span> <span data-when="b">Saved</span> </div>
```
```js
Signals.setState(el, 'b');
```

---

## 11 state-glow

**Belongs on:** exactly one live element at a time: the active step, the
dropzone being dragged over, the card being edited. **Never on:** more
than one element at once, and never as decoration on a hero or a section.

**What moves:** a radial accent gradient behind the element fades in at
150ms. `Signals.glow(el)` removes it from every other `.sig-glow` first,
which is how the rule is enforced.

```html
<div class="sig-glow">…</div>
```
```js
Signals.glow(el);
```

---

## 12 tick-draw

**Belongs on:** success states: upload done, form sent, step complete.
**Never on:** neutral or error states, and never as a static icon that
happens to animate on load.

**What moves:** the check path draws with stroke-dashoffset 24 to 0 over
300ms ease-out after a 60ms pause; the ring around it settles from scale
0.9 to 1 at 220ms. Triggered by `.is-on` on the svg or an ancestor, or
`data-state="done"` on an ancestor.

```html
<svg class="sig-tick" viewBox="0 0 24 24"><circle class="sig-tick-ring" cx="12" cy="12" r="10"/><path class="sig-tick-path" d="M7 12.5l3.2 3.2L17 9"/></svg>
```

---

## 13 toast

**Belongs on:** transient confirmations: saved, sent, copied. **Never
on:** anything the user needs to act on or read later; that is inline
content, not a toast.

**What moves:** enters from the bottom, translateY 16px to 0 with opacity
(220ms ease-out), and leaves by the same path. Transitions, not keyframes,
so a second toast retargets the one element instead of restarting. Auto
hides at 2.8s.

```js
Signals.toast('Changes saved'); Signals.toast('Could not save', { kind: 'error' });
```
For a stacked or dismissable toast use the Preline overlay or a daisyUI
toast rather than extending this one.

---

## 14 chip-stagger

**Belongs on:** a list of tags, features, benefits or badges as it enters
view. **Never on:** lists the user is reading through (a menu, a table, a
FAQ), and never a second time.

**What moves:** each child rises from 6px with opacity, 220ms ease-out,
40ms apart. Runs once when the list is 20% in view.

```html
<ul class="sig-chips"><li>Border</li><li>Glow</li><li>Copy</li></ul>
```
`Signals.init()` wires every `.sig-chips`.

---

## 15 headline-emphasis

**The reel's title cards:** "Nothing reacts." with "reacts" in accent;
"It has to answer back." with "answer back" in accent. The phrase tints
after the line has settled.

**Belongs on:** the hero H1, one phrase, once per load. **Never on:** any
other heading, and never on more than one phrase.

**What moves:** the H1 rises 8px with opacity over 400ms; the `<em>` phrase
tints from inherit to accent over 400ms starting at 350ms, so the sentence
reads first and the emphasis lands second.

```html
<h1 data-sig-headline>An interface has to <em>answer back.</em></h1>
```

---

## 16 section-reveal

**Belongs on:** sections below the fold. **Never on:** the hero, the first
section, or anything visible at load. `Signals.reveal()` refuses above-fold
elements: it shows them instantly and logs a warning naming the element, so
the mistake is visible in the console rather than as a blank hero.

**What moves:** opacity 0 to 1 and translateY 12px to 0 over 400ms
ease-out, once, at 15% visibility. This is the marketing tier, so 400ms is
allowed; nothing the user is waiting on should take that long.

```html
<section data-sig-reveal>…</section>
```

---

## 17 card-lift

**Belongs on:** cards that are themselves links. **Never on:** static
cards, table rows, list items. If it does not go anywhere, it does not lift.

**What moves:** translateY(-2px), a stronger border and a soft shadow on
hover, 150ms ease-out, inside `@media (hover: hover) and (pointer: fine)`
so touch devices never see a stuck hover.

```html
<a class="card sig-card" href="/service">…</a>
```

---

## 18 nav-underline

**Belongs on:** the primary nav's links. **Never on:** footer links, links
in body text.

**What moves:** an underline scales from the left, 180ms ease-out, on
hover (gated) and stays on `aria-current="page"`.

```html
<nav class="sig-nav"><a href="/" aria-current="page">Home</a><a href="/work">Work</a></nav>
```

---

## 19 count-up

**Belongs on:** a stats section: leads found, years trading, jobs done.
**Never on:** prices in a checkout, totals, table cells, anything the user
is about to act on.

**What moves:** the number eases from 0 to its value over 2 seconds (cubic
ease-out, so the last digits settle slowly), once, at 50% visibility, with
tabular-nums so the width holds. Reduced motion jumps straight to the value.

**Byron's rule, 11 Sep 2026: numbers load much slower than everything else.**
2s is the floor, not the default. `signals.js` clamps anything shorter back
up to 2s; make it longer with `--sig-dur-count` in `signals.css` or
`data-duration="3000"` on the element. A count-up that flicks to its value
in under a second is the thing he sends back.

```html
<b data-sig-count="398">0</b> <b data-sig-count="4.5" data-decimals="1" data-suffix="%">0</b> <b data-sig-count="20" data-prefix="A$" data-suffix="/yr" data-duration="3000">0</b>
```

---

## 20 skeleton

**Belongs on:** content that arrives after first paint: reviews from an
API, a feed, a map. **Never on:** content that is already in the HTML, and
never as a substitute for `honest-progress` when the length is known.

**What moves:** a linear shimmer sweeps left to right every 1.4s. Reduced
motion shows a static block. Replace the skeleton with the real content in
place; do not animate the swap.

```html
<div class="sig-skeleton">&nbsp;</div>
```

---

## Reduced motion, in one place

`signals.css` ends with a `prefers-reduced-motion: reduce` block that keeps
every colour and opacity change and removes every transform, delay and
keyframe. Ticks appear drawn, counts appear at their value, the shimmer
stops, sections are simply visible. Test it once per page.
