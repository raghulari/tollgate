# Local Development Guide

## Prerequisites

- **Node.js**: >= 20.0.0 (v22+ recommended)
- **pnpm**: >= 9.0.0 (v12+ tested)
- **Docker**: For local Supabase and Redis containers (optional for mock tests)
- **Git**

---

## 1. Clone & Install

```bash
git clone https://github.com/raghulari/tollgate.git
cd tollgate
pnpm install
```

---

## 2. Environment Configuration

```bash
cp .env.example .env.local
```

Populate the required secrets in `.env.local`:

- Supabase URL & Anon Key
- Master KEK (32-byte hex string)
- Upstash Redis credentials

---

## 3. Monorepo Scripts

- `pnpm dev`: Runs Turborepo development across all workspaces.
- `pnpm build`: Builds all apps and packages.
- `pnpm typecheck`: Runs TypeScript checks across all workspaces.
- `pnpm lint`: Runs ESLint across all projects.
- `pnpm test`: Runs Vitest unit & integration test suite.
- `pnpm test:e2e`: Runs Playwright end-to-end tests.
- `pnpm format`: Formats code with Prettier.
