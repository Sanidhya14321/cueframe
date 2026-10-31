import { useMemo } from 'react';
import * as THREE from 'three';
import type { ReaderWorld } from '@/schemas';

const VERTEX = `
varying vec3 vDirection;
void main() {
  vDirection = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT = `
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uGlow;
uniform vec3 uHaze;
uniform vec3 uSun;
varying vec3 vDirection;

void main() {
  vec3 direction = normalize(vDirection);
  float height = max(direction.y, 0.0);
  vec3 color = mix(uHorizon, uTop, pow(height, 0.55));
  float toward = max(dot(direction, uSun), 0.0);
  color = mix(color, uGlow, pow(toward, 1.6) * 0.35 + pow(toward, 8.0) * 0.3 + pow(toward, 40.0) * 0.3);
  color += uGlow * pow(toward, 1400.0) * 0.35;
  color = mix(uHaze, color, smoothstep(-0.02, 0.05, direction.y));
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;

export const sunDirection = (world: ReaderWorld): THREE.Vector3 =>
  new THREE.Vector3(
    Math.sin(world.sunAzimuth),
    world.sunHeight,
    -Math.cos(world.sunAzimuth),
  ).normalize();

export const SkyDome = ({ world }: { world: ReaderWorld }) => {
  const { material, uniforms } = useMemo(() => {
    const values = {
      uTop: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uGlow: { value: new THREE.Color() },
      uHaze: { value: new THREE.Color() },
      uSun: { value: new THREE.Vector3() },
    };
    return {
      uniforms: values,
      material: new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        side: THREE.BackSide,
        depthWrite: false,
        toneMapped: false,
        fog: false,
        uniforms: values,
      }),
    };
  }, []);
  uniforms.uTop.value.set(world.skyTop);
  uniforms.uHorizon.value.set(world.skyHorizon);
  uniforms.uGlow.value.set(world.sunGlow);
  uniforms.uHaze.value.set(world.haze);
  uniforms.uSun.value.copy(sunDirection(world));
  return (
    <mesh material={material} renderOrder={-2} frustumCulled={false}>
      <sphereGeometry args={[4500, 64, 32]} />
    </mesh>
  );
};
