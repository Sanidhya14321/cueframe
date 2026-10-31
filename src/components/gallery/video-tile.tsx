'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { formatDuration } from '@/lib/gallery-filters';
import type { VideoGalleryItem } from './clip-gallery';
import { TILE_FRAME, TileBadge, TileCaption } from './tile-caption';
import { useInView } from './use-in-view';

const ClipVideo = ({ src, inView }: { src: string; inView: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [requested, setRequested] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (inView) {
      setRequested(true);
    }
  }, [inView]);

  useEffect(() => {
    const video = videoRef.current;
    if (video === null || !requested) {
      return;
    }
    if (inView) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [inView, requested]);

  return (
    <video
      ref={videoRef}
      src={requested ? src : undefined}
      muted
      loop
      playsInline
      preload="none"
      onPlaying={() => setPlaying(true)}
      className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

export const VideoTile = ({ meta, video, firstFrame, width, height }: VideoGalleryItem) => {
  const { ref, inView } = useInView<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={`/clips/${meta.id}`}
      aria-label={meta.title}
      className={TILE_FRAME}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {firstFrame === null ? null : (
        <Image
          src={firstFrame}
          alt=""
          fill
          unoptimized
          className="scale-110 object-cover blur-md"
        />
      )}
      {video === null ? (
        <span className="absolute inset-0 grid place-items-center px-4 text-center text-muted-foreground text-xs">
          No preview yet
        </span>
      ) : (
        <ClipVideo src={video} inView={inView} />
      )}
      <TileBadge>
        <Play className="size-2.5 fill-current" />
        {formatDuration(meta)}
      </TileBadge>
      {meta.attribution ? (
        <span
          className="absolute left-2 top-2 max-w-[85%] rounded-full bg-black/70 px-2 py-1 text-[9px] text-white"
          title={`${meta.attribution.name} · ${meta.attribution.license}`}
        >
          {meta.attribution.name} · {meta.attribution.license}
        </span>
      ) : null}
      <TileCaption title={meta.title} category={meta.category} />
    </Link>
  );
};
