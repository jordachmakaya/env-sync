// src/providers/github/secrets.ts
// Pushes secrets to GitHub Actions via the gh CLI.
// Requires: gh auth login with repo + secrets write scope.

import { execFileSync } from 'node:child_process';
import type { SecretMap } from '../../types.js';
import { logger } from '../../core/logger.js';

interface GhSecret {
    name: string;
}

const GITHUB_SECRET_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function validateGitHubSecretName(key: string): void {
    if (!GITHUB_SECRET_NAME_PATTERN.test(key) || key.toUpperCase().startsWith('GITHUB_')) {
        throw new Error(`Invalid GitHub secret name: ${key}`);
    }
}

/**
 * Verifies that the gh CLI is available and authenticated.
 * Throws with a clear message if not.
 */
export function assertGhCli(): void {
    try {
        execFileSync('gh', ['auth', 'status'], { stdio: 'pipe' });
    } catch {
        throw new Error(
            'GitHub CLI (gh) is not installed or not authenticated.\n' +
            'Run: gh auth login'
        );
    }
}

/**
 * Fetches existing secret names from the repository via gh CLI.
 */
function fetchExistingSecrets(): ReadonlySet<string> {
    const output = execFileSync('gh', ['secret', 'list', '--json', 'name'], { encoding: 'utf-8' });
    const parsed = JSON.parse(output) as ReadonlyArray<GhSecret>;
    return new Set(parsed.map((s) => s.name));
}

/**
 * Pushes a single secret via gh CLI.
 */
function setSecret(key: string, value: string): void {
    validateGitHubSecretName(key);

    // Use stdin to avoid the value appearing in process list
    execFileSync('gh', ['secret', 'set', key], {
        input: value,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
    });
}

/**
 * Syncs secrets to GitHub Actions.
 * Returns lists of created, updated, and errored keys.
 */
export async function syncGitHubSecrets(
    secrets: SecretMap,
    dryRun:  boolean,
): Promise<{ created: string[]; updated: string[]; errors: Array<{ key: string; message: string }> }> {
    for (const key of secrets.keys()) {
        validateGitHubSecretName(key);
    }

    assertGhCli();

    const existingKeys = fetchExistingSecrets();

    const created: string[] = [];
    const updated: string[] = [];
    const errors:  Array<{ key: string; message: string }> = [];

    for (const [key, secret] of secrets) {
        const isUpdate = existingKeys.has(key);
        const action   = isUpdate ? 'update' : 'create';

        if (dryRun) {
            logger.dryRun(`Would ${action} secret: ${key}`);
            if (isUpdate) updated.push(key);
            else created.push(key);
            continue;
        }

        try {
            setSecret(key, secret.value);
            logger.success(`${isUpdate ? 'Updated' : 'Created'} secret: ${key}`);
            if (isUpdate) updated.push(key);
            else created.push(key);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Failed secret: ${key} — ${message}`);
            errors.push({ key, message });
        }
    }

    return { created, updated, errors };
}
