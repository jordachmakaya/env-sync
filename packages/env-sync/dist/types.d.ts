export type Provider = 'gitlab' | 'github';
export type Environment = string;
/**
 * Provider override declared inside a .env file.
 * Key: ENV_SYNC_PROVIDER=gitlab
 */
export declare const ENV_SYNC_PROVIDER_KEY: "ENV_SYNC_PROVIDER";
export interface EnvFile {
    readonly path: string;
    readonly packageName: string;
    readonly values: Readonly<Record<string, string>>;
    readonly priority: number;
    /** Optional provider override declared inside the file itself */
    readonly provider: Provider | null;
}
export interface Secret {
    readonly key: string;
    readonly value: string;
    readonly source: string;
}
export type SecretMap = ReadonlyMap<string, Secret>;
export interface CliOptions {
    readonly provider: Provider;
    readonly environment: Environment;
    readonly dryRun: boolean;
    readonly workflowsOnly: boolean;
    readonly syncOnly: boolean;
    readonly envFile: string | null;
    readonly root: string;
}
export interface SyncResult {
    readonly created: ReadonlyArray<string>;
    readonly updated: ReadonlyArray<string>;
    readonly skipped: ReadonlyArray<string>;
    readonly errors: ReadonlyArray<{
        key: string;
        message: string;
    }>;
}
export interface SecretProvider {
    push(secrets: SecretMap, options: ProviderOptions): Promise<SyncResult>;
}
export interface ProviderOptions {
    readonly dryRun: boolean;
    readonly workflowsOnly: boolean;
    readonly syncOnly: boolean;
}
export interface GitLabVariable {
    readonly key: string;
    readonly value: string;
    readonly variable_type: 'env_var' | 'file';
    readonly protected: boolean;
    readonly masked: boolean;
}
export interface GitLabConfig {
    readonly projectId: string;
    readonly token: string;
    readonly apiUrl: string;
}
export interface GitHubConfig {
    readonly token: string;
    readonly owner: string;
    readonly repo: string;
    readonly workflowDir: string;
}
export interface WorkflowJob {
    env?: Record<string, string>;
    [key: string]: unknown;
}
export interface WorkflowFile {
    jobs?: Record<string, WorkflowJob>;
    [key: string]: unknown;
}
export interface WorkflowPatchResult {
    readonly file: string;
    readonly modified: boolean;
    readonly added: ReadonlyArray<string>;
}
//# sourceMappingURL=types.d.ts.map