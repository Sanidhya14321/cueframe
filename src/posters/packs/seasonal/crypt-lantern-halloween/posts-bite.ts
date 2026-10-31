import { linear } from '@/design';
import {
  circle,
  POST_SIZE,
  poly,
  rect,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { COND, CRYPT, SPOOKY } from './palette';

const { width: W, height: H } = POST_SIZE;

const biteSpec = {
  colors: {
    background: { value: '#1c1c1c', hint: 'Dark page gradient' },
    surface: { value: CRYPT.bone, hint: 'Fangs and teeth' },
    primary: {
      value: CRYPT.blood,
      hint: 'BETTER RESULTS and the blood drips; its dark shade colors the gum',
    },
    text: { value: CRYPT.bone, hint: 'BUILT TO BITE and the vertical service labels' },
  },
  fonts: { heading: COND, spooky: SPOOKY },
  copy: {
    title: { label: 'Title', value: 'BUILT TO BITE' },
    subtitle: { label: 'Subtitle', value: 'BETTER RESULTS' },
    services: {
      label: 'Service',
      value: ['DATA DRIVEN', 'ALWAYS ON SUPPORT', 'DEDICATED CREW'],
    },
  },
} as const satisfies ThemeSpec;

type BiteTheme = Theme<typeof biteSpec>;

const fang = (t: BiteTheme, x: number, flip: boolean) => {
  const tip = flip ? x + 40 : x + 120;
  return [
    poly(
      [
        [x, 400],
        [x + 160, 400],
        [x + 156, 600],
        [tip, 780],
        [x + 4, 600],
      ],
      t.color('surface'),
      { name: 'Fang' },
    ),
    rect(tip - 5, 760, 10, 120, t.color('primary'), { cornerRadius: 5, name: 'Drip' }),
    circle(tip, 884, 12, t.color('primary')),
  ];
};

const BITE_X = [365, 545, 725] as const;

export const builtToBite = themed(W, H, biteSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', CRYPT.ink)), {
    name: 'Background',
  }),
  text(t.copy('title'), 0, 90, W, {
    fontFamily: t.font('heading'),
    fontSize: 120,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
    letterSpacing: 6,
  }),
  text(t.copy('subtitle'), 0, 210, W, {
    fontFamily: t.font('spooky'),
    fontSize: 110,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
  }),
  rect(120, 380, 840, 40, t.shade('primary', '#3a1016'), { cornerRadius: 20, name: 'Gum' }),
  fang(t, 150, false),
  rect(330, 400, 200, 250, t.color('surface'), { cornerRadius: 70, name: 'Tooth' }),
  rect(550, 400, 200, 250, t.color('surface'), { cornerRadius: 70, name: 'Tooth' }),
  fang(t, 770, true),
  t.list('services').map((label, index) =>
    text(label, (BITE_X[index] ?? 0) + 30, 760, 480, {
      fontFamily: t.font('heading'),
      fontSize: 58,
      fontWeight: 400,
      fill: t.color('text'),
      letterSpacing: 4,
      rotation: 90,
    }),
  ),
]);
