import { memo } from 'react';
import { darken, lighten, mix, type Paint } from './palette';
import { circle, leaf, rosette } from './shapes';

export type Ids = {
  id: (name: string) => string;
  url: (name: string) => string;
  href: (name: string) => string;
};

export const makeIds = (prefix: string): Ids => ({
  id: (name) => `${prefix}-${name}`,
  url: (name) => `url(#${prefix}-${name})`,
  href: (name) => `#${prefix}-${name}`,
});

const TILE_W = 40;

const TILE_H = 35;

const ROSETTE_SPOTS = [
  [0, 0],
  [TILE_W, 0],
  [0, TILE_H],
  [TILE_W, TILE_H],
  [TILE_W / 2, TILE_H / 2],
] as const;

const rosetteTile = ROSETTE_SPOTS.map(([x, y]) => rosette(x, y, 12.5, 8, 0.3)).join('');

const rosetteVeins = ROSETTE_SPOTS.map(([x, y]) =>
  Array.from({ length: 8 }, (_, index) => {
    const angle = 0.3 + (index / 8) * Math.PI * 2;
    return `M${x} ${y}L${(x + Math.cos(angle) * 10).toFixed(2)} ${(y + Math.sin(angle) * 10).toFixed(2)}`;
  }).join(''),
).join('');

const rosetteHearts = ROSETTE_SPOTS.map(([x, y]) => circle(x, y, 2.8)).join('');

const Foliage = ({
  ids,
  name,
  base,
  leafColor,
  heart,
}: {
  ids: Ids;
  name: string;
  base: string;
  leafColor: string;
  heart: string;
}) => (
  <pattern id={ids.id(name)} width={TILE_W} height={TILE_H} patternUnits="userSpaceOnUse">
    <rect width={TILE_W} height={TILE_H} fill={base} />
    <path d={rosetteTile} fill={leafColor} stroke={darken(base, 0.3)} strokeWidth={0.9} />
    <path d={rosetteVeins} stroke={lighten(leafColor, 0.28)} strokeWidth={0.8} />
    <path d={rosetteHearts} fill={heart} />
  </pattern>
);

const SPRAY_PAIRS = 9;

const SPRAY_STEP = 12;

const sprayLeaves = Array.from({ length: SPRAY_PAIRS }, (_, index) => {
  const y = -12 - index * SPRAY_STEP;
  const size = 15 - index * 0.8;
  return leaf(0, y, -Math.PI / 2 - 0.9, size, 4.2) + leaf(0, y - 3, -Math.PI / 2 + 0.9, size, 4.2);
}).join('');

const sprayBlossoms = Array.from({ length: SPRAY_PAIRS - 1 }, (_, index) => {
  const y = -18 - index * SPRAY_STEP;
  const side = index % 2 === 0 ? -7 : 7;
  return circle(side, y, 3.4) + circle(side * 0.5, y - 4.5, 2.6) + circle(side * 1.3, y - 4, 2.2);
}).join('');

const sprayHearts = Array.from({ length: SPRAY_PAIRS - 1 }, (_, index) => {
  const y = -18 - index * SPRAY_STEP;
  const side = index % 2 === 0 ? -7 : 7;
  return circle(side, y, 1.2);
}).join('');

const rimLeaf = leaf(0, 0, -Math.PI / 2, 22, 7);

const lotusBack = [-0.9, -0.45, 0, 0.45, 0.9]
  .map((turn) => leaf(0, 0, -Math.PI / 2 + turn, 29, 9.5))
  .join('');

const lotusFront = [-0.6, -0.2, 0.2, 0.6]
  .map((turn) => leaf(0, 2, -Math.PI / 2 + turn, 21, 8))
  .join('');

const marigoldPetals = rosette(0, 0, 9, 10) + rosette(0, 0, 6, 8, 0.4);

