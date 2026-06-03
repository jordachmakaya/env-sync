// src/core/logger.ts
// Minimal CLI logger with consistent emoji prefixes.
// No external dependencies.
const ICONS = {
    info: '🔍',
    success: '✅',
    warn: '⚠️ ',
    error: '❌',
    dryRun: '🏃',
};
function write(icon, message) {
    process.stdout.write(`${icon} ${message}\n`);
}
function writeErr(icon, message) {
    process.stderr.write(`${icon} ${message}\n`);
}
export const logger = {
    info: (msg) => write(ICONS.info, msg),
    success: (msg) => write(ICONS.success, msg),
    warn: (msg) => write(ICONS.warn, msg),
    error: (msg) => writeErr(ICONS.error, msg),
    dryRun: (msg) => write(ICONS.dryRun, `DRY RUN — ${msg}`),
    separator: () => write('', '─'.repeat(52)),
    summary: (result) => {
        write('', '');
        write('📊', `Created : ${result.created.length}`);
        write('📊', `Updated : ${result.updated.length}`);
        write('📊', `Skipped : ${result.skipped.length}`);
        if (result.errors.length > 0) {
            writeErr('📊', `Errors  : ${result.errors.length}`);
        }
    },
};
//# sourceMappingURL=logger.js.map