import { linear } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  path,
  poly,
  rect,
  rotateNodes,
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
  blueprintKeys,
  brand,
  glow,
  H,
  HEADING,
  modularClick,
  ROSE,
  roseFill,
  W,
} from './posts';
import { newFeature, newVersion, searchList } from './posts-more';
import { clientReviews, folderHero } from './posts-reviews';

const BAR_HEIGHTS = [200, 320, 440, 560, 680];

const revenueBars = themed(
  W,
  H,
  {
    colors: {
      background: { value: ROSE.black, hint: 'Page and the bar values' },
      primary: {
        value: ROSE.rose,
        hint: 'Glow, Momentum and the bars; its pink and pale shades color the bar tops',
      },
      text: { value: ROSE.white, hint: 'Revenue; its grey shade colors the body line' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Revenue' },
      highlight: { label: 'Highlight', value: 'Momentum' },
      body: { label: 'Body', value: 'Turn every launch into steady, compounding growth.' },
      values: { label: 'Bar value', value: ['15%', '32%', '54%', '71%', '90%'] },
    },
  },
  (t) => {
    const values = t.list('values');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      glow((exact) => t.shade('primary', exact), 760, 1000, 420, 0.4),
      text(t.copy('title'), 0, 120, W, {
        fontFamily: t.font('heading'),
        fontSize: 92,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('highlight'), 0, 224, W, {
        fontFamily: t.font('heading'),
        fontSize: 92,
        fontWeight: 800,
        fill: roseFill(t.color('primary'), t.shade('primary', ROSE.pink)),
        align: 'center',
      }),
      text(t.copy('body'), 0, 370, W, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 400,
        fill: t.shade('text', ROSE.grey),
        align: 'center',
      }),
      BAR_HEIGHTS.map((height, index) => {
        const x = 120 + index * 172;
        const y = 1250 - height;
        return [
          rect(
            x,
            y,
            150,
            height,
            linear(180, t.shade('primary', index < 2 ? ROSE.pale : ROSE.pink), t.color('primary')),
            { cornerRadius: 22, name: 'Bar', opacity: 0.55 + index * 0.1 },
          ),
          text(values[index] ?? '', x, y + 24, 150, {
            fontFamily: t.font('heading'),
            fontSize: 36,
            fontWeight: 800,
            fill: t.color('background'),
            align: 'center',
          }),
        ];
      }),
    ];
  },
);

const boostGauge = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: ROSE.black,
        hint: 'Page; its lighter shade colors the top of the page',
      },
      primary: {
        value: ROSE.rose,
        hint: 'Glow, Real Lift and the gauge; its pink and pale shades color the gauge and gradient ends',
      },
      text: {
        value: ROSE.white,
        hint: 'Brand, headline, the needle and its hub; its grey shade colors the body line',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      brand: BRAND,
      headline: { label: 'Headline', value: 'Give Your\nStack a' },
      highlight: { label: 'Highlight', value: 'Real Lift' },
      body: { label: 'Body', value: 'Faster deploys, fewer outages.' },
    },
  },
  (t) => [
    rect(0, 0, W, H, linear(180, t.shade('background', '#130d16'), t.color('background')), {
      name: 'Background',
    }),
    glow((exact) => t.shade('primary', exact), 800, 1080, 300, 0.45),
    brand(t.copy('brand'), t.font('heading'), 90, t.color('text'), 'left'),
    text(t.copy('headline'), 80, 190, 900, {
      fontFamily: t.font('heading'),
      fontSize: 96,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.1,
    }),
    text(t.copy('highlight'), 80, 402, 900, {
      fontFamily: t.font('heading'),
      fontSize: 96,
      fontWeight: 800,
      fill: roseFill(t.color('primary'), t.shade('primary', ROSE.pink)),
    }),
    text(t.copy('body'), 80, 540, 700, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 500,
      fill: t.shade('text', ROSE.grey),
    }),
    path(
      'M 500 1350 A 580 580 0 0 1 1080 770 L 1080 960 A 390 390 0 0 0 690 1350 Z',
      0,
      0,
      W,
      H,
      linear(135, t.shade('primary', ROSE.pale), t.shade('primary', ROSE.pink), t.color('primary')),
      { width: W, height: H },
      { name: 'Gauge' },
    ),
    poly(
      [
        [1066, 1336],
        [700, 960],
        [1080, 1320],
      ],
      t.color('text'),
      { name: 'Needle' },
    ),
    circle(1040, 1310, 36, t.color('text'), { name: 'Needle hub' }),
  ],
);

