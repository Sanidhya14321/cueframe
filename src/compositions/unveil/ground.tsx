import { useMemo } from 'react';
import * as THREE from 'three';
import type { UnveilGround } from '@/schemas';

export const ROAD_X = 15;
export const ROAD_HALF = 11.6;

const SURFACE = `
float groundHash(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}

float groundNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(groundHash(i), groundHash(i + vec2(1.0, 0.0)), u.x),
             mix(groundHash(i + vec2(0.0, 1.0)), groundHash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float groundFbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    total += groundNoise(p) * amplitude;
    p *= 2.03;
    amplitude *= 0.5;
  }
  return total;
}

float stripe(float value, float center, float halfWidth, float blur) {
  return 1.0 - smoothstep(halfWidth, halfWidth + blur, abs(value - center));
}

vec4 groundSurface(vec3 world) {
  float blur = 0.03 + length(world - cameraPosition) * 0.0012;
  float meadow = groundFbm(world.xz * 0.035);
  float clumps = groundFbm(world.xz * 0.6);
  vec3 dry = mix(uVerge, vec3(0.42, 0.38, 0.22), 0.65);
  vec3 grass = mix(uVerge, dry, smoothstep(0.35, 0.75, meadow)) * (0.72 + clumps * 0.5);
  float side = abs(world.x - uRoadX);
  float dirt = smoothstep(14.5, 11.8, side) * smoothstep(0.4, 0.7, groundNoise(world.xz * 0.12));
  grass = mix(grass, vec3(0.36, 0.31, 0.24), dirt * 0.7);
  float road = (1.0 - smoothstep(ROAD_HALF, ROAD_HALF + blur * 4.0, side)) * uShowRoad;
  float grain = groundNoise(world.xz * 3.1) * 0.5 + groundNoise(world.xz * 11.0) * 0.5;
  float lane = mod(side - 0.6, 3.6);
  float wheel = stripe(lane, 0.9, 0.35, 0.4) + stripe(lane, 2.7, 0.35, 0.4);
  vec3 asphalt = uRoad * (0.78 + grain * 0.32 + groundFbm(world.xz * 0.08) * 0.25);
  asphalt *= 1.0 - wheel * 0.12 * step(0.6, side);
  float dashes = step(fract(world.z / 12.0), 0.25);
  float paint = stripe(side, 4.2, 0.07, blur) * dashes + stripe(side, 7.8, 0.07, blur) * dashes;
  paint += stripe(side, 11.2, 0.1, blur) + stripe(side, 0.95, 0.1, blur);
  float wear = smoothstep(0.25, 0.65, groundNoise(world.xz * vec2(1.6, 0.4)));
  paint = clamp(paint, 0.0, 1.0) * (0.55 + wear * 0.45) * step(0.6, side);
  vec3 surface = mix(asphalt, vec3(0.82, 0.82, 0.78), paint);
  vec3 median = vec3(0.55, 0.54, 0.5) * (0.85 + grain * 0.2);
  surface = mix(surface, median, 1.0 - smoothstep(0.6, 0.6 + blur, side));
  return vec4(mix(grass, surface, road), mix(1.0, 0.9 - paint * 0.2, road));
}
`;

const FRAGMENT_HEADER = `#include <common>
#define ROAD_HALF ${ROAD_HALF.toFixed(2)}
varying vec3 vGroundWorld;
uniform vec3 uRoad;
uniform vec3 uVerge;
uniform float uRoadX;
uniform float uShowRoad;
${SURFACE}`;

const useGroundMaterial = (ground: UnveilGround) => {
  const { material, uniforms } = useMemo(() => {
    const values = {
      uRoad: { value: new THREE.Color() },
      uVerge: { value: new THREE.Color() },
      uRoadX: { value: ROAD_X },
      uShowRoad: { value: 1 },
    };
    const standard = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 });
    standard.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, values);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vGroundWorld;')
        .replace(
          '#include <worldpos_vertex>',
          '#include <worldpos_vertex>\nvGroundWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;',
        );
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', FRAGMENT_HEADER)
        .replace(
          '#include <color_fragment>',
          '#include <color_fragment>\nvec4 groundSample = groundSurface(vGroundWorld);\ndiffuseColor.rgb = groundSample.rgb;',
        )
        .replace(
          '#include <roughnessmap_fragment>',
          '#include <roughnessmap_fragment>\nroughnessFactor = groundSample.a;',
        );
    };
    standard.customProgramCacheKey = () => 'unveil-ground';
    return { material: standard, uniforms: values };
  }, []);
  uniforms.uRoad.value.set(ground.road);
  uniforms.uVerge.value.set(ground.verge);
  uniforms.uShowRoad.value = ground.showRoad ? 1 : 0;
  return material;
};

export const Ground = ({ ground }: { ground: UnveilGround }) => {
  const material = useGroundMaterial(ground);
  return (
    <mesh material={material} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[4000, 4000, 1, 1]} />
    </mesh>
  );
};
