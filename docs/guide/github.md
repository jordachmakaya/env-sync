# GitHub Provider

The GitHub provider syncs values to GitHub Actions secrets through the `gh` CLI and can patch workflow YAML files.

For provider-side setup, see [GitHub Setup](./github-setup.md).

## Prerequisites

Install GitHub CLI and authenticate:

```bash
gh auth login
```

The authenticated account must be allowed to manage repository secrets and workflow files.

## Recommended first command

```bash
env-sync --provider=github --env=production --dry-run
```

Dry-run does not write secrets or workflow files, but current implementation still checks `gh` auth and reads existing secret names.

## Modes

Default GitHub behavior does both:

```bash
env-sync --provider=github --env=production
```

This patches workflow YAML files and syncs secrets.

Only sync secrets:

```bash
env-sync --provider=github --env=production --sync-only
```

Only patch workflow YAML files:

```bash
env-sync --provider=github --env=production --workflows-only
```

## Workflow patching warning

Workflow patching modifies files under `.github/workflows`. The current implementation uses line-based YAML text patching. Review the diff before committing workflow changes.

## Secret name validation

GitHub secret names must match the current validation rule:

```txt
^[A-Za-z_][A-Za-z0-9_]*$
```

Names starting with `GITHUB_` are rejected.

See [Naming](./naming.md) for generated name details.
