# The two feeds

These are for taste, not code. Use them **before** designing, to pick the bar,
and **after** a build that is technically done but flat, to see what the good
ones do differently. Ten minutes, one or two references, then back to work.

Never scrape a feed wholesale. Never download the media into a project. Take
a link and a written description of what the reference does.

## Inspora, inspora.design

Curated design work, mostly short video so the motion is visible. Updated
hourly. Categories: Web, Branding, Product, Motion, Illustration, 3D, Print.

Server-rendered, so Jina reads it without a browser:

```bash
curl -s "https://r.jina.ai/https://inspora.design/?category=Web" | grep -o 'https://inspora.design/posts/[a-z0-9-]*' | sort -u | head -40
curl -s "https://r.jina.ai/https://inspora.design/posts/<slug>"
```

Each post page names the creator, the category and links the mp4 at
`media.inspora.design/posts/<id>.mp4`. To actually watch the motion, open
the post in the built-in browser, or run the `watch` skill on the mp4 URL
for frames plus a description.

Which category for which job:

- **Web**: landing pages and marketing sites. The default for a tradie site.
- **Product**: app screens, dashboards, settings, onboarding. Use for the
  business-tools work (quoting, scheduling, job tracking).
- **Motion**: page transitions and hero motion. Pair with React Bits.
- **Branding**: logo, type, colour systems. Use with the Awesome DESIGN.md
  brand files, never lift a real brand's palette.
- **3D, Illustration, Print**: rarely for Byron's work. Skip unless asked.

## Best Designs on X, bestdesignsonx.com

Hand-picked design posts from X, updated hourly, with side tabs for
Instagram, Fonts, Dribbble, Behance, App Icons and OG Images. Every card links
the creator's X profile and carries the original image or mp4.

Client-rendered, so Jina returns an empty shell. Use the built-in browser:

1. `navigate` to `https://bestdesignsonx.com/`, wait 4 seconds for cards.
2. Search box at the top (`⌘K`): `find` "Search designs" and type a phrase
   (`pricing page`, `mobile onboarding`, `dark dashboard`).
3. Pull the visible cards with `javascript_tool`:

```js
[...document.querySelectorAll('video, img')]
  .map(m => m.src || m.querySelector?.('source')?.src)
  .filter(s => s && /cdn\.bestdesignsonx\.com\/(media|amplify_video)/.test(s))
  .slice(0, 12)
```

   and the creators with
   `[...document.querySelectorAll('a[href*="x.com/"]')].map(a => a.href)`.

4. Open one or two that fit the job, screenshot, describe.

The **Fonts** tab is worth its own visit when picking type: real pairings in
use, not a foundry's specimen. The **OG Images** tab is the reference for
share-preview images when `site-launch-check` flags a missing one.

## Writing the reference down

A link is not a reference. Before using one, write four lines:

- **Space**: how much air, how wide the gutters, how the sections breathe.
- **Weight**: type scale and contrast, where the heavy elements sit.
- **Motion**: what moves, on what trigger, how long, what curve.
- **Colour**: how many, where the accent lands, light or dark base.

That description is what goes into the build and into the reply to Byron.
The link can die; the four lines cannot.
