import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
varying float vHeight;
void main() {
  vUv = uv;
  vHeight = (modelMatrix * vec4(position, 1.0)).y;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vView = -viewPosition.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewPosition;
}
`;

const fragmentShader = `
uniform vec3 color;
uniform float opacity;
uniform float softness;
uniform float floorFade;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vView;
varying float vHeight;
void main() {
  float along = 1.0 - vUv.y;
  float facing = abs(dot(normalize(vNormal), normalize(vView)));
  float edge = pow(facing, softness);
  float fall = pow(1.0 - along, 1.8) * smoothstep(0.0, 0.12, along) * smoothstep(0.0, floorFade, vHeight);
  gl_FragColor = vec4(color * edge * fall * opacity, 1.0);
}
`;

export const createBeamMaterial = (): THREE.ShaderMaterial =>
  new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color('#ffffff') },
      opacity: { value: 1 },
      softness: { value: 1.5 },
      floorFade: { value: 0.2 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

export const updateBeamMaterial = (
  material: THREE.ShaderMaterial,
  color: string,
  opacity: number,
  softness: number,
): void => {
  const uniforms = material.uniforms as {
    color: { value: THREE.Color };
    opacity: { value: number };
    softness: { value: number };
  };
  uniforms.color.value.set(color);
  uniforms.opacity.value = opacity;
  uniforms.softness.value = softness;
};
