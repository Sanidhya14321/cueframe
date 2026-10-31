import {
  circle,
  group,
  icon,
  POST_SIZE,
  path,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { backdrop, CRIMSON, FONT, tag } from './posts';

const { width: W, height: H } = POST_SIZE;

interface InteractPalette {
  top: string;
  bottom: string;
  label: string;
  labelText: string;
  word: string;
  wordText: string;
  copy: string;
}

const CRIMSON_INTERACT: InteractPalette = {
  top: CRIMSON.wine,
  bottom: CRIMSON.deep,
  label: CRIMSON.white,
  labelText: CRIMSON.ink,
  word: CRIMSON.red,
  wordText: CRIMSON.white,
  copy: CRIMSON.blush,
};

export const AMBER_INTERACT: InteractPalette = {
  top: '#ffd85c',
  bottom: '#f5b800',
  label: '#ffffff',
  labelText: '#1a1300',
  word: '#1a1300',
  wordText: '#ffd85c',
  copy: '#1a1300',
};

export const interact = (palette: InteractPalette, lines: readonly [string, string, string]) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: palette.bottom,
          hint: 'Page gradient; its lighter shade colors the top of the page',
        },
        surface: { value: palette.label, hint: 'Label behind the opening line' },
        primary: { value: palette.word, hint: 'Block behind the big word' },
        secondary: { value: palette.wordText, hint: 'The big word lettering' },
        text: {
          value: palette.copy,
          hint: 'Closing line and the handshake icon; its shade colors the opening line',
        },
      },
      fonts: { font: FONT },
      copy: {
        intro: { label: 'Opening line', value: lines[0] },
        word: { label: 'Big word', value: lines[1] },
        closing: { label: 'Closing line', value: lines[2] },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      backdrop(t.shade('background', palette.top), t.color('background'), 180),
      tag(t.copy('intro'), 90, 140, 44, {
        fill: t.color('surface'),
        color: t.shade('text', palette.labelText),
        fontFamily: t.font('font'),
        width: 470,
        name: lines[0],
      }),
      tag(t.copy('word'), 90, 240, 130, {
        fill: t.color('primary'),
        color: t.color('secondary'),
        fontFamily: t.font('font'),
        width: 820,
        name: lines[1],
      }),
      text(t.copy('closing'), 90, 450, 900, {
        fontFamily: t.font('font'),
        fontSize: 56,
        fontWeight: 500,
        fill: t.color('text'),
      }),
      icon('handshake', 190, 620, 700, t.color('text'), { strokeWidth: 1.1 }),
    ],
  );

export const INTERACT_POST = interact(CRIMSON_INTERACT, [
  "It's vital to",
  'Engage',
  'with every customer',
]);

