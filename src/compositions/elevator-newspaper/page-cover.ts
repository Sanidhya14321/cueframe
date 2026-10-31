import { formatRgb, parse } from 'culori';
import type { PageCopy } from './page-layout';
import {
  type Box,
  type Context,
  coverImage,
  fittedSize,
  linesOf,
  placeholderImage,
  rule,
  SQUEEZE,
  serif,
  squeezedLines,
  tracked,
} from './page-type';

const clear = (color: string) => {
  const parsed = parse(color);
  return parsed === undefined ? 'transparent' : formatRgb({ ...parsed, alpha: 0 });
};

const masthead = (context: Context, copy: PageCopy, width: number, height: number) => {
  const size = height * 0.032;
  serif(context, size, 500);
  tracked(context, size, 0.14);
  context.textAlign = 'center';
  context.fillStyle = copy.ink.text;
  context.fillText(copy.masthead.brand, width / 2 + size * 0.07, height * 0.066, width * 0.86);
  tracked(context, size, 0);
  rule(context, width * 0.05, height * 0.088, width * 0.9, 4);
  rule(context, width * 0.05, height * 0.097, width * 0.9, 1.5);
};

const tint = (context: Context, copy: PageCopy, box: Box) => {
  if (copy.cover.photoTint <= 0) {
    return;
  }
  const shade = context.createLinearGradient(0, box.y, 0, box.y + box.height);
  shade.addColorStop(0, clear(copy.ink.tint));
  shade.addColorStop(0.55, copy.ink.tint);
  shade.addColorStop(1, clear(copy.ink.tint));
  context.save();
  context.globalAlpha = copy.cover.photoTint;
  context.fillStyle = shade;
  context.fillRect(box.x, box.y, box.width, box.height);
  context.restore();
};

const headline = (context: Context, copy: PageCopy, width: number, height: number) => {
  const lines = linesOf(copy.cover.headline);
  if (lines.length === 0) {
    return;
  }
  const lineGap = 0.92;
  const setFont = (fontSize: number) => serif(context, fontSize, 900);
  const size = fittedSize(
    context,
    lines,
    height * 0.122 * copy.cover.headlineSize,
    { width: width * 0.8, height: height * 0.42, lineGap },
    setFont,
  );
  setFont(size);
  context.textAlign = 'center';
  context.fillStyle = copy.ink.coverText;
  const middle = height * 0.545;
  const first = middle - (size * lineGap * (lines.length - 1)) / 2 + size * 0.36;
  squeezedLines(context, lines, [width / 2, first], size * lineGap, SQUEEZE);
};

export const drawCover = (
  context: Context,
  copy: PageCopy,
  photo: CanvasImageSource | null,
  [width, height]: [number, number],
) => {
  masthead(context, copy, width, height);
  const box: Box = { x: 0, y: height * 0.104, width, height: height * 0.896 };
  if (photo === null) {
    placeholderImage(context, box, copy.ink.text);
  } else {
    coverImage(context, photo, box, { focus: copy.cover.photoFocus, zoom: copy.cover.photoZoom });
  }
  tint(context, copy, box);
  context.fillStyle = copy.ink.text;
  rule(context, width * 0.05, height * 0.915, width * 0.9, 1.5);
  rule(context, width * 0.05, height * 0.924, width * 0.9, 4);
  headline(context, copy, width, height);
};
