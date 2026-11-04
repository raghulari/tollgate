# Security Architecture & Threat Model

## 1. Principles

1. **Defense in Depth**: Security boundaries at API gateway, application logic, and database RLS.
2. **Zero Plaintext Persistence**: Plaintext provider API keys and virtual API keys are never stored at rest.
3. **Fail-Closed Budgeting**: If Redis or quota services become unavailable, critical spending requests fail closed unless explicitly overridden.

---

## 2. Threat Analysis & Mitigations

| Threat Vector                  | Potential Impact                                                 | Tollgate Mitigation                                                                                                                                     |
| :----------------------------- | :--------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Provider Key Theft**         | Attacker drains customer credit card on OpenAI/Anthropic         | Envelope encryption (AES-256-GCM) with workspace DEKs wrapped by master KEK. Database compromises expose only ciphertext and auth tags.                 |
| **Virtual Key Exposure**       | Attacker uses customer key to query models                       | Keys are hashed with SHA-256 upon generation. Only hashes are stored. Plaintext is displayed exactly once. Keys can be rotated or revoked with 1 click. |
| **Cross-Tenant Access**        | Workspace A reads Workspace B's usage or projects                | Enforced at application layer AND at PostgreSQL Row-Level Security (RLS) level. Default-deny policies on every tenant table.                            |
| **Budget Race Condition**      | Concurrent parallel queries exceed budget before counter updates | Two-phase atomic reservation using Redis Lua scripts before upstream dispatch.                                                                          |
| **Secret Leaks in Telemetry**  | API keys or user prompts leak into Sentry or logs                | Comprehensive regex-based secret redaction in `@tollgate/logger`. Prompts are never stored in plain analytics records.                                  |
| **Dependency Vulnerabilities** | Supply chain attacks                                             | Automated Gitleaks scan, strict pnpm lockfiles, Dependabot alerts.                                                                                      |
