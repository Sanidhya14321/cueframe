import { z } from 'zod';
import { zColor, zDateTime, zImage, zMultiline, zSlider } from '@/schemas/control';
import type { SiteMeta } from '../../types';

const photo = (file: string): string => `/site-assets/snow-day-one/${file}.jpg`;

const SNOW_DAY_ICONS = [
  'snowflake',
  'mitten',
  'cocoa',
  'cake',
  'gift',
  'camera',
  'music',
  'moon',
  'car',
  'heart',
] as const;

const icon = z.enum(SNOW_DAY_ICONS);

export const snowDayOneSchema = z.object({
  child: z.object({
    name: z.string().max(30),
    age: z.string().max(3),
    ageWord: z.string().max(12),
    themeLine: z.string().max(60),
  }),
  hosts: z.object({
    names: z.string().max(60),
    invitation: z.string().max(80),
  }),
  intro: z.object({
    show: z.boolean(),
    prompt: z.string().max(40),
  }),
  event: z.object({
    startsAt: zDateTime(),
    hours: zSlider({ min: 1, max: 8, step: 0.5 }),
    venue: z.string().max(80),
    address: z.string().max(160),
    venueNote: zMultiline(),
    rsvpBy: z.string().max(60),
  }),
  photos: z.object({
    hero: zImage(),
    snapOne: zImage(),
    snapTwo: zImage(),
    snapThree: zImage(),
    venue: zImage(),
    party: zImage(),
  }),
  story: z.object({
    text: zMultiline(),
    captionOne: z.string().max(30),
    captionTwo: z.string().max(30),
    captionThree: z.string().max(30),
  }),
  firsts: z.array(z.object({ when: z.string().max(16), what: z.string().max(40) })).max(6),
  schedule: z
    .array(
      z.object({
        time: z.string().max(12),
        title: z.string().max(40),
        note: z.string().max(90),
        icon,
      }),
    )
    .min(1)
    .max(8),
  notes: z
    .array(
      z.object({
        icon,
        title: z.string().max(30),
        text: zMultiline(),
        linkLabel: z.string().max(30),
        linkUrl: z.string(),
      }),
    )
    .max(6),
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
    highlight: zColor(),
    background: zColor(),
    text: zColor(),
  }),
});

export type SnowDayOneContent = z.infer<typeof snowDayOneSchema>;

export type SnowDayIcon = (typeof SNOW_DAY_ICONS)[number];

