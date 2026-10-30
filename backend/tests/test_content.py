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
    monkeypatch.setattr(models, "RETRY_WAIT", (0,) * len(models.RETRY_WAIT))
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


async def test_only_the_main_model_answers_even_when_it_is_busy_for_long(net):
    answers, seen = net
    ok = {"candidates": [{"content": {"parts": [{"text": '{"ok": 1}'}]}}]}
    answers["generativelanguage"] = [httpx.Response(503)] * 8 + [httpx.Response(200, json=ok)]
    assert await models.gemini([{"role": "user", "content": "x"}]) == '{"ok": 1}'
    assert len(seen) == 9 and all(f"/models/{models.GEMINI_MODEL}:" in u for u in seen)  # no lighter fallback model


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


# ---------------------------------------------------------------- the whole pipeline with a fake model

SAMPLE = json.loads((catalog.ENGINE_DIR / "content" / "soliq.json").read_text(encoding="utf-8"))
BY_TYPE = {s["type"]: s for s in SAMPLE["slides"]}


def answer_for(plan: list[str]) -> str:
    """What a well-behaved model answers: one slide of each requested type (from the sample deck), photos as queries."""
    slides = []
    for tp in plan:
        s = json.loads(json.dumps(BY_TYPE[tp]))
        if "image" in s:
            s["image"] = {"query": "office documents"}
        slides.append(s)
    return json.dumps({"slides": slides}, ensure_ascii=False)


def test_every_slide_type_is_checked():
    for tp in BY_TYPE:
        assert content.check_slide({"type": tp}, photos=True), tp          # empty slide: errors
    _, errors = content.validate({"slides": [{"type": "nope"}]}, ["nope"], True)
    assert any("noma'lum tur" in e for e in errors)


async def test_build_presentation_end_to_end_with_fakes(tmp_path, monkeypatch):
    from app.services.ai import pipeline

    async def model(messages):
        plan = json.loads(messages[0]["content"].split("tartibda: ")[1].split("\n")[0])
        return answer_for(plan)

    async def search(query, dest):
        return {"src": str(catalog.ENGINE_DIR / "demo" / "img" / "chart.jpg"), "credit": "test"}

    drawn = {}

    async def fake_render(c, template_id, out):
        drawn.update(content=c, template=template_id); out.write_bytes(b"pptx"); return out
    monkeypatch.setattr(pipeline, "render", fake_render)
    path, c = await pipeline.build_presentation("Soliq", 3, 10, "uz", meta={"author": "Ali"}, ask=model, search=search)
    assert path.read_bytes() == b"pptx" and c["meta"]["author"] == "Ali" and len(c["slides"]) == 10
    assert all(s["image"]["credit"] == "test" for s in c["slides"] if "image" in s)

    async def restyler(messages):  # the model swaps the photos and rewrites the sources: both are put back
        data = json.loads(messages[0]["content"].rsplit("\n\n", 1)[1])
        for s in data["slides"]:
            if "image" in s:
                s["image"] = {"query": "something else"}
            if s["type"] == "sources":
                s["items"] = ["To'qima manba", "Yana bir", "Uchinchi"]
        return json.dumps(data, ensure_ascii=False)
    _, new = await pipeline.switch_template(c, 7, ask=restyler)
    assert [s.get("image") for s in new["slides"]] == [s.get("image") for s in c["slides"]]
    assert next(s for s in new["slides"] if s["type"] == "sources")["items"] == next(s for s in c["slides"] if s["type"] == "sources")["items"]


# ---------------------------------------------------------------- OpenAI (AI_PROVIDER=openai)

async def test_openai_answers_retries_when_busy_and_reports_usage(net, monkeypatch):
    answers, seen = net
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")
    ok = {"choices": [{"message": {"content": '{"ok": 1}'}, "finish_reason": "stop"}],
          "usage": {"prompt_tokens": 7, "completion_tokens": 5, "total_tokens": 12, "completion_tokens_details": {"reasoning_tokens": 2}}}
    answers["api.openai.com"] = [httpx.Response(429), httpx.Response(503), httpx.Response(200, json=ok)]
    usage = []

    async def record(rec):
        usage.append(rec)
    monkeypatch.setattr(models, "on_usage", record)
    assert await models.openai([{"role": "user", "content": "x"}], "gpt-6.1-terra") == '{"ok": 1}'
    assert [u["status"] for u in usage] == ["429", "503", "ok"] and len(seen) == 3
    assert usage[-1]["model"] == "gpt-6.1-terra" and usage[-1]["output_tokens"] == 5 and usage[-1]["thinking_tokens"] == 2


async def test_openai_drops_the_reasoning_setting_a_model_rejects_and_stops_on_bad_requests(net, monkeypatch):
    answers, seen = net
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")
    ok = {"choices": [{"message": {"content": "{}"}}]}
    answers["api.openai.com"] = [httpx.Response(400, text="Unsupported parameter: 'reasoning_effort'"), httpx.Response(200, json=ok)]
    assert await models.openai([{"role": "user", "content": "x"}]) == "{}"
    assert len(seen) == 2
    answers["api.openai.com"] = [httpx.Response(401, text="invalid key")]
    with pytest.raises(RuntimeError, match="OpenAI 401"):
        await models.openai([{"role": "user", "content": "x"}])


async def test_the_provider_is_chosen_by_ai_provider(net, monkeypatch):
    answers, seen = net
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")
    answers["api.openai.com"] = [httpx.Response(200, json={"choices": [{"message": {"content": '{"from": "openai"}'}}]})]
    answers["generativelanguage"] = [httpx.Response(200, json={"candidates": [{"content": {"parts": [{"text": '{"from": "gemini"}'}]}}]})]
    from app.services import app_settings
    monkeypatch.delenv("AI_PROVIDER", raising=False)
    assert "gemini" in await models.ai([{"role": "user", "content": "x"}])
    monkeypatch.setenv("AI_PROVIDER", "openai")
    app_settings.forget()
    assert "openai" in await models.ai([{"role": "user", "content": "x"}])
    await app_settings.set_many({"ai_model": "gemini:gemini-2.5-flash"}, 1)  # the admin panel's choice wins over .env
    assert "gemini" in await models.ai([{"role": "user", "content": "x"}])
    assert "/models/gemini-2.5-flash:" in seen[-1]
    monkeypatch.setenv("GEMINI_API_KEY", "")  # its key removed from .env: back to the .env default
    assert "openai" in await models.ai([{"role": "user", "content": "x"}])
