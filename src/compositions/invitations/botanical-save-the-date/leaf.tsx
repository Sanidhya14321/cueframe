import { fixed, leafHalf, leafOutline, type Point, seeded, shade, tint } from './paint';

export interface Greens {
  id: string;
  base: string;
}

const LEAF_TONES = 3;

const toneId = (greens: Greens, tone: number): string => `${greens.id}-tone-${tone % LEAF_TONES}`;

export const LeafDefs = ({ greens }: { greens: Greens }) => {
  const tones = [
    [shade(greens.base, 0.4), greens.base, tint(greens.base, 0.34)],
    [shade(greens.base, 0.22), tint(greens.base, 0.16), tint(greens.base, 0.5)],
    [shade(greens.base, 0.55), shade(greens.base, 0.2), tint(greens.base, 0.12)],
  ];
  return (
    <>
      {tones.map(([root, middle, tip], index) => (
        <linearGradient key={root + String(index)} id={toneId(greens, index)} x1="0" x2="1">
          <stop offset="0" stopColor={root} stopOpacity={0.95} />
          <stop offset="0.5" stopColor={middle} stopOpacity={0.88} />
          <stop offset="1" stopColor={tip} stopOpacity={0.8} />
        </linearGradient>
      ))}
    </>
  );
};

export interface LeafSpec {
  at: Point;
  angle: number;
  length: number;
  width: number;
  tone: number;
  lean: number;
}

export const WatercolorLeaf = ({
  leaf,
  greens,
  grow = 1,
}: {
  leaf: LeafSpec;
  greens: Greens;
  grow?: number;
}) => {
  if (grow <= 0) {
    return null;
  }
  const outline = leafOutline(leaf.length, leaf.width, leaf.lean);
  const edge = shade(greens.base, 0.5);
  const veins = [0.26, 0.44, 0.62, 0.78].map((t) => {
    const x = leaf.length * t;
    const reach = leaf.width * 0.4 * (1 - t * 0.55);
    return `M${fixed(x)} 0 Q${fixed(x + reach * 0.5)} ${fixed(-reach * 0.5)} ${fixed(x + reach * 0.9)} ${fixed(-reach)} M${fixed(x)} 0 Q${fixed(x + reach * 0.5)} ${fixed(reach * 0.5)} ${fixed(x + reach * 0.9)} ${fixed(reach)}`;
  });
  return (
    <g
      transform={`translate(${fixed(leaf.at[0])} ${fixed(leaf.at[1])}) rotate(${fixed(leaf.angle)}) scale(${grow.toFixed(4)})`}
      opacity={Math.min(1, grow * 1.6)}
    >
      <path d={outline} fill={`url(#${toneId(greens, leaf.tone)})`} />
      <path
        d={leafHalf(leaf.length, leaf.width, leaf.lean)}
        fill={edge}
        fillOpacity={0.2 + (leaf.tone % 2) * 0.06}
      />
      <g transform={`translate(${fixed(leaf.length * 0.34)} ${fixed(leaf.width * 0.06)})`}>
        <path
          d={leafOutline(leaf.length * 0.5, leaf.width * 0.42, -leaf.lean)}
          fill={tint(greens.base, 0.55)}
          fillOpacity={0.22}
        />
      </g>
      <path d={veins.join(' ')} fill="none" stroke={edge} strokeOpacity={0.16} strokeWidth={1.1} />
      <path d={outline} fill="none" stroke={edge} strokeOpacity={0.42} strokeWidth={1.6} />
      <path
        d={`M${fixed(leaf.length * 0.02)} 0 Q${fixed(leaf.length * 0.5)} ${fixed(leaf.width * 0.05)} ${fixed(leaf.length * 0.9)} 0`}
        fill="none"
        stroke={tint(greens.base, 0.45)}
        strokeOpacity={0.55}
        strokeWidth={1.6}
      />
    </g>
  );
};

export const GhostLeaf = ({ leaf, color }: { leaf: LeafSpec; color: string }) => (
  <g
    transform={`translate(${fixed(leaf.at[0])} ${fixed(leaf.at[1])}) rotate(${fixed(leaf.angle)})`}
  >
    <path
      d={leafOutline(leaf.length, leaf.width, leaf.lean)}
      fill={color}
      fillOpacity={0.22 + (leaf.tone % 3) * 0.06}
    />
    <path
      d={leafHalf(leaf.length, leaf.width, leaf.lean)}
      fill={shade(color, 0.2)}
      fillOpacity={0.08}
    />
  </g>
);

