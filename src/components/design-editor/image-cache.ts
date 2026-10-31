'use client';

import { useEffect, useState } from 'react';

const loaded = new Map<string, HTMLImageElement>();
const pending = new Map<string, Promise<HTMLImageElement | null>>();

export const loadImage = (src: string): Promise<HTMLImageElement | null> => {
  const cached = loaded.get(src);
  if (cached !== undefined) {
    return Promise.resolve(cached);
  }
  const inflight = pending.get(src);
  if (inflight !== undefined) {
    return inflight;
  }
  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    const image = new window.Image();
    if (!(src.startsWith('data:') || src.startsWith('blob:'))) {
      image.crossOrigin = 'anonymous';
    }
    image.onload = () => {
      loaded.set(src, image);
      pending.delete(src);
      resolve(image);
    };
    image.onerror = () => {
      pending.delete(src);
      resolve(null);
    };
    image.src = src;
  });
  pending.set(src, promise);
  return promise;
};

const cachedImage = (src: string): HTMLImageElement | undefined => loaded.get(src);

export const cachedImageSize = (src: string): { width: number; height: number } | undefined => {
  const image = loaded.get(src);
  return image === undefined
    ? undefined
    : { width: image.naturalWidth, height: image.naturalHeight };
};

export const useImageSource = (src: string): HTMLImageElement | undefined => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(() =>
    src === '' ? undefined : cachedImage(src),
  );

  useEffect(() => {
    if (src === '') {
      setImage(undefined);
      return;
    }
    const hit = cachedImage(src);
    if (hit !== undefined) {
      setImage(hit);
      return;
    }
    let active = true;
    setImage(undefined);
    loadImage(src)
      .then((result) => {
        if (active && result !== null) {
          setImage(result);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [src]);

  return image;
};
