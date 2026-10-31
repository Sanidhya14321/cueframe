'use client';

import { fitInside } from '@/design';
import { loadImage } from './image-cache';

const MAX_SIDE = 2400;

const readAsDataUrl = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

export interface LoadedImage {
  src: string;
  width: number;
  height: number;
  name: string;
}

export const readImageFile = async (file: File): Promise<LoadedImage | null> => {
  const original = await readAsDataUrl(file);
  const image = await loadImage(original);
  if (image === null) {
    return null;
  }
  const { naturalWidth: width, naturalHeight: height } = image;
  if (Math.max(width, height) <= MAX_SIDE || file.type === 'image/svg+xml') {
    return { src: original, width, height, name: file.name };
  }
  const size = fitInside(width, height, MAX_SIDE, MAX_SIDE);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(size.width);
  canvas.height = Math.round(size.height);
  canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height);
  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  return {
    src: canvas.toDataURL(type, 0.9),
    width: canvas.width,
    height: canvas.height,
    name: file.name,
  };
};
