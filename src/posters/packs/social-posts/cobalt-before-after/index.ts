import { definePack } from '../../../pack';
import type { ShiftTheme } from './posts';
import { type ShiftCopy, shiftTemplates } from './posts-more';

const COBALT: ShiftTheme = {
  brand: '#2f5bff',
  panel: '#1b1f2b',
  dark: '#0b0d14',
  paper: '#ffffff',
  ink: '#0b0d14',
  onBrand: '#ffffff',
  pop: '#ffd23f',
  star: '#ffffff',
  headFont: 'Manrope',
  bodyFont: 'Inter',
};

const SAGE: ShiftTheme = {
  ...COBALT,
  brand: '#5f8f6e',
  panel: '#24332a',
  dark: '#141b17',
  ink: '#141b17',
  pop: '#e3edb8',
  star: '#e3edb8',
};

const COPY: ShiftCopy = {
  myth: {
    myth: 'Social media only works\nfor big brands.',
    fact: 'Small brands win with a\nclear, steady plan.',
  },
  dos: {
    kicker: 'What you\nshould',
    title: "Do's and Don'ts",
    dos: [
      'Post on a steady\nschedule',
      'Use crisp, on-brand\nvisuals',
      'Reply to every\ncomment',
      'Share real customer\nstories',
      'Track what\nconverts',
    ],
    donts: [
      'Post only when\nyou remember',
      'Use blurry or\noff-brand images',
      'Ignore questions\nin your inbox',
      'Buy fake\nfollowers',
      'Copy other\nbrands word for word',
    ],
  },
  problem: {
    problem: 'I post every day but\nmy sales stay flat.',
    solution: 'We map each post to\nyour buyer journey.',
  },
  direction: {
    kicker: 'PICK THE',
    title: 'SMARTER PATH',
    before: 'Manual posting\nSlow replies\nLess free time',
    after: 'Auto scheduling\nQuick replies\nMore free time',
    people: ['man-portrait-2', 'man-portrait-3'],
  },
  hook: {
    lines: ['Most makeovers fade', 'fast, and hardly anyone'],
    punch: 'explains why.',
    body: 'Read the first comment to see what they\nare really selling you.',
  },
};

const MAIN = shiftTemplates(COBALT, COPY);
const ALT = shiftTemplates(SAGE, COPY);

export const cobaltBeforeAfterPack = definePack({
  id: 'cobalt-before-after',
  title: 'Cobalt Before After',
  description:
    'Myth versus fact, do and do not, problem and solution and before and after posts in cobalt and sunshine yellow, with a matching story.',
  category: 'social-posts',
  tags: ['comparison', 'small-business', 'instagram', 'story', 'tips'],
  theme: 'dark',

  designs: [
    MAIN.problem,
    MAIN.dos,
    MAIN.direction,
    MAIN.hook,
    MAIN.myth,
    MAIN.story,
    ALT.myth,
    ALT.dos,
  ],
});
