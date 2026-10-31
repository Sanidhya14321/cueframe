import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type DoodleArrowsProps,
  doodleArrowsDefaults,
  doodleArrowsMeta,
  doodleArrowsSchema,
} from '@/schemas';
import { InkArrow } from '../../promo/ink-arrow';
import { PromoLayer } from '../../promo/promo-layer';
import type { SceneModule } from '../../scene-module';

const ERASE_MARGIN = 2;

export const DoodleArrows = ({
  arrows,
  delay,
  drawFrames,
  headSize,
  eraseFrames,
  eraseStagger,
  breakApart,
  seed,
  ink,
  look,
  motion,
}: DoodleArrowsProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height, durationInFrames } = useVideoConfig();
  const end = durationInFrames * motion.speed - ERASE_MARGIN;
  const eraseStartFor = (index: number) =>
    breakApart
      ? end - eraseFrames - (arrows.length - 1 - index) * eraseStagger
      : durationInFrames * motion.speed;
  return (
    <PromoLayer look={look} motion={motion}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        aria-hidden="true"
      >
        {arrows.map((arrow, index) => (
          <g
            key={`${index.toString()}:${arrow.shape}`}
            transform={`translate(${(arrow.x / 100) * width} ${(arrow.y / 100) * height}) rotate(${arrow.rotation}) scale(${arrow.flipX ? -1 : 1} ${arrow.flipY ? -1 : 1})`}
          >
            <InkArrow
              shape={arrow.shape}
              size={arrow.size}
              headSize={headSize}
              ink={ink}
              color={look.ink}
              leadColor={look.accent}
              frame={frame}
              seed={seed + index * 97}
              drawStart={delay + arrow.delay}
              drawFrames={drawFrames}
              eraseStart={eraseStartFor(index)}
              eraseFrames={eraseFrames}
            />
          </g>
        ))}
      </svg>
    </PromoLayer>
  );
};

export const doodleArrowsScene: SceneModule = {
  id: 'doodle-arrows',
  component: DoodleArrows,
  render: (key) => (
    <Composition
      key={key}
      id="doodle-arrows"
      component={DoodleArrows}
      schema={doodleArrowsSchema}
      defaultProps={doodleArrowsDefaults}
      durationInFrames={doodleArrowsMeta.durationInFrames}
      fps={doodleArrowsMeta.fps}
      width={doodleArrowsMeta.width}
      height={doodleArrowsMeta.height}
    />
  ),
};
