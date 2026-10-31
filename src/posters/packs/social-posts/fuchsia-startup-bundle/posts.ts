import { type Fill, linear } from '@/design';
import {
  avatar,
  type ColorKey,
  circle,
  icon,
  type Nodes,
  path,
  photo,
  rect,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { POST, type PostTheme } from '../lagoon-saas-stats/theme';

export const { width: W, height: H } = POST;

export interface Ink<K extends ColorKey> {
  color: (key: K) => string;
  shade: (key: K, exact: string) => string;
}

export const pageFill = (theme: PostTheme): Fill =>
  theme.backgroundEnd === undefined
    ? theme.background
    : linear(200, theme.background, theme.backgroundEnd);

export const backdrop = (ink: Ink<'background'>, fill: Fill) =>
  rect(
    0,
    0,
    W,
    H,
    typeof fill === 'string'
      ? ink.color('background')
      : {
          ...fill,
          stops: fill.stops.map((stop, index) => ({
            ...stop,
            color: index === 0 ? ink.color('background') : ink.shade('background', stop.color),
          })),
        },
    { name: 'Background' },
  );

export const fontsOf = (theme: PostTheme) => ({
  heading: { label: 'Heading font', value: theme.headFont },
  body: { label: 'Body font', value: theme.bodyFont },
});

export const head = (fontFamily: string, size: number, fill: string) => ({
  fontFamily,
  fontSize: size,
  fontWeight: 800,
  fill,
  lineHeight: 1.08,
});

export const copyStyle = (fontFamily: string, size: number, fill: string, weight = 400) => ({
  fontFamily,
  fontSize: size,
  fontWeight: weight,
  fill,
  lineHeight: 1.35,
});

const ringSegment = (
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  from: number,
  to: number,
) => {
  const point = (radius: number, degrees: number) => {
    const radians = (degrees * Math.PI) / 180;
    return `${(cx + radius * Math.cos(radians)).toFixed(1)} ${(cy - radius * Math.sin(radians)).toFixed(1)}`;
  };
  return `M${point(outer, from)} A${outer} ${outer} 0 0 1 ${point(outer, to)} L${point(inner, to)} A${inner} ${inner} 0 0 0 ${point(inner, from)} Z`;
};

const POINT_SPOTS = [
  { x: 110, y: 560 },
  { x: 560, y: 700 },
] as const;

export const benefitsDonut = (theme: PostTheme): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: theme.background,
          hint: 'Page gradient; its dark shade colors the share numbers',
        },
        surface: { value: theme.surface, hint: 'The larger share of the half donut' },
        primary: { value: theme.brand, hint: 'for You and the smaller share of the half donut' },
        text: {
          value: theme.text,
          hint: 'Benefits and the two points; its pale shade colors the intro',
        },
      },
      fonts: fontsOf(theme),
      copy: {
        intro: { label: 'Intro', value: 'Measurable gains for\nteams that ship fast.' },
        title: { label: 'Title', value: 'Benefits' },
        highlight: { label: 'Highlighted title', value: 'for You' },
        points: {
          label: 'Point',
          value: [
            'Ship faster with fewer\nhandoffs and meetings.',
            'Turn expert know-how\ninto results you can see.',
          ],
        },
        shares: { label: 'Share', value: ['60%', '40%'] },
      },
    } satisfies ThemeSpec,
    (t) => {
      const shares = t.list('shares');
      return [
        backdrop(t, pageFill(theme)),
        text(
          t.copy('intro'),
          560,
          90,
          440,
          copyStyle(t.font('body'), 28, t.shade('text', theme.muted), 500),
        ),
        text(t.copy('title'), 80, 260, 900, head(t.font('heading'), 104, t.color('text'))),
        text(t.copy('highlight'), 80, 372, 900, head(t.font('heading'), 104, t.color('primary'))),
        t
          .list('points')
          .map((point, index) =>
            text(
              point,
              POINT_SPOTS[index]?.x ?? 0,
              POINT_SPOTS[index]?.y ?? 0,
              460,
              copyStyle(t.font('body'), 32, t.color('text')),
            ),
          ),
        path(
          ringSegment(540, 1350, 400, 240, 180, 76),
          0,
          0,
          W,
          H,
          t.color('surface'),
          { width: W, height: H },
          { name: 'Share A' },
        ),
        path(
          ringSegment(540, 1350, 400, 240, 72, 0),
          0,
          0,
          W,
          H,
          t.color('primary'),
          { width: W, height: H },
          { name: 'Share B' },
        ),
        text(shares[0] ?? '', 253, 1066, 180, {
          ...head(t.font('heading'), 60, t.shade('background', theme.ink)),
          align: 'center',
        }),
        text(shares[1] ?? '', 710, 1130, 180, {
          ...head(t.font('heading'), 60, t.shade('background', theme.brandText)),
          align: 'center',
        }),
      ];
    },
  );

