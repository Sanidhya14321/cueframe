import { fixed, mix, type Point, shade, tint } from './paint';

export interface Arch {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export const archCenter = (arch: Arch): Point => {
  const radius = (arch.right - arch.left) / 2;
  return [arch.left + radius, arch.top + radius];
};

const archPath = (arch: Arch): string => {
  const radius = (arch.right - arch.left) / 2;
  const springY = arch.top + radius;
  return `M${fixed(arch.left)} ${fixed(arch.bottom)} L${fixed(arch.left)} ${fixed(springY)} A${fixed(radius)} ${fixed(radius)} 0 0 1 ${fixed(arch.right)} ${fixed(springY)} L${fixed(arch.right)} ${fixed(arch.bottom)} Z`;
};

export const ArchCard = ({ arch, fill, border }: { arch: Arch; fill: string; border: string }) => {
  const outer: Arch = {
    left: arch.left - 8,
    right: arch.right + 22,
    top: arch.top - 22,
    bottom: arch.bottom + 14,
  };
  return (
    <g>
      <path d={archPath(outer)} fill={border} />
      <path d={archPath(arch)} fill={fill} />
      <path
        d={archPath(arch)}
        fill="none"
        stroke={shade(border, 0.08)}
        strokeOpacity={0.4}
        strokeWidth={1.5}
      />
    </g>
  );
};

const bananaOutline = (length: number, width: number): string => {
  const half = width / 2;
  return [
    'M0 0',
    `C${fixed(length * 0.1)} ${fixed(-half * 1.1)} ${fixed(length * 0.62)} ${fixed(-half * 1.25)} ${fixed(length)} ${fixed(-half * 0.1)}`,
    `C${fixed(length * 0.66)} ${fixed(half * 1.05)} ${fixed(length * 0.12)} ${fixed(half * 1.1)} 0 0`,
    'Z',
  ].join(' ');
};

const BananaLeaf = ({
  id,
  at,
  angle,
  length,
  width,
  color,
}: {
  id: string;
  at: Point;
  angle: number;
  length: number;
  width: number;
  color: string;
}) => {
  const veins = Array.from({ length: 48 }, (_, index) => {
    const t = 0.05 + (index / 48) * 0.92;
    const x = length * t;
    const bulge = Math.sin(Math.PI * Math.min(1, t * 1.05)) * width * 0.5;
    const sweep = length * 0.07;
    return {
      key: index,
      up: `M${fixed(x)} ${fixed(-width * 0.01)} Q${fixed(x + sweep * 0.6)} ${fixed(-bulge * 0.6)} ${fixed(x + sweep)} ${fixed(-bulge * 1.02)}`,
      down: `M${fixed(x)} ${fixed(width * 0.01)} Q${fixed(x + sweep * 0.6)} ${fixed(bulge * 0.55)} ${fixed(x + sweep)} ${fixed(bulge * 0.95)}`,
      light: index % 2 === 0,
    };
  });
  return (
    <g transform={`translate(${fixed(at[0])} ${fixed(at[1])}) rotate(${fixed(angle)})`}>
      <defs>
        <linearGradient id={`${id}-blade`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor={shade(color, 0.25)} stopOpacity={0.95} />
          <stop offset="0.5" stopColor={color} stopOpacity={0.9} />
          <stop offset="1" stopColor={tint(color, 0.35)} stopOpacity={0.85} />
        </linearGradient>
      </defs>
      <path d={bananaOutline(length, width)} fill={`url(#${id}-blade)`} />
      {veins.map((vein) => (
        <g
          key={vein.key}
          fill="none"
          stroke={vein.light ? tint(color, 0.7) : shade(color, 0.4)}
          strokeOpacity={vein.light ? 0.5 : 0.5}
          strokeWidth={vein.light ? 5 : 2.4}
        >
          <path d={vein.up} />
          <path d={vein.down} />
        </g>
      ))}
      <path
        d={`M${fixed(-length * 0.12)} 0 Q${fixed(length * 0.5)} ${fixed(-width * 0.04)} ${fixed(length * 0.98)} ${fixed(-width * 0.05)}`}
        fill="none"
        stroke={tint(color, 0.6)}
        strokeWidth={4}
        strokeOpacity={0.8}
      />
    </g>
  );
};

const Anthurium = ({
  id,
  at,
  angle,
  size,
  color,
  spadix,
}: {
  id: string;
  spadix: string;
  at: Point;
  angle: number;
  size: number;
  color: string;
}) => {
  const vein = shade(color, 0.3);
  const k = (value: number) => fixed(value * size);
  const heart = [
    'M0 0',
    `C${k(-0.2)} ${k(-0.42)} ${k(0.2)} ${k(-0.72)} ${k(0.56)} ${k(-0.52)}`,
    `C${k(0.86)} ${k(-0.34)} ${k(1.02)} ${k(-0.12)} ${k(1.22)} ${k(0.06)}`,
    `C${k(0.96)} ${k(0.2)} ${k(0.8)} ${k(0.4)} ${k(0.5)} ${k(0.52)}`,
    `C${k(0.18)} ${k(0.64)} ${k(-0.22)} ${k(0.4)} 0 0 Z`,
  ].join(' ');
  return (
    <g transform={`translate(${fixed(at[0])} ${fixed(at[1])}) rotate(${fixed(angle)})`}>
      <defs>
        <linearGradient id={`${id}-spathe`} x1="0" x2="1">
          <stop offset="0" stopColor={shade(color, 0.1)} />
          <stop offset="0.45" stopColor={color} />
          <stop offset="1" stopColor={tint(color, 0.6)} />
        </linearGradient>
      </defs>
      <path
        d={heart}
        fill={`url(#${id}-spathe)`}
        stroke={vein}
        strokeOpacity={0.55}
        strokeWidth={1.6}
      />
      {[-0.34, -0.14, 0.08, 0.28].map((bend) => (
        <path
          key={bend}
          d={`M${k(0.06)} 0 Q${k(0.5)} ${k(bend * 1.1)} ${k(0.98)} ${k(bend * 0.3 + 0.04)}`}
          fill="none"
          stroke={vein}
          strokeOpacity={0.32}
          strokeWidth={1.2}
        />
      ))}
      <path
        d={`M${k(0.08)} ${k(-0.02)} Q${k(0.2)} ${k(-0.42)} ${k(0.5)} ${k(-0.66)}`}
        fill="none"
        stroke={mix(color, spadix, 0.6)}
        strokeWidth={size * 0.11}
        strokeLinecap="round"
      />
    </g>
  );
};

export const TropicalBouquet = ({
  id,
  leaf,
  flower,
  stem,
  spadix,
}: {
  id: string;
  leaf: string;
  flower: string;
  stem: string;
  spadix: string;
}) => (
  <g>
    <BananaLeaf
      id={`${id}-a`}
      at={[60, 1880]}
      angle={-58}
      length={640}
      width={270}
      color={tint(leaf, 0.14)}
    />
    <BananaLeaf id={`${id}-b`} at={[40, 1800]} angle={-80} length={880} width={310} color={leaf} />
    <path
      d="M190 1910 Q260 1640 250 1240"
      fill="none"
      stroke={stem}
      strokeOpacity={0.8}
      strokeWidth={4}
    />
    <BananaLeaf
      id={`${id}-c`}
      at={[200, 1880]}
      angle={-34}
      length={560}
      width={220}
      color={shade(leaf, 0.08)}
    />
    <Anthurium
      id={`${id}-f1`}
      at={[250, 1250]}
      angle={34}
      size={120}
      color={flower}
      spadix={spadix}
    />
    <Anthurium
      id={`${id}-f2`}
      at={[262, 1460]}
      angle={16}
      size={132}
      color={flower}
      spadix={spadix}
    />
    <Anthurium
      id={`${id}-f3`}
      at={[236, 1690]}
      angle={40}
      size={122}
      color={flower}
      spadix={spadix}
    />
  </g>
);
