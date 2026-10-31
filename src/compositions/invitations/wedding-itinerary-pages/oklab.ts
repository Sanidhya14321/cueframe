type Lab = readonly [number, number, number, number];

const toLinear = (channel: number): number =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const fromLinear = (channel: number): number =>
  channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;

const parseHex = (hex: string): [number, number, number, number] => {
  const value = hex.replace('#', '');
  const channel = (index: number): number =>
    Number.parseInt(value.slice(index * 2, index * 2 + 2), 16) / 255;
  return [channel(0), channel(1), channel(2), value.length >= 8 ? channel(3) : 1];
};

const toLab = (hex: string): Lab => {
  const [red, green, blue, alpha] = parseHex(hex);
  const r = toLinear(red);
  const g = toLinear(green);
  const b = toLinear(blue);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    alpha,
  ];
};

const toRgb = ([lightness, a, b, alpha]: Lab): string => {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const channel = (value: number): number =>
    Math.round(Math.min(1, Math.max(0, fromLinear(value))) * 255);
  const red = channel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const green = channel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const blue = channel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
  const hex = (value: number): string => value.toString(16).padStart(2, '0');
  const opacity = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
  return `#${hex(red)}${hex(green)}${hex(blue)}${opacity >= 255 ? '' : hex(opacity)}`;
};

export const mixOklab = (from: string, to: string, amount: number): string => {
  const start = toLab(from);
  const end = toLab(to);
  const at = (index: 0 | 1 | 2 | 3): number => start[index] + (end[index] - start[index]) * amount;
  return toRgb([at(0), at(1), at(2), at(3)]);
};
