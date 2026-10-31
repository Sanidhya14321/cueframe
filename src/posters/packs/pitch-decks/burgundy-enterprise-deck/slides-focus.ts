import { linear } from '@/design';
import { checklist, photo, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, CV, fontsOf, glass, HEADING, SH, SW } from './theme';

const focusSpec = {
  colors: {
    background: {
      value: CV.wine,
      hint: 'Slide gradient and the photo tint; its dark shades color the text on the focus card',
    },
    surface: {
      value: CV.white,
      hint: 'Focus card and the glass stat cards; its pink shades are the card gradient end and the glass edges',
    },
    text: { value: CV.white, hint: 'Stat values' },
    secondary: { value: CV.muted, hint: 'Stat labels' },
    accent: { value: CV.berry, hint: 'Check icons on the focus card' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    values: { label: 'Stat value', value: ['$4.8M+', '210+'] },
    labels: { label: 'Stat label', value: ['Revenue managed', 'Enterprise clients'] },
    heading: { label: 'Card title', value: 'Our Core Focus' },
    body: {
      label: 'Card text',
      value: 'Tailored cloud strategy, resilient architecture and security that scales.',
    },
    checks: {
      label: 'Checklist item',
      value: ['Cloud migration', 'Data governance', 'Round-the-clock support'],
    },
  },
} as const satisfies ThemeSpec;

const STAT_X = [90, 450] as const;

export const coreFocusSlide = themed(SW, SH, focusSpec, (t) => {
  const { head, body } = fontsOf(t);
  const labels = t.list('labels');
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    photo('workspace-1', 830, 90, 1000, 900, { cornerRadius: 32 }),
    rect(
      830,
      90,
      1000,
      900,
      linear(
        90,
        t.shade('background', 'rgba(31,10,18,0.55)'),
        t.shade('background', 'rgba(58,16,32,0.1)'),
      ),
      { name: 'Photo tint', cornerRadius: 32 },
    ),
    t.list('values').map((value, index) => {
      const x = STAT_X[index] ?? 0;
      return [
        glass(x, 90, 330, 250, t.shade('surface', CV.glass), t.shade('surface', CV.edge)),
        head(value, x + 36, 130, 280, 70, t.color('text')),
        body(labels[index] ?? '', x + 36, 230, 280, 28, t.color('secondary')),
      ];
    }),
    rect(90, 380, 690, 610, linear(160, t.color('surface'), t.shade('surface', CV.blush)), {
      name: 'Focus card',
      cornerRadius: 32,
    }),
    head(t.copy('heading'), 140, 440, 600, 56, t.shade('background', CV.ink)),
    body(t.copy('body'), 140, 530, 590, 30, t.shade('background', CV.cardText)),
    checklist(t.list('checks'), 140, 720, 590, {
      color: t.shade('background', CV.ink),
      iconColor: t.color('accent'),
      fontSize: 30,
      gap: 76,
      fontFamily: t.font('body'),
    }),
  ];
});
