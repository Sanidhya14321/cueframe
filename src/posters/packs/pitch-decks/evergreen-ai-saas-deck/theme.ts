import { type Fill, linear, NO_FILTERS } from '@/design';
import { type ColorKey, dots, rect, SLIDE_SIZE, text } from '../../../kit';

export const EV = {
  ink: '#0f2a25',
  muted: '#5c726c',
  mint: '#5fd3a8',
  emerald: '#2f9e7c',
  forest: '#0b2622',
  forestMid: '#1d5c50',
  paper: '#f2f7f5',
  line: '#d3e3dd',
  soft: 'rgba(255,255,255,0.74)',
  white: '#ffffff',
};

export const { width: SW, height: SH } = SLIDE_SIZE;

export const HEADING = { label: 'Heading font', value: 'Urbanist' } as const;
export const BODY = { label: 'Body font', value: 'Work Sans' } as const;

type TextStyle = NonNullable<Parameters<typeof text>[4]>;

const face =
  (fontWeight: number, lineHeight: number) =>
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: Fill,
    extra: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight,
      fill,
      lineHeight,
      ...extra,
    });

const headFace = face(700, 1.08);
const bodyFace = face(400, 1.4);

export const fonts = (t: { font: (key: 'heading' | 'body') => string }) => ({
  head: headFace(t.font('heading')),
  body: bodyFace(t.font('body')),
});

export const headings = (t: { font: (key: 'heading') => string }) => headFace(t.font('heading'));

export const GRAY = { filters: { ...NO_FILTERS, grayscale: 1 } };

export interface Ink<K extends ColorKey> {
  color: (key: K) => string;
  shade: (key: K, exact: string) => string;
}

export const lightBg = (ink: Ink<'background' | 'primary'>) => [
  rect(0, 0, SW, SH, linear(160, ink.color('background'), ink.shade('background', EV.paper)), {
    name: 'Background',
  }),
  dots(1480, 700, 12, 10, 34, ink.shade('primary', 'rgba(47,158,124,0.13)'), 4),
];

export const darkBg = (ink: Ink<'background'>) =>
  rect(
    0,
    0,
    SW,
    SH,
    linear(
      180,
      ink.color('background'),
      ink.color('background'),
      ink.shade('background', EV.forestMid),
    ),
    { name: 'Background' },
  );

export const glass = (
  ink: Ink<'primary' | 'text'>,
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 24,
) =>
  rect(
    x,
    y,
    width,
    height,
    linear(
      180,
      ink.shade('primary', 'rgba(95,211,168,0.42)'),
      ink.shade('primary', 'rgba(95,211,168,0.08)'),
    ),
    {
      name: 'Glass tile',
      cornerRadius: radius,
      stroke: ink.shade('text', 'rgba(255,255,255,0.2)'),
      strokeWidth: 2,
    },
  );
