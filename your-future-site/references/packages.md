# Packages, pricing and quoting

The bot's `config/structure.js` at `C:\Users\PC\OneDrive\Desktop\Claude\YourFutureSite\bot\` is the source of truth. If it disagrees with this file, it wins, and this file should be updated.

## The three packages

**There are exactly three packages: $150, $350 and $750.** Do not invent a fourth and do not quote above the ceiling.

**The $99 Makeover was retired on 10 August 2026**, along with its 60 day upgrade credit. It was a repair service rather than a tier, and it was removed rather than repriced. There is nothing below $150 and nothing cheaper to fall back on, which is deliberate: a business with a $99 option sells $99 jobs.

Every tier now needs the client's Headless public token, because the retired $99 was the only one with no Tebex dependency.

### Makeover Plus, $150
The entry rung and the front of the business.
- 3 pages with real navigation: home, store, join. Never one long page, see the rule in `SKILL.md`
- Mobile responsive, themed to their server
- Hosted, live and secured
- Real package/item names, prices, images and active sales, updating themselves
- Their copy, their images and their links come across. Nothing of theirs is lost
- 3 business days, 1 revision round
- **Must come in under four hours**, which needs the catalog module. See `makeover-delivery.md`

### Makeover Pro, $350
- Everything in Makeover Plus, including the live catalog
- 4 to 6 pages instead of 3: home, about, rules, staff, store, join
- A proper store page with packages/items grouped into categories
- Live player count and server status
- Discord widget and invite integration
- SEO and link preview cards
- 7 days, 2 revision rounds

### Storefront, $750
- Everything in Makeover Pro
- A real storefront on their own site: basket, quantities, coupons, gift cards, creator codes
- Rules and changelog editable by them through a simple CMS
- Custom animations and a designed component system
- Multiple servers or stores
- 14 days, 3 revision rounds

## Care plans

$20 / $40 / $80 per month. Full detail in `care-plans.md`.

## Add-ons

| Add-on | Price | Notes |
|---|---|---|
| Tebex store cleanup | $120 | No code, works on any plan, no eligibility check. The easiest sale. |
| **Custom store page** | **$120 first, $70 each after** | A hand-coded HTML page inside their Tebex store, on their store URL. Works on **every plan**, including free. VIP comparison tables, vehicle showcases, rules, "new here" pages. |
| Tebex theme (CSS) | $120 | **Plus with legacy Appearance only.** Check every time. |
| Package/item image pack (10) | $80 | |
| Logo and brand kit | $100 | |
| Discord server rebrand | $80 | |
| Extra page | $50 | |
| Copywriting pass | $80 | |
| Rush delivery | +50% | Halves the turnaround |

Hourly rate for out-of-plan work: **$40**.

## Payment

- **50% deposit** once they are happy with the free mockup, 50% on approval before launch
- **Anything over $199 splits into 2 or 3 payments.** No interest, no fees, no credit check. Offer it in the quote rather than waiting to be asked, since the people who most need it are the least likely to ask.
- Card or PayPal. They own the site outright.

## Who pays for what

State this on every quote. Ambiguity here produces exactly one outcome, which is an angry message about a charge you did not make.

**We cover:** hosting for the site we build, SSL, backups, security patches.

**The client pays directly:** their Tebex account and any Tebex fees, Tebex Plus if they ever choose it (nothing we build requires it), Tebex platform and processing fees of roughly 5% plus 2.9% + $0.30 per sale, and a domain name if they want one.

Never absorb or mark up any of those. A $20/month care plan stops being profitable the moment it is quietly funding someone's £12.49 Tebex subscription.

## Holding the line on price

When someone says a number lower than the quote, the answer is **not** a discount. It is a smaller package or an instalment plan.

Dropping a $350 build to $250 teaches the client your prices are fiction and leaves you doing $350 of work. Moving them down to $150 Makeover Plus, or splitting a bigger tier into instalments, keeps the price list honest and still gets you the customer.

**Do not go below $150.** The whole ladder came down between 25 and 40 percent on 10 August 2026, and that was the concession. There is no rung underneath it, so when $150 is genuinely out of reach the honest answers are an add-on they can afford, such as a $120 store cleanup, or letting them go.

## The pitch

**The arithmetic.** A server making $600 a month on Tebex that lifts conversion 25% recovers a $150 build in about five weeks, and a $350 one in about twelve. Use their real numbers, which is why monthly store revenue is one of the discovery questions.

**Nothing requires Tebex Plus.** Every competitor selling "custom Tebex themes" is quietly requiring a £12.49/month upgrade that, on a newer store, still will not give them what they were sold. This is checkable and it is worth saying in every quote.

**The free mockup.** The objection that actually kills deals here is not price, it is *"will this person take my money and disappear?"* Half this market has been burned by a freelancer. A real design of their own server, before any money changes hands, answers that better than any testimonial.

It also does the job the retired $99 used to do. That rung was the cheap easy yes that turned an audit into a customer; with it gone, the mockup is what stands between a free audit and a paying client. It has a time cap per tier for exactly that reason, in `SKILL.md`.
