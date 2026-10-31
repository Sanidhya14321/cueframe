import type { ImageFilters } from './element';
import { NO_FILTERS } from './factories';

export const IMAGE_FILTER_PRESETS = {
  none: NO_FILTERS,
  vivid: { ...NO_FILTERS, saturation: 1.6, contrast: 1.15 },
  warm: { ...NO_FILTERS, sepia: 0.35, saturation: 1.2, brightness: 1.05 },
  cool: { ...NO_FILTERS, hue: 18, saturation: 0.9, brightness: 1.05 },
  mono: { ...NO_FILTERS, grayscale: 1, contrast: 1.15 },
  noir: { ...NO_FILTERS, grayscale: 1, contrast: 1.6, brightness: 0.85 },
  vintage: { ...NO_FILTERS, sepia: 0.6, contrast: 0.9, brightness: 1.1 },
  fade: { ...NO_FILTERS, contrast: 0.75, brightness: 1.15, saturation: 0.7 },
  dramatic: { ...NO_FILTERS, contrast: 1.45, saturation: 1.25, brightness: 0.9 },
} as const satisfies Record<string, ImageFilters>;

export type ImageFilterPreset = keyof typeof IMAGE_FILTER_PRESETS;

export const hasFilters = (filters: ImageFilters): boolean =>
  (Object.keys(NO_FILTERS) as (keyof ImageFilters)[]).some(
    (key) => filters[key] !== NO_FILTERS[key],
  );

export const cssFilterString = (filters: ImageFilters): string =>
  [
    filters.brightness === 1 ? '' : `brightness(${filters.brightness})`,
    filters.contrast === 1 ? '' : `contrast(${filters.contrast})`,
    filters.saturation === 1 ? '' : `saturate(${filters.saturation})`,
    filters.hue === 0 ? '' : `hue-rotate(${filters.hue}deg)`,
    filters.grayscale === 0 ? '' : `grayscale(${filters.grayscale})`,
    filters.sepia === 0 ? '' : `sepia(${filters.sepia})`,
    filters.invert === 0 ? '' : `invert(${filters.invert})`,
    filters.blur === 0 ? '' : `blur(${filters.blur}px)`,
  ]
    .filter(Boolean)
    .join(' ');
