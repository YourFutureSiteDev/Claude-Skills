---
name: "write-medium-article"
description: "Use when the user wants to write, draft, outline, or revise a Medium article, blog post, or online essay. Triggers on \"write an article about X\", \"draft a Medium post\", \"turn this into an article\", or requests to improve an existing draft."
---

# Write a Medium Article

Research a topic, then draft a Medium article that a human curator would boost and a human reader would finish.

## Step 0 — Get the three things you can't guess

Before researching, ask (use AskUserQuestion, one round, max 3 questions):

1. **The angle** — what does the user actually believe about this, or what happened to them? Medium rewards first-hand experience over encyclopedia entries. If they have none, find one: a contrarian read, a specific case, an under-covered mechanism.
2. **The reader** — who is this for, and what do they already know? This sets vocabulary and how much to explain.
3. **Length** — default 1,200–1,800 words unless they say otherwise.

If the user has already given all three, skip the questions and start.

## Step 1 — Research

Web-search before writing. Never draft from memory on anything factual.

- Pull 5–10 sources. Prefer primary: original studies, company docs, first-hand accounts, real numbers. Skip listicles that summarize other listicles.
- Collect **specifics**: exact figures, dates, names, dollar amounts, quotes. Every one of these you gather is a sentence that can't be mistaken for AI filler.
- Note anything that contradicts the user's angle. Address it in the draft — an article that anticipates the obvious objection reads as trustworthy.
- Keep a source list with URLs. The draft links out to sources inline.

## Step 2 — Title and subtitle (write these first)

The title is 90% of whether the piece gets read, and Medium curators reject stories whose title/subtitle misrepresent the content.

Rules:

- Be specific and concrete over clever. "I Cut Our AWS Bill from $40k to $9k in Six Weeks" beats "Rethinking Cloud Spend."
- Front-load the important words — Medium truncates long titles in feeds.
- Numbers work ("7 Ways…") but only when the number is real, not padded.
- The subtitle does a different job than the title: it adds the missing context, it doesn't restate.
- **Do not** write sensationalist, mysterious, or vague titles. Both clickbait and generic get filtered out of distribution.
- The title must be a promise the article actually keeps. If the draft drifts, change the title.

Offer the user 3 title options with subtitles and let them pick.

## Step 3 — Structure

- **Hook (first 2–3 sentences).** Open with a scene, a number, a claim, or a concrete moment. Never open with "In today's fast-paced world," a dictionary definition, or a throat-clearing paragraph about why the topic matters. The first line should be something only this writer could write.
- **The promise (by end of paragraph 2).** The reader knows what they'll walk away with.
- **Body.** H2 subheadings roughly every 300–500 words. Each section earns its place — cut any that just transitions.
- **Paragraphs of 1–4 sentences.** Most Medium reading is on a phone. A six-sentence block is a scroll-past.
- **Close on the reader, not on you.** End with the implication, the open question, or what to do Monday morning. Not "In conclusion" and not a summary of what they just read.

Formatting to use sparingly and deliberately: blockquotes for real quotes only, bold for genuine emphasis (not every third phrase), bullet lists only when the content is truly parallel items. Prose is the default; a wall of bullets reads as an outline someone didn't finish.

## Step 4 — House style

Write like a smart person explaining something they know to a friend who's sharp but unfamiliar.

**Do:**

- Short sentences carrying one idea. Vary the length — a run of same-length sentences is the single loudest AI tell.
- Concrete over abstract. "It improved results" → "Support tickets fell from 400 a week to 130."
- Take a position. Say what you think and why. Hedged, both-sides-of-everything prose is forgettable.
- Use first person when the writer has actual experience. It's the thing Medium curators explicitly look for.
- Admit what you don't know or got wrong. It buys credibility cheaply.
- Read the draft aloud in your head. If a sentence is hard to say, rewrite it.

**Don't:**

- Never use these: delve, leverage (as a verb), robust, seamless, unlock, harness, elevate, game-changer, tapestry, landscape, realm, testament, "it's not just X, it's Y", "in today's ever-evolving," "let's dive in."
- No em-dash-heavy rhythm, no triads everywhere ("faster, cheaper, and more reliable"), no starting three consecutive paragraphs with the same construction.
- No section that says "Here's why this matters" — just make it matter.
- No padding to hit a word count. A tight 900 words beats a bloated 1,800.
- No sales pitch. Medium demotes stories whose real purpose is signups, traffic, or selling.

## Step 5 — Self-edit pass before delivering

Run these checks and actually fix what fails:

1. **The specificity test.** Highlight every claim. Any that could appear in an article on a different topic is filler — cut it or replace it with a fact.
2. **The first-line test.** Would a stranger scrolling read past sentence one?
3. **The delete test.** Cut the first paragraph. Is the piece better? (Often yes — then keep it cut.)
4. **Title honesty.** Does the article deliver exactly what the title promised?
5. **Sources.** Every factual claim traceable. Link out inline where it helps the reader.
6. **Word count and rhythm.** Read the opening and closing aloud.

## Step 6 — Deliver

Write the article as a `.md` file in the outputs folder and share it with `present_files`. Include at the top:

- Title and subtitle
- Suggested tags (5 max, all genuinely relevant — tag spamming kills distribution)
- Estimated read time
- A one-line note on cover image direction (original or well-chosen stock beats generic AI art; no cover image is better than a bad one)

Then, in chat, give a two-sentence note on the strongest and weakest part of the draft. Be honest about the weak part.

## Reference: what Medium's curators reward

From Medium's own distribution guidelines — stories get boosted when they show:

- A clear reason *this* writer is writing *this* topic (first-hand experience beats credentials)
- Value the reader still feels days later
- Respect for the reader's time — not a pitch, not a bid for attention
- Non-derivative thinking — a fresh angle, not a rehash of what's already searchable
- Craft — well-written, error-free, sourced, appropriate length

Stories get demoted for: AI-generated feel, clickbait or generic titles, unconstructive negativity, derivative round-ups, and content whose real goal is traffic or sales.

