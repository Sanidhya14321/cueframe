import { type CSSProperties, useMemo } from 'react';
import { Easing } from 'remotion';
import type { BrandingIsTickerProps } from '@/schemas';
import { leadSerifFont, tickerFont, tickerFontReady } from './fonts';

type TickerType = BrandingIsTickerProps['type'];

type TickerTiming = BrandingIsTickerProps['ticker'];

type TickerUnderline = BrandingIsTickerProps['underline'];

const LEAD_ITEMS = 3;

const TRAIL_ITEMS = 6;

export const tickerWords = (words: string): string[] =>
  words
    .split('\n')
    .map((word) => word.trim())
    .filter((word) => word !== '');

const canvasFont = (type: TickerType) => `${type.weight} ${type.tickerSize}px "${tickerFont}"`;

const loadedFonts = new Set<string>();

const pendingFonts = new Map<string, Promise<void>>();

const useLoadedFont = (font: string): void => {
  if (loadedFonts.has(font)) {
    return;
  }
  const pending =
    pendingFonts.get(font) ??
    tickerFontReady()
      .then(() => document.fonts.load(font))
      .then(() => {
        loadedFonts.add(font);
      });
  pendingFonts.set(font, pending);
  throw pending;
};

const measureItems = (items: string[], type: TickerType, gap: number): number[] => {
  const context = document.createElement('canvas').getContext('2d');
  if (context === null) {
    return items.map((item) => Math.round(item.length * type.tickerSize * 0.55 + gap));
  }
  context.font = canvasFont(type);
  context.letterSpacing = `${type.tracking * type.tickerSize}px`;
  return items.map((item) => Math.round(context.measureText(item).width + gap));
};

const cumulative = (widths: number[]): number[] => {
  const offsets = [0];
  let total = 0;
  for (const width of widths) {
    total += width;
    offsets.push(total);
  }
  return offsets;
};

const stepPath = (distance: number, frames: number, ease: (t: number) => number): number[] => {
  const target = Math.round(distance);
  const path = Array.from({ length: frames + 1 }, (_, k) => Math.round(target * ease(k / frames)));
  if (target < frames) {
    return path;
  }
  for (let k = 1; k <= frames; k++) {
    path[k] = Math.max(path[k] ?? 0, (path[k - 1] ?? 0) + 1);
  }
  path[frames] = target;
  for (let k = frames - 1; k >= 0; k--) {
    path[k] = Math.min(path[k] ?? 0, (path[k + 1] ?? 0) - 1);
  }
  return path;
};

const tickerStep = (
  frame: number,
  steps: number,
  timing: TickerTiming,
  distanceOf: (step: number) => number,
): { step: number; travelled: number } => {
  const frames = Math.max(1, Math.round(timing.stepFrames));
  if (steps <= 0 || frame <= 0) {
    return { step: 0, travelled: 0 };
  }
  if (frame >= steps * frames) {
    return { step: steps, travelled: 0 };
  }
  const step = Math.floor(frame / frames);
  const local = frame - step * frames;
  const index = Math.floor(local);
  const ease = Easing.bezier(timing.easeX1, timing.easeY1, timing.easeX2, timing.easeY2);
  const path = stepPath(distanceOf(step), frames, ease);
  const from = path[index] ?? 0;
  const to = path[index + 1] ?? from;
  return { step, travelled: from + (to - from) * (local - index) };
};

const lineStyle = (
  type: TickerType,
  size: number,
  color: string,
  font = tickerFont,
): CSSProperties => ({
  position: 'absolute',
  left: type.x,
  fontFamily: font,
  fontSize: size,
  fontWeight: type.weight,
  letterSpacing: `${type.tracking}em`,
  lineHeight: `${type.size * type.lineHeight}px`,
  height: type.size * type.lineHeight,
  color,
  whiteSpace: 'pre',
});

const outlineStyle = (type: TickerType): CSSProperties =>
  type.outline <= 0
    ? {}
    : { color: 'transparent', WebkitTextStroke: `${type.outline}px ${type.dim}` };

