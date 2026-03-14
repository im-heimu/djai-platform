# Roadmap

Это рабочий roadmap DJAI Platform для стадии pre-alpha. Он нужен как ориентир по текущей фазе и следующим практическим шагам, а не как обещание сроков.

English companion: [roadmap.en.md](roadmap.en.md)

## Текущий срез

Сейчас репозиторий находится между завершённым bootstrap и ранним узким MVP-сценарием:

- публичная структура репозитория уже собрана
- есть рабочий single-model chat slice на FastAPI + React/Vite
- есть streaming, multi-turn история в памяти, runtime diagnostics, limits и нормализованные ошибки
- auth, persistence, knowledge/RAG, agents и полноценный admin layer ещё не начаты

## Phase 0: bootstrap репозитория

**Статус:** выполнено

Что уже сделано:

- базовая документация репозитория
- минимальная структура каталогов для backend, frontend, deployment и docs
- лицензия, `.gitignore` и базовая maintainer-гигиена

## Phase 1: стартовый platform skeleton

**Статус:** выполнено для текущего узкого сценария

Что уже сделано:

- FastAPI backend и React/Vite frontend
- базовый локальный/on-prem запуск через Docker Compose
- один path до OpenAI-compatible model API
- runtime-конфигурация, diagnostics, limits и error normalization

## Phase 2: узкий core MVP

**Статус:** текущий следующий шаг

**Цель:** довести текущий chat slice до более устойчивой базы для следующего платформенного слоя.

Практичные deliverables:

- стабилизировать текущий single-model chat flow и development/run path
- выделить более явную internal boundary вокруг model access
- подготовить минимальный auth/integration слой вместо полностью открытого backend
- определить, какой самый маленький admin/config surface нужен сверх текущего runtime summary

## Phase 3: hardening и расширение

**Статус:** позже, после стабилизации Phase 2

Что имеет смысл делать только после этого:

- knowledge/RAG как отдельный следующий слой
- усиление authorization, audit и работы с secret'ами
- базовая observability по реальному пути frontend -> backend -> model API
- более внятные deployment-сценарии для ограниченных on-prem сред