export const snowDayOneDefaults: SnowDayOneContent = {
  child: {
    name: 'Juniper',
    age: '1',
    ageWord: 'one',
    themeLine: 'Our little snowflake is turning',
  },
  hosts: {
    names: 'Mara & Felix Lindqvist',
    invitation: 'Bundle up and come celebrate with',
  },
  intro: { show: true, prompt: 'Tap to wipe the frost' },
  event: {
    startsAt: '2027-01-16T11:00',
    hours: 3,
    venue: 'The Glasshouse at Birchwood Park',
    address: '410 Birchwood Lane, Madison, WI 53711',
    venueNote:
      'A warm glass conservatory tucked between snowy pines, with a cozy play corner, a cocoa bar and big windows for watching the flurries.',
    rsvpBy: 'January 2nd, 2027',
  },
  photos: {
    hero: photo('baby-basket'),
    snapOne: photo('sleepy-newborn'),
    snapTwo: photo('tiny-toes'),
    snapThree: photo('first-steps'),
    venue: photo('snowy-pines'),
    party: photo('sprinkle-cake'),
  },
  story: {
    text: 'One year ago a tiny snowflake drifted into our arms and made our whole world softer.\n\nSince then there have been sleepy mornings, wobbly adventures and more giggles than we could ever count. Come help us celebrate the sweetest first lap around the sun.',
    captionOne: 'Hello, world',
    captionTwo: 'Ten tiny toes',
    captionThree: 'Look, no hands!',
  },
  firsts: [
    { when: 'Month 2', what: 'First real smile' },
    { when: 'Month 5', what: 'Rolled over and kept rolling' },
    { when: 'Month 7', what: 'Tasted snow, made a face' },
    { when: 'Month 9', what: 'Waved bye-bye at everyone' },
    { when: 'Month 11', what: 'First wobbly steps' },
  ],
  schedule: [
    {
      time: '11:00 am',
      title: 'Snowy hellos',
      note: 'Boots by the door, warm hugs and name tags.',
      icon: 'mitten',
    },
    {
      time: '11:30 am',
      title: 'Cocoa bar',
      note: 'Hot cocoa, mini marshmallows and snacks for all sizes.',
      icon: 'cocoa',
    },
    {
      time: '12:00 pm',
      title: 'Snow play & crafts',
      note: 'Paper snowflakes, sensory snow and a little sled ride.',
      icon: 'snowflake',
    },
    {
      time: '12:45 pm',
      title: 'Cake smash',
      note: 'Juniper meets her very first cake. Front row seats!',
      icon: 'cake',
    },
    {
      time: '1:15 pm',
      title: 'Presents & photos',
      note: 'Say cheese at the snow globe photo corner.',
      icon: 'camera',
    },
    {
      time: '2:00 pm',
      title: 'Sleepy goodbyes',
      note: 'Nap time for the birthday girl, cocoa to go for you.',
      icon: 'moon',
    },
  ],
  notes: [
    {
      icon: 'gift',
      title: 'Gifts',
      text: 'Your hugs are plenty! If you would like to bring something, Juniper adores board books.',
      linkLabel: 'Wish list',
      linkUrl: 'https://www.amazon.com/baby-reg/homepage',
    },
    {
      icon: 'mitten',
      title: 'Dress warm',
      text: 'We will pop outside for a little snow play. Bring boots, mittens and spare socks for little ones.',
      linkLabel: '',
      linkUrl: '',
    },
    {
      icon: 'car',
      title: 'Parking',
      text: 'Free parking in the north lot. Follow the paper snowflakes to the Glasshouse doors.',
      linkLabel: '',
      linkUrl: '',
    },
    {
      icon: 'heart',
      title: 'Little guests',
      text: 'Siblings and cousins are so welcome. A quiet nursing and nap room sits right by the entrance.',
      linkLabel: '',
      linkUrl: '',
    },
  ],
  faqs: [
    {
      question: 'Is there food for grown-ups?',
      answer: 'Yes! A warm soup and sandwich lunch, plus plenty of cake to go around.',
    },
    {
      question: 'What about allergies?',
      answer:
        'The cake is nut-free. Tell us about any allergies in your RSVP and we will plan ahead.',
    },
    {
      question: 'Can we leave strollers inside?',
      answer: 'Of course. There is a stroller corner just inside the doors, next to the coat rack.',
    },
    {
      question: 'When should we reply?',
      answer: 'Please let us know by January 2nd, 2027 so we can count cocoa cups.',
    },
  ],
  rsvp: {
    message:
      'Will you join our snow day? Let us know who is coming, big and small, so there is a mug and a mitten-shaped cookie for everyone.',
    buttonLabel: 'RSVP for snow day',
    link: 'https://docs.google.com/forms',
  },
  colors: {
    primary: '#5866cc',
    secondary: '#cfe2fb',
    accent: '#e2508a',
    highlight: '#ffd56b',
    background: '#f5f7ff',
    text: '#262d5e',
  },
};

export const snowDayOneMeta: SiteMeta = {
  id: 'snow-day-one',
  title: 'Snow Day One Birthday Website',
  description:
    'A frosty window you wipe clear opens a playful first birthday website with falling snow, a year of firsts, the party plan, notes for parents, a map, countdown and RSVP.',
  category: 'birthdays',
  tags: ['website', 'invitation', 'rsvp', 'countdown', 'birthday', 'winter', 'playful'],
  theme: 'light',
  updatedAt: '2026-10-29T10:00:00.000Z',
};
