import { linear } from '@/design';
import { circle, icon, line, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  appTile,
  FONTS,
  identity,
  kicker,
  LETTER,
  stars,
  statusBar,
  TIDE,
  tileFills,
} from './parts';

const SKILL_ICONS = ['palette', 'layers', 'search', 'sparkles'] as const;
const SKILL_LEVELS = [5, 4, 4, 5];
const JOB_COUNT = 3;
const REFERENCE_COUNT = 2;

const mainSpec = {
  colors: {
    background: { value: TIDE.paper, hint: 'Page and the references card' },
    surface: {
      value: TIDE.card,
      hint: 'About card, job year pills and reference icon discs; its deeper tint fills the skills and education cards',
    },
    primary: {
      value: TIDE.teal,
      hint: 'Job title, contact bubbles, filled stars, education and job tiles, Read more and the battery; its shades color the card outlines, year pills and reference icons',
    },
    accent: {
      value: TIDE.tile,
      hint: 'Colorful skill tiles and the green end of the job tiles; each is a shade of this color',
    },
    secondary: { value: TIDE.white, hint: 'Contact text, tile icons and the education year' },
    text: {
      value: TIDE.ink,
      hint: 'Status bar, name, headings and entries; its lighter shades color the section labels, about text, details, empty stars, rules and the references card outline',
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
    contacts: {
      label: 'Contact',
      value: ['(555) 210-4477', 'maya@linden.studio', '48 Harbor Lane'],
    },
    labels: {
      label: 'Section label',
      value: ['Expertise', 'Profile', 'Details', 'Highlights', 'Connections'],
    },
    titles: {
      label: 'Section title',
      value: [
        "Let's Connect  >",
        'Skills',
        'About Me',
        'Education',
        'Work Experience',
        'References',
      ],
    },
    skills: {
      label: 'Skill',
      value: ['Interface Design', 'Prototyping', 'User Research', 'Motion Design'],
    },
    about: {
      label: 'About',
      value:
        'I design calm, useful mobile products. Eight years of turning messy research into clear flows, friendly interfaces and design systems that teams love to build with.',
    },
    more: { label: 'Read more link', value: 'Read more  >' },
    entries: {
      label: 'Entry',
      hint: 'School, jobs, then references',
      value: [
        'Westbrook Institute of Design',
        'Senior Product Designer',
        'Product Designer',
        'UI Designer',
        'Dana Ortiz',
        'Leo Hartmann',
      ],
    },
    details: {
      label: 'Entry detail',
      hint: 'Degree, employers, then reference roles and phones',
      value: [
        'BA, Interaction Design',
        'Harbor Health',
        'Quillwork Apps',
        'Brightloop Labs',
        'Design Director, Harbor\n(555) 310-2290',
        'CPO, Quillwork Apps\n(555) 784-1123',
      ],
    },
    years: { label: 'Years', value: ['2013-2017', '2022-2026', '2019-2022', '2017-2019'] },
  },
} as const satisfies ThemeSpec;

export const resumeMain = themed(LETTER.width, LETTER.height, mainSpec, (t) => {
  const [status = '', time = ''] = t.list('status');
  const [expertise = '', profile = '', details = '', highlights = '', connections = ''] =
    t.list('labels');
  const [connect = '', skills = '', about = '', education = '', work = '', references = ''] =
    t.list('titles');
  const entries = t.list('entries');
  const entryDetails = t.list('details');
  const years = t.list('years');
  const tiles = tileFills(t);
  const body = t.font('body');
  const yearPill = (label: string, x: number, y: number, fill: string, color: string) => [
    rect(x, y, 150, 40, fill, { cornerRadius: 20, name: 'Year pill' }),
    text(label, x, y + 8, 150, {
      fontFamily: body,
      fontSize: 20,
      fontWeight: 700,
      fill: color,
      align: 'center',
    }),
  ];
  const contactBubble = (label: string, x: number, y: number) => [
    rect(x, y, 380, 56, linear(90, t.color('primary'), t.shade('primary', '#16b8a0')), {
      cornerRadius: 16,
      name: 'Contact',
    }),
    text(label, x + 24, y + 14, 340, {
      fontFamily: body,
      fontSize: 24,
      fontWeight: 600,
      fill: t.color('secondary'),
    }),
  ];
  const tintCard = (
    x: number,
    y: number,
    width: number,
    height: number,
    cornerRadius: number,
    name: string,
  ) =>
    rect(x, y, width, height, t.shade('surface', TIDE.tint), {
      cornerRadius,
      stroke: t.shade('primary', TIDE.edge),
      strokeWidth: 3,
      name,
    });
  return [
    rect(0, 0, LETTER.width, LETTER.height, t.color('background'), { name: 'Background' }),
    statusBar(t, LETTER.width, status, time),
    identity(t, 60, 110, t.list('name'), t.copy('role')),
    text(connect, 60, 800, 400, {
      fontFamily: t.font('heading'),
      fontSize: 34,
      fontWeight: 700,
      fill: t.color('text'),
    }),
    t.list('contacts').map((contact, index) => contactBubble(contact, 60, 860 + index * 70)),
    tintCard(60, 1090, 380, 500, 24, 'Skills card'),
    kicker(t, expertise, skills, 90, 1115, 330),
    t.list('skills').map((skill, index) => [
      appTile(
        90,
        1230 + index * 88,
        64,
        tiles[index] ?? TIDE.teal,
        SKILL_ICONS[index] ?? 'palette',
        t.color('secondary'),
      ),
      text(skill, 172, 1232 + index * 88, 260, {
        fontFamily: body,
        fontSize: 22,
        fontWeight: 700,
        fill: t.color('text'),
      }),
      stars(t, 172, 1268 + index * 88, SKILL_LEVELS[index] ?? 5),
    ]),
    rect(480, 110, 735, 360, t.color('surface'), { cornerRadius: 28, name: 'About card' }),
    kicker(t, profile, about, 515, 140),
    text(t.copy('about'), 515, 230, 665, {
      fontFamily: body,
      fontSize: 25,
      fontWeight: 400,
      fill: t.shade('text', TIDE.muted),
      lineHeight: 1.45,
    }),
    text(t.copy('more'), 900, 420, 280, {
      fontFamily: body,
      fontSize: 22,
      fontWeight: 600,
      fill: t.color('primary'),
      align: 'right',
    }),
    tintCard(480, 500, 735, 250, 28, 'Education card'),
    kicker(t, details, education, 515, 530),
    appTile(
      515,
      630,
      76,
      linear(135, t.color('primary'), t.shade('primary', '#0ea5e9')),
      'graduation-cap',
      t.color('secondary'),
    ),
    text(entries[0] ?? '', 610, 636, 420, {
      fontFamily: body,
      fontSize: 26,
      fontWeight: 700,
      fill: t.color('text'),
    }),
    text(entryDetails[0] ?? '', 610, 674, 420, {
      fontFamily: body,
      fontSize: 24,
      fontWeight: 400,
      fill: t.shade('text', TIDE.muted),
    }),
    yearPill(years[0] ?? '', 1040, 650, t.shade('primary', TIDE.deep), t.color('secondary')),
    kicker(t, highlights, work, 495, 790),
    Array.from({ length: JOB_COUNT }, (_, index) => {
      const y = 890 + index * 120;
      const item = index + 1;
      return [
        appTile(
          495,
          y,
          72,
          linear(135, t.shade('accent', '#4ade80'), t.color('primary')),
          'briefcase',
          t.color('secondary'),
        ),
        text(entries[item] ?? '', 590, y + 6, 440, {
          fontFamily: body,
          fontSize: 26,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        text(entryDetails[item] ?? '', 590, y + 42, 440, {
          fontFamily: body,
          fontSize: 22,
          fontWeight: 400,
          fill: t.shade('text', TIDE.muted),
        }),
        yearPill(
          years[item] ?? '',
          1050,
          y + 16,
          t.color('surface'),
          t.shade('primary', TIDE.deep),
        ),
        line(495, y + 96, 720, t.shade('text', TIDE.rule), 2),
      ];
    }),
    rect(480, 1260, 735, 330, t.color('background'), {
      cornerRadius: 28,
      stroke: t.shade('text', TIDE.grey),
      strokeWidth: 3,
      name: 'References card',
    }),
    kicker(t, connections, references, 515, 1290),
    Array.from({ length: REFERENCE_COUNT }, (_, index) => {
      const x = 515 + index * 350;
      const item = index + 1 + JOB_COUNT;
      return [
        circle(x + 26, 1416, 26, t.color('surface')),
        icon('user-round', x + 8, 1398, 36, t.shade('primary', TIDE.deep)),
        text(entries[item] ?? '', x + 66, 1394, 270, {
          fontFamily: body,
          fontSize: 24,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        text(entryDetails[item] ?? '', x + 66, 1430, 270, {
          fontFamily: body,
          fontSize: 19,
          fontWeight: 400,
          fill: t.shade('text', TIDE.muted),
          lineHeight: 1.5,
        }),
      ];
    }),
  ];
});
