# npm Release

This page is for maintainers.

Do not publish from a dirty or unverified workspace.

## Pre-release checklist

1. Confirm the package name is still:

```txt
@hardmachinelabs/env-sync
```

2. Bump `packages/env-sync/package.json` only when a release is approved.

3. Confirm the target version is not already published on npm.

4. Run:

```bash
pnpm --filter @hardmachinelabs/env-sync run typecheck
pnpm --filter @hardmachinelabs/env-sync run build
pnpm --filter @hardmachinelabs/env-sync run test
cd packages/env-sync && npm pack --dry-run --json
```

5. Review tarball contents.

The tarball should include:

- `dist`
- `README.md`
- `LICENSE`
- `package.json`

## GitHub release workflow

The npm release workflow is manual. It requires `NPM_TOKEN` and publishes with npm provenance.

Do not use the docs Pages workflow for npm release. The Pages workflow must not require npm secrets and must not publish npm.

## Changesets

Changesets is configured with:

```json
"access": "public"
```

Do not run versioning or publishing commands unless the owner has approved a release.
