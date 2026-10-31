import { CLIP_MODULES, type ClipId } from '@/schemas';
import { resolveClipControls } from './clip-controls';
import type { ControlSectionView } from './types';

const resolved = new Map<string, ControlSectionView[]>();

export const clipControlsFor = (id: ClipId | string): ControlSectionView[] => {
  const cached = resolved.get(id);
  if (cached !== undefined) {
    return cached;
  }
  const module = CLIP_MODULES.find((entry) => entry.id === id);
  const sections =
    module === undefined
      ? []
      : resolveClipControls(module.schema, module.controls, module.defaults);
  resolved.set(id, sections);
  return sections;
};
