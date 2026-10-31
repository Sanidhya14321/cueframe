import { type DesignIconName, linear } from '@/design';
import { icon, POST_SIZE, rect, type ThemeSpec, text, themed } from '../../../kit';

const { width: W, height: H } = POST_SIZE;
export const FONT = { label: 'Font', value: 'Manrope' } as const;
export const EMBER = '#ff5a1f';
export const NIGHT = '#0c0c0e';
export const SITE = { label: 'Website', value: 'emberline.studio' } as const;

const gridLines = (fill: string) => [
  Array.from({ length: 7 }, (_, index) =>
    rect(135 + index * 135, 0, 2, H, fill, { name: 'Grid line' }),
  ),
  Array.from({ length: 9 }, (_, index) =>
    rect(0, 135 + index * 135, W, 2, fill, { name: 'Grid line' }),
  ),
];

const gridCoverSpec = {
  colors: {
    background: { value: NIGHT, hint: 'Page' },
    primary: { value: EMBER, hint: 'Grow Your Audience, the selection handles and the bookmark' },
    text: {
      value: '#ffffff',
      hint: 'How to, the selection box and its words and the website; its faint shade colors the grid lines',
    },
  },
  fonts: { font: FONT },
  copy: {
    intro: { label: 'Intro', value: 'How to' },
    headline: { label: 'Headline', value: 'Grow Your\nAudience' },
    selected: { label: 'Selected words', value: 'with Short Video' },
    site: SITE,
  },
} as const satisfies ThemeSpec;

export const gridCover = themed(W, H, gridCoverSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  gridLines(t.shade('text', 'rgba(255,255,255,0.07)')),
  text(t.copy('intro'), 90, 330, 900, {
    fontFamily: t.font('font'),
    fontSize: 68,
    fontWeight: 400,
    fill: t.color('text'),
  }),
  text(t.copy('headline'), 90, 415, 920, {
    fontFamily: t.font('font'),
    fontSize: 104,
    fontWeight: 800,
    fill: t.color('primary'),
    lineHeight: 1.04,
  }),
  rect(90, 670, 660, 116, t.shade('text', 'rgba(0,0,0,0)'), {
    name: 'Selection box',
    stroke: t.color('text'),
    strokeWidth: 3,
  }),
  [
    [90, 670],
    [750, 670],
    [90, 786],
    [750, 786],
  ].map(([x = 0, y = 0]) => rect(x - 10, y - 10, 20, 20, t.color('primary'), { name: 'Handle' })),
  text(t.copy('selected'), 118, 690, 620, {
    fontFamily: t.font('font'),
    fontSize: 60,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  text(t.copy('site'), 90, 1196, 600, {
    fontFamily: t.font('font'),
    fontSize: 34,
    fontWeight: 700,
    fill: t.color('text'),
  }),
  icon('bookmark', 940, 1186, 56, t.color('primary'), { strokeWidth: 2.5 }),
]);

const gridStepSpec = (
  number: string,
  lead: string,
  accent: string,
  paragraphs: readonly string[],
  closer: string,
) =>
  ({
    colors: {
      background: { value: NIGHT, hint: 'Page' },
      primary: { value: EMBER, hint: 'Second headline line' },
      text: {
        value: '#ffffff',
        hint: 'Step number and its box, the first headline line and the closing line; its softer shade colors the paragraphs and its faint shade the grid lines',
      },
    },
    fonts: { font: FONT },
    copy: {
      number: { label: 'Step number', value: number },
      lead: { label: 'Headline', value: lead },
      accent: { label: 'Highlighted headline', value: accent },
      paragraphs: { label: 'Paragraph', value: paragraphs },
      closer: { label: 'Closing line', value: closer },
    },
  }) as const satisfies ThemeSpec;

const gridStep = (
  number: string,
  lead: string,
  accent: string,
  paragraphs: readonly string[],
  closer: string,
) =>
  themed(W, H, gridStepSpec(number, lead, accent, paragraphs, closer), (t) => {
    const items = t.list('paragraphs');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      gridLines(t.shade('text', 'rgba(255,255,255,0.07)')),
      rect(90, 290, 104, 104, t.shade('text', 'rgba(0,0,0,0)'), {
        name: 'Number box',
        stroke: t.color('text'),
        strokeWidth: 4,
      }),
      text(t.copy('number'), 90, 302, 104, {
        fontFamily: t.font('font'),
        fontSize: 66,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('lead'), 90, 450, 920, {
        fontFamily: t.font('font'),
        fontSize: 80,
        fontWeight: 800,
        fill: t.color('text'),
      }),
      text(t.copy('accent'), 90, 540, 920, {
        fontFamily: t.font('font'),
        fontSize: 80,
        fontWeight: 800,
        fill: t.color('primary'),
      }),
      items.map((paragraph, index) =>
        text(paragraph, 90, 690 + index * 150, 880, {
          fontFamily: t.font('font'),
          fontSize: 40,
          fontWeight: 500,
          fill: t.shade('text', '#d4d4d8'),
          lineHeight: 1.35,
        }),
      ),
      text(t.copy('closer'), 90, 690 + items.length * 150, 880, {
        fontFamily: t.font('font'),
        fontSize: 40,
        fontWeight: 800,
        fill: t.color('text'),
        lineHeight: 1.35,
      }),
    ];
  });

export const GRID_STEPS = [
  gridStep(
    '1',
    'Pick One',
    'Clear Topic',
    [
      'Fast growing accounts repeat one idea often.',
      'Choose one audience, one problem and one promise.',
    ],
    'Focus turns viewers into followers.',
  ),
  gridStep(
    '2',
    'Post on a',
    'Steady Rhythm',
    ['You do not need a new video every day.', 'You do need to show up every single week.'],
    'Rhythm builds trust and reach.',
  ),
  gridStep(
    '3',
    'Teach Before',
    'You Pitch',
    ['Lead with a useful tip or a short story.', 'Give first, then invite the next step.'],
    'Value earns attention.',
  ),
] as const;

const DUSK_TOP = '#1c1c20';
const DUSK_BOTTOM = '#050506';

const statsCoverSpec = {
  colors: {
    background: {
      value: DUSK_TOP,
      hint: 'Top of the page gradient; its darker shade colors the bottom',
    },
    primary: { value: EMBER, hint: 'Chevron mark' },
    text: { value: '#ffffff', hint: 'Website and both title lines' },
  },
  fonts: { font: FONT },
  copy: {
    site: SITE,
    title: { label: 'Title', value: 'Quarterly\nRecap:' },
    subtitle: { label: 'Subtitle', value: 'Reach and\nRevenue' },
  },
} as const satisfies ThemeSpec;

export const statsCover = themed(W, H, statsCoverSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', DUSK_BOTTOM)), {
    name: 'Background',
  }),
  text(t.copy('site'), 90, 120, 600, {
    fontFamily: t.font('font'),
    fontSize: 34,
    fontWeight: 700,
    fill: t.color('text'),
  }),
  icon('chevrons-right', 560, 360, 460, t.color('primary'), { strokeWidth: 2.75 }),
  text(t.copy('title'), 90, 560, 700, {
    fontFamily: t.font('font'),
    fontSize: 88,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.1,
  }),
  text(t.copy('subtitle'), 90, 770, 700, {
    fontFamily: t.font('font'),
    fontSize: 88,
    fontWeight: 400,
    fill: t.color('text'),
    lineHeight: 1.1,
  }),
]);

