import * as THREE from 'three';

const VERTEX = `
varying vec2 vUv;
varying float vWorldY;
void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldY = world.y;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FRAGMENT = `
uniform sampler2D map;
uniform float opacity;
uniform float slitY;
uniform float feather;
varying vec2 vUv;
varying float vWorldY;
void main() {
  vec4 texel = texture2D(map, vUv);
  float reveal = feather > 0.0 ? smoothstep(slitY, slitY + feather, vWorldY) : step(slitY, vWorldY);
  gl_FragColor = vec4(texel.rgb, texel.a * opacity * reveal);
  #include <colorspace_fragment>
}
`;

export interface SlitMaterial {
  material: THREE.ShaderMaterial;
  opacity: THREE.IUniform<number>;
  slitY: THREE.IUniform<number>;
  feather: THREE.IUniform<number>;
}

export const slitMaterial = (map: THREE.Texture): SlitMaterial => {
  const opacity = { value: 1 };
  const slitY = { value: 0 };
  const feather = { value: 0 };
  const material = new THREE.ShaderMaterial({
    uniforms: { map: { value: map }, opacity, slitY, feather },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  return { material, opacity, slitY, feather };
};

export const updateSlit = (
  slit: SlitMaterial,
  values: { opacity: number; slitY: number; feather: number },
): void => {
  slit.opacity.value = values.opacity;
  slit.slitY.value = values.slitY;
  slit.feather.value = values.feather;
};
