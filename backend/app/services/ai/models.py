"""
The language models over HTTP (async): AI_PROVIDER=openai uses OpenAI (OPENAI_MODEL); otherwise Gemini when
GEMINI_API_KEY is set, else Claude.

Gemini: only GEMINI_MODEL answers (a lighter fallback model writes noticeably worse and shorter text). A busy
(503 "high demand", Google's side) or slow answer is retried with growing pauses — 503 comes back in 2-3 s, and about
half of the requests to a new model can get it at busy hours — up to ~1.5 minutes in all. GEMINI_FALLBACKS (empty by
default) may list other models to move through. A model that rejects the thinking setting is asked again without it.
Every request — failed ones and retries too — is reported
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
GEMINI_FALLBACKS = [m for m in os.getenv("GEMINI_FALLBACKS", "").split(",") if m]
GEMINI_THINKING = os.getenv("GEMINI_THINKING", "low")  # "low" answers much faster; "" = the model's default
GEMINI_IMAGE_MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-6.1-terra")  # the best of speed, text and price in our referat test
OPENAI_REASONING = os.getenv("OPENAI_REASONING", "low")  # "" = the model's default
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
RETRY_WAIT = (2, 3, 5, 8, 10, 12, 15, 15, 15)  # s between the 10 attempts (~85 s of waiting at most)
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


async def gemini_generate(contents: list[dict], model: str | None = None) -> dict:
    main = model or GEMINI_MODEL
    models = [main] + [m for m in GEMINI_FALLBACKS if m != main]
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


async def gemini(messages: Messages, model: str | None = None) -> str:
    """Chat messages in, text out (JSON mode, so the reply is plain JSON)."""
    contents = [{"role": "model" if m["role"] == "assistant" else "user", "parts": [{"text": m["content"]}]} for m in messages]
    data = await gemini_generate(contents, model)
    parts = ((data.get("candidates") or [{}])[0].get("content") or {}).get("parts") or []
    text = "".join(p.get("text", "") for p in parts if not p.get("thought"))
    if not text:
        raise RuntimeError(f"Gemini: bo'sh javob ({(data.get('candidates') or [{}])[0].get('finishReason', data.get('promptFeedback'))})")
    return text


# ---------------------------------------------------------------- OpenAI (AI_PROVIDER=openai)

async def _openai_report(model: str, status: str, started: float, data: dict | None = None):
    if on_usage is None:
        return
    u = (data or {}).get("usage") or {}
    try:
        await on_usage({**(usage_context.get() or {}), "model": model, "op": "text", "status": status, "ms": int((time.time() - started) * 1000),
                        "prompt_tokens": u.get("prompt_tokens", 0), "output_tokens": u.get("completion_tokens", 0),
                        "thinking_tokens": (u.get("completion_tokens_details") or {}).get("reasoning_tokens", 0),
                        "total_tokens": u.get("total_tokens", 0)})
    except Exception:  # accounting must never break a paid job
        pass


async def openai(messages: Messages, model: str | None = None) -> str:
    """Chat Completions in JSON mode. Busy / rate-limited / slow answers are retried like Gemini's (RETRY_WAIT); a model
    that rejects the reasoning setting is asked again without it."""
    model = model or OPENAI_MODEL
    reasoning = {"reasoning_effort": OPENAI_REASONING} if OPENAI_REASONING else {}
    last = None
    for attempt in range(len(RETRY_WAIT) + 1):
        body = {"model": model, "messages": messages, "response_format": {"type": "json_object"}, "max_completion_tokens": 32000, **reasoning}
        started = time.time()
        try:
            async with client(150) as c:
                r = await c.post(OPENAI_URL, json=body, headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"})
                r.raise_for_status()
                data = r.json()
        except httpx.HTTPStatusError as e:
            code, text = e.response.status_code, e.response.text
            await _openai_report(model, str(code), started)
            if code == 400 and reasoning and "reasoning" in text.lower():
                reasoning = {}; continue  # not a reasoning model
            if code not in RETRYABLE:
                raise RuntimeError(f"OpenAI {code}: {text[:300]}") from e
            last = f"OpenAI {code} ({model})"
        except httpx.TransportError as e:
            await _openai_report(model, "timeout", started)
            last = f"OpenAI timeout ({model}): {type(e).__name__}"
        else:
            await _openai_report(model, "ok", started, data)
            choice = (data.get("choices") or [{}])[0]
            text = (choice.get("message") or {}).get("content") or ""
            if not text:
                raise RuntimeError(f"OpenAI: bo'sh javob ({choice.get('finish_reason')})")
            return text
        if attempt < len(RETRY_WAIT):
            await asyncio.sleep(RETRY_WAIT[attempt])
    raise RuntimeError(f"OpenAI javob bermadi: {last}")


async def claude(messages: Messages) -> str:
    import anthropic
    r = await anthropic.AsyncAnthropic().messages.create(model=CLAUDE_MODEL, max_tokens=12000, messages=messages)  # type: ignore[arg-type]
    return "".join(b.text for b in r.content if b.type == "text")


async def ai(messages: Messages) -> str:
    """The configured model: AI_PROVIDER=openai (OPENAI_MODEL) or gemini (GEMINI_MODEL); unset: Gemini if its key is
    there, else Claude."""
    provider = os.getenv("AI_PROVIDER", "").lower()
    if provider == "openai" and os.getenv("OPENAI_API_KEY"):
        return await openai(messages)
    return await (gemini(messages) if os.getenv("GEMINI_API_KEY") else claude(messages))
