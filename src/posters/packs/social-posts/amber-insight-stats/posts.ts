import {
  circle,
  icon,
  line,
  POST_SIZE,
  path,
  rect,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface StatPalette {
  brand: string;
  deep: string;
  paper: string;
  muted: string;
}

export const AMBER: StatPalette = {
  brand: '#ffb020',
  deep: '#1b1740',
  paper: '#ffffff',
  muted: '#b9b4dc',
};

export const SKY: StatPalette = {
  brand: '#38bdf8',
  deep: '#0b1e33',
  paper: '#ffffff',
  muted: '#a9c4dc',
};

export const HEAD = { label: 'Heading font', value: 'Sora' } as const;
export const BODY = { label: 'Body font', value: 'Manrope' } as const;
export const { width: W, height: H } = POST_SIZE;

const RESULT_CARDS = [
  { x: 160, y: 470, icon: 'trending-up', filled: false },
  { x: 240, y: 690, icon: 'trending-down', filled: true },
  { x: 160, y: 910, icon: 'trending-up', filled: false },
] as const;

const resultsSpec = (p: StatPalette) =>
  ({
    colors: {
      background: {
        value: p.deep,
        hint: 'Page, the card text, the icons on the white cards and the circle on the highlighted card',
      },
      primary: {
        value: p.brand,
        hint: 'Highlighted card, the circles on the white cards, the icon on the highlighted card and the left star',
      },
      secondary: { value: p.muted, hint: 'Kicker' },
      text: { value: p.paper, hint: 'Headline, the white cards and the right star' },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      kicker: { label: 'Kicker', value: 'BOOST ENGAGEMENT' },
      title: { label: 'Headline', value: "The results we've\ncome up with" },
      results: {
        label: 'Result',
        value: [
          'Engagement rose\nby 25 percent',
          'Bounce rate fell\nby 15 percent',
          'Mobile sales climbed\nby 20 percent',
        ],
      },
    },
  }) as const satisfies ThemeSpec;

export const resultsList = (p: StatPalette): Template =>
  themed(W, H, resultsSpec(p), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('kicker'), 100, 110, 700, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 700,
      fill: t.color('secondary'),
      letterSpacing: 3,
    }),
    text(t.copy('title'), 100, 160, 900, {
      fontFamily: t.font('heading'),
      fontSize: 70,
      fontWeight: 700,
      fill: t.color('text'),
      lineHeight: 1.15,
    }),
    t.list('results').map((label, index) => {
      const { x, y, icon: name, filled } = RESULT_CARDS[index] ?? RESULT_CARDS[0];
      return [
        rect(x, y, 760, 170, filled ? t.color('primary') : t.color('text'), {
          cornerRadius: 22,
          name: 'Result card',
          shadow: { color: 'rgba(0,0,0,0.35)', blur: 30, offsetX: 0, offsetY: 12 },
        }),
        circle(x + 90, y + 85, 50, filled ? t.color('background') : t.color('primary')),
        icon(name, x + 62, y + 57, 56, filled ? t.color('primary') : t.color('background'), {
          strokeWidth: 2.6,
        }),
        text(label, x + 175, y + 40, 560, {
          fontFamily: t.font('body'),
          fontSize: 36,
          fontWeight: 600,
          fill: t.color('background'),
          lineHeight: 1.25,
        }),
      ];
    }),
    star(5, 50, 560, 110, t.color('primary'), { innerRatio: 0.45 }),
    star(5, 890, 1110, 120, t.color('text'), { innerRatio: 0.45 }),
  ]);

const CHART_POINTS = [
  { x: 292, y: 1135, top: 860 },
  { x: 685, y: 1035, top: 680 },
  { x: 880, y: 972, top: 520 },
];

const clear = (hex: string) => {
  const channel = (start: number) => Number.parseInt(hex.slice(start, start + 2), 16);
  return `rgba(${channel(1)},${channel(3)},${channel(5)},0)`;
};

const chartSpec = (p: StatPalette) =>
  ({
    colors: {
      background: { value: p.brand, hint: 'Page' },
      accent: {
        value: p.paper,
        hint: 'Where leaders, the dots on the trend line and the star beside the chart',
      },
      text: {
        value: p.deep,
        hint: 'Kicker, the second headline line, the top star, the trend and leader lines, the dot outlines, the percentages, their labels and the closing line',
      },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      kicker: { label: 'Kicker', value: 'REVENUE PLANNING' },
      title: { label: 'Headline', value: 'Where leaders' },
      subtitle: { label: 'Second headline line', value: 'are focusing now' },
      values: { label: 'Percentage', value: ['51%', '72%', '85%'] },
      labels: { label: 'Point label', value: ['AI tools', 'New clients', 'Faster delivery'] },
      closing: { label: 'Closing line', value: 'Need a plan? Send us a message.' },
    },
  }) as const satisfies ThemeSpec;

