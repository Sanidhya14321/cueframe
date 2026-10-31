import { describe, expect, it } from 'bun:test';
import { slugify, slugProblem } from '@/sites/slug';

describe('slugify', () => {
  it('turns names into a readable address', () => {
    expect(slugify('Rachelle & Thomas')).toBe('rachelle-and-thomas');
    expect(slugify('  Zoë   Ångström 2028! ')).toBe('zoe-angstrom-2028');
  });
});

describe('slugProblem', () => {
  it('accepts lowercase words joined by single hyphens', () => {
    expect(slugProblem('rachelle-and-thomas')).toBeNull();
  });

  it.each([['ab'], ['Has-Caps'], ['double--hyphen'], ['-edge'], ['edit'], ['a'.repeat(49)]])(
    'rejects %s',
    (slug) => {
      expect(slugProblem(slug)).not.toBeNull();
    },
  );
});
