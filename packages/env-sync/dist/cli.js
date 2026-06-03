#!/usr/bin/env node
// src/cli.ts
// CLI entrypoint for @hardmachinelab/env-sync
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { discoverEnvFiles } from './core/discovery.js';
import { parseEnvFiles } from './core/parser.js';
import { buildSecretMap, resolveProvider } from './core/mapping.js';
import { GitLabProvider } from './providers/gitlab.js';
import { GitHubProvider } from './providers/github/index.js';
import { logger } from './core/logger.js';
// ─── ARG PARSING ─────────────────────────────────────────────
function getFlag(name) {
    const arg = process.argv.find((a) => a.startsWith(`${name}=`));
    return arg?.split('=').slice(1).join('=') ?? null;
}
function hasFlag(name) {
    return process.argv.includes(name);
}
function parseCliOptions() {
    const root = resolve('.');
    return {
        provider: (getFlag('--provider') ?? null),
        environment: getFlag('--env') ?? 'development',
        dryRun: hasFlag('--dry-run'),
        workflowsOnly: hasFlag('--workflows-only'),
        syncOnly: hasFlag('--sync-only'),
        envFile: getFlag('--env-file'),
        root,
    };
}
// ─── LOCAL CREDENTIALS ───────────────────────────────────────
async function loadLocalCredentials(root) {
    const localEnvPath = resolve(root, 'scripts/env/.env.local');
    if (!process.env['CI'] && existsSync(localEnvPath)) {
        const dotenv = await import('dotenv');
        dotenv.config({ path: localEnvPath });
        logger.info('Local credentials loaded from scripts/env/.env.local');
    }
}
// ─── MAIN ─────────────────────────────────────────────────────
async function main() {
    const options = parseCliOptions();
    logger.separator();
    logger.info(`env-sync  |  env: ${options.environment}  |  dry-run: ${options.dryRun}`);
    logger.separator();
    // Load local credentials (non-CI environments)
    await loadLocalCredentials(options.root);
    // ── Discovery ──────────────────────────────────────────────
    const filePaths = options.envFile
        ? [resolve(options.envFile)]
        : discoverEnvFiles(options.root, options.environment);
    if (filePaths.length === 0) {
        logger.warn(`No .env files found for environment: ${options.environment}`);
        process.exit(0);
    }
    logger.info(`Found ${filePaths.length} .env file(s)`);
    // ── Parsing ────────────────────────────────────────────────
    const envFiles = parseEnvFiles(filePaths, options.root, options.environment);
    if (envFiles.length === 0) {
        logger.warn('No env files could be parsed');
        process.exit(0);
    }
    // ── Secret mapping ─────────────────────────────────────────
    const secrets = buildSecretMap(envFiles);
    if (secrets.size === 0) {
        logger.warn('No secrets to sync');
        process.exit(0);
    }
    logger.info(`Mapped ${secrets.size} secret(s)`);
    // ── Provider resolution ────────────────────────────────────
    const provider = resolveProvider(envFiles, options.provider ?? null);
    logger.info(`Provider: ${provider}`);
    if (options.dryRun) {
        logger.info('DRY RUN mode — no changes will be made');
    }
    // ── Push ───────────────────────────────────────────────────
    const providerOptions = {
        dryRun: options.dryRun,
        workflowsOnly: options.workflowsOnly,
        syncOnly: options.syncOnly,
    };
    let result;
    if (provider === 'gitlab') {
        const gitlab = new GitLabProvider();
        result = await gitlab.push(secrets, providerOptions);
    }
    else {
        const github = new GitHubProvider(options.root);
        result = await github.push(secrets, providerOptions);
    }
    // ── Summary ────────────────────────────────────────────────
    logger.separator();
    logger.summary(result);
    if (result.errors.length > 0) {
        logger.separator();
        for (const err of result.errors) {
            logger.error(`${err.key}: ${err.message}`);
        }
        process.exit(1);
    }
    logger.success('Sync complete.');
}
main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Fatal: ${message}`);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map