import { useMemo } from 'react';
import * as THREE from 'three';
import type { SpillRevealProps } from '@/schemas';
import { useCanvasFont, useCanvasTexture } from '../promo/desk/canvas-texture';
import { CLOTH_CANVAS, drawClothWeave } from '../promo/desk/desk-textures';
import { roundedFont, roundedFontReady } from '../promo/fonts';
import { fbm, halfFloatField, type PuddleShape, puddleDistance } from './field';
import { drawMessage, MESSAGE_CANVAS } from './message';

const GRID = 72;
const FIELD_SIZE = 256;
const WET_EDGE = 0.09;
const FRONT_WIDTH = 0.18;

type NapkinLook = SpillRevealProps['napkin'];
type MessageLook = SpillRevealProps['message'];

interface NapkinPose {
  drop: number;
  soak: number;
  frame: number;
}

const wickArrival = (distance: number, x: number, z: number, coverage: number): number => {
  const ragged = (fbm(x * 2.2, z * 2.2, 31) - 0.5) * 0.5 + (fbm(x * 7, z * 7, 37) - 0.5) * 0.12;
  const arrival = distance < 1 ? distance * 0.22 : 0.22 + (distance - 1) * 0.95;
  return Math.max(0, arrival + ragged * Math.min(1, distance)) / coverage;
};

const localToWorld = (look: NapkinLook, lx: number, lz: number): [number, number] => {
  const cos = Math.cos(look.turn);
  const sin = Math.sin(look.turn);
  return [look.x + lx * cos + lz * sin, look.z - lx * sin + lz * cos];
};

const restShape = (look: NapkinLook, lx: number, lz: number): number => {
  const half = look.size / 2;
  const edge = Math.max(Math.abs(lx), Math.abs(lz)) / half;
  const curl = THREE.MathUtils.smoothstep(edge, 0.72, 1) ** 2 * 0.07 * look.curl;
  const corner =
    THREE.MathUtils.smoothstep((lx - lz) / look.size, 0.42, 1) ** 2 * 0.42 * look.cornerLift;
  const wrinkle = (fbm(lx * 1.8 + 3, lz * 1.8 + 7, 41) - 0.5) * 0.05 * look.wrinkles;
  const fold = Math.exp(-((lx / 0.05) ** 2)) * 0.008 - Math.exp(-((lz / 0.05) ** 2)) * 0.006;
  return 0.012 + curl + corner + Math.max(-0.004, wrinkle) * (0.4 + edge) + fold;
};

const drape = (z: number, edgeZ: number): number => {
  const over = z - edgeZ;
  return over > 0 ? (-(over * over) / (over + 0.05)) * 1.6 : 0;
};

