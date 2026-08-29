---
name: prospect-brief
description: Read one prospect's own website with Firecrawl and turn it into a research brief plus a ready CSV row - who they are, who to write to, and the one specific decision or detail the opener must quote. Use whenever the user gives a prospect URL and asks to research them, brief them, look them up, "what's their story", "find the decision", "who do I email there", "add them to the sheet", or is about to write an opener for a company they have not researched yet. Built for Scroll World developer and venue prospecting; works for any business. One prospect per run. It never sends anything and never writes an opener on its own.
---

# Prospect brief

One URL in. One brief out, plus the CSV row that goes with it.

This exists because the openers only work when the first line names something
specific and true that was found in the prospect's own material. Guessing that
detail is worse than not sending. This skill's whole job is to find it, prove
where it came from, and refuse to invent it.

## The three things that must never happen

1. **Never invent the specific detail.** Every field in the brief carries the
   URL it came from. If the decision, the level count, the frontage or the
   person's role is not stated on a page you actually read, the field is
   `NOT FOUND`. An opener built on a guessed detail is worse than no send: it
   proves you did not look.
2. **Never mark a contact role-relevant unless the page says the role.** The
   Spam Act rule in `Scroll World/sales/OUTREACH.md` turns on a named person
   whose published role covers this project. "Probably the marketing manager"
   is not a role. If the site names the person but not their role, say so.
3. **Never send anything, and never draft the final email here.** This produces
   research. Byron decides who gets written to, and the opener is written
   separately against `sales/OUTREACH.md`.

## Before you start

Firecrawl is an MCP server. If its tools are not already loaded, load them:

    ToolSearch with query "firecrawl"

If nothing comes back, Firecrawl is not connected in this session. Say so and
stop; do not silently fall back to WebFetch, because the whole point is reading
JavaScript-rendered sites that a plain fetch returns empty.

## The run

**1. Map the site.** Firecrawl's map tool on the root domain gives every URL it
can find. Pick the pages that carry the answers, usually: home, about, the
project or venue page, team or contact, and any news, press or FAQ page. Five
to eight pages is normally right. Say which ones you chose.

**2. Scrape those pages to markdown.** Read what is actually there. Do not
skim to confirm a guess you already formed from the home page.

**3. Find the decision.** This is the field that matters and the one that takes
real reading. It is a choice the business made that is visible in their own
words and is hard to photograph:

- a development: the setback that cost them apartments, the laneway instead of
  a car park, a ground floor given away to retail, a heritage facade retained,
  an orientation chosen for a view
- a venue: a room built around one tree, a barn kept as it was, a ceremony spot
  that only works at one time of day, a rebuild after a fire
- any business: a constraint they chose to accept, and said why

Quote their phrasing. Give the URL. If two candidates are close, list both and
say which is stronger and why.

**4. Find the people.** For each named person on the site: name, role as
published, email or the form/role address, and the page it appeared on. Then
judge role relevance against the project, and state the judgement plainly.

**5. Write the brief.** `research/briefs/<slug>.md` inside that project's folder
(Scroll World, or wherever the work lives). Sections:

    # <Project or business name>
    Source: <root URL>   Read: <date>   Pages read: <list>

    ## The decision
    <one paragraph, their words quoted, with the URL>

    ## Second-best detail
    <the backup, or NOT FOUND>

    ## Who to write to
    | Name | Role as published | Address | Role-relevant? | Source page |

    ## Facts for the CSV
    levels, frontage, developer, anything else the row wants - each with a URL
    or NOT FOUND

    ## What is not on the site
    <the gaps, so nobody wastes an hour looking again>

**6. Offer the CSV row.** Print the row in the exact column order of the target
CSV (for Scroll World: `sales/prospects.csv`), fields left blank where the brief
says NOT FOUND. **Show it and ask before appending.** Check the slug is not
already in the file, and check `sales/suppression.txt` before proposing any
contact at all. If they are suppressed, say so and stop.

## Reading the result honestly

A brief with `NOT FOUND` in the decision field is a useful result, not a
failure. It means this prospect cannot be sent to yet, which saves a bad send.
Say that out loud rather than padding the field with something generic about
their commitment to quality.
