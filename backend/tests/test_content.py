"""AI content checks (no AI calls: a fake model answers)."""
import json

from app.services import content_ai


def test_plan_has_fixed_slides():
    plan = content_ai.plan_for(12, 1)
    assert plan[0] == "cover" and plan[-1] == "closing" and "sources" in plan and len(plan) == 12


def test_slightly_long_text_is_accepted_after_retries():
    errors = ["slayd 3 (agenda): items[0]: 33 belgi, ko'pi bilan 32"]
    assert content_ai._only_slightly_long(errors)
    assert not content_ai._only_slightly_long(["slayd 3 (agenda): items[0]: 60 belgi, ko'pi bilan 32"])


def test_until_valid_retries_with_the_errors_then_gives_up():
    asked = []
    def model(messages):
        asked.append(messages)
        return json.dumps({"slides": []})
    try:
        content_ai.generate_content("Mavzu", 8, "uz", 3, ask=model, retries=2)
    except RuntimeError as e:
        assert "tekshiruvdan o'tmadi" in str(e)
    assert len(asked) == 3 and "Xatolarni tuzat" in asked[-1][-1]["content"]
