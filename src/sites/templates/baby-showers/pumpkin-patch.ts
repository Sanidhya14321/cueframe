import { z } from 'zod';
import { zColor, zDateTime, zImage, zMultiline, zSlider } from '@/schemas/control';
import type { SiteMeta } from '../../types';

const photo = (file: string): string => `/site-assets/pumpkin-patch/${file}.jpg`;

export const pumpkinPatchSchema = z.object({
  family: z.object({
    parentOne: z.string().max(30),
    parentTwo: z.string().max(30),
    lastName: z.string().max(30),
    headline: z.string().max(60),
    dueLine: z.string().max(60),
    hostedBy: z.string().max(80),
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
    welcome: zImage(),
    brunch: zImage(),
    venue: zImage(),
    registry: zImage(),
  }),
  welcome: z.object({
    title: z.string().max(60),
    text: zMultiline(),
    signature: z.string().max(60),
  }),
  schedule: z
    .array(
      z.object({
        time: z.string().max(12),
        title: z.string().max(40),
        note: z.string().max(90),
      }),
    )
    .min(1)
    .max(6),
  registry: z.object({
    text: zMultiline(),
    links: z.array(z.object({ label: z.string().max(30), link: z.string() })).max(6),
  }),
  details: z.array(z.object({ title: z.string().max(40), text: zMultiline() })).max(6),
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

export type PumpkinPatchContent = z.infer<typeof pumpkinPatchSchema>;

export const pumpkinPatchDefaults: PumpkinPatchContent = {
  family: {
    parentOne: 'Wren',
    parentTwo: 'Jonah',
    lastName: 'Hollis',
    headline: 'A little pumpkin is on the way',
    dueLine: 'Baby boy due in December',
    hostedBy: 'Aunt Maple & Grandma Bea',
  },
  intro: { show: true, prompt: 'Pull the ribbon' },
  event: {
    startsAt: '2027-10-16T11:00',
    hours: 3,
    venue: 'The Barn at Juniper Hollow',
    address: '418 Orchard Lane, Woodstock, VT',
    venueNote:
      'A red barn at the end of a gravel lane, with hay bales on the porch, apple trees out back and plenty of parking by the cider shed.',
    rsvpBy: 'October 1st, 2027',
  },
  photos: {
    hero: photo('bump-heart'),
    welcome: photo('white-pumpkins'),
    brunch: photo('harvest-brunch'),
    venue: photo('barn-porch'),
    registry: photo('pumpkin-flatlay'),
  },
  welcome: {
    title: 'Come gather round',
    text: 'The leaves are turning, the cider is warm and our favorite two people are about to become three.\n\nJoin us for a slow autumn brunch on the farm to shower Wren and Jonah with love, good advice and a few tiny socks before their little one arrives.',
    signature: 'Maple & Bea',
  },
  schedule: [
    {
      time: '11:00 am',
      title: 'Cider & arrivals',
      note: 'Warm apple cider and a seat by the hay bales.',
    },
    { time: '11:30 am', title: 'Harvest brunch', note: 'Quiche, maple scones and pumpkin bread.' },
    { time: '12:30 pm', title: 'Shower games', note: 'Guess the bump and baby word scramble.' },
    { time: '1:15 pm', title: 'Opening gifts', note: 'Grab a slice of pie and gather round.' },
  ],
  registry: {
    text: 'Your company is the sweetest gift. If you would like to help us get ready, a few little wishes are gathered below.',
    links: [
      { label: 'Babylist', link: 'https://www.babylist.com' },
      { label: 'Target', link: 'https://www.target.com' },
      { label: 'Amazon', link: 'https://www.amazon.com' },
    ],
  },
  details: [
    {
      title: 'Books for baby',
      text: 'Instead of a card, please bring a favorite children’s book and write a little note inside the cover for baby to read one day.',
    },
    {
      title: 'Diaper raffle',
      text: 'Bring a pack of diapers in any size to be entered into the raffle for a basket of autumn goodies.',
    },
    {
      title: 'Dress warm',
      text: 'Brunch is in the open barn. Think cozy sweaters, flannel and comfortable shoes for the grass.',
    },
  ],
  faqs: [
    {
      question: 'Can I bring my little ones?',
      answer: 'Of course. There is a hay bale corner with coloring and a pumpkin painting table.',
    },
    {
      question: 'Is there parking?',
      answer: 'Yes, park on the grass beside the cider shed and follow the lanterns to the barn.',
    },
    {
      question: 'What if I have a food allergy?',
      answer:
        'Let us know when you RSVP and we will make sure there is something delicious for you.',
    },
  ],
  rsvp: {
    message:
      'We would love to save you a seat at the harvest table. Please let us know if you can join us.',
    buttonLabel: 'RSVP here',
    link: 'https://docs.google.com/forms',
  },
  colors: {
    primary: '#c4652d',
    secondary: '#7f8f6a',
    accent: '#7d9cb8',
    background: '#f6eee0',
    text: '#4a3326',
  },
};

export const pumpkinPatchMeta: SiteMeta = {
  id: 'pumpkin-patch',
  title: 'Pumpkin Patch Baby Shower Website',
  description:
    'A ribboned gift box opens onto a cozy autumn baby shower website with the brunch plan, registry, farm venue map, pumpkin countdown and RSVP.',
  category: 'baby-showers',
  tags: ['website', 'invitation', 'rsvp', 'countdown', 'baby-shower', 'autumn', 'playful'],
  theme: 'light',
  updatedAt: '2026-10-29T12:00:00.000Z',
};
