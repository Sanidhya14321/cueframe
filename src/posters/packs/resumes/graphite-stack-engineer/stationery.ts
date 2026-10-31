import {
  A4_SIZE,
  avatar,
  CARD_SIZE,
  circle,
  icon,
  rect,
  type ThemeSpec,
  themed,
} from '../../../kit';
import {
  CONTACT_ICONS,
  CONTACTS,
  FONT,
  GRAPHITE,
  NAME,
  ROLE,
  roleTag,
  tile,
  writer,
} from './resume';

const LETTER_BODY = [
  'Dear Hiring Manager,',
  'I am excited to apply for the Software Engineer position at Tidewater Cloud. With a strong background across frontend and backend development, I build products that are fast, accessible and pleasant to maintain.',
  'At Quarry Labs I lead the team behind our realtime editor. We shipped live collaboration to more than 30,000 teams, halved API response times and set up release automation that turned risky deploys into routine ones. I enjoy pairing with designers and product managers to find the simplest version of every idea.',
  'I am particularly drawn to Tidewater because of your focus on developer experience and thoughtful engineering culture. I am confident my technical skills, curiosity and steady approach would make me a strong addition to your team.',
  'Thank you for considering my application. I would welcome the chance to discuss how I can contribute to what Tidewater builds next.',
  'Warm regards,',
].join('\n\n');

const letterSpec = {
  colors: {
    background: {
      value: GRAPHITE.page,
      hint: 'Page, the words on the role tag and the contact icons',
    },
    primary: { value: GRAPHITE.crimson, hint: 'Header band and footer strip' },
    accent: { value: GRAPHITE.amber, hint: 'Photo ring' },
    secondary: { value: GRAPHITE.tag, hint: 'Role tag and the circles behind the contact icons' },
    text: { value: GRAPHITE.white, hint: 'Name, contacts, recipient, date, letter and signature' },
  },
  fonts: { body: FONT },
  copy: {
    name: { ...NAME, hint: 'Shown in the header and as the signature' },
    role: ROLE,
    contacts: CONTACTS,
    recipient: {
      label: 'Recipient',
      value: 'Hiring Manager\nTidewater Cloud\n2450 Lakeview Plaza\nPort Ellis, CA 90411',
    },
    date: { label: 'Date', value: 'October 12, 2027' },
    letter: { label: 'Letter', value: LETTER_BODY },
  },
} as const satisfies ThemeSpec;

const { width: W, height: H } = A4_SIZE;

export const engineerLetter = themed(W, H, letterSpec, (t) => {
  const write = writer(t.font('body'));
  const ink = t.color('text');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    rect(0, 0, W, 300, t.color('primary'), { name: 'Header' }),
    write(t.copy('name'), 110, 84, 480, 56, ink, { fontWeight: 500, lineHeight: 1.2 }),
    roleTag(write, t.copy('role'), 112, 172, 210, 22, t.color('secondary'), t.color('background')),
    avatar('man-portrait-1', 640, 150, 96, t.color('accent')),
    t.list('contacts').map((value, index) => [
      circle(822, 96 + index * 58, 22, t.color('secondary')),
      icon(CONTACT_ICONS[index] ?? 'mail', 810, 84 + index * 58, 24, t.color('background'), {
        strokeWidth: 2,
      }),
      write(value, 862, 82 + index * 58, 320, 22, ink, { fontWeight: 500 }),
    ]),
    write(t.copy('recipient'), 110, 400, 600, 24, ink),
    write(t.copy('date'), 730, 560, 400, 24, ink, { align: 'right' }),
    write(t.copy('letter'), 110, 620, 1020, 24, ink, { lineHeight: 1.65 }),
    write(t.copy('name'), 110, 1420, 600, 40, ink, { fontWeight: 500 }),
    rect(0, 1680, W, 74, t.color('primary'), { name: 'Footer' }),
  ];
});

const { width: CW, height: CH } = CARD_SIZE;

const frontSpec = {
  colors: {
    background: { value: GRAPHITE.page, hint: 'Card and the words on the role tag' },
    accent: { value: GRAPHITE.amber, hint: 'Photo ring' },
    secondary: { value: GRAPHITE.tag, hint: 'Role tag' },
    text: { value: GRAPHITE.white, hint: 'Name' },
  },
  fonts: { body: FONT },
  copy: { name: NAME, role: ROLE },
} as const satisfies ThemeSpec;

export const engineerCardFront = themed(CW, CH, frontSpec, (t) => {
  const write = writer(t.font('body'));
  return [
    rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
    avatar('man-portrait-1', 250, 300, 120, t.color('accent')),
    write(t.copy('name'), 410, 238, 600, 62, t.color('text'), { fontWeight: 500, lineHeight: 1.2 }),
    roleTag(write, t.copy('role'), 414, 330, 220, 24, t.color('secondary'), t.color('background')),
  ];
});

const backSpec = {
  colors: {
    background: {
      value: GRAPHITE.page,
      hint: 'Card, the words on the role tag and the QR code',
    },
    surface: { value: GRAPHITE.panel, hint: 'Contact tiles' },
    primary: { value: GRAPHITE.crimson, hint: 'Name panel and the website pill' },
    accent: {
      value: GRAPHITE.amber,
      hint: 'Photo ring, contact icons and the outline of the first contact tile',
    },
    secondary: { value: GRAPHITE.tag, hint: 'Role tag' },
    text: { value: GRAPHITE.white, hint: 'Name, contacts, website and the QR tile' },
  },
  fonts: { body: FONT },
  copy: {
    name: { ...NAME, value: 'Theo\nAlbright' },
    role: ROLE,
    contacts: CONTACTS,
    website: { label: 'Website', value: 'albright.dev' },
  },
} as const satisfies ThemeSpec;

export const engineerCardBack = themed(CW, CH, backSpec, (t) => {
  const write = writer(t.font('body'));
  const ink = t.color('text');
  return [
    rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
    rect(0, 0, 420, CH, t.color('primary'), { name: 'Name panel' }),
    write(t.copy('name'), 50, 60, 360, 52, ink, { fontWeight: 500, lineHeight: 1.15 }),
    roleTag(write, t.copy('role'), 52, 200, 190, 20, t.color('secondary'), t.color('background')),
    avatar('man-portrait-1', 210, 420, 92, t.color('accent')),
    t.list('contacts').map((value, index) => [
      tile(470, 60 + index * 100, 360, 80, index === 0, t.color('surface'), t.color('accent')),
      icon(CONTACT_ICONS[index] ?? 'mail', 494, 84 + index * 100, 30, t.color('accent'), {
        strokeWidth: 2,
      }),
      write(value, 540, 84 + index * 100, 280, 22, ink, { fontWeight: 500 }),
    ]),
    rect(470, 420, 300, 64, t.color('primary'), { cornerRadius: 32, name: 'Website pill' }),
    write(t.copy('website'), 470, 438, 300, 24, ink, {
      fontWeight: 600,
      align: 'center',
      lineHeight: 1.2,
    }),
    rect(860, 376, 150, 150, ink, { cornerRadius: 10, name: 'QR tile' }),
    icon('qr-code', 872, 388, 126, t.color('background'), { strokeWidth: 2 }),
  ];
});
