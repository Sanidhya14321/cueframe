import { useMemo } from 'react';
import * as THREE from 'three';
import type { ReaderHero } from '@/schemas';
import { Cape } from './cape';
import type { HeroPose } from './hero-pose';
import { Newspaper } from './newspaper';

const Y_AXIS = new THREE.Vector3(0, 1, 0);

const useSuit = (color: string, roughness: number) =>
  useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.05 }),
    [color, roughness],
  );

const Limb = ({
  from,
  to,
  radius,
  material,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  radius: number;
  material: THREE.Material;
}) => {
  const offset = to.clone().sub(from);
  const length = offset.length();
  const middle = from.clone().add(to).multiplyScalar(0.5);
  const turn = new THREE.Quaternion().setFromUnitVectors(Y_AXIS, offset.normalize());
  return (
    <mesh position={middle} quaternion={turn} material={material} castShadow receiveShadow>
      <capsuleGeometry args={[radius, Math.max(0.001, length), 6, 14]} />
    </mesh>
  );
};

const Ball = ({
  at,
  radius,
  material,
  scale = [1, 1, 1],
}: {
  at: THREE.Vector3;
  radius: number;
  material: THREE.Material;
  scale?: [number, number, number];
}) => (
  <mesh position={at} scale={scale} material={material} castShadow receiveShadow>
    <sphereGeometry args={[radius, 24, 16]} />
  </mesh>
);

const lerp = (from: THREE.Vector3, to: THREE.Vector3, amount: number) =>
  from.clone().lerp(to, amount);

const Leg = ({
  hip,
  knee,
  ankle,
  suit,
  trim,
}: {
  hip: THREE.Vector3;
  knee: THREE.Vector3;
  ankle: THREE.Vector3;
  suit: THREE.Material;
  trim: THREE.Material;
}) => {
  const bootTop = lerp(ankle, knee, 0.45);
  const toe = ankle.clone().add(new THREE.Vector3(0, -0.035, 0.15));
  return (
    <group>
      <Limb from={hip} to={knee} radius={0.075} material={suit} />
      <Limb from={knee} to={bootTop} radius={0.06} material={suit} />
      <Limb from={bootTop} to={ankle} radius={0.058} material={trim} />
      <Limb from={ankle} to={toe} radius={0.045} material={trim} />
    </group>
  );
};

const Arm = ({
  shoulder,
  elbow,
  hand,
  suit,
  trim,
}: {
  shoulder: THREE.Vector3;
  elbow: THREE.Vector3;
  hand: THREE.Vector3;
  suit: THREE.Material;
  trim: THREE.Material;
}) => {
  const cuff = lerp(hand, elbow, 0.45);
  return (
    <group>
      <Limb from={shoulder} to={elbow} radius={0.052} material={suit} />
      <Limb from={elbow} to={cuff} radius={0.044} material={suit} />
      <Limb from={cuff} to={hand} radius={0.047} material={trim} />
      <Ball at={hand} radius={0.042} material={trim} scale={[0.9, 1.2, 0.75]} />
    </group>
  );
};

const TORSO_PROFILE: readonly [number, number][] = [
  [0.001, -0.06],
  [0.1, -0.04],
  [0.145, 0.04],
  [0.13, 0.16],
  [0.15, 0.27],
  [0.175, 0.36],
  [0.17, 0.43],
  [0.12, 0.48],
  [0.055, 0.5],
  [0.001, 0.51],
];

const Torso = ({
  pelvis,
  neck,
  material,
}: {
  pelvis: THREE.Vector3;
  neck: THREE.Vector3;
  material: THREE.Material;
}) => {
  const geometry = useMemo(
    () =>
      new THREE.LatheGeometry(
        TORSO_PROFILE.map(([radius, height]) => new THREE.Vector2(radius, height)),
        32,
      ),
    [],
  );
  const offset = neck.clone().sub(pelvis);
  const turn = new THREE.Quaternion().setFromUnitVectors(Y_AXIS, offset.clone().normalize());
  const stretch = offset.length() / 0.5;
  return (
    <mesh
      geometry={geometry}
      position={pelvis}
      quaternion={turn}
      scale={[1, stretch, 0.72]}
      material={material}
      castShadow
      receiveShadow
    />
  );
};

const Head = ({
  neck,
  pitch,
  yaw,
  suit,
  visor,
}: {
  neck: THREE.Vector3;
  pitch: number;
  yaw: number;
  suit: THREE.Material;
  visor: THREE.Material;
}) => (
  <group position={neck} rotation={[pitch, yaw, 0, 'YXZ']}>
    <mesh position={[0, 0.02, 0]} material={suit} castShadow>
      <cylinderGeometry args={[0.05, 0.058, 0.08, 16]} />
    </mesh>
    <mesh position={[0, 0.13, 0.015]} scale={[0.92, 1.1, 1]} material={suit} castShadow>
      <sphereGeometry args={[0.1, 32, 24]} />
    </mesh>
    <mesh position={[0, 0.145, 0.06]} scale={[0.86, 0.36, 0.72]} material={visor}>
      <sphereGeometry args={[0.1, 32, 16]} />
    </mesh>
  </group>
);

export const Hero = ({
  hero,
  pose,
  frame,
}: {
  hero: ReaderHero;
  pose: HeroPose;
  frame: number;
}) => {
  const suit = useSuit(hero.suit, 0.55);
  const trim = useSuit(hero.trim, 0.45);
  const visor = useSuit(hero.visor, 0.25);
  const emblem = useSuit(hero.emblem, 0.4);
  const waist = lerp(pose.pelvis, pose.chest, 0.35);
  return (
    <group>
      <Torso pelvis={pose.pelvis} neck={pose.neck} material={suit} />
      <Limb from={pose.shoulders[0]} to={pose.shoulders[1]} radius={0.068} material={suit} />
      <mesh position={waist} rotation={[Math.PI / 2, 0, 0]} material={trim} castShadow>
        <torusGeometry args={[0.13, 0.022, 10, 32]} />
      </mesh>
      <mesh
        position={[pose.chest.x, pose.chest.y + 0.04, pose.chest.z + 0.13]}
        rotation={[0, 0, Math.PI / 4]}
        scale={[1, 1, 0.25]}
        material={emblem}
      >
        <boxGeometry args={[0.07, 0.07, 0.07]} />
      </mesh>
      <Head neck={pose.neck} pitch={pose.headPitch} yaw={pose.headYaw} suit={suit} visor={visor} />
      <Leg hip={pose.hips[0]} knee={pose.knees[0]} ankle={pose.ankles[0]} suit={suit} trim={trim} />
      <Leg hip={pose.hips[1]} knee={pose.knees[1]} ankle={pose.ankles[1]} suit={suit} trim={trim} />
      <Arm
        shoulder={pose.shoulders[0]}
        elbow={pose.elbows[0]}
        hand={pose.hands[0]}
        suit={suit}
        trim={trim}
      />
      <Arm
        shoulder={pose.shoulders[1]}
        elbow={pose.elbows[1]}
        hand={pose.hands[1]}
        suit={suit}
        trim={trim}
      />
      <Cape color={hero.cape} sway={hero.capeSway} frame={frame} />
      <Newspaper hero={hero} pose={pose} />
    </group>
  );
};
