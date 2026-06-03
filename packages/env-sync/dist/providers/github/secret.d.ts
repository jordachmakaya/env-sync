import type { SecretMap } from '../../types.js';
/**
 * Verifies that the gh CLI is available and authenticated.
 * Throws with a clear message if not.
 */
export declare function assertGhCli(): void;
/**
 * Syncs secrets to GitHub Actions.
 * Returns lists of created, updated, and errored keys.
 */
export declare function syncGitHubSecrets(secrets: SecretMap, dryRun: boolean): Promise<{
    created: string[];
    updated: string[];
    errors: Array<{
        key: string;
        message: string;
    }>;
}>;
//# sourceMappingURL=secret.d.ts.map