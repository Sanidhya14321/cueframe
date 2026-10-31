import { A4_SIZE, CARD_SIZE, icon, photo, rect, type ThemeSpec, themed } from '../../../kit';
import { CONTACT_COPY, copy, marble, NAME, outline, POPPINS, ROSE } from './art';

const GLYPHS = ['mail', 'phone', 'map-pin'] as const;

const LETTER_BODY = [
  'Dear Hiring Manager,',
  'I am excited to apply for the Real Estate Advisor position at Cedar Lane Realty. Helping people find the right home is what I love most, and over the past eight years I have built a steady record of happy clients, strong referrals and well-run sales.',
  'At Harborview Realty I have guided more than 60 households through purchases and sales worth over $40 million in total. I pride myself on honest advice, careful preparation and listings that stand out, from styled photography to welcoming open houses.',
  'Cedar Lane is known for its warm, community-first approach, and I would be proud to bring my local knowledge, energy and client care to your growing team.',
  'Thank you for your time. I would love the chance to talk about how I can help your clients feel at home.',
  'Warm regards,',
].join('\n\n');

const { width: W, height: H } = A4_SIZE;

const letterSpec = {
  colors: {
    primary: {
      value: ROSE.navy,
      hint: 'Marble backdrop, name, job title, contact icons and details and the signature; its lighter shade colors the top of the marble',
    },
    accent: {
      value: ROSE.blush,
      hint: 'Header and footer bands; its translucent shade colors the marble veins',
    },
    surface: {
      value: ROSE.white,
      hint: 'Letter sheet; its translucent shade colors the marble glints',
    },
    text: { value: ROSE.ink, hint: 'Recipient address and letter body' },
  },
  fonts: {
    heading: { label: 'Heading font', value: 'Poppins' },
    body: POPPINS,
    script: { label: 'Signature font', value: 'Satisfy' },
  },
  copy: {
    ...NAME,
    contacts: CONTACT_COPY,
    recipient: {
      label: 'Recipient',
      value: 'Hiring Manager\nCedar Lane Realty\n310 Orchard Avenue\nBayfield, FL 32801',
    },
    letter: { label: 'Letter', value: LETTER_BODY },
    signature: { label: 'Signature', value: 'Amara Quinn' },
  },
} as const satisfies ThemeSpec;

export const realtorLetter = themed(W, H, letterSpec, (t) => {
  const heading = t.font('heading');
  const body = t.font('body');
  const navy = t.color('primary');
  return [
    marble(
      0,
      0,
      W,
      H,
      {
        top: t.shade('primary', ROSE.marble),
        base: navy,
        vein: t.shade('accent', ROSE.vein),
        glint: t.shade('surface', ROSE.glint),
        clear: t.shade('primary', ROSE.clear),
      },
      { flip: true },
    ),
    rect(90, 90, 1060, 300, t.color('accent'), { name: 'Header' }),
    copy(t.copy('first'), 150, 128, 560, 62, navy, heading, { fontWeight: 300, lineHeight: 1.05 }),
    copy(t.copy('last'), 150, 190, 560, 80, navy, heading, { fontWeight: 800, lineHeight: 1.05 }),
    copy(t.copy('role'), 152, 300, 500, 22, navy, heading, { fontWeight: 700, letterSpacing: 2 }),
    t
      .list('contacts')
      .map((value, index) => [
        icon(GLYPHS[index] ?? 'mail', 740, 156 + index * 60, 28, navy, { strokeWidth: 2 }),
        copy(value, 784, 156 + index * 60, 340, 22, navy, body),
      ]),
    rect(90, 390, 1060, 1190, t.color('surface'), { name: 'Letter body' }),
    copy(t.copy('recipient'), 150, 450, 600, 23, t.color('text'), body),
    copy(t.copy('letter'), 150, 650, 940, 23, t.color('text'), body, { lineHeight: 1.55 }),
    copy(t.copy('signature'), 150, 1440, 600, 62, navy, t.font('script')),
    rect(90, 1580, 1060, 84, t.color('accent'), { name: 'Footer band' }),
  ];
});

