import { z } from 'zod';
import { zColor, zMultiline, zSlider } from '../../control';
import { darkLook, defaultMotion, lookSchema, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

const frames = (max = 360) => zSlider({ min: 0, max });

const pixels = (min: number, max: number) => zSlider({ min, max });

const unit = (max = 1, step = 0.01) => zSlider({ min: 0, max, step });

export const SPIDER_DROP_SIDES = ['left', 'right'] as const;

export const spiderDropFloorSchema = z.object({
  label: z.string(),
  crossed: z.boolean(),
  color: zColor(),
});

export const mailinfraSpiderDropSchema = z.object({
  headline: z.object({
    text: zMultiline(),
    highlight: z.string(),
    size: pixels(48, 160),
    y: pixels(200, 1700),
    start: frames(120),
  }),
  floors: z.array(spiderDropFloorSchema).max(4),
  signs: z.object({
    text: zColor(),
    textSize: pixels(32, 160),
    width: pixels(240, 900),
    height: pixels(100, 400),
    depth: pixels(0, 40),
    firstSide: z.enum(SPIDER_DROP_SIDES),
    overlap: pixels(0, 200),
    y: pixels(100, 1400),
    hang: pixels(20, 300),
    swing: zSlider({ min: 0, max: 30, step: 0.5 }),
    crossedDim: unit(),
    strike: zColor(),
    dust: unit(),
    beam: z.boolean(),
    beamColor: zColor(),
    cobwebs: unit(),
  }),
  drop: z.object({
    start: frames(240),
    floorFrames: zSlider({ min: 16, max: 120 }),
    landingFrames: zSlider({ min: 20, max: 120 }),
    floorGap: pixels(1000, 4000),
    landingGap: pixels(600, 4000),
    slowAtSigns: zSlider({ min: 0, max: 0.95, step: 0.01 }),
    spiderY: pixels(300, 1400),
    blurSamples: zSlider({ min: 1, max: 48, step: 1 }),
    shutter: unit(),
  }),
  spider: z.object({
    show: z.boolean(),
    size: zSlider({ min: 0.5, max: 2.5, step: 0.05 }),
    body: zColor(),
    sheen: zColor(),
    eyes: zColor(),
    restY: pixels(150, 1000),
    arriveFrames: frames(120),
    sway: pixels(0, 40),
    bob: pixels(0, 30),
  }),
  silk: z.object({
    color: zColor(),
    width: zSlider({ min: 1, max: 10, step: 0.5 }),
  }),
  envelope: z.object({
    paper: zColor(),
    fold: zColor(),
    seal: zColor(),
  }),
  inbox: z.object({
    label: z.string(),
    color: zColor(),
    labelColor: zColor(),
    glow: unit(),
    y: pixels(600, 1600),
    width: pixels(300, 900),
    releaseAfter: frames(80),
    slideFrames: zSlider({ min: 4, max: 60 }),
  }),
  badge: z.object({
    show: z.boolean(),
    color: zColor(),
    ring: zColor(),
    tick: zColor(),
    size: pixels(40, 200),
    delay: frames(120),
  }),
  stat: z.object({
    value: z.string(),
    caption: z.string(),
    face: zColor(),
    side: zColor(),
    captionColor: zColor(),
    size: pixels(80, 400),
    captionSize: pixels(16, 100),
    y: pixels(100, 1400),
    depth: pixels(0, 40),
    swing: zSlider({ min: 0, max: 40, step: 0.5 }),
    delay: frames(120),
  }),
  climb: z.object({
    delay: frames(120),
    frames: zSlider({ min: 10, max: 120 }),
  }),
  endCard: z.object({
    show: z.boolean(),
    brand: z.string(),
    tagline: z.string(),
    url: z.string(),
    markColor: zColor(),
    markInk: zColor(),
    pillColor: zColor(),
    pillText: zColor(),
    brandSize: pixels(40, 160),
    taglineSize: pixels(16, 80),
    y: pixels(900, 1800),
    delay: frames(120),
  }),
  bokeh: z.object({
    violet: zColor(),
    blue: zColor(),
    count: zSlider({ min: 0, max: 40, step: 1 }),
    size: pixels(40, 400),
    blur: pixels(0, 80),
    opacity: unit(),
    parallax: unit(),
    drift: unit(4, 0.05),
    seed: zSlider({ min: 1, max: 99, step: 1 }),
  }),
  look: lookSchema,
  motion: motionSchema,
});

export type MailinfraSpiderDropProps = z.infer<typeof mailinfraSpiderDropSchema>;

export type SpiderDropFloor = z.infer<typeof spiderDropFloorSchema>;

const PRIMARY = '#4040ff';
const ACCENT = '#7c3aed';
const GOLD = '#ffd700';
const CREAM = '#f3ead6';
const INK = '#f5f3ff';

export const mailinfraSpiderDropDefaults: MailinfraSpiderDropProps = {
  headline: {
    text: 'Where does your\ncold email land?',
    highlight: 'land',
    size: 104,
    y: 1180,
    start: 12,
  },
  floors: [
    { label: 'Promotions', crossed: false, color: '#3d4566' },
    { label: 'Spam', crossed: true, color: '#6e3042' },
    { label: 'Blocked', crossed: true, color: '#363b50' },
  ],
  signs: {
    text: INK,
    textSize: 96,
    width: 620,
    height: 210,
    depth: 16,
    firstSide: 'right',
    overlap: 44,
    y: 400,
    hang: 110,
    swing: 9,
    crossedDim: 0.75,
    strike: CREAM,
    dust: 0.5,
    beam: true,
    beamColor: '#211c44',
    cobwebs: 0.5,
  },
  drop: {
    start: 66,
    floorFrames: 40,
    landingFrames: 48,
    floorGap: 1920,
    landingGap: 1000,
    slowAtSigns: 0.86,
    spiderY: 860,
    blurSamples: 32,
    shutter: 0.5,
  },
  spider: {
    show: true,
    size: 1.75,
    body: '#251d4d',
    sheen: ACCENT,
    eyes: '#e9e4ff',
    restY: 400,
    arriveFrames: 46,
    sway: 8,
    bob: 10,
  },
  silk: { color: CREAM, width: 3 },
  envelope: { paper: CREAM, fold: '#c9bc9c', seal: ACCENT },
  inbox: {
    label: 'Inbox',
    color: PRIMARY,
    labelColor: '#ffffff',
    glow: 0.8,
    y: 1010,
    width: 580,
    releaseAfter: 12,
    slideFrames: 20,
  },
  badge: {
    show: true,
    color: PRIMARY,
    ring: CREAM,
    tick: '#ffffff',
    size: 110,
    delay: 24,
  },
  stat: {
    value: '99.9%',
    caption: 'inbox placement',
    face: GOLD,
    side: '#a86d00',
    captionColor: '#c4bde6',
    size: 270,
    captionSize: 46,
    y: 190,
    depth: 18,
    swing: 16,
    delay: 40,
  },
  climb: { delay: 14, frames: 34 },
  endCard: {
    show: true,
    brand: 'Mailinfra',
    tagline: 'Pay after 30 days. No credit card.',
    url: 'mailinfra.co',
    markColor: PRIMARY,
    markInk: '#ffffff',
    pillColor: PRIMARY,
    pillText: '#ffffff',
    brandSize: 96,
    taglineSize: 42,
    y: 1450,
    delay: 56,
  },
  bokeh: {
    violet: ACCENT,
    blue: '#3030d8',
    count: 20,
    size: 190,
    blur: 34,
    opacity: 0.4,
    parallax: 0.18,
    drift: 1.6,
    seed: 7,
  },
  look: {
    ...darkLook(GOLD),
    background: '#120e2e',
    backgroundEdge: '#05041a',
    ink: INK,
    muted: '#b9b2dd',
  },
  motion: defaultMotion({ exit: 'none', exitFrames: 0, float: 0 }),
};

export const mailinfraSpiderDropMeta: ClipMeta = {
  ...promoMeta,
  width: 1080,
  height: 1920,
  id: 'mailinfra-spider-drop',
  title: 'Spider Courier Drop',
  description:
    'A spider holding a sealed envelope drops on its silk line while the camera whips down past dusty cobwebbed Promotions, Spam and Blocked signs, lowers the envelope into a glowing blue inbox tray, a gold 99.9% swings in and an end card with the brand settles.',
  category: 'ad-reveals',
  tags: ['drop', 'camera-move', 'reveal', 'headline', 'counter', 'end-card', 'logo', 'cta'],
  theme: 'dark',
  source: 'src/compositions/scenes/ad-reveals/mailinfra-spider-drop.tsx',
  durationInFrames: 360,
  posterFrame: 340,
};
