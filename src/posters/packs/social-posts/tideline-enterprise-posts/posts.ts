import { type Fill, linear } from '@/design';
import {
  circle,
  icon,
  POST_SIZE,
  path,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const TIDE = {
  night: '#031716',
  deep: '#06302e',
  sea: '#0b4f4a',
  teal: '#0fa596',
  aqua: '#5eead4',
  mist: '#e9f4f2',
  ink: '#0a1f1e',
  grey: '#9fb8b4',
  amber: '#ffcf5a',
  white: '#ffffff',
};

export const HEADING = { label: 'Heading font', value: 'Plus Jakarta Sans' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const BRAND = { label: 'Brand', value: 'TIDELINE SYSTEMS' } as const;
export const { width: W, height: H } = POST_SIZE;

export const brandMark = (
  label: string,
  x: number,
  y: number,
  width: number,
  color: string,
  fontFamily: string,
  align: 'left' | 'center' | 'right' = 'left',
) =>
  text(label, x, y, width, {
    fontFamily,
    fontSize: 28,
    fontWeight: 800,
    fill: color,
    align,
    letterSpacing: 3,
  });

export const ringArc = (
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  start: number,
  end: number,
  fill: Fill,
  view: { width: number; height: number } = POST_SIZE,
) => {
  const point = (radius: number, degrees: number) => {
    const radians = (degrees * Math.PI) / 180;
    return `${(cx + radius * Math.cos(radians)).toFixed(1)} ${(cy + radius * Math.sin(radians)).toFixed(1)}`;
  };
  const large = end - start > 180 ? 1 : 0;
  const data = [
    `M ${point(outer, start)}`,
    `A ${outer} ${outer} 0 ${large} 1 ${point(outer, end)}`,
    `L ${point(inner, end)}`,
    `A ${inner} ${inner} 0 ${large} 0 ${point(inner, start)}`,
    'Z',
  ].join(' ');
  return path(data, 0, 0, view.width, view.height, fill, view, { name: 'Arc' });
};

const DARK_EVENTS = [false, true, true, false] as const;

const eventsSpec = {
  colors: {
    background: { value: TIDE.mist, hint: 'Page' },
    primary: {
      value: TIDE.teal,
      hint: 'Events headline, the light event cards and the corner arcs; its darker shades color the dark event cards and the light card gradient',
    },
    surface: {
      value: TIDE.white,
      hint: 'Dates, event titles, descriptions and the link label',
    },
    accent: { value: TIDE.aqua, hint: 'Arrow icons on the event cards' },
    text: { value: TIDE.ink, hint: 'Upcoming headline, the link pill and the brand mark' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Upcoming' },
    highlight: { label: 'Highlighted title', value: 'Events' },
    dates: { label: 'Date', value: ['04/14', '05/02', '06/19', '07/08'] },
    events: {
      label: 'Event',
      value: [
        'Platform Release Live',
        'Partner Summit Recap',
        'Pricing Clinic Q&A',
        'RevOps Roundtable',
      ],
    },
    blurbs: {
      label: 'Event description',
      value: [
        'Join the team for a live walkthrough and open questions.',
        'Join the team for a live walkthrough and open questions.',
        'Join the team for a live walkthrough and open questions.',
        'Join the team for a live walkthrough and open questions.',
      ],
    },
    link: { label: 'Link', value: 'tideline.io' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const eventsBoard = themed(W, H, eventsSpec, (t) => {
  const head = t.font('heading');
  const events = t.list('events');
  const blurbs = t.list('blurbs');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    ringArc(1080, 0, 360, 280, 90, 180, t.shade('primary', 'rgba(15,165,150,0.16)')),
    ringArc(1080, 0, 240, 200, 90, 180, t.shade('primary', 'rgba(15,165,150,0.22)')),
    text(t.copy('title'), 80, 100, 900, {
      fontFamily: head,
      fontSize: 120,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1,
    }),
    text(t.copy('highlight'), 80, 230, 900, {
      fontFamily: head,
      fontSize: 120,
      fontWeight: 800,
      fill: t.color('primary'),
      lineHeight: 1,
    }),
    t.list('dates').map((date, index) => {
      const x = 80 + (index % 2) * 480;
      const y = 430 + Math.floor(index / 2) * 370;
      return [
        rect(
          x,
          y,
          440,
          340,
          DARK_EVENTS[index]
            ? t.shade('primary', TIDE.deep)
            : linear(150, t.color('primary'), t.shade('primary', TIDE.sea)),
          { name: 'Event card', cornerRadius: 28 },
        ),
        text(date, x + 36, y + 36, 300, {
          fontFamily: head,
          fontSize: 48,
          fontWeight: 800,
          fill: t.color('surface'),
        }),
        icon('arrow-up-right', x + 360, y + 40, 44, t.color('accent')),
        text(events[index] ?? '', x + 36, y + 116, 370, {
          fontFamily: head,
          fontSize: 32,
          fontWeight: 700,
          fill: t.color('surface'),
          lineHeight: 1.2,
        }),
        text(blurbs[index] ?? '', x + 36, y + 210, 370, {
          fontFamily: t.font('body'),
          fontSize: 24,
          fontWeight: 400,
          fill: t.shade('surface', 'rgba(255,255,255,0.78)'),
          lineHeight: 1.4,
        }),
      ];
    }),
    rect(80, 1200, 280, 72, t.color('text'), { name: 'Link pill', cornerRadius: 36 }),
    text(t.copy('link'), 80, 1219, 280, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 600,
      fill: t.color('surface'),
      align: 'center',
    }),
    brandMark(t.copy('brand'), 560, 1222, 440, t.color('text'), head, 'right'),
  ];
});

const BAR_HEIGHTS = [180, 230, 290, 340, 400, 460] as const;

const analyticsSpec = {
  colors: {
    background: {
      value: TIDE.sea,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    primary: {
      value: TIDE.aqua,
      hint: 'Bars, the glow under the bar caps, the subline and the arrow',
    },
    text: { value: TIDE.white, hint: 'Brand mark, headline and the bar caps' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    headline: { label: 'Headline', value: 'Turn Pipeline Data\ninto Confident\nDecisions.' },
    subline: {
      label: 'Subline',
      value: 'See how revenue teams read signals\nand act on them faster.',
    },
  },
} as const satisfies ThemeSpec;

export const analyticsBars = themed(W, H, analyticsSpec, (t) => [
  rect(0, 0, W, H, linear(165, t.color('background'), t.shade('background', TIDE.night)), {
    name: 'Background',
  }),
  brandMark(t.copy('brand'), 80, 80, 600, t.color('text'), t.font('heading')),
  BAR_HEIGHTS.map((height, index) => {
    const x = 150 + index * 135;
    const top = 720 - height;
    return [
      rect(
        x,
        top,
        80,
        height,
        linear(
          180,
          t.shade('primary', 'rgba(94,234,212,0.9)'),
          t.shade('primary', 'rgba(94,234,212,0)'),
        ),
        { name: 'Bar', cornerRadius: 40 },
      ),
      circle(x + 40, top + 40, 40, t.color('text'), {
        name: 'Bar cap',
        ...shadow(40, 0, t.shade('primary', 'rgba(94,234,212,0.9)')),
      }),
    ];
  }),
  text(t.copy('headline'), 80, 790, 900, {
    fontFamily: t.font('heading'),
    fontSize: 76,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.1,
  }),
  text(t.copy('subline'), 80, 1070, 760, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 400,
    fill: t.color('primary'),
    lineHeight: 1.4,
  }),
  icon('arrow-right', 900, 1180, 96, t.color('primary'), { strokeWidth: 2.5 }),
]);

const searchSpec = {
  colors: {
    background: {
      value: TIDE.night,
      hint: 'Page gradient; its lighter shade is the bottom of the gradient',
    },
    primary: {
      value: TIDE.aqua,
      hint: 'B2B playbook, the glowing arcs and the arrow',
    },
    text: {
      value: TIDE.white,
      hint: 'First headline line, the see-through search bar and its outline, the query, search icon and brand mark',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'AI is rewriting the' },
    highlight: { label: 'Highlighted title', value: 'B2B playbook' },
    query: { label: 'Search query', value: 'How do we stay ahead of the shift?' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const aiSearch = themed(W, H, searchSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#041f1d')), {
    name: 'Background',
  }),
  ringArc(
    540,
    2000,
    1010,
    930,
    238,
    302,
    linear(
      90,
      t.shade('primary', 'rgba(15,165,150,0)'),
      t.shade('primary', TIDE.teal),
      t.color('primary'),
    ),
  ),
  ringArc(540, 2000, 900, 880, 240, 300, t.shade('primary', 'rgba(94,234,212,0.35)')),
  text(t.copy('title'), 0, 330, W, {
    fontFamily: t.font('heading'),
    fontSize: 72,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('highlight'), 0, 420, W, {
    fontFamily: t.font('heading'),
    fontSize: 72,
    fontWeight: 700,
    fill: t.color('primary'),
    align: 'center',
  }),
  rect(150, 600, 780, 96, t.shade('text', 'rgba(255,255,255,0.06)'), {
    name: 'Search bar',
    cornerRadius: 48,
    stroke: t.shade('text', 'rgba(255,255,255,0.7)'),
    strokeWidth: 3,
  }),
  text(t.copy('query'), 200, 628, 620, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 400,
    fill: t.color('text'),
  }),
  icon('search', 850, 626, 44, t.color('text')),
  icon('arrow-right', 940, 1226, 64, t.color('primary'), { strokeWidth: 2.5 }),
  brandMark(t.copy('brand'), 0, 1240, W, t.color('text'), t.font('heading'), 'center'),
]);
