import { avatar, icon, rect, type ThemeSpec, themed } from '../../../kit';
import {
  AUTHOR,
  centered,
  DARK_PAGE,
  darkGlow,
  FONT,
  H,
  HANDLE,
  LIGHT_PAGE,
  lightWash,
  NEON,
  say,
  site,
  W,
} from './palette';

const SWIPE = { label: 'Swipe label', value: 'SWIPE' } as const;
const PAGES = { label: 'Page numbers', value: '01 02 03 04 05' } as const;
const CLEAR = 'rgba(0,0,0,0)';

interface SwipeRow {
  y: number;
  swipe: string;
  pages: string;
  color: string;
  clear: string;
  font: string;
}

const swipeRow = (row: SwipeRow) => [
  rect(330, row.y, 150, 50, row.clear, {
    name: 'Swipe chip',
    cornerRadius: 14,
    stroke: row.color,
    strokeWidth: 3,
  }),
  say(row.font)(row.swipe, 330, row.y + 12, 150, 22, row.color, 700, {
    align: 'center',
    letterSpacing: 3,
  }),
  icon('move-right', 500, row.y + 2, 46, row.color, { strokeWidth: 2 }),
  say(row.font)(row.pages, 570, row.y + 10, 260, 26, row.color, 500, { letterSpacing: 2 }),
];

const roadmapCoverSpec = {
  colors: {
    background: DARK_PAGE,
    primary: { value: NEON.pink, hint: 'Soft glow behind the swipe row' },
    text: {
      value: NEON.white,
      hint: 'Title, subtitle, swipe row, handle and the save for later line',
    },
  },
  fonts: { body: FONT },
  copy: {
    title: { label: 'Title', value: 'Your Roadmap' },
    subtitle: { label: 'Subtitle', value: 'to AI-Powered\nGrowth' },
    swipe: SWIPE,
    pages: PAGES,
    handle: HANDLE,
    save: { label: 'Save line', value: 'Save for later' },
  },
} as const satisfies ThemeSpec;

export const roadmapCover = themed(W, H, roadmapCoverSpec, (t) => {
  const write = say(t.font('body'));
  const center = centered(t.font('body'));
  return [
    darkGlow(t),
    center(t.copy('title'), 300, 84, t.color('text'), 700),
    center(t.copy('subtitle'), 400, 84, t.color('text'), 300, { lineHeight: 1.15 }),
    swipeRow({
      y: 680,
      swipe: t.copy('swipe'),
      pages: t.copy('pages'),
      color: t.color('text'),
      clear: t.shade('text', CLEAR),
      font: t.font('body'),
    }),
    write(t.copy('handle'), 80, 1220, 400, 32, t.color('text'), 600),
    write(t.copy('save'), 620, 1220, 300, 32, t.color('text'), 600, { align: 'right' }),
    icon('bookmark', 940, 1218, 40, t.color('text'), { strokeWidth: 2 }),
  ];
});

const roadmapStep = (title: string, body: string, flow: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: DARK_PAGE,
        primary: { value: NEON.pink, hint: 'Soft glow behind the frame' },
        secondary: {
          value: NEON.lilac,
          hint: 'Body paragraph; its translucent shade colors the frame border',
        },
        text: {
          value: NEON.white,
          hint: 'Title, flow line and swipe row; its faint tint fills the frame',
        },
      },
      fonts: { body: FONT },
      copy: {
        title: { label: 'Title', value: title },
        body: { label: 'Body', value: body },
        flow: { label: 'Flow line', value: flow },
        swipe: SWIPE,
        pages: PAGES,
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      return [
        darkGlow(t),
        centered(t.font('body'))(t.copy('title'), 170, 70, t.color('text'), 700, {
          lineHeight: 1.1,
        }),
        rect(110, 390, 860, 470, t.shade('text', 'rgba(255,255,255,0.05)'), {
          name: 'Frame',
          cornerRadius: 40,
          stroke: t.shade('secondary', 'rgba(230,217,255,0.35)'),
          strokeWidth: 3,
        }),
        write(t.copy('body'), 160, 450, 760, 40, t.color('secondary'), 400, {
          align: 'center',
          lineHeight: 1.4,
        }),
        write(t.copy('flow'), 160, 760, 760, 38, t.color('text'), 700, { align: 'center' }),
        swipeRow({
          y: 930,
          swipe: t.copy('swipe'),
          pages: t.copy('pages'),
          color: t.color('text'),
          clear: t.shade('text', CLEAR),
          font: t.font('body'),
        }),
      ];
    },
  );

export const roadmapAudit = roadmapStep(
  'Audit Your\nWorkflows',
  "You can't automate what you\nhaven't mapped. Find the\nrepetitive, low-value tasks\nthat drain your week.",
  'Spot > Map > Automate',
);

export const roadmapTeam = roadmapStep(
  'The Human +\nAI Team',
  'AI is your eager assistant,\nnot your replacement. Let it\ndraft the first version, then\nadd your taste and judgement.',
  'Brief > Draft > Polish',
);

export const roadmapScale = roadmapStep(
  'Scale Your\nOutput',
  'Consistency is the real edge.\nTurn one strong idea into a\npost, a thread, a newsletter\nand a short video script.',
  'Idea > Format > Reach',
);

