// src/providers/github/workflows.ts
// Patches .github/workflows/*.yml files to add missing secret references.
// Uses line-by-line text manipulation to preserve comments and formatting.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SecretMap, WorkflowPatchResult } from '../../types.js';
import { logger } from '../../core/logger.js';

const WORKFLOW_EXTENSIONS = new Set(['.yml', '.yaml']);

/**
 * Returns the default workflow directory path.
 */
export function defaultWorkflowDir(root: string): string {
    return join(root, '.github', 'workflows');
}

/**
 * Discovers all workflow files in the given directory.
 */
function discoverWorkflowFiles(dir: string): ReadonlyArray<string> {
    if (!existsSync(dir)) return [];

    return readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isFile() && WORKFLOW_EXTENSIONS.has(
            e.name.slice(e.name.lastIndexOf('.'))
        ))
        .map((e) => join(dir, e.name));
}

/**
 * Builds the set of keys already referenced in a workflow file's content.
 * Looks for patterns like: KEY: ${{ secrets.KEY }}
 */
function extractExistingKeys(content: string): ReadonlySet<string> {
    const pattern = /\$\{\{\s*secrets\.([A-Z_][A-Z0-9_]*)\s*\}\}/g;
    const keys = new Set<string>();
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(content)) !== null) {
        if (match[1]) keys.add(match[1]);
    }

    return keys;
}

/**
 * Finds the indentation level of `env:` blocks inside job definitions.
 * Returns a suggested indent string for new env entries.
 */
function detectEnvIndent(lines: ReadonlyArray<string>): string {
    for (const line of lines) {
        const match = /^(\s+)env:\s*$/.exec(line);
        if (match?.[1]) {
            return match[1] + '  ';
        }
    }
    return '      ';
}

/**
 * Patches a single workflow file content.
 * Inserts missing `KEY: ${{ secrets.KEY }}` entries after each `env:` block.
 *
 * Returns the patched content and a list of added keys.
 */
function patchWorkflowContent(
    content:     string,
    secretKeys:  ReadonlySet<string>,
    existingKeys: ReadonlySet<string>,
): { patched: string; added: ReadonlyArray<string> } {
    const missingKeys = [...secretKeys].filter((k) => !existingKeys.has(k));
    if (missingKeys.length === 0) return { patched: content, added: [] };

    const lines   = content.split('\n');
    const indent  = detectEnvIndent(lines);
    const result: string[] = [];
    const added:  string[] = [];
    let   inEnvBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line === undefined) continue;

        result.push(line);

        // Detect `env:` key at job level (indented)
        if (/^\s+env:\s*$/.test(line)) {
            inEnvBlock = true;
            continue;
        }

        // Insert missing secrets after the env: block's existing entries
        if (inEnvBlock) {
            const nextLine = lines[i + 1] ?? '';
            const isLastEnvLine =
                nextLine.trim() === '' ||
                (/^\s/.test(nextLine) && !/^\s{6,}/.test(nextLine) && !nextLine.startsWith(indent));

            if (isLastEnvLine) {
                for (const key of missingKeys) {
                    result.push(`${indent}${key}: \${{ secrets.${key} }}`);
                    added.push(key);
                }
                inEnvBlock = false;
            }
        }
    }

    return { patched: result.join('\n'), added };
}

/**
 * Patches all workflow files in the given directory.
 */
export function patchWorkflows(
    workflowDir: string,
    secrets:     SecretMap,
    dryRun:      boolean,
): ReadonlyArray<WorkflowPatchResult> {
    const files     = discoverWorkflowFiles(workflowDir);
    const secretKeys = new Set(secrets.keys());
    const results:  WorkflowPatchResult[] = [];

    for (const filePath of files) {
        const fileName = filePath.slice(filePath.lastIndexOf('/') + 1);
        let content: string;

        try {
            content = readFileSync(filePath, 'utf-8');
        } catch {
            logger.error(`Cannot read workflow file: ${filePath}`);
            results.push({ file: fileName, modified: false, added: [] });
            continue;
        }

        const existingKeys = extractExistingKeys(content);
        const { patched, added } = patchWorkflowContent(content, secretKeys, existingKeys);

        if (added.length === 0) {
            results.push({ file: fileName, modified: false, added: [] });
            continue;
        }

        if (!dryRun) {
            try {
                writeFileSync(filePath, patched, 'utf-8');
                logger.success(`Patched ${fileName}: +${added.length} vars`);
            } catch {
                logger.error(`Cannot write workflow file: ${filePath}`);
                results.push({ file: fileName, modified: false, added: [] });
                continue;
            }
        } else {
            logger.dryRun(`Would patch ${fileName}: +${added.join(', ')}`);
        }

        results.push({ file: fileName, modified: true, added });
    }

    return results;
}