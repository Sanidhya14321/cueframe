import { describe, expect, it } from 'bun:test';
import { clipControlsFor } from '@/core';
import { controlSwatches, isLight, pickRole, vividAccent } from '@/og/palette';
import { CLIP_IDS, getClipDefaults } from '@/schemas';

describe('share card palette', () => {
  it('prefers a vivid accent role over a more saturated primary', () => {
    const swatches = [
      { role: 'Primary color', value: '#ff0000' },
      { role: 'Accent color', value: '#b08d57' },
    ];
    expect(vividAccent(swatches, '#000000')).toBe('#b08d57');
  });

  it('falls back when every role is neutral', () => {
    const swatches = [
      { role: 'Primary color', value: '#111111' },
      { role: 'Accent color', value: '#f5f5f5' },
    ];
    expect(vividAccent(swatches, '#a78bfa')).toBe('#a78bfa');
  });

  it('picks the first role that is present', () => {
    const swatches = [{ role: 'Surface color', value: '#eeeeee' }];
    expect(pickRole(swatches, ['Background color', 'Surface color'], '#000000')).toBe('#eeeeee');
  });

  it('reads light and dark backdrops', () => {
    expect(isLight('#faf6ee')).toBe(true);
    expect(isLight('#1f3a2d')).toBe(false);
  });

  it('finds colour swatches for every clip', () => {
    const empty = CLIP_IDS.filter(
      (id) => controlSwatches(clipControlsFor(id), getClipDefaults(id)).length === 0,
    );
    expect(empty).toEqual([]);
  });
});
