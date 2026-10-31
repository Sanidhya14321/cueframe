import { linear } from '@/design';
import { icon, paint, phone, phoneScreen, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, fade, fonts, glow, HEADING, K, mono, SH, SW } from './theme';

const AUDIT = [
  { icon: 'search', tone: 'white' },
  { icon: 'workflow', tone: 'dark' },
  { icon: 'shield-check', tone: 'lime' },
] as const;

export const auditSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: {
        value: K.black,
        hint: 'Page and the icons and text on the white and lime cards',
      },
      surface: { value: K.panel, hint: 'Middle audit card' },
      primary: { value: K.lime, hint: 'Last audit card and the green wash' },
      text: {
        value: K.white,
        hint: 'Title, the first audit card and the middle card icon, title and outline; its grey shade colors the subtitle and the middle card text',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Process\nAudit' },
      subtitle: { label: 'Subtitle', value: 'Three steps to spot the fastest automation wins.' },
      steps: { label: 'Step', value: ['Audit', 'Sandbox', 'SLA review'] },
      details: {
        label: 'Step detail',
        value: [
          'Map every manual hand-off in one week.',
          'Test agents safely on live-like data.',
          'Lock in uptime and response targets.',
        ],
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const muted = t.shade('text', K.muted);
    const details = t.list('details');
    const fills = { white: t.color('text'), lime: t.color('primary'), dark: t.color('surface') };
    return [
      backdrop(t, 160),
      head(t.copy('title'), 100, 120, 760, 120, t.color('text')),
      body(t.copy('subtitle'), 100, 400, 760, 32, muted),
      t.list('steps').map((step, index) => {
        const card = AUDIT[index] ?? AUDIT[0];
        const x = 100 + index * 290;
        const dark = card.tone === 'dark';
        const ink = dark ? t.color('text') : t.color('background');
        return [
          rect(x, 540, 270, 420, fills[card.tone], {
            name: 'Audit card',
            cornerRadius: 24,
            stroke: dark ? t.shade('text', K.line) : K.line,
            strokeWidth: dark ? 2 : 0,
          }),
          icon(card.icon, x + 32, 576, 60, ink, { strokeWidth: 2 }),
          head(step, x + 32, 700, 220, 38, ink),
          body(details[index] ?? '', x + 32, 764, 210, 26, dark ? muted : t.color('background')),
        ];
      }),
      mono('laptop-analytics', 1000, 100, 820, 880, 32),
    ];
  },
);

export const assistSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: {
        value: K.black,
        hint: 'Page, the phone body and the agent card on the phone',
      },
      primary: {
        value: K.lime,
        hint: 'Ship, the phone screen gradient, the progress bar and sparkles, the glow and the green wash',
      },
      text: {
        value: K.white,
        hint: 'Plan, Build and the lines and task rows on the phone',
      },
    },
    fonts: { heading: HEADING },
    copy: {
      lines: { label: 'Headline line', value: ['Plan.', 'Build.', 'Ship.'] },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head } = fonts({ font: () => t.font('heading') });
    const screen = phoneScreen(300);
    const [plan = '', build = '', ship = ''] = t.list('lines');
    const big = { align: 'center', lineHeight: 1 } as const;
    return [
      backdrop(t),
      glow(t, 960, 880, 200, 0.45),
      head(plan, 0, 90, SW, 250, t.color('text'), big),
      head(build, 0, 380, SW, 250, fade(t, 'rgba(255,255,255,0.85)'), big),
      head(ship, 0, 670, SW, 250, t.color('primary'), big),
      paint(
        [
          phone(1010, 220, 300, {
            screen: linear(
              180,
              t.shade('primary', '#e6fdb0'),
              t.color('primary'),
              t.shade('primary', K.olive),
            ),
            rotation: 10,
            content: [
              rect(24, 110, screen.width - 48, 150, t.shade('background', 'rgba(6,8,5,0.85)'), {
                name: 'Agent card',
                cornerRadius: 20,
              }),
              icon('sparkles', 44, 130, 44, t.color('primary')),
              rect(100, 140, 120, 12, t.color('text'), { name: 'Line', cornerRadius: 6 }),
              rect(100, 166, 90, 12, t.shade('text', 'rgba(255,255,255,0.5)'), {
                name: 'Line',
                cornerRadius: 6,
              }),
              rect(44, 200, screen.width - 88, 34, t.color('primary'), {
                name: 'Progress',
                cornerRadius: 17,
              }),
              [0, 1, 2].map((row) =>
                rect(
                  24,
                  300 + row * 80,
                  screen.width - 48,
                  60,
                  t.shade('text', 'rgba(255,255,255,0.55)'),
                  {
                    name: 'Task row',
                    cornerRadius: 16,
                  },
                ),
              ),
            ],
          }),
        ],
        { '#0b0b0f': t.shade('background', '#0b0b0f') },
      ),
    ];
  },
);
