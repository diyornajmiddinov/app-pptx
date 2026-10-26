"""Files on disk: deck photos kept with the deck, temp folders and stale editor layers swept."""
import os
import time

from app.services import decks, housekeeping


def test_sweep_removes_only_old_job_folders_and_stale_layers(tmp_path, monkeypatch):
    monkeypatch.setattr(housekeeping, "TMP", tmp_path / "tmp")
    monkeypatch.setattr(housekeeping, "DATA_DIR", tmp_path / "data")
    old, fresh, other = (tmp_path / "tmp" / n for n in ("slideai-old", "slideai-new", "something-else"))
    for d in (old, fresh, other):
        d.mkdir(parents=True)
    layers = tmp_path / "data" / "1" / "edits" / "abc" / "layers"; layers.mkdir(parents=True)
    stale, used = layers / "a.png", layers / "b.png"
    stale.write_bytes(b"x"); used.write_bytes(b"x")
    week3 = time.time() - 21 * 86400
    os.utime(old, (week3, week3)); os.utime(other, (week3, week3)); os.utime(stale, (week3, week3))
    housekeeping.sweep()
    assert not old.exists() and fresh.exists() and other.exists()  # only our own folders
    assert not stale.exists() and used.exists()


def test_deck_photos_move_into_the_deck_folder(tmp_path, monkeypatch):
    monkeypatch.setattr(decks, "DATA", tmp_path)
    src = tmp_path / "job" / "img-00.jpg"; src.parent.mkdir(); src.write_bytes(b"jpg")
    content = {"slides": [{"type": "cover", "image": {"src": str(src), "credit": "c"}}, {"type": "agenda"}]}
    decks.keep_images(5, "77", content)
    kept = tmp_path / "5" / "decks" / "77" / "img-00.jpg"
    assert kept.read_bytes() == b"jpg" and content["slides"][0]["image"] == {"src": str(kept), "credit": "c"}
