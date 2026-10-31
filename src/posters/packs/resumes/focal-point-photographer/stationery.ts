import {
  A4_SIZE,
  avatar,
  CARD_SIZE,
  icon,
  photo,
  rect,
  type ThemeSpec,
  themed,
} from '../../../kit';
import { BODY, CONTACT_ICONS, CONTACTS, copy, FOCAL, NAME } from './resume';

const LETTER_BODY = [
  'Dear Hiring Manager,',
  'I am delighted to apply for the Lead Photographer role at Harbor & Pine Studio. With a patient eye for composition, a love of natural light and years spent photographing homes, people and products, I know how to make every frame feel considered and warm.',
  'Over the past seven years I have partnered with architects, stylists and small brands to create imagery that tells a clear story. I plan every shoot carefully, light it with intention and finish each set with a calm, consistent edit.',
  'A recent highlight was a seasonal campaign for a local furniture maker that lifted their online enquiries by more than a third in two months. It reminded me how much strong pictures can move a business forward.',
  'Your thoughtful, story-led work is exactly where I want to grow next, and I would love to bring my craft and energy to your team.',
  'Warm regards,',
].join('\n\n');

const letterSpec = {
  colors: {
    background: { value: FOCAL.paper, hint: 'Page' },
    primary: { value: FOCAL.ink, hint: 'Header band, the footer band and the signature' },
    accent: { value: FOCAL.amber, hint: 'Header rule and the contact icons' },
    surface: {
      value: FOCAL.white,
      hint: 'Name and contact details in the header; its tinted shade colors PHOTOGRAPHER',
    },
    text: { value: FOCAL.text, hint: 'Recipient address and the letter' },
  },
  fonts: { body: BODY, script: { label: 'Signature font', value: 'Dancing Script' } },
  copy: {
    name: NAME,
    role: { label: 'Role', value: 'PHOTOGRAPHER' },
    contacts: CONTACTS,
    recipient: {
      label: 'Recipient',
      value: 'Hiring Manager\nCreative Department\nHarbor & Pine Studio\n48 Wharf Lane, Port Ellis',
    },
    letter: { label: 'Letter', value: LETTER_BODY },
    signature: { label: 'Signature', value: 'Noa Whitfield' },
  },
} as const satisfies ThemeSpec;

export const photographerLetter = themed(A4_SIZE.width, A4_SIZE.height, letterSpec, (t) => {
  const body = copy(t.font('body'));
  const contacts = t.list('contacts');
  return [
    rect(0, 0, A4_SIZE.width, A4_SIZE.height, t.color('background'), { name: 'Background' }),
    rect(0, 0, A4_SIZE.width, 320, t.color('primary'), { name: 'Header' }),
    rect(110, 262, 90, 6, t.color('accent'), { name: 'Header rule' }),
    body(t.copy('name'), 110, 100, 640, 70, t.color('surface'), {
      fontWeight: 700,
      lineHeight: 1.1,
    }),
    body(t.copy('role'), 112, 192, 500, 32, t.shade('surface', FOCAL.mist), { letterSpacing: 5 }),
    CONTACT_ICONS.map((name, index) => [
      icon(name, 770, 104 + index * 58, 32, t.color('accent'), { strokeWidth: 2 }),
      body(contacts[index] ?? '', 822, 105 + index * 58, 380, 25, t.color('surface')),
    ]),
    body(t.copy('recipient'), 160, 410, 700, 26, t.color('text'), { fontWeight: 600 }),
    body(t.copy('letter'), 160, 610, 920, 24, t.color('text'), { lineHeight: 1.7 }),
    copy(t.font('script'))(t.copy('signature'), 160, 1445, 600, 72, t.color('primary')),
    rect(0, 1650, A4_SIZE.width, 104, t.color('primary'), { name: 'Footer' }),
  ];
});

const { width: CW, height: CH } = CARD_SIZE;

const frontSpec = {
  colors: {
    background: { value: FOCAL.paper, hint: 'Card' },
    primary: { value: FOCAL.ink, hint: 'Photo panel and the name label' },
    accent: { value: FOCAL.amber, hint: 'Panel rule and the photo ring' },
    surface: { value: FOCAL.white, hint: 'Name on the label' },
    text: { value: FOCAL.text, hint: 'PHOTOGRAPHY & PORTRAITS' },
  },
  fonts: { body: BODY },
  copy: {
    name: NAME,
    tagline: { label: 'Tagline', value: 'PHOTOGRAPHY\n& PORTRAITS' },
  },
} as const satisfies ThemeSpec;

export const photographerCardFront = themed(CW, CH, frontSpec, (t) => {
  const body = copy(t.font('body'));
  return [
    rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
    rect(0, 0, 440, CH, t.color('primary'), { name: 'Photo panel' }),
    rect(456, 0, 8, CH, t.color('accent'), { name: 'Panel rule' }),
    avatar('woman-portrait-4', 220, 300, 168, t.color('accent')),
    rect(500, 222, 500, 84, t.color('primary'), { name: 'Name label' }),
    body(t.copy('name'), 524, 238, 470, 42, t.color('surface'), {
      fontWeight: 700,
      lineHeight: 1.2,
    }),
    body(t.copy('tagline'), 528, 336, 470, 32, t.color('text'), {
      letterSpacing: 3,
      lineHeight: 1.3,
    }),
  ];
});

const STRIP = ['autumn-leaves', 'city-night', 'yoga-1', 'house-2'] as const;

const backSpec = {
  colors: {
    background: { value: FOCAL.paper, hint: 'Card' },
    primary: { value: FOCAL.ink, hint: 'Name' },
    accent: { value: FOCAL.amber, hint: 'Edge stripe, the name rule and the contact icons' },
    text: {
      value: FOCAL.text,
      hint: 'Contact details; its lighter shade colors PHOTOGRAPHY & PORTRAITS',
    },
  },
  fonts: { body: BODY },
  copy: {
    name: NAME,
    tagline: { label: 'Tagline', value: 'PHOTOGRAPHY & PORTRAITS' },
    contacts: CONTACTS,
  },
} as const satisfies ThemeSpec;

export const photographerCardBack = themed(CW, CH, backSpec, (t) => {
  const body = copy(t.font('body'));
  const contacts = t.list('contacts');
  return [
    rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
    STRIP.map((name, index) => photo(name, 24, index * 150 + 2, 376, 146)),
    rect(0, 0, 24, CH, t.color('accent'), { name: 'Edge stripe' }),
    body(t.copy('name'), 450, 104, 560, 50, t.color('primary'), {
      fontWeight: 700,
      lineHeight: 1.2,
    }),
    body(t.copy('tagline'), 452, 176, 560, 23, t.shade('text', FOCAL.muted), { letterSpacing: 3 }),
    rect(452, 228, 70, 5, t.color('accent'), { name: 'Name rule' }),
    CONTACT_ICONS.map((name, index) => [
      icon(name, 452, 290 + index * 66, 32, t.color('accent'), { strokeWidth: 2 }),
      body(contacts[index] ?? '', 504, 291 + index * 66, 500, 25, t.color('text')),
    ]),
  ];
});
