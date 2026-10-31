import { memo } from 'react';
import { smooth } from '../../promo/timing';
import { Chhatri, Railing } from './architecture';
import { PATH_X, progress, type Schedule, type WorldView } from './camera';
import type { Ids } from './defs';
import { Cascade, Chandelier, Strands, strandFan } from './hanging';
import { FarHills, MistTrees } from './hills';
import type { Paint } from './palette';
import { Peacock } from './peacock';
import { BigLeaves, Bushes, FlowerShrub, Lily } from './plants';
import { Procession } from './procession';
import { type CloudSpot, Clouds, SkyFill } from './sky';
import { Banana, RosetteTree, SprigTree } from './trees';
import { Layer, World } from './world';

const RAIL_Y = 1392;

const GROUND_TOP = 1452;

const FENCE_Y = 1680;

const PATH_START = 1150;

const WALK_Y = 1622;

const LEAD_INSET = 150;

const DROP = 90;

const CLOUDS: readonly CloudSpot[] = [
  { x: 560, y: 400, width: 740, seed: 41 },
  { x: 120, y: 150, width: 380, seed: 47 },
  { x: 1000, y: 640, width: 440, seed: 53 },
  { x: 240, y: 800, width: 420, seed: 59 },
  { x: -260, y: 470, width: 520, seed: 61 },
  { x: 760, y: 1010, width: 380, seed: 67 },
];

const LAWN_STRANDS = [...strandFan(30, 270, 8, 280, 70), ...strandFan(810, 1050, 8, 70, 280)];

const BEAD_STRANDS = [
  ...strandFan(PATH_X + 10, PATH_X + 300, 9, 520, 150),
  ...strandFan(PATH_X + 780, PATH_X + 1070, 9, 150, 520),
];

const Grounds = memo(({ paint, ids }: { paint: Paint; ids: Ids }) => {
  const { trees, pavilions, flowers } = paint;
  const pathEdge = `M${PATH_START + 120} ${GROUND_TOP}L3600 ${GROUND_TOP}L3600 ${FENCE_Y + 20}L${PATH_START} ${FENCE_Y + 20}Z`;
  return (
    <g>
      <rect
        x={-1600}
        y={GROUND_TOP}
        width={5200}
        height={FENCE_Y - GROUND_TOP + 40}
        fill={ids.url('lawn')}
      />
      <path d={pathEdge} fill={ids.url('gravel')} />
      <path
        d={`M${PATH_START + 120} ${GROUND_TOP}L3600 ${GROUND_TOP}`}
        stroke={paint.garden.gravel}
        strokeWidth={4}
      />
      <SprigTree x={60} y={RAIL_Y} height={690} spread={1.7} seed={17} trees={trees} ids={ids} />
      <SprigTree x={1010} y={RAIL_Y} height={680} spread={1.7} seed={23} trees={trees} ids={ids} />
      <Banana x={30} y={RAIL_Y} height={560} leaves={6} sway={0.2} trees={trees} />
      <RosetteTree
        x={1010}
        y={RAIL_Y}
        crowns={[
          { x: -10, y: -380, r: 110 },
          { x: 0, y: -560, r: 85 },
        ]}
        trees={trees}
        ids={ids}
      />
      <Chhatri x={202} y={RAIL_Y} width={240} ids={ids} pavilions={pavilions} />
      <Chhatri x={880} y={RAIL_Y} width={240} ids={ids} pavilions={pavilions} />
      <Lily x={202} y={RAIL_Y} height={170} trees={trees} color={flowers.orange} />
      <Lily x={880} y={RAIL_Y} height={170} trees={trees} color={flowers.orange} flip />
      <SprigTree
        x={PATH_X + 40}
        y={RAIL_Y}
        height={700}
        spread={1.6}
        seed={29}
        trees={trees}
        ids={ids}
      />
      <SprigTree
        x={PATH_X + 1050}
        y={RAIL_Y}
        height={700}
        spread={1.6}
        seed={31}
        trees={trees}
        ids={ids}
      />
      <Banana x={PATH_X + 140} y={RAIL_Y} height={600} leaves={7} sway={0.8} trees={trees} />
      <RosetteTree
        x={PATH_X + 1040}
        y={RAIL_Y}
        crowns={[
          { x: -30, y: -300, r: 110 },
          { x: 0, y: -480, r: 90 },
        ]}
        trees={trees}
        ids={ids}
      />
      <Chhatri x={PATH_X + 560} y={RAIL_Y} width={240} ids={ids} pavilions={pavilions} />
      <Lily x={PATH_X + 250} y={RAIL_Y} height={150} trees={trees} color={flowers.orange} />
      <Lily x={PATH_X + 860} y={RAIL_Y} height={130} trees={trees} color={flowers.orange} flip />
      <Railing
        from={-1600}
        to={3600}
        y={RAIL_Y}
        height={40}
        every={250}
        railing={paint.railing}
        ids={ids}
      />
    </g>
  );
});

