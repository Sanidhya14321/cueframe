const channels = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const toHex = (value: number): string =>
  Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, '0');

export const mix = (from: string, to: string, amount: number): string => {
  const a = channels(from);
  const b = channels(to);
  return `#${a.map((value, index) => toHex(value + ((b[index] ?? value) - value) * amount)).join('')}`;
};

export const shade = (color: string, amount: number): string => mix(color, '#000000', amount);

export const tint = (color: string, amount: number): string => mix(color, '#ffffff', amount);

export const seeded = (seed: number): (() => number) => {
  let state = (Math.floor(seed) * 2654435761) % 4294967296;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

export const svgId = (raw: string): string => raw.replace(/[^a-zA-Z0-9_-]/g, '');
