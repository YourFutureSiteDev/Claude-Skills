---
name: site-launch-check
description: Run the twenty-one-point pre-launch check on a website before it goes live or gets handed to a client, and fix what fails. Covers legal pages, SEO plumbing, share previews, forms, links, accessibility, mobile, performance and exposed API keys in the shipped code, then a landing page section order check for Your Future Site client sites (Hero to final call to action, flagging a missing Problem, How it works or FAQ), a service page section order check for every service subpage in the sitemap, and a short interface pass from the Vercel Web Interface Guidelines. Use when a site is about to be published, deployed, handed over or invoiced, or when the user says "is this ready to launch", "check the site before it goes live", "pre-launch check", "did we miss anything", or asks what is left to do on a build. Also use before sending any client a preview link.
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
`bash scripts/sections.sh <url>` first: it prints every h1, h2, h3 and
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

## Service page section order (YFS client sites)

The home page and a service page do different jobs. The home page positions
the business and routes people: who and where, the call to action above the
fold, proof near the top, a link to every service page, and a booking path
that works from all of them. The ten rows above check that. A service
subpage has one job, selling one service to someone who already knows they
need it, and it sells in this order:

| # | Section | What it has to do |
|---|---|---|
| 1 | **Service value proposition** | The h1 names the one service and the line under it says the outcome, in the visitor's words, with the call to action right there. |
| 2 | **What to expect** | What it is like for the customer: who turns up, how long it takes, what to do first (access, keys, pets, kids), any mess or time off the premises. |
| 3 | **Concrete deliverables** | Exactly what they get: what is inspected, installed or treated, what the report contains, the receipt, the warranty. A list beats adjectives. |
| 4 | **Process steps** | Three to five steps from first contact to done (ring, quote, the job, the follow up). Numbered is best; a short paragraph that walks the steps in order counts. |
| 5 | **Proof** | Evidence for this service that someone other than the owner would accept: reviews that name it, a licence number, real job photos, an accreditation. "20 years" on its own is a claim, not proof. Never invented. |
| 6 | **Differentiator** | Why this business rather than the next search result, for this service: one person start to finish, a report written in plain English, no lock in plan. |
| 7 | **How pricing works** | A price, a "from" price, or how quoting works: on the phone, free on site, call out fee or none. Never skipped: quote only work says how quoting works. |
| 8 | **FAQ** | The questions the owner answers about this one service every week. |
| 9 | **One call to action** | One action, in the hero and again as the last thing on the page, phone tappable. Anything else (send a photo, see the checklist) looks secondary. |

Run `bash scripts/sections.sh --sitemap <live url>` first. It reads the
site's `sitemap.xml` and prints the h1, h2, h3 and section ids of every page
in it, so the home page and every service page are outlined in one pass.

How to report it:

- One table per service page, the nine rows down the side, each **present**,
  **missing** or **skipped on purpose**, the same as the landing page check.
- **A row is present only when a heading `sections.sh` printed introduces
  it, or the first lines under one do.** Name that heading in the report. A
  line that only shows up in a hero button or the contact band ("Ring for a
  price") does not count: mark the row missing and quote the line, so the
  fix is obvious.
- **Process steps, Proof, How pricing works and FAQ** are the four service
  pages usually leave out. Look for those first and name them when absent.
- If the home page already has the missing block (a "how it works" strip, an
  FAQ, a price line), say so: the fix is moving or copying the part that
  belongs to this service, not writing new copy.
- Proof and FAQ are often blocked on the owner: no public reviews yet, no
  licence number supplied, nobody has said what customers ask. Mark them
  missing with "needs X from the owner". Never fill them with invented
  reviews or invented questions (item 20 applies).
- Order matters less than presence, with the same three exceptions: the
  call to action is in the hero, proof comes before pricing, and the final
  call to action is the last section.
- A service the home page lists that has no page of its own is a finding
  too. Every service gets its own page.

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
- **One main action per screen (Hick's law).** Each screenful has one
  primary call to action that looks like the primary one. Two equal
  buttons side by side slow the decision, so make one of them secondary.
  The nav has seven items or fewer.
- **Main buttons big and in thumb reach (Fitts's law).** On a phone, the
  enquiry or call button is full width or close to it and sits in the
  lower half of the screen where the thumb rests, not tucked in a corner
  of the header.
- **The ending is designed (peak end rule).** People remember the best
  moment and the last one. The form success state says what happens next
  and when ("We'll reply within one business day"), not just "Sent". The
  footer finishes the page properly: contact details, hours, and one last
  call to action.

## Skeptic pass

Run this after the twenty-one, before writing the report. For every item
marked failing, and every bug found along the way, try to prove the finding
wrong. Reload the page, test at the other width, check the live URL rather
than the local copy, and read the actual code. Only findings that survive
go into the report. Anything you could not reproduce is dropped or marked
"could not reproduce" with what you tried. This stops false alarms reaching
a client, which costs more trust than a missed nitpick. The idea came from
a reel about a security audit skill that hands every finding to a separate
agent whose only job is to disprove it. For a big site, run the skeptic as
its own subagent, so it isn't marking its own work.

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
- [ ] Every service page in the sitemap was checked against the service page section order with `sections.sh --sitemap`, each of the nine marked present, missing or skipped on purpose, and every present row names the heading that carries it
- [ ] The interface pass was done in the browser, with any failing item fixed or listed
- [ ] Every finding in the report survived the skeptic pass; anything that could not be reproduced is dropped or marked as such
