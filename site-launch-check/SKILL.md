---
name: site-launch-check
description: Run the twenty-one-point pre-launch check on a website before it goes live or gets handed to a client, and fix what fails. Covers legal pages, SEO plumbing, share previews, forms, links, accessibility, mobile, performance and exposed API keys in the shipped code, then a landing page section order check for Your Future Site client sites (Hero to final call to action, flagging a missing Problem, How it works or FAQ) and a short interface pass from the Vercel Web Interface Guidelines. Use when a site is about to be published, deployed, handed over or invoiced, or when the user says "is this ready to launch", "check the site before it goes live", "pre-launch check", "did we miss anything", or asks what is left to do on a build. Also use before sending any client a preview link.
---

# Pre-launch check

A site that looks finished and a site that is finished are different things.
The gap is always the same twenty-one items, and it is always the same ones that
get missed: the legal pages nobody wants to write, the meta tags nobody sees,
and the contact form nobody actually submitted.

Run this before a client sees a link. Finding it yourself is free; the client
finding it costs you the next job.

## How to run it

Work the list top to bottom. For each item: check it, fix it if it fails, and
record the result. Do not batch the report at the end from memory. Check, fix,
record, move on.

Use the browser to verify the ones that need a real page loaded, not just a
read of the source. A meta tag that exists in a component and never renders is
a fail, and only the rendered page shows you that.

At the end, report every item with a pass, a fix applied, or a blocked with a
reason. Never report an item you did not actually check.

## The twenty-one

**Legal and trust**

1. **Privacy policy** — exists, reachable from the footer, names the actual
   business, and describes what the site really collects. A generated policy
   describing analytics the site does not run is worse than none.
2. **Terms page** — exists and is linked. For a business taking payments or
   bookings, this is not optional.
3. **Cookie consent** — only if the site sets non-essential cookies. If it sets
   none, no banner. Do not add a banner for decoration; it costs conversions
   and implies tracking that is not there.

**Getting found**

4. **robots.txt** — present, does not block the whole site, and points at the
   sitemap.
5. **sitemap.xml** — present, lists every real page, no 404s and no staging
   URLs inside it.
6. **Meta titles** — unique per page, under about 60 characters, the specific
   thing before the brand name.
7. **Meta descriptions** — unique per page, under about 155 characters, written
   as a reason to click rather than a summary.
8. **Canonical URLs** — set on every page, absolute, pointing at the live
   domain. Catches duplicate content from trailing slashes and www variants.

**How it looks when shared**

9. **Social share previews** — Open Graph and Twitter card tags with a real
   image at 1200x630. Paste the URL into a chat app and look at what appears.
   A link that unfurls as a blank grey box reads as amateur.
10. **Favicon** — present, at multiple sizes, not the framework default. The
    tab is the first thing a returning visitor scans for.

**When things go wrong**

11. **Custom 404** — matches the site design and offers a way back, rather than
    the host's default error page.
12. **Every form tested** — actually submit each one and confirm the message
    arrives where it is meant to go. This is the single most common launch
    failure and the most damaging: a contact form that silently drops enquiries
    loses the client money and they will blame the site.
13. **Broken links** — crawl the whole site. Internal links, external links,
    and every link in the footer.

**Everyone can use it**

14. **Image alt text** — describes the subject, not the file. Decorative images
    get an empty alt, not a missing one.
15. **Accessibility basics** — keyboard reaches every interactive element and
    shows a visible focus state, colour contrast passes on body text and
    buttons, headings run in order without skipping levels, and the page has a
    sensible language attribute.
16. **Mobile** — check at 375px wide, not just a narrowed desktop window. Tap
    targets big enough, nothing scrolling sideways, no text under a notch.

**Speed and measurement**

17. **Analytics installed** — and confirmed as receiving a hit from a real
    page load, not just the snippet being present.
18. **Performance** — images sized and in a modern format, no render-blocking
    fonts, largest contentful paint under 2.5 seconds on a mid-range phone.
19. **Clear call to action** — every page has one obvious next step, above the
    fold on the home page, and it works.
20. **FAQ** — only where the business genuinely gets repeat questions. An
    invented FAQ answering questions nobody asks is padding, and reads like it.

**Nothing secret in what shipped**

