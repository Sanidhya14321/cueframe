import { useMemo } from 'react';
import * as THREE from 'three';
import { CAR_MODELS, type CarModel, contactShadowTexture, WHEEL } from './car-geometry';
import { ROAD_X } from './ground';
import { seeded } from './random';

const NEAR = 75;
const FAR = -720;
const SPAN = NEAR - FAR;
const PER_LANE = 9;
const LANES = [
  { x: ROAD_X + 2.4, direction: -1 },
  { x: ROAD_X + 6, direction: -1 },
  { x: ROAD_X + 9.6, direction: -1 },
  { x: ROAD_X - 2.4, direction: 1 },
  { x: ROAD_X - 6, direction: 1 },
  { x: ROAD_X - 9.6, direction: 1 },
] as const;
const PAINTS = [
  '#e9e9e6',
  '#c9ccd0',
  '#8c9096',
  '#2a2c30',
  '#1d2c4a',
  '#7d1a1c',
  '#f1f0ea',
  '#5a5f66',
];

interface Car {
  model: number;
  lane: number;
  offset: number;
  speed: number;
  paint: THREE.Color;
}

const buildCars = (): Car[] => {
  const random = seeded(23);
  return LANES.flatMap((lane, laneIndex) => {
    const speed = 19 + laneIndex * 1.7 + random() * 3;
    return Array.from({ length: PER_LANE }, (_, slot) => ({
      model: random() < 0.55 ? 0 : random() < 0.7 ? 1 : 2,
      lane: laneIndex,
      offset: ((slot + random() * 0.55) / PER_LANE) * SPAN,
      speed: lane.direction * speed,
      paint: new THREE.Color(PAINTS[Math.floor(random() * PAINTS.length)] ?? '#cccccc'),
    }));
  });
};

const carZ = (car: Car, seconds: number): number => {
  const travelled = (((car.offset + car.speed * seconds) % SPAN) + SPAN) % SPAN;
  return NEAR - travelled;
};

const placement = (car: Car, seconds: number): THREE.Matrix4 => {
  const lane = LANES[car.lane] ?? LANES[0];
  const turn = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    lane.direction > 0 ? -Math.PI / 2 : Math.PI / 2,
  );
  return new THREE.Matrix4().compose(
    new THREE.Vector3(lane.x, 0, carZ(car, seconds)),
    turn,
    new THREE.Vector3(1, 1, 1),
  );
};

const wheelOffsets = (model: CarModel): THREE.Vector3[] =>
  [-1, 1].flatMap((end) =>
    [-1, 1].map(
      (side) => new THREE.Vector3(end * model.axle, 0.34, side * (model.width / 2 - 0.08)),
    ),
  );

export const Traffic = ({ frame }: { frame: number }) => {
  const cars = useMemo(buildCars, []);
  const materials = useMemo(
    () => ({
      paint: new THREE.MeshPhysicalMaterial({
        roughness: 0.32,
        metalness: 0.55,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      }),
      glass: new THREE.MeshPhysicalMaterial({ color: '#0c1118', roughness: 0.08, metalness: 0.2 }),
      tyre: new THREE.MeshStandardMaterial({ color: '#151515', roughness: 0.85 }),
      shadow: new THREE.MeshBasicMaterial({
        map: contactShadowTexture(),
        transparent: true,
        depthWrite: false,
      }),
    }),
    [],
  );
  const seconds = frame / 30;
  const fill = (mesh: THREE.InstancedMesh | null, model: number, part: 'body' | 'glass') => {
    if (mesh === null) {
      return;
    }
    cars
      .filter((car) => car.model === model)
      .forEach((car, slot) => {
        mesh.setMatrixAt(slot, placement(car, seconds));
        if (part === 'body') {
          mesh.setColorAt(slot, car.paint);
        }
      });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor !== null) {
      mesh.instanceColor.needsUpdate = true;
    }
  };
  const fillWheels = (mesh: THREE.InstancedMesh | null) => {
    if (mesh === null) {
      return;
    }
    let slot = 0;
    for (const car of cars) {
      const base = placement(car, seconds);
      for (const offset of wheelOffsets(CAR_MODELS[car.model] ?? (CAR_MODELS[0] as CarModel))) {
        mesh.setMatrixAt(slot, base.clone().multiply(new THREE.Matrix4().makeTranslation(offset)));
        slot += 1;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  };
  const fillShadows = (mesh: THREE.InstancedMesh | null) => {
    if (mesh === null) {
      return;
    }
    cars.forEach((car, slot) => {
      const lift = new THREE.Matrix4()
        .makeTranslation(0, 0.03, 0)
        .multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
        .multiply(new THREE.Matrix4().makeScale(6.2, 2.8, 1));
      mesh.setMatrixAt(slot, placement(car, seconds).multiply(lift));
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  return (
    <group>
      {CAR_MODELS.map((model, slot) => {
        const count = cars.filter((car) => car.model === slot).length;
        return (
          <group key={slot}>
            <instancedMesh
              args={[model.body, materials.paint, count]}
              ref={(mesh) => fill(mesh, slot, 'body')}
              frustumCulled={false}
            />
            <instancedMesh
              args={[model.glass, materials.glass, count]}
              ref={(mesh) => fill(mesh, slot, 'glass')}
              frustumCulled={false}
            />
          </group>
        );
      })}
      <instancedMesh
        args={[WHEEL, materials.tyre, cars.length * 4]}
        ref={fillWheels}
        frustumCulled={false}
      />
      <instancedMesh
        args={[undefined, materials.shadow, cars.length]}
        ref={fillShadows}
        frustumCulled={false}
      >
        <planeGeometry args={[1, 1]} />
      </instancedMesh>
    </group>
  );
};
