# Frontend

Минимальный React/Vite frontend для текущего pre-alpha среза DJAI Platform.

Что есть сейчас:

- chat UI с multi-turn историей в памяти страницы
- основной путь через `POST /api/v1/chat/stream`
- fallback на `POST /api/v1/chat`
- остановка активной генерации
- runtime diagnostics summary через `GET /api/v1/runtime`
- простая проверка `GET /health`
- чистый layout без auth, routing и UI framework

## Локальный запуск

```bash
npm install
npm run dev
```

Команду нужно запускать из каталога `frontend/`.

## Переменные окружения

- `VITE_API_BASE_URL` — базовый URL backend API

Текущий frontend рассчитан на один узкий сценарий: отправка сообщений в backend, постепенный показ ответа model и отображение базового runtime-состояния. Persistence, markdown rendering, settings UI и auth пока не реализованы.
