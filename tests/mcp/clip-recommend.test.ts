import { describe, expect, test as it } from 'bun:test';
import { recommendClips } from '@/mcp/clip-recommend';
import { clipLabel, getClipMeta, isClipId } from '@/schemas';

describe('recommendClips', () => {
  it('fills every story role with a distinct clip that plays that role', () => {
    const plan = recommendClips('app launch with a phone reveal and pricing');
    const ids = plan.flatMap((step) => (step.clip ? [step.clip.id] : []));
    expect(ids).toHaveLength(5);
    expect(new Set(ids).size).toBe(5);
    for (const step of plan) {
      expect(step.clip?.roles).toContain(step.role);
    }
  });

  it('reads format and theme from the brief', () => {
    for (const { clip } of recommendClips('a dark vertical reel about a brand launch')) {
      if (clip && isClipId(clip.id)) {
        expect(clip.orientation).toBe('portrait');
        expect(getClipMeta(clip.id).theme).toBe('dark');
        expect(clipLabel(clip.id)).toBeDefined();
      }
    }
  });

  it('explicit options override the brief', () => {
    const plan = recommendClips('vertical launch', { orientation: 'landscape', roles: ['opener'] });
    expect(plan).toHaveLength(1);
    expect(plan[0]?.clip?.orientation).toBe('landscape');
  });
});
