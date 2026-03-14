# Roadmap

This is the working roadmap for DJAI Platform in its pre-alpha stage. It is meant as a guide to the current phase and the next practical steps, not as a delivery promise.

The main maintainer-facing version of this document is Russian: [roadmap.md](roadmap.md).

## Current Snapshot

The repository is currently between completed bootstrap work and an early narrow MVP:

- the public repository base is already in place
- there is a working single-model chat slice on FastAPI + React/Vite
- streaming, in-memory multi-turn history, runtime diagnostics, limits, and normalized errors already exist
- auth, persistence, knowledge/RAG, agents, and a real admin layer are still absent

## Phase 0: repository bootstrap

**Status:** completed

Completed deliverables:

- core repository documentation
- minimal directory structure for backend, frontend, deployment, and docs
- baseline repository hygiene such as license and ignore rules

## Phase 1: initial platform skeleton

**Status:** completed for the current narrow slice

Completed deliverables:

- FastAPI backend and React/Vite frontend
- basic local/on-prem startup through Docker Compose
- one path to an OpenAI-compatible model API
- runtime configuration, diagnostics, limits, and error normalization

## Phase 2: narrow core MVP

**Status:** current next step

**Goal:** turn the current chat slice into a more stable base for the next platform layer.

Practical deliverables:

- stabilize the current single-model chat flow and run/development path
- carve out a clearer internal boundary around model access
- introduce a minimal auth/integration layer instead of a fully open backend
- decide what the smallest admin/config surface should be beyond the current runtime summary

## Phase 3: hardening and extension

**Status:** later, after Phase 2 is stable

Future deliverables:

- knowledge/RAG as the next distinct layer
- stronger authorization, audit, and secrets handling
- baseline observability for the real frontend -> backend -> model API path
- clearer deployment guidance for restricted on-prem environments
