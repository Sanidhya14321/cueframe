import type { SpillRevealProps } from '@/schemas';

export const MESSAGE_CANVAS = 1024;

const SPECKS = 1300;

const speck = (index: number, salt: number): number => {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export const drawMessage = (
  context: CanvasRenderingContext2D,
  message: SpillRevealProps['message'],
  font: string,
  mirror: boolean,
): void => {
  const size = MESSAGE_CANVAS;
  const scale = size / 1024;
  const lines = message.text.split('\n').filter((line) => line.trim().length > 0);
  const fontSize = message.size * scale;
  const leading = fontSize * message.lineSpacing;
  context.save();
  context.translate(size * (0.5 + message.offsetX), size * (0.5 + message.offsetY));
  context.scale(mirror ? -1 : 1, 1);
  context.rotate(message.tilt);
  context.font = `800 ${fontSize}px "${font}"`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = 'rgba(0,0,0,1)';
  context.shadowColor = 'rgba(0,0,0,0.9)';
  context.shadowBlur = message.bleed * 22 * scale;
  lines.forEach((line, index) => {
    const y = (index - (lines.length - 1) / 2) * leading;
    context.fillText(line, 0, y, size * 0.92);
  });
  context.restore();
  context.save();
  context.globalCompositeOperation = 'destination-out';
  for (let index = 0; index < SPECKS; index++) {
    context.fillStyle = `rgba(0,0,0,${0.25 + speck(index, 3) * 0.45})`;
    const radius = (1 + speck(index, 4) * 2.4) * scale;
    context.beginPath();
    context.arc(speck(index, 1) * size, speck(index, 2) * size, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
};