const Front = memo(({ paint, ids }: { paint: Paint; ids: Ids }) => (
  <g>
    <Railing
      from={-2000}
      to={4200}
      y={FENCE_Y}
      height={56}
      every={300}
      railing={paint.railing}
      ids={ids}
    />
    <Bushes
      from={-2000}
      to={4200}
      base={1990}
      size={120}
      seed={131}
      trees={paint.trees}
      ids={ids}
      berries={paint.flowers.orange}
    />
    <FlowerShrub x={500} y={1800} height={170} trees={paint.trees} color={paint.flowers.pink} />
    <BigLeaves x={720} y={1860} size={230} trees={paint.trees} />
    <FlowerShrub
      x={PATH_X * 1.25 + 520}
      y={1800}
      height={180}
      trees={paint.trees}
      color={paint.flowers.pink}
    />
    <BigLeaves x={PATH_X * 1.25 + 700} y={1860} size={240} trees={paint.trees} />
  </g>
));

export const GardenWorld = ({
  frame,
  view,
  blur,
  paint,
  ids,
  schedule,
  parallax,
  backdrop,
}: {
  frame: number;
  view: WorldView;
  blur: { x: number; y: number };
  paint: Paint;
  ids: Ids;
  schedule: Schedule;
  parallax: number;
  backdrop: boolean;
}) => {
  const { cam } = view;
  const { procession, garlands, chandeliers, peacocks } = paint;
  const finale = smooth(progress(frame, schedule.processionEnd, schedule.finaleIn));
  const leadX = PATH_X + LEAD_INSET + procession.speed * (schedule.pathIn - frame);
  const shrubX = PATH_X * 1.25;
  return (
    <World ids={ids} paint={paint} view={view} blur={blur}>
      {backdrop ? (
        <SkyFill
          id={ids.id('sky')}
          top={paint.sky.dayTop}
          horizon={paint.sky.dayHorizon}
          horizonY={RAIL_Y}
        />
      ) : null}
      <Layer cam={cam} depth={0.12} parallax={parallax}>
        <Clouds spots={CLOUDS} count={paint.sky.cloudCount} paint={paint} ids={ids} frame={frame} />
      </Layer>
      <Layer cam={cam} depth={0.3} parallax={parallax}>
        <FarHills id={ids.id('hills')} far={paint.hills.far} near={paint.hills.near} base={1300} />
      </Layer>
      <Layer cam={cam} depth={0.5} parallax={parallax}>
        <MistTrees id={ids.id('mist')} mist={paint.hills.mist} base={1340} />
      </Layer>
      <Layer cam={cam} depth={1} parallax={parallax}>
        <Grounds paint={paint} ids={ids} />
        {peacocks.show ? (
          <Peacock
            x={PATH_X + 800}
            y={RAIL_Y - 6}
            scale={0.85}
            tail="down"
            flip
            frame={frame}
            peacocks={peacocks}
            ids={ids}
          />
        ) : null}
        {peacocks.show ? (
          <Peacock
            x={640}
            y={RAIL_Y - 6}
            scale={0.85}
            tail="down"
            flip
            frame={frame}
            peacocks={peacocks}
            ids={ids}
          />
        ) : null}
        {procession.show && finale < 1 ? (
          <g opacity={1 - finale}>
            <Procession
              x={leadX}
              y={WALK_Y}
              travelled={frame * procession.speed}
              procession={procession}
            />
          </g>
        ) : null}
        {garlands.show ? (
          <>
            <Strands
              strands={LAWN_STRANDS}
              kind="marigold"
              garlands={garlands}
              ids={ids}
              frame={frame}
            />
            {finale < 1 ? (
              <g opacity={1 - finale}>
                <Cascade
                  from={PATH_X - 120}
                  to={PATH_X + 1200}
                  depth={250}
                  seed={7}
                  garlands={garlands}
                  trees={paint.trees}
                />
              </g>
            ) : null}
            {finale > 0 ? (
              <g opacity={finale}>
                <Strands
                  strands={BEAD_STRANDS}
                  kind="bead"
                  garlands={garlands}
                  ids={ids}
                  frame={frame}
                  drop={-DROP * (1 - finale)}
                />
              </g>
            ) : null}
          </>
        ) : null}
        {chandeliers.show && finale > 0 ? (
          <g opacity={finale} transform={`translate(0 ${-DROP * (1 - finale)})`}>
            <Chandelier
              x={PATH_X + 540}
              drop={50}
              size={330}
              metal={chandeliers.finale}
              chandeliers={chandeliers}
              ids={ids}
              frame={frame}
            />
          </g>
        ) : null}
      </Layer>
      <Layer cam={cam} depth={1.25} parallax={parallax}>
        <Front paint={paint} ids={ids} />
        {peacocks.show ? (
          <Peacock
            x={430}
            y={1830}
            scale={1.1}
            tail="none"
            flip={false}
            frame={frame}
            peacocks={peacocks}
            ids={ids}
          />
        ) : null}
        {peacocks.show ? (
          <Peacock
            x={shrubX + 430}
            y={1830}
            scale={1.1}
            tail="none"
            flip={false}
            frame={frame}
            peacocks={peacocks}
            ids={ids}
          />
        ) : null}
      </Layer>
    </World>
  );
};
