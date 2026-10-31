import { describe, expect, it } from 'bun:test';
import { CLIP_IDS, CLIP_UPDATED_AT } from '@/schemas';

describe('clip updated-at timestamps', () => {
  it('records exactly one timestamp per clip', () => {
    expect(Object.keys(CLIP_UPDATED_AT).sort()).toEqual([...CLIP_IDS].sort());
  });
});
