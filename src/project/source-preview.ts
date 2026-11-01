import type { Element } from './element';

export const needsSourcePreview = (item: Element) =>
  item.type === 'composition' ||
  item.type === 'captions' ||
  Boolean(
    item.animation && item.animation.kind !== 'none' && item.animation.durationInFrames > 0,
  ) ||
  (item.type === 'video' && Boolean(item.punchIns?.length)) ||
  (item.type === 'audio' && (Boolean(item.duckRegions?.length) || item.loop === true));
