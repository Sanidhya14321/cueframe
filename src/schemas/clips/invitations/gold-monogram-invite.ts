import { z } from 'zod';
import { zColor, zMultiline, zSlider } from '../../control';
import { inviteScriptFontSchema, inviteSerifFontSchema } from '../../invite-common';
import { defaultMotion, motionSchema, promoMeta } from '../../promo-common';
import type { ClipMeta } from '../../registry';

const goldEventSchema = z.object({
  title: z.string(),
  date: z.string(),
  time: z.string(),
  venue: z.string(),
});

export type GoldEvent = z.infer<typeof goldEventSchema>;

export const goldMonogramInviteSchema = z.object({
  quote: z.object({
    firstCaps: z.string(),
    firstScript: z.string(),
    secondScript: z.string(),
    secondCaps: z.string(),
    paperLead: z.string(),
    paperScript: z.string(),
    capsSize: zSlider({ min: 24, max: 80 }),
    scriptSize: zSlider({ min: 36, max: 120 }),
    paperScriptSize: zSlider({ min: 60, max: 220 }),
    wordStagger: zSlider({ min: 4, max: 24 }),
  }),
  title: z.object({
    eyebrow: z.string(),
    word: z.string(),
    tail: z.string(),
    size: zSlider({ min: 100, max: 300 }),
    flourish: z.boolean(),
  }),
  monogram: z.object({
    first: z.string(),
    second: z.string(),
    names: z.string(),
    showHeart: z.boolean(),
    size: zSlider({ min: 240, max: 700 }),
    namesSize: zSlider({ min: 36, max: 110 }),
    glint: z.boolean(),
  }),
  stage: z.object({
    veil: z.boolean(),
    sparklers: zSlider({ min: 0, max: 12 }),
    bursts: zSlider({ min: 0, max: 10 }),
    dust: zSlider({ min: 0, max: 120 }),
    reflection: zSlider({ min: 0, max: 0.8, step: 0.01 }),
  }),
  events: z.array(goldEventSchema).min(3).max(3),
  gem: z.object({
    stone: zColor(),
    facet: zColor(),
    sparkle: zColor(),
  }),
  eventText: z.object({
    titleSize: zSlider({ min: 40, max: 140 }),
    detailSize: zSlider({ min: 18, max: 60 }),
  }),
  saveTheDate: z.object({
    text: zMultiline(),
    size: zSlider({ min: 80, max: 240 }),
    sprigs: z.boolean(),
  }),
  sketch: z.object({
    pencil: zColor(),
    chalk: zColor(),
    lineWidth: zSlider({ min: 1, max: 5, step: 0.1 }),
    danceSpeed: zSlider({ min: 0.25, max: 2, step: 0.05 }),
  }),
  fonts: z.object({
    script: inviteScriptFontSchema,
    serif: inviteSerifFontSchema,
  }),
  gold: z.object({
    highlight: zColor(),
    light: zColor(),
    mid: zColor(),
    deep: zColor(),
  }),
  text: z.object({
    cream: zColor(),
    ink: zColor(),
  }),
  paper: z.object({
    wall: zColor(),
    floor: zColor(),
  }),
  background: z.object({
    show: z.boolean(),
    night: zColor(),
    panel: zColor(),
    panelEdge: zColor(),
  }),
  motion: motionSchema,
});

export type GoldMonogramInviteProps = z.infer<typeof goldMonogramInviteSchema>;

export const goldMonogramInviteDefaults: GoldMonogramInviteProps = {
  quote: {
    firstCaps: 'Two hearts,',
    firstScript: 'one quiet promise',
    secondScript: 'and',
    secondCaps: 'a story to write',
    paperLead: 'together,',
    paperScript: 'forever...',
    capsSize: 40,
    scriptSize: 62,
    paperScriptSize: 132,
    wordStagger: 12,
  },
  title: {
    eyebrow: 'Celebrate the',
    word: 'Wedding',
    tail: 'of two families',
    size: 190,
    flourish: true,
  },
  monogram: {
    first: 'S',
    second: 'R',
    names: 'Sana & Reyansh',
    showHeart: true,
    size: 520,
    namesSize: 66,
    glint: true,
  },
  stage: {
    veil: true,
    sparklers: 8,
    bursts: 6,
    dust: 60,
    reflection: 0.22,
  },
  events: [
    {
      title: 'Mehendi',
      date: '20 December 2026',
      time: '11 am onwards',
      venue: 'The Courtyard, Jaipur',
    },
    {
      title: 'Ring Ceremony',
      date: '21 December 2026',
      time: '7 pm onwards',
      venue: 'Rose Garden Lawns, Jaipur',
    },
    {
      title: 'Wedding',
      date: '22 December 2026',
      time: '6 pm',
      venue: 'The Grand Palace Hall, Jaipur',
    },
  ],
  gem: {
    stone: '#dfe3ea',
    facet: '#8f96a3',
    sparkle: '#ffffff',
  },
  eventText: {
    titleSize: 84,
    detailSize: 34,
  },
  saveTheDate: {
    text: 'Save\nthe\nDate',
    size: 150,
    sprigs: true,
  },
  sketch: {
    pencil: '#3b2e28',
    chalk: '#f7f0e2',
    lineWidth: 2.4,
    danceSpeed: 1,
  },
  fonts: {
    script: 'great-vibes',
    serif: 'cinzel',
  },
  gold: {
    highlight: '#fff4cf',
    light: '#f0cf86',
    mid: '#c3913d',
    deep: '#6b4515',
  },
  text: {
    cream: '#f7ead0',
    ink: '#5a3d47',
  },
  paper: {
    wall: '#bb9f7d',
    floor: '#dcc6a6',
  },
  background: {
    show: true,
    night: '#050404',
    panel: '#1f222b',
    panelEdge: '#08090c',
  },
  motion: defaultMotion({ exitFrames: 20 }),
};

export const goldMonogramInviteMeta: ClipMeta = {
  ...promoMeta,
  id: 'gold-monogram-invite',
  title: 'Gold Monogram Invite',
  description:
    'A royal wedding invite: a gold mandala panel and a sketched dancing couple carry the quote, a script title glows in, a satin veil lifts off a gold monogram among sparklers, then three event cards and a save the date.',
  category: 'invitations',
  tags: ['wedding', 'invitation', 'monogram', 'reveal', 'text', 'glow', 'draw'],
  theme: 'dark',
  source: 'src/compositions/scenes/invitations/gold-monogram-invite.tsx',
  durationInFrames: 1900,
  posterFrame: 1090,
};
