import {
  circle,
  icon,
  type Nodes,
  rect,
  rotateNodes,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { backdrop, copyText, fontsOf, head, W } from './kit';
import type { StatsCopy } from './posts';
import {
  backgroundHint,
  hasDeep,
  hasInk,
  type Paint,
  type Painter,
  POST,
  type PostTheme,
  paintOf,
  type Roles,
} from './theme';

const RATIOS = [0.34, 0.22, 0.42, 0.3] as const;

const barsColors = (theme: PostTheme): Roles => ({
  background: { value: theme.background, hint: backgroundHint(theme) },
  surface: { value: theme.surface, hint: 'Top star and the pale lower half of the bars' },
  text: {
    value: theme.text,
    hint: 'Big stat and headline; its softer shade colors the source line',
  },
  primary: {
    value: theme.brand,
    hint: hasDeep(theme) ? 'Highlighted third bar' : 'All four bars',
  },
  ...(hasDeep(theme) ? { secondary: { value: theme.deep, hint: 'The other three bars' } } : {}),
});

export const bars = (theme: PostTheme, copy: StatsCopy['bars'], height: number) =>
  themed(
    W,
    height,
    {
      colors: barsColors(theme),
      fonts: fontsOf(theme),
      copy: {
        value: { label: 'Stat', value: copy.value },
        title: { label: 'Headline', value: copy.title },
        source: { label: 'Source', value: copy.source },
      },
    } as const satisfies ThemeSpec,
    (t): Nodes[] => {
      const paint = paintOf(t, theme);
      const fonts = { heading: t.font('heading'), body: t.font('body') };
      return [
        backdrop(paint.background, height),
        star(5, 860, 70, 150, paint.star, { innerRatio: 0.48, name: 'Star' }),
        text(t.copy('value'), 80, 120, 700, { ...head(fonts, 160, paint.text), lineHeight: 1 }),
        text(t.copy('title'), 80, 310, 920, { ...head(fonts, 48, paint.text), lineHeight: 1.2 }),
        text(t.copy('source'), 80, 450, 920, copyText(fonts, 24, paint.muted, 500)),
        RATIOS.map((ratio, index) => {
          const barHeight = height * ratio;
          const x = 40 + index * 255;
          return [
            rect(x, height - barHeight, 235, barHeight, index === 2 ? paint.brand : paint.deep, {
              name: 'Bar',
              cornerRadius: 8,
            }),
            rect(x, height - barHeight * 0.4, 235, barHeight * 0.4, paint.surface, {
              name: 'Bar base',
              opacity: index === 2 ? 0 : 0.92,
            }),
          ];
        }),
      ];
    },
  );

const SLOTS = [
  { x: 140, y: 440, rotation: -4 },
  { x: 250, y: 680, rotation: 3 },
  { x: 150, y: 920, rotation: -3 },
] as const;

const resultsColors = (theme: PostTheme): Roles => ({
  background: { value: theme.background, hint: backgroundHint(theme) },
  text: {
    value: theme.text,
    hint: hasInk(theme)
      ? 'Title; its softer shade colors the kicker'
      : 'Title and the card text; its softer shade colors the kicker',
  },
  primary: {
    value: theme.brand,
    hint: hasDeep(theme) ? 'Star on the left' : 'Star on the left and the card icon circles',
  },
  ...(hasDeep(theme) && !hasInk(theme)
    ? { secondary: { value: theme.deep, hint: 'Card icon circles' } }
    : {}),
  surface: { value: theme.surface, hint: 'Result cards, their arrows and the lower star' },
  ...(hasInk(theme)
    ? {
        accent: {
          value: theme.ink,
          hint: hasDeep(theme)
            ? 'Card text; its teal shade colors the card icon circles'
            : 'Card text',
        },
      }
    : {}),
});

const iconFill = (t: Painter, theme: PostTheme, paint: Paint) =>
  hasDeep(theme) && hasInk(theme) ? t.shade('accent', theme.deep) : paint.deep;

export const results = (theme: PostTheme, copy: StatsCopy['results']) =>
  themed(
    W,
    POST.height,
    {
      colors: resultsColors(theme),
      fonts: fontsOf(theme),
      copy: {
        kicker: { label: 'Kicker', value: copy.kicker },
        title: { label: 'Title', value: copy.title },
        items: { label: 'Result', value: [...copy.items] },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const paint = paintOf(t, theme);
      const fonts = { heading: t.font('heading'), body: t.font('body') };
      const icons = iconFill(t, theme, paint);
      return [
        backdrop(paint.background, POST.height),
        text(t.copy('kicker'), 80, 100, 700, copyText(fonts, 26, paint.muted, 600)),
        text(t.copy('title'), 80, 146, 920, head(fonts, 66, paint.text)),
        star(5, 20, 560, 110, paint.brand, { innerRatio: 0.48, name: 'Star' }),
        t.list('items').map((item, index) => {
          const slot = SLOTS[index] ?? SLOTS[0];
          return rotateNodes(slot.rotation, slot.x + 340, slot.y + 90, [
            rect(slot.x, slot.y, 680, 180, paint.surface, {
              name: 'Result card',
              cornerRadius: 16,
              ...shadow(30, 14, 'rgba(0,0,0,0.3)'),
            }),
            circle(slot.x + 90, slot.y + 90, 50, icons, { name: 'Result icon' }),
            icon('arrow-up-right', slot.x + 64, slot.y + 64, 52, paint.surface, {
              strokeWidth: 2.6,
            }),
            text(item, slot.x + 170, slot.y + 42, 480, {
              ...copyText(fonts, 36, paint.ink, 500),
              lineHeight: 1.25,
            }),
          ]);
        }),
        star(5, 880, 1080, 150, paint.star, { innerRatio: 0.48, name: 'Star' }),
      ];
    },
  );
