"""AI content: the plan, the checks, asking again; and the HTTP side (Gemini retries, usage, photos) on a fake network."""
import json

import httpx
import pytest

from app.services.ai import catalog, content, images, models


def test_plan_has_fixed_slides():
    plan = catalog.plan_for(12, 1)
    assert plan[0] == "cover" and plan[-1] == "closing" and "sources" in plan and len(plan) == 12


def test_slightly_long_text_is_accepted_after_retries():
    assert content.only_slightly_long(["slayd 3 (agenda): items[0]: 33 belgi, ko'pi bilan 32"])
    assert not content.only_slightly_long(["slayd 3 (agenda): items[0]: 60 belgi, ko'pi bilan 32"])


async def test_until_valid_retries_with_the_errors_then_gives_up():
    asked = []

    async def model(messages):
        asked.append(messages)
        return json.dumps({"slides": []})
    with pytest.raises(RuntimeError, match="tekshiruvdan o'tmadi"):
        await content.generate_content("Mavzu", 8, "uz", 3, ask=model, retries=2)
    assert len(asked) == 3 and "Xatolarni tuzat" in asked[-1][-1]["content"]


@pytest.fixture
def net(monkeypatch):
    """A fake network: answers[url substring] = list of responses, used in turn."""
    answers: dict[str, list] = {}
    seen: list[str] = []

    def handle(req: httpx.Request):
        seen.append(str(req.url))
        for part, queue in answers.items():
            if part in str(req.url):
                return queue.pop(0) if len(queue) > 1 else queue[0]
        return httpx.Response(404)
    monkeypatch.setattr(models, "TRANSPORT", httpx.MockTransport(handle))
    monkeypatch.setattr(models, "RETRY_WAIT", (0, 0, 0, 0))
    monkeypatch.setenv("GEMINI_API_KEY", "k")
    monkeypatch.setenv("PEXELS_API_KEY", "p")
    return answers, seen


async def test_gemini_retries_when_busy_and_reports_every_request(net, monkeypatch):
    answers, seen = net
    ok = {"candidates": [{"content": {"parts": [{"text": '{"ok": 1}'}]}}], "usageMetadata": {"promptTokenCount": 9, "totalTokenCount": 14}}
    answers["generativelanguage"] = [httpx.Response(503), httpx.Response(429), httpx.Response(200, json=ok)]
    usage = []

    async def record(rec):
        usage.append(rec)
    monkeypatch.setattr(models, "on_usage", record)
    models.usage_context.set({"user_id": 5, "purpose": "test", "job": "j"})
    assert await models.gemini([{"role": "user", "content": "x"}]) == '{"ok": 1}'
    assert [u["status"] for u in usage] == ["503", "429", "ok"]
    assert usage[-1]["total_tokens"] == 14 and usage[-1]["user_id"] == 5
    assert len(seen) == 3


async def test_gemini_does_not_retry_a_bad_request(net):
    answers, seen = net
    answers["generativelanguage"] = [httpx.Response(400, text="bad key")]
    with pytest.raises(RuntimeError, match="Gemini 400"):
        await models.gemini([{"role": "user", "content": "x"}])
    assert len(seen) == 1


async def test_photos_come_from_pexels_or_fall_back(net, tmp_path):
    answers, _ = net
    answers["api.pexels.com"] = [httpx.Response(200, json={"photos": [{"src": {"large2x": "https://images.pexels.com/1.jpg"},
                                                                      "photographer": "Ann", "url": "https://pexels.com/p/1"}]})]
    answers["images.pexels.com"] = [httpx.Response(200, content=b"jpegbytes")]
    deck = {"slides": [{"type": "cover", "image": {"query": "tax office"}}, {"type": "image", "image": {"query": "nothing"}}]}

    async def search(query, dest):  # the second one is not found
        if query == "nothing":
            raise LookupError("none")
        return await images.pexels_search(query, dest)
    await images.resolve_images(deck, tmp_path, search)
    assert deck["slides"][0]["image"]["credit"] == "Photo: Ann / Pexels"
    assert (tmp_path / "img-00.jpg").read_bytes() == b"jpegbytes"
    assert deck["slides"][1]["image"]["src"].endswith(".jpg") and deck["slides"][1]["image"]["credit"] == ""  # sample picture
