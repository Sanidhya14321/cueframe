import type { DesignIconName } from '@/design';
import { circle, icon, line, poly, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY_FONT,
  CLEAR,
  CONTACT_ICONS,
  CONTACTS,
  caps,
  doubleRule,
  GARNET,
  HEADING_FONT,
  heading,
  INITIALS,
  iconTile,
  LETTER,
  monogram,
  NAME,
  ROLE,
} from './brand';

const LEFT = 190;
const SPLIT = 600;
const RIGHT = 640;

const TAB_SPOTS = [
  { name: 'PROFILE', top: 320, height: 290 },
  { name: 'SKILLS', top: 670, height: 270 },
  { name: 'EDUCATION', top: 1000, height: 270 },
  { name: 'EMPLOYMENT', top: 1330, height: 270 },
] as const;

const TOOL_ICONS: readonly DesignIconName[] = [
  'pen-tool',
  'image',
  'newspaper',
  'clapperboard',
  'layers',
];
const TOOL_TINTS = ['#3b82f6', '#ec4899', '#8b5cf6', '#10b981'] as const;

const SPECIALTY_ICONS: readonly DesignIconName[] = [
  'pencil',
  'camera',
  'gem',
  'brush',
  'gift',
  'share-2',
  'book-open',
  'megaphone',
  'flag',
];

const BULLET_GROUPS = [
  { x: RIGHT, y: 1090, width: 300, count: 4 },
  { x: RIGHT + 330, y: 1090, width: 230, count: 3 },
  { x: RIGHT, y: 1420, width: 330, count: 3 },
  { x: RIGHT + 360, y: 1420, width: 200, count: 2 },
] as const;

