# Backend

Минимальный FastAPI backend для текущего pre-alpha среза DJAI Platform.

Что есть сейчас:

- `GET /health`
- `GET /api/v1/runtime`
- `POST /api/v1/chat`
- `POST /api/v1/chat/stream`
- прямой вызов одного OpenAI-compatible chat completions API
- потоковый plain-text ответ для frontend
- поддержка multi-turn диалога через `messages[]`
- runtime-настройки через переменные окружения
- server-side limits и trimming истории
- нормализованные JSON-ошибки для известных случаев
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
- `MAX_CONVERSATION_MESSAGES`
- `MAX_MESSAGE_CHARS`

`MODEL_API_BASE_URL` обычно должен указывать на OpenAI-compatible API base URL вида `.../v1`. Backend сам добавляет `/chat/completions`, если его нет в конфигурации.

Без корректных `MODEL_API_BASE_URL`, `MODEL_API_KEY` и `MODEL_NAME` chat endpoint вернут читаемую ошибку конфигурации.

`GET /api/v1/runtime` отдаёт безопасный snapshot текущей runtime-конфигурации: готов ли backend к chat-запросам, включён ли `SYSTEM_PROMPT`, какие model-параметры и server-side limits заданы. Секреты и полный текст system prompt не возвращаются.

Если `SYSTEM_PROMPT` не пустой, backend добавляет его как глобальное `system`-сообщение перед всей историей диалога.

Если заданы `MODEL_TEMPERATURE` и `MODEL_MAX_TOKENS`, backend передаёт их в upstream OpenAI-compatible запросы. `MODEL_TEMPERATURE` должен быть числом от `0` до `2`, `MODEL_MAX_TOKENS` — положительным целым числом.

`MAX_CONVERSATION_MESSAGES` ограничивает историю, которую backend отправляет в upstream model API. При превышении лимита старые сообщения отбрасываются с начала, порядок последних сообщений сохраняется.

`MAX_MESSAGE_CHARS` ограничивает длину последнего user-сообщения. Если лимит превышен, backend возвращает читаемую ошибку без запроса к model API.

`POST /api/v1/chat/stream` сохраняет обычный HTTP-подход и отдаёт текст по мере генерации ответа. WebSocket и отдельная event-схема пока не используются.

Оба chat endpoint принимают либо новый формат `messages: [{ role, content }, ...]`, либо старый `message` для простой обратной совместимости. Runtime-настройки применяются одинаково к `/api/v1/chat` и `/api/v1/chat/stream`.

Для известных ошибок backend использует короткий JSON-формат вида `{ error_code, message, detail? }`. Это касается, например, ошибок runtime-конфигурации, timeout, upstream model API и oversized user message.

Текущий backend не включает auth, database, persistence, RAG, agents, queues или multi-model orchestration.
