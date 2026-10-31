import { Composition, useCurrentFrame } from 'remotion';
import { type EchoStackProps, echoStackDefaults, echoStackMeta, echoStackSchema } from '@/schemas';
import { displayType, KineticLayer } from '../../promo/kinetic';
import { land, launch, settle, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';

export const EchoStack = ({
  text,
  rows,
  accentRow,
  size,
  weight,
  tracking,
  lineHeight,
  delay,
  rowStagger,
  rowFrames,
  travel,
  exitAt,
  placement,
  look,
  motion,
}: EchoStackProps) => {
  const frame = useCurrentFrame() * motion.speed;
  const pitch = size * lineHeight;
  return (
    <KineticLayer look={look} motion={motion} placement={placement}>
      {Array.from({ length: rows }, (_, row) => {
        const start = delay + row * rowStagger;
        const leave = exitAt + row * rowStagger;
        const rise = land(frame, [start, start + rowFrames], [size * 0.6 * travel, 0]);
        const drop = launch(frame, [leave, leave + rowFrames], [0, pitch * 0.8 * travel]);
        const opacity =
          tween(frame, [start, start + rowFrames * 0.75], [0, 1], settle) *
          (1 - tween(frame, [leave, leave + rowFrames * 0.875], [0, 1], smooth));
        return (
          <div
            key={row}
            style={{
              ...displayType(size, weight, tracking),
              height: pitch,
              lineHeight: `${pitch}px`,
              color: row + 1 === accentRow ? look.accent : look.ink,
              opacity,
              transform: `translateY(${(rise + drop).toFixed(2)}px)`,
              willChange: 'transform',
            }}
          >
            {text}
          </div>
        );
      })}
    </KineticLayer>
  );
};

export const echoStackScene: SceneModule = {
  id: 'echo-stack',
  component: EchoStack,
  render: (key) => (
    <Composition
      key={key}
      id="echo-stack"
      component={EchoStack}
      schema={echoStackSchema}
      defaultProps={echoStackDefaults}
      durationInFrames={echoStackMeta.durationInFrames}
      fps={echoStackMeta.fps}
      width={echoStackMeta.width}
      height={echoStackMeta.height}
    />
  ),
};
