import { describe, expect, it } from 'bun:test';
import {
  ANIMATION_KINDS,
  createCompositionElement,
  createEmptyProject,
  createImageElement,
  createSeedProject,
  createShapeElement,
  createTextElement,
  createTrack,
  createVideoElement,
  defaultAnimation,
  elementSchema,
  identityTransform,
  parseProject,
  projectSchema,
  safeParseProject,
} from '@/project';

describe('project schema', () => {
  it('validates the empty project', () => {
    const project = createEmptyProject();
    expect(() => parseProject(project)).not.toThrow();
    expect(project.tracks).toHaveLength(1);
  });

  it('validates the seed project with elements', () => {
    const project = createSeedProject();
    const parsed = parseProject(project);
    expect(parsed.tracks).toHaveLength(2);
    expect(parsed.tracks[1]?.elements[0]?.type).toBe('text');
  });

  it('rejects malformed projects', () => {
    expect(safeParseProject({ fps: 0 })).toBeNull();
    expect(safeParseProject({ ...createEmptyProject(), width: -1 })).toBeNull();
  });

  it('rejects a zero-duration element', () => {
    const element = { ...createTextElement(), durationInFrames: 0 };
    expect(elementSchema.safeParse(element).success).toBe(false);
  });

  it('rejects an element starting before frame zero', () => {
    const element = { ...createShapeElement(), from: -5 };
    expect(elementSchema.safeParse(element).success).toBe(false);
  });

  it('validates a composition element referencing a clip', () => {
    const element = createCompositionElement('brand-reveal', { words: ['hi'] }, { from: 0 });
    const parsed = elementSchema.safeParse(element);
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.type).toBe('composition');
    expect(element.props).toEqual({ words: ['hi'] });
  });

  it('rejects a composition element without a clip id', () => {
    const element = { ...createCompositionElement('brand-reveal', {}), clipId: '' };
    expect(elementSchema.safeParse(element).success).toBe(false);
  });

  it('round-trips through json', () => {
    const project = createSeedProject();
    const clone = JSON.parse(JSON.stringify(project)) as unknown;
    expect(projectSchema.safeParse(clone).success).toBe(true);
  });
});

describe('factories', () => {
  it('builds an identity transform', () => {
    expect(identityTransform()).toEqual({ x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
  });

  it('applies the default fade animation', () => {
    expect(defaultAnimation().kind).toBe('fade');
    expect(ANIMATION_KINDS).toContain('slide');
  });

  it('creates distinct ids per element', () => {
    const a = createTextElement();
    const b = createTextElement();
    expect(a.id).not.toBe(b.id);
  });

  it('creates an empty named track', () => {
    const track = createTrack('Audio');
    expect(track.name).toBe('Audio');
    expect(track.elements).toHaveLength(0);
  });

  it('creates image and shape and video elements with defaults', () => {
    expect(createImageElement().type).toBe('image');
    expect(createVideoElement({ src: '/clip.mp4' }).src).toBe('/clip.mp4');
    expect(createShapeElement('ellipse').kind).toBe('ellipse');
  });
});
