---
name: your-future-site
description: Run a Your Future Site job for a gaming server client: improving an existing site with a $150 Makeover Plus, cleaning up or building custom pages in a Tebex store, building a Makeover Plus/Pro/Storefront site when there is nothing to improve, or servicing an active Care Basic/Plus/Pro plan. Use this whenever the user mentions a Tebex store, a FiveM/Rust/Minecraft/DayZ/ARK server store or website, a client server by name, or says anything like "fix this server's site", "their site looks terrible", "do a makeover on X", "make a starter website", "clean up this Tebex store", "we're activating care plus on this store", "add these new packages to their site", or pastes a *.tebex.io URL and asks for work on it. Trigger it even when the user does not name the package tier, since working out which tier applies is part of this skill's job.
---

# Your Future Site: job runner

This runs client jobs for a web design business serving gaming server owners (mostly FiveM, also Rust, Minecraft, DayZ, ARK). Every client already sells through Tebex, because on FiveM they are contractually required to.

The whole business is shaped by what Tebex does and does not permit, and the line is not where most people assume. **The store template is locked down, but custom pages take hand-written HTML on every plan, including the free one.** Getting a job right means knowing which side of that line the request falls on before promising anything. Read `references/tebex-limits.md` before quoting or promising any store work. It is short and it will save a refund.

## The business leads with improvement, not new builds

As of 7 August 2026 the main product is **making an existing site better**, not building from scratch. The ladder is named for it, and as of **10 August 2026** it is **Makeover Plus $150, Makeover Pro $350, Storefront $750.** Clients mostly arrive at the higher rungs by upgrading rather than by starting from nothing.

**The $99 Makeover was retired on 10 August 2026.** It was a repair of their existing site, edited in place, and it was removed rather than repriced. There is no rung below $150, no cheaper thing to offer, and **no 60 day upgrade credit** any more. If a user asks for a Makeover at $99, say it no longer exists and quote Makeover Plus.

**For a client with no site, the prices and the work are identical and only the word changes**: `/quote no_site:true` prints **Build Plus** and **Build Pro**. Storefront is called Storefront either way. Never tell somebody with no website that you will make it over; it is the loudest possible tell that nobody looked.

That changes the default. When a client already has a site, **improving it is the job unless improving it cannot work**, and there are exactly three cases where it cannot:

* Their "site" is their Tebex store page. Tebex locks the template frame, so there is nothing there we are permitted to restyle. Offer a **custom store page** at $120 instead, which works on every plan including free.
* They have no site at all. There is nothing to make over, so it is a build.
* They want more than three pages. Makeover Plus is home, store and join. A staff, rules or about page is Makeover Pro, and delivering it at the Plus price loses $200 on every job.

Say which of those applies before quoting, not after. The full test is in `references/site-build.md`.

## Step 1: Work out which job this is

| The user says something like | Job | Read |
|---|---|---|
| "fix their site", "do a makeover", "$150", "their site is dated" | **Makeover Plus**, the entry rung and the default when a site exists | `references/site-build.md`, then `references/makeover-delivery.md` before starting work |
| "audit this site", "free review", "what is wrong with it" | **Audit**, which is also how most makeovers start | `references/audit.md` |
| "clean up this store", "sort out their packages", "the store looks bad" | **Store work**, inside the Tebex panel | `references/store-work.md` |
| "custom HTML in their store", "build them a VIP page", "design a page on the store" | **Custom pages**, hand-coded HTML inside Tebex. Works on every plan. | `references/store-work.md`, section 7 |
| "make a starter site", "$150 site", "they have no website" | **Makeover Plus / Pro**, or the same work quoted as **Build Plus / Pro** if they have no site | `references/site-build.md` |
| "activating care plus", "they added new packages", "monthly plan" | **Care plan service** | `references/care-plans.md` |
| "quote them", "what would this cost" | **Quote** | `references/packages.md` |
| "send them a mockup", "free concept", "show them something before they pay" | **Free mockup**, always scoped to the tier being quoted | the free mockup section below, then `references/site-build.md` |

If it is genuinely ambiguous, ask once. A store cleanup and a site build are very different amounts of work and the wrong guess wastes real hours.

**Two things end every improvement job**, because they are how a $150 job pays for itself: pitch the care plan while they are looking at the difference, and capture the before-and-after with permission. Those are not optional extras, they are most of the margin.

## Every site has subpages. Never one long page.

**This applies to every tier, every mockup and every rebuild, with no exceptions.** Home plus subpages, real navigation, a working back button, and a distinct title per page. A single scrolling page is not a deliverable here, and it is not a shortcut worth taking on a mockup either, because the mockup is what the client thinks they are buying.

