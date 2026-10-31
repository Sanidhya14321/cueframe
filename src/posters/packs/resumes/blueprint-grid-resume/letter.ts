import { CARD_SIZE, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  CONTACT_LABELS,
  CONTACT_VALUES,
  contactBlock,
  GRID,
  gridColors,
  gridPaper,
  HEAD,
  LETTER,
  monoPhoto,
  NAME,
  ROLE,
  roleLine,
  selectionName,
} from './grid';

const LETTER_TEXT = [
  'Dear Hiring Team,',
  'I am writing to apply for the Brand Designer role at Lumen and Oak. I have admired your packaging work for years, especially the coastal tea range, and I would love to bring a fresh, systems-minded eye to your studio.',
  'Over the last six years I have built identities for food, travel and hospitality brands, moving from strategy workshops to type, colour and launch campaigns. At Kestrel Studio I lead a small team and recently rebranded a bakery chain that grew online orders by 40%.',
  'I care about clear ideas, careful craft and design systems that stay flexible as a brand grows. I would be glad to walk you through my portfolio and talk about what is next for Lumen and Oak.',
  'Sincerely,',
].join('\n\n');

const MUTED = { value: GRID.muted, hint: 'Contact details' };

const letterSpec = {
  colors: {
    ...gridColors(
      'Name, its box, role, contact heading, contact labels, date, letter and signature',
      'Column behind the photo, the line under the date, contact icons and the rings of the corner handles',
    ),
    text: MUTED,
  },
  fonts: { heading: HEAD, body: BODY, script: { label: 'Signature font', value: 'Satisfy' } },
  copy: {
    name: { ...NAME, hint: 'Also the signature' },
    role: ROLE,
    contactTitle: { label: 'Contact heading', value: 'CONTACT' },
    contactLabels: CONTACT_LABELS,
    contactValues: CONTACT_VALUES,
    date: { label: 'Date', value: 'APRIL 9, 2026' },
    letter: { label: 'Letter', value: LETTER_TEXT },
  },
} as const satisfies ThemeSpec;

export const coverLetter = themed(LETTER.width, LETTER.height, letterSpec, (t) => [
  gridPaper(t, LETTER.width, LETTER.height),
  rect(0, 0, 400, 1110, t.color('accent'), { name: 'Accent column' }),
  monoPhoto('man-portrait-3', 0, 130, 400, 560),
  text(t.copy('contactTitle'), 60, 1170, 320, {
    fontFamily: t.font('heading'),
    fontSize: 46,
    fontWeight: 800,
    fill: t.color('primary'),
  }),
  contactBlock(t, t.color('text'), t.list('contactLabels'), t.list('contactValues'), 60, 1260, 24),
  selectionName(t, t.copy('name'), 500, 110, 680, 140, 84),
  roleLine(t, t.copy('role'), 500, 280, 680, 40, 3),
  text(t.copy('date'), 470, 390, 400, {
    fontFamily: t.font('heading'),
    fontSize: 34,
    fontWeight: 800,
    fill: t.color('primary'),
  }),
  rect(470, 446, 70, 8, t.color('accent'), { name: 'Date rule' }),
  text(t.copy('letter'), 470, 500, 720, {
    fontFamily: t.font('body'),
    fontSize: 25,
    fontWeight: 400,
    fill: t.color('primary'),
    lineHeight: 1.65,
  }),
  text(t.copy('name'), 470, 1340, 600, {
    fontFamily: t.font('script'),
    fontSize: 64,
    fontWeight: 400,
    fill: t.color('primary'),
  }),
]);

const { width: CW, height: CH } = CARD_SIZE;

const cardFrontSpec = {
  colors: gridColors(
    'Name, its box and role',
    'Strip along the bottom edge and the rings of the corner handles',
  ),
  fonts: { heading: HEAD },
  copy: { name: NAME, role: ROLE },
} as const satisfies ThemeSpec;

export const cardFront = themed(CW, CH, cardFrontSpec, (t) => [
  gridPaper(t, CW, CH, 40),
  selectionName(t, t.copy('name'), 150, 180, 750, 150, 92),
  roleLine(t, t.copy('role'), 0, 380, CW, 40, 3),
  rect(0, CH - 12, CW, 12, t.color('accent'), { name: 'Edge' }),
]);

const cardBackSpec = {
  colors: {
    ...gridColors(
      'Name, its box, role and contact labels',
      'Stripe beside the photo, contact icons and the rings of the corner handles',
    ),
    text: MUTED,
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    name: NAME,
    role: ROLE,
    contactLabels: CONTACT_LABELS,
    contactValues: CONTACT_VALUES,
  },
} as const satisfies ThemeSpec;

export const cardBack = themed(CW, CH, cardBackSpec, (t) => [
  gridPaper(t, CW, CH, 40),
  monoPhoto('man-portrait-3', 0, 0, 420, CH),
  rect(420, 0, 22, CH, t.color('accent'), { name: 'Accent stripe' }),
  selectionName(t, t.copy('name'), 490, 60, 510, 100, 48),
  roleLine(t, t.copy('role'), 490, 182, 510, 28, 2),
  contactBlock(t, t.color('text'), t.list('contactLabels'), t.list('contactValues'), 520, 270, 24),
]);
