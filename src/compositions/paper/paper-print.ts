import { seeded } from '../unveil/random';

export interface PaperPrint {
  headline: string;
  footer: string;
  footerSize: number;
  footerY: number;
  ink: string;
  paper: string;
  size: number;
  lineHeight: number;
  condense: number;
  tilt: number;
  indent: number;
  centerX: number;
  centerY: number;
  fiber: number;
}

export const PRINT_WIDTH = 1500;

export const printHeight = (width: number, height: number): number =>
  Math.round((PRINT_WIDTH * height) / width);

const drawFibers = (context: CanvasRenderingContext2D, height: number, amount: number) => {
  const random = seeded(311);
  for (let index = 0; index < 5200; index++) {
    const x = random() * PRINT_WIDTH;
    const y = random() * height;
    const angle = random() * Math.PI;
    const length = 2 + random() * 9;
    const dark = random() < 0.55;
    context.strokeStyle = dark
      ? `rgba(90, 80, 70, ${0.05 * amount})`
      : `rgba(255, 255, 255, ${0.25 * amount})`;
    context.lineWidth = 0.6 + random() * 0.8;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    context.stroke();
  }
};

export const drawPaperPrint = (
  context: CanvasRenderingContext2D,
  height: number,
  print: PaperPrint,
  serif: string,
  sans: string,
): void => {
  context.fillStyle = print.paper;
  context.fillRect(0, 0, PRINT_WIDTH, height);
  drawFibers(context, height, print.fiber);
  const lines = print.headline.split('\n');
  const lineHeight = print.size * print.lineHeight;
  context.save();
  context.translate(PRINT_WIDTH * print.centerX, height * print.centerY);
  context.rotate(print.tilt);
  context.scale(print.condense, 1);
  context.fillStyle = print.ink;
  context.textBaseline = 'middle';
  context.font = `400 ${print.size}px "${serif}"`;
  const widest = Math.max(...lines.map((line) => context.measureText(line).width));
  const shift = widest * print.indent;
  const left = -(widest + shift * (lines.length - 1) * 0.5) / 2;
  lines.forEach((line, index) => {
    context.fillText(line, left + shift * index, (index - (lines.length - 1) / 2) * lineHeight);
  });
  context.restore();
  if (print.footer.length > 0) {
    context.fillStyle = print.ink;
    context.globalAlpha = 0.8;
    context.font = `500 ${Math.round(print.size * print.footerSize)}px "${sans}"`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.letterSpacing = `${Math.round(print.size * 0.05)}px`;
    context.fillText(print.footer, PRINT_WIDTH / 2, height * print.footerY);
    context.globalAlpha = 1;
  }
};
