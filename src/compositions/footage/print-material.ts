import * as THREE from 'three';

export type PrintMaterialOptions = {
  planes: THREE.Plane[];
  plate: THREE.Texture;
  width: number;
  height: number;
  stampShare: number;
};

const VERTEX_HEAD = `
uniform vec2 plateSize;
uniform float stampShare;
varying vec2 vPlateUv;
`;

const VERTEX_BODY = `
vPlateUv = vec2(
  (position.x + plateSize.x * 0.5) / plateSize.x,
  stampShare + (position.y + plateSize.y * 0.5) / plateSize.y * (1.0 - stampShare)
);
`;

const FRAGMENT_HEAD = `
uniform sampler2D plateMap;
uniform float shading;
uniform float paperWhite;
uniform vec2 keyChroma;
uniform float keyReach;
uniform float grainSeed;
uniform float grainAmount;
varying vec2 vPlateUv;
`;

const FRAGMENT_BODY = `
vec3 plate = texture2D(plateMap, vPlateUv).rgb;
float brightest = max(plate.r, max(plate.g, plate.b));
float darkest = min(plate.r, min(plate.g, plate.b));
float tint = (brightest - darkest) / max(brightest, 0.001);
float warm = step(plate.b, plate.g) * step(plate.g, plate.r);
float hue = (plate.g - plate.b) / max(plate.r - plate.b, 0.001);
float skin = warm * smoothstep(0.3, 0.42, tint) * (1.0 - smoothstep(0.6, 0.85, hue)) * smoothstep(0.03, 0.08, brightest);
float keep = 1.0 - skin;
if (keyReach > 0.0) {
  vec2 chroma = plate.rg / max(plate.r + plate.g + plate.b, 0.001);
  keep = (1.0 - smoothstep(keyReach, keyReach * 1.8, distance(chroma, keyChroma))) * smoothstep(0.02, 0.06, brightest);
}
diffuseColor.a *= keep;
outgoingLight *= mix(1.0, clamp(brightest / paperWhite, 0.0, 1.15), shading);
float grain = fract(sin(dot(gl_FragCoord.xy + grainSeed, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
outgoingLight += grain * grainAmount;
`;

export const createPrintMaterial = ({
  planes,
  plate,
  width,
  height,
  stampShare,
}: PrintMaterialOptions) => {
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    toneMapped: false,
    depthTest: false,
    clippingPlanes: planes,
  });
  const uniforms = {
    plateMap: { value: plate },
    plateSize: { value: new THREE.Vector2(width, height) },
    stampShare: { value: stampShare },
    shading: { value: 1 },
    paperWhite: { value: 0.74 },
    keyChroma: { value: new THREE.Vector2(0.333, 0.333) },
    keyReach: { value: 0 },
    grainSeed: { value: 0 },
    grainAmount: { value: 0.035 },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = `${VERTEX_HEAD}${shader.vertexShader}`.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\n${VERTEX_BODY}`,
    );
    shader.fragmentShader = `${FRAGMENT_HEAD}${shader.fragmentShader}`.replace(
      '#include <opaque_fragment>',
      `${FRAGMENT_BODY}\n#include <opaque_fragment>`,
    );
  };
  return { material, uniforms };
};
