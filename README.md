# DJAI Platform

DJAI Platform — open source on-prem AI платформа для корпоративного использования.

## Статус

**Pre-alpha. Pivot и rebuild.**

Репозиторий недавно очищен для перехода на новый стек и архитектуру. Проект находится на стадии активной перестройки.

## Технический стек

**Backend:**
- Python 3.13
- FastAPI
- uv для dependency management
- ruff для linting
- pyright для type checking

**Frontend:**
- Inertia.js (server-side routing)
- Svelte

**Deployment:**
- Docker Compose для локального и on-prem запуска

## Зачем нужен проект

DJAI Platform задуман как практичная основа для on-prem AI-системы, которую можно держать внутри своей инфраструктуры, подключать к внутренним сервисам и развивать поэтапно без раннего усложнения архитектуры.

## Структура репозитория

```
backend/    FastAPI backend, Inertia.js server adapter
frontend/   Svelte компоненты и frontend assets
deploy/     Docker Compose и шаблоны окружения
docs/       архитектура, roadmap, ADR
```

## Локальная разработка

**Backend:**
```bash
cd backend
uv sync --locked
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Проверки:**
```bash
# Backend
cd backend
uv run ruff check .
uv run pyright .

# Frontend
cd frontend
npm run build
```

## Что пока не реализовано

Проект на стадии rebuild. Следующие компоненты будут добавляться поэтапно:

- auth и SSO интеграции
- database и persistence
- knowledge/RAG
- agents/tools
- multi-model orchestration
- admin-панель
- production-grade deployment и observability

## Документация

- [AGENTS.md](AGENTS.md) — правила для coding agents
- `docs/` — архитектура, roadmap и ADR (будут добавлены по мере развития)

## Лицензия

Проект распространяется под Apache License 2.0. См. [LICENSE](LICENSE).
