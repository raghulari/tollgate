# Changelog

All notable changes to Tollgate are documented in this file in accordance with [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added - Phase 0: Repository Foundation (2026-11-04)

- **Turborepo & pnpm Workspaces**: Configured monorepo pipeline for apps and packages.
- **Control Plane (`apps/web`)**: Next.js 15 App Router web application foundation with light theme (white background, slate borders, Inter font).
- **Data Plane (`apps/gateway`)**: Fastify AI Gateway data plane with health endpoints (`GET /health`, `GET /ready`), error handling, and request tracing.
- **Background Worker (`apps/worker`)**: BullMQ worker service skeleton with graceful start/stop lifecycle management.
- **Shared Packages**:
  - `@tollgate/config`: Zod-based environment variable schema validation.
  - `@tollgate/shared`: Roles, constants, micro-dollar arithmetic helpers, and error hierarchies.
  - `@tollgate/logger`: Structured JSON logger with automated secret and credential redaction.
  - `@tollgate/schemas`: Zod schemas for OpenAI-compatible chat requests, virtual keys, budgets, and usage events.
  - `@tollgate/pricing`: Token pricing tables (OpenAI, Anthropic, Gemini) and integer micro-dollar cost calculations.
  - `@tollgate/crypto`: AES-256-GCM envelope encryption (DEK/KEK) and virtual key hashing (`SHA-256`).
  - `@tollgate/database`: Supabase client interfaces and typed PostgreSQL schema contracts.
  - `@tollgate/providers`: Provider adapter interface contracts for streaming and buffered completions.
  - `@tollgate/observability`: Metrics collector and trace/request ID generators.
- **Infrastructure & Quality**:
  - Configured TypeScript strict mode (`tsconfig.base.json`).
  - Configured ESLint flat config (`eslint.config.mjs`) and Prettier.
  - Configured Vitest unit test suite across all packages.
  - Configured Playwright end-to-end framework.
  - Configured GitHub Actions CI pipeline (`.github/workflows/ci.yml`).
  - Configured Gitleaks secret detection (`.gitleaks.toml`).
  - Established `AGENTS.md` and `JUNIE.md` protocols.
  - Created initial technical architecture documentation in `docs/`.
  - Created `IMPLEMENTATION_REPORT.md` tracking all implementations, issues, and recoveries.
