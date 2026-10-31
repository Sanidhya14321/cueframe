import {
  avatar,
  circle,
  icon,
  type Nodes,
  POST_SIZE,
  pill,
  rating,
  rect,
  rotateNodes,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const FH = {
  forest: '#1f4a36',
  deep: '#133024',
  mustard: '#f2b632',
  mustardDark: '#c98e0e',
  mustardSoft: '#f9dd92',
  cream: '#fbf5e6',
  ink: '#1b2a22',
  white: '#ffffff',
  grey: '#7c8580',
};

export const W = POST_SIZE.width;
export const H = POST_SIZE.height;

type TextStyle = Parameters<typeof text>[4];

const font =
  (fontWeight: number, lineHeight: number) =>
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    style: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight,
      fill,
      lineHeight,
      ...style,
    });

export const display = font(400, 1);
const serif = font(400, 1);
export const script = font(700, 1);
export const copy = font(400, 1.4);
export const bold = font(700, 1.2);

export const HEADING = { label: 'Heading font', value: 'Anton' } as const;
export const BODY = { label: 'Body font', value: 'Poppins' } as const;
export const SCRIPT = { label: 'Script font', value: 'Caveat' } as const;
export const HANDLE = { label: 'Handle', value: 'fernhill.studio' } as const;

export const button = (
  label: string,
  x: number,
  y: number,
  fill: string,
  color: string,
  fontFamily: string,
) => pill(label, x, y, { fill, color, fontSize: 26, fontFamily, fontWeight: 600 });

export const handle = (label: string, y: number, color: string, fontFamily: string) =>
  copy(fontFamily)(label, 0, y, W, 26, color, {
    align: 'center',
    fontWeight: 600,
    letterSpacing: 2,
  });

