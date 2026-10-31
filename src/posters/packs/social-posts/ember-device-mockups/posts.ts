import {
  circle,
  icon,
  poly,
  rect,
  rotateNodes,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  ART_HINT,
  BODY,
  EMBER as E,
  FRAME_HINT,
  glow,
  H,
  HEADING,
  inkOf,
  laptopDevice,
  phoneDevice,
  SITE_COPY,
  siteLine,
  tablet,
  W,
} from './devices';

const headline = (content: string, y: number, size: number, fill: string, fontFamily: string) =>
  text(content, 0, y, W, {
    fontFamily,
    fontSize: size,
    fontWeight: 800,
    fill,
    align: 'center',
    lineHeight: 1.05,
  });

const subline = (content: string, y: number, fill: string, fontFamily: string) =>
  text(content, 0, y, W, {
    fontFamily,
    fontSize: 36,
    fontWeight: 500,
    fill,
    align: 'center',
    lineHeight: 1.4,
  });

const performSpec = {
  colors: {
    background: { value: E.black, hint: 'Page; its clear shade is the outer edge of the glow' },
    primary: { value: E.glow, hint: 'Work Smarter, the underline and the glow behind the tablets' },
    text: { value: E.white, hint: 'Built to' },
    secondary: { value: E.grey, hint: 'Subline' },
    surface: {
      value: E.tablet,
      hint: 'Front tablet; its light shade is the back tablet and its other shades color the screens and bezels',
    },
    accent: { value: E.sky, hint: ART_HINT },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    lead: { label: 'Headline', value: 'Built to' },
    highlight: { label: 'Highlight', value: 'Work Smarter' },
    subline: { label: 'Subline', value: 'Streamline your workflow and ship\nmore in less time.' },
  },
} as const satisfies ThemeSpec;

export const performBetter = themed(W, H, performSpec, (t) => {
  const ink = inkOf(t.shade);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    glow(540, 1000, 620, t.shade('primary', E.glowSoft), t.shade('background', E.fade)),
    headline(t.copy('lead'), 110, 96, t.color('text'), t.font('heading')),
    headline(t.copy('highlight'), 215, 96, t.color('primary'), t.font('heading')),
    subline(t.copy('subline'), 360, t.color('secondary'), t.font('body')),
    rect(400, 490, 280, 8, t.color('primary'), { cornerRadius: 4, name: 'Underline' }),
    tablet(ink, 250, 640, 440, 600, { body: E.silver, rotation: -14 }),
    tablet(ink, 470, 610, 470, 650),
  ];
});

const assistSpec = {
  colors: {
    background: { value: E.black, hint: 'Page; its clear shade is the outer edge of the glow' },
    primary: { value: E.glow, hint: 'Glow behind the laptop' },
    text: { value: E.white, hint: 'The three big words' },
    secondary: { value: E.grey, hint: 'Website at the bottom' },
    surface: { value: E.metal, hint: `Laptop lid; ${FRAME_HINT}` },
    accent: { value: E.sky, hint: ART_HINT },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    words: { label: 'Word', value: ['Assist.', 'Launch.', 'Create.'] },
    site: SITE_COPY,
  },
} as const satisfies ThemeSpec;

export const assistLaunch = themed(W, H, assistSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  glow(540, 680, 560, t.shade('primary', E.glowSoft), t.shade('background', E.fade)),
  t.list('words').map((word, index) =>
    text(word, 80, 110 + index * 350, 960, {
      fontFamily: t.font('heading'),
      fontSize: 210,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1,
    }),
  ),
  rotateNodes(-14, 550, 640, [laptopDevice(inkOf(t.shade), 250, 440, 600)]),
  siteLine(t.copy('site'), 1250, t.color('secondary'), t.font('body')),
]);

const showcaseSpec = {
  colors: {
    background: {
      value: E.black,
      hint: 'Page and the contact icons; its clear shade is the outer edge of the glow',
    },
    primary: {
      value: E.glow,
      hint: 'Showcase, the contact circles and the glow behind the laptop',
    },
    text: { value: E.white, hint: 'Visit us today and the subline' },
    surface: { value: E.metal, hint: `Laptop lid; ${FRAME_HINT}` },
    accent: { value: E.sky, hint: ART_HINT },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Visit us today!' },
    title: { label: 'Title', value: 'Showcase' },
    subline: { label: 'Subline', value: 'Work that works as hard as you do.' },
  },
} as const satisfies ThemeSpec;