const statSpec = (value: string, label: string) =>
  ({
    colors: {
      background: {
        value: DUSK_TOP,
        hint: 'Top of the page gradient; its darker shade colors the bottom',
      },
      primary: { value: EMBER, hint: 'Big stat and the icon' },
      text: { value: '#ffffff', hint: 'Stat label' },
    },
    fonts: { font: FONT },
    copy: {
      value: { label: 'Stat', value },
      label: { label: 'Stat label', value: label },
    },
  }) as const satisfies ThemeSpec;

const statStep = (value: string, label: string, mark: DesignIconName, top: boolean) =>
  themed(W, H, statSpec(value, label), (t) => [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', DUSK_BOTTOM)), {
      name: 'Background',
    }),
    top
      ? icon(mark, 640, 80, 360, t.color('primary'), { strokeWidth: 1.75 })
      : icon(mark, 560, 780, 460, t.color('primary'), { strokeWidth: 1.75 }),
    text(t.copy('value'), 90, top ? 480 : 250, 900, {
      fontFamily: t.font('font'),
      fontSize: 190,
      fontWeight: 800,
      fill: t.color('primary'),
      lineHeight: 1,
    }),
    text(t.copy('label'), 90, top ? 700 : 470, 700, {
      fontFamily: t.font('font'),
      fontSize: 68,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.15,
    }),
  ]);

export const STAT_STEPS = [
  statStep('48%', 'growth in\nrevenue', 'circle-dollar-sign', false),
  statStep('3x', 'more saves\nper post', 'thumbs-up', true),
  statStep('12k', 'new email\nsubscribers', 'mail', false),
] as const;
