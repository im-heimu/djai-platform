# Frontend

Минимальный frontend-каркас DJAI Platform на React и Vite.

Что есть сейчас:

- простая страница с заголовком DJAI Platform
- поле для сообщения
- отправка в backend `POST /api/v1/chat`
- показ stub-ответа
- простая проверка `GET /health`

## Локальный запуск

```bash
npm install
npm run dev
```

Команду нужно запускать из каталога `frontend/`.

## Переменные окружения

- `VITE_API_BASE_URL` — базовый URL backend API

Сейчас frontend рассчитан на первый вертикальный сценарий и не содержит auth, роутинг и UI-фреймворки.
