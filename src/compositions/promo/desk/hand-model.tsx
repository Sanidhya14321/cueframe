import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Arm, type ArmLook, forearmAim } from './arm';
import { buildHandRig, FINGERS } from './hand-rig';
import {
  applySkinDetail,
  FINGER_NAILS,
  nailGeometry,
  nailMaterial,
  paintSkin,
  THUMB_NAIL,
} from './hand-skin';
import { subdivideSkinned } from './subdivide';
import type { PalmFrame } from './wipe-choreography';

const HAND_URL = new URL('./assets/hand-right.glb', import.meta.url).href;

export const HAND_UNITS = 10;

const SUBDIVISIONS = 2;

const smoothed = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();

const smoothGeometry = (mesh: THREE.SkinnedMesh): THREE.BufferGeometry => {
  const hit = smoothed.get(mesh.geometry);
  if (hit !== undefined) {
    return hit;
  }
  const geometry = subdivideSkinned(mesh.geometry, mesh.skeleton.bones.length, SUBDIVISIONS);
  smoothed.set(mesh.geometry, geometry);
  return geometry;
};

const PALM_CENTER = new THREE.Vector3(0.0058, -0.004, 0.016);

const MODEL_TO_PALM = new THREE.Matrix4().makeBasis(
  new THREE.Vector3(0, 0, -1),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(-1, 0, 0),
);

const skinMaterials = new Map<string, THREE.MeshPhysicalMaterial>();

const skinMaterial = (
  color: string,
  roughness: number,
  painted: boolean,
  detail: number,
): THREE.MeshPhysicalMaterial => {
  const key = `${color}:${roughness}:${painted}:${detail}`;
  const cached = skinMaterials.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    vertexColors: painted,
    metalness: 0,
    sheen: 0.6,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color('#ff9f84'),
    clearcoat: 0.08,
    clearcoatRoughness: 0.6,
    specularIntensity: 0.45,
  });
  applySkinDetail(material, detail, painted);
  skinMaterials.set(key, material);
  return material;
};

type HandScene = ReturnType<typeof useHandScene>;

export const useHandScene = () => {
  const gltf = useLoader(GLTFLoader, HAND_URL);
  return useMemo(() => {
    const scene = clone(gltf.scene);
    let skinned: THREE.SkinnedMesh | undefined;
    scene.traverse((node) => {
      if (node instanceof THREE.SkinnedMesh) {
        skinned = node;
      }
    });
    if (skinned === undefined) {
      throw new Error('Hand model has no skinned mesh');
    }
    skinned.geometry = smoothGeometry(skinned);
    skinned.frustumCulled = false;
    skinned.castShadow = true;
    skinned.receiveShadow = true;
    paintSkin(skinned);
    return { scene, skinned, rig: buildHandRig(skinned.skeleton) };
  }, [gltf]);
};

export const palmToWorld = (palm: PalmFrame): THREE.Matrix4 =>
  new THREE.Matrix4()
    .compose(palm.position, palm.quaternion, new THREE.Vector3(1, 1, 1))
    .multiply(MODEL_TO_PALM)
    .multiply(new THREE.Matrix4().makeScale(HAND_UNITS, HAND_UNITS, HAND_UNITS))
    .multiply(new THREE.Matrix4().makeTranslation(-PALM_CENTER.x, -PALM_CENTER.y, -PALM_CENTER.z));

export const palmFromModel = (modelToWorld: THREE.Matrix4): PalmFrame => {
  const local = new THREE.Matrix4()
    .multiply(MODEL_TO_PALM)
    .multiply(new THREE.Matrix4().makeScale(HAND_UNITS, HAND_UNITS, HAND_UNITS))
    .multiply(new THREE.Matrix4().makeTranslation(-PALM_CENTER.x, -PALM_CENTER.y, -PALM_CENTER.z));
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  modelToWorld
    .clone()
    .multiply(local.invert())
    .decompose(position, quaternion, new THREE.Vector3());
  return { position, quaternion };
};

export interface HandModelProps {
  hand: HandScene;
  palm: PalmFrame;
  skin: string;
  roughness: number;
  detail: number;
  arm: ArmLook;
  elbow: THREE.Vector3;
}

export const HandModel = ({ hand, palm, skin, roughness, detail, arm, elbow }: HandModelProps) => {
  const { scene, skinned, rig } = hand;
  skinned.material = skinMaterial(skin, roughness, true, detail);
  const placement = palmToWorld(palm);
  const wrist = rig.wrist.bone.matrix.clone();
  return (
    <group matrixAutoUpdate={false} matrix={placement}>
      <primitive object={scene} />
      <group matrixAutoUpdate={false} matrix={wrist}>
        <Arm
          look={arm}
          skin={skinMaterial(skin, roughness, false, detail)}
          forearm={forearmAim(wrist, elbow.clone().applyMatrix4(placement.clone().invert()))}
        />
      </group>
      {FINGERS.map((finger) => {
        const spec = FINGER_NAILS[finger];
        const distal = rig.fingers[finger][3]?.bone.matrix.clone();
        return distal === undefined ? null : (
          <group key={finger} matrixAutoUpdate={false} matrix={distal}>
            <mesh
              position={[0, spec.lift, spec.center]}
              geometry={nailGeometry(spec)}
              material={nailMaterial}
              castShadow
            />
          </group>
        );
      })}
      {rig.thumb[2] === undefined ? null : (
        <group matrixAutoUpdate={false} matrix={rig.thumb[2].bone.matrix.clone()}>
          <mesh
            position={[0, THUMB_NAIL.lift, THUMB_NAIL.center]}
            geometry={nailGeometry(THUMB_NAIL)}
            material={nailMaterial}
            castShadow
          />
        </group>
      )}
    </group>
  );
};
