import { Composition, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import { type GridStackProps, gridStackDefaults, gridStackMeta, gridStackSchema } from '@/schemas';
import { PromoLayer } from '../../promo/promo-layer';
import { accelerate, smooth, tween } from '../../promo/timing';
import type { SceneModule } from '../../scene-module';
import { AnimatedWord, type Pose } from '../../type3d/animated-word';
import { FrameComposer } from '../../type3d/frame-composer';
import { layoutStack, type StackPhrase } from '../../type3d/stack-layout';
import { CameraShot, type TypeCamera, TypeCanvas, viewHeight } from '../../type3d/type-canvas';
import { WarpGrid } from '../../type3d/warp-grid';

const snap = Easing.bezier(0.22, 0.6, 0.25, 1);

const deg = (value: number) => (value / 180) * Math.PI;

const phraseAngles = (index: number, props: GridStackProps) => {
  const side = index % 2 === 0 ? 1 : -1;
  return { yaw: side * props.swing, roll: -side * props.tilt, pitch: side * props.tilt * 0.6 };
};

const orbit = (time: number, phrases: StackPhrase[], props: GridStackProps): TypeCamera => {
  const first = phraseAngles(0, props);
  let yaw = first.yaw * 2.2;
  let roll = first.roll * 2;
  let pitch = first.pitch;
  const intro = tween(time, [props.delay, props.delay + props.arriveFrames + 10], [0, 1], snap);
  yaw += (first.yaw - yaw) * intro;
  roll += (first.roll - roll) * intro;
  phrases.forEach((phrase, index) => {
    if (index === 0) {
      return;
    }
    const target = phraseAngles(index, props);
    const swing = tween(
      time,
      [phrase.start - 2, phrase.start + props.settleFrames + 6],
      [0, 1],
      smooth,
    );
    yaw += (target.yaw - yaw) * swing;
    roll += (target.roll - roll) * swing;
    pitch += (target.pitch - pitch) * swing;
  });
  const drift = props.camera.drift;
  yaw += Math.sin(time / 23) * 4 * drift;
  pitch += Math.cos(time / 29) * 2 * drift;
  roll += Math.sin(time / 31) * 1.5 * drift;
  const distance = props.camera.distance;
  const yawRad = deg(yaw);
  const pitchRad = deg(pitch);
  return {
    position: [
      Math.sin(yawRad) * Math.cos(pitchRad) * distance,
      Math.sin(pitchRad) * distance,
      Math.cos(yawRad) * Math.cos(pitchRad) * distance,
    ],
    target: [0, 0, 0],
    fov: props.camera.fieldOfView,
    roll: deg(roll),
  };
};

const wordPose =
  (phrase: StackPhrase, index: number, side: number, isLast: boolean, props: GridStackProps) =>
  (time: number): Pose => {
    const word = phrase.words[index];
    if (word === undefined) {
      return { position: [0, 0, 0], rotation: [0, 0, 0], scale: 0, opacity: 0 };
    }
    const arriveAt = phrase.start + index * props.wordGap;
    const arrive = tween(time, [arriveAt, arriveAt + props.arriveFrames], [0, 1], snap);
    const reveal = tween(time, [arriveAt, arriveAt + props.arriveFrames * 0.3], [0, 1], smooth);
    let lift = phrase.offsets[0] ?? 0;
    phrase.offsets.forEach((offset, step) => {
      if (step === 0) {
        return;
      }
      const at = phrase.start + step * props.wordGap;
      const push = tween(time, [at, at + props.settleFrames], [0, 1], snap);
      lift += (offset - lift) * push;
    });
    const leaveAt = phrase.exitAt + (phrase.words.length - 1 - index);
    const leave = isLast
      ? 0
      : tween(time, [leaveAt, leaveAt + props.exitFrames], [0, 1], accelerate);
    const fade = isLast
      ? 0
      : tween(
          time,
          [leaveAt + props.exitFrames * 0.45, leaveAt + props.exitFrames],
          [0, 1],
          smooth,
        );
    return {
      position: [
        word.x - side * leave * 9,
        word.y + lift - (1 - arrive) * 3.4 + leave * 1.2,
        -(1 - arrive) * 5 + leave * 1.5,
      ],
      rotation: [(1 - arrive) * 1.25, -side * leave * 0.7, 0],
      scale: 0.82 + 0.18 * arrive,
      opacity: reveal * (1 - fade),
    };
  };

const Grid = ({ props }: { props: GridStackProps }) => {
  const { width, height } = useVideoConfig();
  const span = viewHeight(props.camera.distance - props.grid.depth, props.camera.fieldOfView) * 2;
  return (
    <WarpGrid
      width={(span * width) / height}
      height={span}
      spacing={props.grid.spacing}
      bulge={props.grid.bulge}
      lineWidth={props.grid.lineWidth}
      color={props.grid.color}
      opacity={props.gridOpacity}
      z={props.grid.depth}
    />
  );
};

const Stack = ({ props, frame }: { props: GridStackProps; frame: number }) => {
  const phrases = layoutStack(props);
  return (
    <FrameComposer
      frame={frame}
      lens={props.lens}
      backdrop={{
        show: props.look.showBackdrop,
        inner: props.look.background,
        outer: props.look.backgroundEdge,
        glow: props.look.accent,
      }}
    >
      <CameraShot shot={(time) => orbit(time, phrases, props)} />
      {props.grid.show ? <Grid props={props} /> : null}
      {phrases.map((phrase, phraseIndex) => {
        const isLast = phraseIndex === phrases.length - 1;
        if (frame < phrase.start - 2 || (!isLast && frame > phrase.end + phrase.words.length + 2)) {
          return null;
        }
        return phrase.words.map((word, index) => (
          <AnimatedWord
            key={`${phraseIndex}:${index}:${word.text}`}
            art={{ text: word.text, color: word.color, weight: props.weight, face: props.face }}
            height={word.height}
            bend={(props.bend * word.width) / props.maxWidth}
            pose={wordPose(phrase, index, phraseIndex % 2 === 0 ? 1 : -1, isLast, props)}
            renderOrder={index}
          />
        ));
      })}
    </FrameComposer>
  );
};

export const GridStack = (props: GridStackProps) => {
  const frame = useCurrentFrame() * props.motion.speed;
  return (
    <PromoLayer look={{ ...props.look, showBackdrop: false }} motion={props.motion}>
      <TypeCanvas fov={props.camera.fieldOfView}>
        <Stack props={props} frame={frame} />
      </TypeCanvas>
    </PromoLayer>
  );
};

export const gridStackScene: SceneModule = {
  id: 'grid-stack',
  component: GridStack,
  render: (key) => (
    <Composition
      key={key}
      id="grid-stack"
      component={GridStack}
      schema={gridStackSchema}
      defaultProps={gridStackDefaults}
      durationInFrames={gridStackMeta.durationInFrames}
      fps={gridStackMeta.fps}
      width={gridStackMeta.width}
      height={gridStackMeta.height}
    />
  ),
};
