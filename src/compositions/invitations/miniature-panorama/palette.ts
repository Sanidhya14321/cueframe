import type { MiniaturePanoramaProps } from '@/schemas';

type Rgb = readonly [number, number, number];

const INK = '#1b150f';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const parsed = new Map<string, Rgb>();

const parse = (color: string): Rgb => {
  const cached = parsed.get(color);
  if (cached !== undefined) {
    return cached;
  }
  const match = /^rgb\((\d+(?:\.\d+)?),(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)\)$/.exec(color);
  const rgb: Rgb =
    match === null
      ? [
          Number.parseInt(color.slice(1, 3), 16),
          Number.parseInt(color.slice(3, 5), 16),
          Number.parseInt(color.slice(5, 7), 16),
        ]
      : [Number(match[1]), Number(match[2]), Number(match[3])];
  parsed.set(color, rgb);
  return rgb;
};

export const mix = (from: string, to: string, amount: number): string => {
  const t = clamp01(amount);
  const a = parse(from);
  const b = parse(to);
  const channel = (index: 0 | 1 | 2) => Math.round(a[index] + (b[index] - a[index]) * t);
  return `rgb(${channel(0)},${channel(1)},${channel(2)})`;
};

export const darken = (color: string, amount: number): string => mix(color, INK, amount);

export const lighten = (color: string, amount: number): string => mix(color, '#ffffff', amount);

type Props = MiniaturePanoramaProps;

export type Paint = Pick<
  Props,
  | 'sky'
  | 'stars'
  | 'birds'
  | 'petals'
  | 'hills'
  | 'lake'
  | 'swans'
  | 'peacocks'
  | 'railing'
  | 'canopies'
  | 'pavilions'
  | 'trees'
  | 'flowers'
  | 'garden'
  | 'chandeliers'
  | 'garlands'
  | 'procession'
>;

const toneGroup = <Group extends Record<string, unknown>>(
  group: Group,
  tone: (color: string) => string,
): Group => {
  const entries = Object.entries(group).map(([key, value]) => [
    key,
    typeof value === 'string' && value.startsWith('#') ? tone(value) : value,
  ]);
  return Object.fromEntries(entries) as Group;
};

export const paintFrom = (props: Props): Paint => ({
  sky: props.sky,
  stars: props.stars,
  birds: props.birds,
  petals: props.petals,
  hills: props.hills,
  lake: props.lake,
  swans: props.swans,
  peacocks: props.peacocks,
  railing: props.railing,
  canopies: props.canopies,
  pavilions: props.pavilions,
  trees: props.trees,
  flowers: props.flowers,
  garden: props.garden,
  chandeliers: props.chandeliers,
  garlands: props.garlands,
  procession: props.procession,
});

export const nightPaint = (paint: Paint, night: Props['night']): Paint => {
  const tone = (color: string) => mix(color, night.tint, night.strength);
  const keep = new Set(['sky', 'stars', 'chandeliers']);
  const entries = Object.entries(paint).map(([key, group]) => [
    key,
    keep.has(key) ? group : toneGroup(group as Record<string, unknown>, tone),
  ]);
  return Object.fromEntries(entries) as Paint;
};
