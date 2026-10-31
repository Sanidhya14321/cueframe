import { avatar, card, circle, icon, path, pill, rect, type ThemeSpec, themed } from '../../../kit';
import { backdrop, body, FONTS, head, marker, NV, SH, SW } from './theme';

const SERVICE_ICONS = ['pen-tool', 'monitor', 'globe'] as const;

const workSpec = {
  colors: {
    background: { value: NV.cream, hint: 'Page; its darker shade outlines the service cards' },
    primary: {
      value: NV.coral,
      hint: 'Accent bar, the lead service card and the icons on the other cards',
    },
    surface: { value: NV.white, hint: 'Other service cards and everything on the lead card' },
    text: {
      value: NV.ink,
      hint: 'Our work and service names; its lighter shade colors the subtitle and descriptions',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Our work' },
    subtitle: {
      label: 'Subtitle',
      value: 'Three studios under one roof,\nbuilt for revenue teams.',
    },
    services: { label: 'Service', value: ['Branding', 'Sales decks', 'Websites'] },
    details: {
      label: 'Service detail',
      value: [
        'Identity systems that put you at the top of every shortlist.',
        'Turn bullet-point slides into a story that buyers remember.',
        'Fast, focused sites that turn visitors into qualified pipeline.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const workSlide = themed(SW, SH, workSpec, (t) => {
  const heading = head(t.font('heading'));
  const copy = body(t.font('body'));
  const details = t.list('details');
  return [
    backdrop(t.color('background')),
    marker(140, 150, t.color('primary')),
    heading(t.copy('title'), 140, 190, 900, 130, t.color('text'), { fontWeight: 800 }),
    copy(t.copy('subtitle'), 1100, 200, 700, 36, t.shade('text', NV.grey)),
    t.list('services').map((service, index) => {
      const x = 140 + index * 560;
      const lead = index === 0;
      return [
        card(x, 420, 520, 520, {
          fill: lead ? t.color('primary') : t.color('surface'),
          radius: 32,
          stroke: t.shade('background', NV.line),
          strokeWidth: lead ? 0 : 3,
          shadowBlur: 0,
        }),
        icon(
          SERVICE_ICONS[index] ?? 'globe',
          x + 50,
          480,
          72,
          lead ? t.color('surface') : t.color('primary'),
          { strokeWidth: 2 },
        ),
        heading(service, x + 50, 620, 420, 54, lead ? t.color('surface') : t.color('text')),
        copy(
          details[index] ?? '',
          x + 50,
          710,
          420,
          32,
          lead ? t.color('surface') : t.shade('text', NV.grey),
        ),
      ];
    }),
  ];
});

const PORTRAITS = [
  'woman-portrait-2',
  'man-portrait-3',
  'woman-portrait-4',
  'man-portrait-1',
] as const;

const teamSpec = {
  colors: {
    background: {
      value: NV.plum,
      hint: 'Page; its lighter shade colors the discs behind the photos',
    },
    primary: { value: NV.coral, hint: 'Photo rings and job titles' },
    text: { value: NV.white, hint: 'Title and names; its faded shade colors the bios' },
    secondary: { value: NV.peach, hint: 'Subtitle' },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Meet the strategists' },
    subtitle: {
      label: 'Subtitle',
      value: 'A senior crew that ships campaigns, not just slides.',
    },
    names: {
      label: 'Name',
      value: ['Mira Okafor', 'Theo Lindgren', 'Ana Sato', 'Dev Malhotra'],
    },
    roles: {
      label: 'Job title',
      value: ['Head of Strategy', 'Creative Director', 'Growth Lead', 'Media Buyer'],
    },
    bios: {
      label: 'Bio',
      value: [
        'Shapes positioning\nand launch plans',
        'Leads brand, decks\nand campaign craft',
        'Runs experiments\nacross the funnel',
        'Scales paid search\nand social budgets',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const teamSlide = themed(SW, SH, teamSpec, (t) => {
  const heading = head(t.font('heading'));
  const copy = body(t.font('body'));
  const roles = t.list('roles');
  const bios = t.list('bios');
  return [
    backdrop(t.color('background')),
    heading(t.copy('title'), 0, 120, SW, 96, t.color('text'), { align: 'center', fontWeight: 800 }),
    copy(t.copy('subtitle'), 0, 250, SW, 34, t.color('secondary'), { align: 'center' }),
    t.list('names').map((name, index) => {
      const cx = 360 + index * 400;
      return [
        circle(cx, 560, 160, t.shade('background', NV.plumSoft)),
        avatar(PORTRAITS[index] ?? 'man-portrait-1', cx, 540, 140, t.color('primary')),
        heading(name, cx - 180, 740, 360, 40, t.color('text'), { align: 'center' }),
        copy(roles[index] ?? '', cx - 180, 796, 360, 28, t.color('primary'), {
          align: 'center',
          fontWeight: 600,
        }),
        copy(bios[index] ?? '', cx - 180, 850, 360, 26, t.shade('text', 'rgba(255,255,255,0.7)'), {
          align: 'center',
        }),
      ];
    }),
  ];
});

const FORECAST = [
  { x: 200, y: 820 },
  { x: 430, y: 770 },
  { x: 660, y: 700 },
  { x: 890, y: 600 },
];

const revenueSpec = {
  colors: {
    background: {
      value: NV.cream,
      hint: 'Page; its lightest shade colors the target figure',
    },
    primary: {
      value: NV.coral,
      hint: 'Accent bar and the trend line; its light tint colors the target label',
    },
    secondary: { value: NV.plum, hint: 'Trend dots and the target card' },
    text: {
      value: NV.ink,
      hint: 'Title, values and year pills; its lighter shade colors the subtitle',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Revenue\nforecast' },
    subtitle: {
      label: 'Subtitle',
      value: 'A data-led outlook for steady,\ncompounding growth.',
    },
    values: { label: 'Value', value: ['120K', '180K', '240K', '310K'] },
    years: { label: 'Year', value: ['2025', '2026', '2027', '2028'] },
    target: { label: 'Target', value: '$310K' },
    targetLabel: { label: 'Target label', value: 'Target pipeline, 2028' },
  },
} as const satisfies ThemeSpec;

export const revenueSlide = themed(SW, SH, revenueSpec, (t) => {
  const heading = head(t.font('heading'));
  const copy = body(t.font('body'));
  const values = t.list('values');
  const years = t.list('years');
  return [
    backdrop(t.color('background')),
    marker(140, 140, t.color('primary')),
    heading(t.copy('title'), 140, 180, 900, 120, t.color('text'), { fontWeight: 800 }),
    copy(t.copy('subtitle'), 140, 460, 820, 36, t.shade('text', NV.grey)),
    path(
      `M${FORECAST.map((point) => `${point.x - 200} ${point.y - 600}`).join(' L')}`,
      340,
      600,
      690,
      220,
      t.shade('background', NV.clear),
      { width: 690, height: 220 },
      { stroke: t.color('primary'), strokeWidth: 8, name: 'Trend line' },
    ),
    FORECAST.map((point, index) => [
      circle(point.x + 140, point.y, 18, t.color('secondary')),
      copy(values[index] ?? '', point.x + 90, point.y - 70, 100, 26, t.color('text'), {
        align: 'center',
        fontWeight: 700,
      }),
      pill(years[index] ?? '', point.x + 80, 900, {
        fill: t.shade('background', NV.clear),
        color: t.color('text'),
        stroke: t.color('text'),
        strokeWidth: 3,
        fontSize: 30,
        fontFamily: t.font('body'),
        width: 120,
      }),
    ]),
    rect(1180, 120, 600, 840, t.color('secondary'), { name: 'Target card', cornerRadius: 40 }),
    heading(t.copy('target'), 1180, 440, 600, 140, t.shade('background', NV.white), {
      align: 'center',
      fontWeight: 800,
    }),
    copy(t.copy('targetLabel'), 1180, 610, 600, 36, t.shade('primary', NV.peach), {
      align: 'center',
    }),
  ];
});
