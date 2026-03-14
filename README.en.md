# DJAI Platform

DJAI Platform is an open source on-prem AI platform for enterprise use.

The main maintainer-facing documentation is Russian-first. The primary README is [README.md](README.md).

## Status

**Pre-alpha.**

The repository already contains a narrow but working vertical slice: a FastAPI backend, a React/Vite frontend, one OpenAI-compatible model integration path, and a simple local/on-prem startup flow through Docker Compose. This is still far from a full platform.

## Current Slice

- FastAPI backend with `GET /health`, `GET /api/v1/runtime`, `POST /api/v1/chat`, and `POST /api/v1/chat/stream`
- one configured OpenAI-compatible chat completions endpoint
- React/Vite chat UI with in-memory multi-turn history
- streaming responses, stop/cancel, and non-stream fallback
- env-driven runtime settings such as system prompt and model parameters
- server-side conversation trimming and message-size limits
- runtime diagnostics summary and normalized backend errors

## Not Implemented Yet

- auth and enterprise identity integration
- database or conversation persistence
- knowledge/RAG
- agents/tools
- multi-model orchestration
- a real admin surface beyond the current diagnostics summary
- production-grade deployment, observability, and audit layers

## Repository Structure

```text
backend/   FastAPI backend and model integration
frontend/  React/Vite chat UI
deploy/    Docker Compose and environment template
docs/      architecture, roadmap, MVP, and ADR docs
```

## Basic Run

1. Create `deploy/.env` from `deploy/.env.example`.
2. Fill at least:
   - `MODEL_API_BASE_URL`
   - `MODEL_API_KEY`
   - `MODEL_NAME`
3. Run:

```bash
docker compose -f deploy/docker-compose.yml up --build
```

After startup:

- backend health: `http://localhost:8000/health`
- runtime diagnostics: `http://localhost:8000/api/v1/runtime`
- frontend: `http://localhost:5173`

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for local development details.

## Documents

- [docs/architecture.md](docs/architecture.md)
- [docs/mvp.md](docs/mvp.md)
- [docs/roadmap.md](docs/roadmap.md)
- [docs/adr/0001-initial-stack.md](docs/adr/0001-initial-stack.md)

## License

This project is licensed under Apache License 2.0. See [LICENSE](LICENSE).