export const leadersChart = (p: StatPalette): Template =>
  themed(W, H, chartSpec(p), (t) => {
    const labels = t.list('labels');
    const headline = (content: string, y: number, fill: string) =>
      text(content, 90, y, 900, {
        fontFamily: t.font('heading'),
        fontSize: 72,
        fontWeight: 700,
        fill,
      });
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      text(t.copy('kicker'), 90, 110, 700, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 700,
        fill: t.color('text'),
        letterSpacing: 3,
      }),
      headline(t.copy('title'), 160, t.color('accent')),
      headline(t.copy('subtitle'), 245, t.color('text')),
      star(5, 880, 60, 110, t.color('text'), { innerRatio: 0.45 }),
      path(
        'M80 1180 C300 1180 300 1090 460 1090 C640 1090 700 990 1000 950',
        0,
        0,
        W,
        H,
        t.shade('text', clear(p.deep)),
        { width: W, height: H },
        { stroke: t.color('text'), strokeWidth: 8, name: 'Trend line' },
      ),
      t.list('values').map((value, index) => {
        const point = CHART_POINTS[index] ?? { x: 0, y: 0, top: 0 };
        return [
          line(point.x, point.top + 150, point.y - point.top - 150, t.color('text'), 3, {
            rotation: 90,
            name: 'Leader line',
          }),
          circle(point.x, point.y, 16, t.color('accent'), {
            stroke: t.color('text'),
            strokeWidth: 6,
          }),
          text(value, point.x - 120, point.top, 240, {
            fontFamily: t.font('heading'),
            fontSize: 72,
            fontWeight: 700,
            fill: t.color('text'),
            align: 'center',
          }),
          text(labels[index] ?? '', point.x - 120, point.top + 92, 240, {
            fontFamily: t.font('body'),
            fontSize: 28,
            fontWeight: 600,
            fill: t.color('text'),
            align: 'center',
          }),
        ];
      }),
      star(5, 960, 860, 90, t.color('accent'), { innerRatio: 0.45 }),
      text(t.copy('closing'), 90, 1250, 900, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 600,
        fill: t.color('text'),
      }),
    ];
  });

const profitSpec = (p: StatPalette) =>
  ({
    colors: {
      background: { value: p.deep, hint: 'Page and the arrow' },
      primary: {
        value: p.brand,
        hint: 'Grow, the active progress segment, the arrow circle and the small star',
      },
      secondary: { value: p.muted, hint: 'Body text' },
      text: {
        value: p.paper,
        hint: 'Second title line, the percentage and the top star; its faint shade colors the inactive progress segments',
      },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Grow' },
      subtitle: { label: 'Second title line', value: 'your profit\nwith us' },
      stat: { label: 'Statistic', value: '92%' },
      body: {
        label: 'Body',
        value:
          'Lift revenue with our proven playbook, built to give small teams steady, measurable growth month after month.',
      },
    },
  }) as const satisfies ThemeSpec;

export const growProfit = (p: StatPalette): Template =>
  themed(W, H, profitSpec(p), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    [0, 1, 2, 3].map((index) =>
      rect(
        100 + index * 190,
        110,
        160,
        14,
        index === 1 ? t.color('primary') : t.shade('text', 'rgba(255,255,255,0.3)'),
        { cornerRadius: 7, name: 'Progress segment' },
      ),
    ),
    star(5, 900, 60, 120, t.color('text'), { innerRatio: 0.45 }),
    text(t.copy('title'), 100, 260, 800, {
      fontFamily: t.font('heading'),
      fontSize: 110,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
    text(t.copy('subtitle'), 100, 390, 900, {
      fontFamily: t.font('heading'),
      fontSize: 110,
      fontWeight: 700,
      fill: t.color('text'),
      lineHeight: 1.1,
    }),
    text(t.copy('stat'), 100, 660, 500, {
      fontFamily: t.font('heading'),
      fontSize: 170,
      fontWeight: 700,
      fill: t.color('text'),
    }),
    circle(640, 770, 70, t.color('primary')),
    icon('arrow-up-right', 595, 725, 90, t.color('background'), { strokeWidth: 3 }),
    star(5, 40, 940, 70, t.color('primary'), { innerRatio: 0.45 }),
    text(t.copy('body'), 140, 980, 820, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 500,
      fill: t.color('secondary'),
      lineHeight: 1.45,
    }),
  ]);
