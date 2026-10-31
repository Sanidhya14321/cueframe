import { describe, expect, it } from 'bun:test';
import { seedProjectForClip } from '@/core';

describe('project seed', () => {
  it('seeds a real clip as a single composition element on one track', () => {
    const project = seedProjectForClip('phone-spin-in');
    expect(project.tracks).toHaveLength(1);
    const elements = project.tracks.flatMap((track) => track.elements);
    expect(elements).toHaveLength(1);
    expect(elements[0]?.type).toBe('composition');
    expect(elements.every((element) => element.durationInFrames >= 1)).toBe(true);
  });
});
