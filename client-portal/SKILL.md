---
name: client-portal
description: Build one Your Future Site client's branded payment page, so they can pay a deposit, an instalment, the final balance or a care plan through Square. Use whenever a Your Future Site quote is accepted, a project is created in Discord, or the user says anything like "make the payment page for X", "send them the deposit link", "they've agreed, set up payment", "build the portal for this client", "they want to pay in instalments", or asks how a client pays. Also use when `npm run portal -- pending` shows a project waiting for a page. One client at a time; this is not a portal system, a dashboard or a client login.
---

# Client payment page

One client, one page, one run. It asks three questions, builds a branded page,
creates the Square links behind its buttons, and hands the preview to Byron with
a send button. **It never sends anything to a client and never publishes.**

Byron settled the shape of this on 7 August 2026 and the decisions below are
closed. Do not reopen them, and do not build a dashboard, an admin panel, a
client login or a database. If a request needs any of those, say so and stop.

## The four things that must never happen

1. **Never handle or store card details.** Every button is a link out to Square's
   own hosted checkout. There is no form and no input on the page. If you find
   yourself writing one, you have taken a wrong turn.
2. **Never quote above $750 and never invent a fourth website tier.** The ladder
   is Makeover Plus $150, Makeover Pro $350, Storefront $750, and the $120 store
   cleanup and the care plans are separate ladders. The $99 Makeover was retired
   on 10 August 2026. The code refuses a project priced above the ceiling, and the
   ceiling is derived from the top tier rather than typed; do not route around it.

   Projects recorded before that date keep the price they were quoted. A record
   is the contract, so never rewrite one to match the new ladder.
3. **Never post to a client yourself, and never a DM.** The bot posts the link
   into that client's project channel, on Byron's tap. Not you, not a DM, not
   ever. This is the rule that protects the account.
4. **Never build a player-facing checkout for a FiveM client.** FiveM servers are
   locked to Tebex by Cfx.re, so giving a client their own checkout puts their
   server at risk. If a client asks, the answer is no and the reason is Cfx.re,
   not preference. See `TEBEX-CONSTRAINTS.md`. This page is for the client paying
   **us**, which is a different thing entirely and is fine.

## Where the amount comes from, which is the whole design

**The figure is derived from the accepted quote. It is never typed.** That is why
the page shows preset buttons rather than an amount box: the price has already
been validated against `bot/config/structure.js`, so it cannot drift, be
mistyped, or exceed the ceiling. A bare "type any number" on a deposit page
invites somebody to pay $50 against a $350 job, and then the argument is about
what was agreed rather than about the work.

`bot/src/portal.js` owns every one of those rules and is covered by
`bot/test/portal.test.js`. Read it rather than re-deriving the arithmetic:
deposits are exactly half, instalments only over $199, the parts of a split sum
back to the total to the cent, and care plans are a subscription that is never
netted off the build balance.

## Step 1: find the job

The trigger is the Discord project creation, not a manual invoke. When a quote
becomes a project, the bot records that a page is wanted. Start here:

```bash
cd bot && npm run portal -- pending
```

That prints the server name, the channel id, the package and the agreed price for
every project waiting. Take the channel id and look at the money before you build
anything:

```bash
cd bot && npm run portal -- show --project <channelId>
```

The preset list it prints is the complete set of amounts that page may offer.
**If a preset looks wrong, stop and tell Byron.** It came from the accepted quote,
so a wrong preset means the project record is wrong, and generating a page makes
the wrong number collectable.

**Manual fallback.** If somebody did not come through the quote flow there will be
no pending request. Ask Byron for the project channel id, or create the project
properly in Discord first. Do not invent a project record: `bot/data/*.json` is
the client list and the commission ledger.

## Step 2: the three questions

Ask these, once, in one message. They are Byron's own three and they are all the
theming needs.

1. **Who is it for?** Confirm the server name and the project, so the right job is
   being billed.
