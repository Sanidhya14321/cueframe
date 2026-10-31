import { A4_SIZE, circle, icon, rect, type ThemeSpec, themed } from '../../../kit';
import {
  BODY_FONT,
  CLEAR,
  copy,
  GRID_LINE,
  grid,
  HEADING_FONT,
  LOOP,
  outlinePill,
  ring,
  swatches,
  swirl,
} from './art';

const { width: W, height: H } = A4_SIZE;

const SECTIONS = [
  { name: 'Contact', x: 90, y: 500, width: 300 },
  { name: 'Specialties', x: 90, y: 800, width: 300 },
  { name: 'Portfolio', x: 90, y: 1310, width: 300 },
  { name: 'Education', x: 610, y: 500, width: 300 },
  { name: 'Experience', x: 610, y: 820, width: 300 },
  { name: 'Tools', x: 610, y: 1270, width: 220 },
] as const;

const CONTACT_ICONS = ['phone', 'mail', 'globe'] as const;
const SKILL_LEVELS = [0.92, 0.74, 0.86, 0.66, 0.8] as const;
const TOOL_ICONS = ['layout-grid', 'image', 'pen-tool', 'film'] as const;
const TOOL_LEVELS = [0.85, 0.7, 0.9, 0.6] as const;
const ENTRY_TOPS = [596, 696, 916, 1086] as const;

