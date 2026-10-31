import { useMemo } from 'react';
import * as THREE from 'three';

const VERTEX = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vUv = uv;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalMatrix * normal;
  vView = -viewPosition.xyz;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const FRAGMENT = `
uniform sampler2D map;
uniform float opacity;
uniform float dim;
uniform float edgeFade;
uniform float slotWeights[MAX_SLOTS];
uniform int slotCount;
uniform float slotOffset;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec4 texel = texture2D(map, vUv);
  float facing = abs(dot(normalize(vNormal), normalize(vView)));
  float edge = mix(1.0, smoothstep(0.3, 0.82, facing), edgeFade);
  float slot = 1.0;
  if (slotCount > 0) {
    int index = int(floor(fract(vUv.x - slotOffset) * float(slotCount)));
    slot = slotWeights[clamp(index, 0, MAX_SLOTS - 1)];
  }
  gl_FragColor = vec4(texel.rgb * dim, texel.a) * opacity * edge * slot;
}
`;

const MAX_SLOTS = 12;

const createInkMaterial = (map: THREE.Texture, side: THREE.Side): THREE.ShaderMaterial =>
  new THREE.ShaderMaterial({
    uniforms: {
      map: { value: map },
      opacity: { value: 1 },
      dim: { value: 1 },
      edgeFade: { value: 0 },
      slotWeights: { value: new Array<number>(MAX_SLOTS).fill(1) },
      slotCount: { value: 0 },
      slotOffset: { value: 0 },
    },
    defines: { MAX_SLOTS },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    side,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  });

export const useInkMaterial = (
  map: THREE.Texture,
  opacity: number,
  {
    side = THREE.FrontSide,
    dim = 1,
    edgeFade = 0,
    slots = [],
    slotOffset = 0,
  }: {
    side?: THREE.Side;
    dim?: number;
    edgeFade?: number;
    slots?: number[];
    slotOffset?: number;
  } = {},
): THREE.ShaderMaterial => {
  const material = useMemo(() => createInkMaterial(map, side), [map, side]);
  const uniforms = material.uniforms as Record<
    'opacity' | 'dim' | 'edgeFade' | 'slotCount' | 'slotOffset',
    { value: number }
  > & { slotWeights: { value: number[] } };
  uniforms.opacity.value = opacity;
  uniforms.dim.value = dim;
  uniforms.edgeFade.value = edgeFade;
  uniforms.slotCount.value = Math.min(MAX_SLOTS, slots.length);
  uniforms.slotOffset.value = slotOffset;
  uniforms.slotWeights.value = Array.from({ length: MAX_SLOTS }, (_, index) => slots[index] ?? 1);
  return material;
};
