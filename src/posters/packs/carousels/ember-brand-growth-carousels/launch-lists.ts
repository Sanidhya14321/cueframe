import { arrow, checklist, POST_SIZE, rect, type ThemeSpec, text, themed } from '../../../kit';
import { EMBER, FONT, NIGHT, SITE } from './grid-stats';

const { width: W, height: H } = POST_SIZE;
const PAPER = '#ffffff';

const launchSpec = {
  colors: {
    background: { value: PAPER, hint: 'Page and the pill text' },
    primary: { value: EMBER, hint: 'KEEP and GOING outlines and the pill' },
    text: {
      value: NIGHT,
      hint: 'Thinking about, launching your and the arrow; its lighter shade colors the website',
    },
  },
  fonts: { font: FONT },
  copy: {
    outline: { label: 'Outline word', value: ['KEEP', 'GOING'] },
    site: SITE,
    intro: { label: 'Intro', value: 'Thinking about' },
    question: { label: 'Question', value: 'launching your' },
    highlight: { label: 'Pill text', value: 'side hustle?' },
  },
} as const satisfies ThemeSpec;

export const launchCover = themed(W, H, launchSpec, (t) => {
  const [keep = '', going = ''] = t.list('outline');
  const outlineWord = (word: string, y: number) =>
    text(word, 0, y, W, {
      fontFamily: t.font('font'),
      fontSize: 250,
      fontWeight: 800,
      fill: t.shade('primary', 'rgba(0,0,0,0)'),
      stroke: t.color('primary'),
      strokeWidth: 4,
      align: 'center',
      letterSpacing: 8,
      lineHeight: 1,
    });
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    outlineWord(keep, 50),
    outlineWord(going, 1050),
    text(t.copy('site'), 0, 420, W, {
      fontFamily: t.font('font'),
      fontSize: 34,
      fontWeight: 600,
      fill: t.shade('text', '#52525b'),
      align: 'center',
    }),
    text(t.copy('intro'), 0, 490, W, {
      fontFamily: t.font('font'),
      fontSize: 58,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('question'), 0, 570, W, {
      fontFamily: t.font('font'),
      fontSize: 80,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
    rect(210, 690, 660, 124, t.color('primary'), { name: 'Pill', cornerRadius: 62 }),
    text(t.copy('highlight'), 210, 708, 660, {
      fontFamily: t.font('font'),
      fontSize: 74,
      fontWeight: 800,
      fill: t.color('background'),
      align: 'center',
    }),
    arrow(460, 910, 160, t.color('text'), 8),
  ];
});

const topBar = (fill: string) =>
  rect(90, 150, 170, 22, fill, { name: 'Accent bar', cornerRadius: 11 });

const dosSpec = {
  colors: {
    background: { value: NIGHT, hint: 'Page' },
    primary: { value: EMBER, hint: "Top bar and the DO and DON'T tags" },
    text: {
      value: '#ffffff',
      hint: "Title, the note, the tag words and the arrow; its softer shade colors the do and don't lists",
    },
  },
  fonts: { font: FONT },
  copy: {
    title: { label: 'Title', value: "Do's &\nDon'ts" },
    note: { label: 'Note', value: 'Early traction beats a perfect logo.' },
    tags: { label: 'Column tag', value: ['DO:', "DON'T:"] },
    dos: { label: 'Do', value: ['Talk to customers', 'Pre-sell early', 'Solve one problem'] },
    donts: {
      label: "Don't",
      value: ['Polish for months', 'Assume demand', 'Build extra features'],
    },
  },
} as const satisfies ThemeSpec;

const dosAndDonts = themed(W, H, dosSpec, (t) => {
  const [doTag = '', dontTag = ''] = t.list('tags');
  const tag = (content: string, x: number, width: number, name: string) => [
    rect(x, 650, width, 72, t.color('primary'), { name, cornerRadius: 8 }),
    text(content, x, 664, width, {
      fontFamily: t.font('font'),
      fontSize: 40,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
  ];
  const column = (items: readonly string[], x: number) =>
    items.map((item, index) =>
      text(item, x, 770 + index * 76, 420, {
        fontFamily: t.font('font'),
        fontSize: 36,
        fontWeight: 500,
        fill: t.shade('text', '#e4e4e7'),
        align: 'center',
      }),
    );
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    topBar(t.color('primary')),
    text(t.copy('title'), 0, 230, W, {
      fontFamily: t.font('font'),
      fontSize: 124,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('note'), 60, 520, 960, {
      fontFamily: t.font('font'),
      fontSize: 40,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
    tag(doTag, 195, 150, 'Do tag'),
    tag(dontTag, 630, 200, 'Dont tag'),
    column(t.list('dos'), 60),
    column(t.list('donts'), 520),
    arrow(840, 1190, 150, t.color('text'), 8),
  ];
});

const checklistSpec = (dark: boolean, title: string, note: string, items: readonly string[]) =>
  ({
    colors: {
      background: { value: dark ? NIGHT : PAPER, hint: 'Page' },
      primary: {
        value: EMBER,
        hint: `Top bar and the check icons; its ${dark ? 'lighter' : 'deeper'} shade colors the note`,
      },
      text: { value: dark ? '#ffffff' : NIGHT, hint: 'Title, the checklist items and the arrow' },
    },
    fonts: { font: FONT },
    copy: {
      title: { label: 'Title', value: title },
      note: { label: 'Note', value: note },
      items: { label: 'Checklist item', value: items },
    },
  }) as const satisfies ThemeSpec;

const checklistSlide = (dark: boolean, title: string, note: string, items: readonly string[]) =>
  themed(W, H, checklistSpec(dark, title, note, items), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    topBar(t.color('primary')),
    text(t.copy('title'), 0, 230, W, {
      fontFamily: t.font('font'),
      fontSize: 112,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('note'), 90, 490, 900, {
      fontFamily: t.font('font'),
      fontSize: 40,
      fontWeight: 700,
      fill: t.shade('primary', dark ? '#ffb08f' : '#c2410c'),
      align: 'center',
      lineHeight: 1.3,
    }),
    checklist(t.list('items'), 200, 660, 760, {
      color: t.color('text'),
      iconColor: t.color('primary'),
      fontSize: 42,
      gap: 96,
      fontFamily: t.font('font'),
    }),
    arrow(840, 1190, 150, t.color('text'), 8),
  ]);

export const LAUNCH_STEPS = [
  dosAndDonts,
  checklistSlide(
    false,
    'Before You\nLaunch',
    'Tick most of these and you are\ncloser than you think.',
    [
      'A painful problem solved',
      'A clear first customer',
      'One simple offer',
      'Pricing that feels fair',
    ],
  ),
  checklistSlide(
    true,
    'Weekly\nWorkflow',
    'The best founders run a simple\nloop and repeat it every week.',
    ['Batch ideas on Monday', 'Film in one session', 'Edit with templates', 'Post and reply daily'],
  ),
] as const;
