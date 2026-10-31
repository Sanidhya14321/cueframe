import type { DesignIconName } from '@/design';
import { A4_SIZE, CARD_SIZE, icon, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, HEADING, NAME, ROLE, SKY, writer } from './resume';

const CONTACT_ICONS: readonly DesignIconName[] = ['map-pin', 'mail', 'phone'];

const CONTACT = {
  label: 'Contact',
  value: ['12 Lisbon Street', 'kai@moreno.dev', '+1 (555) 300 1290'],
} as const;

const LETTER_BODY = [
  'I am excited to apply for the Frontend Developer role at Brightwave Digital. With a strong background in interface engineering and a habit of obsessing over details, I build web experiences that are quick to load, easy to use and pleasant to look at.',
  'In my current role at Northbeam Labs, I lead the component library behind our customer dashboard. I turned a tangle of one-off screens into reusable building blocks, improved accessibility scores across the product and helped cut load times by 40%.',
  'I am especially drawn to Brightwave because of your focus on thoughtful, human-centred products. I would love to bring my craft, curiosity and teamwork to your frontend group.',
  'Thank you for your time and consideration. I look forward to talking about how I can help Brightwave build what comes next.',
  'Kind regards,',
].join('\n\n');

const { width: W, height: H } = A4_SIZE;

const letterSpec = {
  colors: {
    background: { value: SKY.white, hint: 'Page and the contact details in the dark bar' },
    surface: { value: SKY.haze, hint: 'Header band behind the name' },
    primary: {
      value: SKY.navy,
      hint: 'First name, the contact bar, the signature and the footer bar',
    },
    accent: { value: SKY.cyan, hint: 'Last name and the contact icons' },
    text: { value: SKY.text, hint: 'Job title, recipient, greeting, date and the letter body' },
  },
  fonts: {
    heading: HEADING,
    body: BODY,
    script: { label: 'Signature font', value: 'Satisfy' },
  },
  copy: {
    name: NAME,
    role: ROLE,
    contact: CONTACT,
    recipient: {
      label: 'Recipient',
      value: 'Hiring Manager\nBrightwave Digital\n77 Harbour Road\nPort Ellis, CA 90411',
    },
    greeting: { label: 'Greeting', value: 'Dear Hiring Manager,' },
    date: { label: 'Date', value: 'March 4, 2027' },
    body: { label: 'Letter body', value: LETTER_BODY },
    signature: { label: 'Signature', value: 'Kai Moreno' },
  },
} as const satisfies ThemeSpec;

export const developerLetter = themed(W, H, letterSpec, (t) => {
  const copy = writer(t.font('body'));
  const heading = writer(t.font('heading'));
  const [first = '', last = ''] = t.list('name');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    rect(0, 0, W, 300, t.color('surface'), { name: 'Header' }),
    heading(first, 0, 92, 512, 86, t.color('primary'), {
      fontWeight: 700,
      align: 'right',
      lineHeight: 1.1,
    }),
    heading(last, 530, 92, 640, 86, t.color('accent'), { fontWeight: 700, lineHeight: 1.1 }),
    copy(t.copy('role'), 0, 200, W, 32, t.color('text'), { align: 'center', letterSpacing: 5 }),
    rect(0, 300, W, 84, t.color('primary'), { name: 'Contact bar' }),
    t.list('contact').map((value, index) => [
      icon(CONTACT_ICONS[index] ?? 'mail', 130 + index * 360, 326, 30, t.color('accent'), {
        strokeWidth: 2,
      }),
      copy(value, 176 + index * 360, 326, 300, 22, t.color('background')),
    ]),
    copy(t.copy('recipient'), 150, 470, 600, 25, t.color('text'), { fontWeight: 700 }),
    copy(t.copy('greeting'), 150, 700, 600, 24, t.color('text')),
    copy(t.copy('date'), 690, 700, 400, 24, t.color('text'), { align: 'right' }),
    copy(t.copy('body'), 150, 770, 940, 24, t.color('text'), { lineHeight: 1.55 }),
    writer(t.font('script'))(t.copy('signature'), 150, 1470, 600, 64, t.color('primary')),
    rect(0, 1680, W, 74, t.color('primary'), { name: 'Footer' }),
  ];
});

const { width: CW, height: CH } = CARD_SIZE;

const frontSpec = {
  colors: {
    background: { value: SKY.white, hint: 'Card' },
    surface: { value: SKY.haze, hint: 'Band across the middle' },
    primary: { value: SKY.navy, hint: 'First name' },
    accent: { value: SKY.cyan, hint: 'Vertical accent line and the last name' },
    text: { value: SKY.text, hint: 'Job title' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: { name: NAME, role: ROLE },
} as const satisfies ThemeSpec;

export const developerCardFront = themed(CW, CH, frontSpec, (t) => {
  const heading = writer(t.font('heading'));
  const [first = '', last = ''] = t.list('name');
  return [
    rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
    rect(0, 120, CW, 360, t.color('surface'), { name: 'Center band' }),
    rect(250, 0, 12, CH, t.color('accent'), { name: 'Accent line' }),
    heading(first, 320, 210, 200, 76, t.color('primary'), { fontWeight: 700, lineHeight: 1.1 }),
    heading(last, 472, 210, 520, 76, t.color('accent'), { fontWeight: 700, lineHeight: 1.1 }),
    writer(t.font('body'))(t.copy('role'), 324, 318, 680, 28, t.color('text'), {
      letterSpacing: 4,
    }),
  ];
});

const backSpec = {
  colors: {
    background: {
      value: SKY.haze,
      hint: 'Card; its white tint colors the contact details in the dark bar',
    },
    primary: { value: SKY.navy, hint: 'First name and the contact bar' },
    accent: { value: SKY.cyan, hint: 'Last name, the contact icons and the bottom edge stripe' },
    text: { value: SKY.text, hint: 'Job title' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: { name: NAME, role: ROLE, contact: CONTACT },
} as const satisfies ThemeSpec;

export const developerCardBack = themed(CW, CH, backSpec, (t) => {
  const heading = writer(t.font('heading'));
  const copy = writer(t.font('body'));
  const [first = '', last = ''] = t.list('name');
  return [
    rect(0, 0, CW, CH, t.color('background'), { name: 'Background' }),
    heading(first, 120, 150, 200, 76, t.color('primary'), { fontWeight: 700, lineHeight: 1.1 }),
    heading(last, 272, 150, 520, 76, t.color('accent'), { fontWeight: 700, lineHeight: 1.1 }),
    copy(t.copy('role'), 124, 256, 680, 28, t.color('text'), { letterSpacing: 4 }),
    rect(0, 400, CW, 100, t.color('primary'), { name: 'Contact bar' }),
    t.list('contact').map((value, index) => [
      icon(CONTACT_ICONS[index] ?? 'mail', 50 + index * 340, 436, 28, t.color('accent'), {
        strokeWidth: 2,
      }),
      copy(value, 90 + index * 340, 435, 270, 20, t.shade('background', SKY.white)),
    ]),
    rect(0, CH - 16, CW, 16, t.color('accent'), { name: 'Edge stripe' }),
  ];
});
