// src/providers/github/secrets.ts
// Pushes secrets to GitHub Actions via the gh CLI.
// Requires: gh auth login with repo + secrets write scope.
import { execSync } from 'node:child_process';
import { logger } from '../../core/logger.js';
/**
 * Verifies that the gh CLI is available and authenticated.
 * Throws with a clear message if not.
 */
export function assertGhCli() {
    try {
        execSync('gh auth status', { stdio: 'pipe' });
    }
    catch {
        throw new Error('GitHub CLI (gh) is not installed or not authenticated.\n' +
            'Run: gh auth login');
    }
}
/**
 * Fetches existing secret names from the repository via gh CLI.
 */
function fetchExistingSecrets() {
    const output = execSync('gh secret list --json name', { encoding: 'utf-8' });
    const parsed = JSON.parse(output);
    return new Set(parsed.map((s) => s.name));
}
/**
 * Pushes a single secret via gh CLI.
 */
function setSecret(key, value) {
    // Use stdin to avoid the value appearing in process list
    execSync(`gh secret set ${key}`, {
        input: value,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
    });
}
/**
 * Syncs secrets to GitHub Actions.
 * Returns lists of created, updated, and errored keys.
 */
export async function syncGitHubSecrets(secrets, dryRun) {
    assertGhCli();
    const existingKeys = fetchExistingSecrets();
    const created = [];
    const updated = [];
    const errors = [];
    for (const [key, secret] of secrets) {
        const isUpdate = existingKeys.has(key);
        const action = isUpdate ? 'update' : 'create';
        if (dryRun) {
            logger.dryRun(`Would ${action} secret: ${key}`);
            if (isUpdate)
                updated.push(key);
            else
                created.push(key);
            continue;
        }
        try {
            setSecret(key, secret.value);
            logger.success(`${isUpdate ? 'Updated' : 'Created'} secret: ${key}`);
            if (isUpdate)
                updated.push(key);
            else
                created.push(key);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Failed secret: ${key} — ${message}`);
            errors.push({ key, message });
        }
    }
    return { created, updated, errors };
}
//# sourceMappingURL=secret.js.map