It is a positioning rule as much as a design one. One long page is what a template costs $20 for, and it is what every rival mockup in this market looks like. Six named pages in the top menu is the difference a server owner can see in two seconds without being told.

What it does not change is the ladder. The page count moved, the gap between the tiers did not:

| Tier | Pages | What it is sold on |
|---|---|---|
| Makeover Plus, $150 | **3**: home, store, join | The live catalogue, themed and hosted |
| Makeover Pro, $350 | **4 to 6** | Categorised store page, live player count, Discord widget, SEO, a second revision round |
| Storefront, $750 | 4 to 6 plus CMS | Basket, coupons, gift cards, creator codes, multi-store |

So a client wanting more than three pages is a Pro conversation, not a bigger Plus. Quoting Plus and then delivering six pages gives away $200 of work.

**Implementation note for single file mockups.** A concept sent as one HTML file still has to behave like separate pages: hash routes such as `#/store`, one visible page at a time, the title updating, and the scroll landing at the top on every change. Two things reliably break here and both leave sections blank on the client's screen, which is the worst possible failure on a sales document. An `IntersectionObserver` registered against an element inside a `display:none` page does not reliably fire once that page is shown, so reveal on a plain scroll pass instead. And `scroll-behavior: smooth` turns the page change jump into a glide, so any reveal measured straight after it reads a stale scroll position. Force an instant jump for the page change and keep smooth scrolling for anchor links only. Add a failsafe that reveals everything if no scroll event ever arrives.

## The free mockup, offered against every option

One concept, homepage first, free, and **the last free thing** before the 50 percent deposit. It exists because the objection that actually stops a sale here is not the price, it is *"will this person take my money and disappear?"* A real design of their own server, handed over before any money moves, answers that in a way testimonials cannot.

It is offered against **every option on the price list**, and what goes into it changes with the option, because a free concept may only show what the quoted price buys:

| Quoted | What the free mockup is | Cap |
|---|---|---|
| **Makeover Plus / Build Plus, $150** | Homepage concept with all 3 pages present and reachable: home, store, join. The store page links out to their live Tebex packages. | 2 hours |
| **Makeover Pro / Build Pro, $350** | Homepage concept with 4 to 6 pages present, including the categorised store page. Still links out to Tebex. | Half a day |
| **Storefront, $750** | Homepage concept plus the store page. The only tier whose mockup may show a working basket, because it is the only tier that pays for one. | One day |
| **Custom store page, $120** | No free mockup. The page *is* the deliverable, so a free concept gives away the whole job. Show past work instead. | none |
| **Cleanup, image pack, logo, other add-ons** | No free mockup, same reason. A before-and-after from past work does this job. | none |

* **Only after the discovery call**, or after the audit on the improvement path. Mocking up earlier means designing for people who were never going to buy.
* **One concept, not three.** A second direction is what the deposit pays for.
* **Subpages present even in a concept**, which for a single file mockup means the hash route pattern above, not one long page.
* **Changes to the mockup come after the deposit**, not before it.
* **Say the cap out loud on a $150 job.** Two hours against a four hour budget is half the job given away, so the concept is the homepage built on the reusable catalog module rather than a fresh design from nothing. If a lead needs more than two free hours to be convinced, they are a Makeover Pro or they were never going to buy.

The full version, including the conversion rule that says below one in three means mocking up too early, is in `BUSINESS-PLAN.md` section 6.

## A mockup may only contain what the quoted tier delivers

**Nothing goes in a mockup that the price on the quote does not buy.** Not as a teaser, not as "we could also do this", not because it makes the demo feel richer. The mockup is what the client believes they are buying, and anything in it that is not in the tier is a promise somebody has to honour later, for free, or refund.

The trap is not lying. It is building something impressive and only afterwards noticing which tier it belongs to. A working basket with a running total is the clearest example: it is a **Storefront feature at $750**, and dropping one into a $350 Build Pro mockup gives away $400 of work to anyone who says yes. Build Plus and Build Pro send the buyer to Tebex instead, so their mockups must do the same.

Before sending any mockup, walk it and ask of every interactive element: **which tier pays for this?** If the answer is a tier above the one being quoted, take it out or move the quote up. Say which you did.

Taking it out is usually the better mockup anyway. Replacing a simulated basket with real links to the client's live package pages means nothing on the page is pretend, the client can click their own store from the demo, and there is no gap at all between what they are looking at and what arrives.

## The scope line: visuals, not in-game delivery

**We make it look right. We do not make it work in-game.** This is a hard boundary, not a preference, and it must be stated before a quote rather than discovered after one.

