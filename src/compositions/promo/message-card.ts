import * as THREE from 'three';
import type { AriseMessage, MessageAriseProps } from '@/schemas';
import { bodyFont, bodyFontReady } from './fonts';

export type CardStyle = MessageAriseProps['card'];

export const CARD_PX = 1000;

const MARGIN = 80;
const ICON = 46;
const HEADER_FONT = 27;
const SENDER_FONT = 35;
const BODY_FONT = 35;
const LINE = 1.34;
const HEADER_GAP = 18;
const BASE_PAD = 38;

let fontReady = false;
let fontLoading: Promise<void> | undefined;

export const useCardFont = (): void => {
  if (fontReady) {
    return;
  }
  fontLoading ??= bodyFontReady()
    .then(() =>
      Promise.all(
        ['400', '500', '600'].map((weight) => document.fonts.load(`${weight} 40px "${bodyFont}"`)),
      ),
    )
    .then(() => {
      fontReady = true;
    });
  throw fontLoading;
};

interface Metrics {
  pad: number;
  icon: number;
  header: number;
  sender: number;
  body: number;
  headerHeight: number;
  senderHeight: number;
  bodyLine: number;
}

const metricsOf = (style: CardStyle): Metrics => {
  const scale = style.fontScale;
  return {
    pad: BASE_PAD * style.padding,
    icon: ICON * scale,
    header: HEADER_FONT * scale,
    sender: SENDER_FONT * scale,
    body: BODY_FONT * scale,
    headerHeight: style.showHeader ? ICON * scale + HEADER_GAP * scale : 0,
    senderHeight: style.showSender ? SENDER_FONT * scale * LINE : 0,
    bodyLine: BODY_FONT * scale * LINE,
  };
};

let measurer: CanvasRenderingContext2D | null = null;

const measureContext = (): CanvasRenderingContext2D | null => {
  measurer ??= document.createElement('canvas').getContext('2d');
  return measurer;
};

const ellipsize = (context: CanvasRenderingContext2D, text: string, width: number): string => {
  let result = text;
  while (result.length > 0 && context.measureText(`${result}…`).width > width) {
    result = result.slice(0, -1).trimEnd();
  }
  return `${result}…`;
};

const wrap = (
  context: CanvasRenderingContext2D,
  text: string,
  width: number,
  maxLines: number,
): string[] => {
  const lines: string[] = [];
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  let current = '';
  for (const [index, word] of words.entries()) {
    const candidate = current.length === 0 ? word : `${current} ${word}`;
    if (context.measureText(candidate).width <= width || current.length === 0) {
      current = candidate;
      continue;
    }
    if (lines.length === maxLines - 1) {
      return [...lines, ellipsize(context, `${current} ${words.slice(index).join(' ')}`, width)];
    }
    lines.push(current);
    current = word;
  }
  return current.length > 0 ? [...lines, current] : lines;
};

export interface CardLayout {
  lines: string[];
  heightPx: number;
}

export const layoutCard = (message: AriseMessage, style: CardStyle): CardLayout => {
  const metrics = metricsOf(style);
  const context = measureContext();
  if (context === null) {
    return { lines: [message.text], heightPx: metrics.pad * 2 + metrics.bodyLine };
  }
  context.font = `400 ${metrics.body}px "${bodyFont}"`;
  const lines = wrap(context, message.text, CARD_PX - metrics.pad * 2, style.maxLines);
  const heightPx =
    metrics.pad * 2 +
    metrics.headerHeight +
    metrics.senderHeight +
    Math.max(1, lines.length) * metrics.bodyLine;
  return { lines, heightPx };
};

const roundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath();
  context.roundRect(x, y, width, height, Math.min(radius, height / 2, width / 2));
};

