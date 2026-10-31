import {
  avatar,
  checklist,
  circle,
  group,
  paint,
  path,
  phone,
  phoneScreen,
  rating,
  rect,
  rotateNodes,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, backdrop, FERN, H, HEADING, highlight, W } from './posts';

const PHONE_BLACK = '#0b0b0f';

const mattersSpec = {
  colors: {
    background: {
      value: FERN.forest,
      hint: 'Page gradient; its darker shade is the bottom of the gradient and the current year',
    },
    secondary: {
      value: FERN.mint,
      hint: 'Kicker, body text and the dial; its muted shade colors the past and next years',
    },
    surface: { value: FERN.white, hint: 'Headline and the dial pointer' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Why Branding' },
    title: { label: 'Headline', value: 'Still Wins\nin 2027?' },
    body: {
      label: 'Body',
      value: 'Trust compounds. The brands that keep\nshowing up are the ones buyers remember.',
    },
    years: {
      label: 'Dial year',
      value: ['2026', '2027', '2028'],
      hint: 'Left, center and right of the dial',
    },
  },
} as const satisfies ThemeSpec;

export const stillMatters = themed(W, H, mattersSpec, (t) => {
  const [past = '', current = '', next = ''] = t.list('years');
  const sideYear = (year: string, degrees: number) =>
    rotateNodes(degrees, 540, 1350, [
      text(year, 440, 893, 200, {
        fontFamily: t.font('heading'),
        fontSize: 52,
        fontWeight: 800,
        fill: t.shade('secondary', FERN.sage),
        align: 'center',
      }),
    ]);
  return [
    backdrop(t.color('background'), t.shade('background', FERN.deep), 165),
    text(t.copy('kicker'), 90, 140, 900, {
      fontFamily: t.font('body'),
      fontSize: 50,
      fontWeight: 500,
      fill: t.color('secondary'),
    }),
    text(t.copy('title'), 90, 210, 900, {
      fontFamily: t.font('heading'),
      fontSize: 108,
      fontWeight: 800,
      fill: t.color('surface'),
      lineHeight: 1.08,
    }),
    text(t.copy('body'), 90, 470, 900, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 500,
      fill: t.color('secondary'),
      lineHeight: 1.4,
    }),
    path(
      'M 95 540 A 425 425 0 0 1 945 540',
      20,
      810,
      1040,
      540,
      t.shade('secondary', 'rgba(0,0,0,0)'),
      { width: 1040, height: 540 },
      { stroke: t.color('secondary'), strokeWidth: 150, name: 'Dial' },
    ),
    sideYear(past, -38),
    text(current, 440, 887, 200, {
      fontFamily: t.font('heading'),
      fontSize: 64,
      fontWeight: 800,
      fill: t.shade('background', FERN.deep),
      align: 'center',
    }),
    sideYear(next, 38),
    path('M 0 0 L 60 0 L 30 44 Z', 510, 790, 60, 44, t.color('surface'), {
      width: 60,
      height: 44,
    }),
  ];
});

const REVIEW_PHOTOS = ['woman-portrait-2', 'man-portrait-1', 'woman-portrait-1'] as const;

