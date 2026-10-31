import { useId } from 'react';
import type { BurningPaperRevealProps } from '@/schemas';
import { type BurnCues, type EdgePoint, edgeXAt } from './burn-cues';
import { mixHex, svgId } from './color';
import { PaperPrint } from './paper-print';

const fixed = (value: number): string => value.toFixed(2);

const sheetOutline = (width: number, height: number, bend: number): string =>
  [
    'M 0 0',
    `Q ${fixed(width * 0.5)} ${fixed(7 * bend)} ${fixed(width)} ${fixed(-4 * bend)}`,
    `Q ${fixed(width + 6 * bend)} ${fixed(height * 0.5)} ${fixed(width)} ${fixed(height)}`,
    `Q ${fixed(width * 0.5)} ${fixed(height + 9 * bend)} 0 ${fixed(height)}`,
    `Q ${fixed(4 * bend)} ${fixed(height * 0.5)} 0 0 Z`,
  ].join(' ');

const visiblePath = (edge: EdgePoint[], width: number, height: number): string => {
  const clamp = (x: number) => Math.min(width + 14, Math.max(-14, x));
  const first = edge[0];
  const points = edge.map((point) => `L ${fixed(clamp(point.x))} ${fixed(point.y)}`);
  return [
    'M -14 -14',
    `L ${fixed(clamp(first?.x ?? 0))} -14`,
    ...points,
    `L ${fixed(clamp(edge.at(-1)?.x ?? 0))} ${fixed(height + 14)}`,
    `L -14 ${fixed(height + 14)} Z`,
  ].join(' ');
};

const band = (
  edge: EdgePoint[],
  outer: (p: EdgePoint) => number,
  inner: (p: EdgePoint) => number,
) => {
  const a = edge.map((point) => `${fixed(outer(point))},${fixed(point.y)}`);
  const b = [...edge].reverse().map((point) => `${fixed(inner(point))},${fixed(point.y)}`);
  return `M ${a.join(' L ')} L ${b.join(' L ')} Z`;
};

const edgeLine = (edge: EdgePoint[], limit: number, offset = 0): string =>
  `M ${edge.map((point) => `${fixed(Math.min(point.x + offset, limit))},${fixed(point.y)}`).join(' L ')}`;

const BEND_STOPS: [number, string, number][] = [
  [0, 'shade', 0.2],
  [0.13, 'light', 0.14],
  [0.36, 'light', 0],
  [0.64, 'shade', 0.08],
  [0.86, 'light', 0.05],
  [1, 'shade', 0.18],
];

