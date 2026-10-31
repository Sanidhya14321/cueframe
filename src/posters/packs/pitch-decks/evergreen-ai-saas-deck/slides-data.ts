import { linear } from '@/design';
import { icon, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, darkBg, EV, fonts, glass, HEADING, type Ink, lightBg, SH, SW } from './theme';

const NODES = [
  { icon: 'workflow', cx: 560 },
  { icon: 'cpu', cx: 960 },
  { icon: 'handshake', cx: 1360 },
] as const;

const wire = (ink: Ink<'text'>, x: number, y: number, width: number, height: number) =>
  rect(x, y, width, height, ink.shade('text', 'rgba(255,255,255,0.4)'), { name: 'Connector' });

export const ecosystemSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: EV.forest, hint: 'Page' },
      primary: { value: EV.mint, hint: 'Glass cards and the closing line' },
      text: {
        value: EV.white,
        hint: 'Title, icons and card labels; its translucent shades color the intro, connectors, icon chips and card outlines',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Integrated Platform Ecosystem' },
      intro: {
        label: 'Intro',
        value: 'A connected blueprint that turns scattered tools into one dependable system.',
      },
      nodes: {
        label: 'Card label',
        value: ['Data\nPipelines', 'Model\nOperations', 'Partner\nAPIs'],
      },
      closing: { label: 'Closing line', value: 'Connected by default, secured end to end.' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const labels = t.list('nodes');
    return [
      darkBg(t),
      head(t.copy('title'), 0, 130, SW, 66, t.color('text'), { align: 'center' }),
      body(t.copy('intro'), 0, 230, SW, 30, t.shade('text', EV.soft), { align: 'center' }),
      wire(t, 958, 330, 4, 90),
      wire(t, 560, 418, 804, 4),
      NODES.map((node, index) => [
        wire(t, node.cx - 2, 420, 4, 80),
        glass(t, node.cx - 140, 500, 280, 300, 26),
        rect(node.cx - 50, 540, 100, 100, t.shade('text', 'rgba(255,255,255,0.14)'), {
          name: 'Icon chip',
          cornerRadius: 24,
        }),
        icon(node.icon, node.cx - 30, 560, 60, t.color('text'), { strokeWidth: 2 }),
        head(labels[index] ?? '', node.cx - 130, 680, 260, 34, t.color('text'), {
          align: 'center',
        }),
      ]),
      body(t.copy('closing'), 0, 880, SW, 26, t.color('primary'), { align: 'center' }),
    ];
  },
);

export const legacySlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: EV.white, hint: 'Page; its mint shade colors the lower corner' },
      primary: { value: EV.emerald, hint: 'Compounding Cost, the short rule and the dot grid' },
      text: {
        value: EV.ink,
        hint: 'The big figure, titles and brand name; its grey shade colors the paragraphs',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      figure: { label: 'Big figure', value: '$120B+' },
      caption: { label: 'Figure caption', value: 'Lost every year to unplanned downtime' },
      title: { label: 'Title', value: 'Legacy Systems' },
      subtitle: { label: 'Highlighted title', value: 'Compounding Cost' },
      body: {
        label: 'Paragraph',
        value:
          'Old maintenance models stay reactive, so teams firefight instead of building. By the time a critical machine fails, the damage has already spread across schedules, budgets and customer trust.',
      },
      brand: { label: 'Brand name', value: 'Fernbrook' },
      answer: {
        label: 'Brand answer',
        value:
          'flips the model from fixing to predicting, so every alert arrives before the outage does.',
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const muted = t.shade('text', EV.muted);
    return [
      lightBg(t),
      head(t.copy('figure'), 140, 380, 900, 200, t.color('text'), { fontWeight: 800 }),
      body(t.copy('caption'), 150, 600, 760, 32, muted),
      rect(150, 680, 120, 8, t.color('primary'), { name: 'Rule', cornerRadius: 4 }),
      head(t.copy('title'), 1100, 170, 700, 60, t.color('text')),
      head(t.copy('subtitle'), 1100, 240, 700, 60, t.color('primary'), { fontWeight: 500 }),
      body(t.copy('body'), 1100, 370, 680, 26, muted),
      head(t.copy('brand'), 1100, 650, 680, 30, t.color('text')),
      body(t.copy('answer'), 1100, 695, 680, 26, muted),
    ];
  },
);

