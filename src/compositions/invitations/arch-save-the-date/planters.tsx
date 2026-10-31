import type { ArchSaveTheDateProps } from '@/schemas';
import type { Arcade } from './arch-geometry';
import { FloweringStalk, Frond, RoseBush } from './plants';

type Garden = ArchSaveTheDateProps['garden'];

export const ColumnPlanters = ({
  arcade,
  garden,
  seed,
}: {
  arcade: Arcade;
  garden: Garden;
  seed: number;
}) => {
  const { center } = arcade;
  const size = garden.plantSize;
  const ground = center.floorY + 4;
  return (
    <g>
      {[-1, 1].map((direction) => {
        const pierEdge = center.cx + direction * (center.halfWidth + (arcade.piers[0]?.width ?? 0));
        const x = pierEdge + direction * 26;
        return (
          <g key={direction}>
            <Frond x={x} base={ground} height={420 * size} flip={direction} garden={garden} />
            <FloweringStalk
              x={x + direction * 40}
              base={ground}
              height={300 * size}
              garden={garden}
              seed={seed + direction}
              flower={garden.blossom}
            />
            <RoseBush
              x={x - direction * 6}
              base={ground}
              height={230 * size}
              garden={garden}
              seed={seed + direction * 3}
            />
          </g>
        );
      })}
    </g>
  );
};
