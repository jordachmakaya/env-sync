// src/core/parser.ts
// Parses .env files into typed EnvFile objects.
// Detects optional ENV_SYNC_PROVIDER override declared inside the file.
import { readFileSync } from 'node:fs';
import { computePriority, extractPackageName } from './discovery.js';
import { ENV_SYNC_PROVIDER_KEY } from '../types.js';
const VALID_PROVIDERS = new Set(['gitlab', 'github']);
/**
 * Minimal dotenv parser — handles:
 * - KEY=value
 * - KEY="value with spaces"
 * - KEY='value'
 * - # comments
 * - empty lines
 *
 * Does not evaluate shell expressions or multi-line values.
 */
function parseDotenv(content) {
    const result = {};
    for (const rawLine of content.split('\n')) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#'))
            continue;
        const eqIdx = line.indexOf('=');
        if (eqIdx === -1)
            continue;
        const key = line.slice(0, eqIdx).trim();
        let value = line.slice(eqIdx + 1).trim();
        // Strip surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        // Strip inline comment (only outside quotes)
        const commentIdx = value.indexOf(' #');
        if (commentIdx !== -1) {
            value = value.slice(0, commentIdx).trim();
        }
        if (key) {
            result[key] = value;
        }
    }
    return result;
}
/**
 * Extracts the provider override from parsed values, if present and valid.
 * Declared as: ENV_SYNC_PROVIDER=gitlab
 */
function extractProviderOverride(values) {
    const raw = values[ENV_SYNC_PROVIDER_KEY];
    if (!raw)
        return null;
    const candidate = raw.toLowerCase();
    return VALID_PROVIDERS.has(candidate) ? candidate : null;
}
/**
 * Parses a single .env file into an EnvFile object.
 * Returns null if the file cannot be read.
 */
export function parseEnvFile(filePath, root, environment) {
    let content;
    try {
        content = readFileSync(filePath, 'utf-8');
    }
    catch {
        return null;
    }
    const rawValues = parseDotenv(content);
    // Remove the provider key from the secret values —
    // it's metadata, not a secret to push.
    const { [ENV_SYNC_PROVIDER_KEY]: _provider, ...values } = rawValues;
    return {
        path: filePath,
        packageName: extractPackageName(filePath, root),
        values,
        priority: computePriority(filePath, environment),
        provider: extractProviderOverride(rawValues),
    };
}
/**
 * Parses all discovered .env files.
 * Silently skips files that cannot be read.
 */
export function parseEnvFiles(filePaths, root, environment) {
    return filePaths.flatMap((path) => {
        const parsed = parseEnvFile(path, root, environment);
        return parsed ? [parsed] : [];
    });
}
//# sourceMappingURL=parser.js.map