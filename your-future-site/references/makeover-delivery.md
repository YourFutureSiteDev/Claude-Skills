# Delivering a $150 Makeover Plus in four hours

Makeover Plus is the front door of the business and the only product that can lose money by
being done well.

**This file was written for the $99 Makeover, which was retired on 10 August 2026.** That
job restyled their existing site in place. This one rebuilds it across three pages with
their live Tebex catalog on it, and carries their content across. Same role in the business,
more work, an hour more budget, and a much tighter margin for error.

The arithmetic is from `BUSINESS-PLAN.md` section 7, not from anyone's judgement, and
`HOURLY_RATE` in `structure.js` is 40:

| Hours spent | Effective rate |
|---|---|
| Three | $50 an hour |
| **Four, the ceiling** | **$37.50 an hour** |
| Six, which is what a badly scoped one becomes | $25 an hour, and the ad hoc rate would have paid better |

**It only fits in four hours if the Tebex catalog is a reusable module.** Wiring the
Headless API by hand on each job is what turns this into a 14 hour loss. If that module does
not exist yet, building it is the job before this job.

Nothing about the client's site enforces the ceiling. This file does.

## The four hours, blocked out

The blocks sum to four hours exactly. They are a budget, not a suggestion, and the
checkpoint at the end of each one is where an over-run gets caught while it is still small.

| Block | Time | What happens |
|---|---|---|
| 1. Capture the before | 0:00 to 0:15 | Desktop and phone screenshots plus load time, through the capture harness. Same viewport, same wait condition, every time. Their old site is about to stop existing, so this cannot be taken later. |
| 2. Findings and salvage | 0:15 to 0:35 | Read the audit and pick the three problems that cost them most. In the same pass, take everything of theirs that comes across: copy, images, links. Nothing of theirs is lost is a promise on the quote. |
| 3. Home | 0:35 to 1:35 | Themed to their server, hero, and the store and Discord routes obvious rather than buried. |
| 4. Store page | 1:35 to 2:15 | Drop in the catalog module, wire their Headless public token, check real packages, prices, images and active sales are rendering. |
| 5. Join page | 2:15 to 2:35 | How somebody actually gets on the server. Connect details, rules link, Discord. |
| 6. Mobile across all three | 2:35 to 3:05 | Most of their traffic is on a phone, and there are three pages to check now rather than one. |
| 7. Speed and metadata | 3:05 to 3:30 | Oversized images, blocking fonts, then page titles, descriptions, favicon and the Open Graph link preview on every page. |
| 8. Capture the after | 3:30 to 3:45 | Same harness, same settings. If the numbers are inside the run to run spread, say no change rather than claiming one. |
| 9. Handover | 3:45 to 4:00 | The summary, the scope ledger, the care plan, and permission to use the before and after. |

Block 9 is not padding and it is not optional. It is where the money is, and a job that
runs out of time before reaching it has failed commercially even if the site looks better.

## Where it stops

Makeover Plus is three pages with their catalog on it. Everything in this table is a real,
priced piece of work, and doing any of it inside the $150 is a donation.

| The request | Where it actually goes |
|---|---|
| A fourth page | Extra page, $50. More than that means Makeover Pro, $350 |
| A categorised store page, live player count, Discord widget, SEO | Makeover Pro, $350 |
| Anything inside the Tebex panel | Store cleanup $120, or custom store page $120 |
| A logo | Logo and brand kit, $100 |
| Rewriting their copy beyond headings and buttons | Copywriting pass, $80 |
| Package or item images | Image pack, $80, ten images |
| Discord banners, icons, role colours | Discord rebrand, $80 |
| Basket, coupons, gift cards, CMS, multi store | Storefront, $750 |
| Faster than the normal turnaround | Rush, plus 50 percent of project price |

Two things are not on the ladder at any price, and the answer does not change if they offer
more money:

- **Making a purchase deliver in game.** That is a Tebex command or a script on their
  server. Point at the Tebex documentation, which is free and takes a minute, and stop.
