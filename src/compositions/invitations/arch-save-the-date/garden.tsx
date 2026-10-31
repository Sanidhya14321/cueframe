import type { ArchSaveTheDateProps } from '@/schemas';
import { fixed, seeded } from './camera';
import { Banana, FloweringStalk, Frond, type PlantIds, Shrub } from './plants';

type Garden = ArchSaveTheDateProps['garden'];

const TILE = 1300;

const TILES = [-1, 0, 1];

type Planting =
  | { kind: 'stalk'; x: number; height: number; cream: boolean }
  | { kind: 'frond'; x: number; height: number; flip: number }
  | { kind: 'shrub'; x: number; width: number; height: number }
  | { kind: 'banana'; x: number; height: number; flip: number };

const PLANTINGS: Planting[] = [
  { kind: 'shrub', x: 90, width: 300, height: 260 },
  { kind: 'stalk', x: 60, height: 1000, cream: false },
  { kind: 'frond', x: 170, height: 560, flip: -1 },
  { kind: 'frond', x: 250, height: 480, flip: 1 },
  { kind: 'shrub', x: 370, width: 420, height: 330 },
  { kind: 'shrub', x: 640, width: 360, height: 280 },
  { kind: 'frond', x: 800, height: 420, flip: 1 },
  { kind: 'shrub', x: 860, width: 300, height: 240 },
  { kind: 'banana', x: 960, height: 480, flip: 1 },
  { kind: 'banana', x: 1110, height: 640, flip: -1 },
  { kind: 'stalk', x: 1170, height: 1150, cream: true },
  { kind: 'frond', x: 1260, height: 620, flip: -1 },
];

const Canopy = ({ ground, ids }: { ground: number; ids: PlantIds }) => (
  <g opacity={0.6}>
    {Array.from({ length: 34 }, (_, index) => {
      const x = -1700 + index * 120 + seeded(index, 3) * 60;
      const radius = 95 + seeded(index, 5) * 70;
      return (
        <circle
          key={index}
          cx={fixed(x)}
          cy={fixed(ground - 230 - seeded(index, 7) * 90)}
          r={fixed(radius)}
          fill={`url(#${ids.crown})`}
        />
      );
    })}
  </g>
);

const Planted = ({
  item,
  offset,
  ground,
  size,
  garden,
  ids,
}: {
  item: Planting;
  offset: number;
  ground: number;
  size: number;
  garden: Garden;
  ids: PlantIds;
}) => {
  const x = item.x + offset;
  switch (item.kind) {
    case 'stalk':
      return (
        <FloweringStalk
          x={x}
          base={ground}
          height={item.height * size}
          garden={garden}
          seed={x}
          flower={item.cream ? garden.leafLight : garden.blossom}
        />
      );
    case 'frond':
      return (
        <Frond x={x} base={ground} height={item.height * size} flip={item.flip} garden={garden} />
      );
    case 'shrub':
      return (
        <Shrub
          x={x}
          base={ground}
          width={item.width * size}
          height={item.height * size}
          garden={garden}
          ids={ids}
        />
      );
    case 'banana':
      return (
        <Banana
          x={x}
          base={ground}
          height={item.height * size}
          flip={item.flip}
          ids={ids}
          garden={garden}
        />
      );
    default:
      return null;
  }
};

export const GardenLayer = ({
  ground,
  garden,
  ids,
}: {
  ground: number;
  garden: Garden;
  ids: PlantIds;
}) => (
  <g>
    <Canopy ground={ground} ids={ids} />
    {TILES.flatMap((tile) =>
      PLANTINGS.map((item) => (
        <Planted
          key={`${tile}:${item.kind}:${item.x}`}
          item={item}
          offset={tile * TILE}
          ground={ground}
          size={garden.plantSize}
          garden={garden}
          ids={ids}
        />
      )),
    )}
    <path
      d={`M -3000 ${fixed(ground)} ${Array.from({ length: 50 }, (_, index) => `Q ${-2950 + index * 120} ${fixed(ground - 190 - seeded(index, 9) * 60)} ${-2890 + index * 120} ${fixed(ground - 120)}`).join(' ')} V ${fixed(ground)} Z`}
      fill={`url(#${ids.dome})`}
    />
  </g>
);