const catalogSpec = {
  colors: {
    background: { value: FH.cream, hint: 'Page' },
    primary: {
      value: FH.forest,
      hint: 'Catalog and Stay Tuned titles and the front folder; its darker shade colors the folder tab, arrow and labels',
    },
    accent: {
      value: FH.mustard,
      hint: 'Back folder; its darker shade colors Newest and the folder tab',
    },
    text: { value: FH.grey, hint: 'Handle at the bottom' },
    surface: { value: FH.white, hint: 'Paper sheets peeking out of the folders' },
  },
  fonts: { heading: { label: 'Heading font', value: 'DM Serif Display' }, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Catalog' },
    kicker: { label: 'Kicker', value: 'Newest' },
    folders: { label: 'Folder label', value: ['Spring Collection 2027', 'New arrivals'] },
    closing: { label: 'Closing line', value: 'Stay\nTuned' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

const folder = (
  t: Theme<typeof catalogSpec>,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  tab: string,
) => [
  rect(x, y, width * 0.38, 80, tab, { cornerRadius: 20, name: 'Folder tab' }),
  rect(x + 40, y + 10, width - 80, 200, t.color('surface'), {
    cornerRadius: 12,
    rotation: -3,
    name: 'Paper',
  }),
  rect(x, y + 50, width, height - 50, fill, {
    cornerRadius: 30,
    name: 'Folder',
    ...shadow(30, 12, t.shade('primary', 'rgba(19,48,36,0.22)')),
  }),
];

export const catalogNewest = themed(W, H, catalogSpec, (t) => {
  const heading = serif(t.font('heading'));
  const body = copy(t.font('body'));
  const [spring = '', arrivals = ''] = t.list('folders');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    heading(t.copy('title'), 90, 100, 900, 200, t.color('primary')),
    heading(t.copy('kicker'), 500, 330, 480, 72, t.shade('accent', FH.mustardDark), {
      align: 'right',
    }),
    folder(t, 150, 450, 540, 420, t.color('accent'), t.shade('accent', FH.mustardDark)),
    body(spring, 190, 790, 460, 28, t.shade('primary', FH.deep), { fontWeight: 600 }),
    folder(t, 600, 820, 400, 360, t.color('primary'), t.shade('primary', FH.deep)),
    body(arrivals, 640, 1110, 320, 26, t.color('background'), { fontWeight: 600 }),
    icon('navigation', 600, 530, 76, t.shade('primary', FH.deep), {
      strokeWidth: 2.2,
      rotation: -90,
    }),
    heading(t.copy('closing'), 90, 930, 460, 120, t.color('primary'), { lineHeight: 0.95 }),
    handle(t.copy('handle'), 1250, t.color('text'), t.font('body')),
  ];
});

const hoursSpec = {
  colors: {
    background: { value: FH.mustard, hint: 'Page and the tag hole' },
    surface: { value: FH.cream, hint: 'Hanging tag' },
    primary: {
      value: FH.forest,
      hint: 'OPENING HOURS, the divider and the walk-in line; its darker shade colors the string, address and handle',
    },
    text: { value: FH.ink, hint: 'Days and times' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'OPENING' },
    subtitle: { label: 'Second title line', value: 'HOURS' },
    days: { label: 'Day', value: ['Mon to Fri', 'Saturday', 'Sunday'] },
    times: { label: 'Hours', value: ['9:00 to 18:00', '10:00 to 16:00', 'Closed'] },
    note: { label: 'Tag note', value: 'Walk-ins always welcome' },
    address: { label: 'Address', value: 'Visit us at 24 Linden Row' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const openingHours = themed(W, H, hoursSpec, (t) => {
  const heading = display(t.font('heading'));
  const body = copy(t.font('body'));
  const strong = bold(t.font('body'));
  const times = t.list('times');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    rect(538, 0, 4, 230, t.shade('primary', FH.deep), { name: 'String' }),
    rotateNodes(-5, 540, 230, [
      rect(300, 200, 480, 800, t.color('surface'), {
        cornerRadius: 36,
        name: 'Tag',
        ...shadow(36, 16, t.shade('primary', 'rgba(19,48,36,0.25)')),
      }),
      circle(540, 262, 24, t.color('background'), { name: 'Tag hole' }),
      heading(t.copy('title'), 300, 330, 480, 120, t.color('primary'), { align: 'center' }),
      heading(t.copy('subtitle'), 300, 450, 480, 120, t.color('primary'), { align: 'center' }),
      rect(360, 610, 360, 3, t.shade('primary', 'rgba(31,74,54,0.35)'), { name: 'Divider' }),
      t.list('days').map((day, index) => [
        strong(day, 350, 650 + index * 80, 200, 30, t.color('text')),
        body(times[index] ?? '', 530, 650 + index * 80, 200, 30, t.color('text'), {
          align: 'right',
        }),
      ]),
      body(t.copy('note'), 300, 910, 480, 26, t.color('primary'), { align: 'center' }),
    ]),
    strong(t.copy('address'), 0, 1120, W, 36, t.shade('primary', FH.deep), { align: 'center' }),
    handle(t.copy('handle'), 1220, t.shade('primary', FH.deep), t.font('body')),
  ];
});

const REVIEW_PHOTOS = ['man-portrait-1', 'woman-portrait-5', 'woman-portrait-2'] as const;

const reviewsSpec = {
  colors: {
    background: { value: FH.forest, hint: 'Page and reviewer names' },
    surface: { value: FH.cream, hint: 'Title and review cards' },
    accent: {
      value: FH.mustard,
      hint: 'Client Reviews badge and photo rings; its shades color the stars and handle',
    },
    text: { value: FH.ink, hint: 'Quotes; its shade colors the badge text' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    badge: { label: 'Badge', value: 'Client Reviews' },
    title: { label: 'Title', value: 'WHAT THEY SAY?' },
    names: { label: 'Reviewer', value: ['Theo Marsh', 'Ivy Castellan', 'Rosa Kendrick'] },
    quotes: {
      label: 'Quote',
      value: [
        'They lifted our brand and our\nsales in a single quarter.',
        'Sharp strategy, friendly team,\nand results we can measure.',
        'Every campaign landed on time\nand beat our targets.',
      ],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const whatTheySay = themed(W, H, reviewsSpec, (t): Nodes[] => {
  const strong = bold(t.font('body'));
  const body = copy(t.font('body'));
  const quotes = t.list('quotes');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    button(t.copy('badge'), 410, 100, t.color('accent'), t.shade('text', FH.deep), t.font('body')),
    display(t.font('heading'))(t.copy('title'), 0, 200, W, 140, t.color('surface'), {
      align: 'center',
    }),
    t.list('names').map((name, index) => {
      const y = 420 + index * 230;
      const x = index === 1 ? 160 : 100;
      return [
        rect(x, y, 820, 196, t.color('surface'), { cornerRadius: 28, name: 'Review card' }),
        avatar(REVIEW_PHOTOS[index] ?? 'man-portrait-1', x + 90, y + 98, 54, t.color('accent')),
        strong(name, x + 175, y + 34, 360, 30, t.color('background')),
        rating(x + 610, y + 38, 26, 5, t.shade('accent', FH.mustardDark), 0.2),
        body(quotes[index] ?? '', x + 175, y + 82, 600, 26, t.color('text')),
      ];
    }),
    handle(t.copy('handle'), 1220, t.shade('accent', FH.mustardSoft), t.font('body')),
  ];
});
