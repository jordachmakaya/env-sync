# @hardmachinelabs/env-sync

[![CI](https://github.com/jordachmakaya/env-sync/actions/workflows/ci.yml/badge.svg)](https://github.com/jordachmakaya/env-sync/actions/workflows/ci.yml)
[![Docs](https://github.com/jordachmakaya/env-sync/actions/workflows/pages.yml/badge.svg)](https://github.com/jordachmakaya/env-sync/actions/workflows/pages.yml)
[![npm version](https://img.shields.io/npm/v/@hardmachinelabs/env-sync.svg)](https://www.npmjs.com/package/@hardmachinelabs/env-sync)
[![npm downloads](https://img.shields.io/npm/dm/@hardmachinelabs/env-sync.svg)](https://www.npmjs.com/package/@hardmachinelabs/env-sync)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](tsconfig.json)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](package.json)

Sync `.env` files to CI/CD secrets — GitLab & GitHub, monorepo-aware.

env-sync works for both simple projects and monorepos. It is monorepo-aware, not monorepo-only.

Full documentation: <https://jordachmakaya.github.io/env-sync/>

## Features

- **Simple project support** — sync root `.env` and `.env.<environment>` files
- **Monorepo-aware** — discovers `.env` files across packages and namespaces package keys automatically (`blog/.env` → `BLOG_KEY`)
- **GitLab** — pushes values directly to CI/CD Variables via REST API
- **GitHub** — patches workflow YAML files and syncs secrets via the `gh` CLI
- **Provider in `.env`** — declare `ENV_SYNC_PROVIDER=gitlab` or `ENV_SYNC_PROVIDER=github` inside an `.env` file
- **Dry-run** — previews planned changes without writing secrets or workflow files
- **Small dependency footprint** — runtime dependency is `dotenv`

## Install

```bash
pnpm add -D @hardmachinelabs/env-sync
```

## Usage

```bash
# GitLab
env-sync --provider=gitlab --env=production

# GitHub: patch workflows and sync secrets
env-sync --provider=github --env=production

# GitHub: only patch workflow YAML files
env-sync --provider=github --env=production --workflows-only

# GitHub: only sync secrets, skipping YAML patching
env-sync --provider=github --env=production --sync-only

# Preview without writing
env-sync --provider=gitlab --env=production --dry-run

# Single file, skipping monorepo discovery
env-sync --provider=gitlab --env-file=packages/blog/.env
```

## Provider override in `.env`

Add `ENV_SYNC_PROVIDER` to an `.env` file and omit `--provider` from the CLI:

```env
ENV_SYNC_PROVIDER=gitlab
DATABASE_URL=postgres://...
```

The CLI flag takes precedence over the file declaration.

## Namespacing

| File | Key | Namespaced key |
| ---- | --- | -------------- |
| `.env` | `DATABASE_URL` | `DATABASE_URL` |
| `packages/blog/.env` | `RESEND_API_KEY` | `BLOG_RESEND_API_KEY` |
| `packages/ui/.env` | `SUPABASE_URL` | `UI_SUPABASE_URL` |

## GitLab setup

```bash
CI_PROJECT_ID=12345678
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx
CI_API_V4_URL=https://gitlab.com/api/v4
```

`CI_API_V4_URL` is optional and defaults to `https://gitlab.com/api/v4`.

## GitHub setup

```bash
gh auth login
```

The `gh` CLI must be installed and authenticated with permissions to manage repository secrets and workflows.

## Options

| Flag | Description | Default |
| ---- | ----------- | ------- |
| `--provider` | `gitlab` or `github` | From `.env` or `gitlab` |
| `--env` | Environment name, such as `production`, used to select `.env.production` | `development` |
| `--dry-run` | Preview planned writes | `false` |
| `--workflows-only` | GitHub only: patch YAML, skip secrets | `false` |
| `--sync-only` | GitHub only: sync secrets, skip YAML | `false` |
| `--env-file` | Single file path, skipping discovery | `null` |

## Programmatic usage

```typescript
import { buildSecretMap, discoverEnvFiles, GitLabProvider, parseEnvFiles } from '@hardmachinelabs/env-sync';

const root = process.cwd();
const files = discoverEnvFiles(root, 'production');
const parsed = parseEnvFiles(files, root, 'production');
const secrets = buildSecretMap(parsed);
const provider = new GitLabProvider();

const result = await provider.push(secrets, {
    dryRun: false,
    workflowsOnly: false,
    syncOnly: false,
});

console.log(result);
```

## Repository

Source, issues, and release work live at <https://github.com/jordachmakaya/env-sync>.

Full docs live at <https://jordachmakaya.github.io/env-sync/>.


## Maintainer

Built and maintained by **Jordach Makaya**.

- Portfolio: https://jordach.dev
- Project page: https://jordach.dev/tools/env-sync
- LinkedIn: https://www.linkedin.com/in/jordachmakaya/

## License

MIT © Jordach Makaya
