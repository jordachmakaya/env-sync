# GitLab Setup

Prepare GitLab before using env-sync with the GitLab provider.

## Purpose

The GitLab provider uses the GitLab REST API to:

- List existing CI/CD variables.
- Create missing variables.
- Update existing variables.

env-sync works for both simple projects and monorepos. It is monorepo-aware, not monorepo-only.

## Required Environment Variables

Set:

```bash
CI_PROJECT_ID=12345678
GITLAB_TOKEN=glpat-example
CI_API_V4_URL=https://gitlab.com/api/v4
```

`CI_PROJECT_ID` is required.

`GITLAB_TOKEN` is required.

`CI_API_V4_URL` is optional and defaults to:

```txt
https://gitlab.com/api/v4
```

Self-hosted GitLab users must set `CI_API_V4_URL` to their instance API URL.

## Step 1 - Find `CI_PROJECT_ID`

Find the project ID in your GitLab project overview or project settings. Use the numeric project ID when possible:

```bash
CI_PROJECT_ID=12345678
```

If your organization prefers URL-encoded project paths for API usage, verify that behavior with your GitLab instance and policy before using it with env-sync.

## Step 2 - Create a GitLab Token

Create a token that can use the GitLab API to manage project CI/CD variables.

Preferred options:

- Project Access Token, if available in your GitLab plan and organization policy.
- Personal Access Token, if project access tokens are unavailable.

GitLab documents the `api` scope as read and write access to the API for both project access tokens and personal access tokens. Prefer the least privilege available in your GitLab plan and organization policy, and verify required role permissions with your GitLab administrator if you are unsure.

Do not assume every GitLab plan, self-managed instance, or organization policy allows the same token type.

## Step 3 - Store the Token Safely

If env-sync runs in GitLab CI, store the token as a CI/CD variable:

```txt
Key: GITLAB_TOKEN
Value: glpat-example
Type: Variable
Protect variable: recommended for protected branches
Mask variable: recommended if GitLab accepts the value as maskable
```

Warnings:

- Masked values have GitLab constraints. If GitLab rejects masking, review the token format and your instance policy.
- Protected variables are available only to protected branches and tags.
- Never commit the token.
- Do not paste token values in issues, merge requests, chat, or logs.

## Step 4 - Local Usage

Local usage can load credentials from environment variables:

```bash
export CI_PROJECT_ID=12345678
export GITLAB_TOKEN=glpat-example
export CI_API_V4_URL=https://gitlab.com/api/v4
```

PowerShell example:

```powershell
$env:CI_PROJECT_ID = "12345678"
$env:GITLAB_TOKEN = "glpat-example"
$env:CI_API_V4_URL = "https://gitlab.com/api/v4"
```

Current env-sync behavior also loads `scripts/env/.env.local` outside CI when that file exists. Treat that file as local-only:

- Keep it gitignored.
- Do not commit it.
- Do not share it in support requests.

## Step 5 - First Dry-Run

Run dry-run first:

```bash
env-sync --provider=gitlab --env=production --dry-run
```

Inspect the output before writing. Dry-run does not create or update variables, but current implementation still reads GitLab configuration and may call GitLab to fetch existing keys.

After review, run the real sync:

```bash
env-sync --provider=gitlab --env=production
```

## Current Implementation Limitations

GitLab variables are currently created and updated with:

```txt
masked: false
protected: false
```

Existing variable listing currently fetches the first page only:

```txt
per_page=100
```

That means projects with more than 100 variables may have existing variables that are not detected before create or update decisions.

Do not sync real production secrets until dry-run output is reviewed.

## Warnings

- Do not commit `.env` files.
- Do not commit GitLab tokens.
- Do not paste token values or `.env` files in issues, merge requests, chat, or logs.
- Dry-run still requires GitLab configuration and may call GitLab to fetch existing keys.
- Confirm `masked` and `protected` expectations before syncing sensitive values.

## Troubleshooting

### `CI_PROJECT_ID is required`

Set `CI_PROJECT_ID` to the target project ID:

```bash
export CI_PROJECT_ID=12345678
```

### `GITLAB_TOKEN is required`

Set `GITLAB_TOKEN` to a token that can manage project CI/CD variables:

```bash
export GITLAB_TOKEN=glpat-example
```

### Invalid Token, 401, or 403

Check that:

- The token has API access.
- The token has access to the target project.
- The token is not expired or revoked.
- Your GitLab role and organization policy allow managing CI/CD variables.

### Wrong `CI_API_V4_URL`

For GitLab.com, use:

```txt
https://gitlab.com/api/v4
```

For self-hosted GitLab, use your instance API URL, for example:

```txt
https://gitlab.example.com/api/v4
```

### Self-Hosted GitLab URL Issue

Confirm the URL includes `/api/v4` and that the machine running env-sync can reach the self-hosted instance.

### Variable Already Exists But Was Not Detected

The current implementation lists only the first page with `per_page=100`. If the project has more than 100 variables, an existing key may be outside the fetched page.

### Masking or Protected Behavior Was Unexpected

The current implementation sends `masked:false` and `protected:false`. Configure expectations before syncing sensitive values, and wait for an implementation change before relying on masked or protected variable creation through env-sync.

## References

- GitLab project-level variables API: https://docs.gitlab.com/api/project_level_variables/
- GitLab project access tokens: https://docs.gitlab.com/user/project/settings/project_access_tokens/
- GitLab personal access tokens: https://docs.gitlab.com/user/profile/personal_access_tokens/
