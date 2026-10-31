import { linear } from '@/design';
import { avatar, icon, line, poly, rect, type ThemeSpec, text, themed } from '../../../kit';
import { FONTS, LETTER, TIDE } from './parts';

const CONTACT_ICONS = ['phone', 'mail', 'map-pin'] as const;
const BUBBLE_END = '#0c8a79';

const letterSpec = {
  colors: {
    background: { value: TIDE.paper, hint: 'Page' },
    surface: { value: TIDE.card, hint: 'Header band' },
    primary: {
      value: TIDE.teal,
      hint: 'Job title and the message bubble; its darker shades color the bubble end, tail and contact icons',
    },
    secondary: { value: TIDE.white, hint: 'Letter text and the photo ring' },
    text: {
      value: TIDE.ink,
      hint: 'Name and contacts; its lighter shades color the header rule, status, date and Delivered',
    },
  },
  fonts: FONTS,
  copy: {
    name: { label: 'Name', hint: 'First name, then last name', value: ['Maya', 'Linden'] },
    role: { label: 'Job title', value: 'Product Designer' },
    contacts: {
      label: 'Contact',
      value: ['(555) 210-4477', 'maya@linden.studio', '48 Harbor Lane'],
    },
    status: { label: 'Status', value: 'Application Sent' },
    date: { label: 'Date', value: 'March 12, 2026' },
    letter: {
      label: 'Letter',
      value: [
        'Hiring Team\nNorthbeam Health\n1200 Pier Street\nPortland, OR 97209',
        'Hello Northbeam team,',
        'I am excited to apply for the Senior Product Designer role. For eight years I have shaped mobile products that people open every day, from booking flows to habit trackers, always starting from real conversations with customers.',
        'At Harbor Health I led the redesign of our patient app, cutting onboarding time by 35% and lifting task success to 92%. I also built the design system that now powers four product teams.',
        'Your focus on calm, human healthcare tools is exactly the kind of work I want to do next. I would love to talk about how I can help the team ship with clarity and care.',
        'Warm regards,\nMaya Linden',
      ].join('\n\n'),
    },
    delivered: { label: 'Delivery note', value: 'Delivered' },
  },
} as const satisfies ThemeSpec;

export const coverLetter = themed(LETTER.width, LETTER.height, letterSpec, (t) => {
  const [first = '', last = ''] = t.list('name');
  const body = t.font('body');
  return [
    rect(0, 0, LETTER.width, LETTER.height, t.color('background'), { name: 'Background' }),
    rect(0, 0, LETTER.width, 320, t.color('surface'), { name: 'Header' }),
    text(first, 110, 70, 420, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1,
    }),
    text(last, 110, 162, 420, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 400,
      fill: t.color('text'),
      lineHeight: 1,
    }),
    text(t.copy('role'), 110, 266, 420, {
      fontFamily: body,
      fontSize: 30,
      fontWeight: 500,
      fill: t.color('primary'),
    }),
    avatar('woman-portrait-4', 640, 165, 92, t.color('secondary')),
    t.list('contacts').map((contact, index) => [
      icon(
        CONTACT_ICONS[index] ?? 'phone',
        820,
        100 + index * 60,
        30,
        t.shade('primary', TIDE.deep),
        {
          strokeWidth: 2.2,
        },
      ),
      text(contact, 868, 102 + index * 60, 360, {
        fontFamily: body,
        fontSize: 26,
        fontWeight: 500,
        fill: t.color('text'),
      }),
    ]),
    line(0, 320, LETTER.width, t.shade('text', TIDE.grey), 3),
    text(t.copy('status'), 0, 370, LETTER.width, {
      fontFamily: body,
      fontSize: 28,
      fontWeight: 700,
      fill: t.shade('text', TIDE.muted),
      align: 'center',
    }),
    text(t.copy('date'), 0, 410, LETTER.width, {
      fontFamily: body,
      fontSize: 26,
      fontWeight: 400,
      fill: t.shade('text', TIDE.muted),
      align: 'center',
    }),
    poly(
      [
        [1080, 1440],
        [1150, 1440],
        [1170, 1500],
        [1110, 1478],
      ],
      t.shade('primary', BUBBLE_END),
      { name: 'Bubble tail' },
    ),
    rect(150, 480, 990, 1000, linear(160, t.color('primary'), t.shade('primary', BUBBLE_END)), {
      cornerRadius: 36,
      name: 'Message bubble',
    }),
    text(t.copy('letter'), 200, 530, 890, {
      fontFamily: body,
      fontSize: 27,
      fontWeight: 400,
      fill: t.color('secondary'),
      lineHeight: 1.5,
    }),
    text(t.copy('delivered'), 800, 1520, 340, {
      fontFamily: body,
      fontSize: 26,
      fontWeight: 700,
      fill: t.shade('text', TIDE.muted),
      align: 'right',
    }),
  ];
});
