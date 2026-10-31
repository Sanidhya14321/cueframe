import { radial } from '@/design';
import { circle, icon, path, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, fade, fonts, glow, HEADING, K, SH, SW } from './theme';

const STAGE_X = [160, 700, 1460];
const STAGE_ALIGN = ['left', 'center', 'right'] as const;
const FEATURE_ICONS = ['workflow', 'trending-up'] as const;

export const velocitySlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: K.black, hint: 'Page and the feature icons' },
      primary: {
        value: K.lime,
        hint: 'Finished progress segments, the icon tiles and the green wash',
      },
      text: {
        value: K.white,
        hint: 'Title, the stage values, the remaining progress segments and the feature titles; its grey shade colors the stage labels and feature text',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Execution Velocity' },
      stages: { label: 'Stage', value: ['Baseline', 'Current scale', 'Target'] },
      values: { label: 'Stage value', value: ['33%', '66%', '100%'] },
      features: { label: 'Feature', value: ['Smart routing', 'Expansion runway'] },
      details: {
        label: 'Feature detail',
        value: [
          'Tickets reach the right agent in seconds.',
          'Capacity for three times the volume.',
        ],
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const muted = t.shade('text', K.muted);
    const values = t.list('values');
    const details = t.list('details');
    return [
      backdrop(t, 200),
      head(t.copy('title'), 0, 140, SW, 100, t.color('text'), { align: 'center' }),
      t.list('stages').map((stage, index) => {
        const x = STAGE_X[index] ?? 0;
        const align = STAGE_ALIGN[index] ?? 'center';
        return [
          body(stage, x, 330, 300, 30, muted, { align }),
          head(values[index] ?? '', x, 380, 300, 64, t.color('text'), { align }),
        ];
      }),
      Array.from({ length: 6 }, (_, index) =>
        rect(160 + index * 270, 510, 250, 110, index < 4 ? t.color('primary') : t.color('text'), {
          name: 'Progress segment',
          cornerRadius: 24,
        }),
      ),
      t.list('features').map((feature, index) => {
        const x = 160 + index * 820;
        return [
          rect(x, 800, 80, 80, t.color('primary'), { name: 'Icon tile', cornerRadius: 20 }),
          icon(FEATURE_ICONS[index] ?? 'workflow', x + 18, 818, 44, t.color('background')),
          head(feature, x + 110, 800, 600, 40, t.color('text')),
          body(details[index] ?? '', x + 110, 860, 620, 30, muted),
        ];
      }),
    ];
  },
);

export const numbersSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: K.black, hint: 'Page' },
      primary: {
        value: K.lime,
        hint: 'Glowing dome, its halo and the green wash',
      },
      text: {
        value: K.white,
        hint: 'Stat values and the faded Numbers title; its grey shade colors the stat labels',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      labels: {
        label: 'Stat label',
        value: [
          'Sponsors',
          'Partners',
          'Repositories',
          'Contributors',
          'Searches',
          'Teams',
          'Milestones',
          'API hooks',
        ],
      },
      values: {
        label: 'Stat',
        value: ['140K', '420K', '310M', '17.6K', '88M', '246K', '72K', '20.4K'],
      },
      title: { label: 'Title', value: 'Numbers' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const values = t.list('values');
    return [
      backdrop(t),
      t.list('labels').map((label, index) => {
        const x = 220 + (index % 4) * 390;
        const y = 90 + Math.floor(index / 4) * 190;
        return [
          body(label, x, y, 360, 28, t.shade('text', K.muted)),
          head(values[index] ?? '', x, y + 40, 360, 84, t.color('text')),
        ];
      }),
      head(t.copy('title'), 0, 470, SW, 300, fade(t, 'rgba(255,255,255,0.55)'), {
        align: 'center',
      }),
      path(
        'M0 380 A1032 1032 0 0 1 1600 380 Z',
        160,
        700,
        1600,
        380,
        t.shade('primary', 'rgba(184,245,49,0.18)'),
        { width: 1600, height: 380 },
      ),
      path(
        'M0 340 A1019 1019 0 0 1 1520 340 Z',
        200,
        740,
        1520,
        340,
        radial(
          t.shade('primary', '#d6fb83'),
          t.color('primary'),
          t.shade('primary', K.olive),
          t.shade('primary', '#0b1105'),
        ),
        { width: 1520, height: 340 },
      ),
    ];
  },
);

export const conversionsSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: K.black, hint: 'Page and the text on the stat chips' },
      primary: {
        value: K.lime,
        hint: 'Second stat chip, the end point and its glow, and the green wash',
      },
      text: {
        value: K.white,
        hint: 'Title, the first stat chip, the trend curve and the point center; its grey shade colors the paragraph',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Growth\nConversions' },
      paragraph: {
        label: 'Paragraph',
        value:
          'Trend analysis shows a 41% link between faster page loads and paid conversions once Kestrel agents went live.',
      },
      stats: { label: 'Stat', value: ['88%', '14K hrs'] },
      statLabels: { label: 'Stat label', value: ['Latency reduction', 'Saved annually'] },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const [first = '', second = ''] = t.list('stats');
    const [firstLabel = '', secondLabel = ''] = t.list('statLabels');
    return [
      backdrop(t, 200),
      head(t.copy('title'), 100, 160, 820, 110, t.color('text')),
      body(t.copy('paragraph'), 100, 440, 760, 32, t.shade('text', K.muted)),
      rect(100, 720, 320, 180, t.color('text'), { name: 'Stat chip', cornerRadius: 24 }),
      head(first, 140, 750, 260, 72, t.color('background')),
      body(firstLabel, 140, 840, 260, 26, t.color('background'), { fontWeight: 600 }),
      rect(460, 720, 380, 180, t.color('primary'), { name: 'Stat chip', cornerRadius: 24 }),
      head(second, 500, 750, 320, 72, t.color('background')),
      body(secondLabel, 500, 840, 320, 26, t.color('background'), { fontWeight: 600 }),
      path(
        'M0 560 C200 560 220 300 360 340 S520 600 600 420 S680 120 760 60',
        1000,
        240,
        760,
        560,
        t.shade('text', 'rgba(0,0,0,0)'),
        { width: 760, height: 560 },
        { stroke: t.shade('text', 'rgba(255,255,255,0.75)'), strokeWidth: 5, name: 'Trend curve' },
      ),
      glow(t, 1760, 300, 110, 0.7),
      circle(1760, 300, 26, t.color('primary')),
      circle(1760, 300, 10, t.color('text')),
    ];
  },
);
