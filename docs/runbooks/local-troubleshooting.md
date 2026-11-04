# Local Troubleshooting Runbook

## 1. Port Conflicts

- **Web Dashboard**: Defaults to port `3000`. If busy, specify `PORT=3001 pnpm --filter @tollgate/web dev`.
- **Gateway**: Defaults to port `8787`. If busy, specify `GATEWAY_PORT=8788 pnpm --filter @tollgate/gateway dev`.

## 2. pnpm on Windows

When installing packages on Windows systems, always use `pnpm.cmd` if PowerShell throws execution policy or script sandbox restrictions:

```powershell
pnpm.cmd install
```

## 3. Redis Connectivity

If Upstash Redis credentials are not configured during local testing, unit tests use mocked adapters. For full integration tests, ensure `REDIS_URL` or `UPSTASH_REDIS_REST_URL` is set in `.env.local`.
