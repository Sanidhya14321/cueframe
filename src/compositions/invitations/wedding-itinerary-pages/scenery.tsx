import type { ReactNode } from 'react';
import type { ItineraryScene, WeddingItineraryPagesProps } from '@/schemas';
import { ArtDefs, resolveArt } from './art';
import { HEIGHT, WIDTH } from './paint';
import { DanceFloorScene } from './scene-dance';
import { GardenDinnerScene } from './scene-dinner';
import { HaldiLoungeScene } from './scene-haldi';
import { MandapScene } from './scene-mandap';
import { PavilionsScene } from './scene-pavilions';
import { cameraDrift, Sky, type Stage } from './stage';
import type { ScenePage } from './timeline';

const SCENES: Record<ItineraryScene, (props: { stage: Stage }) => ReactNode> = {
  pavilions: PavilionsScene,
  'haldi-lounge': HaldiLoungeScene,
  'dance-floor': DanceFloorScene,
  mandap: MandapScene,
  'garden-dinner': GardenDinnerScene,
};

export const Scenery = ({
  page,
  index,
  props,
  frame,
  opacity,
}: {
  page: ScenePage;
  index: number;
  props: WeddingItineraryPagesProps;
  frame: number;
  opacity: number;
}) => {
  const { scenery, timing, look, layout } = props;
  const opening = index === 0;
  const art = resolveArt(props, page.look, `wip${index}`, frame);
  const stage: Stage = {
    art,
    local: frame - page.start,
    build: opening ? scenery.build : scenery.settle,
    frames: timing.buildFrames,
  };
  const Scene = SCENES[page.look.scene];
  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ position: 'absolute', left: 0, top: 0, opacity: opacity < 1 ? opacity : undefined }}
      aria-hidden="true"
    >
      <ArtDefs art={art} />
      {look.showBackdrop ? <Sky art={art} wash={look.wash} /> : null}
      <g transform={`translate(0 ${layout.horizon})`}>
        <g transform={cameraDrift(stage, opening ? 0 : scenery.drift)}>
          <Scene stage={stage} />
        </g>
      </g>
    </svg>
  );
};
