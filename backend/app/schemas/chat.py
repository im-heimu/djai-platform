from typing import Literal

from pydantic import BaseModel, Field, model_validator


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1)


class ChatRequest(BaseModel):
    message: str | None = Field(default=None, min_length=1)
    messages: list[ChatMessage] | None = None

    @model_validator(mode="after")
    def validate_payload(self) -> "ChatRequest":
        if self.messages:
            return self

        if self.message:
            return self

        raise ValueError("Either message or messages must be provided.")

    def resolved_messages(self) -> list[ChatMessage]:
        if self.messages:
            return self.messages

        return [ChatMessage(role="user", content=self.message or "")]


class ChatResponse(BaseModel):
    reply: str
    source: str = "model"
    model_endpoint_configured: bool
