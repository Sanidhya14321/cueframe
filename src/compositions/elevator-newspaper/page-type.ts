import { serifFont } from './page-fonts';

export type Context = CanvasRenderingContext2D;

export type Box = { x: number; y: number; width: number; height: number };

export const SQUEEZE = 0.78;

export const linesOf = (text: string): string[] =>
  text.split('\n').filter((line) => line.trim().length > 0);

export const serif = (context: Context, size: number, weight = 900, style = 'normal') => {
  context.font = `${style} ${weight} ${size}px "${serifFont}"`;
};

export const tracked = (context: Context, size: number, tracking: number) => {
  context.letterSpacing = `${size * tracking}px`;
};

export const widest = (context: Context, lines: string[]) =>
  Math.max(1, ...lines.map((line) => context.measureText(line).width));

export const squeezedLines = (
  context: Context,
  lines: string[],
  [x, y]: [number, number],
  lineGap: number,
  squeeze = SQUEEZE,
) => {
  lines.forEach((line, index) => {
    context.save();
    context.translate(x, y + index * lineGap);
    context.scale(squeeze, 1);
    context.fillText(line, 0, 0);
    context.restore();
  });
};

export const fittedSize = (
  context: Context,
  lines: string[],
  size: number,
  room: { width: number; height: number; lineGap: number },
  setFont: (fontSize: number) => void,
  squeeze = SQUEEZE,
) => {
  setFont(size);
  const byWidth = (size * room.width) / (widest(context, lines) * squeeze);
  const byHeight = room.height / (0.72 + room.lineGap * Math.max(0, lines.length - 1));
  return Math.min(size, byWidth, byHeight);
};

export const wrap = (context: Context, text: string, width: number): string[] =>
  text.split('\n').flatMap((paragraph) => {
    const lines: string[] = [];
    let current = '';
    for (const word of paragraph.split(/\s+/).filter((part) => part.length > 0)) {
      const next = current === '' ? word : `${current} ${word}`;
      if (context.measureText(next).width > width && current !== '') {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    return current === '' ? lines : [...lines, current];
  });

export const rule = (context: Context, x: number, y: number, width: number, weight: number) => {
  context.fillRect(x, y - weight / 2, width, weight);
};

export const diamond = (context: Context, x: number, y: number, radius: number) => {
  context.beginPath();
  context.moveTo(x, y - radius);
  context.lineTo(x + radius, y);
  context.lineTo(x, y + radius);
  context.lineTo(x - radius, y);
  context.closePath();
  context.fill();
};

export const coverImage = (
  context: Context,
  image: CanvasImageSource,
  box: Box,
  { focus = 0.5, zoom = 1 }: { focus?: number; zoom?: number } = {},
) => {
  const source = image as { width: number; height: number };
  const scale = Math.max(box.width / source.width, box.height / source.height) * zoom;
  const width = source.width * scale;
  const height = source.height * scale;
  context.save();
  context.beginPath();
  context.rect(box.x, box.y, box.width, box.height);
  context.clip();
  context.drawImage(
    image,
    box.x + (box.width - width) / 2,
    box.y + (box.height - height) * focus,
    width,
    height,
  );
  context.restore();
};

export const placeholderImage = (context: Context, box: Box, color: string) => {
  context.save();
  context.fillStyle = color;
  context.globalAlpha = 0.18;
  context.fillRect(box.x, box.y, box.width, box.height);
  context.restore();
};
