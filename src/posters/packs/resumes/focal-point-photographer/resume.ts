import type { TextElement } from '@/design';
import {
  A4_SIZE,
  avatar,
  circle,
  icon,
  poly,
  rect,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const FOCAL = {
  ink: '#12343b',
  paper: '#f4efe6',
  amber: '#d9932f',
  text: '#1f2d32',
  muted: '#55666b',
  mist: '#cfe0dc',
  white: '#ffffff',
};

export const BODY = { label: 'Body font', value: 'Poppins' } as const;
export const NAME = { label: 'Name', value: 'NOA WHITFIELD' } as const;
export const CONTACTS = {
  label: 'Contact detail',
  value: ['noa@whitfield.studio', '+1 (555) 214 7788', 'whitfield.studio'],
} as const;
export const CONTACT_ICONS = ['mail', 'phone', 'globe'] as const;

const { width: W, height: H } = A4_SIZE;

export const copy =
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

const bandEdge = (y: number) => 380 + (260 * y) / H;
const column = (y: number) => bandEdge(y) + 64;

const resumeSpec = {
  colors: {
    background: { value: FOCAL.paper, hint: 'Page' },
    primary: {
      value: FOCAL.ink,
      hint: 'Slanted band, the section labels and the timeline dots',
    },
    accent: {
      value: FOCAL.amber,
      hint: 'Band rule, photo ring, name rule, contact icons, the date and school lines and the skill dots',
    },
    surface: {
      value: FOCAL.white,
      hint: 'Name, CONTACT, the contact details and the section label words; its tinted shade colors PHOTOGRAPHER',
    },
    text: {
      value: FOCAL.text,
      hint: 'Job and course titles and the skills; its lighter shade colors the about text and the descriptions',
    },
  },
  fonts: { body: BODY },
  copy: {
    name: { label: 'Name', value: 'NOA\nWHITFIELD' },
    role: { label: 'Role', value: 'PHOTOGRAPHER' },
    contactTitle: { label: 'Contact heading', value: 'CONTACT' },
    contacts: CONTACTS,
    labels: {
      label: 'Section heading',
      value: ['ABOUT ME', 'WORK EXPERIENCE', 'EDUCATION', 'SKILLS'],
    },
    about: {
      label: 'About me',
      value:
        'Photography, to me, is the craft of noticing. I chase soft window light, honest laughter and the small in-between moments, then shape them into images people want to keep for years.',
    },
    titles: {
      label: 'Job or course title',
      value: [
        'Freelance Photographer',
        'Studio Photographer',
        'Wedding Second Shooter',
        'BFA in Photography',
        'Certificate in Digital Imaging',
      ],
    },
    meta: {
      label: 'Dates and school',
      value: [
        '2021 - Now',
        '2018 - 2021',
        '2016 - 2018',
        'Northgate School of Arts  |  2012 - 2016',
        'Harbourline Institute  |  2017',
      ],
    },
    details: {
      label: 'Job or course description',
      value: [
        'Portrait, brand and lifestyle sessions for 250+ clients, from planning to final edit.',
        'Shot product catalogues and campaign imagery for local makers and retailers.',
        'Covered ceremonies, candid moments and family groups alongside lead artists.',
        'Studied lighting, darkroom printing and visual storytelling.',
        'Colour management, retouching and print workflows.',
      ],
    },
    skills: {
      label: 'Skill',
      value: [
        'Lightroom Editing',
        'Studio Lighting',
        'Art Direction',
        'Colour Grading',
        'Client Relations',
        'Shot Planning',
        'Drone Capture',
        'Visual Storytelling',
      ],
    },
  },
} as const satisfies ThemeSpec;

type ResumeTheme = Theme<typeof resumeSpec>;

const label = (t: ResumeTheme, index: number, y: number) => {
  const content = t.list('labels')[index] ?? '';
  const x = column(y);
  const width = content.length * 17.6 + 40;
  return [
    rect(x, y, width, 54, t.color('primary'), { name: `${content} label` }),
    copy(t.font('body'))(content, x + 20, y + 11, width, 26, t.color('surface'), {
      fontWeight: 700,
      letterSpacing: 2,
      lineHeight: 1.2,
    }),
  ];
};

const ENTRY_SPOTS = [
  [462, true],
  [610, true],
  [758, true],
  [1012, false],
  [1182, false],
] as const;

const entry = (t: ResumeTheme, index: number) => {
  const [y, metaInline] = ENTRY_SPOTS[index] ?? [0, true];
  const body = copy(t.font('body'));
  const title = t.list('titles')[index] ?? '';
  const meta = t.list('meta')[index] ?? '';
  const x = column(y) + 4;
  const titleWidth = title.length * 15.6;
  return [
    circle(x + 6, y + 19, 6, t.color('primary')),
    body(title, x + 26, y, titleWidth + 20, 26, t.color('text'), {
      fontWeight: 700,
      lineHeight: 1.3,
    }),
    metaInline
      ? body(meta, x + 26 + titleWidth + 18, y + 4, 240, 22, t.color('accent'), {
          fontWeight: 600,
        })
      : body(meta, x + 26, y + 38, 640, 22, t.color('accent'), { fontWeight: 600 }),
    body(
      t.list('details')[index] ?? '',
      x + 26,
      y + (metaInline ? 40 : 74),
      W - x - 110,
      21,
      t.shade('text', FOCAL.muted),
    ),
  ];
};

export const photographerResume = themed(W, H, resumeSpec, (t) => {
  const body = copy(t.font('body'));
  const contacts = t.list('contacts');
  const skills = t.list('skills');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    poly(
      [
        [0, 0],
        [380, 0],
        [640, H],
        [210, H],
      ],
      t.color('primary'),
      { name: 'Slanted band' },
    ),
    poly(
      [
        [398, 0],
        [406, 0],
        [666, H],
        [658, H],
      ],
      t.color('accent'),
      { name: 'Band rule' },
    ),
    avatar('woman-portrait-4', 284, 690, 168, t.color('accent')),
    body(t.copy('name'), 132, 905, 400, 58, t.color('surface'), {
      fontWeight: 700,
      lineHeight: 1.05,
    }),
    body(t.copy('role'), 140, 1042, 380, 28, t.shade('surface', FOCAL.mist), { letterSpacing: 5 }),
    rect(142, 1096, 80, 6, t.color('accent'), { name: 'Name rule' }),
    body(t.copy('contactTitle'), 162, 1200, 300, 30, t.color('surface'), {
      fontWeight: 700,
      letterSpacing: 2,
    }),
    CONTACT_ICONS.map((name, index) => {
      const y = 1272 + index * 62;
      const x = (210 * y) / H + 44;
      return [
        icon(name, x, y, 30, t.color('accent'), { strokeWidth: 2 }),
        body(contacts[index] ?? '', x + 46, y + 1, 360, 22, t.color('surface')),
      ];
    }),
    label(t, 0, 110),
    body(t.copy('about'), column(186), 186, W - column(186) - 70, 23, t.shade('text', FOCAL.muted)),
    label(t, 1, 380),
    entry(t, 0),
    entry(t, 1),
    entry(t, 2),
    label(t, 2, 930),
    entry(t, 3),
    entry(t, 4),
    label(t, 3, 1360),
    [0, 1].map((columnIndex) =>
      [0, 1, 2, 3].map((row) => {
        const y = 1446 + row * 54;
        const x = column(1446) + columnIndex * 270;
        return [
          circle(x + 6, y + 16, 5, t.color('accent')),
          body(skills[columnIndex * 4 + row] ?? '', x + 24, y, 250, 22, t.color('text'), {
            fontWeight: 500,
          }),
        ];
      }),
    ),
  ];
});
