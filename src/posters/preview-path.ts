import type { PosterMeta } from './pack';

export const posterPreviewPath = (meta: Pick<PosterMeta, 'id' | 'packId'>): string =>
  `/poster-previews/${meta.packId}/${meta.id.slice(meta.packId.length + 1)}.jpg`;
