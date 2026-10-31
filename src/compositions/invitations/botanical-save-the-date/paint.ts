export type Point = readonly [number, number];

const toRgb = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const toHex = (channels: readonly number[]): string =>
  `#${channels
    .map((value) =>
      Math.round(Math.min(255, Math.max(0, value)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

export const mix = (from: string, to: string, amount: number): string => {
  const a = toRgb(from);
  const b = toRgb(to);
  return toHex(a.map((value, index) => value + ((b[index] ?? value) - value) * amount));
};

export const tint = (color: string, amount: number): string => mix(color, '#ffffff', amount);

export const shade = (color: string, amount: number): string => mix(color, '#141a16', amount);

export const withAlpha = (color: string, alpha: number): string => {
  const [r, g, b] = toRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha)).toFixed(3)})`;
};

export const seeded = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const fixed = (value: number): string => value.toFixed(2);

export const quadPoint = (from: Point, control: Point, to: Point, t: number): Point => {
  const u = 1 - t;
  return [
    u * u * from[0] + 2 * u * t * control[0] + t * t * to[0],
    u * u * from[1] + 2 * u * t * control[1] + t * t * to[1],
  ];
};

export const quadAngle = (from: Point, control: Point, to: Point, t: number): number => {
  const dx = 2 * (1 - t) * (control[0] - from[0]) + 2 * t * (to[0] - control[0]);
  const dy = 2 * (1 - t) * (control[1] - from[1]) + 2 * t * (to[1] - control[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

export const quadPath = (from: Point, control: Point, to: Point): string =>
  `M${fixed(from[0])} ${fixed(from[1])} Q${fixed(control[0])} ${fixed(control[1])} ${fixed(to[0])} ${fixed(to[1])}`;

export const leafOutline = (length: number, width: number, lean = 0): string => {
  const half = width / 2;
  return [
    'M0 0',
    `C${fixed(length * 0.22)} ${fixed(-half * (1.25 + lean))} ${fixed(length * 0.68)} ${fixed(-half * (1.05 + lean))} ${fixed(length)} 0`,
    `C${fixed(length * 0.7)} ${fixed(half * (1.0 - lean))} ${fixed(length * 0.24)} ${fixed(half * (1.2 - lean))} 0 0`,
    'Z',
  ].join(' ');
};

export const leafHalf = (length: number, width: number, lean = 0): string => {
  const half = width / 2;
  return [
    'M0 0',
    `C${fixed(length * 0.22)} ${fixed(-half * (1.25 + lean))} ${fixed(length * 0.68)} ${fixed(-half * (1.05 + lean))} ${fixed(length)} 0`,
    'Z',
  ].join(' ');
};