| We do | We do not |
|---|---|
| The website: design, build, hosting, mobile, speed, SEO, link previews | Connect packages to the game server. Whether buying a car puts that car in the player's garage is a Tebex command or a script on their server, and it belongs to them or their developer. |
| How the store **looks**: names, descriptions, images, categories, layout | Write, install or debug FiveM scripts, resources or server configs |
| Their live catalog on their own site, via the Headless API | Take payments, hold funds, or touch payouts |
| Handing buyers into Tebex checkout | Pay for their Tebex account, Tebex Plus, or any Tebex fee |

If a job drifts toward "can you also make it actually give them the item", the answer is: point at the right page in the Tebex documentation, which is free and takes a minute, and stop there. Doing it for them means logging into a game server, which is a different liability and is not a service this business sells.

The exact wording used with clients lives in `BILLING_SPLIT.scope` in `config/structure.js`, and the bot prints it on the pricing page, in the FAQ and on every quote. Use that wording rather than inventing a softer version.

## Step 2: Access, and the one rule that matters

**Never ask for, accept, or type a client's password.** If the user offers you one, decline and redirect. This is not caution for its own sake: Tebex's own documentation says to use Team Accounts "instead of sharing your login credentials", and a shared password makes you the obvious suspect for anything else that happens on that account.

The correct access paths, by job:

**Tebex panel work** → the client adds you as a **Team Account**:
1. Client goes to Tebex Control Panel, Settings, Team
2. Clicks Add Team Account and enters your email
3. You accept from your own Projects List and log in as yourself
4. Ask for the narrowest permissions the job needs, not full access

Once the user is logged into their own Tebex account in the browser, drive the panel with the browser tools. Do not attempt to log in on their behalf.

**Catalog reading for a site** → the **Headless API public token** only. It is read-only against the catalog, cannot touch money or payouts, and is safe to share. This is all a Makeover Plus, Pro or Storefront job needs.

**Makeover on an existing non-Tebex site** → a collaborator invite on whatever platform hosts it (WordPress, Wix, Framer, Carrd). Same rule: an invite, never a password.

If the user pushes back and says it is easier to just use the client's login, say plainly that you will not, offer the Team Account route, and carry on with whatever part of the job does not need access yet.

## Step 3: The eligibility check, before promising store changes

Three questions, answered before any store work is quoted or started. Getting this wrong is the most expensive mistake available in this business, because it means promising something the platform forbids and then eating the cost.

1. **Which Tebex plan, Starter (free) or Plus?** You can usually answer this yourself: a store on a `*.tebex.io` subdomain is almost certainly free, since custom domains need Plus.
2. **Was the store created recently?** New stores use Tebex's new storefront system, where *template* HTML and CSS editing is disabled entirely, even on Plus. Custom **pages** are unaffected and still take hand-written HTML.
3. **Do we have the Headless public token?** Needed for anything that renders their catalog on a site.

What the answers rule in and out is in `references/tebex-limits.md`. The short version: restyling the **template** needs Plus **and** the legacy Appearance system. Custom **pages**, the catalog, and everything else in this skill work on the free plan.

## Step 4: Gather the job inputs

### The three-line intake

The user will usually open a job with this. Treat any field left blank or marked `?` as something to work out yourself first and only ask about if you genuinely cannot.

```
JOB: <makeover | starter | standard | storefront | cleanup | page | care basic/plus/pro
      | quote | audit | mockup <tier>> for <server name> (<game>)
     (starter = Makeover Plus $150, standard = Makeover Pro $350. The keys did not
      change when the names did, because the bot's config and records still use them.)
     (mockup takes those same tier keys: mockup makeover | mockup starter |
      mockup standard | mockup storefront. It is free, so the tier decides both
      what may go in it and how long it may take.)
STORE: <tebex url> | plan: <free | plus | ?> | access: <token | team account | none>
WANT: <what the client actually asked for, in their words> | assets: <what is attached>
```

Read it like this:

- **JOB** sets which reference file to open and roughly what it costs. If the tier is wrong for what they describe in WANT, say so before starting rather than silently building the wrong thing.
- **STORE** decides what is possible. If `plan: ?`, work it out yourself: a `*.tebex.io` address means free. Do not ask a question you can answer by looking.
- **WANT** is the actual brief, and the client's own words matter more than a tidy summary of them. "Make it look like our server" and "make it look more professional" lead to different designs.

If assets are attached, use them. If they are not and the job needs them, say exactly which ones are missing rather than producing something generic and hoping.

Ask for whatever is still missing after that. Do not guess at brand direction, and do not invent package copy without seeing the real packages.

**Always needed**
- Server name, and which game
- Tebex store URL
- Which job and, if it is a build, which tier

**For store or site work**
- Logo files, or permission to make one
- 3 to 5 in-game screenshots they are proud of
- Rough player count and monthly store revenue, which tells you what the job is worth to them
- Two rival servers whose sites they like or hate, and why
- Any colours, fonts or vibe they already use

