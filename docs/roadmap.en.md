# Roadmap

This is the working roadmap for DJAI Platform in its pre-alpha stage. It is meant as a planning guide, not a delivery promise.

The main maintainer-facing version of this document is Russian: [roadmap.md](roadmap.md).

## Phase 0: repository bootstrap

**Goal:** establish a clean public base before product code exists.

Deliverables:

- core repository documentation
- minimal directory structure for backend, frontend, deployment, and docs
- baseline repository hygiene such as license and ignore rules

## Phase 1: platform skeleton

**Goal:** create the minimal technical skeleton without implying a finished product.

Deliverables:

- initial backend and frontend layout
- early service boundaries for gateway, auth/integration, model access, and knowledge
- draft local development conventions and config examples
- first draft of the deployment structure

## Phase 2: core MVP

**Goal:** validate the platform shape through a narrow but complete path.

Deliverables:

- an authenticated API entry point
- a basic model backend access layer
- a minimal knowledge/RAG flow
- first admin/UI surfaces for configuration and basic visibility
- a reference deployment for non-production use

## Phase 3: hardening and extension

**Goal:** improve operational readiness and make the platform easier to extend.

Deliverables:

- stronger authorization, audit logging, and secrets handling
- baseline observability for core request paths
- extension points for connectors, tools, and additional model backends
- clearer deployment guidance for restricted and scaled on-prem environments
