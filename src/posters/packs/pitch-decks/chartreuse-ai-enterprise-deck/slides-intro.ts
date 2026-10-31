import { linear } from '@/design';
import { arrow, circle, icon, rect, shadow, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, fonts, glow, HEADING, K, mono, SH, SW } from './theme';

export const coverSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: K.black, hint: 'Page and the sparkles on the glowing tile' },
      surface: { value: K.panel, hint: 'Row of dark tiles behind the glowing tile' },
      primary: {
        value: K.lime,
        hint: 'Glowing tile, the glow behind it, the green wash and Pitch Deck',
      },
      text: {
        value: K.white,
        hint: 'AI Enterprise and the tile outlines; its grey shade colors the footer line',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'AI Enterprise' },
      subtitle: { label: 'Subtitle', value: 'Pitch Deck' },
      footer: { label: 'Footer', value: 'kestrel.ai  /  Series B  /  2027' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    return [
      backdrop(t),
      glow(t, 960, 390, 380, 0.4),
      Array.from({ length: 7 }, (_, index) =>
        index === 3
          ? []
          : rect(
              240 + index * 210,
              300,
              180,
              180,
              linear(180, t.shade('surface', '#1f261b'), t.shade('surface', '#0d100b')),
              {
                name: 'Tile',
                cornerRadius: 36,
                stroke: t.shade('text', K.line),
                strokeWidth: 2,
              },
            ),
      ),
      rect(
        840,
        270,
        240,
        240,
        linear(
          160,
          t.shade('primary', '#d8fb7a'),
          t.color('primary'),
          t.shade('primary', K.limeDeep),
        ),
        {
          name: 'Glowing tile',
          cornerRadius: 48,
          ...shadow(80, 0, t.shade('primary', 'rgba(184,245,49,0.65)')),
        },
      ),
      icon('sparkles', 900, 330, 120, t.color('background'), { strokeWidth: 2.2 }),
      head(t.copy('title'), 0, 620, SW, 140, t.color('text'), { align: 'center' }),
      head(t.copy('subtitle'), 0, 780, SW, 140, t.color('primary'), { align: 'center' }),
      body(t.copy('footer'), 0, 960, SW, 30, t.shade('text', K.muted), {
        align: 'center',
        letterSpacing: 2,
      }),
    ];
  },
);

export const contentsSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: K.black, hint: 'Page and the bullseye center' },
      surface: {
        value: K.panel,
        hint: 'Target rings; its lighter shade colors every other ring',
      },
      primary: {
        value: K.lime,
        hint: 'Bullseye, the dart tip, the glow, Contents and the chapter numbers',
      },
      text: { value: K.white, hint: 'Table of, the dart, the ring outlines and the chapter names' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Table of' },
      subtitle: { label: 'Highlighted title', value: 'Contents' },
      numbers: {
        label: 'Chapter number',
        value: ['01', '02', '03', '04', '05', '06', '07', '08'],
      },
      chapters: {
        label: 'Chapter',
        value: [
          'Introduction',
          'Our team',
          'Platform',
          'Pricing',
          'Key metrics',
          'Roadmap',
          'Financials',
          'Next steps',
        ],
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const numbers = t.list('numbers');
    return [
      backdrop(t, 200),
      [380, 300, 220, 140].map((radius, index) =>
        circle(
          480,
          600,
          radius,
          index % 2 === 0 ? t.shade('surface', K.panelSoft) : t.color('surface'),
          { stroke: t.shade('text', K.line), strokeWidth: 2 },
        ),
      ),
      glow(t, 480, 600, 150, 0.6),
      circle(480, 600, 64, t.color('primary')),
      circle(480, 600, 22, t.color('background')),
      arrow(240, 330, 340, t.color('text'), 10, { name: 'Dart', rotation: 48.4 }),
      circle(240, 330, 16, t.color('primary')),
      head(t.copy('title'), 1000, 130, 800, 110, t.color('text')),
      head(t.copy('subtitle'), 1000, 250, 800, 110, t.color('primary')),
      t.list('chapters').map((chapter, index) => {
        const x = 1000 + Math.floor(index / 4) * 440;
        const y = 470 + (index % 4) * 120;
        return [
          head(numbers[index] ?? '', x, y, 100, 52, t.color('primary')),
          body(chapter, x + 100, y + 10, 320, 34, t.color('text')),
        ];
      }),
    ];
  },
);

export const empoweringSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: {
        value: K.black,
        hint: 'Page and the text on the stat and focus cards; its grey shade colors the focus card text',
      },
      primary: { value: K.lime, hint: 'Stat card and the green wash' },
      text: {
        value: K.white,
        hint: 'Powering Modern Teams and the focus card; its grey shade colors the paragraph',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      stat: { label: 'Stat', value: '180+' },
      statLabel: { label: 'Stat label', value: 'Enterprise clients\nrunning on Kestrel' },
      title: { label: 'Title', value: 'Powering\nModern Teams' },
      paragraph: {
        label: 'Paragraph',
        value:
          'We help large organisations move from pilots to production, with secure models, clear governance and results you can measure.',
      },
      focusTitle: { label: 'Card title', value: 'Our core focus' },
      focusText: {
        label: 'Card text',
        value: 'Model governance, secure infrastructure and measurable outcomes for every rollout.',
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    return [
      backdrop(t, 160),
      mono('workspace-1', 100, 100, 760, 660, 32),
      rect(100, 640, 420, 320, t.color('primary'), { name: 'Stat card', cornerRadius: 28 }),
      head(t.copy('stat'), 150, 690, 340, 120, t.color('background')),
      body(t.copy('statLabel'), 150, 840, 340, 30, t.color('background'), { fontWeight: 600 }),
      head(t.copy('title'), 980, 120, 860, 110, t.color('text')),
      body(t.copy('paragraph'), 980, 400, 820, 34, t.shade('text', K.muted)),
      rect(980, 700, 840, 260, t.color('text'), { name: 'Focus card', cornerRadius: 28 }),
      head(t.copy('focusTitle'), 1030, 745, 700, 48, t.color('background')),
      body(t.copy('focusText'), 1030, 820, 740, 30, t.shade('background', K.dim)),
    ];
  },
);
