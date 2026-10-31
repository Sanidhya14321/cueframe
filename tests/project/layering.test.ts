import { describe, expect, it } from 'bun:test';
import {
  addElement,
  addTrack,
  createEmptyProject,
  createShapeElement,
  createTextElement,
  createTrack,
  findElement,
  listElements,
  moveElementToTrack,
  moveTrack,
  trimElementStart,
} from '@/project';

const twoTrackProject = () => {
  const base = addTrack(createEmptyProject(), createTrack('Track 2'));
  const trackA = base.tracks[0]?.id ?? '';
  const trackB = base.tracks[1]?.id ?? '';
  const element = createTextElement({ id: 'el-1', from: 10, durationInFrames: 60 });
  return { project: addElement(base, trackA, element), trackA, trackB };
};

describe('trimElementStart', () => {
  it('moves the left edge while keeping the right edge fixed', () => {
    const { project } = twoTrackProject();
    const next = trimElementStart(project, 'el-1', 30);
    const found = findElement(next, 'el-1');
    expect(found?.element.from).toBe(30);
    expect(found?.element.durationInFrames).toBe(40);
  });

  it('clamps the left edge to zero and keeps duration consistent', () => {
    const { project } = twoTrackProject();
    const next = trimElementStart(project, 'el-1', -50);
    const found = findElement(next, 'el-1');
    expect(found?.element.from).toBe(0);
    expect(found?.element.durationInFrames).toBe(70);
  });

  it('never shrinks below one frame of duration', () => {
    const { project } = twoTrackProject();
    const next = trimElementStart(project, 'el-1', 999);
    const found = findElement(next, 'el-1');
    expect(found?.element.from).toBe(69);
    expect(found?.element.durationInFrames).toBe(1);
  });

  it('snaps fractional frames and ignores unknown ids', () => {
    const { project } = twoTrackProject();
    expect(findElement(trimElementStart(project, 'el-1', 12.7), 'el-1')?.element.from).toBe(13);
    expect(trimElementStart(project, 'ghost', 5)).toBe(project);
  });
});

describe('moveElementToTrack', () => {
  it('reassigns an element to another track', () => {
    const { project, trackA, trackB } = twoTrackProject();
    const next = moveElementToTrack(project, 'el-1', trackB);
    expect(next.tracks.find((track) => track.id === trackA)?.elements).toHaveLength(0);
    expect(next.tracks.find((track) => track.id === trackB)?.elements).toHaveLength(1);
    expect(findElement(next, 'el-1')?.trackId).toBe(trackB);
  });

  it('clamps and applies a new from when provided', () => {
    const { project, trackB } = twoTrackProject();
    const next = moveElementToTrack(project, 'el-1', trackB, -5);
    expect(findElement(next, 'el-1')?.element.from).toBe(0);
  });

  it('updates from when staying on the same track', () => {
    const { project, trackA } = twoTrackProject();
    const next = moveElementToTrack(project, 'el-1', trackA, 42);
    expect(findElement(next, 'el-1')?.trackId).toBe(trackA);
    expect(findElement(next, 'el-1')?.element.from).toBe(42);
    expect(listElements(next)).toHaveLength(1);
  });

  it('no-ops for unknown elements, unknown tracks or same track without a frame', () => {
    const { project, trackA, trackB } = twoTrackProject();
    expect(moveElementToTrack(project, 'ghost', trackB)).toBe(project);
    expect(moveElementToTrack(project, 'el-1', 'missing')).toBe(project);
    expect(moveElementToTrack(project, 'el-1', trackA)).toBe(project);
  });
});

describe('moveTrack', () => {
  const threeTracks = () => {
    const base = addTrack(
      addTrack(createEmptyProject(), createTrack('Track 2')),
      createTrack('Track 3'),
    );
    return addElement(base, base.tracks[0]?.id ?? '', createShapeElement());
  };

  it('swaps a track upward and downward', () => {
    const project = threeTracks();
    const second = project.tracks[1]?.id ?? '';
    const up = moveTrack(project, second, 'up');
    expect(up.tracks[0]?.id).toBe(second);
    const down = moveTrack(project, second, 'down');
    expect(down.tracks[2]?.id).toBe(second);
  });

  it('no-ops at the boundaries and for unknown ids', () => {
    const project = threeTracks();
    expect(moveTrack(project, project.tracks[0]?.id ?? '', 'up')).toBe(project);
    expect(moveTrack(project, project.tracks[2]?.id ?? '', 'down')).toBe(project);
    expect(moveTrack(project, 'ghost', 'up')).toBe(project);
  });
});
