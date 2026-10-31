import { linear } from '@/design';
import { line, POST_SIZE, rect, text } from '../../../kit';

export const TOMATO = {
  red: '#e4572e',
  deep: '#b63a1b',
  blush: '#ffd9cc',
  paper: '#f7f5f1',
  paperTop: '#fbfaf8',
  sketch: 'rgba(20,20,20,0.32)',
  ink: '#141414',
  note: '#f3f1ec',
  muted: '#55524d',
  white: '#ffffff',
  clear: 'rgba(0,0,0,0)',
};

export const { width: W, height: H } = POST_SIZE;

export const FONT = { label: 'Font', value: 'Space Grotesk' } as const;
export const MARKER = { label: 'Note font', value: 'Permanent Marker' } as const;
export const SCRIPT = { label: 'Script font', value: 'Caveat' } as const;

type TextStyle = NonNullable<Parameters<typeof text>[4]>;

export const writer =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    weight = 400,
    extra: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      fill,
      lineHeight: 1.25,
      ...extra,
    });

export type Say = ReturnType<typeof writer>;

export const estimateWidth = (content: string, size: number) => content.length * size * 0.56;

export const boxed = (
  say: Say,
  label: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  color: string,
) => {
  const width = estimateWidth(label, size) + size * 0.5;
  return [
    rect(x, y, width, size * 1.25, fill, { name: `${label} box`, cornerRadius: size * 0.12 }),
    say(label, x, y + size * 0.06, width, size, color, 700, { align: 'center', lineHeight: 1.1 }),
  ];
};

export const paperBackground = (paper: string, top: string, sketch: string) => [
  rect(0, 0, W, H, linear(160, top, paper), { name: 'Paper' }),
  line(0, 300, W, sketch, 2, { name: 'Sketch line', rotation: -2 }),
  line(0, 1080, W, sketch, 2, { name: 'Sketch line', rotation: 1.5 }),
  line(150, 0, H, sketch, 2, { name: 'Sketch line', rotation: 91 }),
  line(930, 0, H, sketch, 2, { name: 'Sketch line', rotation: 89 }),
];

export const arrowPill = (x: number, y: number, color: string, clear: string) => [
  rect(x, y, 200, 76, clear, {
    name: 'Arrow pill',
    cornerRadius: 38,
    stroke: color,
    strokeWidth: 3,
  }),
  line(x + 50, y + 38, 100, color, 4, { name: 'Arrow', arrowEnd: true }),
];
