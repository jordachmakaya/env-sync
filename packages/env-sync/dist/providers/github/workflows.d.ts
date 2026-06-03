import type { SecretMap, WorkflowPatchResult } from '../../types.js';
/**
 * Returns the default workflow directory path.
 */
export declare function defaultWorkflowDir(root: string): string;
/**
 * Patches all workflow files in the given directory.
 */
export declare function patchWorkflows(workflowDir: string, secrets: SecretMap, dryRun: boolean): ReadonlyArray<WorkflowPatchResult>;
//# sourceMappingURL=workflows.d.ts.map