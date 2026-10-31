import { linear } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  POST_SIZE,
  photo,
  rect,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface SaasPalette {
  top: string;
  mid: string;
  bottom: string;
  accent: string;
  deep: string;
}

export const EMERALD: SaasPalette = {
  top: '#10b981',
  mid: '#065f46',
  bottom: '#021a14',
  accent: '#a7f3d0',
  deep: '#04281f',
};

export const SUNSET: SaasPalette = {
  top: '#fb923c',
  mid: '#9a3412',
  bottom: '#1c0a04',
  accent: '#fed7aa',
  deep: '#2a1006',
};

export const W = POST_SIZE.width;
export const H = POST_SIZE.height;
const WHITE = '#ffffff';

interface Role {
  value: string;
  hint: string;
}

interface Hints {
  primary: string;
  accent: string;
  text: string;
  surface: string;
}

export type SaasTheme = Theme<{
  colors: { primary: Role; accent: Role; text: Role; surface: Role };
  fonts: { heading: { label: string; value: string } };
  copy: { brand: { label: string; value: string }; studio: { label: string; value: string } };
}>;

export const HEADING = { label: 'Heading font', value: 'Manrope' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;

export const BRAND = {
  brand: { label: 'Brand', value: 'Northpeak' },
  studio: { label: 'Brand second word', value: 'Studio' },
} as const;

export const saasColors = (p: SaasPalette, hints: Hints) => ({
  primary: { value: p.top, hint: hints.primary },
  accent: { value: p.accent, hint: hints.accent },
  text: { value: WHITE, hint: hints.text },
  surface: { value: WHITE, hint: hints.surface },
});

export const backdrop = (t: SaasTheme, p: SaasPalette) =>
  rect(
    0,
    0,
    W,
    H,
    linear(180, t.color('primary'), t.shade('primary', p.mid), t.shade('primary', p.bottom)),
    { name: 'Background' },
  );

export const title = (
  t: SaasTheme,
  content: string,
  y: number,
  size: number,
  fill = t.color('text'),
  weight = 800,
) =>
  text(content, 0, y, W, {
    fontFamily: t.font('heading'),
    fontSize: size,
    fontWeight: weight,
    fill,
    align: 'center',
    lineHeight: 1.08,
  });

export const brandMark = (t: SaasTheme, y = 1250, fill = t.color('text')) => [
  text(t.copy('brand'), 0, y, W / 2 + 60, {
    fontFamily: t.font('heading'),
    fontSize: 30,
    fontWeight: 800,
    fill,
    align: 'right',
  }),
  text(t.copy('studio'), W / 2 + 72, y, 300, {
    fontFamily: t.font('heading'),
    fontSize: 30,
    fontWeight: 800,
    fill: t.color('accent'),
  }),
];

export const glass = (
  t: SaasTheme,
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 28,
) =>
  rect(x, y, width, height, t.shade('surface', 'rgba(255,255,255,0.12)'), {
    cornerRadius: radius,
    stroke: t.shade('surface', 'rgba(255,255,255,0.35)'),
    strokeWidth: 2,
    name: 'Glass card',
  });

export const darkTile = (
  t: SaasTheme,
  p: SaasPalette,
  x: number,
  y: number,
  width: number,
  height: number,
) =>
  rect(x, y, width, height, linear(180, t.shade('primary', p.mid), t.shade('primary', p.deep)), {
    cornerRadius: 28,
    stroke: t.shade('surface', 'rgba(255,255,255,0.22)'),
    strokeWidth: 2,
    name: 'Tile',
  });

const windowDots = (t: SaasTheme, x: number, y: number) =>
  [0, 1, 2].map((index) =>
    circle(x + index * 22, y, 7, t.shade('surface', 'rgba(255,255,255,0.7)')),
  );

const allInOneSpec = (p: SaasPalette) =>
  ({
    colors: saasColors(p, {
      primary: 'Page gradient; its darker shades color the front window and the plus icon',
      accent: 'Built to deliver and Studio',
      text: 'All in One Place, the window headline and Northpeak',
      surface: 'Glass windows, window dots, the plus button and the window outline',
    }),
    fonts: { heading: HEADING },
    copy: {
      title: { label: 'Title', value: 'All in One Place' },
      subtitle: { label: 'Subtitle', value: 'Built to deliver' },
      card: { label: 'Window headline', value: 'Find clients\nfaster and\neasier' },
      ...BRAND,
    },
  }) as const satisfies ThemeSpec;

export const allInOne = (p: SaasPalette) =>
  themed(W, H, allInOneSpec(p), (t) => [
    backdrop(t, p),
    title(t, t.copy('title'), 120, 84),
    title(t, t.copy('subtitle'), 225, 54, t.color('accent'), 500),
    glass(t, 280, 420, 520, 140),
    windowDots(t, 310, 450),
    glass(t, 250, 490, 580, 140),
    windowDots(t, 280, 520),
    darkTile(t, p, 220, 560, 640, 440),
    windowDots(t, 260, 600),
    text(t.copy('card'), 260, 650, 520, {
      fontFamily: t.font('heading'),
      fontSize: 66,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1.1,
    }),
    circle(790, 930, 42, t.color('surface')),
    icon('plus', 764, 904, 52, t.shade('primary', p.mid), { strokeWidth: 3 }),
    brandMark(t),
  ]);

const ZERO_ICONS = ['workflow', 'target', 'sparkles', 'award'] as const;

const zeroSpec = (p: SaasPalette) =>
  ({
    colors: saasColors(p, {
      primary: 'Page gradient; its darker shades color the tiles and the tile icons',
      accent: 'guaranteed and Studio',
      text: 'Zero confusion, the tile labels and Northpeak',
      surface: 'Icon discs and tile outlines',
    }),
    fonts: { heading: HEADING },
    copy: {
      title: { label: 'Title', value: 'Zero confusion' },
      subtitle: { label: 'Subtitle', value: 'guaranteed' },
      tiles: {
        label: 'Tile',
        value: [
          'Only one\nclear process',
          'Designed\nfor impact',
          'Only what\nmatters',
          'Top 1%\nquality',
        ],
      },
      ...BRAND,
    },
  }) as const satisfies ThemeSpec;

export const zeroConfusion = (p: SaasPalette) =>
  themed(W, H, zeroSpec(p), (t) => [
    backdrop(t, p),
    title(t, t.copy('title'), 110, 84),
    title(t, t.copy('subtitle'), 210, 84, t.color('accent')),
    t.list('tiles').map((label, index) => {
      const x = 90 + (index % 2) * 470;
      const y = 400 + Math.floor(index / 2) * 330;
      return [
        darkTile(t, p, x, y, 430, 290),
        circle(x + 70, y + 70, 40, t.color('surface')),
        icon(ZERO_ICONS[index] ?? 'workflow', x + 48, y + 48, 44, t.shade('primary', p.mid), {
          strokeWidth: 2.4,
        }),
        text(label, x + 40, y + 140, 370, {
          fontFamily: t.font('heading'),
          fontSize: 40,
          fontWeight: 700,
          fill: t.color('text'),
          lineHeight: 1.15,
        }),
      ];
    }),
    brandMark(t),
  ]);

const SAAS_ICONS = ['target', 'trending-up', 'award'] as const;

const saasSpec = (p: SaasPalette) =>
  ({
    colors: saasColors(p, {
      primary: 'Page gradient; its darker shades color the tiles',
      accent: 'AI Business, the tile icons and Studio',
      text: 'For SaaS and, the tile labels and Northpeak',
      surface: 'Tile outlines',
    }),
    fonts: { heading: HEADING },
    copy: {
      title: { label: 'Title', value: 'For SaaS and' },
      subtitle: { label: 'Second title line', value: 'AI Business' },
      tiles: { label: 'Tile', value: ['Designed for impact', 'Built to scale', 'Top 1% quality'] },
      ...BRAND,
    },
  }) as const satisfies ThemeSpec;

export const saasBusiness = (p: SaasPalette) =>
  themed(W, H, saasSpec(p), (t) => [
    backdrop(t, p),
    text(t.copy('title'), 80, 110, 920, {
      fontFamily: t.font('heading'),
      fontSize: 80,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    text(t.copy('subtitle'), 80, 205, 920, {
      fontFamily: t.font('heading'),
      fontSize: 80,
      fontWeight: 800,
      fill: t.color('accent'),
    }),
    photo('laptop-analytics', 80, 380, 520, 720, { cornerRadius: 30 }),
    t.list('tiles').map((label, index) => {
      const y = 380 + index * 255;
      return [
        darkTile(t, p, 630, y, 370, 210),
        icon(SAAS_ICONS[index] ?? 'target', 670, y + 36, 54, t.color('accent'), {
          strokeWidth: 2.2,
        }),
        text(label, 670, y + 116, 310, {
          fontFamily: t.font('heading'),
          fontSize: 34,
          fontWeight: 700,
          fill: t.color('text'),
        }),
      ];
    }),
    brandMark(t),
  ]);

const TOGGLES = [
  [120, 470],
  [400, 680],
  [180, 890],
] as const;

const clientsSpec = (p: SaasPalette) =>
  ({
    colors: saasColors(p, {
      primary: 'Page gradient',
      accent: 'Subtitle, the switches and Studio',
      text: '+100 Clients, the switch labels and Northpeak',
      surface: 'Glass switch cards and the switch knobs',
    }),
    fonts: { heading: HEADING },
    copy: {
      title: { label: 'Title', value: '+100 Clients' },
      subtitle: { label: 'Subtitle', value: 'have chosen Northpeak Studio' },
      perks: {
        label: 'Switch label',
        value: ['Round-the-clock help', 'Quick replies', 'Simple setup'],
      },
      ...BRAND,
    },
  }) as const satisfies ThemeSpec;

export const hundredClients = (p: SaasPalette) =>
  themed(W, H, clientsSpec(p), (t) => [
    backdrop(t, p),
    title(t, t.copy('title'), 140, 116),
    title(t, t.copy('subtitle'), 290, 40, t.color('accent'), 600),
    t.list('perks').map((label, index): Nodes[] => {
      const [x, y] = TOGGLES[index] ?? [0, 0];
      return [
        glass(t, x, y, 560, 120, 60),
        text(label, x + 50, y + 38, 360, {
          fontFamily: t.font('heading'),
          fontSize: 36,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        rect(x + 420, y + 30, 110, 60, t.color('accent'), { cornerRadius: 30, name: 'Toggle' }),
        circle(x + 500, y + 60, 24, t.color('surface')),
      ];
    }),
    brandMark(t),
  ]);