const resumeSpec = {
  colors: {
    background: { value: GARNET.paper, hint: 'Page' },
    primary: {
      value: GARNET.wine,
      hint: 'Monogram, the corner wedge, section tabs, bullet dots and the icons on the pink tiles',
    },
    secondary: { value: GARNET.rose, hint: 'Pink icon tiles for contacts and specialties' },
    accent: {
      value: '#f97316',
      hint: 'First toolkit tile; the other four toolkit tiles follow it as shifted hues',
    },
    surface: {
      value: '#ffffff',
      hint: 'Monogram letters and ring, the tab labels and the toolkit icons',
    },
    text: {
      value: GARNET.ink,
      hint: 'Name, role, headings, rules, dividers and list text; its softer shade colors the about text and detail lines',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    initials: INITIALS,
    name: NAME,
    role: ROLE,
    tabs: { label: 'Section tab', value: TAB_SPOTS.map((tab) => tab.name) },
    headings: {
      label: 'Heading',
      value: [
        'ABOUT ME',
        'CONTACT',
        'TOOLKIT',
        'SPECIALTIES',
        '2014-2018',
        'CERTIFICATES',
        'WORK',
        'ACHIEVEMENTS',
      ],
    },
    about: {
      label: 'About me',
      value:
        'I am a brand designer who builds bold, simple identities for consumer brands. I move easily from strategy workshops to type, packaging and launch campaigns, and I love a tight brief.',
    },
    contacts: CONTACTS,
    tools: {
      label: 'Tool',
      value: [
        'VECTOR ILLUSTRATION',
        'PHOTO RETOUCHING',
        'LAYOUT AND PRINT',
        'MOTION DESIGN',
        '3D MOCKUPS',
      ],
    },
    specialties: {
      label: 'Specialty',
      value: [
        'TYPOGRAPHY',
        'PHOTOGRAPHY',
        'LOGO MARKS',
        'ILLUSTRATION',
        'PACKAGING',
        'SOCIAL MEDIA',
        'EDITORIAL',
        'CAMPAIGNS',
        'SIGNAGE',
      ],
    },
    education: {
      label: 'Education line',
      value: ['BA VISUAL COMMUNICATION', 'RIVERTON SCHOOL OF ART', 'GPA', '3.9 / 4.0'],
    },
    work: {
      label: 'Work line',
      value: [
        'ORCHARD AND CO',
        'SENIOR BRAND DESIGNER / 2021-NOW',
        'NORTHFIELD MEDIA',
        'VISUAL DESIGNER / 2018-2021',
      ],
    },
    bullets: {
      label: 'Bullet',
      hint: 'Certificates first, then achievements',
      value: [
        'BRAND STRATEGY INTENSIVE',
        'ADVANCED TYPE DESIGN',
        'PACKAGING SYSTEMS',
        'UX FOUNDATIONS',
        'ART DIRECTION LAB',
        'MOTION BASICS',
        'COLOUR THEORY',
        'LED A FULL REBRAND IN 9 WEEKS',
        'GREW SOCIAL REACH BY 3X',
        'WON TWO PACKAGING AWARDS',
        'MENTORED 4 JUNIORS',
        'LAUNCHED 30 BRANDS',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const resume = themed(LETTER.width, LETTER.height, resumeSpec, (t) => {
  const small = caps(t.font('heading'));
  const title = heading(t.font('heading'));
  const wine = t.color('primary');
  const ink = t.color('text');
  const muted = t.shade('text', GARNET.muted);
  const white = t.color('surface');
  const tile = { tile: t.color('secondary'), glyph: wine };
  const tabs = t.list('tabs');
  const [
    about = '',
    contact = '',
    toolkit = '',
    special = '',
    years = '',
    certs = '',
    work = '',
    wins = '',
  ] = t.list('headings');
  const [degree = '', school = '', gpaLabel = '', gpa = ''] = t.list('education');
  const [firstCompany = '', firstRole = '', secondCompany = '', secondRole = ''] = t.list('work');
  const bulletItems = t.list('bullets');
  const toolColors = [t.color('accent'), ...TOOL_TINTS.map((tint) => t.shade('accent', tint))];
  const sectionTab = (index: number) => {
    const spot = TAB_SPOTS[index] ?? TAB_SPOTS[0];
    const { top, height } = spot;
    return [
      poly(
        [
          [115, top],
          [150, top + 34],
          [150, top + height - 34],
          [115, top + height],
          [80, top + height - 34],
          [80, top + 34],
        ],
        wine,
        { name: `${spot.name} tab` },
      ),
      text(tabs[index] ?? '', 98, top + height / 2 + 150, 300, {
        fontFamily: t.font('heading'),
        fontSize: 32,
        fontWeight: 600,
        fill: white,
        align: 'center',
        rotation: -90,
        letterSpacing: 2,
      }),
    ];
  };
  const divider = (top: number, height: number) =>
    line(SPLIT + 18, top, height, ink, 2, { rotation: 90 });
  const bullets = (group: number) => {
    const spot = BULLET_GROUPS[group] ?? BULLET_GROUPS[0];
    const start = BULLET_GROUPS.slice(0, group).reduce((sum, item) => sum + item.count, 0);
    return Array.from({ length: spot.count }, (_, index) => [
      circle(spot.x + 5, spot.y + index * 34 + 13, 5, wine),
      small(
        bulletItems[start + index] ?? '',
        spot.x + 22,
        spot.y + index * 34,
        spot.width,
        23,
        ink,
      ),
    ]);
  };
  return [
    rect(0, 0, LETTER.width, LETTER.height, t.color('background'), { name: 'Background' }),
    monogram(t.copy('initials'), 80, 70, 150, {
      fill: wine,
      color: white,
      clear: t.shade('primary', CLEAR),
      fontFamily: t.font('heading'),
    }),
    text(t.copy('name'), 270, 70, 600, {
      fontFamily: t.font('heading'),
      fontSize: 88,
      fontWeight: 500,
      fill: ink,
      lineHeight: 1,
      letterSpacing: 2,
    }),
    small(t.copy('role'), 272, 166, 400, 32, ink, 500),
    poly(
      [
        [620, 268],
        [1195, 110],
        [1195, 268],
      ],
      wine,
      { name: 'Wedge' },
    ),
    doubleRule(80, 280, 1115, ink),
    sectionTab(0),
    title(about, LEFT, 330, 38, ink),
    text(t.copy('about'), LEFT, 384, 400, {
      fontFamily: t.font('body'),
      fontSize: 22,
      fontWeight: 400,
      fill: muted,
      lineHeight: 1.45,
    }),
    divider(330, 260),
    title(contact, RIGHT, 330, 38, ink),
    t
      .list('contacts')
      .map((label, index) => [
        iconTile(CONTACT_ICONS[index] ?? 'mail', RIGHT, 390 + index * 70, 48, tile),
        small(label, RIGHT + 68, 398 + index * 70, 480, 28, ink),
      ]),
    doubleRule(80, 630, 1115, ink),
    sectionTab(1),
    title(toolkit, LEFT, 680, 34, ink),
    t.list('tools').map((label, index) => [
      rect(LEFT, 730 + index * 40, 28, 28, toolColors[index] ?? wine, {
        cornerRadius: 6,
        name: 'Tool tile',
      }),
      icon(TOOL_ICONS[index] ?? 'layers', LEFT + 5, 735 + index * 40, 18, white, {
        strokeWidth: 2.4,
      }),
      small(label, LEFT + 42, 730 + index * 40, 360, 23, ink),
    ]),
    divider(680, 250),
    title(special, RIGHT, 680, 34, ink),
    t.list('specialties').map((label, index) => {
      const x = RIGHT + (index % 3) * 190;
      const y = 740 + Math.floor(index / 3) * 56;
      return [
        iconTile(SPECIALTY_ICONS[index] ?? 'flag', x, y, 34, tile),
        small(label, x + 44, y + 3, 150, 21, ink),
      ];
    }),
    doubleRule(80, 960, 1115, ink),
    sectionTab(2),
    title(years, LEFT, 1010, 60, ink),
    small(degree, LEFT, 1082, 400, 26, ink, 600),
    small(school, LEFT, 1116, 400, 22, muted),
    small(gpaLabel, LEFT, 1160, 200, 26, ink, 600),
    small(gpa, LEFT, 1194, 200, 22, muted),
    divider(1010, 250),
    title(certs, RIGHT, 1010, 60, ink),
    bullets(0),
    bullets(1),
    doubleRule(80, 1290, 1115, ink),
    sectionTab(3),
    title(work, LEFT, 1340, 60, ink),
    small(firstCompany, LEFT, 1414, 400, 28, ink, 600),
    small(firstRole, LEFT, 1450, 400, 21, muted),
    small(secondCompany, LEFT, 1500, 400, 28, ink, 600),
    small(secondRole, LEFT, 1536, 400, 21, muted),
    divider(1340, 250),
    title(wins, RIGHT, 1340, 60, ink),
    bullets(2),
    bullets(3),
  ];
});
