from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat import build_stub_chat_response

system_router = APIRouter()
chat_router = APIRouter()


@system_router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@chat_router.post("/chat", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    settings: Settings = Depends(get_settings),
) -> ChatResponse:
    return build_stub_chat_response(
        message=payload.message,
        model_endpoint=settings.future_model_endpoint,
    )