export const showcase = themed(W, H, showcaseSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  glow(540, 520, 520, t.shade('primary', E.glowSoft), t.shade('background', E.fade)),
  text(t.copy('kicker'), 0, 100, W, {
    fontFamily: t.font('body'),
    fontSize: 38,
    fontWeight: 700,
    italic: true,
    fill: t.color('text'),
    align: 'center',
  }),
  rotateNodes(-8, 540, 470, [laptopDevice(inkOf(t.shade), 240, 270, 600)]),
  headline(t.copy('title'), 790, 150, t.color('primary'), t.font('heading')),
  subline(t.copy('subline'), 980, t.color('text'), t.font('body')),
  (['globe', 'mail', 'phone'] as const).map((name, index) => [
    circle(440 + index * 100, 1150, 34, t.color('primary')),
    icon(name, 422 + index * 100, 1132, 36, t.color('background'), { strokeWidth: 2.4 }),
  ]),
]);

const kitSpec = {
  colors: {
    background: {
      value: E.black,
      hint: 'Page and the sticker text; its clear shade is the outer edge of the glow',
    },
    primary: { value: E.glow, hint: 'Sticker and the glow behind the devices' },
    text: { value: E.white, hint: 'Title' },
    secondary: { value: E.grey, hint: 'Subline and website' },
    surface: { value: E.metal, hint: `Laptop lid and phone body; ${FRAME_HINT}` },
    accent: { value: E.sky, hint: ART_HINT },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Smart UI Kit' },
    subline: { label: 'Subline', value: 'Effortless pricing pages for every product.' },
    sticker: { label: 'Sticker', value: 'TRY IT\nFREE' },
    site: SITE_COPY,
  },
} as const satisfies ThemeSpec;

export const smartKit = themed(W, H, kitSpec, (t) => {
  const ink = inkOf(t.shade);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    glow(540, 800, 540, t.shade('primary', E.glowSoft), t.shade('background', E.fade)),
    headline(t.copy('title'), 140, 112, t.color('text'), t.font('heading')),
    subline(t.copy('subline'), 290, t.color('secondary'), t.font('body')),
    laptopDevice(ink, 150, 560, 640),
    phoneDevice(ink, 770, 640, 170),
    star(16, 90, 450, 220, t.color('primary'), { innerRatio: 0.84, name: 'Sticker' }),
    text(t.copy('sticker'), 110, 515, 180, {
      fontFamily: t.font('heading'),
      fontSize: 36,
      fontWeight: 800,
      fill: t.color('background'),
      align: 'center',
      lineHeight: 1.05,
      rotation: -10,
    }),
    siteLine(t.copy('site'), 1220, t.color('secondary'), t.font('body')),
  ];
});

const planSpec = {
  colors: {
    background: { value: E.black, hint: 'Page; its clear shade is the outer edge of the glow' },
    primary: { value: E.glow, hint: 'Check icon and the glow behind the tablet' },
    text: { value: E.white, hint: 'Title and the perk line' },
    secondary: { value: E.grey, hint: 'Website at the bottom' },
    surface: { value: E.silver, hint: `Tablet stand; ${FRAME_HINT}` },
    accent: { value: E.sky, hint: ART_HINT },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Monthly\nPackage' },
    perk: { label: 'Perk', value: 'No hidden fees' },
    site: SITE_COPY,
  },
} as const satisfies ThemeSpec;

export const monthlyPlan = themed(W, H, planSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  glow(540, 860, 520, t.shade('primary', E.glowSoft), t.shade('background', E.fade)),
  headline(t.copy('title'), 120, 112, t.color('text'), t.font('heading')),
  icon('square-check', 368, 384, 48, t.color('primary'), { strokeWidth: 2.2 }),
  text(t.copy('perk'), 430, 388, 400, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  poly(
    [
      [500, 960],
      [580, 960],
      [640, 1080],
      [440, 1080],
    ],
    t.color('surface'),
    { name: 'Stand' },
  ),
  rect(400, 1072, 280, 22, t.color('surface'), { cornerRadius: 11, name: 'Stand foot' }),
  tablet(inkOf(t.shade), 230, 600, 620, 420, { rotation: -8 }),
  siteLine(t.copy('site'), 1230, t.color('secondary'), t.font('body')),
]);
