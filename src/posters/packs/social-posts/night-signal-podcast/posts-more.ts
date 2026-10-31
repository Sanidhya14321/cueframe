import { linear, radial } from '@/design';
import {
  circle,
  ellipse,
  photo,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, BRAND, brandMark, DISPLAY, H, MONO, SIGNAL as S, SCRIPT, W } from './palette';

const countdownSpec = {
  colors: {
    background: { value: S.paper, hint: 'Page; its white tint colors the countdown numbers' },
    primary: {
      value: S.amber,
      hint: 'Countdown boxes; its orange shade is the bottom of each box gradient',
    },
    text: {
      value: S.ink,
      hint: 'NEW EPISODE, DROPS IN, the unit labels and the brand mark; its grey shade colors the reminder line',
    },
  },
  fonts: { heading: DISPLAY, body: BODY },
  copy: {
    title: { label: 'Title', value: 'NEW EPISODE' },
    subtitle: { label: 'Second title line', value: 'DROPS IN' },
    values: { label: 'Count', value: ['03', '12', '45'] },
    units: { label: 'Unit', value: ['DAYS', 'HOURS', 'MINS'] },
    note: { label: 'Reminder line', value: 'Set a reminder so you never miss a drop.' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const countdown = themed(W, H, countdownSpec, (t) => {
  const units = t.list('units');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('title'), 0, 140, W, {
      fontFamily: t.font('heading'),
      fontSize: 170,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('subtitle'), 0, 320, W, {
      fontFamily: t.font('heading'),
      fontSize: 170,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    t.list('values').map((value, index) => {
      const x = 115 + index * 300;
      return [
        rect(x, 590, 250, 270, linear(180, t.color('primary'), t.shade('primary', S.flame)), {
          cornerRadius: 20,
          name: 'Count box',
        }),
        text(value, x, 620, 250, {
          fontFamily: t.font('heading'),
          fontSize: 200,
          fontWeight: 400,
          fill: t.shade('background', S.white),
          align: 'center',
          lineHeight: 1,
        }),
        text(units[index] ?? '', x, 890, 250, {
          fontFamily: t.font('body'),
          fontSize: 38,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
          letterSpacing: 5,
        }),
      ];
    }),
    text(t.copy('note'), 0, 1010, W, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 500,
      fill: t.shade('text', S.slate),
      align: 'center',
    }),
    brandMark(t.copy('brand'), t.font('body'), t.color('text'), 1200),
  ];
});

const hostSpec = {
  colors: {
    background: { value: S.ink, hint: 'Page and the episode tag text' },
    primary: { value: S.amber, hint: 'Underline below the title and the episode tag' },
    surface: { value: S.paper, hint: 'Photo frame' },
    text: {
      value: S.white,
      hint: 'MEET THE HOST, the host name and the brand mark; its lilac shade colors the role line',
    },
  },
  fonts: { heading: DISPLAY, body: BODY },
  copy: {
    title: { label: 'Title', value: 'MEET THE HOST' },
    tag: { label: 'Episode tag', value: 'EP. 112' },
    name: { label: 'Host name', value: 'NOOR ABADI' },
    role: { label: 'Role and handle', value: 'CO-HOST  ·  @NOOR.ONAIR' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const meetTheHost = themed(W, H, hostSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  text(t.copy('title'), 0, 90, W, {
    fontFamily: t.font('heading'),
    fontSize: 140,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1,
  }),
  rect(390, 248, 300, 10, t.color('primary'), { cornerRadius: 5, name: 'Underline' }),
  rotateNodes(-4, 540, 620, [
    rect(250, 310, 580, 620, t.color('surface'), {
      name: 'Photo frame',
      ...shadow(40, 16, 'rgba(0,0,0,0.5)'),
    }),
    photo('woman-portrait-4', 275, 335, 530, 570, { filters: MONO }),
  ]),
  rect(760, 300, 200, 70, t.color('primary'), {
    cornerRadius: 35,
    rotation: 8,
    name: 'Episode tag',
  }),
  text(t.copy('tag'), 760, 312, 200, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 800,
    fill: t.color('background'),
    align: 'center',
    rotation: 8,
  }),
  text(t.copy('name'), 0, 990, W, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('role'), 0, 1110, W, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 600,
    fill: t.shade('text', S.mute),
    align: 'center',
    letterSpacing: 3,
  }),
  brandMark(t.copy('brand'), t.font('body'), t.color('text'), 1220),
]);

const tuneSpec = {
  colors: {
    background: { value: S.paper, hint: 'Page, the title box and the spindle' },
    primary: {
      value: S.ink,
      hint: 'Record, its groove rings, the spindle ring, the title and the brand mark',
    },
    accent: {
      value: S.flame,
      hint: 'Release line; its amber shade is the centre of the record label',
    },
  },
  fonts: { heading: DISPLAY, body: BODY },
  copy: {
    title: { label: 'Title', value: 'TUNE\nINTO\nLUMEN' },
    release: { label: 'Release line', value: 'NEW EPISODE EVERY FRIDAY' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

type Field = { readonly label: string; readonly value: string };

type TuneTheme = Theme<{
  colors: Record<'background' | 'primary' | 'accent', { value: string; hint: string }>;
  fonts: Record<'heading' | 'body', Field>;
  copy: Record<'title' | 'release' | 'brand', Field>;
}>;

const tuneInNodes = (t: TuneTheme, height: number) => {
  const cx = 480;
  const cy = height - 500;
  const top = height - 1050;
  return [
    rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
    brandMark(t.copy('brand'), t.font('body'), t.color('primary'), height > H ? 200 : top - 160),
    [470, 430, 390].map((radius) =>
      ellipse(
        cx - radius,
        cy - radius,
        radius * 2,
        radius * 2,
        t.shade('primary', 'rgba(20,15,38,0)'),
        {
          name: 'Groove ring',
          stroke: t.color('primary'),
          strokeWidth: 12,
        },
      ),
    ),
    circle(cx, cy, 340, t.color('primary'), { name: 'Record' }),
    circle(cx, cy, 250, radial(t.shade('accent', S.amber), t.color('accent')), { name: 'Label' }),
    circle(cx, cy, 60, t.color('primary'), { name: 'Spindle ring' }),
    circle(cx, cy, 18, t.color('background'), { name: 'Spindle' }),
    rect(510, top, 480, 560, t.color('background'), {
      name: 'Title box',
      ...shadow(30, 10, 'rgba(0,0,0,0.12)'),
    }),
    text(t.copy('title'), 550, top + 30, 420, {
      fontFamily: t.font('heading'),
      fontSize: 150,
      fontWeight: 400,
      fill: t.color('primary'),
      lineHeight: 1,
    }),
    text(t.copy('release'), 550, top + 495, 420, {
      fontFamily: t.font('body'),
      fontSize: 27,
      fontWeight: 800,
      fill: t.color('accent'),
      letterSpacing: 2,
    }),
  ];
};

export const tuneIn = themed(W, H, tuneSpec, (t) => tuneInNodes(t, H));

const tuneStorySpec = {
  colors: {
    ...tuneSpec.colors,
    primary: {
      value: S.ink,
      hint: 'Record, its groove rings, the spindle ring, both titles and the brand mark',
    },
    accent: {
      value: S.flame,
      hint: 'Release line and Out now line; its amber shade is the centre of the record label',
    },
  },
  fonts: { ...tuneSpec.fonts, script: SCRIPT },
  copy: {
    ...tuneSpec.copy,
    episode: { label: 'Episode', value: 'EPISODE 48' },
    tagline: { label: 'Script line', value: 'Out now on every app' },
  },
} as const satisfies ThemeSpec;

export const tuneInStory = themed(STORY_SIZE.width, STORY_SIZE.height, tuneStorySpec, (t) => [
  tuneInNodes(t, STORY_SIZE.height),
  text(t.copy('episode'), 0, 360, W, {
    fontFamily: t.font('heading'),
    fontSize: 150,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('tagline'), 0, 540, W, {
    fontFamily: t.font('script'),
    fontSize: 84,
    fontWeight: 700,
    fill: t.color('accent'),
    align: 'center',
  }),
]);
