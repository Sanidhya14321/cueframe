import { memo } from 'react';
import { Canopy, Chhatri, Railing } from './architecture';
import { type Cam, placeFor, type Schedule, SWANS_X, type WorldView } from './camera';
import type { Ids } from './defs';
import { Overhang } from './hanging';
import { FarHills } from './hills';
import type { Paint } from './palette';
import { Peacock } from './peacock';
import { BigLeaves, Bushes, Fern, Lily } from './plants';
import { Birds, type CloudSpot, Clouds, SkyFill } from './sky';
import { Banana, RosetteTree, SprigTree } from './trees';
import { LotusField, SwanPair, Water } from './water';
import { Layer, World } from './world';

const RAIL_Y = 1448;

const WATER_TOP = 1516;

const WATER_BOTTOM = 1800;

const BRANCH_SCALE = 1.35;

const CLOUDS: readonly CloudSpot[] = [
  { x: 560, y: 560, width: 760, seed: 3 },
  { x: 640, y: 1150, width: 620, seed: 11 },
  { x: 120, y: 300, width: 440, seed: 19 },
  { x: 1000, y: 860, width: 480, seed: 23 },
  { x: -220, y: 980, width: 520, seed: 31 },
  { x: 300, y: 1330, width: 420, seed: 37 },
];

const LOTUS_ROWS = [
  { y: 1548, spacing: 150, scale: 0.75 },
  { y: 1620, spacing: 125, scale: 0.95 },
  { y: 1705, spacing: 135, scale: 1.1 },
  { y: 1780, spacing: 160, scale: 1.25 },
] as const;

const close = (camera: number, x: number, y: number) => ({
  x: SWANS_X + 540 + (x - 540) / camera,
  y: 1490 + (y - 1490) / camera,
});

const Scenery = memo(({ paint, ids, closeUp }: { paint: Paint; ids: Ids; closeUp: number }) => {
  const { trees, canopies, pavilions } = paint;
  const leftCanopy = close(closeUp, 110, 1118);
  const rightCanopy = close(closeUp, 1010, 1118);
  const crown = close(closeUp, 1030, 860);
  return (
    <g>
      <SprigTree x={-160} y={RAIL_Y} height={1180} spread={0.9} seed={5} trees={trees} ids={ids} />
      <Chhatri x={-300} y={RAIL_Y} width={190} ids={ids} pavilions={pavilions} />
      <SprigTree x={40} y={RAIL_Y} height={1300} spread={1} seed={7} trees={trees} ids={ids} />
      <RosetteTree
        x={50}
        y={RAIL_Y}
        crowns={[
          { x: -20, y: -540, r: 105 },
          { x: 20, y: -330, r: 135 },
        ]}
        trees={trees}
        ids={ids}
      />
      <SprigTree x={1030} y={RAIL_Y} height={1360} spread={1} seed={13} trees={trees} ids={ids} />
      <RosetteTree
        x={1020}
        y={RAIL_Y}
        crowns={[
          { x: -30, y: -620, r: 105 },
          { x: 0, y: -420, r: 135 },
        ]}
        trees={trees}
        ids={ids}
      />
      <Banana x={1050} y={RAIL_Y} height={430} leaves={6} sway={0} trees={trees} flip />
      <Banana x={-10} y={RAIL_Y} height={400} leaves={5} sway={1} trees={trees} />
      <Lily x={330} y={RAIL_Y} height={110} trees={trees} color={paint.flowers.orange} />
      <Fern x={700} y={RAIL_Y} height={90} trees={trees} />
      <RosetteTree
        x={crown.x}
        y={RAIL_Y}
        crowns={[{ x: 0, y: crown.y - RAIL_Y, r: 70 }]}
        trees={trees}
        ids={ids}
      />
      <Banana x={leftCanopy.x - 30} y={RAIL_Y} height={300} leaves={5} sway={2} trees={trees} />
      <Lily
        x={leftCanopy.x + 30}
        y={RAIL_Y}
        height={150}
        trees={trees}
        color={paint.flowers.orange}
      />
      <Fern x={rightCanopy.x + 20} y={RAIL_Y} height={140} trees={trees} flip />
      <Lily
        x={rightCanopy.x - 20}
        y={RAIL_Y}
        height={160}
        trees={trees}
        color={paint.flowers.orange}
        flip
      />
      <Canopy
        x={leftCanopy.x}
        y={leftCanopy.y}
        width={176}
        poles={RAIL_Y - leftCanopy.y}
        ids={ids}
        canopies={canopies}
        trees={trees}
        plume={false}
      />
      <Canopy
        x={rightCanopy.x}
        y={rightCanopy.y}
        width={176}
        poles={RAIL_Y - rightCanopy.y}
        ids={ids}
        canopies={canopies}
        trees={trees}
        plume={false}
      />
      <Railing
        from={-1800}
        to={1700}
        y={RAIL_Y}
        height={46}
        every={230}
        railing={paint.railing}
        ids={ids}
      />
    </g>
  );
});

