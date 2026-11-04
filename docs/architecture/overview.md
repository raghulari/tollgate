# Tollgate Architecture Overview

## 1. Executive Summary

Tollgate is an enterprise-grade AI Gateway and Spend Management Platform acting as a secure intermediary between client applications and AI model providers (OpenAI, Anthropic, Google Gemini).

Applications communicate with Tollgate using standard OpenAI-compatible requests and virtual API keys (`tg_live_...`). Real provider credentials remain encrypted inside the provider vault and are never exposed to browser clients or logs.

---

## 2. Core Architectural Pillars

```
+-------------------------------------------------------------------------+
|                              CLIENT APPS                                |
|          (Web apps, AI agents, CLI tools, Backend services)             |
+------------------------------------+------------------------------------+
                                     |
                                     | Virtual Key (tg_live_...)
                                     v
+------------------------------------+------------------------------------+
|                      TOLLGATE DATA PLANE (Fastify)                      |
|                                                                         |
|  1. Auth & Virtual Key Hash Lookup (LRU Cache / Redis)                  |
|  2. Token Bucket Rate Limiting (Atomic Redis Lua)                       |
|  3. Atomic Budget Reservation (Fail-Closed / Micro-dollars)             |
|  4. In-Memory DEK Decryption of Provider Key (AES-256-GCM)              |
|  5. Provider Request Mapping & Proxy Execution (Stream / Batch)         |
|  6. Usage Extraction & Actual Micro-dollar Cost Calculation             |
|  7. Budget Reservation Reconciliation & Event Enqueueing (BullMQ)       |
+------------------+----------------------------------+-------------------+
                   |                                  |
                   v (Encrypted provider call)        v (Async usage job)
        +----------+-----------+             +--------+--------+
        |   AI MODEL PROVIDERS |             | UPSTASH REDIS   |
        |  - OpenAI            |             | (BullMQ Queue)  |
        |  - Anthropic         |             +--------+--------+
        |  - Google Gemini     |                      |
        +----------------------+                      v
                                             +--------+--------+
                                             | ASYNC WORKER    |
                                             | (Idempotent     |
                                             |  Aggregation)   |
                                             +--------+--------+
                                                      |
                                                      v
+-----------------------------------------------------+-------------------+
|               TOLLGATE CONTROL PLANE (Next.js 15) & DATABASE            |
|                                                                         |
|  - Supabase PostgreSQL (RLS-enforced multi-tenant persistent storage)   |
|  - Web Dashboard: Budgets, Keys, Usage Analytics, Vault, Audit Logs    |
+-------------------------------------------------------------------------+
```

---

## 3. Request Lifecycle

1. **Intake**: Gateway receives OpenAI-compatible `POST /v1/chat/completions`.
2. **Authentication**: Resolves bearer token `tg_live_<secret>`, computes `SHA-256` hash, looks up cached key metadata.
3. **Guardrails**:
   - Checks key/workspace active status.
   - Enforces Redis token-bucket rate limits.
   - Atomically reserves maximum projected cost in Redis.
4. **Credential Decryption**: Workspace DEK is unwrapped in memory; provider credential decrypted via AES-256-GCM.
5. **Execution**: Provider adapter maps request, streams or buffers response from AI provider.
6. **Accounting**: Captures token usage, computes exact cost using integer micro-dollars, reconciles reservation.
7. **Telemetry**: Enqueues durable usage event to BullMQ without blocking client response.
