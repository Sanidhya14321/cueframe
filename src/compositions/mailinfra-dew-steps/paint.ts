const channels = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const toHex = (value: number): string =>
  Math.round(Math.max(0, Math.min(255, value)))
    .toString(16)
    .padStart(2, '0');

export const mix = (from: string, to: string, amount: number): string => {
  const a = channels(from);
  const b = channels(to);
  const t = Math.max(0, Math.min(1, amount));
  return `#${toHex(a[0] + (b[0] - a[0]) * t)}${toHex(a[1] + (b[1] - a[1]) * t)}${toHex(a[2] + (b[2] - a[2]) * t)}`;
};

export const lighten = (color: string, amount: number): string => mix(color, '#ffffff', amount);

export const seeded = (seed: number): (() => number) => {
  let state = (seed * 2654435761) % 4294967296;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

export const EASED_STOPS = [0, 0.04, 0.14, 0.3, 0.5, 0.7, 0.86, 0.96, 1];

export const sparklePath = (size: number): string => {
  const waist = size * 0.16;
  return [
    `M 0 ${-size}`,
    `Q ${waist} ${-waist} ${size} 0`,
    `Q ${waist} ${waist} 0 ${size}`,
    `Q ${-waist} ${waist} ${-size} 0`,
    `Q ${-waist} ${-waist} 0 ${-size}`,
    'Z',
  ].join(' ');
};

const DEPTH_HUE_SHIFT = -0.027926688489333787;
const DEPTH_LIGHTNESS = 0.34185303514376997;

const toHsl = (hex: string): [number, number, number] => {
  const [r, g, b] = channels(hex).map((value) => value / 255) as [number, number, number];
  const high = Math.max(r, g, b);
  const low = Math.min(r, g, b);
  const lightness = (high + low) / 2;
  if (high === low) {
    return [0, 0, lightness];
  }
  const range = high - low;
  const saturation = lightness <= 0.5 ? range / (high + low) : range / (2 - high - low);
  const red = (high - r) / range;
  const green = (high - g) / range;
  const blue = (high - b) / range;
  const sector = r === high ? blue - green : g === high ? 2 + red - blue : 4 + green - red;
  return [(((sector / 6) % 1) + 1) % 1, saturation, lightness];
};

const hueChannel = (low: number, high: number, hue: number): number => {
  const turn = ((hue % 1) + 1) % 1;
  if (turn < 1 / 6) {
    return low + (high - low) * turn * 6;
  }
  if (turn < 0.5) {
    return high;
  }
  if (turn < 2 / 3) {
    return low + (high - low) * (2 / 3 - turn) * 6;
  }
  return low;
};

export const depthShade = (color: string): string => {
  const [hue, saturation, lightness] = toHsl(color);
  const shaded = lightness * DEPTH_LIGHTNESS;
  if (saturation === 0) {
    return `#${toHex(shaded * 255).repeat(3)}`;
  }
  const high =
    shaded <= 0.5 ? shaded * (1 + saturation) : shaded + saturation - shaded * saturation;
  const low = 2 * shaded - high;
  const shifted = hue + DEPTH_HUE_SHIFT;
  return `#${toHex(hueChannel(low, high, shifted + 1 / 3) * 255)}${toHex(hueChannel(low, high, shifted) * 255)}${toHex(hueChannel(low, high, shifted - 1 / 3) * 255)}`;
};
