import { linear } from '@/design';
import {
  bars,
  card,
  circle,
  icon,
  paint,
  pill,
  rect,
  rotateNodes,
  STORY_SIZE,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  caseBubbles,
  GLOW,
  glowPage,
  H,
  HEAD,
  kicker,
  leadersChart,
  RUBY,
  type StatPalette,
  W,
} from './posts';

const CARD_SHADOW = 'rgba(15,23,42,0.14)';
const BAR_FADE = 'rgba(255,255,255,0.15)';

const RESULT_SPOTS = [
  { x: 100, y: 420, tilt: -3 },
  { x: 200, y: 690, tilt: 2.5 },
  { x: 120, y: 960, tilt: -2 },
];

const resultsSpec = (p: StatPalette) =>
  ({
    colors: {
      background: { value: '#fff7f8', hint: 'Page' },
      primary: { value: p.top, hint: 'Kicker, the star under the headline and the icon circles' },
      accent: { value: p.accent, hint: 'Star at the bottom right' },
      surface: { value: p.paper, hint: 'Result cards and the arrows inside the circles' },
      text: {
        value: p.ink,
        hint: 'Headline and the result lines; its faint shade tints the card shadows',
      },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      kicker: { label: 'Kicker', value: 'Client wins' },
      title: { label: 'Headline', value: 'The results our\nclients saw' },
      results: {
        label: 'Result',
        value: ['Engagement up\nby 32%', 'Bounce rate down\nby 18%', 'Mobile sales up\nby 24%'],
      },
    },
  }) as const satisfies ThemeSpec;

const results = (p: StatPalette) =>
  themed(W, H, resultsSpec(p), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    kicker(t.copy('kicker'), 90, t.color('primary'), t.font('body')),
    text(t.copy('title'), 80, 140, 900, {
      fontFamily: t.font('heading'),
      fontSize: 70,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1.1,
    }),
    star(5, 80, 330, 64, t.color('primary'), { innerRatio: 0.42, rotation: -10 }),
    t.list('results').map((label, index) => {
      const spot = RESULT_SPOTS[index] ?? { x: 0, y: 0, tilt: 0 };
      return rotateNodes(spot.tilt, spot.x + 390, spot.y + 110, [
        paint([card(spot.x, spot.y, 780, 220, { radius: 22, fill: t.color('surface') })], {
          [CARD_SHADOW]: t.shade('text', CARD_SHADOW),
        }),
        circle(spot.x + 110, spot.y + 110, 58, t.color('primary')),
        icon('trending-up', spot.x + 78, spot.y + 78, 64, t.color('surface')),
        text(label, spot.x + 205, spot.y + 56, 560, {
          fontFamily: t.font('body'),
          fontSize: 42,
          fontWeight: 600,
          fill: t.color('text'),
          lineHeight: 1.2,
        }),
      ]);
    }),
    star(5, 890, 1200, 110, t.color('accent'), { innerRatio: 0.42 }),
  ]);

const statSpec = (p: StatPalette) =>
  ({
    colors: {
      primary: { value: p.top, hint: GLOW },
      secondary: { value: p.soft, hint: 'Source line' },
      accent: { value: p.accent, hint: 'Star' },
      text: {
        value: p.paper,
        hint: 'The big percentage, the statement and the bars, which fade out toward the bottom',
      },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      stat: { label: 'Statistic', value: '73%' },
      statement: {
        label: 'Statement',
        value: 'of small businesses spend\n20+ hours a week on tasks\nAI could handle',
      },
      source: { label: 'Source', value: 'Brightline Ops Survey 2026, 1,200 owners' },
    },
  }) as const satisfies ThemeSpec;

export const bigStat = (p: StatPalette) =>
  themed(W, H, statSpec(p), (t) => [
    glowPage(t, p),
    star(5, 880, 80, 120, t.color('accent'), { innerRatio: 0.42 }),
    text(t.copy('stat'), 80, 110, 700, {
      fontFamily: t.font('heading'),
      fontSize: 200,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1,
    }),
    text(t.copy('statement'), 80, 350, 920, {
      fontFamily: t.font('heading'),
      fontSize: 46,
      fontWeight: 700,
      fill: t.color('text'),
      lineHeight: 1.2,
    }),
    text(t.copy('source'), 80, 560, 920, {
      fontFamily: t.font('body'),
      fontSize: 24,
      fontWeight: 500,
      fill: t.color('secondary'),
    }),
    bars(
      80,
      720,
      920,
      630,
      [58, 34, 82, 100],
      linear(180, t.color('text'), t.shade('text', BAR_FADE)),
      0.22,
    ),
  ]);

const growSpec = (p: StatPalette) =>
  ({
    colors: {
      background: { value: p.ink, hint: 'Page' },
      primary: {
        value: p.top,
        hint: 'Grow, the active progress segment, the arrow circle, the small star and the button',
      },
      secondary: {
        value: '#d4d4d8',
        hint: 'Body text; its darker shade colors the inactive progress segments',
      },
      text: {
        value: p.paper,
        hint: 'Second title line, the percentage, the top star, the arrow and the button text',
      },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Grow' },
      subtitle: { label: 'Second title line', value: 'Your Profit\nWith Us' },
      stat: { label: 'Statistic', value: '92%' },
      body: {
        label: 'Body',
        value:
          'Grow sales with a proven playbook\nbuilt to keep your business\nmoving forward every month.',
      },
      cta: { label: 'Button', value: 'Book a free growth call' },
    },
  }) as const satisfies ThemeSpec;

const growAt = (p: StatPalette, height: number): Template => {
  const shift = height > H ? 260 : 0;
  return themed(W, height, growSpec(p), (t) => [
    rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
    [0, 1, 2, 3].map((index) =>
      rect(
        80 + index * 200,
        110 + shift,
        180,
        12,
        index === 1 ? t.color('primary') : t.shade('secondary', '#3f3f46'),
        { cornerRadius: 6, name: 'Progress segment' },
      ),
    ),
    star(5, 900, 70 + shift, 90, t.color('text'), { innerRatio: 0.42 }),
    text(t.copy('title'), 80, 220 + shift, 900, {
      fontFamily: t.font('heading'),
      fontSize: 96,
      fontWeight: 800,
      fill: t.color('primary'),
    }),
    text(t.copy('subtitle'), 80, 330 + shift, 900, {
      fontFamily: t.font('heading'),
      fontSize: 96,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1.1,
    }),
    text(t.copy('stat'), 80, 590 + shift, 400, {
      fontFamily: t.font('heading'),
      fontSize: 140,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    circle(470, 680 + shift, 56, t.color('primary')),
    icon('arrow-up-right', 438, 648 + shift, 64, t.color('text'), { strokeWidth: 2.5 }),
    star(5, 80, 860 + shift, 50, t.color('primary'), { innerRatio: 0.42 }),
    text(t.copy('body'), 160, 860 + shift, 860, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 400,
      fill: t.color('secondary'),
      lineHeight: 1.4,
    }),
    pill(t.copy('cta'), 160, 1110 + shift * 1.6, {
      fill: t.color('primary'),
      color: t.color('text'),
      fontSize: 34,
      fontFamily: t.font('body'),
      fontWeight: 700,
    }),
  ]);
};

export const growStory = growAt(RUBY, STORY_SIZE.height);

export const POSTS: readonly [Template, Template, Template, Template, Template] = [
  leadersChart(RUBY),
  caseBubbles(RUBY),
  results(RUBY),
  bigStat(RUBY),
  growAt(RUBY, H),
];
