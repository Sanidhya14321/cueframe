import { circle, icon, rect, type ThemeSpec, themed } from '../../../kit';
import { BACKGROUND, BODY, backdrop, H, HANDLE, HEADING, MULBERRY, say, W } from './palette';

const RING_XS = [95, 245, 395, 545, 695, 845, 995];
const WAVE_START = 900;

const ringY = (globalX: number) =>
  globalX < WAVE_START ? 800 : 800 + 250 * Math.sin((globalX - WAVE_START) / 480);

const ringRadius = (globalX: number) =>
  globalX < WAVE_START
    ? 28 + globalX * 0.035
    : 34 + 26 * (0.5 + 0.5 * Math.cos((globalX - WAVE_START) / 300));

const rings = (slide: number, from: number, to: number, stroke: string, hollow: string) =>
  RING_XS.filter((x) => x >= from && x <= to).map((x) => {
    const globalX = slide * W + x;
    const radius = ringRadius(globalX);
    return circle(x, ringY(globalX), radius, hollow, {
      name: 'Ring',
      stroke,
      strokeWidth: radius * 0.42,
    });
  });

export const waveCover = themed(
  W,
  H,
  {
    colors: {
      background: BACKGROUND,
      primary: { value: MULBERRY.peach, hint: 'The word so and the wave of rings' },
      secondary: { value: MULBERRY.blush, hint: 'Guess what and the handle' },
      text: { value: MULBERRY.white, hint: 'We are' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      kicker: { label: 'Kicker', value: 'Guess what?' },
      headline: { label: 'Headline', value: 'We are' },
      highlight: { label: 'Highlighted word', value: 'so' },
      handle: HANDLE,
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const heading = say(t.font('heading'));
    const body = say(t.font('body'));
    return [
      backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
      body(t.copy('kicker'), 90, 490, 800, 44, t.color('secondary'), 500),
      heading(t.copy('headline'), 90, 560, 800, 110, t.color('text'), 800, { lineHeight: 1 }),
      heading(t.copy('highlight'), 90, 720, 200, 130, t.color('primary'), 800, { lineHeight: 1 }),
      rings(0, 300, W, t.color('primary'), t.shade('primary', 'rgba(0,0,0,0)')),
      body(t.copy('handle'), 90, 1230, 600, 34, t.color('secondary'), 500),
    ];
  },
);

const waveOnly = (slide: number) =>
  themed(
    W,
    H,
    {
      colors: {
        background: BACKGROUND,
        primary: { value: MULBERRY.peach, hint: 'The wave of rings' },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
      rings(slide, 0, W, t.color('primary'), t.shade('primary', 'rgba(0,0,0,0)')),
    ],
  );

export const waveMiddle = waveOnly(1);

export const waveRise = waveOnly(2);

export const waveFinale = themed(
  W,
  H,
  {
    colors: {
      background: BACKGROUND,
      primary: { value: MULBERRY.peach, hint: 'The wave of rings and the party popper' },
      text: { value: MULBERRY.white, hint: 'Headline' },
    },
    fonts: { heading: HEADING },
    copy: { headline: { label: 'Headline', value: 'excited to share\nsome big news.' } },
  } as const satisfies ThemeSpec,
  (t) => [
    backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
    say(t.font('heading'))(t.copy('headline'), 90, 230, 900, 76, t.color('text'), 800, {
      lineHeight: 1.1,
    }),
    rings(3, 0, 700, t.color('primary'), t.shade('primary', 'rgba(0,0,0,0)')),
    icon('party-popper', 860, 1140, 120, t.color('primary'), { strokeWidth: 1.6 }),
  ],
);

const TERM_COLORS = {
  background: BACKGROUND,
  surface: {
    value: MULBERRY.cream,
    hint: 'Folders; its shades color the folder tabs and paper clips',
  },
  text: { value: MULBERRY.ink, hint: 'Folder tab labels and the body copy' },
} as const;

interface FolderColors {
  tab: string;
  folder: string;
  clip: string;
  hollow: string;
  label: string;
  font: string;
}

const folder = (
  colors: FolderColors,
  x: number,
  y: number,
  width: number,
  label: string,
  tabX: number,
) => [
  rect(tabX, y - 74, 300, 110, colors.tab, { name: 'Folder tab', cornerRadius: 22 }),
  rect(x, y, width, H - y, colors.folder, {
    name: 'Folder',
    cornerRadius: 26,
    shadow: { color: 'rgba(0,0,0,0.28)', blur: 30, offsetX: 0, offsetY: -6 },
  }),
  rect(tabX + 24, y - 100, 34, 120, colors.hollow, {
    name: 'Clip',
    cornerRadius: 17,
    stroke: colors.clip,
    strokeWidth: 6,
  }),
  say(colors.font)(label, tabX + 76, y - 58, 220, 36, colors.label, 700),
];

export const termsCover = themed(
  W,
  H,
  {
    colors: {
      ...TERM_COLORS,
      primary: { value: MULBERRY.peach, hint: 'Big number' },
      text: { value: MULBERRY.ink, hint: 'Folder tab labels' },
      surface: {
        value: MULBERRY.cream,
        hint: 'Folders and the title; its shades color the folder tabs and paper clips',
      },
      secondary: { value: MULBERRY.wine, hint: 'Swipe now and its arrow' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      number: { label: 'Number', value: '3' },
      title: { label: 'Title', value: 'Growth Terms\nEvery Founder\nShould Know' },
      folders: { label: 'Folder label', value: ['Retention', 'Churn', 'Pipeline'] },
      cta: { label: 'Swipe label', value: 'Swipe now' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const heading = say(t.font('heading'));
    const colors: FolderColors = {
      tab: t.shade('surface', '#efdcd2'),
      folder: t.color('surface'),
      clip: t.shade('surface', '#a38d93'),
      hollow: t.shade('surface', 'rgba(0,0,0,0)'),
      label: t.color('text'),
      font: t.font('body'),
    };
    const [retention = '', churn = '', pipeline = ''] = t.list('folders');
    return [
      backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
      heading(t.copy('number'), 70, 40, 260, 360, t.color('primary'), 800, { lineHeight: 1 }),
      heading(t.copy('title'), 330, 110, 700, 62, t.shade('surface', MULBERRY.white), 500, {
        lineHeight: 1.15,
      }),
      folder(colors, 60, 600, 960, retention, 110),
      folder(colors, 60, 790, 960, churn, 560),
      folder(colors, 60, 980, 960, pipeline, 220),
      heading(t.copy('cta'), 120, 1180, 400, 46, t.color('secondary'), 700),
      icon('arrow-right', 360, 1178, 56, t.color('secondary'), { strokeWidth: 2.4 }),
    ];
  },
);

const term = (number: string, name: string, definition: string, why: string) =>
  themed(
    W,
    H,
    {
      colors: {
        ...TERM_COLORS,
        primary: { value: MULBERRY.peach, hint: 'Big number' },
        secondary: { value: MULBERRY.wine, hint: 'Term name and the Definition and Why labels' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        number: { label: 'Number', value: number },
        name: { label: 'Term', value: name, hint: 'Shown on the folder tab and as the title' },
        definitionLabel: { label: 'Definition label', value: 'Definition:' },
        definition: { label: 'Definition', value: definition },
        whyLabel: { label: 'Why label', value: 'Why it matters:' },
        why: { label: 'Why it matters', value: why },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const heading = say(t.font('heading'));
      const body = say(t.font('body'));
      const colors: FolderColors = {
        tab: t.shade('surface', '#efdcd2'),
        folder: t.color('surface'),
        clip: t.shade('surface', '#a38d93'),
        hollow: t.shade('surface', 'rgba(0,0,0,0)'),
        label: t.color('text'),
        font: t.font('body'),
      };
      return [
        backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
        heading(t.copy('number'), 560, 10, 460, 520, t.color('primary'), 800, {
          align: 'right',
          lineHeight: 1,
        }),
        folder(colors, 80, 420, 920, t.copy('name'), 130),
        heading(t.copy('name'), 150, 500, 800, 104, t.color('secondary'), 800, { lineHeight: 1 }),
        body(t.copy('definitionLabel'), 150, 680, 780, 38, t.color('secondary'), 700),
        body(t.copy('definition'), 150, 730, 780, 38, t.color('text'), 400),
        body(t.copy('whyLabel'), 150, 920, 780, 38, t.color('secondary'), 700),
        body(t.copy('why'), 150, 970, 780, 38, t.color('text'), 400),
      ];
    },
  );

export const termRetention = term(
  '1',
  'Retention',
  'The share of customers who keep\nbuying from you over time.',
  'Keeping a customer costs far less\nthan winning a brand new one.',
);

export const termChurn = term(
  '2',
  'Churn',
  'The rate at which customers stop\nusing or paying for your product.',
  'High churn quietly erases every\nwin your marketing brings in.',
);

export const termPipeline = term(
  '3',
  'Pipeline',
  'Every open deal, sorted by how\nclose it is to a signed contract.',
  'A healthy pipeline turns next\nquarter into a forecast, not a guess.',
);
