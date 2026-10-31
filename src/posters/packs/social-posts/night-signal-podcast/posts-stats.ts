import { linear } from '@/design';
import { rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, BRAND, brandMark, DISPLAY, H, SIGNAL as S, SCRIPT, W, waveform } from './palette';

const numbersSpec = {
  colors: {
    background: {
      value: S.night,
      hint: 'Page gradient; its shades color the bottom of the gradient and the dividers',
    },
    primary: { value: S.amber, hint: 'Season Two and the stat numbers' },
    accent: { value: '#ff8c46', hint: 'Waveform behind IN NUMBERS' },
    text: {
      value: S.white,
      hint: 'IN NUMBERS, the stat labels and the brand mark; its lilac shade colors the tune in line',
    },
  },
  fonts: { script: SCRIPT, heading: DISPLAY, body: BODY },
  copy: {
    kicker: { label: 'Script line', value: 'Season Two' },
    title: { label: 'Title', value: 'IN NUMBERS' },
    values: { label: 'Stat number', value: ['48', '2.3M', '96'] },
    labels: { label: 'Stat label', value: ['EPISODES', 'TOTAL PLAYS', 'GUESTS'] },
    footer: { label: 'Tune in line', value: 'TUNE IN ON 92.1 FM' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const inNumbers = themed(W, H, numbersSpec, (t) => {
  const labels = t.list('labels');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', S.ink)), {
      name: 'Background',
    }),
    text(t.copy('kicker'), 0, 90, W, {
      fontFamily: t.font('script'),
      fontSize: 96,
      fontWeight: 700,
      fill: t.color('primary'),
      align: 'center',
    }),
    waveform(90, 500, 900, 300, 41, t.shade('accent', 'rgba(255,140,70,0.75)')),
    text(t.copy('title'), 0, 420, W, {
      fontFamily: t.font('heading'),
      fontSize: 160,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
      ...shadow(24, 6, 'rgba(0,0,0,0.6)'),
    }),
    t.list('values').map((value, index) => [
      text(value, 90 + index * 300, 760, 300, {
        fontFamily: t.font('heading'),
        fontSize: 120,
        fontWeight: 400,
        fill: t.color('primary'),
        align: 'center',
        lineHeight: 1,
      }),
      text(labels[index] ?? '', 90 + index * 300, 900, 300, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
        letterSpacing: 3,
      }),
    ]),
    rect(388, 780, 3, 160, t.shade('background', S.plum), { name: 'Divider' }),
    rect(688, 780, 3, 160, t.shade('background', S.plum), { name: 'Divider' }),
    text(t.copy('footer'), 0, 1050, W, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 700,
      fill: t.shade('text', S.mute),
      align: 'center',
      letterSpacing: 5,
    }),
    brandMark(t.copy('brand'), t.font('body'), t.color('text'), 1200),
  ];
});