const edgeMask = (fade: number): CSSProperties =>
  fade <= 0
    ? {}
    : {
        maskImage: `linear-gradient(to right, transparent 0px, black ${fade}px, black calc(100% - ${fade}px), transparent 100%)`,
      };

export const WordTicker = ({
  lead,
  words,
  separator,
  type,
  underline,
  timing,
  frame,
}: {
  lead: string;
  words: string;
  separator: string;
  type: TickerType;
  underline: TickerUnderline;
  timing: TickerTiming;
  frame: number;
}) => {
  useLoadedFont(canvasFont(type));
  const list = useMemo(() => tickerWords(words), [words]);
  const steps = list.length;
  const items = useMemo(
    () =>
      steps === 0
        ? []
        : Array.from(
            { length: steps + LEAD_ITEMS + TRAIL_ITEMS },
            (_, index) => list[(((index - LEAD_ITEMS) % steps) + steps) % steps] ?? '',
          ),
    [list, steps],
  );
  const widths = useMemo(
    () =>
      measureItems(
        items.map((word) => `${word}${separator}`),
        type,
        type.wordGap,
      ),
    [items, separator, type],
  );
  const wordWidths = useMemo(() => measureItems(items, type, 0), [items, type]);
  const offsets = useMemo(() => cumulative(widths), [widths]);
  const leadLines = lead.split('\n');
  const pitch = type.size * type.lineHeight;
  const at = (index: number) => offsets[index + LEAD_ITEMS] ?? 0;
  const widthAt = (index: number) => widths[index + LEAD_ITEMS] ?? 0;
  const { step, travelled } = tickerStep(frame, steps, timing, widthAt);
  const distance = widthAt(step);
  const fraction = distance > 0 ? travelled / distance : 0;
  const shift = Math.round(at(step) - at(0) + travelled);
  const window = Math.round(widthAt(step) + (widthAt(step + 1) - widthAt(step)) * fraction);
  const wordAt = (index: number) => wordWidths[index + LEAD_ITEMS] ?? 0;
  const bar = Math.round(wordAt(step) + (wordAt(step + 1) - wordAt(step)) * fraction);
  const row = (color: string, extra: CSSProperties = {}) => (
    <div style={{ position: 'absolute', inset: 0, transform: `translateX(${type.x - shift}px)` }}>
      {items.map((item, index) => (
        <span
          key={`${index}-${item}`}
          style={{
            ...lineStyle(type, type.tickerSize, color),
            left: (offsets[index] ?? 0) - at(0),
            top: 0,
            ...extra,
          }}
        >
          {`${item}${separator}`}
        </span>
      ))}
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: type.y }}>
      {leadLines.map((line, index) => (
        <div
          key={`${index}-${line}`}
          style={{
            ...lineStyle(
              type,
              type.size,
              type.lead,
              type.leadFont === 'serif' ? leadSerifFont : tickerFont,
            ),
            fontWeight: type.leadFont === 'serif' ? 600 : type.weight,
            fontStyle: type.leadFont === 'serif' ? 'italic' : 'normal',
            top: index * pitch,
          }}
        >
          {line}
        </div>
      ))}
      {steps > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: leadLines.length * pitch + type.tickerOffset,
            height: pitch,
            ...edgeMask(type.edgeFade),
          }}
        >
          {row(type.dim, outlineStyle(type))}
          <div
            style={{
              position: 'absolute',
              inset: `-${type.size}px 0`,
              clipPath: `inset(0px calc(100% - ${type.x + window}px) 0px ${type.x}px)`,
            }}
          >
            <div style={{ position: 'absolute', left: 0, right: 0, top: type.size, height: pitch }}>
              {row(type.active)}
            </div>
          </div>
        </div>
      ) : null}
      {steps > 0 && underline.show && bar > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: type.x,
            top: Math.round((leadLines.length + 1) * pitch + type.tickerOffset + underline.offset),
            width: bar,
            height: underline.height,
            borderRadius: underline.height / 2,
            background: underline.color,
          }}
        />
      ) : null}
    </div>
  );
};
