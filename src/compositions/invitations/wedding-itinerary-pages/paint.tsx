import { TAU } from '../../promo/timing';
import { mixOklab } from './oklab';

export const WIDTH = 1080;

export const HEIGHT = 1920;

export type Random = () => number;

export const random = (seed: number): Random => {
  let state = Math.floor(seed * 9973) >>> 0 || 1;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const between = (rand: Random, low: number, high: number): number =>
  low + (high - low) * rand();

const toneCache = new Map<string, string>();

export const mix = (from: string, to: string, amount: number): string => {
  const key = `${from}|${to}|${amount.toFixed(3)}`;
  const cached = toneCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const value = mixOklab(from, to, amount);
  toneCache.set(key, value);
  return value;
};

export const dark = (color: string, amount: number): string => mix(color, '#000000', amount);

export const light = (color: string, amount: number): string => mix(color, '#ffffff', amount);

export const f = (value: number): string => value.toFixed(1);

export const leafPath = (
  x: number,
  y: number,
  length: number,
  width: number,
  angle: number,
): string => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const tipX = x + cos * length;
  const tipY = y + sin * length;
  const midX = x + cos * length * 0.45;
  const midY = y + sin * length * 0.45;
  const nx = -sin * width;
  const ny = cos * width;
  return `M${f(x)} ${f(y)}Q${f(midX + nx)} ${f(midY + ny)} ${f(tipX)} ${f(tipY)}Q${f(midX - nx)} ${f(midY - ny)} ${f(x)} ${f(y)}Z`;
};

export const circlePath = (x: number, y: number, radius: number): string =>
  `M${f(x - radius)} ${f(y)}a${f(radius)} ${f(radius)} 0 1 0 ${f(radius * 2)} 0a${f(radius)} ${f(radius)} 0 1 0 ${f(-radius * 2)} 0Z`;

export const ellipsePath = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0Z`;

export const moundPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  rand: Random,
  bumps: number,
): string => {
  const left = x - width / 2;
  const step = width / bumps;
  let path = `M${f(left)} ${f(y)}`;
  for (let index = 0; index < bumps; index++) {
    const from = left + index * step;
    const to = from + step;
    const centre = (from + to) / 2 - x;
    const lift = height * Math.sqrt(Math.max(0.04, 1 - ((centre * 2) / width) ** 2));
    const top = y - lift - between(rand, 0.05, 0.22) * step;
    const startY = index === 0 ? y - lift * 0.3 : y - lift * 0.86;
    if (index === 0) {
      path += `L${f(from)} ${f(startY)}`;
    }
    const endY = index === bumps - 1 ? y - lift * 0.3 : y - lift * 0.86;
    path += `C${f(from - step * 0.05)} ${f(top)} ${f(to + step * 0.05)} ${f(top)} ${f(to)} ${f(endY)}`;
  }
  return `${path}L${f(left + width)} ${f(y)}Z`;
};

export const sway = (frame: number, period: number, phase: number, amount: number): number =>
  Math.sin((frame / period) * TAU + phase) * amount;

export type Stop = readonly [number, string, number?];

export const Linear = ({
  id,
  stops,
  x2 = 0,
  y2 = 1,
}: {
  id: string;
  stops: readonly Stop[];
  x2?: number;
  y2?: number;
}) => (
  <linearGradient id={id} x1={0} y1={0} x2={x2} y2={y2}>
    {stops.map(([offset, color, opacity], index) => (
      <stop key={index} offset={offset} stopColor={color} stopOpacity={opacity ?? 1} />
    ))}
  </linearGradient>
);

export const Radial = ({ id, stops }: { id: string; stops: readonly Stop[] }) => (
  <radialGradient id={id} cx={0.5} cy={0.5} r={0.5}>
    {stops.map(([offset, color, opacity], index) => (
      <stop key={index} offset={offset} stopColor={color} stopOpacity={opacity ?? 1} />
    ))}
  </radialGradient>
);

const pathCache = new Map<string, unknown>();

export const memo = <T,>(key: string, build: () => T): T => {
  const cached = pathCache.get(key);
  if (cached !== undefined) {
    return cached as T;
  }
  const value = build();
  if (pathCache.size > 4000) {
    pathCache.clear();
  }
  pathCache.set(key, value);
  return value;
};
