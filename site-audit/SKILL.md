---
name: site-audit
description: Run the nineteen-point legal, accessibility and honesty audit over one website or every website at once, and fix what fails. Covers privacy, terms, cookies, refunds, form consent, tracking, third-party embeds, image licences, alt text, colour contrast, button labels, keyboard-friendly forms, Australian consumer and privacy law, fake reviews, unsupported claims and real business details. Use when the user says "audit my site", "check my websites", "is this compliant", "run the nineteen point check", "check accessibility", "check the legal pages", before handing a build to a client, or before anything goes live. Also use when the user asks whether a site could get them in trouble.
---

# Site audit: the nineteen points

A site that looks finished and a site that is safe to publish are different
things. This audit is the gap: the legal pages nobody wants to write, the
contrast nobody measures, and the claims nobody checks before they go out under
a real business name.

It loads every page in headless Chromium, so it judges the **rendered** page and
its **computed styles**, not the source. A meta tag that exists in a template
and never renders is a fail, and only the rendered page shows you that.

Tooling lives at `C:\Users\PC\OneDrive\Desktop\Claude\Skills\Site Audit`.

## Run it

```bash
cd "C:/Users/PC/OneDrive/Desktop/Claude/Skills/Site Audit"

# one site from local source
node audit.mjs "../../YourFutureSite/website" --name "Your Future Site" --md reports/yfs.md

# one live site (crawls up to 12 same-origin pages)
node audit.mjs "https://example.pages.dev" --name "Example"

# every site in sites.json, plus a combined reports/SUMMARY.md
node run-all.mjs
node run-all.mjs --only cliplabs     # just one
node run-all.mjs --live              # audit the deployed URLs, not local source
```

`sites.json` is the register: project name, local source directory, live URL,
and what kind of site it is. Add a row when a new site goes up.

## The nineteen

**Legal** 1 privacy policy · 2 terms · 3 cookies policy · 4 refund policy ·
5 form consent · 6 cookie consent · 7 only necessary data

**Tracking and third parties** 8 tracking · 9 third-party embeds ·
10 image copyright

**Accessibility** 11 accessibility basics · 12 alt text · 13 colour contrast ·
14 clear button labels · 15 keyboard-friendly forms

**Honesty and law** 16 Australian law · 17 fake reviews ·
18 unsupported claims · 19 real business details

Each returns `pass`, `fail`, `warn`, `manual` (a judgement only a human can
make) or `na` (genuinely does not apply).

## The helper scripts

| Script | What it does |
|---|---|
| `fix-decorative-svg.mjs <dir>` | Adds `aria-hidden="true"` to inline `<svg>` with no label, no role and no `<title>`. Skips anything deliberately labelled. `--dry` first. |
| `mark-unofficial.mjs <dir> --business "Name"` | Adds `noindex`, writes `robots.txt`, and pins a bottom disclosure bar saying the build is an unofficial concept and not affiliated. `--no-banner` for noindex only. |
| `mirror.mjs <url> <out>` | Mirrors a small static site whose source has been lost, so it can be edited and redeployed. |
| `probe.mjs <dir> [/path]` | Lists controls with no accessible name on one page. For chasing down a specific finding. |
| `shot.mjs <dir> <out.png> [/path]` | Screenshot with scroll-reveal elements forced visible. Use it to check a fix did not break the layout. |

## How to work it

Top to bottom, one item at a time: check it, fix it, re-run, move on. Do not
batch the report at the end from memory.

**Re-run after every fix.** The audit is the evidence. A fix you did not re-run
is a fix you are guessing about.

**When a finding looks wrong, it often is.** Scroll-reveal elements at
`opacity:0`, honeypot fields, `aria-hidden` click-shields, text over a hero
photograph and the mandated consumer-law wording all produced false positives
during the first build of this tool, and each one is now handled. If a new one
appears, fix the detector rather than working around it: an audit that cries
wolf gets ignored, which is worse than no audit.

**Never weaken a check to make a score look better.** If an item cannot be
closed without the client, mark it blocked and name exactly what you need.

## Things only the owner can supply

Do not invent these, and do not soften the finding because they are missing:

- A client's ABN, licence number or trading terms
- Whether a testimonial is real and who actually said it
- Where a photograph came from and what its licence allows
- Whether a superlative in the copy can be evidenced if challenged

## The rule about other people's businesses

A mockup built on spec carries a real business's name, phone and address, but
that business has not agreed to anything. Never write a privacy policy or terms
in their name: that publishes commitments on their behalf. Use
`mark-unofficial.mjs` instead, which keeps the link working, keeps the page out
of search, and says plainly on the page that it is not their website.

Fabricated reviews are the one to take most seriously. A star rating and a
"5.0 from Google reviews" line are factual claims. Inventing them breaches
Australian Consumer Law s18, and the ACCC has fined businesses for exactly
that. A "sample reviews" note only covers the page it is actually on.

## Done means

- [ ] Every item has an explicit result, and nothing is marked pass that was not re-run
- [ ] Every fix was verified against the live URL after deploying, not just locally
- [ ] Anything blocked names the person and the exact thing needed from them
- [ ] The layout was screenshotted after any CSS or structural change
