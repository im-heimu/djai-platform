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


class RuntimeResponse(BaseModel):
    runtime_ready: bool
    model_configured: bool
    model_api_base_url_present: bool
    model_api_key_present: bool
    model_name: str | None = None
    model_timeout_seconds: float | None = None
    system_prompt_enabled: bool
    model_temperature: float | None = None
    model_max_tokens: int | None = None
    max_conversation_messages: int | None = None
    max_message_chars: int | None = None
    configuration_error: str | None = None
