---
name: "no-em-dashes"
description: "Write without em dashes, en dashes, or spaced hyphens used as punctuation. Use this skill every single time you produce written output for this user, in every context and with no exceptions, including chat replies, documents, reports, emails, articles, slide text, spreadsheet labels, commit messages, and code comments. Trigger it even when the request has nothing to do with punctuation or style, because the user's standing rule is that dashes-as-punctuation never appear in anything written for them."
---

# No dashes as punctuation

This user does not want dash punctuation in anything you write for them. Not in a polished report, not in a one-line chat reply, not in a code comment. Applying it selectively is the same as not applying it, because the one place it slips through is the place they notice.

Banned characters when used as punctuation:

- em dash `—`
- en dash `–`
- hyphen with spaces around it, as in `word - word`

Still fine: hyphens inside words and compounds (`well-known`, `state-of-the-art`, `re-run`, `x-axis`), hyphens in filenames, flags, and code (`--verbose`, `my-file.txt`), markdown list markers and horizontal rules, and minus signs in math.

## Why this needs real attention

The em dash is not a rare flourish. It is the default connector that shows up mid-sentence without any deliberate decision, especially in the places writing gets good: the sharp aside, the pivot, the punchline setup. So the rule cannot be satisfied by "remembering not to." It is satisfied by knowing what to reach for instead, so the impulse resolves into a comma or a period before the dash ever lands.

The other trap is the lazy fix. Swapping every dash for a comma produces limp, comma-spliced sentences that read worse than the original. The dash was doing a specific job. Replace it with the punctuation that does that same job.

Long structured writing is where this fails most often. Short replies rarely reach for a dash, but reports, tables, summaries, and anything with headings and bullets pull them in constantly. Raise your guard as the output gets longer.

## What to reach for instead

The user's preference is commas and periods. Use the one that matches the work the dash was doing.

**An aside dropped into the middle of a sentence** takes commas.

- No: The report, due Friday — assuming legal signs off — covers all four regions.
- Yes: The report, due Friday and assuming legal signs off, covers all four regions.

**A hard pivot or a reveal at the end** takes a period. Two sentences almost always land harder than one sentence with a dash in it.

- No: We shipped on time — barely.
- Yes: We shipped on time. Barely.

**A lead-in to an explanation, a list, or a restatement** takes a colon.

- No: The problem is simple — nobody owns the handoff.
- Yes: The problem is simple: nobody owns the handoff.

**A number range** gets the word "to" or "through".

- No: Revenue grew across 2020–2024.
- Yes: Revenue grew from 2020 to 2024.

**A bullet with a label and a gloss** takes a colon, or drops the connector.

- No: Latency - the time from request to first byte
- Yes: Latency: the time from request to first byte

**An empty cell in a table** gets the word "n/a" or is left blank. A bare dash is the reflex here and it counts.

When none of those fit cleanly, rewrite the sentence. A sentence that needs a dash to hold together is usually carrying two ideas that would each be clearer on their own.

## Two things that are not yours to edit

The rule governs your prose. It does not license altering someone else's words or corrupting data.

If you are quoting a real source verbatim and the quote contains a dash, do not silently edit it, because that misrepresents what the source said. Paraphrase it in your own words outside the quotation marks, or shorten the quote so the dash falls outside it.

If you are reproducing file contents, tool output, code, or data the user asked to see, reproduce it exactly. Stripping characters from data the user asked you to display is a bug, not compliance.

If the user writes an em dash in their own message, that is their business. Say nothing about it.

## Check before you send

Dashes escape through the cracks in long output, in headings, in the middle of a table cell, in a line carried over from an earlier draft. Before delivering anything, scan the full text for the three banned forms. When the output is a file you generated, grepping it takes a second and is more reliable than rereading:

```bash
grep -n '—\|–\|[^-] - [^-]' path/to/output.md
```

For binary formats like .docx, .pptx, and .xlsx, check the text you assembled before it went into the file, since the file itself will not grep cleanly.

Fix anything the scan finds, then deliver. Do not narrate the check or mention the rule in your response. Clean output is the whole deliverable; announcing that it is clean undercuts it.

