import type { Box } from './geometry';

export const coverCrop = (
  imageWidth: number,
  imageHeight: number,
  boxWidth: number,
  boxHeight: number,
  crop: { zoom: number; focusX: number; focusY: number } = { zoom: 1, focusX: 0.5, focusY: 0.5 },
): Box => {
  const scale = Math.max(boxWidth / imageWidth, boxHeight / imageHeight) * crop.zoom;
  const width = boxWidth / scale;
  const height = boxHeight / scale;
  return {
    x: (imageWidth - width) * crop.focusX,
    y: (imageHeight - height) * crop.focusY,
    width,
    height,
  };
};

export const containBox = (
  imageWidth: number,
  imageHeight: number,
  boxWidth: number,
  boxHeight: number,
): Box => {
  const scale = Math.min(boxWidth / imageWidth, boxHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return { x: (boxWidth - width) / 2, y: (boxHeight - height) / 2, width, height };
};

export const fitInside = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } => {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return { width: width * scale, height: height * scale };
};
