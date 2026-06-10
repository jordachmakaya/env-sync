# Quick Start

This guide gets you to a safe preview before any provider write happens.

env-sync works for both simple projects and monorepos. It is monorepo-aware, not monorepo-only.

## Install

```bash
pnpm add -D @hardmachinelabs/env-sync
```

## Pick a provider

Before using a provider, complete the matching setup page:

- [GitHub Setup](./github-setup.md)
- [GitLab Setup](./gitlab-setup.md)

Use `github` for GitHub Actions secrets:

```bash
env-sync --provider=github --env=production --dry-run
```

Use `gitlab` for GitLab CI/CD variables:

```bash
env-sync --provider=gitlab --env=production --dry-run
```

`--env=production` selects `.env.production`. Pass the environment name only.

## Single-file mode

Use `--env-file` when you want to sync one file instead of discovering files:

```bash
env-sync --provider=github --env-file=packages/blog/.env --dry-run
```

## Before writing

Check:

- Which files were discovered.
- Which secret names were generated.
- Which provider was selected.
- Whether the command is still asking for provider auth.

## Apply after review

Remove `--dry-run` only after reviewing the output:

```bash
env-sync --provider=github --env=production
```

For GitHub, the default behavior can patch workflow YAML files and sync secrets. Use `--sync-only` or `--workflows-only` when you need a narrower operation.
