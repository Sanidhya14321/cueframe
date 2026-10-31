import { POST_SIZE, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import { backdrop, HEAD, MERIDIAN } from './posts';

const { width: W, height: H } = POST_SIZE;

const opsSpec = {
  colors: {
    background: {
      value: MERIDIAN.coral,
      hint: 'Page gradient and ON THE on the screen; its soft shade is the top of the gradient',
    },
    primary: {
      value: MERIDIAN.navy,
      hint: 'Phone body, its camera island, OPS, MOVE and Lead your people',
    },
    surface: { value: MERIDIAN.cream, hint: 'Phone screen' },
    text: { value: MERIDIAN.white, hint: 'from anywhere' },
  },
  fonts: { heading: HEAD },
  copy: {
    words: { label: 'Screen line', value: ['OPS', 'ON\nTHE', 'MOVE'] },
    intro: { label: 'Tagline', value: 'Lead your people' },
    highlight: { label: 'Highlight', value: 'from anywhere' },
  },
} as const satisfies ThemeSpec;

export const pocketOps = themed(W, H, opsSpec, (t) => {
  const [ops = '', onThe = '', move = ''] = t.list('words');
  const word = (content: string, y: number, fill: string) =>
    text(content, 344, y, 392, {
      fontFamily: t.font('heading'),
      fontSize: 112,
      fontWeight: 800,
      fill,
      align: 'center',
      lineHeight: 1,
    });
  return [
    backdrop(H, t.shade('background', MERIDIAN.coralSoft), t.color('background'), 160),
    rect(320, 120, 440, 800, t.color('primary'), {
      cornerRadius: 70,
      name: 'Phone',
      ...shadow(40, 20, t.shade('primary', 'rgba(11,20,38,0.35)')),
    }),
    rect(344, 144, 392, 752, t.color('surface'), { cornerRadius: 52, name: 'Screen' }),
    rect(480, 168, 120, 30, t.color('primary'), { cornerRadius: 15, name: 'Island' }),
    word(ops, 296, t.color('primary')),
    word(onThe, 408, t.color('background')),
    word(move, 632, t.color('primary')),
    text(t.copy('intro'), 0, 990, W, {
      fontFamily: t.font('heading'),
      fontSize: 54,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
    }),
    text(t.copy('highlight'), 0, 1060, W, {
      fontFamily: t.font('heading'),
      fontSize: 60,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
  ];
});
