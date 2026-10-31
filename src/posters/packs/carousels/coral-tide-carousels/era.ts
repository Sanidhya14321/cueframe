import { circle, rect, type Template, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, BRAND, brandFooter, darkBackground, H, HEAD, TIDE, W } from './palette';

const eraSpec = {
  colors: {
    background: {
      value: TIDE.teal,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    primary: { value: TIDE.coral, hint: 'The next era of, the ampersand and the arrow' },
    text: { value: TIDE.white, hint: 'Growth, Strategy and the brand name' },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'The next era of' },
    title: { label: 'Title', value: 'Growth' },
    joiner: { label: 'Joiner', value: '&' },
    subtitle: { label: 'Second title', value: 'Strategy' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const eraCover = themed(W, H, eraSpec, (t) => {
  const big = (label: string, y: number, size: number, fill: string) =>
    text(label, 0, y, W, {
      fontFamily: t.font('heading'),
      fontSize: size,
      fontWeight: 800,
      fill,
      align: 'center',
    });
  return [
    darkBackground(t.color('background'), t.shade('background', TIDE.night)),
    text(t.copy('kicker'), 0, 330, W, {
      fontFamily: t.font('body'),
      fontSize: 60,
      fontWeight: 600,
      fill: t.color('primary'),
      align: 'center',
    }),
    big(t.copy('title'), 430, 170, t.color('text')),
    big(t.copy('joiner'), 610, 120, t.color('primary')),
    big(t.copy('subtitle'), 740, 170, t.color('text')),
    brandFooter(t.copy('brand'), t.font('heading'), t.color('text'), t.color('primary')),
  ];
});

const numberCopy = (number: string, body: string) => ({
  number: { label: 'Number', value: number },
  body: { label: 'Body', value: body },
});

const numberText = (
  number: string,
  body: string,
  heading: string,
  copy: string,
  numberFill: string,
  bodyFill: string,
) => [
  text(number, 80, 300, 900, {
    fontFamily: heading,
    fontSize: 280,
    fontWeight: 800,
    fill: numberFill,
    lineHeight: 1,
  }),
  text(body, 90, 680, 900, {
    fontFamily: copy,
    fontSize: 56,
    fontWeight: 600,
    fill: bodyFill,
    lineHeight: 1.4,
  }),
];

const numberedDark = (number: string, body: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: TIDE.teal,
          hint: 'Page gradient; its darker shade is the bottom of the gradient',
        },
        primary: { value: TIDE.coral, hint: 'Toggle and the body text' },
        text: { value: TIDE.white, hint: 'Toggle knob, the big number and the rule' },
      },
      fonts: { heading: HEAD, body: BODY },
      copy: numberCopy(number, body),
    } as const satisfies ThemeSpec,
    (t) => [
      darkBackground(t.color('background'), t.shade('background', TIDE.night)),
      rect(830, 110, 160, 72, t.color('primary'), { cornerRadius: 36, name: 'Toggle' }),
      circle(954, 146, 26, t.color('text')),
      numberText(
        t.copy('number'),
        t.copy('body'),
        t.font('heading'),
        t.font('body'),
        t.color('text'),
        t.color('primary'),
      ),
      rect(90, 1160, 900, 5, t.color('text'), { name: 'Rule' }),
    ],
  );

const numberedLight = (number: string, body: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: TIDE.cream, hint: 'Page' },
        primary: { value: TIDE.coral, hint: 'Big number and the rule' },
        surface: { value: TIDE.white, hint: 'Toggle knob' },
        text: { value: TIDE.deep, hint: 'Toggle and the body text' },
      },
      fonts: { heading: HEAD, body: BODY },
      copy: numberCopy(number, body),
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      rect(830, 110, 160, 72, t.color('text'), { cornerRadius: 36, name: 'Toggle' }),
      circle(866, 146, 26, t.color('surface')),
      numberText(
        t.copy('number'),
        t.copy('body'),
        t.font('heading'),
        t.font('body'),
        t.color('primary'),
        t.color('text'),
      ),
      rect(90, 1160, 900, 5, t.color('primary'), { name: 'Rule' }),
    ],
  );

export const ERA_SERIES: readonly Template[] = [
  eraCover,
  numberedDark(
    '01',
    'Automation is already here. Let tools handle the busywork so your team can focus on ideas.',
  ),
  numberedLight(
    '02',
    'People still set the direction. Judgment, taste and trust are what clients pay for.',
  ),
  numberedDark(
    '03',
    'Blend smart tools with human craft to move faster without losing your voice.',
  ),
  numberedLight(
    '04',
    'Stay curious. Test one new workflow each month and keep the ones that save time.',
  ),
];
