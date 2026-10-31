import { z } from 'zod';
import { zColor, zMultiline, zSlider } from '../../control';
import { inviteScriptFontSchema, inviteSerifFontSchema } from '../../invite-common';
import { defaultMotion, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

export const ITINERARY_SCENES = [
  'pavilions',
  'haldi-lounge',
  'dance-floor',
  'mandap',
  'garden-dinner',
] as const;

export type ItineraryScene = (typeof ITINERARY_SCENES)[number];

const pageLookShape = {
  scene: z.enum(ITINERARY_SCENES),
  sky: zColor(),
  horizon: zColor(),
  titleColor: zColor(),
  textColor: zColor(),
  night: zSlider({ min: 0, max: 0.7, step: 0.01 }),
};

const pageLookSchema = z.object(pageLookShape);

export type ItineraryPageLook = z.infer<typeof pageLookSchema>;

export const itineraryEventSchema = z.object({
  name: zMultiline(),
  date: z.string(),
  venue: zMultiline(),
  schedule: zMultiline(),
  ...pageLookShape,
});

export type ItineraryEvent = z.infer<typeof itineraryEventSchema>;

export const weddingItineraryPagesSchema = z.object({
  cover: z.object({
    monogram: z.string(),
    names: z.string(),
    dates: zMultiline(),
    hashtag: z.string(),
    ...pageLookShape,
  }),
  families: z.object({
    hosts: zMultiline(),
    invite: zMultiline(),
    bride: z.string(),
    brideParents: z.string(),
    joiner: z.string(),
    groom: z.string(),
    groomParents: z.string(),
  }),
  events: z.array(itineraryEventSchema).min(1).max(3),
  closing: z.object({
    message: zMultiline(),
    visit: zMultiline(),
    rsvp: zMultiline(),
    ...pageLookShape,
  }),
  greenery: z.object({
    dark: zColor(),
    mid: zColor(),
    light: zColor(),
    mist: zColor(),
    lawn: zColor(),
    trunk: zColor(),
  }),
  blooms: z.object({
    rose: zColor(),
    blossom: zColor(),
    marigold: zColor(),
  }),
  stone: z.object({
    cream: zColor(),
    shade: zColor(),
    marble: zColor(),
  }),
  decor: z.object({
    sofa: zColor(),
    gift: zColor(),
    giftAlt: zColor(),
    drape: zColor(),
    carpet: zColor(),
    cloth: zColor(),
    wood: zColor(),
    crystal: zColor(),
    glow: zColor(),
    floor: zColor(),
  }),
  type: z.object({
    scriptFont: inviteScriptFontSchema,
    serifFont: inviteSerifFontSchema,
    titleSize: zSlider({ min: 60, max: 220 }),
    namesSize: zSlider({ min: 50, max: 200 }),
    scriptSize: zSlider({ min: 40, max: 180 }),
    monogramSize: zSlider({ min: 40, max: 220 }),
    lineSize: zSlider({ min: 18, max: 64 }),
    smallSize: zSlider({ min: 16, max: 56 }),
    boldWeight: zSlider({ min: 400, max: 700, step: 100 }),
    regularWeight: zSlider({ min: 400, max: 700, step: 100 }),
    tracking: zSlider({ min: 0, max: 0.3, step: 0.005 }),
    lineSpacing: zSlider({ min: 1, max: 2.4, step: 0.05 }),
  }),
  wreath: z.object({
    radius: zSlider({ min: 70, max: 260 }),
    flowers: zSlider({ min: 0, max: 14 }),
    leaves: zSlider({ min: 0, max: 60 }),
    flourish: z.boolean(),
    drawFrames: zSlider({ min: 6, max: 90 }),
  }),
  layout: z.object({
    textTop: zSlider({ min: 40, max: 900 }),
    textBottom: zSlider({ min: 400, max: 1500 }),
    blockGap: zSlider({ min: 0, max: 120 }),
    horizon: zSlider({ min: -120, max: 300 }),
  }),
  scenery: z.object({
    build: zSlider({ min: 0, max: 2, step: 0.05 }),
    settle: zSlider({ min: 0, max: 1, step: 0.05 }),
    drift: zSlider({ min: 0, max: 200 }),
    sway: zSlider({ min: 0, max: 3, step: 0.05 }),
    twinkle: zSlider({ min: 0, max: 1, step: 0.05 }),
    fireworks: z.boolean(),
  }),
  timing: z.object({
    coverFrames: zSlider({ min: 120, max: 480 }),
    familyFrames: zSlider({ min: 150, max: 600 }),
    eventFrames: zSlider({ min: 150, max: 480 }),
    fadeFrames: zSlider({ min: 6, max: 40 }),
    titleDelay: zSlider({ min: 0, max: 60 }),
    typeDelay: zSlider({ min: 0, max: 90 }),
    charFrames: zSlider({ min: 0.5, max: 4, step: 0.05 }),
    blockStagger: zSlider({ min: 0, max: 60 }),
    blockFrames: zSlider({ min: 8, max: 40 }),
    eraseFrames: zSlider({ min: 8, max: 60 }),
    buildFrames: zSlider({ min: 30, max: 180 }),
  }),
  look: z.object({
    showBackdrop: z.boolean(),
    wash: zSlider({ min: 0, max: 0.6, step: 0.01 }),
  }),
  motion: motionSchema,
});

export type WeddingItineraryPagesProps = z.infer<typeof weddingItineraryPagesSchema>;

export const weddingItineraryPagesDefaults: WeddingItineraryPagesProps = {
  cover: {
    monogram: 'ak',
    names: 'Anaya & Kabir',
    dates: '21st, 22nd & 23rd\nNovember 2026',
    // biome-ignore lint/security/noSecrets: a wedding hashtag, not a secret
    hashtag: '#KabirFoundHisAnaya',
    scene: 'pavilions',
    sky: '#a9dcdc',
    horizon: '#e2f3ef',
    titleColor: '#24474f',
    textColor: '#2b4d55',
    night: 0,
  },
  families: {
    hosts:
      'Mrs Asha & Mr Rajan Mehra\nMrs Lata & Mr Suresh Kapoor\nMrs Ritu & Mr Vikram Mehra\nMrs Nandini & Mr Arjun Kapoor',
    invite: 'Joyfully invite you to the wedding\ncelebration of their children',
    bride: 'Anaya',
    brideParents: 'Daughter of Ritu & Vikram Mehra',
    joiner: 'and',
    groom: 'Kabir',
    groomParents: 'Son of Nandini & Arjun Kapoor',
  },
  events: [
    {
      name: 'Haldi',
      date: 'Saturday | 21 November | 2026',
      venue: 'The Marigold Courtyard\nMehra Haveli, Civil Lines\nJaipur, Rajasthan',
      schedule: 'Haldi | 10:00 am\nLunch | 1:00 pm',
      scene: 'haldi-lounge',
      sky: '#f6edc4',
      horizon: '#fbf5dc',
      titleColor: '#3b2433',
      textColor: '#4a3a2b',
      night: 0,
    },
    {
      name: 'Sangeet',
      date: 'Sunday | 22 November | 2026',
      venue: 'The Lantern Lawns\nAmber View Gardens\nAmer Road, Jaipur',
      schedule: 'Music, dance & dinner\n7:00 pm to 11:00 pm',
      scene: 'dance-floor',
      sky: '#0b2236',
      horizon: '#1f5361',
      titleColor: '#f6ecd8',
      textColor: '#eee6d6',
      night: 0.34,
    },
    {
      name: 'Wedding\n&\nReception',
      date: 'Monday | 23 November | 2026',
      venue: 'The Rose Terrace, Amber View\nGardens, Amer Road, Jaipur',
      schedule: 'Baraat | 3:00 pm\nPheras | 5:00 pm\nCocktails | 7:00 pm\nReception | 8:00 pm',
      scene: 'mandap',
      sky: '#f1dcd9',
      horizon: '#f7ebe7',
      titleColor: '#4b2142',
      textColor: '#4a3045',
      night: 0,
    },
  ],
  closing: {
    message:
      "We can't wait to share these\ndays of joy with you. Your\nblessings and presence\nmean the world to us",
    visit: 'Every detail lives at\nanayaandkabir.com',
    rsvp: 'Kindly RSVP by\n1 October 2026',
    scene: 'garden-dinner',
    sky: '#27354d',
    horizon: '#566b80',
    titleColor: '#f5f1e8',
    textColor: '#e9edf1',
    night: 0.2,
  },
  greenery: {
    dark: '#1d4a2f',
    mid: '#3e7d3a',
    light: '#8cbc4c',
    mist: '#8fb5ac',
    lawn: '#5aae2e',
    trunk: '#6a4f37',
  },
  blooms: {
    rose: '#d6426c',
    blossom: '#f3a3b6',
    marigold: '#f4a514',
  },
  stone: {
    cream: '#e2d0a2',
    shade: '#a99466',
    marble: '#f2eee3',
  },
  decor: {
    sofa: '#2e4d68',
    gift: '#e0467a',
    giftAlt: '#f2b41c',
    drape: '#ea6430',
    carpet: '#c4122d',
    cloth: '#f0896f',
    wood: '#9b6b40',
    crystal: '#eef3f8',
    glow: '#ffe6a0',
    floor: '#121212',
  },
  type: {
    scriptFont: 'great-vibes',
    serifFont: 'cinzel',
    titleSize: 132,
    namesSize: 108,
    scriptSize: 96,
    monogramSize: 120,
    lineSize: 37,
    smallSize: 30,
    boldWeight: 700,
    regularWeight: 400,
    tracking: 0.04,
    lineSpacing: 1.45,
  },
  wreath: {
    radius: 150,
    flowers: 8,
    leaves: 44,
    flourish: true,
    drawFrames: 18,
  },
  layout: {
    textTop: 110,
    textBottom: 1300,
    blockGap: 34,
    horizon: 0,
  },
  scenery: {
    build: 1,
    settle: 0.35,
    drift: 60,
    sway: 1,
    twinkle: 0.9,
    fireworks: true,
  },
  timing: {
    coverFrames: 236,
    familyFrames: 394,
    eventFrames: 265,
    fadeFrames: 22,
    titleDelay: 16,
    typeDelay: 40,
    charFrames: 1.6,
    blockStagger: 16,
    blockFrames: 24,
    eraseFrames: 28,
    buildFrames: 110,
  },
  look: {
    showBackdrop: true,
    wash: 0.22,
  },
  motion: defaultMotion({ exit: 'fade', exitFrames: 16 }),
};

export const weddingItineraryPagesMeta: ClipMeta = {
  ...promoMeta,
  width: 1080,
  height: 1920,
  id: 'wedding-itinerary-pages',
  title: 'Wedding Itinerary Pages',
  description:
    'A vertical wedding invite painted as a Mughal garden: a floral monogram cover that builds up from the lawn, a families page, one painted scene per event and a night garden RSVP, with every line typing on and titles swept in by a block.',
  category: 'invitations',
  tags: [
    'wedding',
    'invitation',
    'typing',
    'floral',
    'monogram',
    'reveal',
    'crossfade',
    'camera-move',
  ],
  theme: 'light',
  source: 'src/compositions/scenes/invitations/wedding-itinerary-pages.tsx',
  durationInFrames: 1650,
  posterFrame: 180,
};
