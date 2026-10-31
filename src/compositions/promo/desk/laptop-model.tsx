import type { ReactNode } from 'react';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { bodyFont, bodyFontReady } from '../fonts';
import { useCanvasFont, useCanvasTexture } from './canvas-texture';
import { drawKeyLegends, KEY_CANVAS } from './desk-textures';
import {
  flatRoundedSlab,
  KEYBOARD_WIDTH,
  keyboardDepth,
  keyboardLayout,
  LAPTOP,
  SCREEN_FACE,
} from './laptop-geometry';

interface LaptopLook {
  body: string;
  keys: string;
  bezel: string;
  backlight: string;
  backlightGlow: number;
  lidAngle: number;
  roughness: number;
}

const materials = new Map<string, THREE.Material>();

const physical = (key: string, build: () => THREE.Material): THREE.Material => {
  const hit = materials.get(key);
  if (hit !== undefined) {
    return hit;
  }
  const material = build();
  materials.set(key, material);
  return material;
};

const bodyMaterial = (color: string, roughness: number) =>
  physical(
    `body:${color}:${roughness}`,
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.35,
        roughness,
        clearcoat: 0.15,
        clearcoatRoughness: 0.6,
      }),
  );

const keyMaterial = (color: string) =>
  physical(
    `keys:${color}`,
    () => new THREE.MeshPhysicalMaterial({ color, metalness: 0, roughness: 0.62, sheen: 0.2 }),
  );

const bezelMaterial = (color: string) =>
  physical(
    `bezel:${color}`,
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0,
        roughness: 0.32,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
      }),
  );

const keyCap = new RoundedBoxGeometry(1, 1, 1, 3, 0.18);

const Keyboard = ({ look }: { look: LaptopLook }) => {
  useCanvasFont(`500 44px "${bodyFont}"`, bodyFontReady);
  const keys = useMemo(() => keyboardLayout(), []);
  const depth = keyboardDepth();
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const instance = mesh.current;
    if (instance === null) {
      return;
    }
    const matrix = new THREE.Matrix4();
    keys.forEach((key, index) => {
      matrix.compose(
        new THREE.Vector3(key.x, LAPTOP.keyHeight / 2, key.z),
        new THREE.Quaternion(),
        new THREE.Vector3(key.width, LAPTOP.keyHeight, key.depth),
      );
      instance.setMatrixAt(index, matrix);
    });
    instance.instanceMatrix.needsUpdate = true;
  }, [keys]);
  const legends = useCanvasTexture(
    KEY_CANVAS.width,
    KEY_CANVAS.height,
    (context) => drawKeyLegends(context, keys, depth, bodyFont),
    'legends',
  );
  const glow = useMemo(() => new THREE.Color(look.backlight), [look.backlight]);
  return (
    <group position={[0, LAPTOP.baseThickness, 0]}>
      <instancedMesh
        ref={mesh}
        args={[keyCap, keyMaterial(look.keys), keys.length]}
        castShadow
        receiveShadow
      />
      <mesh
        position={[0, LAPTOP.keyHeight + 0.0015, LAPTOP.keyboardBack + depth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={1}
      >
        <planeGeometry args={[KEYBOARD_WIDTH, depth]} />
        <meshBasicMaterial
          alphaMap={legends}
          color={glow.clone().multiplyScalar(0.35 + look.backlightGlow)}
          transparent
          depthWrite={false}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
          polygonOffsetUnits={-4}
        />
      </mesh>
      <mesh position={[0, 0.0012, LAPTOP.keyboardBack + depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[KEYBOARD_WIDTH + 0.06, depth + 0.06]} />
        <meshBasicMaterial
          color={glow.clone().multiplyScalar(look.backlightGlow * 0.25)}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

export interface LaptopModelProps {
  look: LaptopLook;
  screen: ReactNode;
  glow: number;
  glowColor: string;
}

RectAreaLightUniformsLib.init();

export const LaptopModel = ({ look, screen, glow, glowColor }: LaptopModelProps) => {
  const body = bodyMaterial(look.body, look.roughness);
  const hingeZ = -LAPTOP.depth / 2 + 0.04;
  return (
    <group>
      <mesh
        geometry={flatRoundedSlab(LAPTOP.width, LAPTOP.depth, LAPTOP.radius, LAPTOP.baseThickness)}
        material={body}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, LAPTOP.baseThickness / 2, 0]}
        castShadow
        receiveShadow
      />
      <Keyboard look={look} />
      <mesh
        geometry={flatRoundedSlab(LAPTOP.trackpadWidth, LAPTOP.trackpadDepth, 0.06, 0.01)}
        material={bezelMaterial(look.body)}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, LAPTOP.baseThickness + 0.0005, LAPTOP.trackpadCenter]}
        receiveShadow
      />
      <mesh
        position={[0, LAPTOP.baseThickness + 0.015, hingeZ]}
        rotation={[0, 0, Math.PI / 2]}
        material={bezelMaterial(look.keys)}
        castShadow
      >
        <cylinderGeometry args={[0.045, 0.045, LAPTOP.width * 0.72, 24]} />
      </mesh>
      <group position={[0, LAPTOP.baseThickness + 0.01, hingeZ]} rotation={[-look.lidAngle, 0, 0]}>
        <group position={[0, LAPTOP.lidHeight / 2, 0]}>
          <mesh
            geometry={flatRoundedSlab(
              LAPTOP.width,
              LAPTOP.lidHeight,
              LAPTOP.radius,
              LAPTOP.lidThickness,
            )}
            material={body}
            castShadow
            receiveShadow
          />
          <mesh
            position={[0, 0, LAPTOP.lidThickness / 2 + 0.0008]}
            geometry={flatRoundedSlab(
              LAPTOP.width - 0.03,
              LAPTOP.lidHeight - 0.03,
              LAPTOP.radius - 0.015,
              0.0016,
            )}
            material={bezelMaterial(look.bezel)}
            receiveShadow
          />
          <mesh position={[0, LAPTOP.lidHeight / 2 - 0.055, SCREEN_FACE]}>
            <circleGeometry args={[0.012, 24]} />
            <meshPhysicalMaterial color="#0d0f14" roughness={0.1} clearcoat={1} />
          </mesh>
          <group
            position={[
              0,
              -LAPTOP.lidHeight / 2 + LAPTOP.screenBottom + LAPTOP.screenHeight / 2,
              SCREEN_FACE,
            ]}
          >
            {screen}
            {glow > 0 ? (
              <rectAreaLight
                width={LAPTOP.screenWidth}
                height={LAPTOP.screenHeight}
                intensity={glow}
                color={glowColor}
                position={[0, 0, 0.02]}
                rotation={[0, Math.PI, 0]}
              />
            ) : null}
          </group>
        </group>
      </group>
    </group>
  );
};
