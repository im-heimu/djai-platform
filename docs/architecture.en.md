# Architecture Draft

This is the initial architecture draft for DJAI Platform. It describes the intended high-level structure, not an already implemented system.

The main maintainer-facing version of this document is Russian: [architecture.md](architecture.md).

## Goals

- Build an on-prem AI platform for infrastructure controlled by the organization itself.
- Separate core concerns such as access, model access, retrieval, orchestration, and administration.
- Support integration with internal identity, data, and operational systems.
- Keep the design modular enough to avoid early lock-in to one vendor or one deployment model.

## Design Principles

- **On-prem first:** assume customer-controlled infrastructure and security boundaries.
- **Clear boundaries:** keep the major parts of the system separated.
- **Operational clarity:** system behavior should stay understandable to operators.
- **Security by default:** auth, authorization, audit, and secrets handling should be part of the base design.
- **Practical extensibility:** prefer explicit interfaces over tight framework coupling.

## Major Components

### API/gateway

Single entry point for APIs, request routing, basic request controls, and inbound audit handling.

### Auth/integration layer

Integration with enterprise identity and internal services, including SSO, service-to-service auth, role mapping, and integration control.

### Model access layer

Shared access layer for model backends, covering local models, private endpoints, and approved external providers.

### Knowledge/RAG layer

Layer for ingest, indexing, retrieval, and grounding, with attention to access boundaries and source traceability.

### Agents/tools layer

Orchestration layer for agent flows and tool execution, with explicit tool registration and clear action limits.

### Admin/UI layer

Operator UI for system configuration, integration management, policy settings, and basic operational visibility.

### Deployment layer

Deployment assets, environment templates, and infrastructure assumptions for on-prem installation.

## Data Flow Overview

1. A user or internal client authenticates at the platform entry point.
2. The gateway checks access and routes the request.
3. The request can go directly to the model access layer or through knowledge/RAG and agents/tools.
4. If retrieval is needed, the knowledge layer returns authorized context.
5. If tool execution is needed, the agents/tools layer calls approved integrations under policy controls.
6. The response, audit events, and telemetry are emitted for observability.

## On-Prem Deployment Assumptions

- The platform runs in customer-managed infrastructure, not vendor-managed SaaS.
- Restricted outbound access and isolated environments should be considered.
- Integration with internal identity, certificate, secrets, and logging systems is expected.
- Data storage, retention, and backup stay under operator control.
- The design should support both small initial setups and more segmented environments.

## Security Considerations

- Prefer enterprise identity integration over project-specific user stores.
- Keep authorization explicit for API access, knowledge access, tool execution, and admin actions.
- Do not keep secrets in the repository; use external secret storage or controlled environment injection.
- Audit logging should cover sensitive operations and data access.
- Data movement and storage boundaries should remain operator-controlled.

## Observability Considerations

- Structured logs should cover gateway, orchestration, retrieval, and admin actions.
- Metrics should expose service health, latency, throughput, and dependency state.
- End-to-end tracing should be possible across gateway, retrieval, model calls, and tools.
- Audit trails should stay distinct from regular technical telemetry.

## Extensibility Considerations

- Add model providers through a stable abstraction layer.
- Add knowledge connectors through explicit ingest and retrieval interfaces.
- Register tools through clear permission boundaries.
- Keep deployment assets readable and easy to adapt.

The main early-stage risk is premature complexity. Core service boundaries should be validated before expanding integration coverage.
