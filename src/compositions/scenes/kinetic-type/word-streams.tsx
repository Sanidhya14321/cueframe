import { useMemo } from 'react';
import { AbsoluteFill, Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type WordStreamsProps,
  wordStreamsDefaults,
  wordStreamsMeta,
  wordStreamsSchema,
} from '@/schemas';
import { Backdrop } from '../../promo/backdrop';
import { useCanvasFont } from '../../promo/desk/canvas-texture';
import { displayFont, displayFontReady } from '../../promo/fonts';
import { smooth, tween } from '../../promo/timing';
import { TransitionFrame } from '../../promo/transition-frame';
import type { SceneModule } from '../../scene-module';
import { measureWord } from '../../word-streams/measure-word';
import { type StreamCopy, streamCopies } from '../../word-streams/stream-copies';
import { streamLayout } from '../../word-streams/stream-layout';
import { toneLook, withAlpha } from '../../word-streams/stream-tone';

const OUTLINE_BAND = 0.06;

const outlineState = ({ swell }: WordStreamsProps, copy: StreamCopy) => {
  if (!swell.outline) {
    return { fill: 1, stroke: 0 };
  }
  if (swell.drift === 0) {
    return copy.swell >= swell.outlineFrom ? { fill: 0, stroke: 1 } : { fill: 1, stroke: 0 };
  }
  const start = swell.outlineFrom - OUTLINE_BAND;
  return {
    fill: tween(copy.swell, [swell.outlineFrom, swell.outlineFrom + OUTLINE_BAND], [1, 0], smooth),
    stroke: tween(copy.swell, [start, swell.outlineFrom], [0, 1], smooth),
  };
};

const streamOpacity = ({ flow }: WordStreamsProps, index: number, rawFrame: number): number => {
  if (flow.fadeFrames <= 0) {
    return 1;
  }
  const start = index * flow.riseStagger;
  return tween(rawFrame, [start, start + flow.fadeFrames], [0, 1], smooth);
};

const WordStreams = (props: WordStreamsProps) => {
  const { word, streams, swell, motion } = props;
  useCanvasFont(`${word.weight} 100px "${displayFont}"`, displayFontReady);
  const look = toneLook(props);
  const rawFrame = useCurrentFrame();
  const frame = rawFrame * motion.speed;
  const { width, height } = useVideoConfig();
  const ink = useMemo(
    () => measureWord(word.text, displayFont, word.weight, word.tracking),
    [word.text, word.weight, word.tracking],
  );
  const layout = streamLayout(props, ink, width);
  return (
    <TransitionFrame motion={motion}>
      {look.showBackdrop ? <Backdrop look={look} /> : null}
      <AbsoluteFill>
        {Array.from({ length: streams.count }, (_, index) => (
          <AbsoluteFill key={index} style={{ opacity: streamOpacity(props, index, rawFrame) }}>
            {streamCopies({ props, layout, index, rawFrame, frame, height }).map((copy) => {
              const { fill, stroke } = outlineState(props, copy);
              return (
                <div
                  key={`${index}-${copy.key}`}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    transformOrigin: '0 0',
                    transform: `translate(${copy.x.toFixed(2)}px, ${copy.y.toFixed(2)}px) rotate(${copy.angle.toFixed(5)}rad) translate(-50%, -50%) translate(${(-ink.offsetX * copy.size).toFixed(2)}px, ${(-ink.offsetY * copy.size).toFixed(2)}px)`,
                    fontFamily: displayFont,
                    fontSize: copy.size,
                    fontWeight: word.weight,
                    letterSpacing: `${word.tracking}em`,
                    lineHeight: 1,
                    whiteSpace: 'pre',
                    color: fill < 1 ? withAlpha(look.ink, fill) : look.ink,
                    WebkitTextStroke:
                      stroke > 0
                        ? `${(swell.outlineWidth * stroke).toFixed(2)}px ${look.ink}`
                        : undefined,
                  }}
                >
                  {word.text}
                </div>
              );
            })}
          </AbsoluteFill>
        ))}
      </AbsoluteFill>
    </TransitionFrame>
  );
};

export const wordStreamsScene: SceneModule = {
  id: 'word-streams',
  component: WordStreams,
  render: (key) => (
    <Composition
      key={key}
      id="word-streams"
      component={WordStreams}
      schema={wordStreamsSchema}
      defaultProps={wordStreamsDefaults}
      durationInFrames={wordStreamsMeta.durationInFrames}
      fps={wordStreamsMeta.fps}
      width={wordStreamsMeta.width}
      height={wordStreamsMeta.height}
    />
  ),
};
