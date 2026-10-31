import { linear } from '@/design';
import {
  avatar,
  CARD_SIZE,
  ellipse,
  icon,
  line,
  path,
  rect,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { FONTS, TIDE } from './parts';

const { width: CW, height: CH } = CARD_SIZE;
const SKY_END = '#e7f7f3';

interface Role {
  value: string;
  hint: string;
}

type SceneTheme = Theme<{ colors: { primary: Role; secondary: Role } }>;

const hills = (t: SceneTheme, x: number, y: number, width: number, height: number) => [
  path(
    'M0 60 Q 160 0 330 46 T 700 40 L700 100 L0 100 Z',
    x,
    y,
    width,
    height,
    t.shade('primary', TIDE.hill),
    { width: 700, height: 100 },
  ),
  path(
    'M0 80 Q 200 40 400 74 T 700 66 L700 100 L0 100 Z',
    x,
    y,
    width,
    height,
    t.color('primary'),
    {
      width: 700,
      height: 100,
    },
  ),
];

const clouds = (t: SceneTheme, x: number, y: number, scale: number) => [
  ellipse(x, y, 120 * scale, 40 * scale, t.color('secondary'), { name: 'Cloud' }),
  ellipse(x + 30 * scale, y - 22 * scale, 64 * scale, 50 * scale, t.color('secondary'), {
    name: 'Cloud',
  }),
];

const sky = (t: SceneTheme) =>
  linear(180, t.shade('primary', TIDE.sky), t.shade('primary', SKY_END));

const NAME = { label: 'Name', value: 'Maya Linden' } as const;
const ROLE = { label: 'Job title', value: 'Product Designer' } as const;

const frontSpec = {
  colors: {
    background: { value: TIDE.paper, hint: 'Card' },
    primary: {
      value: TIDE.teal,
      hint: 'Front hills and the bottom edge; its shades color the sky, back hills and the job title pill',
    },
    accent: { value: TIDE.sun, hint: 'Sun' },
    secondary: { value: TIDE.white, hint: 'Clouds, photo ring and the job title' },
    text: { value: TIDE.ink, hint: 'Name' },
  },
  fonts: FONTS,
  copy: { name: NAME, role: ROLE },
} as const satisfies ThemeSpec;

export const cardFront = themed(CW, CH, frontSpec, (t) => [
  rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
  rect(0, 0, CW, 260, sky(t), { name: 'Sky' }),
  clouds(t, 110, 80, 1),
  clouds(t, 780, 60, 0.8),
  ellipse(880, 120, 60, 60, t.color('accent'), { name: 'Sun' }),
  hills(t, 0, 170, CW, 90),
  avatar('woman-portrait-4', CW / 2, 250, 92, t.color('secondary')),
  text(t.copy('name'), 0, 370, CW, {
    fontFamily: t.font('heading'),
    fontSize: 64,
    fontWeight: 800,
    fill: t.color('text'),
    align: 'center',
  }),
  rect(CW / 2 - 150, 466, 300, 60, t.shade('primary', TIDE.deep), {
    cornerRadius: 30,
    name: 'Role pill',
  }),
  text(t.copy('role'), CW / 2 - 150, 481, 300, {
    fontFamily: t.font('body'),
    fontSize: 26,
    fontWeight: 700,
    fill: t.color('secondary'),
    align: 'center',
  }),
  rect(0, CH - 14, CW, 14, t.color('primary'), { name: 'Edge' }),
]);

const BACK_ICONS = ['phone', 'mail', 'map-pin'] as const;

const backSpec = {
  colors: {
    background: { value: TIDE.paper, hint: 'Card' },
    primary: {
      value: TIDE.teal,
      hint: 'Front hills and the bottom edge; its shades color the sky, back hills, job title pill and contact icons',
    },
    secondary: { value: TIDE.white, hint: 'Clouds, photo ring and the job title' },
    text: {
      value: TIDE.ink,
      hint: 'Name and contact details; its lighter shades color the contact labels and rules',
    },
  },
  fonts: FONTS,
  copy: {
    name: NAME,
    role: ROLE,
    labels: { label: 'Contact label', value: ['mobile', 'email', 'studio'] },
    contacts: {
      label: 'Contact',
      value: ['(555) 210-4477', 'maya@linden.studio', '48 Harbor Lane'],
    },
  },
} as const satisfies ThemeSpec;

export const cardBack = themed(CW, CH, backSpec, (t) => {
  const contacts = t.list('contacts');
  return [
    rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
    rect(0, 0, 340, CH, sky(t), { name: 'Sky' }),
    clouds(t, 50, 110, 0.9),
    clouds(t, 190, 230, 0.6),
    hills(t, 0, 430, 340, 170),
    avatar('woman-portrait-4', 340, 200, 96, t.color('secondary')),
    text(t.copy('name'), 470, 70, 560, {
      fontFamily: t.font('heading'),
      fontSize: 54,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    rect(470, 148, 270, 50, t.shade('primary', TIDE.deep), { cornerRadius: 25, name: 'Role pill' }),
    text(t.copy('role'), 470, 160, 270, {
      fontFamily: t.font('body'),
      fontSize: 22,
      fontWeight: 700,
      fill: t.color('secondary'),
      align: 'center',
    }),
    t.list('labels').map((label, index) => {
      const y = 250 + index * 110;
      return [
        icon(BACK_ICONS[index] ?? 'phone', 470, y + 20, 36, t.shade('primary', TIDE.deep), {
          strokeWidth: 2.2,
        }),
        text(label, 530, y, 460, {
          fontFamily: t.font('body'),
          fontSize: 20,
          fontWeight: 500,
          fill: t.shade('text', TIDE.muted),
        }),
        text(contacts[index] ?? '', 530, y + 28, 460, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 500,
          fill: t.color('text'),
        }),
        line(470, y + 88, 540, t.shade('text', TIDE.grey), 2),
      ];
    }),
    rect(0, CH - 14, CW, 14, t.color('primary'), { name: 'Edge' }),
  ];
});
