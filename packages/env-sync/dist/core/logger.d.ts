export declare const logger: {
    readonly info: (msg: string) => void;
    readonly success: (msg: string) => void;
    readonly warn: (msg: string) => void;
    readonly error: (msg: string) => void;
    readonly dryRun: (msg: string) => void;
    readonly separator: () => void;
    readonly summary: (result: {
        created: ReadonlyArray<string>;
        updated: ReadonlyArray<string>;
        skipped: ReadonlyArray<string>;
        errors: ReadonlyArray<{
            key: string;
            message: string;
        }>;
    }) => void;
};
//# sourceMappingURL=logger.d.ts.map