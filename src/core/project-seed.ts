import { createCompositionElement, createTrack, type Project, type Track } from '@/project';
import { CLIP_DEFAULTS, type ClipId, getClipMeta } from '@/schemas';

const singleClipTrack = (id: ClipId): Track[] => {
  const track = createTrack('Clip');
  track.elements.push(
    createCompositionElement(id, CLIP_DEFAULTS[id] as Record<string, unknown>, {
      id: `clip-${id}`,
      from: 0,
      durationInFrames: getClipMeta(id).durationInFrames,
    }),
  );
  return [track];
};

export const seedProjectForClip = (id: ClipId): Project => {
  const meta = getClipMeta(id);
  return {
    fps: meta.fps,
    width: meta.width,
    height: meta.height,
    durationInFrames: meta.durationInFrames,
    background: '#0a0a0a',
    tracks: singleClipTrack(id),
  };
};
