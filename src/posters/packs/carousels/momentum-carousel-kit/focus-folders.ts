import { linear } from '@/design';
import {
  browser,
  checklist,
  circle,
  icon,
  type Nodes,
  POST_SIZE,
  paint,
  path,
  rect,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { textWidth } from './text-width';

const { width: W, height: H } = POST_SIZE;
const FONT = 'Inter';
const INK = '#0f172a';

const FOLDER_BACK =
  'M12 0 H74 Q82 0 88 8 L98 22 H188 Q200 22 200 34 V148 Q200 160 188 160 H12 Q0 160 0 148 V12 Q0 0 12 0 Z';
const FOLDER_FRONT =
  'M0 52 Q0 40 12 40 H188 Q200 40 200 52 V148 Q200 160 188 160 H12 Q0 160 0 148 Z';

type Role = { value: string; hint: string };
type FolderSpec = ThemeSpec & { colors: { background: Role; primary: Role } };

const folder = <S extends FolderSpec>(
  t: Theme<S>,
  x: number,
  y: number,
  width: number,
  rotation = 0,
) => {
  const height = width * 0.8;
  const view = { width: 200, height: 160 };
  return [
    path(
      FOLDER_BACK,
      x,
      y,
      width,
      height,
      linear(180, t.shade('primary', '#fb923c'), t.shade('primary', '#ea580c')),
      view,
      {
        rotation,
        ...shadow(width * 0.08, width * 0.03, t.shade('primary', 'rgba(154,52,18,0.25)')),
      },
    ),
    path(
      FOLDER_FRONT,
      x,
      y,
      width,
      height,
      linear(180, t.shade('primary', '#fdba74'), t.shade('primary', '#f97316')),
      view,
      { rotation },
    ),
  ];
};

const scatter = <S extends FolderSpec>(t: Theme<S>) => [
  folder(t, 40, 150, 170, -14),
  folder(t, 860, 250, 170, 12),
  folder(t, 50, 1090, 170, 10),
  folder(t, 860, 1110, 170, -12),
];

const peach = <S extends FolderSpec>(t: Theme<S>) =>
  linear(180, t.color('background'), t.shade('background', '#fed7aa'));

const MONO = { label: 'Mono font', value: 'Space Mono' } as const;

const foldersCoverSpec = {
  colors: {
    background: { value: '#fff7ed', hint: 'Peach page gradient' },
    primary: {
      value: '#f97316',
      hint: 'Orange folders and their shadows; its dark shade colors swipe_left',
    },
    text: { value: '#ffffff', hint: 'Title on the big folder' },
    accent: { value: INK, hint: 'Swipe arrow' },
  },
  fonts: { mono: MONO },
  copy: {
    title: { label: 'Title', value: '3 STEPS\nTO MOMENTUM' },
    swipe: { label: 'Swipe label', value: 'swipe_left' },
  },
} as const satisfies ThemeSpec;

export const foldersCover = themed(W, H, foldersCoverSpec, (t) => [
  rect(0, 0, W, H, peach(t), { name: 'Background' }),
  scatter(t),
  folder(t, 290, 420, 500),
  text(t.copy('title'), 290, 600, 500, {
    fontFamily: t.font('mono'),
    fontSize: 50,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1.2,
  }),
  text(t.copy('swipe'), 0, 860, W, {
    fontFamily: t.font('mono'),
    fontSize: 34,
    fontWeight: 400,
    fill: t.shade('primary', '#7c2d12'),
    align: 'center',
  }),
  icon('navigation', 700, 860, 100, t.color('accent'), { rotation: -90, strokeWidth: 2 }),
]);

type SlideBody =
  | { kind: 'toggles'; items: readonly { label: string; on: boolean }[] }
  | { kind: 'slots'; items: readonly { time: string; task: string }[] }
  | { kind: 'checklist'; items: readonly string[] };

const bodyCopy = (body: SlideBody) => {
  if (body.kind === 'toggles') {
    return { items: { label: 'Setting', value: body.items.map((item) => item.label) } };
  }
  if (body.kind === 'slots') {
    return {
      times: { label: 'Time', value: body.items.map((item) => item.time) },
      items: {
        label: 'Task',
        value: body.items.filter((item) => item.task !== '').map((item) => item.task),
      },
    };
  }
  return { items: { label: 'Item', value: body.items } };
};

const BODY_HINTS = {
  toggles: {
    primary:
      'Orange folders and the word box outline; its shades color the word box, highlighted word and website',
    text: 'Title and settings; its shades color the switched off toggles and the window shadow',
    secondary: 'Switched on toggles',
  },
  slots: {
    primary:
      'Orange folders, the word box outline and task edges; its shades color the word box, highlighted word, website, task fills and the first task',
    text: 'Title, times and tasks; its shades color the empty slot line and the window shadow',
    secondary: undefined,
  },
  checklist: {
    primary:
      'Orange folders, the word box outline and the check marks; its shades color the word box, highlighted word and website',
    text: 'Title and checklist; its shade tints the window shadow',
    secondary: undefined,
  },
} as const;

const slideSpec = (title: string, word: string, body: SlideBody) => {
  const hints = BODY_HINTS[body.kind];
  return {
    colors: {
      background: {
        value: '#fff7ed',
        hint: 'Peach page gradient; its shade colors the browser bar',
      },
      surface: {
        value: '#ffffff',
        hint: body.kind === 'toggles' ? 'Browser window and toggle knobs' : 'Browser window',
      },
      primary: { value: '#ea580c', hint: hints.primary },
      accent: { value: '#febc2e', hint: 'Browser window buttons (with its red and green shades)' },
      text: { value: INK, hint: hints.text },
      ...(hints.secondary === undefined
        ? {}
        : { secondary: { value: '#22c55e', hint: hints.secondary } }),
    },
    fonts: { body: { label: 'Body font', value: FONT } },
    copy: {
      title: { label: 'Title', value: title },
      word: { label: 'Highlighted word', value: word },
      website: { label: 'Website', value: 'brightdesk.co' },
      ...bodyCopy(body),
    },
  } satisfies ThemeSpec;
};

type SlideTheme = Theme<ReturnType<typeof slideSpec>>;

const toggles = (t: SlideTheme, items: readonly { label: string; on: boolean }[]) => {
  const labels = t.list('items');
  return items.map((item, index) => {
    const y = 180 + index * 82;
    return [
      rect(60, y, 92, 50, item.on ? t.color('secondary') : t.shade('text', '#cbd5e1'), {
        name: 'Toggle',
        cornerRadius: 25,
      }),
      circle(item.on ? 127 : 85, y + 25, 20, t.color('surface')),
      text(labels[index] ?? '', 180, y + 4, 560, {
        fontFamily: t.font('body'),
        fontSize: 38,
        fontWeight: 400,
        fill: t.color('text'),
      }),
    ];
  });
};

const slots = (t: SlideTheme, items: readonly { time: string; task: string }[]) => {
  const times = t.list('times');
  const tasks = t.list('items');
  let taskIndex = 0;
  return items.map((item, index) => {
    const y = 190 + index * 130;
    const filled = item.task !== '';
    const task = filled ? (tasks[taskIndex] ?? '') : '';
    taskIndex += filled ? 1 : 0;
    return [
      text(times[index] ?? '', 50, y + 20, 140, {
        fontFamily: t.font('body'),
        fontSize: 36,
        fontWeight: 700,
        fill: t.color('text'),
      }),
      filled
        ? [
            rect(200, y, 600, 96, t.shade('primary', index === 0 ? '#fef3c7' : '#ffedd5'), {
              name: 'Slot',
              cornerRadius: 8,
            }),
            rect(200, y, 10, 96, index === 0 ? t.shade('primary', '#d97706') : t.color('primary'), {
              name: 'Slot edge',
            }),
            text(task, 236, y + 26, 540, {
              fontFamily: t.font('body'),
              fontSize: 36,
              fontWeight: 600,
              fill: t.color('text'),
            }),
          ]
        : rect(200, y + 44, 580, 4, t.shade('text', '#cbd5e1'), { name: 'Empty slot' }),
    ];
  });
};

const slideBody = (t: SlideTheme, body: SlideBody): Nodes[] => {
  if (body.kind === 'toggles') {
    return toggles(t, body.items);
  }
  if (body.kind === 'slots') {
    return slots(t, body.items);
  }
  return [
    checklist(t.list('items'), 60, 180, 700, {
      color: t.color('text'),
      iconColor: t.color('primary'),
      icon: 'check',
      fontSize: 38,
      gap: 76,
      fontFamily: t.font('body'),
    }),
  ];
};

const browserSlide = (title: string, word: string, body: SlideBody) =>
  themed(W, H, slideSpec(title, word, body), (t) => {
    const highlighted = t.copy('word');
    const frame = browser(110, 340, 860, 660, {
      fill: t.color('surface'),
      bar: t.shade('background', '#ffedd5'),
      dots: [t.shade('accent', '#ff5f57'), t.color('accent'), t.shade('accent', '#28c840')],
      content: [
        text(t.copy('title'), 0, 50, 420, {
          fontFamily: t.font('body'),
          fontSize: 58,
          fontWeight: 600,
          fill: t.color('text'),
          align: 'right',
        }),
        rect(436, 44, textWidth(highlighted, 58) + 24, 80, t.shade('primary', '#fed7aa'), {
          name: 'Highlight',
          cornerRadius: 8,
          stroke: t.color('primary'),
          strokeWidth: 3,
        }),
        text(highlighted, 448, 50, 400, {
          fontFamily: t.font('body'),
          fontSize: 58,
          fontWeight: 700,
          fill: t.shade('primary', '#9a3412'),
        }),
        slideBody(t, body),
      ],
    });
    return [
      rect(0, 0, W, H, peach(t), { name: 'Background' }),
      scatter(t),
      paint([frame], { 'rgba(15,23,42,0.18)': t.shade('text', 'rgba(15,23,42,0.18)') }),
      text(t.copy('website'), 230, 352, 400, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 500,
        fill: t.shade('primary', '#7c2d12'),
      }),
    ];
  });

export const FOLDER_STEPS = [
  browserSlide('Keep What', 'Works', {
    kind: 'toggles',
    items: [
      { label: 'Test fresh hooks', on: true },
      { label: 'Copy every trend', on: false },
      { label: 'Track the numbers', on: true },
      { label: 'Guess at timing', on: false },
      { label: 'Repeat the winners', on: true },
    ],
  }),
  browserSlide('Plan Your', 'Week', {
    kind: 'slots',
    items: [
      { time: '9 AM', task: 'Deep work block' },
      { time: '11 AM', task: '' },
      { time: '1 PM', task: 'Write the newsletter' },
    ],
  }),
  browserSlide('Set Your', 'Focus', {
    kind: 'checklist',
    items: ['One clear goal', 'A short offer', 'A simple funnel', 'Real proof', 'A next step'],
  }),
] as const;
