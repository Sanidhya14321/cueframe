import { createId } from '../ids';
import type { Project } from '../project';

export const splitVideoAtFrame = (project: Project, id: string, frame: number): Project => ({
  ...project,
  tracks: project.tracks.map((track) => ({
    ...track,
    elements: track.elements.flatMap((element) => {
      if (element.id !== id || element.type !== 'video') {
        return [element];
      }
      const split = Math.round(frame);
      const effectiveEnd = element.from + element.durationInFrames;
      if (split <= element.from || split >= effectiveEnd) {
        return [element];
      }
      const leftDuration = split - element.from;
      const rightDuration = element.durationInFrames - leftDuration;
      const regions = (offset: number, duration: number) =>
        (element.punchIns ?? [])
          .map((region) => ({
            ...region,
            from: Math.max(0, region.from - offset),
            to: Math.min(duration - 1, region.to - offset),
          }))
          .filter((region) => region.to >= region.from);
      return [
        { ...element, durationInFrames: leftDuration, punchIns: regions(0, leftDuration) },
        {
          ...element,
          id: createId('video'),
          from: split,
          durationInFrames: rightDuration,
          sourceFrom: (element.sourceFrom ?? 0) + leftDuration,
          punchIns: regions(leftDuration, rightDuration),
          animation: { kind: 'none' as const, easing: 'linear' as const, durationInFrames: 0 },
        },
      ];
    }),
  })),
});
