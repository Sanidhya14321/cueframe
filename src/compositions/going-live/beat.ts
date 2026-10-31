export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const progress = (frame: number, from: number, to: number): number =>
  to <= from ? (frame >= to ? 1 : 0) : clamp01((frame - from) / (to - from));

export const within = (frame: number, from: number, to: number): boolean =>
  frame >= from && frame < to;

export const hash = (seed: number): number => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
};

export const splitLines = (text: string): string[] => text.split('\n');

export const keyed = (frame: number, keys: readonly (readonly [number, number])[]): number => {
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
  const index = keys.findIndex((key, position) => {
    const next = keys[position + 1];
    return next !== undefined && frame >= key[0] && frame < next[0];
  });
  const from = keys[index];
  const to = keys[index + 1];
  if (from === undefined || to === undefined) {
    return last[1];
  }
  const slope = (position: number): number => {
    const before = keys[position - 1];
    const after = keys[position + 1];
    return before === undefined || after === undefined
      ? 0
      : (after[1] - before[1]) / (after[0] - before[0]);
  };
  const span = to[0] - from[0];
  const t = (frame - from[0]) / span;
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * from[1] +
    (t3 - 2 * t2 + t) * span * slope(index) +
    (-2 * t3 + 3 * t2) * to[1] +
    (t3 - t2) * span * slope(index + 1)
  );
};
