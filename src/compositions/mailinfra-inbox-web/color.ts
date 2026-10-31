const channels = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const toHex = (value: number): string =>
  Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, '0');

export const blend = (from: string, to: string, amount: number): string => {
  const a = channels(from);
  const b = channels(to);
  return `#${a.map((value, index) => toHex(value + ((b[index] ?? value) - value) * amount)).join('')}`;
};

export const fade = (color: string, alpha: number): string => {
  const [red, green, blue] = channels(color);
  return `rgba(${red}, ${green}, ${blue}, ${Math.min(1, Math.max(0, alpha)).toFixed(3)})`;
};
