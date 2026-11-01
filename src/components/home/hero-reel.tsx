'use client';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const HeroReel = () => {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.current?.play().catch(() => setPlaying(false));
    }
  }, []);
  const toggle = () => {
    if (video.current?.paused) {
      video.current.play().catch(() => setPlaying(false));
    } else {
      video.current?.pause();
    }
  };
  return (
    <figure className="relative lg:-mr-10">
      <video
        ref={video}
        aria-label="A pencil-drawn reel sketching type on drafting paper"
        className="aspect-video w-full rounded-xl object-cover lg:rounded-r-none"
        loop
        muted
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        playsInline
        poster="/site-assets/pencil-reel.jpg"
        preload="metadata"
        src="/site-assets/pencil-reel.mp4"
      />
      <button
        aria-label={playing ? 'Pause reel' : 'Play reel'}
        className="absolute bottom-3 left-3 inline-flex size-11 items-center justify-center rounded-md bg-background text-foreground transition-colors duration-[120ms] hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onClick={toggle}
        type="button"
      >
        {playing ? (
          <Pause aria-hidden className="size-4" />
        ) : (
          <Play aria-hidden className="size-4" />
        )}
      </button>
    </figure>
  );
};
