import { linear } from '@/design';
import { circle, icon, rect, rotateNodes, shadow, type ThemeSpec, themed } from '../../../kit';
import { brandLine, FONT, H, HANDLE, MINT, W, writer } from './posts';

const fourThingsSpec = {
  colors: {
    background: {
      value: MINT.light,
      hint: 'Page gradient; its darker shades are the bottom of the page and the card shadows',
    },
    secondary: {
      value: MINT.black,
      hint: 'Box behind 4 Things, dark tip cards, badges on light cards and the text on light cards and dark badges',
    },
    surface: {
      value: MINT.white,
      hint: 'Light tip cards, badges on dark cards and the text on dark cards and light badges',
    },
    text: { value: MINT.white, hint: '4 Things, Before and the subtitle' },
  },
  fonts: { body: FONT },
  copy: {
    highlight: { label: 'Boxed title', value: '4 Things' },
    word: { label: 'Title word', value: 'Before' },
    subtitle: { label: 'Subtitle', value: 'Launching a Campaign' },
    tips: { label: 'Tip', value: ['Audience fit', 'Clear offer', 'Sharp message', 'Smooth path'] },
    details: {
      label: 'Tip detail',
      value: [
        'Know exactly who you want to reach.',
        'Make the value obvious in one line.',
        'Lead with the hook, then the proof.',
        'Landing page, CTA and follow-up ready.',
      ],
    },
    numbers: { label: 'Badge number', value: ['1', '2', '3', '4'] },
  },
} as const satisfies ThemeSpec;

export const fourThings = themed(W, H, fourThingsSpec, (t) => {
  const say = writer(t.font('body'));
  const details = t.list('details');
  const numbers = t.list('numbers');
  const dark = t.color('secondary');
  const light = t.color('surface');
  return [
    rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', MINT.deep)), {
      name: 'Background',
    }),
    rect(294, 120, 270, 84, dark, { name: 'Highlight', cornerRadius: 8 }),
    say(t.copy('highlight'), 294, 130, 270, 56, t.color('text'), 800, 'center'),
    say(t.copy('word'), 584, 130, 300, 56, t.color('text'), 700),
    say(t.copy('subtitle'), 0, 222, W, 56, t.color('text'), 700, 'center'),
    t.list('tips').map((title, index) => {
      const odd = index % 2 === 0;
      const x = odd ? 110 : 350;
      const y = 380 + index * 210;
      const badgeX = odd ? x + 620 : x;
      return [
        rect(x, y, 620, 150, odd ? dark : light, {
          name: 'Tip card',
          cornerRadius: 22,
          ...shadow(24, 10, t.shade('background', 'rgba(4,80,60,0.35)')),
        }),
        say(title, x + 44, y + 30, 540, 34, odd ? light : dark, 800),
        say(
          details[index] ?? '',
          x + 44,
          y + 82,
          540,
          26,
          odd ? t.shade('surface', '#c9d1ce') : t.shade('secondary', '#3f4643'),
          500,
        ),
        circle(badgeX, y, 34, odd ? light : dark, { name: 'Badge' }),
        say(numbers[index] ?? '', badgeX - 34, y - 18, 68, 30, odd ? dark : light, 800, 'center'),
      ];
    }),
  ];
});

const shareThisSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page' },
    primary: { value: MINT.green, hint: 'Bracketed kicker and the arrow' },
    text: {
      value: MINT.white,
      hint: 'Share and This!; its shades color the grid lines, the body and the handle',
    },
  },
  fonts: { body: FONT },
  copy: {
    kicker: { label: 'Kicker', value: '[ Hey, make your marketing count. ]' },
    title: { label: 'Title', value: 'Share' },
    closing: { label: 'Second title word', value: 'This!' },
    body: {
      label: 'Body',
      value: 'Pass it on to someone building\nauthentic connections at scale.',
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const shareThis = themed(W, H, shareThisSpec, (t) => {
  const say = writer(t.font('body'));
  const grid = t.shade('text', 'rgba(255,255,255,0.05)');
  const grey = t.shade('text', MINT.grey);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    Array.from({ length: 12 }, (_, index) =>
      rect(index * 90 + 45, 0, 2, H, grid, { name: 'Grid line' }),
    ),
    Array.from({ length: 15 }, (_, index) =>
      rect(0, index * 90 + 45, W, 2, grid, { name: 'Grid line' }),
    ),
    say(t.copy('kicker'), 0, 300, W, 34, t.color('primary'), 600, 'center'),
    say(t.copy('title'), 0, 370, W, 210, t.color('text'), 800, 'center'),
    rotateNodes(90, 270, 720, [
      icon('arrow-up-right', 180, 630, 180, t.color('primary'), { strokeWidth: 3 }),
    ]),
    say(t.copy('closing'), 380, 610, 640, 210, t.color('text'), 800),
    say(t.copy('body'), 0, 900, W, 34, grey, 500, 'center'),
    brandLine(t.copy('handle'), 1240, grey, t.font('body')),
  ];
});
