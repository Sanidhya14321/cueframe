import { circle, poly, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, CV, fontsOf, HEADING, SH, SW } from './theme';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const SERIES = [
  { label: 'Direct', fill: 'rgba(255,214,223,0.9)', values: [0.16, 0.27, 0.36, 0.52, 0.7, 0.95] },
  { label: 'Referral', fill: CV.rose, values: [0.1, 0.16, 0.24, 0.31, 0.44, 0.62] },
  { label: 'Search', fill: '#8a2e50', values: [0.05, 0.08, 0.12, 0.17, 0.23, 0.32] },
];
const LEVELS = [0, 1, 2, 3, 4];
const BASE = 900;
const CHART_H = 640;

const growthSpec = {
  colors: {
    background: { value: CV.wine, hint: 'Slide gradient; its lighter shade is the gradient end' },
    primary: {
      value: CV.rose,
      hint: 'Referral area, its legend dot and the big stat; its pale and deep shades color the Direct and Search areas, and a faint shade draws the grid',
    },
    text: { value: CV.white, hint: 'Title, legend labels and the stat caption' },
    secondary: { value: CV.muted, hint: 'Paragraph, axis values and month labels' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Growth\nConversions' },
    body: {
      label: 'Paragraph',
      value:
        'Trend analysis shows a 46% lift in conversions as page traffic and product sign-ups climb together.',
    },
    axis: { label: 'Axis value', value: LEVELS.map((level) => String(level * 40)) },
    months: { label: 'Month', value: MONTHS },
    series: { label: 'Series', value: SERIES.map((series) => series.label) },
    stat: { label: 'Stat', value: '+46%' },
    caption: { label: 'Stat caption', value: 'Conversion lift in six months' },
  },
} as const satisfies ThemeSpec;

export const growthSlide = themed(SW, SH, growthSpec, (t) => {
  const { head, body } = fontsOf(t);
  const fills = SERIES.map((series) => t.shade('primary', series.fill));
  const labels = t.list('series');
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    head(t.copy('title'), 120, 220, 620, 80, t.color('text')),
    body(t.copy('body'), 120, 440, 580, 30, t.color('secondary')),
    t.list('axis').map((value, level) => [
      rect(880, BASE - (level * CHART_H) / 4, 920, 2, t.shade('primary', CV.edge), {
        name: 'Grid line',
      }),
      body(value, 800, BASE - (level * CHART_H) / 4 - 18, 60, 24, t.color('secondary'), {
        align: 'right',
      }),
    ]),
    SERIES.map((series, index) =>
      poly(
        [
          [880, BASE],
          ...series.values.map(
            (value, step) => [880 + step * 184, BASE - value * CHART_H] as const,
          ),
          [1800, BASE],
        ],
        fills[index] ?? '',
        { name: `${series.label} area` },
      ),
    ),
    t.list('months').map((month, index) =>
      body(month, 850 + index * 184, BASE + 20, 60, 24, t.color('secondary'), {
        align: 'center',
      }),
    ),
    SERIES.map((_, index) => [
      circle(1290 + index * 190, 150, 12, fills[index] ?? ''),
      body(labels[index] ?? '', 1312 + index * 190, 134, 160, 26, t.color('text')),
    ]),
    head(t.copy('stat'), 120, 720, 400, 96, t.color('primary')),
    body(t.copy('caption'), 120, 840, 600, 28, t.color('text')),
  ];
});