const wedge = (cx: number, cy: number, radius: number, start: number, end: number) => {
  const point = (angle: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return `${(cx + radius * Math.cos(radians)).toFixed(1)} ${(cy + radius * Math.sin(radians)).toFixed(1)}`;
  };
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${point(start)} A ${radius} ${radius} 0 ${large} 1 ${point(end)} Z`;
};

const SLICES = [
  { label: 'Sales', value: 54.2, x: 650, y: 760 },
  { label: 'Finance', value: 28.6, x: 250, y: 820 },
  { label: 'Marketing', value: 17.2, x: 330, y: 560 },
] as const;

const pieSpec = {
  colors: {
    background: {
      value: CRIMSON.blush,
      hint: 'Page gradient; its lighter shade colors the top of the page',
    },
    primary: {
      value: CRIMSON.red,
      hint: 'by the numbers and the pie slices, one shade per slice',
    },
    surface: {
      value: CRIMSON.white,
      hint: 'Slice outlines and percentages; its pink tint colors the team names',
    },
    text: { value: CRIMSON.ink, hint: 'Teams' },
  },
  fonts: { font: FONT },
  copy: {
    title: { label: 'Title', value: 'Teams' },
    subtitle: { label: 'Subtitle', value: 'by the numbers' },
    values: { label: 'Share', value: SLICES.map((slice) => `${slice.value}%`) },
    teams: { label: 'Team', value: SLICES.map((slice) => slice.label) },
  },
} as const satisfies ThemeSpec;

export const departmentsPie = themed(W, H, pieSpec, (t) => {
  const fills = [
    t.shade('primary', CRIMSON.wine),
    t.color('primary'),
    t.shade('primary', CRIMSON.bright),
  ];
  const values = t.list('values');
  const teams = t.list('teams');
  let angle = 0;
  return [
    backdrop(t.shade('background', CRIMSON.white), t.color('background'), 180),
    text(t.copy('title'), 0, 110, W, {
      fontFamily: t.font('font'),
      fontSize: 84,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 0, 210, W, {
      fontFamily: t.font('font'),
      fontSize: 84,
      fontWeight: 700,
      fill: t.color('primary'),
      align: 'center',
    }),
    SLICES.map((slice, index) => {
      const start = angle;
      angle += (slice.value / 100) * 360;
      return group(
        path(
          wedge(540, 780, 380, start, angle),
          0,
          0,
          W,
          H,
          fills[index] ?? t.color('primary'),
          { width: W, height: H },
          {
            name: `${slice.label} slice`,
            stroke: t.color('surface'),
            strokeWidth: 6,
          },
        ),
        text(values[index] ?? '', slice.x, slice.y, 220, {
          fontFamily: t.font('font'),
          fontSize: 54,
          fontWeight: 700,
          fill: t.color('surface'),
          align: 'center',
        }),
        text(teams[index] ?? '', slice.x, slice.y + 66, 220, {
          fontFamily: t.font('font'),
          fontSize: 30,
          fontWeight: 500,
          fill: t.shade('surface', CRIMSON.blush),
          align: 'center',
        }),
      );
    }),
  ];
});

const STEPS = [
  { label: 'Identify', icon: 'arrow-down', x: 300, side: 'right' },
  { label: 'Evaluate', icon: 'arrow-down', x: 180, side: 'left' },
  { label: 'Compare', icon: 'arrow-right', x: 320, side: 'right' },
  { label: 'Decide', icon: 'arrow-left', x: 480, side: 'left' },
  { label: 'Succeed', icon: 'arrow-down', x: 230, side: 'right' },
] as const;

const stepsSpec = {
  colors: {
    background: {
      value: CRIMSON.wine,
      hint: 'Page gradient; its darker shade colors the bottom of the page',
    },
    primary: {
      value: CRIMSON.red,
      hint: 'Red step cards, the icon circles beside white cards and the icons beside red cards',
    },
    surface: {
      value: CRIMSON.white,
      hint: 'White step cards, labels on red cards and the remaining icon circles and icons; its pink tint colors the title',
    },
    text: { value: CRIMSON.ink, hint: 'Labels on the white step cards' },
  },
  fonts: { font: FONT },
  copy: {
    title: { label: 'Title', value: 'Five steps to a smarter call' },
    steps: { label: 'Step', value: STEPS.map((step) => step.label) },
  },
} as const satisfies ThemeSpec;

export const decisionSteps = themed(W, H, stepsSpec, (t) => {
  const labels = t.list('steps');
  return [
    backdrop(t.color('background'), t.shade('background', CRIMSON.deep), 170),
    text(t.copy('title'), 0, 110, W, {
      fontFamily: t.font('font'),
      fontSize: 50,
      fontWeight: 600,
      fill: t.shade('surface', CRIMSON.blush),
      align: 'center',
    }),
    STEPS.map((step, index) => {
      const y = 270 + index * 190;
      const width = step.label.length * 44 + 80;
      const filled = index % 2 === 1;
      const iconX = step.side === 'right' ? step.x + width + 24 : step.x - 124;
      const red = t.color('primary');
      const white = t.color('surface');
      return group(
        rect(step.x, y, width, 130, filled ? red : white, {
          cornerRadius: 22,
          name: `${step.label} step`,
          ...shadow(24, 10, 'rgba(0,0,0,0.35)'),
        }),
        text(labels[index] ?? '', step.x, y + 28, width, {
          fontFamily: t.font('font'),
          fontSize: 64,
          fontWeight: 700,
          fill: filled ? white : t.color('text'),
          align: 'center',
        }),
        circle(iconX + 50, y + 65, 50, filled ? white : red),
        icon(step.icon, iconX + 18, y + 33, 64, filled ? red : white, {
          strokeWidth: 2.6,
        }),
      );
    }),
  ];
});

const hiringSpec = {
  colors: {
    background: {
      value: CRIMSON.blush,
      hint: 'Page gradient; its lighter shade colors the top of the page',
    },
    primary: { value: CRIMSON.red, hint: 'HIRING block and the seat circle with its glow' },
    surface: {
      value: CRIMSON.white,
      hint: 'We are and HIRING lettering and the armchair icon',
    },
    text: {
      value: CRIMSON.ink,
      hint: 'We are label and Apply today; its grey shade colors the role line',
    },
  },
  fonts: { font: FONT },
  copy: {
    kicker: { label: 'Kicker', value: 'We are' },
    cta: { label: 'Call to action', value: 'Apply today' },
    title: { label: 'Title', value: 'HIRING' },
    role: { label: 'Role', value: 'Senior Brand Strategist  ·  Remote friendly' },
  },
} as const satisfies ThemeSpec;

export const hiring = themed(W, H, hiringSpec, (t) => [
  backdrop(t.shade('background', CRIMSON.white), t.color('background'), 180),
  tag(t.copy('kicker'), 90, 150, 56, {
    fill: t.color('text'),
    color: t.color('surface'),
    fontFamily: t.font('font'),
    width: 300,
    name: 'We are',
  }),
  text(t.copy('cta'), 420, 162, 400, {
    fontFamily: t.font('font'),
    fontSize: 52,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  tag(t.copy('title'), 90, 270, 170, {
    fill: t.color('primary'),
    color: t.color('surface'),
    fontFamily: t.font('font'),
    width: 900,
    name: 'HIRING',
  }),
  circle(540, 860, 290, t.color('primary'), {
    name: 'Seat circle',
    ...shadow(40, 16, t.shade('primary', 'rgba(92,8,22,0.3)')),
  }),
  icon('armchair', 340, 660, 400, t.color('surface'), { strokeWidth: 1.4 }),
  text(t.copy('role'), 0, 1200, W, {
    fontFamily: t.font('font'),
    fontSize: 34,
    fontWeight: 500,
    fill: t.shade('text', CRIMSON.grey),
    align: 'center',
  }),
]);