21. **No API keys in the front end** — anyone can open DevTools, go to the
    Network tab, refresh, press Ctrl+F and type `sk-`. If an Anthropic,
    OpenAI, Google, Resend or SendGrid key is in any HTML or JS the browser
    downloads, it is theirs now, and the bill is yours. (A 20 Sep 2026 reel
    by @verycoolentrepreneur shows exactly this, and it is what people do to
    vibe-coded sites.) Run `bash scripts/keyscan.sh <live url>` from this
    skill folder: it pulls the page and every script it loads and greps for
    key shapes, printing redacted hits. Also grep the source: `sk-ant`,
    `sk-`, `api.anthropic.com`, `x-api-key`. A key that must be used has to
    sit server side (a Cloudflare Pages Function, a Worker, the VPS) with the
    browser calling your endpoint, never the provider. Static sites on
    Cloudflare Pages that only use a form endpoint pass this by design.

## Secrets and injection

Item 21 catches a key someone pasted in. These three catch the holes that let
a stranger inject something through the site itself (SQL, script, prompt or a
request your server makes for them). Do all three on anything with a form, a
login, a Worker or an AI feature, and record each like the twenty-one.

- **Grep what shipped, not just the source.** Run `bash scripts/keyscan.sh <live url>`
  (it now also catches `sk_live_`, `rk_`, `AKIA` and `client_secret`), and grep
  the build output folder too: `grep -rnE 'sk-|sk_|rk_|api_key|secret|Bearer |PRIVATE KEY' dist/`.
  A `pk_live_` publishable key is fine to ship; anything else is a fail. Also
  open a few paths that must not be served, such as `/.dev.vars`,
  `/.git/config` and `/wrangler.toml`, and confirm they 404 or fall back to
  the home page.
- **Escape user text before it goes into HTML.** Anything a user, another
  user, a URL parameter or an API typed ends up on a page through
  `textContent`, or through an `esc()` that replaces `& < > " '` before it
  touches `innerHTML`. Search the code for `innerHTML`, `insertAdjacentHTML`
  and `outerHTML` and check every value that is not a fixed string. Markdown
  renders through DOMPurify. A link a user supplied only goes in an `href`
  when it starts with `https://`. Database queries take values as bound
  parameters (`?`), never glued into the SQL string; a value that has to sit
  in the SQL text (a column or JSON path) is checked against a fixed list
  with `Object.prototype.hasOwnProperty`, not `LIST[x]`.
