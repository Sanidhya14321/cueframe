import { linear } from '@/design';
import { circle, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, darkBg, EV, fonts, HEADING, lightBg, SH, SW } from './theme';

export const quarterlySlide = themed(
  SW,
  SH,
  {
    colors: {
      background: {
        value: EV.forest,
        hint: 'Page, plus the note and the current quarter on the highlight column',
      },
      primary: {
        value: EV.mint,
        hint: 'Highlight column, Roadmap and the quarter titles',
      },
      text: {
        value: EV.white,
        hint: 'Quarterly, the timeline dots and quarter labels; its translucent shades color the timeline and quarter notes',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Quarterly' },
      subtitle: { label: 'Highlighted title', value: 'Roadmap' },
      noteTitle: { label: 'Note title', value: 'You are here' },
      note: { label: 'Note', value: 'Scaling the rollout\nacross every region.' },
      quarters: { label: 'Quarter', value: ['Q1', 'Q2', 'Q3', 'Q4'] },
      steps: { label: 'Quarter title', value: ['Discovery', 'Build', 'Expansion', 'Integration'] },
      details: {
        label: 'Quarter note',
        value: [
          'Baseline models and\naudit current tools.',
          'Pilot automations with\ntwo core teams.',
          'Roll out across regions\nand partners.',
          'Unify analytics into one\nlive command center.',
        ],
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const steps = t.list('steps');
    const details = t.list('details');
    const dark = t.color('background');
    return [
      darkBg(t),
      rect(960, 0, 420, SH, linear(180, t.color('primary'), t.shade('primary', EV.emerald)), {
        name: 'Highlight column',
      }),
      head(t.copy('title'), 140, 140, 700, 72, t.color('text')),
      head(t.copy('subtitle'), 140, 222, 700, 72, t.color('primary'), { fontWeight: 500 }),
      head(t.copy('noteTitle'), 990, 150, 360, 46, dark),
      body(t.copy('note'), 990, 215, 360, 26, dark),
      rect(140, 558, 1640, 4, t.shade('text', 'rgba(255,255,255,0.45)'), { name: 'Timeline' }),
      t.list('quarters').map((quarter, index) => {
        const here = index === 2;
        const x = 140 + index * 420 + (here ? 20 : 0);
        const ink = here ? dark : t.color('text');
        return [
          circle(x + 30, 560, 18, ink),
          head(quarter, x, 620, 340, 80, ink, { fontWeight: 800 }),
          head(steps[index] ?? '', x, 720, 340, 34, here ? dark : t.color('primary')),
          body(details[index] ?? '', x, 775, 340, 24, here ? dark : t.shade('text', EV.soft)),
        ];
      }),
    ];
  },
);

const DARK_MODULES = [true, false, false, false, true, false];

export const architectureSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: {
        value: EV.white,
        hint: 'Page and the titles on the green cards; its translucent shade colors their text',
      },
      surface: {
        value: '#e3f6ef',
        hint: 'Light mint cards; its deeper shade colors their lower edge',
      },
      primary: { value: EV.emerald, hint: 'Green cards and the dot grid' },
      text: {
        value: EV.ink,
        hint: 'Title and light card text; its shades color the intro and light card titles',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Intelligent Ecosystem Architecture' },
      intro: {
        label: 'Intro',
        value: 'Six building blocks that keep intelligence and execution in step.',
      },
      modules: {
        label: 'Card title',
        value: [
          'Semantic Intake',
          'Predictive Logic',
          'Edge Intelligence',
          'Native API Mesh',
          'Prescriptive Ops',
          'Closed-Loop Tuning',
        ],
      },
      details: {
        label: 'Card text',
        value: [
          'Reads requests in plain language.',
          'Forecasts load before it peaks.',
          'Runs models close to the data.',
          'Links every tool without glue code.',
          'Suggests the best next step.',
          'Learns from every outcome.',
        ],
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const details = t.list('details');
    return [
      lightBg(t),
      head(t.copy('title'), 0, 130, SW, 64, t.color('text'), { align: 'center' }),
      body(t.copy('intro'), 0, 230, SW, 30, t.shade('text', EV.muted), { align: 'center' }),
      t.list('modules').map((title, index) => {
        const x = 200 + (index % 3) * 520;
        const y = 390 + Math.floor(index / 3) * 290;
        const dark = DARK_MODULES[index] === true;
        return [
          rect(
            x,
            y,
            480,
            250,
            dark
              ? linear(135, t.color('primary'), t.shade('primary', EV.forestMid))
              : linear(160, t.color('surface'), t.shade('surface', '#bfe9da')),
            { name: 'Module card', cornerRadius: 22 },
          ),
          head(
            title,
            x + 36,
            y + 50,
            410,
            38,
            dark ? t.color('background') : t.shade('text', EV.forest),
          ),
          body(
            details[index] ?? '',
            x + 36,
            y + 120,
            410,
            26,
            dark ? t.shade('background', EV.soft) : t.color('text'),
          ),
        ];
      }),
    ];
  },
);
