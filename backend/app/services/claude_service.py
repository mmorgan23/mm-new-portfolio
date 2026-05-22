from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator

from anthropic import APIStatusError, AsyncAnthropic

from app.config import settings
from app.utils.logger import LOG


class ClaudeService:
    def __init__(self) -> None:
        self._client = AsyncAnthropic(api_key=settings.claude_api_key or None)
        self._sem = asyncio.Semaphore(settings.max_concurrent_llm)

    async def stream_text(
        self,
        *,
        model: str,
        system: str,
        user_prompt: str,
        max_tokens: int = 4096,
    ) -> AsyncIterator[str]:
        async with self._sem:
            attempt = 0
            while True:
                attempt += 1
                try:
                    async with self._client.messages.stream(
                        model=model,
                        max_tokens=max_tokens,
                        system=system,
                        messages=[{"role": "user", "content": user_prompt}],
                    ) as stream:
                        async for text in stream.text_stream:
                            yield text
                    return
                except APIStatusError as exc:
                    status = getattr(exc, "status_code", None)
                    if status not in (429, 500, 502, 503, 504, 529) or attempt >= 4:
                        raise
                    delay = 0.6 * (2 ** (attempt - 1))
                    LOG.warning("claude retry attempt=%s delay=%ss err=%s", attempt, delay, exc)
                    await asyncio.sleep(delay)


claude_service = ClaudeService()  # singleton
