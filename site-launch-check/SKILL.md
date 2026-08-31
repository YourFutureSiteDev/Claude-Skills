---
name: site-launch-check
description: Run the twenty-point pre-launch check on a website before it goes live or gets handed to a client, and fix what fails. Covers legal pages, SEO plumbing, share previews, forms, links, accessibility, mobile and performance. Use when a site is about to be published, deployed, handed over or invoiced, or when the user says "is this ready to launch", "check the site before it goes live", "pre-launch check", "did we miss anything", or asks what is left to do on a build. Also use before sending any client a preview link.
---

# Pre-launch check

A site that looks finished and a site that is finished are different things.
The gap is always the same twenty items, and it is always the same ones that
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

## The twenty

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

- [ ] All twenty items have an explicit result: pass, fixed, or blocked with a reason
- [ ] Nothing is marked as passing that you did not load in a browser and look at
- [ ] Every form on the site was actually submitted and the message confirmed as received
- [ ] The share preview was checked by rendering the URL, not by reading the tags
- [ ] The mobile check was done at 375px, not a resized desktop viewport
- [ ] Broken-link checking covered the whole site, not only the home page
- [ ] Any item you could not check without the client or their accounts is listed as blocked, naming what you need from them
- [ ] For a Scroll World build, the three scroll-specific checks are included
