import type { CirclePopProps } from '@/schemas';
import { useCanvasFont } from '../promo/desk/canvas-texture';
import { bodyFont, bodyFontReady, displayFont, displayFontReady } from '../promo/fonts';
import { measureInk, sizeInsideCircle, sizeInsideWidth } from './fit';

const FIT_MARGIN = 0.92;
const SUBLINE_LINE_HEIGHT = 1.2;

export const useFittedSizes = (
  { word, disc, wobble, tilt, subline }: CirclePopProps,
  width: number,
) => {
  useCanvasFont(`${word.weight} 100px "${displayFont}"`, displayFontReady);
  useCanvasFont(`${subline.weight} 100px "${bodyFont}"`, bodyFontReady);
  const halfWidth = (width / 2 - Math.abs(disc.offsetX)) * FIT_MARGIN;
  const wordInk = measureInk(word.text, displayFont, word.weight, word.tracking, 1);
  const discRoom = (disc.size / 2) * (1 - wobble.amount) * FIT_MARGIN;
  const startSize = sizeInsideCircle(wordInk, discRoom, word.startSize);
  const endSize = Math.min(
    sizeInsideWidth(wordInk, halfWidth, word.rotation, word.endSize),
    sizeInsideWidth(wordInk, halfWidth, tilt.angle, word.endSize),
  );
  const sublineInk = measureInk(
    subline.text,
    bodyFont,
    subline.weight,
    subline.tracking,
    SUBLINE_LINE_HEIGHT,
  );
  return {
    startSize,
    endSize,
    sublineSize: sizeInsideWidth(sublineInk, halfWidth, tilt.angle, subline.size),
    wordBottom: endSize * wordInk.bottom,
  };
};
