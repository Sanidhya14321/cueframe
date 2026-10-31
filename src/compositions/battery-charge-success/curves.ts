export type Key = readonly [number, number];

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const smoothstep = (edge0: number, edge1: number, value: number): number => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const slopes = (keys: readonly Key[]): number[] => {
  const count = keys.length;
  const deltas: number[] = [];
  for (let index = 0; index < count - 1; index++) {
    const [x0, y0] = keys[index] ?? [0, 0];
    const [x1, y1] = keys[index + 1] ?? [1, 0];
    deltas.push((y1 - y0) / (x1 - x0));
  }
  const tangents: number[] = [];
  for (let index = 0; index < count; index++) {
    const before = deltas[index - 1];
    const after = deltas[index];
    if (before === undefined || after === undefined) {
      tangents.push(0);
    } else if (before * after <= 0) {
      tangents.push(0);
    } else {
      const [xPrev] = keys[index - 1] ?? [0, 0];
      const [xHere] = keys[index] ?? [0, 0];
      const [xNext] = keys[index + 1] ?? [0, 0];
      const w1 = 2 * (xNext - xHere) + (xHere - xPrev);
      const w2 = xNext - xHere + 2 * (xHere - xPrev);
      tangents.push((w1 + w2) / (w1 / before + w2 / after));
    }
  }
  return tangents;
};

export const monotone = (frame: number, keys: readonly Key[]): number => {
  const first = keys[0];
  const last = keys.at(-1);
  if (first === undefined || last === undefined) {
    return 0;
  }
  if (frame <= first[0]) {
    return first[1];
  }
  if (frame >= last[0]) {
    return last[1];
  }
  const tangents = slopes(keys);
  for (let index = 0; index < keys.length - 1; index++) {
    const [x0, y0] = keys[index] ?? first;
    const [x1, y1] = keys[index + 1] ?? last;
    if (frame <= x1) {
      const span = x1 - x0;
      const t = (frame - x0) / span;
      const t2 = t * t;
      const t3 = t2 * t;
      const m0 = (tangents[index] ?? 0) * span;
      const m1 = (tangents[index + 1] ?? 0) * span;
      return (
        (2 * t3 - 3 * t2 + 1) * y0 +
        (t3 - 2 * t2 + t) * m0 +
        (-2 * t3 + 3 * t2) * y1 +
        (t3 - t2) * m1
      );
    }
  }
  return last[1];
};

export const ascending = (frames: readonly number[], gap = 2): number[] => {
  const result: number[] = [];
  for (const frame of frames) {
    const previous = result.at(-1);
    result.push(previous === undefined ? frame : Math.max(frame, previous + gap));
  }
  return result;
};

const channels = (hex: string): [number, number, number] => {
  const value = Number.parseInt(hex.slice(1, 7), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

export const mixHex = (from: string, to: string, amount: number): string => {
  const t = clamp01(amount);
  const a = channels(from);
  const b = channels(to);
  const mixed = a.map((channel, index) => Math.round(channel + ((b[index] ?? 0) - channel) * t));
  return `#${mixed.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

export const mixThree = (first: string, second: string, third: string, amount: number): string =>
  amount <= 0.5 ? mixHex(first, second, amount * 2) : mixHex(second, third, amount * 2 - 1);

export const rgba = (hex: string, alpha: number): string => {
  const [r, g, b] = channels(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha).toFixed(3)})`;
};
