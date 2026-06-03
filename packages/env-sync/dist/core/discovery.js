// src/core/discovery.ts
// Discovers .env files across a monorepo tree.
// Skips node_modules, .git, .idea, and dist directories.
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
const IGNORED_DIRS = new Set(['node_modules', '.git', '.idea', 'dist', '.turbo', '.cache']);
/**
 * Returns the names of .env files to look for given an environment.
 * Always includes the base `.env`, plus `.env.<environment>` if provided.
 */
function targetFileNames(environment) {
    const names = new Set(['.env']);
    if (environment && environment !== 'base') {
        names.add(`.env.${environment}`);
    }
    return names;
}
/**
 * Recursively walks a directory tree and collects all matching .env file paths.
 */
function walk(dir, targets, results) {
    let entries;
    try {
        entries = readdirSync(dir, { withFileTypes: true, encoding: 'utf-8' });
    }
    catch {
        return;
    }
    for (const entry of entries) {
        const name = entry.name.toString();
        if (IGNORED_DIRS.has(name))
            continue;
        const fullPath = join(dir, name);
        if (entry.isDirectory()) {
            walk(fullPath, targets, results);
        }
        else if (entry.isFile() && targets.has(name)) {
            results.push(fullPath);
        }
    }
}
/**
 * Extracts the package name from a file path relative to the monorepo root.
 *
 * Examples:
 *   packages/blog/.env         → "blog"
 *   packages/ui/.env.production → "ui"
 *   .env                       → "root"
 */
export function extractPackageName(filePath, root) {
    const rel = relative(root, filePath);
    const parts = rel.split(/[\\/]/);
    const packagesIdx = parts.indexOf('packages');
    if (packagesIdx !== -1) {
        const name = parts[packagesIdx + 1];
        if (name !== undefined)
            return name;
    }
    const appsIdx = parts.indexOf('apps');
    if (appsIdx !== -1) {
        const name = parts[appsIdx + 1];
        if (name !== undefined)
            return name;
    }
    return 'root';
}
/**
 * Computes priority score for env file ordering.
 * Higher score = takes precedence when keys conflict.
 *
 * Priority rules:
 * - .env.<environment> files score higher than plain .env
 * - files inside packages/ score higher than root files
 */
export function computePriority(filePath, environment) {
    let score = 0;
    if (environment && filePath.endsWith(`.env.${environment}`))
        score += 100;
    if (filePath.includes(`packages${require('node:path').sep}`) ||
        filePath.includes('packages/') ||
        filePath.includes('packages\\'))
        score += 10;
    return score;
}
/**
 * Discovers all .env files in the monorepo for the given environment.
 * Returns absolute paths, sorted by priority ascending
 * (lower priority processed first so higher priority can override).
 */
export function discoverEnvFiles(root, environment) {
    const targets = targetFileNames(environment);
    const results = [];
    walk(root, targets, results);
    return results.sort((a, b) => computePriority(a, environment) - computePriority(b, environment));
}
/**
 * Checks whether a path points to an existing file (not a directory).
 */
export function isFile(path) {
    try {
        return statSync(path).isFile();
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=discovery.js.map