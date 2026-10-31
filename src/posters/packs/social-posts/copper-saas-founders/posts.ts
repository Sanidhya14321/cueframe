import { type Fill, linear, NO_FILTERS } from '@/design';
import {
  ellipse,
  group,
  icon,
  POST_SIZE,
  photo,
  pill,
  poly,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface SaasTheme {
  background: string;
  backgroundEnd?: string;
  base: string;
  text: string;
  brand: string;
  glow: string;
  muted: string;
  panel: string;
  onBrand: string;
}

export const COPPER: SaasTheme = {
  background: '#0d0d10',
  base: '#0d0d10',
  text: '#ffffff',
  brand: '#ff6a1f',
  glow: '#ffb067',
  muted: '#a1a1aa',
  panel: '#1a1a20',
  onBrand: '#ffffff',
};

export const LILAC: SaasTheme = {
  background: '#f1ecff',
  backgroundEnd: '#c4b5fd',
  base: '#ddd3ff',
  text: '#1e1240',
  brand: '#6d28d9',
  glow: '#a78bfa',
  muted: '#4c3d75',
  panel: '#ffffff',
  onBrand: '#ffffff',
};

export const W = POST_SIZE.width;
export const H = POST_SIZE.height;

const DISPLAY_FONT = { label: 'Heading font', value: 'Archivo Black' } as const;
export const HEADING_FONT = { label: 'Heading font', value: 'Outfit' } as const;
const LOGO_FONT = { label: 'Logo font', value: 'Outfit' } as const;
export const BODY_FONT = { label: 'Body font', value: 'DM Sans' } as const;
export const BRAND = { label: 'Brand name', value: 'Northpeak Labs' } as const;

export const backdrop = (fill: Fill) => rect(0, 0, W, H, fill, { name: 'Background' });

export const backdropFill = (
  theme: SaasTheme,
  base: string,
  shade: (exact: string) => string,
): Fill =>
  theme.backgroundEnd === undefined ? base : linear(150, base, shade(theme.backgroundEnd));

interface MarkColors {
  tile: string;
  arrow: string;
  name: string;
}

export const footerMark = (
  x: number,
  y: number,
  colors: MarkColors,
  brand: string,
  fontFamily: string,
) =>
  group(
    rect(x, y + 4, 34, 34, colors.tile, { cornerRadius: 9, name: 'Mark' }),
    icon('arrow-up-right', x + 5, y + 9, 24, colors.arrow, { strokeWidth: 3 }),
    text(brand, x + 48, y + 4, 400, {
      fontFamily,
      fontSize: 30,
      fontWeight: 700,
      fill: colors.name,
    }),
  );

export const headerLink = (
  label: string,
  side: 'left' | 'right',
  fill: string,
  fontFamily: string,
) =>
  text(label, side === 'left' ? 70 : W - 470, 60, 400, {
    fontFamily,
    fontSize: 28,
    fontWeight: 500,
    fill,
    ...(side === 'right' ? { align: 'right' as const } : {}),
  });

export const trend = (
  points: readonly (readonly [number, number])[],
  thickness: number,
  fill: Fill,
) => {
  const last = points.at(-1) ?? [0, 0];
  const before = points.at(-2) ?? [0, 0];
  const angle = Math.atan2(last[1] - before[1], last[0] - before[0]);
  const head = thickness * 3.2;
  const tip: [number, number] = [
    last[0] + Math.cos(angle) * head,
    last[1] + Math.sin(angle) * head,
  ];
  const side = (sign: number): [number, number] => [
    last[0] + Math.cos(angle + (sign * Math.PI) / 2) * head * 0.7,
    last[1] + Math.sin(angle + (sign * Math.PI) / 2) * head * 0.7,
  ];
  return group(
    poly(
      [
        ...points.map(([px, py]): [number, number] => [px, py - thickness / 2]),
        ...[...points].reverse().map(([px, py]): [number, number] => [px, py + thickness / 2]),
      ],
      fill,
      { name: 'Trend line' },
    ),
    poly([side(-1), tip, side(1)], fill, { name: 'Trend arrow' }),
  );
};

export const systemsPost = (theme: SaasTheme) => {
  const spec = {
    colors: {
      background: {
        value: theme.background,
        hint: 'Page behind the photo and the dark shade that fades over it',
      },
      primary: { value: theme.brand, hint: 'Trend arrow and the logo tile' },
      text: { value: '#ffffff', hint: 'Headline, brand name and the arrow in the logo tile' },
    },
    fonts: { heading: DISPLAY_FONT, logo: LOGO_FONT },
    copy: {
      headline: { label: 'Headline', value: 'TOOLS THAT\nGIVE YOU TIME\nBACK, NOT\nMORE WORK' },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    backdrop(t.color('background')),
    photo('city-night', 0, 0, W, H, { filters: { ...NO_FILTERS, grayscale: 1 } }),
    rect(
      0,
      0,
      W,
      H,
      linear(
        180,
        t.shade('background', 'rgba(0,0,0,0.35)'),
        t.shade('background', 'rgba(0,0,0,0.85)'),
      ),
      { name: 'Shade' },
    ),
    text(t.copy('headline'), 0, 280, W, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.05,
    }),
    trend(
      [
        [80, 1180],
        [380, 1040],
        [560, 1100],
        [880, 860],
      ],
      18,
      t.color('primary'),
    ),
    footerMark(
      80,
      1240,
      { tile: t.color('primary'), arrow: t.color('text'), name: t.color('text') },
      t.copy('brand'),
      t.font('logo'),
    ),
  ]);
};

