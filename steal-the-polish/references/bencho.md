# Bencho, reading a block

bencho.dev has no public repo (github.com/lorenzo04us/Bencho is private) and
no API. The only way in is the site. Blocks are MIT (bencho.dev/licence), so
taking the code is fine.

## The 29 blocks (Sep 2026), with their `?c=` slugs

Deep link is `https://bencho.dev/?c=<slug>&theme=dark` (or `light`). The
slugs are not the display names, so use this table.

| Block | slug | Block | slug |
|---|---|---|---|
| Magnetic select | `magnet-select` | Inline confirm | `confirm` |
| Search | `seek` | Pull to refresh | `pull` |
| Escape button | `escape` | Reorder list | `liq-arrange` |
| Create menu | `liq-create` | Range dial | `sleep` |
| Radial menu | `radial` | Dragging ball | `drag-ball` |
| Now playing | `sound` | Slide to confirm | `slide-confirm` |
| Icon bar | `icon-bar` | Carousel | `carousel` |
| Progress ticks | `progress` | Slosh slider | `slosh` |
| Command bar | `command` | Palette | `palette` |
| Liquid toggle | `liq-toggle` | Drag stepper | `stepper` |
| Checklist | `checklist` | Notify | `toasts` |
| Assignees | `picker` | Magnifying dock | `dock` |
| Aspect ratio | `aspect` | Wheel | `humidity` |
| Canvas toolbar | `toolbar` | Selection list | `roster` |
| Tilt card | `tilt` | | |

New ones ship weekly. To refresh this table, open `https://bencho.dev/` and
run in `javascript_tool`: click each `button[aria-label^="Edit "]`, read
`new URL(location.href).searchParams.get('c')`, click the `Close` button.

## What each block gives you

Open a block and there are two tabs on the right panel:

- **Sliders tab.** Two to four named values (Tilt card has tilt, shade,
  corner). Tune them here, the preview updates live. What you set is what the
  Usage copy will carry.
- **Code tab** with two copy buttons:
  - **Usage**: the React API only, `<TiltCard tilt={10} shade={60} corner={20} />`
    plus a typed props list with the range of each value. Not the source.
  - **CSS**: the real payload. The stylesheet with the author's reasoning as
    comments, the transform maths, the gradients, the hover and reduced-motion
    splits. This is what you port.

Read the CSS comments before porting. They explain *why* (for Tilt card: the
card sinks under the cursor instead of lifting, and the two radial gradients do
as much work as the transform). That reasoning is the value; the numbers alone
are not.

## Pulling it with the built-in browser

1. `navigate` to `https://bencho.dev/?c=<slug>&theme=dark` using the table
   above. The panel opens on load. A wrong slug silently drops you on the
   wall; if that happens, `find` "Edit <Block name>" and click it.
2. Set the sliders to what the page needs (`Controls` tab, the default). Note
   the values.
3. Click the `Code` tab: `find` "Code" gives the ref, or click the `</>` icon
   top right of the panel.
4. The copy buttons write to the clipboard, which the tool cannot read, so
   shim it and click both with `javascript_tool`:

```js
window.__cap = [];
Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: (t) => { window.__cap.push(t); return Promise.resolve(); } },
  configurable: true
});
document.querySelectorAll('.dtl-copy').forEach(b => b.click());
await new Promise(r => setTimeout(r, 1200));
window.__cap
```

   Returns two strings: `[0]` Usage, `[1]` CSS. Save the CSS to the
   scratchpad, then port.

5. The React component itself (`src/lab/<Name>.tsx` in the private repo) is
   not available. The JS is small enough to write from the CSS plus the
   behaviour you can see in the preview: read the CSS custom properties it
   expects (`--tilt`, `--x`, `--y` or similar) and write the pointer handler
   that feeds them.

## Porting notes

- The CSS already splits `@media (hover: hover)` from touch and carries a
  `prefers-reduced-motion` rule. Keep both.
- Bencho blocks are dark-first. Check contrast when dropping one onto a light
  tradie site.
- Tell Byron `Bencho <block name>` and the slider values you used.
