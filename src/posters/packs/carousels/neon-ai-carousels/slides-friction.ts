import type { DesignIconName } from '@/design';
import { avatar, icon, rect, type ThemeSpec, themed } from '../../../kit';
import {
  AUTHOR,
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

const gridLines = (color: string) => [
  Array.from({ length: 12 }, (_, index) =>
    rect(40 + index * 92, 0, 2, H, color, { name: 'Grid line' }),
  ),
  Array.from({ length: 15 }, (_, index) =>
    rect(0, 30 + index * 92, W, 2, color, { name: 'Grid line' }),
  ),
];

interface FramedBox {
  y: number;
  height: number;
  tag: string;
  fill: string;
  border: string;
  chip: string;
  ink: string;
  font: string;
}

const framedBox = (box: FramedBox) => [
  rect(100, box.y, 880, box.height, box.fill, {
    name: 'Frame',
    stroke: box.border,
    strokeWidth: 3,
  }),
  rect(130, box.y - 26, 26 + box.tag.length * 17, 52, box.chip, { name: 'Tag' }),
  say(box.font)(box.tag, 143, box.y - 17, box.tag.length * 18, 28, box.ink, 700),
];

const swipeFooter = (label: string, color: string, font: string) => [
  say(font)(label, 100, 1200, 500, 32, color, 500),
  icon('move-right', 880, 1180, 80, color, { strokeWidth: 1.8 }),
];

const SWIPE = { label: 'Swipe line', value: 'Swipe to continue' } as const;
const MONO = { label: 'Tag font', value: 'Space Mono' } as const;
const FRAME_FILL = 'rgba(7,4,13,0.86)';
const GRID = 'rgba(199,186,217,0.1)';

const automationCoverSpec = {
  colors: {
    background: {
      value: NEON.night,
      hint: 'Page gradient, the dark frame and the tag text',
    },
    primary: { value: NEON.pink, hint: 'Soft glow behind the frame' },
    secondary: { value: NEON.lilac, hint: 'Frame border and the faint grid lines' },
    text: { value: NEON.white, hint: 'Handle, tag, Automation and the swipe line' },
  },
  fonts: { body: FONT, mono: MONO },
  copy: {
    handle: HANDLE,
    tag: { label: 'Tag', value: '#BuildSmarter' },
    title: { label: 'Title', value: 'Automation' },
    swipe: SWIPE,
  },
} as const satisfies ThemeSpec;

export const automationCover = themed(W, H, automationCoverSpec, (t) => [
  darkGlow(t),
  gridLines(t.shade('secondary', GRID)),
  site(t.copy('handle'), t.font('body'), 580, 90, t.color('text'), 'right'),
  framedBox({
    y: 520,
    height: 230,
    tag: t.copy('tag'),
    fill: t.shade('background', FRAME_FILL),
    border: t.color('secondary'),
    chip: t.color('text'),
    ink: t.shade('background', NEON.ink),
    font: t.font('mono'),
  }),
  say(t.font('body'))(t.copy('title'), 100, 570, 880, 118, t.color('text'), 800, {
    align: 'center',
    lineHeight: 1.1,
  }),
  swipeFooter(t.copy('swipe'), t.color('text'), t.font('body')),
]);

const automationStep = (tag: string, title: string, body: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: NEON.night,
          hint: 'Page gradient, the dark frame and the tag text',
        },
        primary: { value: NEON.pink, hint: 'Soft glow behind the frame' },
        secondary: {
          value: NEON.lilac,
          hint: 'Frame border and the faint grid lines; its muted shade colors the body',
        },
        text: { value: NEON.white, hint: 'Handle, tag, title and the swipe line' },
      },
      fonts: { body: FONT, mono: MONO },
      copy: {
        handle: HANDLE,
        tag: { label: 'Tag', value: tag },
        title: { label: 'Title', value: title },
        body: { label: 'Body', value: body },
        swipe: SWIPE,
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      return [
        darkGlow(t),
        gridLines(t.shade('secondary', GRID)),
        site(t.copy('handle'), t.font('body'), 580, 90, t.color('text'), 'right'),
        framedBox({
          y: 330,
          height: 600,
          tag: t.copy('tag'),
          fill: t.shade('background', FRAME_FILL),
          border: t.color('secondary'),
          chip: t.color('text'),
          ink: t.shade('background', NEON.ink),
          font: t.font('mono'),
        }),
        write(t.copy('title'), 150, 400, 800, 70, t.color('text'), 800, { lineHeight: 1.1 }),
        write(t.copy('body'), 150, 530, 780, 38, t.shade('secondary', NEON.muted), 400, {
          lineHeight: 1.5,
        }),
        swipeFooter(t.copy('swipe'), t.color('text'), t.font('body')),
      ];
    },
  );

export const automationFriction = automationStep(
  '#Discovery',
  'Find the Friction',
  'Before writing a line of code,\nwalk through the human steps.\nThe moments people sigh are\nwhere automation helps most.',
);

