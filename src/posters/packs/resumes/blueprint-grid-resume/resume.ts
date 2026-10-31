import { line, star, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  CONTACT_LABELS,
  CONTACT_VALUES,
  contactEntry,
  GRID,
  gridColors,
  gridPaper,
  HEAD,
  LETTER,
  monoPhoto,
  NAME,
  ROLE,
  roleLine,
  selectionName,
} from './grid';

const SKILL_LEVELS = [5, 5, 4, 4] as const;

const resumeSpec = {
  colors: {
    ...gridColors(
      'Name, its box, role, section headings, employers, schools, skills, contact labels and divider lines',
      'Job and degree titles, filled skill stars, contact icons and the rings of the corner handles',
    ),
    text: {
      value: GRID.muted,
      hint: 'Job and course descriptions and contact details; its light tint colors the empty skill stars',
    },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    name: NAME,
    role: ROLE,
    sections: { label: 'Section heading', value: ['WORK EXPERIENCE', 'SKILLS', 'EDUCATION'] },
    jobTitles: {
      label: 'Position',
      value: ['Senior Brand Designer', 'Visual Designer', 'Junior Designer'],
    },
    jobPlaces: {
      label: 'Employer and years',
      value: [
        'Kestrel Studio / 2023-Present',
        'Fieldnote Agency / 2020-2023',
        'Pressmark Print / 2018-2020',
      ],
    },
    jobDetails: {
      label: 'Job description',
      value: [
        'Lead identity projects for food and travel brands, from strategy to launch.',
        'Designed campaigns, social systems and packaging for twelve clients.',
        'Prepared print-ready files and art directed catalogue photo shoots.',
      ],
    },
    skills: {
      label: 'Skill',
      value: ['BRAND STRATEGY', 'TYPOGRAPHY', 'MOTION GRAPHICS', 'PACKAGING'],
    },
    degrees: { label: 'Degree', value: ['MA Graphic Design', 'BA Visual Arts'] },
    schools: {
      label: 'School and year',
      value: ['Northgate University / 2018', 'Eastlake College / 2016'],
    },
    courses: {
      label: 'Course description',
      value: [
        'Thesis on modular type systems for small brands.',
        'Focus on illustration, layout and print craft.',
      ],
    },
    contactLabels: CONTACT_LABELS,
    contactValues: CONTACT_VALUES,
  },
} as const satisfies ThemeSpec;

export const resume = themed(LETTER.width, LETTER.height, resumeSpec, (t) => {
  const [work = '', skillsTitle = '', education = ''] = t.list('sections');
  const muted = t.color('text');
  const entry = (
    title: string,
    place: string,
    body: string,
    x: number,
    y: number,
    width: number,
    divider: boolean,
  ) => [
    text(title, x, y, width, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 700,
      fill: t.color('accent'),
    }),
    text(place, x, y + 40, width, {
      fontFamily: t.font('body'),
      fontSize: 23,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
    text(body, x, y + 76, width, {
      fontFamily: t.font('body'),
      fontSize: 22,
      fontWeight: 400,
      fill: muted,
      lineHeight: 1.45,
    }),
    divider ? line(x, y + 160, width, t.color('primary'), 2) : [],
  ];
  const verticalLabel = (label: string, x: number, bottom: number) =>
    text(label, x, bottom, 900, {
      fontFamily: t.font('heading'),
      fontSize: 66,
      fontWeight: 800,
      fill: t.color('primary'),
      rotation: -90,
      lineHeight: 1,
    });
  const jobPlaces = t.list('jobPlaces');
  const jobDetails = t.list('jobDetails');
  const schools = t.list('schools');
  const courses = t.list('courses');
  const labels = t.list('contactLabels');
  const values = t.list('contactValues');
  return [
    gridPaper(t, LETTER.width, LETTER.height),
    selectionName(t, t.copy('name'), 220, 90, 835, 170, 104),
    roleLine(t, t.copy('role'), 0, 292, LETTER.width, 44, 3),
    verticalLabel(work, 80, 960),
    t
      .list('jobTitles')
      .map((title, index) =>
        entry(
          title,
          jobPlaces[index] ?? '',
          jobDetails[index] ?? '',
          190,
          390 + index * 196,
          520,
          index < 2,
        ),
      ),
    monoPhoto('man-portrait-3', 760, 390, 430, 560),
    text(skillsTitle, 80, 1000, 600, {
      fontFamily: t.font('heading'),
      fontSize: 84,
      fontWeight: 800,
      fill: t.color('primary'),
      lineHeight: 1,
    }),
    t.list('skills').map((skill, index) => {
      const y = 1130 + index * 76;
      const level = SKILL_LEVELS[index] ?? 0;
      return [
        text(skill, 80, y, 380, {
          fontFamily: t.font('body'),
          fontSize: 24,
          fontWeight: 700,
          fill: t.color('primary'),
        }),
        Array.from({ length: 5 }, (_, starIndex) =>
          star(
            5,
            440 + starIndex * 42,
            y - 2,
            32,
            starIndex < level ? t.color('accent') : t.shade('text', GRID.soft),
            { innerRatio: 0.46 },
          ),
        ),
      ];
    }),
    verticalLabel(education, 680, 1430),
    t
      .list('degrees')
      .map((degree, index) =>
        entry(
          degree,
          schools[index] ?? '',
          courses[index] ?? '',
          770,
          1000 + index * 220,
          420,
          index === 0,
        ),
      ),
    line(80, 1470, 1115, t.color('primary'), 2),
    labels.map((_, index) => {
      const x = 130 + index * 370;
      return contactEntry(
        t,
        muted,
        labels,
        values,
        index,
        { x, y: 1506, iconY: 1512, iconSize: 42, gap: 62, lead: 32 },
        22,
        290,
      );
    }),
  ];
});
