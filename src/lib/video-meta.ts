import { type ClipMeta, clipUpdatedAt } from '@/schemas';
import type { GalleryMeta } from './gallery-filters';

export const videoMeta = (meta: ClipMeta): GalleryMeta => ({
  ...meta,
  kind: 'video',
  updatedAt: clipUpdatedAt(meta.id),
});
