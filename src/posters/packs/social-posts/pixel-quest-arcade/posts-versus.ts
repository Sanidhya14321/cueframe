import { linear } from '@/design';
import { rect, shadow, type Theme, type ThemeSpec, text, themed } from '../../../kit';
import { H, HERO, PIXEL_FONT, PX, ROBOT, sprite, W } from './pixel';

const OLD_FILL = [0.25, 0.15, 0.3];
const OUR_FILL = [1, 0.9, 1];

const versusSpec = {
  colors: {
    background: {
      value: PX.deep,
      hint: 'Left half of the page; its shades color the right half, the floor and the dark sprite pixels',
    },
    primary: { value: PX.pink, hint: 'Old way meter bars and the hero shirt' },
    secondary: { value: PX.mint, hint: 'Our way meter bars and the robot body' },
    accent: {
      value: PX.sun,
      hint: 'VS and the hero hair; its peach shade colors the hero skin',
    },
    text: {
      value: PX.white,
      hint: 'Side titles, meter frames and labels; its tints color the floor lines and robot head',
    },
  },
  fonts: { pixel: PIXEL_FONT },
  copy: {
    sides: { label: 'Side title', value: ['OLD\nWAY', 'OUR\nWAY'] },
    oldRows: {
      label: 'Old way point',
      value: ['MANUAL REPORTS', 'SLOW DELIVERY', 'GUESSWORK'],
    },
    ourRows: {
      label: 'Our way point',
      value: ['AUTO INSIGHTS', 'FAST TURNAROUND', 'REAL DATA'],
    },
    vs: { label: 'Versus', value: 'VS' },
  },
} as const satisfies ThemeSpec;

const meterColumn = (
  t: Theme<typeof versusSpec>,
  x: number,
  labels: readonly string[],
  fills: readonly number[],
  color: string,
) =>
  labels.map((label, index) => {
    const y = 330 + index * 170;
    return [
      rect(x, y, 360, 56, t.shade('text', 'rgba(0,0,0,0)'), {
        stroke: t.color('text'),
        strokeWidth: 5,
        name: 'Meter',
      }),
      rect(x + 10, y + 10, 340 * (fills[index] ?? 0), 36, color, { name: 'Meter fill' }),
      text(label, x - 40, y + 76, 440, {
        fontFamily: t.font('pixel'),
        fontSize: 26,
        fontWeight: 400,
        fill: t.color('text'),
        align: 'center',
      }),
    ];
  });

export const versus = themed(W, H, versusSpec, (t) => {
  const pixel = t.font('pixel');
  const [oldSide = '', ourSide = ''] = t.list('sides');
  const side = (label: string, x: number) =>
    text(label, x, 100, 540, {
      fontFamily: pixel,
      fontSize: 60,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.2,
    });
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    rect(540, 0, 540, H, t.shade('background', PX.sky), { name: 'Right half' }),
    side(oldSide, 0),
    side(ourSide, 540),
    meterColumn(t, 90, t.list('oldRows'), OLD_FILL, t.color('primary')),
    meterColumn(t, 630, t.list('ourRows'), OUR_FILL, t.color('secondary')),
    text(t.copy('vs'), 340, 850, 400, {
      fontFamily: pixel,
      fontSize: 150,
      fontWeight: 400,
      fill: t.color('accent'),
      align: 'center',
      ...shadow(0, 10, t.shade('background', PX.night)),
    }),
    rect(
      0,
      1040,
      W,
      310,
      linear(180, t.shade('background', '#3a2680'), t.shade('background', PX.night)),
      { name: 'Floor' },
    ),
    Array.from({ length: 5 }, (_, index) =>
      rect(0, 1080 + index * 56, W, 3, t.shade('text', 'rgba(201,168,255,0.25)'), {
        name: 'Floor line',
      }),
    ),
    sprite(HERO, 190, 830, 18, {
      Y: t.color('accent'),
      S: t.shade('accent', '#f2c29b'),
      K: t.shade('background', PX.night),
      P: t.color('primary'),
      B: t.shade('background', '#3b4a8f'),
    }),
    sprite(ROBOT, 740, 830, 18, {
      M: t.color('secondary'),
      G: t.shade('text', '#d7d2e6'),
      K: t.shade('background', PX.night),
    }),
  ];
});
