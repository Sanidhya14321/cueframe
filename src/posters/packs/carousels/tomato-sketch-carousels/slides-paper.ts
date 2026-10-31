import type { DesignIconName } from '@/design';
import { checklist, icon, line, type Theme, type ThemeSpec, themed } from '../../../kit';
import {
  arrowPill,
  boxed,
  estimateWidth,
  FONT,
  H,
  paperBackground,
  type Say,
  SCRIPT,
  TOMATO,
  W,
  writer,
} from './palette';

const PAGE = 'Sketchbook page; its lighter shade is the top of the page';
const SKETCH = 'its faint shade draws the sketch lines';

const paperColors = (background: string, primary: string, text: string) => ({
  background: { value: TOMATO.paper, hint: background },
  primary: { value: TOMATO.red, hint: primary },
  text: { value: TOMATO.ink, hint: text },
});

interface PaperSpec extends ThemeSpec {
  colors: ReturnType<typeof paperColors>;
}

const paper = <S extends PaperSpec>(t: Theme<S>) =>
  paperBackground(
    t.color('background'),
    t.shade('background', TOMATO.paperTop),
    t.shade('text', TOMATO.sketch),
  );

const doodler =
  <S extends PaperSpec>(t: Theme<S>) =>
  (name: DesignIconName, x: number, y: number, size: number) =>
    icon(name, x, y, size, t.color('primary'), { strokeWidth: 1.4 });

const swipeArrow = <S extends PaperSpec>(t: Theme<S>) =>
  arrowPill(760, 1170, t.color('text'), t.shade('text', TOMATO.clear));

const goalsCoverSpec = {
  colors: paperColors(
    PAGE,
    'Goals and the doodles',
    `2027, Our, the subtitle and the arrow pill; ${SKETCH}`,
  ),
  fonts: { body: FONT, script: SCRIPT },
  copy: {
    year: { label: 'Year', value: '2027' },
    intro: { label: 'Intro word', value: 'Our' },
    title: { label: 'Title', value: 'Goals' },
    subtitle: { label: 'Subtitle', value: "What we're focusing on next" },
  },
} as const satisfies PaperSpec;

export const goalsCover = themed(W, H, goalsCoverSpec, (t) => {
  const say = writer(t.font('body'));
  const doodle = doodler(t);
  return [
    paper(t),
    doodle('sparkles', 200, 120, 150),
    say(t.copy('year'), 700, 360, 240, 54, t.color('text'), 700),
    writer(t.font('script'))(t.copy('intro'), 290, 380, 400, 150, t.color('text'), 700, {
      lineHeight: 1,
    }),
    say(t.copy('title'), 280, 500, 700, 190, t.color('primary'), 700, { lineHeight: 1 }),
    say(t.copy('subtitle'), 290, 720, 700, 36, t.color('text'), 500),
    doodle('lightbulb', 190, 820, 200),
    doodle('target', 700, 800, 200),
    swipeArrow(t),
  ];
});

const goal = (
  lead: string,
  accent: string,
  body: string,
  top: DesignIconName,
  bottom: DesignIconName,
) => {
  const spec = {
    colors: paperColors(
      PAGE,
      'Highlighted line and the doodles',
      `Headline, body and the arrow pill; ${SKETCH}`,
    ),
    fonts: { body: FONT },
    copy: {
      lead: { label: 'Headline', value: lead },
      accent: { label: 'Highlighted line', value: accent },
      body: { label: 'Body', value: body },
    },
  } as const satisfies PaperSpec;
  return themed(W, H, spec, (t) => {
    const say = writer(t.font('body'));
    const doodle = doodler(t);
    return [
      paper(t),
      doodle(top, 720, 110, 220),
      say(t.copy('lead'), 200, 430, 760, 80, t.color('text'), 700, { lineHeight: 1.1 }),
      say(t.copy('accent'), 200, 520, 760, 80, t.color('primary'), 700, { lineHeight: 1.1 }),
      say(t.copy('body'), 200, 660, 760, 36, t.color('text'), 400, { lineHeight: 1.45 }),
      doodle(bottom, 190, 900, 210),
      swipeArrow(t),
    ];
  });
};

export const goalAuthority = goal(
  'Building on',
  'Authority',
  'We will show up every week with\nuseful insights that make us the\ngo-to name in our niche.',
  'crown',
  'megaphone',
);

export const goalSystems = goal(
  'Systemize',
  'Our Growth',
  'We will build repeatable systems\nfor content, leads and sales so\nwe can scale without burnout.',
  'rocket',
  'chart-pie',
);

export const goalRevenue = goal(
  'Monetize',
  'With Intention',
  'We will focus on offers that truly\nhelp our clients and price them\nfor the value they create.',
  'banknote',
  'piggy-bank',
);

