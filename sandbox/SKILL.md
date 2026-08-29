---
name: sandbox
version: "0.1.0"
description: Run code on a throwaway Linux VM in the cloud instead of on this machine, using E2B. Use when code should not touch the local PC or the production VPS - running scraped or AI-generated code, testing something risky, installing packages you do not want locally, batch media or ffmpeg jobs, or reproducing a Linux-only bug from Windows. Triggers on "run this in a sandbox", "test this safely", "don't run that on my PC", "spin up a box", "try it on Linux", "isolate this". Not for ordinary local scripts, and not a deployment target - sandboxes die when their timeout expires.
argument-hint: "[what you want run in the sandbox]"
allowed-tools: Bash, Read, Write
user-invocable: true
---

# /sandbox

E2B gives you disposable Linux VMs. Code runs there, the local machine stays clean. A sandbox is named and lives until its timeout expires, so a run of commands shares one filesystem and one set of installed packages.

## Resolve `SKILL_DIR` first

Set `SKILL_DIR` to the absolute path of the directory containing this SKILL.md (your harness reported it when you read this file). The CLI is always at `SKILL_DIR/scripts/sbx.py`.

Every command below is:

```bash
MSYS_NO_PATHCONV=1 uv run --with e2b-code-interpreter python "$SKILL_DIR/scripts/sbx.py" <subcommand>
```

`uv run --with` installs the SDK into a cached throwaway env, so nothing needs installing on this PC.

## Two rules that will bite you on Windows

1. **Always prefix with `MSYS_NO_PATHCONV=1`.** Git Bash rewrites anything that looks like a POSIX path into a Windows path before the script sees it, so `/home/user/in.mp4` silently becomes `C:/Program Files/Git/home/user/in.mp4`.
2. **With that set, local paths must be Windows-style** (`C:/Users/PC/...`). Sandbox-side paths stay POSIX (`/home/user/...`). A bare name with no leading slash is treated as `/home/user/<name>`.

## Commands

```bash
# start or reuse a sandbox and show what it has
sbx.py --name work info

# run Python in it
sbx.py --name work run --code "import platform; print(platform.platform())"
sbx.py --name work run --file C:/path/to/script.py
cat script.py | sbx.py --name work run

# run shell in it
sbx.py --name work sh "pip install pandas && python -c 'import pandas; print(pandas.__version__)'"

# move files
sbx.py --name work up C:/Users/PC/clip.mp4 /home/user/clip.mp4
sbx.py --name work down /home/user/out.mp4 C:/Users/PC/out.mp4

# housekeeping
sbx.py ls              # everything running on the account, tracked here or not
sbx.py --name work kill
sbx.py kill --all      # including boxes some other script left behind
```

`ls` and `kill --all` ask E2B what is actually running rather than trusting the local notes, so a sandbox left behind by a crashed script still shows up and can still be shut off.

Global flags: `--name` (default `default`) picks which sandbox, `--timeout` (default 600s) sets how long it stays alive and is refreshed on every command.

## What a sandbox actually is

Measured on the base template:

| | |
|---|---|
| CPU / RAM / disk | 2 vCPU, 1.9 GB RAM, 20 GB free |
| Python | 3.13 |
| Node | 20 |
| ffmpeg | **not installed** - `sudo apt-get install -y ffmpeg` takes about 25 seconds |
| Network | full outbound internet |
| Root | passwordless `sudo` |

Install once per sandbox, then keep it alive with `--timeout` rather than paying the setup cost again.

## How to work in one

- **Pick a name per job** (`--name cliplabs`, `--name scrape`) so unrelated work does not collide.
- **Set a realistic timeout up front.** A job that takes 20 minutes needs `--timeout 1500`, or the box dies mid-run.
- **Kill it when the job is done.** E2B bills sandbox time; an idle box left running is wasted money.
- **Charts and images** produced by `run` are saved locally as `sbx_result_N.png` in the working directory, so you can `Read` them.
- **Nothing persists** between sandboxes. Anything worth keeping must be pulled back with `down` before the timeout.

## Good fits

- Running code that came off the internet, out of a scraper, or straight out of a model, before it is trusted.
- ffmpeg and batch media work that would otherwise tie up the PC.
- Testing Linux behaviour without leaving Windows.
- Installing a messy dependency tree for one experiment.
- Long scrapes and API sweeps that should not run from a home IP or the production VPS.

## Bad fits

- Anything needing to survive past the timeout - use the VPS.
- Anything needing local files, local hardware, or the GPU.
- Small quick scripts. Sandbox startup is a few seconds; not worth it for a one-liner.

## Credentials

The key is read from `E2B_API_KEY`, falling back to `~/.e2b-claude/config.json`. That config file lives outside this repo and must never be committed here.