- **Anything needing their password or their game server.** A Team Account invite or a
  collaborator invite, or the work does not happen.

## The stop rule

When a request arrives that is not in the three hour table, it gets one of exactly three
answers, and it is **surfaced every time**. It is never quietly absorbed and it is never
quietly dropped.

**1. Under five minutes, on a page already being worked, and needs nothing new.** Do it,
and record it in the ledger as a courtesy. This exists so the rule is not pedantic. A
client who watches a dead link get fixed for free trusts the next sentence more.

**2. It is on the add-on ladder.** Stop. Name the add-on and its price, say roughly how
long it adds, and ask. Do not begin it on the assumption they will say yes.

**3. It is above this tier.** Stop. Name the tier that includes it and quote the difference:
Plus to Pro is $200, Pro to Storefront is $400. **Do not offer a credit.** The 60 day
upgrade credit belonged to the retired $99 and no longer exists, so promising it now would
mean handing over a $350 Pro for $200.

And the budget check, which is what actually prevents the drift:

> **At the end of every block, compare the clock to the table. If the job is more than
> fifteen minutes over, stop and put it to the client as a decision before continuing.**

The three ways that decision can be put:

- Cut something. Name what gets dropped and let them choose.
- Convert it. The overrun is really a different tier, so charge the difference to it.
- Accept it once, deliberately, with the reason written in the ledger.

The rule is not that a Makeover can never run long. It is that **it can never run long by
accident**, because an overrun nobody decided on is invisible until the month's numbers
arrive and the answer is no longer available.

## The scope ledger, which every Makeover produces

Print this at handover. It is what makes the refusal above checkable rather than a good
intention, and it is also a genuinely useful thing for the client to read.

```
MAKEOVER LEDGER, <server name>, <date>
Time used      : <hh:mm> against a 4:00 budget
The three fixed: 1. …  2. …  3. …
Measured       : before <x.xx>s, after <y.yy>s   (or: not measurable, and why)
Courtesies     : <under-five-minute things done free, or "none">
Asked for and not done, with where each went:
  - <request>  ->  <add-on or tier, and price>
Payoff secured : <care plan | upgrade | add-on | NONE>
```

**If the last line says NONE, say so out loud rather than letting it pass.** That job was a
favour, and three of them in a month is the difference between a business and a hobby.

## The three ways a Makeover pays

The $150 is not the point and never was. It buys a client, and it pays through one of three
things happening in the same conversation, while they are looking at the difference.

1. **The care plan.** $20, $40 or $80 a month. A client on Care Basic is **$150 once plus
   $240 a year**, which is the whole argument in one line: the plan is the actual product
   and the build is how you meet them. Pitched at handover, not later, because the moment
   they can see the before and after is the only moment it is easy.
2. **The upgrade.** Charged as the difference between the tiers, since there is no credit
   any more. The plan watches this as a rate: **under 20 percent moving up a tier within
   their first quarter means the entry rung is absorbing demand rather than creating it.**
3. **The add-on attached the same afternoon.** A store cleanup at $120, a page at $50, an
   image pack at $80. Same conversation, same afternoon, context already loaded, so it is
   the cheapest hour this business ever sells. **That single attach doubles the job.**

**A Makeover that produced none of the three was a favour, not a sale.** That is the plan's
own wording. It is not a criticism of a particular job, it is a measurement, and it is why
the ledger carries that line.

For scale, from the same section: twelve entry rung jobs a month is $1,800, which is not a
living. Twelve that produce seven care plans, two upgrades and four add-ons is roughly
$2,900 that month plus about $224 a month of recurring revenue added permanently. **The
second number is the business**, and every one of those three payoffs is secured in block 9
or not at all.

## One warning about the before and after

Ask permission before using it, and ask at handover while they are pleased. The capture
harness will refuse to call a change an improvement when the difference is inside the run
to run spread, and that refusal stands. An unclaimed win costs a sentence. A claimed non
win costs the credibility the whole approach is built on.
