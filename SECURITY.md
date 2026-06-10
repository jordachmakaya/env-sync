# Security Policy

`env-sync` handles environment variables and CI/CD secrets. Please do not open public issues for vulnerabilities, secret leaks, or reports that include sensitive tokens.

## Reporting a vulnerability

Use GitHub Security Advisories for private reports:

https://github.com/jordachmakaya/env-sync/security/advisories/new

If the advisory flow is unavailable, contact the maintainer through a private channel before sharing details publicly.

## Handling secrets safely

- Never include real `.env` files in issues, pull requests, screenshots, or logs.
- Redact tokens, project IDs, repository names, and private URLs when sharing output.
- Prefer minimal reproductions with fake values.

## Dependency vulnerability monitoring

Snyk may be used as an external dependency vulnerability scanner:

```bash
pnpm dlx snyk@latest test --all-projects
```

Continuous monitoring uses:

```bash
pnpm dlx snyk@latest monitor --all-projects
```

`monitor` sends a project snapshot to Snyk. It should be run only with owner approval. Snyk is dependency vulnerability monitoring, not proof that env-sync is secure.
