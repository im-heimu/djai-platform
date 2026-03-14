# DJAI Platform

DJAI Platform — open source on-prem AI платформа для корпоративного использования.

English companion: [README.en.md](README.en.md)

## Статус

**Pre-alpha.**

Сейчас репозиторий содержит узкий, но рабочий vertical slice: FastAPI backend, React/Vite UI, интеграцию с одним OpenAI-compatible model endpoint и простой локальный/on-prem запуск через Docker Compose. Это ещё не полноценная платформа.

## Что уже есть

- FastAPI backend с `GET /health`, `GET /api/v1/runtime`, `POST /api/v1/chat` и `POST /api/v1/chat/stream`
- один настроенный OpenAI-compatible chat completions endpoint
- React/Vite UI с multi-turn историей в памяти страницы
- streaming-ответы, остановка генерации и fallback на нестриминговый endpoint
- runtime-параметры через env: `SYSTEM_PROMPT`, `MODEL_TEMPERATURE`, `MODEL_MAX_TOKENS`
- server-side limits: `MAX_CONVERSATION_MESSAGES`, `MAX_MESSAGE_CHARS`
- runtime diagnostics summary в backend и UI
- нормализованные backend-ошибки для известных случаев

## Что пока не реализовано

- auth, SSO и интеграции с корпоративным identity
- database и persistence истории
- knowledge/RAG
- agents/tools
- multi-model orchestration
- полноценная admin-панель
- production-grade deployment, observability и audit

## Зачем нужен проект

DJAI Platform задуман как практичная основа для on-prem AI-системы, которую можно держать внутри своей инфраструктуры, подключать к внутренним сервисам и развивать поэтапно без раннего усложнения архитектуры.

## Текущая структура репозитория

```text
backend/   FastAPI backend и model integration
frontend/  React/Vite chat UI
deploy/    Docker Compose и шаблон окружения
docs/      архитектура, roadmap, MVP и ADR
```

## Быстрый запуск

1. Создайте `deploy/.env` на основе `deploy/.env.example`.
2. Заполните минимум:
   - `MODEL_API_BASE_URL`
   - `MODEL_API_KEY`
   - `MODEL_NAME`
3. Запустите:

```bash
docker compose -f deploy/docker-compose.yml up --build
```

После старта:

- backend health: `http://localhost:8000/health`
- runtime diagnostics: `http://localhost:8000/api/v1/runtime`
- frontend: `http://localhost:5173`

Опционально доступны:

- `SYSTEM_PROMPT`
- `MODEL_TEMPERATURE`
- `MODEL_MAX_TOKENS`
- `MAX_CONVERSATION_MESSAGES`
- `MAX_MESSAGE_CHARS`

Локальная разработка описана в [backend/README.md](backend/README.md) и [frontend/README.md](frontend/README.md).

## Документы

- [docs/architecture.md](docs/architecture.md) — текущий минимальный срез и целевое направление архитектуры
- [docs/mvp.md](docs/mvp.md) — узкий MVP chat slice и его текущий статус
- [docs/roadmap.md](docs/roadmap.md) — текущая фаза проекта и практичные следующие шаги
- [docs/adr/0001-initial-stack.md](docs/adr/0001-initial-stack.md) — зафиксированный стартовый стек
- [SECURITY.md](SECURITY.md) — базовая политика security disclosure

## Ближайшие шаги

- стабилизировать текущий single-model chat slice и development flow
- выделить следующий минимальный platform boundary вокруг auth/integration и model access
- только после этого расширять проект в сторону knowledge/RAG и более широких admin-возможностей

## Лицензия

Проект распространяется под Apache License 2.0. См. [LICENSE](LICENSE).
