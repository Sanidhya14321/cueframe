import { useMemo } from 'react';
import * as THREE from 'three';
import type { UnveilSky } from '@/schemas';
import { sunDirection } from './sky';

const VERTEX = `
varying vec3 vDirection;
void main() {
  vDirection = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT = `
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uHaze;
uniform vec3 uSun;
varying vec3 vDirection;

void main() {
  vec3 direction = normalize(vDirection);
  float height = max(direction.y, 0.0);
  vec3 color = mix(uHorizon, uZenith, pow(height, 0.45));
  float toward = max(dot(direction, normalize(uSun)), 0.0);
  color += vec3(1.0, 0.94, 0.82) * (pow(toward, 8.0) * 0.18 + pow(toward, 200.0) * 0.6);
  color = mix(uHaze, color, smoothstep(-0.01, 0.12, direction.y));
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;

export const VisibleSky = ({ sky }: { sky: UnveilSky }) => {
  const { material, uniforms } = useMemo(() => {
    const values = {
      uZenith: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
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
        uniforms: values,
      }),
    };
  }, []);
  uniforms.uZenith.value.set(sky.zenith);
  uniforms.uHorizon.value.set(sky.horizon);
  uniforms.uHaze.value.set(sky.haze);
  uniforms.uSun.value.set(...sunDirection(sky));
  return (
    <mesh material={material} renderOrder={-2} frustumCulled={false}>
      <sphereGeometry args={[1700, 64, 32]} />
    </mesh>
  );
};
