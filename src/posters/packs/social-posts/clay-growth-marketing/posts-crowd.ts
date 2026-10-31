import { group, icon, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, backdrop, CLAY, H, HEADING, W } from './clay';
import { doorHanger, marketPortrait, reviewWords } from './posts';
import { didYouKnow, seoChecklist, TIME_WAITS } from './posts-lists';
import { consistencyPost, countdownDays, guessWord } from './posts-more';

const CROWD = [
  [90, 560, 120],
  [230, 600, 100],
  [350, 545, 130],
  [500, 590, 110],
  [630, 540, 135],
  [780, 590, 105],
  [900, 550, 120],
  [150, 700, 110],
  [300, 715, 95],
  [430, 690, 120],
  [580, 720, 100],
  [720, 695, 115],
  [860, 715, 100],
] as const;

const crowdSpec = {
  colors: {
    background: { value: CLAY.paper, hint: 'Page' },
    primary: {
      value: CLAY.brand,
      hint: 'targeting, market and every fourth person in the crowd',
    },
    text: { value: CLAY.ink, hint: "You're, a massive and the rest of the crowd" },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: "You're" },
    title: { label: 'Title', value: 'targeting' },
    connector: { label: 'Connector', value: 'a massive' },
    closing: { label: 'Closing word', value: 'market' },
  },
} as const satisfies ThemeSpec;

const targetingCrowd = themed(W, H, crowdSpec, (t) => {
  const small = (label: string, y: number) =>
    text(label, 0, y, W, {
      fontFamily: t.font('body'),
      fontSize: 54,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    });
  const big = (label: string, y: number) =>
    text(label, 0, y, W, {
      fontFamily: t.font('heading'),
      fontSize: 150,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1,
    });
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    small(t.copy('intro'), 170),
    big(t.copy('title'), 240),
    CROWD.map(([x, y, size], index) =>
      icon('user-round', x, y, size, index % 4 === 1 ? t.color('primary') : t.color('text'), {
        strokeWidth: 2.6,
      }),
    ),
    small(t.copy('connector'), 880),
    big(t.copy('closing'), 950),
  ];
});

const TAG_ICONS = [
  ['palette'],
  ['chart-column', 'refresh-cw'],
  ['message-circle', 'megaphone'],
  ['target', 'smartphone'],
  ['trending-up', 'pencil'],
  ['users'],
] as const;

const tagWidth = (label: string) => label.length * 25 + 150;

const tagSpec = {
  colors: {
    primary: {
      value: CLAY.brand,
      hint: 'Page gradient and the tag icons; its darker shade colors the bottom of the page',
    },
    surface: { value: CLAY.paper, hint: 'Title and the light tags' },
    secondary: { value: CLAY.soft, hint: 'Filled tags and the closing question' },
    text: { value: CLAY.ink, hint: 'Tag labels' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Everything your brand needs' },
    tags: {
      label: 'Tag',
      value: [
        'Branding',
        'Analytics',
        'Conversion',
        'Engagement',
        'Ads',
        'Strategy',
        'Social',
        'Growth',
        'Content',
        'Audience',
      ],
    },
    closing: { label: 'Closing question', value: 'Which one are you working on?' },
  },
} as const satisfies ThemeSpec;

const tagCloud = themed(W, H, tagSpec, (t) => {
  const labels = t.list('tags');
  let next = 0;
  const rows = TAG_ICONS.map((icons) =>
    icons.map((name) => {
      const label = labels[next] ?? '';
      next += 1;
      return { label, icon: name };
    }),
  );
  return [
    backdrop(t.color('primary'), t.shade('primary', CLAY.deep), H, 165),
    text(t.copy('title'), 0, 110, W, {
      fontFamily: t.font('heading'),
      fontSize: 52,
      fontWeight: 700,
      fill: t.color('surface'),
      align: 'center',
    }),
    rows.map((row, rowIndex) => {
      const widths = row.map((tag) => tagWidth(tag.label));
      const total = widths.reduce((sum, width) => sum + width, 0) + (row.length - 1) * 30;
      const y = 280 + rowIndex * 150;
      const start = (W - total) / 2 + (rowIndex % 2 === 0 ? -40 : 40);
      return row.map((tag, index) => {
        const x = start + widths.slice(0, index).reduce((sum, size) => sum + size + 30, 0);
        const width = widths[index] ?? 0;
        const filled = (rowIndex + index) % 3 === 0;
        return group(
          rect(x, y, width, 96, filled ? t.color('secondary') : t.color('surface'), {
            cornerRadius: 48,
            name: `${tag.label} tag`,
            ...shadow(20, 8, 'rgba(0,0,0,0.25)'),
          }),
          text(tag.label, x + 36, y + 26, width - 100, {
            fontFamily: t.font('body'),
            fontSize: 38,
            fontWeight: 600,
            fill: t.color('text'),
          }),
          icon(tag.icon, x + width - 76, y + 26, 44, t.color('primary')),
        );
      });
    }),
    text(t.copy('closing'), 0, 1200, W, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 500,
      fill: t.color('secondary'),
      align: 'center',
    }),
  ];
});

export const POSTS = [
  reviewWords,
  marketPortrait,
  doorHanger,
  seoChecklist,
  didYouKnow,
  TIME_WAITS,
  consistencyPost,
  guessWord,
  countdownDays,
  targetingCrowd,
  tagCloud,
];
