import { useMemo, useRef } from 'react';
import { Composition, Easing, useCurrentFrame } from 'remotion';
import * as THREE from 'three';
import { type LensOrbitProps, lensOrbitDefaults, lensOrbitMeta, lensOrbitSchema } from '@/schemas';
import { PromoLayer } from '../../promo/promo-layer';
import { settle, smooth, tween } from '../../promo/timing';
import { highlightSet, normalize, wordsOf } from '../../promo/words';
import type { SceneModule } from '../../scene-module';
import { FrameComposer, useAnimator } from '../../type3d/frame-composer';
import { useInkMaterial } from '../../type3d/ink-material';
import { setUniform } from '../../type3d/post-shader';
import { faceTurn, spherePatch } from '../../type3d/sphere-patch';
import { CameraShot, driftCamera, TypeCanvas } from '../../type3d/type-canvas';
import { useWordTexture, type WordArt } from '../../type3d/word-art';

const tumble = Easing.bezier(0.5, 0, 0.25, 1);

const deg = (value: number) => (value / 180) * Math.PI;

const FACE_SPOTS: [number, number, number][] = [
  [0, 0, 0],
  [90, 0, 6],
  [0, 90, -8],
  [270, 0, 10],
  [0, -90, -6],
  [180, 0, 8],
];

const SATELLITE_SPOTS: [number, number][] = [
  [-0.32, 1.05],
  [0.36, -1.05],
];

const spot = (index: number) => FACE_SPOTS[index % FACE_SPOTS.length] ?? [0, 0, 0];

const directionOf = (yaw: number, pitch: number) =>
  new THREE.Vector3(
    Math.sin(deg(yaw)) * Math.cos(deg(pitch)),
    Math.sin(deg(pitch)),
    Math.cos(deg(yaw)) * Math.cos(deg(pitch)),
  );

const PatchWord = ({
  art,
  props,
  scale,
  turn,
  direction,
  orientationAt,
}: {
  art: WordArt;
  props: LensOrbitProps;
  scale: number;
  turn: THREE.Quaternion;
  direction: THREE.Vector3;
  orientationAt: (time: number) => THREE.Quaternion;
}) => {
  const { texture, aspect, frameX, frameY } = useWordTexture(art);
  const material = useInkMaterial(texture, 1, { edgeFade: props.edgeFade });
  useAnimator((time) => {
    const facing = direction.clone().applyQuaternion(orientationAt(time)).z;
    const reveal = tween(
      time,
      [props.delay, props.delay + props.introFrames * 0.5],
      [0, 1],
      smooth,
    );
    setUniform(material, 'opacity', reveal * tween(facing, [0.55, 0.92], [0, 1], smooth));
  });
  const height = deg(props.wordHeight) * scale;
  const width = Math.min(height * aspect, deg(props.maxArc) * scale);
  const fitted = width / aspect;
  const geometry = useMemo(
    () => spherePatch(props.radius, width * frameX, fitted * frameY),
    [props.radius, width, fitted, frameX, frameY],
  );
  return <mesh geometry={geometry} material={material} quaternion={turn} />;
};

const useFaces = (props: LensOrbitProps) => {
  const accented = highlightSet(props.highlight);
  const color = (word: string) =>
    accented.has(normalize(word)) ? props.look.accent : props.look.ink;
  const words = props.words
    .split('\n')
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
  const satellites = wordsOf(props.satellites);
  return words.map((text, index) => {
    const [yaw, pitch, roll] = spot(index);
    const direction = directionOf(yaw, pitch);
    const turn = faceTurn(direction, deg(roll));
    return {
      text,
      direction,
      color: color(text),
      turn,
      front: turn.clone().invert(),
      moons: SATELLITE_SPOTS.map(([across, up], moon) => {
        const height = deg(props.wordHeight);
        const local = faceTurn(
          new THREE.Vector3(Math.sin(across), Math.sin(up * height), 1),
          deg(moon === 0 ? -8 : 8),
        );
        const word =
          satellites[(index * SATELLITE_SPOTS.length + moon) % Math.max(1, satellites.length)] ??
          '';
        return {
          text: word,
          turn: turn.clone().multiply(local),
          color: moon === 0 ? props.satelliteColor : props.satelliteAccent,
        };
      }),
    };
  });
};