- **Never fetch a URL a user typed from your server without an allowlist.**
  A Worker or server that fetches, screenshots or forwards to a link from a
  form is a free proxy into everything it can reach. Allow named hosts only
  (FORM's push worker allows the four push services and nothing else), https
  only, no custom ports. The same goes for text: anything typed by the public
  that a Claude or an AI feature later reads (a board task, a support
  message, a reel transcript) is fenced and labelled as data, never as
  instructions.

## Landing page section order (YFS client sites)

A small business home page sells in a known order. Check the page against it
after the twenty-one, and flag what is missing. Run
`bash scripts/sections.sh <url>` first: it prints every h1, h2 and
section id in order, so the outline is one screen of text.

| # | Section | What it has to do |
|---|---|---|
| 1 | **Hero** | Says what they do and where, in the visitor's words, with the one call to action (call, book, quote) above the fold. |
| 2 | **Social proof** | Straight under the hero. For local trades and salons this is the **Google reviews** rating and count, linked to the real Google profile. Never invented, never a stock "5 stars" badge. |
| 3 | **Problem** | The thing that made them search: no hot water, a blocked drain, a wedding in two weeks. One or two lines is enough. |
| 4 | **Solution** | How this business fixes that problem, and why them. |
| 5 | **Features or Services** | The real list, each with a line on what it covers. |
| 6 | **How it works** | Three to four steps from first contact to done (call, quote, job, follow up). |
| 7 | **Testimonials** | Full review quotes with names and suburbs, from Google where possible. |
| 8 | **Pricing** | Prices, "from" prices, or how quoting works. |
| 9 | **FAQ** | The questions the owner really answers on the phone every week. |
| 10 | **Final call to action** | The same action as the hero, repeated at the foot, with the phone number tappable. |

How to report it:

- For each of the ten: **present**, **missing**, or **skipped on purpose**
  with the reason. Missing is a suggestion to the owner, not an automatic
  fail of the launch.
- **Problem, How it works and FAQ** are the three small business sites
  usually leave out. Look for those first and name them in the report when
  they are absent.
- **Do not force a section that makes no sense for the business.** Pricing
  is skipped on purpose for quote only work (say how quoting works
  instead). FAQ is skipped when there are no real repeat questions (item 20
  above still applies: no invented FAQ). An emergency plumber's Problem can
  live in the hero line. A one product cafe may merge Solution and
  Services. Social proof and Testimonials can be one block on a short page,
  but the rating still sits near the top.
- **Order matters less than presence**, with three exceptions worth
  flagging: the call to action must be in the hero, proof must come before
  pricing, and the final call to action must be last.

## Interface pass (from the Vercel Web Interface Guidelines)

A short pass over the checks from vercel.com/design/guidelines that matter
on a small static business site. Do it in the browser at 375px and on
desktop, after the twenty-one.

- **Focus states.** Tab through the page: every link, button and field
  shows a visible `:focus-visible` ring that is not clipped or hidden under
  the sticky header.
- **Tap targets.** Anything tappable is at least 44px tall on a phone
  (24px minimum on desktop), including footer links, social icons and the
  phone number. Spacing so a thumb does not hit the neighbour.
- **Input font size.** Form inputs are 16px or larger on mobile, or iPhone
  Safari zooms the page on tap.
- **Input types and autocomplete.** `type="tel"` for phone, `type="email"`
  for email, real `name` and `autocomplete` values (`name`, `tel`,
  `email`, `postal-code`, `street-address`) so autofill works. Spellcheck
  off on email. Every field has a real `<label>`; a placeholder is not a
  label.
- **Paste and zoom.** Nothing blocks paste into a field, and the viewport
  meta never sets `maximum-scale=1` or `user-scalable=no`.
- **Errors and submit.** The submit button stays enabled until the request
  starts, shows a loading state while it runs, and errors sit next to the
  field they belong to and say how to fix it.
- **Image dimensions.** Every `<img>` has `width` and `height` (or a CSS
  aspect ratio) so the page does not jump while images load. Only the
  hero image is preloaded; the rest use `loading="lazy"`.
- **Reduced motion.** With `prefers-reduced-motion: reduce` turned on,
  scroll reveals, parallax and autoplaying motion stop or go to their end
  state, and nothing is left invisible.
- **Links are links, buttons are buttons.** Anything that goes to a page,
  a section, `tel:` or `mailto:` is an `<a href>`; anything that does
  something on the page is a `<button>`. No clickable `<div>`, no
  `<button onclick="location=...">`.
- **Icon only controls are named.** Menu, close, social and arrow buttons
  carry an `aria-label`.
- **Sticky header and anchors.** Sections linked from the nav have
  `scroll-margin-top`, so the heading is not hidden under a fixed bar.
- **Safe areas.** Fixed bars and floating buttons respect
  `env(safe-area-inset-*)` and do not sit under the iPhone home bar.
- **Browser colour.** `<meta name="theme-color">` matches the page
  background, and a dark site sets `color-scheme: dark`.
- **Locale.** Prices, dates and phone numbers are written the Australian
  way (en-AU), and currency is either always whole dollars or always
  cents on one page, never mixed.

## For a Scroll World build

The scroll-scrubbed pages have three extra failure modes the list above will
not catch, so check these too:

- The video or frame sequence has a poster or first frame that renders before
  the assets load, so the hero is never blank on a slow connection.
- Scroll scrubbing degrades to something readable when `prefers-reduced-motion`
  is set, rather than freezing on frame one.
- The page has real text in the DOM for every scene, not text baked into the
  video. Otherwise the page ranks for nothing and a screen reader gets silence.

## Done means

Before reporting the site as launch-ready:

- [ ] All twenty-one items have an explicit result: pass, fixed, or blocked with a reason
- [ ] Nothing is marked as passing that you did not load in a browser and look at
- [ ] Every form on the site was actually submitted and the message confirmed as received
- [ ] The share preview was checked by rendering the URL, not by reading the tags
- [ ] The mobile check was done at 375px, not a resized desktop viewport
- [ ] Broken-link checking covered the whole site, not only the home page
- [ ] Any item you could not check without the client or their accounts is listed as blocked, naming what you need from them
- [ ] `scripts/keyscan.sh` was run against the live URL and came back clean, and the output is in the reply
- [ ] The three Secrets and injection checks were done: build output grepped, every HTML sink escapes user text, and no server side fetch of a user typed URL without an allowlist
- [ ] For a Scroll World build, the three scroll-specific checks are included
- [ ] The landing page section order was checked, each of the ten marked present, missing or skipped on purpose with a reason, and missing Problem, How it works or FAQ named in the report
- [ ] The interface pass was done in the browser, with any failing item fixed or listed
