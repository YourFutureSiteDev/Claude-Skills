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

## Renderers that take HTML

- **HyperFrames** (HeyGen, open source): Claude writes each scene as HTML and
  CSS, it renders MP4. Showed up in five reels this batch. Review the repo
  before installing anything; never paste a repo link into an agent and let it
  install.
- The Content Engine rail (edge-tts plus ffmpeg) already composites stills and
  clips; an HTML scene can be screen recorded with Playwright at 30 fps as a
  zero-install fallback.