const Globe = ({ props }: { props: LensOrbitProps }) => {
  const faces = useFaces(props);
  const group = useRef<THREE.Group>(null);
  const spinAxis = useMemo(() => new THREE.Vector3(0.6, 1, 0.2).normalize(), []);
  const orientationAt = (time: number): THREE.Quaternion => {
    const first = faces[0];
    if (first === undefined) {
      return new THREE.Quaternion();
    }
    const intro = tween(time, [props.delay, props.delay + props.introFrames], [0, 1], settle);
    const orientation = new THREE.Quaternion()
      .setFromAxisAngle(spinAxis, (1 - intro) * props.introSpin)
      .multiply(first.front);
    const firstHold = props.delay + props.introFrames;
    faces.forEach((face, index) => {
      const previous = faces[index - 1];
      if (previous === undefined) {
        return;
      }
      const at = firstHold + index * props.holdFrames + (index - 1) * props.turnFrames;
      const turn = tween(time, [at, at + props.turnFrames], [0, 1], tumble);
      if (turn > 0) {
        orientation.copy(previous.front).slerp(face.front, turn);
      }
    });
    const wobble = new THREE.Euler(
      Math.sin(time / 21) * props.wobble,
      Math.cos(time / 27) * props.wobble,
      Math.sin(time / 33) * props.wobble * 0.5,
    );
    return new THREE.Quaternion().setFromEuler(wobble).multiply(orientation);
  };
  useAnimator((time) => {
    const target = group.current;
    if (target === null) {
      return;
    }
    target.quaternion.copy(orientationAt(time));
    target.scale.setScalar(
      props.introScale +
        (1 - props.introScale) *
          tween(time, [props.delay, props.delay + props.introFrames], [0, 1], settle),
    );
  });
  return (
    <group ref={group}>
      {faces.map((face, index) => (
        <group key={`${index}:${face.text}`}>
          <PatchWord
            art={{ text: face.text, color: face.color, weight: props.weight, face: props.face }}
            props={props}
            scale={1}
            turn={face.turn}
            direction={face.direction}
            orientationAt={orientationAt}
          />
          {face.moons.map((moon, moonIndex) =>
            moon.text === '' ? null : (
              <PatchWord
                key={`${moonIndex}:${moon.text}`}
                art={{ text: moon.text, color: moon.color, weight: props.weight, face: props.face }}
                props={props}
                scale={props.satelliteScale}
                turn={moon.turn}
                direction={face.direction}
                orientationAt={orientationAt}
              />
            ),
          )}
        </group>
      ))}
    </group>
  );
};

export const LensOrbit = (props: LensOrbitProps) => {
  const { look, motion, camera } = props;
  const frame = useCurrentFrame() * motion.speed;
  return (
    <PromoLayer look={{ ...look, showBackdrop: false }} motion={motion}>
      <TypeCanvas fov={camera.fieldOfView}>
        <FrameComposer
          frame={frame}
          lens={props.lens}
          backdrop={{
            show: look.showBackdrop,
            inner: look.background,
            outer: look.backgroundEdge,
            glow: look.accent,
          }}
        >
          <CameraShot
            shot={(time) => driftCamera(time, camera.distance, camera.fieldOfView, camera.drift)}
          />
          <Globe props={props} />
        </FrameComposer>
      </TypeCanvas>
    </PromoLayer>
  );
};

export const lensOrbitScene: SceneModule = {
  id: 'lens-orbit',
  component: LensOrbit,
  render: (key) => (
    <Composition
      key={key}
      id="lens-orbit"
      component={LensOrbit}
      schema={lensOrbitSchema}
      defaultProps={lensOrbitDefaults}
      durationInFrames={lensOrbitMeta.durationInFrames}
      fps={lensOrbitMeta.fps}
      width={lensOrbitMeta.width}
      height={lensOrbitMeta.height}
    />
  ),
};
