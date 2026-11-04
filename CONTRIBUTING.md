# Contributing to Tollgate

Thank you for contributing to Tollgate. We adhere to strict engineering standards to ensure security, correctness, and reliability.

---

## Branch Strategy

- `main`: Production-ready, stable codebase.
- `feature/<name>`: New features (e.g. `feature/phase-0-foundation`).
- `fix/<name>`: Bug fixes.
- `chore/<name>`: Maintenance, CI, and tooling updates.

---

## Commit Guidelines

We enforce **Conventional Commits**:

- `feat(scope): description`
- `fix(scope): description`
- `test(scope): description`
- `docs(scope): description`
- `chore(scope): description`
- `refactor(scope): description`

---

## Code Quality Standards

1. Run `pnpm typecheck` — zero type errors allowed.
2. Run `pnpm lint` — zero ESLint errors allowed.
3. Run `pnpm test` — all unit and integration tests must pass.
4. Run `pnpm format:check` — ensure code conforms to Prettier formatting.
5. All secrets must be absent from code, commits, and logs.
