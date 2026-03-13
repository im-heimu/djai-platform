from app.schemas.chat import ChatResponse


def build_stub_chat_response(message: str, model_endpoint: str) -> ChatResponse:
    endpoint_configured = bool(model_endpoint.strip())
    endpoint_note = (
        "Настроенный model endpoint сохранён в конфигурации, но пока не используется."
        if endpoint_configured
        else "Model endpoint пока не настроен."
    )

    return ChatResponse(
        reply=f"Stub response from DJAI Platform. Ваше сообщение: {message}\n\n{endpoint_note}",
        model_endpoint_configured=endpoint_configured,
    )
