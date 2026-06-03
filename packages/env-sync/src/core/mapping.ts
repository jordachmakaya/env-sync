// src/core/mapping.ts
// Maps parsed env files into a namespaced SecretMap.
//
// Namespacing rules:
//   root package  → KEY stays as-is
//   other package → PACKAGE_KEY  (e.g. blog → BLOG_DATABASE_URL)
//
// When the same namespaced key appears in multiple files,
// the file with the higher priority wins.

import type { EnvFile, Secret, SecretMap } from '../types.js';

/**
 * Computes the namespaced key for a secret.
 */
function namespaceKey(packageName: string, key: string): string {
    if (packageName === 'root') return key;
    return `${packageName.toUpperCase()}_${key}`;
}

/**
 * Builds a SecretMap from all parsed EnvFile objects.
 * Files are expected to be pre-sorted by priority (ascending),
 * so later entries naturally override earlier ones.
 */
export function buildSecretMap(envFiles: ReadonlyArray<EnvFile>): SecretMap {
    const map = new Map<string, Secret>();

    for (const file of envFiles) {
        for (const [rawKey, value] of Object.entries(file.values)) {
            const key: string = namespaceKey(file.packageName, rawKey);

            map.set(key, {
                key,
                value,
                source: file.path,
            });
        }
    }

    return map;
}

/**
 * Resolves the effective provider for a set of env files.
 *
 * Resolution order:
 * 1. CLI --provider flag (passed as `cliProvider`)
 * 2. ENV_SYNC_PROVIDER declared inside the highest-priority .env file
 * 3. Default: 'gitlab'
 */
export function resolveProvider(
    envFiles:    ReadonlyArray<EnvFile>,
    cliProvider: string | null,
): 'gitlab' | 'github' {
    if (cliProvider === 'gitlab' || cliProvider === 'github') return cliProvider;

    // Pick provider from the highest-priority file that declares one
    const fileProvider = [...envFiles]
        .sort((a, b) => b.priority - a.priority)
        .find((f) => f.provider !== null)
        ?.provider ?? null;

    return fileProvider ?? 'gitlab';
}