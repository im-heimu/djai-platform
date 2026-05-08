# AGENTS.md

Краткие правила для coding agents в репозитории DJAI Platform.

## Состояние проекта

- Проект на стадии **pivot** и **rebuild**.
- Репозиторий недавно очищен для перехода на новый стек и архитектуру.
- Это solo-maintainer проект на стадии pre-alpha.
- Не описывайте запланированные части так, будто они уже существуют.

## Технический стек

**Backend:**
- Python 3.13
- FastAPI
- uv для dependency management (не pip, не poetry)
- ruff для linting
- pyright для type checking

**Frontend:**
- Inertia.js (монолитный подход с server-side routing)
- Svelte (не React)

**Важно:** Это Inertia.js проект. Frontend не является отдельным SPA. Inertia связывает FastAPI backend с Svelte компонентами через server-side routing.

## Основные правила

- Делайте изменения минимальными и точными.
- Не добавляйте зависимости без явного технического повода.
- Не тащите тяжёлые framework'и, monorepo tooling и большие абстракции без прямого запроса.
- На раннем этапе предпочитайте docs-first изменения.
- Сохраняйте простоту. Не добавляйте process-heavy вещи без запроса.

## Ожидаемая структура

```
backend/    FastAPI backend, Inertia.js server adapter
frontend/   Svelte компоненты и frontend assets
deploy/     Docker Compose и шаблоны окружения
docs/       архитектура, roadmap, ADR
```

## Команды разработки

**Backend:**
```bash
cd backend
uv sync --locked          # установка зависимостей
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

При изменении зависимостей:
```bash
uv lock                   # обновить lockfile
```

Проверки:
```bash
uv run ruff check .       # linting
uv run pyright .          # type checking
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Гигиена репозитория

- Основная maintainer-facing документация в репозитории может быть на русском.
- Английские companion-файлы добавляйте только там, где они реально полезны для публичного чтения.
- Обновляйте документацию при изменении структуры репозитория или направления проекта.
- Не добавляйте CI, release automation, governance-файлы и лишнюю open source бюрократию по умолчанию.
- Не создавайте фальшивые badge, release number, support channel или setup-инструкции.

## Что не добавлять без обсуждения

- auth, database, persistence, RAG, agents, queues, multi-model orchestration на раннем этапе
- большие архитектурные переделки
- тяжёлые UI framework'и поверх Svelte
- monorepo tooling (Nx, Turborepo и т.п.)
- CI/CD, release automation и лишнюю governance-бюрократию
- дополнительные linter'ы или type checker'ы (используйте ruff и pyright)

## Правила правок

- Сохраняйте полезное существующее содержимое, если нет причины его менять.
- Если меняется структура репозитория, обновляйте `README.md` и связанные документы.
- Не добавляйте детали, которые создают видимость уже существующего продукта.
- Проект на стадии rebuild — ожидайте частые изменения в архитектуре и структуре.
