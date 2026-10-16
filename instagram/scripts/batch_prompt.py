"""Print the batch agent prompt for one batch of manifests (SKILL.md step 2).

  python -I batch_prompt.py <output json> <manifest folder> [<manifest folder> ...]

Built from the reference files so every batch gets the same shape: the part of
references/analysis-shape.md between its two lines, then references/adapt.md,
then this batch's folders and output file.
"""
import os, sys

REF = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "references")


def read(name):
    with open(os.path.join(REF, name), encoding="utf-8") as f:
        return f.read().replace("\r\n", "\n")


def between_lines(text):
    parts = text.split("\n---\n")
    if len(parts) < 3:
        sys.exit("analysis-shape.md needs its two --- lines around the agent brief")
    return parts[1].strip()


def main(a):
    if len(a) < 2:
        sys.exit("usage: batch_prompt.py <output json> <manifest folder> [<manifest folder> ...]")
    sys.stdout.reconfigure(encoding="utf-8")
    out, folders = a[0], a[1:]
    tail = "\n".join(["# This batch", "", "Manifest folders, one post each:", *[f"- {f}" for f in folders], "",
                      f"Write the JSON array to: {out}", "",
                      "Leave `adapt.brief` null and write no brief files; the merging session does that."])
    print("\n\n---\n\n".join([between_lines(read("analysis-shape.md")), read("adapt.md").strip(), tail]))


if __name__ == "__main__":
    main(sys.argv[1:])
