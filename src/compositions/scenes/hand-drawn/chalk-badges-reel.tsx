import { Composition, Sequence, useCurrentFrame } from 'remotion';
import {
  type ChalkBadgesReelProps,
  chalkBadgeDefaults,
  chalkBadgeGridDefaults,
  chalkBadgesReelDefaults,
  chalkBadgesReelMeta,
  chalkBadgesReelSchema,
  chalkTitleDefaults,
  chunkyTypeStackDefaults,
} from '@/schemas';
import { Caption } from '../../connectors/caption';
import { ChalkLayer } from '../../connectors/chalk-board';
import type { SceneModule } from '../../scene-module';
import { ChunkyTypeStack } from '../kinetic-type/chunky-type-stack';
import { ChalkBadge } from './chalk-badge';
import { ChalkBadgeGrid } from './chalk-badge-grid';
import { ChalkTitle } from './chalk-title';

const TAIL = 2;
const CAPTION_LETTER_FRAMES = 0.6;

const reelWindows = ({
  title,
  grid,
  badges,
  soloFrames,
  overlap,
}: Pick<ChalkBadgesReelProps, 'title' | 'grid' | 'badges' | 'soloFrames' | 'overlap'>) => {
  const titleEnd = title.show ? title.frames : 0;
  const gridFrom = title.show ? titleEnd - overlap : 0;
  const gridEnd = grid.show ? gridFrom + grid.frames : gridFrom;
  const soloFrom = grid.show ? gridEnd - overlap : gridEnd;
  const soloEnd = soloFrom + badges.length * soloFrames;
  const outroFrom = soloEnd - overlap;
  return { gridFrom, soloFrom, soloEnd, outroFrom };
};

const ChalkBadgesReel = (props: ChalkBadgesReelProps) => {
  const {
    title,
    grid,
    badges,
    soloFrames,
    soloScale,
    caption,
    captionSize,
    captionColor,
    outro,
    chalk,
    look,
    motion,
  } = props;
  const frame = useCurrentFrame();
  const { gridFrom, soloFrom, soloEnd, outroFrom } = reelWindows(props);
  const layer = { ...look, showBackdrop: false };
  const still = { ...motion, speed: 1 };
  const gridDelay = chalkBadgeGridDefaults.delay;
  const gridTiming = chalkBadgeGridDefaults.timing;
  const soloTiming = chalkBadgeDefaults.timing;
  return (
    <ChalkLayer look={look} motion={motion} chalk={chalk} filterId="chalk-reel-ink">
      {title.show ? (
        <Sequence durationInFrames={title.frames} layout="none">
          <ChalkTitle
            {...chalkTitleDefaults}
            left={title.left}
            right={title.right}
            wordSize={title.size}
            wordColor={title.color}
            center={title.badge}
            eraseAt={
              title.frames - chalkTitleDefaults.delay - chalkTitleDefaults.eraseFrames - TAIL
            }
            chalk={chalk}
            look={layer}
            motion={still}
          />
        </Sequence>
      ) : null}
      {grid.show ? (
        <Sequence from={gridFrom} durationInFrames={grid.frames} layout="none">
          <ChalkBadgeGrid
            {...chalkBadgeGridDefaults}
            badges={badges}
            columns={grid.columns}
            scale={grid.scale}
            timing={{
              ...gridTiming,
              eraseAt:
                grid.frames -
                gridDelay -
                (badges.length - 1) * chalkBadgeGridDefaults.eraseStagger -
                gridTiming.eraseFrames -
                TAIL,
            }}
            chalk={chalk}
            look={layer}
            motion={still}
          />
        </Sequence>
      ) : null}
      {badges.map((badge, index) => (
        <Sequence
          key={`${index.toString()}-${badge.variant}`}
          from={soloFrom + index * soloFrames}
          durationInFrames={soloFrames}
          layout="none"
        >
          <ChalkBadge
            {...chalkBadgeDefaults}
            badge={badge}
            scale={soloScale}
            caption=""
            timing={{
              ...soloTiming,
              eraseAt: soloFrames - chalkBadgeDefaults.delay - soloTiming.eraseFrames - TAIL,
            }}
            chalk={chalk}
            look={layer}
            motion={still}
          />
        </Sequence>
      ))}
      <Caption
        text={caption}
        size={captionSize}
        color={captionColor}
        frame={frame}
        start={soloFrom}
        end={soloEnd - CAPTION_LETTER_FRAMES * caption.length * 0.5 - TAIL}
        letterFrames={CAPTION_LETTER_FRAMES}
      />
      {outro.show ? (
        <Sequence from={outroFrom} durationInFrames={outro.frames} layout="none">
          <ChunkyTypeStack
            {...chunkyTypeStackDefaults}
            lines={outro.lines}
            color={outro.color}
            bar={{ ...chunkyTypeStackDefaults.bar, color: outro.barColor }}
            burst={{
              ...chunkyTypeStackDefaults.burst,
              text: outro.burstText,
              color: outro.burstColor,
            }}
            endTag={outro.endTag}
            endTagColor={outro.endTagColor}
            look={layer}
            motion={still}
          />
        </Sequence>
      ) : null}
    </ChalkLayer>
  );
};

export const chalkBadgesReelScene: SceneModule = {
  id: 'chalk-badges-reel',
  component: ChalkBadgesReel,
  render: (key) => (
    <Composition
      key={key}
      id="chalk-badges-reel"
      component={ChalkBadgesReel}
      schema={chalkBadgesReelSchema}
      defaultProps={chalkBadgesReelDefaults}
      durationInFrames={chalkBadgesReelMeta.durationInFrames}
      fps={chalkBadgesReelMeta.fps}
      width={chalkBadgesReelMeta.width}
      height={chalkBadgesReelMeta.height}
    />
  ),
};
