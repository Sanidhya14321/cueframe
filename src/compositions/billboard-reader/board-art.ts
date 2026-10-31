import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import type { ReaderBoard } from '@/schemas';
import { bodyFont, bodyFontReady, displayFont, displayFontReady } from '../promo/fonts';

const ART_WIDTH = 2400;
const ART_HEIGHT = 1440;

const oswald = loadOswald('normal', { weights: ['500', '600', '700'], subsets: ['latin'] });

export const condensedFont = oswald.fontFamily;

let fontsLoaded = false;
let fontsLoading: Promise<void> | undefined;

const loadArtFonts = (): Promise<void> => {
  fontsLoading ??= Promise.all([oswald.waitUntilDone(), bodyFontReady(), displayFontReady()])
    .then(() =>
      Promise.all([
        document.fonts.load(`600 200px "${condensedFont}"`),
        document.fonts.load(`700 80px "${condensedFont}"`),
        document.fonts.load(`700 200px "${displayFont}"`),
        document.fonts.load(`500 40px "${bodyFont}"`),
        document.fonts.load(`700 40px "${bodyFont}"`),
      ]),
    )
    .then(() => {
      fontsLoaded = true;
    });
  return fontsLoading;
};

export const useArtFonts = (): void => {
  if (!fontsLoaded) {
    throw loadArtFonts();
  }
};

const linesOf = (text: string): string[] => text.split('\n').filter((line) => line.length > 0);

const MARGIN = ART_WIDTH * 0.075;

const drawHeadline = (context: CanvasRenderingContext2D, board: ReaderBoard): number => {
  const lines = linesOf(board.headline);
  if (lines.length === 0) {
    return ART_HEIGHT * 0.6;
  }
  const maxWidth = (ART_WIDTH - MARGIN * 2) * board.textWidth;
  let size = 330 * board.headlineSize * (lines.length > 2 ? 0.74 : 1);
  const setFont = () => {
    context.font = `700 ${size}px "${displayFont}"`;
    context.letterSpacing = `${-size * 0.035}px`;
  };
  setFont();
  const widest = Math.max(...lines.map((line) => context.measureText(line).width));
  if (widest > maxWidth) {
    size *= maxWidth / widest;
    setFont();
  }
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
  const lineGap = size * 0.98;
  const blockHeight = lineGap * (lines.length - 1) + size * 0.72;
  const firstBaseline = ART_HEIGHT * 0.52 - blockHeight / 2 + size * 0.72;
  lines.forEach((line, index) => {
    const accent = board.highlightLastLine && lines.length > 1 && index === lines.length - 1;
    context.fillStyle = accent ? board.accentColor : board.headlineColor;
    context.fillText(line, MARGIN - size * 0.03, firstBaseline + index * lineGap);
  });
  context.letterSpacing = '0px';
  return firstBaseline + (lines.length - 1) * lineGap;
};

const drawCorners = (context: CanvasRenderingContext2D, color: string): void => {
  const inset = 64;
  const arm = 150;
  context.strokeStyle = color;
  context.lineWidth = 14;
  context.lineCap = 'butt';
  context.lineJoin = 'miter';
  context.beginPath();
  context.moveTo(inset, inset + arm);
  context.lineTo(inset, inset);
  context.lineTo(inset + arm, inset);
  context.moveTo(ART_WIDTH - inset, ART_HEIGHT - inset - arm);
  context.lineTo(ART_WIDTH - inset, ART_HEIGHT - inset);
  context.lineTo(ART_WIDTH - inset - arm, ART_HEIGHT - inset);
  context.stroke();
};

const drawTagline = (context: CanvasRenderingContext2D, board: ReaderBoard, top: number): void => {
  const lines = linesOf(board.tagline);
  const ruleY = top + 60;
  context.fillStyle = board.accentColor;
  context.fillRect(MARGIN, ruleY, 190, 16);
  context.font = `500 64px "${bodyFont}"`;
  context.fillStyle = board.taglineColor;
  context.textAlign = 'left';
  lines.forEach((line, index) => {
    context.fillText(line, MARGIN, ruleY + 100 + index * 78);
  });
};

const drawMark = (context: CanvasRenderingContext2D, x: number, y: number, color: string) => {
  const outer = 40;
  const inner = 11;
  context.fillStyle = color;
  context.beginPath();
  for (let point = 0; point < 8; point++) {
    const angle = (point / 8) * Math.PI * 2 - Math.PI / 2;
    const radius = point % 2 === 0 ? outer : inner;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (point === 0) {
      context.moveTo(px, py);
    } else {
      context.lineTo(px, py);
    }
  }
  context.closePath();
  context.fill();
};

const drawBrand = (context: CanvasRenderingContext2D, board: ReaderBoard): void => {
  const lines = linesOf(board.brand);
  context.save();
  context.translate(ART_WIDTH * 0.71, ART_HEIGHT * 0.8);
  context.scale(2, 2);
  drawMark(context, 0, 0, board.markColor);
  context.font = `700 40px "${displayFont}"`;
  context.letterSpacing = '4px';
  context.fillStyle = board.brandColor;
  context.textAlign = 'left';
  const top = -((lines.length - 1) * 44) / 2 + 14;
  lines.forEach((line, index) => {
    context.fillText(line, 62, top + index * 44);
  });
  context.restore();
};

export const drawBoardArt = (canvas: HTMLCanvasElement, board: ReaderBoard): void => {
  canvas.width = ART_WIDTH;
  canvas.height = ART_HEIGHT;
  const context = canvas.getContext('2d');
  if (context === null) {
    return;
  }
  context.fillStyle = board.paper;
  context.fillRect(0, 0, ART_WIDTH, ART_HEIGHT);
  const sheen = context.createLinearGradient(0, 0, ART_WIDTH, ART_HEIGHT);
  sheen.addColorStop(0, 'rgba(255,255,255,0.07)');
  sheen.addColorStop(0.6, 'rgba(255,255,255,0)');
  sheen.addColorStop(1, 'rgba(0,0,0,0.12)');
  context.fillStyle = sheen;
  context.fillRect(0, 0, ART_WIDTH, ART_HEIGHT);
  drawCorners(context, board.accentColor);
  const lastBaseline = drawHeadline(context, board);
  drawTagline(context, board, lastBaseline);
  drawBrand(context, board);
};
