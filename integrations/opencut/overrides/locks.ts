import type { SceneTracks } from '@/timeline';

let locked = new Set<string>();
let originals = new Map<string, string>();
const entries = (tracks: SceneTracks) =>
  [...tracks.overlay, tracks.main, ...tracks.audio].flatMap((track, index) =>
    track.elements.map(
      (item) =>
        [
          item.id,
          JSON.stringify({
            item,
            track: track.id,
            index,
            hidden: 'hidden' in track ? track.hidden : false,
            muted: 'muted' in track ? track.muted : false,
          }),
        ] as const,
    ),
  );
export const setNativeLocks = (ids: string[], tracks: SceneTracks) => {
  locked = new Set(ids);
  originals = new Map(entries(tracks).filter(([id]) => locked.has(id)));
};
export const guardNativeTracks = (tracks: SceneTracks) => {
  if (locked.size === 0) {
    return true;
  }
  const next = new Map(entries(tracks));
  for (const id of locked) {
    if (originals.get(id) !== next.get(id)) {
      window.dispatchEvent(
        new CustomEvent('clipkit-save', {
          detail: 'This layer is locked while the agent edits it.',
        }),
      );
      return false;
    }
  }
  return true;
};
