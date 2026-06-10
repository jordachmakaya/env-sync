# CLI Reference

## `--provider`

Selects the provider.

```bash
env-sync --provider=github
env-sync --provider=gitlab
```

Allowed values:

- `github`
- `gitlab`

If omitted, env-sync can use `ENV_SYNC_PROVIDER` from an env file. If no provider is found, it defaults to `gitlab`.

## `--env`

Selects the environment name.

```bash
env-sync --env=production
```

`--env=production` selects `.env.production`.

Pass the environment name only, without the `.env.` prefix.

Default:

```txt
development
```

## `--dry-run`

Previews planned changes without writing secrets or workflow files.

Current caveat: dry-run may still require provider auth and provider state reads.

## `--workflows-only`

GitHub only. Patches workflow YAML files and skips secret syncing.

```bash
env-sync --provider=github --env=production --workflows-only
```

## `--sync-only`

GitHub only. Syncs secrets and skips workflow YAML patching.

```bash
env-sync --provider=github --env=production --sync-only
```

## `--env-file`

Uses one explicit file instead of discovery.

```bash
env-sync --provider=github --env-file=packages/blog/.env --dry-run
```

The file path is resolved from the current working directory.
