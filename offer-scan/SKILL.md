---
name: offer-scan
description: Read competitors' live pricing and offer pages with Firecrawl and lay them out beside our own, so a price or a tier change is made against what is actually on sale today. Use when the user asks to check competitor pricing, "what are others charging", "how does our price compare", "scan these storefronts", "are we too cheap", "what do their tiers include", or is about to set or change a price, name a tier, or rewrite an offer. Built for the ClipLabs Whop storefront; works for any set of competitor URLs. It reads public pages only and never changes a price on its own.
---

# Offer scan

A handful of competitor URLs in. One comparison table out, plus the two or three
things they say that we do not.

Pricing arguments go in circles when they are run on memory. This reads the
live pages instead, so the conversation is about what is on sale this week.

## The three things that must never happen

1. **Never change a live price.** This produces a table and a recommendation.
   Byron changes prices. That includes the Whop storefront, the landing page and
   anything in a project's docs.
2. **Never state a competitor price without the URL and the date read.**
   Pricing pages change weekly. A figure with no source is a rumour, and a
   rumour that gets pasted into a sales page is a problem.
3. **Never copy their words.** Note what they cover and how they frame it. The
   output quotes short phrases at most, and any wording we adopt gets rewritten.

## Before you start

Firecrawl is an MCP server. If its tools are not loaded:

    ToolSearch with query "firecrawl"

If nothing comes back, Firecrawl is not connected in this session. Say so and
stop. Do not fall back to a plain fetch: Whop, Gumroad, Stripe-hosted and most
modern storefronts render their pricing in JavaScript and a plain fetch returns
an empty shell, which reads as "no pricing found" and is simply wrong.

## The run

**1. Get the list.** If the user gave URLs, use them. If not, use Firecrawl's
search to find live storefronts in the category, then confirm each one is real
and currently selling before it goes on the list. Aim for four to eight. Say
which you dropped and why.

**2. Scrape each pricing or storefront page** to markdown. For each one pull:

- every tier: name, price, billing period, currency
- what each tier includes, in units that compare (for ClipLabs: source videos
  in, clips out, turnaround, revisions, who reviews)
- the guarantee or refund line, if any
- the proof they show: samples, client names, follower counts, testimonials
- what they ask the buyer to do first (free trial, call, instant buy)

**3. Build the table.** Ours as the first row, clearly marked, so the gap is
readable at a glance. Normalise the units before comparing: a "50 clips" claim
against our "up to 30" means nothing until both are per month and both say what
counts as one clip.

**4. Write the findings.** `research/offer-scan-<date>.md` in that project's
folder. Four sections, short:

    ## The table
    ## Where we are cheap, and whether that is a position or an accident
    ## What they promise that we do not say
    ## What we do that none of them mention

The last section is the one that pays. Our human review before delivery is an
example: if nobody else says it, it is a line on the sales page, not a footnote.

**5. Recommend, do not act.** One recommendation, with the number, and the
reason. Then stop and ask.

## Sanity check before you hand it over

If every competitor came back at a suspiciously similar price, or several tiers
came back blank, you probably scraped a marketing page rather than the checkout.
Go and find the page with the buy button on it and read that instead.
