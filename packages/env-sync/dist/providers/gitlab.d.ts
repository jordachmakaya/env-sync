import type { GitLabConfig, ProviderOptions, SecretMap, SecretProvider, SyncResult } from '../types.js';
/**
 * Reads GitLab configuration from environment variables.
 * Throws if required variables are missing.
 */
export declare function readGitLabConfig(): GitLabConfig;
/**
 * GitLab CI/CD Variables provider.
 */
export declare class GitLabProvider implements SecretProvider {
    private readonly config;
    constructor(config?: GitLabConfig);
    push(secrets: SecretMap, options: ProviderOptions): Promise<SyncResult>;
}
//# sourceMappingURL=gitlab.d.ts.map