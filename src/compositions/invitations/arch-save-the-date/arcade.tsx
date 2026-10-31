import type { ArchSaveTheDateProps } from '@/schemas';
import {
  type Arcade,
  type ArchSpec,
  archEdgePath,
  capitalBottom,
  openingPath,
  type Pier,
  ringPath,
  WALL_TOP,
} from './arch-geometry';
import { fixed } from './camera';
import { Column, type ColumnIds } from './column';

type Wall = ArchSaveTheDateProps['wall'];

export interface ArcadeIds extends ColumnIds {
  wall: string;
}

const wallOutline = (arcade: Arcade): string =>
  [
    `M ${fixed(arcade.left)} ${WALL_TOP} H ${fixed(arcade.right)} V ${fixed(arcade.center.floorY)} H ${fixed(arcade.left)} Z`,
    openingPath(arcade.center),
    ...arcade.sides.map(openingPath),
    ...arcade.piers.map(
      (pier) =>
        `M ${fixed(pier.x)} ${fixed(capitalBottom(arcade.center))} H ${fixed(pier.x + pier.width)} V ${fixed(arcade.center.floorY)} H ${fixed(pier.x)} Z`,
    ),
  ].join(' ');

const petalsPath = (x: number, y: number, radius: number, petals: number): string =>
  Array.from({ length: petals }, (_, index) => {
    const angle = (index / petals) * Math.PI * 2;
    const tipX = x + Math.cos(angle) * radius;
    const tipY = y + Math.sin(angle) * radius;
    const side = (Math.PI / petals) * 1.25;
    const leftX = x + Math.cos(angle - side) * radius * 0.78;
    const leftY = y + Math.sin(angle - side) * radius * 0.78;
    const rightX = x + Math.cos(angle + side) * radius * 0.78;
    const rightY = y + Math.sin(angle + side) * radius * 0.78;
    return `M ${fixed(x)} ${fixed(y)} Q ${fixed(leftX)} ${fixed(leftY)} ${fixed(tipX)} ${fixed(tipY)} Q ${fixed(rightX)} ${fixed(rightY)} ${fixed(x)} ${fixed(y)} Z`;
  }).join(' ');

const Rosette = ({ x, y, radius, wall }: { x: number; y: number; radius: number; wall: Wall }) => (
  <g>
    <circle
      cx={fixed(x + radius * 0.04)}
      cy={fixed(y + radius * 0.06)}
      r={fixed(radius * 1.04)}
      fill={wall.shade}
      opacity={0.45}
    />
    <circle cx={fixed(x)} cy={fixed(y)} r={fixed(radius)} fill={wall.color} />
    <path
      d={petalsPath(x, y, radius * 0.92, 10)}
      fill={wall.light}
      stroke={wall.shade}
      strokeWidth={1.3}
    />
    <path
      d={petalsPath(x, y, radius * 0.5, 8)}
      fill={wall.relief}
      stroke={wall.shade}
      strokeWidth={1}
    />
    <circle cx={fixed(x)} cy={fixed(y)} r={fixed(radius * 0.13)} fill={wall.shade} />
    <circle
      cx={fixed(x)}
      cy={fixed(y)}
      r={fixed(radius)}
      fill="none"
      stroke={wall.relief}
      strokeWidth={2}
    />
  </g>
);

const Palmette = ({ pier, top, wall }: { pier: Pier; top: number; wall: Wall }) => {
  const cx = pier.x + pier.width / 2;
  const size = pier.width * 0.62;
  const fronds = [-60, -36, -12, 12, 36, 60];
  return (
    <g>
      {fronds.map((angle) => (
        <path
          key={angle}
          d={`M ${fixed(cx)} ${fixed(top)} q ${fixed(-size * 0.16)} ${fixed(-size * 0.55)} 0 ${fixed(-size)} q ${fixed(size * 0.16)} ${fixed(size * 0.45)} 0 ${fixed(size)} Z`}
          transform={`rotate(${angle} ${fixed(cx)} ${fixed(top)})`}
          fill={wall.light}
          stroke={wall.shade}
          strokeWidth={1.2}
        />
      ))}
      <circle cx={fixed(cx)} cy={fixed(top)} r={fixed(size * 0.16)} fill={wall.relief} />
    </g>
  );
};

