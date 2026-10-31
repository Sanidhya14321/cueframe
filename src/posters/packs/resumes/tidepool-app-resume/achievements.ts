import type { DesignIconName } from '@/design';
import { icon, line, rect, type ThemeSpec, text, themed } from '../../../kit';
import { FONTS, identity, kicker, LETTER, landscape, statusBar, TIDE, tileFills } from './parts';

const WIN_ICONS: readonly DesignIconName[] = [
  'trending-up',
  'rocket',
  'target',
  'layers',
  'users',
  'chart-line',
];

const PROJECT_COUNT = 3;

const winsSpec = {
  colors: {
    background: { value: TIDE.paper, hint: 'Page' },
    surface: { value: TIDE.card, hint: 'Achievements card and project cards' },
    primary: {
      value: TIDE.teal,
      hint: 'Job title, battery, hills and certificate badges; its shades color the sky, light hills and year pills',
    },
    accent: {
      value: TIDE.tile,
      hint: 'Colorful achievement tiles and the sun; each is a shade of this color',
    },
    secondary: { value: TIDE.white, hint: 'Achievement text and icons, clouds and year pill text' },
    text: {
      value: TIDE.ink,
      hint: 'Status bar, name, headings, project titles and certificates; its lighter shades color the section labels, project summaries and dividers',
    },
  },
  fonts: FONTS,
  copy: {
    status: {
      label: 'Status bar',
      hint: 'Screen title, then the clock',
      value: ['Resume', '9:41 AM'],
    },
    name: { label: 'Name', hint: 'First name, then last name', value: ['Maya', 'Linden'] },
    role: { label: 'Job title', value: 'Product Designer' },
    labels: { label: 'Section label', value: ['Impact', 'Portfolio', 'Learning'] },
    titles: { label: 'Section title', value: ['Achievements', 'Projects', 'Certifications'] },
    wins: {
      label: 'Achievement',
      value: [
        'Cut onboarding\ntime by 35%',
        'Shipped 14 app\nreleases in a year',
        'Raised task\nsuccess to 92%',
        'Built a 120-part\ndesign system',
        'Interviewed over\n60 customers',
        'Grew trial\nsign-ups by 28%',
      ],
    },
    years: { label: 'Project years', value: '2024-2025' },
    projects: {
      label: 'Project',
      value: ['Clinic Booking App', 'Habit Tracker', 'Banking Onboarding'],
    },
    summaries: {
      label: 'Project summary',
      value: [
        'Redesigned booking for 40 clinics, halving drop-off at the payment step.',
        'Built a playful streak system and widgets for a 2M-user wellness app.',
        'Mapped the sign-up journey and shipped a five-step identity flow.',
      ],
    },
    certificates: {
      label: 'Certificate',
      value: [
        'Advanced Interaction\nDesign Certificate',
        'Accessibility\nSpecialist (Level 2)',
        'Mobile Design\nSystems Course',
        'Certified Research\nPractitioner',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const resumeWins = themed(LETTER.width, LETTER.height, winsSpec, (t) => {
  const [status = '', time = ''] = t.list('status');
  const [impact = '', portfolio = '', learning = ''] = t.list('labels');
  const [achievements = '', projectsTitle = '', certifications = ''] = t.list('titles');
  const tiles = tileFills(t);
  const body = t.font('body');
  const projects = t.list('projects');
  const summaries = t.list('summaries');
  return [
    rect(0, 0, LETTER.width, LETTER.height, t.color('background'), { name: 'Background' }),
    statusBar(t, LETTER.width, status, time),
    identity(t, 60, 110, t.list('name'), t.copy('role')),
    rect(480, 110, 735, 760, t.color('surface'), { cornerRadius: 28, name: 'Achievements card' }),
    kicker(t, impact, achievements, 515, 140),
    t.list('wins').map((win, index) => {
      const x = 515 + (index % 2) * 345;
      const y = 250 + Math.floor(index / 2) * 200;
      return [
        rect(x, y, 320, 180, tiles[index] ?? TIDE.teal, {
          cornerRadius: 22,
          name: 'Achievement tile',
        }),
        icon(WIN_ICONS[index] ?? 'target', x + 260, y + 20, 38, t.color('secondary'), {
          strokeWidth: 2.4,
        }),
        text(win, x + 26, y + 92, 280, {
          fontFamily: body,
          fontSize: 25,
          fontWeight: 700,
          fill: t.color('secondary'),
          lineHeight: 1.25,
        }),
      ];
    }),
    kicker(t, portfolio, projectsTitle, 60, 900),
    Array.from({ length: PROJECT_COUNT }, (_, index) => {
      const x = 60 + index * 395;
      return [
        rect(x, 1000, 365, 360, t.color('surface'), { name: 'Project card' }),
        landscape(t, x, 1000, 365, 170),
        rect(x + 200, 1130, 150, 38, t.shade('primary', TIDE.deep), {
          cornerRadius: 19,
          name: 'Year pill',
        }),
        text(t.copy('years'), x + 200, 1138, 150, {
          fontFamily: body,
          fontSize: 19,
          fontWeight: 700,
          fill: t.color('secondary'),
          align: 'center',
        }),
        text(projects[index] ?? '', x + 24, 1192, 320, {
          fontFamily: body,
          fontSize: 26,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        text(summaries[index] ?? '', x + 24, 1236, 320, {
          fontFamily: body,
          fontSize: 21,
          fontWeight: 400,
          fill: t.shade('text', TIDE.muted),
          lineHeight: 1.45,
        }),
      ];
    }),
    kicker(t, learning, certifications, 60, 1395),
    t.list('certificates').map((label, index) => {
      const x = 60 + index * 290;
      return [
        icon('badge-check', x + 115, 1500, 50, t.color('primary'), { strokeWidth: 2.2 }),
        text(label, x, 1566, 280, {
          fontFamily: body,
          fontSize: 19,
          fontWeight: 500,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1.3,
        }),
        index === 0 ? [] : line(x - 5, 1505, 105, t.shade('text', TIDE.grey), 2, { rotation: 90 }),
      ];
    }),
  ];
});
