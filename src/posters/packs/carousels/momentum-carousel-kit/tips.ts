import { type DesignIconName, type Fill, linear } from '@/design';
import {
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

const { width: W, height: H } = POST_SIZE;
const FONT = 'Inter';
const INK = '#0f172a';
const FROST = 'rgba(255,255,255,0.8)';
const FONTS = {
  heading: { label: 'Heading font', value: FONT },
  body: { label: 'Body font', value: FONT },
} as const;

type Role = { value: string; hint: string };

type DawnSpec = ThemeSpec & {
  colors: { background: Role; surface: Role; primary: Role; text: Role };
  fonts: typeof FONTS;
};

const dawn = <S extends DawnSpec>(t: Theme<S>) =>
  linear(
    160,
    t.shade('background', '#134e4a'),
    t.color('background'),
    t.shade('background', '#a3e635'),
  );

interface NoticeLook {
  frost: string;
  glyph: string;
  appIcon: Fill;
  title: string;
  body: string;
  shadow: string;
  heading: string;
  font: string;
}

const notice = (
  look: NoticeLook,
  x: number,
  y: number,
  width: number,
  title: string,
  body: string,
  active: boolean,
): Nodes[] => {
  const opacity = active ? 1 : 0.45;
  const glyph: DesignIconName = active ? 'message-circle' : 'bell';
  return [
    rect(x, y, width, 180, look.frost, {
      name: 'Notification',
      cornerRadius: 40,
      opacity,
      ...(active ? shadow(30, 12, look.shadow) : {}),
    }),
    rect(x + 36, y + 34, 112, 112, look.appIcon, { name: 'App icon', cornerRadius: 28, opacity }),
    icon(glyph, x + 60, y + 58, 64, look.glyph, { strokeWidth: 2.25, opacity }),
    text(title, x + 180, y + 38, width - 210, {
      fontFamily: look.heading,
      fontSize: 48,
      fontWeight: 700,
      fill: look.title,
      opacity,
    }),
    text(body, x + 180, y + 102, width - 210, {
      fontFamily: look.font,
      fontSize: 36,
      fontWeight: 400,
      fill: look.body,
      opacity,
    }),
  ];
};

const lookOf = <S extends DawnSpec>(t: Theme<S>, appIcon: Fill): NoticeLook => ({
  frost: t.shade('surface', FROST),
  glyph: t.color('surface'),
  appIcon,
  title: t.color('text'),
  body: t.shade('text', '#334155'),
  shadow: t.shade('text', 'rgba(15,23,42,0.2)'),
  heading: t.font('heading'),
  font: t.font('body'),
});

const activeIcon = <S extends DawnSpec>(t: Theme<S>) =>
  linear(180, t.shade('primary', '#4ade80'), t.color('primary'));

const tipsCoverSpec = {
  colors: {
    background: {
      value: '#0d9488',
      hint: 'Dawn gradient behind everything (with its dark and lime ends) and the swipe button circle',
    },
    surface: {
      value: '#ffffff',
      hint: 'Clock, frosted notification and swipe pill, the white icons; its shade colors the website',
    },
    primary: { value: '#16a34a', hint: 'Green app icon gradient' },
    text: {
      value: INK,
      hint: 'Notification title and swipe label; its shades color the notification line and its shadow',
    },
  },
  fonts: FONTS,
  copy: {
    time: { label: 'Clock', value: '08:30' },
    website: { label: 'Website', value: 'brightdesk.co' },
    title: { label: 'Notification title', value: '3 Tips' },
    body: { label: 'Notification text', value: 'To Protect Your Focus' },
    swipe: { label: 'Swipe label', value: 'Swipe to continue' },
  },
} as const satisfies ThemeSpec;

export const tipsCover = themed(W, H, tipsCoverSpec, (t) => [
  rect(0, 0, W, H, dawn(t), { name: 'Background' }),
  text(t.copy('time'), 0, 170, W, {
    fontFamily: t.font('heading'),
    fontSize: 240,
    fontWeight: 300,
    fill: t.color('surface'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('website'), 0, 440, W, {
    fontFamily: t.font('body'),
    fontSize: 42,
    fontWeight: 500,
    fill: t.shade('surface', '#ecfeff'),
    align: 'center',
  }),
  notice(lookOf(t, activeIcon(t)), 110, 590, 860, t.copy('title'), t.copy('body'), true),
  rect(310, 1070, 460, 104, t.shade('surface', FROST), { name: 'Swipe pill', cornerRadius: 52 }),
  circle(372, 1122, 36, t.color('background')),
  icon('arrow-right', 352, 1102, 40, t.color('surface'), { strokeWidth: 2.5 }),
  text(t.copy('swipe'), 424, 1100, 340, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 500,
    fill: t.color('text'),
  }),
]);

const tipStep = (active: number, title: string, body: string) => {
  const spec = {
    colors: {
      background: { value: '#0d9488', hint: 'Dawn gradient behind everything' },
      surface: {
        value: '#ffffff',
        hint: 'Frosted notifications, the white icons and the current page dot; its shade colors the other dots',
      },
      primary: { value: '#16a34a', hint: 'Green icon of the open tip' },
      text: {
        value: INK,
        hint: 'Notification titles; its shades color their lines, the grey reminder icons and the pager',
      },
    },
    fonts: FONTS,
    copy: {
      title: { label: 'Tip title', value: title },
      body: { label: 'Tip', value: body },
      reminder: { label: 'Reminder title', value: 'Reminder' },
      reminderBody: { label: 'Reminder text', value: 'Swipe to read' },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    rect(0, 0, W, H, dawn(t), { name: 'Background' }),
    [0, 1, 2].map((index) =>
      index === active
        ? notice(
            lookOf(t, activeIcon(t)),
            80,
            300 + index * 230,
            920,
            t.copy('title'),
            t.copy('body'),
            true,
          )
        : notice(
            lookOf(t, t.shade('text', '#94a3b8')),
            150,
            300 + index * 230,
            780,
            t.copy('reminder'),
            t.copy('reminderBody'),
            false,
          ),
    ),
    rect(460, 1150, 160, 56, t.shade('text', 'rgba(15,23,42,0.55)'), {
      name: 'Pager',
      cornerRadius: 28,
    }),
    [0, 1, 2].map((index) =>
      circle(
        510 + index * 30,
        1178,
        8,
        index === active ? t.color('surface') : t.shade('surface', 'rgba(255,255,255,0.45)'),
      ),
    ),
  ]);
};

export const TIP_STEPS = [
  tipStep(0, 'Tip 1', 'Do the hardest task first'),
  tipStep(1, 'Tip 2', 'Mute every non-urgent alert'),
  tipStep(2, 'Tip 3', 'Plan tomorrow before you leave'),
] as const;
