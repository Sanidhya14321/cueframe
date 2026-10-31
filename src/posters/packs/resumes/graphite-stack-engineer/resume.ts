import type { DesignIconName, TextElement } from '@/design';
import { A4_SIZE, avatar, icon, rect, type ThemeSpec, text, themed } from '../../../kit';

export const GRAPHITE = {
  page: '#1e2126',
  panel: '#2e3239',
  deep: '#121418',
  crimson: '#d9434b',
  amber: '#ffc94d',
  tag: '#a3a9b2',
  light: '#e7e9ec',
  white: '#ffffff',
  muted: '#c9ced6',
};

export const FONT = { label: 'Font', value: 'Montserrat' } as const;
export const NAME = { label: 'Name', value: 'Theo Albright' } as const;
export const ROLE = { label: 'Role', value: 'ENGINEER' } as const;
export const CONTACTS = {
  label: 'Contact',
  value: ['theo@albright.dev', '+1 (555) 719 3302', '8 Granite Row'],
} as const;
export const CONTACT_ICONS = ['mail', 'phone', 'map-pin'] as const;

export const writer =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    fontSize: number,
    fill: string,
    style: Partial<TextElement> = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize,
      fontWeight: 400,
      fill,
      lineHeight: 1.45,
      ...style,
    });

export type Writer = ReturnType<typeof writer>;

export const tile = (
  x: number,
  y: number,
  width: number,
  height: number,
  active: boolean,
  fill: string,
  stroke: string,
) =>
  rect(x, y, width, height, fill, {
    stroke,
    strokeWidth: active ? 3 : 0,
    name: 'Panel',
  });

export const roleTag = (
  write: Writer,
  content: string,
  x: number,
  y: number,
  width: number,
  size: number,
  fill: string,
  color: string,
) => [
  rect(x, y, width, size * 2.2, fill, { name: 'Role tag' }),
  write(content, x, y + size * 0.55, width, size, color, {
    fontWeight: 700,
    align: 'center',
    letterSpacing: 1,
    lineHeight: 1.2,
  }),
];

const SECTION_ICONS = ['user', 'graduation-cap', 'briefcase', 'trophy', 'settings'] as const;
const SECTION_SPOTS = [
  [70, 310],
  [70, 810],
  [620, 310],
  [620, 810],
  [70, 1370],
] as const;
const WIN_ICONS = ['share-2', 'gauge', 'users-round', 'workflow'] as const;
const SKILL_ICONS = [
  'code',
  'terminal',
  'database',
  'monitor',
  'smartphone',
  'server-cog',
] as const;
const JOB_X = [620, 901] as const;

const resumeSpec = {
  colors: {
    background: {
      value: GRAPHITE.page,
      hint: 'Page and the words on the role tag and year tiles; its darker shade colors the contact box',
    },
    surface: { value: GRAPHITE.panel, hint: 'Tiles behind every section entry' },
    accent: {
      value: GRAPHITE.amber,
      hint: 'Photo ring, contact and section icons, job, school and achievement titles, job dates and the outline of the first tile in each section',
    },
    secondary: {
      value: GRAPHITE.tag,
      hint: 'Role tag; its lighter shade colors the year tiles',
    },
    text: {
      value: GRAPHITE.white,
      hint: 'Name, contacts, section titles, body copy, degrees, company names, skills and the tile icons; its softer shade colors the job descriptions',
    },
  },
  fonts: { body: FONT },
  copy: {
    name: NAME,
    role: ROLE,
    contacts: CONTACTS,
    sections: {
      label: 'Section title',
      value: ['About Me', 'Education', 'Work Experience', 'Achievements', 'Skills'],
    },
    about: {
      label: 'About me',
      value:
        'I am a software engineer who enjoys building calm, reliable products. I work across the stack in TypeScript, Node and SQL, care deeply about clean interfaces and love turning complex problems into simple tools that real people enjoy using every day.',
    },
    dates: {
      label: 'Date',
      hint: 'Three school years, then the three job periods',
      value: [
        '2022\n2024',
        '2018\n2022',
        '2016\n2018',
        '2023 - Present',
        '2021 - 2023',
        '2020 - 2021',
      ],
    },
    places: {
      label: 'School or company',
      hint: 'Three schools, then the three companies',
      value: [
        'Granite State University',
        'Lakeshore Tech Institute',
        'Northfield College',
        'Quarry Labs',
        'Basalt Systems',
        'Slate Media Group',
      ],
    },
    degrees: {
      label: 'Degree',
      value: ['MSc Computer Science', 'BSc Software Engineering', 'Diploma in Web Systems'],
    },
    jobs: {
      label: 'Job title',
      value: ['Senior Full-Stack Engineer', 'Frontend Engineer', 'Software Engineer Intern'],
    },
    achievements: {
      label: 'Achievement',
      value: [
        'Realtime Collaboration',
        'Performance Push',
        'Mentoring Program',
        'Release Automation',
      ],
    },
    details: {
      label: 'Detail',
      hint: 'Three job descriptions, then the four achievement descriptions',
      value: [
        'Leads the realtime editor team and its public API.',
        'Built the design system and billing dashboard.',
        'Prototyped internal tools and landing pages in React.',
        'Shipped live cursors and comments used by 30k teams.',
        'Cut API response times in half with smarter caching.',
        'Coached six junior engineers through their first year.',
        'Built CI pipelines that made deploys a one click job.',
      ],
    },
    skills: {
      label: 'Skill',
      value: [
        'HTML & CSS',
        'TypeScript',
        'SQL & Data',
        'Responsive UI',
        'Mobile Apps',
        'REST APIs',
      ],
    },
  },
} as const satisfies ThemeSpec;