const drawIcon = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) => {
  context.fillStyle = color;
  roundedRect(context, x, y, size, size, size * 0.26);
  context.fill();
  context.fillStyle = '#ffffff';
  context.beginPath();
  context.ellipse(x + size / 2, y + size * 0.47, size * 0.32, size * 0.25, 0, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.moveTo(x + size * 0.3, y + size * 0.6);
  context.lineTo(x + size * 0.22, y + size * 0.8);
  context.lineTo(x + size * 0.44, y + size * 0.68);
  context.closePath();
  context.fill();
};

const textX = (align: CardStyle['textAlign'], pad: number): number =>
  align === 'left' ? pad : align === 'right' ? CARD_PX - pad : CARD_PX / 2;

const drawContent = (
  context: CanvasRenderingContext2D,
  message: AriseMessage,
  layout: CardLayout,
  style: CardStyle,
) => {
  const metrics = metricsOf(style);
  let y = metrics.pad;
  context.textBaseline = 'middle';
  if (style.showHeader) {
    drawIcon(context, metrics.pad, y, metrics.icon, style.icon);
    context.font = `500 ${metrics.header}px "${bodyFont}"`;
    context.fillStyle = style.muted;
    context.textAlign = 'left';
    context.letterSpacing = `${metrics.header * 0.06}px`;
    context.fillText(
      style.appName.toUpperCase(),
      metrics.pad + metrics.icon + 18,
      y + metrics.icon / 2,
    );
    context.letterSpacing = '0px';
    context.textAlign = 'right';
    context.fillText(message.time, CARD_PX - metrics.pad, y + metrics.icon / 2);
    y += metrics.headerHeight;
  }
  const x = textX(style.textAlign, metrics.pad);
  context.textAlign = style.textAlign;
  context.fillStyle = style.text;
  if (style.showSender) {
    context.font = `600 ${metrics.sender}px "${bodyFont}"`;
    context.fillText(message.sender, x, y + metrics.senderHeight / 2);
    y += metrics.senderHeight;
  }
  context.font = `400 ${metrics.body}px "${bodyFont}"`;
  for (const line of layout.lines) {
    context.fillText(line, x, y + metrics.bodyLine / 2);
    y += metrics.bodyLine;
  }
};

export const drawCard = (
  canvas: HTMLCanvasElement,
  message: AriseMessage,
  layout: CardLayout,
  style: CardStyle,
): void => {
  canvas.width = CARD_PX + MARGIN * 2;
  canvas.height = Math.ceil(layout.heightPx) + MARGIN * 2;
  const context = canvas.getContext('2d');
  if (context === null) {
    return;
  }
  const radius = style.radius * Math.min(layout.heightPx, 260);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.shadowColor = `rgba(0, 0, 0, ${0.32 * style.shadow})`;
  context.shadowBlur = 46;
  context.shadowOffsetY = 18;
  context.fillStyle = '#000000';
  roundedRect(context, MARGIN, MARGIN, CARD_PX, layout.heightPx, radius);
  context.fill();
  context.restore();
  context.save();
  context.globalCompositeOperation = 'destination-out';
  roundedRect(context, MARGIN, MARGIN, CARD_PX, layout.heightPx, radius);
  context.fill();
  context.restore();
  context.save();
  context.globalAlpha = style.fillOpacity;
  context.fillStyle = style.fill;
  roundedRect(context, MARGIN, MARGIN, CARD_PX, layout.heightPx, radius);
  context.fill();
  context.globalAlpha = style.border * 0.35;
  context.strokeStyle = style.muted;
  context.lineWidth = 2;
  roundedRect(context, MARGIN + 1, MARGIN + 1, CARD_PX - 2, layout.heightPx - 2, radius);
  context.stroke();
  context.restore();
  context.save();
  context.translate(MARGIN, MARGIN);
  drawContent(context, message, layout, style);
  context.restore();
};

export const cardTexture = (canvas: HTMLCanvasElement): THREE.CanvasTexture => {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
};

export const CARD_MARGIN_PX = MARGIN;