interface AuthorRow {
  y: number;
  name: string;
  ink: string;
  clear: string;
  badge: string;
  font: string;
}

const authorRow = (row: AuthorRow) => [
  rect(80, row.y, 920, 3, row.ink, { name: 'Rule', opacity: 0.4 }),
  say(row.font)(row.name, 80, row.y + 34, 400, 32, row.ink, 700),
  icon('badge-check', 280, row.y + 36, 34, row.badge, { strokeWidth: 2.2 }),
  rect(860, row.y + 26, 140, 56, row.clear, {
    name: 'Arrow chip',
    cornerRadius: 28,
    stroke: row.ink,
    strokeWidth: 3,
  }),
  icon('move-right', 905, row.y + 31, 48, row.ink, { strokeWidth: 2 }),
];

const waysCoverSpec = {
  colors: {
    background: { value: NEON.white, hint: 'Page gradient and the photo ring' },
    primary: { value: NEON.pink, hint: 'Smart AI and the verified badge' },
    text: {
      value: NEON.ink,
      hint: 'Handle, the first two title lines, the arrow and the author row',
    },
  },
  fonts: { body: FONT },
  copy: {
    handle: HANDLE,
    title: { label: 'Title', value: '3 Ways to' },
    second: { label: 'Second line', value: 'Grow With' },
    highlight: { label: 'Highlight', value: 'Smart AI' },
    author: AUTHOR,
  },
} as const satisfies ThemeSpec;

export const waysCover = themed(W, H, waysCoverSpec, (t) => {
  const write = say(t.font('body'));
  return [
    lightWash(t),
    site(t.copy('handle'), t.font('body'), 80, 90, t.color('text'), 'left'),
    write(t.copy('title'), 80, 480, 800, 104, t.color('text'), 400, { lineHeight: 1.1 }),
    write(t.copy('second'), 80, 598, 800, 104, t.color('text'), 700, { lineHeight: 1.1 }),
    write(t.copy('highlight'), 80, 716, 800, 104, t.color('primary'), 700, { lineHeight: 1.1 }),
    avatar('woman-portrait-4', 900, 380, 80, t.color('background')),
    icon('navigation', 790, 280, 60, t.color('text'), { strokeWidth: 2 }),
    authorRow({
      y: 1130,
      name: t.copy('author'),
      ink: t.color('text'),
      clear: t.shade('text', CLEAR),
      badge: t.color('primary'),
      font: t.font('body'),
    }),
  ];
});

interface TipStyle {
  number: string;
  lead: string;
  accent: string;
  body: string;
  dark: boolean;
}

const tip = (style: TipStyle) =>
  themed(
    W,
    H,
    {
      colors: {
        background: style.dark ? DARK_PAGE : LIGHT_PAGE,
        primary: {
          value: NEON.pink,
          hint: style.dark
            ? 'Highlighted line, the verified badge and the soft glow'
            : 'Highlighted line and the verified badge',
        },
        secondary: { value: style.dark ? NEON.muted : '#4a3d5c', hint: 'Body paragraph' },
        text: {
          value: style.dark ? NEON.white : NEON.ink,
          hint: 'Lead line and the author row; its faint tint colors the big number',
        },
      },
      fonts: { body: FONT },
      copy: {
        number: { label: 'Number', value: style.number },
        lead: { label: 'Lead line', value: style.lead },
        accent: { label: 'Highlighted line', value: style.accent },
        body: { label: 'Body', value: style.body },
        author: AUTHOR,
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      return [
        style.dark ? darkGlow(t) : lightWash(t),
        write(
          t.copy('number'),
          380,
          40,
          680,
          440,
          t.shade('text', style.dark ? 'rgba(230,217,255,0.1)' : 'rgba(42,23,72,0.08)'),
          800,
          { align: 'right', lineHeight: 1 },
        ),
        write(t.copy('lead'), 80, 560, 900, 80, t.color('text'), 700, { lineHeight: 1.1 }),
        write(t.copy('accent'), 80, 650, 900, 80, t.color('primary'), 700, { lineHeight: 1.1 }),
        write(t.copy('body'), 80, 800, 880, 36, t.color('secondary'), 400, { lineHeight: 1.5 }),
        authorRow({
          y: 1130,
          name: t.copy('author'),
          ink: t.color('text'),
          clear: t.shade('text', CLEAR),
          badge: t.color('primary'),
          font: t.font('body'),
        }),
      ];
    },
  );

export const tipAgents = tip({
  number: '01',
  lead: 'Hand Off',
  accent: 'to Agents',
  body: 'Stop using AI as a simple chat box. Let\nsmall agents sort leads, tidy data and\nrun first-pass research for you.',
  dark: true,
});

export const tipPrompts = tip({
  number: '02',
  lead: 'Build a',
  accent: 'Prompt Library',
  body: 'Consistency needs structure. Save the\nprompts that work so every draft sounds\nlike your brand from the first line.',
  dark: false,
});

export const tipData = tip({
  number: '03',
  lead: 'Clean Up',
  accent: 'Your Data',
  body: 'AI is only as sharp as what you feed it.\nAudit your inputs before you expect\nclear, useful insights back.',
  dark: true,
});
