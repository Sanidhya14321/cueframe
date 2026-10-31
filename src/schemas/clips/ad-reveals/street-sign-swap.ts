import { z } from 'zod';
import { zColor, zMultiline, zSlider } from '../../control';
import { defaultMotion, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

const unit = (max = 1, step = 0.01) => zSlider({ min: 0, max, step });

const size = () => zSlider({ min: 0.5, max: 2.4, step: 0.01 });

export const streetSignSwapSchema = z.object({
  question: z.object({
    opening: zMultiline(),
    brand: z.string(),
    closing: zMultiline(),
    size: size(),
    left: unit(),
    top: unit(),
  }),
  answer: z.object({
    line: z.string(),
    address: z.string(),
    size: size(),
    top: unit(),
  }),
  ink: z.object({
    question: zColor(),
    questionBrand: zColor(),
    answer: zColor(),
    board: zColor(),
    border: zColor(),
  }),
  camera: z.object({
    zoom: zSlider({ min: 1, max: 2, step: 0.01 }),
    follow: unit(),
    headroom: zSlider({ min: -0.2, max: 0.3, step: 0.01 }),
  }),
  print: z.object({
    strength: unit(),
    shading: unit(),
    softness: unit(2, 0.05),
    border: unit(0.1, 0.002),
  }),
  motion: motionSchema,
});

export type StreetSignSwapProps = z.infer<typeof streetSignSwapSchema>;

export const streetSignSwapDefaults: StreetSignSwapProps = {
  question: {
    opening: 'when is the',
    brand: 'maison figue',
    closing: 'website\nlaunching ?',
    size: 1.75,
    left: 0.1,
    top: 0.34,
  },
  answer: {
    line: "it's live now",
    address: 'maisonfigue.com',
    size: 1.45,
    top: 0.47,
  },
  ink: {
    question: '#1a1a1a',
    questionBrand: '#1a1a1a',
    answer: '#ffffff',
    board: '#4d6a3d',
    border: '#f3f3ee',
  },
  camera: {
    zoom: 1.12,
    follow: 0,
    headroom: 0,
  },
  print: {
    strength: 0.97,
    shading: 0.8,
    softness: 0.6,
    border: 0,
  },
  motion: defaultMotion({ exit: 'none', exitFrames: 0, float: 0 }),
};

export const streetSignSwapMeta: ClipMeta = {
  ...promoMeta,
  fps: 24,
  width: 1080,
  height: 1920,
  id: 'street-sign-swap',
  title: 'Street Sign Swap',
  description:
    'In one continuous take on a rainy Paris crosswalk, a woman walks past holding a white board asking when your website launches, then a woman in a green jersey walks in holding up an olive board that answers it is live now with your address.',
  category: 'ad-reveals',
  tags: ['footage', 'reveal', 'headline', 'text', 'cta'],
  theme: 'light',
  source: 'src/compositions/scenes/ad-reveals/street-sign-swap.tsx',
  durationInFrames: 171,
  posterFrame: 140,
};
