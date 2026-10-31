import { linear } from '@/design';
import {
  circle,
  icon,
  photo,
  poly,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  bold,
  button,
  copy,
  display,
  FH,
  H,
  HANDLE,
  HEADING,
  handle,
  SCRIPT,
  script,
  W,
} from './posts';

const insightsSpec = {
  colors: {
    background: { value: FH.cream, hint: 'Top of the page gradient' },
    primary: { value: FH.forest, hint: 'Market, Receive latest, the arrow and the comment line' },
    accent: {
      value: FH.mustard,
      hint: 'Halo behind the photo; its shades color insights and the bottom of the page gradient',
    },
    text: { value: FH.ink, hint: 'Last line under the comment prompt' },
  },
  fonts: {
    heading: { label: 'Heading font', value: 'Archivo Black' },
    script: SCRIPT,
    body: BODY,
  },
  copy: {
    intro: { label: 'Intro', value: 'Receive latest' },
    title: { label: 'Title', value: 'Market' },
    kicker: { label: 'Kicker', value: 'insights' },
    prompt: { label: 'Comment prompt', value: 'Comment "MARKET"' },
    detail: { label: 'Prompt detail', value: 'to get the full report' },
  },
} as const satisfies ThemeSpec;

export const marketInsights = themed(W, H, insightsSpec, (t) => {
  const hand = script(t.font('script'));
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('accent', FH.mustardSoft)), {
      name: 'Background',
    }),
    hand(t.copy('intro'), 0, 90, W, 84, t.color('primary'), { align: 'center' }),
    text(t.copy('title'), 0, 170, W, {
      fontFamily: t.font('heading'),
      fontSize: 230,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1,
    }),
    hand(t.copy('kicker'), 600, 400, 400, 80, t.shade('accent', FH.mustardDark), {
      align: 'right',
    }),
    circle(540, 820, 320, t.color('accent'), { name: 'Halo' }),
    photo('woman-portrait-6', 250, 530, 580, 580, { cornerRadius: 290 }),
    icon('corner-down-right', 250, 1150, 80, t.color('primary'), { strokeWidth: 2.4 }),
    bold(t.font('body'))(t.copy('prompt'), 350, 1160, 600, 32, t.color('primary')),
    copy(t.font('body'))(t.copy('detail'), 350, 1202, 600, 28, t.color('text')),
  ];
});

const CX = 790;
const CY = 560;
const RADIUS = 255;

