import { random } from 'remotion';
import { curve } from './figure-rig';
import { type Gold, useSvgId, withAlpha } from './gold';
import type { Point } from './ornament';

const TOP = 84;
const BOTTOM = 884;

const RIGHT_SIDE: Point[] = [
  [1060, 104],
  [1196, 196],
  [1330, 360],
  [1408, 560],
  [1462, 760],
  [1548, 870],
];

const HEM: Point[] = [
  [1440, 892],
  [1330, 874],
  [1210, 896],
  [1090, 880],
  [960, 898],
  [830, 878],
  [700, 894],
  [580, 870],
  [470, 890],
];

const LEFT_SIDE: Point[] = [
  [372, 874],
  [458, 764],
  [510, 566],
  [588, 366],
  [722, 198],
  [856, 106],
];

const FOLD_TOPS = [0.16, 0.27, 0.37, 0.46, 0.55, 0.63, 0.72, 0.82];

export const Veil = ({ frame, lift, gold }: { frame: number; lift: number; gold: Gold }) => {
  const satinId = useSvgId('veil-satin');
  const shadeId = useSvgId('veil-shade');
  const clipId = useSvgId('veil-clip');
  if (lift >= 1) {
    return null;
  }
  const move = ([x, y]: Point, index: number): Point => {
    const hang = (y - TOP) / (BOTTOM - TOP);
    const flutter = Math.sin(frame / 9 + hang * 4 + index) * 26 * lift * hang;
    const breathe = Math.sin(frame / 26 + index * 0.7) * 3 * hang;
    return [
      960 + (x - 960) * (1 - 0.5 * lift * hang) + flutter + breathe,
      y - lift * 1500 - lift * hang * 380,
    ];
  };
  const outline = [[960, TOP] as Point, ...RIGHT_SIDE, ...HEM, ...LEFT_SIDE].map(move);
  const hemMoved = HEM.map((point, index) => move(point, index + 7));
  const folds = FOLD_TOPS.map((share, index) => {
    const anchor = move([960 + (share - 0.5) * 300, 120 + Math.abs(share - 0.5) * 150], index);
    const end = hemMoved[Math.round((1 - share) * (HEM.length - 1))] ?? anchor;
    const bend = (random(`veil-fold-${index}`) - 0.5) * 90;
    const middle: Point = [(anchor[0] + end[0]) / 2 + bend, (anchor[1] + end[1]) / 2];
    return curve([anchor, middle, [end[0], end[1] - 6]], false);
  });
  const left = outline.reduce((min, [x]) => Math.min(min, x), 1920);
  const right = outline.reduce((max, [x]) => Math.max(max, x), 0);
  const stops: [number, string][] = [
    [0, gold.deep],
    [0.1, gold.mid],
    [0.2, gold.light],
    [0.28, gold.mid],
    [0.38, gold.deep],
    [0.48, gold.light],
    [0.55, gold.highlight],
    [0.62, gold.light],
    [0.72, gold.mid],
    [0.84, gold.deep],
    [0.93, gold.mid],
    [1, gold.deep],
  ];
  const path = curve(outline, true);
  return (
    <g
      transform={`rotate(${(lift * 7).toFixed(3)} 960 ${(TOP - lift * 1500).toFixed(1)})`}
      opacity={Math.min(1, (1 - lift) / 0.3)}
    >
      <defs>
        <linearGradient
          id={satinId}
          gradientUnits="userSpaceOnUse"
          x1={left}
          y1={0}
          x2={right}
          y2={0}
        >
          {stops.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
        <linearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={gold.highlight} stopOpacity={0.4} />
          <stop offset="0.3" stopColor={gold.highlight} stopOpacity={0.05} />
          <stop offset="0.75" stopColor="#000000" stopOpacity={0.12} />
          <stop offset="1" stopColor="#000000" stopOpacity={0.45} />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
      </defs>
      <path d={path} fill={`url(#${satinId})`} />
      <path d={path} fill={`url(#${shadeId})`} />
      <g fill="none" strokeLinecap="round" clipPath={`url(#${clipId})`}>
        {folds.map((d, index) => (
          <g key={index.toString()}>
            <path d={d} stroke={withAlpha(gold.deep, 0.45)} strokeWidth={14 + (index % 3) * 6} />
            <path
              d={d}
              transform="translate(9 2)"
              stroke={withAlpha(gold.highlight, 0.28)}
              strokeWidth={4}
            />
          </g>
        ))}
      </g>
      <path d={path} fill="none" stroke={withAlpha(gold.deep, 0.75)} strokeWidth={2} />
    </g>
  );
};