const CenterMoldings = ({ spec, wall }: { spec: ArchSpec; wall: Wall }) => (
  <g fillRule="evenodd">
    <path d={ringPath(spec, 46, 62)} fill={wall.light} />
    <path d={ringPath(spec, 42, 46)} fill={wall.shade} />
    <path d={ringPath(spec, 16, 42)} fill={wall.light} />
    <path d={ringPath(spec, 12, 16)} fill={wall.shade} opacity={0.7} />
    <path d={ringPath(spec, 0, 12)} fill={wall.relief} />
    <path d={archEdgePath(spec)} fill="none" stroke={wall.shade} strokeWidth={3} />
  </g>
);

const SideMoldings = ({ spec, wall }: { spec: ArchSpec; wall: Wall }) => (
  <g fillRule="evenodd">
    <path d={ringPath(spec, 22, 28)} fill={wall.shade} opacity={0.75} />
    <path d={ringPath(spec, 0, 22)} fill={wall.light} />
    <path d={archEdgePath(spec)} fill="none" stroke={wall.shade} strokeWidth={2.4} />
  </g>
);

const Frieze = ({ arcade, wall, rosettes }: { arcade: Arcade; wall: Wall; rosettes: boolean }) => {
  const cornice = arcade.center.apexY - 150;
  const spacing = 210;
  const first = Math.ceil((arcade.left - arcade.center.cx) / spacing);
  const last = Math.floor((arcade.right - arcade.center.cx) / spacing);
  const positions = Array.from(
    { length: last - first + 1 },
    (_, index) => arcade.center.cx + (first + index) * spacing,
  );
  const width = arcade.right - arcade.left;
  return (
    <g>
      <rect
        x={fixed(arcade.left)}
        y={fixed(cornice - 30)}
        width={fixed(width)}
        height={36}
        fill={wall.light}
      />
      <rect
        x={fixed(arcade.left)}
        y={fixed(cornice + 6)}
        width={fixed(width)}
        height={6}
        fill={wall.shade}
        opacity={0.8}
      />
      <rect
        x={fixed(arcade.left)}
        y={fixed(cornice - 36)}
        width={fixed(width)}
        height={6}
        fill={wall.relief}
      />
      {rosettes
        ? positions.map((x) => <Rosette key={x} x={x} y={cornice - 120} radius={52} wall={wall} />)
        : null}
    </g>
  );
};

export const ArcadeFace = ({
  arcade,
  wall,
  ids,
  rosettes,
}: {
  arcade: Arcade;
  wall: Wall;
  ids: ArcadeIds;
  rosettes: boolean;
}) => {
  const { center } = arcade;
  const rise = center.springY - center.apexY;
  const spandrel = center.halfWidth * 0.86;
  return (
    <g>
      <path d={wallOutline(arcade)} fill={`url(#${ids.wall})`} fillRule="evenodd" />
      <Frieze arcade={arcade} wall={wall} rosettes={rosettes} />
      {arcade.sides.map((spec) => (
        <SideMoldings key={spec.cx} spec={spec} wall={wall} />
      ))}
      <CenterMoldings spec={center} wall={wall} />
      {rosettes
        ? [-1, 1].map((direction) => (
            <Rosette
              key={direction}
              x={center.cx + direction * spandrel}
              y={center.apexY - 8}
              radius={Math.min(64, rise * 0.13)}
              wall={wall}
            />
          ))
        : null}
      {arcade.piers.map((pier) => (
        <Palmette key={pier.x} pier={pier} top={center.springY - 18} wall={wall} />
      ))}
      {arcade.piers.map((pier) => (
        <Column
          key={pier.x}
          x={pier.x}
          width={pier.width}
          top={center.springY}
          floorY={center.floorY}
          wall={wall}
          ids={ids}
          detailed
        />
      ))}
    </g>
  );
};

export const ArcadeBack = ({ arcade, wall }: { arcade: Arcade; wall: Wall }) => (
  <g>
    <path d={wallOutline(arcade)} fill={wall.shade} fillRule="evenodd" />
    {arcade.piers.map((pier) => (
      <rect
        key={pier.x}
        x={fixed(pier.x + pier.width * 0.2)}
        y={fixed(arcade.center.springY)}
        width={fixed(pier.width * 0.6)}
        height={fixed(arcade.center.floorY - arcade.center.springY)}
        fill={wall.shade}
      />
    ))}
  </g>
);
