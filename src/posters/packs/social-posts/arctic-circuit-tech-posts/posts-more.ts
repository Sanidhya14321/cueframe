import { linear, radial } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  path,
  photo,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  BRAND,
  brandMark,
  button,
  DARK_BACKGROUND,
  darkBg,
  H,
  HEADING,
  ICE,
  planBuildShip,
  riseOfAutopilot,
  topThree,
  W,
} from './posts';
import { mythFact, precisionTracking, quoteRival } from './posts-mid';

const adSpend = themed(
  W,
  H,
  {
    colors: {
      background: DARK_BACKGROUND,
      primary: { value: ICE.cyan, hint: 'Glow, Ad Spend, the halo and the glow under the point' },
      text: {
        value: ICE.white,
        hint: 'Sharpen Your, the subtitle, the trend curve, the point and the brand name',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      intro: { label: 'Intro', value: 'Sharpen Your' },
      title: { label: 'Headline', value: 'Ad Spend' },
      subtitle: { label: 'Subtitle', value: 'Get 4x more qualified clicks' },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec,
  (t) => [
    darkBg(t, H),
    text(t.copy('intro'), 0, 250, W, {
      fontFamily: t.font('heading'),
      fontSize: 84,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('title'), 0, 350, W, {
      fontFamily: t.font('heading'),
      fontSize: 110,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 0, 510, W, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 500,
      fill: t.shade('text', ICE.muted),
      align: 'center',
    }),
    path(
      'M 0 1120 C 200 1120 220 700 360 760 S 480 1180 600 1050 S 820 760 1080 820',
      0,
      0,
      W,
      H,
      t.shade('text', 'rgba(0,0,0,0)'),
      { width: W, height: H },
      { name: 'Trend curve', stroke: t.shade('text', 'rgba(255,255,255,0.85)'), strokeWidth: 4 },
    ),
    circle(
      600,
      1050,
      80,
      radial(t.shade('primary', 'rgba(34,211,238,0.45)'), t.shade('primary', 'rgba(34,211,238,0)')),
      { name: 'Halo' },
    ),
    circle(600, 1050, 26, t.color('text'), {
      name: 'Point',
      ...shadow(40, 0, t.color('primary')),
    }),
    brandMark(t.copy('brand'), 0, 1240, W, t.color('text'), t.font('heading')),
  ],
);

const breakthroughSpec = {
  colors: {
    background: {
      value: ICE.night,
      hint: 'Page, the fade over the photo and the Contact Us label',
    },
    primary: {
      value: ICE.cyan,
      hint: 'next Breakthrough? and the Contact Us button; its blue shade tints the photo',
    },
    text: {
      value: ICE.white,
      hint: 'Looking for the, the Learn More button and the brand name',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: 'Looking for the' },
    title: { label: 'Headline', value: 'next Breakthrough?' },
    more: { label: 'Outline button', value: 'Learn More' },
    cta: { label: 'Button', value: 'Contact Us' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const breakthrough = (width: number, height: number) =>
  themed(width, height, breakthroughSpec, (t): Nodes[] => {
    const photoHeight = height * 0.56;
    const top = photoHeight + 20;
    return [
      rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
      photo('desk-imac', 0, 0, W, photoHeight),
      rect(0, 0, W, photoHeight, t.shade('primary', 'rgba(14,165,233,0.28)'), { name: 'Tint' }),
      rect(
        0,
        photoHeight * 0.45,
        W,
        photoHeight * 0.55 + 2,
        linear(180, t.shade('background', 'rgba(3,10,20,0)'), t.color('background')),
        { name: 'Fade' },
      ),
      text(t.copy('intro'), 0, top, W, {
        fontFamily: t.font('heading'),
        fontSize: 68,
        fontWeight: 300,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('title'), 0, top + 84, W, {
        fontFamily: t.font('heading'),
        fontSize: 76,
        fontWeight: 800,
        fill: t.color('primary'),
        align: 'center',
      }),
      button(t, t.copy('more'), 250, top + 230, 270, false, t.font('body')),
      button(t, t.copy('cta'), 560, top + 230, 270, true, t.font('body')),
      brandMark(t.copy('brand'), 0, height - 110, W, t.color('text'), t.font('heading')),
    ];
  });

export const breakthroughPost = breakthrough(W, H);

export const breakthroughStory = breakthrough(STORY_SIZE.width, STORY_SIZE.height);

interface WorkCopy {
  accent: string;
  light: string;
  glowColor: string;
  lines: readonly [string, string, string];
}

const busywork = (copy: WorkCopy) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: ICE.night, hint: 'Page and the Learn More label' },
        primary: {
          value: copy.accent,
          hint: 'Glowing tile and the middle headline line; its lighter shade colors the side tiles and the Learn More button',
        },
        text: {
          value: ICE.white,
          hint: 'First and last headline lines, the sparkles and the faint side tiles',
        },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        lines: { label: 'Headline line', value: copy.lines },
        cta: { label: 'Button', value: 'Learn More' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const light = t.shade('primary', copy.light);
      const [first = '', second = '', third = ''] = t.list('lines');
      const line = (content: string, y: number, fontWeight: number, fill: string) =>
        text(content, 80, y, 600, {
          fontFamily: t.font('heading'),
          fontSize: 84,
          fontWeight,
          fill,
          lineHeight: 1,
        });
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        rect(
          700,
          40,
          240,
          200,
          linear(
            180,
            t.shade('text', 'rgba(255,255,255,0)'),
            t.shade('text', 'rgba(255,255,255,0.32)'),
          ),
          { name: 'Tile', cornerRadius: 36 },
        ),
        rect(700, 280, 240, 280, linear(180, t.shade('text', 'rgba(255,255,255,0.6)'), light), {
          name: 'Tile',
          cornerRadius: 36,
        }),
        rect(700, 900, 240, 280, linear(180, light, t.shade('text', 'rgba(255,255,255,0.15)')), {
          name: 'Tile',
          cornerRadius: 36,
        }),
        rect(
          700,
          1220,
          240,
          100,
          linear(
            180,
            t.shade('text', 'rgba(255,255,255,0.2)'),
            t.shade('text', 'rgba(255,255,255,0)'),
          ),
          { name: 'Tile', cornerRadius: 36 },
        ),
        rotateNodes(-12, 795, 735, [
          rect(650, 590, 290, 290, linear(135, light, t.color('primary')), {
            name: 'Glowing tile',
            cornerRadius: 56,
            ...shadow(80, 0, t.shade('primary', copy.glowColor)),
          }),
          icon('sparkles', 730, 670, 130, t.color('text'), { strokeWidth: 1.8 }),
        ]),
        line(first, 430, 400, t.color('text')),
        line(second, 530, 800, t.color('primary')),
        line(third, 630, 400, t.color('text')),
        rect(80, 790, 250, 72, light, { name: 'Button', cornerRadius: 36 }),
        text(t.copy('cta'), 80, 810, 250, {
          fontFamily: t.font('body'),
          fontSize: 28,
          fontWeight: 600,
          fill: t.color('background'),
          align: 'center',
        }),
      ];
    },
  );

export const busyworkCyan = busywork({
  accent: ICE.cyan,
  light: '#a5f3fc',
  glowColor: 'rgba(34,211,238,0.85)',
  lines: ['Let AI take', 'the busywork', 'off your desk'],
});

export const busyworkAmber = busywork({
  accent: '#fbbf24',
  light: '#fde68a',
  glowColor: 'rgba(251,191,36,0.85)',
  lines: ['Use AI to', 'move faster', 'every day'],
});

export const POSTS: readonly Template[] = [
  planBuildShip,
  riseOfAutopilot,
  topThree,
  precisionTracking,
  mythFact,
  quoteRival,
  adSpend,
  breakthroughPost,
  busyworkCyan,
];
