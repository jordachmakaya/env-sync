import type { EnvFile } from '../types.js';
/**
 * Parses a single .env file into an EnvFile object.
 * Returns null if the file cannot be read.
 */
export declare function parseEnvFile(filePath: string, root: string, environment: string): EnvFile | null;
/**
 * Parses all discovered .env files.
 * Silently skips files that cannot be read.
 */
export declare function parseEnvFiles(filePaths: ReadonlyArray<string>, root: string, environment: string): ReadonlyArray<EnvFile>;
//# sourceMappingURL=parser.d.ts.map