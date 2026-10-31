import { createShapeElement, createTextElement, createTrack } from './factories';
import type { Project } from './project';

export const createEmptyProject = (): Project => ({
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 150,
  background: '#0a0a0a',
  tracks: [createTrack('Track 1')],
});

export const createSeedProject = (): Project => {
  const backdrop = createTrack('Backdrop');
  backdrop.id = 'seed-track-backdrop';
  backdrop.elements.push(
    createShapeElement('rect', {
      id: 'seed-shape-backdrop',
      color: '#111827',
      from: 0,
      durationInFrames: 150,
      transform: { x: 0, y: 0, scale: 1.2, rotation: 0, opacity: 1 },
      animation: { kind: 'scale', easing: 'easeOut', durationInFrames: 18 },
    }),
    createShapeElement('ellipse', {
      id: 'seed-shape-accent',
      color: '#6366f1',
      from: 10,
      durationInFrames: 140,
      transform: { x: 420, y: -220, scale: 0.9, rotation: 0, opacity: 0.85 },
      animation: { kind: 'scale', easing: 'easeInOut', durationInFrames: 24 },
    }),
  );

  const copy = createTrack('Copy');
  copy.id = 'seed-track-copy';
  copy.elements.push(
    createTextElement({
      id: 'seed-text-title',
      content: 'Timeline Editor',
      fontSize: 140,
      color: '#f5f5f5',
      from: 12,
      durationInFrames: 138,
      transform: { x: 0, y: -40, scale: 1, rotation: 0, opacity: 1 },
      animation: { kind: 'slide', easing: 'easeOut', durationInFrames: 20 },
    }),
    createTextElement({
      id: 'seed-text-sub',
      content: 'drag, trim, animate',
      fontSize: 56,
      color: '#a1a1aa',
      from: 30,
      durationInFrames: 120,
      transform: { x: 0, y: 90, scale: 1, rotation: 0, opacity: 1 },
      animation: { kind: 'fade', easing: 'easeOut', durationInFrames: 24 },
    }),
  );

  return {
    fps: 30,
    width: 1920,
    height: 1080,
    durationInFrames: 150,
    background: '#0a0a0a',
    tracks: [backdrop, copy],
  };
};
