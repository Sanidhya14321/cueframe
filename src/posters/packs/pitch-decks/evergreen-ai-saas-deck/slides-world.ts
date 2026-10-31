import { linear } from '@/design';
import { circle, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, darkBg, EV, fonts, glass, HEADING, type Ink, SH, SW } from './theme';

const statPill = (
  ink: Ink<'primary' | 'text'>,
  type: ReturnType<typeof fonts>,
  value: string,
  label: string,
  x: number,
  y: number,
  opacity: number,
) => [
  rect(
    x,
    y,
    330,
    150,
    linear(
      180,
      ink.shade('primary', 'rgba(95,211,168,0.5)'),
      ink.shade('primary', 'rgba(47,158,124,0.16)'),
    ),
    {
      name: 'Stat pill',
      cornerRadius: 22,
      stroke: ink.shade('text', 'rgba(255,255,255,0.22)'),
      strokeWidth: 2,
      opacity,
    },
  ),
  type.head(value, x + 28, y + 42, 150, 62, ink.color('text'), { opacity }),
  type.body(label, x + 180, y + 42, 140, 22, ink.shade('text', EV.soft), {
    opacity,
    lineHeight: 1.3,
  }),
];

const FADED = new Set([0, 4, 5, 8]);

export const performanceSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: EV.forest, hint: 'Page' },
      primary: { value: EV.mint, hint: 'Stat pills' },
      text: {
        value: EV.white,
        hint: 'Title and figures; its translucent shades color the intro, stat labels and pill outlines',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Performance by the Numbers' },
      intro: {
        label: 'Intro',
        value:
          'Every figure tells a story of steady delivery, award-winning work and\nclients who stay with us year after year.',
      },
      values: {
        label: 'Figure',
        value: ['120', '80+', '45', '96', '30', '6M', '350', '90+', '12'],
      },
      labels: {
        label: 'Figure label',
        value: [
          'Interviews\nheld',
          'Experts\nhired',
          'Awards\nwon',
          'Partners\nonboarded',
          'Countries\nserved',
          'Tasks\nautomated',
          'Apps\nconnected',
          'Teams\nlaunched',
          'Years\nbuilding',
        ],
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const type = fonts(t);
    const labels = t.list('labels');
    return [
      darkBg(t),
      type.head(t.copy('title'), 0, 170, SW, 68, t.color('text'), { align: 'center' }),
      type.body(t.copy('intro'), 0, 270, SW, 30, t.shade('text', EV.soft), { align: 'center' }),
      t.list('values').map((value, index) => {
        const second = index >= 5;
        const x = second ? 240 + (index - 5) * 365 : 60 + index * 365;
        return statPill(
          t,
          type,
          value,
          labels[index] ?? '',
          x,
          second ? 710 : 500,
          FADED.has(index) ? 0.45 : 1,
        );
      }),
    ];
  },
);

const CONTINENTS = [
  [1060, 330, 170, 130],
  [1160, 650, 90, 170],
  [1420, 300, 110, 80],
  [1450, 560, 110, 150],
  [1660, 360, 160, 120],
  [1720, 690, 70, 50],
] as const;

const onLand = (x: number, y: number) =>
  CONTINENTS.some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1);

const MAP_DOTS = Array.from({ length: 34 * 30 }, (_, index) => ({
  x: 880 + (index % 34) * 28,
  y: 170 + Math.floor(index / 34) * 28,
})).filter((dot) => onLand(dot.x, dot.y));

const MARKET_SPOTS = [
  { x: 940, y: 200 },
  { x: 1450, y: 150 },
  { x: 980, y: 720 },
  { x: 1440, y: 640 },
] as const;

export const worldwideSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: EV.forest, hint: 'Page and the growth numbers on the chips' },
      primary: {
        value: EV.mint,
        hint: 'Market, the second figure, glass cards, growth chips and the map dots',
      },
      text: {
        value: EV.white,
        hint: 'Worldwide, the first figure and market values; its translucent shades color the paragraph, labels and card outlines',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Worldwide' },
      subtitle: { label: 'Highlighted title', value: 'Market' },
      body: {
        label: 'Paragraph',
        value:
          'Automation has moved past simple task swaps. Fernbrook brings predictive analytics and orchestration together so teams everywhere can ship faster with fewer handoffs.',
      },
      figures: { label: 'Figure', value: ['140+', '62%'] },
      figureLabels: { label: 'Figure label', value: ['Cities live', 'Faster rollouts'] },
      values: { label: 'Market value', value: ['$84.6M', '$1.92B', '$37.4M', '$14.8M'] },
      regions: {
        label: 'Market',
        value: ['North America 2026', 'Europe 2026', 'South America 2026', 'Africa 2026'],
      },
      growth: { label: 'Growth', value: ['+12%', '+9%', '+6%', '+15%'] },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const soft = t.shade('text', EV.soft);
    const figureLabels = t.list('figureLabels');
    const regions = t.list('regions');
    const growth = t.list('growth');
    return [
      darkBg(t),
      head(t.copy('title'), 140, 150, 700, 76, t.color('text')),
      head(t.copy('subtitle'), 140, 235, 700, 76, t.color('primary'), { fontWeight: 500 }),
      body(t.copy('body'), 140, 380, 640, 28, soft),
      MAP_DOTS.map((dot) => circle(dot.x, dot.y, 5, t.shade('primary', 'rgba(95,211,168,0.32)'))),
      t
        .list('figures')
        .map((figure, index) => [
          head(
            figure,
            140 + index * 300,
            780,
            260,
            72,
            index === 0 ? t.color('text') : t.color('primary'),
          ),
          body(figureLabels[index] ?? '', 140 + index * 300, 870, 260, 26, soft),
        ]),
      t.list('values').map((value, index) => {
        const { x, y } = MARKET_SPOTS[index] ?? { x: 0, y: 0 };
        return [
          glass(t, x, y, 360, 160, 20),
          head(value, x + 26, y + 24, 290, 56, t.color('text')),
          body(regions[index] ?? '', x + 26, y + 100, 290, 22, soft),
          rect(x + 256, y + 30, 80, 34, t.color('primary'), {
            name: 'Growth chip',
            cornerRadius: 17,
          }),
          body(growth[index] ?? '', x + 256, y + 33, 80, 20, t.color('background'), {
            align: 'center',
            fontWeight: 600,
          }),
        ];
      }),
    ];
  },
);
