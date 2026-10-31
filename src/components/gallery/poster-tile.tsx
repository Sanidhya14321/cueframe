'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { PosterGalleryItem } from './clip-gallery';
import { TILE_FRAME, TileCaption } from './tile-caption';
import { useInView } from './use-in-view';

export const PosterTile = ({ meta, preview, width, height }: PosterGalleryItem) => {
  const { ref, inView } = useInView<HTMLElement>();
  const [seen, setSeen] = useState(false);
  if (inView && !seen) {
    setSeen(true);
  }

  return (
    <article
      ref={ref}
      aria-label={meta.title}
      className={TILE_FRAME}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Link
        href={`/posters/${meta.id}`}
        aria-label={`Edit ${meta.title}`}
        className="absolute inset-0"
      >
        {inView || seen ? (
          <Image
            src={preview}
            alt={meta.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </Link>
      <TileCaption title={meta.title} category={meta.category} />
    </article>
  );
};