2. **What does their site look like?** You want an accent colour as a hex value,
   and whether the page should be dark or light. If they have a site, open it and
   take the colour off it rather than asking somebody to name one. If there is no
   site, say so and use the Your Future Site palette, which is the default.
3. **Their logo.** It must end up as a **local file** in `website/pay/assets/`.
   The site's CSP is `img-src 'self' data:`, so a hotlinked logo is blocked by the
   browser and the page renders with a hole in it. The generator refuses a remote
   URL rather than emitting a `src` that cannot load. No logo is fine: the page
   falls back to a wordmark and looks deliberate.

## Step 3: create the Square links

**This is the only step that touches the outside world, and it is a write to
Byron's real Square account.** Create one payment link per preset you intend to
offer. The request body is built for you, so that the amount in the link and the
amount on the page cannot disagree:

```js
import { paymentOptions, paymentLinkRequest } from './bot/src/portal.js';
```

Then for each preset, call the Square connector:

- service `checkout`, method `createPaymentLink`
- `quick_pay` needs `name`, `price_money` and `location_id`, all three required.
  `price_money.amount` is an **integer of cents**. Get the location id from
  service `locations`, method `list`.
- Pass a stable `idempotency_key` per preset, e.g. `<projectId>-<presetKey>`, so a
  retry cannot create two links for the same button.
- The response is documented by Square as `payment_link.url`. **That field has not
  been verified against this account**, so treat a missing url as a failure and
  say so; do not assume it is there.

**If Square is unavailable, build the page anyway and say which buttons are
dead.** This is the expected case in an unattended run: the connector needs an
interactive sign-in and, on 8 August 2026, a live call hung for the full 30 minute
idle timeout without answering. A preset with no link renders as a greyed
"Payment link not created yet", deliberately, because a button that is simply
absent reads as a finished page. The bot refuses to send a page where none of the
buttons work.

## Step 4: build the page

```bash
cd bot && npm run portal -- build --project <channelId> \
  --accent '#c8792a' --mode dark --logo assets/their-server.png \
  --links '{"deposit":{"url":"https://square.link/u/..."},"full":{"url":"https://square.link/u/..."}}'
```

It writes `website/pay/<slug>.html`, records the page against the project, and
prints which buttons have no link. It refuses a link that does not point at
Square, and it refuses a remote logo. **Do not write the HTML by hand.** A model
editing a payment page freehand produces one that is nearly the same as the last
one, and "nearly" is how a price ends up different on one client's page.

Then **open the page and look at it**. The prices cannot be wrong; the branding
can.

## Step 5: hand it over, and stop

Tell Byron it is ready and tell him the two things that are still his:

- **Deploy.** The page is not live until the site is deployed, and deploying is a
  live publish. The command is in `RESUME-HERE.md`. Never run it unattended.
- **Send.** In the project channel he runs `/portal preview`, looks at it, and
  presses **Send it to the client**. The bot posts the link into that channel and
  records it as sent. You never send it.

## What the page carries, and what it must not

| On the page | Never on the page |
|---|---|
| The agreed package, total, and what is outstanding | Card details, or any field that collects them |
| The preset buttons, each linking out to Square | An amount typed by anyone |
| The instalment split, worded the way the bot already prints it | Another client's name, an address, a phone number, invoice history |
| The scope line: we make it look right, we do not make it work in-game | Anything that implies we handle their players' payments |
| Who pays for what, from `BILLING_SPLIT` | A tier or a price that is not in `structure.js` |
| A backlink to the main site, so the page never orphans | An amount in the meta tags, because Discord unfurls the link |

`website/pay/README.md` explains the folder's three rules. Read it before putting
anything in there by hand.

## If you are asked to change the money rules

Change `bot/src/portal.js` and its tests, never the HTML. The page is a view. A
price edited into the HTML changes what the page says and not what Square charges,
which is the worst of both.
