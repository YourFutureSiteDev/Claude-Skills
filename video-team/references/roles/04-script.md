# Role 4 — Script

**Produces:** `script`, word for word, and nothing else.

No outside method for this one. The constraints come from the two things the
script has to do at once on this rail: be spoken by edge-tts, and be read as
burned word-by-word captions.

---

## The hard rules

- **The winning hook is the first line, verbatim.** It was tested at role 2. Do
  not improve it here, which is how a tested line quietly gets lost.
- **Short sentences.** Captions appear one word at a time, so a 40-word sentence
  has no visible rhythm and turns into a wall.
- **No em dash, en dash, spaced hyphen, parenthesis or emoji.** TTS reads
  punctuation as pauses in places you did not intend, and Byron rejects dashes in
  any written output anyway. Commas and full stops only.
- **Numbers as words when they are spoken as words.** "six agents", not "6
  agents", so the caption matches what is heard.
- **No stage directions.** Anything in `script` gets spoken aloud, including the
  words "cut to". Shot notes belong in role 5's `shots[]`.
- **One idea per sentence.** A sentence carrying two ideas gets one of them lost
  under the captions.

## Write to the beat numbers

Role 3 handed over a word count per beat. Write each beat to its number, not to
feel. Then count:

```bash
node -e "const s=require('fs').readFileSync(process.argv[1],'utf8').trim().split(/\s+/).length;console.log(s+' words, ~'+(s/2.8).toFixed(1)+'s')" script.txt
```

Within 5% of budget or it goes back. Over budget is not a rendering problem that
can be fixed later; it is a longer video than was designed, and the footage, the
pacing and the payoff position all move with it.

## Then run the block audit

Role 3's five blocks, applied sentence by sentence. Label every sentence: value,
progression, context, disruption, CTA, or useless. Then:

- **Useless gets cut.** Lingering, repetition, restating a number already on
  screen, context nobody asked for.
- **Freed words go back to the budget**, which usually means the payoff gets
  room rather than the script getting shorter.
- **No CTA before the payoff.** If one appears at sentence four, move it to the
  end card.

This audit is the difference between a script that is the right length and a
script that is the right length and also earns it. It takes about a minute and
it is the highest-yield minute in the chain.

## Reading it aloud

Read the first second out loud, at speed. If the interesting word has not
arrived, the hook has drifted from what role 2 tested and needs putting back.

Read the last sentence out loud. If it trails off rather than landing, the payoff
is weak, and a weak payoff on a short means nobody reaches the end card.

---

## Handoff

- `script` — the full text, nothing else in the field
- `wordCount` — actual
- `predicted` — word count divided by the voice's measured rate, in seconds
- `blocks` — the audit result, and what was cut
