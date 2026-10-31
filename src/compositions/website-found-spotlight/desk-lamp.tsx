import { useMemo } from 'react';
import * as THREE from 'three';
import type { WebsiteFoundSpotlightProps } from '@/schemas';
import { createBeamMaterial, updateBeamMaterial } from './beam-material';
import {
  aimQuaternion,
  lampGeometries,
  rodTransform,
  SHADE_DEPTH,
  SHADE_OPENING,
} from './lamp-geometry';
import { QuestionMark } from './question-mark';

type Palette = WebsiteFoundSpotlightProps['palette'];

type LampLook = WebsiteFoundSpotlightProps['lamp'];

const ELBOW = new THREE.Vector3(0.2, 1.3, -0.04);

const HEAD_JOINT = new THREE.Vector3(-0.24, 1.81, 0.04);

const HEAD_DROP = new THREE.Vector3(-0.2, -0.42, 0.06);

const ROD_GAP = new THREE.Vector3(0, 0, 0.022);

const Rod = ({
  from,
  to,
  material,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  material: THREE.Material;
}) => {
  const { rod } = lampGeometries();
  const { position, quaternion, length } = rodTransform(from, to);
  return (
    <mesh
      geometry={rod}
      material={material}
      position={position}
      quaternion={quaternion}
      scale={[1, length, 1]}
      castShadow
    />
  );
};

const RodPair = ({
  from,
  to,
  material,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  material: THREE.Material;
}) => (
  <>
    <Rod from={from.clone().add(ROD_GAP)} to={to.clone().add(ROD_GAP)} material={material} />
    <Rod from={from.clone().sub(ROD_GAP)} to={to.clone().sub(ROD_GAP)} material={material} />
  </>
);

export interface LampRig {
  opening: THREE.Vector3;
  target: THREE.Vector3;
}

const lampRig = (lamp: LampLook): LampRig => {
  const base = new THREE.Vector3(lamp.x, 0, lamp.z);
  const head = HEAD_JOINT.clone().add(HEAD_DROP).multiplyScalar(lamp.scale).add(base);
  const target = new THREE.Vector3(lamp.targetX, 0, lamp.targetZ);
  const axis = target.clone().sub(head).normalize();
  return { opening: head.clone().addScaledVector(axis, SHADE_DEPTH * lamp.scale), target };
};

export const DeskLamp = ({
  lamp,
  palette,
  level,
  question,
  eye,
}: {
  lamp: LampLook;
  palette: Palette;
  level: number;
  question: number;
  eye: THREE.Vector3;
}) => {
  const geometries = lampGeometries();
  const body = useMemo(
    () => new THREE.MeshStandardMaterial({ color: palette.lamp, roughness: 0.42, metalness: 0.05 }),
    [palette.lamp],
  );
  const shade = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: palette.lamp,
        roughness: 0.38,
        metalness: 0.05,
        side: THREE.DoubleSide,
      }),
    [palette.lamp],
  );
  const glow = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  glow.color.set(palette.lamp).lerp(new THREE.Color(palette.bulb), 0.15 + 0.85 * level);
  const beam = useMemo(() => createBeamMaterial(), []);
  const lightTarget = useMemo(() => new THREE.Object3D(), []);
  const base = new THREE.Vector3(lamp.x, 0, lamp.z);
  const local = (point: THREE.Vector3) => point.clone().multiplyScalar(lamp.scale).add(base);
  const pivot = local(new THREE.Vector3(0.04, 0.09, 0));
  const elbow = local(ELBOW);
  const joint = local(HEAD_JOINT);
  const head = joint.clone().add(HEAD_DROP.clone().multiplyScalar(lamp.scale));
  const { opening, target } = lampRig(lamp);
  const aim = aimQuaternion(head, target);
  const beamLength = opening.distanceTo(target) * 1.2;
  const spread = Math.tan(lamp.coneAngle) * beamLength;
  const beamGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(
      SHADE_OPENING * 0.92,
      SHADE_OPENING + spread,
      beamLength,
      64,
      24,
      true,
    );
    geometry.translate(0, -beamLength / 2, 0);
    return geometry;
  }, [beamLength, spread]);
  updateBeamMaterial(beam, palette.beam, lamp.beamOpacity * level, lamp.beamSoftness);
  lightTarget.position.copy(target);
  const axis = target.clone().sub(opening).normalize();
  const questionAt = opening
    .clone()
    .addScaledVector(axis, opening.distanceTo(target) * lamp.questionAt);
  return (
    <group>
      <mesh
        geometry={geometries.base}
        material={body}
        position={base}
        scale={lamp.scale}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={geometries.joint}
        material={body}
        position={pivot}
        scale={lamp.scale}
        castShadow
      />
      <RodPair from={pivot} to={elbow} material={body} />
      <mesh
        geometry={geometries.joint}
        material={body}
        position={elbow}
        scale={lamp.scale}
        castShadow
      />
      <RodPair from={elbow} to={joint} material={body} />
      <mesh
        geometry={geometries.joint}
        material={body}
        position={joint}
        scale={lamp.scale}
        castShadow
      />
      <Rod from={joint} to={head} material={body} />
      <group position={head} quaternion={aim} scale={lamp.scale}>
        <mesh geometry={geometries.shade} material={shade} castShadow />
        <mesh geometry={geometries.bulb} material={glow} position={[0, -0.03, 0]} />
        <mesh
          geometry={geometries.opening}
          material={glow}
          position={[0, -SHADE_DEPTH + 0.02, 0]}
        />
      </group>
      <group position={opening} quaternion={aim}>
        <mesh geometry={beamGeometry} material={beam} renderOrder={2} />
      </group>
      <primitive object={lightTarget} />
      <spotLight
        position={opening.clone().addScaledVector(axis, 0.04)}
        target={lightTarget}
        color={palette.beam}
        intensity={lamp.intensity * level}
        angle={Math.min(1.4, lamp.coneAngle * 2.3)}
        penumbra={lamp.penumbra}
        decay={1.1}
        distance={0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-radius={6}
        shadow-camera-near={0.2}
        shadow-camera-far={12}
      />
      {lamp.showQuestion ? (
        <QuestionMark
          position={questionAt}
          eye={eye}
          size={lamp.questionSize * lamp.scale * (0.15 + 0.85 * question)}
          opacity={level * 0.45}
          color={palette.question}
        />
      ) : null}
    </group>
  );
};
