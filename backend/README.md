# Backend

Минимальный backend-каркас DJAI Platform на FastAPI.

Что есть сейчас:

- `GET /health`
- `POST /api/v1/chat`
- простой stub-ответ без реальной LLM-интеграции
- базовые настройки через переменные окружения
- CORS для локального frontend

## Локальный запуск

```bash
pip install -e .
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Команду нужно запускать из каталога `backend/`.

## Переменные окружения

- `APP_NAME`
- `API_PREFIX`
- `BACKEND_HOST`
- `BACKEND_PORT`
- `BACKEND_CORS_ORIGINS`
- `FUTURE_MODEL_ENDPOINT`

`FUTURE_MODEL_ENDPOINT` пока не используется в реальном вызове model. Это задел под следующий шаг.
