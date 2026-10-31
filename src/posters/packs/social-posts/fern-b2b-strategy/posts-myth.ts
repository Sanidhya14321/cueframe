import { group, rect, STORY_SIZE, shadow, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, backdrop, FERN, H, HEADING, highlight, W } from './posts';

const CARD_ROWS = [480, 760] as const;

const mythSpec = {
  colors: {
    background: {
      value: FERN.forest,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    surface: { value: FERN.white, hint: 'Myth, or, the statement cards and their tab labels' },
    secondary: {
      value: FERN.mint,
      hint: 'Fact, the Save button outline and its label; its muted shade outlines the sideways MYTH',
    },
    accent: { value: FERN.fern, hint: 'Tabs on the statement cards' },
    text: { value: FERN.deep, hint: 'Statements on the cards' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    watermark: { label: 'Sideways word', value: 'MYTH' },
    title: { label: 'Title', value: 'Myth' },
    joiner: { label: 'Joining word', value: 'or' },
    answer: { label: 'Second title word', value: 'Fact' },
    tabs: { label: 'Card tab', value: ['Myth', 'Fact'] },
    statements: {
      label: 'Statement',
      value: [
        'Great marketing is pure creative\ninstinct and lucky timing.',
        'It is research, testing and\nclear data, every single week.',
      ],
    },
    cta: { label: 'Button', value: 'Save this post' },
  },
} as const satisfies ThemeSpec;

const mythArt = (height: number) =>
  themed(W, height, mythSpec, (t) => {
    const top = (height - H) / 2;
    const statements = t.list('statements');
    return [
      backdrop(t.color('background'), t.shade('background', FERN.deep), 165, height),
      text(t.copy('watermark'), 70, top + 1100, 700, {
        fontFamily: t.font('heading'),
        fontSize: 150,
        fontWeight: 800,
        fill: t.shade('secondary', 'rgba(0,0,0,0)'),
        stroke: t.shade('secondary', FERN.sage),
        strokeWidth: 3,
        rotation: -90,
        lineHeight: 1,
      }),
      text(t.copy('title'), 0, top + 120, W, {
        fontFamily: t.font('heading'),
        fontSize: 130,
        fontWeight: 800,
        fill: t.color('surface'),
        align: 'center',
        lineHeight: 1,
      }),
      text(t.copy('joiner'), 330, top + 250, 120, {
        fontFamily: t.font('heading'),
        fontSize: 50,
        fontWeight: 600,
        fill: t.color('surface'),
        align: 'center',
      }),
      text(t.copy('answer'), 420, top + 230, 400, {
        fontFamily: t.font('heading'),
        fontSize: 110,
        fontWeight: 800,
        fill: t.color('secondary'),
      }),
      t.list('tabs').map((label, index) => {
        const y = CARD_ROWS[index] ?? 0;
        return group(
          rect(260, top + y, 720, 200, t.color('surface'), {
            cornerRadius: 24,
            name: `${label} card`,
            ...shadow(30, 12, 'rgba(0,0,0,0.3)'),
          }),
          highlight(label, 290, top + y - 30, 140, 34, {
            fill: t.color('accent'),
            color: t.color('surface'),
            fontFamily: t.font('heading'),
          }),
          text(statements[index] ?? '', 300, top + y + 60, 640, {
            fontFamily: t.font('body'),
            fontSize: 32,
            fontWeight: 600,
            fill: t.color('text'),
            lineHeight: 1.35,
          }),
        );
      }),
      group(
        rect(410, top + 1090, 420, 84, t.shade('secondary', 'rgba(0,0,0,0)'), {
          cornerRadius: 42,
          stroke: t.color('secondary'),
          strokeWidth: 3,
          name: 'Save button',
        }),
        text(t.copy('cta'), 410, top + 1112, 420, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 700,
          fill: t.color('secondary'),
          align: 'center',
        }),
      ),
    ];
  });

export const mythPost = mythArt(H);

export const mythStory = mythArt(STORY_SIZE.height);
