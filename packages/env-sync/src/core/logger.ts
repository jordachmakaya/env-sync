// src/core/logger.ts
// Minimal CLI logger with consistent emoji prefixes.
// No external dependencies.

const ICONS = {
    info:    '🔍',
    success: '✅',
    warn:    '⚠️ ',
    error:   '❌',
    dryRun:  '🏃',
} as const;

function write(icon: string, message: string): void {
    process.stdout.write(`${icon} ${message}\n`);
}

function writeErr(icon: string, message: string): void {
    process.stderr.write(`${icon} ${message}\n`);
}

export const logger = {
    info:    (msg: string) => write(ICONS.info,    msg),
    success: (msg: string) => write(ICONS.success, msg),
    warn:    (msg: string) => write(ICONS.warn,    msg),
    error:   (msg: string) => writeErr(ICONS.error,  msg),
    dryRun:  (msg: string) => write(ICONS.dryRun,  `DRY RUN — ${msg}`),

    separator: () => write('', '─'.repeat(52)),

    summary: (result: {
        created: ReadonlyArray<string>;
        updated: ReadonlyArray<string>;
        skipped: ReadonlyArray<string>;
        errors:  ReadonlyArray<{ key: string; message: string }>;
    }) => {
        write('', '');
        write('📊', `Created : ${result.created.length}`);
        write('📊', `Updated : ${result.updated.length}`);
        write('📊', `Skipped : ${result.skipped.length}`);
        if (result.errors.length > 0) {
            writeErr('📊', `Errors  : ${result.errors.length}`);
        }
    },
} as const;