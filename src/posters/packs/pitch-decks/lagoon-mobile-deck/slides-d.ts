import { type DesignIconName, linear } from '@/design';
import { icon, photo, pill, rect, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, copy, HEADING, LAGOON, pageGradient, SH, SW, title, WHITE } from './deck-kit';

const T = LAGOON;

const wordsSpec = {
  colors: {
    background: {
      value: T.deep,
      hint: 'Page; its lighter shade is the far end of the page gradient',
    },
    text: { value: WHITE, hint: 'Headline' },
  },
  fonts: { heading: HEADING },
  copy: {
    headline: { label: 'Headline', value: 'Plan.\nLaunch.\nGrow.' },
  },
} as const satisfies ThemeSpec;

export const wordsSlide = themed(SW, SH, wordsSpec, (t) => [
  pageGradient(t.color('background'), t.shade('background', T.mid)),
  text(t.copy('headline'), 120, 110, 1000, {
    fontFamily: t.font('heading'),
    fontSize: 236,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 0.98,
  }),
  photo('phone-hand-1', 1160, 90, 640, 900, { cornerRadius: 44 }),
]);

const storySpec = {
  colors: {
    background: {
      value: T.surface,
      hint: 'Page gradient; its shades are the white top and the mint bottom',
    },
    primary: {
      value: T.mid,
      hint: 'Quote card and the Solution tag; its darker shade colors the top of the card and the persona tag text',
    },
    accent: { value: T.glow, hint: 'Persona tag' },
    text: { value: T.ink, hint: 'Title, the Impact tag and both notes' },
    surface: { value: WHITE, hint: 'Quote text and the Solution and Impact tag labels' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Real-World\nImpact' },
    persona: { label: 'Persona', value: 'Ana, Growth Lead' },
    quote: {
      label: 'Quote',
      value: 'Spends 15+ hours a week on manual reports, which slows every launch.',
    },
    tags: { label: 'Tag', value: ['SOLUTION', 'IMPACT'] },
    notes: {
      label: 'Note',
      value: [
        'Automate reports and asset prep so approvals stop stalling.',
        'Kickoff time fell from 14 days to 3, and conversions rose.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const impactStorySlide = themed(SW, SH, storySpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  const deep = t.shade('primary', T.deep);
  const notes = t.list('notes');
  const fills = [t.color('primary'), t.color('text')];
  return [
    pageGradient(
      t.shade('background', WHITE),
      t.color('background'),
      t.shade('background', T.soft),
    ),
    title(f.head)(t.copy('title'), 120, 100, 800, 96, t.color('text')),
    rect(120, 430, 720, 360, linear(150, deep, t.color('primary')), {
      cornerRadius: 32,
      name: 'Quote card',
    }),
    pill(t.copy('persona'), 160, 470, {
      fill: t.color('accent'),
      color: deep,
      fontSize: 22,
      fontFamily: f.body,
      fontWeight: 700,
    }),
    text(t.copy('quote'), 160, 560, 640, {
      fontFamily: f.head,
      fontSize: 40,
      fontWeight: 800,
      fill: t.color('surface'),
      lineHeight: 1.2,
    }),
    photo('woman-portrait-6', 900, 110, 520, 860, { cornerRadius: 40 }),
    t.list('tags').map((tag, index) => {
      const y = 300 + index * 300;
      return [
        pill(tag, 1480, y, {
          fill: fills[index] ?? t.color('primary'),
          color: t.color('surface'),
          fontSize: 22,
          fontFamily: f.body,
        }),
        copy(f.body)(notes[index] ?? '', 1480, y + 70, 360, 26, t.color('text')),
      ];
    }),
  ];
});

const ICONS: readonly DesignIconName[] = [
  'wifi',
  'zap',
  'cloud',
  'code',
  'monitor',
  'database',
  'refresh-cw',
  'download',
  'upload',
  'phone',
  'rocket',
  'headphones',
  'keyboard',
  'laptop',
  'play',
  'cpu',
  'mouse',
  'gamepad-2',
  'mic',
  'message-square',
  'share-2',
  'git-branch',
  'camera',
  'layers',
  'video',
  'settings',
  'chart-bar',
  'radio-tower',
  'server',
  'brain',
  'smartphone',
  'printer',
  'shield-check',
  'lock',
  'key',
  'search',
  'bell',
  'calendar',
  'clock',
  'map-pin',
  'mail',
  'globe',
  'link',
  'user',
  'users',
  'briefcase',
  'store',
  'target',
  'trending-up',
  'chart-pie',
  'dollar-sign',
  'wallet',
  'credit-card',
  'shopping-cart',
  'gift',
  'tag',
  'award',
  'trophy',
  'crown',
  'flame',
  'heart',
  'star',
  'bookmark',
  'send',
  'image',
  'music',
  'tablet',
  'terminal',
  'bot',
  'puzzle',
  'workflow',
  'megaphone',
  'lightbulb',
  'sparkles',
  'compass',
  'qr-code',
  'scan-face',
  'wand-sparkles',
];

const iconSpec = {
  colors: {
    background: {
      value: T.surface,
      hint: 'Page gradient; its shades are the white top and the mint bottom',
    },
    primary: { value: T.ink, hint: 'Every icon' },
  },
} as const satisfies ThemeSpec;

export const iconSheet = (start: number) =>
  themed(SW, SH, iconSpec, (t) => [
    pageGradient(
      t.shade('background', WHITE),
      t.color('background'),
      t.shade('background', T.soft),
    ),
    Array.from({ length: 78 }, (_, index) => {
      const name = ICONS[(index + start) % ICONS.length] ?? 'star';
      return icon(
        name,
        170 + (index % 13) * 128,
        170 + Math.floor(index / 13) * 128,
        64,
        t.color('primary'),
        { strokeWidth: 2 },
      );
    }),
  ]);
