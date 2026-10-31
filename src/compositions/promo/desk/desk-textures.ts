import { KEYBOARD_WIDTH, type KeySpec, LAPTOP } from './laptop-geometry';

export const SCREEN_CANVAS = { width: 2048, height: 1280 } as const;

export interface ScreenArt {
  background: string;
  wordmark: string;
  wordmarkColor: string;
  accent: string;
  showMark: boolean;
  caption: string;
  captionColor: string;
  size: number;
  font: string;
}

export const drawScreen = (context: CanvasRenderingContext2D, art: ScreenArt): void => {
  const { width, height } = SCREEN_CANVAS;
  context.fillStyle = art.background;
  context.fillRect(0, 0, width, height);
  const fontPx = art.size;
  context.font = `600 ${fontPx}px "${art.font}"`;
  context.textBaseline = 'alphabetic';
  const textWidth = context.measureText(art.wordmark).width;
  const markSize = art.showMark ? fontPx * 0.78 : 0;
  const gap = art.showMark ? fontPx * 0.28 : 0;
  const total = markSize + gap + textWidth;
  const left = (width - total) / 2;
  const baseline = height / 2 + fontPx * 0.34 - (art.caption.length > 0 ? fontPx * 0.22 : 0);
  if (art.showMark) {
    const centerX = left + markSize / 2;
    const centerY = baseline - fontPx * 0.36;
    context.lineWidth = markSize * 0.17;
    context.strokeStyle = art.accent;
    context.beginPath();
    context.arc(centerX, centerY, markSize / 2 - context.lineWidth / 2, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = art.accent;
    context.beginPath();
    context.arc(
      centerX + markSize * 0.36,
      centerY - markSize * 0.36,
      markSize * 0.1,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.fillStyle = art.wordmarkColor;
  context.save();
  context.letterSpacing = `${-0.045 * fontPx}px`;
  context.fillText(art.wordmark, left + markSize + gap, baseline);
  context.restore();
  if (art.caption.length > 0) {
    const captionPx = fontPx * 0.19;
    context.font = `500 ${captionPx}px "${art.font}"`;
    context.fillStyle = art.captionColor;
    context.textAlign = 'center';
    context.save();
    context.letterSpacing = `${0.22 * captionPx}px`;
    context.fillText(art.caption.toUpperCase(), width / 2, baseline + fontPx * 0.62);
    context.restore();
    context.textAlign = 'left';
  }
};

export const KEY_CANVAS = { width: 2048, height: 1024 } as const;

export const drawKeyLegends = (
  context: CanvasRenderingContext2D,
  keys: KeySpec[],
  depth: number,
  font: string,
): void => {
  const scaleX = KEY_CANVAS.width / KEYBOARD_WIDTH;
  const scaleY = KEY_CANVAS.height / depth;
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  for (const key of keys) {
    if (key.label.length === 0) {
      continue;
    }
    const x = (key.x + KEYBOARD_WIDTH / 2) * scaleX;
    const y = (key.z - LAPTOP.keyboardBack) * scaleY;
    const single = key.label.length === 1;
    const px = single ? 44 : 26;
    context.font = `500 ${px}px "${font}"`;
    if (single) {
      context.fillText(key.label, x, y);
    } else {
      context.textAlign = 'left';
      context.fillText(
        key.label,
        x - (key.width / 2) * scaleX + 18,
        y + (key.depth / 2) * scaleY - 28,
      );
      context.textAlign = 'center';
    }
  }
};

export const CLOTH_CANVAS = { width: 1024, height: 1024 } as const;

const hash = (x: number, y: number): number => {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const drawCrease = (context: CanvasRenderingContext2D, vertical: boolean): void => {
  const { width, height } = CLOTH_CANVAS;
  const along = vertical ? width : height;
  const gradient = vertical
    ? context.createLinearGradient(along / 2 - 14, 0, along / 2 + 14, 0)
    : context.createLinearGradient(0, along / 2 - 14, 0, along / 2 + 14);
  gradient.addColorStop(0, 'rgba(255,255,255,0)');
  gradient.addColorStop(0.42, 'rgba(255,255,255,0.35)');
  gradient.addColorStop(0.55, 'rgba(110,100,90,0.16)');
  gradient.addColorStop(1, 'rgba(110,100,90,0)');
  context.fillStyle = gradient;
  if (vertical) {
    context.fillRect(along / 2 - 14, 0, 28, height);
  } else {
    context.fillRect(0, along / 2 - 14, width, 28);
  }
};

export const drawClothWeave = (context: CanvasRenderingContext2D, paper: string): void => {
  const { width, height } = CLOTH_CANVAS;
  context.fillStyle = paper;
  context.fillRect(0, 0, width, height);
  const cell = 26;
  for (let row = -1; row < height / cell + 1; row++) {
    for (let column = -1; column < width / cell + 1; column++) {
      const x = column * cell + (row % 2 === 0 ? 0 : cell / 2);
      const y = row * cell;
      const jitter = hash(row, column);
      const gradient = context.createRadialGradient(x - 3, y - 3, 1, x, y, cell * 0.62);
      gradient.addColorStop(0, `rgba(255,255,255,${0.35 + jitter * 0.15})`);
      gradient.addColorStop(0.6, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, `rgba(150,140,130,${0.05 + jitter * 0.03})`);
      context.fillStyle = gradient;
      context.fillRect(x - cell, y - cell, cell * 2, cell * 2);
    }
  }
  for (let fiber = 0; fiber < 900; fiber++) {
    const x = hash(fiber, 1) * width;
    const y = hash(fiber, 2) * height;
    const angle = hash(fiber, 3) * Math.PI * 2;
    const length = 6 + hash(fiber, 4) * 18;
    context.strokeStyle = `rgba(150,140,130,${0.05 + hash(fiber, 5) * 0.08})`;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    context.stroke();
  }
  drawCrease(context, true);
  drawCrease(context, false);
};

export interface ClothNote {
  text: string;
  ink: string;
  font: string;
  size: number;
  tilt: number;
  bleed: number;
}

export const drawClothNote = (
  context: CanvasRenderingContext2D,
  paper: string,
  note: ClothNote,
): void => {
  drawClothWeave(context, paper);
  const { width, height } = CLOTH_CANVAS;
  const lines = note.text.split('\n');
  const lineHeight = note.size * 1.05;
  context.save();
  context.translate(width / 2, height / 2);
  context.rotate(note.tilt);
  context.font = `${note.size}px "${note.font}"`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = note.ink;
  const top = -((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    const y = top + index * lineHeight;
    const wobble = (hash(index, 9) - 0.5) * note.size * 0.18;
    context.filter = `blur(${note.bleed * 2.4}px)`;
    context.globalAlpha = 0.5;
    context.fillText(line, wobble, y);
    context.filter = 'none';
    context.globalAlpha = 0.92;
    context.fillText(line, wobble, y);
  });
  context.restore();
  context.globalAlpha = 1;
};
