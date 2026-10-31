import { circle, group, POST_SIZE, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY_FONT,
  DARK_BACKDROP,
  darkBackdrop,
  HEADING_FONT,
  SCRIPT_FONT,
  VOLT,
} from './volt-kit';

const { width: W, height: H } = POST_SIZE;

const talkSpec = {
  colors: {
    background: { value: VOLT.paper, hint: 'Page' },
    text: { value: VOLT.black, hint: 'First and third Talk words and the note text' },
    accent: { value: VOLT.lime, hint: 'Second and fourth Talk words' },
    surface: { value: VOLT.white, hint: 'Note card' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    word: { label: 'Repeated word', value: 'Talk', hint: 'Shown four times down the page' },
    note: {
      label: 'Note',
      value:
        'A clear message turns scrollers into buyers. Say less, mean more and speak to one person.',
    },
  },
} as const satisfies ThemeSpec;

export const talkTalk = themed(W, H, talkSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  [0, 1, 2, 3].map((index) =>
    text(t.copy('word'), 60, 70 + index * 300, 960, {
      fontFamily: t.font('heading'),
      fontSize: 300,
      fontWeight: 400,
      fill: index % 2 === 0 ? t.color('text') : t.color('accent'),
      lineHeight: 1,
      letterSpacing: -8,
    }),
  ),
  group(
    rect(300, 540, 600, 300, t.color('surface'), {
      cornerRadius: 24,
      name: 'Note card',
      ...shadow(40, 16, 'rgba(0,0,0,0.25)'),
    }),
    text(t.copy('note'), 340, 580, 520, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.4,
    }),
  ),
]);

const GUESS_ROWS = [
  { count: 5, y: 620 },
  { count: 6, y: 770 },
] as const;

