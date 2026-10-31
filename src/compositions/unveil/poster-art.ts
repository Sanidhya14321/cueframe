import type { BillboardPoster } from '@/schemas';
import { bodyFont, bodyFontReady, displayFont, displayFontReady } from '../promo/fonts';

const POSTER_WIDTH = 1200;
const POSTER_HEIGHT = 1600;
export const POSTER_ASPECT = POSTER_WIDTH / POSTER_HEIGHT;

let fontsLoaded = false;
let fontsLoading: Promise<void> | undefined;

const loadPosterFonts = (): Promise<void> => {
  fontsLoading ??= Promise.all([displayFontReady(), bodyFontReady()])
    .then(() =>
      Promise.all([
        document.fonts.load(`700 200px "${displayFont}"`),
        document.fonts.load(`600 60px "${displayFont}"`),
        document.fonts.load(`500 40px "${bodyFont}"`),
        document.fonts.load(`600 40px "${bodyFont}"`),
      ]),
    )
    .then(() => {
      fontsLoaded = true;
    });
  return fontsLoading;
};

export const usePosterFonts = (): void => {
  if (!fontsLoaded) {
    throw loadPosterFonts();
  }
};

const MARGIN = 96;

const spaced = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
): number => {
  let cursor = x;
  for (const letter of text) {
    context.fillText(letter, cursor, y);
    cursor += context.measureText(letter).width + tracking;
  }
  return cursor - tracking;
};

const drawSun = (context: CanvasRenderingContext2D, poster: BillboardPoster): void => {
  const centerX = POSTER_WIDTH - 330;
  const centerY = 560;
  context.save();
  context.beginPath();
  context.rect(0, 0, POSTER_WIDTH, centerY + 40);
  context.clip();
  const bands = [poster.accentSoft, poster.accent, poster.paper, poster.accent, poster.paper];
  bands.forEach((color, index) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(centerX, centerY, 300 - index * 50, Math.PI, 0);
    context.closePath();
    context.fill();
  });
  context.fillStyle = poster.accent;
  context.beginPath();
  context.arc(centerX, centerY, 64, Math.PI, 0);
  context.fill();
  context.restore();
  context.fillStyle = poster.ink;
  context.fillRect(centerX - 360, centerY + 40, 720, 8);
};

const drawHeadline = (context: CanvasRenderingContext2D, poster: BillboardPoster): number => {
  const lines = poster.headline.split('\n').filter((line) => line.length > 0);
  const size = lines.length > 2 ? 190 : 250;
  context.font = `700 ${size}px "${displayFont}"`;
  context.textBaseline = 'alphabetic';
  let y = 640 + size * 0.85;
  lines.forEach((line, index) => {
    context.fillStyle = index === lines.length - 1 && lines.length > 1 ? poster.accent : poster.ink;
    spaced(context, line, MARGIN - 8, y, -size * 0.045);
    y += size * 0.9;
  });
  return y - size * 0.9;
};

const drawDetails = (context: CanvasRenderingContext2D, poster: BillboardPoster, top: number) => {
  const items = poster.details
    .split('\n')
    .filter((line) => line.length > 0)
    .slice(0, 4);
  const columnWidth = (POSTER_WIDTH - MARGIN * 2) / Math.max(1, items.length);
  context.fillStyle = poster.ink;
  context.fillRect(MARGIN, top, POSTER_WIDTH - MARGIN * 2, 4);
  context.font = `600 44px "${bodyFont}"`;
  items.forEach((item, index) => {
    const x = MARGIN + index * columnWidth;
    context.fillStyle = poster.accent;
    context.beginPath();
    context.arc(x + 14, top + 72, 14, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = poster.ink;
    context.fillText(item, x + 44, top + 88);
  });
};

export const drawPoster = (canvas: HTMLCanvasElement, poster: BillboardPoster): void => {
  canvas.width = POSTER_WIDTH;
  canvas.height = POSTER_HEIGHT;
  const context = canvas.getContext('2d');
  if (context === null) {
    return;
  }
  context.fillStyle = poster.paper;
  context.fillRect(0, 0, POSTER_WIDTH, POSTER_HEIGHT);
  drawSun(context, poster);
  context.fillStyle = poster.ink;
  context.font = `600 40px "${bodyFont}"`;
  context.textBaseline = 'alphabetic';
  spaced(context, poster.eyebrow.toUpperCase(), MARGIN, MARGIN + 40, 9);
  const headlineBottom = drawHeadline(context, poster);
  context.fillStyle = poster.ink;
  context.font = `600 64px "${displayFont}"`;
  spaced(context, poster.subline, MARGIN, headlineBottom + 130, -1);
  drawDetails(context, poster, POSTER_HEIGHT - 330);
  context.fillStyle = poster.ink;
  context.fillRect(0, POSTER_HEIGHT - 120, POSTER_WIDTH, 120);
  context.fillStyle = poster.paper;
  context.font = `500 38px "${bodyFont}"`;
  spaced(context, poster.footer, MARGIN, POSTER_HEIGHT - 47, 1);
};
