# Troubleshooting

## `gh` is not installed

Install GitHub CLI, then retry:

```bash
gh auth login
```

See [GitHub Setup](./github-setup.md).

## `gh` is not authenticated

The GitHub provider calls `gh auth status`. Run:

```bash
gh auth login
```

See [GitHub Setup](./github-setup.md).

## Missing `GITLAB_TOKEN`

Set `GITLAB_TOKEN` before using the GitLab provider.

See [GitLab Setup](./gitlab-setup.md).

## Missing `CI_PROJECT_ID`

Set `CI_PROJECT_ID` to the GitLab project ID.

See [GitLab Setup](./gitlab-setup.md).

## No `.env` files found

Check the selected environment:

```bash
env-sync --env=production
```

`--env=production` selects `.env.production`.

You can also use explicit single-file mode:

```bash
env-sync --env-file=packages/blog/.env
```

## Invalid GitHub secret name

GitHub names must match:

```txt
^[A-Za-z_][A-Za-z0-9_]*$
```

Names starting with `GITHUB_` are rejected.

## Unexpected namespacing

Files under `packages/<name>` or `apps/<name>` are prefixed with the uppercased folder name.

See [Naming](./naming.md).

## Workflow patching did not modify expected YAML

The current patcher looks for existing `env:` blocks in workflow YAML and uses line-based text modification. Review your workflow file structure and run dry-run first.

## Dry-run still requires auth

Current dry-run mode prevents writes but can still require provider auth and read provider state.

See [Dry Run](./dry-run.md).
