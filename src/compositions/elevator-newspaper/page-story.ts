import type { PageCopy } from './page-layout';
import {
  type Box,
  type Context,
  coverImage,
  diamond,
  fittedSize,
  linesOf,
  placeholderImage,
  rule,
  SQUEEZE,
  serif,
  squeezedLines,
  tracked,
  widest,
  wrap,
} from './page-type';

type Size = [number, number];

const header = (context: Context, copy: PageCopy, [width, height]: Size) => {
  context.fillStyle = copy.ink.text;
  rule(context, width * 0.03, height * 0.083, width * 0.94, 1.5);
  rule(context, width * 0.03, height * 0.162, width * 0.94, 1.5);
  for (const x of [0.25, 0.75]) {
    context.fillRect(width * x - 0.75, height * 0.093, 1.5, height * 0.059);
  }
  const brandSize = height * 0.04;
  serif(context, brandSize, 500);
  tracked(context, brandSize, 0.1);
  context.textAlign = 'center';
  context.fillText(copy.masthead.brand, width / 2 + brandSize * 0.05, height * 0.134, width * 0.46);
  tracked(context, brandSize, 0);
  const edition = linesOf(copy.masthead.edition);
  const editionSize = height * 0.014;
  serif(context, editionSize, 500, 'italic');
  tracked(context, editionSize, 0.12);
  for (const x of [0.14, 0.86]) {
    edition.forEach((line, index) => {
      const y =
        height * 0.122 +
        (index - (edition.length - 1) / 2) * editionSize * 1.25 +
        editionSize * 0.35;
      context.fillText(line, width * x, y, width * 0.18);
    });
  }
  tracked(context, editionSize, 0);
};

const band = (context: Context, copy: PageCopy, [width, height]: Size, top: number) => {
  const bandHeight = height * 0.04;
  context.fillStyle = copy.ink.band;
  context.fillRect(width * 0.03, top, width * 0.94, bandHeight);
  context.fillStyle = copy.ink.bandText;
  const size = bandHeight * 0.5;
  serif(context, size, 800);
  tracked(context, size, 0.06);
  context.textAlign = 'center';
  const baseline = top + bandHeight / 2 + size * 0.36;
  for (const slot of [0.18, 0.5, 0.82]) {
    squeezedLines(context, [copy.story.footer], [width * slot, baseline], 0, SQUEEZE);
  }
  tracked(context, size, 0);
  for (const slot of [1 / 3, 2 / 3]) {
    diamond(context, width * slot, top + bandHeight / 2, size * 0.22);
  }
};

const headline = (context: Context, copy: PageCopy, [width, height]: Size) => {
  const lines = linesOf(copy.story.headline);
  const lineGap = 0.92;
  const setFont = (fontSize: number) => serif(context, fontSize, 900);
  const size = fittedSize(
    context,
    lines,
    height * 0.172 * copy.story.headlineSize,
    { width: width * 0.94, height: height * 0.17, lineGap },
    setFont,
  );
  setFont(size);
  context.fillStyle = copy.ink.text;
  context.textAlign = 'center';
  const last = height * 0.385;
  squeezedLines(
    context,
    lines,
    [width / 2, last - size * lineGap * (lines.length - 1)],
    size * lineGap,
  );
  rule(context, width * 0.03, height * 0.424, width * 0.94, 1.5);
  const subSize = height * 0.019;
  serif(context, subSize, 800);
  tracked(context, subSize, 0.04);
  const room = width * 0.86;
  const fit = Math.min(1, room / (widest(context, [copy.story.subhead]) * SQUEEZE));
  context.save();
  context.translate(width / 2, height * 0.459);
  context.scale(SQUEEZE * fit, 1);
  context.fillText(copy.story.subhead, 0, 0);
  context.restore();
  tracked(context, subSize, 0);
  rule(context, width * 0.05, height * 0.478, width * 0.9, 1.5);
  diamond(context, width * 0.035, height * 0.478, 5);
  diamond(context, width * 0.965, height * 0.478, 5);
};

const column = (context: Context, copy: PageCopy, box: Box, title: string, body: string) => {
  const boxHeight = box.height * 0.2;
  context.strokeStyle = copy.ink.text;
  context.lineWidth = 2;
  context.strokeRect(box.x, box.y, box.width, boxHeight);
  const lines = linesOf(title);
  const setFont = (fontSize: number) => serif(context, fontSize, 800);
  const size = fittedSize(
    context,
    lines,
    box.width * 0.2,
    { width: box.width * 0.86, height: boxHeight * 0.8, lineGap: 1 },
    setFont,
  );
  setFont(size);
  context.fillStyle = copy.ink.text;
  context.textAlign = 'center';
  const first = box.y + boxHeight / 2 - (size * (lines.length - 1)) / 2 + size * 0.36;
  squeezedLines(context, lines, [box.x + box.width / 2, first], size);
  const bodySize = box.width * 0.085;
  serif(context, bodySize, 500, 'italic');
  context.textAlign = 'left';
  const lineHeight = bodySize * 1.32;
  const top = box.y + boxHeight + bodySize * 1.6;
  const rows = Math.floor((box.y + box.height - top) / lineHeight) + 1;
  wrap(context, body, box.width)
    .slice(0, rows)
    .forEach((line, index) => {
      context.fillText(line, box.x, top + index * lineHeight, box.width);
    });
};

const photo = (context: Context, copy: PageCopy, image: CanvasImageSource | null, box: Box) => {
  if (image === null) {
    placeholderImage(context, box, copy.ink.text);
  } else {
    coverImage(context, image, box);
  }
  const lines = linesOf(copy.story.caption);
  const size = box.width * 0.075;
  serif(context, size, 800);
  context.fillStyle = copy.ink.text;
  context.textAlign = 'left';
  squeezedLines(context, lines, [box.x + box.width * 0.56, box.y + box.height * 0.4], size * 1.08);
};

export const drawStory = (
  context: Context,
  copy: PageCopy,
  image: CanvasImageSource | null,
  size: Size,
) => {
  const [width, height] = size;
  header(context, copy, size);
  band(context, copy, size, height * 0.174);
  headline(context, copy, size);
  const top = height * 0.493;
  const bottom = height * 0.832;
  const gutter = width * 0.025;
  const side = width * 0.22;
  column(
    context,
    copy,
    { x: width * 0.03, y: top, width: side, height: bottom - top },
    copy.story.teaserTitle,
    copy.story.teaser,
  );
  photo(context, copy, image, {
    x: width * 0.03 + side + gutter,
    y: top,
    width: width * 0.94 - 2 * (side + gutter),
    height: bottom - top,
  });
  column(
    context,
    copy,
    { x: width * 0.97 - side, y: top, width: side, height: bottom - top },
    copy.story.sidebarTitle,
    copy.story.sidebar,
  );
  band(context, copy, size, height * 0.848);
  context.fillStyle = copy.ink.text;
  rule(context, width * 0.03, height * 0.902, width * 0.94, 1.5);
};
