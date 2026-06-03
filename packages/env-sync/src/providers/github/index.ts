// src/providers/github/index.ts
// GitHub provider — combines workflow patching and secrets sync.

import type {
    ProviderOptions,
    SecretMap,
    SecretProvider,
    SyncResult,
} from '../../types.js';

import { defaultWorkflowDir, patchWorkflows } from './workflows.js';
import { logger } from '../../core/logger.js';
import {syncGitHubSecrets} from "./secret.js";

export class GitHubProvider implements SecretProvider {
    private readonly workflowDir: string;


    constructor(root: string, workflowDir?: string) {
       this.workflowDir = workflowDir ?? defaultWorkflowDir(root);
    }

    async push(secrets: SecretMap, options: ProviderOptions): Promise<SyncResult> {
        const { dryRun, workflowsOnly, syncOnly } = options;
        const created: string[] = [];
        const updated: string[] = [];
        const skipped: string[] = [];
        const errors:  Array<{ key: string; message: string }> = [];

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