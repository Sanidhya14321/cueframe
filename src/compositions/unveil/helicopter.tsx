import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { UnveilHelicopter } from '@/schemas';
import { RotorDisc } from './rotor';

const SKID_SIDES = [-1, 1] as const;
const STRUT_X = [-0.9, 1.3] as const;

const PROFILE: [number, number][] = [
  [0.02, 3.25],
  [0.45, 3.1],
  [0.78, 2.75],
  [1.02, 2.2],
  [1.14, 1.4],
  [1.14, 0.2],
  [1.02, -0.9],
  [0.78, -1.8],
  [0.5, -2.6],
  [0.3, -3.1],
];

const fuselageGeometry = (body: string, trim: string, stripe: string): THREE.BufferGeometry => {
  const geometry = new THREE.LatheGeometry(
    PROFILE.map(([radius, along]) => new THREE.Vector2(radius, along)),
    48,
  );
  geometry.rotateZ(-Math.PI / 2);
  geometry.scale(1, 1.12, 0.88);
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
  const colors = new Float32Array(positions.count * 3);
  const paints = {
    body: new THREE.Color(body),
    trim: new THREE.Color(trim),
    stripe: new THREE.Color(stripe),
  };
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const y = positions.getY(vertex);
    const band = Math.abs(y + 0.12 - positions.getX(vertex) * 0.04) < 0.09;
    const color = y < -0.42 ? paints.trim : band ? paints.stripe : paints.body;
    color.toArray(colors, vertex * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
};

const canopyGeometry = (): THREE.BufferGeometry => {
  const geometry = new THREE.SphereGeometry(1, 40, 24, -Math.PI / 2, Math.PI, 0, Math.PI * 0.62);
  geometry.rotateZ(-Math.PI / 2);
  geometry.scale(1.55, 1.02, 0.92);
  geometry.translate(1.55, 0.12, 0);
  return geometry;
};

type Point = [number, number, number];

const Tube = ({
  from,
  to,
  radius,
  material,
}: {
  from: Point;
  to: Point;
  radius: number;
  material: THREE.Material;
}) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const direction = end.clone().sub(start);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );
  return (
    <mesh
      position={start.add(end).multiplyScalar(0.5)}
      quaternion={quaternion}
      material={material}
      castShadow
    >
      <cylinderGeometry args={[radius, radius, direction.length(), 10]} />
    </mesh>
  );
};

const useHelicopterParts = (helicopter: UnveilHelicopter) =>
  useMemo(
    () => ({
      fuselage: fuselageGeometry(helicopter.body, helicopter.trim, helicopter.stripe),
      canopy: canopyGeometry(),
      cowling: new RoundedBoxGeometry(2.3, 0.62, 1.05, 4, 0.22),
      paint: new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.28,
        metalness: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
      }),
      body: new THREE.MeshPhysicalMaterial({
        color: helicopter.body,
        roughness: 0.3,
        metalness: 0.25,
        clearcoat: 0.8,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: helicopter.glass,
        roughness: 0.05,
        metalness: 0.85,
        envMapIntensity: 1.4,
      }),
      metal: new THREE.MeshStandardMaterial({ color: '#2b2f35', roughness: 0.45, metalness: 0.7 }),
    }),
    [helicopter.body, helicopter.trim, helicopter.stripe, helicopter.glass],
  );

const Skids = ({ material }: { material: THREE.Material }) => (
  <group>
    {SKID_SIDES.map((side) => (
      <group key={side}>
        <Tube
          from={[-1.9, -1.72, side * 1.1]}
          to={[2.1, -1.72, side * 1.1]}
          radius={0.07}
          material={material}
        />
        <Tube
          from={[2.1, -1.72, side * 1.1]}
          to={[2.55, -1.42, side * 1.1]}
          radius={0.07}
          material={material}
        />
        {STRUT_X.map((x) => (
          <Tube
            key={x}
            from={[x, -1.72, side * 1.1]}
            to={[x + 0.1, -0.75, side * 0.72]}
            radius={0.06}
            material={material}
          />
        ))}
      </group>
    ))}
  </group>
);

export const Helicopter = ({
  frame,
  helicopter,
}: {
  frame: number;
  helicopter: UnveilHelicopter;
}) => {
  const parts = useHelicopterParts(helicopter);
  const spin = frame * 0.16 * helicopter.rotorSpeed;
  return (
    <group scale={helicopter.scale}>
      <mesh geometry={parts.fuselage} material={parts.paint} castShadow />
      <mesh geometry={parts.canopy} material={parts.glass} />
      <mesh geometry={parts.cowling} material={parts.body} position={[-0.45, 1.12, 0]} castShadow />
      <Tube from={[-1.6, 1.05, 0]} to={[-2.2, 1.0, 0]} radius={0.16} material={parts.metal} />
      <Tube from={[-2.7, 0.32, 0]} to={[-7.6, 0.85, 0]} radius={0.24} material={parts.body} />
      <mesh position={[-7.45, 1.45, 0]} rotation={[0, 0, -0.42]} material={parts.body} castShadow>
        <boxGeometry args={[0.95, 1.6, 0.1]} />
      </mesh>
      <mesh position={[-6.6, 0.78, 0]} material={parts.body}>
        <boxGeometry args={[0.55, 0.06, 2.1]} />
      </mesh>
      <Tube from={[0.15, 1.4, 0]} to={[0.15, 2.0, 0]} radius={0.1} material={parts.metal} />
      <group position={[0.15, 2.05, 0]}>
        <mesh material={parts.metal}>
          <cylinderGeometry args={[0.28, 0.32, 0.26, 18]} />
        </mesh>
        <RotorDisc spin={spin} radius={5.7} tint={helicopter.trim} blades={4} />
      </group>
      <group position={[-7.75, 1.55, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <RotorDisc spin={spin * 1.7} radius={0.95} tint={helicopter.trim} blades={2} />
      </group>
      <Skids material={parts.metal} />
    </group>
  );
};
