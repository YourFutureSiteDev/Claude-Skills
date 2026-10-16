"""Tests for write_briefs.py, which turns each keep or maybe row's adapt field into
its video-team brief file.

  python -W error -I test_write_briefs.py

Builds a made up batch in a temp folder laid out like the real one
(<tmp>/Content Engine/instagram-research/2026-10-16/results.json), with three rows
shaped like the 16 Oct hand-made briefs (cards 13, 27 and 48), a keep row, a skip
row, a none row and a row with no adapt field. No real batch, no network.
"""
import json, os, re, subprocess, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SCRIPT = os.path.join(HERE, "write_briefs.py")
DATE = "2026-10-16"

# key order of the hand-made briefs in instagram-research/2026-10-16/adapt/
HAND_KEYS = ["_comment", "slug", "_lane", "_adaptedFrom", "_angle", "_angleWhy", "_hookType", "_hooks",
             "_beats", "_wordBudget", "_wordBudgetNote", "script", "voice", "rate", "_cta", "_renderNote"]
# the beat words the hand-made B2 and C1 briefs carry: 30 s at 2.8 words a second
HAND_VOICED_WORDS = [6, 14, 14, 14, 14, 14, 8]

SEVEN = ["0-2", "2-7", "7-12", "12-17", "17-22", "22-27", "27-30"]


def row(rank, rid, tier, adapt=None, **extra):
    r = {"id": rid, "creator": f"Creator {rank}", "kind": "video", "tier": tier, "rank": rank,
         "hook": "hook", "structure": "0:00 a | 0:05 b", "url": f"https://www.instagram.com/reel/{rid}/",
         "duration": 20.0, "slides": None}
    r.update(extra)
    if adapt is not None:
        r["adapt"] = adapt
    return r


def adapt(lane, hook, ats, words, seconds=30, **extra):
    a = {"lane": lane, "hook_type": hook, "seconds": seconds, "words": words,
         "beats": [{"at": at, "job": f"beat {i} of {lane}"} for i, at in enumerate(ats)],
         "angle": f"The {lane} angle in our own words.", "why_lane": f"Why {lane} fits.",
         "phone": f"{lane} idea for the phone.", "brief": None}
    a.update(extra)
    return a


NONE = {"lane": "none", "hook_type": "fear", "why_lane": "A trading chart, no lane fits.",
        "beats": None, "seconds": None, "words": None, "angle": None, "phone": None, "brief": None}

ROWS = [
    row(1, "KKK", "keep", adapt("A2", "question", ["0-3", "3-12", "12-15"], 42, seconds=15)),
    row(2, "SSS", "skip", adapt("B2", "number", SEVEN, 84, brief="instagram-research/2026-10-16/adapt/SSS.json")),
    row(3, "NNN", "keep", dict(NONE)),
    row(4, "XXX", "maybe"),
    row(13, "CCC", "maybe", adapt("C1", "proof-first", SEVEN, 84), kind="carousel", duration=None, slides=8),
    row(27, "AAA", "maybe", adapt("B1", "empty-list", ["0-1", "1-6", "6-11", "11-16", "16-21", "21-27", "27-30"], 28),
        duration=43.0),
    row(48, "BBB", "maybe", adapt("B2", "number", SEVEN, 84), kind="carousel", duration=None, slides=9),
]


