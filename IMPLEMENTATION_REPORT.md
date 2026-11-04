# Tollgate — Master Engineering & Implementation Report

Welcome to the living engineering log for **Tollgate: The AI Spend Firewall & Key Vault for Small Teams**.

This document tracks every phase, feature, decision, technical problem, and recovery solution in plain, simple English.

---

## Table of Contents

1. [Project Overview & Philosophy](#1-project-overview--philosophy)
2. [Phase 0 — Repository Foundation (Completed)](#2-phase-0--repository-foundation-completed)
   - [What was implemented](#what-was-implemented)
   - [Why each decision was made](#why-each-decision-was-made)
   - [Technical issues encountered & how they were resolved](#technical-issues-encountered--how-they-were-resolved)
   - [Verification & Test Results](#verification--test-results)
3. [Design System & UI Theme Rules](#3-design-system--ui-theme-rules)
4. [Financial Integrity Rules (Micro-Dollars)](#4-financial-integrity-rules-micro-dollars)
5. [Upcoming Phases Roadmap](#5-upcoming-phases-roadmap)

---

## 1. Project Overview & Philosophy

### What is Tollgate?

Tollgate sits between your applications and AI providers like OpenAI, Anthropic, and Google Gemini.

Instead of putting your credit card-linked provider keys into your apps, you create **virtual API keys** in Tollgate. When your app makes an AI request:

1. Tollgate checks if you have enough budget left.
2. If you do, it temporarily reserves the estimated cost.
3. It unlocks your provider key in memory (using military-grade AES-256-GCM encryption).
4. It calls the AI provider and streams the answer back to your user.
5. It measures the exact tokens used, calculates the cost down to the millionth of a dollar, releases any unused budget, and saves the usage record in the background.

If your budget is used up or an app goes rogue, Tollgate immediately blocks the request before you get a surprise bill.

---

## 2. Phase 0 — Repository Foundation (Completed)

### What was implemented

In this foundational phase, we set up the complete production-grade monorepo structure without any fake or placeholder code:

1. **Monorepo Architecture (pnpm Workspaces + Turborepo)**:
   - Configured `pnpm-workspace.yaml` and `turbo.json` to orchestrate builds, tests, type checks, and linting across all packages with smart caching.

2. **Applications (`apps/`)**:
   - **`apps/web` (Control Plane)**: Next.js 15 App Router web application for user authentication, team workspaces, budget configuration, and analytics. Configured with a clean **light theme with pure white background**, crisp borders, and responsive design.
   - **`apps/gateway` (Data Plane)**: Standalone Fastify service for low-latency AI proxying. Implemented health endpoints (`/health`, `/ready`), structured JSON request logging, and global error handling.
   - **`apps/worker` (Background Worker)**: BullMQ background worker skeleton for reliable, asynchronous processing of usage events and rollups without slowing down user inference.

3. **Shared Typed Packages (`packages/`)**:
   - **`@tollgate/config`**: Environment variable validation using Zod to catch configuration mistakes immediately at startup.
   - **`@tollgate/shared`**: Central domain constants (roles, providers, budget periods), base error classes, and micro-dollar conversion utilities.
   - **`@tollgate/logger`**: Production JSON logger that automatically scrubs and redacts sensitive API keys, authorization headers, passwords, and encryption keys so they never leak into logs.
   - **`@tollgate/schemas`**: Strict Zod schemas for OpenAI-compatible chat completion requests/responses, virtual key management, and usage events.
   - **`@tollgate/pricing`**: Data-driven token pricing engine for OpenAI, Anthropic, and Gemini models using exact integer micro-dollar math.
   - **`@tollgate/crypto`**: Cryptographic vault foundation implementing AES-256-GCM envelope encryption (DEK/KEK wrapping) and cryptographically secure random virtual key generation with SHA-256 hashing.
   - **`@tollgate/database`**: Typed Supabase PostgreSQL contracts and client builder interfaces.
   - **`@tollgate/providers`**: Standardized provider adapter interfaces for buffered and streaming completions.
   - **`@tollgate/observability`**: In-memory metrics collectors and distributed request/trace ID generators.

4. **Testing & Quality Tooling**:
   - Vitest root test runner configuration with unit tests for every single shared package and application.
   - Playwright end-to-end testing configuration.
   - ESLint flat configuration and Prettier rules.
   - GitHub Actions CI pipeline (`.github/workflows/ci.yml`) enforcing secret detection (Gitleaks), typecheck, lint, and tests on every push.
   - Comprehensive technical documentation in `docs/`.

---

### Why each decision was made

| Decision                                    | Why we made it                                                                                                                                                                                                                                             |
| :------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Separating Control Plane and Data Plane** | The dashboard needs database queries and user auth, while the gateway needs to handle streaming tokens with minimal latency. If they were in one server, a spike in dashboard traffic could slow down or crash your live AI endpoints.                     |
| **Using Integer Micro-Dollars**             | In JavaScript, floating-point math like `0.1 + 0.2` equals `0.30000000000000004`. Over millions of AI requests, this causes rounding errors and financial discrepancies. Using integer micro-dollars ($1 = 1,000,000 micro-dollars) guarantees exact math. |
| **Envelope Encryption (DEK + KEK)**         | If someone gains read access to the database, they cannot read customer provider keys. Each workspace has its own Data Encryption Key (DEK), which is wrapped by a master Key Encryption Key (KEK) stored outside the database.                            |
| **Hashed Virtual Keys**                     | Virtual keys work like passwords: Tollgate shows the full key to the user once, but only stores a cryptographic SHA-256 hash. If Tollgate's database is breached, the attacker cannot use the keys.                                                        |
| **Scrubbing Secrets in Logger**             | Accidental leaks to logging systems are one of the most common causes of API key theft. Our logger automatically sanitizes keys matching patterns like `sk-...`, `tg_live_...`, and `Bearer ...`.                                                          |
| **Light Theme UI with White Background**    | The dashboard is an operational tool where clarity, readability, and contrast are paramount. A clean white background (`#ffffff`) with slate borders provides a crisp, professional SaaS feel.                                                             |

---

### Technical issues encountered & how they were resolved

#### Issue 1: `pnpm` command not recognized on Windows

- **What happened**: When first checking the runtime environment, PowerShell reported `The term 'pnpm' is not recognized`.
- **Why it happened**: Node.js was installed on the machine, but `pnpm` was not installed globally.
- **How we fixed it**: We installed `pnpm` globally via `npm install -g --allow-scripts=pnpm pnpm` using bypass sandbox mode (as required by the sandbox guidelines for package managers on Windows).

#### Issue 2: Git branch creation denied (`Permission denied on .git/refs/heads`)

- **What happened**: Running `git checkout -b feature/phase-0-foundation` in standard sandbox mode failed with: `fatal: cannot lock ref 'refs/heads/feature/phase-0-foundation': unable to create directory for .git/refs/heads/feature/phase-0-foundation`.
- **Why it happened**: On Windows, file system hooks inside standard sandbox mode protect `.git` directory modifications outside explicit user actions.
- **How we fixed it**: We ran the branch creation command with bypass sandbox approval. The branch `feature/phase-0-foundation` was created cleanly and verified.

---

### Verification & Test Results

All packages and applications include unit tests that run via Vitest:

- `@tollgate/config`: Tests default environment parsing and rejection of invalid values.
- `@tollgate/shared`: Tests micro-dollar conversions without float drift, error classes, and status codes.
- `@tollgate/logger`: Tests secret redaction on strings and nested objects, plus JSON formatting.
- `@tollgate/schemas`: Tests chat request validation and usage event schema parsing.
- `@tollgate/pricing`: Tests exact token cost calculation in micro-dollars with half-up rounding.
- `@tollgate/crypto`: Tests AES-256-GCM encryption/decryption, tamper detection on corrupted auth tags, DEK wrapping, and virtual key hashing.
- `@tollgate/database`: Tests typed Supabase client instantiation.
- `@tollgate/providers`: Tests normalized completion structures.
- `@tollgate/observability`: Tests metric counting and trace ID generation.
- `@tollgate/gateway`: Tests Fastify server injection for `/health`, `/ready`, and 404 responses.
- `@tollgate/worker`: Tests worker lifecycle states (`initialized` -> `running` -> `stopped`).
- `@tollgate/web`: Tests web module loading.

---

## 3. Design System & UI Theme Rules

- **Theme Mode**: Permanent Light Theme.
- **Base Background**: `#ffffff` (Pure White).
- **Foreground / Text**: `#0f172a` (Slate 900) for primary text; `#64748b` (Slate 500) for secondary text.
- **Borders & Dividers**: `#e2e8f0` (Slate 200).
- **Primary Action**: `#2563eb` (Blue 600) with `#1d4ed8` (Blue 700) on hover.
- **Cards & Surfaces**: Clean white cards with subtle `#e2e8f0` border and light drop shadows.

---

## 4. Financial Integrity Rules (Micro-Dollars)

- `1 USD = 1,000,000 micro-dollars`
- Token cost formula: `((tokens * ratePerMillion) + 500,000) / 1,000,000` (integer round half-up).
- Budget reservations must always fail closed if quota services are unreachable.

---

## 5. Upcoming Phases Roadmap

- **Phase 1**: Supabase Foundation & Authentication (SQL migrations, profiles, workspaces, memberships, RLS policies, OAuth, RBAC).
- **Phase 2**: Dashboard & Workspace Management (Workspace switcher, member invitations, projects, audit logging).
- **Phase 3**: Provider Credential Vault (Encrypted credential storage, DEK management, credential rotation).
- **Phase 4**: Virtual API Keys (Key creation UI, one-time reveal, hashing, scopes, expiration).
- **Phase 5**: Gateway Foundation (Fastify data plane, virtual-key authentication, LRU caching).
- **Phase 6**: Provider Integrations (OpenAI, Anthropic, Gemini adapters, streaming response transformation).
- **Phase 7**: Budgets and Rate Limits (Redis token bucket, atomic reservations, kill switches).
- **Phase 8**: Usage Pipeline (BullMQ worker, idempotent batch processing, usage rollups).
- **Phase 9**: Analytics Dashboard (Live spend charts, token metrics, model breakdowns).
- **Phase 10**: Production Hardening & Security Audit.
