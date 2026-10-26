"""Hourly cleanup (run by the worker): temp folders of jobs that died half-way, and editor background layers
nobody has looked at for 14 days (they are drawn again on request)."""
import shutil
import tempfile
import time
from pathlib import Path

from app.core.config import DATA_DIR

TMP = Path(tempfile.gettempdir())


def sweep():
    now = time.time()
    for p in TMP.glob("slideai-*"):
        try:
            if now - p.stat().st_mtime > 3 * 3600:
                shutil.rmtree(p, ignore_errors=True)
        except OSError:
            pass
    for png in DATA_DIR.glob("*/edits/*/layers/*.png"):
        try:
            if now - png.stat().st_atime > 14 * 86400 and now - png.stat().st_mtime > 14 * 86400:
                png.unlink()
        except OSError:
            pass
