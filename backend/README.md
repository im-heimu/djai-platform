# Backend

Минимальный backend-каркас DJAI Platform на FastAPI.

Что есть сейчас:

- `GET /health`
- `GET /api/v1/runtime`
- `POST /api/v1/chat`
- `POST /api/v1/chat/stream`
- прямой вызов OpenAI-compatible chat completions API
- потоковый plain-text ответ для frontend
- поддержка multi-turn диалога через `messages[]`
- базовые настройки через переменные окружения
- CORS для локального frontend

## Локальный запуск

```bash
uv sync --locked
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Команду нужно запускать из каталога `backend/`.

Если меняются зависимости, обновляйте lockfile командой:

```bash
uv lock
```

## Переменные окружения

- `APP_NAME`
- `API_PREFIX`
- `BACKEND_HOST`
- `BACKEND_PORT`
- `BACKEND_CORS_ORIGINS`
- `MODEL_API_BASE_URL`
- `MODEL_API_KEY`
- `MODEL_NAME`
- `MODEL_TIMEOUT_SECONDS`
- `SYSTEM_PROMPT`
- `MODEL_TEMPERATURE`
- `MODEL_MAX_TOKENS`

`MODEL_API_BASE_URL` обычно должен указывать на OpenAI-compatible API base URL вида `.../v1`. Backend сам добавляет `/chat/completions`, если его нет в конфигурации.

Без корректных `MODEL_API_BASE_URL`, `MODEL_API_KEY` и `MODEL_NAME` endpoint `/api/v1/chat` вернёт читаемую ошибку конфигурации.

`GET /api/v1/runtime` отдаёт безопасный snapshot текущей runtime-конфигурации: готов ли backend к chat-запросам, включён ли `SYSTEM_PROMPT`, какие timeout/temperature/max tokens заданы. Секреты и полный текст system prompt не возвращаются.

Если `SYSTEM_PROMPT` не пустой, backend добавляет его как глобальное `system`-сообщение перед всей историей диалога.

Если заданы `MODEL_TEMPERATURE` и `MODEL_MAX_TOKENS`, backend передаёт их в upstream OpenAI-compatible запросы. `MODEL_TEMPERATURE` должен быть числом от `0` до `2`, `MODEL_MAX_TOKENS` — положительным целым числом.

`POST /api/v1/chat/stream` сохраняет обычный HTTP-подход и отдаёт текст по мере генерации ответа. WebSocket и отдельная event-схема пока не используются.

Оба chat endpoint принимают либо новый формат `messages: [{ role, content }, ...]`, либо старый `message` для простой обратной совместимости. Runtime-настройки применяются одинаково к `/api/v1/chat` и `/api/v1/chat/stream`.