export const PaperSheet = ({ props, cues }: { props: BurningPaperRevealProps; cues: BurnCues }) => {
  const id = svgId(useId());
  const { paper, burn, flame } = props;
  const { width, height } = paper;
  const edge = cues.edge;
  const shadeColor = mixHex(paper.color, '#3c3a44', 0.55);
  const lipLight = mixHex(burn.char, '#9a8a7e', 0.55);
  const spillY = height * 0.22;
  const spillX = edgeXAt(edge, spillY, width + 40);
  const spill = flame.paperGlow * cues.strength * cues.flicker;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-burn`}>
          <path d={visiblePath(edge, width, height)} />
        </clipPath>
        <clipPath id={`${id}-sheet`}>
          <path d={sheetOutline(width, height, paper.bend)} />
        </clipPath>
        <linearGradient id={`${id}-bend`} x1="0" y1="0" x2="1" y2="0.18">
          {BEND_STOPS.map(([offset, tone, amount]) => (
            <stop
              key={offset}
              offset={offset}
              stopColor={tone === 'light' ? '#ffffff' : shadeColor}
              stopOpacity={amount * paper.bend * (tone === 'light' ? 1 : paper.shade * 1.6)}
            />
          ))}
        </linearGradient>
        <linearGradient id={`${id}-fall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shadeColor} stopOpacity={0.04 * paper.shade} />
          <stop offset="1" stopColor={shadeColor} stopOpacity={0.2 * paper.shade} />
        </linearGradient>
        <radialGradient id={`${id}-spill`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={mixHex(burn.ember, '#ffffff', 0.25)} stopOpacity="0.85" />
          <stop offset="0.45" stopColor={mixHex(burn.ember, '#ffffff', 0.45)} stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter
          id={`${id}-fibre`}
          x={-10}
          y={-10}
          width={width + 20}
          height={height + 20}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.38"
            numOctaves={2}
            seed={4}
            result="grain"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.016 0.028"
            numOctaves={3}
            seed={9}
            result="cloud"
          />
          <feComposite
            in="grain"
            in2="cloud"
            operator="arithmetic"
            k2={0.55}
            k3={0.45}
            result="mix"
          />
          <feColorMatrix
            in="mix"
            type="matrix"
            values="-0.55 0 0 0 1.27 -0.55 0 0 0 1.26 -0.55 0 0 0 1.24 0 0 0 0 1"
          />
        </filter>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={Math.max(0.5, burn.scorchWidth * 0.34)} />
        </filter>
        <filter id={`${id}-char`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id={`${id}-singe`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <g clipPath={`url(#${id}-sheet)`}>
        <g clipPath={`url(#${id}-burn)`}>
          <rect x={-10} y={-10} width={width + 20} height={height + 20} fill={paper.color} />
          <rect
            x={-10}
            y={-10}
            width={width + 20}
            height={height + 20}
            fill="#ffffff"
            filter={`url(#${id}-fibre)`}
            opacity={paper.fibre}
            style={{ mixBlendMode: 'multiply' }}
          />
          <PaperPrint props={props} />
          <rect x={-10} y={-10} width={width + 20} height={height + 20} fill={`url(#${id}-fall)`} />
          <rect x={-10} y={-10} width={width + 20} height={height + 20} fill={`url(#${id}-bend)`} />
          <ellipse
            cx={spillX - 30}
            cy={spillY}
            rx={300}
            ry={340}
            fill={`url(#${id}-spill)`}
            opacity={Math.min(1, spill)}
            style={{ mixBlendMode: 'multiply' }}
          />
          <path
            d={edgeLine(edge, width + burn.scorchWidth * 2)}
            fill="none"
            stroke={burn.scorch}
            strokeWidth={burn.scorchWidth * 2}
            strokeOpacity={0.8}
            filter={`url(#${id}-soft)`}
          />
          <path
            d={band(
              edge,
              (point) => point.x - point.char * 0.5,
              (point) => point.x - point.char * 1.9,
            )}
            fill={mixHex(burn.scorch, burn.char, 0.55)}
            opacity={0.8}
            filter={`url(#${id}-singe)`}
          />
          <path
            d={band(
              edge,
              (point) => point.x + 2,
              (point) => point.x - point.char,
            )}
            fill={burn.char}
            filter={`url(#${id}-char)`}
          />
        </g>
        {cues.lead < 1 ? (
          <g filter={`url(#${id}-char)`}>
            <path
              d={band(
                edge,
                (point) => point.x + point.ash,
                (point) => point.x - 1,
              )}
              fill={burn.char}
            />
            <path
              d={band(
                edge,
                (point) => point.x + point.ash * 0.7,
                (point) => point.x + point.ash * 0.25,
              )}
              fill={mixHex(burn.char, '#3a2a22', 0.6)}
              opacity={0.7}
            />
            <path
              d={edgeLine(edge, width + 200, 0)}
              fill="none"
              stroke={lipLight}
              strokeWidth={1.2}
              strokeOpacity={0.35 * (1 - cues.lead)}
              transform="translate(-3 0)"
            />
          </g>
        ) : null}
      </g>
    </g>
  );
};

export const PaperShadow = ({
  props,
  cues,
}: {
  props: BurningPaperRevealProps;
  cues: BurnCues;
}) => {
  const id = svgId(useId());
  const { paper } = props;
  const shape = visiblePath(cues.edge, paper.width, paper.height);
  return (
    <g opacity={paper.shadow}>
      <defs>
        <filter id={`${id}-wide`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="38" />
        </filter>
        <filter id={`${id}-near`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <g transform="translate(34 70)" opacity={0.75}>
        <path d={shape} fill="#06090f" filter={`url(#${id}-wide)`} />
      </g>
      <g transform="translate(14 26)" opacity={0.45}>
        <path d={shape} fill="#06090f" filter={`url(#${id}-near)`} />
      </g>
    </g>
  );
};
