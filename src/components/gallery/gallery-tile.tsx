'use client';

import type { GalleryItem } from './clip-gallery';
import { PosterTile } from './poster-tile';
import { SiteTile } from './site-tile';
import { VideoTile } from './video-tile';

export const GalleryTile = (item: GalleryItem) => {
  switch (item.kind) {
    case 'video':
      return <VideoTile {...item} />;
    case 'poster':
      return <PosterTile {...item} />;
    default:
      return <SiteTile {...item} />;
  }
};
