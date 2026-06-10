# GitLab Provider

The GitLab provider syncs values to GitLab CI/CD variables through the GitLab REST API.

For provider-side setup, see [GitLab Setup](./gitlab-setup.md).

## Prerequisites

Set:

```bash
CI_PROJECT_ID=12345678
GITLAB_TOKEN=glpat-example
CI_API_V4_URL=https://gitlab.com/api/v4
```

`CI_PROJECT_ID` and `GITLAB_TOKEN` are required.

`CI_API_V4_URL` is optional and defaults to:

```txt
https://gitlab.com/api/v4
```

Use `CI_API_V4_URL` for self-hosted GitLab.

## Recommended first command

```bash
env-sync --provider=gitlab --env=production --dry-run
```

Dry-run does not create or update variables, but current implementation still reads GitLab configuration and fetches existing variable keys.

## Current variable behavior

Variables are currently sent as:

```txt
variable_type: env_var
masked: false
protected: false
```

Review whether this fits your project before using env-sync with sensitive values.

## Current listing limitation

Existing variable listing currently requests the first page only with:

```txt
per_page=100
```

Projects with more than 100 variables may need extra care because keys beyond the first page may not be detected before create/update decisions.