export const LineLeaf = ({
  leaf,
  color,
  weight,
}: {
  leaf: LeafSpec;
  color: string;
  weight: number;
}) => {
  const veins = [0.3, 0.5, 0.7].map((t) => {
    const x = leaf.length * t;
    const reach = leaf.width * 0.32 * (1 - t * 0.5);
    return `M${fixed(x)} 0 L${fixed(x + reach)} ${fixed(-reach)} M${fixed(x)} 0 L${fixed(x + reach)} ${fixed(reach)}`;
  });
  return (
    <g
      transform={`translate(${fixed(leaf.at[0])} ${fixed(leaf.at[1])}) rotate(${fixed(leaf.angle)})`}
      fill="none"
      stroke={color}
      strokeWidth={weight}
      strokeLinecap="round"
      opacity={0.62}
    >
      <path d={leafOutline(leaf.length, leaf.width, leaf.lean)} />
      <path d={`M0 0 L${fixed(leaf.length * 0.9)} 0`} strokeWidth={weight * 0.8} />
      <path d={veins.join(' ')} strokeWidth={weight * 0.6} />
    </g>
  );
};

const petalPath = (radius: number, width: number): string =>
  [
    'M0 0',
    `C${fixed(radius * 0.1)} ${fixed(-width * 0.7)} ${fixed(radius * 1.08)} ${fixed(-width * 0.85)} ${fixed(radius)} 0`,
    `C${fixed(radius * 1.08)} ${fixed(width * 0.85)} ${fixed(radius * 0.1)} ${fixed(width * 0.7)} 0 0`,
    'Z',
  ].join(' ');

export const Blossom = ({
  id,
  at,
  radius,
  rotation,
  petal,
  heart,
  open = 1,
}: {
  id: string;
  at: Point;
  radius: number;
  rotation: number;
  petal: string;
  heart: string;
  open?: number;
}) => {
  const random = seeded(Math.round(radius * 97 + rotation));
  const petals = Array.from({ length: 5 }, (_, index) => ({
    angle: index * 72 + (random() - 0.5) * 14,
    length: radius * (0.9 + random() * 0.18),
  }));
  const stamens = Array.from({ length: 11 }, (_, index) => ({
    angle: index * 32.7 + random() * 12,
    length: radius * (0.2 + random() * 0.14),
  }));
  const scale = 0.55 + 0.45 * open;
  return (
    <g
      transform={`translate(${fixed(at[0])} ${fixed(at[1])}) rotate(${fixed(rotation + (1 - open) * -24)}) scale(${scale.toFixed(4)})`}
      opacity={Math.min(1, open * 1.5)}
    >
      <defs>
        <linearGradient id={`${id}-petal`} x1="0" x2="1">
          <stop offset="0" stopColor={heart} stopOpacity={0.85} />
          <stop offset="0.32" stopColor={tint(heart, 0.62)} stopOpacity={0.82} />
          <stop offset="1" stopColor={petal} stopOpacity={0.92} />
        </linearGradient>
      </defs>
      {petals.map((item) => (
        <g key={item.angle} transform={`rotate(${fixed(item.angle)})`}>
          <path
            d={petalPath(item.length, item.length * 0.78)}
            fill={`url(#${id}-petal)`}
            stroke={shade(petal, 0.28)}
            strokeOpacity={0.22}
            strokeWidth={1.4}
          />
          <path
            d={`M${fixed(item.length * 0.18)} 0 L${fixed(item.length * 0.62)} 0`}
            stroke={heart}
            strokeOpacity={0.2}
            strokeWidth={1}
          />
        </g>
      ))}
      {stamens.map((item) => {
        const radians = (item.angle * Math.PI) / 180;
        const x = Math.cos(radians) * item.length;
        const y = Math.sin(radians) * item.length;
        return (
          <g key={item.angle}>
            <path
              d={`M0 0 L${fixed(x)} ${fixed(y)}`}
              stroke={shade(heart, 0.3)}
              strokeWidth={1}
              strokeOpacity={0.55}
            />
            <circle
              cx={fixed(x)}
              cy={fixed(y)}
              r={fixed(radius * 0.028)}
              fill={shade(heart, 0.4)}
            />
          </g>
        );
      })}
      <circle r={fixed(radius * 0.13)} fill={shade(heart, 0.25)} fillOpacity={0.85} />
    </g>
  );
};

export const Flecks = ({
  center,
  spread,
  count,
  color,
  seed,
}: {
  center: Point;
  spread: Point;
  count: number;
  color: string;
  seed: number;
}) => {
  const random = seeded(seed);
  const dots = Array.from({ length: count }, (_, index) => {
    const angle = random() * Math.PI * 2;
    const distance = random() ** 0.7;
    return {
      key: index,
      x: center[0] + Math.cos(angle) * spread[0] * distance,
      y: center[1] + Math.sin(angle) * spread[1] * distance,
      r: 0.9 + random() * random() * 4.2,
      opacity: 0.45 + random() * 0.5,
    };
  });
  return (
    <g fill={color}>
      {dots.map((dot) => (
        <circle
          key={dot.key}
          cx={fixed(dot.x)}
          cy={fixed(dot.y)}
          r={fixed(dot.r)}
          fillOpacity={dot.opacity}
        />
      ))}
    </g>
  );
};
