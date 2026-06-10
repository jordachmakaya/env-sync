# Dry Run

Use dry-run before every real sync.

```bash
env-sync --provider=github --env=production --dry-run
```

```bash
env-sync --provider=gitlab --env=production --dry-run
```

## What dry-run protects

Dry-run prevents provider writes:

- GitHub secrets are not set.
- GitHub workflow files are not written.
- GitLab variables are not created or updated.

## Current caveat

Dry-run may still require provider auth or provider state reads.

Current behavior:

- GitHub dry-run validates `gh auth status`.
- GitHub dry-run reads existing secret names.
- GitLab dry-run reads required GitLab env configuration.
- GitLab dry-run fetches existing variable keys.

This means dry-run is a safe preview for writes, not a fully offline command.

## Review checklist

Before removing `--dry-run`, review:

- discovered files
- selected provider
- generated secret names
- workflow YAML patch plan
- provider permissions
- logs for accidental sensitive output
