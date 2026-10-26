"""Error reports: where, what and why."""
import asyncio
import logging
import subprocess
import sys

import httpx

from app.core import alerts
from app.services.ai import content, models


def report(fn, msg="Amal"):
    try:
        fn()
    except BaseException:
        rec = logging.LogRecord("t", logging.ERROR, __file__, 1, msg, None, sys.exc_info(), func="f")
        return alerts.describe("backend", rec)
    raise AssertionError("no error")


def test_code_error_points_at_our_line():
    text = report(lambda: content.parse_json("not json"))
    assert "content.py:" in text and "parse_json()" in text and "JSONDecodeError" in text


def test_gemini_overload_is_explained(monkeypatch):
    monkeypatch.setattr(models, "RETRY_WAIT", ())
    monkeypatch.setenv("GEMINI_API_KEY", "k")
    monkeypatch.setattr(models, "TRANSPORT", httpx.MockTransport(lambda r: httpx.Response(503, json={"error": "busy"})))
    text = report(lambda: asyncio.run(models.gemini([{"role": "user", "content": "x"}])))
    assert "Tashqi xizmat" in text and "503" in text


def test_external_program_error_shows_its_message():
    def run():
        subprocess.run([sys.executable, "-c", "raise TypeError('boom in template')"], check=True, capture_output=True, text=True)
    text = report(run)
    assert "TypeError: boom in template" in text


def test_kinds():
    assert alerts.why(KeyError("x"))[0] == "🐞 Kod xatosi"
    assert "bloklagan" in alerts.why(RuntimeError("Forbidden: bot was blocked by the user"))[1]