const Symbols = ({ ids, paint }: { ids: Ids; paint: Paint }) => {
  const { trees, lake, garlands, chandeliers } = paint;
  return (
    <>
      <symbol id={ids.id('spray')} overflow="visible">
        <path d="M0 0Q3 -60 0 -120" fill="none" stroke={darken(trees.trunk, 0.1)} strokeWidth={2} />
        <path
          d={sprayLeaves}
          fill={trees.sprig}
          stroke={darken(trees.sprig, 0.4)}
          strokeWidth={0.8}
        />
        <path
          d={sprayBlossoms}
          fill={trees.blossom}
          stroke={darken(trees.blossom, 0.35)}
          strokeWidth={0.7}
        />
        <path d={sprayHearts} fill={darken(trees.blossom, 0.5)} />
        <path d={circle(0, -124, 4) + circle(-3, -116, 3)} fill={darken(trees.blossom, 0.4)} />
      </symbol>
      <symbol id={ids.id('rim')} overflow="visible">
        <path d={rimLeaf} fill={trees.mid} stroke={darken(trees.dark, 0.3)} strokeWidth={0.8} />
        <path d="M0 0L0 -17" stroke={lighten(trees.mid, 0.35)} strokeWidth={0.9} />
      </symbol>
      <symbol id={ids.id('rim-light')} overflow="visible">
        <path d={rimLeaf} fill={trees.light} stroke={darken(trees.mid, 0.3)} strokeWidth={0.8} />
        <path d="M0 0L0 -17" stroke={lighten(trees.light, 0.4)} strokeWidth={0.9} />
      </symbol>
      <symbol id={ids.id('lotus')} overflow="visible">
        <path d={lotusBack} fill={lake.lotus} stroke={darken(lake.lotus, 0.3)} strokeWidth={0.8} />
        <path
          d={lotusFront}
          fill={lighten(lake.lotus, 0.35)}
          stroke={darken(lake.lotus, 0.25)}
          strokeWidth={0.8}
        />
        <path d={circle(0, -3, 3.4)} fill={lighten(garlands.marigold, 0.15)} />
      </symbol>
      <symbol id={ids.id('lotus-white')} overflow="visible">
        <path
          d={lotusBack}
          fill={mix(lake.lotusWhite, lake.lotus, 0.18)}
          stroke={darken(lake.lotusWhite, 0.3)}
          strokeWidth={0.8}
        />
        <path
          d={lotusFront}
          fill={lake.lotusWhite}
          stroke={darken(lake.lotusWhite, 0.25)}
          strokeWidth={0.8}
        />
        <path d={circle(0, -3, 3.4)} fill={lighten(garlands.marigold, 0.15)} />
      </symbol>
      <symbol id={ids.id('pad')} overflow="visible">
        <path
          d="M0 0A30 11 0 1 1 3 -10.6L0 0Z"
          fill={lake.pad}
          stroke={darken(lake.pad, 0.35)}
          strokeWidth={1}
        />
        <path
          d="M0 0L-24 -5M0 0L-14 -10M0 0L-26 3M0 0L14 -9M0 0L26 -2M0 0L10 9M0 0L-12 9"
          stroke={lighten(lake.pad, 0.3)}
          strokeWidth={0.9}
        />
      </symbol>
      <symbol id={ids.id('marigold')} overflow="visible">
        <path
          d={marigoldPetals}
          fill={garlands.marigold}
          stroke={darken(garlands.marigold, 0.3)}
          strokeWidth={0.6}
        />
        <path d={circle(0, 0, 2.6)} fill={darken(garlands.marigold, 0.25)} />
      </symbol>
      <symbol id={ids.id('bead')} overflow="visible">
        <ellipse
          cx={0}
          cy={0}
          rx={6}
          ry={8.5}
          fill={garlands.bead}
          stroke={darken(garlands.bead, 0.35)}
          strokeWidth={1}
        />
        <ellipse cx={-2} cy={-3} rx={1.8} ry={3} fill={lighten(garlands.bead, 0.45)} />
      </symbol>
      <symbol id={ids.id('drop')} overflow="visible">
        <path
          d="M0 0L3.2 6L0 13L-3.2 6Z"
          fill={chandeliers.crystal}
          stroke={darken(chandeliers.crystal, 0.35)}
          strokeWidth={0.6}
        />
      </symbol>
    </>
  );
};

const latticePath = 'M0 0L16 16M16 0L0 16';

