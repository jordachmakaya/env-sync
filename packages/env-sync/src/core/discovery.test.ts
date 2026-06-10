import { describe, expect, it } from 'vitest';
import { computePriority } from './discovery.js';

describe('computePriority', () => {
    it('scores package environment files without CommonJS require', () => {
        expect(computePriority('packages/blog/.env.production', 'production')).toBe(110);
    });
});
