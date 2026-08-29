---
name: session-retro
description: Post-session retro. Mines a finished Claude Code session transcript for corrections Byron gave and writes permanent fixes (memory file, CLAUDE.md learned rule, or skill), plus a digest line per lesson. Trigger: invoked headless by the SessionEnd hook as /session-retro <transcript-path>, or run manually the same way.
---

# Session Retro

You run headless after a session ends. Job: find places Byron corrected Claude and make the lesson permanent. Be conservative. A missed lesson is recoverable next time it happens; an invented lesson poisons config forever. When unsure, write nothing and digest the reason.

## Paths

- State: `C:\Users\PC\.claude\retro\state.json`
- Digest: `C:\Users\PC\.claude\retro\digest.md`
- Projects root: `C:\Users\PC\.claude\projects`
- Global CLAUDE.md: `C:\Users\PC\.claude\CLAUDE.md`
- Skills root: `C:\Users\PC\.claude\skills`

## Hard limits

- Write only inside `C:\Users\PC\.claude`. Never delete anything. Never modify `settings.json`, hooks, plugins, or existing skills other than creating a new skill folder.
- In CLAUDE.md, append bullets only under the `# Learned rules (auto)` marker section. Never rewrite existing content.
- Existing memory files: you may extend or correct the one file covering the same fact; never rewrite unrelated ones.
- Every lesson needs a verbatim quote of Byron's words from the transcript. No quote, no write.
- Max 3 lessons per session. Max 4 sessions per run. Then stop.
- No dash punctuation (em dash, en dash, spaced hyphen) in anything you write; use commas, colons, periods.

## Procedure

### 1. Build the worklist

The argument after `/session-retro` is a transcript path (may be missing: then sweep only). Run this to load state and find backlog:

```powershell
$statePath = "$env:USERPROFILE\.claude\retro\state.json"
$state = Get-Content $statePath | ConvertFrom-Json
$done = @($state.processed)
$root = "$env:USERPROFILE\.claude\projects"
$cands = Get-ChildItem $root -Filter *.jsonl -Recurse -Depth 1 |
  Where-Object { $_.FullName -notmatch 'subagents' } |
  Where-Object { $done -notcontains $_.BaseName } |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddHours(-6) } |
  Sort-Object LastWriteTime -Descending | Select-Object -First 3
$cands | ForEach-Object { $_.FullName }
```

Worklist = the passed transcript (if it exists and its BaseName is not in `processed`) + those candidates, minus duplicates, capped at 4 sessions total.

### 2. Extract what Byron said, per session

Never read a raw transcript end to end. For each session file `$t`, extract only Byron's real messages:

```powershell
$out = @()
foreach ($l in (Get-Content -LiteralPath $t -Encoding UTF8)) {
  try { $j = $l | ConvertFrom-Json } catch { continue }
  if ($j.type -ne 'user') { continue }
  if ($j.isSidechain -or $j.isMeta) { continue }
  $c = $j.message.content
  $txt = $null
  if ($c -is [string]) { $txt = $c }
  else {
    $parts = @($c | Where-Object { $_.type -eq 'text' })
    if ($parts.Count -gt 0) { $txt = ($parts | ForEach-Object { $_.text }) -join "`n" }
  }
  if (-not $txt) { continue }
  $txt = ($txt -replace '(?s)<system-reminder>.*?</system-reminder>', '').Trim()
  if (-not $txt) { continue }
  if ($txt -match '^<(local-)?command-') { continue }
  $out += ('USER >>> ' + $txt)
}
$dest = "$env:TEMP\retro-user-msgs.txt"
$out | Set-Content -Encoding utf8 $dest
"{0} messages" -f $out.Count
```

Then Read `$env:TEMP\retro-user-msgs.txt`.

Skip the session (digest nothing, but mark processed) when any of: fewer than 2 extracted messages; the first message starts with `/session-retro`; the messages are obviously a headless automation run, not Byron typing.

### 3. Find corrections

A correction is Byron reacting to how Claude worked, not a new task. Count as corrections:
- Negative feedback on behaviour or output ("I don't have the patience to read the 10 long paragraphs you output").
- An instruction he has had to repeat, or "I said", "again", "I told you".
- "No, not X, Y", "that's wrong", "don't do it that way", "stop doing X".
- A stated durable preference about how Claude should operate ("always ask before", "never use my personal email").

Not corrections: new tasks, ordinary answers to Claude's questions, choosing an option Claude offered, project facts, one-off situational steering ("skip that file for now").

When a candidate needs context to judge, Grep the original transcript for a distinctive phrase from the quote and Read 20 lines around the match to see what Claude did just before.

### 4. Turn each correction into one lesson

For each (max 3 per session), record: the verbatim quote, what Claude did wrong, the general rule that prevents it. Then classify:
- **Memory file**: preferences, facts, context ("prices UK stores in pounds"). Default choice.
- **CLAUDE.md learned rule**: short absolute behavioural rule that must hold in every session ("never publish the Wix site"). Use sparingly.
- **Skill**: only for a repeatable multi-step procedure Byron taught. Rare.

### 5. Dedupe before writing

Read the session project's `memory\MEMORY.md` (the project folder is the transcript's parent directory) and the `# Learned rules (auto)` section of global CLAUDE.md. If the lesson is already covered: digest it as `already covered by <file>` and write nothing, or extend the existing memory file if the new evidence adds something real.

### 6. Write the fix

**Memory file** goes in `<project-folder>\memory\<kebab-slug>.md` (create the memory folder if missing):

```markdown
---
name: <kebab-slug>
description: <one line>
metadata:
  type: feedback
---

<the lesson. Include the date and the verbatim quote.>

**Why:** <what went wrong>

**How to apply:** <the behaviour next time>
```

Then add one line to that folder's `MEMORY.md` index: `- [Title](<kebab-slug>.md) — <hook>` (create MEMORY.md if missing).

**CLAUDE.md rule**: ensure this section exists at the end of `C:\Users\PC\.claude\CLAUDE.md`, creating it if missing:

```markdown

# Learned rules (auto)
<!-- appended by session-retro; one bullet per rule -->
```

Append one bullet: `- <rule>. (learned <date>)`

**Skill**: `C:\Users\PC\.claude\skills\<kebab-slug>\SKILL.md` with normal name/description frontmatter and the procedure.

### 7. Digest and state

Append to digest.md, one line per lesson or skip:

```
- <yyyy-MM-dd> | <lesson one-liner> | <fix: path, or "already covered by X", or "skipped: reason"> | evidence: "<verbatim quote>"
```

Sessions with nothing found get one line: `- <date> | no lessons | <session-id> | evidence: ""`

Then mark every handled session processed:

```powershell
$statePath = "$env:USERPROFILE\.claude\retro\state.json"
$state = Get-Content $statePath | ConvertFrom-Json
$state.processed = @($state.processed) + @($newIds) | Select-Object -Unique
if (@($state.processed).Count -gt 500) { $state.processed = @($state.processed | Select-Object -Last 500) }
$state.last_run = Get-Date -Format o
$state | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 $statePath
```

Finish with a one-line summary of lessons written.
