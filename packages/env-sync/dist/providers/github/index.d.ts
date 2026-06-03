import type { ProviderOptions, SecretMap, SecretProvider, SyncResult } from '../../types.js';
export declare class GitHubProvider implements SecretProvider {
    private readonly workflowDir;
    constructor(root: string, workflowDir?: string);
    push(secrets: SecretMap, options: ProviderOptions): Promise<SyncResult>;
}
//# sourceMappingURL=index.d.ts.map