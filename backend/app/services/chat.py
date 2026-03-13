import logging

import httpx

from app.core.config import Settings
from app.schemas.chat import ChatResponse

logger = logging.getLogger(__name__)

PLACEHOLDER_MODEL_BASE_URL = "https://your-openai-compatible-endpoint.example/v1"
PLACEHOLDER_MODEL_API_KEY = "replace-me"
PLACEHOLDER_MODEL_NAME = "replace-with-model-name"


class ModelServiceError(Exception):
    def __init__(self, message: str, status_code: int) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def _build_chat_completions_url(base_url: str) -> str:
    normalized = base_url.rstrip("/")
    if normalized.endswith("/chat/completions"):
        return normalized
    return f"{normalized}/chat/completions"


def _extract_reply(data: dict) -> str | None:
    choices = data.get("choices")
    if not isinstance(choices, list) or not choices:
        return None

    first_choice = choices[0]
    if not isinstance(first_choice, dict):
        return None

    message = first_choice.get("message")
    if not isinstance(message, dict):
        return None

    content = message.get("content")
    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                text = item.get("text")
                if isinstance(text, str) and text.strip():
                    parts.append(text.strip())
        return "\n".join(parts).strip() or None

    return None


def _extract_upstream_error(data: dict) -> str | None:
    error = data.get("error")
    if not isinstance(error, dict):
        return None

    message = error.get("message")
    if isinstance(message, str) and message.strip():
        return message.strip()

    return None


def _validate_settings(settings: Settings) -> None:
    if (
        not settings.model_api_base_url
        or settings.model_api_base_url == PLACEHOLDER_MODEL_BASE_URL
    ):
        raise ModelServiceError(
            "Не настроен MODEL_API_BASE_URL.",
            status_code=500,
        )

    if not settings.model_api_key or settings.model_api_key == PLACEHOLDER_MODEL_API_KEY:
        raise ModelServiceError(
            "Не настроен MODEL_API_KEY.",
            status_code=500,
        )

    if not settings.model_name or settings.model_name == PLACEHOLDER_MODEL_NAME:
        raise ModelServiceError(
            "Не настроен MODEL_NAME.",
            status_code=500,
        )

    if settings.model_timeout_seconds is None:
        raise ModelServiceError(
            "MODEL_TIMEOUT_SECONDS должен быть положительным числом.",
            status_code=500,
        )


async def request_chat_completion(message: str, settings: Settings) -> ChatResponse:
    _validate_settings(settings)
    request_url = _build_chat_completions_url(settings.model_api_base_url)
    payload = {
        "model": settings.model_name,
        "messages": [
            {
                "role": "user",
                "content": message,
            }
        ],
    }
    headers = {
        "Authorization": f"Bearer {settings.model_api_key}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=settings.model_timeout_seconds) as client:
            response = await client.post(
                request_url,
                json=payload,
                headers=headers,
            )
    except httpx.TimeoutException as exc:
        logger.warning("Model API request timed out")
        raise ModelServiceError(
            "Model API не ответил за отведённое время.",
            status_code=504,
        ) from exc
    except httpx.HTTPError as exc:
        logger.warning("Model API request failed: %s", exc.__class__.__name__)
        raise ModelServiceError(
            "Не удалось выполнить запрос к model API.",
            status_code=502,
        ) from exc

    if response.is_error:
        upstream_message = None
        try:
            upstream_message = _extract_upstream_error(response.json())
        except ValueError:
            upstream_message = None

        logger.warning("Model API returned status %s", response.status_code)
        message_text = (
            f"Model API вернул ошибку {response.status_code}: {upstream_message}"
            if upstream_message
            else f"Model API вернул ошибку {response.status_code}."
        )
        raise ModelServiceError(message_text, status_code=502)

    try:
        data = response.json()
    except ValueError as exc:
        logger.warning("Model API returned non-JSON response")
        raise ModelServiceError(
            "Model API вернул некорректный ответ.",
            status_code=502,
        ) from exc

    reply = _extract_reply(data)
    if not reply:
        logger.warning("Model API response did not contain assistant content")
        raise ModelServiceError(
            "Model API не вернул текст ответа.",
            status_code=502,
        )

    return ChatResponse(
        reply=reply,
        model_endpoint_configured=True,
    )
