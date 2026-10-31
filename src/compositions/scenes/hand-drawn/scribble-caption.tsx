import { Composition, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  type ScribbleCaptionProps,
  scribbleCaptionDefaults,
  scribbleCaptionMeta,
  scribbleCaptionSchema,
} from '@/schemas';
import { easedGradient } from '../../promo/backdrop';
import { kineticFont } from '../../promo/fonts';
import { glowShadow, withAlpha } from '../../promo/glow';
import { KineticLayer } from '../../promo/kinetic';
import { Scribble } from '../../promo/scribble';
import { land, settle, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

const OFFSET_Y: Record<ScribbleCaptionProps['scribblePlace'], number> = {
  through: 0,
  under: 1.1,
  around: 0,
};

const scatterOf = (index: number, amount: number, size: number) =>
  amount <= 0
    ? ''
    : ` translate(${(Math.cos(index * 1.3) * size * 0.9 * amount).toFixed(2)}px, ${(Math.sin(index * 2.1) * size * 1.6 * amount).toFixed(2)}px) rotate(${(Math.sin(index * 0.7) * 50 * amount).toFixed(2)}deg)`;

export const ScribbleCaption = (props: ScribbleCaptionProps) => {
  const { text, size, weight, tracking, spread, delay, drawFrames, placement, look, motion } =
    props;
  const frame = useCurrentFrame() * motion.speed;
  const { durationInFrames } = useVideoConfig();
  const letters = Array.from(text);
  const middle = (letters.length - 1) / 2;
  const reach = Math.max(1, middle * tracking * spread * size);
  const drawAt =
    props.scribbleAt === 'start' ? delay : durationInFrames - motion.exitFrames - drawFrames - 4;
  const textStart = props.scribbleAt === 'start' ? delay + Math.round(drawFrames * 0.35) : delay;
  const typeEnd = textStart + letters.length * props.typeFrames;
  const open =
    props.reveal === 'spread'
      ? land(frame, [textStart, textStart + props.spreadFrames], [1, 0], 1 / reach)
      : 0;
  const extraTracking =
    props.reveal === 'type' ? land(frame, [textStart, typeEnd + 8], [spread, 0], 0.002) : 0;
  const shown =
    props.reveal === 'spread' ? tween(frame, [textStart, textStart + 16], [0, 1], settle) : 1;
  const head = tween(frame, [drawAt, drawAt + drawFrames], [0, 1], smooth);
  const tail = props.keepScribble
    ? 0
    : tween(frame, [drawAt + drawFrames * 0.6, drawAt + drawFrames * 1.7], [0, 1], smooth);
  const scatter =
    props.scribbleAt === 'end'
      ? tween(frame, [drawAt + 4, drawAt + drawFrames], [0, 1], smooth)
      : 0;
  const glowStart = drawAt - 30;
  const glow = props.glowOut * tween(frame, [glowStart, drawAt + drawFrames], [0, 1], (t) => t * t);
  const scribble = (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translateY(${OFFSET_Y[props.scribblePlace] * size}px) scale(${props.scribblePlace === 'around' ? 1.25 : 1})`,
        pointerEvents: 'none',
        filter:
          glow > 0
            ? `drop-shadow(0 0 ${(glow * 18).toFixed(2)}px ${props.scribbleColor})`
            : undefined,
      }}
    >
      <Scribble
        shape={props.shape}
        head={head}
        tail={tail}
        width={props.scribbleWidth}
        strokeWidth={props.strokeWidth}
        color={props.scribbleColor}
      />
    </div>
  );
  return (
    <KineticLayer look={look} motion={motion} placement={placement}>
      <div style={{ position: 'relative' }}>
        {glow > 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: `-${size * 9}px -${size * 14}px`,
              opacity: Math.min(1, glow * 1.4) * (1 - scatter * 0.7),
              background: `radial-gradient(50% 50% at 50% 50%, ${easedGradient(withAlpha(look.ink, 0.95), withAlpha(look.ink, 0))})`,
            }}
          />
        ) : null}
        {scribble}
        <div
          style={{
            fontFamily: kineticFont,
            fontSize: size,
            fontWeight: weight,
            letterSpacing: `${tracking + extraTracking}em`,
            lineHeight: 1.2,
            whiteSpace: 'pre',
            color: look.ink,
            opacity: shown,
            marginRight: `-${tracking}em`,
            textShadow: glowShadow(look.ink, glow * 2, size * 1.6),
          }}
        >
          {letters.map((letter, index) => {
            const typed =
              props.reveal === 'type'
                ? tween(
                    frame,
                    [
                      textStart + index * props.typeFrames,
                      textStart + index * props.typeFrames + 2,
                    ],
                    [0, 1],
                    (t) => t,
                  )
                : 1;
            const shift = -(index - middle) * tracking * spread * size * open;
            return (
              <span
                key={`${index}:${letter}`}
                style={{
                  display: 'inline-block',
                  opacity: typed * (1 - scatter * 0.9) * (1 - glow * 0.6),
                  transform: `translateX(${shift.toFixed(3)}px)${scatterOf(index, scatter, size)}`,
                  filter: glow > 0.2 ? `blur(${((glow - 0.2) * 6).toFixed(2)}px)` : undefined,
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      </div>
    </KineticLayer>
  );
};

export const scribbleCaptionScene: SceneModule = {
  id: 'scribble-caption',
  component: ScribbleCaption,
  render: (key) => (
    <Composition
      key={key}
      id="scribble-caption"
      component={ScribbleCaption}
      schema={scribbleCaptionSchema}
      defaultProps={scribbleCaptionDefaults}
      durationInFrames={scribbleCaptionMeta.durationInFrames}
      fps={scribbleCaptionMeta.fps}
      width={scribbleCaptionMeta.width}
      height={scribbleCaptionMeta.height}
    />
  ),
};
