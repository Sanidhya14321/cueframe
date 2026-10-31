import { type DesignIconName, linear } from '@/design';
import {
  circle,
  group,
  icon,
  type Nodes,
  paint,
  phone,
  phoneScreen,
  rect,
  type Theme,
  text,
} from '../../../kit';

export interface AppPalette {
  brand: string;
  deep: string;
  soft: string;
  accent: string;
  ink: string;
  night: string;
  paper: string;
  muted: string;
}

export const VIOLET: AppPalette = {
  brand: '#6d4aff',
  deep: '#3b1fd1',
  soft: '#b9a8ff',
  accent: '#ff7a59',
  ink: '#140f2e',
  night: '#241a5c',
  paper: '#f6f3ff',
  muted: '#5b5675',
};

export const SUNSET: AppPalette = {
  brand: '#ff6a3d',
  deep: '#c2410c',
  soft: '#ffc2a8',
  accent: '#ffd23f',
  ink: '#1a0f0a',
  night: '#3a1d12',
  paper: '#fff4ec',
  muted: '#6b5a50',
};

type Shade = (exact: string) => string;

interface Field {
  label: string;
  value: string;
}

interface ListField {
  label: string;
  value: readonly string[];
}

interface Role {
  value: string;
  hint: string;
}

export type DeviceTheme = Theme<{
  colors: { primary: Role; accent: Role };
  fonts: { heading: Field };
  copy: { greeting: Field; balance: Field };
}>;

export type BadgeTheme = Theme<{
  colors: { primary: Role };
  fonts: { body: Field };
  copy: { badgeLines: ListField; stores: ListField };
}>;

export const HEADING = { label: 'Heading font', value: 'Plus Jakarta Sans' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;

export const SITE = { label: 'Website', value: 'nimbly.app' } as const;

export const APP_COPY = {
  greeting: { label: 'App greeting', value: 'Hi, Maya' },
  balance: { label: 'App balance', value: '$12,480' },
} as const;

export const BADGE_COPY = {
  badgeLines: { label: 'Badge line', value: ['GET IT ON', 'DOWNLOAD ON'] },
  stores: { label: 'Store', value: ['Android', 'iPhone'] },
} as const;

export interface DeviceInk {
  dark: Shade;
  light: Shade;
}

const appUi = (
  t: DeviceTheme,
  ink: DeviceInk,
  p: AppPalette,
  width: number,
  height: number,
): Nodes[] => {
  const pad = width * 0.08;
  const inner = width - pad * 2;
  const brand = (exact: string) => t.shade('primary', exact);
  return [
    rect(0, 0, width, height * 0.38, linear(150, brand(p.brand), brand(p.deep)), {
      cornerRadius: width * 0.12,
      name: 'App header',
    }),
    text(t.copy('greeting'), pad, height * 0.09, inner, {
      fontFamily: t.font('heading'),
      fontSize: width * 0.065,
      fontWeight: 500,
      fill: ink.light('rgba(255,255,255,0.8)'),
    }),
    text(t.copy('balance'), pad, height * 0.14, inner, {
      fontFamily: t.font('heading'),
      fontSize: width * 0.14,
      fontWeight: 800,
      fill: ink.light('#ffffff'),
    }),
    rect(pad, height * 0.27, width * 0.36, height * 0.05, ink.light('rgba(255,255,255,0.22)'), {
      cornerRadius: height * 0.025,
      name: 'Chip',
    }),
    rect(pad, height * 0.42, inner, height * 0.2, ink.light('#ffffff'), {
      cornerRadius: width * 0.06,
      name: 'Chart card',
    }),
    [0.45, 0.7, 0.55, 0.9, 0.65, 1].map((value, index) =>
      rect(
        pad + inner * 0.1 + index * inner * 0.14,
        height * 0.44 + height * 0.15 * (1 - value),
        inner * 0.08,
        height * 0.15 * value,
        index === 5 ? t.shade('accent', p.accent) : brand(p.brand),
        { cornerRadius: inner * 0.03, name: 'Bar' },
      ),
    ),
    [0, 1, 2].map((row) => [
      circle(pad + width * 0.06, height * (0.69 + row * 0.085), width * 0.06, brand(p.soft)),
      rect(
        pad + width * 0.16,
        height * (0.675 + row * 0.085),
        inner * 0.55,
        height * 0.016,
        ink.dark(p.ink),
        {
          cornerRadius: height * 0.008,
          name: 'Row title',
        },
      ),
      rect(
        pad + width * 0.16,
        height * (0.7 + row * 0.085),
        inner * 0.35,
        height * 0.012,
        ink.dark('#c9c4dc'),
        {
          cornerRadius: height * 0.006,
          name: 'Row detail',
        },
      ),
    ]),
  ];
};

export const device = (
  t: DeviceTheme,
  ink: DeviceInk,
  p: AppPalette,
  x: number,
  y: number,
  width: number,
  rotation?: number,
) => {
  const screen = phoneScreen(width);
  return paint(
    [
      phone(x, y, width, {
        screen: ink.light(p.paper),
        body: ink.dark('#0b0b0f'),
        content: appUi(t, ink, p, screen.width, screen.height),
        ...(rotation === undefined ? {} : { rotation }),
      }),
    ],
    { '#0b0b0f': ink.dark('#0b0b0f') },
  );
};

const badge = (
  t: BadgeTheme,
  ink: DeviceInk,
  x: number,
  y: number,
  name: DesignIconName,
  top: string,
  bottom: string,
) =>
  group(
    rect(x, y, 230, 72, ink.dark('#0b0b12'), {
      cornerRadius: 16,
      stroke: ink.light('rgba(255,255,255,0.6)'),
      strokeWidth: 2,
      name: 'Store badge',
    }),
    icon(name, x + 18, y + 16, 40, ink.light('#ffffff')),
    text(top, x + 72, y + 10, 150, {
      fontFamily: t.font('body'),
      fontSize: 16,
      fontWeight: 500,
      fill: ink.light('#ffffff'),
    }),
    text(bottom, x + 72, y + 30, 150, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 700,
      fill: ink.light('#ffffff'),
    }),
  );

export const badges = (t: BadgeTheme, ink: DeviceInk, x: number, y: number) => {
  const [androidLine = '', iphoneLine = ''] = t.list('badgeLines');
  const [android = '', iphone = ''] = t.list('stores');
  return [
    badge(t, ink, x, y, 'play', androidLine, android),
    badge(t, ink, x + 250, y, 'smartphone', iphoneLine, iphone),
  ];
};