const WAVE_ALPHAS = [0.12, 0.2, 0.3, 0.42, 0.55];

const glassSpec = {
  colors: {
    background: { value: ROSE.black, hint: 'Page' },
    surface: { value: ROSE.panel, hint: 'Post card' },
    primary: {
      value: ROSE.rose,
      hint: 'Glow, waves, the account dot, the second line and the heart; its pink shade colors the gradient ends',
    },
    text: {
      value: ROSE.white,
      hint: 'Account name, menu dots, the first line and the action icons; its pale tint colors the card border',
    },
  },
  fonts: { heading: HEADING },
  copy: {
    account: { label: 'Account', value: 'Rosewire Tech' },
    title: { label: 'Title', value: 'Great software' },
    highlight: { label: 'Highlight', value: 'multiplies what\npeople can do' },
  },
} as const satisfies ThemeSpec;

const glassCard = (t: Omit<Theme<typeof glassSpec>, 'list'>, height: number): Nodes[] => {
  const cy = height / 2;
  return [
    rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
    glow((exact) => t.shade('primary', exact), 540, cy, 480, 0.3, height),
    WAVE_ALPHAS.map((alpha, index) => {
      const y = height * 0.32 + index * 70;
      return path(
        `M 0 ${y} C 300 ${y - 220} 700 ${y + 240} 1080 ${y - 90}`,
        0,
        0,
        W,
        height,
        t.shade('primary', 'rgba(0,0,0,0)'),
        { width: W, height },
        { stroke: t.shade('primary', `rgba(255,79,139,${alpha})`), strokeWidth: 3, name: 'Wave' },
      );
    }),
    rotateNodes(-5, 540, cy, [
      rect(250, cy - 280, 580, 540, t.shade('surface', 'rgba(26,19,29,0.92)'), {
        cornerRadius: 32,
        stroke: t.shade('text', 'rgba(255,225,236,0.6)'),
        strokeWidth: 3,
        name: 'Post card',
        ...shadow(40, 20, 'rgba(0,0,0,0.5)'),
      }),
      circle(310, cy - 216, 26, linear(135, t.color('primary'), t.shade('primary', ROSE.pink))),
      text(t.copy('account'), 352, cy - 234, 360, {
        fontFamily: t.font('heading'),
        fontSize: 28,
        fontWeight: 700,
        fill: t.color('text'),
      }),
      [0, 1, 2].map((index) => circle(790, cy - 236 + index * 14, 4, t.color('text'))),
      text(t.copy('title'), 270, cy - 110, 540, {
        fontFamily: t.font('heading'),
        fontSize: 50,
        fontWeight: 600,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('highlight'), 270, cy - 46, 540, {
        fontFamily: t.font('heading'),
        fontSize: 50,
        fontWeight: 800,
        fill: roseFill(t.color('primary'), t.shade('primary', ROSE.pink)),
        align: 'center',
        lineHeight: 1.2,
      }),
      icon('heart', 290, cy + 180, 40, t.color('primary')),
      icon('message-circle', 346, cy + 180, 40, t.color('text')),
      icon('send', 402, cy + 180, 40, t.color('text')),
      icon('bookmark', 750, cy + 180, 40, t.color('text')),
    ]),
  ];
};

export const glassPost = themed(
  W,
  H,
  {
    ...glassSpec,
    colors: {
      ...glassSpec.colors,
      text: {
        value: ROSE.white,
        hint: 'Account name, menu dots, the first line, the action icons and the brand; its pale tint colors the card border',
      },
    },
    copy: { ...glassSpec.copy, brand: BRAND },
  },
  (t) => [glassCard(t, H), brand(t.copy('brand'), t.font('heading'), H - 140, t.color('text'))],
);

export const glassStory = themed(STORY_SIZE.width, STORY_SIZE.height, glassSpec, (t) =>
  glassCard(t, STORY_SIZE.height),
);

export const POSTS = [
  modularClick,
  blueprintKeys,
  clientReviews,
  folderHero,
  newFeature,
  glassPost,
  searchList,
  newVersion,
  revenueBars,
  boostGauge,
];
