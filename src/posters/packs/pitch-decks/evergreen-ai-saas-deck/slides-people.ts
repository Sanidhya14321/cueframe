import { linear } from '@/design';
import { avatar, icon, photo, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, EV, fonts, GRAY, HEADING, headings, lightBg, SH, SW } from './theme';

const CREW_PHOTOS = [
  'woman-portrait-1',
  'man-portrait-2',
  'woman-portrait-5',
  'man-portrait-1',
] as const;

export const teamSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: EV.white, hint: 'Page; its mint shade colors the lower corner' },
      surface: {
        value: EV.white,
        hint: 'Name tags, arrow chips and the lead name; its shades color the tag outlines and the lead role',
      },
      primary: { value: EV.emerald, hint: 'Lead name tag, the arrows and the dot grid' },
      text: { value: EV.ink, hint: 'Title and names; its grey shade colors the intro and roles' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Meet the Fernbrook Crew' },
      intro: {
        label: 'Intro',
        value: 'The people turning raw data into decisions you can act on.',
      },
      names: { label: 'Name', value: ['Lena Varga', 'Omar Haddad', 'Priya Raman', 'Jonas Weber'] },
      roles: {
        label: 'Role',
        value: ['Chief Executive', 'Head of AI', 'Data Scientist', 'Lead Engineer'],
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const roles = t.list('roles');
    const muted = t.shade('text', EV.muted);
    return [
      lightBg(t),
      head(t.copy('title'), 0, 110, SW, 72, t.color('text'), { align: 'center' }),
      body(t.copy('intro'), 0, 210, SW, 30, muted, { align: 'center' }),
      t.list('names').map((name, index) => {
        const x = 210 + index * 390;
        const lead = index === 1;
        return [
          photo(CREW_PHOTOS[index] ?? 'woman-portrait-1', x, 320, 330, 400, {
            cornerRadius: 18,
            ...GRAY,
          }),
          rect(
            x,
            740,
            330,
            130,
            lead
              ? linear(135, t.color('primary'), t.shade('primary', EV.forestMid))
              : t.color('surface'),
            {
              name: 'Name tag',
              cornerRadius: 18,
              stroke: t.shade('surface', EV.line),
              strokeWidth: lead ? 0 : 2,
            },
          ),
          head(name, x + 28, 766, 260, 34, lead ? t.color('surface') : t.color('text')),
          body(
            roles[index] ?? '',
            x + 28,
            814,
            260,
            24,
            lead ? t.shade('surface', EV.soft) : muted,
          ),
          rect(x + 254, 644, 56, 56, t.color('surface'), { name: 'Icon chip', cornerRadius: 14 }),
          icon('arrow-up-right', x + 266, 656, 32, t.color('primary'), { strokeWidth: 2.4 }),
        ];
      }),
    ];
  },
);

const ORBIT = [
  { photo: 'man-portrait-3', cx: 610, cy: 360, r: 54 },
  { photo: 'woman-portrait-2', cx: 1250, cy: 380, r: 42 },
  { photo: 'woman-portrait-6', cx: 1420, cy: 560, r: 58 },
  { photo: 'woman-portrait-1', cx: 520, cy: 760, r: 46 },
  { photo: 'woman-portrait-4', cx: 1300, cy: 830, r: 62 },
  { photo: 'man-portrait-1', cx: 860, cy: 860, r: 32 },
] as const;

const RINGS = [
  [920, 460],
  [780, 350],
  [640, 250],
] as const;

export const collaborationSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: {
        value: EV.white,
        hint: 'Page, the Get Started label, its arrow and the rings around the photos; its mint shade colors the lower corner',
      },
      primary: { value: EV.emerald, hint: 'Get Started button, the orbit rings and the dot grid' },
      text: { value: EV.ink, hint: 'Title' },
    },
    fonts: { heading: HEADING },
    copy: {
      title: { label: 'Title', value: 'AI Built for Collaborative Teams' },
      button: { label: 'Button', value: 'Get Started' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const head = headings(t);
    return [
      lightBg(t),
      head(t.copy('title'), 0, 110, SW, 64, t.color('text'), { align: 'center' }),
      RINGS.map(([width, height]) =>
        rect(
          960 - width / 2,
          610 - height / 2,
          width,
          height,
          t.shade('primary', 'rgba(0,0,0,0)'),
          {
            name: 'Orbit ring',
            cornerRadius: height / 2,
            stroke: t.shade('primary', 'rgba(47,158,124,0.35)'),
            strokeWidth: 3,
          },
        ),
      ),
      rect(770, 565, 380, 90, linear(90, t.color('primary'), t.shade('primary', EV.forestMid)), {
        name: 'Button',
        cornerRadius: 45,
      }),
      head(t.copy('button'), 790, 588, 280, 38, t.color('background'), { align: 'center' }),
      icon('arrow-right', 1080, 590, 40, t.color('background'), { strokeWidth: 2.4 }),
      ORBIT.map((item) => avatar(item.photo, item.cx, item.cy, item.r, t.color('background'))),
    ];
  },
);
