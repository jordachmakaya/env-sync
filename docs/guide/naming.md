# Naming

env-sync builds secret names from the env file location and env key.

## Root files

Root files keep keys unchanged:

| File | Key | Generated name |
| ---- | --- | -------------- |
| `.env` | `DATABASE_URL` | `DATABASE_URL` |
| `.env.production` | `API_KEY` | `API_KEY` |

## Package and app files

Files under `packages/<name>` or `apps/<name>` use the folder name as a prefix:

| File | Key | Generated name |
| ---- | --- | -------------- |
| `packages/blog/.env` | `DATABASE_URL` | `BLOG_DATABASE_URL` |
| `apps/web/.env.production` | `PUBLIC_URL` | `WEB_PUBLIC_URL` |

## Current transformation

Current source behavior uppercases the package or app folder name and appends `_` plus the env key.

It does not currently normalize hyphens or other non-underscore characters in folder names before building names.

## GitHub validation

GitHub secret names are validated before syncing:

```txt
^[A-Za-z_][A-Za-z0-9_]*$
```

Names starting with `GITHUB_` are rejected.

If a generated name fails validation, rename the folder/key or use a file layout that produces a valid name.
