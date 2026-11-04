# Tollgate Security Policy

Security is a primary design principle of Tollgate. We treat provider credentials and virtual keys with extreme defense-in-depth measures.

---

## 1. Supported Versions

Only the latest release on the `main` branch receives security updates.

---

## 2. Security Architecture

1. **Envelope Encryption (AES-256-GCM)**:
   - Each workspace is provisioned with a random 256-bit Data Encryption Key (DEK).
   - Provider API keys are encrypted at rest using the workspace DEK.
   - DEKs are encrypted (wrapped) using the master Key Encryption Key (KEK).
   - Plaintext keys are never persisted or returned to browser clients.
2. **Virtual Keys**:
   - High-entropy cryptographic random keys (`tg_live_<secret>`).
   - Plaintext shown only once upon creation.
   - Persistent storage holds only SHA-256 hashes and non-secret prefixes.
3. **Database Row-Level Security (RLS)**:
   - Strict tenant isolation enforced in PostgreSQL.
4. **Log Redaction**:
   - All logging automatically strips tokens, API keys, passwords, and authorization headers.

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability in Tollgate, please **do not** open a public issue.

Report findings privately by emailing `security@tollgate.dev` or submitting a private security advisory on GitHub. Include:

- Description of vulnerability and impact
- Steps to reproduce
- Proof of concept if applicable

We acknowledge receipt within 24 hours and issue fixes promptly.
