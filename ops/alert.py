"""systemd OnFailure= hook: a SlideAI service stopped and systemd gave up restarting it."""
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))
from app.core import alerts  # noqa: E402

unit = sys.argv[1] if len(sys.argv) > 1 else "?"
tail = subprocess.run(["journalctl", "-u", unit, "-n", "25", "--no-pager", "-o", "cat"], capture_output=True, text=True).stdout
alerts.post(f"⛔ <b>{unit}</b> to'xtadi va qayta ishga tushmadi.\n<pre>{tail[-2500:].replace('<', '&lt;')}</pre>")