export const introNumber = (theme: SaasTheme) => {
  const spec = {
    colors: {
      background: { value: theme.background, hint: 'Page' },
      primary: { value: theme.brand, hint: 'Rounded brand block and the arrow in the logo tile' },
      text: {
        value: theme.text,
        hint: 'Top links, the big number, the intro text and the logo tile and name on the block',
      },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      left: { label: 'Top left link', value: 'Start today' },
      right: { label: 'Top right link', value: 'Join us' },
      number: { label: 'Number', value: '01.' },
      body: {
        label: 'Intro',
        value:
          'We help SaaS teams ship faster with clear strategy and sharp design.\nNo bloated decks. No guesswork.\nJust launches that land.',
      },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    backdrop(t.color('background')),
    headerLink(t.copy('left'), 'left', t.color('text'), t.font('body')),
    headerLink(t.copy('right'), 'right', t.color('text'), t.font('body')),
    text(t.copy('number'), 430, 250, 600, {
      fontFamily: t.font('heading'),
      fontSize: 220,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'right',
    }),
    text(t.copy('body'), 130, 560, 820, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.45,
    }),
    rect(130, 1020, 950, 330, t.color('primary'), { name: 'Brand block', cornerRadius: 40 }),
    rect(1040, 1020, 40, 330, t.color('primary'), { name: 'Brand block edge' }),
    rect(130, 1310, 950, 40, t.color('primary'), { name: 'Brand block edge' }),
    group(
      rect(190, 1170, 42, 42, t.color('text'), { cornerRadius: 10, name: 'Mark' }),
      icon('arrow-up-right', 197, 1177, 28, t.color('primary'), { strokeWidth: 3 }),
      text(t.copy('brand'), 250, 1172, 500, {
        fontFamily: t.font('heading'),
        fontSize: 34,
        fontWeight: 700,
        fill: t.color('text'),
      }),
    ),
  ]);
};

export const smartStrategy = (theme: SaasTheme) => {
  const spec = {
    colors: {
      background: {
        value: theme.background,
        hint: 'Page behind the photo, the dark shade over the photo and the Talk to us button',
      },
      primary: { value: theme.brand, hint: 'Center card, the plus sign and the logo tile' },
      text: {
        value: '#ffffff',
        hint: 'Card headline, plus disc, button label, brand name and the logo arrow',
      },
    },
    fonts: { heading: HEADING_FONT },
    copy: {
      headline: { label: 'Headline', value: 'Smart\ncontent &\nstrategy' },
      cta: { label: 'Button', value: 'Talk to us' },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    backdrop(t.color('background')),
    photo('desk-imac', 0, 0, W, H),
    rect(0, 0, W, H, t.shade('background', 'rgba(0,0,0,0.35)'), { name: 'Shade' }),
    rect(190, 300, 700, 700, t.color('primary'), {
      name: 'Card',
      cornerRadius: 50,
      ...shadow(50, 20, 'rgba(0,0,0,0.45)'),
    }),
    ellipse(230, 340, 70, 70, t.color('text'), { name: 'Plus disc' }),
    icon('plus', 245, 355, 40, t.color('primary'), { strokeWidth: 3 }),
    text(t.copy('headline'), 190, 440, 700, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.05,
    }),
    pill(t.copy('cta'), 390, 840, {
      fill: t.shade('background', '#0d0d10'),
      color: t.color('text'),
      fontSize: 36,
      fontFamily: t.font('heading'),
      fontWeight: 700,
      width: 300,
    }),
    footerMark(
      80,
      1240,
      { tile: t.color('primary'), arrow: t.color('text'), name: t.color('text') },
      t.copy('brand'),
      t.font('heading'),
    ),
  ]);
};

export const allInOne = (theme: SaasTheme) => {
  const spec = {
    colors: {
      background: {
        value: theme.background,
        hint: 'Page; its shades color the dark folders stacked on the card',
      },
      primary: {
        value: theme.brand,
        hint: 'Card gradient and its glow, and the logo tile; its lighter shade ends the card gradient',
      },
      text: {
        value: theme.onBrand,
        hint: 'Headline, body text, brand name and the logo arrow',
      },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      headline: { label: 'Headline', value: 'Everything in\none place.' },
      body: {
        label: 'Body',
        value: 'Docs, tasks and launch plans living\nin one shared workspace.',
      },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    backdrop(t.color('background')),
    rect(210, 170, 660, 1000, linear(160, t.color('primary'), t.shade('primary', theme.glow)), {
      name: 'Card',
      cornerRadius: 40,
      ...shadow(60, 0, t.shade('primary', 'rgba(255,106,31,0.45)')),
    }),
    text(t.copy('headline'), 260, 230, 580, {
      fontFamily: t.font('heading'),
      fontSize: 72,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1.08,
    }),
    text(t.copy('body'), 260, 420, 580, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.4,
    }),
    [0, 1, 2].map((index) => {
      const x = 300 + index * 50;
      const y = 600 + index * 110;
      return group(
        rect(x, y, 190, 60, t.shade('background', 'rgba(0,0,0,0.35)'), {
          cornerRadius: 14,
          name: 'Folder tab',
        }),
        rect(
          x,
          y + 36,
          400,
          250,
          index === 2
            ? t.shade('background', theme.panel)
            : t.shade('background', 'rgba(0,0,0,0.3)'),
          { cornerRadius: 18, name: 'Folder' },
        ),
      );
    }),
    footerMark(
      380,
      1070,
      { tile: t.color('primary'), arrow: t.color('text'), name: t.color('text') },
      t.copy('brand'),
      t.font('heading'),
    ),
  ]);
};
