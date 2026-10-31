import { staticFile } from 'remotion';

const ABSOLUTE = /^(https?:|data:|blob:|\/)/;

const resolveImage = (value: string): string => (ABSOLUTE.test(value) ? value : staticFile(value));

type PhotoEntry = { image: HTMLImageElement | null; pending: Promise<void> | null };

const photos = new Map<string, PhotoEntry>();

const startLoading = (url: string): PhotoEntry => {
  const entry: PhotoEntry = { image: null, pending: null };
  entry.pending = new Promise<void>((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      entry.image = image;
      entry.pending = null;
      resolve();
    };
    image.onerror = () => {
      entry.pending = null;
      resolve();
    };
    image.src = url;
  });
  photos.set(url, entry);
  return entry;
};

export const readPhoto = (src: string): HTMLImageElement | null => {
  if (src === '') {
    return null;
  }
  const url = resolveImage(src);
  const entry = photos.get(url) ?? startLoading(url);
  if (entry.pending !== null) {
    throw entry.pending;
  }
  return entry.image;
};
