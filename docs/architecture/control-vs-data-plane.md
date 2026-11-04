# Control Plane vs. Data Plane Separation

## Motivation

Traditional monolithic architectures mix customer-facing dashboard queries with high-throughput streaming proxy requests. This leads to latency spikes, resource contention, and elevated security risk.

Tollgate strictly isolates the **Control Plane** from the **Data Plane**.

---

## Comparison

| Dimension                   | Control Plane (`apps/web`)                                       | Data Plane (`apps/gateway`)                                         |
| :-------------------------- | :--------------------------------------------------------------- | :------------------------------------------------------------------ |
| **Technology**              | Next.js 15 App Router                                            | Fastify 5 on Node.js                                                |
| **Primary Role**            | Dashboard, User Auth, Workspace Administration, Vault management | High-performance inference proxy, rate limiting, budget enforcement |
| **Latency Requirement**     | 50ms - 250ms (Human interaction)                                 | < 5ms gateway overhead                                              |
| **Data Access**             | Direct Supabase PostgreSQL via RLS                               | In-memory LRU cache + Redis hot-state                               |
| **Traffic Characteristics** | Burst-tolerant, stateful user sessions                           | High-throughput streaming, connection pooling, zero buffering       |
| **Deploy Target**           | Vercel or Container                                              | Horizontally scaled container instances                             |

---

## Guarantees

1. The Fastify Data Plane never performs synchronous relational database writes during the request/response cycle.
2. The Control Plane never handles live streaming AI inference requests.
3. Secrets decrypted in the Data Plane are kept strictly in ephemeral process memory and never written to storage or logs.
