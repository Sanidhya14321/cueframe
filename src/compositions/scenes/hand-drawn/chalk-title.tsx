import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type ChalkTitleProps,
  chalkTitleDefaults,
  chalkTitleMeta,
  chalkTitleSchema,
} from '@/schemas';
import {
  BADGE_HEIGHT,
  BADGE_WIDTH,
  Badge,
  chalkFilterStyle,
  WordView,
} from '../../connectors/badge';
import { word } from '../../connectors/badge-parts';
import { ChalkLayer } from '../../connectors/chalk-board';
import type { SceneModule } from '../../scene-module';

const FILTER_ID = 'chalk-title-ink';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const span = (progress: number, from: number, to: number): number =>
  clamp01((progress - from) / (to - from));

export const ChalkTitle = ({
  left,
  right,
  wordSize,
  wordColor,
  wordFont,
  wordTilt,
  gap,
  centerScale,
  center,
  delay,
  drawFrames,
  eraseAt,
  eraseFrames,
  chalk,
  look,
  motion,
}: ChalkTitleProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const { width, height } = useVideoConfig();
  const draw = clamp01((frame - delay) / drawFrames);
  const erase = clamp01((frame - delay - eraseAt) / eraseFrames);
  const words = [
    {
      text: left,
      shown: span(draw, 0, 0.5),
      gone: span(erase, 0.4, 1),
      anchor: 'end' as const,
      x: -gap,
    },
    {
      text: right,
      shown: span(draw, 0.5, 1),
      gone: span(erase, 0, 0.6),
      anchor: 'start' as const,
      x: gap,
    },
  ];
  return (
    <ChalkLayer look={look} motion={motion} chalk={chalk} filterId={FILTER_ID}>
      <Badge
        badge={center}
        chalk={chalk}
        draw={span(draw, 0.28, 0.8)}
        erase={span(erase, 0.2, 0.8)}
        x={width / 2}
        y={height / 2}
        scale={centerScale}
        id="chalk-title-center"
        filterId={FILTER_ID}
      />
      <div
        style={{
          position: 'absolute',
          left: width / 2 - BADGE_WIDTH / 2,
          top: height / 2 - BADGE_HEIGHT / 2,
          width: BADGE_WIDTH,
          height: BADGE_HEIGHT,
          filter: chalkFilterStyle(FILTER_ID, chalk),
        }}
      >
        {words.map((entry) => (
          <WordView
            key={entry.anchor}
            part={word(wordFont, wordSize, [0, 1], {
              x: entry.x,
              y: 6,
              rotate: wordTilt,
              reveal: 'wipe',
              anchor: entry.anchor,
              unwrite: true,
            })}
            text={entry.text}
            color={wordColor}
            shown={entry.shown}
            gone={entry.gone}
          />
        ))}
      </div>
    </ChalkLayer>
  );
};

export const chalkTitleScene: SceneModule = {
  id: 'chalk-title',
  component: ChalkTitle,
  render: (key) => (
    <Composition
      key={key}
      id="chalk-title"
      component={ChalkTitle}
      schema={chalkTitleSchema}
      defaultProps={chalkTitleDefaults}
      durationInFrames={chalkTitleMeta.durationInFrames}
      fps={chalkTitleMeta.fps}
      width={chalkTitleMeta.width}
      height={chalkTitleMeta.height}
    />
  ),
};
