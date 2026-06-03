// src/providers/gitlab.ts
// Pushes secrets to GitLab CI/CD Variables via the REST API.
// Creates missing variables, updates existing ones.
import { logger } from '../core/logger.js';
const VARIABLES_PER_PAGE = 100;
/**
 * Reads GitLab configuration from environment variables.
 * Throws if required variables are missing.
 */
export function readGitLabConfig() {
    const projectId = process.env['CI_PROJECT_ID'];
    const token = process.env['GITLAB_TOKEN'];
    const apiUrl = process.env['CI_API_V4_URL'] ?? 'https://gitlab.com/api/v4';
    if (!projectId)
        throw new Error('CI_PROJECT_ID is required for GitLab provider');
    if (!token)
        throw new Error('GITLAB_TOKEN is required for GitLab provider');
    return { projectId, token, apiUrl };
}
/**
 * Fetches the current list of CI/CD variable keys from GitLab.
 */
async function fetchExistingKeys(config) {
    const url = `${config.apiUrl}/projects/${encodeURIComponent(config.projectId)}/variables?per_page=${VARIABLES_PER_PAGE}`;
    const response = await fetch(url, {
        headers: { 'PRIVATE-TOKEN': config.token },
    });
    if (!response.ok) {
        throw new Error(`GitLab API error ${response.status}: ${response.statusText}`);
    }
    const variables = (await response.json());
    return new Set(variables.map((v) => v.key));
}
/**
 * Creates or updates a single GitLab CI/CD variable.
 */
async function upsertVariable(config, key, value, isUpdate) {
    const baseUrl = `${config.apiUrl}/projects/${encodeURIComponent(config.projectId)}/variables`;
    const url = isUpdate ? `${baseUrl}/${encodeURIComponent(key)}` : baseUrl;
    const body = {
        key,
        value,
        variable_type: 'env_var',
        protected: false,
        masked: false,
    };
    const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
            'PRIVATE-TOKEN': config.token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} variable "${key}": ${text}`);
    }
}
/**
 * GitLab CI/CD Variables provider.
 */
export class GitLabProvider {
    config;
    constructor(config) {
        this.config = config ?? readGitLabConfig();
    }
    async push(secrets, options) {
        const { dryRun } = options;
        logger.info(`Syncing with GitLab (project: ${this.config.projectId})...`);
        const existingKeys = await fetchExistingKeys(this.config);
        const created = [];
        const updated = [];
        const errors = [];
        for (const [key, secret] of secrets) {
            const isUpdate = existingKeys.has(key);
            const action = isUpdate ? 'update' : 'create';
            if (dryRun) {
                logger.dryRun(`Would ${action}: ${key}`);
                if (isUpdate)
                    updated.push(key);
                else
                    created.push(key);
                continue;
            }
            try {
                await upsertVariable(this.config, key, secret.value, isUpdate);
                logger.success(`${isUpdate ? 'Updated' : 'Created'}: ${key}`);
                if (isUpdate)
                    updated.push(key);
                else
                    created.push(key);
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                logger.error(`Failed: ${key} — ${message}`);
                errors.push({ key, message });
            }
        }
        return { created, updated, skipped: [], errors };
    }
}
//# sourceMappingURL=gitlab.js.map