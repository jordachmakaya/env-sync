# Single Project

Simple projects are first-class users of env-sync.

env-sync works for both simple projects and monorepos. It is monorepo-aware, not monorepo-only.

## File layout

A simple project can use:

```txt
.env
.env.production
```

Run:

```bash
env-sync --provider=github --env=production --dry-run
```

That command selects `.env` and `.env.production`.

## Naming behavior

For root project env files, keys stay as-is:

| File | Key | Secret name |
| ---- | --- | ----------- |
| `.env` | `DATABASE_URL` | `DATABASE_URL` |
| `.env.production` | `API_KEY` | `API_KEY` |

## Provider override

You can declare a provider inside an env file:

```env
ENV_SYNC_PROVIDER=github
API_KEY=fake-example-value
```

The CLI `--provider` flag takes precedence over `ENV_SYNC_PROVIDER`.

## Safety checklist

- Do not commit real `.env` files.
- Use fake examples in issues and docs.
- Run `--dry-run` first.
- Review generated names before syncing.
