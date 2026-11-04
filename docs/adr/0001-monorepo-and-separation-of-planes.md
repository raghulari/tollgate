# ADR 0001: Monorepo Structure & Separation of Control vs. Data Planes

## Status

Accepted

## Context

Tollgate requires both a rich user-facing administrative web interface (Control Plane) and a high-performance, low-latency AI proxy gateway (Data Plane). Combining both into a single monolithic server introduces latency overhead, scaling limits, and unified attack surfaces.

## Decision

1. Organize the repository as a **Turborepo monorepo** managed with `pnpm workspaces`.
2. Decouple into three distinct runtime applications:
   - `apps/web`: Next.js 15 for dashboard, authorization, and customer management.
   - `apps/gateway`: Standalone Fastify service dedicated to AI proxying, key auth, rate limiting, and budgeting.
   - `apps/worker`: BullMQ background service for durable, asynchronous usage recording.
3. Share code via typed packages under `packages/*` (`crypto`, `schemas`, `pricing`, `config`, `database`, `logger`, `shared`, `providers`, `observability`).

## Consequences

- **Positive**: Gateway instances can scale horizontally according to inference load without scaling the web frontend. Security isolation prevents web vulnerabilities from exposing in-memory gateway secrets.
- **Negative**: Requires orchestrating multiple deploy targets and shared package boundaries.
