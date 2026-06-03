// src/providers/github/index.ts
// GitHub provider — combines workflow patching and secrets sync.
import { defaultWorkflowDir, patchWorkflows } from './workflows.js';
import { logger } from '../../core/logger.js';
import { syncGitHubSecrets } from "./secret.js";
export class GitHubProvider {
    workflowDir;
    constructor(root, workflowDir) {
        this.workflowDir = workflowDir ?? defaultWorkflowDir(root);
    }
    async push(secrets, options) {
        const { dryRun, workflowsOnly, syncOnly } = options;
        const created = [];
        const updated = [];
        const skipped = [];
        const errors = [];
        // ── Step 1: Patch workflow YAML files ──────────────────────
        if (!syncOnly) {
            logger.info('Patching GitHub Actions workflow files...');
            const patchResults = patchWorkflows(this.workflowDir, secrets, dryRun);
            const patchedCount = patchResults.filter((r) => r.modified).length;
            logger.info(`Workflows patched: ${patchedCount}/${patchResults.length}`);
        }
        // ── Step 2: Sync secrets via gh CLI ────────────────────────
        if (!workflowsOnly) {
            logger.info('Syncing GitHub Actions secrets...');
            const result = await syncGitHubSecrets(secrets, dryRun);
            created.push(...result.created);
            updated.push(...result.updated);
            errors.push(...result.errors);
        }
        return { created, updated, skipped, errors };
    }
}
//# sourceMappingURL=index.js.map