import { describe, expect, it } from 'bun:test';
import {
  addElement,
  addTrack,
  createCompositionElement,
  createEmptyProject,
  createShapeElement,
  createTextElement,
  createTrack,
  findElement,
  listElements,
  moveElement,
  projectContentEnd,
  removeElement,
  removeTrack,
  replaceElement,
  resizeElement,
} from '@/project';

const seededProject = () => {
  const base = createEmptyProject();
  const trackId = base.tracks[0]?.id ?? '';
  const element = createTextElement({ id: 'el-1', from: 10, durationInFrames: 60 });
  return { project: addElement(base, trackId, element), trackId, element };
};

describe('element reducers', () => {
  it('adds an element to an existing track', () => {
    const { project } = seededProject();
    expect(listElements(project)).toHaveLength(1);
  });

  it('ignores adds to unknown tracks', () => {
    const base = createEmptyProject();
    const next = addElement(base, 'missing', createTextElement());
    expect(listElements(next)).toHaveLength(0);
  });

  it('locates an element and its track', () => {
    const { project, trackId } = seededProject();
    const found = findElement(project, 'el-1');
    expect(found?.trackId).toBe(trackId);
    expect(findElement(project, 'nope')).toBeNull();
  });

  it('moves an element and clamps below zero', () => {
    const { project } = seededProject();
    expect(findElement(moveElement(project, 'el-1', 42), 'el-1')?.element.from).toBe(42);
    expect(findElement(moveElement(project, 'el-1', -20), 'el-1')?.element.from).toBe(0);
  });

  it('rounds fractional frame positions', () => {
    const { project } = seededProject();
    expect(findElement(moveElement(project, 'el-1', 12.7), 'el-1')?.element.from).toBe(13);
  });

  it('resizes with a minimum of one frame', () => {
    const { project } = seededProject();
    expect(findElement(resizeElement(project, 'el-1', 120), 'el-1')?.element.durationInFrames).toBe(
      120,
    );
    expect(findElement(resizeElement(project, 'el-1', 0), 'el-1')?.element.durationInFrames).toBe(
      1,
    );
  });

  it('leaves the project untouched when the id is unknown', () => {
    const { project } = seededProject();
    expect(moveElement(project, 'ghost', 5)).toBe(project);
    expect(resizeElement(project, 'ghost', 5)).toBe(project);
  });

  it('replaces an element in place', () => {
    const { project, element } = seededProject();
    const next = replaceElement(project, { ...element, content: 'changed' });
    const found = findElement(next, 'el-1');
    expect(found?.element.type === 'text' && found.element.content).toBe('changed');
  });

  it('removes an element', () => {
    const { project } = seededProject();
    expect(listElements(removeElement(project, 'el-1'))).toHaveLength(0);
  });

  it('replaces the props of a composition element', () => {
    const base = createEmptyProject();
    const trackId = base.tracks[0]?.id ?? '';
    const element = createCompositionElement('brand-reveal', { words: ['a'] }, { id: 'clip-1' });
    const project = addElement(base, trackId, element);
    const next = replaceElement(project, { ...element, props: { words: ['b'] } });
    const found = findElement(next, 'clip-1');
    expect(found?.element.type === 'composition' && found.element.props).toEqual({ words: ['b'] });
  });

  it('reports the content end frame', () => {
    const { project } = seededProject();
    expect(projectContentEnd(project)).toBe(70);
    expect(projectContentEnd(createEmptyProject())).toBe(0);
  });
});

describe('track reducers', () => {
  it('adds a track', () => {
    const next = addTrack(createEmptyProject(), createTrack('Second'));
    expect(next.tracks).toHaveLength(2);
  });

  it('removes a track when more than one exists', () => {
    const base = addTrack(createEmptyProject(), createTrack('Second'));
    const targetId = base.tracks[1]?.id ?? '';
    expect(removeTrack(base, targetId).tracks).toHaveLength(1);
  });

  it('clears the last track instead of removing it', () => {
    const base = createEmptyProject();
    const trackId = base.tracks[0]?.id ?? '';
    const withElement = addElement(base, trackId, createShapeElement());
    const cleared = removeTrack(withElement, trackId);
    expect(cleared.tracks).toHaveLength(1);
    expect(cleared.tracks[0]?.elements).toHaveLength(0);
  });
});
