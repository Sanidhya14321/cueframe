import { z } from 'zod';
import { zColor, zMultiline, zSlider } from '../../control';
import { defaultMotion, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

export const THREAD_SIDE_WEBS = ['none', 'left', 'right'] as const;

export const THREAD_TEXT_SIDES = ['left', 'right'] as const;

const frames = (min: number, max: number) => zSlider({ min, max });

const unit = (min: number, max: number, step = 0.01) => zSlider({ min, max, step });

export const threadTitleSchema = z.object({
  top: z.string(),
  bottom: z.string(),
  hold: frames(20, 180),
  tilt: unit(-12, 12, 0.5),
  spider: z.boolean(),
  spiderX: frames(-520, 520),
  spiderY: frames(-520, 520),
  sideWeb: z.enum(THREAD_SIDE_WEBS),
  caught: zSlider({ min: 0, max: 3 }),
  dew: z.boolean(),
  goldDots: z.boolean(),
});

export type ThreadTitle = z.infer<typeof threadTitleSchema>;

export const threadOpeningSchema = z.object({
  showLabel: z.boolean(),
  label: z.string(),
  headline: zMultiline(),
  highlight: z.string(),
  headlineSize: frames(56, 150),
  side: z.enum(THREAD_TEXT_SIDES),
  textY: frames(80, 1400),
  labelSize: frames(16, 80),
  logoSize: frames(20, 140),
  gap: frames(20, 300),
  margin: frames(0, 300),
  spiderStop: frames(300, 1500),
  dropFrames: frames(8, 60),
  hold: frames(20, 120),
});

export type ThreadOpening = z.infer<typeof threadOpeningSchema>;

export const threadTitleStyleSchema = z.object({
  topSize: frames(70, 220),
  bottomSize: frames(40, 180),
  maxWidth: frames(500, 1040),
  lineGap: frames(-40, 60),
  depth: frames(0, 40),
  swing: unit(0, 20, 0.5),
  centerY: frames(500, 1400),
});

export type ThreadTitleStyle = z.infer<typeof threadTitleStyleSchema>;

export const threadWebSchema = z.object({
  threadX: frames(120, 960),
  threadWidth: unit(1, 8, 0.5),
  glint: z.boolean(),
  strands: zSlider({ min: 3, max: 15 }),
  reach: frames(80, 500),
  silk: zColor(),
  envelope: zColor(),
  seal: zColor(),
  spiderSize: unit(0.5, 2, 0.05),
  crawl: frames(0, 120),
  spiderBody: zColor(),
  spiderSheen: zColor(),
  spiderMark: zColor(),
});

export type ThreadWeb = z.infer<typeof threadWebSchema>;

export const threadCameraSchema = z.object({
  whipFrames: frames(8, 40),
  diveFrames: frames(10, 60),
  spacing: frames(1920, 3600),
  blur: unit(0, 1.5, 0.05),
  parallax: unit(0, 1, 0.05),
});

export type ThreadCamera = z.infer<typeof threadCameraSchema>;

export const threadEndCardSchema = z.object({
  showLogo: z.boolean(),
  brandName: z.string(),
  brandSize: frames(48, 180),
  statement: zMultiline(),
  highlight: z.string(),
  statementSize: frames(28, 110),
  tagline: z.string(),
  taglineSize: frames(40, 180),
  showButton: z.boolean(),
  buttonLabel: z.string(),
  buttonSize: frames(24, 70),
  showSpider: z.boolean(),
  webY: frames(120, 900),
  webSize: frames(160, 520),
  webFrames: frames(10, 90),
  hold: frames(60, 300),
  contentY: frames(500, 1500),
  stagger: frames(0, 20),
});

export type ThreadEndCard = z.infer<typeof threadEndCardSchema>;

export const threadColorsSchema = z.object({
  titleFace: zColor(),
  titleHighlight: zColor(),
  titleSide: zColor(),
  titleDepth: zColor(),
  titleShadow: zColor(),
  accent: zColor(),
  text: zColor(),
  logo: zColor(),
  logoEnd: zColor(),
  logoMark: zColor(),
  button: zColor(),
  buttonEnd: zColor(),
  buttonText: zColor(),
  arrow: zColor(),
  arrowIcon: zColor(),
});

export type ThreadColors = z.infer<typeof threadColorsSchema>;

export const threadLookSchema = z.object({
  showBackdrop: z.boolean(),
  background: zColor(),
  backgroundEdge: zColor(),
  bokehViolet: zColor(),
  bokehBlue: zColor(),
  bokehGold: zColor(),
  bokeh: unit(0, 2, 0.05),
  vignette: unit(0, 1),
});

export type ThreadLook = z.infer<typeof threadLookSchema>;

export const mailinfraThreadFeaturesSchema = z.object({
  opening: threadOpeningSchema,
  titles: z.array(threadTitleSchema).min(1).max(6),
  titleStyle: threadTitleStyleSchema,
  web: threadWebSchema,
  camera: threadCameraSchema,
  endCard: threadEndCardSchema,
  colors: threadColorsSchema,
  look: threadLookSchema,
  motion: motionSchema,
});

export type MailinfraThreadFeaturesProps = z.infer<typeof mailinfraThreadFeaturesSchema>;

const title = (
  top: string,
  bottom: string,
  overrides: Omit<ThreadTitle, 'top' | 'bottom' | 'hold' | 'spider'>,
): ThreadTitle => ({ top, bottom, hold: 62, spider: true, ...overrides });

export const mailinfraThreadFeaturesDefaults: MailinfraThreadFeaturesProps = {
  opening: {
    showLabel: true,
    label: 'Mailinfra',
    headline: 'Built to\nland.',
    highlight: 'land',
    headlineSize: 128,
    side: 'right',
    textY: 580,
    labelSize: 36,
    logoSize: 54,
    gap: 70,
    margin: 70,
    spiderStop: 760,
    dropFrames: 18,
    hold: 40,
  },
  titles: [
    title('100 INBOXES', 'FREE', {
      tilt: -5,
      spiderX: 290,
      spiderY: 210,
      sideWeb: 'none',
      caught: 0,
      dew: true,
      goldDots: false,
    }),
    title('99.9%', 'DELIVERABILITY', {
      tilt: 4,
      spiderX: -170,
      spiderY: 290,
      sideWeb: 'right',
      caught: 2,
      dew: false,
      goldDots: true,
    }),
    title('LIVE IN', '5 MINUTES', {
      tilt: -3,
      spiderX: 150,
      spiderY: 260,
      sideWeb: 'left',
      caught: 1,
      dew: true,
      goldDots: false,
    }),
    title('PAY AFTER', '30 DAYS', {
      tilt: 5,
      spiderX: -130,
      spiderY: -300,
      sideWeb: 'none',
      caught: 2,
      dew: false,
      goldDots: true,
    }),
  ],
  titleStyle: {
    topSize: 150,
    bottomSize: 104,
    maxWidth: 940,
    lineGap: 4,
    depth: 18,
    swing: 7,
    centerY: 900,
  },
  web: {
    threadX: 540,
    threadWidth: 3,
    glint: true,
    strands: 9,
    reach: 270,
    silk: '#efe6cf',
    envelope: '#fbf6ea',
    seal: '#ffd700',
    spiderSize: 1.5,
    crawl: 30,
    spiderBody: '#1d1840',
    spiderSheen: '#4b3aa8',
    spiderMark: '#ffd700',
  },
  camera: {
    whipFrames: 16,
    diveFrames: 22,
    spacing: 2200,
    blur: 0.8,
    parallax: 0.55,
  },
  endCard: {
    showLogo: true,
    brandName: 'Mailinfra',
    brandSize: 120,
    statement: 'Every inbox warmed\nwith purpose',
    highlight: 'purpose',
    statementSize: 66,
    tagline: 'never by chance.',
    taglineSize: 118,
    showButton: true,
    buttonLabel: 'mailinfra.co',
    buttonSize: 48,
    showSpider: true,
    webY: 380,
    webSize: 330,
    webFrames: 34,
    hold: 136,
    contentY: 860,
    stagger: 6,
  },
  colors: {
    titleFace: '#ffd700',
    titleHighlight: '#fff3a8',
    titleSide: '#d99a00',
    titleDepth: '#6e3f00',
    titleShadow: '#04021299',
    accent: '#ffd700',
    text: '#f6f1e4',
    logo: '#4040ff',
    logoEnd: '#7c3aed',
    logoMark: '#f6f1e4',
    button: '#4040ff',
    buttonEnd: '#7c3aed',
    buttonText: '#ffffff',
    arrow: '#ffd700',
    arrowIcon: '#1a1a1a',
  },
  look: {
    showBackdrop: true,
    background: '#120d3a',
    backgroundEdge: '#05041a',
    bokehViolet: '#7c3aed',
    bokehBlue: '#4040ff',
    bokehGold: '#ffd700',
    bokeh: 1,
    vignette: 0.6,
  },
  motion: defaultMotion({ exit: 'none', float: 0 }),
};

export const mailinfraThreadFeaturesMeta: ClipMeta = {
  ...promoMeta,
  width: 1080,
  height: 1920,
  id: 'mailinfra-thread-features',
  title: 'Mailinfra Thread Features',
  description:
    'A spider abseils down a glinting silk thread, then the camera whips down it past four gold extruded feature titles wrapped in web cocoons, and dives to an orb web over a Mailinfra end card.',
  category: 'ad-reveals',
  tags: ['3d', 'headline', 'camera-move', 'reveal', 'logo', 'cta', 'end-card', 'glow'],
  theme: 'dark',
  source: 'src/compositions/scenes/ad-reveals/mailinfra-thread-features.tsx',
  durationInFrames: 510,
  posterFrame: 150,
};
