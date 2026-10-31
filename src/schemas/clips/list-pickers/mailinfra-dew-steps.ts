import { z } from 'zod';
import { zColor, zMultiline, zSlider } from '../../control';
import { darkLook, defaultMotion, lookSchema, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

export const DEW_STEP_ICONS = ['none', 'list', 'paper-plane', 'check', 'envelope'] as const;

export const DEW_STEP_EXTRAS = ['none', 'side-web', 'twin-drop', 'dew-beads'] as const;

export const DEW_TEXT_SIDES = ['left', 'right'] as const;

export const mailinfraDewStepsSchema = z.object({
  intro: z.object({
    title: zMultiline(),
    highlight: z.string(),
    showSpider: z.boolean(),
    showWeb: z.boolean(),
  }),
  steps: z
    .array(
      z.object({
        number: z.string(),
        title: z.string(),
        description: z.string(),
        icon: z.enum(DEW_STEP_ICONS),
        extra: z.enum(DEW_STEP_EXTRAS),
        textSide: z.enum(DEW_TEXT_SIDES),
      }),
    )
    .min(1)
    .max(4),
  endCard: z.object({
    brand: z.string(),
    tagline: z.string(),
    highlight: z.string(),
    url: z.string(),
    showMark: z.boolean(),
    showUrl: z.boolean(),
    markFrom: zColor(),
    markTo: zColor(),
    markGlyph: zColor(),
  }),
  drop: z.object({
    size: zSlider({ min: 120, max: 300 }),
    tint: zColor(),
    shine: zColor(),
    clarity: zSlider({ min: 0.2, max: 1, step: 0.01 }),
    glow: zSlider({ min: 0, max: 1, step: 0.01 }),
    swing: zSlider({ min: 0, max: 30, step: 0.5 }),
    magnify: zSlider({ min: 1, max: 1.3, step: 0.01 }),
    neck: zSlider({ min: 0, max: 120 }),
  }),
  number: z.object({
    gold: zColor(),
    size: zSlider({ min: 0.4, max: 1.4, step: 0.01 }),
    depth: zSlider({ min: 0, max: 30 }),
    iconColor: zColor(),
  }),
  silk: z.object({
    color: zColor(),
    width: zSlider({ min: 1, max: 6, step: 0.1 }),
    height: zSlider({ min: 120, max: 520 }),
    sag: zSlider({ min: 0, max: 120 }),
    beads: zSlider({ min: 0, max: 3, step: 0.1 }),
    webOpacity: zSlider({ min: 0, max: 1, step: 0.01 }),
    webSize: zSlider({ min: 200, max: 900 }),
  }),
  spider: z.object({
    color: zColor(),
    sheen: zColor(),
    size: zSlider({ min: 0.5, max: 2, step: 0.05 }),
    walkTo: zSlider({ min: 200, max: 1700 }),
  }),
  layout: z.object({
    whipDistance: zSlider({ min: 1200, max: 2600 }),
    dropInset: zSlider({ min: 400, max: 960 }),
    textGap: zSlider({ min: 40, max: 300 }),
    textWidth: zSlider({ min: 400, max: 900 }),
  }),
  type: z.object({
    titleSize: zSlider({ min: 60, max: 160 }),
    stepTitleSize: zSlider({ min: 36, max: 120 }),
    descriptionSize: zSlider({ min: 18, max: 48 }),
    brandSize: zSlider({ min: 48, max: 200 }),
    taglineSize: zSlider({ min: 20, max: 80 }),
    urlSize: zSlider({ min: 14, max: 48 }),
  }),
  timing: z.object({
    introFrames: zSlider({ min: 30, max: 150 }),
    whipFrames: zSlider({ min: 10, max: 40 }),
    stopFrames: zSlider({ min: 30, max: 140 }),
    pullBackFrames: zSlider({ min: 20, max: 80 }),
    motionBlur: zSlider({ min: 0, max: 1, step: 0.01 }),
    cameraDrift: zSlider({ min: 0, max: 1, step: 0.01 }),
  }),
  bokeh: z.object({
    blue: zColor(),
    violet: zColor(),
    count: zSlider({ min: 0, max: 40 }),
    size: zSlider({ min: 0.5, max: 2, step: 0.05 }),
    softness: zSlider({ min: 0, max: 40 }),
    strength: zSlider({ min: 0, max: 1, step: 0.01 }),
    parallax: zSlider({ min: 0, max: 0.6, step: 0.01 }),
  }),
  look: lookSchema,
  motion: motionSchema,
});

export type MailinfraDewStepsProps = z.infer<typeof mailinfraDewStepsSchema>;

export const mailinfraDewStepsDefaults: MailinfraDewStepsProps = {
  intro: {
    title: 'From zero to sending\nin 3 steps',
    highlight: 'sending',
    showSpider: true,
    showWeb: true,
  },
  steps: [
    {
      number: '01',
      title: 'Connect your lists',
      description: 'Import verified prospects or plug in your CRM.',
      icon: 'list',
      extra: 'side-web',
      textSide: 'right',
    },
    {
      number: '02',
      title: 'Configure & send',
      description: 'Connect by API or SMTP and start at safe volumes.',
      icon: 'paper-plane',
      extra: 'twin-drop',
      textSide: 'left',
    },
    {
      number: '03',
      title: 'Pay only if happy',
      description: 'Review your dashboard and pay for what you used.',
      icon: 'check',
      extra: 'dew-beads',
      textSide: 'right',
    },
  ],
  endCard: {
    brand: 'Mailinfra',
    tagline: 'Pay after 30 days',
    highlight: '30 days',
    url: 'mailinfra.co',
    showMark: true,
    showUrl: true,
    markFrom: '#4545ff',
    markTo: '#7c3aed',
    markGlyph: '#ffffff',
  },
  drop: {
    size: 190,
    tint: '#4545ff',
    shine: '#ffffff',
    clarity: 0.62,
    glow: 0.5,
    swing: 12,
    magnify: 1.08,
    neck: 34,
  },
  number: {
    gold: '#ffcf3a',
    size: 0.92,
    depth: 12,
    iconColor: '#f4ecd8',
  },
  silk: {
    color: '#f4ecd8',
    width: 2.4,
    height: 300,
    sag: 46,
    beads: 1,
    webOpacity: 0.5,
    webSize: 560,
  },
  spider: {
    color: '#1d1736',
    sheen: '#9b8cff',
    size: 1,
    walkTo: 820,
  },
  layout: {
    whipDistance: 1600,
    dropInset: 700,
    textGap: 110,
    textWidth: 740,
  },
  type: {
    titleSize: 104,
    stepTitleSize: 68,
    descriptionSize: 30,
    brandSize: 112,
    taglineSize: 40,
    urlSize: 24,
  },
  timing: {
    introFrames: 60,
    whipFrames: 20,
    stopFrames: 58,
    pullBackFrames: 36,
    motionBlur: 0.35,
    cameraDrift: 0.35,
  },
  bokeh: {
    blue: '#4545ff',
    violet: '#7c3aed',
    count: 18,
    size: 1,
    softness: 14,
    strength: 0.55,
    parallax: 0.22,
  },
  look: {
    ...darkLook('#ffcf3a'),
    background: '#16123c',
    backgroundEdge: '#05041a',
    ink: '#f4ecd8',
    muted: '#aaa6d8',
    grain: 0.05,
    spotlight: 0.5,
  },
  motion: defaultMotion({ enter: 'fade', enterFrames: 12, float: 0.06 }),
};

export const mailinfraDewStepsMeta: ClipMeta = {
  ...promoMeta,
  id: 'mailinfra-dew-steps',
  title: 'Mailinfra Dew Steps',
  description:
    'A whip camera runs along one dewy silk strand from drop to drop, each glossy drop holding a swinging gold step number, then pulls back to the brand lockup.',
  category: 'list-pickers',
  tags: ['list', 'camera-move', 'panorama', 'glow', 'end-card', 'logo'],
  theme: 'dark',
  source: 'src/compositions/scenes/list-pickers/mailinfra-dew-steps.tsx',
  durationInFrames: 390,
  posterFrame: 120,
};