const PaintDefs = ({ ids, paint }: { ids: Ids; paint: Paint }) => {
  const { trees, railing, garden, peacocks, canopies } = paint;
  return (
    <>
      <Foliage
        ids={ids}
        name="foliage"
        base={trees.dark}
        leafColor={trees.mid}
        heart={trees.light}
      />
      <Foliage
        ids={ids}
        name="foliage-light"
        base={trees.mid}
        leafColor={trees.light}
        heart={lighten(trees.light, 0.4)}
      />
      <Foliage
        ids={ids}
        name="foliage-deep"
        base={darken(trees.dark, 0.3)}
        leafColor={trees.dark}
        heart={trees.mid}
      />
      <pattern id={ids.id('lattice')} width={16} height={16} patternUnits="userSpaceOnUse">
        <path d={latticePath} stroke={railing.marble} strokeWidth={2.4} />
        <path
          d={circle(8, 8, 1.7) + circle(0, 0, 1.4) + circle(16, 16, 1.4)}
          fill={railing.marble}
        />
      </pattern>
      <pattern id={ids.id('lawn')} width={44} height={26} patternUnits="userSpaceOnUse">
        <rect width={44} height={26} fill={garden.lawn} />
        <path d="M0 13L22 0L44 13L22 26Z" fill="none" stroke={garden.lawnLines} strokeWidth={3.2} />
        <path
          d={circle(22, 13, 2) + circle(8, 5, 1.2) + circle(36, 21, 1.2)}
          fill={darken(garden.lawn, 0.25)}
        />
      </pattern>
      <pattern id={ids.id('gravel')} width={14} height={12} patternUnits="userSpaceOnUse">
        <rect width={14} height={12} fill={garden.path} />
        <path d={circle(2, 3, 1.3) + circle(9, 8, 1.1) + circle(12, 2, 0.9)} fill={garden.gravel} />
        <path d={circle(6, 5, 1) + circle(3, 10, 0.9)} fill={darken(garden.path, 0.3)} />
      </pattern>
      <pattern id={ids.id('eyes')} width={20} height={26} patternUnits="userSpaceOnUse">
        <rect width={20} height={26} fill={peacocks.tail} />
        <path d="M10 0L10 26M0 13L20 13" stroke={darken(peacocks.tail, 0.3)} strokeWidth={0.6} />
        <ellipse cx={10} cy={13} rx={5.6} ry={7.4} fill={peacocks.eyes} />
        <ellipse
          cx={10}
          cy={13.6}
          rx={3.6}
          ry={5}
          fill={mix(peacocks.tail, lighten(peacocks.neck, 0.45), 0.6)}
        />
        <ellipse cx={10} cy={14} rx={2} ry={2.8} fill={darken(peacocks.neck, 0.35)} />
        <ellipse cx={0} cy={0} rx={4} ry={5} fill={peacocks.eyes} />
        <ellipse cx={20} cy={0} rx={4} ry={5} fill={peacocks.eyes} />
        <ellipse cx={0} cy={26} rx={4} ry={5} fill={peacocks.eyes} />
        <ellipse cx={20} cy={26} rx={4} ry={5} fill={peacocks.eyes} />
      </pattern>
      <pattern id={ids.id('speckle')} width={9} height={9} patternUnits="userSpaceOnUse">
        <rect width={9} height={9} fill={peacocks.wing} />
        <path d="M1 2L4 1M5 6L8 5M2 7L4 8" stroke={darken(peacocks.wing, 0.45)} strokeWidth={1} />
      </pattern>
      <pattern id={ids.id('motif')} width={28} height={28} patternUnits="userSpaceOnUse">
        <rect width={28} height={28} fill={canopies.roof} />
        <path d={rosette(14, 14, 8, 4, Math.PI / 4)} fill={canopies.motif} />
        <path d={circle(14, 14, 2.6)} fill={canopies.fringe} />
        <path
          d={circle(0, 0, 2.2) + circle(28, 0, 2.2) + circle(0, 28, 2.2) + circle(28, 28, 2.2)}
          fill={lighten(canopies.motif, 0.3)}
        />
      </pattern>
      <linearGradient id={ids.id('volume')} x1={0} y1={0} x2={1} y2={1}>
        <stop offset={0} stopColor="#ffffff" stopOpacity={0.22} />
        <stop offset={0.42} stopColor="#ffffff" stopOpacity={0} />
        <stop offset={0.62} stopColor="#000000" stopOpacity={0} />
        <stop offset={1} stopColor="#000000" stopOpacity={0.3} />
      </linearGradient>
      <linearGradient id={ids.id('side')} x1={0} y1={0} x2={1} y2={0}>
        <stop offset={0} stopColor="#000000" stopOpacity={0.18} />
        <stop offset={0.35} stopColor="#ffffff" stopOpacity={0.14} />
        <stop offset={1} stopColor="#000000" stopOpacity={0.22} />
      </linearGradient>
      <filter id={ids.id('soft')} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={9} />
      </filter>
      <Symbols ids={ids} paint={paint} />
    </>
  );
};

export const Defs = memo(PaintDefs);
