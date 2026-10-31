import {
  circle,
  icon,
  type Nodes,
  photo,
  poly,
  rect,
  rotateNodes,
  shadow,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';
import { POST } from '../lagoon-saas-stats/theme';
import {
  copyStyle,
  type DosCopy,
  dosDonts,
  fontsOf,
  head,
  type MythCopy,
  mythFact,
  mythStory,
  type ProblemCopy,
  problemsSolution,
  type ShiftTheme,
  spark,
} from './posts';

interface DirectionCopy {
  kicker: string;
  title: string;
  before: string;
  after: string;
  people: readonly [PosterPhotoName, PosterPhotoName];
}

interface HookCopy {
  lines: readonly [string, string];
  punch: string;
  body: string;
}

export interface ShiftCopy {
  myth: MythCopy;
  dos: DosCopy;
  problem: ProblemCopy;
  direction: DirectionCopy;
  hook: HookCopy;
}

const { width: W, height: H } = POST;

const GRAYSCALE = {
  brightness: 0.95,
  contrast: 1.1,
  saturation: 0,
  hue: 0,
  blur: 0,
  grayscale: 1,
  sepia: 0,
  invert: 0,
};

interface PanelColors {
  fill: string;
  badge: string;
  mark: string;
  label: string;
  font: string;
}

const directionPanel = (
  colors: PanelColors,
  x: number,
  name: string,
  label: string,
  lines: string,
  person: PosterPhotoName,
  after: boolean,
): Nodes[] => [
  rect(x, 330, 450, 1020, colors.fill, { name: `${name} panel`, cornerRadius: 10 }),
  circle(x + 60, 392, 28, colors.badge, { name: 'Badge' }),
  icon(after ? 'check' : 'x', x + 42, 374, 36, colors.mark, { strokeWidth: 3 }),
  text(label, x + 104, 370, 300, head(colors.font, 40, colors.label)),
  text(lines, x, 470, 450, {
    ...head(colors.font, 46, colors.label),
    align: 'center',
    lineHeight: 1.2,
  }),
  photo(person, x + 25, 760, 400, 565, {
    cornerRadius: 8,
    ...(after ? {} : { filters: GRAYSCALE }),
  }),
];

const chooseDirection = (theme: ShiftTheme, copy: DirectionCopy): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: theme.dark, hint: 'Page and the check and cross marks' },
        accent: { value: theme.pop, hint: 'Kicker and the After badge' },
        text: { value: theme.onBrand, hint: 'Title and the labels and lines on both panels' },
        secondary: { value: theme.panel, hint: 'Before panel' },
        primary: { value: theme.brand, hint: 'After panel' },
        surface: { value: theme.paper, hint: 'Before badge' },
      },
      fonts: { heading: fontsOf(theme).heading },
      copy: {
        kicker: { label: 'Kicker', value: copy.kicker },
        title: { label: 'Title', value: copy.title },
        labels: { label: 'Panel label', value: ['Before', 'After'] },
        lines: { label: 'Panel lines', value: [copy.before, copy.after] },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const heading = t.font('heading');
      const [before = '', after = ''] = t.list('labels');
      const [beforeLines = '', afterLines = ''] = t.list('lines');
      const shared = { mark: t.color('background'), label: t.color('text'), font: heading };
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('kicker'), 0, 80, W, {
          ...head(heading, 76, t.color('accent')),
          align: 'center',
        }),
        text(t.copy('title'), 0, 168, W, {
          ...head(heading, 76, t.color('text')),
          align: 'center',
        }),
        directionPanel(
          { ...shared, fill: t.color('secondary'), badge: t.color('surface') },
          65,
          'Before',
          before,
          beforeLines,
          copy.people[0],
          false,
        ),
        directionPanel(
          { ...shared, fill: t.color('primary'), badge: t.color('accent') },
          565,
          'After',
          after,
          afterLines,
          copy.people[1],
          true,
        ),
      ];
    },
  );

