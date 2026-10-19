# Motion brief: a fixed style prompt for rendered UI motion

Lifted from Charlie Hills' carousel (Instagram `DeZYQm2iPvw`, 16 Oct 2026
batch). Sixteen six-second clips all came from one pasted brief plus a single
swapped "scene" line. Use it whenever a shot is a UI or product motion render
(HTML scene, Remotion, HyperFrames, WanGP prompt), so every clip in a video
and across videos reads as one set.

## The brief

```
Quality bar: Apple keynote. Calm, precise, expensive.
Format: 1080 x 960 (or 1080 x 1920 for a full frame short), 6 seconds, 30 fps,
  the last frame matches the first so it loops.
One rule: one hero object at 60 to 70 percent of the frame. One change, then reset.
Look: light background, soft shadow, real UI materials. No dark backgrounds.
Type: one typeface, two weights. Numbers in tabular figures.
Motion: spring physics, overshoot once, settle. Ease out on arrival. Hold the
  end state for 1.2 seconds before the reset.
Never: emoji, stock icons, gradients as decoration, more than one idea per clip,
  text that is not part of the UI.
Scene: <the one line that changes per clip>
```

## Scene lines that worked (X to Y)

Bars to trend. Monthly to yearly price switch. Dots to logo. Island to live
countdown. Visits to sales funnel. Click to done (button squash, progress ring,
green tick). Card to paid. 0 to 12,480 counter (digit roll, keep it at 2 s or
slower per Byron's rule). Weight to bold variable font. Sketch to app wipe.
Drag to booked calendar. Alerts to stack. Rings to closed. Dock to open. Card
to 360 product spin. Map to route.

Name each clip "X to Y" in the shot list; the title doubles as the scene line.

## Coded motion ideas (from a read of yihui-dev/awesome-opus5-5-videos, 19 Oct 2026)

That repo (MIT, 703 prompts) is mostly "go all out" showreel prompts, which is
the opposite of this brief. Five ideas survived the read, written here in our
own words; the prompts themselves are other creators' and stay in the repo.
The ones worth copying are techniques, not looks.

1. **One shape, never cut.** A whole clip is a single element changing its
   width, radius and colour while the content inside swaps. Button, loader,
   tick, player, toggle, chart, back to button. Our `click-to-done` scene is
   this with four states; the idea scales to eight or twelve for a 15 to 30 s
   short and gives Content Engine a longer UI clip from one file. Content
   enters after the container has started to morph and leaves before the next
   morph, so text never overlaps. (Canvas or SVG; two creators, same method.)
2. **A cursor drives every change.** Nothing happens on a timer; a cursor
   arrives, clicks, types or drags, and the UI answers. It is why the clips
   read as a product and not a transition reel. Already in `click-to-done`;
   make it the rule for every scene line.
3. **Everything on a beat grid.** Write the scene to a tempo (120 BPM is a
   500 ms beat) and put one change on each beat. The Content Engine rail has
   no music bed yet, but the grid still works on its own: a fixed pulse is
   what makes a sequence of UI states feel edited rather than drifted.
4. **Draw on one clock, `draw(t)`, with closed form springs.** No CSS
   transitions, no timers, no state carried between frames; a spring is a
   formula of `t`, and a value that changes target twice is two springs summed.
   This is exactly why `seek(t)` works in both renderers and why the loop
   lands on the same frame. Keep it the hard rule for every scene.
5. **Contact sheet before the render.** Render one frame per beat on a sheet,
   fix anything cramped, then render the clip. The same move as
   `scripts/contact-sheet.mjs` in the grade step, pulled forward to before the
   render, which is cheaper.

Two ideas were read and left out: a zoom from a desktop app out to "a point
in space" and back (the camera move is fine, the dark terminal look is not),
and low poly shards assembling a logo (a showpiece, not UI; React Bits has the
equivalent if a hero ever needs it).

## Renderers that take HTML

Settled 19 Oct 2026 after the head to head in
`Content Engine/motion/SCORECARD.md`:

- **HyperFrames** (HeyGen, Apache 2.0) at `C:\HyperFrames`, pinned, run only
  through `hf.cmd`. Frame exact and a third faster than the fallback at 30 s.
  The rail calls it for `background.kind: "html"` (see `render-rail.md`).
- **Playwright `--step`** (`Content Engine/motion/render-html.mjs`): the same
  frames one page at a time, nothing installed. `"renderer": "playwright"` in
  the brief, or the only route on a box without HyperFrames.
- Playwright `--record` (real time screen recording) was measured and dropped:
  capped at 25 fps and starts 0.13 s late.

A scene is one HTML file under `Content Engine/motion/scenes/` that keeps the
`seek(t)` contract; `click-to-done.html` is the reference.
