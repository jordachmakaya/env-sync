export { discoverEnvFiles, extractPackageName } from './core/discovery.js';
export { parseEnvFile, parseEnvFiles } from './core/parser.js';
export { buildSecretMap, resolveProvider } from './core/mapping.js';
export { GitLabProvider, readGitLabConfig } from './providers/gitlab.js';
export { GitHubProvider } from './providers/github/index.js';
export { patchWorkflows } from './providers/github/workflows.js';
export type { Provider, EnvFile, Secret, SecretMap, SyncResult, SecretProvider, ProviderOptions, CliOptions, GitLabConfig, GitLabVariable, GitHubConfig, WorkflowPatchResult, } from './types.js';
//# sourceMappingURL=index.d.ts.map