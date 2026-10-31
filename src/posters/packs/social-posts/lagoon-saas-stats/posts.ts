import {
  circle,
  dots,
  icon,
  path,
  rect,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { backdrop, copyText, disc, fontsOf, head, starStat, W } from './kit';
import { bars, results } from './posts-more';
import {
  backgroundHint,
  hasDeep,
  hasInk,
  POST,
  type PostTheme,
  paintOf,
  type Roles,
  roles,
  STORY,
} from './theme';

export interface StatsCopy {
  useCases: {
    title: string;
    subtitle: string;
    main: readonly [string, string];
    second: readonly [string, string];
    star: string;
    small: string;
    notes: readonly [string, string];
  };
  leaders: {
    kicker: string;
    title: string;
    points: readonly [
      readonly [string, string],
      readonly [string, string],
      readonly [string, string],
    ];
    footer: string;
  };
  profit: { title: string; value: string; body: string };
  bars: { value: string; title: string; source: string };
  results: { kicker: string; title: string; items: readonly [string, string, string] };
}

const useCasesColors = (theme: PostTheme): Roles => ({
  background: { value: theme.background, hint: backgroundHint(theme) },
  text: {
    value: theme.text,
    hint: hasInk(theme)
      ? 'Title and the two notes; its softer shade colors the subtitle'
      : 'Title, the two notes and the number on the big star; its softer shade colors the subtitle',
  },
  primary: {
    value: theme.brand,
    hint: hasDeep(theme)
      ? 'Small star and the short rule above the top note'
      : 'Stat discs, the small star and the short rule above the top note',
  },
  ...(hasDeep(theme) ? { secondary: { value: theme.deep, hint: 'Stat discs' } } : {}),
  surface: {
    value: theme.surface,
    hint:
      theme.brandText === theme.ink
        ? 'Big star and the numbers and labels in the discs'
        : 'Big star, the numbers and labels in the discs and the number on the small star',
  },
  ...(hasInk(theme)
    ? {
        accent: {
          value: theme.ink,
          hint:
            theme.brandText === theme.ink
              ? 'Numbers on the big and small stars'
              : 'Number on the big star',
        },
      }
    : {}),
});

const useCases = (theme: PostTheme, copy: StatsCopy['useCases']) =>
  themed(
    W,
    POST.height,
    {
      colors: useCasesColors(theme),
      fonts: fontsOf(theme),
      copy: {
        title: { label: 'Title', value: copy.title },
        subtitle: { label: 'Subtitle', value: copy.subtitle },
        stats: {
          label: 'Stat',
          value: [copy.main[0], copy.second[0], copy.star, copy.small],
        },
        labels: { label: 'Disc label', value: [copy.main[1], copy.second[1]] },
        notes: { label: 'Note', value: [...copy.notes] },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const paint = paintOf(t, theme);
      const fonts = { heading: t.font('heading'), body: t.font('body') };
      const [main = '', second = '', starValue = '', small = ''] = t.list('stats');
      const [mainLabel = '', secondLabel = ''] = t.list('labels');
      const [topNote = '', bottomNote = ''] = t.list('notes');
      const discColors = { fill: paint.deep, label: paint.surface };
      return [
        backdrop(paint.background, POST.height),
        text(t.copy('title'), 80, 100, 920, head(fonts, 66, paint.text)),
        text(t.copy('subtitle'), 80, 270, 900, copyText(fonts, 36, paint.muted)),
        disc(fonts, discColors, 320, 790, 200, main, mainLabel),
        disc(fonts, discColors, 700, 1080, 170, second, secondLabel),
        starStat(fonts, 560, 480, 380, starValue, { fill: paint.star, label: paint.ink }),
        starStat(fonts, 150, 950, 230, small, { fill: paint.brand, label: paint.brandText }),
        text(topNote, 830, 420, 220, copyText(fonts, 24, paint.text, 600)),
        rect(830, 400, 60, 4, paint.brand, { name: 'Note rule', cornerRadius: 2 }),
        text(bottomNote, 80, 1260, 480, copyText(fonts, 24, paint.text, 600)),
      ];
    },
  );

const ANCHORS = [
  { x: 300, y: 1150, top: 860 },
  { x: 530, y: 1110, top: 700 },
  { x: 770, y: 1030, top: 560 },
] as const;

const leaders = (theme: PostTheme, copy: StatsCopy['leaders']) =>
  themed(
    W,
    POST.height,
    {
      colors: roles({
        background: { value: theme.background, hint: backgroundHint(theme) },
        text: {
          value: theme.text,
          hint: 'Title, the first two stats, the dotted guides and the footer; its softer shade colors the kicker and stat labels',
        },
        primary: { value: theme.brand, hint: 'Top star, the trend line and the last stat' },
        surface: { value: theme.surface, hint: 'Trend points and the lower star' },
      }),
      fonts: fontsOf(theme),
      copy: {
        kicker: { label: 'Kicker', value: copy.kicker },
        title: { label: 'Title', value: copy.title },
        stats: { label: 'Stat', value: copy.points.map((point) => point[0]) },
        labels: { label: 'Stat label', value: copy.points.map((point) => point[1]) },
        footer: { label: 'Footer', value: copy.footer },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const paint = paintOf(t, theme);
      const fonts = { heading: t.font('heading'), body: t.font('body') };
      const labels = t.list('labels');
      return [
        backdrop(paint.background, POST.height),
        text(t.copy('kicker'), 80, 100, 700, copyText(fonts, 26, paint.muted, 600)),
        text(t.copy('title'), 80, 146, 920, head(fonts, 66, paint.text)),
        star(5, 860, 50, 130, paint.brand, { innerRatio: 0.48, name: 'Star' }),
        path(
          'M0 380 C120 370 220 300 300 300 C400 300 440 260 530 260 C630 260 680 180 770 180 C870 180 980 140 1080 110',
          0,
          850,
          W,
          400,
          t.shade('primary', 'rgba(0,0,0,0)'),
          { width: W, height: 400 },
          { stroke: paint.brand, strokeWidth: 8, name: 'Trend line' },
        ),
        t.list('stats').map((value, index) => {
          const anchor = ANCHORS[index] ?? ANCHORS[0];
          const labelEnd = anchor.top + 170;
          return [
            text(value, anchor.x - 120, anchor.top, 240, {
              ...head(fonts, 76, index === 2 ? paint.brand : paint.text),
              align: 'center',
              lineHeight: 1,
            }),
            text(labels[index] ?? '', anchor.x - 120, anchor.top + 88, 240, {
              ...copyText(fonts, 24, paint.muted, 500),
              align: 'center',
              lineHeight: 1.2,
            }),
            dots(
              anchor.x,
              labelEnd,
              1,
              Math.floor((anchor.y - labelEnd - 20) / 18),
              18,
              paint.text,
              3,
            ),
            circle(anchor.x, anchor.y, 14, paint.surface, { name: 'Point' }),
          ];
        }),
        star(5, 940, 820, 130, paint.star, { innerRatio: 0.48, name: 'Star' }),
        text(t.copy('footer'), 0, 1268, W, {
          ...copyText(fonts, 26, paint.text, 600),
          align: 'center',
        }),
      ];
    },
  );

const profit = (theme: PostTheme, copy: StatsCopy['profit']) =>
  themed(
    W,
    POST.height,
    {
      colors: roles({
        background: { value: theme.background, hint: backgroundHint(theme) },
        text: {
          value: theme.text,
          hint: 'Title and stat; its softer shade colors the idle progress segments and the body',
        },
        primary: {
          value: theme.brand,
          hint: 'Active progress segment, the arrow disc and the small star',
        },
        surface: { value: theme.surface, hint: 'Top star' },
        accent: { value: theme.brandText, hint: 'Arrow on the disc' },
      }),
      fonts: fontsOf(theme),
      copy: {
        title: { label: 'Title', value: copy.title },
        value: { label: 'Stat', value: copy.value },
        body: { label: 'Body', value: copy.body },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const paint = paintOf(t, theme);
      const fonts = { heading: t.font('heading'), body: t.font('body') };
      return [
        backdrop(paint.background, POST.height),
        [0, 1, 2, 3].map((index) =>
          rect(80 + index * 200, 110, 170, 12, index === 1 ? paint.brand : paint.muted, {
            name: 'Progress segment',
            cornerRadius: 6,
            opacity: index === 1 ? 1 : 0.5,
          }),
        ),
        star(5, 920, 50, 130, paint.star, { innerRatio: 0.48, name: 'Star' }),
        text(t.copy('title'), 80, 300, 920, { ...head(fonts, 100, paint.text), lineHeight: 1.05 }),
        text(t.copy('value'), 80, 560, 400, { ...head(fonts, 160, paint.text), lineHeight: 1 }),
        circle(470, 640, 62, paint.brand, { name: 'Arrow disc' }),
        icon('arrow-up-right', 434, 604, 72, t.color('accent'), { strokeWidth: 2.6 }),
        star(5, 60, 850, 64, paint.brand, { innerRatio: 0.48, name: 'Star' }),
        text(t.copy('body'), 80, 950, 860, copyText(fonts, 38, paint.muted)),
      ];
    },
  );

interface StatSet {
  useCases: Template;
  leaders: Template;
  profit: Template;
  bars: Template;
  results: Template;
  story: Template;
}

export const statTemplates = (theme: PostTheme, copy: StatsCopy): StatSet => ({
  useCases: useCases(theme, copy.useCases),
  leaders: leaders(theme, copy.leaders),
  profit: profit(theme, copy.profit),
  bars: bars(theme, copy.bars, POST.height),
  results: results(theme, copy.results),
  story: bars(theme, copy.bars, STORY.height),
});
