import { linear } from '@/design';
import { circle, icon, POST_SIZE, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, backdrop, cta, HEAD, MERIDIAN } from './posts';

const { width: W, height: H } = POST_SIZE;

interface HangerCopy {
  background: [string, string];
  hanger: string;
  top: string;
  bottom: string;
  topColor: string;
  bottomColor: string;
  lines: string;
  highlight: string;
  accent: string;
  button: string;
}

const doorHanger = (copy: HangerCopy) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: copy.background[0],
          hint: 'Page gradient and the hanger hole; its darker shades color the bottom of the gradient and the button label and dot',
        },
        surface: {
          value: '#f8fafc',
          hint: 'Metal door handle and rosette; its grey shades shape the metal gradients',
        },
        primary: { value: copy.bottomColor, hint: 'Arrow and the bottom word on the hanger' },
        secondary: { value: copy.topColor, hint: 'Top word on the hanger' },
        accent: {
          value: copy.accent,
          hint: 'Door hanger, the highlighted line, the button and the arrow on the button',
        },
        text: { value: MERIDIAN.white, hint: 'First headline line' },
      },
      fonts: { heading: HEAD, body: BODY },
      copy: {
        top: { label: 'Hanger top word', value: copy.top },
        bottom: { label: 'Hanger bottom word', value: copy.bottom },
        lines: { label: 'Headline', value: copy.lines },
        highlight: { label: 'Highlight', value: copy.highlight },
        button: { label: 'Button', value: copy.button },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(
        0,
        0,
        W,
        H,
        linear(180, t.color('background'), t.shade('background', copy.background[1])),
        { name: 'Background' },
      ),
      rect(120, 250, 270, 900, t.shade('accent', copy.hanger), {
        cornerRadius: 14,
        name: 'Door hanger',
        ...shadow(30, 14, 'rgba(0,0,0,0.3)'),
      }),
      circle(255, 370, 66, t.color('background'), { name: 'Hanger hole' }),
      circle(255, 370, 58, linear(160, t.color('surface'), t.shade('surface', '#8b95a5')), {
        name: 'Rosette',
      }),
      rect(
        230,
        330,
        720,
        74,
        linear(
          180,
          t.color('surface'),
          t.shade('surface', '#b8c0cc'),
          t.shade('surface', '#7d8796'),
        ),
        { cornerRadius: 37, name: 'Handle', ...shadow(24, 12, 'rgba(0,0,0,0.3)') },
      ),
      icon('arrow-up-right', 170, 560, 130, t.color('primary'), { strokeWidth: 2.6 }),
      text(t.copy('top'), 120, 730, 270, {
        fontFamily: t.font('heading'),
        fontSize: 160,
        fontWeight: 800,
        fill: t.color('secondary'),
        align: 'center',
        lineHeight: 1,
      }),
      text(t.copy('bottom'), 120, 890, 270, {
        fontFamily: t.font('heading'),
        fontSize: 160,
        fontWeight: 800,
        fill: t.color('primary'),
        align: 'center',
        lineHeight: 1,
      }),
      text(t.copy('lines'), 450, 600, 580, {
        fontFamily: t.font('heading'),
        fontSize: 62,
        fontWeight: 400,
        fill: t.color('text'),
        lineHeight: 1.15,
      }),
      text(t.copy('highlight'), 450, 674, 580, {
        fontFamily: t.font('heading'),
        fontSize: 62,
        fontWeight: 800,
        fill: t.color('accent'),
      }),
      cta(t.copy('button'), t.font('body'), 450, 800, {
        fill: t.color('accent'),
        color: t.shade('background', MERIDIAN.deep),
        dot: t.shade('background', MERIDIAN.deep),
        dotIcon: t.color('accent'),
      }),
    ],
  );

export const doorBefore = doorHanger({
  background: [MERIDIAN.mid, MERIDIAN.deep],
  hanger: MERIDIAN.coral,
  top: '20',
  bottom: '27',
  topColor: MERIDIAN.white,
  bottomColor: MERIDIAN.navy,
  lines: 'Leading With',
  highlight: 'Purpose in 2027',
  accent: MERIDIAN.coral,
  button: 'Grow with us',
});

export const doorAfter = doorHanger({
  background: ['#1d5c4f', '#0b2a24'],
  hanger: '#b9f0d8',
  top: 'OP',
  bottom: 'EN',
  topColor: '#0b2a24',
  bottomColor: '#1d8a6f',
  lines: 'Our Door is',
  highlight: 'Open to Partners',
  accent: '#b9f0d8',
  button: 'Work with us',
});

const stickySpec = {
  colors: {
    background: {
      value: '#f4f5f7',
      hint: 'Page gradient; its shades color the bottom of the gradient and the translucent tape',
    },
    accent: {
      value: MERIDIAN.coral,
      hint: 'Sticky note; its soft shade is the top of the note gradient',
    },
    primary: { value: MERIDIAN.navy, hint: 'Note text and the tint of the note shadow' },
    text: { value: MERIDIAN.grey, hint: 'Line under the note' },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    note: {
      label: 'Note',
      value: 'Small issues\ngrow fast.\nMake today\nyour turning\npoint.',
    },
    footer: { label: 'Footer line', value: 'Advice from the Meridian desk' },
  },
} as const satisfies ThemeSpec;

export const stickyNote = themed(W, H, stickySpec, (t) => [
  backdrop(H, t.color('background'), t.shade('background', '#cfd5de'), 160),
  rect(230, 330, 620, 620, linear(160, t.shade('accent', MERIDIAN.coralSoft), t.color('accent')), {
    rotation: -4,
    name: 'Sticky note',
    ...shadow(40, 24, t.shade('primary', 'rgba(11,20,38,0.25)')),
  }),
  rect(200, 330, 170, 54, t.shade('background', 'rgba(255,255,255,0.6)'), {
    rotation: -38,
    name: 'Tape',
  }),
  rect(760, 260, 170, 54, t.shade('background', 'rgba(255,255,255,0.6)'), {
    rotation: 34,
    name: 'Tape',
  }),
  text(t.copy('note'), 290, 400, 520, {
    fontFamily: t.font('heading'),
    fontSize: 72,
    fontWeight: 700,
    fill: t.color('primary'),
    lineHeight: 1.12,
    rotation: -4,
  }),
  text(t.copy('footer'), 0, 1140, W, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 500,
    fill: t.color('text'),
    align: 'center',
  }),
]);
