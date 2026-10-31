import type { IconNode } from 'lucide';
import { CORE_ICONS } from './icon-set-core';
import { EXTRA_ICONS } from './icon-set-extra';

export const DESIGN_ICONS = { ...CORE_ICONS, ...EXTRA_ICONS } as const satisfies Record<
  string,
  IconNode
>;

export type DesignIconName = keyof typeof DESIGN_ICONS;

export const DESIGN_ICON_NAMES = Object.keys(DESIGN_ICONS) as DesignIconName[];

export const isDesignIcon = (name: string): name is DesignIconName =>
  Object.hasOwn(DESIGN_ICONS, name);

const escapeAttribute = (value: string | number): string =>
  String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

export const iconSvg = (name: string, color: string, strokeWidth: number, size = 24): string => {
  const node: IconNode = isDesignIcon(name) ? DESIGN_ICONS[name] : DESIGN_ICONS.star;
  const children = node
    .map(([tag, attributes]) => {
      const attrs = Object.entries(attributes)
        .map(([key, value]) => `${key}="${escapeAttribute(value ?? '')}"`)
        .join(' ');
      return `<${tag} ${attrs}/>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${escapeAttribute(color)}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;
};

export const iconDataUrl = (name: string, color: string, strokeWidth: number, size = 512): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSvg(name, color, strokeWidth, size))}`;
