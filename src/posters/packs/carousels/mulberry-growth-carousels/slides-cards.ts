import {
  checklist,
  circle,
  icon,
  type Nodes,
  rect,
  shadow,
  type Theme,
  type ThemeSpec,
  themed,
} from '../../../kit';
import { BACKGROUND, BODY, backdrop, H, HEADING, MULBERRY, say, W } from './palette';

const CARD = { x: 90, y: 150, width: 900, height: 1050 };

interface CardHints {
  primary: string;
  text: string;
}

const cardColors = (hints: CardHints) => ({
  background: BACKGROUND,
  secondary: { value: MULBERRY.blush, hint: 'Top and bottom tabs peeking out behind the card' },
  surface: {
    value: MULBERRY.cream,
    hint: 'Post card; its lighter shade colors the avatar letter',
  },
  primary: { value: MULBERRY.wine, hint: hints.primary },
  text: { value: MULBERRY.ink, hint: hints.text },
});

const PRIMARY_HINT =
  'Card title, avatar circle and active dot; its tints color the like heart and the other dots';

const CARD_COPY = {
  letter: { label: 'Avatar letter', value: 'F' },
  account: { label: 'Account name', value: 'Fernway' },
} as const;

type CardCopy = NonNullable<ThemeSpec['copy']>;

interface CardSpec<C extends CardCopy> extends ThemeSpec {
  colors: ReturnType<typeof cardColors>;
  fonts: { heading: typeof HEADING; body: typeof BODY };
  copy: typeof CARD_COPY & C;
}

const postCard = <C extends CardCopy>(
  activeDot: number,
  hints: CardHints,
  copy: C,
  content: (t: Theme<CardSpec<C>>) => Nodes[],
) =>
  themed(
    W,
    H,
    {
      colors: cardColors(hints),
      fonts: { heading: HEADING, body: BODY },
      copy: { ...CARD_COPY, ...copy },
    } satisfies CardSpec<C>,
    (t) => {
      const body = say(t.font('body'));
      return [
        backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
        rect(170, 0, 740, 96, t.color('secondary'), { name: 'Top tab', cornerRadius: 28 }),
        rect(170, 1254, 740, 96, t.color('secondary'), { name: 'Bottom tab', cornerRadius: 28 }),
        rect(CARD.x, CARD.y, CARD.width, CARD.height, t.color('surface'), {
          name: 'Card',
          cornerRadius: 44,
          ...shadow(40, 16, 'rgba(0,0,0,0.3)'),
        }),
        circle(178, 240, 36, t.color('primary')),
        say(t.font('heading'))(
          t.copy('letter'),
          142,
          216,
          72,
          40,
          t.shade('surface', MULBERRY.white),
          800,
          { align: 'center', lineHeight: 1.15 },
        ),
        body(t.copy('account'), 232, 216, 400, 38, t.color('text'), 600),
        rect(840, 222, 70, 8, t.color('text'), { name: 'Menu line', cornerRadius: 4 }),
        rect(862, 246, 48, 8, t.color('text'), { name: 'Menu line', cornerRadius: 4 }),
        content(t),
        icon('heart', 150, 1110, 48, t.shade('primary', '#e0245e'), { strokeWidth: 2.4 }),
        icon('message-circle', 222, 1110, 48, t.color('text'), { strokeWidth: 2.2 }),
        icon('send', 294, 1110, 48, t.color('text'), { strokeWidth: 2.2 }),
        [0, 1, 2, 3].map((index) =>
          circle(
            500 + index * 30,
            1134,
            9,
            index === activeDot ? t.color('primary') : t.shade('primary', '#d9c3c9'),
          ),
        ),
        icon('bookmark', 882, 1110, 48, t.color('text'), { strokeWidth: 2.2 }),
      ];
    },
  );

const cardTitle = (content: string, fontFamily: string, fill: string) =>
  say(fontFamily)(content, 150, 340, 780, 84, fill, 800, { lineHeight: 1.08 });

export const cardCover = postCard(
  0,
  {
    primary: PRIMARY_HINT,
    text: 'Account name, subtitle, arrow, menu lines and action icons',
  },
  {
    title: { label: 'Title', value: 'Social Posts' },
    subtitle: { label: 'Subtitle', value: 'that stop\nthe scroll' },
  },
  (t) => [
    say(t.font('heading'))(t.copy('title'), 150, 380, 780, 96, t.color('primary'), 800, {
      lineHeight: 1,
    }),
    say(t.font('body'))(t.copy('subtitle'), 150, 500, 780, 84, t.color('text'), 400, {
      lineHeight: 1.15,
    }),
    icon('move-right', 150, 760, 130, t.color('text'), { strokeWidth: 1.6 }),
  ],
);

export const cardRemix = postCard(
  1,
  {
    primary:
      'Card title, avatar circle, active dot and step check marks; its tints color the like heart and the other dots',
    text: 'Account name, steps, menu lines and action icons',
  },
  {
    title: { label: 'Title', value: 'Remix a\nWinner' },
    steps: {
      label: 'Step',
      value: ['SPOT a rising format', 'STUDY its structure', 'SHIP your own spin'],
    },
  },
  (t) => [
    cardTitle(t.copy('title'), t.font('heading'), t.color('primary')),
    checklist(t.list('steps'), 150, 620, 760, {
      color: t.color('text'),
      iconColor: t.color('primary'),
      fontSize: 42,
      fontFamily: t.font('body'),
      fontWeight: 500,
      gap: 96,
    }),
  ],
);

export const cardProcess = postCard(
  2,
  { primary: PRIMARY_HINT, text: 'Account name, body copy, menu lines and action icons' },
  {
    title: { label: 'Title', value: 'Show the\nProcess' },
    body: {
      label: 'Body',
      value:
        'Share the messy drafts that led\nto the final result. People trust\nwhat they watch you build, so\nshow the work behind the polish.',
    },
  },
  (t) => [
    cardTitle(t.copy('title'), t.font('heading'), t.color('primary')),
    say(t.font('body'))(t.copy('body'), 150, 620, 760, 40, t.color('text'), 400, {
      lineHeight: 1.45,
    }),
  ],
);

export const cardContrarian = postCard(
  3,
  { primary: PRIMARY_HINT, text: 'Account name, steps, menu lines and action icons' },
  {
    title: { label: 'Title', value: 'The Contrarian\nTake' },
    steps: {
      label: 'Steps',
      value: '1. Name the popular myth\n2. Flip it with your angle\n3. Back it up with proof',
    },
  },
  (t) => [
    cardTitle(t.copy('title'), t.font('heading'), t.color('primary')),
    say(t.font('body'))(t.copy('steps'), 150, 620, 760, 42, t.color('text'), 500, {
      lineHeight: 1.9,
    }),
  ],
);
