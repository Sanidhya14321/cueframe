import {
  brushOutline,
  hash,
  noise,
  type Point,
  signedHash,
  slicePath,
  smoothstep,
} from './ink-geometry';

const ERASE_CHUNKS = 14;
const ERASE_SPAN = 0.4;
const FLECK_LIMIT = 9;

export const strokeWidthAt = (width: number, seed: number, t: number): number =>
  width *
  (0.38 + 0.62 * smoothstep(0, 0.07, t)) *
  (0.42 + 0.58 * (1 - smoothstep(0.78, 1, t))) *
  (1 + 0.22 * noise(seed, t * 5));

const outline = (
  points: readonly Point[],
  from: number,
  to: number,
  width: number,
  seed: number,
): string => {
  const part = slicePath(points, from, to);
  return brushOutline(part, (index, count) =>
    strokeWidthAt(width, seed, from + ((to - from) * index) / Math.max(1, count - 1)),
  );
};

const eraseFragments = (erase: number, draw: number, seed: number) =>
  Array.from({ length: ERASE_CHUNKS }, (_, chunk) => {
    const threshold = (1 - ERASE_SPAN) * ((0.75 * chunk) / ERASE_CHUNKS + 0.25 * hash(seed, chunk));
    const gone = Math.min(1, Math.max(0, (erase - threshold) / ERASE_SPAN));
    const from = (draw * chunk) / ERASE_CHUNKS;
    const to = (draw * (chunk + 1)) / ERASE_CHUNKS;
    const gap = (to - from) * 0.5 * gone;
    return { from: from + gap * hash(seed, chunk + 40), to: to - gap, gone };
  }).filter((fragment) => fragment.gone < 1);

export interface InkStrokeProps {
  points: readonly Point[];
  width: number;
  color: string;
  leadColor: string;
  draw: number;
  erase: number;
  leadOpacity: number;
  leadOffset: number;
  flecks: number;
  seed: number;
}

export const InkStroke = ({
  points,
  width,
  color,
  leadColor,
  draw,
  erase,
  leadOpacity,
  leadOffset,
  flecks,
  seed,
}: InkStrokeProps) => {
  if (draw <= 0 || erase >= 1 || points.length < 2) {
    return null;
  }
  const fleckCount = Math.round(flecks * FLECK_LIMIT);
  return (
    <g>
      {leadOpacity > 0 ? (
        <path
          d={outline(
            points,
            Math.max(0, draw - 0.09),
            Math.min(1, draw + 0.02),
            width * 0.78,
            seed + 5,
          )}
          fill={leadColor}
          opacity={leadOpacity}
          transform={`translate(${leadOffset} ${-leadOffset * 0.55})`}
        />
      ) : null}
      {eraseFragments(erase, draw, seed).map((fragment) => (
        <path
          key={fragment.from}
          d={outline(points, fragment.from, fragment.to, width * (1 - fragment.gone), seed)}
          fill={color}
          opacity={1 - fragment.gone}
        />
      ))}
      {Array.from({ length: fleckCount }, (_, index) => {
        const at = 0.12 + (0.86 * (index + hash(seed + 31, index))) / FLECK_LIMIT;
        const shown = smoothstep(at, at + 0.06, draw);
        if (shown <= 0) {
          return null;
        }
        const anchor = slicePath(points, 0, at).at(-1) ?? (points[0] as Point);
        const reach = (0.7 + hash(seed + index * 7, 1) * 2.2) * width;
        const angle = hash(seed + index * 13, 2) * Math.PI * 2;
        const radius = width * (0.08 + 0.24 * hash(seed + index * 3, 3));
        const cx = anchor.x + Math.cos(angle) * reach;
        const cy = anchor.y + Math.sin(angle) * reach;
        return (
          <ellipse
            key={`fleck-${index.toString()}`}
            cx={cx}
            cy={cy}
            rx={radius * (1.4 + signedHash(seed, index) * 0.4)}
            ry={radius}
            transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
            fill={index % 3 === 0 ? color : leadColor}
            opacity={flecks * shown}
          />
        );
      })}
    </g>
  );
};

export const InkFilter = ({
  id,
  seed,
  roughness,
  dryness,
}: {
  id: string;
  seed: number;
  roughness: number;
  dryness: number;
}) => {
  const contrast = 3 + dryness * 5;
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.045"
        numOctaves={2}
        seed={seed}
        result="warp"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="warp"
        scale={roughness}
        xChannelSelector="R"
        yChannelSelector="G"
        result="edge"
      />
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.55 0.9"
        numOctaves={1}
        seed={seed + 3}
        result="grain"
      />
      <feColorMatrix
        in="grain"
        type="matrix"
        values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${-contrast} 0 0 0 ${contrast * 0.62 + 0.75}`}
        result="bristles"
      />
      <feComposite in="edge" in2="bristles" operator="in" />
    </filter>
  );
};
