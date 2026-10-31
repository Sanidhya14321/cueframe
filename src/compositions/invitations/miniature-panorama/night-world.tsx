import { memo } from 'react';
import { Canopy, Railing } from './architecture';
import type { WorldView } from './camera';
import type { Ids } from './defs';
import { Chandelier } from './hanging';
import type { Paint } from './palette';
import { Peacock } from './peacock';
import { BigLeaves, Bushes, Fern, Lily } from './plants';
import { SkyFill, Stars } from './sky';
import { Banana, RosetteTree } from './trees';
import { LotusField, Water } from './water';
import { Layer, World } from './world';

const RAIL_Y = 1410;

const POND_TOP = 1530;

const POND_BOTTOM = 1790;

const CANOPY_Y = 1000;

const LOTUS_ROWS = [
  { y: 1590, spacing: 130, scale: 1.25 },
  { y: 1680, spacing: 125, scale: 1.45 },
  { y: 1770, spacing: 150, scale: 1.6 },
] as const;

const CHANDELIERS = [
  { x: 90, drop: 150, size: 270 },
  { x: 555, drop: 40, size: 290 },
  { x: 970, drop: 130, size: 280 },
] as const;

const Pavilion = memo(({ paint, ids }: { paint: Paint; ids: Ids }) => {
  const { trees, canopies } = paint;
  return (
    <g>
      <Banana x={20} y={RAIL_Y} height={560} leaves={5} sway={0.5} trees={trees} />
      <Lily x={200} y={RAIL_Y} height={170} trees={trees} color={paint.flowers.orange} />
      <RosetteTree
        x={1070}
        y={RAIL_Y}
        crowns={[
          { x: -40, y: -300, r: 100 },
          { x: 10, y: -470, r: 80 },
        ]}
        trees={trees}
        ids={ids}
      />
      <Fern x={880} y={RAIL_Y} height={150} trees={trees} flip />
      <Canopy
        x={90}
        y={CANOPY_Y}
        width={290}
        poles={RAIL_Y - CANOPY_Y}
        ids={ids}
        canopies={canopies}
        trees={trees}
        plume
      />
      <Canopy
        x={1000}
        y={CANOPY_Y}
        width={290}
        poles={RAIL_Y - CANOPY_Y}
        ids={ids}
        canopies={canopies}
        trees={trees}
        plume
      />
      <Railing
        from={-800}
        to={1900}
        y={RAIL_Y}
        height={92}
        every={230}
        railing={paint.railing}
        ids={ids}
      />
    </g>
  );
});

const Front = memo(({ paint, ids }: { paint: Paint; ids: Ids }) => (
  <g>
    <Railing
      from={-900}
      to={2000}
      y={1800}
      height={80}
      every={260}
      railing={paint.railing}
      ids={ids}
    />
    <Bushes
      from={-900}
      to={2000}
      base={2010}
      size={120}
      seed={113}
      trees={paint.trees}
      ids={ids}
      berries={paint.flowers.orange}
    />
    <BigLeaves x={600} y={1940} size={240} trees={paint.trees} />
    <BigLeaves x={-20} y={1930} size={200} trees={paint.trees} flip />
  </g>
));

export const NightWorld = ({
  frame,
  view,
  blur,
  paint,
  ids,
  parallax,
  backdrop,
}: {
  frame: number;
  view: WorldView;
  blur: { x: number; y: number };
  paint: Paint;
  ids: Ids;
  parallax: number;
  backdrop: boolean;
}) => {
  const { cam } = view;
  return (
    <World ids={ids} paint={paint} view={view} blur={blur}>
      {backdrop ? (
        <SkyFill
          id={ids.id('sky')}
          top={paint.sky.nightTop}
          horizon={paint.sky.nightHorizon}
          horizonY={RAIL_Y}
        />
      ) : null}
      <Layer cam={cam} depth={0.1} parallax={parallax}>
        <Stars count={paint.stars.count} color={paint.stars.color} frame={frame} />
      </Layer>
      <Layer cam={cam} depth={1} parallax={parallax}>
        <Water
          id={ids.id('pond')}
          from={-800}
          to={1900}
          top={POND_TOP}
          bottom={POND_BOTTOM}
          frame={frame}
          lake={paint.lake}
        />
        <LotusField from={-800} to={1900} rows={LOTUS_ROWS} seed={21} ids={ids} />
        <Pavilion paint={paint} ids={ids} />
        {paint.peacocks.show ? (
          <Peacock
            x={420}
            y={RAIL_Y - 6}
            scale={1.1}
            tail="down"
            flip={false}
            frame={frame}
            peacocks={paint.peacocks}
            ids={ids}
          />
        ) : null}
        {paint.chandeliers.show
          ? CHANDELIERS.map((item) => (
              <Chandelier
                key={item.x}
                x={item.x}
                drop={item.drop}
                size={item.size}
                metal={paint.chandeliers.night}
                chandeliers={paint.chandeliers}
                ids={ids}
                frame={frame}
              />
            ))
          : null}
      </Layer>
      <Layer cam={cam} depth={1.25} parallax={parallax}>
        <Front paint={paint} ids={ids} />
        {paint.peacocks.show ? (
          <Peacock
            x={300}
            y={1960}
            scale={1.2}
            tail="none"
            flip={false}
            frame={frame}
            peacocks={paint.peacocks}
            ids={ids}
          />
        ) : null}
      </Layer>
    </World>
  );
};
