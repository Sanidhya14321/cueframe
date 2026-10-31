import { useMemo } from 'react';
import * as THREE from 'three';
import { seeded } from '../unveil/random';
import { shoreHeading, shoreX } from './layout';

const PAINT = [
  '#f2f2f0',
  '#c9ccd0',
  '#8d9298',
  '#2a2c30',
  '#a8352c',
  '#f2f2f0',
  '#3b4f6b',
  '#d8d2c4',
];
const NEAR = 70;
const FAR = -1100;
const SPAN = NEAR - FAR;

interface Car {
  d: number;
  z: number;
  speed: number;
  paint: string;
}

const buildCars = (): Car[] => {
  const random = seeded(77);
  const cars: Car[] = [];
  for (const d of [31.2, 44.8]) {
    for (let z = FAR; z < NEAR; z += 5.6) {
      if (random() < 0.72) {
        cars.push({
          d,
          z,
          speed: 0,
          paint: PAINT[Math.floor(random() * PAINT.length)] ?? '#ffffff',
        });
      }
    }
  }
  const lanes: readonly [number, number][] = [
    [33.5, -0.55],
    [36.2, -0.42],
    [40, 0.45],
    [42.6, 0.58],
  ];
  for (const [d, speed] of lanes) {
    for (let z = FAR; z < NEAR; z += 26 + random() * 40) {
      cars.push({ d, z, speed, paint: PAINT[Math.floor(random() * PAINT.length)] ?? '#ffffff' });
    }
  }
  return cars;
};

const matrix = new THREE.Matrix4();
const rotation = new THREE.Quaternion();
const position = new THREE.Vector3();
const size = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);

const wrap = (z: number): number => FAR + ((((z - FAR) % SPAN) + SPAN) % SPAN);

export const Traffic = ({ frame, moving }: { frame: number; moving: boolean }) => {
  const cars = useMemo(buildCars, []);
  const { body, cabin } = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.3 });
    const glass = new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.4 });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const bodies = new THREE.InstancedMesh(geometry, material, cars.length);
    const cabins = new THREE.InstancedMesh(geometry, glass, cars.length);
    cars.forEach((car, index) => {
      bodies.setColorAt(index, new THREE.Color(car.paint));
      cabins.setColorAt(index, new THREE.Color(car.paint).multiplyScalar(0.55));
    });
    bodies.frustumCulled = false;
    cabins.frustumCulled = false;
    return { body: bodies, cabin: cabins };
  }, [cars]);
  cars.forEach((car, index) => {
    const z = car.speed === 0 || !moving ? car.z : wrap(car.z + car.speed * frame);
    const x = shoreX(z) + car.d;
    rotation.setFromAxisAngle(up, shoreHeading(z));
    matrix.compose(position.set(x, 0.62, z), rotation, size.set(1.9, 1.1, 4.4));
    body.setMatrixAt(index, matrix);
    matrix.compose(
      position.set(x, 1.45, z + 0.2 * Math.sign(car.speed || 1)),
      rotation,
      size.set(1.62, 0.62, 2.3),
    );
    cabin.setMatrixAt(index, matrix);
  });
  body.instanceMatrix.needsUpdate = true;
  cabin.instanceMatrix.needsUpdate = true;
  return (
    <group>
      <primitive object={body} />
      <primitive object={cabin} />
    </group>
  );
};
