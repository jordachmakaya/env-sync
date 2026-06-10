# Contributing

Thanks for helping improve `@hardmachinelabs/env-sync`.

## Local setup

```bash
pnpm install --frozen-lockfile
pnpm --filter @hardmachinelabs/env-sync run typecheck
pnpm --filter @hardmachinelabs/env-sync run build
pnpm --filter @hardmachinelabs/env-sync run test
pnpm --filter @hardmachinelabs/env-sync run pack:dry-run
```

## Pull requests

- Keep changes focused and easy to review.
- Do not commit generated `dist` output.
- Do not include real `.env` files, tokens, project IDs, or private URLs in tests, logs, issues, or examples.
- Keep the npm package name as `@hardmachinelabs/env-sync`.
- Do not bump the package version unless the maintainer explicitly asks for a release/version PR.

## Release notes

Describe user-visible behavior changes clearly. Call out provider behavior, CLI flags, and any packaging changes.
