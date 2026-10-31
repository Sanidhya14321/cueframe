import { linear } from '@/design';
import {
  avatar,
  circle,
  ellipse,
  path,
  rect,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY_FONT,
  BRAND,
  backdrop,
  brand,
  centered,
  cursor,
  growOnline,
  H,
  HEADING_FONT,
  IRIS,
  magicRoutines,
  quoteFloat,
  sparkle,
  stayAhead,
  tag,
  W,
} from './posts';
import { buildSystem, stackedWords, statsGrid } from './posts-stats';

const streamlinedSpec = {
  colors: {
    background: { value: IRIS.white, hint: 'Pale page gradient' },
    primary: {
      value: IRIS.iris,
      hint: 'Streamlined headline gradient, the outline buttons, the sparkles and the lilac arc',
    },
    text: { value: IRIS.ink, hint: 'Workflows made easy line and the brand name' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    headline: { label: 'Headline', value: 'Streamlined.' },
    subline: { label: 'Subline', value: 'Workflows made easy' },
    buttons: { label: 'Button', value: ['Learn more', 'Join today'] },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const streamlined = themed(W, H, streamlinedSpec, (t) => {
  const heading = centered(t.font('heading'));
  const [learn = '', join = ''] = t.list('buttons');
  const outlineButton = (label: string, x: number, y: number) => [
    rect(x, y, 260, 76, t.shade('primary', 'rgba(0,0,0,0)'), {
      cornerRadius: 38,
      stroke: t.color('primary'),
      strokeWidth: 3,
      name: 'Button',
    }),
    text(label, x, y + 22, 260, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 600,
      fill: t.color('primary'),
      align: 'center',
    }),
  ];
  return [
    backdrop(H, linear(180, t.color('background'), t.shade('background', '#e2d9ff'))),
    heading(
      t.copy('headline'),
      220,
      120,
      800,
      linear(90, t.color('primary'), t.shade('primary', IRIS.soft)),
    ),
    heading(t.copy('subline'), 370, 44, 500, t.color('text')),
    outlineButton(learn, 260, 470),
    outlineButton(join, 560, 470),
    path(
      'M 120 1200 C 220 900 500 770 780 800',
      0,
      0,
      W,
      H,
      t.shade('primary', 'rgba(0,0,0,0)'),
      { width: W, height: H },
      { stroke: t.shade('primary', IRIS.soft), strokeWidth: 64, name: 'Arc' },
    ),
    sparkle(790, 690, 110, t.color('primary')),
    sparkle(900, 620, 56, t.shade('primary', IRIS.soft)),
    sparkle(890, 800, 46, t.color('primary')),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});

const globeSpec = {
  colors: {
    background: { value: IRIS.white, hint: 'Pale page gradient' },
    primary: {
      value: IRIS.iris,
      hint: 'Thousands Worldwide headline gradient and the globe gradient with its glow',
    },
    surface: { value: IRIS.white, hint: 'Continents and glare on the globe and the photo rings' },
    text: {
      value: IRIS.ink,
      hint: 'Trusted by line, the brand name and the shadow under the globe',
    },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    lead: { label: 'Lead line', value: 'Trusted by' },
    headline: { label: 'Headline', value: 'Thousands Worldwide' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const trustedGlobe = themed(W, H, globeSpec, (t) => {
  const heading = centered(t.font('heading'));
  const land = t.shade('surface', 'rgba(255,255,255,0.35)');
  return [
    backdrop(H, linear(180, t.color('background'), t.shade('background', '#e2d9ff'))),
    heading(t.copy('lead'), 160, 72, 500, t.color('text')),
    heading(
      t.copy('headline'),
      248,
      68,
      800,
      linear(90, t.color('primary'), t.shade('primary', IRIS.soft)),
    ),
    ellipse(330, 1080, 420, 46, t.shade('text', 'rgba(29,20,80,0.14)'), { name: 'Shadow' }),
    circle(
      540,
      760,
      300,
      linear(160, t.shade('primary', IRIS.soft), t.shade('primary', IRIS.royal)),
      {
        name: 'Globe',
        ...shadow(40, 20, t.shade('primary', 'rgba(36,18,126,0.3)')),
      },
    ),
    ellipse(320, 590, 210, 150, land, { name: 'Land' }),
    ellipse(570, 640, 170, 250, land, { name: 'Land' }),
    ellipse(350, 800, 140, 160, land, { name: 'Land' }),
    ellipse(640, 920, 120, 70, t.shade('surface', 'rgba(255,255,255,0.3)'), { name: 'Land' }),
    ellipse(380, 520, 160, 70, t.shade('surface', 'rgba(255,255,255,0.4)'), {
      name: 'Glare',
      rotation: -20,
    }),
    avatar('woman-portrait-1', 220, 560, 54, t.color('surface')),
    avatar('man-portrait-1', 870, 540, 48, t.color('surface')),
    avatar('woman-portrait-6', 890, 900, 58, t.color('surface')),
    avatar('man-portrait-3', 210, 960, 46, t.color('surface')),
    avatar('woman-portrait-4', 720, 430, 42, t.color('surface')),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});

const effortlessSpec = {
  colors: {
    background: {
      value: IRIS.royal,
      hint: 'Violet page gradient, the tag labels and the tag shadows',
    },
    text: {
      value: IRIS.white,
      hint: 'AI that feels and Effortless, the selection box and handles, the cursor, the tag borders and the brand name',
    },
    accent: {
      value: IRIS.lilac,
      hint: 'Tag gradients and the Begin your journey line',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    tags: { label: 'Tag', value: ['Assist', 'Create', 'Launch'] },
    lead: { label: 'Lead line', value: 'AI that feels' },
    headline: { label: 'Headline', value: 'Effortless' },
    subline: { label: 'Subline', value: 'Begin your journey' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const effortless = (width: number, height: number, cy: number) =>
  themed(width, height, effortlessSpec, (t) => {
    const heading = centered(t.font('heading'));
    const [assist = '', create = '', launch = ''] = t.list('tags');
    const tagStyle = {
      from: t.color('accent'),
      to: t.shade('accent', IRIS.pale),
      stroke: t.color('text'),
      shade: t.shade('background', 'rgba(36,18,126,0.35)'),
      color: t.shade('background', IRIS.ink),
      fontFamily: t.font('body'),
    };
    return [
      backdrop(height, linear(160, t.color('background'), t.shade('background', IRIS.deep))),
      tag(assist, 210, cy - 400, -6, 170, tagStyle),
      tag(create, 720, cy - 310, 6, 170, tagStyle),
      tag(launch, 240, cy + 250, 4, 170, tagStyle),
      heading(t.copy('lead'), cy - 210, 60, 500, t.color('text')),
      rect(220, cy - 120, 640, 160, t.shade('text', 'rgba(255,255,255,0.08)'), {
        stroke: t.color('text'),
        strokeWidth: 3,
        name: 'Selection box',
      }),
      [
        [212, cy - 128],
        [852, cy - 128],
        [212, cy + 32],
        [852, cy + 32],
      ].map(([x = 0, y = 0]) => rect(x, y, 16, 16, t.color('text'), { name: 'Handle' })),
      heading(t.copy('headline'), cy - 110, 108, 800, t.color('text')),
      cursor(850, cy + 30, 1.3, t.color('text')),
      heading(t.copy('subline'), cy + 110, 46, 500, t.color('accent')),
      brand(
        t.copy('brand'),
        height > H ? height - 260 : cy + 420,
        t.color('text'),
        t.font('heading'),
      ),
    ];
  });

export const effortlessPost = effortless(W, H, 640);

export const effortlessStory = effortless(STORY_SIZE.width, STORY_SIZE.height, 900);

export const POSTS = [
  magicRoutines,
  growOnline,
  stayAhead,
  quoteFloat,
  streamlined,
  effortlessPost,
  buildSystem,
  stackedWords,
  trustedGlobe,
  statsGrid,
];
