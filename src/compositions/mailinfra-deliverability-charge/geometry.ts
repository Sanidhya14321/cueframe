export interface Point {
  x: number;
  y: number;
}

export type Cubic = readonly [Point, Point, Point, Point];

export const point = (x: number, y: number): Point => ({ x, y });

export const add = (a: Point, b: Point, scale = 1): Point => ({
  x: a.x + b.x * scale,
  y: a.y + b.y * scale,
});

const at = (curve: Cubic, t: number): Point => {
  const [p0, p1, p2, p3] = curve;
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
};

const slope = (curve: Cubic, t: number): Point => {
  const [p0, p1, p2, p3] = curve;
  const u = 1 - t;
  const x = 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const y = 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
};

const SAMPLES = 64;

export interface Walk {
  length: number;
  pointAt: (distance: number) => Point;
  headingAt: (distance: number) => Point;
}

export const walk = (curve: Cubic): Walk => {
  const lengths = [0];
  let previous = at(curve, 0);
  for (let index = 1; index <= SAMPLES; index++) {
    const next = at(curve, index / SAMPLES);
    lengths.push((lengths[index - 1] ?? 0) + Math.hypot(next.x - previous.x, next.y - previous.y));
    previous = next;
  }
  const length = lengths[SAMPLES] ?? 0;
  const paramAt = (distance: number): number => {
    const target = Math.min(length, Math.max(0, distance));
    let index = 1;
    while (index < SAMPLES && (lengths[index] ?? 0) < target) {
      index++;
    }
    const low = lengths[index - 1] ?? 0;
    const high = lengths[index] ?? low;
    const share = high > low ? (target - low) / (high - low) : 0;
    return (index - 1 + share) / SAMPLES;
  };
  return {
    length,
    pointAt: (distance) => at(curve, paramAt(distance)),
    headingAt: (distance) => slope(curve, paramAt(distance)),
  };
};

export const pathOf = ([p0, p1, p2, p3]: Cubic): string =>
  `M${p0.x.toFixed(2)} ${p0.y.toFixed(2)} C${p1.x.toFixed(2)} ${p1.y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`;

const channels = (color: string): [number, number, number, number] => {
  const functional = /^rgba?\(([^)]*)\)$/.exec(color.trim());
  if (functional !== null) {
    const [red = 0, green = 0, blue = 0, alpha = 1] = (functional[1] ?? '')
      .split(/[\s,/]+/)
      .filter((part) => part.length > 0)
      .map((part) => Number.parseFloat(part));
    return [red, green, blue, alpha];
  }
  const raw = color.replace('#', '');
  const value = raw.length <= 4 ? [...raw].map((digit) => digit + digit).join('') : raw;
  const read = (start: number) => Number.parseInt(value.slice(start, start + 2), 16);
  return [read(0), read(2), read(4), value.length >= 8 ? read(6) / 255 : 1];
};

export const mixColor = (from: string, to: string, amount: number): string => {
  const share = Math.min(1, Math.max(0, amount));
  const a = channels(from);
  const b = channels(to);
  const mixed = a.map((channel, index) => channel + ((b[index] ?? channel) - channel) * share);
  const [red = 0, green = 0, blue = 0, alpha = 1] = mixed;
  return `rgba(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)}, ${alpha.toFixed(3)})`;
};

export const fade = (color: string, alpha: number): string => {
  const [red, green, blue, base] = channels(color);
  const value = Math.min(1, Math.max(0, alpha)) * base;
  return `rgba(${red}, ${green}, ${blue}, ${value.toFixed(3)})`;
};

export const hash = (seed: number): number => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};
