"""Tests for build_page.py's Adapt it block and lane chips.

  python -I test_build_page.py

Builds a three post batch in a temp folder (one adapted to B1, one with lane
none, one with no adapt field), runs build_page.py --from on it and reads the
page it writes. No real batch, no network.
"""
import json, os, re, subprocess, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))


def row(rank, rid, **extra):
    r = {"id": rid, "creator": f"Creator {rank}", "kind": "video", "what": "what", "hook": "hook",
         "structure": "0:00 a | 0:05 b", "editing": "editing", "why": "why", "steal": ["steal"],
         "takeaway": "takeaway", "use": 9 - rank, "craft": 5, "tier": "maybe", "hype": False,
         "flags": [], "verdict": "verdict", "phone": "phone", "topic": "Marketing",
         "url": f"https://www.instagram.com/reel/{rid}/", "likes": 10, "comments": 2,
         "duration": 20.0, "slides": None, "rank": rank}
    r.update(extra)
    return r


B1 = {"lane": "B1", "hook_type": "empty-list", "seconds": 30, "words": 28,
      "beats": [{"at": "0-1", "job": "title and five blank slots"},
                {"at": "1-27", "job": "clips fill the slots"},
                {"at": "27-30", "job": "opinion question"}],
      "angle": "A blank top five that fills clip by clip.",
      "why_lane": "B1 ranks five clips already.",
      "brief": "instagram-research/2026-10-16/adapt/AAA.json"}
B2 = dict(B1, lane="B2", hook_type="number", words=84, brief=None)
NONE = {"lane": "none", "hook_type": "fear", "why_lane": "A trading chart, no lane fits.",
        "beats": None, "seconds": None, "words": None, "angle": None, "brief": None}
PATTERNS = {"lede": "lede", "topics": {}, "act": [{"id": "AAA", "text": "act on it"}],
            "patterns": [{"title": "p", "count": "1 of 3", "body": "b"}]}


def build(rows):
    d = os.path.join(tempfile.mkdtemp(), "2026-10-16")
    os.makedirs(d)
    for name, data in (("results.json", rows), ("patterns.json", PATTERNS)):
        with open(os.path.join(d, name), "w", encoding="utf-8") as f:
            json.dump(data, f)
    r = subprocess.run([sys.executable, "-I", os.path.join(HERE, "build_page.py"), "--from",
                        os.path.join(d, "results.json")], capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    with open(os.path.join(d, "report.html"), encoding="utf-8") as f:
        return f.read()


def card(page, rank):
    m = re.search(rf'<article class="card [^"]*" id="r{rank}".*?</article>', page, re.S)
    return m.group(0)


class AdaptBlock(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.page = build([row(1, "AAA", adapt=B1), row(2, "BBB", adapt=NONE), row(3, "CCC"),
                          row(4, "DDD", adapt=B2)])

    def test_laned_card_shows_lane_hook_length_beats_angle_and_brief(self):
        c = card(self.page, 1)
        self.assertIn("Adapt it", c)
        self.assertRegex(c, r'class="pill lane"[^>]*>B1 ')
        self.assertIn("empty list", c)
        self.assertIn("30 s, 28 on screen words", c)
        self.assertEqual(len(re.findall(r'<li class="beat">', c)), 3)
        self.assertIn("0 to 1 s", c)
        self.assertIn("A blank top five that fills clip by clip.", c)
        self.assertIn("instagram-research/2026-10-16/adapt/AAA.json", c)

    def test_voiced_lane_counts_spoken_words(self):
        c = card(self.page, 4)
        self.assertIn("30 s, 84 words", c)
        self.assertNotIn("on screen words", c)
        self.assertNotIn("adapt/", c)

    def test_lane_none_says_why_and_has_no_beats(self):
        c = card(self.page, 2)
        self.assertIn("Adapt it", c)
        self.assertIn("No lane", c)
        self.assertIn("A trading chart, no lane fits.", c)
        self.assertNotIn('class="beat"', c)

    def test_card_without_adapt_has_no_block(self):
        self.assertNotIn("Adapt it", card(self.page, 3))

    def test_cards_and_contents_carry_lane_for_the_filter(self):
        self.assertRegex(card(self.page, 1), r'^<article [^>]*data-lane="B1"')
        self.assertRegex(card(self.page, 3), r'^<article [^>]*data-lane=""')
        self.assertRegex(self.page, r"<li data-tier='maybe' data-topic='Marketing' data-lane='B1'>")

    def test_lane_chips_list_each_lane_with_its_count(self):
        chips = re.findall(r"data-k='lane' data-v='([^']+)'[^>]*>([^<]+)<span>(\d+)</span>", self.page)
        self.assertEqual([(v, n) for v, _, n in chips], [("B1", "1"), ("B2", "1")])

    def test_jump_gap_follows_the_filter_bar_height(self):
        # the lane row makes the sticky bar taller; a fixed gap hid card headers under it
        self.assertIn("scroll-margin-top:calc(var(--fh,120px) + 16px)", self.page)
        self.assertIn("setProperty('--fh'", self.page)

    def test_page_fits_a_phone_when_opened_locally(self):
        self.assertIn('<meta name="viewport" content="width=device-width, initial-scale=1">', self.page)

    def test_no_dash_punctuation_in_adapt_blocks(self):
        for rank in (1, 2, 4):
            self.assertNotRegex(card(self.page, rank), "[–—]")


class OldBatch(unittest.TestCase):
    def test_batch_without_adapt_has_no_lane_row(self):
        page = build([row(1, "AAA"), row(2, "BBB")])
        self.assertNotIn("data-k='lane'", page)
        self.assertNotIn("Adapt it", page)


if __name__ == "__main__":
    unittest.main(verbosity=2)
