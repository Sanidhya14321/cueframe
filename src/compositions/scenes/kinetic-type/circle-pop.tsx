import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import { type CirclePopProps, circlePopDefaults, circlePopMeta, circlePopSchema } from '@/schemas';
import { useFittedSizes } from '../../circle-pop/fitted-sizes';
import { Subline } from '../../circle-pop/subline';
import {
  blobPath,
  circlePopTimeline,
  cornerReach,
  fadeIn,
  invertHex,
  mixHex,
  playbackSpeed,
  popRadius,
  tiltAt,
  wordSizeAt,
} from '../../circle-pop/timeline';
import { displayFont } from '../../promo/fonts';
import { PromoLayer } from '../../promo/promo-layer';
import { settle, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const DEGREES = Math.PI / 180;

const tonedLook = (look: CirclePopProps['look'], tone: (color: string) => string) => ({
  ...look,
  background: tone(look.background),
  backgroundEdge: tone(look.backgroundEdge),
  paper: 'plain' as const,
  paperMargin: false,
});

const CirclePop = (props: CirclePopProps) => {
  const { word, disc, pop, wobble, flood, subline, look, motion } = props;
  const tone = (color: string) => (props.inverted ? invertHex(color) : color);
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const speed = playbackSpeed(props, durationInFrames);
  const timeline = circlePopTimeline(props, speed);
  const fitted = useFittedSizes(props, width);
  const centerX = width / 2 + disc.offsetX;
  const centerY = height / 2 + disc.offsetY;
  const opacity = fadeIn(frame, timeline);
  const flooded = tween(frame, [timeline.floodStart, timeline.floodEnd], [0, 1], smooth);
  const amplitude =
    wobble.amount * tween(frame, [timeline.popPeak, timeline.floodStart], [0, 1], settle);
  const restRadius = popRadius(frame, timeline, disc.size / 2, pop.overshoot);
  const floodRadius =
    (flood.reach * cornerReach(width, height, centerX, centerY)) / (1 - wobble.amount);
  const radius = restRadius + (floodRadius - restRadius) * flooded;
  const size = wordSizeAt(frame, timeline, fitted.startSize, fitted.endSize, pop.overshoot);
  const rotation = tiltAt(frame, timeline, word.rotation, props.tilt.angle);
  const phase = frame * speed * wobble.speed * DEGREES;
  return (
    <PromoLayer look={tonedLook(look, tone)} motion={motion}>
      {opacity > 0 && radius > 0 ? (
        <AbsoluteFill style={{ opacity }}>
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ position: 'absolute', inset: 0 }}
            aria-hidden="true"
          >
            <path
              d={blobPath(centerX, centerY, radius, amplitude, wobble.lobes, phase, wobble.shape)}
              fill={tone(look.ink)}
            />
          </svg>
          {size > 0 && word.text !== '' ? (
            <AbsoluteFill
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                transform: `translate(${disc.offsetX}px, ${disc.offsetY}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: displayFont,
                  fontSize: word.endSize,
                  fontWeight: word.weight,
                  letterSpacing: `${word.tracking}em`,
                  lineHeight: 1,
                  whiteSpace: 'pre',
                  color: mixHex(tone(word.color), tone(word.floodColor), flooded),
                  transform: `rotate(${rotation.toFixed(3)}deg) scale(${(size / word.endSize).toFixed(5)})`,
                }}
              >
                {word.text}
              </div>
            </AbsoluteFill>
          ) : null}
          <Subline
            frame={frame}
            start={timeline.sublineStart}
            end={timeline.sublineEnd}
            subline={subline}
            size={fitted.sublineSize}
            color={tone(subline.color)}
            anchorY={height / 2 + fitted.wordBottom}
            offsetX={disc.offsetX}
            offsetY={disc.offsetY}
            rotation={rotation}
          />
        </AbsoluteFill>
      ) : null}
    </PromoLayer>
  );
};

export const circlePopScene: SceneModule = {
  id: 'circle-pop',
  component: CirclePop,
  render: (key) => (
    <Composition
      key={key}
      id="circle-pop"
      component={CirclePop}
      schema={circlePopSchema}
      defaultProps={circlePopDefaults}
      durationInFrames={circlePopMeta.durationInFrames}
      fps={circlePopMeta.fps}
      width={circlePopMeta.width}
      height={circlePopMeta.height}
    />
  ),
};
