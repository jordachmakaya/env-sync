import type { EnvFile, SecretMap } from '../types.js';
/**
 * Builds a SecretMap from all parsed EnvFile objects.
 * Files are expected to be pre-sorted by priority (ascending),
 * so later entries naturally override earlier ones.
 */
export declare function buildSecretMap(envFiles: ReadonlyArray<EnvFile>): SecretMap;
/**
 * Resolves the effective provider for a set of env files.
 *
 * Resolution order:
 * 1. CLI --provider flag (passed as `cliProvider`)
 * 2. ENV_SYNC_PROVIDER declared inside the highest-priority .env file
 * 3. Default: 'gitlab'
 */
export declare function resolveProvider(envFiles: ReadonlyArray<EnvFile>, cliProvider: string | null): 'gitlab' | 'github';
//# sourceMappingURL=mapping.d.ts.map