const guessSpec = {
  colors: {
    background: DARK_BACKDROP,
    accent: { value: VOLT.lime, hint: 'Can you label and the letter tile borders' },
    primary: { value: VOLT.black, hint: 'Can you and the letters on the tiles' },
    text: { value: VOLT.white, hint: 'Guess?, the hint and the letter tiles' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    label: { label: 'Label', value: 'Can you' },
    title: { label: 'Title', value: 'Guess?' },
    letters: {
      label: 'Letter',
      hint: 'Five tiles on the first row and six on the second; leave a tile empty to hide its letter',
      value: ['N', '', 'C', '', 'E', 'M', 'A', '', 'K', 'E', 'T'],
    },
    hint: { label: 'Hint', value: 'Hint: a focused slice of a bigger\nmarket that you can own.' },
  },
} as const satisfies ThemeSpec;

export const guessWord = themed(W, H, guessSpec, (t) => {
  const letters = t.list('letters');
  let next = 0;
  return [
    darkBackdrop(t.color('background'), t.shade('background', VOLT.black)),
    rect(290, 180, 420, 120, t.color('accent'), { cornerRadius: 10, rotation: -4, name: 'Label' }),
    text(t.copy('label'), 290, 196, 420, {
      fontFamily: t.font('heading'),
      fontSize: 72,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
      rotation: -4,
    }),
    text(t.copy('title'), 0, 320, W, {
      fontFamily: t.font('heading'),
      fontSize: 170,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    GUESS_ROWS.map(({ count, y }) => {
      const start = (W - (count * 108 - 12)) / 2;
      return Array.from({ length: count }, (_, index) => {
        const letter = letters[next] ?? '';
        next += 1;
        const x = start + index * 108;
        return group(
          rect(x, y, 96, 110, t.color('text'), {
            cornerRadius: 10,
            stroke: t.color('accent'),
            strokeWidth: 6,
            name: 'Letter tile',
          }),
          text(letter, x, y + 22, 96, {
            fontFamily: t.font('heading'),
            fontSize: 56,
            fontWeight: 400,
            fill: t.color('primary'),
            align: 'center',
          }),
        );
      });
    }),
    text(t.copy('hint'), 0, 1000, W, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.35,
    }),
  ];
});

const eventsSpec = {
  colors: {
    background: DARK_BACKDROP,
    accent: { value: VOLT.lime, hint: 'Title and the top band of every date tile' },
    surface: { value: VOLT.white, hint: 'Date tiles and the event names' },
    primary: { value: VOLT.black, hint: 'Day numbers on the date tiles' },
    secondary: { value: VOLT.grey, hint: 'Month on the date tiles and the event details' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'This Month at Volt' },
    month: { label: 'Tile month', value: 'JUN', hint: 'Shown on every date tile' },
    days: { label: 'Day', value: ['08', '14', '21', '27'] },
    events: {
      label: 'Event',
      value: ['Founder Spotlight', 'Live Audience Poll', 'Growth Webinar', 'Early Access Day'],
    },
    details: {
      label: 'Event detail',
      value: [
        'Meet the people behind the brand',
        'Vote on our next feature drop',
        'A 45 minute session on content',
        'Members try the new tools first',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const eventsList = themed(W, H, eventsSpec, (t) => {
  const events = t.list('events');
  const details = t.list('details');
  return [
    darkBackdrop(t.color('background'), t.shade('background', VOLT.black)),
    text(t.copy('title'), 90, 90, 900, {
      fontFamily: t.font('heading'),
      fontSize: 64,
      fontWeight: 400,
      fill: t.color('accent'),
    }),
    t.list('days').map((day, index) => {
      const y = 250 + index * 260;
      return [
        rect(90, y, 170, 190, t.color('surface'), { cornerRadius: 20, name: 'Date tile' }),
        rect(90, y, 170, 50, t.color('accent'), { cornerRadius: 20, name: 'Date tile top' }),
        rect(90, y + 30, 170, 20, t.color('accent'), { name: 'Date tile edge' }),
        text(day, 90, y + 62, 170, {
          fontFamily: t.font('heading'),
          fontSize: 72,
          fontWeight: 400,
          fill: t.color('primary'),
          align: 'center',
        }),
        text(t.copy('month'), 90, y + 146, 170, {
          fontFamily: t.font('body'),
          fontSize: 26,
          fontWeight: 700,
          fill: t.color('secondary'),
          align: 'center',
          letterSpacing: 4,
        }),
        text(events[index] ?? '', 310, y + 40, 700, {
          fontFamily: t.font('body'),
          fontSize: 48,
          fontWeight: 800,
          fill: t.color('surface'),
        }),
        text(details[index] ?? '', 310, y + 110, 700, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 500,
          fill: t.color('secondary'),
        }),
      ];
    }),
  ];
});

const knowSpec = {
  colors: {
    background: { value: VOLT.white, hint: 'Page' },
    text: { value: VOLT.black, hint: 'DID, YOU, Know, the question mark and the fact' },
    accent: {
      value: VOLT.lime,
      hint: 'Know label and the question bubble; its darker shade colors the closing line',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT, script: SCRIPT_FONT },
  copy: {
    top: { label: 'Top word', value: 'DID' },
    label: { label: 'Label', value: 'Know' },
    bottom: { label: 'Bottom word', value: 'YOU' },
    mark: { label: 'Bubble mark', value: '?' },
    fact: {
      label: 'Fact',
      value: 'Brands that post with a plan are\nremembered 4x more often.',
    },
    closing: { label: 'Closing line', value: 'Consistency beats volume, every time.' },
  },
} as const satisfies ThemeSpec;

export const didYouKnow = themed(W, H, knowSpec, (t) => {
  const big = (content: string, y: number) =>
    text(content, 0, y, W, {
      fontFamily: t.font('heading'),
      fontSize: 270,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    });
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    big(t.copy('top'), 170),
    rect(400, 450, 280, 90, t.color('accent'), {
      cornerRadius: 10,
      rotation: -5,
      name: 'Know label',
    }),
    text(t.copy('label'), 400, 460, 280, {
      fontFamily: t.font('script'),
      fontSize: 60,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      rotation: -5,
    }),
    big(t.copy('bottom'), 520),
    circle(900, 220, 64, t.color('accent')),
    text(t.copy('mark'), 860, 168, 80, {
      fontFamily: t.font('heading'),
      fontSize: 84,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('fact'), 0, 900, W, {
      fontFamily: t.font('body'),
      fontSize: 42,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.35,
    }),
    text(t.copy('closing'), 0, 1060, W, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 700,
      fill: t.shade('accent', VOLT.limeDark),
      align: 'center',
    }),
  ];
});
