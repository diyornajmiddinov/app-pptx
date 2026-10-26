"""
The language models over HTTP (async): Gemini when GEMINI_API_KEY is set, otherwise Claude.

Gemini: a busy / slow answer is retried up to 5 times with pauses, moving through the fallback models; a model that
rejects the thinking setting is asked again without it. Every request — failed ones and retries too — is reported
to `on_usage` (the worker points it at the ai_usage table), tagged with `usage_context` (whose job it is).
"""
import asyncio
import contextvars
import os
import time
from collections.abc import Awaitable, Callable

import httpx

CLAUDE_MODEL = os.getenv("SLIDEAI_MODEL", "claude-sonnet-5-5")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")  # a fixed model: "*-latest" moves to the newest one, often overloaded (503)
GEMINI_FALLBACKS = [m for m in os.getenv("GEMINI_FALLBACKS", "gemini-3.5-flash,gemini-flash-lite-latest").split(",") if m]
GEMINI_THINKING = os.getenv("GEMINI_THINKING", "low")  # "low" answers much faster; "" = the model's default
GEMINI_IMAGE_MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
RETRY_WAIT = (3, 8, 15, 25)  # s between the 5 attempts
RETRYABLE = (429, 500, 502, 503, 504)

Messages = list[dict]
Ask = Callable[[Messages], Awaitable[str]]

usage_context: contextvars.ContextVar[dict | None] = contextvars.ContextVar("usage_context", default=None)
on_usage: Callable[[dict], Awaitable[object]] | None = None
TRANSPORT: httpx.AsyncBaseTransport | None = None  # tests put an httpx.MockTransport here


def client(timeout: float) -> httpx.AsyncClient:
    return httpx.AsyncClient(timeout=httpx.Timeout(timeout, connect=15), transport=TRANSPORT)


async def _report(model: str, op: str, status: str, started: float, data: dict | None = None):
    if on_usage is None:
        return
    u = (data or {}).get("usageMetadata") or {}
    try:
        await on_usage({**(usage_context.get() or {}), "model": model, "op": op, "status": status, "ms": int((time.time() - started) * 1000),
                        "prompt_tokens": u.get("promptTokenCount", 0), "output_tokens": u.get("candidatesTokenCount", 0),
                        "thinking_tokens": u.get("thoughtsTokenCount", 0), "total_tokens": u.get("totalTokenCount", 0)})
    except Exception:  # accounting must never break a paid job
        pass


async def gemini_call(model: str, body: dict, http_timeout: float = 180) -> dict:
    """One generateContent request. Raises httpx.HTTPStatusError / httpx.TimeoutException / httpx.TransportError."""
    op, started = ("image" if model == GEMINI_IMAGE_MODEL else "text"), time.time()
    try:
        async with client(http_timeout) as c:
            r = await c.post(GEMINI_URL.format(model=model), json=body, headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"]})
            r.raise_for_status()
            data = r.json()
    except httpx.HTTPStatusError as e:
        await _report(model, op, str(e.response.status_code), started); raise
    except httpx.TransportError:  # timeouts are transport errors too
        await _report(model, op, "timeout", started); raise
    await _report(model, op, "ok", started, data)
    return data


async def gemini_generate(contents: list[dict]) -> dict:
    models = [GEMINI_MODEL] + [m for m in GEMINI_FALLBACKS if m != GEMINI_MODEL]
    thinking = {"thinkingConfig": {"thinkingLevel": GEMINI_THINKING}} if GEMINI_THINKING else {}
    last = None
    for attempt in range(len(RETRY_WAIT) + 1):
        model = models[attempt % len(models)]
        config = {"responseMimeType": "application/json", "maxOutputTokens": 32000, "temperature": 0.7, **thinking}
        try:
            return await gemini_call(model, {"contents": contents, "generationConfig": config}, http_timeout=150)
        except httpx.HTTPStatusError as e:
            code, body = e.response.status_code, e.response.text
            if code == 400 and thinking and "think" in body.lower():
                thinking = {}; continue  # this model has no thinking levels
            if code not in RETRYABLE:
                raise RuntimeError(f"Gemini {code}: {body[:300]}") from e
            last = f"Gemini {code} ({model})"
        except httpx.TransportError as e:
            last = f"Gemini timeout ({model}): {type(e).__name__}"
        if attempt < len(RETRY_WAIT):
            await asyncio.sleep(RETRY_WAIT[attempt])
    raise RuntimeError(f"Gemini javob bermadi: {last}")


async def gemini(messages: Messages) -> str:
    """Chat messages in, text out (JSON mode, so the reply is plain JSON)."""
    contents = [{"role": "model" if m["role"] == "assistant" else "user", "parts": [{"text": m["content"]}]} for m in messages]
    data = await gemini_generate(contents)
    parts = ((data.get("candidates") or [{}])[0].get("content") or {}).get("parts") or []
    text = "".join(p.get("text", "") for p in parts if not p.get("thought"))
    if not text:
        raise RuntimeError(f"Gemini: bo'sh javob ({(data.get('candidates') or [{}])[0].get('finishReason', data.get('promptFeedback'))})")
    return text


async def claude(messages: Messages) -> str:
    import anthropic
    r = await anthropic.AsyncAnthropic().messages.create(model=CLAUDE_MODEL, max_tokens=12000, messages=messages)  # type: ignore[arg-type]
    return "".join(b.text for b in r.content if b.type == "text")


async def ai(messages: Messages) -> str:
    """The configured model."""
    return await (gemini(messages) if os.getenv("GEMINI_API_KEY") else claude(messages))