const { width: CW, height: CH } = CARD_SIZE;

const frontSpec = {
  colors: {
    primary: {
      value: ROSE.navy,
      hint: 'Marble backdrop and the name panel; its lighter shade colors the top of the marble and its translucent shade the marble glints',
    },
    accent: {
      value: ROSE.blush,
      hint: 'Name, job title and frame lines; its translucent shade colors the marble veins',
    },
  },
  fonts: { heading: { label: 'Heading font', value: 'Poppins' } },
  copy: NAME,
} as const satisfies ThemeSpec;

export const realtorCardFront = themed(CW, CH, frontSpec, (t) => {
  const heading = t.font('heading');
  const blush = t.color('accent');
  const clear = t.shade('accent', ROSE.clear);
  return [
    marble(0, 0, CW, CH, {
      top: t.shade('primary', ROSE.marble),
      base: t.color('primary'),
      vein: t.shade('accent', ROSE.vein),
      glint: t.shade('primary', ROSE.glint),
      clear,
    }),
    outline(240, 110, 640, 330, blush, clear, 3),
    outline(170, 160, 640, 330, blush, clear, 3),
    rect(200, 135, 650, 330, t.color('primary'), { name: 'Name panel' }),
    copy(t.copy('first'), 270, 190, 520, 56, blush, heading, { fontWeight: 300, lineHeight: 1.05 }),
    copy(t.copy('last'), 270, 248, 520, 76, blush, heading, { fontWeight: 800, lineHeight: 1.05 }),
    copy(t.copy('role'), 274, 348, 520, 20, blush, heading, { fontWeight: 700, letterSpacing: 2 }),
  ];
});

const backSpec = {
  colors: {
    background: {
      value: ROSE.blush,
      hint: 'Card background and the frame line behind the photo; its translucent shade colors the marble veins',
    },
    primary: {
      value: ROSE.navy,
      hint: 'Marble strip, name, job title, contact icons and details, corner block and edge bar; its shades color the top of the marble and the marble glints',
    },
  },
  fonts: { heading: { label: 'Heading font', value: 'Poppins' }, body: POPPINS },
  copy: { ...NAME, contacts: CONTACT_COPY },
} as const satisfies ThemeSpec;

export const realtorCardBack = themed(CW, CH, backSpec, (t) => {
  const heading = t.font('heading');
  const navy = t.color('primary');
  const clear = t.shade('background', ROSE.clear);
  return [
    rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
    rect(36, 36, 36, 36, navy, { name: 'Corner block' }),
    rect(0, 300, 14, 230, navy, { name: 'Edge bar' }),
    copy(t.copy('first'), 90, 70, 500, 50, navy, heading, { fontWeight: 300, lineHeight: 1.05 }),
    copy(t.copy('last'), 90, 120, 500, 66, navy, heading, { fontWeight: 800, lineHeight: 1.05 }),
    copy(t.copy('role'), 92, 206, 500, 18, navy, heading, { fontWeight: 700, letterSpacing: 2 }),
    t
      .list('contacts')
      .map((value, index) => [
        icon(GLYPHS[index] ?? 'mail', 92, 300 + index * 62, 28, navy, { strokeWidth: 2 }),
        copy(value, 136, 300 + index * 62, 460, 23, navy, t.font('body')),
      ]),
    marble(
      620,
      0,
      430,
      CH,
      {
        top: t.shade('primary', ROSE.marble),
        base: navy,
        vein: t.shade('background', ROSE.vein),
        glint: t.shade('primary', ROSE.glint),
        clear,
      },
      { flip: true },
    ),
    outline(706, 50, 300, 430, t.color('background'), clear, 3),
    photo('woman-portrait-1', 672, 86, 300, 440, { cornerRadius: 14 }),
  ];
});
