import { linear, radial } from '@/design';
import { circle, rect, shadow, type Theme, type ThemeSpec, themed } from '../../../kit';
import { estimateWidth, FONT, H, MARKER, type Say, TOMATO, W, writer } from './palette';

const noteColors = (primary: string, text: string) => ({
  background: {
    value: '#2b2b2b',
    hint: 'Page gradient; its darker shade is the bottom and its light shade the spotlight',
  },
  surface: { value: TOMATO.note, hint: 'Sticky note and the faded side notes' },
  primary: { value: TOMATO.red, hint: primary },
  secondary: { value: TOMATO.ink, hint: 'Handwriting on the sticky note' },
  text: { value: TOMATO.white, hint: text },
});

const NOTE_FONTS = { body: FONT, note: MARKER } as const;

interface NoteSpec extends ThemeSpec {
  colors: ReturnType<typeof noteColors>;
  fonts: typeof NOTE_FONTS;
}

const backdrop = <S extends NoteSpec>(t: Theme<S>) => {
  const glow = t.shade('background', 'rgba(255,255,255,0)');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#0c0c0c')), {
      name: 'Background',
    }),
    circle(
      540,
      780,
      520,
      radial(
        t.shade('background', 'rgba(255,255,255,0.14)'),
        t.shade('background', 'rgba(255,255,255,0.05)'),
        glow,
        glow,
      ),
      { name: 'Spotlight' },
    ),
    rect(0, 640, 120, 320, t.shade('surface', 'rgba(243,241,236,0.3)'), {
      name: 'Side note',
      cornerRadius: 6,
    }),
    rect(960, 610, 120, 320, t.shade('surface', 'rgba(243,241,236,0.3)'), {
      name: 'Side note',
      cornerRadius: 6,
    }),
  ];
};

const stickyNote = <S extends NoteSpec>(t: Theme<S>, content: string) => [
  rect(320, 600, 440, 440, t.color('surface'), {
    name: 'Sticky note',
    rotation: -3,
    ...shadow(40, 18, 'rgba(0,0,0,0.55)'),
  }),
  writer(t.font('note'))(content, 340, 720, 400, 70, t.color('secondary'), 400, {
    align: 'center',
    lineHeight: 1.15,
    rotation: -3,
  }),
  circle(540, 600, 28, t.color('primary'), shadow(10, 6, 'rgba(0,0,0,0.5)')),
  circle(532, 592, 9, t.shade('primary', 'rgba(255,255,255,0.6)')),
];

const centered = (
  say: Say,
  content: string,
  y: number,
  size: number,
  fill: string,
  weight: number,
) => say(content, 60, y, W - 120, size, fill, weight, { align: 'center', lineHeight: 1.3 });

const notesCoverSpec = {
  colors: noteColors('Highlighted middle line and the pin', 'First and last headline lines'),
  fonts: NOTE_FONTS,
  copy: {
    intro: { label: 'Intro', value: 'Learn How to Make' },
    title: { label: 'Highlighted word', value: 'Content' },
    closing: { label: 'Last line', value: 'That Converts' },
    note: { label: 'Sticky note', value: 'Swipe to\nLearn More' },
  },
} as const satisfies NoteSpec;

export const notesCover = themed(W, H, notesCoverSpec, (t) => {
  const say = writer(t.font('body'));
  return [
    backdrop(t),
    centered(say, t.copy('intro'), 140, 48, t.color('text'), 500),
    centered(say, t.copy('title'), 210, 112, t.color('primary'), 700),
    centered(say, t.copy('closing'), 340, 100, t.color('text'), 700),
    stickyNote(t, t.copy('note')),
  ];
});

const noteStep = (lead: string, accent: string, subtitle: string, note: string) => {
  const spec = {
    colors: noteColors('Highlighted headline word and the pin', 'Lead word and the subtitle'),
    fonts: NOTE_FONTS,
    copy: {
      lead: { label: 'Lead word', value: lead },
      accent: { label: 'Highlighted word', value: accent },
      subtitle: { label: 'Subtitle', value: subtitle },
      note: { label: 'Sticky note', value: note },
    },
  } as const satisfies NoteSpec;
  return themed(W, H, spec, (t) => {
    const say = writer(t.font('body'));
    const first = t.copy('lead');
    const second = t.copy('accent');
    const size = 84;
    const leadWidth = estimateWidth(`${first} `, size);
    const start = (W - leadWidth - estimateWidth(second, size)) / 2;
    return [
      backdrop(t),
      say(first, start, 180, leadWidth + size, size, t.color('text'), 700, { lineHeight: 1.1 }),
      say(
        second,
        start + leadWidth,
        180,
        estimateWidth(second, size) + size,
        size,
        t.color('primary'),
        700,
        { lineHeight: 1.1 },
      ),
      centered(say, t.copy('subtitle'), 310, 40, t.color('text'), 400),
      stickyNote(t, t.copy('note')),
    ];
  });
};

export const noteDisconnect = noteStep(
  'The',
  'Disconnect',
  'Plenty of engagement, but the\nsales still are not coming in.',
  "Likes don't\nequal leads",
);

export const noteFramework = noteStep(
  'The',
  'Framework',
  'Every post should move your\nreader closer to a decision.',
  'Guide your\nreader',
);

export const noteShift = noteStep(
  'The',
  'Shift',
  'Your audience wants answers,\nclarity and real results.',
  'Think like\na buyer',
);
