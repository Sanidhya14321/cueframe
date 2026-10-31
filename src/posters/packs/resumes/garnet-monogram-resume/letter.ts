import { CARD_SIZE, circle, icon, line, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY_FONT,
  CLEAR,
  CONTACT_ICONS,
  CONTACTS,
  caps,
  doubleRule,
  GARNET,
  HEADING_FONT,
  INITIALS,
  iconTile,
  LETTER,
  LETTER_TEXT,
  monogram,
  NAME,
  ROLE,
  SCRIPT_FONT,
} from './brand';

const letterSpec = {
  colors: {
    background: { value: GARNET.paper, hint: 'Page and the disc behind the pen icon' },
    primary: {
      value: GARNET.wine,
      hint: 'Sidebar, the monogram letters and ring, the pen icon, the title and the signature',
    },
    secondary: {
      value: GARNET.rose,
      hint: 'Monogram, contact icons, the title bar and the ring around the pen icon',
    },
    surface: {
      value: '#ffffff',
      hint: 'Name, Contact heading and contact details on the sidebar; its pink tint colors the role and the dashed line',
    },
    text: { value: GARNET.ink, hint: 'Date and the letter' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT, script: SCRIPT_FONT },
  copy: {
    initials: INITIALS,
    name: NAME,
    role: ROLE,
    contactTitle: { label: 'Contact heading', value: 'CONTACT' },
    contacts: CONTACTS,
    title: { label: 'Title', value: 'COVER LETTER' },
    date: { label: 'Date', value: 'MAY 4, 2026' },
    letter: { label: 'Letter', value: LETTER_TEXT },
    signature: { label: 'Signature', value: 'Arlo Vance' },
  },
} as const satisfies ThemeSpec;

export const coverLetter = themed(LETTER.width, LETTER.height, letterSpec, (t) => {
  const small = caps(t.font('heading'));
  const wine = t.color('primary');
  const rose = t.color('secondary');
  const white = t.color('surface');
  const pink = t.shade('surface', '#f6d3e0');
  return [
    rect(0, 0, LETTER.width, LETTER.height, t.color('background'), { name: 'Background' }),
    rect(0, 0, 400, LETTER.height, wine, { name: 'Sidebar' }),
    monogram(t.copy('initials'), 125, 90, 150, {
      fill: rose,
      color: wine,
      clear: t.shade('primary', CLEAR),
      fontFamily: t.font('heading'),
    }),
    text(t.copy('name'), 60, 300, 320, {
      fontFamily: t.font('heading'),
      fontSize: 64,
      fontWeight: 500,
      fill: white,
      letterSpacing: 1,
    }),
    small(t.copy('role'), 62, 380, 300, 28, pink),
    line(60, 490, 280, pink, 2, { dashed: true }),
    text(t.copy('contactTitle'), 60, 540, 300, {
      fontFamily: t.font('heading'),
      fontSize: 42,
      fontWeight: 500,
      fill: white,
    }),
    t
      .list('contacts')
      .map((label, index) => [
        icon(CONTACT_ICONS[index] ?? 'mail', 60, 618 + index * 64, 30, rose, { strokeWidth: 2.2 }),
        small(label, 108, 618 + index * 64, 280, 22, white),
      ]),
    rect(500, 130, 775, 90, rose, { name: 'Title bar' }),
    circle(510, 175, 66, t.color('background'), { stroke: rose, strokeWidth: 8 }),
    icon('pen-tool', 478, 143, 64, wine, { strokeWidth: 2 }),
    text(t.copy('title'), 600, 146, 600, {
      fontFamily: t.font('heading'),
      fontSize: 54,
      fontWeight: 600,
      fill: wine,
      letterSpacing: 2,
    }),
    text(t.copy('date'), 480, 300, 600, {
      fontFamily: t.font('heading'),
      fontSize: 30,
      fontWeight: 600,
      fill: t.color('text'),
    }),
    text(t.copy('letter'), 480, 360, 720, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 400,
      fill: t.color('text'),
      lineHeight: 1.6,
    }),
    text(t.copy('signature'), 480, 1250, 500, {
      fontFamily: t.font('script'),
      fontSize: 72,
      fontWeight: 700,
      fill: wine,
    }),
  ];
});

const { width: CW, height: CH } = CARD_SIZE;

const frontSpec = {
  colors: {
    background: { value: GARNET.wine, hint: 'Card and the monogram letters and ring' },
    primary: { value: GARNET.rose, hint: 'Monogram and the bottom edge' },
    text: { value: '#ffffff', hint: 'Studio name' },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    initials: INITIALS,
    studio: { label: 'Studio name', value: 'VANCE\nSTUDIO' },
  },
} as const satisfies ThemeSpec;

export const cardFront = themed(CW, CH, frontSpec, (t) => [
  rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
  monogram(t.copy('initials'), 180, 150, 300, {
    fill: t.color('primary'),
    color: t.color('background'),
    clear: t.shade('background', CLEAR),
    fontFamily: t.font('heading'),
  }),
  text(t.copy('studio'), 560, 210, 420, {
    fontFamily: t.font('heading'),
    fontSize: 84,
    fontWeight: 600,
    fill: t.color('text'),
    lineHeight: 1,
    letterSpacing: 4,
  }),
  rect(0, CH - 14, CW, 14, t.color('primary'), { name: 'Edge' }),
]);

const backSpec = {
  colors: {
    background: { value: GARNET.paper, hint: 'Card' },
    primary: {
      value: GARNET.wine,
      hint: 'Left panel, the monogram letters and ring and the contact icons',
    },
    secondary: { value: GARNET.rose, hint: 'Monogram, the icon tiles and the bottom edge' },
    text: {
      value: GARNET.ink,
      hint: 'Name, the double rule and contact details; its softer shade colors the role',
    },
  },
  fonts: { heading: HEADING_FONT },
  copy: { initials: INITIALS, name: NAME, role: ROLE, contacts: CONTACTS },
} as const satisfies ThemeSpec;

export const cardBack = themed(CW, CH, backSpec, (t) => {
  const small = caps(t.font('heading'));
  const wine = t.color('primary');
  const rose = t.color('secondary');
  const ink = t.color('text');
  return [
    rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
    rect(0, 0, 400, CH, wine, { name: 'Panel' }),
    monogram(t.copy('initials'), 100, 200, 200, {
      fill: rose,
      color: wine,
      clear: t.shade('primary', CLEAR),
      fontFamily: t.font('heading'),
    }),
    text(t.copy('name'), 460, 80, 560, {
      fontFamily: t.font('heading'),
      fontSize: 68,
      fontWeight: 600,
      fill: ink,
      letterSpacing: 1,
    }),
    small(t.copy('role'), 462, 160, 400, 26, t.shade('text', GARNET.muted)),
    doubleRule(460, 260, 540, ink),
    t.list('contacts').map((label, index) => [
      iconTile(CONTACT_ICONS[index] ?? 'mail', 460, 310 + index * 74, 46, {
        tile: rose,
        glyph: wine,
      }),
      small(label, 524, 316 + index * 74, 480, 28, ink),
    ]),
    rect(0, CH - 14, CW, 14, rose, { name: 'Edge' }),
  ];
});
