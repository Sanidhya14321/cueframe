import {
  circle,
  icon,
  type Nodes,
  POST_SIZE,
  rect,
  rotateNodes,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface B2bPalette {
  primary: string;
  ink: string;
  paper: string;
  accent: string;
  muted: string;
}

export const LIME: B2bPalette = {
  primary: '#c6f135',
  ink: '#0e0e12',
  paper: '#ffffff',
  accent: '#7b5cff',
  muted: '#9ca3af',
};

export const PEACH: B2bPalette = {
  primary: '#ffb38a',
  ink: '#1f2b46',
  paper: '#fff8f2',
  accent: '#e8553f',
  muted: '#8a93a8',
};

export const W = POST_SIZE.width;
export const H = POST_SIZE.height;

export const HEADING = { label: 'Heading font', value: 'Urbanist' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const DISPLAY = { label: 'Display font', value: 'Anton' } as const;
export const HANDLE = { label: 'Handle', value: 'kestrel.studio' } as const;

export const heavy =
  (fontFamily: string) => (content: string, x: number, y: number, size: number, fill: string) =>
    text(content, x, y, W - x - 60, {
      fontFamily,
      fontSize: size,
      fontWeight: 900,
      fill,
      lineHeight: 1.02,
    });

export const footer = (label: string, fill: string, fontFamily: string) =>
  text(label, 80, 1262, 500, { fontSize: 26, fontWeight: 600, fill, fontFamily });

export const sparkle = (x: number, y: number, size: number, fill: string) =>
  star(5, x, y, size, fill, { innerRatio: 0.42, name: 'Sparkle' });

interface Statement {
  label: string;
  body: string;
  x: number;
  y: number;
  fill: string;
  labelColor: string;
  bodyColor: string;
  heading: string;
  font: string;
}

const statement = (card: Statement): Nodes[] => [
  rect(card.x, card.y, 660, 230, card.fill, {
    cornerRadius: 18,
    name: `${card.label} card`,
    ...shadow(30, 12),
  }),
  text(card.label, card.x + 40, card.y + 34, 300, {
    fontFamily: card.heading,
    fontSize: 30,
    fontWeight: 900,
    fill: card.labelColor,
    letterSpacing: 3,
  }),
  text(card.body, card.x + 40, card.y + 86, 590, {
    fontFamily: card.font,
    fontSize: 38,
    fontWeight: 500,
    fill: card.bodyColor,
    lineHeight: 1.3,
  }),
];

export const mythFact = (p: B2bPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        primary: { value: p.primary, hint: 'Page, the or word and the MYTH label' },
        text: {
          value: p.ink,
          hint: 'Myth and Fact, the or tag, the MYTH card, the connector, the FACT text, the lower sparkle and the handle',
        },
        surface: { value: p.paper, hint: 'FACT card, the MYTH text and the top sparkle' },
        accent: { value: p.accent, hint: 'FACT label' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        myth: { label: 'Title', value: 'Myth' },
        fact: { label: 'Second title', value: 'Fact' },
        or: { label: 'Or tag', value: 'or' },
        labels: { label: 'Card label', value: ['MYTH', 'FACT'] },
        cards: {
          label: 'Card text',
          value: [
            'Cold outreach no longer\nworks for B2B brands.',
            'Personal, useful outreach\nstill books meetings.',
          ],
        },
        handle: HANDLE,
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const title = heavy(t.font('heading'));
      const [mythLabel = '', factLabel = ''] = t.list('labels');
      const [mythBody = '', factBody = ''] = t.list('cards');
      return [
        rect(0, 0, W, H, t.color('primary'), { name: 'Background' }),
        title(t.copy('myth'), 90, 110, 160, t.color('text')),
        title(t.copy('fact'), 90, 280, 160, t.color('text')),
        rect(440, 312, 96, 70, t.color('text'), { name: 'Or tag' }),
        text(t.copy('or'), 440, 322, 96, {
          fontFamily: t.font('heading'),
          fontSize: 40,
          fontWeight: 800,
          fill: t.color('primary'),
          align: 'center',
        }),
        sparkle(850, 100, 150, t.color('surface')),
        rotateNodes(-5, 540, 670, [
          statement({
            label: mythLabel,
            body: mythBody,
            x: 210,
            y: 560,
            fill: t.color('text'),
            labelColor: t.color('primary'),
            bodyColor: t.color('surface'),
            heading: t.font('heading'),
            font: t.font('body'),
          }),
        ]),
        rect(560, 790, 4, 140, t.color('text'), { name: 'Connector' }),
        circle(562, 790, 12, t.color('text')),
        rotateNodes(4, 640, 1040, [
          statement({
            label: factLabel,
            body: factBody,
            x: 310,
            y: 925,
            fill: t.color('surface'),
            labelColor: t.color('accent'),
            bodyColor: t.color('text'),
            heading: t.font('heading'),
            font: t.font('body'),
          }),
        ]),
        sparkle(870, 840, 130, t.color('text')),
        footer(t.copy('handle'), t.color('text'), t.font('body')),
      ];
    },
  );

interface ListCard {
  title: string;
  items: string;
  symbol: 'circle-check' | 'circle-x';
  x: number;
  fill: string;
  color: string;
  heading: string;
  font: string;
}

const listCard = (card: ListCard) => [
  rect(card.x, 500, 440, 680, card.fill, { cornerRadius: 22, name: `${card.title} card` }),
  icon(card.symbol, card.x + 34, 538, 60, card.color, { strokeWidth: 2.2 }),
  text(card.title, card.x + 110, 540, 300, {
    fontFamily: card.heading,
    fontSize: 48,
    fontWeight: 900,
    fill: card.color,
  }),
  rect(card.x + 34, 630, 372, 3, card.color, { name: 'Divider' }),
  text(card.items, card.x + 34, 670, 380, {
    fontFamily: card.font,
    fontSize: 32,
    fontWeight: 500,
    fill: card.color,
    lineHeight: 1.55,
  }),
];

export const dosDonts = (p: B2bPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.ink, hint: 'Page' },
        primary: { value: p.primary, hint: "What you should know and the Don'ts card" },
        surface: {
          value: p.paper,
          hint: "Do's and Don'ts subtitle, the Do's card and the sparkles",
        },
        text: { value: p.ink, hint: 'Icons, titles, dividers and tips inside both cards' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        headline: { label: 'Headline', value: 'What you' },
        second: { label: 'Headline second line', value: 'should know' },
        subtitle: { label: 'Subtitle', value: "Do's and Don'ts" },
        titles: { label: 'Card title', value: ["Do's", "Don'ts"] },
        items: {
          label: 'Card tips',
          value: [
            '• Post on a schedule\n• Lead with insight\n• Reply to comments\n• Share client wins',
            '• Go quiet for weeks\n• Copy rival posts\n• Ignore messages\n• Buy fake followers',
          ],
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const title = heavy(t.font('heading'));
      const [doTitle = '', dontTitle = ''] = t.list('titles');
      const [doItems = '', dontItems = ''] = t.list('items');
      const fonts = { heading: t.font('heading'), font: t.font('body') };
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        title(t.copy('headline'), 80, 100, 100, t.color('primary')),
        title(t.copy('second'), 80, 205, 100, t.color('primary')),
        title(t.copy('subtitle'), 80, 330, 76, t.color('surface')),
        sparkle(880, 110, 130, t.color('surface')),
        listCard({
          title: doTitle,
          items: doItems,
          symbol: 'circle-check',
          x: 80,
          fill: t.color('surface'),
          color: t.color('text'),
          ...fonts,
        }),
        listCard({
          title: dontTitle,
          items: dontItems,
          symbol: 'circle-x',
          x: 560,
          fill: t.color('primary'),
          color: t.color('text'),
          ...fonts,
        }),
        sparkle(900, 1130, 140, t.color('surface')),
      ];
    },
  );
