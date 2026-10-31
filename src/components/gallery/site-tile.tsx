'use client';

import { Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { SiteGalleryItem } from './clip-gallery';
import { TILE_FRAME, TileBadge, TileCaption } from './tile-caption';
import { useInView } from './use-in-view';

export const SiteTile = ({ meta, preview, width, height }: SiteGalleryItem) => {
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
        href={`/sites/${meta.id}`}
        aria-label={`Edit ${meta.title}`}
        className="absolute inset-0"
      >
        {inView || seen ? (
          <Image
            src={preview}
            alt={meta.title}
            fill
            unoptimized
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </Link>
      <TileBadge>
        <Globe className="size-3" />
        Website
      </TileBadge>
      <TileCaption title={meta.title} category={meta.category} />
    </article>
  );
};