export const automationFramework = automationStep(
  '#Framework',
  'Pick a Framework',
  'Balance machine speed with\nhuman judgement. A simple\nthree-step model keeps every\nworkflow calm and clear.',
);

export const automationQuiet = automationStep(
  '#Systems',
  'Quiet Systems',
  'The best automations run in\nthe background. Nobody should\ntrigger a small task that the\nsystem could have predicted.',
);

const smoothCoverSpec = {
  colors: {
    background: LIGHT_PAGE,
    primary: {
      value: NEON.pink,
      hint: 'Without, the verified badge and the big faint arrow',
    },
    text: {
      value: NEON.ink,
      hint: 'Author name, Automate, Friction and the swipe line; its softer shade colors the username',
    },
  },
  fonts: { body: FONT },
  copy: {
    author: AUTHOR,
    username: { label: 'Username', value: '@mayabuilds' },
    title: { label: 'Title', value: 'Automate' },
    highlight: { label: 'Highlight', value: 'Without' },
    end: { label: 'Title end', value: 'Friction' },
    swipe: { label: 'Swipe line', value: 'Swipe to read' },
  },
} as const satisfies ThemeSpec;

export const smoothCover = themed(W, H, smoothCoverSpec, (t) => {
  const write = say(t.font('body'));
  return [
    lightWash(t),
    avatar('woman-portrait-4', 140, 160, 56),
    write(t.copy('author'), 220, 118, 400, 34, t.color('text'), 700),
    icon('badge-check', 420, 120, 34, t.color('primary'), { strokeWidth: 2.2 }),
    write(t.copy('username'), 220, 164, 400, 28, t.shade('text', '#6b5a80'), 400),
    write(t.copy('title'), 80, 460, 900, 110, t.color('text'), 400, { lineHeight: 1.05 }),
    write(t.copy('highlight'), 80, 580, 900, 110, t.color('primary'), 800, { lineHeight: 1.05 }),
    write(t.copy('end'), 80, 700, 900, 110, t.color('text'), 400, { lineHeight: 1.05 }),
    icon('corner-down-right', 560, 860, 440, t.shade('primary', 'rgba(255,95,162,0.28)'), {
      strokeWidth: 1.4,
    }),
    write(t.copy('swipe'), 80, 1220, 400, 32, t.color('text'), 500),
  ];
});

interface SmoothStyle {
  lead: string;
  accent: string;
  body: string;
  symbol: DesignIconName;
  dark: boolean;
}

const smoothStep = (style: SmoothStyle) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: style.dark ? NEON.night : NEON.mist, hint: 'Slide panel' },
        surface: {
          value: style.dark ? NEON.mist : NEON.night,
          hint: 'Edge of the next slide peeking out on the right',
        },
        primary: { value: NEON.pink, hint: 'Highlighted line' },
        secondary: {
          value: style.dark ? NEON.lilac : '#3b2d4f',
          hint: 'Body paragraph; its faint tint colors the big background icon',
        },
        text: { value: style.dark ? NEON.white : NEON.ink, hint: 'Lead line' },
      },
      fonts: { body: FONT },
      copy: {
        lead: { label: 'Lead line', value: style.lead },
        accent: { label: 'Highlighted line', value: style.accent },
        body: { label: 'Body', value: style.body },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      return [
        rect(0, 0, W, H, t.color('surface'), { name: 'Next slide' }),
        rect(0, 0, 1000, H, t.color('background'), { name: 'Panel', cornerRadius: 70 }),
        rect(0, 0, 120, H, t.color('background'), { name: 'Panel edge' }),
        icon(
          style.symbol,
          300,
          860,
          420,
          t.shade('secondary', style.dark ? 'rgba(230,217,255,0.14)' : 'rgba(42,23,72,0.1)'),
          { strokeWidth: 1.2 },
        ),
        write(t.copy('lead'), 80, 220, 880, 84, t.color('text'), 800, { lineHeight: 1.05 }),
        write(t.copy('accent'), 80, 310, 880, 84, t.color('primary'), 800, { lineHeight: 1.05 }),
        write(t.copy('body'), 80, 470, 860, 44, t.color('secondary'), 400, { lineHeight: 1.45 }),
      ];
    },
  );

export const smoothFeedback = smoothStep({
  lead: 'Live',
  accent: 'Feedback',
  body: 'Treat AI as a creative partner.\nRefine the output in a real\nconversation and you get a\nresult no generic prompt can\nmatch.',
  symbol: 'mic',
  dark: true,
});

export const smoothContext = smoothStep({
  lead: 'Rich',
  accent: 'Context',
  body: 'Great output needs great input.\nBefore the first word, define\nthe persona, the task and the\nlimits you care about.',
  symbol: 'rocket',
  dark: false,
});

export const smoothReview = smoothStep({
  lead: 'Built-in',
  accent: 'Review',
  body: 'Use clear separators to split\nyour instructions from the\ndata, then ask the AI to check\nits own reasoning.',
  symbol: 'shield-check',
  dark: true,
});
