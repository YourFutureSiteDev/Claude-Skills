#!/usr/bin/env python3
"""sbx - drive an E2B cloud sandbox from the command line.

A sandbox is a throwaway Linux VM. Code runs there, not on this machine.
Sandboxes are named and persistent within their timeout, so several commands
in a row land in the same box and share its filesystem.

Requires E2B_API_KEY in the environment.
"""

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

try:
    from e2b_code_interpreter import Sandbox
except ImportError:
    sys.exit("e2b-code-interpreter is not installed. Run with:  uv run --with e2b-code-interpreter python sbx.py ...")

HOME = Path(os.path.expanduser("~"))
STATE = HOME / ".e2b-claude" / "sessions.json"
CONFIG = HOME / ".e2b-claude" / "config.json"
DEFAULT_TIMEOUT = 600


def load_api_key():
    """Environment first, then the local config file. Never hardcoded here."""
    key = os.environ.get("E2B_API_KEY")
    if key:
        return key
    if CONFIG.exists():
        try:
            key = json.loads(CONFIG.read_text()).get("api_key")
        except Exception:
            key = None
        if key:
            os.environ["E2B_API_KEY"] = key
            return key
    return None


def load_state():
    if STATE.exists():
        try:
            return json.loads(STATE.read_text())
        except Exception:
            return {}
    return {}


def save_state(state):
    STATE.parent.mkdir(parents=True, exist_ok=True)
    STATE.write_text(json.dumps(state, indent=2))


def get_sandbox(name, timeout=DEFAULT_TIMEOUT, create=True):
    """Reconnect to the named sandbox, or start a new one."""
    state = load_state()
    entry = state.get(name)
    if entry:
        try:
            sbx = Sandbox.connect(entry["id"])
            sbx.set_timeout(timeout)
            return sbx
        except Exception:
            state.pop(name, None)
            save_state(state)
    if not create:
        sys.exit(f"no live sandbox named '{name}'")
    sbx = Sandbox.create(timeout=timeout)
    state[name] = {"id": sbx.sandbox_id, "started": time.time()}
    save_state(state)
    print(f"[sbx] started '{name}' -> {sbx.sandbox_id}", file=sys.stderr)
    return sbx


def clean_remote(path, default_dir="/home/user"):
    """Normalise a sandbox-side path.

    Git Bash on Windows rewrites POSIX arguments into Windows paths before the
    script ever sees them, so '/home/user/in.txt' arrives as
    'C:/Program Files/Git/home/user/in.txt'. Undo that, and treat any bare name
    as living in the sandbox home directory.
    """
    if not path:
        return None
    p = path.replace("\\", "/")
    m = re.search(r"(/(?:home|tmp|opt|srv|var|etc|usr)/.*)$", p)
    if m:
        return m.group(1)
    if re.match(r"^[A-Za-z]:", p):
        p = p.rstrip("/").split("/")[-1]
    if not p.startswith("/"):
        return f"{default_dir.rstrip('/')}/{p}"
    return p


def emit_result(result):
    """Print stdout/stderr/errors from a run_code execution."""
    for line in result.logs.stdout:
        sys.stdout.write(line)
    for line in result.logs.stderr:
        sys.stderr.write(line)
    if result.error:
        print(f"\n[error] {result.error.name}: {result.error.value}", file=sys.stderr)
        if result.error.traceback:
            print(result.error.traceback, file=sys.stderr)
        return 1
    # Rich results (charts, dataframes, images) come back as artifacts.
    for i, res in enumerate(result.results):
        if res.png:
            out = Path(f"sbx_result_{i}.png")
            import base64
            out.write_bytes(base64.b64decode(res.png))
            print(f"[sbx] saved image -> {out.resolve()}", file=sys.stderr)
        elif res.text and not result.logs.stdout:
            print(res.text)
    return 0


def cmd_run(args):
    if args.file:
        code = Path(args.file).read_text(encoding="utf-8")
    elif args.code:
        code = args.code
    else:
        code = sys.stdin.read()
    sbx = get_sandbox(args.name, args.timeout)
    return emit_result(sbx.run_code(code))


def cmd_sh(args):
    sbx = get_sandbox(args.name, args.timeout)
    r = sbx.commands.run(args.command, timeout=args.timeout)
    if r.stdout:
        sys.stdout.write(r.stdout)
    if r.stderr:
        sys.stderr.write(r.stderr)
    return r.exit_code


def cmd_up(args):
    sbx = get_sandbox(args.name, args.timeout)
    local = Path(args.local)
    if not local.exists():
        sys.exit(f"no such file: {local}")
    data = local.read_bytes()
    remote = clean_remote(args.remote) or f"/home/user/{local.name}"
    sbx.files.write(remote, data)
    print(f"[sbx] uploaded {local} -> {remote} ({len(data)} bytes)", file=sys.stderr)
    print(remote)
    return 0


