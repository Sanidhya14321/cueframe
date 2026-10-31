import { z } from 'zod';
import { zColor, zDateTime, zImage, zMultiline } from '@/schemas/control';
import type { SiteMeta } from '../../types';

const photo = (file: string): string => `/site-assets/emerald-rose/${file}.jpg`;

export const emeraldRoseSchema = z.object({
  couple: z.object({
    firstName: z.string().max(40),
    secondName: z.string().max(40),
    monogram: z.string().max(8),
    greeting: z.string().max(80),
  }),
  intro: z.object({
    show: z.boolean(),
    prompt: z.string().max(40),
  }),
  event: z.object({
    startsAt: zDateTime(),
    venue: z.string().max(80),
    address: z.string().max(160),
    venueNote: zMultiline(),
    venueWebsite: z.string(),
    rsvpBy: z.string().max(60),
  }),
  photos: z.object({
    hero: zImage(),
    storyThen: zImage(),
    storyNow: zImage(),
    venue: zImage(),
    schedule: zImage(),
    reception: zImage(),
  }),
  story: z.object({
    thenLabel: z.string().max(20),
    nowLabel: z.string().max(20),
    text: zMultiline(),
  }),
  schedule: z
    .array(z.object({ time: z.string().max(12), title: z.string().max(40) }))
    .min(1)
    .max(8),
  details: z
    .array(
      z.object({
        title: z.string().max(40),
        text: zMultiline(),
        linkLabel: z.string().max(30),
        linkUrl: z.string(),
      }),
    )
    .max(6),
  dressCode: z.object({
    text: zMultiline(),
    swatches: z.array(z.object({ color: zColor() })).max(6),
  }),
  faqs: z.array(z.object({ question: z.string().max(80), answer: zMultiline() })).max(8),
  rsvp: z.object({
    message: zMultiline(),
    buttonLabel: z.string().max(30),
    link: z.string(),
  }),
  colors: z.object({
    primary: zColor(),
    secondary: zColor(),
    accent: zColor(),
    background: zColor(),
    text: zColor(),
  }),
});

export type EmeraldRoseContent = z.infer<typeof emeraldRoseSchema>;

export const emeraldRoseDefaults: EmeraldRoseContent = {
  couple: {
    firstName: 'Margaux',
    secondName: 'Julien',
    monogram: 'M & J',
    greeting: 'Together with their families',
  },
  intro: { show: true, prompt: 'Open the gate' },
  event: {
    startsAt: '2028-05-20T16:00',
    venue: 'Larkspur Hall',
    address: 'East Market Street, Rhinebeck, NY',
    venueNote:
      'A walled rose garden and a candlelit hall in the Hudson Valley, where the old climbing roses cover the gates every May.',
    venueWebsite: 'https://www.example.com',
    rsvpBy: 'March 1st, 2028',
  },
  photos: {
    hero: photo('bouquet-embrace'),
    storyThen: photo('hands-shadow'),
    storyNow: photo('meadow-sunset'),
    venue: photo('venue-manor'),
    schedule: photo('bride-garden'),
    reception: photo('reception-library'),
  },
  story: {
    thenLabel: '2019',
    nowLabel: 'Today',
    text: 'We met in the rain outside a tiny bookshop, both reaching for the last copy of the same paperback. Julien let Margaux have it, on one condition: that she tell him how it ended.\n\nShe told him over dinner the following week, and then over a hundred more dinners after that, through a move across the river, a stubborn rescue dog named Fig and more garden experiments than either of us would like to admit.\n\nLast spring, under the climbing roses of the very garden where we will marry, Julien finally asked a question of his own. Margaux did not need to read ahead to know the answer.',
  },
  schedule: [
    { time: '3:30 pm', title: 'The garden gates open' },
    { time: '4:00 pm', title: 'Ceremony among the roses' },
    { time: '5:00 pm', title: 'Champagne on the lawn' },
    { time: '6:30 pm', title: 'Supper in the great hall' },
    { time: '8:30 pm', title: 'First dance' },
    { time: '11:00 pm', title: 'Sparkler send-off' },
  ],
  details: [
    {
      title: 'The ceremony',
      text: 'Our vows are said outdoors in the rose garden. Please be seated by 3:50 pm, and leave the stilettos at home: the lawn is soft.',
      linkLabel: '',
      linkUrl: '',
    },
    {
      title: 'Little ones',
      text: 'We love your children dearly, but this evening is for grown-ups only.',
      linkLabel: '',
      linkUrl: '',
    },
    {
      title: 'Where to stay',
      text: 'We have held rooms at a country inn ten minutes from the hall. Mention our names when you book.',
      linkLabel: 'Reserve a room',
      linkUrl: 'https://www.booking.com',
    },
    {
      title: 'Gifts',
      text: 'Having you there is the gift. If you would like to mark the day, our honeymoon fund is linked below.',
      linkLabel: 'Our registry',
      linkUrl: 'https://www.zola.com',
    },
  ],
  dressCode: {
    text: 'Black tie optional. Jewel tones are warmly welcome: claret, forest, blush and champagne.',
    swatches: [
      { color: '#5c1a28' },
      { color: '#a35d6a' },
      { color: '#1d3b2f' },
      { color: '#4f6b55' },
      { color: '#d8c39a' },
    ],
  },
  faqs: [
    {
      question: 'When should I arrive?',
      answer: 'The garden gates open at 3:30 pm and the ceremony begins at 4:00 pm sharp.',
    },
    {
      question: 'Is the ceremony outdoors?',
      answer:
        'Yes, in the rose garden. If it rains we move into the glass orangery next door, so there is no need for an umbrella.',
    },
    {
      question: 'Is there parking?',
      answer:
        'Free parking is available beside the hall, and a shuttle runs to the inn until midnight.',
    },
    {
      question: 'Can I bring a guest?',
      answer:
        'We have kept the day small, so we can only welcome the guests named on your invitation.',
    },
  ],
  rsvp: {
    message:
      'We would love to celebrate with you among the roses. Let us know if you can come, and tell us what you would like for supper.',
    buttonLabel: 'Send your reply',
    link: 'https://docs.google.com/forms',
  },
  colors: {
    primary: '#1d3b2f',
    secondary: '#6b1d2a',
    accent: '#b8925a',
    background: '#f7f1e6',
    text: '#2a2420',
  },
};

export const emeraldRoseMeta: SiteMeta = {
  id: 'emerald-rose',
  title: 'Emerald Rose Wedding Website',
  description:
    'A gilded garden gate swings open onto a romantic wedding website with your story in chapters, the programme of the day, venue map, countdown, FAQs and RSVP.',
  category: 'weddings',
  tags: ['website', 'invitation', 'rsvp', 'countdown', 'wedding', 'floral', 'elegant'],
  theme: 'light',
  updatedAt: '2026-10-29T12:00:00.000Z',
};