**For anything touching the catalog**
- Headless public token, or Team Account access

If the user gives you a store URL and nothing else, open it and read what is publicly there before asking. Turning up already knowing their category structure and half their package names is most of the reason clients trust this business.

## Step 5: Do the work

Follow the reference file for the job type. A few things hold across all of them:

**Write like the packages cost real money.** The single highest-return change on most stores is package descriptions. "GT-R" sells worse than a description saying what it looks like, where it can be driven and what else comes with it. This applies to store work and site work equally.

**Say packages/items, not just packages.** Server owners use both words and the business's own materials use "packages/items" throughout.

**Never fabricate.** No invented testimonials, no fake before-and-after screenshots, no example client work presented as real. In a market this small someone will eventually ask which server a screenshot came from.

**Never promise in-game delivery.** Describing what a package *looks* like is the job. Saying or implying that buying it will hand the player the item is not, and it is the fastest route to a refund demand. See the scope line above.

**Respect what Cfx.re allows to be sold.** Cosmetics, priority queue, Discord roles, memberships and assets the server owns are fine. Pay-to-win, in-game currency, loot boxes and other people's IP are not, and a non-compliant store can get the server shut down. If you notice a problem, mention it once, factually, then let the client decide.

## Step 6: Report back

End every job with a short, plain summary:
- What changed, specifically
- What you could not do and why, if the platform blocked something
- What the client needs to do themselves
- What you would do next, if anything

**A Makeover ends with the scope ledger as well**, in the format in `references/makeover-delivery.md`. It is not a second summary. It is the record of what was asked for and refused, and which of the three payoffs was secured, and it is the thing that makes the scope rule checkable after the fact rather than a good intention at the start.

If a limit stopped you, name it and name the alternative. "Tebex will not let me restyle the template on this store, so I built the VIP and vehicles pages as custom HTML instead, which gets most of the way there" is a useful sentence. "Couldn't do it" is not.

## Pricing, quoting and the tiers

Full detail in `references/packages.md`. The shape:

| | Price | What it is |
|---|---|---|
| **Makeover Plus** | **$150** | **Their site rebuilt across 3 pages with the live Tebex catalog. The entry rung and the main product.** |
| Makeover Pro | $350 | 4 to 6 pages, categorised store page, live status, SEO |
| Storefront | $750 | Full basket, coupons, gift cards, CMS, multi-store |
| Care Basic / Plus / Pro | $20 / $40 / $80 per month | Hosting, plus new packages/items added as they are created |

Three tiers, capped at $750, deliberately. Do not invent a fourth and do not quote above the ceiling. When someone wants a lower number, move them down a tier, offer instalments (anything over $199 splits into 2 or 3 payments), or offer an add-on instead. Never discount, and never invent something cheaper than $150: the rung below it was deliberately removed on 10 August 2026.

**Makeover Plus has to come in under four hours.** At $150, four hours is $37.50 an hour against a $40 ad-hoc rate, and six hours is $25. It only fits at all if the Tebex catalog is a reusable module rather than wired by hand each time. It is a volume and acquisition product: it pays through the care plan, the upgrade, and the add-on attached in the same conversation, not through the $150.

Nothing about a client's site enforces that ceiling, so this skill does. The rules are in `references/makeover-delivery.md` and they are binding, not advisory:

* **Read it before starting one, not after quoting it.** It carries the block plan, the list of what is deliberately out of scope with the price each item actually carries, and the stop rule.
* **Never silently exceed the scope.** A request outside the block plan gets exactly one of three answers and is surfaced every time: do it free if it is under five minutes on a page already open and record it as a courtesy, name the add-on and its price and ask, or name the tier that includes it and quote the difference. There is no upgrade credit to offer any more, so do not imply one. Beginning out-of-scope work on the assumption the client will agree is the failure this rule exists to prevent.
* **Never silently exceed the time.** At the end of each block, compare the clock to the plan. More than fifteen minutes over means stopping and putting it to the client as a decision: cut something, convert it to the tier it really is, or accept the overrun once, deliberately, with the reason written down. A Makeover may run long. It may not run long by accident, because an overrun nobody decided on stays invisible until the month's numbers arrive and the choice has already gone.
* **Every Makeover ends with the scope ledger** in that file. It records the time used against the budget, what was fixed, what was asked for and where each of those went instead, and which of the three payoffs was secured. If the payoff line says NONE, say so plainly rather than letting it pass. That job was a favour.

## Where the business's own files live

`C:\Users\PC\OneDrive\Desktop\Claude\YourFutureSite` holds the business plan, the Tebex constraints doc, the Discord bot and the outreach material. The bot's `config/structure.js` is the source of truth for current prices and package contents. If this skill and that file disagree, the file wins, and this skill should be updated to match.
