"""Error reports: where, what and why."""
import io
import logging
import subprocess
import sys
import urllib.error

from app.core import alerts
from app.services import content_ai


def report(fn, msg="Amal"):
    try:
        fn()
    except BaseException:
        rec = logging.LogRecord("t", logging.ERROR, __file__, 1, msg, None, sys.exc_info(), func="f")
        return alerts.describe("backend", rec)
    raise AssertionError("no error")


def test_code_error_points_at_our_line():
    text = report(lambda: content_ai.parse_json("not json"))
    assert "content_ai.py:" in text and "parse_json()" in text and "JSONDecodeError" in text


def test_gemini_overload_is_explained(monkeypatch):
    monkeypatch.setattr(content_ai, "RETRY_WAIT", ())
    def busy(*a, **k):
        raise urllib.error.HTTPError("https://generativelanguage.googleapis.com/x", 503, "busy", {}, io.BytesIO(b""))
    monkeypatch.setattr(content_ai.urllib.request, "urlopen", busy)
    text = report(lambda: content_ai.gemini([{"role": "user", "content": "x"}]))
    assert "Tashqi xizmat" in text and "503" in text


def test_external_program_error_shows_its_message():
    def run():
        subprocess.run([sys.executable, "-c", "raise TypeError('boom in template')"], check=True, capture_output=True, text=True)
    text = report(run)
    assert "TypeError: boom in template" in text


def test_kinds():
    assert alerts.why(KeyError("x"))[0] == "🐞 Kod xatosi"
    assert "bloklagan" in alerts.why(RuntimeError("Forbidden: bot was blocked by the user"))[1]
