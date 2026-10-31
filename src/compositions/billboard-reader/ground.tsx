import { useMemo } from 'react';
import * as THREE from 'three';
import type { ReaderWorld } from '@/schemas';
import { ROAD, SHORE_GLSL } from './layout';
import { sunDirection } from './sky';

const VERTEX = `
varying vec3 vWorld;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FRAGMENT = `
uniform vec3 uSea;
uniform vec3 uFoam;
uniform vec3 uSand;
uniform vec3 uRoad;
uniform vec3 uLand;
uniform vec3 uFoliage;
uniform vec3 uWalls;
uniform vec3 uGlow;
uniform vec3 uHorizon;
uniform vec3 uHaze;
uniform vec3 uSun;
uniform float uTime;
uniform float uDensity;
uniform float uYaw;
varying vec3 vWorld;

${SHORE_GLSL}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    total += noise(p) * amplitude;
    p = p * 2.03 + vec2(1.7, 9.2);
    amplitude *= 0.5;
  }
  return total;
}

vec3 seaColor(vec2 p, float off, vec3 view) {
  float swell = fbm(p * vec2(0.03, 0.01) + vec2(uTime * 0.002, 0.0));
  float ripple = noise(p * vec2(0.09, 0.05) + vec2(uTime * 0.02, uTime * 0.006));
  vec3 normal = normalize(vec3((swell - 0.5) * 0.3 + (ripple - 0.5) * 0.06, 1.0, (ripple - 0.5) * 0.08));
  vec3 reflected = reflect(view, normal);
  float fresnel = pow(1.0 - max(dot(-view, normal), 0.0), 3.0);
  vec3 sky = mix(uHorizon, uGlow, pow(max(dot(reflected, uSun), 0.0), 4.0));
  vec3 color = mix(uSea, sky, 0.18 + fresnel * 0.65);
  color += uGlow * pow(max(dot(reflected, uSun), 0.0), 120.0) * 0.8;
  float phase = off * 0.24 + uTime * 0.07 + fbm(p * vec2(0.01, 0.02)) * 4.0;
  float local = mod(phase - 1.5708, 6.2832);
  float surf = smoothstep(260.0, 10.0, off);
  float broken = smoothstep(0.25, 0.65, fbm(p * vec2(0.04, 0.012) + vec2(0.0, uTime * 0.004)));
  float crest = smoothstep(0.35, 0.0, abs(local - 0.2)) * surf * mix(0.45, 1.0, broken);
  float trail = exp(-local * 1.6) * fbm(p * vec2(0.3, 0.08)) * surf * 0.7;
  float swash = smoothstep(9.0, 0.0, off) * (0.55 + 0.45 * fbm(p * 0.3 + uTime * 0.01));
  float foam = clamp(crest * 0.9 + trail + swash, 0.0, 1.0);
  return mix(color, uFoam, foam);
}

vec3 roadColor(float d, float z, vec2 p) {
  vec3 color = uRoad * (0.92 + 0.16 * fbm(p * 0.4));
  float dash = step(fract(z / 9.0), 0.45);
  float center = smoothstep(0.22, 0.1, abs(d - 38.0));
  float lanes = (smoothstep(0.14, 0.05, abs(d - 34.0)) + smoothstep(0.14, 0.05, abs(d - 42.0))) * dash;
  float edges = smoothstep(0.14, 0.05, abs(d - 30.6)) + smoothstep(0.14, 0.05, abs(d - 45.4));
  return mix(color, vec3(0.86, 0.84, 0.8), clamp(center + lanes + edges, 0.0, 1.0) * 0.8);
}

vec3 cityColor(float d, vec2 p) {
  vec2 cell = vec2(d - ${ROAD.city.toFixed(1)}, p.y);
  vec2 block = fract(cell / vec2(46.0, 62.0));
  vec2 id = floor(cell / vec2(46.0, 62.0));
  float street = step(block.x, 0.14) + step(block.y, 0.12);
  float lot = hash(id);
  vec3 color = mix(uLand, uFoliage, smoothstep(0.35, 0.75, fbm(p * 0.06 + lot * 9.0)));
  color = mix(color, uWalls * 0.75, step(0.7, lot) * 0.6);
  return mix(color, uRoad * 1.1, clamp(street, 0.0, 1.0));
}

