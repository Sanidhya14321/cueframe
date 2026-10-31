import { icon, poly, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, fonts, glow, HEADING, K, mono, SH, SW } from './theme';

const quoteMark = (x: number, y: number, fill: string) => [
  rect(x, y, 150, 150, fill, { name: 'Quote block', cornerRadius: 24 }),
  poly(
    [
      [x + 150, y + 90],
      [x + 150, y + 150],
      [x + 70, y + 300],
      [x + 20, y + 300],
      [x + 80, y + 150],
    ],
    fill,
    { name: 'Quote tail' },
  ),
];

export const quoteSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: K.black, hint: 'Page' },
      surface: { value: K.panel, hint: 'Author card' },
      primary: {
        value: K.lime,
        hint: 'Second quote mark, teammate, the portrait plate, the glow and the green wash',
      },
      text: {
        value: K.white,
        hint: 'First quote mark, the quote lines, the author name and the card outline; its grey shade colors the job title',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      lines: { label: 'Quote line', value: ['AI is a', 'teammate,', 'not a threat.'] },
      name: { label: 'Author', value: 'Rafael Brandt' },
      role: { label: 'Job title', value: 'Chief AI Officer, Kestrel' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const [first = '', second = '', third = ''] = t.list('lines');
    return [
      backdrop(t),
      glow(t, 330, 420, 330, 0.3),
      quoteMark(180, 260, t.color('text')),
      quoteMark(370, 260, t.color('primary')),
      head(first, 720, 180, 1100, 130, t.color('text')),
      head(second, 720, 330, 1100, 130, t.color('primary')),
      head(third, 720, 480, 1100, 130, t.color('text')),
      rect(720, 720, 640, 200, t.color('surface'), {
        name: 'Author card',
        cornerRadius: 28,
        stroke: t.shade('text', K.line),
        strokeWidth: 2,
      }),
      rect(744, 744, 152, 152, t.color('primary'), { name: 'Portrait plate', cornerRadius: 20 }),
      mono('man-portrait-3', 752, 752, 136, 136, 16),
      head(t.copy('name'), 930, 770, 400, 40, t.color('text')),
      body(t.copy('role'), 930, 830, 400, 28, t.shade('text', K.muted)),
    ];
  },
);

export const messagingSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: {
        value: K.black,
        hint: 'Page and the text on the pillar and saving cards; its grey shade colors the pillar text',
      },
      surface: { value: K.panel, hint: 'Most trusted badge' },
      primary: {
        value: K.lime,
        hint: 'Saving card, the badge check icon and the green wash',
      },
      text: {
        value: K.white,
        hint: 'Title, the pillar card, Most trusted and the badge outline; its grey shade colors the subtitle',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Strategic Messaging' },
      subtitle: {
        label: 'Subtitle',
        value: 'One story for buyers, investors and teams, told the same way everywhere.',
      },
      pillarNumber: { label: 'Pillar number', value: '01' },
      pillarTitle: { label: 'Pillar title', value: 'Content\nStrategy' },
      pillarText: {
        label: 'Pillar text',
        value: 'Clear narratives that make complex AI feel simple.',
      },
      stat: { label: 'Stat', value: '30%' },
      statLabel: { label: 'Stat label', value: 'Saved in operating\ncosts' },
      statNote: { label: 'Stat note', value: 'After the first two quarters' },
      badge: { label: 'Badge', value: 'Most trusted' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    return [
      backdrop(t, 200),
      head(t.copy('title'), 100, 100, 1500, 96, t.color('text')),
      body(t.copy('subtitle'), 100, 230, 1300, 34, t.shade('text', K.muted)),
      rect(100, 380, 400, 580, t.color('text'), { name: 'Pillar card', cornerRadius: 28 }),
      head(t.copy('pillarNumber'), 140, 420, 200, 80, t.color('background')),
      head(t.copy('pillarTitle'), 140, 570, 320, 52, t.color('background')),
      body(t.copy('pillarText'), 140, 720, 320, 28, t.shade('background', K.dim)),
      mono('meeting-1', 540, 380, 820, 580, 28),
      rect(1400, 380, 420, 400, t.color('primary'), { name: 'Saving card', cornerRadius: 28 }),
      head(t.copy('stat'), 1440, 420, 340, 120, t.color('background')),
      body(t.copy('statLabel'), 1440, 570, 340, 32, t.color('background'), { fontWeight: 700 }),
      body(t.copy('statNote'), 1440, 690, 340, 26, t.color('background')),
      rect(1400, 820, 420, 140, t.color('surface'), {
        name: 'Trust badge',
        cornerRadius: 28,
        stroke: t.shade('text', K.line),
        strokeWidth: 2,
      }),
      icon('badge-check', 1440, 856, 68, t.color('primary'), { strokeWidth: 2 }),
      head(t.copy('badge'), 1530, 866, 280, 40, t.color('text')),
    ];
  },
);
