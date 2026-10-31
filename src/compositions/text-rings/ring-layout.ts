import type { TextRingsProps } from '@/schemas';
import { smooth, TAU, tween } from '../promo/timing';

const NARROW = new Set([...'·iljI!|.,:;\'"`']);
const SLIM = new Set([...'frt()[]{}-/']);
const WIDE = new Set([...'mwMW@']);
const SPACE_EM = 0.26;
const MAX_STRETCH = 1.06;
const WIDTH_MARGIN = 1.04;
const HALF_LINE_EM = 0.56;
const MAX_EDGE_SPEED = 45;
const MIN_INTERVAL = 4;

const charEm = (character: string): number => {
  if (character === ' ') {
    return SPACE_EM;
  }
  if (NARROW.has(character)) {
    return 0.26;
  }
  if (SLIM.has(character)) {
    return 0.36;
  }
  if (WIDE.has(character)) {
    return 0.86;
  }
  if (character >= 'A' && character <= 'Z') {
    return 0.68;
  }
  return 0.56;
};

const textEm = (text: string, tracking: number, weight: number): number => {
  const characters = [...text];
  const boldness = 1 + (weight - 500) / 8000;
  return (
    characters.reduce((sum, character) => sum + charEm(character), 0) * boldness +
    Math.max(0, characters.length - 1) * tracking
  );
};

type RingWord = { slot: number; offset: number; length: number };

export type Ring = {
  index: number;
  radius: number;
  size: number;
  angle: number;
  opacity: number;
  weight: number;
  words: RingWord[];
  separators: { slot: number; offset: number }[];
};

const ringStartRadius = ({ mark, rings, words }: TextRingsProps): number =>
  (mark.size / 2) * Math.max(1, mark.shrinkTo) + rings.startGap + words.innerSize / 2;

const ringClock = (props: TextRingsProps, edgeRadius: number) => {
  const { words, rings } = props;
  const start = ringStartRadius(props);
  const reach = Math.max(edgeRadius, start * 1.01);
  const power = Math.log(words.outerSize / words.innerSize) / Math.log(reach / start);
  const crowd = Math.max(words.innerSize / start, words.outerSize / reach);
  const tightest = Math.min(0.9, HALF_LINE_EM * crowd);
  const minSpacing = (1 + tightest) / (1 - tightest);
  const spacing = Math.max(rings.spacing, minSpacing);
  const window = Math.max(0, rings.lastAt - rings.firstAt);
  const planned = Math.max(MIN_INTERVAL, window / Math.max(1, rings.count - 1));
  const fastest = MAX_EDGE_SPEED / reach;
  const interval = Math.max(planned, Math.log(minSpacing) / fastest);
  const growth = Math.min(Math.log(spacing) / interval, fastest);
  return {
    start,
    crowd,
    growth,
    interval,
    sizeAt: (radius: number) => words.innerSize * (radius / start) ** power,
  };
};

export const ringField = (props: TextRingsProps, frame: number, edgeRadius: number): Ring[] => {
  const { words, rings, spin } = props;
  const text = words.text.trim();
  if (text.length === 0) {
    return [];
  }
  const { start, crowd, growth, interval, sizeAt } = ringClock(props, edgeRadius);
  const heaviest = Math.max(words.weight, words.oddWeight);
  const wordEm = textEm(text, words.tracking, heaviest) * WIDTH_MARGIN;
  const separator = words.separator.trim();
  const separatorEm =
    separator.length > 0 ? textEm(separator, words.tracking, heaviest) * WIDTH_MARGIN : 0;
  const unitEm = wordEm + separatorEm + 2 * words.gap;
  const count = Math.max(1, Math.floor(TAU / (unitEm * crowd)));
  const glide = spin.speed / (start * growth);
  return Array.from({ length: rings.count }, (_, index) => {
    const age = Math.max(0, frame - (rings.firstAt + index * interval));
    const born = frame >= rings.firstAt + index * interval;
    const radius = start * Math.exp(growth * age);
    const size = sizeAt(radius);
    const circumference = TAU * radius;
    const slot = circumference / count;
    const stretch = Math.min(MAX_STRETCH, Math.max(1, slot / (unitEm * size)));
    const turning = spin.clockwise ? 1 : -1;
    const direction = spin.alternate && index % 2 === 1 ? -turning : turning;
    const spun = glide * (1 - Math.exp(-growth * age));
    return {
      index,
      radius,
      size,
      angle: index * spin.offset + (direction * spun * 360) / TAU,
      opacity:
        (born ? tween(age, [0, rings.fadeFrames], [0, 1], smooth) : 0) *
        (index % 2 === 1 ? rings.oddOpacity : 1),
      weight: index % 2 === 1 ? words.oddWeight : words.weight,
      words: Array.from({ length: count }, (_place, word) => ({
        slot: word,
        offset: circumference * 0.5 + word * slot,
        length: wordEm * size * stretch,
      })),
      separators:
        separator.length > 0
          ? Array.from({ length: count }, (_place, word) => ({
              slot: word,
              offset: circumference * 0.5 + (word + 0.5) * slot,
            }))
          : [],
    };
  }).filter((ring) => ring.opacity > 0 && ring.radius - ring.size < edgeRadius);
};

export const ringPath = (radius: number): string => {
  const lap = `A ${radius} ${radius} 0 1 1 ${-radius} 0 A ${radius} ${radius} 0 1 1 ${radius} 0`;
  return `M ${radius} 0 ${lap} ${lap}`;
};
