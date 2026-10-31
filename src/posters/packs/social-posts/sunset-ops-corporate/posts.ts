import { IMAGE_FILTER_PRESETS, linear } from '@/design';
import {
  group,
  icon,
  POST_SIZE,
  photo,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const SUNSET = {
  orange: '#ff6a1a',
  ember: '#d94a00',
  glow: '#ff9a5c',
  soft: '#fff3ea',
  peach: '#ffd9c2',
  charcoal: '#16120f',
  smoke: '#2a221d',
  white: '#ffffff',
  grey: '#8a7f78',
};

export const HEADING = { label: 'Heading font', value: 'Urbanist' } as const;
export const HANDLE = { label: 'Website', value: 'emberline.co' } as const;
export const BROWN_SHADOW = 'rgba(120,40,0,0.35)';

export const { width: W, height: H } = POST_SIZE;

export const backdrop = (top: string, bottom: string, angle = 180, height: number = H) =>
  rect(0, 0, W, height, linear(angle, top, bottom), { name: 'Background' });

export const label = (
  content: string,
  x: number,
  y: number,
  size: number,
  width: number,
  fill: string,
  color: string,
  fontFamily: string,
) =>
  group(
    rect(x, y, width, size * 1.4, fill, { cornerRadius: 8, name: `${content} label` }),
    text(content, x, y + size * 0.16, width, {
      fontFamily,
      fontSize: size,
      fontWeight: 800,
      fill: color,
      align: 'center',
    }),
  );

const BUBBLES = [
  { x: 150, y: 560, kind: 'heart' },
  { x: 440, y: 620, kind: 'message-circle' },
  { x: 730, y: 540, kind: 'heart' },
  { x: 90, y: 800, kind: 'message-circle' },
  { x: 800, y: 820, kind: 'heart' },
] as const;

const impactSpec = {
  colors: {
    background: {
      value: SUNSET.white,
      hint: 'Page, the fade over the photo, the words on the label and the icons and counts in the reaction bubbles',
    },
    primary: { value: SUNSET.orange, hint: 'Real Influence and the reaction bubbles' },
    text: {
      value: SUNSET.charcoal,
      hint: 'Start Building and the label behind Stop chasing likes',
    },
  },
  fonts: { heading: HEADING },
  copy: {
    label: { label: 'Label', value: 'Stop chasing likes' },
    title: { label: 'Title', value: 'Start Building' },
    highlight: { label: 'Highlighted title', value: 'Real Influence' },
    counts: { label: 'Reaction count', value: ['128', '64', '310', '42', '96'] },
  },
} as const satisfies ThemeSpec;

export const startImpact = themed(W, H, impactSpec, (t) => {
  const font = t.font('heading');
  const title = (content: string, y: number, fill: string) =>
    text(content, 0, y, W, {
      fontFamily: font,
      fontSize: 100,
      fontWeight: 800,
      fill,
      align: 'center',
    });
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('team-2', 0, 760, W, 590, { filters: IMAGE_FILTER_PRESETS.mono }),
    rect(
      0,
      760,
      W,
      160,
      linear(180, t.color('background'), t.shade('background', 'rgba(255,255,255,0)')),
      { name: 'Fade' },
    ),
    label(t.copy('label'), 300, 130, 40, 480, t.color('text'), t.color('background'), font),
    title(t.copy('title'), 240, t.color('text')),
    title(t.copy('highlight'), 360, t.color('primary')),
    t.list('counts').map((count, index) => {
      const { x, y, kind } = BUBBLES[index] ?? BUBBLES[0];
      return group(
        rect(x, y, 190, 84, t.color('primary'), {
          cornerRadius: 18,
          name: 'Reaction',
          ...shadow(20, 8, 'rgba(0,0,0,0.25)'),
        }),
        icon(kind, x + 22, y + 20, 44, t.color('background'), { strokeWidth: 2.4 }),
        text(count, x + 80, y + 20, 100, {
          fontFamily: font,
          fontSize: 38,
          fontWeight: 800,
          fill: t.color('background'),
        }),
      );
    }),
  ];
});