const wheelSpec = {
  colors: {
    background: { value: FH.mustard, hint: 'Page and the wheel hub' },
    primary: {
      value: FH.forest,
      hint: 'Title, dark wedges and the Spin Now button; its darker shade colors the pointer, hub pin, body text and handle',
    },
    surface: { value: FH.cream, hint: 'Wheel rim, light wedges and the button label' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'DID\nYOU\nSPIN?' },
    prizes: {
      label: 'Prize',
      value: [
        '10% OFF',
        'FREE CALL',
        'AD CREDIT',
        'TOTE BAG',
        'AUDIT',
        'BONUS',
        'GIFT CARD',
        'FREE PLAN',
      ],
    },
    body: {
      label: 'Body',
      value: 'Spin to win a free strategy call,\nad credits or a full brand audit.',
    },
    cta: { label: 'Button', value: 'Spin Now' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const spinWheel = themed(W, H, wheelSpec, (t) => {
  const prizes = t.list('prizes');
  const wedge = (index: number) => {
    const start = index * 45 - 112.5;
    const points = Array.from({ length: 6 }, (_, step) => {
      const angle = ((start + step * 9) * Math.PI) / 180;
      return [CX + Math.cos(angle) * RADIUS, CY + Math.sin(angle) * RADIUS] as const;
    });
    return poly([[CX, CY], ...points], index % 2 === 0 ? t.color('primary') : t.color('surface'), {
      name: 'Wedge',
    });
  };
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    display(t.font('heading'))(t.copy('title'), 70, 170, 600, 240, t.color('primary'), {
      lineHeight: 0.92,
    }),
    circle(CX, CY, RADIUS + 18, t.color('surface'), {
      name: 'Wheel rim',
      ...shadow(40, 16, t.shade('primary', 'rgba(19,48,36,0.3)')),
    }),
    prizes.map((_, index) => wedge(index)),
    prizes.map((prize, index) =>
      rotateNodes(index * 45 - 90, CX, CY, [
        bold(t.font('body'))(
          prize,
          CX + 66,
          CY - 14,
          170,
          24,
          index % 2 === 0 ? t.color('surface') : t.color('primary'),
          { align: 'center' },
        ),
      ]),
    ),
    circle(CX, CY, 42, t.color('background'), { name: 'Hub' }),
    circle(CX, CY, 16, t.shade('primary', FH.deep), { name: 'Hub pin' }),
    poly(
      [
        [CX - 26, CY - RADIUS - 40],
        [CX + 26, CY - RADIUS - 40],
        [CX, CY - RADIUS + 14],
      ],
      t.shade('primary', FH.deep),
      { name: 'Pointer' },
    ),
    copy(t.font('body'))(t.copy('body'), 70, 930, 940, 36, t.shade('primary', FH.deep), {
      fontWeight: 500,
    }),
    button(t.copy('cta'), 70, 1070, t.color('primary'), t.color('surface'), t.font('body')),
    handle(t.copy('handle'), 1250, t.shade('primary', FH.deep), t.font('body')),
  ];
});

const mythSpec = {
  colors: {
    background: { value: FH.cream, hint: 'Page and the MYTH label text' },
    primary: {
      value: FH.forest,
      hint: 'MYTH label, or, the MYTH badge and the divider; its darker shade colors the FACT badge text',
    },
    accent: { value: FH.mustard, hint: 'FACT label and FACT badge' },
    text: { value: FH.ink, hint: 'Both statements; its lighter shade colors the handle' },
  },
  fonts: { heading: HEADING, script: SCRIPT, body: BODY },
  copy: {
    myth: { label: 'Myth label', value: 'MYTH' },
    joiner: { label: 'Joining word', value: 'or' },
    fact: { label: 'Fact label', value: 'FACT' },
    badges: { label: 'Badge', value: ['MYTH', 'FACT'] },
    statements: {
      label: 'Statement',
      value: [
        'Marketing is just running ads.',
        'Marketing builds lasting\ncustomer relationships.',
      ],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const mythFact = themed(W, H, mythSpec, (t) => {
  const heading = display(t.font('heading'));
  const body = copy(t.font('body'));
  const [mythBadge = '', factBadge = ''] = t.list('badges');
  const [myth = '', fact = ''] = t.list('statements');
  const label = (
    content: string,
    x: number,
    y: number,
    width: number,
    fill: string,
    color: string,
    angle: number,
  ) =>
    rotateNodes(angle, x + width / 2, y + 80, [
      rect(x, y, width, 160, fill, { cornerRadius: 22, name: 'Label' }),
      heading(content, x, y + 14, width, 136, color, { align: 'center' }),
    ]);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    label(t.copy('myth'), 90, 120, 430, t.color('primary'), t.color('background'), -4),
    script(t.font('script'))(t.copy('joiner'), 560, 190, 120, 90, t.color('primary')),
    label(t.copy('fact'), 470, 310, 460, t.color('accent'), t.color('primary'), 3),
    button(mythBadge, 90, 600, t.color('primary'), t.color('background'), t.font('body')),
    body(myth, 90, 690, 900, 44, t.color('text'), { fontWeight: 500 }),
    rect(90, 810, 900, 3, t.shade('primary', 'rgba(31,74,54,0.2)'), { name: 'Divider' }),
    button(factBadge, 90, 860, t.color('accent'), t.shade('primary', FH.deep), t.font('body')),
    body(fact, 90, 950, 900, 44, t.color('text'), { fontWeight: 700 }),
    handle(t.copy('handle'), 1250, t.shade('text', FH.grey), t.font('body')),
  ];
});

const quizSpec = {
  colors: {
    background: {
      value: FH.cream,
      hint: 'Page, the light checks, the quiz card and the answer text',
    },
    primary: {
      value: FH.forest,
      hint: 'Dark checks, QUIZ, TIME, the blank line and the answer pills',
    },
    accent: { value: FH.mustard, hint: 'TIME tag and the answer letter badges' },
    text: { value: FH.ink, hint: 'The question; its darker shade colors the answer letters' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'QUIZ' },
    tag: { label: 'Tag', value: 'TIME' },
    question: { label: 'Question', value: 'Effective marketing\ndrives long-term' },
    letters: { label: 'Answer letter', value: ['a', 'b', 'c', 'd'] },
    answers: { label: 'Answer', value: ['Revenue', 'Clicks', 'Hype', 'Views'] },
  },
} as const satisfies ThemeSpec;

export const quizTime = themed(W, H, quizSpec, (t) => {
  const heading = display(t.font('heading'));
  const strong = bold(t.font('body'));
  const letters = t.list('letters');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    Array.from({ length: 80 }, (_, index) => {
      const column = index % 8;
      const row = Math.floor(index / 8);
      return (column + row) % 2 === 0
        ? rect(column * 135, row * 135, 135, 135, t.color('primary'), { name: 'Check' })
        : [];
    }),
    rect(150, 240, 780, 900, t.color('background'), {
      cornerRadius: 44,
      name: 'Quiz card',
      ...shadow(50, 20, 'rgba(0,0,0,0.3)'),
    }),
    heading(t.copy('title'), 200, 290, 400, 230, t.color('primary')),
    rotateNodes(-6, 690, 400, [
      rect(580, 350, 230, 100, t.color('accent'), { cornerRadius: 16, name: 'Time tag' }),
      heading(t.copy('tag'), 580, 362, 230, 80, t.color('primary'), { align: 'center' }),
    ]),
    strong(t.copy('question'), 200, 560, 700, 42, t.color('text')),
    rect(200, 680, 320, 5, t.color('primary'), { cornerRadius: 3, name: 'Blank' }),
    t.list('answers').map((answer, index) => {
      const y = 740 + index * 92;
      return [
        circle(236, y + 32, 32, t.color('accent'), { name: 'Letter badge' }),
        strong(letters[index] ?? '', 204, y + 14, 64, 30, t.shade('text', FH.deep), {
          align: 'center',
        }),
        rect(290, y, 580, 64, t.color('primary'), { cornerRadius: 32, name: 'Option' }),
        strong(answer, 290, y + 16, 580, 28, t.color('background'), { align: 'center' }),
      ];
    }),
  ];
});
