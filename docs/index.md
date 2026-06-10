# env-sync

`env-sync` syncs `.env` values to GitHub Actions secrets or GitLab CI/CD variables.

env-sync works for both simple projects and monorepos. It is monorepo-aware, not monorepo-only.

Use it when you want one repeatable CLI flow for previewing and syncing environment values into CI/CD secret stores.

## What it does

- Discovers `.env` and `.env.<environment>` files.
- Supports simple projects, `packages/*`, and `apps/*`.
- Builds namespaced secret names for package and app env files.
- Syncs secrets to GitHub through the `gh` CLI.
- Syncs variables to GitLab through the GitLab REST API.
- Supports explicit single-file mode with `--env-file`.

## What it does not do

- It does not make secrets safe to commit.
- It does not replace reviewing generated secret names.
- It does not remove the need to verify provider permissions.
- It does not currently avoid all provider reads in dry-run mode.

## Start safely

Always run a dry-run first:

```bash
env-sync --provider=github --env=production --dry-run
```

For GitLab:

```bash
env-sync --provider=gitlab --env=production --dry-run
```

## Next steps

- [Quick Start](./guide/quick-start.md)
- [Single Project Guide](./guide/single-project.md)
- [Monorepo Guide](./guide/monorepo.md)
- [CLI Reference](./reference/cli.md)
- [Security Guide](./guide/security.md)