const webinarSpec = {
  colors: {
    background: {
      value: SUNSET.white,
      hint: 'Page, WEBINAR on the band and the Save a seat words; its warm shade colors the bottom of the page',
    },
    primary: { value: SUNSET.orange, hint: 'Side band and Growth Targets' },
    text: {
      value: SUNSET.charcoal,
      hint: 'Set Your, the date and the Save a seat label',
    },
  },
  fonts: { heading: HEADING },
  copy: {
    band: { label: 'Band word', value: 'WEBINAR' },
    intro: { label: 'Intro', value: 'Set\nYour' },
    title: { label: 'Title', value: 'Growth\nTargets' },
    date: { label: 'Date and time', value: 'Thursday, June 12\nat 5 PM CET' },
    button: { label: 'Button', value: 'Save a seat' },
  },
} as const satisfies ThemeSpec;

export const webinarSpeaker = themed(W, H, webinarSpec, (t) => {
  const font = t.font('heading');
  return [
    backdrop(t.color('background'), t.shade('background', SUNSET.soft)),
    rect(0, 0, 230, H, t.color('primary'), { name: 'Band' }),
    text(t.copy('band'), 40, 1250, 1200, {
      fontFamily: font,
      fontSize: 190,
      fontWeight: 900,
      fill: t.color('background'),
      rotation: -90,
      lineHeight: 1,
    }),
    photo('man-portrait-2', 230, 500, 440, 850, { filters: IMAGE_FILTER_PRESETS.mono }),
    text(t.copy('intro'), 700, 150, 360, {
      fontFamily: font,
      fontSize: 76,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.05,
    }),
    text(t.copy('title'), 700, 316, 360, {
      fontFamily: font,
      fontSize: 76,
      fontWeight: 900,
      fill: t.color('primary'),
      lineHeight: 1.05,
    }),
    text(t.copy('date'), 700, 520, 360, {
      fontFamily: font,
      fontSize: 32,
      fontWeight: 600,
      fill: t.color('text'),
      lineHeight: 1.35,
    }),
    label(t.copy('button'), 700, 640, 32, 260, t.color('text'), t.color('background'), font),
  ];
});

const ctrlSpec = {
  colors: {
    background: {
      value: SUNSET.white,
      hint: 'Page and the ctrl label; its peach shade colors the bottom of the page',
    },
    primary: {
      value: SUNSET.orange,
      hint: 'Keyboard key; its shades color the key edge, top glow and shadow',
    },
    text: { value: SUNSET.charcoal, hint: 'EVERYTHING and IS UNDER' },
  },
  fonts: { heading: HEADING },
  copy: {
    title: { label: 'Title', value: 'EVERY\nTHING' },
    subtitle: { label: 'Subtitle', value: 'IS UNDER' },
    key: { label: 'Key label', value: 'ctrl' },
  },
} as const satisfies ThemeSpec;

export const everythingCtrl = themed(W, H, ctrlSpec, (t) => {
  const font = t.font('heading');
  return [
    backdrop(t.color('background'), t.shade('background', SUNSET.peach)),
    text(t.copy('title'), 0, 140, W, {
      fontFamily: font,
      fontSize: 190,
      fontWeight: 900,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 0.92,
    }),
    text(t.copy('subtitle'), 0, 500, W, {
      fontFamily: font,
      fontSize: 110,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
      letterSpacing: 6,
    }),
    rect(330, 720, 420, 420, t.shade('primary', SUNSET.ember), {
      cornerRadius: 90,
      name: 'Key base',
      ...shadow(60, 30, t.shade('primary', 'rgba(217,74,0,0.45)')),
    }),
    rect(350, 700, 380, 380, linear(160, t.shade('primary', SUNSET.glow), t.color('primary')), {
      cornerRadius: 80,
      name: 'Key top',
    }),
    text(t.copy('key'), 390, 740, 300, {
      fontFamily: font,
      fontSize: 64,
      fontWeight: 600,
      fill: t.color('background'),
    }),
  ];
});
