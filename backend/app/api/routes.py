from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.core.config import Settings, get_settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat import (
    ModelServiceError,
    create_chat_completion_stream,
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
    try:
        return await request_chat_completion(
            message=payload.message,
            settings=settings,
        )
    except ModelServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@chat_router.post("/chat/stream")
async def chat_stream(
    payload: ChatRequest,
    settings: Settings = Depends(get_settings),
) -> StreamingResponse:
    try:
        stream = await create_chat_completion_stream(
            message=payload.message,
            settings=settings,
        )
    except ModelServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

    return StreamingResponse(stream, media_type="text/plain")
