const channels = (hex: string): number[] => {
  const value = hex.replace('#', '');
  return [0, 2, 4, 6]
    .map((offset) => value.slice(offset, offset + 2))
    .map((pair) => (pair.length === 2 ? Number.parseInt(pair, 16) : 255));
};

const toHex = (value: number): string =>
  Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, '0');

export const mixHex = (from: string, to: string, amount: number): string => {
  const a = channels(from);
  const b = channels(to);
  return `#${a.map((channel, index) => toHex(channel + ((b[index] ?? 255) - channel) * amount)).join('')}`;
};

export const withAlpha = (hex: string, alpha: number): string =>
  `#${hex.replace('#', '').slice(0, 6)}${toHex(alpha * 255)}`;
