import { useMemo } from 'react';
import * as THREE from 'three';
import { halfFloatField, type PuddleShape, puddleDistance } from './field';

const FIELD_SIZE = 384;
const LIFT = 0.003;

export interface PuddleBounds {
  centerX: number;
  centerZ: number;
  size: number;
}

const puddleBounds = (shape: PuddleShape): PuddleBounds => {
  const reach = Math.max(shape.length, shape.width) * 1.9 + 0.6;
  const cos = Math.cos(shape.angle);
  const sin = Math.sin(shape.angle);
  const middle = shape.length * (shape.lead * 2 - 1) * 0.5;
  return {
    centerX: shape.originX + cos * middle,
    centerZ: shape.originZ + sin * middle,
    size: reach * 2,
  };
};

interface PuddleUniforms {
  uField: { value: THREE.DataTexture };
  uReach: { value: number };
  uTexel: { value: number };
  uAlpha: { value: number };
  uSize: { value: number };
}

const createPuddleMaterial = (field: THREE.DataTexture, size: number) => {
  const uniforms: PuddleUniforms = {
    uField: { value: field },
    uReach: { value: 0 },
    uTexel: { value: 1.5 / FIELD_SIZE },
    uAlpha: { value: 0.3 },
    uSize: { value: size },
  };
  const material = new THREE.MeshPhysicalMaterial({
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -4,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    ior: 1.33,
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
uniform float uReach;
uniform float uTexel;
uniform float uAlpha;
uniform float uSize;
float spillDepth(vec2 uv) {
  float distanceToFront = uReach - texture2D(uField, uv).r;
  return smoothstep(0.0, 0.2, distanceToFront);
}`,
      )
      .replace(
        '#include <clearcoat_normal_fragment_maps>',
        `#include <clearcoat_normal_fragment_maps>
float slopeX = spillDepth(vSpillUv + vec2(uTexel, 0.0)) - spillDepth(vSpillUv - vec2(uTexel, 0.0));
float slopeY = spillDepth(vSpillUv + vec2(0.0, uTexel)) - spillDepth(vSpillUv - vec2(0.0, uTexel));
float meniscus = 0.01 / (uTexel * uSize);
vec3 tangentNormal = normalize(vec3(-slopeX * meniscus, -slopeY * meniscus, 1.0));
vec3 worldNormal = vec3(tangentNormal.x, tangentNormal.z, -tangentNormal.y);
normal = normalize((viewMatrix * vec4(worldNormal, 0.0)).xyz);
clearcoatNormal = normal;`,
      )
      .replace(
        '#include <opaque_fragment>',
        `float coverage = smoothstep(0.0, 0.012, uReach - texture2D(uField, vSpillUv).r);
float grazing = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 4.0);
vec3 sheen = (reflectedLight.directSpecular + reflectedLight.indirectSpecular + clearcoatSpecularIndirect + clearcoatSpecularDirect) * 2.2 + vec3(0.86, 0.9, 0.88) * grazing * 0.9;
float shine = dot(sheen, vec3(0.299, 0.587, 0.114));
outgoingLight = diffuseColor.rgb * 0.18 + sheen;
diffuseColor.a = coverage * clamp(uAlpha + shine, 0.0, 1.0);
#include <opaque_fragment>`,
      );
  };
  return { material, uniforms };
};

export interface PuddleProps {
  shape: PuddleShape;
  reach: number;
  tint: string;
  opacity: number;
  gloss: number;
}

export const Puddle = ({ shape, reach, tint, opacity, gloss }: PuddleProps) => {
  const bounds = useMemo(() => puddleBounds(shape), [shape]);
  const water = useMemo(() => {
    const field = halfFloatField(FIELD_SIZE, (u, v) =>
      puddleDistance(
        shape,
        bounds.centerX + (u - 0.5) * bounds.size,
        bounds.centerZ - (v - 0.5) * bounds.size,
      ),
    );
    return createPuddleMaterial(field, bounds.size);
  }, [shape, bounds]);
  water.uniforms.uReach.value = reach;
  water.uniforms.uAlpha.value = opacity;
  water.material.color.set(tint);
  water.material.roughness = 0.5 - gloss * 0.48;
  if (reach <= 0) {
    return null;
  }
  return (
    <mesh
      position={[bounds.centerX, LIFT, bounds.centerZ]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={water.material}
      receiveShadow
    >
      <planeGeometry args={[bounds.size, bounds.size]} />
    </mesh>
  );
};
