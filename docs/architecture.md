# Черновик архитектуры

Это рабочий архитектурный черновик DJAI Platform. Документ разделяет текущую реализацию и целевое направление, чтобы не создавать видимость уже существующей полной платформы.

English companion: [architecture.en.md](architecture.en.md)

## Текущее состояние реализации

Сейчас в репозитории есть один узкий рабочий срез:

- один FastAPI backend как modular monolith
- один React/Vite frontend
- `GET /health`, `GET /api/v1/runtime`, `POST /api/v1/chat`, `POST /api/v1/chat/stream`
- один OpenAI-compatible model endpoint, задаваемый через env
- runtime-настройки: system prompt, temperature, max tokens
- server-side limits: trimming истории и ограничение длины user-сообщения
- простой Docker Compose для локального и базового on-prem запуска

Сейчас **не** реализованы auth, database/persistence, knowledge/RAG, agents/tools, multi-model orchestration и полноценный admin layer.

## Цели

- Сделать on-prem AI платформу для инфраструктуры, которую контролирует сама организация.
- Сохранить простой старт и низкую стоимость изменений на раннем этапе.
- Постепенно выделять границы между API, model access, auth/integration и более поздними платформенными слоями.
- Не зафиксировать проект слишком рано на одном deployment-сценарии или одном vendor'е.

## Принципы

- **On-prem first:** исходить из того, что инфраструктура и границы безопасности находятся у оператора.
- **Modular monolith first:** сначала подтвердить базовый путь запроса, потом решать, какие границы реально стоит выносить.
- **Простая эксплуатация:** локальный запуск и ранний on-prem deployment должны быть понятными без сложного control plane.
- **Явные ограничения:** всё, чего пока нет, должно быть явно обозначено как deferred, а не подразумеваться.
- **Практичная расширяемость:** новые слои должны добавляться через понятные интерфейсы, а не через раннюю общую “платформенность”.

## Текущий минимальный поток запроса

1. Пользователь открывает frontend и видит health/runtime summary.
2. Frontend отправляет `messages[]` в backend.
3. Backend валидирует runtime-конфигурацию и server-side limits.
4. Backend при необходимости обрезает старую историю и добавляет `SYSTEM_PROMPT`.
5. Backend вызывает один настроенный OpenAI-compatible endpoint.
6. Ответ возвращается обычным JSON или plain-text stream.

## Целевая верхнеуровневая схема

Ниже — целевые слои, а не уже реализованные модули.

### API/gateway

Единая точка входа для API, ограничений запросов и базовой маршрутизации.

### Auth/integration layer

Связка с корпоративным identity и внутренними сервисами. Сейчас отсутствует.

### Model access layer

Слой доступа к model backend'ам. Сейчас частично представлен прямым вызовом одного OpenAI-compatible endpoint.

### Knowledge/RAG layer

Слой ingest, retrieval и grounding. Пока не реализован.

### Agents/tools layer

Слой orchestration и tool execution. Пока не реализован.

### Admin/UI layer

Операторский UI. Сейчас есть только минимальный chat UI и runtime summary.

### Deployment layer

Docker Compose и шаблон env. Более сложные deployment-сценарии пока не проработаны.

## Предположения для on-prem deployment

- Стартовый deployment должен работать в локальной сети или простом внутреннем контуре.
- Ранний сценарий не требует Kubernetes и не предполагает сложную оркестрацию.
- Secret'ы должны приходить через env или внешний secret store, а не из репозитория.
- При дальнейшем росте нужно будет учесть ограниченный outbound-доступ, сегментацию сети и корпоративные logging/identity системы.

## Замечания по безопасности

- Сейчас backend открыт и не содержит auth. Это известное ограничение, а не забытая деталь.
- Secret'ы не должны жить в репозитории.
- Backend уже нормализует известные ошибки и не возвращает чувствительные значения вроде API key.
- Полноценные authorization, audit и policy boundary пока отложены.

## Замечания по observability

- Сейчас есть только базовое логирование, `GET /health` и `GET /api/v1/runtime`.
- Метрики, трассировка и отдельный audit trail пока не реализованы.
- Следующий observability-слой должен строиться вокруг реального пути frontend -> backend -> model API, а не вокруг абстрактной будущей схемы.

## Замечания по расширяемости

- Следующий разумный шаг — сделать более явный internal boundary вокруг model access и auth/integration.
- Не стоит рано добавлять generic abstractions под RAG, tools или multi-model orchestration.
- Deployment-артефакты должны оставаться читаемыми и адаптируемыми.

Главный риск на текущем этапе — снова начать описывать будущую платформу так, будто она уже существует. Базовый single-model chat slice нужно сначала стабилизировать, а уже потом расширять.
