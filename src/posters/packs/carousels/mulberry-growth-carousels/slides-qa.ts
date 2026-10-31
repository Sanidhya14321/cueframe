import { rect, shadow, type ThemeSpec, themed } from '../../../kit';
import { BACKGROUND, BODY, backdrop, H, HEADING, MULBERRY, say, W } from './palette';

const BIG = { lineHeight: 1 } as const;

const coverSpec = {
  colors: {
    background: BACKGROUND,
    primary: {
      value: MULBERRY.peach,
      hint: 'Big question marks, the ampersand and frequently asked questions',
    },
    secondary: { value: MULBERRY.blush, hint: 'Small question marks and the swipe pill outline' },
    text: { value: MULBERRY.white, hint: 'Q, A and the swipe label' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    marks: { label: 'Question mark', value: ['?', '?', '?', '?'] },
    question: { label: 'Question letter', value: 'Q' },
    answer: { label: 'Answer letter', value: 'A' },
    joiner: { label: 'Joining sign', value: '&' },
    subtitle: { label: 'Subtitle', value: 'frequently\nasked\nquestions' },
    cta: { label: 'Swipe label', value: 'Swipe to read  →' },
  },
} as const satisfies ThemeSpec;

export const qaCover = themed(W, H, coverSpec, (t) => {
  const heading = say(t.font('heading'));
  const body = say(t.font('body'));
  const [big = '', large = '', small = '', tiny = ''] = t.list('marks');
  return [
    backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
    heading(big, 640, 120, 200, 240, t.color('primary'), 800, BIG),
    heading(large, 820, 300, 140, 130, t.color('primary'), 800, BIG),
    heading(small, 540, 330, 100, 90, t.color('secondary'), 800, BIG),
    heading(tiny, 860, 560, 100, 80, t.color('secondary'), 800, BIG),
    heading(t.copy('question'), 80, 330, 420, 400, t.color('text'), 800, BIG),
    heading(t.copy('answer'), 420, 560, 420, 400, t.color('text'), 800, BIG),
    heading(t.copy('joiner'), 330, 560, 200, 200, t.color('primary'), 800, BIG),
    body(t.copy('subtitle'), 90, 830, 330, 46, t.color('primary'), 600, {
      lineHeight: 1.15,
    }),
    rect(90, 1130, 360, 84, t.shade('secondary', 'rgba(0,0,0,0)'), {
      name: 'Swipe pill',
      cornerRadius: 42,
      stroke: t.color('secondary'),
      strokeWidth: 3,
    }),
    body(t.copy('cta'), 90, 1152, 360, 34, t.color('text'), 600, { align: 'center' }),
  ];
});

const qa = (question: string, answer: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: BACKGROUND,
        surface: {
          value: MULBERRY.cream,
          hint: 'Question card; its shades color the card divider and the faint question mark',
        },
        primary: {
          value: MULBERRY.peach,
          hint: 'Answer card; its faint tints color the Q&A and A watermarks',
        },
        accent: { value: MULBERRY.wine, hint: 'Q and A letters and the answer card divider' },
        text: { value: MULBERRY.ink, hint: 'Question and answer' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        watermark: { label: 'Watermark', value: 'Q&A' },
        mark: { label: 'Question mark', value: '?' },
        questionLetter: { label: 'Question letter', value: 'Q' },
        answerLetter: {
          label: 'Answer letter',
          value: 'A',
          hint: 'Shown on the answer card and as the big watermark',
        },
        question: { label: 'Question', value: question },
        answer: { label: 'Answer', value: answer },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const heading = say(t.font('heading'));
      const body = say(t.font('body'));
      return [
        backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
        heading(
          t.copy('watermark'),
          40,
          1180,
          900,
          300,
          t.shade('primary', 'rgba(255,225,211,0.16)'),
          800,
          { lineHeight: 1, rotation: -90 },
        ),
        heading(
          t.copy('mark'),
          600,
          40,
          240,
          260,
          t.shade('surface', 'rgba(255,255,255,0.35)'),
          800,
          BIG,
        ),
        heading(
          t.copy('answerLetter'),
          690,
          930,
          360,
          400,
          t.shade('primary', 'rgba(255,179,138,0.4)'),
          800,
          BIG,
        ),
        rect(330, 360, 680, 230, t.color('surface'), {
          name: 'Question card',
          cornerRadius: 22,
          ...shadow(30, 12, 'rgba(0,0,0,0.3)'),
        }),
        rect(880, 360, 3, 230, t.shade('surface', '#d8c2c9'), { name: 'Divider' }),
        heading(t.copy('questionLetter'), 883, 430, 127, 64, t.color('accent'), 600, {
          align: 'center',
        }),
        body(t.copy('question'), 370, 395, 490, 34, t.color('text'), 500),
        rect(250, 650, 700, 250, t.color('primary'), {
          name: 'Answer card',
          cornerRadius: 22,
          ...shadow(30, 12, 'rgba(0,0,0,0.3)'),
        }),
        rect(377, 650, 3, 250, t.shade('accent', 'rgba(92,18,51,0.35)'), { name: 'Divider' }),
        heading(t.copy('answerLetter'), 250, 730, 127, 64, t.color('accent'), 600, {
          align: 'center',
        }),
        body(t.copy('answer'), 410, 685, 510, 34, t.color('text'), 500),
      ];
    },
  );

export const qaReach = qa(
  'What is the difference\nbetween reach and\nengagement?',
  'Reach counts who saw it.\nEngagement counts who\ncared enough to act.',
);

export const qaPosting = qa(
  'How often should a\nsmall brand post on\nsocial each week?',
  'As often as you can stay\nconsistent. Three strong\nposts beat seven rushed.',
);

export const qaCarousel = qa(
  'Do carousels really\nbeat single images\nin the feed?',
  'They keep people on the\npost longer, which tells\nthe feed it is worth it.',
);
