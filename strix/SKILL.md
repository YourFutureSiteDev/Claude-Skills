---
name: strix
description: Run Strix, the open-source autonomous AI penetration tester, against a target you are authorised to test. Use when the user wants to security-test, pentest, red-team, or hunt vulnerabilities in a website, web app, API, local codebase, or GitHub repo, and says things like "pentest this", "run strix", "security-test my site", "find vulnerabilities in", "red team this app", or "check this repo for security holes". Strix runs real exploits in a sandbox, not static analysis. Only for targets the user owns or has written permission to test.
---

# Strix: autonomous AI penetration testing

Strix (github.com/usestrix/strix) is an open-source AI red team. It maps the
attack surface, finds flaws across the OWASP Top 10, and validates them by
running working proof-of-concept exploits in a Docker sandbox, then hands back
remediation guidance. It is dynamic testing, not a static scanner.

## Authorisation gate: check this first, every time

Strix launches real attacks. Only run it against something the user owns or has
written permission to test. Before running:

- Confirm the target is theirs or in scope for an engagement they hold.
- If there is any doubt, ask in one line and wait for a clear yes.
- Never point it at a third party's live site "to see what happens". That is
  an unauthorised attack, and the answer is no.

Their own builds (Cloudflare Pages sites, demos, local codebases, their own
repos) are fine. Someone else's production site is not, without their sign-off.

## What you need before running

1. **Docker running.** Strix spins up sandboxes in containers. On this PC Docker
   is not installed. If `docker --version` fails, tell the user Strix needs
   Docker Desktop for Windows first, and stop. Do not fake a run.
2. **An LLM API key.** Strix drives itself with an LLM. It reads two env vars:
   ```bash
   export STRIX_LLM="anthropic/claude-opus-5"   # or openai/..., google/..., openrouter/...
   export LLM_API_KEY="the-key"
   ```
   Use a key the user provides. Do not hardcode one into any file, this skill
   folder is a public repo.

## Install

```bash
curl -sSL https://strix.ai/install | bash
```

Strix is a security tool that runs a shell installer. Show the user this command
and let them run it themselves rather than piping a remote script through the
agent silently. Confirm `strix --help` works afterwards.

## Running it

Pick the target form that matches what they gave you:

| Target | Command |
|---|---|
| Local codebase | `strix --target ./path-to-app` |
| GitHub repo | `strix --target https://github.com/org/repo` |
| Live web app (black box) | `strix --target https://their-app.com` |
| Several at once | `strix --target-list targets.txt` |

Useful flags:

- `-n` / `--non-interactive` — headless, for a scheduled or unattended run.
- `--instruction "..."` — steer it: "focus on the login and checkout flow".
- `--scan-mode quick` — smaller, faster pass when you just want a first look.
- `strix view` — open the results dashboard locally after a run.

## Reporting back to the user

Follow Byron's reply style: lead with the verdict, then the top findings.

- One line: clean, or N issues found, worst one named.
- Then the 2 to 3 most serious findings, one line each: what, where, how bad.
- A finding is only real if Strix validated it with a working exploit. Say so.
  Flag anything unconfirmed as unconfirmed, do not inflate it.
- Offer the full report rather than pasting it: "ask if you want the rest", or
  save it to the project folder and link it.
- Never paste raw exploit payloads into chat as if they were results.

## Where output lives

Move any report or artefact Strix produces into the target project's own folder
in the same session, per the file-routing rule. Do not leave it in a scratch
directory or Downloads.