const feedbackSpec = {
  colors: {
    background: {
      value: FERN.forest,
      hint: 'Page gradient and the review cards; its darker shades color the phone screen, phone body and the bottom of the gradient',
    },
    secondary: {
      value: FERN.mint,
      hint: 'Side panel, Client, the check icons and the stars; its muted shade colors the review text lines',
    },
    surface: { value: FERN.white, hint: 'Headline, intro, checklist and reviewer names' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Client' },
    title: { label: 'Headline', value: 'feed\nback' },
    intro: { label: 'Intro', value: 'Here is what our\nclients keep saying' },
    checks: {
      label: 'Checklist item',
      value: ['Quick and focused', 'Always on schedule', 'Support every day'],
    },
    names: { label: 'Reviewer', value: ['Priya S.', 'Tomas R.', 'Lena K.'] },
  },
} as const satisfies ThemeSpec;

export const clientFeedback = themed(W, H, feedbackSpec, (t) => {
  const width = 360;
  const screen = phoneScreen(width);
  return [
    backdrop(t.color('background'), t.shade('background', FERN.deep), 165),
    rect(640, 220, 360, 1000, t.color('secondary'), { cornerRadius: 60, name: 'Panel' }),
    text(t.copy('kicker'), 80, 180, 500, {
      fontFamily: t.font('body'),
      fontSize: 56,
      fontWeight: 600,
      fill: t.color('secondary'),
    }),
    text(t.copy('title'), 80, 250, 520, {
      fontFamily: t.font('heading'),
      fontSize: 150,
      fontWeight: 800,
      fill: t.color('surface'),
      lineHeight: 0.92,
    }),
    text(t.copy('intro'), 80, 560, 520, {
      fontFamily: t.font('body'),
      fontSize: 40,
      fontWeight: 500,
      fill: t.color('surface'),
      lineHeight: 1.3,
    }),
    checklist(t.list('checks'), 80, 760, 520, {
      color: t.color('surface'),
      iconColor: t.color('secondary'),
      icon: 'circle-check',
      fontSize: 36,
      gap: 76,
      fontFamily: t.font('body'),
      fontWeight: 600,
    }),
    paint(
      [
        phone(640, 300, width, {
          screen: t.shade('background', FERN.deep),
          rotation: 8,
          content: t.list('names').map((name, index) => {
            const y = 110 + index * 200;
            return group(
              rect(18, y, screen.width - 36, 180, t.color('background'), {
                cornerRadius: 20,
                name: 'Review',
              }),
              avatar(REVIEW_PHOTOS[index] ?? 'woman-portrait-2', 60, y + 46, 26),
              text(name, 100, y + 30, 180, {
                fontFamily: t.font('heading'),
                fontSize: 22,
                fontWeight: 700,
                fill: t.color('surface'),
              }),
              rating(100, y + 64, 18, 5, t.color('secondary'), 0.25),
              rect(40, y + 110, screen.width - 80, 12, t.shade('secondary', FERN.sage), {
                cornerRadius: 6,
                name: 'Line',
              }),
              rect(40, y + 136, screen.width - 140, 12, t.shade('secondary', FERN.sage), {
                cornerRadius: 6,
                name: 'Line',
              }),
            );
          }),
        }),
      ],
      { [PHONE_BLACK]: t.shade('background', PHONE_BLACK) },
    ),
  ];
});

const chooseSpec = {
  colors: {
    background: {
      value: FERN.forest,
      hint: 'Page gradient and the switches; its darker shade is the bottom of the gradient and the reasons',
    },
    surface: { value: FERN.white, hint: 'Why Clients, the highlighted words and the reason pills' },
    secondary: { value: FERN.mint, hint: 'Closing line and the switch knobs' },
    accent: { value: FERN.fern, hint: 'Highlight behind the highlighted words' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Why Clients' },
    highlight: { label: 'Highlighted words', value: 'Choose Fern' },
    subline: { label: 'Subline', value: 'every single time' },
    reasons: {
      label: 'Reason',
      value: ['Brand awareness', 'Fast delivery', 'Built for B2B', 'Support all week'],
    },
  },
} as const satisfies ThemeSpec;

export const whyChooseUs = themed(W, H, chooseSpec, (t) => [
  backdrop(t.color('background'), t.shade('background', FERN.deep), 165),
  text(t.copy('title'), 0, 150, W, {
    fontFamily: t.font('heading'),
    fontSize: 70,
    fontWeight: 600,
    fill: t.color('surface'),
    align: 'center',
  }),
  highlight(t.copy('highlight'), 290, 250, 500, 76, {
    fill: t.color('accent'),
    color: t.color('surface'),
    fontFamily: t.font('heading'),
  }),
  text(t.copy('subline'), 0, 370, W, {
    fontFamily: t.font('body'),
    fontSize: 54,
    fontWeight: 500,
    fill: t.color('secondary'),
    align: 'center',
  }),
  t.list('reasons').map((reason, index) => {
    const y = 560 + index * 160;
    return group(
      rect(170, y, 740, 110, t.color('surface'), { cornerRadius: 55, name: 'Reason pill' }),
      rect(200, y + 25, 110, 60, t.color('background'), { cornerRadius: 30, name: 'Switch' }),
      circle(280, y + 55, 22, t.color('secondary')),
      text(reason, 350, y + 32, 540, {
        fontFamily: t.font('body'),
        fontSize: 40,
        fontWeight: 700,
        fill: t.shade('background', FERN.deep),
      }),
    );
  }),
]);
