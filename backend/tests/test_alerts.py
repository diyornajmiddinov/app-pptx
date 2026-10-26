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


def test_same_error_goes_to_the_channel_once(monkeypatch):
    h = alerts.ChannelHandler.__new__(alerts.ChannelHandler)
    logging.Handler.__init__(h, logging.ERROR)
    import queue
    h.service, h.q, h.seen, h.sent = "t", queue.Queue(), {}, []
    rec = logging.LogRecord("x", logging.ERROR, __file__, 1, "Boom", None, None, func="f")
    h.emit(rec); h.emit(rec)
    assert h.q.qsize() == 1 and "Boom" in h.q.get()


def test_post_falls_back_to_plain_text_when_html_is_refused(monkeypatch):
    from conftest import REAL_POST
    sent = []

    def fake_post(url, json=None, **kw):
        sent.append(json)
        return httpx.Response(400 if json.get("parse_mode") else 200)  # Telegram: "can't parse entities"
    monkeypatch.setattr(alerts.httpx, "post", fake_post)
    monkeypatch.setenv("LOG_CHANNEL_ID", "-100")
    assert REAL_POST("<b>broken <i>html</b> 1 < 2 &amp; done")
    assert len(sent) == 2 and "parse_mode" not in sent[1] and sent[1]["text"] == "broken html 1 < 2 & done"
