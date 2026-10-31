import type { MagnifierCaptionProps } from '@/schemas';

export interface Point {
  x: number;
  y: number;
}

export interface Bubble extends Point {
  r: number;
  word: string;
  target: number;
}

export interface LensPose extends Point {
  angle: number;
}

const TARGET_PATH: Point[] = [
  { x: -205, y: -564 },
  { x: 189, y: -757 },
  { x: 446, y: -401 },
  { x: 772, y: -109 },
  { x: 539, y: 263 },
  { x: 390, y: 675 },
  { x: -42, y: 599 },
  { x: -480, y: 615 },
  { x: -571, y: 185 },
  { x: -330, y: -100 },
];

const LENS_PATH: LensPose[] = [
  { x: -53, y: -108, angle: 10 },
  { x: 65, y: -142, angle: 42 },
  { x: 65, y: -85, angle: 27 },
  { x: -19, y: -54, angle: 9 },
  { x: 42, y: -78, angle: 20 },
  { x: 32, y: 0, angle: 17 },
  { x: 106, y: -41, angle: 32 },
  { x: 32, y: -51, angle: 12 },
  { x: 15, y: -7, angle: 4 },
  { x: -9, y: 68, angle: -8 },
];

const IDLE_BUBBLE: Point = { x: -75, y: 30 };

const VIEW = { width: 1080, height: 1920 };

export const captionWords = (text: string): string[] =>
  text.split(/\s+/).filter((word) => word.length > 0);

export const targetPoint = (index: number, spread: number): Point => {
  const base = TARGET_PATH[index % TARGET_PATH.length] ?? { x: 0, y: 0 };
  const lap = Math.floor(index / TARGET_PATH.length);
  return { x: base.x * spread, y: (base.y + lap * 1900) * spread };
};

export const idlePose = (lens: MagnifierCaptionProps['lens']): LensPose => ({
  x: lens.x,
  y: lens.y,
  angle: lens.angle,
});

export const lensPose = (index: number, lens: MagnifierCaptionProps['lens']): LensPose => {
  const delta = LENS_PATH[index % LENS_PATH.length] ?? { x: 0, y: 0, angle: 0 };
  return {
    x: lens.x + delta.x * lens.sway,
    y: lens.y + delta.y * lens.sway,
    angle: lens.angle + delta.angle * lens.sway,
  };
};

const mulberry = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const textWidth = (word: string, size: number): number => word.length * size * 0.54;

const fits = (bubbles: Bubble[], x: number, y: number, r: number, gap: number): boolean =>
  bubbles.every((other) => Math.hypot(other.x - x, other.y - y) >= other.r + r + gap);

type FieldProps = MagnifierCaptionProps['field'];
type LensProps = MagnifierCaptionProps['lens'];

const worldBounds = (field: FieldProps, lens: LensProps, count: number) => {
  const keys = [{ point: { x: 0, y: 0 }, pose: idlePose(lens) }];
  for (let index = 0; index < count; index++) {
    keys.push({ point: targetPoint(index, field.spread), pose: lensPose(index, lens) });
  }
  const margin = field.maxRadius + field.drift * 60 + 60;
  const xs = keys.flatMap(({ point, pose }) => [point.x - pose.x, point.x - pose.x + VIEW.width]);
  const ys = keys.flatMap(({ point, pose }) => [point.y - pose.y, point.y - pose.y + VIEW.height]);
  return {
    left: Math.min(...xs) - margin,
    right: Math.max(...xs) + margin,
    top: Math.min(...ys) - margin,
    bottom: Math.max(...ys) + margin,
  };
};

export const buildField = (field: FieldProps, text: string, lens: LensProps): Bubble[] => {
  const words = captionWords(text);
  const decoys = field.decoys
    .split('\n')
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
  const random = mulberry(Math.round(field.seed) * 7919 + 13);
  const bubbles: Bubble[] = [];
  const idleWord = decoys[0] ?? '';
  bubbles.push({
    ...IDLE_BUBBLE,
    r: Math.max(field.targetRadius * 0.8, textWidth(idleWord, field.wordSize) / 2 + 36),
    word: idleWord,
    target: -1,
  });
  words.forEach((word, index) => {
    const point = targetPoint(index, field.spread);
    const r = Math.max(
      field.targetRadius * (0.82 + random() * 0.36),
      textWidth(word, field.wordSize) / 2 + 40,
    );
    if (fits(bubbles, point.x, point.y, r, field.gap)) {
      bubbles.push({ ...point, r, word, target: index });
    } else {
      bubbles.push({ ...point, r: r * 0.8, word, target: index });
    }
  });
  const bounds = worldBounds(field, lens, words.length);
  const minRadius = Math.min(field.minRadius, field.maxRadius);
  const area = (bounds.right - bounds.left) * (bounds.bottom - bounds.top);
  const attempts = Math.min(40000, Math.round(area / 1500));
  for (let attempt = 0; attempt < attempts; attempt++) {
    const progress = (attempt / attempts) ** 0.6;
    const r = field.maxRadius - (field.maxRadius - minRadius) * progress * (0.85 + random() * 0.15);
    const x = bounds.left + random() * (bounds.right - bounds.left);
    const y = bounds.top + random() * (bounds.bottom - bounds.top);
    if (!fits(bubbles, x, y, r, field.gap)) {
      continue;
    }
    const pick = decoys[Math.floor(random() * decoys.length)] ?? '';
    const labelled =
      random() < field.fill && textWidth(pick, field.wordSize) < r * 1.7 && r > field.wordSize;
    bubbles.push({ x, y, r, word: labelled ? pick : '', target: -1 });
  }
  return bubbles;
};
