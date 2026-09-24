#!/usr/bin/env python3
"""Ledger for the `generate` skill.

Every render gets one line of JSON: what was asked for, which backend and
model answered, what it cost, where the file landed, and the prompt that
actually worked. The point is that the next version of a shot starts from a
prompt that already worked instead of a blank one.

Lives outside ~/.claude/skills on purpose: that folder is the public repo
YourFutureSiteDev/Claude-Skills, and these entries hold client prompts and
client file paths.

Usage:
    ledger.py add --kind image --backend everygen --model nano-banana-2 \
        --credits 2 --path out.png --prompt "..." [--project "Client Name"]
    ledger.py search "serum bottle" [--limit 5]
    ledger.py recent [--limit 10]
    ledger.py report
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

LEDGER = Path(
    os.environ.get("GENERATE_LEDGER")
    or Path.home() / ".claude" / "generate-ledger.jsonl"
)


def load() -> list[dict]:
    if not LEDGER.exists():
        return []
    rows = []
    for line in LEDGER.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            # A half-written line should not take the whole ledger down.
            continue
    return rows


def cmd_add(args: argparse.Namespace) -> int:
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "kind": args.kind,
        "backend": args.backend,
        "model": args.model,
        "credits": args.credits,
        "path": args.path,
        "prompt": args.prompt,
        "project": args.project,
        "notes": args.notes,
    }
    with LEDGER.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(entry, ensure_ascii=False) + "\n")
    cost = f"{args.credits} credits" if args.credits else "free"
    print(f"logged: {args.kind} via {args.backend}/{args.model}, {cost}")
    return 0


def _matches(row: dict, terms: list[str]) -> bool:
    hay = " ".join(
        str(row.get(k) or "")
        for k in ("prompt", "path", "project", "model", "notes")
    ).lower()
    return all(t in hay for t in terms)


def _show(rows: list[dict]) -> None:
    if not rows:
        print("nothing in the ledger matches.")
        return
    for row in rows:
        date = (row.get("at") or "")[:10]
        cost = row.get("credits") or 0
        cost_s = f"{cost}cr" if cost else "free"
        head = f"{date}  {row.get('kind', '?')}  {row.get('model', '?')}  {cost_s}"
        if row.get("project"):
            head += f"  [{row['project']}]"
        print(head)
        prompt = (row.get("prompt") or "").replace("\n", " ")
        if prompt:
            print(f"    {prompt[:300]}")
        if row.get("path"):
            print(f"    -> {row['path']}")
        print()


def cmd_search(args: argparse.Namespace) -> int:
    terms = [t.lower() for t in args.terms if t.strip()]
    if not terms:
        print("give me something to search for.", file=sys.stderr)
        return 2
    hits = [r for r in load() if _matches(r, terms)]
    hits.reverse()
    _show(hits[: args.limit])
    return 0


def cmd_recent(args: argparse.Namespace) -> int:
    rows = load()
    rows.reverse()
    _show(rows[: args.limit])
    return 0


def cmd_report(args: argparse.Namespace) -> int:
    rows = load()
    if not rows:
        print("ledger is empty.")
        return 0

    by_backend: dict[str, list[int]] = defaultdict(list)
    by_month: dict[str, int] = defaultdict(int)
    for row in rows:
        credits = row.get("credits") or 0
        by_backend[row.get("backend") or "unknown"].append(credits)
        by_month[(row.get("at") or "")[:7]] += credits

    total = sum(r.get("credits") or 0 for r in rows)
    print(f"{len(rows)} renders, {total} credits total\n")

    print("by backend")
    for backend, costs in sorted(by_backend.items()):
        noun = "render " if len(costs) == 1 else "renders"
        print(f"  {backend:<16} {len(costs):>4} {noun}   {sum(costs):>5} credits")

    print("\nby month")
    for month, credits in sorted(by_month.items()):
        if month:
            print(f"  {month}      {credits:>5} credits")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)

    add = sub.add_parser("add", help="log a render")
    add.add_argument("--kind", required=True, choices=["image", "video", "audio"])
    add.add_argument("--backend", required=True,
                     choices=["wangp", "chatgpt-photos", "everygen"])
    add.add_argument("--model", required=True)
    add.add_argument("--credits", type=int, default=0)
    add.add_argument("--path", required=True)
    add.add_argument("--prompt", required=True)
    add.add_argument("--project", default=None)
    add.add_argument("--notes", default=None)
    add.set_defaults(func=cmd_add)

    search = sub.add_parser("search", help="find a prompt that worked before")
    search.add_argument("terms", nargs="+")
    search.add_argument("--limit", type=int, default=5)
    search.set_defaults(func=cmd_search)

    recent = sub.add_parser("recent", help="the last N renders")
    recent.add_argument("--limit", type=int, default=10)
    recent.set_defaults(func=cmd_recent)

    report = sub.add_parser("report", help="what the renders have cost")
    report.set_defaults(func=cmd_report)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
