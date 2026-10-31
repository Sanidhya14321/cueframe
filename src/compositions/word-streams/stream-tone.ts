import type { PromoLook, WordStreamsProps } from '@/schemas';

const channel = (hex: string, start: number): number => {
  const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const lightness = (hex: string): number => {
  const red = channel(hex, 1);
  const green = channel(hex, 3);
  const blue = channel(hex, 5);
  const long = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const medium = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const short = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  return 0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short;
};

export const toneLook = ({ look, tone }: WordStreamsProps): PromoLook => {
  if (!tone.dark) {
    return look;
  }
  const drop = Math.max(0, lightness(look.background) - lightness(look.backgroundEdge));
  const inkLightness = lightness(look.ink);
  const shade = inkLightness > 0 ? Math.min(1, drop / inkLightness) : 0;
  return {
    ...look,
    background: look.ink,
    backgroundEdge: `color-mix(in oklab, ${look.ink}, #000000 ${(shade * 100).toFixed(1)}%)`,
    ink: look.background,
    accent: look.accent === look.ink ? look.background : look.accent,
  };
};

export const withAlpha = (hex: string, alpha: number): string => {
  const value = (start: number) => Number.parseInt(hex.slice(start, start + 2), 16);
  const base = hex.length === 9 ? value(7) / 255 : 1;
  return `rgba(${value(1)}, ${value(3)}, ${value(5)}, ${(base * alpha).toFixed(3)})`;
};
