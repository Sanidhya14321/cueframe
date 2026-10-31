import {
  circle,
  icon,
  type Nodes,
  path,
  poly,
  rect,
  rotateNodes,
  shadow,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { POST } from '../lagoon-saas-stats/theme';

export interface ShiftTheme {
  brand: string;
  panel: string;
  dark: string;
  paper: string;
  ink: string;
  onBrand: string;
  pop: string;
  star: string;
  headFont: string;
  bodyFont: string;
}

export interface MythCopy {
  myth: string;
  fact: string;
}

export interface DosCopy {
  kicker: string;
  title: string;
  dos: readonly string[];
  donts: readonly string[];
}

const W = POST.width;

export const fontsOf = (theme: ShiftTheme) => ({
  heading: { label: 'Heading font', value: theme.headFont },
  body: { label: 'Body font', value: theme.bodyFont },
});

export const head = (fontFamily: string, size: number, fill: string) => ({
  fontFamily,
  fontSize: size,
  fontWeight: 800,
  fill,
  lineHeight: 1.08,
});

export const copyStyle = (fontFamily: string, size: number, fill: string, weight = 400) => ({
  fontFamily,
  fontSize: size,
  fontWeight: weight,
  fill,
  lineHeight: 1.35,
});

export const spark = (x: number, y: number, size: number, fill: string) =>
  star(5, x, y, size, fill, { innerRatio: 0.45, name: 'Star' });

const mythFactCard = (theme: ShiftTheme, copy: MythCopy, height: number): Template =>
  themed(
    W,
    height,
    {
      colors: {
        background: { value: theme.brand, hint: 'Page' },
        secondary: {
          value: theme.dark,
          hint: 'Myth title, the Or tag, the myth card and the text on the fact card',
        },
        surface: { value: theme.paper, hint: 'Fact card' },
        text: {
          value: theme.onBrand,
          hint: 'Fact title, Or, the text on the myth card and the connector line',
        },
        accent: { value: theme.star, hint: 'Sparkles' },
      },
      fonts: fontsOf(theme),
      copy: {
        myth: {
          label: 'Myth label',
          value: 'Myth',
          hint: 'Shown as the title and on the myth card',
        },
        joiner: { label: 'Joining word', value: 'Or' },
        fact: {
          label: 'Fact label',
          value: 'Fact',
          hint: 'Shown as the title and on the fact card',
        },
        mythText: { label: 'Myth', value: copy.myth },
        factText: { label: 'Fact', value: copy.fact },
      },
    } as const satisfies ThemeSpec,
    (t): Nodes[] => {
      const heading = t.font('heading');
      const body = t.font('body');
      const dy = (height - POST.height) / 2;
      return [
        rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
        spark(30, 40 + dy * 0.3, 100, t.color('accent')),
        text(t.copy('myth'), 90, 140 + dy * 0.5, 600, head(heading, 150, t.color('secondary'))),
        text(t.copy('fact'), 90, 300 + dy * 0.5, 600, head(heading, 150, t.color('text'))),
        rect(420, 340 + dy * 0.5, 84, 70, t.color('secondary'), {
          name: 'Or tag',
          cornerRadius: 6,
        }),
        text(t.copy('joiner'), 420, 356 + dy * 0.5, 84, {
          ...head(heading, 32, t.color('text')),
          align: 'center',
        }),
        rotateNodes(-6, 570, 690 + dy, [
          rect(250, 590 + dy, 640, 210, t.color('secondary'), {
            name: 'Myth card',
            cornerRadius: 10,
            ...shadow(30, 14, 'rgba(0,0,0,0.35)'),
          }),
          text(t.copy('myth'), 290, 622 + dy, 300, head(heading, 34, t.color('text'))),
          text(t.copy('mythText'), 290, 676 + dy, 560, copyStyle(body, 32, t.color('text'))),
        ]),
        path(
          'M10 0 C -40 120 120 160 180 230',
          430,
          800 + dy,
          190,
          230,
          t.shade('text', 'rgba(0,0,0,0)'),
          { width: 190, height: 230 },
          { stroke: t.color('text'), strokeWidth: 4, name: 'Connector' },
        ),
        rotateNodes(4, 650, 1110 + dy, [
          rect(330, 1010 + dy, 640, 210, t.color('surface'), {
            name: 'Fact card',
            cornerRadius: 10,
            ...shadow(30, 14, 'rgba(0,0,0,0.3)'),
          }),
          text(t.copy('fact'), 370, 1040 + dy, 560, {
            ...head(heading, 34, t.color('secondary')),
            align: 'right',
          }),
          text(t.copy('factText'), 370, 1094 + dy, 560, copyStyle(body, 32, t.color('secondary'))),
        ]),
        spark(880, 1150 + dy, 150, t.color('accent')),
      ];
    },
  );

export const mythFact = (theme: ShiftTheme, copy: MythCopy): Template =>
  mythFactCard(theme, copy, POST.height);

export const mythStory = (theme: ShiftTheme, copy: MythCopy): Template =>
  mythFactCard(theme, copy, 1920);

const bulletList = (
  fontFamily: string,
  items: readonly string[],
  x: number,
  y: number,
  color: string,
) =>
  items.map((item, index) => [
    circle(x + 7, y + index * 96 + 19, 6, color, { name: 'Bullet' }),
    text(item, x + 28, y + index * 96, 330, {
      ...copyStyle(fontFamily, 28, color),
      lineHeight: 1.25,
    }),
  ]);

export const dosDonts = (theme: ShiftTheme, copy: DosCopy): Template =>
  themed(
    W,
    POST.height,
    {
      colors: {
        background: {
          value: theme.dark,
          hint: "Page and the icon, label and tips on the Do's card",
        },
        accent: { value: theme.pop, hint: 'Kicker; its shade colors the sparkles' },
        text: {
          value: theme.onBrand,
          hint: "Title and the icon, label and tips on the Don'ts card; its faint tint colors that card's divider",
        },
        surface: { value: theme.paper, hint: "Do's card; its grey shade colors its divider" },
        secondary: { value: theme.panel, hint: "Don'ts card" },
      },
      fonts: fontsOf(theme),
      copy: {
        kicker: { label: 'Kicker', value: copy.kicker },
        title: { label: 'Title', value: copy.title },
        doLabel: { label: 'Do heading', value: "Do's" },
        dos: { label: 'Do tip', value: copy.dos },
        dontLabel: { label: "Don't heading", value: "Don'ts" },
        donts: { label: "Don't tip", value: copy.donts },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const heading = t.font('heading');
      const body = t.font('body');
      const ink = t.color('background');
      const light = t.color('text');
      return [
        rect(0, 0, W, POST.height, t.color('background'), { name: 'Background' }),
        text(t.copy('kicker'), 80, 110, 700, head(heading, 96, t.color('accent'))),
        text(t.copy('title'), 80, 330, 900, head(heading, 70, light)),
        spark(880, 120, 150, t.shade('accent', theme.star)),
        rect(80, 500, 445, 700, t.color('surface'), { name: 'Do card', cornerRadius: 12 }),
        icon('circle-check', 116, 536, 64, ink, { strokeWidth: 2.4 }),
        text(t.copy('doLabel'), 196, 542, 300, head(heading, 48, ink)),
        rect(116, 630, 373, 3, t.shade('surface', '#e5e7eb'), { name: 'Divider' }),
        bulletList(body, t.list('dos'), 116, 664, ink),
        rect(555, 500, 445, 700, t.color('secondary'), { name: 'Dont card', cornerRadius: 12 }),
        icon('circle-x', 591, 536, 64, light, { strokeWidth: 2.4 }),
        text(t.copy('dontLabel'), 671, 542, 300, head(heading, 48, light)),
        rect(591, 630, 373, 3, t.shade('text', 'rgba(255,255,255,0.35)'), { name: 'Divider' }),
        bulletList(body, t.list('donts'), 591, 664, light),
        spark(860, 1130, 190, t.shade('accent', theme.star)),
      ];
    },
  );

export interface ProblemCopy {
  problem: string;
  solution: string;
}

const bubble = (
  fontFamily: string,
  x: number,
  y: number,
  fill: string,
  color: string,
  side: 'left' | 'right',
  content: string,
) => [
  rect(x, y, 600, 200, fill, {
    name: 'Chat bubble',
    cornerRadius: 22,
    ...shadow(24, 10, 'rgba(0,0,0,0.18)'),
  }),
  poly(
    side === 'left'
      ? [
          [x + 50, y + 190],
          [x + 40, y + 260],
          [x + 130, y + 190],
        ]
      : [
          [x + 470, y + 190],
          [x + 560, y + 260],
          [x + 550, y + 190],
        ],
    fill,
    { name: 'Bubble tail' },
  ),
  text(content, x + 40, y + 46, 520, { ...head(fontFamily, 38, color), lineHeight: 1.25 }),
];

export const problemsSolution = (theme: ShiftTheme, copy: ProblemCopy): Template =>
  themed(
    W,
    POST.height,
    {
      colors: {
        background: { value: theme.paper, hint: 'Page and VS' },
        secondary: {
          value: theme.dark,
          hint: 'Your Problems, the VS tag, the problem bubble and the sparkles',
        },
        primary: { value: theme.brand, hint: 'Our Solution and the solution bubble' },
        text: { value: theme.onBrand, hint: 'Text in both chat bubbles' },
      },
      fonts: { heading: fontsOf(theme).heading },
      copy: {
        problemTitle: { label: 'Problem title', value: 'Your Problems' },
        versus: { label: 'Versus tag', value: 'VS' },
        solutionTitle: { label: 'Solution title', value: 'Our Solution' },
        problem: { label: 'Problem', value: copy.problem },
        solution: { label: 'Solution', value: copy.solution },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const heading = t.font('heading');
      const dark = t.color('secondary');
      return [
        rect(0, 0, W, POST.height, t.color('background'), { name: 'Background' }),
        spark(900, 50, 130, dark),
        text(t.copy('problemTitle'), 80, 150, 700, head(heading, 80, dark)),
        rect(700, 162, 96, 70, dark, { name: 'VS tag', cornerRadius: 6 }),
        text(t.copy('versus'), 700, 178, 96, {
          ...head(heading, 34, t.color('background')),
          align: 'center',
        }),
        text(t.copy('solutionTitle'), 340, 250, 700, {
          ...head(heading, 80, t.color('primary')),
          align: 'right',
        }),
        bubble(heading, 100, 500, dark, t.color('text'), 'left', t.copy('problem')),
        bubble(heading, 380, 860, t.color('primary'), t.color('text'), 'right', t.copy('solution')),
        spark(50, 1150, 150, dark),
      ];
    },
  );
