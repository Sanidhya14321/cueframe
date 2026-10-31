import { linear } from '@/design';
import {
  circle,
  estimateTextWidth,
  icon,
  pill,
  rect,
  STORY_SIZE,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  BRAND,
  brand,
  COPPER,
  centered,
  copperFill,
  glow,
  glowStop,
  H,
  HEADING,
  W,
} from './posts';

const REASONS = [
  ['Clear Pricing', false],
  ['Senior Strategy Team', true],
  ['Client-First Approach', true],
  ['Always-On Support', false],
] as const;

const whySpec = {
  colors: {
    background: {
      value: COPPER.black,
      hint: 'Page gradient; its warmer shade colors the top of the page, its brown shade the filled pill lettering',
    },
    primary: {
      value: COPPER.copper,
      hint: 'Glow, Pick Us and the filled pills; its amber shade outlines the other pills',
    },
    secondary: { value: COPPER.grey, hint: 'Body text' },
    text: { value: COPPER.white, hint: 'Why Founders, outlined pill lettering and the brand name' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Why Founders' },
    accent: { label: 'Highlighted line', value: 'Pick Us' },
    reasons: { label: 'Reason', value: REASONS.map(([label]) => label) },
    body: {
      label: 'Body',
      value: 'We pair senior strategy with hands-on\ndelivery, so every launch ships on time.',
    },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const whyUs = themed(W, H, whySpec, (t) => {
  const reasons = t.list('reasons');
  const copper = copperFill(t.color('primary'), t.shade('primary', COPPER.amber));
  const pillRow = (first: number, y: number) => {
    const row = [first, first + 1];
    const widths = row.map((index) => estimateTextWidth(reasons[index] ?? '', 30) + 66);
    const total = widths.reduce((sum, width) => sum + width, 0) + (row.length - 1) * 24;
    let x = (W - total) / 2;
    return row.map((index, slot) => {
      const filled = REASONS[index]?.[1] ?? false;
      const node = pill(reasons[index] ?? '', x, y, {
        fill: filled ? copper : t.shade('primary', 'rgba(0,0,0,0)'),
        color: filled ? t.shade('background', COPPER.ink) : t.color('text'),
        stroke: t.shade('primary', COPPER.amber),
        strokeWidth: filled ? 0 : 2,
        fontSize: 30,
        fontFamily: t.font('body'),
        fontWeight: 700,
        padX: 33,
      });
      x += (widths[slot] ?? 0) + 24;
      return node;
    });
  };
  return [
    rect(0, 0, W, H, linear(160, t.shade('background', '#2a1a0f'), t.color('background')), {
      name: 'Background',
    }),
    glow(540, 640, 420, t.shade('primary', glowStop(0.3)), t.shade('primary', COPPER.clear)),
    centered(t.copy('title'), 220, 74, 500, t.color('text'), t.font('heading')),
    centered(t.copy('accent'), 306, 100, 800, copper, t.font('heading')),
    pillRow(0, 520),
    pillRow(2, 630),
    text(t.copy('body'), 0, 800, W, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 400,
      fill: t.color('secondary'),
      align: 'center',
      lineHeight: 1.45,
    }),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});

const closeSpec = {
  colors: {
    background: {
      value: COPPER.black,
      hint: 'Page gradient; its warmer shade colors the top of the page',
    },
    primary: {
      value: COPPER.copper,
      hint: 'Glow, the share icon and the bottom of 4x; its amber shade colors the top of 4x',
    },
    text: { value: COPPER.white, hint: 'The lines around 4x and the brand name' },
  },
  fonts: { heading: HEADING },
  copy: {
    lead: { label: 'Lead line', value: 'Our close rate is' },
    stat: { label: 'Stat', value: '4x' },
    tail: { label: 'Closing line', value: 'the industry norm.' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const closeRate = themed(W, H, closeSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.shade('background', '#1c120b'), t.color('background')), {
    name: 'Background',
  }),
  glow(760, 980, 300, t.shade('primary', glowStop(0.35)), t.shade('primary', COPPER.clear)),
  text(t.copy('lead'), 80, 230, 900, {
    fontFamily: t.font('heading'),
    fontSize: 58,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  text(t.copy('stat'), 60, 290, 700, {
    fontFamily: t.font('heading'),
    fontSize: 380,
    fontWeight: 800,
    fill: linear(180, t.shade('primary', COPPER.amber), t.color('primary')),
    lineHeight: 1,
  }),
  text(t.copy('tail'), 80, 700, 900, {
    fontFamily: t.font('heading'),
    fontSize: 58,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  icon('share-2', 560, 760, 460, t.color('primary'), { strokeWidth: 2.6, opacity: 0.85 }),
  text(t.copy('brand'), 80, 1220, 500, {
    fontFamily: t.font('heading'),
    fontSize: 30,
    fontWeight: 800,
    fill: t.color('text'),
    letterSpacing: 4,
  }),
]);

const workshop = (height: number) => {
  const tall = height > H;
  return themed(
    W,
    height,
    {
      colors: {
        background: {
          value: COPPER.black,
          hint: tall
            ? 'Page and the ring hole; its warmer shade colors the top of the ring hole, its brown shade the chip and button lettering'
            : 'Page and the ring hole; its warmer shade colors the top of the ring hole, its brown shade the chip lettering',
        },
        primary: {
          value: COPPER.copper,
          hint: tall
            ? 'Outer ring, for Founders, the chip and the Save your seat button; its shades color the ring lines, the ring fade, the gradient ends and LIVE ONLINE EVENT'
            : 'Outer ring, for Founders and the chip; its shades color the ring lines, the ring fade and the gradient ends',
        },
        text: {
          value: COPPER.white,
          hint: 'AI Basics, the date and the brand name; its pale shade colors the description',
        },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Title', value: 'AI Basics' },
        accent: { label: 'Highlighted line', value: 'for Founders' },
        chip: { label: 'Chip', value: 'WORKSHOP' },
        description: {
          label: 'Description',
          value: 'New to AI but not sure where to start?\nLearn the essentials live.',
        },
        date: { label: 'Date and time', value: 'March 12, 2027\n6 PM GMT  |  1 PM EST' },
        brand: BRAND,
        ...(tall
          ? {
              eyebrow: { label: 'Eyebrow', value: 'LIVE ONLINE EVENT' },
              button: { label: 'Button', value: 'Save your seat' },
            }
          : {}),
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const cy = height / 2;
      const copper = copperFill(t.color('primary'), t.shade('primary', COPPER.amber));
      const clear = t.shade('background', 'rgba(0,0,0,0)');
      return [
        rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
        circle(540, cy, 520, linear(180, t.color('primary'), t.shade('primary', '#3d1f0b')), {
          name: 'Outer ring',
        }),
        circle(540, cy, 470, linear(180, t.shade('background', '#1d130c'), t.color('background')), {
          name: 'Ring hole',
        }),
        circle(540, cy, 420, clear, {
          stroke: t.shade('primary', 'rgba(255,138,61,0.25)'),
          strokeWidth: 3,
          name: 'Ring',
        }),
        circle(540, cy, 360, clear, {
          stroke: t.shade('primary', 'rgba(255,138,61,0.15)'),
          strokeWidth: 3,
          name: 'Ring',
        }),
        centered(t.copy('title'), cy - 300, 96, 800, t.color('text'), t.font('heading')),
        centered(t.copy('accent'), cy - 196, 84, 800, copper, t.font('heading')),
        rect(400, cy - 70, 280, 56, copper, { cornerRadius: 28, name: 'Chip' }),
        text(t.copy('chip'), 400, cy - 58, 280, {
          fontFamily: t.font('body'),
          fontSize: 26,
          fontWeight: 800,
          fill: t.shade('background', COPPER.ink),
          align: 'center',
          letterSpacing: 3,
        }),
        text(t.copy('description'), 0, cy + 20, W, {
          fontFamily: t.font('body'),
          fontSize: 28,
          fontWeight: 500,
          fill: t.shade('text', COPPER.pale),
          align: 'center',
          lineHeight: 1.4,
        }),
        text(t.copy('date'), 0, cy + 140, W, {
          fontFamily: t.font('heading'),
          fontSize: 38,
          fontWeight: 700,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1.3,
        }),
        brand(t.copy('brand'), cy + 320, t.color('text'), t.font('heading')),
        tall
          ? [
              centered(
                t.copy('eyebrow'),
                220,
                40,
                800,
                t.shade('primary', COPPER.amber),
                t.font('heading'),
              ),
              rect(340, height - 300, 400, 90, copper, { cornerRadius: 45, name: 'Button' }),
              text(t.copy('button'), 340, height - 274, 400, {
                fontFamily: t.font('body'),
                fontSize: 34,
                fontWeight: 800,
                fill: t.shade('background', COPPER.ink),
                align: 'center',
              }),
            ]
          : [],
      ];
    },
  );
};

export const workshopPost = workshop(H);

export const workshopStory = workshop(STORY_SIZE.height);