const resumeSpec = {
  colors: {
    background: {
      value: LOOP.night,
      hint: 'Page, role text, slider knobs and the QR code; its darker shade outlines the swatches',
    },
    primary: {
      value: LOOP.lime,
      hint: 'Swirl, role pill, top swatch, section outlines, contact and portfolio icons, skill levels and knob rings, school and job titles, the first tool ring and icon and the closing line',
    },
    secondary: { value: LOOP.lilac, hint: 'Back swatch and the job descriptions' },
    accent: {
      value: LOOP.violet,
      hint: 'Second tool ring and icon; its shifted shades color the third and fourth tool rings and icons',
    },
    text: {
      value: LOOP.white,
      hint: 'Name, cursor, front swatch, section labels, contact details, QR tile and body text; its faint shades draw the grid, divider and tracks',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    name: { label: 'Name', value: 'Ivy\nSorensen' },
    role: { label: 'Role', value: 'Graphic Designer' },
    sections: { label: 'Section', value: SECTIONS.map((section) => section.name) },
    contacts: {
      label: 'Contact',
      value: ['+1 (555) 610 2234', 'ivy@sorensen.design', 'sorensen.design'],
    },
    skills: {
      label: 'Specialty',
      value: ['Typography', 'Illustration', 'Brand Identity', 'Motion Design', 'Print Production'],
    },
    portfolio: { label: 'Portfolio note', value: 'Scan to browse\nmy latest work' },
    titles: {
      label: 'School or job',
      value: [
        'Brightmoor University',
        'Oakridge Art College',
        'Senior Designer',
        'Junior Designer',
      ],
    },
    years: { label: 'Years', value: ['2016 - 2020', '2014 - 2016', '2022 - Now', '2020 - 2022'] },
    places: {
      label: 'Degree or company',
      value: [
        'BA Visual Communication',
        'Diploma in Illustration',
        'Copperleaf Agency',
        'Inkwell Press',
      ],
    },
    details: {
      label: 'Job description',
      value: [
        'Leads identity and campaign work for food, travel and culture brands.',
        'Designed book covers, posters and packaging ready for print.',
      ],
    },
    tools: { label: 'Tool', value: ['Layout', 'Photo Edit', 'Vector Art', 'Motion'] },
    note: { label: 'Closing line', value: 'Open to freelance projects from May 2027' },
  },
} as const satisfies ThemeSpec;

export const designerResume = themed(W, H, resumeSpec, (t) => {
  const heading = copy(t.font('heading'));
  const body = copy(t.font('body'));
  const lime = t.color('primary');
  const white = t.color('text');
  const night = t.color('background');
  const clear = t.shade('background', CLEAR);
  const sections = t.list('sections');
  const years = t.list('years');
  const places = t.list('places');
  const details = t.list('details');
  const tools = t.list('tools');
  const toolColors = [
    lime,
    t.color('accent'),
    t.shade('accent', LOOP.coral),
    t.shade('accent', LOOP.sky),
  ];
  const pillStyle = { stroke: lime, ink: white, clear, fontFamily: t.font('heading') };
  const section = (index: number) => {
    const spot = SECTIONS[index] ?? SECTIONS[0];
    return outlinePill(spot.name, sections[index] ?? '', spot.x, spot.y, spot.width, pillStyle);
  };
  const entry = (title: string, index: number) => {
    const y = ENTRY_TOPS[index] ?? 0;
    return [
      body(title, 610, y, 380, 23, lime, { fontWeight: 600 }),
      body(years[index] ?? '', 900, y + 1, 260, 22, white, { align: 'right', fontWeight: 500 }),
      body(places[index] ?? '', 610, y + 36, 550, 22, white, { fontWeight: 600 }),
      index < 2 ? [] : body(details[index - 2] ?? '', 610, y + 74, 550, 19, t.color('secondary')),
    ];
  };
  const titles = t.list('titles');
  return [
    rect(0, 0, W, H, night, { name: 'Background' }),
    grid(W, H, 62, t.shade('text', GRID_LINE)),
    heading(t.copy('name'), 90, 80, 640, 118, white, { fontWeight: 700, lineHeight: 1.02 }),
    rect(712, 210, 4, 104, white, { name: 'Text cursor' }),
    rect(90, 344, 380, 70, lime, { cornerRadius: 35, name: 'Role pill' }),
    heading(t.copy('role'), 90, 361, 380, 29, night, {
      fontWeight: 600,
      align: 'center',
      lineHeight: 1.2,
    }),
    swirl(860, 40, 300, lime, 22, clear),
    swatches(760, 250, 120, {
      back: t.color('secondary'),
      front: white,
      top: lime,
      edge: t.shade('background', LOOP.deep),
    }),
    rect(558, 500, 3, 1180, t.shade('text', 'rgba(255,255,255,0.6)'), { name: 'Divider' }),
    rect(551, 494, 16, 16, white, { name: 'Divider handle' }),
    rect(551, 1080, 16, 16, white, { name: 'Divider handle' }),
    rect(551, 1672, 16, 16, white, { name: 'Divider handle' }),
    section(0),
    t
      .list('contacts')
      .map((value, index) => [
        icon(CONTACT_ICONS[index] ?? 'phone', 92, 596 + index * 58, 30, lime, { strokeWidth: 2 }),
        body(value, 142, 597 + index * 58, 380, 22, white),
      ]),
    section(1),
    t.list('skills').map((label, index) => {
      const y = 900 + index * 76;
      const share = SKILL_LEVELS[index] ?? 0;
      return [
        rect(90, y, 400, 14, t.shade('text', 'rgba(255,255,255,0.85)'), {
          cornerRadius: 7,
          name: 'Track',
        }),
        rect(90, y, 400 * share, 14, lime, { cornerRadius: 7, name: 'Level' }),
        circle(90 + 400 * share, y + 7, 11, night, {
          stroke: lime,
          strokeWidth: 4,
          name: 'Knob',
        }),
        body(label, 90, y + 24, 400, 19, white, { align: 'center' }),
      ];
    }),
    section(2),
    rect(90, 1410, 180, 180, white, { cornerRadius: 14, name: 'QR tile' }),
    icon('qr-code', 105, 1425, 150, night, { strokeWidth: 2 }),
    body(t.copy('portfolio'), 296, 1452, 240, 21, white, { lineHeight: 1.4 }),
    icon('pen-tool', 420, 1540, 50, lime, { strokeWidth: 2 }),
    section(3),
    entry(titles[0] ?? '', 0),
    entry(titles[1] ?? '', 1),
    section(4),
    entry(titles[2] ?? '', 2),
    entry(titles[3] ?? '', 3),
    section(5),
    tools.map((label, index) => {
      const cx = 666 + index * 142;
      const color = toolColors[index] ?? lime;
      return [
        ring(cx, 1430, 46, TOOL_LEVELS[index] ?? 0, 10, {
          stroke: color,
          track: t.shade('text', 'rgba(255,255,255,0.14)'),
          clear,
        }),
        icon(TOOL_ICONS[index] ?? 'film', cx - 18, 1412, 36, color, { strokeWidth: 2 }),
        body(label, cx - 70, 1494, 140, 19, white, { align: 'center' }),
      ];
    }),
    body(t.copy('note'), 610, 1600, 560, 21, lime, { fontWeight: 500 }),
  ];
});
