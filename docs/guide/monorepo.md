# Monorepo

env-sync is monorepo-aware. It can discover `.env` files under workspace-style folders and namespace their keys.

It is not monorepo-only. Use the [Single Project](./single-project.md) guide if your project has only root env files.

## Supported shapes

Current source behavior recognizes package names from paths containing:

```txt
packages/<name>
apps/<name>
```

Discovery walks the repository and skips directories such as `node_modules`, `.git`, `.idea`, `dist`, `.turbo`, and `.cache`.

## Example

```txt
.env
packages/blog/.env
apps/web/.env.production
```

Run:

```bash
env-sync --provider=github --env=production --dry-run
```

## Namespacing

Package and app env keys are prefixed with the folder name:

| File | Key | Generated name |
| ---- | --- | -------------- |
| `.env` | `DATABASE_URL` | `DATABASE_URL` |
| `packages/blog/.env` | `RESEND_API_KEY` | `BLOG_RESEND_API_KEY` |
| `apps/web/.env.production` | `PUBLIC_URL` | `WEB_PUBLIC_URL` |

## Current caveat

Priority scoring currently boosts files under `packages/*`. `apps/*` names are recognized for namespacing, but the current priority helper does not add the same package priority boost for `apps/*`.

Document and review override behavior before relying on conflicts between root, package, and app files.
