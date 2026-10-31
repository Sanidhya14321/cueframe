import { PLATE_STAMP } from '@/footage/footage-spec';

export type PlateSource = {
  image: HTMLCanvasElement;
  index: number | null;
  version: number;
  listeners: Set<() => void>;
};

export const createPlateSource = (width: number, height: number): PlateSource => {
  const image = document.createElement('canvas');
  image.width = width;
  image.height = height;
  return { image, index: null, version: 0, listeners: new Set() };
};

const readStamp = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  pictureHeight: number,
): number => {
  const strip = (height * PLATE_STAMP.rows) / (pictureHeight + PLATE_STAMP.rows);
  const row = Math.min(height - 1, Math.round(height - strip / 2));
  const pixels = context.getImageData(0, row, width, 1).data;
  let index = 0;
  for (let bit = 0; bit < PLATE_STAMP.bits; bit += 1) {
    const x = Math.round(((bit + 0.5) * width) / PLATE_STAMP.bits);
    if ((pixels[x * 4] ?? 0) > 128) {
      index += 2 ** bit;
    }
  }
  return index;
};

export const receivePlateFrame = (
  source: PlateSource,
  frame: CanvasImageSource & { width: number; height: number },
  pictureHeight: number,
): void => {
  const { image } = source;
  const context = image.getContext('2d', { willReadFrequently: true });
  if (context === null) {
    return;
  }
  context.drawImage(frame, 0, 0, image.width, image.height);
  source.index = readStamp(context, image.width, image.height, pictureHeight);
  source.version += 1;
  for (const listener of [...source.listeners]) {
    listener();
  }
};
