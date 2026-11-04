# Agent Engineering & Collaboration Protocol

This document defines the roles, protocols, and boundaries for AI agents contributing to Tollgate.

---

## 1. Roles

- **Antigravity**: The primary software architect, full-stack engineer, and implementation agent. Responsible for building features, writing tests, updating documentation, creating commits, and driving the implementation roadmap.
- **Junie**: The independent engineering reviewer. Responsible for auditing architecture, type safety, security boundaries, RLS policies, test coverage, and preventing regressions.

---

## 2. Non-Negotiable Operational Rules

1. **Step-by-Step Execution**: Never build multiple unrelated features in a single operation. Every feature must be independently verifiable and documented.
2. **No Fake Implementations**: No placeholder auth, simulated calculations, non-functional UI buttons, or mock database calls in production code paths.
3. **Preserve Working Code**: Inspect existing code, dependencies, and git status before touching any file.
4. **Light Theme Default**: All user-facing web interfaces must default to a clean, crisp light theme with a white background and responsive layouts.
5. **Integer Micro-Dollars**: All financial and token math must use integer micro-dollars (1 USD = 1,000,000 micro-dollars) to avoid floating-point drift.
6. **Documentation & Reporting**: Maintain `IMPLEMENTATION_REPORT.md` with clear, plain-English explanations of what was implemented, why, problems encountered, and recovery actions taken.

---

## 3. Feature Review Cycle

```
[ Antigravity ] -> Implements feature + writes unit/integration tests
                 |
                 v
[ Verification ] -> Runs TypeScript check + ESLint + Vitest
                 |
                 v
[ Junie Review ] -> Independent engineering audit against security & standards
                 |
                 v
[ Rectification] -> Antigravity addresses valid findings
                 |
                 v
[ Documentation] -> Updates CHANGELOG.md & IMPLEMENTATION_REPORT.md
                 |
                 v
[ Git Workflow ] -> Conventional commit + Git push to feature branch
```