const inlineRow = (
  say: Say,
  y: number,
  size: number,
  parts: readonly [string, boolean][],
  colors: { box: string; boxed: string; word: string },
) => {
  let x = 90;
  return parts.map(([label, highlighted]) => {
    const start = x;
    x += estimateWidth(label, size) + size * (highlighted ? 0.85 : 0.35);
    return highlighted
      ? boxed(say, label, start, y, size, colors.box, colors.boxed)
      : say(
          label,
          start,
          y + size * 0.06,
          estimateWidth(label, size) + size,
          size,
          colors.word,
          700,
          {
            lineHeight: 1.1,
          },
        );
  });
};

const attractCoverSpec = {
  colors: paperColors(
    `${PAGE} and the boxed words`,
    'Word boxes, the lightning doodle and the arrow',
    `Kicker box, plain headline words and the swipe prompt; ${SKETCH}`,
  ),
  fonts: { body: FONT },
  copy: {
    kicker: { label: 'Kicker', value: 'Stop Cold Pitching.' },
    headline: { label: 'Headline piece', value: ['Learn', 'How To', 'Earn', 'Attention.'] },
    cta: { label: 'Swipe prompt', value: 'Swipe left' },
  },
} as const satisfies PaperSpec;

export const attractCover = themed(W, H, attractCoverSpec, (t) => {
  const say = writer(t.font('body'));
  const [learn = '', howTo = '', earn = '', attention = ''] = t.list('headline');
  const colors = {
    box: t.color('primary'),
    boxed: t.shade('background', TOMATO.white),
    word: t.color('text'),
  };
  return [
    paper(t),
    doodler(t)('zap', 760, 160, 200),
    boxed(say, t.copy('kicker'), 90, 470, 40, t.color('text'), t.shade('background', TOMATO.white)),
    inlineRow(
      say,
      560,
      96,
      [
        [learn, false],
        [howTo, true],
      ],
      colors,
    ),
    inlineRow(
      say,
      700,
      96,
      [
        [earn, true],
        [attention, false],
      ],
      colors,
    ),
    line(90, 1120, 140, t.color('primary'), 5, { name: 'Arrow', arrowEnd: true }),
    say(t.copy('cta'), 260, 1100, 300, 32, t.color('text'), 500),
  ];
});

const lesson = (
  label: string,
  title: string,
  symbol: DesignIconName,
  body: string | readonly string[],
) => {
  const listed = typeof body !== 'string';
  const spec = {
    colors: paperColors(
      `${PAGE} and the lesson label text`,
      listed
        ? 'Lesson label box, doodle, check marks and the arrow'
        : 'Lesson label box, doodle and the arrow',
      listed
        ? `Title and checklist; ${SKETCH}`
        : `Title; its shades color the body and the sketch lines`,
    ),
    fonts: { body: FONT },
    copy: {
      label: { label: 'Lesson label', value: label },
      title: { label: 'Title', value: title },
      body: { label: listed ? 'Checklist item' : 'Body', value: body },
    },
  } as const satisfies PaperSpec;
  return themed(W, H, spec, (t) => {
    const say = writer(t.font('body'));
    return [
      paper(t),
      doodler(t)(symbol, 760, 90, 220),
      boxed(
        say,
        t.copy('label'),
        200,
        400,
        44,
        t.color('primary'),
        t.shade('background', TOMATO.white),
      ),
      say(t.copy('title'), 200, 490, 800, 70, t.color('text'), 700, { lineHeight: 1.12 }),
      listed
        ? checklist(t.list('body'), 200, 700, 720, {
            color: t.color('text'),
            iconColor: t.color('primary'),
            icon: 'check',
            fontSize: 42,
            fontFamily: t.font('body'),
            gap: 96,
          })
        : say(t.copy('body'), 200, 700, 780, 40, t.shade('text', TOMATO.muted), 400, {
            lineHeight: 1.5,
          }),
      line(200, 1170, 140, t.color('primary'), 5, { name: 'Arrow', arrowEnd: true }),
    ];
  });
};

export const lessonPull = lesson('Lesson 1', 'Create Content That\nPulls People In', 'zap', [
  'Share real insights',
  'Solve one clear problem',
  'Show proof and results',
]);

export const lessonKnown = lesson(
  'Lesson 2',
  'Become Known\nfor One Thing',
  'megaphone',
  'Show up with the same value\nagain and again, and people\narrive already interested\nand already trusting you.',
);

export const lessonMemorable = lesson(
  'Lesson 3',
  'Make Yourself\nEasy to Remember',
  'target',
  'Clear positioning makes you\nmemorable. Speak to everyone\nand you end up reaching\nno one at all.',
);
