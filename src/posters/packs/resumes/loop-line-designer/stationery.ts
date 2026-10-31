import { A4_SIZE, CARD_SIZE, icon, rect, type ThemeSpec, themed } from '../../../kit';
import {
  BODY_FONT,
  bezier,
  CLEAR,
  copy,
  GRID_LINE,
  grid,
  HEADING_FONT,
  LOOP,
  swatches,
  swirl,
} from './art';

const CONTACT_ICONS = ['phone', 'mail', 'globe'] as const;

const LETTER_BODY = [
  'I am writing to share my enthusiasm for the Graphic Designer position at Northlight Collective. I have followed your studio for a while, especially the bold riverfront festival identity, and I would love to bring fresh ideas and careful craft to your team.',
  'Over the last few years I have built a solid foundation in identity, editorial and campaign design. My portfolio covers type-led posters, packaging systems and playful illustration, and I enjoy turning messy briefs into clear, memorable visuals that work across print and screen.',
  'Joining Northlight would be the perfect next step. I am available for an interview at your convenience and would be glad to walk you through recent projects.',
  'Sincerely,',
].join('\n\n');

const FONTS = { heading: HEADING_FONT, body: BODY_FONT } as const;
const ROLE = { label: 'Role', value: 'Graphic Designer' } as const;

const { width: W, height: H } = A4_SIZE;

const letterSpec = {
  colors: {
    background: {
      value: LOOP.night,
      hint: 'Page, the header swirl and pen curve, the name, role pill and footer contacts',
    },
    primary: {
      value: LOOP.lime,
      hint: 'Header and footer bands, the greeting, date and signature',
    },
    text: {
      value: LOOP.white,
      hint: 'Role text, recipient address, letter body and curve anchors',
    },
  },
  fonts: FONTS,
  copy: {
    name: { label: 'Name', value: 'Ivy Sorensen', hint: 'Shown in the header and the signature' },
    role: ROLE,
    recipient: {
      label: 'Recipient',
      value: 'Hiring Manager\nNorthlight Collective\n18 Foundry Yard\nRiverton, OR 97014',
    },
    greeting: { label: 'Greeting', value: 'Dear Hiring Team,' },
    date: { label: 'Date', value: 'Date: 03/11/27' },
    letter: { label: 'Letter', value: LETTER_BODY },
    contacts: {
      label: 'Contact',
      value: ['+1 (555) 610 2234', 'ivy@sorensen.design', 'sorensen.design'],
    },
  },
} as const satisfies ThemeSpec;

export const designerLetter = themed(W, H, letterSpec, (t) => {
  const heading = copy(t.font('heading'));
  const body = copy(t.font('body'));
  const night = t.color('background');
  const lime = t.color('primary');
  const white = t.color('text');
  const clear = t.shade('background', CLEAR);
  return [
    rect(0, 0, W, H, night, { name: 'Background' }),
    rect(0, 0, W, 330, lime, { name: 'Header' }),
    swirl(36, 24, 236, night, 16, clear),
    bezier(1000, 150, 140, 140, { stroke: night, anchor: white, clear }),
    heading(t.copy('name'), 0, 66, W, 100, night, {
      fontWeight: 700,
      align: 'center',
      lineHeight: 1.1,
    }),
    rect(470, 216, 300, 64, night, { cornerRadius: 32, name: 'Role pill' }),
    heading(t.copy('role'), 470, 232, 300, 25, white, {
      fontWeight: 600,
      align: 'center',
      lineHeight: 1.2,
    }),
    body(t.copy('recipient'), 150, 420, 600, 24, white),
    body(t.copy('greeting'), 150, 640, 500, 25, lime, { fontWeight: 700 }),
    body(t.copy('date'), 690, 640, 400, 25, lime, { fontWeight: 700, align: 'right' }),
    body(t.copy('letter'), 150, 712, 940, 24, white, { lineHeight: 1.7 }),
    body(t.copy('name'), 150, 1380, 500, 28, lime, { fontWeight: 700 }),
    rect(0, 1630, W, 124, lime, { name: 'Footer' }),
    t.list('contacts').map((value, index) => [
      icon(CONTACT_ICONS[index] ?? 'phone', 140 + index * 360, 1676, 32, night, {
        strokeWidth: 2,
      }),
      body(value, 186 + index * 360, 1677, 300, 22, night, { fontWeight: 500 }),
    ]),
  ];
});

