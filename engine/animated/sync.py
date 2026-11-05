"""The animated templates are copies of engine/templates with their own motion line at the end. After changing a
template or skin.js / minimal.js:   python3 animated/sync.py   (from engine/)"""
import glob
import os
import shutil

MARK = "\n// animated copy:"
for f in ("skin.js", "minimal.js"):
    shutil.copy(f, os.path.join("animated", f))
for src in glob.glob("templates/*.js"):
    copy = os.path.join("animated", src)
    with open(copy, encoding="utf-8") as fh:
        old = fh.read()
    with open(src, encoding="utf-8") as fh:
        new = fh.read().rstrip("\n") + "\n" + old[old.index(MARK):]
    if new != old:
        with open(copy, "w", encoding="utf-8") as fh:
            fh.write(new)
