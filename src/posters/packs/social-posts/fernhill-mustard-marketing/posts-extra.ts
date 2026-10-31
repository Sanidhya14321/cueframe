import { linear } from '@/design';
import { icon, photo, rect, shadow, type ThemeSpec, themed } from '../../../kit';
import {
  BODY,
  bold,
  catalogNewest,
  copy,
  display,
  FH,
  H,
  HANDLE,
  HEADING,
  openingHours,
  W,
  whatTheySay,
} from './posts';
import { marketInsights, mythFact, quizTime, spinWheel } from './posts-more';

interface SearchStyle {
  from: string;
  to: string;
  query: string;
  rows: readonly string[];
}

const searchCard = (style: SearchStyle) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: style.from,
          hint: 'Page gradient; its darker shade is the bottom of the gradient',
        },
        surface: {
          value: FH.white,
          hint: 'Search bar, results card, handle, headline and subline',
        },
        text: {
          value: FH.ink,
          hint: 'Search query and results; its lighter shade colors the icons and dividers',
        },
      },
      fonts: { body: BODY },
      copy: {
        handle: HANDLE,
        query: { label: 'Search query', value: style.query },
        rows: { label: 'Result', value: style.rows },
        headline: { label: 'Headline', value: 'Know your\nnext move.' },
        subline: { label: 'Subline', value: 'Strategy built on real data.' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const body = copy(t.font('body'));
      const rows = t.list('rows');
      return [
        rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', style.to)), {
          name: 'Background',
        }),
        body(t.copy('handle'), 110, 110, 600, 28, t.color('surface'), {
          fontWeight: 600,
          letterSpacing: 2,
        }),
        rect(110, 280, 860, 110, t.color('surface'), {
          cornerRadius: 55,
          name: 'Search bar',
          ...shadow(30, 12, 'rgba(0,0,0,0.18)'),
        }),
        body(t.copy('query'), 170, 314, 680, 36, t.color('text'), { fontWeight: 500 }),
        icon('mic', 880, 308, 52, t.shade('text', FH.grey), { strokeWidth: 2 }),
        rect(110, 420, 680, 400, t.color('surface'), {
          cornerRadius: 32,
          name: 'Results',
          ...shadow(30, 12, 'rgba(0,0,0,0.18)'),
        }),
        rows.map((row, index) => {
          const y = 450 + index * 90;
          return [
            icon('search', 150, y + 12, 34, t.shade('text', FH.grey), { strokeWidth: 2.2 }),
            body(row, 210, y + 8, 520, 32, t.color('text')),
            index < rows.length - 1
              ? rect(150, y + 72, 600, 2, t.shade('text', '#e7e3da'), { name: 'Divider' })
              : [],
          ];
        }),
        photo('man-portrait-3', 600, 640, 400, 620, { cornerRadius: 40 }),
        bold(t.font('body'))(t.copy('headline'), 110, 960, 460, 66, t.color('surface')),
        body(t.copy('subline'), 110, 1140, 460, 30, t.color('surface')),
      ];
    },
  );

export const searchBefore = searchCard({
  from: FH.forest,
  to: FH.deep,
  query: 'What drives B2B growth?',
  rows: ['Content that converts', 'Intent data', 'Team alignment', 'Customer retention'],
});

export const searchAfter = searchCard({
  from: '#4361ee',
  to: '#16206b',
  query: 'What content works best?',
  rows: ['Live webinars', 'In-depth guides', 'Research reports', 'Case studies'],
});

const EVENTS = [
  { day: '12', name: 'Growth\nSummit' },
  { day: '18', name: 'Brand\nWorkshop' },
  { day: '24', name: 'Founders\nMixer' },
  { day: '30', name: 'Content\nBootcamp' },
] as const;

const monthEvents = (height: number) =>
  themed(
    W,
    height,
    {
      colors: {
        background: { value: FH.forest, hint: 'Page and the event dates' },
        accent: {
          value: FH.mustard,
          hint: 'Title and the dark checks; its darker shade colors the month on each card',
        },
        surface: {
          value: FH.cream,
          hint: 'Event cards, the subtitle, the closing line and the light checks',
        },
        text: { value: FH.ink, hint: 'Event names' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Title', value: 'MAY EVENTS' },
        subtitle: { label: 'Subtitle', value: 'Everything planned for the month' },
        month: { label: 'Card month', value: 'MAY', hint: 'Shown on every event card' },
        days: { label: 'Day', value: EVENTS.map((event) => event.day) },
        names: { label: 'Event', value: EVENTS.map((event) => event.name) },
        closing: { label: 'Closing line', value: 'Save your seat today' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const heading = display(t.font('heading'));
      const tall = height > 1500;
      const top = tall ? 220 : 100;
      const cardHeight = tall ? 380 : 250;
      const days = t.list('days');
      return [
        rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
        heading(t.copy('title'), 0, top, W, 170, t.color('accent'), { align: 'center' }),
        copy(t.font('body'))(t.copy('subtitle'), 0, top + 190, W, 32, t.color('surface'), {
          align: 'center',
          fontWeight: 500,
        }),
        t.list('names').map((name, index) => {
          const x = 110 + (index % 2) * 450;
          const y = top + 290 + Math.floor(index / 2) * (cardHeight + 30);
          const middle = y + cardHeight / 2;
          return [
            rect(x, y, 410, cardHeight, t.color('surface'), {
              cornerRadius: 26,
              name: 'Event card',
            }),
            heading(
              t.copy('month'),
              x + 30,
              middle - 90,
              150,
              50,
              t.shade('accent', FH.mustardDark),
            ),
            heading(days[index] ?? '', x + 30, middle - 34, 150, 120, t.color('background')),
            bold(t.font('body'))(name, x + 190, middle - 36, 200, 30, t.color('text'), {
              lineHeight: 1.25,
            }),
          ];
        }),
        bold(t.font('body'))(
          t.copy('closing'),
          0,
          top + 330 + cardHeight * 2 + 40,
          W,
          34,
          t.color('surface'),
          { align: 'center' },
        ),
        Array.from({ length: 24 }, (_, index) => {
          const column = index % 12;
          const row = Math.floor(index / 12);
          return rect(
            column * 90,
            height - 180 + row * 90,
            90,
            90,
            (column + row) % 2 === 0 ? t.color('accent') : t.color('surface'),
            { name: 'Check' },
          );
        }),
      ];
    },
  );

export const eventsPost = monthEvents(H);
export const eventsStory = monthEvents(1920);

export const POSTS = [
  catalogNewest,
  openingHours,
  whatTheySay,
  marketInsights,
  spinWheel,
  mythFact,
  quizTime,
  eventsPost,
  searchBefore,
];
