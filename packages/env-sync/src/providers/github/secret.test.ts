import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SecretMap } from '../../types.js';

vi.mock('node:child_process', () => ({
    execFileSync: vi.fn((file: string, args: ReadonlyArray<string>) => {
        if (file !== 'gh') throw new Error('unexpected executable');
        if (args.join(' ') === 'auth status') return '';
        if (args.join(' ') === 'secret list --json name') return '[]';
        if (args.join(' ') === 'secret set API_KEY') return '';
        throw new Error(`unexpected args: ${args.join(' ')}`);
    }),
}));

vi.mock('../../core/logger.js', () => ({
    logger: {
        dryRun: vi.fn(),
        info: vi.fn(),
        success: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
        separator: vi.fn(),
        summary: vi.fn(),
    },
}));

import { execFileSync } from 'node:child_process';
import { syncGitHubSecrets, validateGitHubSecretName } from './secret.js';

const mockedExecFileSync = vi.mocked(execFileSync);

describe('validateGitHubSecretName', () => {
    it('rejects shell metacharacters in secret names', () => {
        expect(() => validateGitHubSecretName('API_KEY; echo leaked')).toThrow(/Invalid GitHub secret name/);
    });
});

describe('syncGitHubSecrets', () => {
    beforeEach(() => {
        mockedExecFileSync.mockClear();
    });

    it('sets secrets with execFileSync argument arrays', async () => {
        const secrets = new Map([
            ['API_KEY', { key: 'API_KEY', value: 'secret-value', source: '.env' }],
        ]) as SecretMap;

        await syncGitHubSecrets(secrets, false);

        expect(mockedExecFileSync).toHaveBeenCalledWith(
            'gh',
            ['secret', 'set', 'API_KEY'],
            expect.objectContaining({
                input: 'secret-value',
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe'],
            }),
        );
    });
});
