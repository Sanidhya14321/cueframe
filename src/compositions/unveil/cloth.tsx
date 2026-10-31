import { useMemo } from 'react';
import * as THREE from 'three';
import type { UnveilCloth } from '@/schemas';
import { ATTACH_COLUMNS, attachPoint, barPoint, type ClothRun, clothFrame } from './cloth-sim';
import { CLOTH, type Vec3 } from './flight';

const UP = new THREE.Vector3(0, 1, 0);

export const Rod = ({
  from,
  to,
  radius,
  color,
}: {
  from: Vec3;
  to: Vec3;
  radius: number;
  color: string;
}) => {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const direction = end.clone().sub(start);
  const span = direction.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, direction.normalize());
  const middle = start.add(end).multiplyScalar(0.5);
  return (
    <mesh position={middle} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, span, 6, 1]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
    </mesh>
  );
};

const useClothGeometry = (): THREE.PlaneGeometry =>
  useMemo(() => new THREE.PlaneGeometry(1, 1, CLOTH.columns, CLOTH.rows), []);

export const Cloth = ({
  frame,
  run,
  cloth,
  cableColor,
}: {
  frame: number;
  run: ClothRun;
  cloth: UnveilCloth;
  cableColor: string;
}) => {
  const geometry = useClothGeometry();
  const sheenColor = useMemo(
    () => new THREE.Color(cloth.color).lerp(new THREE.Color('#ffd9d0'), 0.18),
    [cloth.color],
  );
  const attribute = geometry.getAttribute('position') as THREE.BufferAttribute;
  const positions = attribute.array as Float32Array;
  clothFrame(run, frame, positions);
  attribute.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  const hook = run.hooks[Math.max(0, Math.min(run.hooks.length - 1, Math.round(frame)))] ?? [
    0, 0, 0,
  ];
  return (
    <group>
      <mesh geometry={geometry} castShadow frustumCulled={false}>
        <meshPhysicalMaterial
          color={cloth.color}
          roughness={0.82}
          sheen={cloth.sheen}
          sheenRoughness={0.35}
          sheenColor={sheenColor}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Rod
        from={barPoint(hook, ATTACH_COLUMNS[0])}
        to={barPoint(hook, ATTACH_COLUMNS[3])}
        radius={0.09}
        color={cableColor}
      />
      <Rod from={hook} to={barPoint(hook, ATTACH_COLUMNS[0])} radius={0.04} color={cableColor} />
      <Rod from={hook} to={barPoint(hook, ATTACH_COLUMNS[3])} radius={0.04} color={cableColor} />
      {ATTACH_COLUMNS.map((column) => (
        <Rod
          key={column}
          from={barPoint(hook, column)}
          to={attachPoint(positions, column)}
          radius={0.035}
          color={cableColor}
        />
      ))}
    </group>
  );
};
