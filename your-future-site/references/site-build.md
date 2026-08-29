# Site jobs: Makeover, Makeover Plus, Makeover Pro, Storefront

For when Tebex's own panel cannot get the client where they want to be. Everything here works on the **free** Tebex plan, because the catalog comes through the Headless API rather than from theming their hosted store.

## Which build is this?

| Tier | Price | Scope |
|---|---|---|
| **Makeover Plus** | $150 | Their site rebuilt across 3 pages, live Tebex catalog. The entry rung. |
| **Makeover Pro** | $350 | 4 to 6 pages, categorised store page, live status, SEO |
| **Storefront** | $750 | Full basket, coupons, gift cards, creator codes, CMS, multi-store |

**Every site ships with subpages. Never one long page.** The rule and the reason are in `SKILL.md`. It changes what Plus is, not what Pro is: Plus is 3 pages, Pro is still 4 to 6 and is sold on the categorised store, live status, Discord integration, SEO and the second revision round.

Full contents in `packages.md`.

## The entry rung: what it is and when it does not apply

**The $99 Makeover was retired on 10 August 2026.** It restyled an existing site in place. The cheapest thing on the list is now Makeover Plus at $150, which rebuilds their site across three pages, puts their live Tebex catalog on it, and carries their copy, images and links across. Three business days, one revision round.

Never describe it as working with what they already have rather than starting again. That described the retired product, and on this one it is not true.

**It cannot be applied to a Tebex store page.** That is exactly the thing Tebex will not let anyone edit on the free plan or the new storefront system. This matters because "make my store look better" is precisely how the request arrives.

Route it elsewhere when:

| Situation | Where it goes instead |
|---|---|
| Their only web presence is `*.tebex.io` | Custom store page at $120, or Build Plus for a site of their own |
| They have no site at all | Build Plus (same price and work as Makeover Plus, different word on the quote) |
| They want new pages or store integration | Makeover Pro |

Access is a collaborator invite on whatever platform hosts the site. Never a password.

## Building a Makeover Plus, Pro or Storefront

### 1. Confirm the token works before anything else

Fetch the catalog first, on day one. If the token is wrong or the catalog is structured oddly, that is a day-two problem, not a day-twelve problem.

```
GET https://headless.tebex.io/api/accounts/{public_token}/categories?includePackages=1
```

Check: does it return their real categories, are prices right, do packages have images, is the currency what you expect.

### 2. Design the homepage first, and get it approved

The process now puts a **free mockup before any payment**. One concept, one day. Design the homepage first and get it approved, but ship the mockup with its subpages in place, because a one page mockup sets the wrong expectation for what they are buying. The deposit follows once they are happy.

Only mock up after the discovery call, or you will spend a week designing for people who were never going to buy. If they want changes to the mockup, that is what the deposit is for.

### 3. Use the catalog module. Do not write a second one.

**It exists now**, as of 8 August 2026: `website/lib/tebex-catalog.js`, with the interface documented in `TEBEX-MODULE.md` at the root of the business folder. Sable Heights and Copperline both run on it. Pointing a build at a different store is one line, `STORE_CONFIG` in that build's `content.js`, and there are tests that fail if that stops being true.

This was the single most important engineering decision in the business, which is why it is now a shared file rather than an instruction. The same catalog code runs on every Makeover Plus, Pro and Storefront. Written once properly, a $150 job becomes five hours instead of fourteen. Written fresh each time, this business does not scale, and since the 10 August repricing it does not break even either. **If a job seems to need something the module does not do, extend the module, do not fork it into that client's folder.**

What it already handles, so nobody rebuilds it: normalising Tebex's package shape, sale prices, subscription labelling, HTML descriptions, the store's own currency, and the refusals below.

Read `TEBEX-MODULE.md` before touching catalog code. Two things in it will otherwise cost an afternoon each: our own `connect-src 'none'` policy blocks the first live read and looks exactly like a Tebex outage, and changing a basket quantity needs an authorised basket.

The module needs to:
- Fetch categories and packages. **Note a deliberate disagreement with the older wording here: it does not cache across page loads.** One fetch per page load, and no persistence. A cached price shown as live is the exact failure the rest of this business is built to avoid, and it is worth more than the saved request. If Tebex rate limiting ever becomes a real problem rather than a predicted one, revisit it then, with numbers.
- Render package/item cards: name, price, image, description, sale badge if one is active
- Handle a package with no image, because there will always be one
- **Degrade to a plain link-out to their Tebex store if the API fails or is slow.** A broken store section is worse than no store section, and Tebex will occasionally be slow.
- Keep currency and sale pricing exactly as Tebex reports it. Never recalculate prices locally.

### 4. Storefront tier only: basket and checkout

**Storefront only, and that includes mockups.** A basket is the single most expensive thing to give away by accident, so a Plus or Pro concept links out to the client's live Tebex package pages instead. See the mockup scope rule in `SKILL.md`.

Note what a basket is and is not. Tebex's own basket, the one on their hosted store, cannot be restyled: it is part of the template chrome, which is Plus only and disabled outright on the new storefront system. What we build is **our own basket on our own site**, with the Headless API holding the basket state behind it. Never describe that to a client as customising their Tebex basket.

Baskets, quantities, coupons, gift cards and creator codes all come from the Headless API. Checkout hands off through Tebex.js, either popup or inline. The payment screen itself stays Tebex's and is not ours to theme, so say so before the quote rather than at handover.

Handle these, because they will happen: basket expiry, a package removed from the store while it sits in someone's basket, and a checkout the player abandons and returns to.

### 5. What every tier needs regardless

- **Subpages, always.** Home plus at least a store page and a join page, with real navigation and a working back button. Never one long scrolling page. See `SKILL.md`.
- **Mobile first.** Most traffic is phones. Check on an actual phone viewport, not just a narrow window.
- **Open Graph tags.** Title, description, and one 1200x630 image. Without them the link looks broken in Discord, which is where servers actually spread.
- **Favicon.**
- **Fast.** These are content sites. If it is slow, something is wrong.
- **A visible store call to action** in the header and again on the page, worded as something other than "Store". "Support the server" and "Get VIP" both beat it.

### 6. Hosting and domains

The site ships on a URL you provide, with SSL, included in any care plan.

**Do not register, manage or renew domains.** If a client wants their own address, they buy it themselves and you hand them the record to point at it. Registering domains for clients means absorbing a recurring bill, owning a renewal you will eventually forget, and holding a client's address when a relationship sours.

## Handover

- Short screen recording of anything they can edit themselves
- A written doc alongside it
- Explicitly show them that **adding a package in Tebex makes it appear on the site by itself**. It is the feature they will be most pleased by and the best possible lead-in to the care plan pitch a week later.

## What never to build

- **A checkout of your own.** Cfx.re prohibit any payment provider except Tebex on FiveM, and breaking that can get the client's server shut down.
- **Anything that recalculates prices** rather than showing what Tebex reports.
- **Anything that breaks when Tebex changes.** Keep the catalog layer isolated so a breaking change is one fix applied everywhere, not one fix per client.