interface SignColors {
  board: string;
  edge: string;
  arrow: string;
  font: string;
}

const sign = (
  colors: SignColors,
  label: string,
  y: number,
  pointsLeft: boolean,
  degrees: number,
): Nodes[] => {
  const points: readonly (readonly [number, number])[] = pointsLeft
    ? [
        [230, y + 60],
        [300, y],
        [820, y],
        [820, y + 120],
        [300, y + 120],
      ]
    : [
        [260, y],
        [790, y],
        [860, y + 60],
        [790, y + 120],
        [260, y + 120],
      ];
  return rotateNodes(degrees, 545, y + 60, [
    poly(points, colors.board, {
      name: `${pointsLeft ? 'BEFORE' : 'AFTER'} sign`,
      stroke: colors.edge,
      strokeWidth: 6,
      ...shadow(24, 10, 'rgba(0,0,0,0.45)'),
    }),
    text(label, pointsLeft ? 330 : 280, y + 22, 400, {
      ...head(colors.font, 72, colors.edge),
      letterSpacing: 4,
    }),
    icon(
      pointsLeft ? 'arrow-left' : 'arrow-right',
      pointsLeft ? 720 : 680,
      y + 30,
      62,
      colors.arrow,
      {
        strokeWidth: 3,
      },
    ),
  ]);
};

export const transformHook = (theme: ShiftTheme, copy: HookCopy): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: theme.dark, hint: 'Page' },
        text: { value: theme.onBrand, hint: 'Opening lines; its grey shade colors the body' },
        accent: {
          value: theme.pop,
          hint: 'Punch line and the sign arrows; its shade colors the sparkles',
        },
        secondary: { value: theme.panel, hint: 'Sign boards' },
        surface: {
          value: theme.paper,
          hint: 'Sign outlines and sign text; its grey shades color the pole and its cap',
        },
      },
      fonts: fontsOf(theme),
      copy: {
        lines: { label: 'Opening line', value: copy.lines },
        punch: { label: 'Punch line', value: copy.punch },
        body: { label: 'Body', value: copy.body },
        signs: { label: 'Sign', value: ['BEFORE', 'AFTER'] },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const heading = t.font('heading');
      const [first = '', second = ''] = t.list('lines');
      const [before = '', after = ''] = t.list('signs');
      const colors: SignColors = {
        board: t.color('secondary'),
        edge: t.color('surface'),
        arrow: t.color('accent'),
        font: heading,
      };
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        spark(880, 70, 130, t.shade('accent', theme.star)),
        text(first, 80, 150, 900, head(heading, 64, t.color('text'))),
        text(second, 80, 225, 900, head(heading, 64, t.color('text'))),
        text(t.copy('punch'), 80, 300, 900, head(heading, 64, t.color('accent'))),
        text(
          t.copy('body'),
          80,
          420,
          860,
          copyStyle(t.font('body'), 32, t.shade('text', '#c7cbd6')),
        ),
        rect(527, 640, 36, 710, t.shade('surface', '#9ca3af'), { name: 'Sign pole' }),
        circle(545, 640, 26, t.shade('surface', '#d1d5db'), { name: 'Pole cap' }),
        sign(colors, before, 690, true, -6),
        sign(colors, after, 900, false, 5),
        spark(70, 1120, 140, t.shade('accent', theme.star)),
      ];
    },
  );

interface ShiftSet {
  myth: Template;
  dos: Template;
  problem: Template;
  direction: Template;
  hook: Template;
  story: Template;
}

export const shiftTemplates = (theme: ShiftTheme, copy: ShiftCopy): ShiftSet => ({
  myth: mythFact(theme, copy.myth),
  dos: dosDonts(theme, copy.dos),
  problem: problemsSolution(theme, copy.problem),
  direction: chooseDirection(theme, copy.direction),
  hook: transformHook(theme, copy.hook),
  story: mythStory(theme, copy.myth),
});