void main() {
  float c = cos(uYaw);
  float s = sin(uYaw);
  vec2 p = vec2(vWorld.x * c - vWorld.z * s, vWorld.x * s + vWorld.z * c);
  float d = p.x - shoreX(p.y);
  vec3 view = normalize(vWorld - cameraPosition);
  vec3 color;
  float grit = fbm(p * 0.8);
  if (d < 0.0) {
    color = seaColor(p, -d, view);
  } else if (d < 4.0) {
    color = mix(uSand * 0.72, uSand, smoothstep(0.0, 4.0, d)) * (0.9 + 0.2 * grit);
  } else if (d < ${ROAD.rocks.toFixed(1)} - 4.0) {
    color = uSand * (0.95 + 0.15 * grit);
  } else if (d < ${ROAD.rocks.toFixed(1)}) {
    color = mix(vec3(0.24, 0.22, 0.2), vec3(0.45, 0.4, 0.34), noise(p * 1.6));
  } else if (d < ${ROAD.roadNear.toFixed(1)}) {
    float tiles = smoothstep(0.04, 0.0, abs(fract(p.y / 6.0) - 0.5) - 0.46);
    color = mix(uWalls * 0.82, uSand * 0.9, 0.35 + 0.3 * grit) * (1.0 - tiles * 0.08);
  } else if (d < ${ROAD.roadFar.toFixed(1)}) {
    color = roadColor(d, p.y, p);
  } else if (d < ${ROAD.city.toFixed(1)}) {
    color = uWalls * (0.78 + 0.1 * grit);
  } else {
    color = cityColor(d, p);
  }
  float distance = length(vWorld - cameraPosition);
  float haze = 1.0 - exp(-pow(distance * uDensity, 1.35));
  gl_FragColor = vec4(mix(color, uHaze, clamp(haze, 0.0, 1.0)), 1.0);
  #include <colorspace_fragment>
}
`;

export const hazeDensity = (world: ReaderWorld): number => world.hazeDensity * 0.0009;

export const Ground = ({ world, frame }: { world: ReaderWorld; frame: number }) => {
  const { material, uniforms } = useMemo(() => {
    const values = {
      uSea: { value: new THREE.Color() },
      uFoam: { value: new THREE.Color() },
      uSand: { value: new THREE.Color() },
      uRoad: { value: new THREE.Color() },
      uLand: { value: new THREE.Color() },
      uFoliage: { value: new THREE.Color() },
      uWalls: { value: new THREE.Color() },
      uGlow: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uHaze: { value: new THREE.Color() },
      uSun: { value: new THREE.Vector3() },
      uTime: { value: 0 },
      uDensity: { value: 0 },
      uYaw: { value: 0 },
    };
    return {
      uniforms: values,
      material: new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms: values,
        fog: false,
        toneMapped: false,
      }),
    };
  }, []);
  uniforms.uSea.value.set(world.sea);
  uniforms.uFoam.value.set(world.foam);
  uniforms.uSand.value.set(world.sand);
  uniforms.uRoad.value.set(world.road);
  uniforms.uLand.value.set(world.land);
  uniforms.uFoliage.value.set(world.foliage);
  uniforms.uWalls.value.set(world.walls);
  uniforms.uGlow.value.set(world.sunGlow);
  uniforms.uHorizon.value.set(world.skyHorizon);
  uniforms.uHaze.value.set(world.haze);
  uniforms.uSun.value.copy(sunDirection(world));
  uniforms.uTime.value = frame * world.waveSpeed;
  uniforms.uDensity.value = hazeDensity(world);
  uniforms.uYaw.value = world.coastAngle;
  return (
    <mesh
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, -1500]}
      receiveShadow
    >
      <planeGeometry args={[9000, 9000]} />
    </mesh>
  );
};