const roleList = (
  ink: Ink<'primary' | 'text'>,
  fontFamily: string,
  items: readonly string[],
  y: number,
) =>
  items.map((item, index) => [
    icon('arrow-right', 470, y + index * 54 + 4, 30, ink.color('primary'), { strokeWidth: 2.6 }),
    text(item, 516, y + index * 54, 500, copyStyle(fontFamily, 30, ink.color('text'), 500)),
  ]);

export const hiringVertical = (theme: PostTheme): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: theme.deep, hint: 'Page' },
        primary: { value: theme.brand, hint: 'The tall HIRING word and the list arrows' },
        text: {
          value: theme.text,
          hint: 'Headings and list rows; its pale shade colors the contact line',
        },
      },
      fonts: {
        ...fontsOf(theme),
        display: { label: 'Display font', value: 'Anton' },
      },
      copy: {
        kicker: { label: 'Kicker', value: 'We are' },
        title: { label: 'Title', value: 'HIRING' },
        role: { label: 'Role', value: 'Growth Marketer' },
        highlights: {
          label: 'Role highlight',
          value: ['Weekly launch campaigns', 'Paid social experiments', 'Three product releases'],
        },
        dutiesTitle: { label: 'Duties heading', value: 'Responsibilities' },
        duties: {
          label: 'Duty',
          value: ['Own the growth funnel', 'Report wins every week', 'Mentor two juniors'],
        },
        closing: { label: 'Closing heading', value: 'Join Our Team' },
        contact: { label: 'Contact', value: 'Send your CV to\njobs@orbitly.io' },
      },
    } satisfies ThemeSpec,
    (t) => [
      backdrop(t, theme.deep),
      text(t.copy('kicker'), 80, 360, 340, head(t.font('heading'), 48, t.color('text'))),
      text(t.copy('title'), 70, 1290, 900, {
        fontFamily: t.font('display'),
        fontSize: 300,
        fontWeight: 400,
        fill: t.color('primary'),
        rotation: -90,
        lineHeight: 1,
        letterSpacing: 4,
      }),
      photo('team-2', 470, 90, 530, 300, { cornerRadius: 22 }),
      text(t.copy('role'), 470, 430, 560, head(t.font('heading'), 56, t.color('text'))),
      roleList(t, t.font('body'), t.list('highlights'), 510),
      text(t.copy('dutiesTitle'), 470, 730, 560, head(t.font('heading'), 46, t.color('text'))),
      roleList(t, t.font('body'), t.list('duties'), 800),
      text(t.copy('closing'), 470, 1040, 560, head(t.font('heading'), 46, t.color('text'))),
      text(
        t.copy('contact'),
        470,
        1110,
        560,
        copyStyle(t.font('body'), 32, t.shade('text', theme.muted), 500),
      ),
    ],
  );

const globeDots = (color: string, cx: number, cy: number, radius: number): Nodes[] => {
  const spacing = 34;
  const nodes: Nodes[] = [];
  for (let y = cy - radius; y <= cy + radius; y += spacing) {
    for (let x = cx - radius; x <= cx + radius; x += spacing) {
      const inside = (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2;
      const land = Math.sin(x * 0.012) + Math.cos(y * 0.016 + x * 0.004) > -0.15;
      if (inside) {
        nodes.push(circle(x, y, 6, color, { name: 'Map dot', opacity: land ? 0.85 : 0.22 }));
      }
    }
  }
  return nodes;
};

export const clearProcess = (theme: PostTheme): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: theme.background,
          hint: 'Page gradient',
        },
        primary: {
          value: theme.brand,
          hint: 'Strategic. Effective. and the rings around two of the photos',
        },
        text: {
          value: theme.text,
          hint: 'Clear process and the rings around the other two photos; its pale shade colors the globe dots and the closing line',
        },
      },
      fonts: fontsOf(theme),
      copy: {
        title: { label: 'Title', value: 'Clear process' },
        subtitle: { label: 'Subtitle', value: 'Strategic. Effective.' },
        closing: { label: 'Closing line', value: 'From first call to launch in four clear steps.' },
      },
    } satisfies ThemeSpec,
    (t) => [
      backdrop(t, pageFill(theme)),
      text(t.copy('title'), 0, 110, W, {
        ...head(t.font('heading'), 90, t.color('text')),
        align: 'center',
      }),
      text(t.copy('subtitle'), 0, 220, W, {
        ...head(t.font('heading'), 54, t.color('primary')),
        align: 'center',
      }),
      globeDots(t.shade('text', theme.muted), 540, 790, 360),
      avatar('woman-portrait-1', 300, 620, 74, t.color('primary')),
      avatar('man-portrait-1', 810, 580, 64, t.shade('text', theme.surface)),
      avatar('woman-portrait-4', 340, 1010, 64, t.shade('text', theme.surface)),
      avatar('man-portrait-3', 770, 990, 76, t.color('primary')),
      text(t.copy('closing'), 0, 1230, W, {
        ...copyStyle(t.font('body'), 30, t.shade('text', theme.muted), 500),
        align: 'center',
      }),
    ],
  );
