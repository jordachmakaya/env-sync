# env-sync

![](assets/env-sync_by_jordach_makaya.png)

[![CI](https://github.com/jordachmakaya/env-sync/actions/workflows/ci.yml/badge.svg)](https://github.com/jordachmakaya/env-sync/actions/workflows/ci.yml)
[![Docs](https://github.com/jordachmakaya/env-sync/actions/workflows/pages.yml/badge.svg)](https://github.com/jordachmakaya/env-sync/actions/workflows/pages.yml)
[![npm version](https://img.shields.io/npm/v/@hardmachinelabs/env-sync.svg)](https://www.npmjs.com/package/@hardmachinelabs/env-sync)
[![npm downloads](https://img.shields.io/npm/dm/@hardmachinelabs/env-sync.svg)](https://www.npmjs.com/package/@hardmachinelabs/env-sync)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](packages/env-sync/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](packages/env-sync/tsconfig.json)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](packages/env-sync/package.json)


Sync `.env` files to GitHub Actions secrets and GitLab CI/CD variables.

env-sync works for both simple projects and monorepos. It is monorepo-aware, not monorepo-only.

## Links

- Documentation: https://jordachmakaya.github.io/env-sync/
- npm package: https://www.npmjs.com/package/@hardmachinelabs/env-sync
- Repository: https://github.com/jordachmakaya/env-sync

## Quick examples

```bash
pnpm add -D @hardmachinelabs/env-sync
env-sync --provider=github --env=production --dry-run
```

>[!important]
>### Safety
>Run --dry-run first, review generated secret names, and never commit real .env files.
