# Care plans: ongoing service

The recurring side of the business, and the part that turns it from a series of jobs into something that pays whether or not you sell anything new that month. Target: 60% of build clients on a plan.

| Plan | Price | What they get |
|---|---|---|
| **Care Basic** | $20/mo | Hosting, SSL, uptime monitoring. New store packages/items added as they create them, with **basic images** matched to their branding. Weekly backups. Security patches. |
| **Care Plus** | $40/mo | Everything in Basic, plus **detailed images** made individually rather than from a template, catalog sync kept working when Tebex changes things, and 1 hour of changes each month. |
| **Care Pro** | $80/mo | Everything in Plus, plus 3 hours of changes a month, priority support, and seasonal or event store pages. |

## Activating a plan

When the user says something like *"we're activating care plus on this store"*:

1. **Confirm which plan**, since the images differ between Basic and Plus and that is the main thing being bought
2. **Confirm the store**, by URL, and that the token still works
3. **Baseline the catalog**: fetch and save the current categories and packages, so you can tell later what is genuinely new
4. **Check the site is healthy** before taking money for maintaining it: does it load, does the catalog render, is SSL valid, does it work on mobile
5. **Fix anything already broken** before starting the plan, and say what you fixed. Starting a maintenance plan on a broken site sets the wrong expectation immediately.
6. **In Discord**: `/tier give @them care` and set their client tier role
7. **Tell them what they now get**, in plain terms. The line that lands: *"Every time you add a package to Tebex it shows up on your site, and I make sure it looks right."*

## The recurring work: new packages/items

This is what people are actually paying for. Because the catalog is read live from Tebex, new packages appear on the site by themselves. Appearing and *looking right* are different things, and the gap is the service.

**When the user says new packages have been added:**

1. Fetch the catalog and diff it against the saved baseline
2. For each genuinely new package/item, check:
   - Does it have an image? If not, that is your job.
   - Is it in the right category, or has it landed in a flat list?
   - Does the description actually describe it, or is it one word?
   - Does it need its own placement, for example a bundle or a new top tier that should be featured
3. Make the images at the plan's level:
   - **Basic (Care Basic):** from the client's branded template. Consistent size, background and treatment. Minutes each once the template exists.
   - **Detailed (Care Plus and Pro):** made individually for that item. The actual vehicle or cosmetic, framed properly, lit properly.
4. Update the saved baseline
5. Tell them it is done, with a link. This is the moment the plan justifies itself, so do not let it pass silently.

**Build the branded template early.** It is what makes Care Basic profitable at $20/month. Without it, every new package is a bespoke job at a price that does not support one.

## Keeping the catalog sync alive

Care Plus and Pro explicitly cover this, and it is the real technical risk in the business: every site with a live catalog depends on a third-party API Tebex can change without warning.

- Keep the catalog layer as one shared module so a breaking change is one fix applied to everyone, not one fix per client
- Monitor for the catalog failing to render, not just for the site being down. A site that loads fine with an empty store section will not trip uptime monitoring but is costing the client money every hour.
- Always degrade to a link-out to their Tebex store rather than showing a broken section

## Monthly change hours

Care Plus includes 1 hour, Pro includes 3. Track them honestly and tell the client where they stand rather than silently absorbing overflow, which trains them to expect it. Over the included hours, it is $40/hour or an upgrade.

Typical uses: a new page, seasonal restyling, swapping screenshots after a map update, adding a rules section, refreshing copy.

## Selling the plan

Pitch it **7 days after launch**, when they are happiest with the result, not at handover when they have just paid.

Lead with the packages/items line, not with backups and SSL. "Every time you add a package it shows up and I make it look right" is concrete and they immediately understand it. "Weekly backups" is not.

The Basic-to-Plus upgrade sells itself visually: put a template image next to a bespoke one. The $20/month gap explains itself without you saying anything, so build that comparison early and keep it in `#portfolio`.

## Churn

Expect 30 to 40 percent a year in this market, because servers close. Price it in and always be adding. When a server does close, ask what happened and stay on good terms. Owners start new servers, and someone who liked working with you brings the next one.
