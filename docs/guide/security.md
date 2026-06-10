# Security and No-Trust Model

env-sync handles values that can become CI/CD secrets. Treat every command and log as sensitive.

## Core rules

- Do not commit `.env` files.
- Do not paste real secrets into issues, pull requests, screenshots, or docs.
- Use fake examples.
- Run dry-run first.
- Review generated secret names.
- Review workflow YAML diffs before committing them.

## Dependency no-trust policy

Dependency policy lives in `DEPENDENCIES.md`.

Key rules:

- No new runtime dependency without explicit owner approval.
- Runtime dependency changes require owner approval.
- Dependency upgrades require review of `package.json` diff, `pnpm-lock.yaml` diff, CI result, and package dry-run result when release-related.
- Exact dependency versions are required.

## Snyk dependency scanning

Snyk is used as external security tooling for dependency vulnerability monitoring. It is not installed as a permanent package dependency.

Local dependency scan:

```bash
pnpm dlx snyk@latest test --all-projects
```

Continuous monitoring snapshot:

```bash
pnpm dlx snyk@latest monitor --all-projects
```

`monitor` sends a project snapshot to Snyk for continuous monitoring. Do not run it unless the owner explicitly approves the upload and project import behavior.

GitHub Actions Snyk scans require a repository secret:

```txt
SNYK_TOKEN
```

Snyk is not proof that the code is secure. It is dependency vulnerability monitoring, not a full security audit, threat model, static analysis pass, or manual review.

Do not add a Snyk README badge until:

- The repository is public.
- The project is imported or monitored in Snyk.
- The badge URL is verified.

## Why `dist` is not tracked

Generated `dist` output should not be tracked in Git.

The npm package still includes generated `dist` because `packages/env-sync/package.json` includes:

```json
"files": [
  "dist",
  "README.md",
  "LICENSE"
]
```

Release verification should always include:

```bash
cd packages/env-sync && npm pack --dry-run --json
```
