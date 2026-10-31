import type { DesignIconName, TextElement } from '@/design';
import {
  A4_SIZE,
  avatar,
  circle,
  icon,
  line,
  poly,
  rect,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const SKY = {
  navy: '#17213d',
  cyan: '#1fb2c9',
  haze: '#e3ebf3',
  paper: '#f7f9fc',
  text: '#1d2740',
  muted: '#5a6478',
  white: '#ffffff',
  soft: '#b9c6db',
};

export const HEADING = { label: 'Heading font', value: 'Poppins' } as const;
export const BODY = { label: 'Body font', value: 'Poppins' } as const;
export const NAME = { label: 'Name', value: ['KAI', 'MORENO'] } as const;
export const ROLE = { label: 'Job title', value: 'FRONTEND DEVELOPER' } as const;

const { width: W, height: H } = A4_SIZE;

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

const resumeSpec = {
  colors: {
    background: {
      value: SKY.paper,
      hint: 'Page; its white tint colors the sidebar headings, sidebar text, header icon discs, the photo ring, dashed dividers and skill pill text',
    },
    surface: {
      value: SKY.haze,
      hint: 'Band behind the name; its blue grey shade colors the timeline and the sidebar notes',
    },
    primary: {
      value: SKY.navy,
      hint: 'Sidebar, the first name, the section headings and the header icons',
    },
    accent: {
      value: SKY.cyan,
      hint: 'Corner wedge, the last name, the timeline highlight, heading dots, contact icons, entry titles and skill pills',
    },
    text: {
      value: SKY.text,
      hint: 'Job title, companies and projects; its grey shade colors the about text, job details and dates',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    name: NAME,
    role: ROLE,
    headings: {
      label: 'Section heading',
      hint: 'Sidebar headings, then main headings',
      value: [
        'CONTACT',
        'REFERENCES',
        'EDUCATION',
        'LANGUAGES',
        'ABOUT ME',
        'WORK EXPERIENCE',
        'SKILLS',
        'SELECTED PROJECTS',
      ],
    },
    contact: {
      label: 'Contact',
      value: ['kai@moreno.dev', '+1 (555) 300 1290', '12 Lisbon Street'],
    },
    titles: {
      label: 'Entry title',
      hint: 'References, then schools, then jobs',
      value: [
        'Lena Hartmann',
        'Omar Velasco',
        'COASTAL TECH UNIVERSITY',
        'RIVERBEND COLLEGE',
        'UI ENGINEER',
        'JUNIOR WEB DEVELOPER',
      ],
    },
    lines: {
      label: 'Entry line',
      hint: 'Reference roles, then degrees, then companies',
      value: [
        'Lead Engineer, Northbeam Labs',
        'Design Director, Fernway',
        'MSc Software Engineering',
        'BSc Computer Science',
        'Northbeam Labs',
        'Fernway Studio',
      ],
    },
    notes: {
      label: 'Entry note',
      hint: 'Reference emails, then school years, then job dates',
      value: [
        'lena@northbeam.io',
        'omar@fernway.co',
        '2020 - 2022',
        '2016 - 2020',
        '2022 - Present',
        '2019 - 2022',
      ],
    },
    languages: { label: 'Languages', value: 'English, Portuguese, Spanish' },
    paragraphs: {
      label: 'Paragraph',
      hint: 'About me, then each job description',
      value: [
        'Frontend developer who loves turning rough ideas into fast, friendly interfaces. I build accessible layouts in TypeScript and React, sweat the small details of every interaction and enjoy pairing with designers to ship products people genuinely like using.',
        'Rebuilt the customer dashboard as a component library, cutting page load time by 40% and shipping a shared design system.',
        'Built responsive marketing sites and landing pages for retail and travel clients using modern CSS.',
      ],
    },
    skills: {
      label: 'Skill',
      value: ['HTML & CSS', 'TYPESCRIPT', 'REACT', 'ACCESSIBILITY', 'GIT WORKFLOW'],
    },
    projects: {
      label: 'Project',
      value: [
        'Tidepool: an open source accessible date picker',
        'Gridline: a tiny CSS layout toolkit with 2k stars',
      ],
    },
  },
} as const satisfies ThemeSpec;

const CONTACT_ICONS: readonly DesignIconName[] = ['mail', 'phone', 'map-pin'];
const SIDE_ICONS: readonly DesignIconName[] = ['user', 'users', 'graduation-cap', 'languages'];

export const developerResume = themed(W, H, resumeSpec, (t) => {
  const copy = writer(t.font('body'));
  const heading = writer(t.font('heading'));
  const white = t.shade('background', SKY.white);
  const [first = '', last = ''] = t.list('name');
  const headings = t.list('headings');
  const titles = t.list('titles');
  const lines = t.list('lines');
  const notes = t.list('notes');
  const [about = '', ...details] = t.list('paragraphs');
  const sideHeader = (index: number, y: number) => [
    circle(76, y + 22, 24, white),
    icon(SIDE_ICONS[index] ?? 'user', 62, y + 8, 28, t.color('primary'), { strokeWidth: 2.2 }),
    heading(headings[index] ?? '', 118, y + 2, 300, 30, white, {
      fontWeight: 700,
      letterSpacing: 1,
    }),
  ];
  const divider = (y: number) =>
    line(52, y, 340, t.shade('background', 'rgba(255,255,255,0.45)'), 2, {
      dashed: true,
      name: 'Divider',
    });
  const mainHeader = (index: number, y: number) => [
    circle(503, y + 24, 14, t.color('accent')),
    heading(headings[index] ?? '', 548, y, 600, 34, t.color('primary'), {
      fontWeight: 700,
      letterSpacing: 1,
    }),
  ];
  const sideEntry = (index: number, y: number, size: number) => [
    copy(titles[index] ?? '', 56, y, 360, size, t.color('accent'), { fontWeight: 700 }),
    copy(lines[index] ?? '', 56, y + 36, 360, 20, white),
    copy(notes[index] ?? '', 56, y + 68, 360, 20, t.shade('surface', SKY.soft)),
  ];
  const job = (index: number, y: number) => [
    copy(titles[index + 4] ?? '', 548, y, 420, 25, t.color('accent'), {
      fontWeight: 700,
      letterSpacing: 1,
    }),
    copy(notes[index + 4] ?? '', 900, y + 2, 270, 22, t.shade('text', SKY.muted), {
      align: 'right',
    }),
    copy(lines[index + 4] ?? '', 548, y + 40, 600, 23, t.color('text'), { fontWeight: 600 }),
    copy(details[index] ?? '', 548, y + 80, 620, 21, t.shade('text', SKY.muted)),
  ];
  const skills = t.list('skills');
  const placed: { label: string; x: number; y: number; width: number }[] = [];
  let cursorX = 548;
  let cursorY = 1400;
  for (const label of skills) {
    const width = label.length * 12.4 + 48;
    if (cursorX + width > 1180) {
      cursorX = 548;
      cursorY += 70;
    }
    placed.push({ label, x: cursorX, y: cursorY, width });
    cursorX += width + 16;
  }
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    rect(0, 0, 440, H, t.color('primary'), { name: 'Sidebar' }),
    poly(
      [
        [0, 0],
        [440, 0],
        [0, 520],
      ],
      t.color('accent'),
      { name: 'Corner wedge' },
    ),
    avatar('man-portrait-3', 220, 250, 140, white),
    rect(440, 90, 800, 290, t.color('surface'), { name: 'Name band' }),
    rect(500, 0, 6, H, t.shade('surface', SKY.soft), { name: 'Timeline' }),
    rect(500, 110, 6, 250, t.color('accent'), { name: 'Timeline accent' }),
    heading(first, 548, 140, 200, 84, t.color('primary'), { fontWeight: 700, lineHeight: 1.1 }),
    heading(last, 714, 140, 480, 84, t.color('accent'), { fontWeight: 700, lineHeight: 1.1 }),
    copy(t.copy('role'), 552, 258, 600, 32, t.color('text'), { letterSpacing: 4 }),
    sideHeader(0, 470),
    t.list('contact').map((value, index) => [
      icon(CONTACT_ICONS[index] ?? 'mail', 56, 548 + index * 54, 28, t.color('accent'), {
        strokeWidth: 2,
      }),
      copy(value, 100, 547 + index * 54, 320, 22, white),
    ]),
    divider(724),
    sideHeader(1, 762),
    [0, 1].map((index) => sideEntry(index, 836 + index * 150, 23)),
    divider(1130),
    sideHeader(2, 1168),
    [2, 3].map((index) => sideEntry(index, 1244 + (index - 2) * 150, 22)),
    divider(1560),
    sideHeader(3, 1598),
    copy(t.copy('languages'), 56, 1668, 360, 20, white),
    mainHeader(4, 450),
    copy(about, 548, 512, 620, 23, t.shade('text', SKY.muted)),
    mainHeader(5, 790),
    job(0, 862),
    job(1, 1092),
    mainHeader(6, 1330),
    placed.map((item) => [
      rect(item.x, item.y, item.width, 50, t.color('accent'), {
        cornerRadius: 25,
        name: `${item.label} pill`,
      }),
      copy(item.label, item.x, item.y + 12, item.width, 20, white, {
        fontWeight: 600,
        align: 'center',
        lineHeight: 1.2,
      }),
    ]),
    mainHeader(7, 1570),
    t
      .list('projects')
      .map((project, index) =>
        copy(project, 548, 1636 + index * 44, 620, 22, t.color('text'), { fontWeight: 600 }),
      ),
  ];
});