def batch(rows=ROWS):
    ce = os.path.join(tempfile.mkdtemp(), "Content Engine")
    d = os.path.join(ce, "instagram-research", DATE)
    os.makedirs(d)
    path = os.path.join(d, "results.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=1, ensure_ascii=False)
    return path


def run(path, *args):
    return subprocess.run([sys.executable, "-W", "error", "-I", SCRIPT, path, *args],
                          capture_output=True, text=True, encoding="utf-8")


def load(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def adapt_dir(path):
    return os.path.join(os.path.dirname(path), "adapt")


def listed(out):
    """ranks named on the per row lines the script prints"""
    return sorted(int(m) for m in re.findall(r"^\S.*?#(\d+) ", out, flags=re.M))


class Writes(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.path = batch()
        cls.r = run(cls.path)
        cls.rows = {r["id"]: r for r in load(cls.path)}
        d = adapt_dir(cls.path)
        cls.briefs = {f[:-5]: load(os.path.join(d, f)) for f in os.listdir(d)} if os.path.isdir(d) else {}

    def test_exits_cleanly(self):
        self.assertEqual(self.r.returncode, 0, self.r.stdout[-500:] + self.r.stderr[-500:])
        self.assertEqual(self.r.stderr, "")

    def test_a_brief_only_for_keep_and_maybe_rows_with_a_lane(self):
        self.assertEqual(sorted(self.briefs), ["AAA", "BBB", "CCC", "KKK"])

    def test_row_points_at_its_brief_from_the_content_engine_folder(self):
        self.assertEqual(self.rows["AAA"]["adapt"]["brief"], f"instagram-research/{DATE}/adapt/AAA.json")
        self.assertEqual(self.rows["KKK"]["adapt"]["brief"], f"instagram-research/{DATE}/adapt/KKK.json")

    def test_skip_and_none_rows_keep_brief_null(self):
        self.assertIsNone(self.rows["SSS"]["adapt"]["brief"])
        self.assertIsNone(self.rows["NNN"]["adapt"]["brief"])
        self.assertNotIn("adapt", self.rows["XXX"])

    def test_the_rest_of_each_row_is_untouched(self):
        before = {r["id"]: r for r in ROWS}
        for rid, r in self.rows.items():
            a, b = dict(r), dict(before[rid])
            if "adapt" in a:
                a["adapt"] = {k: v for k, v in a["adapt"].items() if k != "brief"}
                b["adapt"] = {k: v for k, v in b["adapt"].items() if k != "brief"}
            self.assertEqual(a, b, rid)

    def test_brief_keys_match_the_hand_made_briefs(self):
        for rid, b in self.briefs.items():
            self.assertEqual(list(b), HAND_KEYS, rid)

    def test_voiced_beats_match_the_hand_made_cards_13_and_48(self):
        for rid in ("BBB", "CCC"):
            self.assertEqual([x["words"] for x in self.briefs[rid]["_beats"]], HAND_VOICED_WORDS, rid)

    def test_beat_words_sum_to_the_word_budget(self):
        for rid, b in self.briefs.items():
            self.assertEqual(sum(x["words"] for x in b["_beats"]), b["_wordBudget"], rid)
            self.assertEqual(b["_wordBudget"], self.rows[rid]["adapt"]["words"], rid)

    def test_beats_carry_at_and_the_job(self):
        b = self.briefs["KKK"]["_beats"]
        self.assertEqual([list(x) for x in b], [["at", "beat", "words"]] * 3)
        self.assertEqual([x["at"] for x in b], ["0-3", "3-12", "12-15"])
        self.assertEqual(b[1]["beat"], "Beat 1 of A2")
        self.assertEqual([x["words"] for x in b], [9, 25, 8])  # tie on 8.4 goes to the earlier beat

    def test_no_voice_lane_counts_on_screen_words(self):
        b = self.briefs["AAA"]
        self.assertIsNone(b["voice"])
        self.assertIsNone(b["rate"])
        self.assertIn("on screen", b["_wordBudgetNote"])
        self.assertIn("TTS rail cannot render", b["_renderNote"])

    def test_voice_rate_and_cta_come_from_the_lane_table(self):
        self.assertEqual((self.briefs["BBB"]["voice"], self.briefs["BBB"]["rate"]), ("en-US-AndrewNeural", "+5%"))
        self.assertEqual((self.briefs["KKK"]["voice"], self.briefs["KKK"]["rate"]), ("en-US-AvaNeural", "+8%"))
        self.assertEqual((self.briefs["CCC"]["voice"], self.briefs["CCC"]["rate"]), (None, "+8%"))
        self.assertTrue(self.briefs["BBB"]["_cta"].startswith("Weekly"))
        self.assertTrue(self.briefs["KKK"]["_cta"].startswith("None. Story accounts die when they sell"))
        self.assertIn("Whop", self.briefs["CCC"]["_cta"])
        self.assertIn("not live until month 3", self.briefs["CCC"]["_renderNote"])

    def test_role_two_and_four_fields_start_empty(self):
        for rid, b in self.briefs.items():
            self.assertEqual(b["_hooks"], [], rid)
            self.assertEqual(b["script"], "", rid)

    def test_angle_hook_and_lane_come_from_the_row(self):
        b = self.briefs["AAA"]
        self.assertEqual((b["_lane"], b["_hookType"]), ("B1", "empty-list"))
        self.assertEqual(b["_angle"], "The B1 angle in our own words.")
        self.assertEqual(b["_angleWhy"], "Why B1 fits.")

    def test_adapted_from_names_the_source(self):
        self.assertEqual(self.briefs["AAA"]["_adaptedFrom"],
                         {"id": "AAA", "creator": "Creator 27", "hookType": "empty-list",
                          "url": "https://www.instagram.com/reel/AAA/", "seconds": 43})
        self.assertEqual(self.briefs["BBB"]["_adaptedFrom"]["slides"], 9)
        self.assertNotIn("seconds", self.briefs["BBB"]["_adaptedFrom"])

    def test_slug_names_the_date_lane_and_hook(self):
        self.assertTrue(self.briefs["AAA"]["slug"].startswith(f"{DATE}-adapt-b1-empty-list-"))
        slugs = [b["slug"] for b in self.briefs.values()]
        self.assertEqual(len(set(slugs)), len(slugs))
        for s in slugs:
            self.assertRegex(s, r"^[a-z0-9-]+$")

    def test_comment_dates_the_batch(self):
        self.assertIn("16 Oct 2026 batch", self.briefs["AAA"]["_comment"])

    def test_reminds_to_run_adapt_check(self):
        self.assertIn("adapt_check.py", self.r.stdout)

    def test_lists_each_brief_row(self):
        self.assertEqual(listed(self.r.stdout), [1, 13, 27, 48])


class Keeps(unittest.TestCase):
    def setUp(self):
        self.path = batch()
        os.makedirs(adapt_dir(self.path))
        self.hand = os.path.join(adapt_dir(self.path), "AAA.json")
        with open(self.hand, "w", encoding="utf-8") as f:
            f.write('{"hand": "edited"}')

    def test_existing_brief_survives_without_force(self):
        r = run(self.path)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        with open(self.hand, encoding="utf-8") as f:
            self.assertEqual(f.read(), '{"hand": "edited"}')
        self.assertRegex(r.stdout, r"kept.*#27 AAA")
        rows = {x["id"]: x for x in load(self.path)}
        self.assertEqual(rows["AAA"]["adapt"]["brief"], f"instagram-research/{DATE}/adapt/AAA.json")

    def test_force_overwrites_it(self):
        r = run(self.path, "--force")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertEqual(load(self.hand)["_lane"], "B1")

    def test_a_second_run_changes_nothing(self):
        run(self.path)
        with open(self.path, "rb") as f:
            first = f.read()
        r = run(self.path)
        with open(self.path, "rb") as f:
            self.assertEqual(f.read(), first)
        self.assertNotRegex(r.stdout, r"(?m)^wrote")


class DryRun(unittest.TestCase):
    def test_lists_the_rows_and_writes_nothing(self):
        path = batch()
        with open(path, "rb") as f:
            before = f.read()
        r = run(path, "--dry-run")
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertEqual(listed(r.stdout), [1, 13, 27, 48])
        self.assertFalse(os.path.exists(adapt_dir(path)))
        with open(path, "rb") as f:
            self.assertEqual(f.read(), before)
        self.assertIn("nothing written", r.stdout)


class Refuses(unittest.TestCase):
    def test_a_lane_not_in_the_table_fails_that_row(self):
        path = batch(ROWS + [row(60, "BAD", "keep", adapt("B3", "number", SEVEN, 84))])
        r = run(path)
        self.assertEqual(r.returncode, 1)
        self.assertRegex(r.stdout, r"FAIL #60 BAD.*B3")
        self.assertFalse(os.path.exists(os.path.join(adapt_dir(path), "BAD.json")))
        self.assertTrue(os.path.exists(os.path.join(adapt_dir(path), "AAA.json")))

    def test_a_beat_with_no_seconds_fails_that_row(self):
        path = batch([row(61, "ODD", "keep", adapt("B2", "number", ["0-2", "soon"], 84))])
        r = run(path)
        self.assertEqual(r.returncode, 1)
        self.assertRegex(r.stdout, r"FAIL #61 ODD.*soon")

    def test_words_far_from_the_lane_rate_get_a_check_line(self):
        path = batch([row(62, "FST", "keep", adapt("A2", "question", ["0-15"], 60, seconds=15))])
        r = run(path)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertRegex(r.stdout, r"check #62 FST.*60.*42")


if __name__ == "__main__":
    unittest.main(verbosity=1)
