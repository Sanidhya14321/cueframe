import { linear } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  poly,
  rect,
  STORY_SIZE,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  BRAND,
  brandMark,
  button,
  CITRON,
  darkBg,
  H,
  HEADING,
  limeGlow,
  ringArc,
  W,
} from './posts';

const roadmapSpec = {
  colors: {
    background: { value: CITRON.night, hint: 'Page and the Learn More label' },
    primary: {
      value: CITRON.lime,
      hint: 'Stripes, glow, the highlight behind Roadmap Shines, the caret and the Learn More button',
    },
    text: {
      value: CITRON.white,
      hint: 'Brand, With AI, Your and Roadmap Shines; its faded shade colors the body text',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    headline: { label: 'Headline', value: 'With AI, Your' },
    highlight: { label: 'Highlighted line', value: 'Roadmap Shines' },
    body: { label: 'Body', value: 'Grow your team with tools\nthat scale right alongside you' },
    cta: { label: 'Button', value: 'Learn More' },
  },
} as const satisfies ThemeSpec;

export const roadmapShines = themed(W, H, roadmapSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  Array.from({ length: 14 }, (_, index) =>
    rect(
      index * 80,
      0,
      40,
      H,
      linear(
        180,
        t.shade('primary', 'rgba(163,230,53,0.1)'),
        t.shade('primary', 'rgba(163,230,53,0)'),
      ),
      { name: 'Stripe' },
    ),
  ),
  limeGlow(t, 620, 0, 460, 900, 0.4),
  text(t.copy('brand'), 80, 90, 600, {
    fontFamily: t.font('heading'),
    fontSize: 28,
    fontWeight: 700,
    fill: t.color('text'),
    letterSpacing: 4,
  }),
  text(t.copy('headline'), 80, 500, 920, {
    fontFamily: t.font('heading'),
    fontSize: 78,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  rect(436, 600, 306, 104, t.shade('primary', 'rgba(163,230,53,0.28)'), {
    name: 'Highlight',
    cornerRadius: 10,
  }),
  rect(742, 596, 8, 112, t.color('primary'), { name: 'Caret' }),
  text(t.copy('highlight'), 80, 606, 920, {
    fontFamily: t.font('heading'),
    fontSize: 78,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  text(t.copy('body'), 80, 760, 800, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 500,
    fill: t.shade('text', CITRON.muted),
    lineHeight: 1.4,
  }),
  button(t, t.copy('cta'), 80, 920, 260, true, 'Learn More button'),
]);

const ENGINE_TICKS = [150, 190, 230, 270, 310, 350, 390];

const enginesSpec = {
  colors: {
    background: { value: CITRON.night, hint: 'Page and the Learn More label' },
    surface: {
      value: '#25291b',
      hint: 'Gauge face; its darker shade colors the bottom of the face',
    },
    primary: {
      value: CITRON.lime,
      hint: 'Glow, gauge arc, tasks per min, the Learn More button and the progress bar; its deeper shade starts the arc',
    },
    text: {
      value: CITRON.white,
      hint: 'Big number, Smart Engines and brand; its faded shades color the gauge rim, track, tick dots and progress track',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    value: { label: 'Number', value: '9200' },
    unit: { label: 'Unit', value: 'tasks per min' },
    title: { label: 'Title', value: 'Smart Engines' },
    cta: { label: 'Button', value: 'Learn More' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const smartEngines = themed(W, H, enginesSpec, (t) => [
  darkBg(t, H),
  limeGlow(t, 240, 220, 600, 600, 0.25),
  circle(540, 520, 260, linear(180, t.color('surface'), t.shade('surface', '#121409')), {
    name: 'Gauge face',
    stroke: t.shade('text', 'rgba(255,255,255,0.12)'),
    strokeWidth: 4,
    ...shadow(60, 20, 'rgba(0,0,0,0.6)'),
  }),
  ringArc(540, 520, 240, 212, 135, 405, t.shade('text', 'rgba(255,255,255,0.12)')),
  ringArc(
    540,
    520,
    240,
    212,
    135,
    330,
    linear(90, t.shade('primary', CITRON.deep), t.color('primary')),
  ),
  ENGINE_TICKS.map((angle) => {
    const radians = (angle * Math.PI) / 180;
    return circle(
      540 + 185 * Math.cos(radians),
      520 + 185 * Math.sin(radians),
      5,
      t.shade('text', CITRON.muted),
    );
  }),
  text(t.copy('value'), 0, 440, W, {
    fontFamily: t.font('heading'),
    fontSize: 110,
    fontWeight: 800,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('unit'), 0, 570, W, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 600,
    fill: t.color('primary'),
    align: 'center',
  }),
  text(t.copy('title'), 0, 840, W, {
    fontFamily: t.font('heading'),
    fontSize: 96,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'center',
  }),
  button(t, t.copy('cta'), 405, 990, 270, true, 'Learn More button'),
  rect(140, 1160, 800, 6, t.shade('text', 'rgba(255,255,255,0.18)'), {
    name: 'Track',
    cornerRadius: 3,
  }),
  rect(140, 1160, 480, 6, t.color('primary'), { name: 'Progress', cornerRadius: 3 }),
  brandMark(t, 1240),
]);

const ACTIVE_ROW = 1;

const flowmindSpec = {
  colors: {
    background: { value: CITRON.night, hint: 'Page and the label of the highlighted feature row' },
    surface: { value: '#262a1d', hint: 'The other feature rows' },
    primary: {
      value: CITRON.lime,
      hint: 'Spotlight, lamp, the Flowmind title and the highlighted feature row; its lighter shade tops the gradients',
    },
    text: {
      value: CITRON.white,
      hint: 'New AI Features, the sparkle, other row labels and brand; its faded shades color the grid lines, panel and body text',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'New AI Features' },
    title: { label: 'Title', value: 'Flowmind' },
    body: {
      label: 'Body',
      value: 'AI-driven automation that streamlines\nworkflows and lifts your output.',
    },
    features: {
      label: 'Feature',
      value: ['Smart Triggers', 'Auto Task Routing', 'Live Performance Insights'],
    },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const flowmindNodes = (t: Theme<typeof flowmindSpec>, height: number): Nodes[] => {
  const top = (height - H) / 2;
  const bright = t.shade('primary', CITRON.bright);
  return [
    rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
    rect(0, top + 120, W, 2, t.shade('text', 'rgba(255,255,255,0.08)'), { name: 'Grid line' }),
    rect(150, 0, 2, height, t.shade('text', 'rgba(255,255,255,0.06)'), { name: 'Grid line' }),
    rect(928, 0, 2, height, t.shade('text', 'rgba(255,255,255,0.06)'), { name: 'Grid line' }),
    poly(
      [
        [400, top + 110],
        [680, top + 110],
        [960, top + 640],
        [120, top + 640],
      ],
      linear(
        180,
        t.shade('primary', 'rgba(163,230,53,0.28)'),
        t.shade('primary', 'rgba(163,230,53,0)'),
      ),
      { name: 'Spotlight' },
    ),
    rect(400, top + 104, 280, 12, t.color('primary'), {
      name: 'Lamp',
      cornerRadius: 6,
      ...shadow(40, 0, t.color('primary')),
    }),
    icon('sparkles', 360, top + 186, 40, t.color('text'), { strokeWidth: 2 }),
    text(t.copy('kicker'), 412, top + 188, 400, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 600,
      fill: t.color('text'),
    }),
    text(t.copy('title'), 0, top + 250, W, {
      fontFamily: t.font('heading'),
      fontSize: 170,
      fontWeight: 600,
      fill: linear(180, bright, t.color('primary')),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('body'), 0, top + 470, W, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 500,
      fill: t.shade('text', CITRON.muted),
      align: 'center',
      lineHeight: 1.4,
    }),
    rect(150, top + 650, 780, 480, t.shade('text', 'rgba(255,255,255,0.04)'), {
      name: 'Panel',
      cornerRadius: 40,
      stroke: t.shade('text', 'rgba(255,255,255,0.16)'),
      strokeWidth: 2,
    }),
    t.list('features').map((feature, index) => {
      const y = top + 720 + index * 130;
      const active = index === ACTIVE_ROW;
      return [
        rect(
          210,
          y,
          660,
          92,
          active ? linear(90, bright, t.color('primary')) : t.color('surface'),
          {
            name: 'Feature row',
            cornerRadius: 22,
            ...(active ? shadow(40, 0, t.shade('primary', 'rgba(163,230,53,0.5)')) : {}),
          },
        ),
        text(feature, 210, y + 28, 660, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 600,
          fill: active ? t.color('background') : t.color('text'),
          align: 'center',
        }),
      ];
    }),
    brandMark(t, height - 110),
  ];
};

export const flowmindPost = themed(W, H, flowmindSpec, (t) => flowmindNodes(t, H));

export const flowmindStory = themed(STORY_SIZE.width, STORY_SIZE.height, flowmindSpec, (t) =>
  flowmindNodes(t, STORY_SIZE.height),
);
