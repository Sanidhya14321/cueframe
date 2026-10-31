import { z } from 'zod';
import { zColor, zDateTime, zImage, zMultiline } from '@/schemas/control';
import type { SiteMeta } from '../../types';

const photo = (file: string): string => `/site-assets/midnight-crown/${file}.jpg`;

const place = {
  title: z.string().max(40),
  place: z.string().max(80),
  address: z.string().max(160),
};

export const midnightCrownSchema = z.object({
  celebrant: z.object({
    firstName: z.string().max(30),
    lastName: z.string().max(40),
    initial: z.string().max(2),
    years: z.string().max(6),
    greeting: z.string().max(60),
    tagline: z.string().max(120),
  }),
  intro: z.object({
    show: z.boolean(),
    prompt: z.string().max(40),
  }),
  event: z.object({
    startsAt: zDateTime(),
    rsvpBy: z.string().max(60),
  }),
  mass: z.object(place),
  reception: z.object({
    ...place,
    time: z.string().max(12),
    note: zMultiline(),
    website: z.string(),
  }),
  photos: z.object({
    hero: zImage(),
    portrait: zImage(),
    chapel: zImage(),
    ballroom: zImage(),
    court: zImage(),
  }),
  letter: z.object({
    text: zMultiline(),
    signature: z.string().max(40),
  }),
  parents: z.array(z.object({ name: z.string().max(60) })).max(4),
  padrinos: z.array(z.object({ role: z.string().max(40), names: z.string().max(80) })).max(10),
  schedule: z
    .array(
      z.object({ time: z.string().max(12), title: z.string().max(40), note: z.string().max(80) }),
    )
    .min(1)
    .max(10),
  court: z.object({
    escort: z.string().max(60),
    pairs: z.array(z.object({ dama: z.string().max(40), chambelan: z.string().max(40) })).max(10),
  }),
  dressCode: z.object({
    title: z.string().max(40),
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
    background: zColor(),
    surface: zColor(),
    text: zColor(),
  }),
});

export type MidnightCrownContent = z.infer<typeof midnightCrownSchema>;

export const midnightCrownDefaults: MidnightCrownContent = {
  celebrant: {
    firstName: 'Aurelia',
    lastName: 'Castellanos',
    initial: 'A',
    years: 'XV',
    greeting: 'Mis XV años',
    tagline: 'One night beneath the chandeliers to celebrate fifteen years of grace',
  },
  intro: { show: true, prompt: 'Open the ballroom doors' },
  event: {
    startsAt: '2027-11-13T16:00',
    rsvpBy: 'October 1st, 2027',
  },
  mass: {
    title: 'Thanksgiving Mass',
    place: 'Chapel of Saint Cecilia',
    address: '410 Alameda Street, San Antonio, TX',
  },
  reception: {
    title: 'Reception',
    time: '7:00 pm',
    place: 'The Aurora Ballroom',
    address: '1200 Riverside Drive, San Antonio, TX',
    note: 'A candlelit hall of crystal chandeliers and tall arched windows, where the waltz, the dinner and the dancing will carry on until midnight.',
    website: 'https://www.example.com',
  },
  photos: {
    hero: photo('ball-gown'),
    portrait: photo('gown-waiting'),
    chapel: photo('chapel'),
    ballroom: photo('ballroom'),
    court: photo('waltz'),
  },
  letter: {
    text: 'Fifteen years ago my story began, and every chapter since has been written by the people I love most.\n\nOn this night I step from childhood into a new season of my life, and I could not imagine taking that first step without you beside me.\n\nCome dance beneath the stars with me, raise a glass, and help me make memories that will shine for a lifetime.',
    signature: 'With love, Aurelia',
  },
  parents: [{ name: 'Javier Castellanos' }, { name: 'Marisol Ortega de Castellanos' }],
  padrinos: [
    { role: 'Padrinos de honor', names: 'Esteban & Lucía Ferrer' },
    { role: 'Crown & tiara', names: 'Ramiro & Celeste Ibarra' },
    { role: 'Bible & rosary', names: 'Andrés & Noemí Salazar' },
    { role: 'Last doll', names: 'Tomás & Graciela Vidal' },
    { role: 'Cake', names: 'Mateo & Paula Cordero' },
    { role: 'Shoes', names: 'Leonel & Rocío Andrade' },
  ],
  schedule: [
    { time: '4:00 pm', title: 'Thanksgiving Mass', note: 'Chapel of Saint Cecilia' },
    { time: '7:00 pm', title: 'Grand entrance', note: 'Aurelia and her court arrive' },
    { time: '7:30 pm', title: 'Dinner', note: 'Served in the Aurora Ballroom' },
    { time: '8:30 pm', title: 'The waltz', note: 'Father and daughter, then the court' },
    { time: '9:00 pm', title: 'Toasts & the last doll', note: 'A few words from family' },
    { time: '9:30 pm', title: 'Dancing', note: 'Until the clock strikes twelve' },
  ],
  court: {
    escort: 'Gabriel Montes',
    pairs: [
      { dama: 'Camila Reyes', chambelan: 'Diego Navarro' },
      { dama: 'Daniela Ochoa', chambelan: 'Emilio Robles' },
      { dama: 'Sofía Lozano', chambelan: 'Santiago Pineda' },
      { dama: 'Renata Vega', chambelan: 'Joaquín Serrano' },
      { dama: 'Ximena Duarte', chambelan: 'Adrián Fuentes' },
      { dama: 'Paulina Arce', chambelan: 'Mateo Quiroga' },
    ],
  },
  dressCode: {
    title: 'Black tie',
    text: 'Gowns and dark suits are warmly encouraged. The colours of the night are midnight blue and champagne gold, so we kindly ask guests to leave both to the court.',
    swatches: [
      { color: '#1b2a4e' },
      { color: '#3c3f58' },
      { color: '#e8b9c4' },
      { color: '#f2e6cf' },
      { color: '#111111' },
    ],
  },
  faqs: [
    {
      question: 'Can I bring a guest?',
      answer:
        'Your invitation lists everyone we have saved a seat for. Please reply for each name on it.',
    },
    {
      question: 'Are children welcome?',
      answer:
        'Yes, little ones listed on your invitation are very welcome at the mass and the reception.',
    },
    {
      question: 'Is there parking at the ballroom?',
      answer:
        'Complimentary valet parking is available at the Riverside Drive entrance all evening.',
    },
    {
      question: 'Is there a gift registry?',
      answer:
        'Your presence is the greatest gift. A card box will be at the welcome table for anyone who wishes.',
    },
  ],
  rsvp: {
    message:
      'Kindly let us know if you will join us for this night. Your reply helps us prepare a place for you in the ballroom.',
    buttonLabel: 'Reply to the invitation',
    link: 'https://docs.google.com/forms',
  },
  colors: {
    primary: '#d4b06a',
    secondary: '#e8b9c4',
    background: '#070d22',
    surface: '#121c3f',
    text: '#f4ead7',
  },
};

export const midnightCrownMeta: SiteMeta = {
  id: 'midnight-crown',
  title: 'Midnight Crown Quinceañera Website',
  description:
    'Ballroom doors open onto a midnight blue and gold quinceañera website with her padrinos, court of honour, mass and reception, countdown and RSVP.',
  category: 'quinceaneras',
  tags: ['website', 'invitation', 'rsvp', 'countdown', 'quinceanera', 'royal', 'elegant'],
  theme: 'dark',
  updatedAt: '2026-10-29T12:00:00.000Z',
};
