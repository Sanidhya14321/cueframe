import { linear } from '@/design';
import { icon, rect, shadow, type Theme, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, backdrop, GLOW, H, HEADING, shine, VOLT, W, words } from './posts';

const reviewsSpec = {
  colors: {
    background: { value: VOLT.black, hint: 'Dark top of the page' },
    primary: {
      value: VOLT.blue,
      hint: 'Page glow, the Reviews headline, the verified icons and the logo tiles on the cards',
    },
    surface: {
      value: VOLT.white,
      hint: 'Front review card; its cooler shades color the two cards behind it',
    },
    secondary: {
      value: VOLT.ink,
      hint: 'Company names on the cards; its grey shades color the time stamps and quotes',
    },
    text: {
      value: VOLT.white,
      hint: 'Client and 100% Verified; its grey shade colors the line at the bottom',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Client' },
    highlight: { label: 'Highlighted title', value: 'Reviews' },
    badge: { label: 'Badge', value: '100% Verified' },
    names: { label: 'Company', value: ['Mosaic Health', 'Corvid Labs', 'Brightwell'] },
    quotes: {
      label: 'Quote',
      value: [
        'Our go-to partner for workflow\nautomation.',
        'Quick turnaround on every\nsingle request.',
        'Fast delivery, clear updates and\nreal results for our team.',
      ],
    },
    time: { label: 'Time stamp', value: '2m ago' },
    footer: { label: 'Footer', value: 'Trusted by 2,400+ teams' },
  },
} as const satisfies ThemeSpec;

const CARDS = [
  { y: 840, width: 680, mark: 'leaf', fill: '#c9d6f2' },
  { y: 700, width: 740, mark: 'layers', fill: '#e6edfb' },
  { y: 560, width: 800, mark: 'zap', fill: VOLT.white },
] as const;

const reviewCard = (
  t: Theme<typeof reviewsSpec>,
  card: (typeof CARDS)[number],
  name: string,
  quote: string,
) => {
  const x = (W - card.width) / 2;
  const { y, width } = card;
  return [
    rect(x, y, width, 210, t.shade('surface', card.fill), {
      name: 'Review card',
      cornerRadius: 28,
      ...shadow(40, 14, 'rgba(0,0,0,0.5)'),
    }),
    rect(x + 32, y + 32, 96, 96, t.shade('primary', VOLT.navy), { name: 'Logo', cornerRadius: 22 }),
    icon(card.mark, x + 52, y + 52, 56, t.shade('primary', VOLT.sky)),
    text(name, x + 156, y + 34, 360, {
      fontFamily: t.font('heading'),
      fontSize: 34,
      fontWeight: 700,
      fill: t.color('secondary'),
    }),
    icon('badge-check', x + 156 + name.length * 19, y + 38, 32, t.color('primary')),
    text(t.copy('time'), x + width - 170, y + 40, 140, {
      fontFamily: t.font('body'),
      fontSize: 24,
      fontWeight: 400,
      fill: t.shade('secondary', '#6b7280'),
      align: 'right',
    }),
    text(quote, x + 156, y + 86, width - 200, {
      fontFamily: t.font('body'),
      fontSize: 27,
      fontWeight: 400,
      fill: t.shade('secondary', '#374151'),
      lineHeight: 1.35,
    }),
  ];
};

export const clientReviews = themed(W, H, reviewsSpec, (t) => {
  const say = words(t.font('heading'));
  const quotes = t.list('quotes');
  return [
    backdrop(H, t.color('background'), t.shade('primary', GLOW)),
    say(t.copy('title'), 140, 116, t.color('text'), 800),
    say(
      t.copy('highlight'),
      255,
      116,
      shine(t.shade('primary', VOLT.sky), t.color('primary')),
      800,
    ),
    icon('square-check', 375, 420, 52, t.shade('primary', VOLT.sky)),
    text(t.copy('badge'), 445, 422, 400, {
      fontFamily: t.font('body'),
      fontSize: 40,
      fontWeight: 500,
      fill: t.color('text'),
    }),
    t
      .list('names')
      .map((name, index) => reviewCard(t, CARDS[index] ?? CARDS[0], name, quotes[index] ?? '')),
    text(t.copy('footer'), 0, 1160, W, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 500,
      fill: t.shade('text', VOLT.grey),
      align: 'center',
    }),
  ];
});

const beginnersSpec = {
  colors: {
    background: { value: VOLT.black, hint: 'Dark top of the page' },
    primary: {
      value: VOLT.blue,
      hint: 'Page glow, the video icon, Beginners, the calendar header and the date line',
    },
    surface: {
      value: VOLT.white,
      hint: 'Calendar page; its grey shade colors the binder rings',
    },
    secondary: { value: VOLT.ink, hint: 'Big day number on the calendar' },
    text: {
      value: VOLT.white,
      hint: 'Online Webinar, AI for and the month; its grey shade colors the description',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    badge: { label: 'Badge', value: 'Online Webinar' },
    title: { label: 'Title', value: 'AI for' },
    highlight: { label: 'Highlighted title', value: 'Beginners' },
    description: {
      label: 'Description',
      value: 'New to AI but curious where to start?\nLearn the basics from practitioners.',
    },
    month: { label: 'Month', value: 'October' },
    day: { label: 'Day', value: '14' },
    time: { label: 'Date and time', value: 'Thursday, 6 PM GMT' },
  },
} as const satisfies ThemeSpec;

export const aiBeginners = themed(W, H, beginnersSpec, (t) => {
  const say = words(t.font('heading'));
  return [
    backdrop(H, t.color('background'), t.shade('primary', GLOW)),
    icon('video', 380, 122, 42, t.shade('primary', VOLT.sky)),
    text(t.copy('badge'), 436, 124, 400, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 600,
      fill: t.color('text'),
    }),
    say(t.copy('title'), 190, 104, t.color('text'), 800),
    say(
      t.copy('highlight'),
      295,
      104,
      shine(t.shade('primary', VOLT.sky), t.color('primary')),
      800,
    ),
    text(t.copy('description'), 0, 435, W, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 400,
      fill: t.shade('text', VOLT.grey),
      align: 'center',
      lineHeight: 1.4,
    }),
    rect(290, 580, 500, 580, t.color('surface'), {
      name: 'Calendar',
      cornerRadius: 30,
      ...shadow(60, 20, t.shade('primary', 'rgba(61,123,255,0.45)')),
    }),
    rect(290, 580, 500, 130, linear(90, t.color('primary'), t.shade('primary', '#2348b8')), {
      name: 'Calendar head',
      cornerRadius: 30,
    }),
    rect(290, 670, 500, 40, t.shade('primary', '#2c56cf'), { name: 'Calendar head base' }),
    Array.from({ length: 6 }, (_, index) =>
      rect(330 + index * 80, 548, 20, 70, t.shade('surface', '#cbd5e1'), {
        name: 'Ring',
        cornerRadius: 10,
      }),
    ),
    text(t.copy('month'), 290, 618, 500, {
      fontFamily: t.font('heading'),
      fontSize: 58,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('day'), 290, 760, 500, {
      fontFamily: t.font('heading'),
      fontSize: 320,
      fontWeight: 800,
      fill: t.color('secondary'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('time'), 0, 1210, W, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 600,
      fill: t.shade('primary', VOLT.sky),
      align: 'center',
    }),
  ];
});