const { width: CW, height: CH } = CARD_SIZE;

const frontSpec = {
  colors: {
    background: {
      value: LOOP.night,
      hint: 'Card, role text and, in a darker shade, the swatch outlines',
    },
    primary: { value: LOOP.lime, hint: 'Swirl, top swatch and the role pill' },
    secondary: { value: LOOP.lilac, hint: 'Back swatch' },
    text: {
      value: LOOP.white,
      hint: 'Name, cursor, front swatch and the pen curve; its faint shade draws the grid',
    },
  },
  fonts: { heading: HEADING_FONT },
  copy: { name: { label: 'Name', value: 'Ivy\nSorensen' }, role: ROLE },
} as const satisfies ThemeSpec;

export const designerCardFront = themed(CW, CH, frontSpec, (t) => {
  const heading = copy(t.font('heading'));
  const night = t.color('background');
  const lime = t.color('primary');
  const white = t.color('text');
  const clear = t.shade('background', CLEAR);
  return [
    rect(0, 0, CW, CH, night, { name: 'Background' }),
    grid(CW, CH, 50, t.shade('text', GRID_LINE)),
    swirl(30, 20, 250, lime, 18, clear),
    swatches(80, 360, 110, {
      back: t.color('secondary'),
      front: white,
      top: lime,
      edge: t.shade('background', LOOP.deep),
    }),
    heading(t.copy('name'), 400, 110, 620, 104, white, { fontWeight: 700, lineHeight: 1.02 }),
    rect(940, 230, 4, 90, white, { name: 'Text cursor' }),
    rect(404, 352, 330, 62, lime, { cornerRadius: 31, name: 'Role pill' }),
    heading(t.copy('role'), 404, 367, 330, 26, night, {
      fontWeight: 600,
      align: 'center',
      lineHeight: 1.2,
    }),
    bezier(810, 450, 170, 100, { stroke: white, anchor: white, clear }),
  ];
});

const backSpec = {
  colors: {
    background: {
      value: LOOP.night,
      hint: 'Left half, role text, the QR code and the website pill',
    },
    primary: { value: LOOP.lime, hint: 'Right half, the role pill and contact icons' },
    text: {
      value: LOOP.white,
      hint: 'Name, contact details, QR tile and website; its faint shade draws the grid',
    },
  },
  fonts: FONTS,
  copy: {
    name: { label: 'Name', value: 'Ivy Sorensen' },
    role: ROLE,
    contacts: { label: 'Contact', value: ['+1 (555) 610 2234', 'ivy@sorensen.design'] },
    website: { label: 'Website', value: 'sorensen.design' },
  },
} as const satisfies ThemeSpec;

export const designerCardBack = themed(CW, CH, backSpec, (t) => {
  const heading = copy(t.font('heading'));
  const body = copy(t.font('body'));
  const night = t.color('background');
  const lime = t.color('primary');
  const white = t.color('text');
  return [
    rect(0, 0, CW, CH, night, { name: 'Background' }),
    grid(525, CH, 50, t.shade('text', GRID_LINE)),
    rect(525, 0, 525, CH, lime, { name: 'Lime half' }),
    heading(t.copy('name'), 56, 90, 460, 52, white, { fontWeight: 700, lineHeight: 1.1 }),
    rect(56, 172, 270, 54, lime, { cornerRadius: 27, name: 'Role pill' }),
    heading(t.copy('role'), 56, 186, 270, 22, night, {
      fontWeight: 600,
      align: 'center',
      lineHeight: 1.2,
    }),
    t
      .list('contacts')
      .map((value, index) => [
        icon(CONTACT_ICONS[index] ?? 'phone', 58, 300 + index * 64, 30, lime, { strokeWidth: 2 }),
        body(value, 104, 301 + index * 64, 400, 23, white),
      ]),
    rect(667, 90, 240, 240, white, { cornerRadius: 18, name: 'QR tile' }),
    icon('qr-code', 687, 110, 200, night, { strokeWidth: 2 }),
    rect(612, 400, 350, 72, night, { cornerRadius: 36, name: 'Website pill' }),
    heading(t.copy('website'), 612, 420, 350, 25, white, {
      fontWeight: 600,
      align: 'center',
      lineHeight: 1.2,
    }),
  ];
});
