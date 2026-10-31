import { linear } from '@/design';
import {
  circle,
  icon,
  POST_SIZE,
  poly,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const TAN = {
  navy: '#0f1b3d',
  ink: '#0a1128',
  tangerine: '#ff7a1a',
  peach: '#ffb27a',
  cream: '#fff4e8',
  paper: '#fbf7f2',
  white: '#ffffff',
  slate: '#55607a',
};

const HEAD = 'Urbanist';
const BODY = 'Work Sans';
export const { width: W, height: H } = POST_SIZE;

export const HEADING_FONT = { label: 'Heading font', value: HEAD } as const;
export const BODY_FONT = { label: 'Body font', value: BODY } as const;
export const HASHTAG = { label: 'Hashtag', value: '#BuildBoldly' } as const;

export const hashtag = (label: string, y: number, color: string, fontFamily: string) =>
  text(label, 0, y, W, {
    fontFamily,
    fontSize: 38,
    fontWeight: 800,
    fill: color,
    align: 'center',
  });

type Point = readonly [number, number];

const cut = (a: Point, b: Point, axis: 0 | 1, limit: number): Point => {
  const t = (limit - a[axis]) / (b[axis] - a[axis]);
  return axis === 0 ? [limit, a[1] + t * (b[1] - a[1])] : [a[0] + t * (b[0] - a[0]), limit];
};

const clipToCanvas = (points: readonly Point[]): Point[] => {
  const edges: readonly { axis: 0 | 1; limit: number; keep: (value: number) => boolean }[] = [
    { axis: 0, limit: 0, keep: (value) => value >= 0 },
    { axis: 0, limit: W, keep: (value) => value <= W },
    { axis: 1, limit: 0, keep: (value) => value >= 0 },
    { axis: 1, limit: H, keep: (value) => value <= H },
  ];
  return edges.reduce<Point[]>(
    (input, edge) =>
      input.flatMap((current, index) => {
        const previous = input[(index + input.length - 1) % input.length] ?? current;
        const currentIn = edge.keep(current[edge.axis]);
        const previousIn = edge.keep(previous[edge.axis]);
        if (currentIn) {
          return previousIn ? [current] : [cut(previous, current, edge.axis, edge.limit), current];
        }
        return previousIn ? [cut(previous, current, edge.axis, edge.limit)] : [];
      }),
    [...points],
  );
};

interface TapeStyle {
  fill: string;
  color: string;
  shade: string;
  fontFamily: string;
}

const tape = (
  label: string,
  cx: number,
  cy: number,
  degrees: number,
  style: TapeStyle,
  shift = 0,
) => {
  const radians = (degrees * Math.PI) / 180;
  const dx = Math.cos(radians);
  const dy = Math.sin(radians);
  const half = 1600;
  const thick = 50;
  const corners: Point[] = [
    [cx - dx * half - dy * thick, cy - dy * half + dx * thick],
    [cx + dx * half - dy * thick, cy + dy * half + dx * thick],
    [cx + dx * half + dy * thick, cy + dy * half - dx * thick],
    [cx - dx * half + dy * thick, cy - dy * half - dx * thick],
  ];
  return [
    poly(clipToCanvas(corners), style.fill, { name: 'Tape', ...shadow(20, 6, style.shade) }),
    rotateNodes(degrees, cx + dx * shift, cy + dy * shift, [
      text(label, cx + dx * shift - 300, cy + dy * shift - 27, 600, {
        fontFamily: style.fontFamily,
        fontSize: 44,
        fontWeight: 500,
        fill: style.color,
        align: 'center',
        lineHeight: 1.2,
      }),
    ]),
  ];
};

const trapsSpec = {
  colors: {
    background: {
      value: TAN.tangerine,
      hint: 'Orange backdrop gradient',
    },
    primary: {
      value: TAN.navy,
      hint: 'Dark tapes, the words on the light tapes and the to Dodge line',
    },
    surface: {
      value: TAN.cream,
      hint: 'Light tapes (the cream one and its white twin)',
    },
    text: {
      value: TAN.white,
      hint: 'Brand Traps title and the words on the dark tapes',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    traps: {
      label: 'Trap',
      value: ['No Clear Offer', 'Mixed Messaging', 'Bland Visuals', 'Slow Replies'],
    },
    title: { label: 'Title', value: 'Brand Traps' },
    subtitle: { label: 'Second title line', value: 'to Dodge' },
  },
} as const satisfies ThemeSpec;

export const brandTraps = themed(W, H, trapsSpec, (t) => {
  const [offer = '', messaging = '', visuals = '', replies = ''] = t.list('traps');
  const tapeShade = t.shade('primary', 'rgba(10,17,40,0.25)');
  const fontFamily = t.font('body');
  const dark = { color: t.color('text'), shade: tapeShade, fontFamily };
  const light = { color: t.color('primary'), shade: tapeShade, fontFamily };
  const title = (content: string, y: number, fill: string) =>
    text(content, 380, y, 620, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 800,
      fill,
      align: 'right',
      lineHeight: 1,
    });
  return [
    rect(
      0,
      0,
      W,
      H,
      linear(
        160,
        t.shade('background', TAN.peach),
        t.color('background'),
        t.shade('background', '#e85d04'),
      ),
      { name: 'Background' },
    ),
    tape(offer, 260, 640, -66, { ...dark, fill: t.shade('primary', TAN.ink) }, -360),
    tape(messaging, 520, 300, 32, { ...dark, fill: t.color('primary') }),
    tape(visuals, 520, 560, -18, { ...light, fill: t.color('surface') }),
    tape(replies, 600, 800, 10, { ...light, fill: t.shade('surface', TAN.white) }, 100),
    title(t.copy('title'), 1010, t.color('text')),
    title(t.copy('subtitle'), 1110, t.color('primary')),
  ];
});

const insightSpec = {
  colors: {
    background: {
      value: TAN.tangerine,
      hint: 'Orange backdrop gradient and the bolt badge',
    },
    primary: {
      value: TAN.navy,
      hint: 'Top circle, the Imagination word and the hashtag',
    },
    surface: {
      value: TAN.cream,
      hint: 'Bottom circle and the ring around the bolt badge',
    },
    text: {
      value: TAN.white,
      hint: 'Insight word and the bolt icon',
    },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    top: { label: 'Top word', value: 'Insight' },
    bottom: { label: 'Bottom word', value: 'Imagination' },
    hashtag: HASHTAG,
  },
} as const satisfies ThemeSpec;

export const insightImagination = themed(W, H, insightSpec, (t) => {
  const word = (content: string, y: number, size: number, fill: string) =>
    text(content, 0, y, W, {
      fontFamily: t.font('heading'),
      fontSize: size,
      fontWeight: 800,
      fill,
      align: 'center',
    });
  return [
    rect(0, 0, W, H, linear(180, t.shade('background', TAN.peach), t.color('background')), {
      name: 'Background',
    }),
    circle(540, 450, 280, t.color('primary'), {
      name: 'Top circle',
      ...shadow(40, 16, t.shade('primary', 'rgba(10,17,40,0.3)')),
    }),
    circle(540, 890, 280, t.color('surface'), {
      name: 'Bottom circle',
      ...shadow(40, 16, t.shade('primary', 'rgba(10,17,40,0.25)')),
    }),
    word(t.copy('top'), 330, 76, t.color('text')),
    word(t.copy('bottom'), 900, 68, t.color('primary')),
    circle(540, 660, 52, t.color('background'), {
      name: 'Bolt badge',
      stroke: t.color('surface'),
      strokeWidth: 6,
    }),
    icon('zap', 510, 630, 60, t.color('text'), { strokeWidth: 2.4 }),
    hashtag(t.copy('hashtag'), 1235, t.color('primary'), t.font('heading')),
  ];
});
