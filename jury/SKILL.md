---
name: jury
description: Put one of Byron's ideas, prices, offers or features on trial before he spends money or time on it. A prosecutor argues it fails, a defender argues it works, twelve jurors each playing a different real person vote blind, and a judge rules with the objections ranked. Use when Byron types /jury, or says "test this idea", "is this a good idea", "would people pay for this", "tear this apart", "be honest about this", "shark tank this", or is about to set a price, launch something, pick a venture or add a big feature to FORM, Your Future Site, the bots or clipping.
user-invocable: true
argument-hint: "<the idea, price or offer to test>"
---

# /jury

Claude tends to agree with whoever is asking. This makes it argue with itself instead, so Byron hears the hard objections before real customers or investors do. It replaces the "12 Claude courtroom", "Shark Tank panel" and "fake customer crowd" posts he saved on 4 Oct 2026.

## 1. Pin the case

Restate the idea in two lines: what it is, who it is for, the price if any, and what Byron wants to decide (go, change, or drop). Pull real facts from memory and the project folder (FORM in `~/dev/form`, Your Future Site prices and leads, bot results) rather than guessing. If the idea is too vague to judge, ask one question, then go.

## 2. The two sides

Run two parallel general purpose agents that cannot see each other:
- **Prosecutor**: the strongest honest case that this fails. Money, time, competition, why people will not care.
- **Defender**: the strongest honest case that it works, with the evidence that exists.

## 3. Twelve jurors, blind

Run twelve parallel agents. Each gets the case, both arguments, and one persona picked to fit the idea, for example: the target customer, a skeptical version of the target customer, someone who tried and quit a rival, a parent (for anything a teenager might use), an accountant, a competitor, a small business owner, a tradie, a uni student on a budget, a marketer, Byron's mate Daniel, and someone who has never heard of it. Each juror returns: verdict (works or fails), would they pay and how much, the one thing that would make them say no, and what would make them tell a mate. Jurors never see each other's answers.

## 4. Judge

Tally the votes, then rank the objections by how many jurors raised them and how serious they are. Give a ruling: go, go with these changes, or drop, and the three changes most likely to flip the no votes. Say plainly that this is simulated AI opinion, not market data, and suggest the cheapest real test (ten real people, a landing page, one ad).

## Report

Short dot points in chat, ruling first. If Byron wants it kept or shared, put the full trial in an artifact. No dashes as punctuation, no emojis. Never invent facts about real people or competitors; mark guesses as guesses.