def cmd_down(args):
    sbx = get_sandbox(args.name, args.timeout, create=False)
    data = sbx.files.read(clean_remote(args.remote), format="bytes")
    local = Path(args.local)
    local.parent.mkdir(parents=True, exist_ok=True)
    local.write_bytes(data)
    print(f"[sbx] downloaded {args.remote} -> {local.resolve()} ({len(data)} bytes)", file=sys.stderr)
    print(str(local.resolve()))
    return 0


def cmd_info(args):
    sbx = get_sandbox(args.name, args.timeout)
    r = sbx.commands.run(
        "echo -n 'python '; python3 -V 2>&1 | cut -d' ' -f2; "
        "echo -n 'node    '; (node -v 2>/dev/null || echo none); "
        "echo -n 'ffmpeg  '; (ffmpeg -version 2>/dev/null | head -1 | cut -d' ' -f3 || echo none); "
        "echo -n 'cpus    '; nproc; "
        "echo -n 'memory  '; free -h | awk '/Mem:/{print $2}'; "
        "echo -n 'disk    '; df -h /home/user | awk 'NR==2{print $4\" free\"}'"
    )
    print(f"sandbox {sbx.sandbox_id}")
    sys.stdout.write(r.stdout)
    return 0


def live_ids():
    """Every sandbox running on the account, tracked here or not.

    A sandbox started by something else - a test run, another project, a script
    that crashed before it cleaned up - still bills. Asking the account is the
    only way to see those, so cost control does not depend on this machine's
    bookkeeping being complete.
    """
    try:
        return [s.sandbox_id for s in Sandbox.list().next_items()]
    except Exception as e:
        print(f"[sbx] could not list the account's sandboxes: {e}", file=sys.stderr)
        return []


def cmd_ls(args):
    state = load_state()
    running = set(live_ids())
    named = {entry["id"]: name for name, entry in state.items()}
    if not running and not state:
        print("nothing running")
        return 0
    for sid in running:
        name = named.get(sid, "(untracked)")
        age = ""
        if sid in named:
            started = state[named[sid]].get("started")
            if started:
                age = f"{int(time.time() - started)}s old"
        print(f"{name:14} {sid:24} live  {age}")
    for name, entry in state.items():
        if entry["id"] not in running:
            print(f"{name:14} {entry['id']:24} dead")
    return 0


def cmd_kill(args):
    state = load_state()
    if args.all:
        targets = set(live_ids()) | {e["id"] for e in state.values()}
    else:
        entry = state.get(args.name)
        if not entry:
            print(f"[sbx] no sandbox named '{args.name}'", file=sys.stderr)
            return 1
        targets = {entry["id"]}
    if not targets:
        print("[sbx] nothing was running", file=sys.stderr)
        return 0

    # Ask afterwards rather than trusting the call. A kill that throws and gets
    # swallowed leaves a box running with nothing pointing at it, and it bills
    # until somebody happens to look.
    for sid in targets:
        try:
            Sandbox.kill(sid)
        except Exception as e:
            print(f"[sbx] kill failed for {sid} ({e}); checking anyway", file=sys.stderr)

    still = set(live_ids()) & targets
    gone = targets - still
    for sid in gone:
        print(f"[sbx] killed {sid}", file=sys.stderr)
    for name in [n for n, e in state.items() if e["id"] in gone]:
        state.pop(name)
    save_state(state)

    for sid in still:
        print(f"[sbx] STILL RUNNING and still billing: {sid}", file=sys.stderr)
    return 1 if still else 0


def main():
    p = argparse.ArgumentParser(prog="sbx", description="Run code in an E2B cloud sandbox.")
    p.add_argument("--name", default="default", help="sandbox name to reuse (default: default)")
    p.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT, help="seconds to keep the sandbox alive")
    sub = p.add_subparsers(dest="cmd", required=True)

    r = sub.add_parser("run", help="run Python code in the sandbox")
    g = r.add_mutually_exclusive_group()
    g.add_argument("--file", help="local .py file to run")
    g.add_argument("--code", help="inline python code")
    r.set_defaults(func=cmd_run)

    s = sub.add_parser("sh", help="run a shell command in the sandbox")
    s.add_argument("command")
    s.set_defaults(func=cmd_sh)

    u = sub.add_parser("up", help="upload a local file into the sandbox")
    u.add_argument("local")
    u.add_argument("remote", nargs="?")
    u.set_defaults(func=cmd_up)

    d = sub.add_parser("down", help="download a file out of the sandbox")
    d.add_argument("remote")
    d.add_argument("local")
    d.set_defaults(func=cmd_down)

    i = sub.add_parser("info", help="show what the sandbox has installed")
    i.set_defaults(func=cmd_info)

    l = sub.add_parser("ls", help="list tracked sandboxes")
    l.set_defaults(func=cmd_ls)

    k = sub.add_parser("kill", help="shut a sandbox down")
    k.add_argument("--all", action="store_true")
    k.set_defaults(func=cmd_kill)

    args = p.parse_args()
    if not load_api_key():
        sys.exit(f"No E2B key found. Set E2B_API_KEY, or put {{\"api_key\": \"...\"}} in {CONFIG}")
    sys.exit(args.func(args))


if __name__ == "__main__":
    main()
