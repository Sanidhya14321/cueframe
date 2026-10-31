import { A4_SIZE, circle, icon, photo, rect, type ThemeSpec, themed } from '../../../kit';
import { copy, marble, NAME, outline, POPPINS, ROSE } from './art';

const { width: W, height: H } = A4_SIZE;
const PANEL = 700;
const PANEL_WIDTH = W - PANEL;

const LEVELS = [7, 6, 8, 7] as const;

const resumeSpec = {
  colors: {
    background: {
      value: ROSE.blush,
      hint: 'Page, photo frame lines, panel dividers, filled skill bars and the degree; its translucent shade colors the marble veins',
    },
    primary: {
      value: ROSE.navy,
      hint: 'Marble panel, name, job title, contact icons and details, Working Experience heading, job lines, bullets, footer note, corner block and edge bar; its shades color the top of the marble and the divider',
    },
    text: { value: ROSE.ink, hint: 'Summary and job notes' },
    surface: {
      value: ROSE.white,
      hint: 'Education, skills and awards text on the marble; its translucent shades color the empty skill bars and the marble glints',
    },
  },
  fonts: {
    heading: { label: 'Heading font', value: 'Poppins' },
    body: POPPINS,
  },
  copy: {
    ...NAME,
    summary: {
      label: 'Summary',
      value:
        'I help families and first-time buyers find a place that truly feels like home. With a sharp read on local market trends, calm negotiation and genuine care for every client, I make each step of buying or selling clear, simple and even enjoyable.',
    },
    contacts: { label: 'Contact', value: ['amara@quinnhomes.co', '+1 (555) 482 1170'] },
    sections: {
      label: 'Section heading',
      value: ['WORKING EXPERIENCE', 'EDUCATION', 'SKILLS', 'AWARDS'],
    },
    jobs: {
      label: 'Job',
      value: ['HARBORVIEW REALTY  |  2021 - NOW', 'MAPLE & STONE HOMES  |  2017 - 2021'],
    },
    notes: {
      label: 'Job notes',
      value: [
        'Guided more than 60 households through smooth purchases and sales, regularly beating quarterly targets.\n\nPlanned listing photography, video tours and social campaigns that shortened time on market.',
        'Supported senior agents with listings, viewings and open house events across the coast.\n\nPrepared market reports and pricing guides that helped clients make confident decisions.',
      ],
    },
    education: {
      label: 'Education line',
      value: ['Bachelor of Property Studies', 'Westbrook University', '2013 - 2017'],
    },
    skills: {
      label: 'Skill',
      value: ['Market Analysis', 'Negotiation', 'Open House Events', 'Client Relations'],
    },
    awards: { label: 'Awards', value: 'Top Listing Agent 2025\nClient Choice Award 2024' },
    footer: { label: 'Footer note', value: 'References available on request' },
  },
} as const satisfies ThemeSpec;

export const realtorResume = themed(W, H, resumeSpec, (t) => {
  const heading = t.font('heading');
  const body = t.font('body');
  const navy = t.color('primary');
  const white = t.color('surface');
  const blush = t.color('background');
  const clear = t.shade('background', ROSE.clear);
  const [experience = '', education = '', skills = '', awards = ''] = t.list('sections');
  const [email = '', phone = ''] = t.list('contacts');
  const [degree = '', school = '', years = ''] = t.list('education');
  const notes = t.list('notes');
  const centered = (content: string, y: number, size: number, fill: string, weight = 400) =>
    copy(content, PANEL, y, PANEL_WIDTH, size, fill, body, {
      fontWeight: weight,
      align: 'center',
    });
  const panelHeading = (content: string, y: number) =>
    copy(content, PANEL, y, PANEL_WIDTH, 34, white, heading, { fontWeight: 700, align: 'center' });
  return [
    rect(0, 0, W, H, blush, { name: 'Background' }),
    marble(PANEL, 0, PANEL_WIDTH, H, {
      top: t.shade('primary', ROSE.marble),
      base: navy,
      vein: t.shade('background', ROSE.vein),
      glint: t.shade('surface', ROSE.glint),
      clear,
    }),
    rect(60, 60, 46, 46, navy, { name: 'Corner block' }),
    rect(0, 1010, 22, 600, navy, { name: 'Edge bar' }),
    copy(t.copy('first'), 112, 120, 560, 92, navy, heading, { fontWeight: 300, lineHeight: 1.05 }),
    copy(t.copy('last'), 112, 214, 560, 116, navy, heading, { fontWeight: 800, lineHeight: 1.05 }),
    copy(t.copy('role'), 116, 368, 560, 28, navy, heading, { fontWeight: 700, letterSpacing: 2 }),
    copy(t.copy('summary'), 116, 430, 540, 22, t.color('text'), body),
    icon('mail', 116, 728, 26, navy, { strokeWidth: 2 }),
    copy(email, 152, 727, 270, 20, navy, body),
    icon('phone', 436, 728, 26, navy, { strokeWidth: 2 }),
    copy(phone, 472, 727, 200, 20, navy, body),
    rect(116, 790, 540, 2, t.shade('primary', 'rgba(19,32,58,0.45)'), { name: 'Divider' }),
    copy(experience, 116, 830, 560, 34, navy, heading, { fontWeight: 700 }),
    t.list('jobs').map((job, index) => {
      const y = index === 0 ? 900 : 1230;
      return [
        circle(122, y + 15, 6, navy),
        copy(job, 140, y, 520, 22, navy, heading, { fontWeight: 700, letterSpacing: 0.5 }),
        copy(notes[index] ?? '', 140, y + 42, 520, 20, t.color('text'), body, {
          lineHeight: 1.45,
        }),
      ];
    }),
    copy(t.copy('footer'), 116, 1620, 540, 20, navy, body, { fontWeight: 500, italic: true }),
    outline(830, 44, 370, 540, blush, clear, 3),
    outline(806, 70, 380, 540, blush, clear, 4),
    photo('woman-portrait-1', 762, 110, 400, 540, { cornerRadius: 18 }),
    panelHeading(education, 720),
    centered(degree, 784, 22, blush, 600),
    centered(school, 820, 22, white, 700),
    centered(years, 856, 20, white),
    rect(760, 920, 420, 3, blush, { name: 'Panel divider' }),
    panelHeading(skills, 956),
    t.list('skills').map((label, index) => {
      const y = 1030 + index * 92;
      const level = LEVELS[index] ?? 0;
      return [
        copy(label, 770, y, 420, 22, white, body),
        Array.from({ length: 8 }, (_, segment) =>
          rect(
            770 + segment * 51,
            y + 42,
            43,
            8,
            segment < level ? blush : t.shade('surface', ROSE.soft),
            {
              cornerRadius: 4,
              name: 'Skill segment',
            },
          ),
        ),
      ];
    }),
    rect(760, 1420, 420, 3, blush, { name: 'Panel divider' }),
    panelHeading(awards, 1456),
    centered(t.copy('awards'), 1520, 21, white),
  ];
});
