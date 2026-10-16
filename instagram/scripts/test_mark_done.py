"""Tests for mark_done.py's phone summary, its Adapt line and --dry-run.

  python -I test_mark_done.py

Runs mark_done.py --dry-run on a made up five post batch. Every run goes through
python -X importtime, so a test can prove prep.py (the only code that reaches the
phone) was never even imported. Nothing here touches Cloudflare.
"""
import json, os, re, subprocess, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, "mark_done.py")

LONG = ("Five hidden gem films most people scrolled past, counted down on a locked template where "
        "only the big number and its colour change, closing on a question about which ones they have seen.")


def row(rank, rid, adapt=None):
    r = {"id": rid, "rank": rank, "use": 9 - rank, "tier": "maybe", "phone": f"line one {rid}\nline two {rid}"}
    if adapt:
        r["adapt"] = adapt
    return r


ROWS = [
    row(1, "AAA", {"lane": "B1", "hook_type": "empty-list", "seconds": 30, "words": 28,
                   "angle": "Top five moments on a list that starts blank.",
                   "phone": "Five slots fill as each moment plays."}),
    row(2, "BBB", {"lane": "none", "hook_type": "fear", "why_lane": "No lane fits."}),
    row(3, "CCC"),
    row(4, "DDD", {"lane": "B2", "hook_type": "number", "seconds": 30, "words": 84, "angle": LONG}),
    row(5, "EEE", {"lane": "C1", "hook_type": "proof-first", "seconds": 30, "words": 84,
                   "angle": "Our real pipeline.", "phone": "Five real steps, saved reel to finished short."}),
]


def run(*args):
    d = tempfile.mkdtemp()
    path = os.path.join(d, "results.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(ROWS, f)
    r = subprocess.run([sys.executable, "-I", "-X", "importtime", SCRIPT, path, *args],
                       capture_output=True, text=True, encoding="utf-8")
    return r


def blocks(out):
    """{rank: text} for each '--- #N' block the dry run prints."""
    parts = re.split(r"^--- #(\d+) .*$", out, flags=re.M)
    return {int(parts[i]): parts[i + 1].strip() for i in range(1, len(parts), 2)}


class DryRun(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        src = open(SCRIPT, encoding="utf-8").read()
        # the old script took argv[2] as the report url and wrote to the phone at once
        cls.unsafe = "--dry-run" not in src or "__main__" not in src
        if not cls.unsafe:
            cls.r = run("https://claude.ai/x/report", "--dry-run")
            cls.out = blocks(cls.r.stdout)

    def setUp(self):
        if self.unsafe:
            self.fail("mark_done.py has no --dry-run yet, so the test refuses to run it")

    def test_exits_cleanly(self):
        self.assertEqual(self.r.returncode, 0, self.r.stderr[-500:])

    def test_dry_run_never_imports_the_phone_code(self):
        loaded = re.findall(r"\|\s+([\w.]+)\s*$", self.r.stderr, flags=re.M)
        self.assertIn("json", loaded)  # proves the import log was read
        self.assertNotIn("prep", loaded)

    def test_summary_is_rank_use_tier_then_the_phone_lines(self):
        self.assertTrue(self.out[3].startswith("#3 of 5 · Use 6/10 · Maybe\nline one CCC\nline two CCC"))

    def test_adapt_line_uses_the_fields_phone_line(self):
        self.assertIn("\nAdapt: B1, empty list, 30s. Five slots fill as each moment plays.", self.out[1])

    def test_hook_type_reads_as_words(self):
        self.assertIn("Adapt: C1, proof first, 30s. Five real steps, saved reel to finished short.", self.out[5])

    def test_adapt_line_falls_back_to_the_angle_cut_on_a_word(self):
        line = next(l for l in self.out[4].splitlines() if l.startswith("Adapt:"))
        self.assertLess(len(line), 100)
        self.assertTrue(line.startswith("Adapt: B2, number, 30s. Five hidden gem films"))
        self.assertTrue(line.endswith("…"))
        kept = line[len("Adapt: B2, number, 30s. "):-1]
        self.assertTrue(LONG.startswith(kept))
        self.assertIn(LONG[len(kept)], " ,;:.")  # cut between words, trailing comma dropped

    def test_no_adapt_line_without_a_lane(self):
        self.assertNotIn("Adapt:", self.out[2])
        self.assertNotIn("Adapt:", self.out[3])

    def test_report_link_points_at_the_card(self):
        self.assertIn("report: https://claude.ai/x/report#r4", self.out[4])

    def test_only_prints_the_ranks_asked_for(self):
        r = run("https://claude.ai/x/report", "--dry-run", "--only", "1,4")
        self.assertEqual(sorted(blocks(r.stdout)), [1, 4])

    def test_dry_run_works_without_a_report_link(self):
        r = run("--dry-run", "--only", "3")
        self.assertEqual(r.returncode, 0, r.stderr[-500:])
        self.assertIn("report: none", blocks(r.stdout)[3])


if __name__ == "__main__":
    unittest.main(verbosity=2)
