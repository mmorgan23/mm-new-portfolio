from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import settings
from app.utils.logger import LOG


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    LOG.info("CORS allow_origins=%s", settings.cors_origins)
    if not settings.claude_api_key:
        LOG.warning("CLAUDE_API_KEY is empty — POST /api/tasks will fail once the agent pipeline runs")
    else:
        LOG.info("CLAUDE_API_KEY is set (length=%s)", len(settings.claude_api_key))
    yield


app = FastAPI(title="AI Agent Portfolio API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