const { width: W, height: H } = A4_SIZE;

export const engineerResume = themed(W, H, resumeSpec, (t) => {
  const write = writer(t.font('body'));
  const accent = t.color('accent');
  const ink = t.color('text');
  const muted = t.shade('text', GRAPHITE.muted);
  const panel = (x: number, y: number, width: number, height: number, active: boolean) =>
    tile(x, y, width, height, active, t.color('surface'), accent);
  const sections = t.list('sections');
  const dates = t.list('dates');
  const places = t.list('places');
  const degrees = t.list('degrees');
  const jobs = t.list('jobs');
  const details = t.list('details');
  const heading = (index: number) => {
    const [x, y] = SECTION_SPOTS[index] ?? SECTION_SPOTS[0];
    const glyph: DesignIconName = SECTION_ICONS[index] ?? 'user';
    return [
      icon(glyph, x, y + 2, 30, accent, { strokeWidth: 2 }),
      write(sections[index] ?? '', x + 44, y, 480, 30, ink, { fontWeight: 500 }),
    ];
  };
  const job = (index: number) => {
    const x = JOB_X[index] ?? JOB_X[0];
    return [
      panel(x, 360, 269, 230, x === 620),
      write(jobs[index] ?? '', x + 20, 380, 235, 21, accent, { fontWeight: 700, lineHeight: 1.25 }),
      write(places[index + 3] ?? '', x + 20, 444, 235, 18, ink, { fontWeight: 600 }),
      write(dates[index + 3] ?? '', x + 20, 474, 235, 18, accent),
      write(details[index] ?? '', x + 20, 510, 235, 17, muted, { lineHeight: 1.4 }),
    ];
  };
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    avatar('man-portrait-1', 150, 160, 82, accent),
    write(t.copy('name'), 260, 118, 420, 50, ink, { fontWeight: 500, lineHeight: 1.2 }),
    roleTag(write, t.copy('role'), 264, 190, 170, 18, t.color('secondary'), t.color('background')),
    rect(860, 60, 320, 200, t.shade('background', GRAPHITE.deep), { name: 'Contact box' }),
    t
      .list('contacts')
      .map((value, index) => [
        icon(CONTACT_ICONS[index] ?? 'mail', 888, 92 + index * 52, 28, accent, { strokeWidth: 2 }),
        write(value, 930, 93 + index * 52, 240, 20, ink, { fontWeight: 500 }),
      ]),
    heading(0),
    panel(70, 360, 490, 400, false),
    write(t.copy('about'), 100, 392, 430, 24, ink, { lineHeight: 1.6 }),
    heading(1),
    degrees.map((degree, index) => {
      const y = 860 + index * 116;
      return [
        panel(70, y, 490, 100, index === 0),
        rect(88, y + 16, 68, 68, t.shade('secondary', GRAPHITE.light), { name: 'Year tile' }),
        write(dates[index] ?? '', 88, y + 22, 68, 16, t.color('background'), {
          fontWeight: 700,
          align: 'center',
          lineHeight: 1.3,
        }),
        write(places[index] ?? '', 176, y + 18, 370, 21, accent, { fontWeight: 700 }),
        write(degree, 176, y + 54, 370, 18, ink),
      ];
    }),
    heading(2),
    job(0),
    job(1),
    panel(620, 610, 550, 150, false),
    write(jobs[2] ?? '', 640, 630, 330, 21, accent, { fontWeight: 700 }),
    write(dates[5] ?? '', 950, 632, 200, 18, accent, { align: 'right' }),
    write(places[5] ?? '', 640, 666, 500, 18, ink, { fontWeight: 600 }),
    write(details[2] ?? '', 640, 700, 510, 17, muted),
    heading(3),
    t.list('achievements').map((title, index) => {
      const y = 860 + index * 116;
      return [
        panel(620, y, 96, 96, index === 0),
        icon(WIN_ICONS[index] ?? 'gauge', 646, y + 26, 44, ink, { strokeWidth: 1.8 }),
        write(title, 736, y + 6, 440, 21, accent, { fontWeight: 700 }),
        write(details[index + 3] ?? '', 736, y + 40, 430, 18, ink, { lineHeight: 1.4 }),
      ];
    }),
    heading(4),
    t.list('skills').map((label, index) => {
      const x = 70 + index * 185;
      return [
        panel(x, 1420, 175, 200, index === 0),
        icon(SKILL_ICONS[index] ?? 'code', x + 115, 1440, 40, ink, { strokeWidth: 1.8 }),
        write(label, x, 1570, 175, 18, ink, { fontWeight: 600, align: 'center' }),
      ];
    }),
  ];
});
