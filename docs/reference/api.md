# API Reference

env-sync exposes a small programmatic API from the package root.

```typescript
import {
  buildSecretMap,
  discoverEnvFiles,
  GitHubProvider,
  GitLabProvider,
  parseEnvFiles,
} from '@hardmachinelabs/env-sync';
```

## Discovery

```typescript
const files = discoverEnvFiles(process.cwd(), 'production');
```

Discovers `.env` and `.env.production` for the selected environment.

## Parsing

```typescript
const parsed = parseEnvFiles(files, process.cwd(), 'production');
```

Parses env files and extracts `ENV_SYNC_PROVIDER` metadata when present.

## Mapping

```typescript
const secrets = buildSecretMap(parsed);
```

Builds generated secret names and values.

## Providers

```typescript
const provider = new GitLabProvider();
const result = await provider.push(secrets, {
  dryRun: true,
  workflowsOnly: false,
  syncOnly: false,
});
```

GitHub:

```typescript
const provider = new GitHubProvider(process.cwd());
```

## Result shape

Provider calls return:

```typescript
{
  created: string[];
  updated: string[];
  skipped: string[];
  errors: Array<{ key: string; message: string }>;
}
```

## Safety note

The API can expose source file paths and secret keys in memory and logs. Avoid printing real secret values.
