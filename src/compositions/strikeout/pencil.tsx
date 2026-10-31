import * as THREE from 'three';
import type { ProblemStrikeoutProps } from '@/schemas';

const LEAD_LENGTH = 0.022;
const CONE_LENGTH = 0.13;
const BODY_LENGTH = 1.55;
const BODY_RADIUS = 0.036;
const LEAD_RADIUS = 0.0075;

const UP = new THREE.Vector3(0, 1, 0);

export const pencilAxis = (
  pencil: ProblemStrikeoutProps['pencil'],
  sweep: number,
): THREE.Vector3 => {
  const heading = pencil.heading + sweep * 0.12;
  const lean = pencil.lean + sweep * 0.05;
  return new THREE.Vector3(
    Math.sin(lean) * Math.cos(heading),
    Math.cos(lean),
    Math.sin(lean) * Math.sin(heading),
  ).normalize();
};

export const Pencil = ({
  pencil,
  tip,
  axis,
}: {
  pencil: ProblemStrikeoutProps['pencil'];
  tip: THREE.Vector3;
  axis: THREE.Vector3;
}) => {
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, axis);
  const twist = new THREE.Quaternion().setFromAxisAngle(UP, 0.3);
  quaternion.multiply(twist);
  return (
    <group position={tip} quaternion={quaternion}>
      <mesh position={[0, LEAD_LENGTH / 2, 0]} castShadow>
        <cylinderGeometry args={[LEAD_RADIUS, 0.0012, LEAD_LENGTH, 18]} />
        <meshPhysicalMaterial color={pencil.lead} metalness={0.55} roughness={0.38} />
      </mesh>
      <mesh position={[0, LEAD_LENGTH + CONE_LENGTH / 2, 0]} castShadow>
        <cylinderGeometry args={[BODY_RADIUS * 0.97, LEAD_RADIUS, CONE_LENGTH, 6, 6]} />
        <meshPhysicalMaterial color={pencil.wood} roughness={0.78} flatShading />
      </mesh>
      <mesh position={[0, LEAD_LENGTH + CONE_LENGTH + BODY_LENGTH / 2, 0]} castShadow>
        <cylinderGeometry args={[BODY_RADIUS, BODY_RADIUS, BODY_LENGTH, 6, 1]} />
        <meshPhysicalMaterial
          color={pencil.body}
          roughness={0.32}
          clearcoat={0.8}
          clearcoatRoughness={0.18}
          flatShading
        />
      </mesh>
    </group>
  );
};
