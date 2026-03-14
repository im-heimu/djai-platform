from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.core.config import Settings, get_settings
from app.schemas.chat import ChatRequest, ChatResponse, RuntimeResponse
from app.services.chat import (
    create_chat_completion_stream,
    get_runtime_diagnostics,
    request_chat_completion,
)

system_router = APIRouter()
chat_router = APIRouter()


@system_router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@chat_router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    settings: Settings = Depends(get_settings),
) -> ChatResponse:
    return await request_chat_completion(
        messages=payload.resolved_messages(),
        settings=settings,
    )


@chat_router.get("/runtime", response_model=RuntimeResponse)
def runtime(
    settings: Settings = Depends(get_settings),
) -> RuntimeResponse:
    return get_runtime_diagnostics(settings)


@chat_router.post("/chat/stream")
async def chat_stream(
    payload: ChatRequest,
    settings: Settings = Depends(get_settings),
) -> StreamingResponse:
    stream = await create_chat_completion_stream(
        messages=payload.resolved_messages(),
        settings=settings,
    )

    return StreamingResponse(stream, media_type="text/plain")
