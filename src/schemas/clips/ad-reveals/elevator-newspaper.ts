import { z } from 'zod';
import { zColor, zImage, zMultiline, zSlider } from '../../control';
import { defaultMotion, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

const unit = (max = 1, step = 0.01) => zSlider({ min: 0, max, step });

const frames = (max = 184) => zSlider({ min: 0, max });

const size = () => zSlider({ min: 0.5, max: 1.5, step: 0.01 });

export const elevatorNewspaperSchema = z.object({
  masthead: z.object({
    brand: z.string(),
    edition: zMultiline(),
  }),
  cover: z.object({
    headline: zMultiline(),
    headlineSize: size(),
    photo: zImage(),
    photoFocus: unit(),
    photoZoom: zSlider({ min: 1, max: 2, step: 0.01 }),
    photoTint: unit(),
  }),
  story: z.object({
    headline: zMultiline(),
    headlineSize: size(),
    subhead: z.string(),
    teaserTitle: zMultiline(),
    teaser: zMultiline(),
    sidebarTitle: zMultiline(),
    sidebar: zMultiline(),
    photo: zImage(),
    caption: zMultiline(),
    footer: z.string(),
  }),
  ink: z.object({
    text: zColor(),
    band: zColor(),
    bandText: zColor(),
    coverText: zColor(),
    paper: zColor(),
    tint: zColor(),
  }),
  print: z.object({
    strength: unit(),
    shading: unit(),
    softness: unit(2, 0.05),
    paperTint: unit(),
  }),
  camera: z.object({
    zoom: zSlider({ min: 1, max: 2.6, step: 0.01 }),
    creep: zSlider({ min: 0, max: 0.4, step: 0.01 }),
    focusX: zSlider({ min: 0, max: 1080 }),
    focusY: zSlider({ min: 0, max: 1920 }),
    pushStart: frames(),
    pushFrames: zSlider({ min: 1, max: 100 }),
    pullStart: frames(),
    pullFrames: zSlider({ min: 1, max: 100 }),
  }),
  motion: motionSchema,
});

export type ElevatorNewspaperProps = z.infer<typeof elevatorNewspaperSchema>;

const BODY =
  'Our first store opens its doors with a collection made to be worn every day, layered, stacked and passed on. ' +
  'Come early for the opening rituals, the first pieces of the season and a small gift for the first guests. ' +
  'Every ring is finished by hand in our studio and polished to a soft glow.';

const SIDEBAR =
  'Join us for the opening evening with music, champagne and the first look at the new collection. ' +
  'Bring a friend and find the piece that feels like yours.';

export const elevatorNewspaperDefaults: ElevatorNewspaperProps = {
  masthead: {
    brand: 'MARIELLE',
    edition: 'BREAKING\nNEWS',
  },
  cover: {
    headline: 'COMING\nSOON',
    headlineSize: 1,
    photo: 'footage/elevator-newspaper/cover-photo.jpg',
    photoFocus: 0.95,
    photoZoom: 1.25,
    photoTint: 0,
  },
  story: {
    headline: 'NEW STORE',
    headlineSize: 1,
    subhead: 'JEWELRY FOR THE AUTHENTIC SOULS',
    teaserTitle: "DON'T MISS\nOUT",
    teaser: BODY,
    sidebarTitle: "YOU'RE\nINVITED",
    sidebar: SIDEBAR,
    photo: 'footage/elevator-newspaper/store-photo.jpg',
    caption: 'DISCOVER YOUR\nAUTHENTIC SOUL',
    footer: 'STAY TUNED',
  },
  ink: {
    text: '#23212b',
    band: '#23212b',
    bandText: '#f4f2f8',
    coverText: '#ffffff',
    paper: '#d9d3e6',
    tint: '#2a1020',
  },
  print: {
    strength: 0.96,
    shading: 0.7,
    softness: 0.5,
    paperTint: 0.55,
  },
  camera: {
    zoom: 1.5,
    creep: 0.04,
    focusX: 544,
    focusY: 965,
    pushStart: 34,
    pushFrames: 54,
    pullStart: 118,
    pullFrames: 34,
  },
  motion: defaultMotion({ exit: 'none', exitFrames: 0, float: 0 }),
};

export const elevatorNewspaperMeta: ClipMeta = {
  ...promoMeta,
  fps: 24,
  width: 1080,
  height: 1920,
  id: 'elevator-newspaper',
  title: 'Elevator Newspaper',
  description:
    'Elevator doors slide open on a woman hiding behind an open tabloid, the camera glides in to read its coming soon cover and new store page printed with your own copy, then eases back as the doors close.',
  category: 'ad-reveals',
  tags: ['footage', 'paper', 'reveal', 'headline', 'camera-move'],
  theme: 'light',
  source: 'src/compositions/scenes/ad-reveals/elevator-newspaper.tsx',
  durationInFrames: 185,
  posterFrame: 100,
};
