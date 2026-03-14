# Architecture Draft

This is the working architecture draft for DJAI Platform. It separates the current implementation from the intended direction so the repository does not imply a more complete platform than it actually has.

The main maintainer-facing version of this document is Russian: [architecture.md](architecture.md).

## Current Implementation Snapshot

The repository currently contains a narrow working slice:

- one FastAPI backend as a modular monolith
- one React/Vite frontend
- `GET /health`, `GET /api/v1/runtime`, `POST /api/v1/chat`, `POST /api/v1/chat/stream`
- one OpenAI-compatible model endpoint configured through env
- runtime settings for system prompt and model parameters
- server-side message limits and history trimming
- simple Docker Compose startup for local and basic on-prem use

Auth, persistence, knowledge/RAG, agents/tools, multi-model orchestration, and a real admin layer are still not implemented.

## Goals

- Build an on-prem AI platform for infrastructure controlled by the operator.
- Keep the early system simple and cheap to change.
- Gradually establish clearer boundaries around API, model access, auth/integration, and later platform layers.
- Avoid premature lock-in to one deployment shape or vendor.

## Design Principles

- **On-prem first:** assume operator-controlled infrastructure and security boundaries.
- **Modular monolith first:** validate the core request path before splitting the system further.
- **Operational clarity:** keep local development and early on-prem deployment easy to understand.
- **Explicit limits:** clearly distinguish what already exists from what is deferred.
- **Practical extensibility:** add new layers through explicit interfaces, not premature platform abstractions.

## Current Minimal Request Flow

1. The user opens the frontend and sees health/runtime status.
2. The frontend sends `messages[]` to the backend.
3. The backend validates runtime config and conversation limits.
4. The backend trims old history if needed and prepends `SYSTEM_PROMPT` when configured.
5. The backend calls one configured OpenAI-compatible endpoint.
6. The reply is returned either as JSON or as a plain-text stream.

## Target High-Level Components

These are intended layers, not fully implemented modules.

- **API/gateway:** request entry point, request limits, basic routing
- **Auth/integration layer:** enterprise identity and internal integrations
- **Model access layer:** stable access boundary for model backends
- **Knowledge/RAG layer:** ingest, retrieval, and grounding
- **Agents/tools layer:** orchestration and controlled tool execution
- **Admin/UI layer:** operator-facing configuration and visibility
- **Deployment layer:** readable deployment assets for on-prem installation

## On-Prem Assumptions

- The initial deployment should work in a local network or a simple internal environment.
- Kubernetes is not required for the current stage.
- Secrets should come from env or an external secret store, not from the repository.
- Later stages will need to consider restricted outbound access, network segmentation, and enterprise identity/logging systems.

## Security Notes

- The current backend has no auth. This is a known limitation.
- Secrets must not live in the repository.
- Known backend errors are normalized and do not expose sensitive values such as API keys.
- Full authorization, audit, and policy boundaries are still deferred.

## Observability Notes

- The current slice only has basic logging, `GET /health`, and `GET /api/v1/runtime`.
- Metrics, tracing, and separate audit trails do not exist yet.
- The next observability step should follow the real path frontend -> backend -> model API.

## Extensibility Notes

- The next reasonable boundary is around model access and auth/integration.
- The project should avoid early generic abstractions for RAG, tools, or multi-model support.
- Deployment assets should stay readable and easy to adapt.

The main risk at this stage is premature complexity. The current single-model chat slice should be stabilized before broader platform coverage is added.
