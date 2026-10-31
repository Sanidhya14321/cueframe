import type { SiteGalleryItem } from '@/components/gallery/clip-gallery';
import { SITE_TEMPLATES } from '@/sites/templates';

export const SITE_PREVIEW_SIZE = { width: 405, height: 720 } as const;

export const sitePreviewPath = (id: string): string => `/site-previews/${id}.jpg`;

export const listSites = (): SiteGalleryItem[] =>
  SITE_TEMPLATES.map(({ meta }) => ({
    kind: 'site',
    meta: {
      id: meta.id,
      kind: 'site',
      title: meta.title,
      description: meta.description,
      category: meta.category,
      tags: meta.tags,
      theme: meta.theme,
      durationInFrames: 0,
      fps: 30,
      updatedAt: meta.updatedAt,
    },
    preview: sitePreviewPath(meta.id),
    width: SITE_PREVIEW_SIZE.width,
    height: SITE_PREVIEW_SIZE.height,
  }));
