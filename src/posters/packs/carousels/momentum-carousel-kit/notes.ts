import {
  avatar,
  checklist,
  circle,
  icon,
  type Nodes,
  POST_SIZE,
  rect,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';
import { textWidth } from './text-width';

export interface NotesTheme {
  paper: string;
  ink: string;
  muted: string;
  accent: string;
  highlight: string;
  card: string;
  cardInk: string;
  font: string;
}

const { width: W, height: H } = POST_SIZE;

const fonts = (theme: NotesTheme) => ({
  heading: { label: 'Heading font', value: theme.font },
  body: { label: 'Body font', value: theme.font },
});

const frameColors = (theme: NotesTheme, inkHint: string) => ({
  background: { value: theme.paper, hint: 'Notes page' },
  accent: {
    value: theme.accent,
    hint: 'Back arrow, page label, menu button and the toolbar icons',
  },
  text: { value: theme.ink, hint: inkHint },
});

type FrameSpec = {
  colors: ReturnType<typeof frameColors>;
  fonts: ReturnType<typeof fonts>;
  copy: { page: { label: string; value: string }; title: { label: string; value: string } };
};

const frameCopy = (page: string, title: string) => ({
  page: { label: 'Page label', value: page },
  title: { label: 'Title', value: title },
});

const notesFrame = <S extends FrameSpec>(t: Theme<S>): Nodes[] => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  icon('arrow-left', 70, 92, 48, t.color('accent'), { strokeWidth: 2.5 }),
  text(t.copy('page'), 130, 94, 600, {
    fontFamily: t.font('body'),
    fontSize: 40,
    fontWeight: 500,
    fill: t.color('accent'),
  }),
  circle(976, 116, 34, t.shade('accent', 'rgba(0,0,0,0)'), {
    stroke: t.color('accent'),
    strokeWidth: 4,
  }),
  [0, 1, 2].map((index) => circle(960 + index * 16, 116, 4, t.color('accent'))),
  text(t.copy('title'), 90, 270, 900, {
    fontFamily: t.font('heading'),
    fontSize: 72,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
  (['list-checks', 'camera', 'pencil', 'file-text'] as const).map((name, index) =>
    icon(name, [80, 330, 720, 950][index] ?? 80, 1210, 54, t.color('accent'), { strokeWidth: 2 }),
  ),
];

export const notesCover = (
  theme: NotesTheme,
  copy: {
    name: string;
    handle: string;
    photo: PosterPhotoName;
    title: string;
    hook: string;
    swipe: string;
    count: string;
  },
) => {
  const spec = {
    colors: {
      background: { value: theme.paper, hint: 'Notes page' },
      surface: { value: theme.card, hint: 'Swipe card at the bottom' },
      accent: {
        value: theme.accent,
        hint: 'Verified badge and folder icon; its light shade is the marker behind the hook',
      },
      text: {
        value: theme.ink,
        hint: 'Name, title, hook and swipe card text; its shades color the handle and the card shadow',
      },
    },
    fonts: fonts(theme),
    copy: {
      name: { label: 'Name', value: copy.name },
      handle: { label: 'Handle', value: copy.handle },
      title: { label: 'Title', value: copy.title },
      hook: { label: 'Hook', value: copy.hook },
      swipe: { label: 'Swipe label', value: copy.swipe },
      count: { label: 'Note count', value: copy.count },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => {
    const name = t.copy('name');
    const hook = t.copy('hook');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      avatar(copy.photo, 135, 150, 52),
      text(name, 210, 112, 600, {
        fontFamily: t.font('body'),
        fontSize: 38,
        fontWeight: 700,
        fill: t.color('text'),
      }),
      icon('badge-check', 224 + textWidth(name, 38), 114, 40, t.color('accent'), {
        strokeWidth: 2.25,
      }),
      text(t.copy('handle'), 210, 160, 600, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 400,
        fill: t.shade('text', theme.muted),
      }),
      text(t.copy('title'), 80, 460, 920, {
        fontFamily: t.font('heading'),
        fontSize: 100,
        fontWeight: 800,
        fill: t.color('text'),
        lineHeight: 1.12,
      }),
      rect(74, 732, textWidth(hook, 40) + 24, 64, t.shade('accent', theme.highlight), {
        name: 'Highlight',
        cornerRadius: 6,
      }),
      text(hook, 86, 740, 900, {
        fontFamily: t.font('body'),
        fontSize: 40,
        fontWeight: 500,
        fill: t.color('text'),
      }),
      rect(80, 1060, 920, 116, t.color('surface'), {
        name: 'Swipe card',
        cornerRadius: 22,
        ...shadow(24, 8, t.shade('text', 'rgba(15,23,42,0.12)')),
      }),
      icon('folder', 116, 1088, 58, t.color('accent'), { strokeWidth: 2 }),
      text(t.copy('swipe'), 200, 1094, 600, {
        fontFamily: t.font('body'),
        fontSize: 40,
        fontWeight: 500,
        fill: t.shade('text', theme.cardInk),
      }),
      text(t.copy('count'), 860, 1094, 60, {
        fontFamily: t.font('body'),
        fontSize: 40,
        fontWeight: 600,
        fill: t.shade('text', theme.cardInk),
        align: 'right',
      }),
      icon('chevron-right', 926, 1094, 46, t.shade('text', theme.cardInk), { strokeWidth: 2.5 }),
    ];
  });
};

export const notesChecklist = (
  theme: NotesTheme,
  copy: { page: string; title: string; items: readonly string[] },
) => {
  const spec = {
    colors: {
      ...frameColors(theme, 'Title and checklist items'),
      accent: {
        value: theme.accent,
        hint: 'Back arrow, page label, menu button, check icons and the toolbar icons',
      },
    },
    fonts: fonts(theme),
    copy: { ...frameCopy(copy.page, copy.title), items: { label: 'Item', value: copy.items } },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    notesFrame(t),
    checklist(t.list('items'), 92, 520, 900, {
      color: t.color('text'),
      iconColor: t.color('accent'),
      fontSize: 48,
      gap: 104,
      fontFamily: t.font('body'),
    }),
  ]);
};

