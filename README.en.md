# DJAI Platform

DJAI Platform is an open source on-prem AI platform for enterprise use.

The main maintainer-facing documentation is Russian-first. The primary README is [README.md](README.md).

## Status

**Pre-alpha.**

This repository currently contains project scaffolding and planning documents. There is no usable platform implementation yet.

## Why This Project Exists

DJAI Platform is intended as a practical foundation for teams that need AI capabilities inside their own infrastructure, with integration into internal systems and operator-controlled deployment.

## Scope

The project is intended to grow into a modular on-prem platform for enterprise AI workloads, including:

- API and service entry points
- auth and integration capabilities
- model backend access
- knowledge/RAG workflows
- agents and tools
- administrative UI
- deployment assets for customer-managed environments

## Non-Goals

- claiming production readiness before the implementation exists
- locking the project to one model vendor, vector database, or UI framework too early
- adding heavy open source process for a solo-maintainer pre-alpha repository
- treating SaaS as the primary operating model

## Planned Components

- API/gateway
- auth/integration layer
- model access layer
- knowledge/RAG layer
- agents/tools layer
- admin/UI layer
- deployment layer

## Repository Structure

```text
backend/   future backend services and APIs
frontend/  future UI
deploy/    future deployment assets and environment templates
docs/      architecture, roadmap, and related documentation
```

## Getting Started

Implementation is not ready yet.

Start with:

- [docs/architecture.md](docs/architecture.md)
- [docs/roadmap.md](docs/roadmap.md)
- [SECURITY.md](SECURITY.md)

## Roadmap

The current roadmap is in [docs/roadmap.md](docs/roadmap.md).

## License

This project is licensed under Apache License 2.0. See [LICENSE](LICENSE).
