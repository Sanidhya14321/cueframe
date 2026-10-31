import { useMemo } from 'react';
import * as THREE from 'three';
import { Sky as Atmosphere } from 'three/examples/jsm/objects/Sky.js';
import type { UnveilSky } from '@/schemas';
import type { Vec3 } from './flight';

const SUN_DEPTH = 0.68;

export const sunDirection = (sky: UnveilSky): Vec3 => [sky.sunSide, sky.sunHeight, SUN_DEPTH];

const CLOUD_VERTEX = `
varying vec3 vDirection;
void main() {
  vDirection = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const CLOUD_FRAGMENT = `
uniform vec3 uSun;
uniform vec3 uHaze;
uniform vec3 uShade;
uniform float uCover;
uniform float uTime;
varying vec3 vDirection;

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
  for (int i = 0; i < 7; i++) {
    total += noise(p) * amplitude;
    p = p * 2.07 + vec2(1.7, 9.2);
    amplitude *= 0.5;
  }
  return total;
}

float density(vec2 p) {
  vec2 warp = vec2(fbm(p * 0.6), fbm(p * 0.6 + 5.2));
  float shape = fbm(p * 1.6 + warp * 1.8);
  float threshold = 0.74 - uCover * 0.38;
  return smoothstep(threshold, threshold + 0.09, shape);
}

void main() {
  vec3 direction = normalize(vDirection);
  if (direction.y <= 0.005) {
    discard;
  }
  vec2 layer = direction.xz / (direction.y + 0.05) * 1.9 + vec2(uTime * 0.0021, uTime * 0.0005);
  float body = density(layer);
  if (body < 0.002) {
    discard;
  }
  vec2 toward = normalize(uSun.xz + vec2(1e-4)) * 0.045;
  float occlusion = 0.0;
  for (int i = 1; i <= 4; i++) {
    occlusion += density(layer + toward * float(i));
  }
  float light = exp(-occlusion * 0.75);
  float rim = smoothstep(0.0, 0.5, body) * (1.0 - smoothstep(0.5, 1.0, body));
  vec3 lit = vec3(1.05, 1.02, 0.97);
  vec3 color = mix(uShade, lit, clamp(light * 1.15 + rim * 0.35, 0.0, 1.0));
  float horizon = smoothstep(0.0, 0.2, direction.y);
  color = mix(uHaze, color, horizon);
  gl_FragColor = vec4(color * 1.6, body * horizon * 0.96);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const configureAtmosphere = (atmosphere: Atmosphere, sky: UnveilSky): void => {
  const uniforms = (atmosphere.material as THREE.ShaderMaterial).uniforms;
  const set = (name: string, value: number) => {
    const uniform = uniforms[name];
    if (uniform !== undefined) {
      uniform.value = value;
    }
  };
  set('turbidity', sky.turbidity);
  set('rayleigh', sky.rayleigh);
  set('mieCoefficient', 0.0022);
  set('mieDirectionalG', 0.82);
  const sunName = 'sunPosition';
  uniforms[sunName]?.value.set(...sunDirection(sky));
};

export const SkyDome = ({ sky }: { sky: UnveilSky }) => {
  const atmosphere = useMemo(() => {
    const dome = new Atmosphere();
    dome.scale.setScalar(1800);
    return dome;
  }, []);
  configureAtmosphere(atmosphere, sky);
  return <primitive object={atmosphere} />;
};

export const Clouds = ({ sky, frame }: { sky: UnveilSky; frame: number }) => {
  const { material, uniforms } = useMemo(() => {
    const values = {
      uSun: { value: new THREE.Vector3() },
      uHaze: { value: new THREE.Color() },
      uShade: { value: new THREE.Color() },
      uCover: { value: 0 },
      uTime: { value: 0 },
    };
    return {
      uniforms: values,
      material: new THREE.ShaderMaterial({
        vertexShader: CLOUD_VERTEX,
        fragmentShader: CLOUD_FRAGMENT,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        uniforms: values,
      }),
    };
  }, []);
  uniforms.uSun.value.set(...sunDirection(sky)).normalize();
  uniforms.uHaze.value.set(sky.haze);
  uniforms.uShade.value.set(sky.cloudShade);
  uniforms.uCover.value = sky.clouds;
  uniforms.uTime.value = frame * sky.cloudDrift;
  return (
    <mesh material={material} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[1500, 64, 32]} />
    </mesh>
  );
};
