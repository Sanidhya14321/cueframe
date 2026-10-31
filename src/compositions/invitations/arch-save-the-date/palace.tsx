import type { ReactNode } from 'react';
import type { ArchSaveTheDateProps } from '@/schemas';
import { ArcadeBack, ArcadeFace } from './arcade';
import { arcadeFor } from './arch-geometry';
import {
  depthOf,
  FRAME_HEIGHT,
  FRAME_WIDTH,
  NEAREST_DEPTH,
  planeMatrix,
  relativeMatrix,
  type View,
} from './camera';
import { Chandelier, ChandelierDefs } from './chandelier';
import { ColumnDefs } from './column';
import { MarbleFloor } from './floor';
import { GardenLayer } from './garden';
import { GarlandCurtain, GarlandDefs } from './garlands';
import { ColumnPlanters } from './planters';
import { PlantDefs } from './plants';
import { SkyDefs, SkyLayer } from './sky';
import { Balustrade, TerraceDefs } from './terrace';

const SKY_DEPTH = 8;

const GARDEN_BEHIND_TERRACE = 0.3;

const CHANDELIER_SHARE = 0.43;

const GARLAND_SHARE = 0.18;

const Plane = ({ view, depth, children }: { view: View; depth: number; children: ReactNode }) =>
  depth <= NEAREST_DEPTH ? null : <g transform={planeMatrix(view, depth)}>{children}</g>;

export const Palace = ({
  props,
  view,
  time,
  prefix,
}: {
  props: ArchSaveTheDateProps;
  view: View;
  time: number;
  prefix: string;
}) => {
  const { colonnade, wall, chandeliers, garlands, sky, birds, garden, terrace, look } = props;
  const id = (name: string) => `${prefix}${name}`;
  const ids = {
    sky: {
      sky: id('sky'),
      glow: id('glow'),
      cloud: id('cloud'),
      soft: id('soft'),
      wisp: id('wisp'),
    },
    plant: { blade: id('blade'), dome: id('dome'), crown: id('crown') },
    terrace: { stone: id('stone'), baluster: id('baluster') },
    arcade: { wall: id('wall'), round: id('round'), reflection: id('reflection') },
    chandelier: { bowl: id('bowl'), drop: id('drop'), brass: id('brass') },
    garland: { bud: id('bud'), lotus: id('lotus') },
  };
  const arcade = arcadeFor(colonnade);
  const terraceDepth = depthOf(view, terrace.depth);
  const arches = Array.from({ length: colonnade.arches }, (_, index) => ({
    index,
    end: 1 - index * colonnade.spacing,
  }));
  return (
    <svg
      aria-hidden="true"
      width={FRAME_WIDTH}
      height={FRAME_HEIGHT}
      viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      <defs>
        <SkyDefs ids={ids.sky} sky={sky} />
        <PlantDefs ids={ids.plant} garden={garden} />
        <TerraceDefs ids={ids.terrace} terrace={terrace} />
        <ColumnDefs ids={ids.arcade} wall={wall} reflections={terrace.reflections} />
        <ChandelierDefs ids={ids.chandelier} chandeliers={chandeliers} tint={sky.cloudShade} />
        <GarlandDefs ids={ids.garland} garlands={garlands} leaf={garden.leaf} />
        <linearGradient
          id={ids.arcade.wall}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={colonnade.apexY - 700}
          x2="0"
          y2={colonnade.springY}
        >
          <stop offset="0" stopColor={wall.shade} />
          <stop offset="0.55" stopColor={wall.color} />
          <stop offset="1" stopColor={wall.color} />
        </linearGradient>
      </defs>
      {look.showBackdrop ? (
        <g transform={relativeMatrix(view, SKY_DEPTH)}>
          <SkyLayer sky={sky} birds={birds} ids={ids.sky} time={time} />
        </g>
      ) : null}
      <Plane view={view} depth={terraceDepth + GARDEN_BEHIND_TERRACE}>
        <GardenLayer ground={colonnade.floorY} garden={garden} ids={ids.plant} />
      </Plane>
      <MarbleFloor
        view={view}
        farDepth={terraceDepth}
        floorY={colonnade.floorY}
        terrace={terrace}
        gradientId={id('marble')}
      />
      <Plane view={view} depth={terraceDepth}>
        <Balustrade ground={colonnade.floorY} terrace={terrace} garden={garden} ids={ids.terrace} />
      </Plane>
      {arches.map(({ index, end }) => {
        const depth = depthOf(view, end);
        return (
          <g key={index}>
            {colonnade.thickness > 0 ? (
              <Plane view={view} depth={depth + colonnade.thickness}>
                <ArcadeBack arcade={arcade} wall={wall} />
              </Plane>
            ) : null}
            <Plane view={view} depth={depth}>
              <ArcadeFace
                arcade={arcade}
                wall={wall}
                ids={ids.arcade}
                rosettes={colonnade.rosettes}
              />
              <ColumnPlanters arcade={arcade} garden={garden} seed={index * 5} />
            </Plane>
            {index > 0 && garlands.strands > 0 ? (
              <Plane view={view} depth={depth - colonnade.spacing * GARLAND_SHARE}>
                <GarlandCurtain
                  cx={arcade.center.cx}
                  spread={arcade.center.halfWidth + colonnade.columnWidth * 0.7}
                  apexY={colonnade.apexY}
                  garlands={garlands}
                  ids={ids.garland}
                  leaf={garden.leaf}
                  time={time}
                  seed={index * 7}
                />
              </Plane>
            ) : null}
            {chandeliers.show ? (
              <Plane view={view} depth={depth - colonnade.spacing * CHANDELIER_SHARE}>
                <Chandelier
                  cx={arcade.center.cx}
                  chandeliers={chandeliers}
                  ids={ids.chandelier}
                  time={time}
                  seed={index * 3}
                  tint={sky.cloudShade}
                />
              </Plane>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};
