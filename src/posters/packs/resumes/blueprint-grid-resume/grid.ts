import { type DesignIconName, IMAGE_FILTER_PRESETS } from '@/design';
import { circle, icon, photo, rect, type Theme, type ThemeSpec, text } from '../../../kit';
import type { PosterPhotoName } from '../../../photos';

export const GRID = {
  paper: '#edf2f8',
  line: 'rgba(26,31,54,0.07)',
  clear: 'rgba(26,31,54,0)',
  ink: '#1a1f36',
  muted: '#4a5068',
  accent: '#ff6a3d',
  soft: '#c5ccdb',
};

export const LETTER = { width: 1275, height: 1650 } as const;
export const HEAD = { label: 'Heading font', value: 'Bricolage Grotesque' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;
export const NAME = { label: 'Name', value: 'Theo Marlowe' } as const;
export const ROLE = { label: 'Role', value: 'BRAND DESIGNER' } as const;
export const CONTACT_LABELS = {
  label: 'Contact label',
  value: ['PHONE', 'EMAIL', 'STUDIO'],
} as const;
export const CONTACT_VALUES = {
  label: 'Contact detail',
  value: ['(555) 402-1189', 'hello@theomarlowe.co', '19 Alder Row'],
} as const;
const CONTACT_ICONS: readonly DesignIconName[] = ['phone', 'mail', 'house'];

interface Font {
  label: string;
  value: string;
}

interface Role {
  value: string;
  hint: string;
}

export interface GridSpec extends ThemeSpec {
  colors: { background: Role; primary: Role; accent: Role };
  fonts: { heading: Font };
}

interface ContactSpec extends GridSpec {
  fonts: { heading: Font; body: Font };
}

export const gridColors = (primary: string, accent: string) => ({
  background: {
    value: GRID.paper,
    hint: 'Grid paper and the centers of the corner handles around the name',
  },
  primary: {
    value: GRID.ink,
    hint: `${primary}; its faint tint draws the grid lines`,
  },
  accent: { value: GRID.accent, hint: accent },
});

export const gridPaper = <S extends GridSpec>(
  t: Theme<S>,
  width: number,
  height: number,
  step = 50,
) => [
  rect(0, 0, width, height, t.color('background'), { name: 'Background' }),
  Array.from({ length: Math.floor(width / step) }, (_, index) =>
    rect((index + 1) * step, 0, 2, height, t.shade('primary', GRID.line), { name: 'Grid line' }),
  ),
  Array.from({ length: Math.floor(height / step) }, (_, index) =>
    rect(0, (index + 1) * step, width, 2, t.shade('primary', GRID.line), { name: 'Grid line' }),
  ),
];

export const selectionName = <S extends GridSpec>(
  t: Theme<S>,
  label: string,
  x: number,
  y: number,
  width: number,
  height: number,
  size: number,
) => {
  const handle = Math.max(7, size * 0.09);
  return [
    rect(x, y, width, height, t.shade('primary', GRID.clear), {
      stroke: t.color('primary'),
      strokeWidth: Math.max(2, size * 0.035),
      name: 'Selection box',
    }),
    [
      [x, y],
      [x + width, y],
      [x, y + height],
      [x + width, y + height],
    ].map(([cx = 0, cy = 0]) =>
      circle(cx, cy, handle, t.color('background'), {
        stroke: t.color('accent'),
        strokeWidth: Math.max(2, size * 0.035),
        name: 'Handle',
      }),
    ),
    text(label, x, y + (height - size * 1.15) / 2, width, {
      fontFamily: t.font('heading'),
      fontSize: size,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1.15,
    }),
  ];
};

export const roleLine = <S extends GridSpec>(
  t: Theme<S>,
  label: string,
  x: number,
  y: number,
  width: number,
  size: number,
  letterSpacing: number,
) =>
  text(label, x, y, width, {
    fontFamily: t.font('heading'),
    fontSize: size,
    fontWeight: 800,
    fill: t.color('primary'),
    align: 'center',
    letterSpacing,
  });

export const monoPhoto = (
  name: PosterPhotoName,
  x: number,
  y: number,
  width: number,
  height: number,
) => photo(name, x, y, width, height, { filters: IMAGE_FILTER_PRESETS.mono });

export const contactEntry = <S extends ContactSpec>(
  t: Theme<S>,
  muted: string,
  labels: readonly string[],
  values: readonly string[],
  index: number,
  place: { x: number; y: number; iconY: number; iconSize: number; gap: number; lead: number },
  size: number,
  width: number,
) => [
  icon(CONTACT_ICONS[index] ?? 'phone', place.x, place.iconY, place.iconSize, t.color('accent'), {
    strokeWidth: 2.4,
  }),
  text(labels[index] ?? '', place.x + place.gap, place.y, width, {
    fontFamily: t.font('body'),
    fontSize: size,
    fontWeight: 700,
    fill: t.color('primary'),
    letterSpacing: 1,
  }),
  text(values[index] ?? '', place.x + place.gap, place.y + place.lead, width, {
    fontFamily: t.font('body'),
    fontSize: size,
    fontWeight: 400,
    fill: muted,
  }),
];

export const contactBlock = <S extends ContactSpec>(
  t: Theme<S>,
  muted: string,
  labels: readonly string[],
  values: readonly string[],
  x: number,
  y: number,
  size: number,
) =>
  labels.map((_, index) => {
    const top = y + index * size * 3.2;
    return contactEntry(
      t,
      muted,
      labels,
      values,
      index,
      {
        x,
        y: top,
        iconY: top + size * 0.15,
        iconSize: size * 1.5,
        gap: size * 2.3,
        lead: size * 1.35,
      },
      size,
      420,
    );
  });
