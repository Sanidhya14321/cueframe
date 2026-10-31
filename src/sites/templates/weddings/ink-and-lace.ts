import { z } from 'zod';
import { zColor, zDateTime, zImage, zMultiline } from '@/schemas/control';
import type { SiteMeta } from '../../types';

const photo = (file: string): string => `/site-assets/ink-and-lace/${file}.jpg`;

export const inkAndLaceSchema = z.object({
  issue: z.object({
    masthead: z.string().max(14),
    volume: z.string().max(20),
    number: z.string().max(20),
    coverLine: z.string().max(90),
  }),
  couple: z.object({
    firstName: z.string().max(40),
    secondName: z.string().max(40),
    monogram: z.string().max(8),
  }),
  intro: z.object({
    show: z.boolean(),
    prompt: z.string().max(30),
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
    cover: zImage(),
    hero: zImage(),
    storyOne: zImage(),
    storyTwo: zImage(),
    venue: zImage(),
    closing: zImage(),
    blackAndWhite: z.boolean(),
  }),
  story: z.object({
    headline: z.string().max(80),
    deck: zMultiline(),
    text: zMultiline(),
    pullQuote: z.string().max(160),
  }),
  schedule: z
    .array(
      z.object({ time: z.string().max(12), title: z.string().max(40), note: z.string().max(90) }),
    )
    .min(1)
    .max(8),
  party: z.array(z.object({ name: z.string().max(40), role: z.string().max(30) })).max(12),
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
  faqs: z.array(z.object({ question: z.string().max(90), answer: zMultiline() })).max(8),
  rsvp: z.object({
    message: zMultiline(),
    buttonLabel: z.string().max(30),
    link: z.string(),
  }),
  colophon: z.object({
    note: zMultiline(),
  }),
  colors: z.object({
    primary: zColor(),
    accent: zColor(),
    background: zColor(),
    text: zColor(),
  }),
});

export type InkAndLaceContent = z.infer<typeof inkAndLaceSchema>;

export const inkAndLaceDefaults: InkAndLaceContent = {
  issue: {
    masthead: 'Vows',
    volume: 'Vol. 01',
    number: 'No. 09',
    coverLine: 'The long way to yes, a weekend in the Hudson Valley, and what to wear',
  },
  couple: {
    firstName: 'Odile',
    secondName: 'Sebastian',
    monogram: 'O & S',
  },
  intro: { show: true, prompt: 'Open the issue' },
  event: {
    startsAt: '2027-09-18T16:00',
    venue: 'Ashgrove Hall',
    address: '48 Orchard Lane, Hudson, NY',
    venueNote:
      'A restored 1890s glasshouse at the edge of an old apple orchard, with long tables under the vines and a dance floor that opens onto the lawn.',
    venueWebsite: 'https://example.com',
    rsvpBy: 'July 1st, 2027',
  },
  photos: {
    cover: photo('cover-hands'),
    hero: photo('couple-portrait'),
    storyOne: photo('story-veil'),
    storyTwo: photo('story-rings'),
    venue: photo('venue-hall'),
    closing: photo('closing-gown'),
    blackAndWhite: true,
  },
  story: {
    headline: 'The long way to yes',
    deck: 'Two strangers, one sold-out gallery opening and the coat check ticket that started everything. A short history of how Odile and Sebastian found each other.',
    text: 'They met in the cloakroom of a crowded gallery in the winter of 2019, both holding ticket number forty-two. One black wool coat, two very confident claims, and a coat check attendant who refused to choose.\n\nThey settled it the only fair way: dinner, and a coin toss over dessert. Sebastian lost the toss and kept the coat anyway, because it was his all along. Odile still disputes this.\n\nFive years, three apartments and one very patient dog later, he asked her on a rainy Tuesday on the same gallery steps. She said yes before he finished the question. This September, we would love for you to be there for the next chapter.',
    pullQuote:
      'One black coat, two ticket stubs and a coin toss neither of us will ever stop arguing about.',
  },
  schedule: [
    { time: '3:30 pm', title: 'Arrivals', note: 'Lemonade and lawn games in the orchard.' },
    {
      time: '4:00 pm',
      title: 'The ceremony',
      note: 'Under the old apple trees. Please be seated by 3:50.',
    },
    { time: '5:00 pm', title: 'Cocktail hour', note: 'Oysters, music and the last of the sun.' },
    { time: '6:30 pm', title: 'Dinner', note: 'Long tables in the glasshouse.' },
    { time: '8:30 pm', title: 'Dancing', note: 'Until the band goes home.' },
  ],
  party: [
    { name: 'Clémence Vidal', role: 'Maid of honor' },
    { name: 'Hugo Marchetti', role: 'Best man' },
    { name: 'Ines Okafor', role: 'Bridesmaid' },
    { name: 'Felix Brandt', role: 'Groomsman' },
    { name: 'Nora Lindqvist', role: 'Bridesmaid' },
    { name: 'Marcus Hale', role: 'Officiant' },
  ],
  details: [
    {
      title: 'Dress code',
      text: 'Black tie optional. Think ink, ivory and anything with a little lace. Heels may sink in the lawn, so bring flats for dancing.',
      linkLabel: '',
      linkUrl: '',
    },
    {
      title: 'Where to stay',
      text: 'A block of rooms is held at a small inn on Warren Street, ten minutes from the venue, until August 1st.',
      linkLabel: 'Reserve a room',
      linkUrl: 'https://example.com',
    },
    {
      title: 'Getting there',
      text: 'Trains run from the city to Hudson every two hours. A shuttle meets the 2:40 pm arrival and returns at midnight.',
      linkLabel: '',
      linkUrl: '',
    },
    {
      title: 'Registry',
      text: 'Your presence is the gift. If you would like to add to it, our honeymoon fund is linked below.',
      linkLabel: 'View registry',
      linkUrl: 'https://example.com',
    },
  ],
  faqs: [
    {
      question: 'Can I bring a plus one?',
      answer:
        'If your invitation names a guest, absolutely. Otherwise we are keeping it to the people named.',
    },
    {
      question: 'Are children welcome?',
      answer: 'We love your little ones, but this will be an adults-only evening.',
    },
    {
      question: 'Is the ceremony outdoors?',
      answer: 'Yes, in the orchard. If it rains, we move into the glasshouse and nobody minds.',
    },
    {
      question: 'Will there be parking?',
      answer: 'Free parking is available beside the hall, with attendants on hand all evening.',
    },
  ],
  rsvp: {
    message: 'There is a seat with your name on it. Please let us know if you will be in it.',
    buttonLabel: 'Reply here',
    link: 'https://docs.google.com/forms',
  },
  colophon: {
    note: 'Printed with love in the Hudson Valley. No coats were harmed in the making of this issue.',
  },
  colors: {
    primary: '#141312',
    accent: '#7a2131',
    background: '#f3eee5',
    text: '#1b1917',
  },
};

export const inkAndLaceMeta: SiteMeta = {
  id: 'ink-and-lace',
  title: 'Ink & Lace Wedding Website',
  description:
    'A fashion-magazine wedding website: a cover that turns open into an editorial issue with your story, itinerary, venue map, calendar countdown, Q&A and RSVP.',
  category: 'weddings',
  tags: ['website', 'invitation', 'rsvp', 'countdown', 'wedding', 'editorial', 'elegant'],
  theme: 'light',
  updatedAt: '2026-10-29T12:00:00.000Z',
};
