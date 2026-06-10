# Dependency No-Trust Policy

`@hardmachinelabs/env-sync` reads `.env` files and syncs CI/CD secrets. Dependencies must stay minimal, pinned, reviewed, and justified.

## Rules

- Runtime dependencies require owner approval before adding, removing, or upgrading.
- No new runtime dependency may be added without explicit owner approval.
- Dev, tooling, GitHub Action, and Dependabot ecosystem changes require owner approval before adding, removing, or upgrading.
- Every dependency upgrade must include review of the `package.json` diff, `pnpm-lock.yaml` diff, CI result, and package dry-run result when the change is release-related.
- Use exact versions in `package.json`; do not use semver ranges.
- Keep `pnpm-lock.yaml` committed and use `pnpm install --frozen-lockfile` in CI.
- Do not add dependencies for convenience when platform APIs or small local code are enough.
- Do not add or inspect secrets in `.npmrc`, `.env`, issue reports, logs, or tests.

## Package Manager Policy

Recommended pnpm/npm policy for owner approval before committing a non-sensitive `.npmrc`:

```ini
save-exact=true
auto-install-peers=false
strict-peer-dependencies=true
```

No `.npmrc` was inspected for this policy because `.npmrc` may contain sensitive registry or token configuration.

## CI Policy

Current CI uses:

```bash
pnpm install --frozen-lockfile
```

Recommended but not enabled as a blocking check without owner approval:

```bash
pnpm audit --audit-level moderate
```

Reason: audit checks can be useful for this security-adjacent package, but making them blocking can create release noise or fail builds due to transitive advisories that need triage.

## External Security Tooling

Snyk is allowed as external dependency vulnerability monitoring tooling through `pnpm dlx`; it is not added to `package.json` and is not a runtime, dev, or tooling dependency of the package.

Local test command:

```bash
pnpm dlx snyk@latest test --all-projects
```

Monitor command:

```bash
pnpm dlx snyk@latest monitor --all-projects
```

`monitor` sends a project snapshot to Snyk for continuous monitoring and must not run automatically on pull requests. Run it only with explicit owner approval.

GitHub Actions Snyk scans require `SNYK_TOKEN` and must not require `NPM_TOKEN`, publish npm, push tags, or create releases.

Snyk results are dependency vulnerability signals only. They do not prove the package code is secure and do not replace code review, threat modeling, secret-handling review, or package dry-run review.

Do not add a Snyk badge until the repository is public, the project is imported or monitored in Snyk, and the badge URL is verified.

## Dependency Catalog

| Package | Type | Exact version currently allowed | Purpose | Risk level | Reason allowed | Runs in production/runtime | Owner approval required before add/remove/upgrade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `dotenv` | runtime | `16.6.1` | Parse `.env` files used as sync input. | High | Core package behavior depends on dotenv-compatible parsing; single runtime dependency. | Yes | Yes |
| `typescript` | dev | `5.9.3` | Compile TypeScript source and emit declarations/build output. | Medium | Required for build/typecheck of the package. | No | Yes |
| `vitest` | dev | `2.1.9` | Run unit tests for security-sensitive CLI/provider behavior. | Medium | Required to verify non-breaking behavior and command execution safety. | No | Yes |
| `@types/node` | dev | `22.19.19` | Type definitions for Node.js APIs used by the package. | Low | Required for TypeScript typechecking against Node APIs. | No | Yes |
| `@changesets/cli` | tooling | `2.31.0` | Manage versioning and changelog workflow for releases. | Medium | Provides controlled release/version workflow; configured with public npm access. | No | Yes |
| `vitepress` | tooling | `1.6.4` | Build and preview the future documentation site. | Medium | Documentation tooling only; approved by owner before Sprint 3A and pinned exactly. | No | Yes |
| `actions/checkout` | GitHub Action | `v4` | Check out repository contents in CI and release workflows. | Medium | Required for GitHub Actions to access source code. | CI only | Yes |
| `pnpm/action-setup` | GitHub Action | `v4` | Install/configure pnpm in CI and release workflows. | Medium | Ensures CI uses the expected package manager. | CI only | Yes |
| `actions/setup-node` | GitHub Action | `v4` | Install/configure Node.js and pnpm cache in CI and release workflows. | Medium | Ensures CI/release uses Node 20 and npm registry configuration. | CI only | Yes |
| `actions/configure-pages` | GitHub Action | `v5` | Configure GitHub Pages for docs deployment. | Medium | Required only for the Pages docs workflow. | CI only | Yes |
| `actions/upload-pages-artifact` | GitHub Action | `v3` | Upload VitePress build output as a Pages artifact. | Medium | Required only for the Pages docs workflow. | CI only | Yes |
| `actions/deploy-pages` | GitHub Action | `v4` | Deploy the uploaded docs artifact to GitHub Pages. | Medium | Required only for the Pages docs workflow. | CI only | Yes |
| `snyk` via `pnpm dlx` | external security tooling | `latest` at execution time | Run dependency vulnerability scans without adding a permanent package dependency. | Medium | Approved as external monitoring only; not installed into package manifests. | No | Yes |
| `npm` Dependabot ecosystem | tooling | Weekly schedule | Open dependency update PRs for package dependencies. | Medium | Keeps dependency changes explicit and reviewable. | No | Yes |
| `github-actions` Dependabot ecosystem | tooling | Weekly schedule | Open dependency update PRs for GitHub Actions. | Medium | Keeps workflow action updates explicit and reviewable. | No | Yes |

## Version Choice Notes

Declared semver ranges were replaced with exact versions already resolved in `pnpm-lock.yaml` to avoid dependency drift without downgrading packages:

- `@changesets/cli`: `^2.31.0` -> `2.31.0`
- `dotenv`: `^16.4.5` -> `16.6.1`
- `@types/node`: `^22.0.0` -> `22.19.19`
- `typescript`: `^5.5.0` -> `5.9.3`
- `vitest`: `^2.0.0` -> `2.1.9`
- `vitepress`: installed by owner as exact `1.6.4`
