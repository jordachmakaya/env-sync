# GitHub Setup

Prepare GitHub before using env-sync with the GitHub provider.

## Purpose

The GitHub provider uses the GitHub CLI, `gh`, to:

- List existing repository secrets.
- Set repository secrets.
- Optionally patch GitHub Actions workflow YAML files.

env-sync works for both simple projects and monorepos. It is monorepo-aware, not monorepo-only.

## Prerequisites

You need:

- A GitHub account.
- Access to the target repository.
- GitHub CLI installed.
- An authenticated `gh` session.
- Permission to manage repository secrets.
- Permission to modify workflow files if workflow patching is used.

For repository secrets, GitHub documents that organization repositories require `write` access and personal account repositories require repository collaborator access. Organization policy may further restrict Actions, secrets, workflow edits, or token usage. Verify your organization policy before syncing production secrets.

GitHub Actions workflow patching modifies files under:

```txt
.github/workflows/
```

That means your local checkout and Git identity must be allowed to change those files, and branch protection may require a pull request before those changes can be merged.

## Step 1 - Install GitHub CLI

Install GitHub CLI from the official GitHub CLI install instructions for your operating system.

After installation, confirm it is available:

```bash
gh --version
```

## Step 2 - Authenticate

Authenticate the CLI:

```bash
gh auth login
gh auth status
```

The authenticated account must be the account or organization identity that can access the target repository. If you work across multiple GitHub accounts, check `gh auth status` before running env-sync.

### Token-Based Login

The easiest path is the browser flow from `gh auth login`. If your organization requires a Personal Access Token, use a token with only the scopes needed for this work.

For a classic Personal Access Token used with `gh auth login --with-token`, GitHub CLI documents these minimum scopes:

```txt
repo
read:org
gist
```

For env-sync workflow patching, add `workflow` only if the token will be used to push or update GitHub Actions workflow files. env-sync edits workflow YAML files locally; your Git/GitHub process still controls whether those file changes are pushed or merged.

Do not add package scopes for env-sync:

```txt
write:packages
delete:packages
```

env-sync does not upload, download, or delete GitHub Packages.

Do not add organization admin scopes unless your organization explicitly requires them:

```txt
admin:org
```

Those scopes are broader than env-sync needs for repository secret sync.

Recommended classic token checklist:

| Scope | Use for env-sync | Notes |
| --- | --- | --- |
| `repo` | Required for private repository access and repository secret operations through `gh` | Broad classic scope; prefer fine-grained tokens if your organization supports them |
| `read:org` | Required by GitHub CLI for classic token login | Helps `gh` understand organization membership |
| `gist` | Required by GitHub CLI for classic token login | GitHub CLI documents it as part of the minimum classic token set |
| `workflow` | Optional | Use only if this token will also push or update files under `.github/workflows/` |
| `write:packages` | Not needed | Do not select for env-sync |
| `delete:packages` | Not needed | Do not select for env-sync |
| `admin:org` | Not needed by default | Select only if your organization policy explicitly requires it |

Create the token from GitHub:

```txt
GitHub -> Settings -> Developer settings -> Personal access tokens -> Tokens (classic)
```

Then:

1. Click `Generate new token`.
2. Choose `Generate new token (classic)`.
3. Set a clear note, such as `env-sync local gh login`.
4. Choose an expiration date.
5. Select only the approved scopes.
6. Click `Generate token`.
7. Copy the token immediately. GitHub will not show it again.

Authenticate `gh` with the token:

```bash
gh auth login --with-token < token.txt
gh auth status
```

Avoid pasting the token into shell history. If you do use a temporary file such as `token.txt`, delete it immediately after login and never commit it.

## Step 3 - Ensure Repository Permissions

The authenticated user or token must be allowed to manage repository secrets. env-sync calls repository-level `gh secret list` and `gh secret set`, so the account must be able to list and write repository Actions secrets.

If you also allow workflow patching, the same working tree must be allowed to change files in `.github/workflows/`. If branch protection or CODEOWNERS rules apply, plan to review and merge those YAML changes through your normal repository process.

For organization-level rules, ask an owner or administrator whether Actions secrets, workflow edits, or GitHub CLI authentication are restricted.

## Step 4 - Choose GitHub Sync Mode

Start with dry-run:

```bash
env-sync --provider=github --env=production --dry-run
```

Default GitHub mode does two things:

- Patches GitHub Actions workflow YAML files.
- Syncs repository secrets.

Use narrower modes when you want less surface area during setup.

Sync secrets only, skipping workflow YAML patching:

```bash
env-sync --provider=github --env=production --sync-only --dry-run
```

Patch workflow YAML only, skipping secret sync:

```bash
env-sync --provider=github --env=production --workflows-only --dry-run
```

`--sync-only` is a good first adoption path when your workflows already reference the expected secret names.

`--workflows-only` is useful when you want to inspect the YAML patch separately before allowing any provider writes.

## Step 5 - First Real Sync

Run dry-run first and inspect:

- Which `.env` files were discovered.
- Which secret names were generated.
- Which secrets would be created or updated.
- Which workflow files would be patched.

Then run without `--dry-run` only after the output and local diff look correct:

```bash
env-sync --provider=github --env=production
```

## Warnings

- Do not commit `.env` files.
- Do not paste secret values in issues, pull requests, chat, or logs.
- Workflow patching modifies YAML files under `.github/workflows/`.
- Review generated secret names before applying changes.
- GitHub secret names must be valid.
- Secret names starting with `GITHUB_` are rejected by the current implementation.
- Dry-run may still require `gh` auth and may read existing secret names.

## Troubleshooting

### `gh` is Not Installed

Install GitHub CLI, then run:

```bash
gh --version
```

### `gh` is Not Authenticated

Run:

```bash
gh auth login
gh auth status
```

### Wrong GitHub Account Selected

Check:

```bash
gh auth status
```

If the active account is not the account with access to the target repository, switch accounts or re-authenticate.

### Insufficient Permissions to Set Secrets

Confirm the authenticated account can create repository Actions secrets in the GitHub UI. For organization repositories, verify organization policy and repository role with an owner or administrator.

### Invalid Secret Name

GitHub secret names must match the current env-sync validation rule:

```txt
^[A-Za-z_][A-Za-z0-9_]*$
```

Names starting with `GITHUB_` are rejected.

### Workflow Patching Did Not Modify the Expected File

Confirm you are running env-sync from the repository root or pass the intended root in your workflow. Review `.github/workflows/` and run dry-run before applying changes.

### Running From the Wrong Repository or Directory

Run:

```bash
pwd
git status --short
```

Make sure the working directory is the repository whose secrets and workflows you intend to manage.

## References

- GitHub Actions secrets documentation: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
- GitHub CLI `gh secret set` manual: https://cli.github.com/manual/gh_secret_set