const buildGrid = (look: NapkinLook) => {
  const count = (GRID + 1) * (GRID + 1);
  const uvs = new Float32Array(count * 2);
  const local = new Float32Array(count * 2);
  const indices: number[] = [];
  for (let row = 0; row <= GRID; row++) {
    for (let column = 0; column <= GRID; column++) {
      const index = row * (GRID + 1) + column;
      const u = column / GRID;
      const v = row / GRID;
      uvs[index * 2] = u;
      uvs[index * 2 + 1] = 1 - v;
      local[index * 2] = (u - 0.5) * look.size;
      local[index * 2 + 1] = (v - 0.5) * look.size;
    }
  }
  for (let row = 0; row < GRID; row++) {
    for (let column = 0; column < GRID; column++) {
      const a = row * (GRID + 1) + column;
      const b = a + GRID + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return { geometry, local, count };
};

interface NapkinUniforms {
  uField: { value: THREE.DataTexture };
  uText: { value: THREE.Texture };
  uSoak: { value: number };
  uWet: { value: THREE.Color };
  uPaper: { value: THREE.Color };
  uInk: { value: THREE.Color };
  uStrength: { value: number };
}

const createNapkinMaterial = (weave: THREE.Texture, uniforms: NapkinUniforms) => {
  const material = new THREE.MeshPhysicalMaterial({
    map: weave,
    bumpMap: weave,
    roughness: 0.92,
    sheen: 0.35,
    sheenRoughness: 0.8,
    side: THREE.DoubleSide,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vSpillUv;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvSpillUv = uv;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec2 vSpillUv;
uniform sampler2D uField;
uniform sampler2D uText;
uniform float uSoak;
uniform vec3 uWet;
uniform vec3 uPaper;
uniform vec3 uInk;
uniform float uStrength;`,
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
float arrival = texture2D(uField, vSpillUv).r;
float wet = smoothstep(arrival, arrival + ${WET_EDGE.toFixed(3)}, uSoak) * (gl_FrontFacing ? 1.0 : 0.6);
float front = wet * (1.0 - smoothstep(arrival + ${WET_EDGE.toFixed(3)}, arrival + ${FRONT_WIDTH.toFixed(3)}, uSoak));
vec3 weaveShade = diffuseColor.rgb / max(uPaper, vec3(0.02));
vec3 soaked = uWet * mix(vec3(1.0), weaveShade, 0.7) * (1.0 - front * 0.1);
diffuseColor.rgb = mix(diffuseColor.rgb, soaked, wet);
float ink = texture2D(uText, vSpillUv).a * uStrength * (gl_FrontFacing ? 1.0 : 0.0);
diffuseColor.rgb = mix(diffuseColor.rgb, uInk * mix(vec3(1.0), weaveShade, 0.5), ink * wet);`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.42, wet);`,
      );
  };
  return material;
};

export interface NapkinProps {
  look: NapkinLook;
  message: MessageLook;
  mirror: boolean;
  puddle: PuddleShape;
  edgeZ: number;
  pose: NapkinPose;
}

export const Napkin = ({ look, message, mirror, puddle, edgeZ, pose }: NapkinProps) => {
  useCanvasFont(`800 64px "${roundedFont}"`, roundedFontReady);
  const grid = useMemo(() => buildGrid(look), [look]);
  const arrivals = useMemo(() => {
    const values = new Float32Array(grid.count);
    for (let index = 0; index < grid.count; index++) {
      const [x, z] = localToWorld(look, grid.local[index * 2] ?? 0, grid.local[index * 2 + 1] ?? 0);
      values[index] = wickArrival(puddleDistance(puddle, x, z), x, z, look.coverage);
    }
    return values;
  }, [grid, look, puddle]);
  const field = useMemo(
    () =>
      halfFloatField(FIELD_SIZE, (u, v) => {
        const [x, z] = localToWorld(look, (u - 0.5) * look.size, (0.5 - v) * look.size);
        return wickArrival(puddleDistance(puddle, x, z), x, z, look.coverage);
      }),
    [look, puddle],
  );
  const weave = useCanvasTexture(
    CLOTH_CANVAS.width,
    CLOTH_CANVAS.height,
    (context) => drawClothWeave(context, look.paper),
    look.paper,
  );
  const text = useCanvasTexture(
    MESSAGE_CANVAS,
    MESSAGE_CANVAS,
    (context) => drawMessage(context, message, roundedFont, mirror),
    `${JSON.stringify(message)}:${mirror}`,
  );
  const uniforms = useMemo<NapkinUniforms>(
    () => ({
      uField: { value: field },
      uText: { value: text },
      uSoak: { value: 0 },
      uWet: { value: new THREE.Color() },
      uPaper: { value: new THREE.Color() },
      uInk: { value: new THREE.Color() },
      uStrength: { value: 1 },
    }),
    [field, text],
  );
  const material = useMemo(() => createNapkinMaterial(weave, uniforms), [weave, uniforms]);
  material.bumpScale = look.emboss * 100;
  uniforms.uSoak.value = pose.soak;
  uniforms.uWet.value.set(look.wet);
  uniforms.uPaper.value.set(look.paper);
  uniforms.uInk.value.set(message.ink);
  uniforms.uStrength.value = message.strength;

  const fall = 1 - pose.drop;
  const settle = THREE.MathUtils.smoothstep(pose.drop, 0.72, 1);
  const rigid = new THREE.Matrix4().compose(
    new THREE.Vector3(look.x - fall * 0.6, 0.03 + fall * fall * 2.8, look.z - fall * 0.5),
    new THREE.Quaternion().setFromEuler(
      new THREE.Euler(fall * 0.3, look.turn + fall * 0.5, -fall * 0.18, 'YXZ'),
    ),
    new THREE.Vector3(1, 1, 1),
  );
  const position = grid.geometry.getAttribute('position') as THREE.BufferAttribute;
  const point = new THREE.Vector3();
  for (let index = 0; index < grid.count; index++) {
    const lx = grid.local[index * 2] ?? 0;
    const lz = grid.local[index * 2 + 1] ?? 0;
    const flutter =
      (Math.sin(lx * 2.1 + pose.frame * 0.3) * 0.2 +
        Math.sin(lz * 2.6 + pose.frame * 0.24 + 1.3) * 0.14) *
        fall +
      (lx * lx + lz * lz) * 0.09 * fall;
    point.set(lx, flutter, lz).applyMatrix4(rigid);
    const [x, z] = localToWorld(look, lx, lz);
    const wet = THREE.MathUtils.smoothstep(
      pose.soak,
      arrivals[index] ?? 0,
      (arrivals[index] ?? 0) + 0.12,
    );
    const rest = Math.max(0.012, restShape(look, lx, lz) * (1 - wet * 0.6)) + drape(z, edgeZ);
    position.setXYZ(
      index,
      THREE.MathUtils.lerp(point.x, x, settle),
      THREE.MathUtils.lerp(point.y, rest, settle),
      THREE.MathUtils.lerp(point.z, z, settle),
    );
  }
  position.needsUpdate = true;
  grid.geometry.computeVertexNormals();
  grid.geometry.computeBoundingSphere();
  if (pose.drop <= 0) {
    return null;
  }
  return <mesh geometry={grid.geometry} material={material} castShadow receiveShadow />;
};
