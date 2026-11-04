# Database Schema Overview

Tollgate uses Supabase PostgreSQL as its persistent system of record. Every schema modification is managed through sequential SQL migrations in `supabase/migrations/`.

---

## Core Entities

1. **Identity & Tenancy**:
   - `profiles`: User profile data linked to Supabase Auth `auth.users`.
   - `workspaces`: Multi-tenant boundary container.
   - `workspace_members`: Role-based membership (`owner`, `admin`, `developer`, `viewer`).
   - `workspace_invitations`: Secure email invitation tokens.

2. **Projects & Keys**:
   - `projects`: Logical team/client partitioning within workspaces.
   - `virtual_api_keys`: SHA-256 hashed virtual keys with prefixes, model restrictions, and expiration.

3. **Vault**:
   - `provider_credentials`: Envelope-encrypted provider credentials with IV, auth tag, version, and masked display key.

4. **Financial Controls**:
   - `budgets`: Spending limits configured in integer micro-dollars.
   - `budget_reservations`: In-flight reservations during request lifecycle.

5. **Analytics & Audit**:
   - `usage_events`: Immutable audit trail of completed AI requests.
   - `audit_logs`: Audit record of all administrative actions.

---

## Integer Micro-Dollars

To prevent JavaScript floating-point errors (e.g. `0.1 + 0.2 !== 0.3`), all financial accounting values are stored as integers representing **micro-dollars** (1 USD = 1,000,000 micro-dollars).