const AXIS = [450, 400, 350, 300, 250, 200, 150, 100, 50, 0];
const BAR_VALUES = [410, 290, 160, 340];
const BASE = 900;
const UNIT = 740 / 450;

export const accelerationSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: EV.forest, hint: 'Page' },
      primary: { value: EV.mint, hint: 'Acceleration and the chart bars' },
      text: {
        value: EV.white,
        hint: 'Product; its translucent shades color the paragraph, axis numbers, axis line and bar labels',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Product' },
      subtitle: { label: 'Highlighted title', value: 'Acceleration' },
      body: {
        label: 'Paragraph',
        value:
          'Automation is no longer a nice extra. Offloading routine work lets teams move faster, stay accurate and scale without adding headcount.',
      },
      axis: {
        label: 'Axis number',
        value: ['450', '400', '350', '300', '250', '200', '150', '100', '50', '0'],
      },
      bars: { label: 'Bar label', value: ['Pilot', 'Launch', 'Scale', 'Expand'] },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const soft = t.shade('text', EV.soft);
    const axis = t.list('axis');
    return [
      darkBg(t),
      head(t.copy('title'), 140, 150, 700, 72, t.color('text')),
      head(t.copy('subtitle'), 140, 232, 700, 72, t.color('primary'), { fontWeight: 500 }),
      body(t.copy('body'), 140, 380, 640, 30, soft),
      AXIS.map((value, index) =>
        body(axis[index] ?? '', 960, BASE - value * UNIT - 16, 100, 26, soft, { align: 'right' }),
      ),
      rect(1090, 160, 2, 740, t.shade('text', 'rgba(255,255,255,0.25)'), { name: 'Axis' }),
      t.list('bars').map((label, index) => {
        const x = 1140 + index * 170;
        const height = (BAR_VALUES[index] ?? 0) * UNIT;
        return [
          rect(
            x,
            BASE - height,
            130,
            height,
            linear(180, t.color('primary'), t.shade('primary', 'rgba(47,158,124,0.12)')),
            { name: 'Bar', cornerRadius: 10 },
          ),
          body(label, x - 10, 925, 150, 24, soft, { align: 'center' }),
        ];
      }),
    ];
  },
);

const QUAD_SPOTS = [
  { x: 180, y: 190 },
  { x: 1040, y: 190 },
  { x: 180, y: 640 },
  { x: 1040, y: 640 },
];

export const quadrantSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: {
        value: EV.emerald,
        hint: 'Page; its deeper shade colors the lower right corner',
      },
      text: {
        value: EV.white,
        hint: 'Arrows and titles; its translucent shades color the dividers and descriptions',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      titles: {
        label: 'Title',
        value: ['Orchestration', 'Signals', 'Autopilot', 'Next Actions'],
      },
      texts: {
        label: 'Description',
        value: [
          'Group, sort and route work automatically.',
          'Spot trends and risks before they land.',
          'Hand repeat tasks to agents and refocus.',
          'Tailored suggestions for every team.',
        ],
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const texts = t.list('texts');
    const divider = t.shade('text', 'rgba(255,255,255,0.35)');
    return [
      rect(0, 0, SW, SH, linear(135, t.color('background'), t.shade('background', EV.forestMid)), {
        name: 'Background',
      }),
      rect(958, 120, 4, 840, divider, { name: 'Divider' }),
      rect(140, 538, 1640, 4, divider, { name: 'Divider' }),
      t.list('titles').map((title, index) => {
        const { x, y } = QUAD_SPOTS[index] ?? { x: 0, y: 0 };
        return [
          icon('arrow-up-right', x, y, 64, t.color('text'), { strokeWidth: 2.4 }),
          head(title, x + 100, y, 620, 54, t.color('text')),
          body(
            texts[index] ?? '',
            x + 100,
            y + 80,
            600,
            30,
            t.shade('text', 'rgba(255,255,255,0.86)'),
          ),
        ];
      }),
    ];
  },
);
