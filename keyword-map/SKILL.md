---
name: keyword-map
description: Build a keyword map for a website from free Google data (autocomplete, no accounts, no API keys), then turn it into a page plan - which existing page owns each search, and which searches have no page yet. Use before building or extending any Your Future Site client site or yourfuturesite.com.au, and whenever Byron says "keyword map", "what are people searching", "get us on Google", "rank on Google", "SEO plan", "what pages should we add", "programmatic SEO", or wants more Google traffic. Not for social media (he does not want it).
---

# Keyword map

The method from the exotic car rental video (1 Oct 2026): find what people
actually type, keep the searches that matter, group them, give every group one
page, then write each page for its group. "Rank number one" is hype; the
method is sound.

## 1. Pull the searches (free, no account)

```bash
python3 ~/.claude/skills/keyword-map/scripts/kwmap.py \
  --seeds "tradie website,website for plumber,small business website" \
  --site https://example.com.au --deep --out <project>/keyword-map
```

- Seeds are 5 to 10 short phrases a buyer would type, in the client's words, not ours.
- `--gl au` is the default. `--deep` adds how much / best / cheap / how to prefixes.
- Writes `keywords.csv` (every search plus a signal and intent), `clusters.csv`
  and `keyword-map.md` (groups mapped to existing pages from the sitemap, or NEW PAGE).
- **Signal is summed autocomplete rank, not search volume.** Use it to order,
  never quote it as a number.
- It runs about 30 autocomplete calls per seed. Do not loop it all session;
  Google will start refusing.

### Real words from real people (free)

Before judging, ask Reddit Answers (the Ask button beside Reddit's search bar) a full sentence question such as "what do people hate about their plumber's website" or "what makes you trust a tradie online". Open the threads it cites and copy the exact phrases people use. Feed those phrases in as extra seed keywords and use them in page copy and FAQs. Run it in Byron's Chrome; Reddit blocks plain fetches.

## 2. Judge relevance yourself (the script cannot)

Autocomplete returns plenty of noise: people looking for a plumber, not a plumber's
website; jobs, courses, Indian or US cities, unrelated brands. Go through
`keywords.csv` and keep only searches from someone who could become the
client's customer. Group what is left by **intent**:

- **hire / price**: ready to buy ("website design for electrician", "small business website cost"). These get service pages.
- **compare / question**: researching ("best website for plumbers", "do I need a website designer"). These get articles.
- **local**: suburb or city. Only make a local page when the business really serves that place.

## 3. The page plan

One page per intent group, never one page per keyword. For each:
existing page or new slug, the lead keyword for the title and H1, the three to
six supporting searches the copy must answer, and the internal links to and
from it.

## 4. Rules that keep it from backfiring

- **No doorway pages.** Google penalises mass pages that differ only by the
  swapped keyword (its scaled content abuse policy). A new page needs content
  that only makes sense on that page: real examples, the trade's real
  problems, real prices.
- **No keyword stuffing.** Lead keyword in title, H1, URL, first paragraph and
  meta description; the rest appear naturally once each. Write for the reader.
- **Schema** on every page: `Organization` or `LocalBusiness` site wide,
  `Service` on service pages, `FAQPage` only when the page really has FAQs,
  `Article` on articles.
- Byron's sites are on Cloudflare Pages: link **extensionless** (`/website-for-plumbers`, not `.html`) and add new pages to `sitemap.xml`.
- No dashes as punctuation in the copy. Journal posts ship with a photo.
- Any page design goes through the `website` skill first, matching the existing site.

## 5. Better data later (needs Byron)

- **Search Console**: real queries the site already appears for. Byron signs in
  with his Google account; verify through a Cloudflare DNS TXT record.
- **Google Ads keyword planner**: monthly volume ranges. Byron must create the
  account himself (Claude never creates accounts). Expert mode lets you skip
  making a campaign.
- **Notra** (notra.ai style tool from a saved reel, 4 Oct 2026): tracks how a brand shows up in ChatGPT, Claude and other AI answers, compares competitors and finds content gaps. Use it once Byron makes an account, to check whether yourfuturesite.com.au and client sites are named when someone asks an AI "who builds websites for plumbers near me". Until then, ask the question yourself in a fresh chat and note which businesses get named.

## 6. The nightly page gap run (planned, from a saved reel)

The idea Byron saved on 3 Oct 2026: overnight, read competitors' sites, Google reviews and Maps listings, find searches they show up for where Byron's site has no page, pick the biggest, write that page from real business facts, have a second pass check it against these rules, send it back once if it fails, then publish and refresh one older page. Build it as a scheduled job only after this skill's manual run has produced a page plan Byron approved, and keep the doorway page rule above: one page a night at most, real content only, Byron sees the list of new pages each morning.