export const notesSayTry = (
  theme: NotesTheme,
  copy: { page: string; title: string; pairs: readonly { label: string; quote: string }[] },
) => {
  const spec = {
    colors: frameColors(theme, 'Title and the Skip and Try labels; its shade colors the quotes'),
    fonts: fonts(theme),
    copy: {
      ...frameCopy(copy.page, copy.title),
      labels: { label: 'Label', value: copy.pairs.map((pair) => pair.label) },
      quotes: { label: 'Quote', value: copy.pairs.map((pair) => pair.quote) },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => {
    const quotes = t.list('quotes');
    return [
      notesFrame(t),
      t.list('labels').map((label, index) => [
        text(label, 90, 520 + index * 210, 900, {
          fontFamily: t.font('body'),
          fontSize: 50,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        text(quotes[index] ?? '', 90, 590 + index * 210, 900, {
          fontFamily: t.font('body'),
          fontSize: 42,
          fontWeight: 400,
          fill: t.shade('text', theme.muted),
        }),
      ]),
    ];
  });
};

export const notesRows = (
  theme: NotesTheme,
  copy: { page: string; title: string; rows: readonly { when: string; action: string }[] },
) => {
  const spec = {
    colors: {
      ...frameColors(theme, 'Title and the when column; its shade colors the actions'),
      accent: {
        value: theme.accent,
        hint: 'Back arrow, page label, menu button, row arrows and the toolbar icons',
      },
    },
    fonts: fonts(theme),
    copy: {
      ...frameCopy(copy.page, copy.title),
      whens: { label: 'When', value: copy.rows.map((row) => row.when) },
      actions: { label: 'Action', value: copy.rows.map((row) => row.action) },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => {
    const actions = t.list('actions');
    return [
      notesFrame(t),
      t.list('whens').map((when, index) => [
        text(when, 90, 530 + index * 120, 380, {
          fontFamily: t.font('body'),
          fontSize: 42,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        icon('chevrons-right', 420, 530 + index * 120, 50, t.color('accent'), {
          strokeWidth: 2.5,
        }),
        text(actions[index] ?? '', 500, 530 + index * 120, 500, {
          fontFamily: t.font('body'),
          fontSize: 42,
          fontWeight: 400,
          fill: t.shade('text', theme.muted),
        }),
      ]),
    ];
  });
};

export const notesBody = (
  theme: NotesTheme,
  copy: { page: string; title: string; body: string },
) => {
  const spec = {
    colors: frameColors(theme, 'Title; its shade colors the body paragraph'),
    fonts: fonts(theme),
    copy: { ...frameCopy(copy.page, copy.title), body: { label: 'Body', value: copy.body } },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    notesFrame(t),
    text(t.copy('body'), 90, 520, 900, {
      fontFamily: t.font('body'),
      fontSize: 42,
      fontWeight: 400,
      fill: t.shade('text', theme.muted),
      lineHeight: 1.45,
    }),
  ]);
};
