/**
 * Extracts the package name from a file path relative to the monorepo root.
 *
 * Examples:
 *   packages/blog/.env         → "blog"
 *   packages/ui/.env.production → "ui"
 *   .env                       → "root"
 */
export declare function extractPackageName(filePath: string, root: string): string;
/**
 * Computes priority score for env file ordering.
 * Higher score = takes precedence when keys conflict.
 *
 * Priority rules:
 * - .env.<environment> files score higher than plain .env
 * - files inside packages/ score higher than root files
 */
export declare function computePriority(filePath: string, environment: string): number;
/**
 * Discovers all .env files in the monorepo for the given environment.
 * Returns absolute paths, sorted by priority ascending
 * (lower priority processed first so higher priority can override).
 */
export declare function discoverEnvFiles(root: string, environment: string): ReadonlyArray<string>;
/**
 * Checks whether a path points to an existing file (not a directory).
 */
export declare function isFile(path: string): boolean;
//# sourceMappingURL=discovery.d.ts.map