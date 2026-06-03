# @hardmachinelab/env-sync

Sync `.env` files to CI/CD secrets — GitLab & GitHub, monorepo-aware.

## Features

- **Monorepo-aware** — discovers `.env` files across all packages, namespaces keys automatically (`blog/.env` → `BLOG_KEY`)
- **GitLab** — pushes values directly to CI/CD Variables via REST API
- **GitHub** — patches workflow YAML files + syncs secrets via `gh` CLI
- **Provider in `.env`** — declare `ENV_SYNC_PROVIDER=gitlab` inside any `.env` file
- **Dry-run** — preview changes without writing anything
- **Zero dependencies** beyond `dotenv`

## Install

```bash
pnpm add -D @hardmachinelab/env-sync
```

## Usage

```bash
# GitLab
env-sync --provider=gitlab --env=production

# GitHub — patch workflows + sync secrets
env-sync --provider=github --env=production

# GitHub — only patch workflow YAML files
env-sync --provider=github --env=production --workflows-only

# GitHub — only sync secrets (skip YAML patching)
env-sync --provider=github --env=production --sync-only

# Preview without writing
env-sync --provider=gitlab --env=production --dry-run

# Single file (skip monorepo discovery)
env-sync --provider=gitlab --env-file=packages/blog/.env
```

## Provider override in `.env`

Add `ENV_SYNC_PROVIDER` to any `.env` file and omit `--provider` from the CLI:

```env
ENV_SYNC_PROVIDER=gitlab
DATABASE_URL=postgres://...
```

CLI flag takes precedence over the file declaration.

## Namespacing (monorepo)

| File                        | Key             | Namespaced key          |
| --------------------------- | --------------- | ----------------------- |
| `.env`                      | `DATABASE_URL`  | `DATABASE_URL`          |
| `packages/blog/.env`        | `RESEND_API_KEY`| `BLOG_RESEND_API_KEY`   |
| `packages/ui/.env`          | `SUPABASE_URL`  | `UI_SUPABASE_URL`       |

## GitLab setup

```bash
# Required environment variables
CI_PROJECT_ID=12345678
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx
CI_API_V4_URL=https://gitlab.com/api/v4  # optional, defaults to gitlab.com
```

For local use, put these in `scripts/env/.env.local` (gitignored).

## GitHub setup

```bash
# Authenticate GitHub CLI
gh auth login
```

The `gh` CLI must be installed and authenticated with `repo` + `workflow` scopes.

## Options

| Flag               | Description                              | Default        |
| ------------------ | ---------------------------------------- | -------------- |
| `--provider`       | `gitlab` or `github`                     | from `.env` or `gitlab` |
| `--env`            | Environment name (`.env.<name>`)         | `development`  |
| `--dry-run`        | Preview changes, write nothing           | `false`        |
| `--workflows-only` | GitHub only — patch YAML, skip secrets   | `false`        |
| `--sync-only`      | GitHub only — sync secrets, skip YAML    | `false`        |
| `--env-file`       | Single file path, skip discovery         | `null`         |

## Programmatic usage

```typescript
import { discoverEnvFiles, parseEnvFiles, buildSecretMap, GitLabProvider } from '@hardmachinelab/env-sync';

const root     = process.cwd();
const files    = discoverEnvFiles(root, 'production');
const parsed   = parseEnvFiles(files, root, 'production');
const secrets  = buildSecretMap(parsed);
const provider = new GitLabProvider();

const result = await provider.push(secrets, { dryRun: false, workflowsOnly: false, syncOnly: false });
console.log(result);
```

## License

MIT © [Jordach Makaya](https://jordach.dev)