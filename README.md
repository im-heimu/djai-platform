# DJAI Platform

DJAI Platform — open source on-prem AI платформа для корпоративного использования.

English companion: [README.en.md](README.en.md)

## Статус

**Pre-alpha.**

Сейчас в репозитории есть базовый backend/frontend scaffold и документация. Полноценной платформы пока нет.

## Зачем нужен проект

Многим командам нужен AI-стек, который можно развернуть внутри своей инфраструктуры, связать с внутренними системами и держать под своим контролем. DJAI Platform задуман как основа для такого on-prem решения без привязки к SaaS-модели.

## Область проекта

DJAI Platform должен со временем стать модульной on-prem платформой для enterprise AI-нагрузок. В рабочую область проекта входят:

- единая точка входа для API и сервисов
- auth и интеграции с внутренними системами
- доступ к model backend'ам
- knowledge/RAG слой
- agents и tools
- административный UI
- deployment для инфраструктуры заказчика

## Что сейчас не входит в проект

- заявления о production-ready состоянии до появления реальной реализации
- жёсткая привязка к одному model vendor, vector database или UI framework
- тяжёлая open source бюрократия для solo-maintainer pre-alpha проекта
- SaaS как основной сценарий
- продуктовый код вне базовой структуры и проектных документов

## Планируемые компоненты

- API/gateway
- auth/integration layer
- model access layer
- knowledge/RAG layer
- agents/tools layer
- admin/UI layer
- deployment layer

## Структура репозитория

```text
backend/   стартовый FastAPI backend scaffold
frontend/  стартовый React/Vite UI
deploy/    локальный/on-prem friendly Docker Compose
docs/      архитектура, roadmap и другая документация
```

## С чего начать

Реализация пока не готова.

Сейчас это ранний vertical scaffold с документацией. Если нужно понять направление проекта, начните с:

- [docs/architecture.md](docs/architecture.md)
- [docs/roadmap.md](docs/roadmap.md)
- [SECURITY.md](SECURITY.md)

Для первого локального запуска:

1. Создайте `deploy/.env` на основе `deploy/.env.example`.
2. Запустите:

```bash
docker compose -f deploy/docker-compose.yml up --build
```

После запуска:

- backend: `http://localhost:8000/health`
- frontend: `http://localhost:5173`

Для реального chat flow заполните в `deploy/.env`:

- `MODEL_API_BASE_URL`
- `MODEL_API_KEY`
- `MODEL_NAME`
- `MODEL_TIMEOUT_SECONDS`

Опционально можно задать глобальное поведение model через:

- `SYSTEM_PROMPT`
- `MODEL_TEMPERATURE`
- `MODEL_MAX_TOKENS`

Backend ожидает OpenAI-compatible chat completions API и возвращает первую текстовую часть ответа model через существующий `/api/v1/chat`.

Frontend по умолчанию использует `POST /api/v1/chat/stream` и показывает ответ постепенно по мере генерации. Обычный `POST /api/v1/chat` сохранён как нестриминговый режим.

Текущий chat UI хранит историю диалога только в памяти страницы и отправляет весь `messages[]` в backend для multi-turn режима.

## Roadmap

Текущий roadmap находится в [docs/roadmap.md](docs/roadmap.md).

## Лицензия

Проект распространяется под Apache License 2.0. См. [LICENSE](LICENSE).