const Front = memo(
  ({
    paint,
    ids,
    closeUp,
    parallax,
  }: {
    paint: Paint;
    ids: Ids;
    closeUp: number;
    parallax: number;
  }) => {
    const swansCam: Cam = { x: SWANS_X, y: 0, zoom: closeUp };
    const bush = placeFor(swansCam, 1.25, parallax, 60, 1990);
    const leaves = placeFor(swansCam, 1.25, parallax, 1010, 1900);
    return (
      <g>
        <Railing
          from={-2600}
          to={1800}
          y={1790}
          height={60}
          every={260}
          railing={paint.railing}
          ids={ids}
        />
        <Bushes
          from={-2600}
          to={1800}
          base={1930}
          size={110}
          seed={71}
          trees={paint.trees}
          ids={ids}
          berries={paint.flowers.orange}
        />
        <g transform={`translate(${bush.x} ${bush.y}) scale(${bush.scale})`}>
          <Bushes
            from={-200}
            to={220}
            base={0}
            size={140}
            seed={83}
            trees={paint.trees}
            ids={ids}
            berries={paint.flowers.orange}
          />
        </g>
        <BigLeaves x={leaves.x} y={leaves.y} size={300 * leaves.scale} trees={paint.trees} flip />
        <BigLeaves x={-40} y={1880} size={150} trees={paint.trees} />
      </g>
    );
  },
);

export const LakeWorld = ({
  frame,
  view,
  blur,
  paint,
  ids,
  schedule,
  parallax,
  closeUp,
  backdrop,
}: {
  frame: number;
  view: WorldView;
  blur: { x: number; y: number };
  paint: Paint;
  ids: Ids;
  schedule: Schedule;
  parallax: number;
  closeUp: number;
  backdrop: boolean;
}) => {
  const { cam } = view;
  const swansCam: Cam = { x: SWANS_X, y: 0, zoom: closeUp };
  const branchLeft = placeFor(swansCam, 1.3, parallax, -30, 150);
  const branchRight = placeFor(swansCam, 1.3, parallax, 1110, 90);
  const swans = close(closeUp, 540, 1740);
  const perch = close(closeUp, 270, RAIL_Y);
  const flockFrom = close(closeUp, 520, 520);
  const flockTo = close(closeUp, 1180, 300);
  const show = paint.peacocks.show;
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
      <Layer cam={cam} depth={0.35} parallax={parallax}>
        <FarHills
          id={ids.id('hills')}
          far={paint.hills.far}
          near={paint.hills.near}
          base={RAIL_Y + 4}
        />
      </Layer>
      <Layer cam={cam} depth={1} parallax={parallax}>
        <Birds
          count={paint.birds.count}
          color={paint.birds.color}
          frame={frame}
          from={flockFrom}
          to={flockTo}
          start={0}
          end={schedule.lakeIn}
        />
        <Birds
          count={paint.birds.count}
          color={paint.birds.color}
          frame={frame}
          from={{ x: -80, y: 360 }}
          to={{ x: 1250, y: 140 }}
          start={schedule.lakeIn - 40}
          end={schedule.lakeEnd + 20}
        />
        <Water
          id={ids.id('water')}
          from={-1800}
          to={1700}
          top={WATER_TOP}
          bottom={WATER_BOTTOM}
          frame={frame}
          lake={paint.lake}
        />
        <LotusField from={-1800} to={1700} rows={LOTUS_ROWS} seed={9} ids={ids} />
        <Scenery paint={paint} ids={ids} closeUp={closeUp} />
        {show ? (
          <>
            <Peacock
              x={perch.x}
              y={RAIL_Y - 6}
              scale={0.82}
              tail="down"
              flip={false}
              frame={frame}
              peacocks={paint.peacocks}
              ids={ids}
            />
            <Peacock
              x={200}
              y={RAIL_Y - 6}
              scale={1.2}
              tail="down"
              flip={false}
              frame={frame}
              peacocks={paint.peacocks}
              ids={ids}
            />
            <Peacock
              x={830}
              y={RAIL_Y - 6}
              scale={1.05}
              tail="along"
              flip
              frame={frame}
              peacocks={paint.peacocks}
              ids={ids}
            />
          </>
        ) : null}
        {paint.swans.show ? (
          <SwanPair
            x={swans.x}
            y={swans.y}
            scale={0.95}
            swans={paint.swans}
            lake={paint.lake}
            frame={frame}
          />
        ) : null}
      </Layer>
      <Layer cam={cam} depth={1.25} parallax={parallax}>
        <Front paint={paint} ids={ids} closeUp={closeUp} parallax={parallax} />
      </Layer>
      <Layer cam={cam} depth={1.3} parallax={parallax}>
        <g
          transform={`translate(${branchLeft.x} ${branchLeft.y}) scale(${branchLeft.scale * BRANCH_SCALE})`}
        >
          <Overhang x={0} y={0} reach={360} flip={false} seed={3} trees={paint.trees} ids={ids} />
        </g>
        <g
          transform={`translate(${branchRight.x} ${branchRight.y}) scale(${branchRight.scale * BRANCH_SCALE})`}
        >
          <Overhang x={0} y={0} reach={330} flip seed={8} trees={paint.trees} ids={ids} />
        </g>
      </Layer>
    </World>
  );
};
