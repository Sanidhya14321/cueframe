import { converter, formatRgb, parse, wcagLuminance } from 'culori';
import type { ControlSectionView } from '@/core';
import type { Design } from '@/design';
import { getAtPath } from '@/lib/value-path';

export interface Swatch {
  role: string;
  value: string;
}

export const controlSwatches = (
  sections: readonly ControlSectionView[],
  defaults: unknown,
): Swatch[] =>
  (sections.find((section) => section.title === 'Colors')?.fields ?? []).flatMap((field) => {
    const [lead] = field.targets;
    const value = lead === undefined ? undefined : getAtPath(defaults, lead);
    return typeof value === 'string' && parse(value) !== undefined
      ? [{ role: field.descriptor.label, value }]
      : [];
  });

export const designSwatches = (design: Design): Swatch[] =>
  design.controls.flatMap((control) =>
    control.kind === 'color' && parse(control.value) !== undefined
      ? [{ role: control.label, value: control.value }]
      : [],
  );

export const pickRole = (
  swatches: readonly Swatch[],
  roles: readonly string[],
  fallback: string,
): string =>
  roles
    .map((role) => swatches.find((swatch) => swatch.role === role)?.value)
    .find((value) => value !== undefined) ?? fallback;

const toOklch = converter('oklch');

const chroma = (color: string): number => toOklch(color)?.c ?? 0;

const VIVID_CHROMA = 0.07;

export const vividAccent = (swatches: readonly Swatch[], fallback: string): string => {
  const vivid = swatches
    .filter((swatch) => chroma(swatch.value) >= VIVID_CHROMA)
    .sort((left, right) => chroma(right.value) - chroma(left.value));
  return (vivid.find((swatch) => swatch.role === 'Accent color') ?? vivid[0])?.value ?? fallback;
};

export const isLight = (color: string): boolean => wcagLuminance(color) > 0.4;

export const withAlpha = (color: string, alpha: number): string => {
  const parsed = parse(color);
  return parsed === undefined ? color : formatRgb({ ...parsed, alpha });
};

export const BACKDROP_ROLES = ['Background color', 'Surface color'] as const;
